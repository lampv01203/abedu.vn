// backend/routes/students.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/students', async (req, res) => {
  try {
    const [students] = await db.query(`
      SELECT 
        student_id,
        full_name, 
        birthday, 
        phone, 
        facebook, 
        department, 
        note 
      FROM students
    `);
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
