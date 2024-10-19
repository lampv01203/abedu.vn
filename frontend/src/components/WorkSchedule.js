import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from "date-fns";

const WorkSchedule = () => {
  const [classes, setClasses] = useState([]); // State để lưu trữ danh sách lớp học
  const [loading, setLoading] = useState(true); // State để quản lý trạng thái tải
  const [selectedDate, setSelectedDate] = useState(""); // State để lưu giá trị date được chọn

  // Hàm để gọi API
  const fetchClasses = async (date) => {
    try {
      const response = await axios.get(`/api/classWeeklyScheduleByDate?date=${date}`);
      setClasses(response.data); // Lưu dữ liệu vào state
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false); // Đánh dấu là đã tải xong
    }
  };

  useEffect(() => {
    // Khởi tạo ngày hiện tại nếu chưa có ngày được chọn
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  
    // Kiểm tra selectedDate có giá trị không trước khi gọi API
    if (today) {
      fetchClasses(today);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchClasses(selectedDate);
    }
  }, [selectedDate]); // Gọi lại API khi selectedDate thay đổi


  // Hàm render các dòng trong bảng
  const renderRows = () => {
    return classes.map((item) => {
      return item.classes.map((classItem, index) => (
        <tr key={index}>
          {/* {index === 0 && (
            <td className="classItem-weekday" rowSpan={item.classes.length}>{item.weekday}</td>
          )}
          {index === 0 && (
            <td rowSpan={item.classes.length}>{item.session}</td>
          )} */}
          <td className="classItem-weekday">{item.day_of_week}</td>
          <td>
            {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
          </td>
          <td className="classItem-className">{classItem.className}</td>
          <td>{classItem.level}</td>
          <td className="classItem-totalStudent">{classItem.totalStudent}</td>
          <td>{classItem.teachers}</td>
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
          <h3 className="card-title">Lịch làm việc tuần  <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)} 
              />
            </h3>
          <div className='card-tools'>
            Số 25 Đinh Tất Miễn, p. Tân Thành, TP.Ninh Bình
          </div>
        </div>
        <div className="card-body table-responsive p-0 table-container">
          <table className="table table-head-fixed table-bordered table-hover">
            <thead>
              <tr>
                <th className="w-90">Ngày</th>
                <th className="w-120">Ca học</th>
                <th className="w-150">Lớp</th>
                <th className="w-90">Cấp độ</th>
                <th className="w-60">Sĩ số</th>
                <th className="w-200">GVCN</th>
                <th className="w-300">Học sinh</th>
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
