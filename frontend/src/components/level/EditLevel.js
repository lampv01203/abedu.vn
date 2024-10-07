import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Sử dụng useParams để lấy ID cấp độ
import { NumericFormat } from "react-number-format";
import axios from "axios";

const EditLevel = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID từ URL
  const [level, setLevel] = useState({
    level_code: "",
    description: "",
    session_number: "",
    course_fees: "",
    note: "",
    level_id: id,
  });

  // Lấy thông tin cấp độ từ API
  useEffect(() => {
    const fetchLevel = async () => {
      try {
        const response = await axios.get(`/api/getLevel/${id}`);
        setLevel(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin cấp độ", error);
      }
    };
    fetchLevel();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLevel((prevLevel) => ({
      ...prevLevel,
      [name]: value || "", // Nếu value là undefined, gán chuỗi rỗng
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/updateLevel/${id}`, level); // Gọi API để cập nhật cấp độ học
      navigate("/levellist"); // Chuyển hướng về danh sách cấp độ
    } catch (error) {
      console.error("Lỗi khi cập nhật cấp độ học", error);
    }
  };

  return (
    <div className="card card-primary">
      <div className="card-header">
        <h3 className="card-title">Chỉnh Sửa Cấp Độ Học</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card-body">
          {/* Mã cấp độ */}
          <div className="form-group">
            <label htmlFor="levelCode">Mã cấp độ</label>
            <input
              type="text"
              className="form-control"
              id="levelCode"
              name="level_code"
              value={level.level_code}
              onChange={handleChange}
              placeholder="Nhập mã cấp độ"
              required
            />
          </div>

          {/* Nội dung */}
          <div className="form-group">
            <label htmlFor="description">Nội dung</label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
              value={level.description}
              onChange={handleChange}
              placeholder="Nhập nội dung"
              required
            />
          </div>

          {/* Số buổi học */}
          <div className="form-group">
            <label htmlFor="sessionNumber">Số buổi học</label>
            <input
              type="number"
              className="form-control"
              id="sessionNumber"
              name="session_number"
              value={level.session_number}
              onChange={handleChange}
              placeholder="Nhập số buổi học"
            />
          </div>

          {/* Học phí */}
          <div className="form-group">
            <label htmlFor="courseFees">Học phí</label>
            <NumericFormat
              className="form-control"
              id="courseFees"
              name="course_fees"
              value={level.course_fees}
              onValueChange={(values) =>
                handleChange({
                  target: {
                    name: "course_fees",
                    value: values.value || "", // Gán chuỗi rỗng nếu giá trị là undefined
                  },
                })
              }
              thousandSeparator={true}
              allowNegative={true}
              prefix=""
              placeholder="Nhập học phí"
              decimalScale={0}
              displayType="input"
            />
          </div>

          {/* Note */}
          <div className="form-group">
            <label htmlFor="note">Ghi chú</label>
            <textarea
              className="form-control"
              id="note"
              name="note"
              value={level.note}
              onChange={handleChange}
              placeholder="Nhập ghi chú"
            ></textarea>
          </div>
        </div>

        <div className="card-footer">
          <button type="submit" className="btn btn-primary">
            Cập Nhật Cấp Độ
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLevel;
