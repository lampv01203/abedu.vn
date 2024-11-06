const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Department = require("../models/Department");
const { Op } = require("sequelize");
const checkAuth = require("./auth"); // Import hàm checkAuth từ auth.js
const UserRole = require('../models/UserRole');

// Route để lấy danh sách học sinh
router.get("/students", checkAuth, async (req, res) => {
  try {
    const user = req.session.user;

    const paramClassId = req.query.class_id;
    const paramLevelId = req.query.level_id;
    const paramDepartmentId = req.query.department_id;

    const userDepartmentId = user.department_id;

    const students = await Student.sequelize.query(
      `
        SELECT 
            s.student_id, 
            s.full_name, 
            s.birthday, 
            s.phone,
            s.facebook,
            d.department_code, 
            s.note
        FROM 
            students s
        INNER JOIN 
            class_students cs ON s.student_id = cs.student_id
        INNER JOIN 
            level l ON cs.level_id = l.level_id
        LEFT JOIN 
            department d ON s.department_id = d.department_id
        WHERE 
            s.del_flg = 0
            AND (:userDepartmentId = 1 OR s.department_id = :userDepartmentId)
            AND cs.del_flg = 0
            AND cs.queue_flag = 1
            AND (cs.class_id is NULL OR (:paramClassId is not NULL AND cs.class_id = :paramClassId))
            AND l.del_flg = 0
            AND l.level_id = :paramLevelId
            AND (:paramDepartmentId = 1 OR s.department_id = :paramDepartmentId)
        ORDER BY 
            s.full_name;
      `,
      {
        replacements: {
          userDepartmentId,
          paramClassId,
          paramLevelId,
          paramDepartmentId,
        },
        type: Student.sequelize.QueryTypes.SELECT,
      }
    );
    res.json(students);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách học sinh theo cấp độ:", error);
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi lấy danh sách học sinh theo cấp độ" });
  }
});

// Route để lấy danh sách học sinh
router.get("/getStudents", checkAuth, async (req, res) => {
  try {
    const whereClause = {}
    const user = req.session.user;
    if (user.role !== UserRole.SYSTEM && user.role !== UserRole.ADMIN) {
      whereClause = { department_id: user.department_id };
    }

    const students = await Student.findAll({
      where: whereClause,
      include: [
        {
          model: Department,
          attributes: ["department_code"], // Chọn trường cần thiết từ bảng Department
        },
      ],
    });

    res.json(students);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách học sinh:", error);
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi lấy danh sách học sinh" });
  }
});

// Route để thêm học sinh mới
router.post("/addStudent", checkAuth, async (req, res) => {
  try {
    const { full_name, birthday, phone, facebook, department_id, note } =
      req.body;

    // Kiểm tra các trường bắt buộc
    if (!full_name) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    // Kiểm tra xem học sinh đã tồn tại hay chưa
    const existingStudent = await Student.findOne({
      where: {
        full_name,
        birthday,
        phone,
        del_flg: 0, // Kiểm tra chỉ với những giáo viên chưa bị xóa
      },
    });

    if (existingStudent) {
      return res.status(400).json({
        message: `Học sinh ${full_name} đã được đăng ký`,
      });
    }

    const student = await Student.create({
      full_name,
      birthday,
      phone,
      facebook,
      department_id,
      note,
    });

    res.status(201).json({
      message: "Học sinh đã được thêm thành công",
      student_id: student.student_id,
    });
  } catch (error) {
    console.error("Lỗi thêm học sinh:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi thêm học sinh" });
  }
});

// Route để lấy thông tin học sinh theo ID
router.get("/getStudent/:id", checkAuth, async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [
        {
          model: Department,
          attributes: ["department_code"],
        },
      ],
    });
    if (!student) return res.status(404).send("Học sinh không tồn tại.");
    res.json(student);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin học sinh:", error);
    res.status(500).send("Lỗi server.");
  }
});

// Route để cập nhật thông tin học sinh
router.put("/updateStudent/:id", checkAuth, async (req, res) => {
  try {
    const { full_name, birthday, phone, facebook, department_id, note } =
      req.body;

    const studentData = req.body; // Nhận object student từ frontend
    const studentId = req.params.id;
    console.log(studentId);

    // Kiểm tra xem học sinh có tồn tại không
    const existingStudent = await Student.findByPk(studentId);
    if (!existingStudent) {
      return res.status(404).send("Học sinh không tồn tại.");
    }

    // Kiểm tra xem có học sinh nào khác trùng thông tin không
    const duplicateStudent = await Student.findOne({
      where: {
        full_name: studentData.full_name,
        birthday: studentData.birthday,
        phone: studentData.phone,
        student_id: { [Op.ne]: studentId }, // Không tính học sinh hiện tại
      },
    });

    if (duplicateStudent) {
      return res.status(400).json({
        message: `Học sinh ${studentData.full_name} đã bị cập nhầm trùng thông tin với học sinh khác`,
      });
    }
    // Cập nhật thông tin học sinh
    await existingStudent.update(studentData);

    res.status(200).json({ message: "Cập nhật thông tin học sinh thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật học sinh:", error);
    res.status(500).send("Lỗi server.");
  }
});

// Route để xóa học sinh
router.delete("/deleteStudent/:id", checkAuth, async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student)
      return res.status(404).json({ message: "Học sinh không tồn tại" });

    // Đánh dấu học sinh là đã xóa
    await student.update({ del_flg: 1 }); // Đánh dấu trường del_flg là 1

    res.status(200).json({ message: "Học sinh đã bị xóa" });
  } catch (error) {
    console.error("Lỗi khi xóa học sinh", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Trong routes hoặc controller của bạn
router.get('/getStudentClassAttend/:studentId/:classId', async (req, res) => {
  const { studentId, classId } = req.params;
  try {
    const attendData = await Student.sequelize.query(`
      SELECT 
          sa.id,
          cs.day_of_week,
          sa.attend_date,
          cs.start_time,
          cs.end_time,
          sa.attend_flg
        FROM 
          student_attend sa
        INNER JOIN 
          class_schedule cs ON sa.schedule_id = cs.schedule_id
        WHERE
          cs.del_flg = 0
          AND sa.class_id = :classId
          AND sa.student_id = :studentId
      `,
      {
        replacements: {
          studentId,
          classId
        },
        type: Student.sequelize.QueryTypes.SELECT,
      }
    );
    res.json(attendData);
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    res.status(500).send("Error fetching attendance data");
  }
});

module.exports = router;
