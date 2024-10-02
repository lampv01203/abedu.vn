// File: src/Top.js

import { } from 'react';
import { Link, Outlet } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'overlayscrollbars';
import 'apexcharts';
import 'admin-lte/dist/js/adminlte.js'; // Import AdminLTE JS
import '../css/index.css'; // Import Bootstrap CSS


const TopScreen = () => {
  return (
    <div className="app-wrapper">
      {/* Header */}
      <nav className="app-header navbar navbar-expand bg-body">
        <div className="container-fluid">
          {/* Navbar Start Links */}
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" data-lte-toggle="sidebar" href="#" role="button">
                <i className="bi bi-list"></i>
              </a>
            </li>
            <li className="nav-item d-none d-md-block">
              <a href="#" className="nav-link">Home</a>
            </li>
            <li className="nav-item d-none d-md-block">
              <a href="#" className="nav-link">Contact</a>
            </li>
          </ul>
          {/* Navbar End Links */}
          <ul className="navbar-nav ms-auto">
            {/* Messages Dropdown */}
            <li className="nav-item dropdown">
              <a className="nav-link" data-bs-toggle="dropdown" href="#">
                <i className="bi bi-chat-text"></i>
                <span className="navbar-badge badge text-bg-danger">3</span>
              </a>
            </li>
            {/* Notifications Dropdown */}
            <li className="nav-item dropdown">
              <a className="nav-link" data-bs-toggle="dropdown" href="#">
                <i className="bi bi-bell-fill"></i>
                <span className="navbar-badge badge text-bg-warning">15</span>
              </a>
              <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                <span className="dropdown-item dropdown-header">15 Notifications</span>
                <div className="dropdown-divider"></div>
                <a href="#" className="dropdown-item">
                  <i className="bi bi-envelope me-2"></i> 4 new messages
                  <span className="float-end text-secondary fs-7">3 mins</span>
                </a>
              </div>
            </li>
            {/* User Menu */}
            <li className="nav-item dropdown user-menu">
              <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                <img src={`${process.env.PUBLIC_URL}/img/ABedu.vn.png`} className="user-image rounded-circle shadow" alt="User Image" />
                <span className="d-none d-md-inline">ABedu</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                <li className="user-header text-bg-primary">
                  <img src={`${process.env.PUBLIC_URL}/img/ABedu.vn.png`} className="rounded-circle shadow" alt="User Image" />
                  <p>ABedu</p>
                </li>
                <li className="user-footer">
                  <a href="#" className="btn btn-default btn-flat">Profile</a>
                  <a href="#" className="btn btn-default btn-flat float-end">Sign out</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
        <div className="sidebar-brand">
          <a href="/Top" className="brand-link"> {/* begin::Brand Image */}
            <img src={`${process.env.PUBLIC_URL}/img/ABedu.vn.png`} alt="ABedu" className="brand-image opacity-75 shadow" />
            {/* end::Brand Image */} {/* begin::Brand Text */}
            <span className="brand-text fw-light">ABedu</span> {/* end::Brand Text */}
          </a> {/* end::Brand Link */}
        </div>
        <div className="sidebar-wrapper">
          <nav className="mt-2">
            <ul className="nav sidebar-menu flex-column" data-lte-toggle="treeview" role="menu">
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
                <Link to="/studentlist" className="nav-link">
                  <i className="nav-icon fa-solid fa-users"></i>
                  <p>
                    Danh sách học sinh
                    <i className="nav-arrow bi bi-chevron-right"></i>
                  </p>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="app-main">
        {/* Outlet hiển thị các component con */}
        <Outlet />
      </main>
      <footer className="main-footer">
        <div className="float-right d-none d-sm-block">
          <b>Version</b> 3.2.0
        </div>
        <strong>Copyright © 2014-2021 <a href="https://abedu.vn">ABedu.vn</a>.</strong> All rights reserved.
      </footer>
    </div>

  );
};

export default TopScreen;
