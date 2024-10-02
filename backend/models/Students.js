const express = require('express');
const router = express.Router();
const db = require('../models/db');

// API to get students
router.get('/students', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        full_name, 
        birthday, 
        phone, 
        facebook, 
        department, 
        note 
      FROM students
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students' });
  }
});

module.exports = router;
