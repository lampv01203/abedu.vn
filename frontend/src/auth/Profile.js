import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Toast from "../components/toast";
import UserRole from "../UserRole";

const Profile = () => {
  const navigate = useNavigate();
  //   const { userId } = useParams(); // Lấy user_id từ URL
  const [user, setUser] = useState({
    user_id: "",
    password: "",
    full_name: "",
    role: "",
    email: "",
    phone: "",
    department_code: "",
  });

  // Lấy thông tin user từ API
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    // const fetchUser = async () => {
    //   try {
    //     const response = await axios.get(`/api/findUserByUserId/${userId}`);
    //     setUser(response.data);
    //   } catch (error) {
    //     Toast.fire({
    //       icon: "error",
    //       title: "Lỗi khi lấy thông tin",
    //     });
    //     console.error("Lỗi khi lấy thông tin user", error);
    //   }
    // };
    // fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value || "", // Gán chuỗi rỗng nếu value là undefined
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/updateUser/${userId}`, user); // Gọi API để cập nhật thông tin user
      Toast.fire({
        icon: "success",
        title: "Cập nhật thông tin thành công!",
      });
      navigate("/userlist"); // Chuyển hướng về danh sách người dùng
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Cập nhật thông tin thất bại",
      });
      console.error("Lỗi khi cập nhật thông tin user", error);
    }
  };

  // Hàm để hiển thị vai trò dựa trên UserRole enum
  const getRoleLabel = (role) => {
    return (
      Object.keys(UserRole).find((key) => UserRole[key] === role) ||
      "Unknown Role"
    );
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

      <form onSubmit={handleSubmit} className="form-horizontal">
        <div className="card-body w-550">
          {/* User ID */}
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
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Full Name */}
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
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                onInvalid={handleInvalid} // Thêm sự kiện onInvalid
                onInput={handleInput} // Thêm sự kiện onInput
                required
              />
            </div>
          </div>

          {/* Role */}
          <div className="form-group row">
            <label htmlFor="role" className="col-sm-3 col-form-label">
              Vai Trò
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                id="role"
                name="role"
                value={getRoleLabel(user.role)}
                onChange={handleChange}
                placeholder="Nhập vai trò"
                disabled
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group row">
            <label htmlFor="user-email" className="col-sm-3 col-form-label">
              Email
            </label>
            <div className="col-sm-9">
              <input
                type="email"
                className="form-control"
                id="user-email"
                name="user-email"
                value={user.email || ""}
                onChange={handleChange}
                placeholder="Nhập email"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="form-group row">
            <label htmlFor="user-phone" className="col-sm-3 col-form-label">
              Số Điện Thoại
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                id="user-phone"
                name="user-phone"
                value={user.phone || ""}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                onInvalid={handleInvalid} // Thêm sự kiện onInvalid
                onInput={handleInput} // Thêm sự kiện onInput
                required
                autoComplete="off"
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
                onChange={handleChange}
                placeholder="Nhập mã phòng ban"
                disabled
              />
            </div>
          </div>
        </div>

        <div className="card-footer">
          <button type="submit" className="btn btn-primary">
            Cập Nhật Thông Tin
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
