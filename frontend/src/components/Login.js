import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'admin-lte/dist/css/adminlte.min.css'; // Import AdminLTE CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '../css/login.css'; // Import Bootstrap CSS
//import 'mdb-ui-kit/css/mdb.min.css'; // Import MDB CSS nếu cần
//import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome cho biểu tượng

const Login = () => {
  const inputRef = useRef(null);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { userId, password });
      if (response.data.success) {
        // Lưu token vào localStorage (nếu cần)
        localStorage.setItem('token', response.data.token);
        // Nếu đăng nhập thành công, chuyển hướng tới màn hình Top
        navigate('/');
      } else {
        setMessage(response.data.message); // Thiết lập thông điệp lỗi từ phản hồi
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data.message || 'Có lỗi xảy ra');
      } else {
        setMessage('Có lỗi xảy ra');
      }
    }
  };
  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img 
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" 
              className="img-fluid" 
              alt="Sample" 
            />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form onSubmit={handleLogin}>
              <div className="divider d-flex align-items-center my-4">
                    <p className="text-center fw-bold mx-3 mb-0">Đăng nhập</p>
              </div>
              {/* Email input */}
              <div className="form-outline mb-4">
                <input 
                  type="userId" 
                  id="form3Example3" 
                  className="form-control form-control-lg" 
                  placeholder="Enter a user" 
                  value={userId} onChange={(e) => setUserId(e.target.value)}
                  required 
                />
              </div>

              {/* Password input */}
              <div className="form-outline mb-3">
                <input 
                  type="password" 
                  id="form3Example4" 
                  className="form-control form-control-lg" 
                  placeholder="Enter password" 
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>

              <div className="d-flex justify-content-between align-items-center">
                {/* Checkbox */}
                <div className="form-check mb-0">
                  <input 
                    className="form-check-input me-2" 
                    type="checkbox" 
                    value="" 
                    id="form2Example3" 
                  />
                  <label className="form-check-label" htmlFor="form2Example3">
                    Remember me
                  </label>
                </div>
                <a href="#!" className="text-body">Forgot password?</a>
              </div>

              <div className="text-center text-lg-start mt-4 pt-2">
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                >
                  Login
                </button>
                <p className="small fw-bold mt-2 pt-1 mb-0">
                  {message && <p className="text-danger">{message}</p>}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
        {/* Copyright */}
        <div className="text-white mb-3 mb-md-0">
          Copyright © 2020. All rights reserved.
        </div>
        {/* Right */}
        <div>
          <a href="#!" className="text-white me-4">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#!" className="text-white me-4">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#!" className="text-white me-4">
            <i className="fab fa-google"></i>
          </a>
          <a href="#!" className="text-white">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
        {/* Right */}
      </div>
    </section>
  );
};

export default Login;
