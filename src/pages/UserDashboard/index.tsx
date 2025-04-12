import { Key, PlayIcon, PlusCircle, FileText, Video, ImageIcon } from 'lucide-react';
import Topbar from "components/Topbar";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "hooks/useAuthContext";
import axios from "helper/axios";

const UserDashboard = () => {
  const { user }: any = useAuthContext();
  const [courseData, setCourseData] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);

  // Function to get icon based on file type
  const getFileIcon = (filePath) => {
    const extension = filePath.split('.').pop().toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageIcon className="h-4 w-4 text-gray-500" />;
      case 'mp4':
      case 'mov':
      case 'avi':
        return <Video className="h-4 w-4 text-gray-500" />;
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'ppt':
      case 'pptx':
        return <FileText className="h-4 w-4 text-orange-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getCourseData = async () => {
    try {
      const response = await axios.get("api/course_active/enlrolled_course", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setCourseData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (showDashboard) {
      getCourseData();
    }
  }, [showDashboard]);

  const currentCourse = courseData[0]?.course_info;
  const lessons = courseData[0]?.lessons || [];

  const getFileType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    if (['mp4', 'webm', 'ogg', 'mov'].includes(extension)) return 'video';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'image';
    if (extension === 'pdf') return 'pdf';
    if (['ppt', 'pptx'].includes(extension)) return 'presentation';
    return 'unknown';
  };

  const renderContent = (contentPath) => {
    if (contentPath && contentPath.length > 0) {
      const filePath = contentPath[0];
      const fileType = getFileType(filePath);

      switch (fileType) {
        case 'video':
          return (
            <div className="w-full h-0 pb-[56.25%] relative">
              <video 
                controls 
                className="absolute top-0 left-0 w-full h-full object-contain"
              >
                <source src={filePath} type={`video/${filePath.split('.').pop()}`} />
                Your browser does not support the video tag.
              </video>
            </div>
          );

        case 'image':
          return (
            <img 
              src={filePath} 
              alt={activeLesson.title} 
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          );

        case 'pdf':
          return (
            <div className="w-full flex flex-col items-center">
              <iframe
                src={`${filePath}#view=FitH`}
                className="w-full h-[80vh]"
                title="PDF document"
              />
              <a 
                href={filePath}
                download
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
              >
                <FileText className="mr-2 h-4 w-4" />
                Download PDF
              </a>
            </div>
          );

        case 'presentation':
          return (
            <div className="w-full flex flex-col items-center">
              <div className="w-full h-[80vh] bg-gray-100 rounded-lg flex flex-col items-center justify-center p-8">
                <FileText className="h-16 w-16 text-orange-500 mb-4" />
                <p className="text-lg font-medium mb-4">PowerPoint Presentation</p>
                <p className="text-gray-600 mb-6">This file type cannot be previewed directly in the browser</p>
                <a 
                  href={filePath}
                  download
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Download Presentation
                </a>
              </div>
            </div>
          );

        default:
          return <p className="mt-4 text-gray-500">This file type is not supported for preview</p>;
      }
    }
    return <p className="mt-4 text-gray-500">No content available</p>;
  };

  return (
    <>
      <Topbar heading="Dashboard" />
      <div className="flex flex-col h-screen">
        <div className="p-4 bg-gray-100 flex">
          <button
            className="flex items-center justify-center w-72 py-2 px-4 bg-teal-900 text-white-A700 rounded-lg hover:!bg-blue-900 transition-colors"
            onClick={() => setShowDashboard(!showDashboard)}
          >
            <PlusCircle className="mr-2" />
            {showDashboard ? "Hide Dashboard" : "Your Course"}
          </button>
        </div>

        {showDashboard && (
          <div className="flex flex-row flex-grow overflow-hidden">
            {/* Left Section for Course Content List */}
            <div className="w-1/3 p-4 bg-gray-100 overflow-y-auto">
              {currentCourse && (
                <div className="text-xl font-semibold mb-4">
                  {currentCourse.course_name} - {currentCourse.standard_name} - {currentCourse.subject_name} - {currentCourse.module_name}
                </div>
              )}
              <div className="text-lg font-medium mb-2">Lessons:</div>
              <ul className="space-y-2 border-4 w-80">
                {lessons.length > 0 ? (
                  lessons.map((lesson) => (
                    <li
                      key={lesson.lesson_id}
                      className={`p-4 bg-white rounded-lg cursor-pointer hover:bg-blue-100 flex justify-between items-center ${
                        activeLesson?.lesson_id === lesson.lesson_id ? "bg-blue-100" : ""
                      }`}
                      onClick={() => setActiveLesson(lesson)}
                    >
                      <div className="flex items-center">
                        {getFileIcon(lesson.content_info.content_path[0])}
                        <span className="ml-2 block font-medium">{lesson.title}</span>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No lessons available</p>
                )}
              </ul>
            </div>

            {/* Right Section for Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              {activeLesson ? (
                <div className="w-full bg-white rounded-lg shadow-lg flex flex-col items-center justify-center p-4">
                  <h2 className="text-xl font-bold mb-4">{activeLesson.title}</h2>
                  <div className="w-full">
                    {renderContent(activeLesson.content_info.content_path)}
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    Created on: {activeLesson.content_info?.created_on 
                      ? new Date(activeLesson.content_info.created_on).toLocaleDateString() 
                      : "N/A"}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-white rounded-lg shadow-lg flex items-center justify-center">
                  <h1 className="text-3xl font-bold">Select a lesson to view details</h1>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserDashboard;