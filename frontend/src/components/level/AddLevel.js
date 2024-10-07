import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useHistory
import { NumericFormat } from "react-number-format";
import axios from "axios";

const AddLevel = () => {
  const navigate = useNavigate();

  // Khởi tạo state cho form
  const [level, setLevel] = useState({
    level_code: "",
    description: "",
    session_number: "",
    course_fees: "",
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLevel({
      ...level,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/addLevel", level); // Gọi API để thêm cấp độ học
      // Hiển thị popup xác nhận
      const confirmMessage =
        "Đã đăng ký cấp độ học thành công. Có muốn chuyển về màn hình danh sách cấp độ hay không?";
      const userConfirmed = window.confirm(confirmMessage); // Hiển thị popup

      if (userConfirmed) {
        navigate("/levellist"); // Chuyển hướng về danh sách học sinh
      }
      // Nếu người dùng chọn "Không"
      // Reset form
      setLevel({
        level_code: "",
        description: "",
        session_number: "",
        course_fees: "",
        note: "",
      });
    } catch (error) {
      console.error("Lỗi khi thêm cấp độ học", error);
    }
  };

  return (
    <div className="card card-primary">
      <div className="card-header">
        <h3 className="card-title">Thêm Cấp Độ Mới</h3>
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
                    value: values.value,
                  },
                })
              } // Thay đổi cách xử lý onValueChange
              thousandSeparator={true} // Đặt dấu phân cách hàng nghìn
              allowNegative={true} // Cho phép nhập số âm
              prefix="" // Nếu bạn muốn thêm tiền tệ (ví dụ: "VND ")
              placeholder="Nhập học phí"
              decimalScale={0} // Không cho phép phần thập phân
              displayType="input" // Hiển thị dưới dạng input
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
            Thêm Cấp Độ
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLevel;
