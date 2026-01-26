import express from 'express';
import { db } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all social links (public)
router.get('/', (req, res) => {
  try {
    const links = db.prepare('SELECT * FROM socialLinks ORDER BY displayOrder ASC').all();
    res.json(links);
  } catch (error) {
    console.error('Get social links error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create social link (admin only)
router.post('/', authenticateToken, (req, res) => {
  try {
    const { platform, url } = req.body;
    
    if (!platform || !url) {
      return res.status(400).json({ error: 'Platform and URL are required' });
    }

    const maxOrder = db.prepare('SELECT MAX(displayOrder) as max FROM socialLinks').get();
    const displayOrder = (maxOrder?.max || 0) + 1;

    const result = db.prepare(`
      INSERT INTO socialLinks (platform, url, displayOrder)
      VALUES (?, ?, ?)
    `).run(platform, url, displayOrder);
    
    const link = db.prepare('SELECT * FROM socialLinks WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(link);
  } catch (error) {
    console.error('Create social link error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update social link (admin only)
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { platform, url, displayOrder } = req.body;
    
    db.prepare(`
      UPDATE socialLinks SET 
        platform = COALESCE(?, platform),
        url = COALESCE(?, url),
        displayOrder = COALESCE(?, displayOrder)
      WHERE id = ?
    `).run(platform, url, displayOrder, req.params.id);
    
    const link = db.prepare('SELECT * FROM socialLinks WHERE id = ?').get(req.params.id);
    if (!link) {
      return res.status(404).json({ error: 'Social link not found' });
    }
    res.json(link);
  } catch (error) {
    console.error('Update social link error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete social link (admin only)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM socialLinks WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Social link not found' });
    }
    res.json({ message: 'Social link deleted successfully' });
  } catch (error) {
    console.error('Delete social link error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
