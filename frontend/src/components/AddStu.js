// File: src/Top.js

import { useEffect } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'overlayscrollbars';
import 'apexcharts';
import 'admin-lte/dist/js/adminlte.js'; // Import AdminLTE JS

// Load các thư viện JS khi component được mount
useEffect(() => {
    // Khởi tạo OverlayScrollbars cho phần tử này
    if (scrollRef.current) {
        OverlayScrollbars(scrollRef.current, {});
      }
}, []);

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
              <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                {/* Message 1 */}
                <a href="#" className="dropdown-item">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <img src="../../dist/assets/img/user1-128x128.jpg" alt="User Avatar" className="img-size-50 rounded-circle me-3" />
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="dropdown-item-title">
                        Brad Diesel
                        <span className="float-end fs-7 text-danger">
                          <i className="bi bi-star-fill"></i>
                        </span>
                      </h3>
                      <p className="fs-7">Call me whenever you can...</p>
                      <p className="fs-7 text-secondary">
                        <i className="bi bi-clock-fill me-1"></i> 4 Hours Ago
                      </p>
                    </div>
                  </div>
                </a>
                <div className="dropdown-divider"></div>
                {/* Message 2 */}
                <a href="#" className="dropdown-item">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <img src="../../dist/assets/img/user8-128x128.jpg" alt="User Avatar" className="img-size-50 rounded-circle me-3" />
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="dropdown-item-title">
                        John Pierce
                        <span className="float-end fs-7 text-secondary">
                          <i className="bi bi-star-fill"></i>
                        </span>
                      </h3>
                      <p className="fs-7">I got your message bro</p>
                      <p className="fs-7 text-secondary">
                        <i className="bi bi-clock-fill me-1"></i> 4 Hours Ago
                      </p>
                    </div>
                  </div>
                </a>
              </div>
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
                <img src="../../dist/assets/img/user2-160x160.jpg" className="user-image rounded-circle shadow" alt="User Image" />
                <span className="d-none d-md-inline">Alexander Pierce</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                <li className="user-header text-bg-primary">
                  <img src="../../dist/assets/img/user2-160x160.jpg" className="rounded-circle shadow" alt="User Image" />
                  <p>Alexander Pierce - Web Developer</p>
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
        <div className="sidebar-wrapper">
          <nav className="mt-2">
            <ul className="nav sidebar-menu flex-column" data-lte-toggle="treeview" role="menu">
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon bi bi-box-seam-fill"></i>
                  <p>
                    Widgets
                    <i className="nav-arrow bi bi-chevron-right"></i>
                  </p>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon bi bi-table"></i>
                  <p>
                    Tables
                    <i className="nav-arrow bi bi-chevron-right"></i>
                  </p>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="app-main">
        <div className="app-content-header">
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-6">
                <h3 className="mb-0">Dashboard</h3>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-end">
                  <li className="breadcrumb-item"><a href="#">Home</a></li>
                  <li className="breadcrumb-item active">Dashboard</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="app-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3 col-6">
                <div className="small-box text-bg-primary">
                  <div className="inner">
                    <h3>150</h3>
                    <p>New Orders</p>
                  </div>
                  <a href="#" className="small-box-footer">
                    More info <i className="bi bi-link-45deg"></i>
                  </a>
                </div>
              </div>

              <div className="col-lg-3 col-6">
                <div className="small-box text-bg-success">
                  <div className="inner">
                    <h3>53<sup>%</sup></h3>
                    <p>Bounce Rate</p>
                  </div>
                  <a href="#" className="small-box-footer">
                    More info <i className="bi bi-link-45deg"></i>
                  </a>
                </div>
              </div>

              <div className="col-lg-3 col-6">
                <div className="small-box text-bg-warning">
                  <div className="inner">
                    <h3>44</h3>
                    <p>User Registrations</p>
                  </div>
                  <a href="#" className="small-box-footer">
                    More info <i className="bi bi-link-45deg"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TopScreen;
