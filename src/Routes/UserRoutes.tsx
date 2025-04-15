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
import UserDashboard from "pages/UserDashboard";
import MyCourses from "pages/MyCourses";
import Attendance from "pages/Attendance";
import Payments from "pages/Payments";
import UserProfile from "pages/UserProfile";
import StudentAnnouncements from "pages/UserAnnounceement";
import Assessment from "pages/Assessment";
import EditProfile from "pages/UserProfile/EditProfile";
import PrivacyPolicy from "pages/Privacypolicy";
import DataSecurity from "pages/Data_Security";
import TermsOfService from "pages/Terms_Service";
import InstallmentManagement from "pages/Payments/InstallmentPayment";
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
    {
      path: "/dashboard/user",
      element: user ? <UserDashboard /> : <Navigate to="/login" />,
    },
    {
      path: "/dashboard/mycourses",
      element: user ? <MyCourses /> : <Navigate to="/login" />,
    },
    {
      path: "/dashboard/myattendance",
      element: user ? <Attendance /> : <Navigate to="/login" />,
    },
    {
      path: "/dashboard/profile",
      element: user ? <UserProfile /> : <Navigate to="/login" />,
    },
    {
      path: "/dashboard/Editprofile",
      element: user ? <EditProfile /> : <Navigate to="/login" />,
    },
    {
      path: "/dashboard/assessment",
      element: user ? <Assessment /> : <Navigate to="/login" />,
    },
    {
      path: "/dashboard/myannouncement",
      element: user ? <StudentAnnouncements /> : <Navigate to="/login" />,
    },
   
    {
      path: "/dashboard/installment_payment",
      element: user ? <InstallmentManagement/> : <Navigate to="/login" />,
    },
    
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
      path: "/privacy_policy",
      element: <PrivacyPolicy/>  ,
    },
    {
      path: "/data_security",
      element: <DataSecurity/>,
    },
    {
      path: "/terms_service",
      element: <TermsOfService/>,
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

export default UserRoutes;
