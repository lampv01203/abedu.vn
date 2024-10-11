import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const ClassList = () => {
  const [classes, setClasses] = useState([]); // Dữ liệu lớp học
  const [filteredClasses, setFilteredClasses] = useState([]); // Dữ liệu sau khi lọc
  const [filters, setFilters] = useState({
    weekday: "",
    session: "",
    class_name: "",
    level_code: "",
    department_code: "",
    note: "",
    start_date: "",
    graduated_flg: "",
  });

  // Lấy dữ liệu lớp học từ API
  useEffect(() => {
    axios
      .get("/api/getClasses")
      .then((response) => {
        const classesData = response.data.map((classItem) => ({
          ...classItem,
          department_code: classItem.Department?.department_code,
          level_code: classItem.Level?.level_code,
        }));
        setClasses(classesData);
        setFilteredClasses(classesData);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
      });
  }, []);

  // Hàm lọc dữ liệu dựa trên input filter
  useEffect(() => {
    const filtered = classes.filter((classItem) => {
      const graduatedFiltered =
        classItem.graduated_flg === Number(filters.graduated_flg) ||
        filters.graduated_flg === "";
      return (
        (classItem.weekday || "")
          .toLowerCase()
          .includes(filters.weekday.toLowerCase()) &&
        (classItem.session || "")
          .toLowerCase()
          .includes(filters.session.toLowerCase()) &&
        (classItem.class_name || "")
          .toLowerCase()
          .includes(filters.class_name.toLowerCase()) &&
        (classItem.level_code || "")
          .toLowerCase()
          .includes(filters.level_code.toLowerCase()) &&
        (classItem.department_code || "")
          .toLowerCase()
          .includes(filters.department_code.toLowerCase()) &&
        (classItem.note || "")
          .toLowerCase()
          .includes(filters.note.toLowerCase()) &&
        (classItem.start_date || "").includes(filters.start_date) &&
        graduatedFiltered
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
        <td className="w-100">{classItem.weekday}</td>
        <td>{classItem.session}</td>
        <td>
          <Link to={`/editClass/${classItem.class_id}`} className="text-primary">
            {classItem.class_name}
          </Link>
        </td>
        <td className="w-center">{classItem.level_code}</td>
        <td className="w-center">{classItem.department_code}</td>
        <td className="w-center">
          {format(new Date(classItem.start_date), "dd/MM/yyyy")}
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
      </div>
      <div className="card-body table-responsive p-0 table-container">
        <table className="table table-head-fixed table-bordered table-hover">
          <thead>
            <tr>
              <th className="w-stt"></th>
              <th className="w-75">
                Ngày
                <input
                  className="w-75"
                  type="text"
                  name="weekday"
                  value={filters.weekday}
                  onChange={handleFilterChange}
                  placeholder="Lọc ngày"
                />
              </th>
              <th className="w-105">
                Ca học
                <input
                  className="w-105"
                  type="text"
                  name="session"
                  value={filters.session}
                  onChange={handleFilterChange}
                  placeholder="Lọc ca học"
                />
              </th>
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
              <th className="w-90">
                Cấp độ
                <input
                  className="w-90"
                  type="text"
                  name="level_code"
                  value={filters.level_code}
                  onChange={handleFilterChange}
                  placeholder="Lọc cấp độ"
                />
              </th>
              <th className="w-80">
                Cơ sở
                <input
                  className="w-80 w-center"
                  type="text"
                  name="department_code"
                  value={filters.department_code}
                  onChange={handleFilterChange}
                  placeholder="Lọc cơ sở"
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
