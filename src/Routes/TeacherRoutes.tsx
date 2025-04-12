import React, { useState, useEffect } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import NotFound from "pages/NotFound";
import Aboutus from "pages/Aboutus";
import ContactUs from "pages/ContactUs";
import LoginPage from "pages/LoginPage";
import SignUpPage from "pages/SignUpPage";
import Home from "pages/Home";
import GetAdmission from "pages/GetAdmission";
import RequestDemo from "pages/RequestDemo";
import OfflineDemo from "pages/OfflineDemo";
import { useAuthContext } from "hooks/useAuthContext";
import Payments from "pages/Payments";
import TeacherAttendance from "pages/TeacherPages/Attendance";
import TeacherProfile from "pages/TeacherPages/Profile";
import TeacherCourses from "pages/TeacherPages/Courses";
import TeacherDashboard from "pages/TeacherPages/Dashboard";
import TeacherAnnouncements from "pages/TeacherPages/Announcement";
import ViewContent from "pages/TeacherPages/ViewContent";
import CourseUpload from "pages/TeacherPages/CourseUpload";
import AllowAttendance from "pages/TeacherPages/AllowAttendance";
import Test_paper_create from "pages/TeacherPages/Test_paper_create";
import ResultCard from "pages/TeacherPages/ResultCard ";
import Question_prieview from "pages/TeacherPages/Question_prieview";
import TeacherEditProfile from "pages/TeacherPages/TeacherEditProfile";
import PrivacyPolicy from "pages/Privacypolicy";
import DataSecurity from "pages/Data_Security";
import TermsOfService from "pages/Terms_Service";


const UserRoutes = () => {
  const { user } = useAuthContext();

  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    setLoggedIn(Boolean(loggedUser));
  }, []);

  const protectedRoutes = [
    {
      path: "/getadmission",
      element: user ? <GetAdmission /> : <Navigate to="/login" />,
    },
    {
      path: "/requestdemo",
      element: user ? <RequestDemo /> : <Navigate to="/login" />,
    },
    {
      path: "/offlinedemo",
      element: user ? <OfflineDemo /> : <Navigate to="/login" />,
    },
    {
      path: "/payments",
      element: user ? <Payments /> : <Navigate to="/login" />,
    },
    // {
    //   path: "/dashboard/profile",
    //   element: user ? <TeacherDashboard /> : <Navigate to="/login" />,
    // },
    {
      path: "/dashboard/mycourses",
      element: user ? <TeacherCourses /> : <Navigate to="/login" />,
    },
    {
      path: "/dashboard/myattendance",
      element: user ? <TeacherAttendance /> : <Navigate to="/login" />,
    },
    {
      path: "/dashboard/user",
      element: user ? <TeacherProfile /> : <Navigate to="/login" />,
    },
    {
      path: "/dashboard/Edit",
      element: user ? <TeacherEditProfile /> : <Navigate to="/login" />,
    },
    {
      path: "/dashboard/myannouncements",
      element: user ? <TeacherAnnouncements /> : <Navigate to="/login" />,
    },
    {
      path: "/dashboard/testpapercreate",
      element: user ? <Test_paper_create /> : <Navigate to="/login" />,
    },
    
    {
      path: "/dashboard/resultCard",
      element: user ? <ResultCard /> : <Navigate to="/login" />,
    },
    {
      path: "/dashboard/questionprieview",
      element: user ? <Question_prieview /> : <Navigate to="/login" />,
    },
    {
      path: "/content",
      element: user ? <ViewContent /> : <Navigate to="/login" />,
    },
    {
      path: "/uploadcontent",
      element: user ? <CourseUpload /> : <Navigate to="/login" />,
    },
    {
      path: "/takeattendance",
      element: user ? <AllowAttendance /> : <Navigate to="/login" />,
    },
    {
      path: "/privacy_policy",
      element: user ? <PrivacyPolicy/> : <Navigate to="/login" />,
    },
    {
      path: "/data_security",
      element: user ? <DataSecurity/> : <Navigate to="/login" />,
    },
    {
      path: "/terms_service",
      element: user ? <TermsOfService/> : <Navigate to="/login" />,
    }
  ];

  const getProtectedElement = (element: any, path: any) => {
    return user ? element : <Navigate to="/login" state={{ from: path }} />;
  };

  let element = useRoutes([
    { path: "/", element: <Home /> },
    {
      path: "login",
      element: !user ? <LoginPage /> : <Navigate to={"/"} />,
    },
    // {
    //   path: "parentlogin",
    //   element: !user ? <ParentLoginPage /> : <Navigate to={"/"} />,
    // },
    {
      path: "signup",
      element: !user ? <SignUpPage /> : <Navigate to={"/"} />,
    },
    {
      path: "aboutus",
      element: <Aboutus />,
    },
    {
      path: "contactus",
      element: <ContactUs />,
    },
    ...protectedRoutes.map((route) => ({
      ...route,
      element: getProtectedElement(route.element, route.path),
    })),
    { path: "*", element: <NotFound /> },
  ]);

  return loggedIn !== null && element;
};

export default UserRoutes;
