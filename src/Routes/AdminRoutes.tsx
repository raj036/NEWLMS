import React, { useState, useEffect } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import { useAuthContext } from "hooks/useAuthContext";
import Enrolled from "pages/Enrolled";
import Dashboard from "pages/Dashboard";
import AdminNotFound from "pages/AdminNotFound";
import Enquiry from "pages/Enquiries";
import DemoForm from "pages/DemoForm";
import Users from "pages/Users";
import Courses from "pages/AdminCourses";
import Mail from "pages/Mail";
import StudentPayment from "pages/StudentPayment";
import AdminAnnouncements from "pages/AdminAnnouncement";
import Teachers from "pages/AdminTeacherPage";
import path from "path";
import AdminViewContent from "pages/AdminViewContent";
import FessCreate from "pages/AdminFeesCreate";
import AdminAssignedCourses from "pages/AdminAssignedCourses";
import AdminBranch from "pages/Adminbranches";
import PaymentDetails from "pages/AdminPaymentHistory";

const AdminRoutes = () => {
  const { user }: any = useAuthContext();

  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    setLoggedIn(Boolean(loggedUser));
  }, []);

  const protectedRoutes = [
    { path: "/", element: <Dashboard /> },
    {
      path: "enrolled",
      element: <Enrolled />,
    },
    {
      path: "users",
      element: <Users />,
    },
    {
      path: "enquiry",
      element: <Enquiry />,
    },
    {
      path: "mail",
      element: <Mail />,
    },
    {
      path: "demoform",
      element: <DemoForm />,
    },
    {
      path: "courses",
      element: <Courses />,
    },
    {
      path: "adminbranch",
      element: <AdminBranch />,
    },
    {
      path: "fees",
      element: <FessCreate />,
    },
    {
      path: "AdminAssignedCourses",
      element: <AdminAssignedCourses />,
    },
    {
      path: "payment",
      element: <StudentPayment />,
    },
    {
      path: "announcement",
      element: <AdminAnnouncements />,
    },
    {
      path: "tutor",
      element: <Teachers />,
    },
    {
      path: "adminview",
      element: <AdminViewContent />
    },
    {
      path: "paymenthistory",
      element: <PaymentDetails />
    }
  ];
  
  const getProtectedElement = (element: any, path: any) => {
    return user ? element : <Navigate to="/login" state={{ from: path }} />;
  };

  let element = useRoutes([
    // {
    //   path: "login",
    //   element: <LoginPage />,
    // },
    // {
    //   path: "signup",
    //   element: <SignUpPage />,
    // },
    ...protectedRoutes.map((route) => ({
      ...route,
      element: getProtectedElement(route.element, route.path),
    })),
    { path: "*", element: <AdminNotFound /> },
  ]);

  return loggedIn !== null && element;
};

export default AdminRoutes;
