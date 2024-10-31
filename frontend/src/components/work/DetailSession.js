import React, { useEffect, useState } from "react";
import axios from "axios";
import SessionFee from "./SessionFee";
import Toast from "../toast";


const DetailSession = ({
  classId,
  scheduleId,
  startTime,
  endTime,
  dayOfWeek,
  date,
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
        const [classRes, classTeacherRes, classStudentRes, workingDayRes] = await Promise.all([
          axios.get(`/api/getClass/${classId}`),
          axios.get(`/api/classTeacher/${classId}`),
          axios.get(`/api/classStudent/${classId}`),
          axios.get(`/api/getWorkingDay/${dayOfWeek}`),
        ]);
        setClassData({
          ...classRes.data,
          attend_date: date,
          schedule_id: scheduleId,
          teachers: classTeacherRes.data,
          students: classStudentRes.data,
          selectedFee: SessionFee.ASSISTANT.value, // Default selected fee
          dayOfWeek: workingDayRes.data.day_of_week
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

  const handleFeeChange = (e) => {
    setClassData({
      ...classData,
      selectedFee: e.target.value,
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
              <i className="fa-solid fa-calendar-days"></i> {classData.dayOfWeek} ngày:{" "}
              {date?.toLocaleDateString()}
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
          <div className="col-sm-6">
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
                        value={teacher.session_fee}
                        onChange={handleFeeChange}
                      >
                        {Object.keys(SessionFee).map((key) => (
                          <option key={key} value={SessionFee[key].value}>
                            {SessionFee[key].label}
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
                    value={student.student_id}
                    id={`student-${student.student_id}`}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`student-${student.student_id}`}
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
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default DetailSession;
