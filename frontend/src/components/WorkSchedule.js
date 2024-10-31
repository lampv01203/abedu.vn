import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom"; // Sử dụng useNavigate
import axios from "axios";
import { format } from "date-fns";
import UserRole from "../UserRole";

const WorkSchedule = () => {
  const [classes, setClasses] = useState([]); // State để lưu trữ danh sách lớp học
  const [loading, setLoading] = useState(true); // State để quản lý trạng thái tải
  const [selectedDate, setSelectedDate] = useState(""); // State để lưu giá trị date được chọn
  const [selectedDepartment, setSelectedDepartment] = useState(1); // State để lưu giá trị date được chọn
  const [departments, setDepartments] = useState([]);
  // const { user } = useOutletContext(); // Lấy user từ context

  const user = JSON.parse(localStorage.getItem("user"));

  // Hàm để gọi API
  const fetchClasses = async (date, department) => {
    try {
      const response = await axios.get(
        `/api/classes?date=${date}&departmentId=${department}`
      );
      setClasses(response.data); // Lưu dữ liệu vào state
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false); // Đánh dấu là đã tải xong
    }
  };

  // Hàm gọi API để lấy danh sách chi nhánh
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("/api/departments"); // Đảm bảo API này tồn tại
        setDepartments(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chi nhánh", error);
      }
    };

    fetchDepartments();

    // Lấy thông tin người dùng từ localStorage
    if (user?.role !== UserRole.SYSTEM && user?.role !== UserRole.ADMIN) {
      setSelectedDepartment(user.department_id);
    }
  }, []);

  useEffect(() => {
    // Khởi tạo ngày hiện tại nếu chưa có ngày được chọn
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);

    // Kiểm tra selectedDate có giá trị không trước khi gọi API
    if (today) {
      fetchClasses(today, selectedDepartment);
    }
  }, []);

  useEffect(() => {
    if (selectedDate && selectedDepartment) {
      fetchClasses(selectedDate, selectedDepartment);
    }
  }, [selectedDate, selectedDepartment]); // Gọi lại API khi selectedDate, selectedDepartment thay đổi

  // Hàm render các dòng trong bảng
  const renderRows = () => {
    return classes.map((item) => {
      return item.classes.map((classItem, index) => (
        <tr key={index}>
          {/* {index === 0 && (
            <td className="classItem-weekday" rowSpan={item.classes.length}>{item.weekday}</td>
          )}
          {index === 0 && (
            <td rowSpan={item.classes.length}>{item.session}</td>
          )} */}
          <td className="classItem-weekday">{item.day_of_week}</td>
          <td>
            {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
          </td>
          <td className="classItem-className">{classItem.className}</td>
          <td>{classItem.level}</td>
          <td className="classItem-totalStudent">{classItem.totalStudent}</td>
          <td>{classItem.teachers}</td>
          <td>{classItem.students}</td>
          <td>{classItem.note}</td>
        </tr>
      ));
    });
  };

  if (loading) {
    return <div>Loading...</div>; // Hiển thị loading khi đang gọi API
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title ">
            <div className="row">
              <div className="col-lg-6">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Lịch làm việc tuần</span>
                  </div>
                  <input
                    className="form-control"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-lg-6">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Chi nhánh</span>
                  </div>
                  <select
                    className="form-control w-90"
                    id="department_id"
                    name="department_id"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    required
                    disabled={
                      user?.role === UserRole.SYSTEM ||
                      user?.role === UserRole.ADMIN
                        ? false
                        : true
                    } // Disable cho các vai trò không phải ADMIN hoặc SYSTEM
                  >
                    <option value="">Chọn chi nhánh</option>
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
            </div>

            {/* <label>Lịch làm việc tuần</label>{" "}
            <input
              className="h-31"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </h3>
          <h3 className="card-title w-230">
            <div className="input-group input-group-sm i-center">
              <label className="input-group-prepend">Chi nhánh</label>
              <select
                className="form-control w-90"
                id="department_id"
                name="department_id"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                required
                disabled={
                  user?.role === UserRole.SYSTEM ||
                  user?.role === UserRole.ADMIN
                    ? false
                    : true
                } // Disable cho các vai trò không phải ADMIN hoặc SYSTEM
              >
                <option value="">Chọn chi nhánh</option>
                {departments.map((department) => (
                  <option
                    key={department.department_id}
                    value={department.department_id}
                  >
                    {department.department_code}
                  </option>
                ))}
              </select>
            </div> */}
          </h3>
        </div>
        <div className="card-body table-responsive p-0 table-container">
          <table className="table table-head-fixed table-bordered table-hover">
            <thead>
              <tr>
                <th className="w-90">Ngày</th>
                <th className="w-120">Ca học</th>
                <th className="w-150">Lớp</th>
                <th className="w-90">Cấp độ</th>
                <th className="w-60">Sĩ số</th>
                <th className="w-200">GVCN</th>
                <th className="w-300">Học sinh</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>{renderRows()}</tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default WorkSchedule;
