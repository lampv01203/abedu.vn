import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/table.css'; // Import Bootstrap CSS

const StudentList = () => {
  const [students, setStudents] = useState([]); // Dữ liệu sinh viên
  const [filteredStudents, setFilteredStudents] = useState([]); // Dữ liệu sau khi lọc
  const [filters, setFilters] = useState({
    fullName: '',
    birthday: '',
    phone: '',
    facebook: '',
    department: '',
    note: ''
  });

  // Lấy dữ liệu sinh viên từ API
  useEffect(() => {
    axios.get('/api/students')
      .then(response => {
        setStudents(response.data);
        setFilteredStudents(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the students!', error);
      });
  }, []);

  // Hàm lọc dữ liệu dựa trên input filter
  useEffect(() => {
    const filtered = students.filter(student =>
      (student.full_name || '').toLowerCase().includes(filters.fullName.toLowerCase()) &&
      (student.birthday || '').includes(filters.birthday) &&
      (student.phone || '').includes(filters.phone) &&
      (student.facebook || '').toLowerCase().includes(filters.facebook.toLowerCase()) &&
      (student.department || '').toLowerCase().includes(filters.department.toLowerCase()) &&
      (student.note || '').toLowerCase().includes(filters.note.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [filters, students]);

  // Hàm thay đổi filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const renderRows = () => {
    return filteredStudents.map((student, index) => (
      <tr key={student.student_id}>
        <td className='stu-stt'>{index + 1}</td>
        <td>{student.full_name}</td>
        <td className='stu-birthday'>{student.birthday}</td>
        <td className='stu-phone'>{student.phone}</td>
        <td>{student.facebook}</td>
        <td>{student.department}</td>
        <td>{student.note}</td>
      </tr>
    ));
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Danh sách học sinh</h3>
        <div className='card-tools'>
          Số 25 Đinh Tất Miễn, p. Tân Thành, TP.Ninh Bình
        </div>
      </div>
      <div className="card-body table-responsive p-0 table-container">
        <table className="table table-head-fixed table-bordered table-hover">
          <thead>
            <tr>
              <th className='stu-stt'></th>
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
              <th className='stu-birthday'>
                Năm sinh
                <input
                  className='stu-birthday'
                  type="text"
                  name="birthday"
                  value={filters.birthday}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo năm"
                />
              </th>
              <th className='stu-phone'>
                Sdt
                <input
                  className='stu-phone'
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
                  type="text"
                  name="facebook"
                  value={filters.facebook}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo Facebook"
                />
              </th>
              <th>
                Trung tâm
                <input
                  type="text"
                  name="department"
                  value={filters.department}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo trung tâm"
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

export default StudentList;
