import React, { useEffect } from "react";
import UserRoutes from "./Routes/UserRoutes";
import AdminRoutes from "./Routes/AdminRoutes";
import { BrowserRouter as Router } from "react-router-dom";
import { initFlowbite } from "flowbite";
import { useAuthContext } from "hooks/useAuthContext";
import UserLayout from "Layout/UserLayout";
import AdminLayout from "Layout/AdminLayout";
import TeacherLayout from "Layout/TeacherLayout";
import TeacherRoutes from "Routes/TeacherRoutes";
import ParentLayout from "Layout/ParentLayout";
import ParentRoutes from "Routes/ParentRoutes";

function App() {
  const { user }: any = useAuthContext();

  useEffect(() => {
    initFlowbite();
  }, [user]);

  return (
    <>
      <Router>
        {user && user.user_type === "admin" ? (
          <AdminLayout>
            <AdminRoutes />
          </AdminLayout>
        ) : user && user.user_type === "teacher" ? (
          <TeacherLayout>
            <TeacherRoutes />
          </TeacherLayout>
        ) : user && user.user_type === "parent" ? (
          <ParentLayout>
            <ParentRoutes />
          </ParentLayout>
        ) : (
          <UserLayout>
            <UserRoutes />
          </UserLayout>
        )}
      </Router>
    </>
  );
}

export default App;
