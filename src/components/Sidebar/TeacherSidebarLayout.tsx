import React, { useEffect } from "react";
import Sidebar, { SidebarItem } from ".";
import {
  LayoutDashboard,
  CalendarCheck2,
  LibraryBig,
  UserRound,
  MicVocal,
  FilePlus,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "hooks/useAuthContext";
import { initFlowbite } from "flowbite";
import { CheckCircle } from 'lucide-react';

const TeacherSidebarLayout = () => {
  const location = useLocation();
  const { user }: any = useAuthContext();

  useEffect(() => {
    initFlowbite();
  }, [user]);

  return (
    <>
      <div>
        <Sidebar>
          <Link to={"/dashboard/user"}>
            <SidebarItem
              icon={<UserRound size={20} />}
              text="Profile"
              active={location.pathname === "/dashboard/user"}
            />
          </Link>
          {/* <Link to={"/dashboard/user"}>
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              text="Dashboard"
              active={location.pathname === "/dashboard/user"}
            />
          </Link> */}
          <Link to={"/dashboard/mycourses"}>
            <SidebarItem
              icon={<LibraryBig size={20} />}
              text="Courses"
              active={location.pathname === "/dashboard/mycourses"}
            />
          </Link>
          <Link to={"/dashboard/myattendance"}>
            <SidebarItem
              icon={<CalendarCheck2 size={20} />}
              text="Attendance"
              active={location.pathname === "/dashboard/myattendance"}
            />
          </Link>
          <Link to={"/dashboard/testpapercreate"}>
            <SidebarItem
              icon={<FilePlus size={20}  />}
              text="Test Create"
              active={location.pathname === "/dashboard/testpapercreate"}
            />
          </Link>
          <Link to={"/dashboard/resultCard"}>
            <SidebarItem
              icon={<CheckCircle size={20} />}
              text=" Test Result"
              active={location.pathname === "/dashboard/resultCard"}
            />
          </Link>
          <Link to={"/dashboard/myannouncements"}>
            <SidebarItem
              icon={<MicVocal size={20} />}
              text="Announcements"
              active={location.pathname === "/dashboard/myannouncements"}
            />
          </Link>
        </Sidebar>
      </div>
    </>
  );
};

export default TeacherSidebarLayout;
