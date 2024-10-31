import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom"; // Sử dụng useParams để lấy ID học sinh
import axios from "axios";
import { format } from "date-fns";
import UserRole from '../../UserRole';
import Toast from "../toast";

const EditStudent = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID từ URL
  const [departments, setDepartments] = useState([]);
  const [student, setStudent] = useState({
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
        const response = await axios.get('/api/departments'); // Đảm bảo API này tồn tại
        setDepartments(response.data);
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "Lỗi khi lấy thông tin",
        });
        console.error('Lỗi khi lấy danh sách chi nhánh', error);
      }
    };

    fetchDepartments();
    // Lấy thông tin người dùng từ localStorage
    if (user?.role !== UserRole.SYSTEM && user?.role !== UserRole.ADMIN) {
      setStudent((prevData) => ({
        ...prevData,
        department_id: user.department_id, // Gán department_id mặc định
      }));
    }
  }, []);

  // Lấy thông tin học sinh từ API
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`/api/getStudent/${id}`);
        const studentData = response.data;
        setStudent({
          ...studentData,
          department_code: studentData.Department?.department_code || "", // Lấy department_code từ Department
        });
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "Lỗi khi lấy thông tin",
        });
        console.error("Lỗi khi lấy thông tin học sinh", error);
      }
    };
    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value || "", // Nếu value là undefined, gán chuỗi rỗng
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/updateStudent/${id}`, student); // Gọi API để cập nhật thông tin học sinh
      Toast.fire({
        icon: "success",
        title: "Thay đổi thông tin học sinh thành công!",
      });
      navigate("/studentlist"); // Chuyển hướng về danh sách học sinh
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Thay đổi thông tin học sinh thất bại",
      });
      console.error("Lỗi khi cập nhật thông tin học sinh", error);
    }
  };

  return (
    <div className="card card-primary">
      <div className="card-header">
        <h3 className="card-title">Chỉnh Sửa Thông Tin Học Sinh</h3>
      </div>

      <form onSubmit={handleSubmit} className="form-horizontal">
        <div className="card-body w-550">
          {/* Họ và tên */}
          <div className="form-group row">
            <label htmlFor="fullName" className="col-sm-3 col-form-label">Họ và tên</label>
            <div className="col-sm-9">
              <input
              type="text"
              className="form-control"
              id="fullName"
              name="full_name"
              value={student.full_name || ""}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              required
            />
          </div>
          </div>

          {/* Ngày sinh */}
          <div className="form-group row">
            <label htmlFor="birthday" className="col-sm-3 col-form-label">Ngày sinh</label>
            <div className="col-sm-9">
              <input
              type="date"
              className="form-control"
              id="birthday"
              name="birthday"
              value={student.birthday ? format(new Date(student.birthday), "yyyy-MM-dd") : ""} // Kiểm tra trước khi gán giá trị
              onChange={handleChange}
              placeholder="Nhập ngày sinh"
            />
          </div>
          </div>

          {/* Số điện thoại */}
          <div className="form-group row">
            <label htmlFor="phone" className="col-sm-3 col-form-label">Số điện thoại</label>
            <div className="col-sm-9">
              <input
              type="text"
              className="form-control"
              id="phone"
              name="phone"
              value={student.phone || ""}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
            />
          </div>
          </div>

          {/* Facebook */}
          <div className="form-group row">
            <label htmlFor="facebook" className="col-sm-3 col-form-label">Facebook</label>
            <div className="col-sm-9">
              <input
              type="text"
              className="form-control"
              id="facebook"
              name="facebook"
              value={student.facebook || ""}
              onChange={handleChange}
              placeholder="Nhập Facebook"
            />
          </div>
          </div>

          {/* Trung tâm */}
          <div className="form-group row">
            <label htmlFor="department_id" className="col-sm-3 col-form-label">Chi nhánh</label>
            <div className="col-sm-9">
            <select
              className="form-control"
              id="department_id"
              name="department_id"
              value={student.department_id || ""}
              onChange={handleChange}
              required
              disabled={
                user?.role === UserRole.SYSTEM || user?.role === UserRole.ADMIN ? false : true
              } // Disable cho các vai trò không phải ADMIN hoặc SYSTEM
            >
              <option value="">Chọn chi nhánh</option>
              {departments.map(department => (
                <option key={department.department_id} value={department.department_id}>
                  {department.department_code}
                </option>
              ))}
            </select>
          </div>
          </div>

          {/* Ghi chú */}
          <div className="form-group row">
            <label htmlFor="note" className="col-sm-3 col-form-label">Ghi chú</label>
            <div className="col-sm-9">
              <textarea
              className="form-control"
              id="note"
              name="note"
              value={student.note || ""}
              onChange={handleChange}
              placeholder="Nhập ghi chú"
            ></textarea>
          </div>
          </div>
        </div>

        <div className="card-footer">
          <button type="submit" className="btn btn-primary">
            Cập Nhật Học Sinh
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStudent;
