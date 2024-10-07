import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]); // Dữ liệu sinh viên
  const [filteredTeachers, setFilteredTeachers] = useState([]); // Dữ liệu sau khi lọc
  const [filters, setFilters] = useState({
    fullName: '',
    birthday: '',
    phone: '',
    facebook: '',
    department_code: '',
    address: '',
    note: ''
  });

  // Lấy dữ liệu sinh viên từ API
  useEffect(() => {
    axios.get('/api/getTeachers')
      .then(response => {
        setTeachers(response.data);
        setFilteredTeachers(response.data);
      })
      .catch(error => {
        // if (error.response && error.response.status === 401) {
        //   // Chuyển hướng đến trang login
        //   navigate("/login"); // Hoặc sử dụng React Router để chuyển hướng
        // }
      });
  }, []);

  // Hàm lọc dữ liệu dựa trên input filter
  useEffect(() => {
    const filtered = teachers.filter(teacher =>
      (teacher.full_name || '').toLowerCase().includes(filters.fullName.toLowerCase()) &&
      (teacher.birthday || '').includes(filters.birthday) &&
      (teacher.phone || '').includes(filters.phone) &&
      (teacher.facebook || '').toLowerCase().includes(filters.facebook.toLowerCase()) &&
      (teacher.address || '').toLowerCase().includes(filters.address.toLowerCase()) &&
      (teacher.department_code || '').toLowerCase().includes(filters.department_code.toLowerCase()) &&
      (teacher.note || '').toLowerCase().includes(filters.note.toLowerCase())
    );
    setFilteredTeachers(filtered);
  }, [filters, teachers]);

  // Hàm thay đổi filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const renderRows = () => {
    return filteredTeachers.map((teacher, index) => (
      <tr key={teacher.teacher_id}>
        <td className='tb-stt'>{index + 1}</td>
        <td>{teacher.full_name}</td>
        <td className='tb-center-110'>{teacher.birthday}</td>
        <td className='tb-phone'>{teacher.phone}</td>
        <td>{teacher.facebook}</td>
        <td className='tb-center-110'>{teacher.department_code}</td>
        <td>{teacher.address}</td>
        <td>{teacher.note}</td>
      </tr>
    ));
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Danh sách giáo viên</h3>
        <div className='card-tools'>
          <div className="input-group input-group-sm">
            <Link to="/addTeacher" type="submit" name="table_search" className="btn btn-primary float-right">
              <i className="far fa-plus-square"></i> Đăng ký giáo viên
            </Link>
          </div>
        </div>
      </div>
      <div className="card-body table-responsive p-0 table-container">
        <table className="table table-head-fixed table-bordered table-hover">
          <thead>
            <tr>
              <th className='tb-stt'></th>
              <th>
                Họ và tên
                <input
                  type="text"
                  name="fullName"
                  value={filters.fullName}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo tên"
                />
              </th>
              <th className='tb-center-110'>
                Năm sinh
                <input
                  className='tb-110'
                  type="text"
                  name="birthday"
                  value={filters.birthday}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo năm"
                />
              </th>
              <th className='tb-phone'>
                Sdt
                <input
                  className='tb-phone'
                  type="text"
                  name="phone"
                  value={filters.phone}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo SĐT"
                />
              </th>
              <th>
                Facebook
                <input
                  className='tb-110'
                  type="text"
                  name="facebook"
                  value={filters.facebook}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo FB"
                />
              </th>
              <th className='tb-center-110'>
                Cơ sở
                <input
                  className='tb-110'
                  type="text"
                  name="department_code"
                  value={filters.department_code}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo cơ sở"
                />
              </th>
              <th>
                Địa chỉ
                <input
                  type="text"
                  name="address"
                  value={filters.address}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo address"
                />
              </th>
              <th>
                Note
                <input
                  type="text"
                  name="note"
                  value={filters.note}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo ghi chú"
                />
              </th>
            </tr>
          </thead>
          <tbody>{renderRows()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherList;
