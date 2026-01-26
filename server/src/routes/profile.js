import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Get profile (public)
router.get('/', (req, res) => {
  try {
    const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get();
    res.json(profile || {});
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile (admin only)
router.put('/', authenticateToken, (req, res) => {
  try {
    const { name, title, bio, email, phone, location, resumeUrl, heroTagline } = req.body;
    
    db.prepare(`
      UPDATE profile SET 
        name = COALESCE(?, name),
        title = COALESCE(?, title),
        bio = COALESCE(?, bio),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        location = COALESCE(?, location),
        resumeUrl = COALESCE(?, resumeUrl),
        heroTagline = COALESCE(?, heroTagline),
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = 1
    `).run(name, title, bio, email, phone, location, resumeUrl, heroTagline);
    
    const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get();
    res.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload avatar (admin only)
router.post('/avatar', authenticateToken, upload.single('avatar'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Delete old avatar if exists
    const profile = db.prepare('SELECT avatar FROM profile WHERE id = 1').get();
    if (profile?.avatar) {
      const oldPath = path.join(__dirname, '../../uploads', profile.avatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Update with new avatar
    db.prepare('UPDATE profile SET avatar = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = 1')
      .run(req.file.filename);
    
    res.json({ 
      avatar: req.file.filename,
      message: 'Avatar uploaded successfully' 
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
