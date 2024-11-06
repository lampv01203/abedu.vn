// TotalAttendDetail.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Toast from "../toast";

const TotalTeacherAttend = ({ teacherId, classId }) => {
  const [attendData, setAttendData] = useState([]);

  useEffect(() => {
    const fetchAttendData = async () => {
      try {
        const response = await axios.get(
          `/api/getTeacherAttend/${teacherId}/${classId}`
        );
        setAttendData(response.data);
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "Lỗi khi lấy thông tin tham gia",
        });
        console.error("Error fetching teacher attendance:", error);
      }
    };

    fetchAttendData();
  }, [teacherId, classId]);

  return (
    <div className="card-body table-responsive p-0 table-container">
      <table className="table table-head-fixed table-bordered table-hover">
        <thead>
          <tr>
            <th className="w-stt"></th>
            <th>Thứ</th>
            <th>Ngày</th>
            <th>Ca dạy</th>
            <th>Phí</th>
          </tr>
        </thead>
        <tbody>
          {attendData.map((item, index) => (
            <tr key={item.id}>
              <td className="w-stt">{index + 1}</td>
              <td>{item.day_of_week}</td>
              <td>{item.attend_date}</td>
              <td>
                {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
              </td>
              <td>{item.session_salary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TotalTeacherAttend;
