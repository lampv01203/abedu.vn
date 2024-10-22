import React, { useEffect, useState, useRef } from "react";
import $ from "jquery"; // Import jQuery
import "select2"; // Import Select2
import "select2/dist/css/select2.min.css";

const TeacherSelect = ({ teachers, selectedTeachers, setSelectedTeachers }) => {
  const selectRef = useRef(null);

  const handleChange = (e) => {
    const selectedValues = $(selectRef.current).val();
    setSelectedTeachers(selectedValues); // Cập nhật giá trị đã chọn
  };

  useEffect(() => {
    $(selectRef.current)
      .select2({
        placeholder: "Chọn giáo viên",
        allowClear: true,
      })
      .val(selectedTeachers) // Thiết lập giá trị ban đầu từ selectedTeachers
      .trigger("change");

    // Lắng nghe sự kiện thay đổi để cập nhật giá trị khi user chọn
    $(selectRef.current).on("change", handleChange);

    return () => {
      $(selectRef.current).off("change", handleChange);
      $(selectRef.current).select2("destroy");
    };
  }, [teachers, selectedTeachers]);

  return (
    <select
      id="teachers"
      name="teachers" 
      ref={selectRef}
      className="select2 select2bs4"
      multiple
      style={{ width: "100%" }}
      autoComplete="teachers"
    >
      {teachers.map((teacher) => (
        <option key={teacher.teacher_id} value={teacher.teacher_id}>
          {teacher.full_name}
        </option>
      ))}
    </select>
  );
};

export default TeacherSelect;
