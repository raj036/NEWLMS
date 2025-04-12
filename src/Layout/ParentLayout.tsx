import React from "react";
import Header from "components/Header";
import Footer from "components/Footer";
import { useLocation } from "react-router-dom";
import HomeSideBar from "components/HomeSideBar";
import ParentSidebarLayout from "components/Sidebar/ParentSidebarLayout";

const ParentLayout = ({ children }) => {
  const location = useLocation();

  const isDashroutes = location?.pathname?.includes("dashboard");

  return (
    <>
      {!isDashroutes ? (
        <>
        <HomeSideBar/>
          <div className="flex flex-col items-center justify-between w-full pt-[25px] bg-white-A700">
            <div className="flex flex-col items-end justify-start w-full max-w-[1500px]">
              <Header className="flex flex-row justify-between items-center w-full" />
            </div>
          </div>
          {children}
          <Footer className="flex justify-center items-center w-full px-10 pt-16 bg-black-900" />
        </>
      ) : (
        <>
          <div className="flex">
            <ParentSidebarLayout />
            <div className="flex-1 min-h-screen">{children}</div>
          </div>
        </>
      )}
    </>
  );
};

export default ParentLayout;
