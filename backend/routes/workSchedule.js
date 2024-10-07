const express = require('express');
const router = express.Router();
const Classes = require('../models/Classes');
const checkAuth = require('./auth'); // Import hàm checkAuth từ auth.js

router.get('/classes', checkAuth, async (req, res) => {
  try {
    const classData = await Classes.getAllClasses();
    
    // Xử lý để trả về đúng format JSON
    const data = classData.reduce((acc, curr) => {
      let sessionObj = acc.find(item => item.weekday === curr.weekday && item.session === curr.session);
      
      if (!sessionObj) {
        sessionObj = {
          weekday: curr.weekday,
          session: curr.session,
          classes: []
        };
        acc.push(sessionObj);
      }
      
      sessionObj.classes.push({
        className: curr.className,
        level: curr.level,
        totalStudent: curr.totalStudent,
        students: curr.students,
        teacher: curr.teacher,
        note: curr.note
      });
      
      return acc;
    }, []);

    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
