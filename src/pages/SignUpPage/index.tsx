import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Img, Button, Text, Heading, Input } from "../../components";
import { Link } from "react-router-dom";
import { useSignup } from "hooks/useSignUp";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useBranch } from "hooks/Branch";

export default function SignUpPagePage() {
  const { signup, error, setError, isLoading } = useSignup();
  const [forgetVisible, setForgetVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const { branchData } = useBranch();
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    phone_no: "",
    branch_id: "",
    user_password: "",
    repassword: "",
  });

  const handleInputChange = (fieldName: any, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (formData.user_password === formData.repassword) {
      await signup(
        formData.user_name,
        formData.user_email,
        formData.user_password,
        formData.phone_no,
        formData.branch_id
      );
    } else {
      setError("Password Do Not Match");
    }
  };

  return (
    <>
      <Helmet>
        <title>ILATE Sign Up</title>
      </Helmet>

      <div className="flex flex-row justify-end w-full p-[39px] sm:p-5 sm:mb-8 bg-white-A700">
        <div className="flex flex-row sm:flex-col-reverse justify-between items-start w-full my-[75px] sm:my-1 mx-auto max-w-[1350px]">
          <div className="flex flex-col items-center justify-start w-[70%] sm:w-[100%] md:w-[140%] p-5 border rounded-lg border-teal-900 bg-teal-900/5">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center justify-start w-full"
            >
              <div className="flex flex-col items-start justify-start w-full">
                <Heading
                  size="7xl"
                  as="h1"
                  className="!text-black-900 !font-inter"
                >
                  Sign Up
                </Heading>

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
                  Name
                </Heading>
                <Input
                  color="teal_900"
                  size="xs"
                  variant="fill"
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  placeholder="Enter your full name"
                  className="w-full mt-[18px] font-inter rounded-[5px]"
                  onChange={(value: any) =>
                    handleInputChange("user_name", value)
                  }
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Remove non-alphabetic characters
                  }}

                  required
                />
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
                  name="user_email"
                  value={formData.user_email}
                  onChange={(value: any) =>
                    handleInputChange("user_email", value)
                  }
                  placeholder="Enter your email id"
                  className="w-full mt-[18px] font-inter rounded-[5px]"
                  required
                />
                <Heading
                  size="lg"
                  as="h2"
                  className="mt-5 !text-black-900 !font-inter !font-semibold"
                >
                  Phone
                </Heading>
                <Input
                  color="teal_900"
                  size="xs"
                  variant="fill"
                  type="tel"
                  pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                  maxLength={10}
                  name="phone_no"
                  value={formData.phone_no}
                  onChange={(value: any) =>
                    handleInputChange("phone_no", value)
                  }
                  placeholder="Enter Your Phone (10 Digit)*"
                  className="w-full mt-[18px] font-inter rounded-[5px]"
                  required
                />

                {/* Branch Selection */}
                <Heading size="lg" as="h2" className="mt-5 !text-black-900 !font-inter !font-semibold">
                  Branch
                </Heading>
                <select
                  name="branch_id"
                  value={formData.branch_id}
                  onChange={(e) => handleInputChange("branch_id", e.target.value)}
                  className="p-3 bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-[5px] focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  required
                >
                 <option value="" disabled hidden>Select Branch</option>
                  {branchData.map((branch, index) => (
                    <option 
                    key={index} 
                    value={branch.id} 
                    className="bg-teal-900 !text-[white]" 
                    style={{ color: 'white' }}
                  >
                    {branch.name}
                  </option>
                  ))}
                </select>

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
                    type={forgetVisible ? "text" : "password"}
                    name="user_password"
                    value={formData.user_password}
                    onChange={(value: any) =>
                      handleInputChange("user_password", value)
                    }
                    autoComplete="on"
                    placeholder="Minimum 8 characters*"
                    className="w-full -[35px] font-inter rounded-[5px]"
                    required
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
                  className="mt-[19px] !text-black-900 !font-inter !font-semibold"
                >
                  Confirm Password
                </Heading>
                <div className="flex items-center w-full bg-[#002D51] mt-3.5 rounded-[5px]">
                  <Input
                    color="teal_900"
                    size="xs"
                    variant="fill"
                    type={confirmVisible ? "text" : "password"}
                    autoComplete="on"
                    value={formData.repassword}
                    onChange={(value: any) =>
                      handleInputChange("repassword", value)
                    }
                    name="repassword"
                    placeholder="Minimum 8 characters*"
                    className="w-full -[35px] font-inter rounded-[5px]"
                    required
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
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                color="teal_900"
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
                  <span>Sign Up</span>
                )}
              </Button>
            </form>
            <Text
              size="md"
              as="p"
              className="!text-black-900 !font-inter mt-2.5"
            >
              <span className="text-black-900">
                Already registered ?
                <Link
                  to="/login"
                  className="text-black-900 hover:underline inline mx-1"
                >
                  Login
                </Link>
              </span>
            </Text>
            {error && (
              <>
                <div className="mt-3 p-2 bg-red-100 text-red-500 rounded border border-red-500 m-y2 mx-0">
                  {error.toString()}
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col items-end justify-start sm:items-center mt-[21px] sm:mt-0 gap-[81px] w-[90%] md:w-auto">
            {/* <Button
              color="teal_900"
              size="sm"
              className="mr-[29px] !text-gray-100 font-inter font-bold min-w-[167px] rounded-[5px]"
            >
              Sign Up
            </Button> */}
            <Img
              loading="lazy"
              src="images/img_reshot_illustra.png"
              alt="reshotillustra"
              className="w-[80%] p-1 sm:w-[90%] md:w-[100%] sm:mt-2 xs:w-[100%] sm:mb-8 md:p-8 md:mt-32"
            />
          </div>
        </div>
      </div>
    </>
  );
}
