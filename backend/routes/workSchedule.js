const express = require("express");
const router = express.Router();
const checkAuth = require("./auth"); // Import hàm checkAuth từ auth.js
const Classes = require("../models/Classes");

router.get("/classes", checkAuth, async (req, res) => {
  try {
    const userDepartmentId = req.session.user.department_id;
    const paramDate = req.query.date; // Ngày được truyền từ client (ví dụ: '2024-10-09')

    if (!paramDate) {
      return res.status(400).json({ message: "Thiếu tham số ngày (date)" });
    }
    console.log(paramDate);
    // Truy vấn danh sách lớp học
    const classData = await Classes.sequelize.query(`
      SELECT 
          c.weekday, 
          c.session, 
          c.class_name AS className, 
          l.level_code AS level,
          teachers.teachers, 
          c.note, 
          COUNT(cs.student_id) AS totalStudent,
          GROUP_CONCAT(DISTINCT s.full_name ORDER BY s.student_id SEPARATOR ', ') AS students
      FROM 
          classes c
      LEFT JOIN
          class_students cs ON c.class_id = cs.class_id
      LEFT JOIN 
          students s ON cs.student_id = s.student_id
      LEFT JOIN 
          level l ON c.level_id = l.level_id
      -- Truy vấn con để lấy danh sách giáo viên và sử dụng LEFT JOIN với bảng chính
      LEFT JOIN (
          SELECT 
              ct.class_id,
              GROUP_CONCAT(DISTINCT t.full_name ORDER BY t.teacher_id SEPARATOR ', ') AS teachers
          FROM
              class_teacher ct
          LEFT JOIN
              teacher t ON ct.teacher_id = t.teacher_id
          WHERE
              t.del_flg = 0
          GROUP BY
              ct.class_id
      ) AS teachers ON c.class_id = teachers.class_id
      WHERE 
          c.del_flg = 0
          AND (:userDepartmentId = 1 OR c.department_id = :userDepartmentId)
          AND c.Start_date >= DATE_SUB(:paramDate, INTERVAL WEEKDAY(:paramDate) DAY)
          AND c.Start_date < DATE_ADD(DATE_SUB(:paramDate, INTERVAL WEEKDAY(:paramDate) DAY), INTERVAL 7 DAY)
      GROUP BY 
          c.class_id, c.weekday, c.session, c.class_name, l.level_code, teachers.teachers, c.note
      ORDER BY 
          c.weekday, c.session, c.class_name;
    `,
      {
        replacements: {
          userDepartmentId,
          paramDate,
        },
        type: Classes.sequelize.QueryTypes.SELECT,
      }
    );

    // Xử lý để trả về đúng format JSON
    const data = classData.reduce((acc, curr) => {
      let sessionObj = acc.find(
        (item) => item.weekday === curr.weekday && item.session === curr.session
      );

      if (!sessionObj) {
        sessionObj = {
          weekday: curr.weekday,
          session: curr.session,
          classes: [],
        };
        acc.push(sessionObj);
      }

      sessionObj.classes.push({
        className: curr.className,
        level: curr.level,
        totalStudent: curr.totalStudent,
        students: curr.students,
        teachers: curr.teachers,
        note: curr.note,
      });

      return acc;
    }, []);

    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
