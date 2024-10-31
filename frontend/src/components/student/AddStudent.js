// frontend/src/components/AddStudent.js
import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom"; // Import useHistory
import axios from "axios";
import UserRole from "../../UserRole";
import Toast from "../toast";

const AddStudent = () => {
  const { user } = useOutletContext(); // Lấy user từ context
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    full_name: "",
    birthday: "",
    phone: "",
    facebook: "",
    department_id: "",
    note: "",
  });

  // Hàm gọi API để lấy danh sách chi nhánh
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("/api/departments"); // Đảm bảo API này tồn tại
        setDepartments(response.data);
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "Lỗi khi lấy thông tin",
        });
        console.error("Lỗi khi lấy danh sách chi nhánh", error);
      }
    };

    fetchDepartments();
    // Lấy thông tin người dùng từ localStorage
    if (user?.role !== UserRole.SYSTEM && user?.role !== UserRole.ADMIN) {
      setFormData((prevData) => ({
        ...prevData,
        department_id: user.department_id, // Gán department_id mặc định
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/addStudents", formData); // Gọi API để thêm sinh viên
      Toast.fire({
        icon: "success",
        title: "Đăng ký học sinh mới thành công!",
      });
      navigate("/studentlist"); // Chuyển hướng về danh sách học sinh
      
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Đăng ký học sinh mới thất bại",
      });
      console.error("Lỗi khi thêm học sinh", error);
    }
  };

  return (
    <div className="card card-primary">
      <div className="card-header">
        <h3 className="card-title">Đăng ký học sinh</h3>
      </div>

      <form onSubmit={handleSubmit} className="form-horizontal">
        <div className="card-body w-550">
          <div className="form-group row">
            <label htmlFor="full_name" className="col-sm-3 col-form-label">
              Họ và tên
            </label>
            <div className="col-sm-9">
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
          </div>
          <div className="form-group row">
            <label htmlFor="birthday" className="col-sm-3 col-form-label">
              Năm sinh
            </label>
            <div className="col-sm-9">
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
          </div>
          <div className="form-group row">
            <label htmlFor="phone" className="col-sm-3 col-form-label">
              Số điện thoại
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="facebook" className="col-sm-3 col-form-label">
              Facebook
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                id="facebook"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="department_id" className="col-sm-3 col-form-label">
              Chi nhánh
            </label>
            <div className="col-sm-9">
              <select
                className="form-control"
                id="department_id"
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
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
          <div className="form-group row">
            <label htmlFor="note" className="col-sm-3 col-form-label">
              Ghi chú
            </label>
            <div className="col-sm-9">
              <textarea
                className="form-control"
                id="note"
                name="note"
                value={formData.note}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="card-footer">
          <button type="submit" className="btn btn-primary">
            Đăng Ký
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;
