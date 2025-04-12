import React, { useState, useEffect } from "react";
import Topbar from "components/Topbar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "helper/axios";
import { useAuthContext } from "hooks/useAuthContext";

const ParentAttendance = () => {
  const { user }: any = useAuthContext();
  const [studentData, setStudentData] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [attendanceModalIsOpen, setAttendanceModalIsOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    attendees: [],
  });
  const [currentEvent, setCurrentEvent] = useState(null);

  const [studUserId, setStudUserID] = useState(null);
  useEffect(() => {
    const getParentData = async () => {
      try {
        const response = await axios.get(`api/parent/${user.user_id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setStudUserID(response?.data?.s_user_id);
      } catch (error) {
      }
    };

    getParentData();
  }, []);

  useEffect(() => {
    if (studUserId) {
      fetchStudentData();
    }
  }, [studUserId]);

  useEffect(() => {
    if (studentId) {
      fetchAttendanceForStudent();
    }
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      const response = await axios.get(`api/admission/${studUserId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setStudentData(response.data);
      setStudentId(response.data.student_id);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const fetchAttendanceForStudent = async () => {
    try {
      const response = await axios.get(
        `/api/attendance/?student_ids=${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const attendanceEvents = response.data.map((attendance: any) => ({
        title: `${attendance.status.join(", ")}`,
        date: attendance.date,
        backgroundColor: attendance.status.includes("present")
          ? "green"
          : "red",
        borderColor: attendance.status.includes("present") ? "green" : "red",
      }));
      setEvents(attendanceEvents);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const handleDateClick = (arg: any) => {
    setNewEvent({ ...newEvent, date: arg.dateStr });
    setModalIsOpen(true);
  };

  const handleEventClick = (info: any) => {
    const event = events.find(
      (event) =>
        event.title === info.event.title && event.date === info.event.startStr
    );
    setCurrentEvent(event);
    setAttendanceModalIsOpen(true);
  };

  return (
    <>
      <Topbar heading={"Attendance"} />
      <div className="w-[80%] mx-auto mt-6">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          weekends={true}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
        />
      </div>
    </>
  );
};

export default ParentAttendance;
