import axios from "helper/axios";
import { useAuthContext } from "hooks/useAuthContext";
import React, { useEffect, useState } from "react";
import qs from "qs";
import Swal from "sweetalert2";
import { Button } from "components";
import { useNavigate } from "react-router-dom";

interface StudentAttendance {
  student_id: any;
  first_name: string;
  last_name: string;
  course_name: string;
}

interface AttendanceStatus {
  [key: string]: string;
}

const AllowAttendance = () => {
  const [studentRecords, setStudentRecords] = useState<StudentAttendance[]>([]);
  const [attendanceStatuses, setAttendanceStatuses] = useState<AttendanceStatus>({});
  const [detailID, setDetailID] = useState<string | null>(null);
  const [courseContID, setCourseContId] = useState<string | null>(null);
  const { user }: any = useAuthContext();

  const getStudentData = async (detailID:any, courseContID:any) => {

    if (!detailID || !courseContID) {
      return; // Don't make the request if either ID is missing
    }
    try {
      const response = await axios.get(`/api/attendance_students/module_wise/?course_id=${courseContID}&admin_course_id=${detailID}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setStudentRecords(response.data);
      // console.log(response.data);
      const initialStatuses = response.data.reduce(
        (acc: AttendanceStatus, student: StudentAttendance) => {
          acc[student.student_id] = "present";
          return acc;
        },
        {}
      );
      // console.log(response.data);
      setAttendanceStatuses(initialStatuses);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Student data was not found.",
        customClass: {
          icon: "swal-my-icon",
        },
        text: error?.response?.data?.message || "Please try again later.",
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const detailId = queryParams.get('detailId');
    const courseContentId = queryParams.get('selectedCourseId');
    
    setCourseContId(courseContentId);
    setDetailID(detailId);

    // Only fetch student data if both IDs are available
    if (detailId && courseContentId) {
      getStudentData(detailId, courseContentId);
    }
  }, [detailID, courseContID]);

  

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceStatuses((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const navigate = useNavigate();

  const handleSubmitAll = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const student_ids = studentRecords.map((student) => student.student_id).join(",");
      const course_content_id = detailID;
      const status = studentRecords
        .map((student) => attendanceStatuses[student.student_id])
        .join(",");

      const payload = {
        student_ids,
        course_content_id,
        status,
      };

      const urlEncodedData = qs.stringify(payload);

      const response = await axios.post(`/api/attendance/`, urlEncodedData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      Swal.fire({
        icon: "success",
        title: `Attendance Updated`,
        showConfirmButton: true,
        customClass: {
          icon: "swal-my-icon",
        },
        confirmButtonColor: "#7066E0",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/dashboard/myattendance");
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error updating attendance.",
        customClass: {
          icon: "swal-my-icon",
        },
        text: error?.response?.data?.message || "Please try again later.",
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl bg-white shadow-lg rounded-lg">
      <div className="my-9 text-center text-2xl font-bold text-gray-800">
        <h3>Students Attendance</h3>
      </div>
      <form onSubmit={handleSubmitAll}>
        <table className="min-w-full border border-gray-300 mb-8">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border border-gray-300 px-4 py-2 hidden">Content ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Roll Number</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Student Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Course Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Attendance Status</th>
            </tr>
          </thead>
          <tbody>
            {studentRecords.map((student) => (
              <tr key={student.student_id} className="hover:bg-gray-50 transition duration-150">
                <td className="border border-gray-300 px-4 py-2 hidden">
                  <input
                    type="text"
                    name="course_content_id"
                    value={detailID || ""}
                    className="w-full px-2 py-1 border rounded"
                    readOnly
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    name="student_ids"
                    value={student.student_id}
                    className="w-full px-2 py-1 border rounded"
                    readOnly
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    name="studentName"
                    value={`${student.first_name} ${student.last_name}`}
                    className="w-full px-2 py-1 border rounded"
                    readOnly
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    name="courseName"
                    value={student.course_name}
                    className="w-full px-2 py-1 border rounded"
                    readOnly
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    name="status"
                    value={attendanceStatuses[student.student_id]}
                    className="w-full px-2 py-1 border rounded bg-white text-gray-700"
                    onChange={(e) => handleStatusChange(student.student_id, e.target.value)}
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center">
          <Button
            type="submit"
            size="lg"
            className="my-5 font-bold max-w-[250px] bg-deep_orange-500 transition duration-200 hover:bg-[white] border hover:text-deep_orange-500 border-deep_orange-500"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AllowAttendance;
