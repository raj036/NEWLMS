import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "helper/axios";
import { useAuthContext } from "hooks/useAuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CourseUpload = () => {
  const [detailId, setDetailId] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courseDetailsUpload, setCourseDetailsUpload] = useState({
    standard_name: "",
    subject_name: "",
    module_name: "",
  });
  const [courseDataSend, setCourseDataSend] = useState({
    lesson_title: "",
    course_content_id: "",
    content_descriptions: "",
    files: null,
  });
  const { user }: any = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const detailId = queryParams.get("detailId");
    const selectedCourseId = queryParams.get("selectedCourseId");

    if (detailId) {
      setDetailId(detailId);
      setCourseDataSend((prevData) => ({
        ...prevData,
        course_content_id: detailId,
      }));
    }
    if (selectedCourseId) setSelectedCourseId(selectedCourseId);

    // Fetch data when the component mounts or when the query parameters change
    if (detailId && selectedCourseId) {
      fetchData(detailId, selectedCourseId);
    }
  }, [location.search]);

  const fetchData = async (detailId: any, selectedCourseId: any) => {
    try {
      const response = await axios.get(
        `/api/course/${selectedCourseId}/content/${detailId}`
      );
      setCourseDetailsUpload(response?.data);
    } catch (error) {
      // console.log(error);
    }
  };

  const handleChange = (fieldName: any, event: any) => {
    const value =
      fieldName === "files" ? event.target.files[0] : event.target.value;
    setCourseDataSend((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("lesson_title", courseDataSend.lesson_title);
      formData.append("course_content_id", courseDataSend.course_content_id);
      formData.append(
        "content_descriptions",
        courseDataSend.content_descriptions
      );
      if (courseDataSend.files) {
        formData.append("files", courseDataSend.files);
      }

      const response = await axios.post(`/api/content/with_lesson`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });
      Swal.fire({
        title: "Content created successfully!",
        confirmButtonColor: "#7066E0",
        customClass: {
          icon: "swal-my-icon",
        },
        icon: "success",
        confirmButtonText: "Yes",
      });
      navigate("/dashboard/mycourses");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title:
          error.response.data.detail ||
          "An error occured while creating content",
        text: "Please try again...",
        customClass: {
          icon: "swal-my-icon",
        },
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  return (
    <>
      <div className="mx-10 md:mx-6 md:mt-6 xs:mr-6 mt-10 sm:mb-8 sm:ml-4 my-56 mr-6 border-2 border-[black] p-5 rounded-[20px] md:w-[170%] xs:w-[125%] sm:w-[90%] sm:p-3 sm:mx-5">
        <form onSubmit={handleSubmit}>
          <div className="flex sm:flex-col gap-5  sm:gap-0  justify-between  ">
            <div className="w-[30%]">
              <div className="hidden">
                <h1 className="text-start font-semibold mb-3">Course ID</h1>
                <input
                  type="text"
                  name="course_content_id"
                  className="flex mb-12 sm:mb-4 h-12 !bg-[#002D51] sm:w-[330%] text-white-A700 !rounded-md border !border-slate-200 bg-white !px-3 !py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                  value={courseDataSend.course_content_id}
                  readOnly
                />
              </div>

              <div>
                <h1 className="text-start font-semibold mb-3">Standard</h1>
                <input
                  type="text"
                  className="flex h-12 mb-12 sm:mb-4 !bg-[#002D51] sm:w-[330%] text-white-A700 !rounded-md border !border-slate-200 bg-white !px-3 !py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                  value={courseDetailsUpload.standard_name}
                  readOnly
                />
              </div>
              <div>
                <h1 className="text-start font-semibold mb-3">Subject</h1>
                <input
                  type="text"
                  className="flex mb-12 h-12 sm:mb-4 !bg-[#002D51] sm:w-[330%]  text-white-A700 !rounded-md border !border-slate-200 bg-white !px-3 !py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                  value={courseDetailsUpload.subject_name}
                  readOnly
                />
              </div>
              <div>
                <h1 className="text-start font-semibold mb-3">Lesson name</h1>
                <input
                  type="text"
                  name="lesson_title"
                  className="flex  mb-12 h-12 sm:mb-4 !bg-[#002D51] sm:w-[330%]  text-white-A700 !rounded-md border !border-slate-200 bg-white !px-3 !py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                  onChange={(e) => handleChange("lesson_title", e)}
                />
              </div>
            </div>
            <div className="w-[30%]">
              <div>
                <h1 className="text-start font-semibold mb-3">Module</h1>
                <input
                  type="text"
                  className="flex h-12 mb-12 sm:mb-4 !bg-[#002D51] sm:w-[330%]  text-white-A700 !rounded-md border !border-slate-200 bg-white !px-3 !py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                  value={courseDetailsUpload.module_name}
                  readOnly
                />
              </div>
              <div>
                <div>
                  <h1 className="text-start font-semibold mb-3">
                    Content Description
                  </h1>
                  <input
                    type="text"
                    name="content_descriptions"
                    className="flex h-12 mb-12 sm:mb-4 !bg-[#002D51] sm:w-[330%]  text-white-A700 !rounded-md border !border-slate-200 bg-white !px-3 !py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                    onChange={(e) => handleChange("content_descriptions", e)}
                  />
                </div>
              </div>
            </div>
            <div className="max-w-md mx-auto p-6">
              <h2 className="text-2xl font-bold mb-4 text-center sm:text-[20px]">
                Upload files
              </h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="text-lg mb-2 text-center ">
                  <input
                    className=" sm:text-[11px] flex  justify-center p-3"
                    type="file"
                    placeholder="browse files"
                    name="files"
                    onChange={(e) => handleChange("files", e)}
                  />
                </p>
                <p className="text-sm text-gray-500 sm:text-[10px]">
                  Supported formats: JPEG, PNG, GIF, MP4, PDF, PSD, Word
                </p>
              </div>
            </div>

            {/* <button></button> */}
          </div>
          <div className="flex-none">
            <Button
              size="lg"
              type="submit"
              className="flex my-0 mx-auto  z-10 transition hover:bg-white-A700 border hover:text-deep_orange-500 border-deep_orange-500 bg-deep_orange-500"
            >
              Add Content
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CourseUpload;
