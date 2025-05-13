import { Button } from "@/components/ui/button";
import Topbar from "components/Topbar";
import axios from "helper/axios";
import { useAuthContext } from "hooks/useAuthContext";
import { ArrowLeft, CreditCardIcon, Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaMoneyCheckAlt } from "react-icons/fa"; // install react-icons if not already installed
import InstallmentPayment from "pages/Payments/InstallmentPayment";

const UserProfile = () => {
  const { user }: any = useAuthContext();
  const [studentData, setStudentData] = useState({
    student_id: null,
    profile_photo: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    nationality: "",
    branch_name: "",
    referral: "",
    date_of_joining: "",
    date_of_completion: "",
    id_proof_url: "",
    address_proof_url: null,
    contact_info: {
      primary_no: "",
      secondary_no: "",
      primary_email: "",
      secondary_email: "",
      current_address: "",
      permanent_address: "",
    },
    pre_education: {
      student_class: "",
      school: "",
      year_of_passing: 0,
      percentage: 0,
    },
    parent_info: {
      p_first_name: "",
      p_middle_name: "",
      p_last_name: "",
      guardian: "",
      primary_no: "",
      primary_email: "",
    },
    course_details: {
      courses: { name: "" },
      standards: { name: "" },
      subjects: { name: "" },
      modules: { name: "" },
    },
    payment_details: {
      amount: "",
      payment_mode: "",
      created_on: "",
      modules: "",
    },
  });
  const [activeSection, setActiveSection] = useState('Personal Info');
  const profilePhotoUrl = studentData?.profile_photo || 'https://via.placeholder.com/150';

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = () => {
    axios
      .get(`api/admission/${user.user_id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      .then((response) => {
        setStudentData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  const handleInputChange = (e, section = null) => {
    const { name, value } = e.target;
    if (section) {
      setStudentData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value,
        },
      }));
    } else {
      setStudentData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      student_update: {
        first_name: studentData.first_name,
        middle_name: studentData.middle_name,
        last_name: studentData.last_name,
        date_of_birth: studentData.date_of_birth,
        gender: studentData.gender,
        nationality: studentData.nationality,
        referral: studentData.referral,
        date_of_joining: studentData.date_of_joining,
        date_of_completion: studentData.date_of_completion,
      },
      contact_info: studentData.contact_info,
      pre_education: studentData.pre_education,
      parent_info: studentData.parent_info,
    };

    axios
      .put(`/api/admission/${studentData.student_id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        Swal.fire({
          text: "Profile updated successfully",
          icon: "success",
          confirmButtonColor: "#7066E0",
          confirmButtonText: "OK",
        });
      })
      .catch((error) => {
        console.error("There was an error updating the data!", error);
        Swal.fire({
          text: "Failed to update profile",
          icon: "error",
          confirmButtonColor: "#7066E0",
          confirmButtonText: "OK",
        });
      });
  };



  const renderSection = () => {
    switch (activeSection) {
      case 'Personal Info':
        return (
          <div className="p-5">
            <h2 className="font-semibold text-[18px] mb-4">Personal Information</h2>
            <div className="rounded-[10px] shadow-lg p-4 w-[900px]">
              {[
                { label: "First Name", name: "first_name" },
                { label: "Middle Name", name: "middle_name" },
                { label: "Last Name", name: "last_name" },
                { label: "Date of Birth", name: "date_of_birth", type: "date" },
                { label: "Gender", name: "gender" },
                { label: "Nationality", name: "nationality" },
                { label: "Branch", name: "branch_name", readOnly: true },
                { label: "Referral", name: "referral" },
                { label: "Date of Joining", name: "date_of_joining", type: "date" },
                { label: "Date of Completion", name: "date_of_completion", type: "date" },
              ].map((field) => (
                <div key={field.name} className="flex justify-between border-b-2 py-2">
                  <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                    {field.label}:
                  </span>
                  <input
                    type={field.type || "text"}
                    className="w-[60%]"
                    name={field.name}
                    value={studentData[field.name]}
                    onChange={handleInputChange}
                    readOnly={field.readOnly}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case 'Contact Info':
        return (
          <div className="p-5">
            <h2 className="font-semibold text-[18px] mb-4">Contact Information</h2>
            <div className="rounded-[10px] shadow-lg p-4 w-[900px]">
              {[
                { label: "Primary No", name: "primary_no" },
                { label: "Secondary No", name: "secondary_no" },
                { label: "Primary Email", name: "primary_email", type: "email" },
                { label: "Secondary Email", name: "secondary_email", type: "email" },
                { label: "Current Address", name: "current_address" },
                { label: "Permanent Address", name: "permanent_address" },
              ].map((field) => (
                <div key={field.name} className="flex justify-between border-b-2 py-2">
                  <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                    {field.label}:
                  </span>
                  <input
                    type={field.type || "text"}
                    className="w-[60%]"
                    name={field.name}
                    value={studentData.contact_info[field.name]}
                    onChange={(e) => handleInputChange(e, "contact_info")}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case 'Pre Education':
        return (
          <div className="p-5">
            <h2 className="font-semibold text-[18px] mb-4">Pre Education</h2>
            <div className="rounded-[10px] shadow-lg p-4 w-[900px]">
              {[
                { label: "Student Class", name: "student_class" },
                { label: "School", name: "school" },
                { label: "Year of Passing", name: "year_of_passing", type: "number" },
                { label: "Percentage", name: "percentage", type: "number" },
              ].map((field) => (
                <div key={field.name} className="flex justify-between border-b-2 py-2">
                  <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                    {field.label}:
                  </span>
                  <input
                    type={field.type || "text"}
                    className="w-[60%]"
                    name={field.name}
                    value={studentData.pre_education[field.name]}
                    onChange={(e) => handleInputChange(e, "pre_education")}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case 'Parent Info':
        return (
          <div className="p-5">
            <h2 className="font-semibold text-[18px] mb-4">Parent Information</h2>
            <div className="rounded-[10px] shadow-lg p-4 w-[900px]">
              {[
                { label: "Parent First Name", name: "p_first_name" },
                { label: "Parent Middle Name", name: "p_middle_name" },
                { label: "Parent Last Name", name: "p_last_name" },
                { label: "Guardian", name: "guardian" },
                { label: "Primary No", name: "primary_no" },
                { label: "Primary Email", name: "primary_email", type: "email" },
              ].map((field) => (
                <div key={field.name} className="flex justify-between border-b-2 py-2">
                  <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                    {field.label}:
                  </span>
                  <input
                    type={field.type || "text"}
                    className="w-[60%]"
                    name={field.name}
                    value={studentData.parent_info[field.name]}
                    onChange={(e) => handleInputChange(e, "parent_info")}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case "Course Details":
        return (
          <div className="p-5">
            <h2 className="font-semibold text-[18px] mb-4">Course Details</h2>
            <div className="rounded-[10px] shadow-lg p-4 w-[900px]">
              {studentData.course_details ? (
                <>
                  <div>
                    <h4 className="font-semibold dark:text-gray-200 mb-2 text-indigo-500">
                      Course Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between border-b-2 py-2">
                        <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">Branch:</span>
                        <span className="w-[60%]">{studentData.branch_name || "N/A"}</span>
                      </div>
                      <div className="flex justify-between border-b-2 py-2">
                        <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">Course Name:</span>
                        <span className="w-[60%]">
                          {studentData.course_details.courses?.name || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b-2 py-2">
                        <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">Standard:</span>
                        <span className="w-[60%]">
                          {studentData.course_details.standards?.name || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b-2 py-2">
                        <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">Subject:</span>
                        <span className="w-[60%]">
                          {studentData.course_details.subjects?.name || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b-2 py-2">
                        <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">Module:</span>
                        <span className="w-[60%]">
                          {studentData.course_details.modules?.name || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p>Course details are not available.</p>
              )}
            </div>
          </div>
        );

      // case 'Payment Details':
      //   return (
      //     <div className="p-5">
      //       <h2 className="font-semibold text-[18px] mb-4">Pyments Details</h2>
      //       <div className="rounded-[10px] shadow-lg p-4 w-[900px]">
      //         {studentData.payment_details ? (
      //           <>
      //             <div>
      //               <h4 className="font-semibold dark:text-gray-200 mb-2 text-indigo-500">
      //                 Pyments Information
      //               </h4>
      //               <div className="space-y-2">
      //                 <div className="flex justify-between border-b-2 py-2">
      //                   <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">Amount:</span>
      //                   <span className="w-[60%]">{studentData.payment_details?.amount || "N/A"}</span>
      //                 </div>
      //                 <div className="flex justify-between border-b-2 py-2">
      //                   <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">Payment Mode:</span>
      //                   <span className="w-[60%]">
      //                     {studentData.payment_details?.payment_mode || "N/A"}
      //                   </span>
      //                 </div>
      //                 <div className="flex justify-between border-b-2 py-2">
      //                   <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">Created on:</span>
      //                   <span className="w-[60%]">
      //                     {studentData.payment_details?.created_on || "N/A"}
      //                   </span>
      //                 </div>


      //               </div>
      //             </div>
      //           </>
      //         ) : (
      //           <p>Course details are not available.</p>
      //         )}
      //       </div>
      //     </div>
      //   );
        case "Pay Installment":
          return (
            <div className=" m-auto">
            <InstallmentPayment/>
            </div>
          );


      default:
        return null;
    }
  };

  return (
    <>
      <Topbar heading={"Profile"} />
      <div className="flex justify-center items-start min-h-screen bg-gray-50">
        {/* Left Sidebar */}
        <div className=" bg-gray-100 p-6 shadow-lg rounded-lg w-80 ml-8 mt-8 h-[50rem]">
          {/* Profile Photo */}
          <div className="mb-6 flex justify-center">
           {studentData.profile_photo ? (
              <img
                src={studentData.profile_photo}
                alt={`${studentData.first_name}'s profile pic`}
                className="w-40 h-40 rounded-full object-cover"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-indigo-500 text-white flex items-center justify-center text-5xl font-bold">
                {studentData.first_name?.charAt(0).toUpperCase() || 'User'}
              </div>
            )}
          </div>
          {/* Student Name */}
          <h2 className="text-2xl font-bold mb-6 text-center">
            {studentData.first_name || 'Student'} {studentData.last_name || ''}
          </h2>
          <Link
            to="/dashboard/Editprofile"
            className="text-blue-600 hover:underline mb-6 block text-center flex items-center justify-center"
          >
            <Pencil className="mr-2" />
            Edit profile
          </Link>

          {/* Navigation */}
          <nav>
            <ul className="space-y-3">
              {['Personal Info', 'Contact Info', 'Pre Education', 'Parent Info', 'Course Details', 'Pay Installment'].map((item) => (
                <li
                  key={item}
                  className={`p-3 cursor-pointer rounded ${activeSection === item ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                  onClick={() => setActiveSection(item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          <form onSubmit={handleSubmit}>
            {renderSection()}
            <div className="my-[50px] text-center">
              {/* <Button
                size="lg"
                type="submit"
                className="font-bold max-w-[250px] z-10 transition hover:bg-white-A700 border bg-deep_orange-500 hover:text-deep_orange-500 border-deep_orange-500"
              >
                Update
              </Button> */}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserProfile;