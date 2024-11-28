import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "../components/toast";
import UserRole from "../UserRole";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    user_id: "",
    full_name: "",
    role: "",
    email: "",
    phone: "",
    department_code: "",
  });
  const [passwordData, setPasswordData] = useState({
    curr_password: "",
    new_password: "",
    confirm_new_password: "",
  });
  const [showChangePass, setShowChangePass] = useState(false); // Toggle visibility

  // Fetch user data
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
  }, []);

  // Handle form input changes for user and password
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value || "",
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value || "",
    }));
  };

  // Toggle password change section
  const toggleChangePass = () => setShowChangePass(!showChangePass);

  // Handle user profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/updateUser/${user.user_id}`, user);
      Toast.fire({
        icon: "success",
        title: "Cập nhật thông tin thành công!",
      });
      navigate("/userlist");
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Cập nhật thông tin thất bại",
      });
      console.error("Error updating user profile:", error);
    }
  };

  // Handle password change
  const handleChangePassSubmit = async (e) => {
    e.preventDefault();
    const { curr_password, new_password, confirm_new_password } = passwordData;

    if (new_password !== confirm_new_password) {
      Toast.fire({
        icon: "error",
        title: "Mật khẩu mới không khớp!",
      });
      return;
    }

    try {
      await axios.post(`/api/changePass`, {
        user_id: user.user_id,
        curr_password,
        new_password,
      });
      Toast.fire({
        icon: "success",
        title: "Đổi mật khẩu thành công!",
      });
      setPasswordData({
        curr_password: "",
        new_password: "",
        confirm_new_password: "",
      });
      setShowChangePass(false); // Hide change-pass section after success
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Đổi mật khẩu thất bại",
      });
      console.error("Error changing password:", error);
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
        <h3 className="card-title">Chỉnh Sửa Thông Tin Người Dùng</h3>
      </div>

      <div className="card-body">
        <div className="row">
          <div className="col-6">
            <form onSubmit={handleProfileSubmit} className="form-horizontal">
              {/* User Details */}
              <div className="form-group row">
                <label htmlFor="user_id" className="col-sm-3 col-form-label">
                  User ID
                </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    disabled
                    className="form-control"
                    id="user_id"
                    name="user_id"
                    value={user.user_id}
                    onChange={handleUserChange}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="full_name" className="col-sm-3 col-form-label">
                  Họ và Tên
                </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    id="full_name"
                    name="full_name"
                    value={user.full_name || ""}
                    onChange={handleUserChange}
                    placeholder="Nhập họ và tên"
                    onInvalid={handleInvalid}
                    onInput={handleInput}
                    required
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="email" className="col-sm-3 col-form-label">
                  Email
                </label>
                <div className="col-sm-9">
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
                <label htmlFor="phone" className="col-sm-3 col-form-label">
                  Số Điện Thoại
                </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={user.phone}
                    onChange={handleUserChange}
                    placeholder="Nhập số điện thoại"
                    autoComplete="off"
                    onInvalid={handleInvalid} // Thêm sự kiện onInvalid
                    onInput={handleInput} // Thêm sự kiện onInput
                    required
                  />
                </div>
              </div>
              {/* Department ID */}
              <div className="form-group row">
                <label
                  htmlFor="department_code"
                  className="col-sm-3 col-form-label"
                >
                  Chi nhánh
                </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    id="department_code"
                    name="department_code"
                    value={user.department_code || ""}
                    onChange={handleUserChange}
                    placeholder="Nhập mã phòng ban"
                    disabled
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                Cập Nhật Thông Tin
              </button>
            </form>
          </div>

          {/* Password Change Section */}
          <div className="col-6">
            <button
              type="button"
              className="btn btn-primary"
              onClick={toggleChangePass}
            >
              Đổi mật khẩu
            </button>
            {showChangePass && (
              <form
                onSubmit={handleChangePassSubmit}
                className="form-horizontal mt-3"
              >
                <div className="form-group row">
                  <label
                    htmlFor="curr_password"
                    className="col-sm-5 col-form-label"
                  >
                    Mật khẩu hiện tại:
                  </label>
                  <div className="col-sm-7">
                    <input
                      type="password"
                      className="form-control"
                      id="curr_password"
                      name="curr_password"
                      value={passwordData.curr_password}
                      onChange={handlePasswordChange}
                      placeholder="Nhập mật khẩu hiện tại"
                      onInvalid={handleInvalid}
                      onInput={handleInput}
                      required
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="new_password"
                    className="col-sm-5 col-form-label"
                  >
                    Mật khẩu mới:
                  </label>
                  <div className="col-sm-7">
                    <input
                      type="password"
                      className="form-control"
                      id="new_password"
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      placeholder="Nhập mật khẩu mới"
                      onInvalid={handleInvalid}
                      onInput={handleInput}
                      required
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="confirm_new_password"
                    className="col-sm-5 col-form-label"
                  >
                    Xác nhận mật khẩu mới:
                  </label>
                  <div className="col-sm-7">
                    <input
                      type="password"
                      className="form-control"
                      id="confirm_new_password"
                      name="confirm_new_password"
                      value={passwordData.confirm_new_password}
                      onChange={handlePasswordChange}
                      placeholder="Xác nhận mật khẩu mới"
                      onInvalid={handleInvalid}
                      onInput={handleInput}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">
                  Lưu mật khẩu mới
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
