import Topbar from "components/Topbar";
import React, { useEffect, useState } from "react";
import { EllipsisVertical, BookOpenTextIcon } from "lucide-react";
import axios from "helper/axios";
import { useAuthContext } from "hooks/useAuthContext";

const UserDashboard = () => {
  const { user }: any = useAuthContext();
  const [activeTab, setActiveTab] = useState(0);
  const [courseData, setCourseData] = useState([]);

  const getCourseData = async () => {
    try {
      const response = await axios.get("api/courses/unique", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setCourseData(response?.data?.unique_courses);
    } catch (error) {
      // console.error(error);
    }
  };

  useEffect(() => {
    getCourseData();
  }, []);

  return (
    <>
      <Topbar heading={"Dashboard"} />
      <div className="flex space-x-4 p-4  sm:flex-col sm:p-7 ">
        {courseData.map((tab, index) => (
          <div
            key={index}
            className={`flex items-center justify-between md:h-20 sm:ml-4 p-4 w-1/3 sm:w-full sm:mb-5 bg-white rounded-lg shadow-md cursor-pointer ${
              index === activeTab ? "border-2 border-gray-300" : "border"
            }`}
            onClick={() => setActiveTab(index)}
          >
            <div className="flex items-center">
              <BookOpenTextIcon className="w-10 h-10 text-gray-600 p-2 rounded-[5px] bg-[#BCBCBC]" />
              <div className="ml-4">
                {/* <span className="block text-gray-600 text-[15px]">
                  {tab}
                </span> */}
                <span className="block font-semibold text-gray-800">{tab}</span>
              </div>
            </div>
            <div className="text-gray-400">
              <EllipsisVertical />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserDashboard;
