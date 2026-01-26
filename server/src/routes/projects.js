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

// Get all projects (public)
router.get('/', (req, res) => {
  try {
    const projects = db.prepare('SELECT * FROM projects ORDER BY displayOrder ASC').all();
    // Parse technologies JSON
    const parsed = projects.map(p => ({
      ...p,
      technologies: JSON.parse(p.technologies || '[]'),
      featured: Boolean(p.featured)
    }));
    res.json(parsed);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get featured projects (public)
router.get('/featured', (req, res) => {
  try {
    const projects = db.prepare('SELECT * FROM projects WHERE featured = 1 ORDER BY displayOrder ASC').all();
    const parsed = projects.map(p => ({
      ...p,
      technologies: JSON.parse(p.technologies || '[]'),
      featured: true
    }));
    res.json(parsed);
  } catch (error) {
    console.error('Get featured projects error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single project (public)
router.get('/:id', (req, res) => {
  try {
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({
      ...project,
      technologies: JSON.parse(project.technologies || '[]'),
      featured: Boolean(project.featured)
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create project (admin only)
router.post('/', authenticateToken, (req, res) => {
  try {
    const { title, description, technologies, liveUrl, githubUrl, featured } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Project title is required' });
    }

    const maxOrder = db.prepare('SELECT MAX(displayOrder) as max FROM projects').get();
    const displayOrder = (maxOrder?.max || 0) + 1;

    const techJson = JSON.stringify(technologies || []);
    
    const result = db.prepare(`
      INSERT INTO projects (title, description, technologies, liveUrl, githubUrl, featured, displayOrder)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(title, description, techJson, liveUrl, githubUrl, featured ? 1 : 0, displayOrder);
    
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({
      ...project,
      technologies: JSON.parse(project.technologies || '[]'),
      featured: Boolean(project.featured)
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update project (admin only)
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { title, description, technologies, liveUrl, githubUrl, featured, displayOrder } = req.body;
    
    const techJson = technologies ? JSON.stringify(technologies) : null;
    
    db.prepare(`
      UPDATE projects SET 
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        technologies = COALESCE(?, technologies),
        liveUrl = COALESCE(?, liveUrl),
        githubUrl = COALESCE(?, githubUrl),
        featured = COALESCE(?, featured),
        displayOrder = COALESCE(?, displayOrder)
      WHERE id = ?
    `).run(title, description, techJson, liveUrl, githubUrl, featured !== undefined ? (featured ? 1 : 0) : null, displayOrder, req.params.id);
    
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({
      ...project,
      technologies: JSON.parse(project.technologies || '[]'),
      featured: Boolean(project.featured)
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload project image (admin only)
router.post('/:id/image', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Delete old image if exists
    const project = db.prepare('SELECT image FROM projects WHERE id = ?').get(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    if (project.image) {
      const oldPath = path.join(__dirname, '../../uploads', project.image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Update with new image
    db.prepare('UPDATE projects SET image = ? WHERE id = ?').run(req.file.filename, req.params.id);
    
    res.json({ 
      image: req.file.filename,
      message: 'Image uploaded successfully' 
    });
  } catch (error) {
    console.error('Upload project image error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete project (admin only)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    // Delete associated image
    const project = db.prepare('SELECT image FROM projects WHERE id = ?').get(req.params.id);
    if (project?.image) {
      const imagePath = path.join(__dirname, '../../uploads', project.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    const result = db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
