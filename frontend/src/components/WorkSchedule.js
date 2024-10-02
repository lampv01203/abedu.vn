import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/table.css'; // Import Bootstrap CSS

const WorkSchedule = () => {
  const [classes, setClasses] = useState([]); // State để lưu trữ danh sách lớp học
  const [loading, setLoading] = useState(true); // State để quản lý trạng thái tải

  // Hàm để gọi API
  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/classes');
      setClasses(response.data); // Lưu dữ liệu vào state
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false); // Đánh dấu là đã tải xong
    }
  };

  // Sử dụng useEffect để gọi API khi component được mount
  useEffect(() => {
    fetchClasses();
  }, []);

  // Hàm render các dòng trong bảng
  const renderRows = () => {
    return classes.map((item) => {
      return item.classes.map((classItem, index) => (
        <tr key={index}>
          {index === 0 && (
            <td className="classItem-weekday" rowSpan={item.classes.length}>{item.weekday}</td>
          )}
          {index === 0 && (
            <td rowSpan={item.classes.length}>{item.session}</td>
          )}
          <td className="classItem-className">{classItem.className}</td>
          <td>{classItem.level}</td>
          <td className="classItem-totalStudent">{classItem.totalStudent}</td>
          <td>{classItem.teacher}</td>
          <td>{classItem.students}</td>
          <td>{classItem.note}</td>
        </tr>
      ));
    });
  };

  if (loading) {
    return <div>Loading...</div>; // Hiển thị loading khi đang gọi API
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lịch làm việc tuần 1/10</h3>
          <div className='card-tools'>
          Số 25 Đinh Tất Miễn, p. Tân Thành, TP.Ninh Bình
          </div>
        </div>
        <div className="card-body table-responsive p-0 table-container">
          <table className="table table-head-fixed table-bordered table-hover">
            <thead>
              <tr>
                <th className="classItem-weekday">Ngày</th>
                <th className="classItem-session">Ca học</th>
                <th className="classItem-className">Lớp</th>
                <th className="classItem-level">Cấp độ</th>
                <th className="classItem-totalStudent">Sĩ số</th>
                <th className="classItem-teacher">GVCN</th>
                <th>Học sinh</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>{renderRows()}</tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default WorkSchedule;
