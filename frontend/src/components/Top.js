// File: src/Top.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useHistory
import axios from "axios";
import { Link, Outlet } from "react-router-dom";
import "../css/index.css"; // Import Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "overlayscrollbars";
import "apexcharts";
import "admin-lte/dist/js/adminlte.js"; // Import AdminLTE JS
import "admin-lte/dist/css/adminlte.css"; // Import AdminLTE JS
import 'select2/dist/css/select2.min.css';
import '../css/table.css'; // Import Bootstrap CSS
import '../css/table.scss'; // Import Bootstrap CSS
import '../css/form.css'; // Import Bootstrap CSS
import '../css/form.scss'; // Import Bootstrap CSS
import UserRole from '../UserRole';

const TopScreen = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null); // Khởi tạo state cho user


  // Kiểm tra user và redirect nếu không có
  useEffect(() => {
    // Lấy thông tin user từ localStorage
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData) {
        navigate("/login"); // Chuyển hướng về màn hình login
      } else {
        setUser(userData); // Cập nhật state user
      }
    } catch (error) {
      navigate("/login"); // Chuyển hướng về màn hình login
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout"); // Gọi API logout
      localStorage.removeItem("user"); // Xóa thông tin user khỏi session
      // Redirect hoặc refresh trang sau khi logout
      navigate("/login"); // Chuyển hướng về màn hình login
    } catch (error) {
      console.error("Lỗi khi đăng xuất", error);
    }
  };
  return (
    <div className="app-wrapper">
      {/* Header */}
      <nav className="app-header navbar navbar-expand bg-body">
        <div className="container-fluid">
          {/* Navbar Start Links */}
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                className="nav-link"
                data-widget="pushmenu"
                href="#"
                role="button"
              >
                <i className="fas fa-bars"></i>
              </Link>
            </li>
          </ul>
          {/* Navbar End Links */}
          <ul className="navbar-nav ms-auto">
            {/* Notifications Dropdown */}
            <li className="nav-item dropdown">
              <button className="nav-link" data-bs-toggle="dropdown">
                <i className="bi bi-bell-fill"></i>
                <span className="navbar-badge badge text-bg-warning">15</span>
              </button>
              <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                <span className="dropdown-item dropdown-header">
                  15 Notifications
                </span>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item">
                  <i className="bi bi-envelope me-2"></i> 4 new messages
                  <span className="float-end text-secondary fs-7">3 mins</span>
                </button>
              </div>
            </li>
            {/* User Menu */}
            <li className="nav-item dropdown user-menu">
              <button
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/img/ABedu.vn.png`}
                  className="user-image rounded-circle shadow"
                  alt="User"
                />
                <span className="d-none d-md-inline col-form-label">ABedu</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                <li className="user-header text-bg-primary">
                  <img
                    src={`${process.env.PUBLIC_URL}/img/ABedu.vn.png`}
                    className="rounded-circle shadow"
                    alt="User"
                  />
                  <p>ABedu</p>
                </li>
                <li className="user-footer">
                  <button className="btn btn-default btn-flat">
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn btn-default btn-flat float-end"
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className="app-sidebar bg-body-secondary shadow"
        data-bs-theme="dark"
      >
        <div className="sidebar-brand">
          <Link to="/" className="brand-link">
            {" "}
            {/* begin::Brand Image */}
            <img
              src={`${process.env.PUBLIC_URL}/img/ABedu.vn.png`}
              alt="ABedu"
              className="brand-image opacity-75 shadow"
            />
            {/* end::Brand Image */} {/* begin::Brand Text */}
            <span className="brand-text fw-light">ABedu</span>{" "}
            {/* end::Brand Text */}
          </Link>{" "}
          {/* end::Brand Link */}
        </div>
        <div className="sidebar-wrapper">
          <nav className="mt-2">
            <ul
              className="nav sidebar-menu flex-column"
              data-lte-toggle="treeview"
              role="menu"
            >
              <li className="nav-item">
                <Link to="/workschedule" className="nav-link">
                  <i className="nav-icon fas fa-calendar-alt"></i>
                  <p>
                    Lịch làm việc
                    <i className="nav-arrow bi bi-chevron-right"></i>
                  </p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/teacherlist" className="nav-link">
                  <i className="nav-icon fa-solid fa-chalkboard-user"></i>
                  <p>
                    Danh sách giáo viên
                    <i className="nav-arrow bi bi-chevron-right"></i>
                  </p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/studentlist" className="nav-link">
                  <i className="nav-icon fa-solid fa-users"></i>
                  <p>
                    Danh sách học sinh
                    <i className="nav-arrow bi bi-chevron-right"></i>
                  </p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/classlist" className="nav-link">
                  <i className="nav-icon fa-solid fa-school"></i>
                  <p>
                    Danh sách lớp học
                    <i className="nav-arrow bi bi-chevron-right"></i>
                  </p>
                </Link>
              </li>
              {(user?.role === UserRole.SYSTEM || user?.role === UserRole.ADMIN) && (
                <li className="nav-item">
                  <Link to="/levellist" className="nav-link">
                    <i className="nav-icon fa-duotone fa-solid fa-layer-group"></i>
                    <p>
                      Danh sách cấp độ
                      <i className="nav-arrow bi bi-chevron-right"></i>
                    </p>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="app-main">
        {/* Outlet hiển thị các component con */}
        <Outlet context={{ user }} /> {/* Truyền user như context */}
      </main>
      <footer className="main-footer">
        <div className="float-right d-none d-sm-block">
          <b>Version</b> 3.2.0
        </div>
        <strong>
          Copyright © 2014-2021 <a href="https://abedu.vn">ABedu.vn</a>.
        </strong>{" "}
        All rights reserved.
      </footer>
    </div>
  );
};

export default TopScreen;
