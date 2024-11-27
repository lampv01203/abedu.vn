import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { NavLink, Outlet } from "react-router-dom"; // Sử dụng NavLink thay cho Link
import "../css/index.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "overlayscrollbars";
import "apexcharts";
import "admin-lte/dist/js/adminlte.js";
import "admin-lte/dist/css/adminlte.css";
import "select2/dist/css/select2.min.css";
import "../css/table.css";
import "../css/table.scss";
import "../css/form.css";
import "../css/form.scss";
import UserRole from "../UserRole";
import { Link } from "react-router-dom";

const TopScreen = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData) {
        navigate("/login");
      } else {
        setUser(userData);
      }
    } catch (error) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Lỗi khi đăng xuất", error);
    }
  };

  return (
    <div className="app-wrapper">
      {/* Header */}
      <nav className="app-header navbar navbar-expand bg-body">
        <div className="container-fluid">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink
                className="nav-link"
                data-widget="pushmenu"
                to="#"
                role="button"
              >
                <i className="fas fa-bars"></i>
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            {/* <li className="nav-item dropdown">
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
            </li> */}
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
                  <Link
                    to="/profile"
                    name="profile"
                    className="btn btn-primary"
                  >
                    Profile
                  </Link>
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
          <NavLink to="/" className="brand-link">
            <img
              src={`${process.env.PUBLIC_URL}/img/ABedu.vn.png`}
              alt="ABedu"
              className="brand-image opacity-75 shadow"
            />
            <span className="brand-text fw-light">ABedu</span>
          </NavLink>
        </div>
        <div className="sidebar-wrapper">
          <nav className="mt-2">
            <ul
              className="nav sidebar-menu flex-column"
              data-lte-toggle="treeview"
              role="menu"
            >
              <li className="nav-item">
                <NavLink
                  to="/workcalendar"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  <i className="nav-icon fas fa-calendar-alt"></i>
                  <p>Lịch làm việc</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/teacherlist"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  <i className="nav-icon fa-solid fa-chalkboard-user"></i>
                  <p>Danh sách giáo viên</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/studentlist"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  <i className="nav-icon fa-solid fa-users"></i>
                  <p>Danh sách học sinh</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/classlist"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  <i className="nav-icon fa-solid fa-school"></i>
                  <p>Danh sách lớp học</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/revenue"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  <i className="nav-icon fa-solid fa-hand-holding-dollar"></i>
                  <p>Thu Chi</p>
                </NavLink>
              </li>
              {(user?.role === UserRole.SYSTEM ||
                user?.role === UserRole.ADMIN) && (
                <li className="nav-item">
                  <NavLink
                    to="/levellist"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    <i className="nav-icon fa-duotone fa-solid fa-layer-group"></i>
                    <p>Danh sách cấp độ</p>
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="app-main">
        <Outlet context={{ user }} />
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
