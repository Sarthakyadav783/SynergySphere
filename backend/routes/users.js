const express = require('express');
const router = express.Router();
const { getMany } = require('../config/database');

// Get all users (for task assignment dropdown)
router.get('/', async (req, res) => {
  try {
    const users = await getMany(`
      SELECT id, first_name, last_name, email, created_at
      FROM users 
      ORDER BY first_name ASC
    `);
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific user
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getMany('SELECT id, first_name, last_name, email FROM users WHERE id = ?', [id]);
    
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
