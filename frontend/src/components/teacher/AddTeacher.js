// frontend/src/components/AddTeacher.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Sử dụng useNavigate
import axios from 'axios';

const AddTeacher = () => {
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    full_name: '',
    birthday: '',
    phone: '',
    facebook: '',
    address: '',
    department_id: '',
    note: ''
  });

  // Hàm gọi API để lấy danh sách chi nhánh
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('/api/departments'); // Đảm bảo API này tồn tại
        setDepartments(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách chi nhánh', error);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/addTeacher', formData); // Gọi API để thêm giáo viên
      // Hiển thị popup xác nhận
      const confirmMessage = "Đã đăng ký giáo viên thành công. Có muốn chuyển về màn hình danh sách giáo viên hay không?";
      const userConfirmed = window.confirm(confirmMessage); // Hiển thị popup

      if (userConfirmed) {
        navigate('/teacherlist'); // Chuyển hướng về danh sách giáo viên
      }
      // Nếu người dùng chọn "Không", không làm gì cả và giữ lại màn hình thêm giáo viên
      // Reset form
      setFormData({
        full_name: '',
        birthday: '',
        phone: '',
        facebook: '',
        address: '',
        department_id: '',
        note: ''
      });

    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Chuyển hướng đến trang login
        navigate("/login"); // Hoặc sử dụng React Router để chuyển hướng
      }
      console.error('Lỗi khi thêm giáo viên', error);
    }
  };

  return (
    <div className="card card-primary">
      <div className="card-header">
        <h3 className="card-title">Đăng ký Giáo Viên</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="full_name">Họ và tên</label>
            <input
              type="text"
              className="form-control"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="birthday">Năm sinh</label>
            <input
              type="date"
              className="form-control"
              id="birthday"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="text"
              className="form-control"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="facebook">Facebook</label>
            <input
              type="text"
              className="form-control"
              id="facebook"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="department_id">Chi nhánh</label>
            <select
              className="form-control"
              id="department_id"
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              required
            >
              <option value="">Chọn chi nhánh</option>
              {departments.map(department => (
                <option key={department.department_id} value={department.department_id}>
                  {department.department_code}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="address">Địa chỉ</label>
            <input
              type="text"
              className="form-control"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="note">Ghi chú</label>
            <textarea
              className="form-control"
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="card-footer">
          <button type="submit" className="btn btn-primary">Đăng Ký</button>
        </div>
      </form>
    </div>
  );
};

export default AddTeacher;
