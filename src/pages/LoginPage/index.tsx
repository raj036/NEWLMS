import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Img, Button, Text, Heading, Input } from "../../components";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useLogin } from "hooks/useLogin";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import axios from "helper/axios";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [loginData, setLoginData] = useState({
    email: "",
    user_password: "",
  });
  const [forgetData, setForgetData] = useState<any>({
    email: "",
    otp: "",
    new_password: "",
    confirm_new_password: "",
  });
  const [loadUpdate, setLoadUpdate] = useState(false);
  const [loadSendOTP, setLoadSendOTP] = useState(false);
  const [visible, setVisible] = useState(false);
  const [forgetVisible, setForgetVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [forgetPass, setForgetPass] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1 for email entry, 2 for OTP and password
  const { login, isLoading, error } = useLogin();
  const [forgetError, setForgetError] = useState("");
  const navigate = useNavigate();

  const handleChange = (fieldName: any, value: any) => {
    setLoginData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleForgetChange = (fieldName: any, value: any) => {
    setForgetData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      await login(loginData.email, loginData.user_password);
    } catch (error) {
      // The error is already set in the useLogin hook, so we don't need to do anything here
    }
    clearLoginFields();
  };

  const clearLoginFields = () => {
    setLoginData({
      email: "",
      user_password: "",
    });
  };

  const clearInputFields = () => {
    setForgetData({
      email: "",
      otp: "",
      new_password: "",
      confirm_new_password: "",
    });
  };

  // Function to send OTP
  const handleSendOTP = async () => {
    const { email } = forgetData;
    if (!email) {
      setForgetError("Please enter your email");
      return;
    }

    try {
      setLoadSendOTP(true);
      await axios.post("/api/send_otp", null, { params: { email } });
      setForgetError("");
      Swal.fire({
        icon: "success",
        title: "OTP Sent Successfully",
        text: "Please check your email for the verification code",
        showConfirmButton: true,
        confirmButtonColor: "#7066E0",
        confirmButtonText: "Ok",
      });
      setResetStep(2);
    } catch (error) {
      setForgetError(error.response?.data?.detail || "Failed to send OTP. Please try again.");
      Swal.fire({
        icon: "error",
        title: "Error Sending OTP",
        text: error.response?.data?.detail || "Failed to send OTP. Please try again.",
        showConfirmButton: true,
        confirmButtonColor: "red",
      });
    } finally {
      setLoadSendOTP(false);
    }
  };

  // Function to reset password with OTP
  const handleResetPassword = async (e: any) => {
    e.preventDefault();
    const { email, otp, new_password, confirm_new_password } = forgetData;

    if (!email || !otp || !new_password || !confirm_new_password) {
      setForgetError("All fields are required");
      return;
    }

    if (new_password !== confirm_new_password) {
      setForgetError("Passwords do not match. Please try again.");
      return;
    }

    try {
      setLoadUpdate(true);
      const response = await axios.put("/api/reset_password", null, {
        params: {
          otp: parseInt(otp),
          email,
          new_password,
          confirm_new_password,
        },
      });

      setForgetError("");
      Swal.fire({
        icon: "success",
        title: "Password Updated Successfully",
        showConfirmButton: true,
        confirmButtonColor: "#7066E0",
        confirmButtonText: "Login Now",
      });
      clearInputFields();
      setForgetPass(false);
      setResetStep(1);
    } catch (error) {
      setForgetError(error.response?.data?.detail || "Error while resetting password");
      Swal.fire({
        icon: "error",
        title: "Error While Resetting Password",
        text: error.response?.data?.detail || "Error while resetting password",
        customClass: {
          icon: "swal-my-icon",
        },
        showConfirmButton: true,
        confirmButtonColor: "red",
      });
    } finally {
      setLoadUpdate(false);
    }
  };

  const handleSendOTPClick = () => {
    handleSendOTP();
  };

  const handleResetPasswordClick = () => {
    handleResetPassword({ preventDefault: () => { } });
  };

  return (
    <>
      <Helmet>
        <title>ILATE Login</title>
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
      </Helmet>

      <div className="flex flex-row justify-end w-full h-full px-[20px] py-16 sm:mb-8 sm:py-5 bg-white-A700">
        <div className="flex flex-row sm:flex-col-reverse justify-between items-start w-full my-[75px] sm:my-1 mx-auto max-w-[1350px]">
          <div className="flex flex-col items-center justify-start w-[70%] sm:w-[100%] md:w-[140%] p-5 border rounded-lg border-teal-900 bg-teal-900/5">
            {forgetPass ? (
              resetStep === 1 ? (
                // Step 1: Email entry for password reset
                <>
                  <Text
                    size="xl"
                    as="p"
                    className="mt-[18px] !text-black-900 !font-inter w-full"
                  >
                    Reset your password
                  </Text>
                  <Heading
                    size="lg"
                    as="h2"
                    className="mt-5 !text-black-900 !font-inter !font-semibold w-full"
                  >
                    Email
                  </Heading>
                  <Input
                    color="teal_900"
                    size="xs"
                    variant="fill"
                    type="email"
                    name="email"
                    required
                    onChange={(value: any) => handleForgetChange("email", value)}
                    placeholder="Enter your email id"
                    className="w-full mt-[18px] font-inter rounded-[5px]"
                  />
                  <Button
                    color="teal_900"
                    disabled={loadSendOTP}
                    size="md"
                    className="mt-[40px] font-inter font-medium text-base rounded-[5px] border border-teal-900 hover:bg-white-A700 hover:text-teal-900"
                    onClick={handleSendOTPClick}
                  >
                    {loadSendOTP ? (
                      <>
                        <svg
                          aria-hidden="true"
                          role="status"
                          className="inline mr-3 w-4 h-4 text-white animate-spin"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#E5E7EB"
                          ></path>
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <span>Send OTP</span>
                    )}
                  </Button>
                  <Button
                    variant="text"
                    size="md"
                    className="mt-[10px] font-inter font-medium text-base text-teal-900 hover:underline"
                    onClick={() => {
                      setForgetPass(false);
                      setResetStep(1);
                      clearInputFields();
                    }}
                  >
                    Back to Login
                  </Button>
                </>
              ) : (
                // Step 2: OTP verification and new password
                <>
                  <Text
                    size="xl"
                    as="p"
                    className="mt-[18px] !text-black-900 !font-inter w-full"
                  >
                    Reset your password
                  </Text>
                  <Heading
                    size="lg"
                    as="h2"
                    className="mt-5 !text-black-900 !font-inter !font-semibold w-full"
                  >
                    Enter Your Otp
                  </Heading>
                  <Input
                    color="teal_900"
                    size="xs"
                    variant="fill"
                    type="number"
                    name="otp_code"
                    required
                    autoComplete="off"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={(value: any) => handleForgetChange("otp", value)}
                    placeholder="Enter 6-digit code"
                    className="w-full mt-[18px] font-inter rounded-[5px] appearance-none "
                  />

                  <Heading
                    size="lg"
                    as="h3"
                    className="mt-[19px] !text-black-900 !font-inter !font-semibold w-full"
                  >
                    New Password
                  </Heading>
                  <div className="flex items-center w-full bg-[#002D51] mt-3.5 rounded-[5px]">
                    <Input
                      color="teal_900"
                      size="xs"
                      variant="fill"
                      type={forgetVisible ? "text" : "password"}
                      name="new_pass" // Changed from "new_password" to a unique name
                      required
                      autoComplete="new-password" // Proper autocomplete attribute
                      onChange={(value: any) =>
                        handleForgetChange("new_password", value)
                      }
                      placeholder="Minimum 8 characters*"
                      className="w-full -[35px] font-inter rounded-[5px]"
                    />
                    <span
                      onClick={() => {
                        setForgetVisible(!forgetVisible);
                      }}
                      className="text-[#ffffff7f] mr-[20px] cursor-pointer"
                    >
                      {forgetVisible ? <EyeIcon /> : <EyeOffIcon />}
                    </span>
                  </div>
                  <Heading
                    size="lg"
                    as="h3"
                    className="mt-[19px] !text-black-900 !font-inter !font-semibold w-full"
                  >
                    Confirm New Password
                  </Heading>
                  <div className="flex items-center w-full bg-[#002D51] mt-3.5 rounded-[5px]">
                    <Input
                      color="teal_900"
                      size="xs"
                      variant="fill"
                      type={confirmVisible ? "text" : "password"}
                      name="confirm_pass" // Changed from "confirm_new_password" to a unique name
                      required
                      autoComplete="new-password" // Proper autocomplete attribute
                      onChange={(value: any) =>
                        handleForgetChange("confirm_new_password", value)
                      }
                      placeholder="Minimum 8 characters*"
                      className="w-full -[35px] font-inter rounded-[5px]"
                    />
                    <span
                      onClick={() => {
                        setConfirmVisible(!confirmVisible);
                      }}
                      className="text-[#ffffff7f] mr-[20px] cursor-pointer"
                    >
                      {confirmVisible ? <EyeIcon /> : <EyeOffIcon />}
                    </span>
                  </div>
                  <Button
                    color="teal_900"
                    disabled={loadUpdate}
                    size="md"
                    className="mt-[40px] font-inter font-medium text-base rounded-[5px] border border-teal-900 hover:bg-white-A700 hover:text-teal-900"
                    onClick={handleResetPasswordClick}
                  >
                    {loadUpdate ? (
                      <>
                        <svg
                          aria-hidden="true"
                          role="status"
                          className="inline mr-3 w-4 h-4 text-white animate-spin"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#E5E7EB"
                          ></path>
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                        <span>Resetting Password...</span>
                      </>
                    ) : (
                      <span>Reset Password</span>
                    )}
                  </Button>
                  <Button
                    variant="text"
                    size="md"
                    className="mt-[10px] font-inter font-medium text-base text-teal-900 hover:underline"
                    onClick={() => {
                      setResetStep(1);
                    }}
                  >
                    Back to Email Entry
                  </Button>
                </>
              )
            ) : (
              <>
                <form
                  onSubmit={handleLogin}
                  className="flex flex-col gap-2 items-center justify-start w-full"
                >
                  <div className="flex flex-col gap-2 items-start justify-start w-full h-full">
                    <div className="flex justify-between items-center w-full">
                      <Heading
                        size="7xl"
                        as="h1"
                        className="!text-black-900 !font-inter"
                      >
                        Login now
                      </Heading>
                      {/* <Link to="/parentlogin">
                        <Button
                          variant="outline"
                          shape="square"
                          className="rounded-md font-bold min-w-[138px] hover:text-white-A700 hover:bg-deep_orange-500 transition"
                        >
                          Parent Login
                        </Button>
                      </Link> */}
                    </div>

                    <Text
                      size="xl"
                      as="p"
                      className="mt-[18px] !text-black-900 !font-inter"
                    >
                      Hi, Welcome to ILATE 👋{" "}
                    </Text>

                    <Heading
                      size="lg"
                      as="h2"
                      className="mt-5 !text-black-900 !font-inter !font-semibold"
                    >
                      Email
                    </Heading>
                    <Input
                      color="teal_900"
                      size="xs"
                      variant="fill"
                      type="email"
                      name="email"
                      required
                      onChange={(value: any) => handleChange("email", value)}
                      placeholder="Enter your email id"
                      className="w-full mt-[18px] font-inter rounded-[5px]"
                    />

                    <>
                      <Heading
                        size="lg"
                        as="h3"
                        className="mt-[19px] !text-black-900 !font-inter !font-semibold"
                      >
                        Password
                      </Heading>
                      <div className="flex items-center w-full bg-[#002D51] mt-3.5 rounded-[5px]">
                        <Input
                          color="teal_900"
                          size="xs"
                          variant="fill"
                          type={visible ? "text" : "password"}
                          required
                          name="user_password"
                          autoComplete="current-password"
                          onChange={(value: any) =>
                            handleChange("user_password", value)
                          }
                          placeholder="Enter your password"
                          className="w-full -[35px] font-inter rounded-[5px]"
                        />
                        <span
                          onClick={() => {
                            setVisible(!visible);
                          }}
                          className="text-[#ffffff7f] mr-[20px] cursor-pointer"
                        >
                          {visible ? <EyeIcon /> : <EyeOffIcon />}
                        </span>
                      </div>
                    </>

                    <div className="flex justify-between items-end w-full mt-[7px]">
                      <Heading
                        size="s"
                        as="h4"
                        className="!text-indigo-500 !font-inter w-full justify-end flex cursor-pointer"
                        onClick={() => {
                          setForgetPass(true);
                          setResetStep(1);
                          clearInputFields();
                        }}
                      >
                        Forgot Password?
                      </Heading>
                    </div>
                  </div>
                  <Button
                    color="teal_900"
                    disabled={isLoading}
                    size="md"
                    className="mt-[40px] font-inter font-medium text-base rounded-[5px] border border-teal-900 hover:bg-white-A700 hover:text-teal-900"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          aria-hidden="true"
                          role="status"
                          className="inline mr-3 w-4 h-4 text-white animate-spin"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#E5E7EB"
                          ></path>
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                        <span>Loading...</span>
                      </>
                    ) : (
                      <span>Log In</span>
                    )}
                  </Button>
                </form>
                {error && (
                  <p className="text-[red] mt-4">
                    {error.message || "An error occurred during login"}
                  </p>
                )}
              </>
            )}

            <Text
              size="md"
              as="p"
              className="!text-black-900 !font-inter mt-2.5"
            >
              <span className="text-black-900">
                Not registered yet?
                <Link
                  to="/signup"
                  className="text-black-900 hover:underline inline mx-1"
                >
                  SignUp
                </Link>
              </span>
            </Text>
            {forgetError && <p className="text-[red] mt-4">{forgetError}</p>}
          </div>
          <div className="flex flex-col items-end justify-start sm:items-center mt-[21px] sm:mt-0 gap-[81px] w-[90%] md:w-auto">
            <img
              loading="lazy"
              src="images/img_reshot_illustra.webp"
              alt="reshotillustra"
              className="w-[80%] p-1 sm:w-[90%] md:w-[100%] sm:mt-2 xs:w-[100%] sm:mb-8 md:p-8"
              width="800"  // Explicit width
              height="600" // Explicit height
            />
          </div>
        </div>
      </div>
    </>
  );
}