import axios from "helper/axios";
import { useAuthContext } from "hooks/useAuthContext"; // Assuming you're using this for authentication
import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react"; // Add the arrow icon
import { useNavigate } from "react-router-dom"; // Add this for navigation

const AdminAssignedCourses = () => {
  const { user }: any = useAuthContext(); // Assuming you're fetching the user token from context
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); // Use the useNavigate hook

  // Fetch courses assigned to the teacher
  useEffect(() => {
    const fetchAssignedCourses = async () => {
      try {
        const response = await axios.get(`/api/teacher_assigned_courses/`, {
          headers: {
            Authorization: `Bearer ${user.token}`, // Add token for authenticated requests
          },
        });
        setAssignedCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load courses.");
        setLoading(false);
      }
    };

    fetchAssignedCourses();
  }, [user.token]); 

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Teacher Assigned Courses List{" "}
      </h2>
      <button
        onClick={handleBackClick}
        className="flex items-center space-x-2 text-teal-900 hover:text-blue-900"
      >
        <ArrowLeft className="w-6 h-6" />
        <span>Back</span>
      </button>
      {assignedCourses.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md mt-7 mb-14">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Course Name</th>
              <th className="py-2 px-4 border-b text-left">Subject</th>
              <th className="py-2 px-4 border-b text-left">Standard</th>
              <th className="py-2 px-4 border-b text-left">Module</th>
              <th className="py-2 px-4 border-b text-left">Teacher Name</th>
            </tr>
          </thead>
          <tbody>
            {assignedCourses.map((ele: any, index: number) => (
              <tr
                key={index}
                className="hover:bg-gray-100 transition-colors duration-200"
              >
                <td className="py-2 px-4 border-b">{ele.course_name}</td>
                <td className="py-2 px-4 border-b">{ele.subject_name}</td>
                <td className="py-2 px-4 border-b">{ele.standard_name}</td>
                <td className="py-2 px-4 border-b">{ele.module_name}</td>
                <td className="py-2 px-4 border-b">{ele.teacher_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center mt-4">No courses were assigned to any teachers.</div>
      )}
    </div>
  );
};

export default AdminAssignedCourses;
