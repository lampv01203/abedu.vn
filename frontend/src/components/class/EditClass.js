import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import TeacherSelect from "./TeacherSelect";
import StudentSelect from "./StudentSelect";
import UserRole from '../../UserRole';

const EditClass = () => {
  const { classId } = useParams(); // Lấy classId từ URL
  const navigate = useNavigate();
  const { user } = useOutletContext(); // Lấy user từ context

  const [classData, setClassData] = useState({
    class_name: "",
    level_id: "",
    department_id: "",
    start_date: "",
    end_date: "",
    note: "",
    teachers: [],
    students: [],
    schedules: [{ id: "", day_of_week: "", start_time: "", end_time: "" }],
  });

  const [levels, setLevels] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [workingDays, setWorkingDays] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classSchedules, setClassSchedules] = useState([]);

  // Fetch levels, departments, teachers and class data for editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          classRes,
          levelRes,
          departmentRes,
          workingDayRes,
          classScheduleRes,
          teacherRes,
          classTeacherRes,
          classStudentRes,
        ] = await Promise.all([
          axios.get(`/api/getClass/${classId}`), // Fetch class data for editing
          axios.get("/api/levels"),
          axios.get("/api/departments"),
          axios.get("/api/workingDays"),
          axios.get(`/api/classSchedule/${classId}`), // Fetch class_schedule data for editing
          axios.get("/api/teachers"),
          axios.get(`/api/classTeacher/${classId}`), // Fetch class teacher data for editing
          axios.get(`/api/classStudent/${classId}`), // Fetch class student data for editing
        ]);
        setClassData({
          ...classRes.data,
          schedules: classScheduleRes.data,
          teachers: classTeacherRes.data.map((t) => t.teacher_id), // Giáo viên
          students: classStudentRes.data.map((s) => s.student_id), // Cập nhật học sinh vào classData
        });
        setLevels(levelRes.data);
        setDepartments(departmentRes.data);
        setWorkingDays(workingDayRes.data);
        setClassSchedules(classScheduleRes.data); // Set class_schedule data to form fields
        setTeachers(teacherRes.data);
        // setClassTeachers(classTeacherRes.data); // Set class_teacher data to form fields
        // setClassStudents(classStudentRes.data); // Set class_student data to form fields
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
    // Lấy thông tin người dùng từ localStorage
    if (user?.role !== UserRole.SYSTEM && user?.role !== UserRole.ADMIN) {
      setClassData((prevData) => ({
        ...prevData,
        department_id: user.department_id, // Gán department_id mặc định
      }));
    }
  }, [classId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassData({ ...classData, [name]: value });
  };

  // Handle schedule changes
  const handleScheduleChange = (index, field, value) => {
    const newSchedules = classSchedules.map((schedule, i) =>
      i === index ? { ...schedule, [field]: value } : schedule
    );
    setClassSchedules(newSchedules);
  };

  // Add a new schedule row
  const addSchedule = () => {
    setClassSchedules([
      ...classSchedules,
      { id: "", day_of_week: "", start_time: "", end_time: "" },
    ]);
  };

  // Remove schedule row
  const removeSchedule = (index) => {
    const newSchedules = classSchedules.filter((_, i) => i !== index);
    setClassSchedules(newSchedules);
  };

  // Handle teacher selection
  const setSelectedTeachers = (selectedTeachers) => {
    setClassData((prevData) => ({
      ...prevData,
      teachers: selectedTeachers,
    }));
  };

  // Định nghĩa setSelectedStudents
  const setSelectedStudents = (selectedStudents) => {
    setClassData((prevData) => ({
      ...prevData,
      students: selectedStudents,
    }));
  };

  // Handle form submission for editing class
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gửi dữ liệu classData và classSchedules về API
      await axios.put(`/api/updateClass/${classId}`, {
        ...classData,
        schedules: classSchedules,
      }); // Update class API
      navigate("/classlist"); // Navigate back to the class list page
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  return (
    <div className="card card-primary">
      <div className="card-header">
        <h3 className="card-title">Chỉnh Sửa Lớp Học</h3>
      </div>

      <form onSubmit={handleSubmit} method="POST" autoComplete="on">
        <div className="card-body w-750">
          {/* Class Name */}
          <div className="form-group row">
            <label htmlFor="class_name" className="col-sm-3 col-form-label">
              Tên Lớp Học
            </label>
            <div className="col-sm-5">
              <input
                type="text"
                className="form-control"
                id="class_name"
                name="class_name"
                value={classData.class_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Level */}
          <div className="form-group row">
            <label htmlFor="level_id" className="col-sm-3 col-form-label">
              Cấp Độ Học
            </label>
            <div className="col-sm-5">
              <select
                className="form-control"
                id="level_id"
                name="level_id"
                value={classData.level_id}
                onChange={handleChange}
                required
                autoComplete="level-id" // Thêm thuộc tính này
              >
                <option value="">Chọn Cấp Độ</option>
                {levels.map((level) => (
                  <option key={level.level_id} value={level.level_id}>
                    {level.level_code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Department */}
          <div className="form-group row">
            <label htmlFor="department_id" className="col-sm-3 col-form-label">
              Chi nhánh
            </label>
            <div className="col-sm-5">
              <select
                className="form-control"
                id="department_id"
                name="department_id"
                value={classData.department_id}
                onChange={handleChange}
                required
                autoComplete="department-id" // Thêm thuộc tính này
                disabled={
                  user?.role === UserRole.SYSTEM || user?.role === UserRole.ADMIN ? false : true
                } // Disable cho các vai trò không phải ADMIN hoặc SYSTEM
              >
                <option value="">Chọn Chi nhánh</option>
                {departments.map((department) => (
                  <option
                    key={department.department_id}
                    value={department.department_id}
                  >
                    {department.department_code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Schedules */}
          <div className="form-group row">
            <div className="col-sm-3 font-weight-bold">
              Lịch Học
            </div>
            <div className="col-sm-9">
              {classSchedules.map((schedule, index) => (
                <div key={index} className="row mb-2">
                  <div className="col-sm-3">
                    <select
                      id={`workingDays-${index}`}
                      className="form-control"
                      value={schedule.day_of_week}
                      onChange={(e) =>
                        handleScheduleChange(
                          index,
                          "day_of_week",
                          e.target.value
                        )
                      }
                      autoComplete="off" // Hoặc giá trị phù hợp khác
                      required
                    >
                      <option value="">Chọn Thứ</option>
                      {workingDays.map((day) => (
                        <option key={day.day_of_week} value={day.day_of_week}>
                          {day.day_of_week}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-sm-4">
                    <input
                      id={`startTime-${index}`}
                      type="time"
                      className="form-control"
                      value={schedule.start_time}
                      onChange={(e) =>
                        handleScheduleChange(
                          index,
                          "start_time",
                          e.target.value
                        )
                      }
                      autoComplete="start-time" // Thêm thuộc tính này
                      required
                    />
                  </div>
                  <div className="col-sm-4">
                    <input
                      type="time"
                      id={`endTime-${index}`}
                      className="form-control"
                      value={schedule.end_time}
                      onChange={(e) =>
                        handleScheduleChange(index, "end_time", e.target.value)
                      }
                      autoComplete="end-time" // Thêm thuộc tính này
                      required
                    />
                  </div>
                  <div className="col-sm-1">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeSchedule(index)}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={addSchedule}
              >
                + Thêm lịch học
              </button>
            </div>
          </div>

          {/* Start Date */}
          <div className="form-group row">
            <label htmlFor="start_date" className="col-sm-3 col-form-label">
              Ngày Bắt Đầu Học
            </label>
            <div className="col-sm-5">
              <input
                type="date"
                className="form-control"
                id="start_date"
                name="start_date"
                value={classData.start_date}
                onChange={handleChange}
                autoComplete="start-date" // Thêm thuộc tính này
              />
            </div>
          </div>

          {/* End Date */}
          <div className="form-group row">
            <label htmlFor="end_date" className="col-sm-3 col-form-label">
              Ngày Kết Khóa
            </label>
            <div className="col-sm-5">
              <input
                type="date"
                className="form-control"
                id="end_date"
                name="end_date"
                value={classData.end_date}
                onChange={handleChange}
                autoComplete="end-date" // Thêm thuộc tính này
              />
            </div>
          </div>

          {/* Note */}
          <div className="form-group row">
            <label htmlFor="note" className="col-sm-3 col-form-label">
              Ghi Chú
            </label>
            <div className="col-sm-5">
              <textarea
                className="form-control"
                id="note"
                name="note"
                value={classData.note}
                onChange={handleChange}
                autoComplete="note" // Thêm thuộc tính này
              />
            </div>
          </div>

          {/* Teacher Select */}
          <div className="form-group row">
            <label htmlFor="teachers" className="col-sm-3 col-form-label">
              Giáo viên
            </label>
            <div className="col-sm-9">
              <TeacherSelect
                teachers={teachers}
                selectedTeachers={classData.teachers} // Danh sách giáo viên đã chọn
                setSelectedTeachers={setSelectedTeachers}
              />
            </div>
          </div>
        </div>
        {/* Student Select */}
        <StudentSelect
          classId={classId}
          levelId={classData.level_id}
          departmentId={classData.department_id}
          selectedStudents={classData.students} // Sửa lại để truyền danh sách học sinh đã liên kết với lớp
          setSelectedStudents={setSelectedStudents} // Truyền hàm vừa định nghĩa
        />

        <div className="card-footer">
          <button type="submit" className="btn btn-primary">
            Cập Nhật Lớp Học
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditClass;
