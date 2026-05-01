import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function seed() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'burnit_db'
    });

    console.log('Connected to database. Checking columns...');

    const cols = ['duration', 'includes', 'image'];
    for (const col of cols) {
      try { await connection.query(`ALTER TABLE courses ADD COLUMN ${col} VARCHAR(500)`); } catch (e) {}
    }
    try { await connection.query(`ALTER TABLE courses MODIFY COLUMN includes TEXT`); } catch (e) {}
    try { await connection.query(`ALTER TABLE courses ADD COLUMN recommended BOOLEAN DEFAULT false`); } catch (e) {}

    console.log('Inserting default courses if they do not exist...');

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
      const [existing] = await connection.query('SELECT id FROM courses WHERE title = ?', [prog.title]);
      if (existing.length === 0) {
        await connection.query(
          'INSERT INTO courses (title, description, duration, includes, image, recommended) VALUES (?, ?, ?, ?, ?, ?)',
          [prog.title, prog.description, prog.duration, prog.includes, prog.image, prog.recommended]
        );
        console.log(`Inserted: ${prog.title}`);
      } else {
        console.log(`Skipped (already exists): ${prog.title}`);
      }
    }

    console.log('Seed completed successfully!');
  } catch (err) {
    console.error('Seed failed:', err.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seed();
