import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

const StudentSelect = ({classId, levelId, departmentId, selectedStudents, setSelectedStudents }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]); // Dữ liệu sau khi lọc
  const [filters, setFilters] = useState({
    fullName: "",
    birthday: "",
    phone: "",
    facebook: "",
    department_code: "",
    note: "",
  });

  // Fetch students when levelId changes
  useEffect(() => {
    const fetchStudents = async () => {
      if ((levelId && departmentId)) {
        try {
          const response = await axios.get("/api/students", {
            params: { class_id: classId, level_id: levelId, department_id: departmentId },
          });
          setStudents(response.data); // Lưu danh sách học sinh
          setFilteredStudents(response.data);
        // Tự động chọn các học sinh đã có trong lớp
        const selectedIds = selectedStudents || []; // Đảm bảo selectedStudents không bị null
        const autoSelectedStudents = response.data
          .filter((student) => selectedIds.includes(student.student_id))
          .map((student) => student.student_id);

        // Chỉ cập nhật nếu có thay đổi
        if (JSON.stringify(autoSelectedStudents) !== JSON.stringify(selectedStudents)) {
          setSelectedStudents(autoSelectedStudents); // Set trạng thái các học sinh đã chọn
        }
      } catch (error) {
          console.error("Error fetching students", error);
        }
      } else {
        setStudents([]); // Reset danh sách học sinh nếu không có levelId
      }
    };

    fetchStudents();
  }, [levelId, departmentId, setSelectedStudents]);

  // Hàm để thêm hoặc loại bỏ học sinh khỏi danh sách
  const toggleStudent = (student_id) => {
    const isSelected = selectedStudents.includes(student_id);
    const newStudents = isSelected
      ? selectedStudents.filter((id) => id !== student_id)
      : [...selectedStudents, student_id];

    setSelectedStudents(newStudents);
  };

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

  // Render bảng danh sách học sinh
  return (
    <div className="card max-h-402">
      <div className="card-header">
        <h3 className="card-title">Danh sách học sinh</h3>
      </div>
      <div className="card-body table-responsive p-0 table-container">
        <table className="table table-head-fixed table-bordered table-hover">
          <thead>
            <tr>
              <th className="w-70 w-center w-1rem"></th>
              <th className="w-180">
                Họ và tên
                <input
                  className="w-100-per w-180"
                  type="text"
                  name="fullName"
                  value={filters.fullName}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo tên"
                  autoComplete="name"
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
                  autoComplete="birthday"
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
                  autoComplete="phone"
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
                  autoComplete="facebook"
                />
              </th>
              <th className="w-110">
                Cơ sở
                <input
                  className="w-center w-110"
                  type="text"
                  name="departmentCode"
                  value={filters.departmentCode}
                  onChange={handleFilterChange}
                  placeholder="Lọc cơ sở"
                  autoComplete="off"
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
                  autoComplete="note"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => {
              const isSelected = selectedStudents.includes(student.student_id);
              return (
                <tr key={student.student_id}>
                  <td>
                    <button
                      type="button"
                      className={`btn ${
                        isSelected ? "btn-danger" : "btn-success"
                      }`}
                      onClick={() => toggleStudent(student.student_id)}
                    >
                      {isSelected ? "-" : "+"}
                    </button>
                  </td>
                  <td >{student.full_name}</td>
                  <td className="w-center">
                    {format(new Date(student.birthday), "dd/MM/yyyy")}
                  </td>
                  <td className="w-center">{student.phone}</td>
                  <td>{student.facebook}</td>
                  <td className="w-center">{student.department_code}</td>
                  <td>{student.note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentSelect;
