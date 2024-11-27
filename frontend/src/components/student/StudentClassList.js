import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import Toast from "../toast";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import StudentClassAttend from "./StudentClassAttend";
import StudentRegisClass from "./StudentRegisClass";

const StudentClassList = ({ studentId }) => {
  const [classes, setClasses] = useState([]); // Dữ liệu lớp học
  const [filteredClasses, setFilteredClasses] = useState([]); // Dữ liệu sau khi lọc
  const [filters, setFilters] = useState({
    class_name: "",
    level_code: "",
    department_code: "",
    note: "",
    start_date: "",
    end_date: "",
    graduated_flg: "",
    total_sessions: "",
    session_number: "",
  });

  const [showModal, setShowModal] = useState(false); // State để kiểm soát modal
  const [showRegisClass, setShowRegisClass] = useState(false); // State để kiểm soát modal
  const [selectedClassId, setSelectedClassId] = useState(null); // Lưu class_id khi click
  const [selectedClassName, setSelectedClassName] = useState(null); // Lưu class_id khi click
  const [selectedStudentId, setSelectedStudentId] = useState(studentId);

  // Lấy dữ liệu lớp học từ API
  const fetchClasses = async () => {
    if (studentId) {
      axios
        .get(`/api/getClassesByStudentId/${studentId}`)
        .then((response) => {
          const classesData = response.data;
          setClasses(response.data);
          setFilteredClasses(classesData);
        })
        .catch((error) => {
          Toast.fire({
            icon: "error",
            title: "Lỗi khi lấy thông tin",
          });
          console.error("Error fetching classes:", error);
        });
    } else {
      setClasses([]);
    }
  };
  useEffect(() => {
    fetchClasses();
  }, [studentId]);

  // Hàm lọc dữ liệu dựa trên input filter
  useEffect(() => {
    const filtered = classes.filter((classItem) => {
      const graduatedFiltered =
        classItem.graduated_flg === Number(filters.graduated_flg) ||
        filters.graduated_flg === "";

      const isTotalSessionsMatch =
        filters.total_sessions === "" ||
        level.total_sessions === Number(filters.total_sessions);
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
        (classItem.note || "")
          .toLowerCase()
          .includes(filters.note.toLowerCase()) &&
        (classItem.start_date || "").includes(filters.start_date) &&
        (classItem.end_date || "").includes(filters.end_date) &&
        graduatedFiltered &&
        isTotalSessionsMatch
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

  const handleClassClick = (classId, className) => {
    setSelectedClassId(classId); // Lưu class_id
    setSelectedClassName(className);
    setShowModal(true); // Mở modal
  };

  const handleCloseModal = () => {
    fetchClasses();
    setShowRegisClass(false);
  };

  const handleRegisClassClick = () => {
    setShowRegisClass(true);
  };

  const renderRows = () => {
    return filteredClasses.map((classItem, index) => (
      <tr
        key={classItem.class_id}
        onClick={() =>
          handleClassClick(classItem.class_id, classItem.class_name)
        }
      >
        <td className="w-stt">{index + 1}</td>
        <td>{classItem.class_name}</td>
        <td className="w-center">{classItem.level_code}</td>
        <td className="w-center">{classItem.department_code}</td>
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
        <td className="w-center">
          {classItem.total_sessions}/{classItem.session_number} buổi
        </td>
        <td>{classItem.note}</td>
      </tr>
    ));
  };

  return (
    <div className="card max-h-378">
      <div className="card-header">
        <h3 className="card-title">Danh sách lớp học</h3>
        <div className="card-tools">
          <div className="input-group input-group-sm">
            <Link
              onClick={handleRegisClassClick}
              className="btn btn-primary float-right"
            >
              <i className="far fa-plus-square"></i> Đăng ký lớp học
            </Link>
          </div>
        </div>
      </div>
      <div className="card-body table-responsive p-0 table-container">
        <table className="table table-head-fixed table-bordered table-hover t-pointer">
          <thead>
            <tr>
              <th className="w-stt"></th>
              <th className="w-125">
                Tên lớp
                <input
                  id="filterClassName"
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
                  id="filterClassLevel"
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
                  id="filterClassDepartment"
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
                  id="filterStartDate"
                  className="w-110 w-center"
                  type="text"
                  name="start_date"
                  value={filters.start_date}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo ngày"
                />
              </th>
              <th className="w-130">
                Ngày đóng khóa
                <input
                  id="filterEndDate"
                  className="w-130 w-center"
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
                  id="filterGraduatedFlg"
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
              <th className="w-110">
                Điểm danh
                <input
                  id="filterTotalSessions"
                  className="w-110 w-center"
                  type="text"
                  name="total_sessions"
                  value={filters.total_sessions}
                  onChange={handleFilterChange}
                  placeholder="Lọc số buổi"
                />
              </th>
              <th>
                Ghi chú
                <input
                  id="filterClassNote"
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

      <Modal
        dialogClassName="custom-modal-width-90"
        show={showRegisClass}
        onHide={() => setShowRegisClass(false)}
      >
        <Modal.Header className="bg-primary text-white" closeButton>
          <Modal.Title>Đăng ký lớp học</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {studentId && (
            <StudentRegisClass
              studentId={studentId}
              onClose={handleCloseModal}
            />
          )}
        </Modal.Body>
      </Modal>

      <Modal
        dialogClassName="custom-modal-width"
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header className="bg-primary text-white" closeButton>
          <Modal.Title>Thông tin điểm danh lớp {selectedClassName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedClassId && (
            <StudentClassAttend
              studentId={studentId}
              classId={selectedClassId}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StudentClassList;
