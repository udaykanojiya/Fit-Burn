import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function updateDB() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'burnit_db'
    });

    console.log('Updating courses table...');
    
    // Add columns if they don't exist
    try {
      await connection.query(`ALTER TABLE courses ADD COLUMN duration VARCHAR(255)`);
    } catch (e) {
      console.log('Column duration already exists or error:', e.message);
    }
    
    try {
      await connection.query(`ALTER TABLE courses ADD COLUMN includes TEXT`);
    } catch (e) {
      console.log('Column includes already exists or error:', e.message);
    }

    try {
      await connection.query(`ALTER TABLE courses ADD COLUMN price VARCHAR(255)`);
    } catch (e) {
      console.log('Column price already exists or error:', e.message);
    }

    try {
      await connection.query(`ALTER TABLE courses ADD COLUMN image VARCHAR(500)`);
    } catch (e) {
      console.log('Column image already exists or error:', e.message);
    }

    // Insert initial data if table is empty
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM courses');
    if (rows[0].count === 0) {
      console.log('Inserting default courses...');
      const programsData = [
        {
          title: "21-Day Fat Burn Challenge",
          description: "Our most popular program. Kickstart your metabolism with quick, highly effective daily home workouts.",
          duration: "21 Days",
          includes: JSON.stringify(["Daily video workouts", "Custom diet plan PDF", "Progress tracker", "WhatsApp Community"]),
          price: "₹1,499",
          image: "https://cdn.muscleandstrength.com/sites/default/files/fit_woman_doing_dumbbell_workout.jpg"
        },
        {
          title: "30-Day Weight Loss Program",
          description: "A comprehensive weight loss journey combining steady cardio, strength work, and strict nutrition.",
          duration: "30 Days",
          includes: JSON.stringify(["Full body routines", "Macro-counted meal plans", "Weekly weigh-ins", "Trainer access"]),
          price: "₹1,999",
          image: "https://cdn.prod.website-files.com/670657a27b5f7c81337bec48/6883ac9fecd54067b741f39d_Copy%20of%20WEGLOW_2025_SARAHELLENTREACHER-001976-2.jpeg"
        },
        {
          title: "Postpartum Recovery",
          description: "Safely heal your core and rebuild your strength step-by-step after childbirth.",
          duration: "8 Weeks",
          includes: JSON.stringify(["Diastasis Recti safe", "Pelvic floor focus", "Nutrition for nursing moms", "Trainer support"]),
          price: "₹2,499",
          image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=600&q=80"
        },
        {
          title: "Advanced Fat Burn Program",
          description: "Hit a plateau? Shock your system with this advanced protocol containing heavy HIIT.",
          duration: "45 Days",
          includes: JSON.stringify(["Advanced HIIT videos", "Carb cycling diet", "Community access"]),
          price: "₹2,099",
          image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80"
        }
      ];

      for (const prog of programsData) {
        await connection.query(
          'INSERT INTO courses (title, description, duration, includes, price, image) VALUES (?, ?, ?, ?, ?, ?)',
          [prog.title, prog.description, prog.duration, prog.includes, prog.price, prog.image]
        );
      }
      console.log('Inserted default courses.');
    } else {
        console.log("Courses already exist. Skipping insert.");
    }

    console.log('Database update completed successfully!');
  } catch (error) {
    console.error('Error updating database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

updateDB();
