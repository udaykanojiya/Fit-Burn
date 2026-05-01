import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import pool from './config/db.js';
import { verifyToken, isAdmin } from './middleware/auth.js';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static('uploads'));

// ==========================================
// PHASE 3: AUTHENTICATION SYSTEM
// ==========================================

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (!user.is_active) {
      return res.status(403).json({ message: 'Account is deactivated. Contact admin.' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Google Login
app.post('/api/auth/google', async (req, res) => {
  try {
    const { token: googleToken } = req.body;
    
    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const { email, name, picture } = ticket.getPayload();
    
    // Check if user exists in our database (Authorized email only)
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];
    
    if (!user) {
      return res.status(403).json({ 
        message: 'This email is not authorized to access this platform. Please contact the administrator.' 
      });
    }
    
    if (!user.is_active) {
      return res.status(403).json({ message: 'Account is deactivated. Contact admin.' });
    }
    
    // Generate our own JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Google login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
    
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ message: 'Invalid Google token' });
  }
});

// ==========================================
// PHASE 4: ADMIN FEATURES
// ==========================================

// Add User
app.post('/api/admin/add-user', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;
    
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'User already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    
    res.status(201).json({ message: 'User created successfully', userId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get All Users
app.get('/api/admin/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Activate / Deactivate User
app.patch('/api/admin/user-status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { userId, isActive } = req.body;
    await pool.query('UPDATE users SET is_active = ? WHERE id = ?', [isActive, userId]);
    res.json({ message: 'User status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create Course
app.post('/api/admin/courses', verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, description, duration, includes, image, recommended } = req.body;
    let includesStr = includes;
    if (Array.isArray(includes)) {
      includesStr = JSON.stringify(includes);
    }
    const [result] = await pool.query(
        'INSERT INTO courses (title, description, duration, includes, image, recommended) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, duration, includesStr, image, recommended === true]
    );
    res.status(201).json({ message: 'Course created', courseId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
});

// Delete Course
app.delete('/api/admin/courses/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    // Also remove from user_courses to avoid foreign key issues (or if ON DELETE CASCADE is not set)
    await pool.query('DELETE FROM user_courses WHERE course_id = ?', [id]);
    await pool.query('DELETE FROM courses WHERE id = ?', [id]);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
});

// Update Course
app.put('/api/admin/courses/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, description, duration, includes, image, recommended } = req.body;
  try {
    const includesStr = Array.isArray(includes) ? JSON.stringify(includes) : includes;
    await pool.query(
      'UPDATE courses SET title = ?, description = ?, duration = ?, includes = ?, image = ?, recommended = ? WHERE id = ?',
      [title, description, duration, includesStr, image, recommended === true, id]
    );
    res.json({ message: 'Course updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
});

// Get all courses (Public or Auth, making it public for Programs page)
app.get('/api/courses', async (req, res) => {
  try {
    const [courses] = await pool.query('SELECT * FROM courses ORDER BY created_at DESC');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Assign Course to User
app.post('/api/admin/assign-course', verifyToken, isAdmin, async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    
    // Check if already assigned
    const [existing] = await pool.query('SELECT id FROM user_courses WHERE user_id = ? AND course_id = ?', [userId, courseId]);
    if (existing.length > 0) return res.status(400).json({ message: 'Course already assigned to this user' });
    
    await pool.query('INSERT INTO user_courses (user_id, course_id) VALUES (?, ?)', [userId, courseId]);
    res.json({ message: 'Course assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Assignments
app.get('/api/admin/assignments', verifyToken, isAdmin, async (req, res) => {
  try {
    const [assignments] = await pool.query(`
      SELECT uc.user_id as userId, uc.course_id as courseId, uc.assigned_at as assignedAt,
             u.name as userName, u.email as userEmail,
             c.title as courseTitle
      FROM user_courses uc
      JOIN users u ON uc.user_id = u.id
      JOIN courses c ON uc.course_id = c.id
      ORDER BY uc.assigned_at DESC
    `);
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove Assignment
app.delete('/api/admin/assignments/:userId/:courseId', verifyToken, isAdmin, async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    await pool.query('DELETE FROM user_courses WHERE user_id = ? AND course_id = ?', [userId, courseId]);
    res.json({ message: 'Assignment removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Auto-seed endpoint
app.get('/api/seed', async (req, res) => {
  try {
    // 1. Ensure columns exist
    const cols = ['duration', 'includes', 'image'];
    for (const col of cols) {
      try { await pool.query(`ALTER TABLE courses ADD COLUMN ${col} VARCHAR(500)`); } catch (e) { /* Ignore if exists */ }
    }
    // Convert columns to support larger data (like Base64 images)
    try { await pool.query(`ALTER TABLE courses MODIFY COLUMN includes LONGTEXT`); } catch (e) {}
    try { await pool.query(`ALTER TABLE courses MODIFY COLUMN image LONGTEXT`); } catch (e) {}
    try { await pool.query(`ALTER TABLE courses ADD COLUMN recommended BOOLEAN DEFAULT false`); } catch (e) {}

    // 2. Insert defaults if they don't exist
    const defaultCourses = [
      {
        title: "21-Day Fat Burn Challenge",
        description: "Our most popular program. Kickstart your metabolism with quick, highly effective daily home workouts.",
        duration: "21 Days",
        includes: JSON.stringify(["Daily video workouts", "Custom diet plan PDF", "Progress tracker", "WhatsApp Community"]),
        image: "https://cdn.muscleandstrength.com/sites/default/files/fit_woman_doing_dumbbell_workout.jpg",
        recommended: true
      },
      {
        title: "30-Day Weight Loss Program",
        description: "A comprehensive weight loss journey combining steady cardio, strength work, and strict nutrition.",
        duration: "30 Days",
        includes: JSON.stringify(["Full body routines", "Macro-counted meal plans", "Weekly weigh-ins", "Trainer access"]),
        image: "https://cdn.prod.website-files.com/670657a27b5f7c81337bec48/6883ac9fecd54067b741f39d_Copy%20of%20WEGLOW_2025_SARAHELLENTREACHER-001976-2.jpeg",
        recommended: false
      },
      {
        title: "Postpartum Recovery",
        description: "Safely heal your core and rebuild your strength step-by-step after childbirth.",
        duration: "8 Weeks",
        includes: JSON.stringify(["Diastasis Recti safe", "Pelvic floor focus", "Nutrition for nursing moms", "Trainer support"]),
        image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=600&q=80",
        recommended: false
      },
      {
        title: "Advanced Fat Burn Program",
        description: "Hit a plateau? Shock your system with this advanced protocol containing heavy HIIT.",
        duration: "45 Days",
        includes: JSON.stringify(["Advanced HIIT videos", "Carb cycling diet", "Community access"]),
        image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
        recommended: false
      }
    ];

    for (const prog of defaultCourses) {
      const [existing] = await pool.query('SELECT id FROM courses WHERE title = ?', [prog.title]);
      if (existing.length === 0) {
        await pool.query(
          'INSERT INTO courses (title, description, duration, includes, image, recommended) VALUES (?, ?, ?, ?, ?, ?)',
          [prog.title, prog.description, prog.duration, prog.includes, prog.image, prog.recommended]
        );
      }
    }
    
    res.json({ message: 'Database seeded successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Seed failed', error: err.message });
  }
});

// Add Module
app.post('/api/admin/module', verifyToken, isAdmin, async (req, res) => {
  try {
    const { courseId, title } = req.body;
    const [result] = await pool.query('INSERT INTO modules (course_id, title) VALUES (?, ?)', [courseId, title]);
    res.status(201).json({ message: 'Module added', moduleId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add Video
app.post('/api/admin/video', verifyToken, isAdmin, async (req, res) => {
  try {
    const { moduleId, title, videoUrl, orderIndex = 0 } = req.body;
    const [result] = await pool.query(
      'INSERT INTO videos (module_id, title, video_url, order_index) VALUES (?, ?, ?, ?)',
      [moduleId, title, videoUrl, orderIndex]
    );
    res.status(201).json({ message: 'Video added', videoId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ==========================================
// PHASE 5: USER FEATURES
// ==========================================

// Get My Courses
app.get('/api/user/courses', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [courses] = await pool.query(`
      SELECT c.* FROM courses c
      JOIN user_courses uc ON c.id = uc.course_id
      WHERE uc.user_id = ?
    `, [userId]);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Course Details (modules + videos)
app.get('/api/user/course/:id', verifyToken, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;
    
    // Admin can view any course, but User must be assigned
    if (req.user.role !== 'admin') {
      const [assigned] = await pool.query('SELECT id FROM user_courses WHERE user_id = ? AND course_id = ?', [userId, courseId]);
      if (assigned.length === 0) {
        return res.status(403).json({ message: 'You do not have access to this course' });
      }
    }
    
    const [course] = await pool.query('SELECT * FROM courses WHERE id = ?', [courseId]);
    if (course.length === 0) return res.status(404).json({ message: 'Course not found' });
    
    const [modules] = await pool.query('SELECT * FROM modules WHERE course_id = ? ORDER BY id ASC', [courseId]);
    
    // Fetch videos for all modules
    for (let mod of modules) {
      const [videos] = await pool.query('SELECT * FROM videos WHERE module_id = ? ORDER BY order_index ASC', [mod.id]);
      mod.videos = videos;
    }
    
    res.json({
      ...course[0],
      modules
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark Video Complete (Placeholder for future)
app.post('/api/user/progress', verifyToken, async (req, res) => {
  res.json({ message: 'Progress saved successfully' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
