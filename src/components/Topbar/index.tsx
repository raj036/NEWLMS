import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import userImg from "../../assets/profile.jpg";
import Swal from "sweetalert2";
import { initFlowbite } from "flowbite";
import { useAuthContext } from "hooks/useAuthContext";
import { useLogout } from "hooks/useLogout";

const Topbar = ({ heading }) => {
  const { user }: any = useAuthContext();
  const navigate = useNavigate();
  const { logout } = useLogout();

  useEffect(() => {
    initFlowbite();
  }, [user]);

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
  return (
    <div className="flex sm:w-[200%] overflow-x-scroll mx-auto justify-between items-center p-8 border-b shadow-sm">
      <h1 className="text-3xl sm:text-[20px] font-bold text-indigo-500">{heading}</h1>
      <div>
        <button
          id="dropdownAvatarNameButton"
          data-dropdown-toggle="dropdownAvatarName"
          // data-dropdown-trigger="hover"
          className="flex items-center text-base pe-1 font-medium text-gray-900 rounded-full hover:text-blue-600 dark:hover:text-blue-500 md:me-0 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-white"
          type="button"
        >
          <img
            className="w-8 h-8 mr-1 rounded-full"
            src={userImg}
            loading="lazy"
            alt="user photo"
          />
          {user?.user_name}
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
          {user.email_id && (
            <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
              {user.user_type === "admin" && (
                <div className="font-bold uppercase">{user.user_type}</div>
              )}
              <div>
                User ID : <strong>{user.user_id}</strong>
              </div>
              <div className="truncate">{user.email_id}</div>
            </div>
          )}
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownInformdropdownAvatarNameButtonationButton"
          >
            <li>
              {user.user_type === "admin" ? (
                <Link
                  to="/"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Dashboard
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
    </div>
  );
};

export default Topbar;
