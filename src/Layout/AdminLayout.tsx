import React from "react";
import AdminSidebarLayout from "components/Sidebar/AdminSidebarLayout";

const AdminLayout = ({ children }) => {
  return (
    <>
      <div className="flex">
        <AdminSidebarLayout />
        <div className="flex-1 min-h-screen">{children}</div>
      </div>
    </>
  );
};

export default AdminLayout;
