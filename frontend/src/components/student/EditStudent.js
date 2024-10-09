import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Sử dụng useParams để lấy ID học sinh
import axios from "axios";

const EditStudent = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID từ URL
  const [student, setStudent] = useState({
    full_name: "",
    birthday: "",
    phone: "",
    facebook: "",
    department_id: "",
    note: "",
  });

  // Lấy thông tin học sinh từ API
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`/api/getStudent/${id}`);
        setStudent(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin học sinh", error);
      }
    };
    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value || "", // Nếu value là undefined, gán chuỗi rỗng
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/updateStudent/${id}`, student); // Gọi API để cập nhật thông tin học sinh
      navigate("/studentlist"); // Chuyển hướng về danh sách học sinh
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin học sinh", error);
    }
  };

  return (
    <div className="card card-primary">
      <div className="card-header">
        <h3 className="card-title">Chỉnh Sửa Thông Tin Học Sinh</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card-body">
          {/* Họ và tên */}
          <div className="form-group">
            <label htmlFor="fullName">Họ và tên</label>
            <input
              type="text"
              className="form-control"
              id="fullName"
              name="full_name"
              value={student.full_name}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              required
            />
          </div>

          {/* Ngày sinh */}
          <div className="form-group">
            <label htmlFor="birthday">Ngày sinh</label>
            <input
              type="date"
              className="form-control"
              id="birthday"
              name="birthday"
              value={student.birthday}
              onChange={handleChange}
              placeholder="Nhập ngày sinh"
            />
          </div>

          {/* Số điện thoại */}
          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="text"
              className="form-control"
              id="phone"
              name="phone"
              value={student.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
            />
          </div>

          {/* Facebook */}
          <div className="form-group">
            <label htmlFor="facebook">Facebook</label>
            <input
              type="text"
              className="form-control"
              id="facebook"
              name="facebook"
              value={student.facebook}
              onChange={handleChange}
              placeholder="Nhập Facebook"
            />
          </div>

          {/* Trung tâm */}
          <div className="form-group">
            <label htmlFor="department">Trung tâm</label>
            <input
              type="text"
              className="form-control"
              id="department"
              name="department_id"
              value={student.department_id}
              onChange={handleChange}
              placeholder="Nhập mã trung tâm"
            />
          </div>

          {/* Ghi chú */}
          <div className="form-group">
            <label htmlFor="note">Ghi chú</label>
            <textarea
              className="form-control"
              id="note"
              name="note"
              value={student.note}
              onChange={handleChange}
              placeholder="Nhập ghi chú"
            ></textarea>
          </div>
        </div>

        <div className="card-footer">
          <button type="submit" className="btn btn-primary">
            Cập Nhật Học Sinh
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStudent;
