import express from 'express';
import { db } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all experience (public)
router.get('/', (req, res) => {
  try {
    const experience = db.prepare('SELECT * FROM experience ORDER BY displayOrder ASC').all();
    const parsed = experience.map(e => ({
      ...e,
      current: Boolean(e.current)
    }));
    res.json(parsed);
  } catch (error) {
    console.error('Get experience error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create experience (admin only)
router.post('/', authenticateToken, (req, res) => {
  try {
    const { company, position, startDate, endDate, description, current } = req.body;
    
    if (!company || !position) {
      return res.status(400).json({ error: 'Company and position are required' });
    }

    const maxOrder = db.prepare('SELECT MAX(displayOrder) as max FROM experience').get();
    const displayOrder = (maxOrder?.max || 0) + 1;

    const result = db.prepare(`
      INSERT INTO experience (company, position, startDate, endDate, description, current, displayOrder)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(company, position, startDate, endDate, description, current ? 1 : 0, displayOrder);
    
    const exp = db.prepare('SELECT * FROM experience WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({
      ...exp,
      current: Boolean(exp.current)
    });
  } catch (error) {
    console.error('Create experience error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update experience (admin only)
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { company, position, startDate, endDate, description, current, displayOrder } = req.body;
    
    db.prepare(`
      UPDATE experience SET 
        company = COALESCE(?, company),
        position = COALESCE(?, position),
        startDate = COALESCE(?, startDate),
        endDate = COALESCE(?, endDate),
        description = COALESCE(?, description),
        current = COALESCE(?, current),
        displayOrder = COALESCE(?, displayOrder)
      WHERE id = ?
    `).run(company, position, startDate, endDate, description, current !== undefined ? (current ? 1 : 0) : null, displayOrder, req.params.id);
    
    const exp = db.prepare('SELECT * FROM experience WHERE id = ?').get(req.params.id);
    if (!exp) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    res.json({
      ...exp,
      current: Boolean(exp.current)
    });
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete experience (admin only)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM experience WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
