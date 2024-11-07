// frontend/src/components/TeacherSalary.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Toast from "../toast";

const TeacherSalary = () => {
  const [salaries, setSalaries] = useState([]);

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const response = await axios.get("/api/salaries");
        setSalaries(response.data);
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "Lỗi khi lấy thông tin",
        });
        console.error("Error fetching classes:", error);
      }
    };

    fetchSalaries();
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Bảng lương nhân viên</h3>
        <div className="card-tools">
          <div className="input-group input-group-sm">
            <Link
              to="/addLevel"
              type="submit"
              name="table_search"
              className="btn btn-primary float-right"
            >
              <i className="far fa-plus-square"></i> Nhập lương nhân viên
            </Link>
          </div>
        </div>
      </div>
      <div className="card-body table-responsive p-0 table-container">
        <table className="table table-head-fixed table-bordered table-hover">
          <thead>
            <tr>
              <th rowSpan="2">STT</th>
              <th rowSpan="2">Họ và Tên</th>
              <th colSpan="2" className="w-center">Tiền Lương</th>
              <th colSpan="3" className="w-center">Thưởng</th>
              <th rowSpan="2">Phạt</th>
              <th rowSpan="2">BHXH</th>
              <th rowSpan="2">Tổng thu nhập</th>
            </tr>
            <tr>
              <th>Giảng Dạy</th>
              <th>Hành Chính</th>
              <th>Doanh Thu</th>
              <th>Combo</th>
              <th>Chiến dịch</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((salary, index) => (
              <tr key={salary.teacher_id}>
                <td>{index + 1}</td>
                <td>{salary.full_name}</td>
                <td>{salary.teaching_salary}</td>
                <td>{salary.basic_salary}</td>
                <td>{salary.revenue}</td>
                <td>{salary.allowance}</td>
                <td>{salary.campaign}</td>
                <td>{salary.deductions}</td>
                <td>{salary.social_insurance}</td>
                <td>{salary.total_salary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherSalary;
