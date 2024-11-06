import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import Toast from "../toast";

const StudentList = () => {
  const [students, setStudents] = useState([]); // Dữ liệu sinh viên
  const [filteredStudents, setFilteredStudents] = useState([]); // Dữ liệu sau khi lọc
  const [filters, setFilters] = useState({
    fullName: "",
    birthday: "",
    phone: "",
    facebook: "",
    department_code: "",
    note: "",
  });

  // Lấy dữ liệu sinh viên từ API
  useEffect(() => {
    axios
      .get("/api/getStudents")
      .then((response) => {
        const studentData = response.data.map((student) => ({
          ...student,
          department_code: student.Department?.department_code,
        }));
        setStudents(studentData);
        setFilteredStudents(studentData);
      })
      .catch((error) => {
        Toast.fire({
          icon: "error",
          title: "Lỗi khi lấy thông tin",
        });
        console.error('Lỗi khi lấy thông tin', error);
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
          .includes(filters.department_code.toLowerCase()) &&
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
        <td className="w-stt">{index + 1}</td>
        <td>
          <Link to={`/editstudent/${student.student_id}`} className="text-primary">
            {student.full_name}
          </Link>
        </td>
        <td className="w-center">
          {format(new Date(student.birthday), "dd/MM/yyyy")}
        </td>
        <td className="w-center">{student.phone}</td>
        <td>{student.facebook}</td>
        <td className="w-center">{student.department_code}</td>
        <td className="w-center">{student.department_code}</td>
        <td className="w-center">{student.department_code}</td>
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
              <th className="w-stt"></th>
              <th className="w-180">
                Họ và tên
                <input
                  className="w-100-per w-180"
                  type="text"
                  name="fullName"
                  value={filters.fullName}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo tên"
                />
              </th>
              <th className="w-110">
                Năm sinh
                <input
                  className="w-center w-110"
                  type="text"
                  name="birthday"
                  value={filters.birthday}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo năm"
                />
              </th>
              <th className="w-110">
                Sdt
                <input
                  className="w-center w-110"
                  type="text"
                  name="phone"
                  value={filters.phone}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo SĐT"
                />
              </th>
              <th className="w-150">
                Facebook
                <input
                  className="w-150"
                  type="text"
                  name="facebook"
                  value={filters.facebook}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo Facebook"
                />
              </th>
              <th className="w-72">
                Cơ sở
                <input
                  className="w-center w-55"
                  type="text"
                  name="departmentCode"
                  value={filters.departmentCode}
                  onChange={handleFilterChange}
                  placeholder="Cơ sở"
                />
              </th>
              <th className="w-center w-80">
                Lớp dky
                <input
                  className="w-center w-80"
                  type="text"
                  name="departmentCode"
                  value={filters.departmentCode}
                  onChange={handleFilterChange}
                  placeholder="Cơ sở"
                />
              </th>
              <th className="w-center w-105">
                Lớp đang học
                <input
                  className="w-center w-105"
                  type="text"
                  name="departmentCode"
                  value={filters.departmentCode}
                  onChange={handleFilterChange}
                  placeholder="Cơ sở"
                />
              </th>
              <th>
                Note
                <input
                  className="w-100per"
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
