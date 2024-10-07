const db = require('../config/db');

const Classes = {
    getAllClasses: async () => {
      const [rows] = await db.query(`
        SELECT 
          c.weekday, 
          c.session, 
          c.class_name AS className, 
          l.level_code, 
          c.teacher, 
          c.note, 
          COUNT(cs.student_id) AS totalStudent,
          GROUP_CONCAT(s.full_name ORDER BY s.student_id SEPARATOR ', ') AS students
        FROM 
          classes c
        LEFT JOIN
          class_students cs ON c.class_id = cs.class_id
        LEFT JOIN 
          students s ON cs.student_id = s.student_id
        LEFT JOIN 
          level l ON c.level_id = l.level_id
        GROUP BY 
          c.class_id
        ORDER BY 
          c.weekday, c.session, c.class_name;
      `);
      return rows;
    }
  };
  
  module.exports = Classes;