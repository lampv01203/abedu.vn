import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import Toast from "../toast";

const ClassList = () => {
  const [classes, setClasses] = useState([]); // Dữ liệu lớp học
  const [filteredClasses, setFilteredClasses] = useState([]); // Dữ liệu sau khi lọc
  const [filters, setFilters] = useState({
    class_name: "",
    level_code: "",
    department_code: "",
    teachers: "",
    totalStudent: "",
    start_date: "",
    end_date: "",
    graduated_flg: "",
    note: "",
  });

  // Lấy dữ liệu lớp học từ API
  useEffect(() => {
    axios
      .get("/api/getClasses")
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
      const graduatedFiltered =
        classItem.graduated_flg === Number(filters.graduated_flg) ||
        filters.graduated_flg === "";
      const isTotalStudentMatch =
        filters.totalStudent === "" ||
        classItem.totalStudent === Number(filters.totalStudent);
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
        (classItem.note || "")
          .toLowerCase()
          .includes(filters.note.toLowerCase()) &&
        (classItem.start_date || "").includes(filters.start_date) &&
        (classItem.end_date || "").includes(filters.end_date) &&
        graduatedFiltered &&
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

  const renderRows = () => {
    return filteredClasses.map((classItem, index) => (
      <tr key={classItem.class_id}>
        <td className="w-stt">{index + 1}</td>
        <td>
          <Link
            to={`/editClass/${classItem.class_id}`}
            className="text-primary"
          >
            {classItem.class_name}
          </Link>
        </td>
        <td className="w-center">{classItem.level_code}</td>
        <td className="w-center">{classItem.department_code}</td>
        <td>{classItem.teachers}</td>
        <td className="w-center">{classItem.totalStudent}</td>
        <td className="w-center">
          {classItem.start_date
            ? format(new Date(classItem.start_date), "dd/MM/yyyy")
            : ""}
        </td>
        <td className="w-center">
          {classItem.end_date
            ? format(new Date(classItem.end_date), "dd/MM/yyyy")
            : ""}
        </td>
        <td>{classItem.graduated_flg ? "Đã kết khóa" : "Chưa kết khóa"}</td>
        <td>{classItem.note}</td>
      </tr>
    ));
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Danh sách lớp học</h3>
        <div className="card-tools">
          <div className="input-group input-group-sm">
            <Link
              to="/addclass"
              type="submit"
              name="table_search"
              className="btn btn-primary float-right"
            >
              <i className="far fa-plus-square"></i> Đăng ký lớp học mới
            </Link>
          </div>
        </div>
      </div>
      <div className="card-body table-responsive p-0 table-container">
        <table className="table table-head-fixed table-bordered table-hover">
          <thead>
            <tr>
              <th className="w-stt"></th>
              <th className="w-125">
                Tên lớp
                <input
                  className="w-125"
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
              <th className="w-180">
                Giáo Viên
                <input
                  className="w-180"
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
              <th className="w-110">
                Kết khóa
                <select
                  className="w-110 h-30"
                  name="graduated_flg"
                  value={filters.graduated_flg}
                  onChange={handleFilterChange}
                >
                  <option value="">Tất cả</option>
                  <option value="1">Đã kết khóa</option>
                  <option value="0">Chưa kết khóa</option>
                </select>
              </th>
              <th>
                Ghi chú
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

export default ClassList;
