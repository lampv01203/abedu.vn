import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import TeacherSelect from "./TeacherSelect"; 
import StudentSelect from "./StudentSelect"; 

const EditClass = () => {
  const { classId } = useParams(); // Lấy classId từ URL
  const navigate = useNavigate();

  const [classData, setClassData] = useState({
    class_name: "",
    level_id: "",
    department_id: "",
    start_date: "",
    end_date: "",
    note: "",
    teachers: [],
    students: [],
    schedules: [{ day_of_week: "", start_time: "", end_time: "" }],
  });

  const [levels, setLevels] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [workingDays, setWorkingDays] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // Fetch levels, departments, teachers and class data for editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [levelRes, departmentRes, workingDayRes, teacherRes, classRes] =
          await Promise.all([
            axios.get("/api/levels"),
            axios.get("/api/departments"),
            axios.get("/api/workingDays"),
            axios.get("/api/teachers"),
            axios.get(`/api/classes/${classId}`), // Fetch class data for editing
          ]);
        setLevels(levelRes.data);
        setDepartments(departmentRes.data);
        setWorkingDays(workingDayRes.data);
        setTeachers(teacherRes.data);
        setClassData(classRes.data); // Set class data to form fields
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [classId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassData({ ...classData, [name]: value });
  };

  // Handle schedule changes
  const handleScheduleChange = (index, field, value) => {
    const newSchedules = classData.schedules.map((schedule, i) =>
      i === index ? { ...schedule, [field]: value } : schedule
    );
    setClassData({ ...classData, schedules: newSchedules });
  };

  // Add a new schedule row
  const addSchedule = () => {
    setClassData({
      ...classData,
      schedules: [
        ...classData.schedules,
        { day_of_week: "", start_time: "", end_time: "" },
      ],
    });
  };

  // Remove schedule row
  const removeSchedule = (index) => {
    const newSchedules = classData.schedules.filter((_, i) => i !== index);
    setClassData({ ...classData, schedules: newSchedules });
  };

  // Handle teacher selection
  const setSelectedTeachers = (selectedTeachers) => {
    setClassData((prevData) => ({
      ...prevData,
      teachers: selectedTeachers,
    }));
  };

  // Handle form submission for editing class
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/updateClass/${classId}`, classData); // Update class API
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

      <form onSubmit={handleSubmit}>
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
              Cơ Sở
            </label>
            <div className="col-sm-5">
              <select
                className="form-control"
                id="department_id"
                name="department_id"
                value={classData.department_id}
                onChange={handleChange}
                required
              >
                <option value="">Chọn Cơ Sở</option>
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
            <label htmlFor="workingDays" className="col-sm-3 col-form-label">
              Lịch Học
            </label>
            <div className="col-sm-9">
              {classData.schedules.map((schedule, index) => (
                <div key={index} className="row mb-2">
                  <div className="col-sm-3">
                    <select
                      id="workingDays"
                      className="form-control"
                      value={schedule.day_of_week}
                      onChange={(e) =>
                        handleScheduleChange(
                          index,
                          "day_of_week",
                          e.target.value
                        )
                      }
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
                      required
                    />
                  </div>
                  <div className="col-sm-4">
                    <input
                      type="time"
                      className="form-control"
                      value={schedule.end_time}
                      onChange={(e) =>
                        handleScheduleChange(index, "end_time", e.target.value)
                      }
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
                selectedTeachers={classData.teachers}
                onChange={setSelectedTeachers}
              />
            </div>
          </div>

          {/* Student Select */}
          <div className="form-group row">
            <label htmlFor="students" className="col-sm-3 col-form-label">
              Học Sinh
            </label>
            <div className="col-sm-9">
              <StudentSelect
                selectedStudents={classData.students}
                onChange={(students) =>
                  setClassData({ ...classData, students: students })
                }
              />
            </div>
          </div>
        </div>

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