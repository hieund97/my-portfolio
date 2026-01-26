import axios from 'axios';

const router = express.Router();

// Submit contact message (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message, _h_, turnstileToken } = req.body;
    
    // 1. Honeypot check
    if (_h_) {
      console.warn('Spam detected: Honeypot filled');
      return res.status(400).json({ error: 'Spam detected' });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // 2. Turnstile verification
    if (!turnstileToken) {
      return res.status(400).json({ error: 'Security verification required' });
    }

    try {
      const turnstileRes = await axios.post(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          secret: process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA', // Using testing key as default
          response: turnstileToken,
          remoteip: req.ip,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (!turnstileRes.data.success) {
        return res.status(400).json({ error: 'Security verification failed' });
      }
    } catch (err) {
      console.error('Turnstile verification error:', err);
      // Fail open in case of network error to Cloudflare, or handle strictly?
      // For now, fail closed for security.
      return res.status(400).json({ error: 'Security verification failed' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const result = db.prepare(`
      INSERT INTO messages (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `).run(name, email, subject, message);
    
    res.status(201).json({ 
      message: 'Message sent successfully',
      id: result.lastInsertRowid 
    });
  } catch (error) {
    console.error('Submit message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all messages (admin only)
router.get('/', authenticateToken, (req, res) => {
  try {
    const messages = db.prepare('SELECT * FROM messages ORDER BY createdAt DESC').all();
    const parsed = messages.map(m => ({
      ...m,
      read: Boolean(m.read)
    }));
    res.json(parsed);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get unread count (admin only)
router.get('/unread/count', authenticateToken, (req, res) => {
  try {
    const result = db.prepare('SELECT COUNT(*) as count FROM messages WHERE read = 0').get();
    res.json({ count: result.count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark message as read (admin only)
router.put('/:id/read', authenticateToken, (req, res) => {
  try {
    db.prepare('UPDATE messages SET read = 1 WHERE id = ?').run(req.params.id);
    
    const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({
      ...message,
      read: true
    });
  } catch (error) {
    console.error('Mark message read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete message (admin only)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM messages WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
