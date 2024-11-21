// frontend/src/components/Income.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Toast from "../toast";
import "../../css/TeacherSalary.css";
import { NumericFormat } from "react-number-format";
import { useOutletContext } from "react-router-dom";
import UserRole from "../../UserRole";

const Income = () => {
  const [salaries, setSalaries] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(1);
  const [editIndex, setEditIndex] = useState(null); // Track edit mode by index
  const [departments, setDepartments] = useState([]);
  const { user } = useOutletContext();

  const fetchSalaries = async (date, department) => {
    try {
      const response = await axios.get(
        `/api/salaries?date=${date}&departmentId=${department}`
      );
      const fetchedSalaries = response.data.map((salary) => ({
        ...salary,
        // Calculate total_salary on load
        total_salary:
          parseFloat(salary.basic_salary || 0) +
          parseFloat(salary.revenue || 0) +
          parseFloat(salary.allowance || 0) +
          parseFloat(salary.campaign || 0) -
          parseFloat(salary.deductions || 0) -
          parseFloat(salary.social_insurance || 0) +
          parseFloat(salary.teaching_salary || 0),
      }));
      setSalaries(fetchedSalaries);
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Lỗi khi lấy thông tin",
      });
      console.error("Error fetching classes:", error);
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("/api/departments");
        setDepartments(response.data);
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "Lỗi khi lấy thông tin",
        });
        console.error("Lỗi khi lấy danh sách chi nhánh", error);
      }
    };
    fetchDepartments();
    // Kiểm tra user có tồn tại không và có vai trò đúng không
    if (user && user.role !== UserRole.SYSTEM && user.role !== UserRole.ADMIN) {
      setSelectedDepartment(user.department_id);
    }
  }, [user]);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 7);
    setSelectedMonth(today);

    if (today) {
      fetchSalaries(today, selectedDepartment);
    }
  }, []);

  useEffect(() => {
    if (selectedMonth && selectedDepartment) {
      fetchSalaries(selectedMonth, selectedDepartment);
    }
  }, [selectedMonth, selectedDepartment]); // Gọi lại API khi selectedMonth, selectedDepartment thay đổi

  const toggleEditMode = (index) => {
    setEditIndex(editIndex === index ? null : index); // Toggle edit mode for the row
  };

  const handleSave = async (index) => {
    const updatedRow = salaries[index];
    try {
      await axios.post(`/api/updateSalaries?date=${selectedMonth}`, updatedRow);
      Toast.fire({
        icon: "success",
        title: "Cập nhật thành công",
      });
      setEditIndex(null); // Exit edit mode
      fetchSalaries(selectedMonth, selectedDepartment); // Refresh data after saving
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Lỗi khi cập nhật",
      });
      console.error("Error updating salary:", error);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedSalaries = [...salaries];
    updatedSalaries[index][field] = value;

    // Recalculate total_salary whenever a field changes
    const {
      basic_salary,
      revenue,
      allowance,
      campaign,
      deductions,
      social_insurance,
      teaching_salary,
    } = updatedSalaries[index];
    updatedSalaries[index].total_salary =
      parseFloat(basic_salary || 0) +
      parseFloat(revenue || 0) +
      parseFloat(allowance || 0) +
      parseFloat(campaign || 0) -
      parseFloat(deductions || 0) -
      parseFloat(social_insurance || 0) +
      parseFloat(teaching_salary || 0);

    setSalaries(updatedSalaries);
  };

  const calculateTotals = () => {
    return salaries.reduce(
      (totals, salary) => {
        totals.teaching_salary += parseFloat(salary.teaching_salary || 0);
        totals.basic_salary += parseFloat(salary.basic_salary || 0);
        totals.revenue += parseFloat(salary.revenue || 0);
        totals.allowance += parseFloat(salary.allowance || 0);
        totals.campaign += parseFloat(salary.campaign || 0);
        totals.deductions += parseFloat(salary.deductions || 0);
        totals.social_insurance += parseFloat(salary.social_insurance || 0);
        totals.total_salary += parseFloat(salary.total_salary || 0);
        return totals;
      },
      {
        teaching_salary: 0,
        basic_salary: 0,
        revenue: 0,
        allowance: 0,
        campaign: 0,
        deductions: 0,
        social_insurance: 0,
        total_salary: 0,
      }
    );
  };

  const totals = calculateTotals();

  return (
    <div >
      <div className="card-header">
        <div className="card-title row">
          <div className="col-6">
            <div className="col-6 input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  Bảng lương nhân viên chi nhánh
                </span>
              </div>
              <select
                className="form-control "
                id="department_id"
                name="department_id"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                required
                disabled={
                  user?.role !== UserRole.SYSTEM &&
                  user?.role !== UserRole.ADMIN
                }
              >
                <option value="">Chọn chi nhánh</option>
                {departments.map((department) => (
                  <option
                    key={department.department_id}
                    value={department.department_id}
                  >
                    {department.department_code}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-6">
            <div className="col-6 input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">tháng</span>
              </div>
              <input
                className="form-control"
                id="selectedMonth"
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="card-body table-responsive p-0 table-container-salary">
        <table className="table table-head-fixed table-bordered table-hover">
          <thead>
            <tr>
              <th className="w-stt w-60">STT</th>
              <th className="w-150 w-150">Họ và Tên</th>
              <th colSpan="2" className="w-center">
                Tiền Lương
              </th>
              <th colSpan="3">Thưởng</th>
              <th className="w-117">Phạt</th>
              <th className="w-117">BHXH</th>
              <th className="w-130">Tổng Lương</th>
            </tr>
          </thead>
          <thead className="fixed-header">
            <tr>
              <th />
              <th />
              <th className="w-center w-113">Giảng Dạy</th>
              <th className="w-117">Hành Chính</th>
              <th className="w-117">Doanh Thu</th>
              <th className="w-117">Combo</th>
              <th className="w-117">Chiến dịch</th>
              <th className="w-117" />
              <th className="w-117" />
              <th />
            </tr>
          </thead>
          <tbody>
            {salaries.map((salary, index) => (
              <tr key={salary.teacher_id}>
                <td className="w-stt">
                  {index + 1}{" "}
                  <i
                    className={
                      editIndex === index ? "fa fa-check" : "far fa-edit"
                    }
                    onClick={() =>
                      editIndex === index
                        ? handleSave(index)
                        : toggleEditMode(index)
                    }
                    style={{ cursor: "pointer" }}
                  />
                </td>
                <td>{salary.teacher_name}</td>
                <td>
                  <NumericFormat
                    value={salary.teaching_salary}
                    displayType={"text"} // Sử dụng 'text' để không cho phép chỉnh sửa
                    thousandSeparator={true} // Thêm dấu phân cách hàng nghìn
                    prefix={"₫"} // Thêm prefix nếu cần (VD: tiền tệ)
                    decimalScale={0} // Không cho phép phần thập phân
                    renderText={(value) => <span>{value}</span>} // Để render kết quả
                  />
                </td>
                <td>
                  {editIndex === index ? (
                    <NumericFormat
                      className="max-w-100"
                      id="basic_salary"
                      name="basic_salary"
                      value={salary.basic_salary || ""}
                      onValueChange={(e) =>
                        handleInputChange(index, "basic_salary", e.value)
                      } // Thay đổi cách xử lý onValueChange
                      thousandSeparator={true} // Đặt dấu phân cách hàng nghìn
                      allowNegative={true} // Cho phép nhập số âm
                      prefix={"₫"} // Thêm prefix nếu cần (VD: tiền tệ)
                      placeholder="Hành Chính"
                      decimalScale={0} // Không cho phép phần thập phân
                      displayType="input" // Hiển thị dưới dạng input
                    />
                  ) : (
                    <NumericFormat
                      value={salary.basic_salary}
                      displayType={"text"} // Sử dụng 'text' để không cho phép chỉnh sửa
                      thousandSeparator={true} // Thêm dấu phân cách hàng nghìn
                      prefix={"₫"} // Thêm prefix nếu cần (VD: tiền tệ)
                      decimalScale={0} // Không cho phép phần thập phân
                      renderText={(value) => <span>{value}</span>} // Để render kết quả
                    />
                  )}
                </td>
                <td>
                  {editIndex === index ? (
                    <NumericFormat
                      className="max-w-100"
                      id="revenue"
                      name="revenue"
                      value={salary.revenue || ""}
                      onValueChange={(e) =>
                        handleInputChange(index, "revenue", e.value)
                      } // Thay đổi cách xử lý onValueChange
                      thousandSeparator={true} // Đặt dấu phân cách hàng nghìn
                      allowNegative={true} // Cho phép nhập số âm
                      prefix={"₫"} // Thêm prefix nếu cần (VD: tiền tệ)
                      placeholder="Doanh Thu"
                      decimalScale={0} // Không cho phép phần thập phân
                      displayType="input" // Hiển thị dưới dạng input
                    />
                  ) : (
                    <NumericFormat
                      value={salary.revenue}
                      displayType={"text"} // Sử dụng 'text' để không cho phép chỉnh sửa
                      thousandSeparator={true} // Thêm dấu phân cách hàng nghìn
                      prefix={"₫"} // Thêm prefix nếu cần (VD: tiền tệ)
                      decimalScale={0} // Không cho phép phần thập phân
                      renderText={(value) => <span>{value}</span>} // Để render kết quả
                    />
                  )}
                </td>
                <td>
                  {editIndex === index ? (
                    <NumericFormat
                      className="max-w-100"
                      id="allowance"
                      name="allowance"
                      value={salary.allowance || ""}
                      onValueChange={(e) =>
                        handleInputChange(index, "allowance", e.value)
                      } // Thay đổi cách xử lý onValueChange
                      thousandSeparator={true} // Đặt dấu phân cách hàng nghìn
                      allowNegative={true} // Cho phép nhập số âm
                      prefix={"₫"} // Thêm prefix nếu cần (VD: tiền tệ)
                      placeholder="Combo"
                      decimalScale={0} // Không cho phép phần thập phân
                      displayType="input" // Hiển thị dưới dạng input
                    />
                  ) : (
                    <NumericFormat
                      value={salary.allowance}
                      displayType={"text"} // Sử dụng 'text' để không cho phép chỉnh sửa
                      thousandSeparator={true} // Thêm dấu phân cách hàng nghìn
                      prefix={"₫"} // Thêm prefix nếu cần (VD: tiền tệ)
                      decimalScale={0} // Không cho phép phần thập phân
                      renderText={(value) => <span>{value}</span>} // Để render kết quả
                    />
                  )}
                </td>
                <td>
                  {editIndex === index ? (
                    <NumericFormat
                      className="max-w-100"
                      id="campaign"
                      name="campaign"
                      value={salary.campaign || ""}
                      onValueChange={(e) =>
                        handleInputChange(index, "campaign", e.value)
                      } // Thay đổi cách xử lý onValueChange
                      thousandSeparator={true} // Đặt dấu phân cách hàng nghìn
                      allowNegative={true} // Cho phép nhập số âm
                      prefix={"₫"} // Thêm prefix nếu cần (VD: tiền tệ)
                      placeholder="Chiến Dịch"
                      decimalScale={0} // Không cho phép phần thập phân
                      displayType="input" // Hiển thị dưới dạng input
                    />
                  ) : (
                    <NumericFormat
                      value={salary.campaign}
                      displayType={"text"} // Sử dụng 'text' để không cho phép chỉnh sửa
                      thousandSeparator={true} // Thêm dấu phân cách hàng nghìn
                      prefix={"₫"} // Thêm prefix nếu cần (VD: tiền tệ)
                      decimalScale={0} // Không cho phép phần thập phân
                      renderText={(value) => <span>{value}</span>} // Để render kết quả
                    />
                  )}
                </td>
                <td>
                  {editIndex === index ? (
                    <NumericFormat
                      className="max-w-100"
                      id="deductions"
                      name="deductions"
                      value={salary.deductions || ""}
                      onValueChange={(e) =>
                        handleInputChange(index, "deductions", e.value)
                      } // Thay đổi cách xử lý onValueChange
                      thousandSeparator={true} // Đặt dấu phân cách hàng nghìn
                      allowNegative={true} // Cho phép nhập số âm
                      prefix={"₫"} // Thêm prefix nếu cần (VD: tiền tệ)
                      placeholder="Thu Phạt"
                      decimalScale={0} // Không cho phép phần thập phân
                      displayType="input" // Hiển thị dưới dạng input
                    />
                  ) : (
                    <NumericFormat
                      value={salary.deductions}
                      displayType={"text"} // Sử dụng 'text' để không cho phép chỉnh sửa
                      thousandSeparator={true} // Thêm dấu phân cách hàng nghìn
                      prefix={"₫"} // Thêm prefix nếu cần (VD: tiền tệ)
                      decimalScale={0} // Không cho phép phần thập phân
                      renderText={(value) => <span>{value}</span>} // Để render kết quả
                    />
                  )}
                </td>
                <td>
                  {editIndex === index ? (
                    <NumericFormat
                      className="max-w-100"
                      id="social_insurance"
                      name="social_insurance"
                      value={salary.social_insurance || ""}
                      onValueChange={(e) =>
                        handleInputChange(index, "social_insurance", e.value)
                      } // Thay đổi cách xử lý onValueChange
                      thousandSeparator={true} // Đặt dấu phân cách hàng nghìn
                      allowNegative={true} // Cho phép nhập số âm
                      prefix={"₫"} // Thêm prefix nếu cần (VD: tiền tệ)
                      placeholder="BHXH"
                      decimalScale={0} // Không cho phép phần thập phân
                      displayType="input" // Hiển thị dưới dạng input
                    />
                  ) : (
                    <NumericFormat
                      value={salary.social_insurance}
                      displayType={"text"} // Sử dụng 'text' để không cho phép chỉnh sửa
                      thousandSeparator={true} // Thêm dấu phân cách hàng nghìn
                      prefix={"₫"} // Thêm prefix nếu cần (VD: tiền tệ)
                      decimalScale={0} // Không cho phép phần thập phân
                      renderText={(value) => <span>{value}</span>} // Để render kết quả
                    />
                  )}
                </td>
                <td>
                  <NumericFormat
                    value={salary.total_salary}
                    displayType={"text"} // Sử dụng 'text' để không cho phép chỉnh sửa
                    thousandSeparator={true} // Thêm dấu phân cách hàng nghìn
                    prefix={"₫"} // Thêm prefix nếu cần (VD: tiền tệ)
                    decimalScale={0} // Không cho phép phần thập phân
                    renderText={(value) => <span>{value}</span>} // Để render kết quả
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        <table className="table table-bordered">
          <tfoot>
            <tr>
              <td colSpan="2" className="text-center font-weight-bold w-210">
                Tổng cộng
              </td>
              <td className="w-113">
                <NumericFormat
                  value={totals.teaching_salary}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"₫"}
                  decimalScale={0}
                  renderText={(value) => <span>{value}</span>}
                />
              </td>
              <td className="w-117">
                <NumericFormat
                  value={totals.basic_salary}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"₫"}
                  decimalScale={0}
                  renderText={(value) => <span>{value}</span>}
                />
              </td>
              <td className="w-117">
                <NumericFormat
                  value={totals.revenue}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"₫"}
                  decimalScale={0}
                  renderText={(value) => <span>{value}</span>}
                />
              </td>
              <td className="w-117">
                <NumericFormat
                  value={totals.allowance}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"₫"}
                  decimalScale={0}
                  renderText={(value) => <span>{value}</span>}
                />
              </td>
              <td className="w-117">
                <NumericFormat
                  value={totals.campaign}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"₫"}
                  decimalScale={0}
                  renderText={(value) => <span>{value}</span>}
                />
              </td>
              <td className="w-117">
                <NumericFormat
                  value={totals.deductions}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"₫"}
                  decimalScale={0}
                  renderText={(value) => <span>{value}</span>}
                />
              </td>
              <td className="w-117">
                <NumericFormat
                  value={totals.social_insurance}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"₫"}
                  decimalScale={0}
                  renderText={(value) => <span>{value}</span>}
                />
              </td>
              <td className="min-w-130">
                <NumericFormat
                  value={totals.total_salary}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"₫"}
                  decimalScale={0}
                  renderText={(value) => <span>{value}</span>}
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Income;
