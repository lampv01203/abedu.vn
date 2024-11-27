// TotalAttendDetail.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Toast from "../toast";
import { format } from "date-fns";

const StudentRegisClass = ({ studentId, onClose }) => {
  const [classes, setClasses] = useState([]); // Dữ liệu lớp học
  const [filteredClasses, setFilteredClasses] = useState([]); // Dữ liệu sau khi lọc
  const [selectedClassId, setSelectedClassId] = useState(null); // Track selected class
  const [filters, setFilters] = useState({
    class_name: "",
    level_code: "",
    department_code: "",
    teachers: "",
    totalStudent: "",
    start_date: "",
    end_date: "",
    day_of_week: "",
    start_end_time: "",
  });

  // Lấy dữ liệu lớp học từ API
  useEffect(() => {
    axios
      .get(`/api/getRegisClasses/${studentId}`)
      .then((response) => {
        const classesData = response.data;
        setClasses(classesData);
        setFilteredClasses(classesData);
      })
      .catch((error) => {
        Toast.fire({
          icon: "error",
          title: "Lỗi khi lấy thông tin",
        });
        console.error("Error fetching classes:", error);
      });
  }, []);

  // Hàm lọc dữ liệu dựa trên input filter
  useEffect(() => {
    const filtered = classes.filter((classItem) => {
      const isTotalStudentMatch =
        filters.totalStudent === "" ||
        classItem.totalStudent === Number(filters.totalStudent);

      // Filter schedules
      const scheduleMatch = (classItem.schedules || []).some((schedule) => {
        const timeRange = `${schedule.start_time || ""}-${
          schedule.end_time || ""
        }`;
        return (
          (schedule.day_of_week || "")
            .toLowerCase()
            .includes(filters.day_of_week.toLowerCase()) &&
          timeRange.includes(filters.start_end_time)
        );
      });

      return (
        (classItem.class_name || "")
          .toLowerCase()
          .includes(filters.class_name.toLowerCase()) &&
        (classItem.level_code || "")
          .toLowerCase()
          .includes(filters.level_code.toLowerCase()) &&
        (classItem.department_code || "")
          .toLowerCase()
          .includes(filters.department_code.toLowerCase()) &&
        (classItem.teachers || "")
          .toLowerCase()
          .includes(filters.teachers.toLowerCase()) &&
        (classItem.start_date || "").includes(filters.start_date) &&
        (classItem.end_date || "").includes(filters.end_date) &&
        scheduleMatch &&
        isTotalStudentMatch
      );
    });
    setFilteredClasses(filtered);
  }, [filters, classes]);

  // Hàm thay đổi filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleRadioChange = (classId) => {
    setSelectedClassId(classId); // Update selected class
  };

  const handleRegisterClass = () => {
    if (!selectedClassId) {
      Toast.fire({
        icon: "warning",
        title: "Vui lòng chọn một lớp học trước!",
      });
      return;
    }

    axios
      .post("/api/registStudentClass", { studentId, classId: selectedClassId })
      .then(() => {
        Toast.fire({
          icon: "success",
          title: "Đăng ký lớp học thành công!",
        });
        if (onClose) onClose();
      })
      .catch((error) => {
        Toast.fire({
          icon: "error",
          title: "Lỗi khi đăng ký lớp học",
        });
        console.error("Error registering class:", error);
      });
  };

  const renderRows = () => {
    return filteredClasses.map((classItem, index) => {
      const schedules = classItem.schedules || []; // Default to empty array
      return schedules.map((schedule, scheduleIndex) => (
        <tr
          key={`${classItem.class_id}-${scheduleIndex}`}
          onClick={() => handleRadioChange(classItem.class_id)}
        >
          {scheduleIndex === 0 && (
            <>
              <td className="w-stt w-30" rowSpan={schedules.length}>
                <input
                  type="radio"
                  name="selectedClass"
                  checked={selectedClassId === classItem.class_id}
                  onChange={() => handleRadioChange(classItem.class_id)}
                />
              </td>
              <td className="w-stt" rowSpan={schedules.length}>
                {index + 1}
              </td>
              <td rowSpan={schedules.length}>{classItem.class_name}</td>
              <td className="w-center" rowSpan={schedules.length}>
                {classItem.level_code}
              </td>
              <td className="w-center" rowSpan={schedules.length}>
                {classItem.department_code}
              </td>
              <td rowSpan={schedules.length}>{classItem.teachers}</td>
              <td className="w-center" rowSpan={schedules.length}>
                {classItem.totalStudent}
              </td>
              <td className="w-center" rowSpan={schedules.length}>
                {classItem.start_date
                  ? format(new Date(classItem.start_date), "dd/MM/yyyy")
                  : ""}
              </td>
              <td className="w-center" rowSpan={schedules.length}>
                {classItem.end_date
                  ? format(new Date(classItem.end_date), "dd/MM/yyyy")
                  : ""}
              </td>
              {/* <td rowSpan={schedules.length}>
                {classItem.graduated_flg ? "Đã kết khóa" : "Chưa kết khóa"}
              </td> */}
            </>
          )}
          <td className="pl-8">{schedule.day_of_week || ""}</td>
          <td className="pl-8">
            {schedule.start_time ? schedule.start_time.slice(0, 5) : ""} -{" "}
            {schedule.end_time ? schedule.end_time.slice(0, 5) : ""}
          </td>
        </tr>
      ));
    });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Danh sách lớp học</h3>
        <div className="card-tools">
          <div className="input-group input-group-sm">
            <button
              className="btn btn-primary float-right"
              onClick={handleRegisterClass}
            >
              <i className="far fa-plus-square"></i> Đăng ký lớp học mới
            </button>
          </div>
        </div>
      </div>
      <div className="card-body table-responsive p-0 table-container">
        <table className="table table-head-fixed table-bordered table-hover t-pointer">
          <thead>
            <tr>
              <th className="w-stt" colSpan={2}></th>
              <th className="w-150">
                Tên lớp
                <input
                  className="w-150"
                  type="text"
                  name="class_name"
                  value={filters.class_name}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo tên lớp"
                />
              </th>
              <th className="w-60">
                Cấp độ
                <input
                  className="w-60"
                  type="text"
                  name="level_code"
                  value={filters.level_code}
                  onChange={handleFilterChange}
                  placeholder="Cấp độ"
                />
              </th>
              <th className="w-55">
                Cơ sở
                <input
                  className="w-55 w-center"
                  type="text"
                  name="department_code"
                  value={filters.department_code}
                  onChange={handleFilterChange}
                  placeholder="Cơ sở"
                />
              </th>
              <th className="w-250">
                Giáo Viên
                <input
                  className="w-250"
                  type="text"
                  name="teachers"
                  value={filters.teachers}
                  onChange={handleFilterChange}
                  placeholder="Lọc Giáo Viên"
                />
              </th>
              <th className="w-45">
                Sĩ Số
                <input
                  className="w-45 w-center"
                  type="text"
                  name="totalStudent"
                  value={filters.totalStudent}
                  onChange={handleFilterChange}
                  placeholder="Sĩ Số"
                />
              </th>
              <th className="w-110">
                Ngày bắt đầu
                <input
                  className="w-110 w-center"
                  type="text"
                  name="start_date"
                  value={filters.start_date}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo ngày"
                />
              </th>
              <th className="w-110">
                Ngày kết thúc
                <input
                  className="w-110 w-center"
                  type="text"
                  name="end_date"
                  value={filters.end_date}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo ngày"
                />
              </th>
              <th className="w-80">
                Thứ
                <input
                  className="w-80"
                  type="text"
                  name="day_of_week"
                  value={filters.day_of_week}
                  onChange={handleFilterChange}
                  placeholder="Lọc thứ"
                />
              </th>
              <th>
                Lịch học
                <input
                  className="w-100per"
                  type="text"
                  name="start_end_time"
                  value={filters.start_end_time}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo giờ"
                />
              </th>
            </tr>
          </thead>
          <tbody>{renderRows()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentRegisClass;
