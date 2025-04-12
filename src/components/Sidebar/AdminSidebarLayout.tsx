import React from "react";
import Sidebar, { SidebarItem } from ".";
import {
  LayoutDashboard,
  User,
  BadgeInfo,
  Presentation,
  GraduationCap,
  LibraryBig,
  Mail,
  IndianRupee,
  BookOpenText,
  Mic2Icon,
  BookMarked,
  Home,
  IndianRupeeIcon
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const AdminSidebarLayout = () => {
  const location = useLocation();

  return (
    <>
      <div>
        <Sidebar>
          <Link to={"/"}>
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              text="Dashboard"
              active={location.pathname === "/"}
            />
          </Link>
          <Link to={"/users"}>
            <SidebarItem
              icon={<User size={20} />}
              text="Users"
              active={location.pathname === "/users"}
            />
          </Link>
          {/* <Link to={"/courses"}>
            <SidebarItem
              icon={<LibraryBig size={20} />}
              text="Courses"
              active={location.pathname === "/courses"}
            />
          </Link> */}
          <Link to={"/enrolled"}>
            <SidebarItem
              icon={<GraduationCap size={20} />}
              text="Enrolled"
              active={location.pathname === "/enrolled"}
            />
          </Link>
          <Link to={"/tutor"}>
            <SidebarItem
              icon={<BookMarked size={20} />}
              text="Tutor"
              active={location.pathname === "/tutor"}
            />
          </Link>
          <Link to={"/demoform"}>
            <SidebarItem
              icon={<Presentation size={20} />}
              text="Demo"
              active={location.pathname === "/demoform"}
            />
          </Link>
          <Link to={"/mail"}>
            <SidebarItem
              icon={<Mail size={20} />}
              text="Mail"
              active={location.pathname === "/mail"}
            />
          </Link>
          <Link to={"/enquiry"}>
            <SidebarItem
              icon={<BadgeInfo size={20} />}
              text="Admission"
              active={location.pathname === "/enquiry"}
            />
          </Link>
          <Link to={"/payment"}>
            <SidebarItem
              icon={<IndianRupee size={20} />}
              text="Payment"
              active={location.pathname === "/payment"}
            />
          </Link>
          <Link to={"/courses"}>
            <SidebarItem
              icon={<BookOpenText size={20} />}
              text="Courses"
              active={location.pathname === "/courses"}
            />
          </Link>

          <Link to={"/adminbranch"}>
            <SidebarItem
              icon={<Home size={20} />}
              text="Branch"
              active={location.pathname === "/branch"}
            />
          </Link>

          <Link to={"/announcement"}>
            <SidebarItem
              icon={<Mic2Icon size={20} />}
              text="Announcement"
              active={location.pathname === "/announcement"}
            />
          </Link>
          <Link to={"/paymenthistory"}>
            <SidebarItem
              icon={<IndianRupeeIcon size={20} />}  // Changed Icon
              text="Pyment History"
              active={location.pathname === "/paymenthistory"}
            />
          </Link>
        </Sidebar>
      </div>
    </>
  );
};

export default AdminSidebarLayout;
