import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Topbar from "components/Topbar";
import axios from "helper/axios";
import { useAuthContext } from "hooks/useAuthContext";
import { BookOpenText } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TeacherAttendance = () => {
  const { user }: any = useAuthContext();
  const [courseData, setCourseData] = useState([]);
  const [courseDetails, setCourseDetails] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedCourseDetailId, setSelectedCourseDetailId] = useState(null);

  const getCourseData = async () => {
    try {
      const response = await axios.get("/api/assigned_courses", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setCourseData(response?.data);
    } catch (error) {
      // console.error(error);
    }
  };

  const getCourseDetails = async (courseId: any) => {
    try {
      const response = await axios.get(`/api/course/${courseId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setCourseDetails(response.data.related_course_details);
      setSelectedCourseDetailId(response.data.related_course_details);
    } catch (error) {
      // console.log(error);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    getCourseData();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      getCourseDetails(selectedCourseId);
    }
  }, [selectedCourseId]);

  const handleCourseClick = (courseId: any) => {
    setSelectedCourseId(courseId);
  };

  const handleAttendancePage = (detailId: any) => {
    navigate(
      `/takeattendance?detailId=${detailId}&selectedCourseId=${selectedCourseId}`
    );
  };

  return (
    <>
      <Topbar heading={"Attendance"} />
      {courseData.length > 0 ? (
        <div className="ruby-disp">
          {courseData.map((tab, index) => (
            <div
              className=" m-4 cursor-pointer rounded-lg"
              key={index}
              onClick={() => handleCourseClick(tab.id)}
            >
              <div
                className={`flex rounded-[10px] items-center mb-2 bg-gray-100 p-3 w-[250px] border-[1px] ${
                  selectedCourseId === tab.id ? "bg-blue-200" : "bg-white"
                }`}
              >
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                  <BookOpenText className="h-5 w-5 text-gray-600" />
                </div>
                <span className="text-gray-700 font-semibold  ">
                  {tab.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 mt-20 ">
          <h1 className="px-11 text-[24px] text-[#002D51] font-semibold">
            Students details was not there .
          </h1>
        </div>
      )}

      {/* course details */}
      <div className="mt-20 px-11 ">
        {courseDetails.length > 0 ? (
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] bg-teal-900 text-white-A700">
                  Standard
                </TableHead>
                <TableHead className="text-center bg-teal-900 text-white-A700">
                  Subject
                </TableHead>
                <TableHead className="text-center bg-teal-900 text-white-A700">
                  Module
                </TableHead>
                <TableHead className="text-right bg-teal-900 text-white-A700">
                  Attendance
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courseDetails.map((ele, index) => (
                <TableRow key={index}>
                  <TableCell className="w-[100px]">
                    {ele.standard_name}
                  </TableCell>
                  <TableCell className="text-center">
                    {ele.subject_name}
                  </TableCell>
                  <TableCell className="text-center">
                    {ele.module_name}
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => handleAttendancePage(ele.id)}
                      className="border p-[6px] text-[white] z-10 transition hover:bg-white-A700 hover:text-deep_orange-500 border-deep_orange-500 bg-deep_orange-500"
                    >
                      Attendance
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default TeacherAttendance;
