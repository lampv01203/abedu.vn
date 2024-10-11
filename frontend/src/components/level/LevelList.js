import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { Link } from "react-router-dom";
import axios from "axios";

const LevelList = () => {
  const [Levels, setLevels] = useState([]); // Dữ liệu cấp độ
  const [filteredLevels, setFilteredLevels] = useState([]); // Dữ liệu sau khi lọc
  const [filters, setFilters] = useState({
    level_code: "",
    description: "",
    session_number: "",
    course_fees: "",
    note: "",
  });

  // Lấy dữ liệu cấp độ từ API
  useEffect(() => {
    axios
      .get("/api/getLevels")
      .then((response) => {
        setLevels(response.data);
        setFilteredLevels(response.data);
      })
      .catch((error) => {
        // if (error.response && error.response.status === 401) {
        //   // Chuyển hướng đến trang login
        //   window.location.href = "/login"; // Hoặc sử dụng React Router để chuyển hướng
        // }
      });
  }, []);

  // Hàm lọc dữ liệu dựa trên input filter
  useEffect(() => {
    const filtered = Levels.filter((level) => {
      const isSessionNumberMatch =
        filters.session_number === "" ||
        level.session_number === Number(filters.session_number);

      const isCourseFeesMatch =
        filters.course_fees === "" ||
        level.course_fees === Number(filters.course_fees);
      return (
        (level.level_code || "")
          .toLowerCase()
          .includes(filters.level_code.toLowerCase()) &&
        (level.description.toLowerCase() || "").includes(
          filters.description.toLowerCase()
        ) &&
        isSessionNumberMatch &&
        isCourseFeesMatch &&
        (level.note || "").toLowerCase().includes(filters.note.toLowerCase())
      );
    });
    setFilteredLevels(filtered);
  }, [filters, Levels]);

  // Hàm thay đổi filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const renderRows = () => {
    return filteredLevels.map((Level, index) => (
      <tr key={Level.level_id}>
        <td className="w-stt">{index + 1}</td>
        <td>
          <Link to={`/editLevel/${Level.level_id}`} className="text-primary">
            {Level.level_code}
          </Link>
        </td>
        <td>{Level.description}</td>
        <td className="w-center-110">{Level.session_number}</td>
        <td className="w-center-110">
          <NumericFormat
            value={Level.course_fees}
            displayType={"text"} // Sử dụng 'text' để không cho phép chỉnh sửa
            thousandSeparator={true} // Thêm dấu phân cách hàng nghìn
            prefix={"₫"} // Thêm prefix nếu cần (VD: tiền tệ)
            renderText={(value) => <span>{value}</span>} // Để render kết quả
          />
        </td>
        <td>{Level.note}</td>
      </tr>
    ));
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Danh sách các cấp độ học</h3>
        <div className="card-tools">
          <div className="input-group input-group-sm">
            <Link
              to="/addLevel"
              type="submit"
              name="table_search"
              className="btn btn-primary float-right"
            >
              <i className="far fa-plus-square"></i> Đăng ký cấp độ mới
            </Link>
          </div>
        </div>
      </div>
      <div className="card-body table-responsive p-0 table-container">
        <table className="table table-head-fixed table-bordered table-hover">
          <thead>
            <tr>
              <th className="w-stt"></th>
              <th className="w-110">
                Mã cấp độ
                <input
                  className="w-110"
                  type="text"
                  name="level_code"
                  value={filters.level_code}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo mã"
                />
              </th>
              <th className="w-115">
                Tên cấp độ
                <input
                  type="text"
                  name="description"
                  value={filters.description}
                  onChange={handleFilterChange}
                  placeholder="Lọc theo tên"
                />
              </th>
              <th className="w-center-110">
                Số buổi học
                <input
                  className="w-center-110"
                  type="text"
                  name="session_number"
                  value={filters.session_number}
                  onChange={handleFilterChange}
                  placeholder="Lọc số buổi"
                />
              </th>
              <th className="w-center-110">
                Học phí
                <NumericFormat
                  className="w-center-110"
                  type="text"
                  name="course_fees"
                  value={filters.course_fees}
                  onValueChange={(values) => {
                    const { value } = values; // giá trị mà người dùng nhập
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      course_fees: value,
                    }));
                  }}
                  placeholder="Lọc học phí"
                  thousandSeparator={true} // Thêm dấu phân cách hàng nghìn
                  prefix={"₫"} // Thêm prefix nếu cần (VD: tiền tệ)
                />
              </th>
              <th>
                Note
                <input
                  className="w-100-per"
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

export default LevelList;
