import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../data/portfolio.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('journal_mode = WAL');

// Initialize database schema
const initDatabase = () => {
  // Users table (admin)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Profile table
  db.exec(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT DEFAULT 'Your Name',
      title TEXT DEFAULT 'Full Stack Developer',
      bio TEXT DEFAULT 'A passionate developer creating amazing web experiences.',
      avatar TEXT,
      email TEXT DEFAULT 'hello@example.com',
      phone TEXT,
      location TEXT DEFAULT 'New York, USA',
      resumeUrl TEXT,
      heroTagline TEXT DEFAULT 'Building the future, one line of code at a time.',
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Skills table
  db.exec(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT DEFAULT 'other',
      proficiency INTEGER DEFAULT 80,
      icon TEXT,
      displayOrder INTEGER DEFAULT 0
    )
  `);

  // Projects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      image TEXT,
      technologies TEXT DEFAULT '[]',
      liveUrl TEXT,
      githubUrl TEXT,
      featured INTEGER DEFAULT 0,
      displayOrder INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Experience table
  db.exec(`
    CREATE TABLE IF NOT EXISTS experience (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      position TEXT NOT NULL,
      startDate TEXT,
      endDate TEXT,
      description TEXT,
      current INTEGER DEFAULT 0,
      displayOrder INTEGER DEFAULT 0
    )
  `);

  // Social links table
  db.exec(`
    CREATE TABLE IF NOT EXISTS socialLinks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL,
      url TEXT NOT NULL,
      displayOrder INTEGER DEFAULT 0
    )
  `);

  // Contact messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed default admin user if not exists
  const adminExists = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run('admin', hashedPassword);
    console.log('Default admin user created (username: admin, password: admin123)');
  }

  // Seed default profile if not exists
  const profileExists = db.prepare('SELECT id FROM profile').get();
  if (!profileExists) {
    db.prepare('INSERT INTO profile (name) VALUES (?)').run('Your Name');
    console.log('Default profile created');
  }

  console.log('Database initialized successfully');
};

export { db, initDatabase };
