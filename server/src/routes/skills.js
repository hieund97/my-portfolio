import express from 'express';
import { db } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all skills (public)
router.get('/', (req, res) => {
  try {
    const skills = db.prepare('SELECT * FROM skills ORDER BY displayOrder ASC').all();
    res.json(skills);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create skill (admin only)
router.post('/', authenticateToken, (req, res) => {
  try {
    const { name, category, proficiency, icon } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Skill name is required' });
    }

    const maxOrder = db.prepare('SELECT MAX(displayOrder) as max FROM skills').get();
    const displayOrder = (maxOrder?.max || 0) + 1;

    const result = db.prepare(`
      INSERT INTO skills (name, category, proficiency, icon, displayOrder)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, category || 'other', proficiency || 80, icon, displayOrder);
    
    const skill = db.prepare('SELECT * FROM skills WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(skill);
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update skill (admin only)
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { name, category, proficiency, icon, displayOrder } = req.body;
    
    db.prepare(`
      UPDATE skills SET 
        name = COALESCE(?, name),
        category = COALESCE(?, category),
        proficiency = COALESCE(?, proficiency),
        icon = COALESCE(?, icon),
        displayOrder = COALESCE(?, displayOrder)
      WHERE id = ?
    `).run(name, category, proficiency, icon, displayOrder, req.params.id);
    
    const skill = db.prepare('SELECT * FROM skills WHERE id = ?').get(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.json(skill);
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete skill (admin only)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM skills WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reorder skills (admin only)
router.put('/reorder/batch', authenticateToken, (req, res) => {
  try {
    const { items } = req.body; // Array of { id, displayOrder }
    
    const stmt = db.prepare('UPDATE skills SET displayOrder = ? WHERE id = ?');
    const transaction = db.transaction((items) => {
      for (const item of items) {
        stmt.run(item.displayOrder, item.id);
      }
    });
    
    transaction(items);
    res.json({ message: 'Skills reordered successfully' });
  } catch (error) {
    console.error('Reorder skills error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
