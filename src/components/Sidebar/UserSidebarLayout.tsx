import React, { useEffect } from "react";
import Sidebar, { SidebarItem } from ".";
import {
  LayoutDashboard,
  CalendarCheck2,
  LibraryBig,
  UserRound,
  Mic2Icon,
  CheckSquare,
  CreditCardIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "hooks/useAuthContext";
import { initFlowbite } from "flowbite";

const UserSidebarLayout = () => {
  const location = useLocation();
  const { user }: any = useAuthContext();

  useEffect(() => {
    initFlowbite();
  }, [user]);

  return (
    <>
      {user && user.user_type === "student" && (
        <div>
          <Sidebar>
            <Link to={"/dashboard/profile"}>
              <SidebarItem
                icon={<UserRound size={20} />}
                text="Profile"
                active={location.pathname === "/dashboard/profile"}
              />
            </Link>
            <Link to={"/dashboard/user"}>
              <SidebarItem
                icon={<LayoutDashboard size={20} />}
                text="Dashboard"
                active={location.pathname === "/dashboard/user"}
              />
            </Link>
            {/* <Link to={"/dashboard/mycourses"}>
              <SidebarItem
                icon={<LibraryBig size={20} />}
                text="Courses"
                active={location.pathname === "/dashboard/mycourses"}
              />
            </Link> */}
            <Link to={"/dashboard/myattendance"}>
              <SidebarItem
                icon={<CalendarCheck2 size={20} />}
                text="Attendance"
                active={location.pathname === "/dashboard/myattendance"}
              />
            </Link>
            <Link to={"/dashboard/assessment"}>
              <SidebarItem
                icon={<CheckSquare size={20} />}
                text="Assessment"
                active={location.pathname === "/dashboard/assessment"}
              />
            </Link>
            <Link to={"/dashboard/myannouncement"}>
              <SidebarItem
                icon={<Mic2Icon size={20} />}
                text="Announcement"
                active={location.pathname === "/dashboard/myannouncement"}
              />
            </Link>
            
          </Sidebar>
        </div>
      )}

      {/* {user && user.user_type === "parent" && (
        <div>
          <Sidebar>
            <Link to={"/dashboard/profile"}>
              <SidebarItem
                icon={<UserRound size={20} />}
                text="Profile"
                active={location.pathname === "/dashboard/profile"}
              />
            </Link>
            <Link to={"/dashboard/user"}>
              <SidebarItem
                icon={<UserRound size={20} />}
                text="Dashboard"
                active={location.pathname === "/dashboard/user"}
              />
            </Link>
            <Link to={"/dashboard/reports"}>
              <SidebarItem
                icon={<LayoutDashboard size={20} />}
                text="Reports"
                active={location.pathname === "/dashboard/reports"}
              />
            </Link>
            <Link to={"/dashboard/myattendance"}>
              <SidebarItem
                icon={<CalendarCheck2 size={20} />}
                text="Attendance"
                active={location.pathname === "/dashboard/myattendance"}
              />
            </Link>
            <Link to={"/dashboard/announcements"}>
              <SidebarItem
                icon={<Mic2Icon size={20} />}
                text="Announcements"
                active={location.pathname === "/dashboard/announcements"}
              />
            </Link>
          </Sidebar>
        </div>
      )} */}
    </>
  );
};

export default UserSidebarLayout;
