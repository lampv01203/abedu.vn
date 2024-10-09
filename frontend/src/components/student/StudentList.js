import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const StudentList = () => {
  const [students, setStudents] = useState([]); // Dữ liệu sinh viên
  const [filteredStudents, setFilteredStudents] = useState([]); // Dữ liệu sau khi lọc
  const [filters, setFilters] = useState({
    fullName: "",
    birthday: "",
    phone: "",
    facebook: "",
    departmentCode: "",
    note: "",
  });

  // Lấy dữ liệu sinh viên từ API
  useEffect(() => {
    axios
      .get("/api/getStudents")
      .then((response) => {
        setStudents(response.data);
        setFilteredStudents(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          // Chuyển hướng đến trang login
          window.location.href = "/login"; // Hoặc sử dụng React Router để chuyển hướng
        }
      });
  }, []);

  // Hàm lọc dữ liệu dựa trên input filter
  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        (student.full_name || "")
          .toLowerCase()
          .includes(filters.fullName.toLowerCase()) &&
        (student.birthday || "").includes(filters.birthday) &&
        (student.phone || "").includes(filters.phone) &&
        (student.facebook || "")
          .toLowerCase()
          .includes(filters.facebook.toLowerCase()) &&
        (student.department_code || "")
          .toLowerCase()
          .includes(filters.departmentCode.toLowerCase()) &&
        (student.note || "").toLowerCase().includes(filters.note.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [filters, students]);

  // Hàm thay đổi filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const renderRows = () => {
    return filteredStudents.map((student, index) => (
      <tr key={student.student_id}>
        <td className="tb-stt">{index + 1}</td>
        <td>
          <Link
            to={`/editStudent/${student.student_id}`}
            className="text-primary">
            {student.full_name}
          </Link>
        </td>
        <td className="tb-center-110">{student.birthday}</td>
        <td className="tb-phone">{student.phone}</td>
        <td>{student.facebook}</td>
        <td className="tb-center-110">{student.department_code}</td>
        <td>{student.note}</td>
      </tr>
    ));
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Danh sách học sinh</h3>
        <div className="card-tools">
          <div className="input-group input-group-sm">
            <Link
              to="/addstudent"
              type="submit"
              name="table_search"
              className="btn btn-primary float-right"
            >
              <i className="far fa-plus-square"></i> Đăng ký học sinh
            </Link>
          </div>
        </div>
      </div>
      <div className="card-body table-responsive p-0 table-container">
        <table className="table table-head-fixed table-bordered table-hover">
          <thead>
            <tr>
              <th className="tb-stt"></th>
              <th>
                Họ và tên
                <input
                  className="tb-100-per"
                  type="text"
                  name="fullName"
                  value={filters.fullName}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo tên"
                />
              </th>
              <th className="tb-center-110">
                Năm sinh
                <input
                  className="tb-110"
                  type="text"
                  name="birthday"
                  value={filters.birthday}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo năm"
                />
              </th>
              <th className="tb-center-110">
                Sdt
                <input
                  className="tb-110"
                  type="text"
                  name="phone"
                  value={filters.phone}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo SĐT"
                />
              </th>
              <th>
                Facebook
                <input
                  className="tb-100-per"
                  type="text"
                  name="facebook"
                  value={filters.facebook}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo Facebook"
                />
              </th>
              <th className="tb-center-110">
                Cơ sở
                <input
                  className="tb-115"
                  type="text"
                  name="departmentCode"
                  value={filters.departmentCode}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo cơ sở"
                />
              </th>
              <th>
                Note
                <input
                  className="tb-100-per"
                  type="text"
                  name="note"
                  value={filters.note}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo ghi chú"
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

export default StudentList;
