import React, { useEffect, useState } from "react";
import axios from "axios";
import SessionSalary from "./SessionSalary";
import Toast from "../toast";

const DetailSession = ({
  classId,
  scheduleId,
  startTime,
  endTime,
  dayOfWeek,
  date,
  onClose, // Added onClose here as a prop
}) => {
  const [classData, setClassData] = useState({
    class_id: "",
    schedule_id: "",
    dayOfWeek: "",
    attend_date: "",
    teachers: [],
    students: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassInfo = async () => {
      try {
        const [classRes, classTeacherRes, classStudentRes, workingDayRes] =
          await Promise.all([
            axios.get(`/api/getClass/${classId}`),
            axios.get("/api/classTeacher", {
              params: {
                class_id: classId || "",
                schedule_id: scheduleId || "",
              },
            }),
            axios.get("/api/classStudent", {
              params: {
                class_id: classId || "",
                schedule_id: scheduleId || "",
              },
            }),
            axios.get(`/api/getWorkingDay/${dayOfWeek}`),
          ]);

          // Ensure each teacher has a `session_salary` default value
          const teachers = classTeacherRes.data.map((teacher) => ({
            ...teacher,
            session_salary: parseFloat(teacher.session_salary) || 0, // Set to empty string if undefined
          }));

          // Ensure each teacher has a `attend_flg` default value
          const students = classStudentRes.data.map((student) => ({
            ...student,
            attend_flg: student.attend_flg || 0, // Set to FALSE if undefined
          }));
    
          setClassData({
            ...classRes.data,
            attend_date: date,
            schedule_id: scheduleId,
            teachers,
            students,
            dayOfWeek: workingDayRes.data.day_of_week,
          });
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "Lỗi khi lấy thông tin",
        });
        console.error("Error fetching class info:", error);
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchClassInfo();
    }
  }, [classId, scheduleId, date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/saveSession/${classId}`, classData);
      Toast.fire({
        icon: "success",
        title: "Lưu thành công!",
      });
      if (onClose) onClose();
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Lưu thất bại",
      });
      console.error("Error submitting form", error);
    }
  };

  const handleFeeChange = (e, teacherId) => {
    const updatedTeachers = classData.teachers.map((teacher) =>
      teacher.teacher_id === teacherId
        ? { ...teacher, session_salary: e.target.value }
        : teacher
    );
    setClassData({
      ...classData,
      teachers: updatedTeachers,
    });
  };

  const handleAttendanceChange = (e, studentId) => {
    const updatedStudents = classData.students.map((student) =>
      student.student_id === studentId
        ? { ...student, attend_flg: e.target.checked }
        : student
    );
    setClassData({
      ...classData,
      students: updatedStudents,
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit} method="POST" autoComplete="on">
        <div className="row">
          <div className="col-sm-6">
            <h5>
              <i className="fa-solid fa-calendar-days"></i>{" "}
              {classData.dayOfWeek} ngày: {date?.toLocaleDateString()}
            </h5>
          </div>
          <div className="col-sm-6">
            <h5>
              <i className="fa-solid fa-clock"></i> Ca học:{" "}
              {startTime.slice(0, 5)} - {endTime.slice(0, 5)}
            </h5>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 border-right">
            <div className="form-group">
              <h5>
                <i className="fas fa-check"></i> Chấm công giáo viên
              </h5>
              {classData.teachers.map((teacher) => (
                <div className="row" key={teacher.teacher_id}>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label
                        className="col-form-label"
                        htmlFor={`teacher-${teacher.teacher_id}`}
                        id={`label-teacher-${teacher.teacher_id}`}
                      >
                        {teacher.full_name}
                      </label>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <select
                        id={`teacher-${teacher.teacher_id}`}
                        className="form-control"
                        value={teacher.session_salary}
                        onChange={(e) => handleFeeChange(e, teacher.teacher_id)}
                      >
                        {Object.keys(SessionSalary).map((key) => (
                          <option key={key} value={SessionSalary[key].value}>
                            {SessionSalary[key].label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <h5>
                <i className="fas fa-check"></i> Điểm danh học sinh
              </h5>
              {classData.students.map((student) => (
                <div className="form-check" key={student.student_id}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={student.attend_flg}
                    checked={!!student.attend_flg} // Sử dụng checked thay vì value
                    onChange={(e) => handleAttendanceChange(e, student.student_id)}
                    id={`student-${student.student_id}`}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`student-${student.student_id}`}
                    id={`label-student-${student.student_id}`}
                  >
                    {student.full_name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer justify-content-between">
          <button type="submit" className="btn btn-primary">
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default DetailSession;
