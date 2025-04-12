import React, { useEffect, useState } from "react";
import profileImg from "assets/profile.jpg";
import { Heading, Button } from "components";
import { useAuthContext } from "hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "helper/axios";
import { Helmet } from "react-helmet";
import useCourseData from "hooks/useCourseData";
import Swal from "sweetalert2";
import CourseUpload from "pages/TeacherPages/CourseUpload";


const index = () => {
  const { user }: any = useAuthContext();
  const [myData, setMyData] = useState<any>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMyData();
  }, [user]);

  const getMyData = async () => {
    try {
      const response = await axios.get(`api/get_my_profile`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setMyData(response?.data?.data);
    } catch (error) {
      // console.error("Error getting Profile", error);
    }
  };
  const {isLoading} = useCourseData();
  const handleGetAdmissionClick = () => {
    if (myData.is_formsubmited) {
      if (myData.is_payment_done) {
        Swal.fire({
          title: "Access Restricted",
          text: "You have already completed the form submission and payment. Check Dashboard for more information",
          icon: "info",
          customClass: {
            icon: "swal-my-icon",
          },
          confirmButtonColor: "#7066E0",
          confirmButtonText: "OK",
        });
      } else {
        navigate("/payments");
      }
    } else {
      navigate("/getadmission");
    }
  };

  const [courses, setCourses] = useState([]);
  const [standards, setStandards] = useState([]);
  const [subjects, setSubjects] = useState([]);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`api/courses_all/`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setCourses(response.data.course_list);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [user.token]);

  const [demo, setDemo] = useState({
    course: "",
    standard: "",
    subject: "",
  });

  const [videoLinks, setVideoLinks] = useState([]);
  const [videoErr, setVideoErr] = useState(false);

  const handleChange = (fieldName: any, value: any) => {
    setDemo((prevData: any) => ({
      ...prevData,
      [fieldName]: value,
    }));
    if(fieldName === "course" && !value){ 
      setStandards([]);
      setSubjects([]);
      return;
    }
    else if(fieldName === "standard" && !value){
      setSubjects([]);
      return;
    }
    if (fieldName === "course") {
      handleCourseChange(value);
    } else if (fieldName === "standard") {
      handleStandardChange(value);
    } 
    else if (fieldName === "subject"){
      handleSubjectChange(value);
    }
  };

  const handleCourseChange = (course) => {
  
    console.log(course.course_name);
    const selectedCourse = courses.find(
      (c) => c.course_id.toString() === course
    );
    console.log(selectedCourse, 'selectedCourse')
    console.log(selectedCourse.course_name);
    
    if (selectedCourse) {
      setStandards(selectedCourse.standards || []);
      setSubjects([]);

      // Reset dependent fields
      setDemo((prev) => ({
        ...prev,
        standard: "",
        subject: "",
        course: selectedCourse.course_name,
      }));
    }
  };

  const handleStandardChange = (standard) => {
    const selectedStandard = standards.find(
      (s) => s.standard_id.toString() === standard
    );
    if (selectedStandard) {
      setSubjects(selectedStandard.subjects || []);

      // Reset dependent fields
      setDemo((prev) => ({
        ...prev,
        subject: "",
        standard: selectedStandard.standard_name
      }));
    }
  };

  const handleSubjectChange = (subjectId) => {
    const selectedSubject = subjects.find((s) => s.subject_id.toString() === subjectId);
    setDemo((prev) => ({
      ...prev,
      subject: selectedSubject.subject_name
    }));
};

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { course, standard, subject } = demo;
    console.log(demo, 'demo')
    try {
      const response = await axios.get(
        `api/videos/?course_name=${course}&standard_name=${standard}&subject_name=${subject}`,

        {

          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setVideoErr(false);
      setVideoLinks([]);
      setTimeout(() => {
        setVideoLinks(response.data);
      }, 100);
      console.log(response.data);
    } catch (error) {
      // console.error("Error Getting Video Links", error);
      setVideoErr(true);
    }
  };

  return (
    <>
      <Helmet>
        <title>Request Demo</title>
      </Helmet>

      <div className="py-8 mx-auto max-w-7xl p-4 lg:py-16">
        <h1 className="mb-5 text-4xl font-bold text-gray-900 dark:text-white">
          Demo
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
        <form
          onSubmit={handleSubmit}
          className="flex items-end justify-between w-full"
        >
          <div className="grid grid-cols-4 w-full gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <Heading
                size="md"
                className="block mb-2 text-sm font-bold text-gray-900 dark:text-white-A700"
              >
                Course
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
                    <option key={course.course_id} value={course.course_id}>
                      {course.course_name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="sm:col-span-2">
              <Heading
                size="md"
                className="block mb-2 text-sm font-bold text-gray-900 dark:text-white-A700"
              >
                Standard
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
                    <option key={standard.standard_id} value={standard.standard_id}>
                      {standard.standard_name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="sm:col-span-2">
              <Heading
                size="md"
                className="block mb-2 text-sm font-bold text-gray-900 dark:text-white-A700"
              >
                Subject
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
                    <option key={subject.subject_id} value={subject.subject_id}>
                      {subject.subject_name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="sm:col-span-2 mt-7">
              <Button
                type="submit"
                className="inline-flex items-center w-full h-[53px] text-sm font-medium text-center text-white-A700 bg-deep_orange-500 rounded-[20px] focus:ring-2 focus:ring-deep_orange-500 transition border border-deep_orange-500 hover:bg-white-A700 hover:text-deep_orange-500"
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
        {videoLinks.length > 0 && !videoErr && (
          <>
            {videoLinks?.map((link, index) => (
              <>
                <div key={index} className="w-full text-center my-5">
                  <h2 className="my-10 text-3xl">{link.name}</h2>
                  <video controls className="w-full rounded-lg">
                    <source src={link.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </>
            ))}
            <div className="flex justify-around items-center my-5">
              <Link to="/offlinedemo">
                <Button
                  type="submit"
                  className="inline-flex items-center  h-[53px] text-sm font-medium text-center text-white-A700 bg-deep_orange-500 rounded focus:ring-2 focus:ring-deep_orange-500 transition border border-deep_orange-500 hover:bg-white-A700 hover:text-deep_orange-500"
                >
                  Get Offline Demo
                </Button>
              </Link>
              {/* <Link to="/getadmission"> */}
              <Button
                type="submit"
                className="inline-flex items-center  h-[53px] text-sm font-medium text-center text-white-A700 bg-deep_orange-500 rounded focus:ring-2 focus:ring-deep_orange-500 transition border border-deep_orange-500 hover:bg-white-A700 hover:text-deep_orange-500"
                onClick={handleGetAdmissionClick}
              >
                Get Admission
              </Button>
              {/* </Link> */}
            </div>
          </>
        )}
        {videoErr && (
          <div className="flex flex-col items-center justify-center">
            <h2 className="my-5 text-center text-2xl">
              No Demo Video Available for selected course, standard, and
              subject, You can book offline demo instead
            </h2>
            <Link to="/offlinedemo">
              <Button
                type="submit"
                className="inline-flex items-center  h-[53px] text-sm font-medium text-center text-white-A700 bg-deep_orange-500 rounded focus:ring-2 focus:ring-deep_orange-500 transition border border-deep_orange-500 hover:bg-white-A700 hover:text-deep_orange-500"
              >
                Get Offline Demo
              </Button>
            </Link>
          </div>
        )}
        {!videoLinks.length && !videoErr && (
          <h2 className="my-5 text-center text-xl">
            Kindly Select course, standard, and subject & then{" "}
            <strong>Submit</strong>
          </h2>
        )}
      </div>
    </>
  );
};

export default index;
