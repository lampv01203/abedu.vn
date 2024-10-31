import React, { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import axios from "axios";
import DetailSession from "./DetailSession";
import { Modal } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import UserRole from "../../UserRole";

const WorkCalendar = () => {
  const { user } = useOutletContext();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(1);
  const [departments, setDepartments] = useState([]);
  const calendarRef = useRef(null);
  const [loading, setLoading] = useState(true); // State để quản lý trạng thái tải

  const fetchClasses = async (department) => {
    try {
      const response = await axios.get(
        `/api/classWeeklySchedule?departmentId=${department}`
      );
      const data = response.data;
      const eventList = data.map((classSchedule) => {
        const {
          class_id,
          schedule_id,
          class_name,
          Start_date,
          End_date,
          working_day_id,
          start_time,
          end_time,
        } = classSchedule;
        return {
          title: class_name,
          startRecur: Start_date, // Ngày bắt đầu lặp lại
          endRecur: End_date, // Ngày kết thúc lặp lại
          daysOfWeek: [working_day_id],
          startTime: start_time,
          endTime: end_time,
          extendedProps: {
            title: class_name,
            class_id: class_id, // Đưa class_id vào extendedProps
            schedule_id: schedule_id,
            startRecur: Start_date,
            endRecur: End_date,
            daysOfWeek: [working_day_id],
            startTime: start_time,
            endTime: end_time,
          },
        };
      });
      setEvents(eventList);
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Lỗi khi lấy thông tin",
      });
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
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
    if (selectedDepartment) {
      fetchClasses(selectedDepartment);
    }
  }, [selectedDepartment]);

  const handleEventClick = (eventInfo) => {
    const date = eventInfo.event.start; // Lấy ngày từ start
    setSelectedEvent({
      ...eventInfo.event,
      ...eventInfo.event.extendedProps,
      date, // Sao chép các thuộc tính từ extendedProps
    });
    setShowDetail(true);
  };

  const changeView = (view) => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView(view);
  };

  if (loading) {
    return <div>Loading...</div>; // Hiển thị loading khi đang gọi API
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                Lịch làm việc tuần chi nhánh
              </span>
            </div>
            <select
              className="form-control w-90"
              id="department_id"
              name="department_id"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              required
              disabled={
                user?.role === UserRole.SYSTEM || user?.role === UserRole.ADMIN
                  ? false
                  : true
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
        </h3>
      </div>
      <div className="card-body table-responsive p-0 table-container">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          ref={calendarRef}
          events={events}
          eventClick={handleEventClick}
          displayEventTime={true}
          locale="vi"
          slotMinTime="07:00:00"
          slotMaxTime="20:00:00"
          height="100%"
          headerToolbar={{
            start: "dayGridMonth,timeGridWeek,timeGridDay",
            center: "title",
            end: "today prev,next",
          }}
          customButtons={{
            dayGridMonth: {
              text: "Month View",
              click: () => changeView("dayGridMonth"),
            },
            timeGridWeek: {
              text: "Week View",
              click: () => changeView("timeGridWeek"),
            },
            timeGridDay: {
              text: "Day View",
              click: () => changeView("timeGridDay"),
            },
          }}
        />

        <Modal dialogClassName="custom-modal-width" show={showDetail} onHide={() => setShowDetail(false) }>
          <Modal.Header  className="bg-primary text-white" closeButton>
            <Modal.Title>
              {selectedEvent
                ? `Lớp ${selectedEvent.title}`
                : ""}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedEvent && (
              <DetailSession
                classId={selectedEvent.class_id}
                scheduleId={selectedEvent.schedule_id}
                className={selectedEvent.title}
                date={selectedEvent.date}
                dayOfWeek={selectedEvent.daysOfWeek}
                startTime={selectedEvent.startTime}
                endTime={selectedEvent.endTime}
              />
            )}
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default WorkCalendar;
