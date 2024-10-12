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

      <form onSubmit={handleSubmit} className="form-horizontal">
        <div className="card-body w-500">
          {/* Mã cấp độ */}
          <div className="form-group row">
            <label htmlFor="levelCode" className="col-sm-3 col-form-label">Mã cấp độ</label>
            <div className="col-sm-9">
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
          </div>

          {/* Nội dung */}
          <div className="form-group row">
            <label htmlFor="description" className="col-sm-3 col-form-label">Nội dung</label>
            <div className="col-sm-9">
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
          </div>

          {/* Số buổi học */}
          <div className="form-group row">
            <label htmlFor="sessionNumber" className="col-sm-3 col-form-label">Số buổi học</label>
            <div className="col-sm-9">
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
          </div>

          {/* Học phí */}
          <div className="form-group row">
            <label htmlFor="courseFees" className="col-sm-3 col-form-label">Học phí</label>
            <div className="col-sm-9">
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
          </div>

          {/* Note */}
          <div className="form-group row">
            <label htmlFor="note" className="col-sm-3 col-form-label">Ghi chú</label>
            <div className="col-sm-9">
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
