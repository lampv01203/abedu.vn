import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "../components/toast";
import UserRole from "../UserRole";

const AddUser = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [user, setUser] = useState({
    user_id: "",
    full_name: "",
    role: "",
    email: "",
    phone: "",
    department_id: "",
    password: "",
    confirm_password: "",
  });

  // Convert UserRole enum to an array of { key, value } pairs
  const userRoles = Object.entries(UserRole).map(([key, value]) => ({
    key,
    value,
  }));


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
  }, []);

  // Handle form input changes for user and password
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value || "",
    }));
  };

  // Handle user profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/regisUser`, user);
      Toast.fire({
        icon: "success",
        title: "Thêm tài khoản thành công!",
      });
      navigate("/userlist");
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Thêm tài khoản thất bại",
      });
      console.error("Error updating user profile:", error);
    }
  };

  // Thêm hàm xử lý cho thông báo và class "is-invalid"
  const handleInvalid = (e) => {
    e.target.setCustomValidity("Hãy điền thông tin này");
    e.target.classList.add("is-invalid"); // Thêm class "is-invalid"
  };

  const handleInput = (e) => {
    e.target.setCustomValidity("");
    e.target.classList.remove("is-invalid"); // Xoá class "is-invalid" khi người dùng bắt đầu nhập
  };

  return (
    <div className="card card-primary">
      <div className="card-header">
        <h3 className="card-title">Thêm tài khoản mới</h3>
      </div>

      <div className="card-body">
        <form onSubmit={handleProfileSubmit} className="form-horizontal">
          <div className="row">
            <div className="col-6">
              {/* User Details */}
              <div className="form-group row">
                <label htmlFor="user_id" className="col-sm-4 col-form-label">
                  User ID
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="user_id"
                    name="user_id"
                    value={user.user_id}
                    onChange={handleUserChange}
                    placeholder="ID đăng nhập"
                    onInvalid={handleInvalid}
                    onInput={handleInput}
                    required
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="full_name" className="col-sm-4 col-form-label">
                  Họ và Tên
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="full_name"
                    name="full_name"
                    value={user.full_name}
                    onChange={handleUserChange}
                    placeholder="Nhập họ và tên"
                    onInvalid={handleInvalid}
                    onInput={handleInput}
                    required
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="role" className="col-sm-4 col-form-label">
                  Vai trò
                </label>
                <div className="col-sm-8">
                  <select
                    className="form-control"
                    id="role"
                    name="role"
                    value={user.role}
                    onChange={handleUserChange}
                    required
                  >
                    <option value="">Chọn vai trò</option>
                    {userRoles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.key}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="email" className="col-sm-4 col-form-label">
                  Email
                </label>
                <div className="col-sm-8">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={handleUserChange}
                    placeholder="Nhập email"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="phone" className="col-sm-4 col-form-label">
                  Số Điện Thoại
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={user.phone}
                    onChange={handleUserChange}
                    placeholder="Nhập số điện thoại"
                    autoComplete="off"
                    onInvalid={handleInvalid}
                    onInput={handleInput}
                    required
                  />
                </div>
              </div>
              {/* Department ID */}
              <div className="form-group row">
                <label
                  htmlFor="department_id"
                  className="col-sm-4 col-form-label"
                >
                  Chi nhánh
                </label>
                <div className="col-sm-8">
                  <select
                    className="form-control"
                    id="department_id"
                    name="department_id"
                    value={user.department_id}
                    onChange={handleUserChange}
                    onInvalid={handleInvalid}
                    onInput={handleInput}
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
                <label
                  htmlFor="password"
                  className="col-sm-4 col-form-label"
                >
                  Mật khẩu:
                </label>
                <div className="col-sm-8">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={user.password}
                    onChange={handleUserChange}
                    placeholder="Nhập mật khẩu"
                    onInvalid={handleInvalid}
                    onInput={handleInput}
                    required
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="confirm_password"
                  className="col-sm-4 col-form-label"
                >
                  Xác nhận mật khẩu:
                </label>
                <div className="col-sm-8">
                  <input
                    type="password"
                    className="form-control"
                    id="confirm_password"
                    name="confirm_password"
                    value={user.confirm_password}
                    onChange={handleUserChange}
                    placeholder="Xác nhận mật khẩu"
                    onInvalid={handleInvalid}
                    onInput={handleInput}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Thêm tài khoản
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
