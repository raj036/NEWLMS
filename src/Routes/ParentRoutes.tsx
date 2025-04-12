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
import ParentAttendance from "pages/Parent/attendence";
import ParentProfile from "pages/Parent/profile";
import ParentAnnouncements from "pages/Parent/announcements";
import ParentReports from "pages/Parent/report";
import ParentDashboard from "pages/Parent/Dashboard";
import PrivacyPolicy from "pages/Privacypolicy";
import DataSecurity from "pages/Data_Security";
import TermsOfService from "pages/Terms_Service";

const ParentRoutes = () => {
  const { user } = useAuthContext();

  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    setLoggedIn(Boolean(loggedUser));
  }, []);

  const protectedRoutes = [
    // {
    //   path: "/getadmission",
    //   element: user ? <GetAdmission /> : <Navigate to="/login" />,
    // },
    // {
    //   path: "/requestdemo",
    //   element: user ? <RequestDemo /> : <Navigate to="/login" />,
    // },
    // {
    //   path: "/offlinedemo",
    //   element: user ? <OfflineDemo /> : <Navigate to="/login" />,
    // },
    // {
    //   path: "/payments",
    //   element: user ? <Payments /> : <Navigate to="/login" />,
    // },bmn b bjgm  nbb hg  hb bvjhbv jbhvb hjvjhywenzx ue   cxmjhmwhgbddnbbgdjbuhgdbzjhxgbdm
    {
      path: "/dashboard/reports",
      element: user ? <ParentReports /> : <Navigate to="/login" />,
    },
    {
      path: "/dashboard/myattendance",
      element: user ? <ParentAttendance /> : <Navigate to="/login" />,
    },
    {
      path: "/dashboard/profile",
      element: user ? <ParentProfile /> : <Navigate to="/login" />,
    },
    {
      path: "/dashboard/announcements",
      element: user ? <ParentAnnouncements /> : <Navigate to="/login" />,
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

export default ParentRoutes;
