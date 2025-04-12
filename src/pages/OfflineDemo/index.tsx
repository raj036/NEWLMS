import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Heading, Button, Input } from "components";
import { useAuthContext } from "hooks/useAuthContext";
import profileImg from "assets/profile.jpg";
import axios from "helper/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useCourseData from "hooks/useCourseData";

const index = () => {
  const { user }: any = useAuthContext();
  const { courses, standards, subjects, error } = useCourseData();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_id: user.user_id,
    name: user.user_name,
    email_id: user.email_id,
    contact_no: user.phone_no.toString(),
    course: "",
    standard: "",
    subject: "",
    school: "",
    teaching_mode: "",
    other_info: "",
  });

  const handleChange = (fieldName: any, value: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await axios.post("api/demoformfill/", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (response.status === 200) {
        Swal.fire({
          title: "Offline Demo Form Submitted!",
          text: "Kindly Wait for Confirmation from the Office.",
          icon: "success",
          confirmButtonColor: "#7066E0",
          customClass: {
            icon: "swal-my-icon",
          },
          confirmButtonText: "Yes",
        }).then((result: { isConfirmed: any }) => {
          if (result.isConfirmed) {
            setIsLoading(false);
            navigate("/");
          }
        });
      }
    } catch (error) {
      setIsLoading(false);
      // console.error("Error Submitting Offline Demo Form", error);
      if (error || error.response.status === 400) {
        Swal.fire({
          title: "Error Submitting Offline Demo Form!",
          icon: "error",
          customClass: {
            icon: "swal-my-icon",
          },
          showConfirmButton: true,
          confirmButtonColor: "red",
        }).then((result: { isConfirmed: any }) => {
          if (result.isConfirmed) {
            navigate("/");
          }
        });
      }
    }
  };

  const input = [
    {
      label: "School",
      type: "text",
      name: "school",
      id: "school",
      placeholder: "Enter School Name",
    },
    {
      label: "Other Information",
      type: "text",
      name: "other_info",
      id: "other_info",
      placeholder: "Enter Other Information",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Offline Demo</title>
      </Helmet>

      <section className="bg-white dark:bg-gray-900 my-10">
        <div className="py-8 px-4 mx-auto max-w-3xl lg:py-16">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Offline Demo Form
          </h1>
          <div className="flex items-center justify-start gap-4 my-4">
            <div>
              <img
                loading="lazy"
                src={profileImg}
                className="w-28 h-28 rounded-full border"
                alt="Profile"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Heading className="text-black-900">{user.user_name}</Heading>
              <p className="text-gray-500">{user.email_id}</p>
              <p className="text-gray-500">{user.phone_no}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Course<span className="text-red-500">*</span>
                </Heading>
                <select
                  name="course"
                  id="course"
                  className="p-4 bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-[20px] focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  onChange={(e) => handleChange("course", e.target.value)}
                  required
                >
                  <option value="">Select a course...</option>
                  {isLoading ? (
                    <option value="loading">Loading...</option>
                  ) : (
                    courses.map((course) => (
                      <option key={course.id} value={course.name}>
                        {course.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Standard<span className="text-red-500">*</span>
                </Heading>
                <select
                  name="standard"
                  id="standard"
                  className="p-4 bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-[20px] focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  onChange={(e) => handleChange("standard", e.target.value)}
                  required
                >
                  <option value="">Select a standard...</option>
                  {isLoading ? (
                    <option value="loading">Loading...</option>
                  ) : (
                    standards.map((standard) => (
                      <option key={standard.id} value={standard.name}>
                        {standard.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="sm:col-span-2">
                <Heading
                  size="s"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Subject<span className="text-red-500">*</span>
                </Heading>
                <select
                  name="subject"
                  id="subject"
                  className="p-4 bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-[20px] focus:ring-white-A700 focus:border-white-A700 block w-full"
                  onChange={(e) => handleChange("subject", e.target.value)}
                  required
                >
                  <option value="">Select a subject...</option>
                  {isLoading ? (
                    <option value="loading">Loading...</option>
                  ) : (
                    subjects.map((subject) => (
                      <option key={subject.id} value={subject.name}>
                        {subject.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              {input.map((i) => (
                <div key={i.id} className="sm:col-span-2">
                  <Heading
                    size="s"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white-A700"
                  >
                    {i.label} <span className="text-red-500">*</span>
                  </Heading>
                  <Input
                    size="xs"
                    type={i.type}
                    name={i.name}
                    id={i.id}
                    onChange={(value: any) => handleChange(`${i.name}`, value)}
                    className="bg-teal-900 border border-teal-900 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    placeholder={i.placeholder}
                    required
                  />
                </div>
              ))}

              <div className="flex w-full justify-around items-center my-1">
                <Heading
                  size="s"
                  className="block text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Teaching Mode
                </Heading>
                <div className="sm:col-span-2 flex items-center justify-around">
                  <label className="flex items-center mx-2">
                    <input
                      type="radio"
                      name="teaching_mode"
                      value="offline"
                      onChange={(e) =>
                        handleChange(`teaching_mode`, e.target.value)
                      }
                      required
                    />
                    <span className="ml-1 text-sm">Teach Offline</span>
                  </label>
                  <label className="flex items-center mx-2">
                    <input
                      type="radio"
                      name="teaching_mode"
                      value="online"
                      onChange={(e) =>
                        handleChange(`teaching_mode`, e.target.value)
                      }
                      required
                    />
                    <span className="ml-1 text-sm">Teach Online</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-center mt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center h-12 w-full max-w-xs px-5 py-2 mt-4 sm:mt-6 text-sm font-medium text-center text-white-A700 bg-deep_orange-500 rounded-lg focus:ring-2 focus:ring-deep_orange-500 transition border border-deep_orange-500 hover:bg-white-A700 hover:text-deep_orange-500"
              >
                {isLoading ? (
                  <>
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline mr-3 w-4 h-4 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      ></path>
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>Submit</span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default index;
