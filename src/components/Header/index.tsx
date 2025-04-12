import React, { useEffect, useState } from "react";
import { Button, Text, Img } from "./..";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "hooks/useAuthContext";
import { useLogout } from "hooks/useLogout";
import Swal from "sweetalert2";
import { initFlowbite } from "flowbite";
import userImg from "../../assets/profile.jpg";
import axios from "helper/axios";
import { XIcon } from "lucide-react";

interface Props {
  className?: string;
}

export default function Header({ ...props }: Props) {
  const { user }: any = useAuthContext();
  const [myData, setMyData] = useState<any>([]);
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();
  const { logout } = useLogout();

  useEffect(() => {
    initFlowbite();
    if (user) getMyData();
  }, [user]);

  const getMyData = async () => {
    try {
      const response = await axios.get(`api/get_my_profile`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setMyData(response?.data?.data);
    } catch (error) {
      // console.error("Error getting Profile", error);
    }
  };

  const handleGetAdmissionClick = () => {
    if (myData.is_formsubmited) {
      if (myData.is_payment_done) {
        Swal.fire({
          title: "Access Restricted",
          text: "You have already completed the form submission and payment. Check Dashboard for more information",
          icon: "info",
          customClass: {
            icon: "swal-my-icon",
          },
          confirmButtonColor: "#7066E0",
          confirmButtonText: "OK",
        });
      } else {
        navigate("/payments");
      }
    } else {
      navigate("/getadmission");
    }
  };

  const handleLogOut = () => {
    Swal.fire({
      title: `Are you sure you want Log out From ILATE ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      customClass: {
        icon: "swal-my-icon",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/login");
      }
    });
  };

  const handleToggle = () => {
    setToggle(true);
  };
  const handleToggleClose = () => {
    setToggle(!toggle);
  };

  return (
    <header {...props}>
      <div className="flex flex-row justify-around items-center w-full mx-auto sm:px-4">
        <div className="flex w-4/12 sm:w-full">
          <Link to="/" className="">
            <Img
              src="images/ILATE_Classes_Final_Logo-02.jpg"
              loading="lazy"
              alt="logo"
              className="w-[40%] sm:w-[50%] inline-block h-auto"
              width="400"  
      height="200"  
            />
          </Link>
        </div>

        <div className="flex justify-end items-center gap-6 w-6/12">
          <Link to="/aboutus">
            <Text size="lg" as="p" className="!text-gray-900 sm:hidden">
              About us
            </Text>
          </Link>
          <Link to="/contactus" className="">
            <Text size="lg" as="p" className="!text-gray-900 sm:hidden">
              Contact Us
            </Text>
          </Link>

          {/* If user get true  */}

          {!user ? (
            <>
              <Link to="/login">
                <Button
                  variant="outline"
                  shape="square"
                  className="rounded-md font-bold min-w-[138px] sm:hidden hover:text-white-A700 hover:bg-deep_orange-500 transition"
                >
                  Login
                </Button>
              </Link>

              <div>
                <Img
                  src="images/hamburger_icn.png"
                  loading="lazy"
                  alt="whatsappimage"
                  className="w-[40px] sm:block hidden"
                  onClick={handleToggle}
                />
              </div>
              <div
                className={`fixed w-[100%] transform duration-300 transition-all hidden sm:block z-20 top-0 h-[100vh] bg-[#fff] right-0 ${
                  toggle ? "translate-x-0" : "translate-x-full"
                }`}
              >
                <div className="m-[20px]">
                  <XIcon
                    className="text-black w-10 h-10"
                    onClick={handleToggleClose}
                  />
                </div>
                <div className="mt-[100px] flex flex-col justify-center items-center ">
                  <Link to="/aboutus" className="">
                    <Text
                      size="lg"
                      as="p"
                      className="!text-gray-900 text mb-[50px] "
                      onClick={handleToggleClose}
                    >
                      About us
                    </Text>
                  </Link>
                  <Link to="/contactus" className="">
                    <Text
                      size="lg"
                      as="p"
                      className="!text-gray-900 mb-[50px] "
                      onClick={handleToggleClose}
                    >
                      Contact Us
                    </Text>
                  </Link>
                  <Link to="/login">
                    <Button
                      variant="outline"
                      shape="square"
                      className="rounded-md font-bold min-w-[138px] hover:text-white-A700 hover:bg-deep_orange-500 transition text-center"
                      onClick={handleToggleClose}
                    >
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
              {/* )} */}
            </>
          ) : (
            <div>
              <button
                id="dropdownAvatarNameButton"
                data-dropdown-toggle="dropdownAvatarName"
                // data-dropdown-trigger="hover"
                className="flex items-center text-sm pe-1 font-medium text-gray-900 rounded-full hover:text-blue-600 dark:hover:text-blue-500 md:me-0 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-white"
                type="button"
              >
                {/* <span className="sr-only">Open user menu</span> */}
                <img
                  loading="lazy"
                  className="w-8 h-8 mr-1 rounded-full"
                  src={userImg}
                  alt="user photo"
                />
                {myData?.username}
                <svg
                  className="w-2.5 h-2.5 ml-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <div
                id="dropdownAvatarName"
                className={`z-10 hidden bg-white-A700 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}
              >
                {myData?.email && (
                  <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {myData?.user_type === "admin" && (
                      <div className="font-bold uppercase">
                        {myData?.user_type}
                      </div>
                    )}
                    <div>
                      User ID : <strong>{myData?.user_id}</strong>
                    </div>
                    <div className="truncate">{myData?.email}</div>
                  </div>
                )}
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownInformdropdownAvatarNameButtonationButton"
                >
                  <li>
                    {myData?.user_type === "admin" ? (
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Dashboard
                      </Link>
                    ) : myData?.user_type === "student" &&
                      myData?.is_payment_done ? (
                      <Link
                        to="/dashboard/user"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        My Dashboard
                      </Link>
                    ) : myData?.user_type === "teacher" ? (
                      <Link
                        to="/dashboard/user"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        My Dashboard
                      </Link>
                    ) : myData?.user_type === "parent" ? (
                      <Link
                        to="/dashboard/profile"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        My Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Home
                      </Link>
                    )}
                  </li>
                  {/* <li>
                    <Link
                      to="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Settings
                    </Link>
                  </li> */}
                </ul>
                <div className="py-2">
                  <Link
                    onClick={handleLogOut}
                    to="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Log out
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
