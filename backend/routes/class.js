// backend/routes/class.js
const express = require("express");
const router = express.Router();
const Class = require("../models/Classes");
const Teacher = require("../models/Teacher");
const Level = require("../models/Level");
const Department = require("../models/Department");
const WorkingDay = require("../models/WorkingDay");
const checkAuth = require("./auth"); // Import hàm checkAuth từ auth.js
const db = require("../config/db");
const wd = require("../models/WorkingDay"); // Import Sequelize model

// API lấy thông tin cấp độ theo ID
router.get("/getWorkingDay/:id", async (req, res) => {
  try {
    const workingDay = await wd.findByPk(req.params.id);
    if (!workingDay) {
      return res.status(404).json({ message: "Working Day không tồn tại" });
    }
    res.json(workingDay);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin Working Day", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.get("/workingDays", checkAuth, async (req, res) => {
  try {
    const day_of_week = await WorkingDay.findAll({
      attributes: ["day_of_week"],
    });
    res.json(day_of_week);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/classTeacher/:id", checkAuth, async (req, res) => {
  try {
    console.log(req.params.id)
    const paramClassId = req.params.id
    const classTeacher = await Class.sequelize.query(`
      SELECT 
            t.teacher_id,
            t.full_name
        FROM 
          class_teacher ct
        INNER JOIN 
          teacher t ON ct.teacher_id = t.teacher_id
        WHERE
          ct.del_flg = 0
          AND t.del_flg = 0
          AND ct.class_id = :paramClassId
      `,
      {
        replacements: {
          paramClassId
        },
        type: Class.sequelize.QueryTypes.SELECT,
      }
    );
    res.json(classTeacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/classStudent/:id", checkAuth, async (req, res) => {
  try {
    console.log(req.params.id)
    const paramClassId = req.params.id
    const classStudent = await Class.sequelize.query(`
      SELECT 
            s.student_id,
            s.full_name
        FROM 
          class_students cs
        INNER JOIN
          students s ON cs.student_id = s.student_id
        WHERE
          cs.del_flg = 0
          AND s.del_flg = 0
          AND cs.class_id = :paramClassId
      `,
      {
        replacements: {
          paramClassId
        },
        type: Class.sequelize.QueryTypes.SELECT,
      }
    );
    res.json(classStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/classSchedule/:id", checkAuth, async (req, res) => {
  try {
    console.log(req.params.id)
    const paramClassId = req.params.id
    const classSchedule = await Class.sequelize.query(`
      SELECT
          wd.schedule_id, 
          wd.day_of_week, 
          wd.start_time, 
          wd.end_time,
          wd.is_temporary
        FROM 
          class_schedule wd
        INNER JOIN
          class c ON wd.class_id = c.class_id
        WHERE
          c.del_flg = 0
          AND wd.del_flg = 0
          AND c.class_id = :paramClassId
      `,
      {
        replacements: {
          paramClassId
        },
        type: Class.sequelize.QueryTypes.SELECT,
      }
    );
    res.json(classSchedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/classWeeklySchedule", checkAuth, async (req, res) => {
  try {
    // const paramDate = req.query.date; // Ngày được truyền từ client (ví dụ: '2024-10-09')
    const paramdepartmentId = req.query.departmentId; // Department được truyền từ client

    // if (!paramDate) {
    //   return res.status(400).json({ message: "Thiếu tham số ngày (date)" });
    // }
    // Truy vấn danh sách lớp học
    const classData = await Class.sequelize.query(
      `
        SELECT 
            c.class_id,
            wd.schedule_id, 
            wd.working_day_id, 
            wd.start_time, 
            wd.end_time,
            wd.is_temporary,
            c.class_name, 
            l.level_code AS level,
            teachers.teachers, 
            c.Start_date,
            c.End_date,
            c.note, 
            COUNT(cs.student_id) AS totalStudent,
            GROUP_CONCAT(DISTINCT s.full_name ORDER BY s.student_id SEPARATOR ', ') AS students
        FROM 
            class c
        INNER JOIN 
            class_schedule wd ON c.class_id = wd.class_id
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
            AND wd.del_flg = 0
            AND (:paramdepartmentId = 1 OR c.department_id = :paramdepartmentId)
        GROUP BY 
            wd.working_day_id, wd.schedule_id, wd.start_time, wd.end_time, wd.is_temporary, c.class_id, c.class_name, l.level_code, teachers.teachers, c.note
        ORDER BY 
            wd.working_day_id, wd.start_time, c.class_name;
      `,
      {
        replacements: {
          // paramDate,
          paramdepartmentId,
        },
        type: Class.sequelize.QueryTypes.SELECT,
      }
    );

    // // Xử lý để trả về đúng format JSON
    // const data = classData.reduce((acc, curr) => {
    //   let sessionObj = acc.find(
    //     (item) =>
    //       item.day_of_week === curr.day_of_week &&
    //       item.start_time === curr.start_time &&
    //       item.end_time === curr.end_time
    //   );

    //   if (!sessionObj) {
    //     sessionObj = {
    //       day_of_week: curr.day_of_week,
    //       start_time: curr.start_time,
    //       end_time: curr.end_time,
    //       classes: [],
    //     };
    //     acc.push(sessionObj);
    //   }

    //   sessionObj.classes.push({
    //     className: curr.className,
    //     level: curr.level,
    //     totalStudent: curr.totalStudent,
    //     students: curr.students,
    //     teachers: curr.teachers,
    //     note: curr.note,
    //   });

    //   return acc;
    // }, []);

    res.json(classData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Route để lấy danh sách các lớp học
router.get("/getClasses", checkAuth, async (req, res) => {
  try {
    const user = req.session.user;

    // Lọc theo department_id nếu không phải là admin
    const condition =
      user.department_id !== 1 ? { department_id: user.department_id } : {};

    const classes = await Class.findAll({
      where: {
        del_flg: 0,
        ...condition, // Thêm điều kiện vào truy vấn
      },
      include: [
        {
          model: Department,
          attributes: ["department_code"], // Chỉ lấy department_code
        },
        {
          model: Level,
          attributes: ["level_code"], // Lấy level_code từ bảng Level
        },
      ],
    });

    res.json(classes);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách lớp học", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Route để lấy thông tin lớp học theo ID
router.get("/getClass/:id", checkAuth, async (req, res) => {
  try {
    console.log(req.params)
    const classInfo = await Class.findOne({
      where: {
        class_id: req.params.id,
        del_flg: 0, // Lọc chỉ lấy lớp chưa bị xóa
      },
      include: [
        {
          model: Department,
          attributes: ["department_code"], // Chỉ lấy department_code
        },
        {
          model: Level,
          attributes: ["level_code"], // Lấy level_code từ bảng Level
        },
      ],
    });

    if (!classInfo)
      return res.status(404).json({ message: "Lớp học không tồn tại" });

    res.json(classInfo);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin lớp học", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Route to add a new class
router.post("/addClass", async (req, res) => {
    const { class_name, level_id, department_id, start_date, end_date, note, schedules, teachers, students } = req.body;
    console.log(req.body)
    const conn = await db.getConnection();
    try {
      console.log("Start transaction")
      // Start transaction
      await conn.beginTransaction();
  
      console.log("Insert into class table")
      // Insert into class table
      const [classResult] = await conn.query(
        "INSERT INTO class (class_name, level_id, department_id, start_date, end_date, note) VALUES (?, ?, ?, ?, ?, ?)", 
        [class_name, level_id, department_id, start_date, end_date, note]
      );
      const class_id = classResult.insertId;
  
      console.log("Insert into class_schedule table")
      // Insert into class_schedule
      for (const schedule of schedules) {
        await conn.query(
          "INSERT INTO class_schedule (class_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)",
          [class_id, schedule.day_of_week, schedule.start_time, schedule.end_time]
        );
      }
  
      console.log("Insert into class_teacher table")
      // Insert into class_teacher
      for (const teacher_id of teachers) {
        await conn.query(
          "INSERT INTO class_teacher (class_id, teacher_id) VALUES (?, ?)",
          [class_id, teacher_id]
        );
      }
  
      console.log("Insert into class_students table")
      // Insert into class_students
      for (const student_id of students) {
        await conn.query(
          "INSERT INTO class_students (class_id, student_id) VALUES (?, ?)",
          [class_id, student_id]
        );
      }
  
      console.log("Commit transaction")
      // Commit transaction
      await conn.commit();
      console.log("Class added successfully!")
      res.status(201).json({ message: "Class added successfully!" });
    } catch (err) {
      // Rollback transaction in case of error
      await conn.rollback();
      res.status(500).json({ error: err.message });
    } finally {
      conn.release();
    }
  });

// Route to update an existing class
router.put("/updateClass/:class_id", async (req, res) => {
  const { class_id } = req.params;
  const { class_name, level_id, department_id, start_date, end_date, note, schedules, teachers, students } = req.body;
  
  const conn = await db.getConnection();
  try {
    console.log("Start transaction");
    // Start transaction
    await conn.beginTransaction();

    console.log("Update class table");
    // Update class table
    await conn.query(
      "UPDATE class SET class_name = ?, level_id = ?, department_id = ?, start_date = ?, end_date = ?, note = ? WHERE class_id = ?",
      [class_name, level_id, department_id, start_date, end_date, note, class_id]
    );

    console.log("Update class_schedule table");
    // Update class_schedule
    for (const schedule of schedules) {
      if (schedule.id) {
        // Update existing schedule
        await conn.query(
          "UPDATE class_schedule SET day_of_week = ?, start_time = ?, end_time = ? WHERE id = ?",
          [schedule.day_of_week, schedule.start_time, schedule.end_time, schedule.id]
        );
      } else {
        // Insert new schedule if id is null or blank
        await conn.query(
          "INSERT INTO class_schedule (class_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)",
          [class_id, schedule.day_of_week, schedule.start_time, schedule.end_time]
        );
      }
    }

    console.log("Update class_teacher table");
    // Get existing teacher_ids for the class
    const [existingTeachers] = await conn.query(
      "SELECT teacher_id FROM class_teacher WHERE class_id = ?",
      [class_id]
    );
    const existingTeacherIds = existingTeachers.map(t => t.teacher_id);

    // Delete teachers not in the new list
    const teachersToDelete = existingTeacherIds.filter(id => !teachers.includes(id));
    if (teachersToDelete.length > 0) {
      await conn.query(
        "DELETE FROM class_teacher WHERE class_id = ? AND teacher_id IN (?)",
        [class_id, teachersToDelete]
      );
    }

    // Insert new teachers
    const teachersToInsert = teachers.filter(id => !existingTeacherIds.includes(id));
    for (const teacher_id of teachersToInsert) {
      await conn.query(
        "INSERT INTO class_teacher (class_id, teacher_id) VALUES (?, ?)",
        [class_id, teacher_id]
      );
    }

    console.log("Update class_students table");
    // Get existing student_ids for the class
    const [existingStudents] = await conn.query(
      "SELECT student_id FROM class_students WHERE class_id = ?",
      [class_id]
    );
    const existingStudentIds = existingStudents.map(s => s.student_id);

    // Delete students not in the new list
    const studentsToDelete = existingStudentIds.filter(id => !students.includes(id));
    if (studentsToDelete.length > 0) {
      await conn.query(
        "DELETE FROM class_students WHERE class_id = ? AND student_id IN (?)",
        [class_id, studentsToDelete]
      );
    }

    // Insert new students
    const studentsToInsert = students.filter(id => !existingStudentIds.includes(id));
    for (const student_id of studentsToInsert) {
      await conn.query(
        "INSERT INTO class_students (class_id, student_id) VALUES (?, ?)",
        [class_id, student_id]
      );
    }

    console.log("Commit transaction");
    // Commit transaction
    await conn.commit();
    res.status(200).json({ message: "Class updated successfully!" });
  } catch (err) {
    // Rollback transaction in case of error
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// Route để xóa lớp học
router.delete("/deleteClass/:id", checkAuth, async (req, res) => {
  try {
    const classInfo = await Class.findByPk(req.params.id);

    if (!classInfo)
      return res.status(404).json({ message: "Lớp học không tồn tại" });

    // Đánh dấu lớp học là đã xóa
    await classInfo.update({ del_flg: 1 });

    res.status(200).json({ message: "Lớp học đã bị xóa" });
  } catch (error) {
    console.error("Lỗi khi xóa lớp học", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
