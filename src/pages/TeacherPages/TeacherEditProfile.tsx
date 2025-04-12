import { Button } from "@/components/ui/button";
import { Heading } from "components";
import Topbar from "components/Topbar";
import axios from "helper/axios";
import { useAuthContext } from "hooks/useAuthContext";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactFlagsSelect from "react-flags-select";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const TeacherEditProfile = () => {
  const { user }: any = useAuthContext();
  const navigate = useNavigate();
  const [teacherId, setTeacherId] = useState("");
  const [userData, setUserData] = useState<any>({
    name: "",
    email: "",
    contact_info: {
      primary_number: "",
      secondary_number: "",
      primary_email_id: "",
      secondary_email_id: "",
      current_address: "",
      permanent_address: "",
    },
    dependent: {
      dependent_name: "",
      relation: "",
      date_of_birth: "",
    },
    education: {
      education_level: "",
      institution: "",
      specialization: "",
      field_of_study: "",
      year_of_passing: null,
      percentage: null,
    },
    employee: {
      date_of_hire: "",
      dob: "",
      gender: "",
      marital_status: "",
      nationality: "",
    },
    emergency_contact: {
      emergency_contact_name: "",
      relation: "",
      emergency_contact_number: null,
    },
    languages_spoken: {
      languages: "",
    },
    skill: {
      skill: "",
      certification: "",
      license: "",
    },
  });
  const [show, setShow] = useState(false);

  const getMyData = async () => {
    try {
      const response = await axios.get(`api/teachers/${user.user_id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setUserData(response?.data);
      // console.log(response.data);
      setTeacherId(response?.data?.Teacher_id);
      setShow(true);
    } catch (error) {
      // console.error("Error getting Profile", error);
    }
  };

  useEffect(() => {
    getMyData();
  }, []);

  // post Data
  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    department: "",
    f_name: "",
    m_name: "",
    l_name: "",
    dob: "",
    gender: "",
    nationality: "",
    marital_status: "",
    citizenship_status: "",
    date_of_hire: "",
    date_of_termination: "", //--
    primary_number: "",
    secondary_number: "",
    primary_email_id: "",
    secondary_email_id: "",
    current_address: "",
    permanent_address: "",
    dependent_name: "",
    relation: "",
    date_of_birth: "", //--
    education_level: "",
    institution: "",
    specialization: "",
    field_of_study: "",
    year_of_passing: "",
    percentage: "",
    skill: "",
    certification: "",
    license: "", //--
    emergency_contact_name: "", //--
    emergency_contact_number: "",
    languages: "",
  });
  const [copyAddress, setCopyAddress] = useState(false);

  const handleChange = (field: any, value: any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));

    if (copyAddress && field === "current_address") {
      setFormData((prevData: any) => ({
        ...prevData,
        permanent_address: value,
      }));
    }
  };

  const handleCheckboxChange = () => {
    setCopyAddress(!copyAddress);
    if (!copyAddress) {
      setFormData((prevData: any) => ({
        ...prevData,
        permanent_address: prevData.current_address,
      }));
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    axios
      .post("api/teachers/", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        // console.log(response);
        Swal.fire({
          icon: "success",
          customClass: {
            icon: "swal-my-icon",
          },
          title: `Profile data was submitted successfully`,
          confirmButtonColor: "#7066E0",
          confirmButtonText: "OK",
        });
        navigate('/dashboard/user')
      })
      .catch((error) => {
        // console.log(error.response.data.detail);
        const errorMessage = error.response.data.detail;
        Swal.fire({
          title: errorMessage,
          icon: "error",
          customClass: {
            icon: "swal-my-icon",
          },
          confirmButtonColor: "#7066E0",
          confirmButtonText: "OK",
        });
        // console.error("Error submitting data:", error);
      });
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleNestedInputChange = (e: any, section: any) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [section]: {
        ...userData[section],
        [name]: value,
      },
    });
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleUpdate = (e: any) => {
    const updateData = {
      teacher_update_data: {
        name: userData.name,
        email: userData.email,
      },
      contact_info: {
        primary_number: userData.contact_info.primary_number,
        secondary_number: userData.contact_info.secondary_number,
        primary_email_id: userData.contact_info.primary_email_id,
        secondary_email_id: userData.contact_info.secondary_email_id,
        current_address: userData.contact_info.current_address,
        permanent_address: userData.contact_info.permanent_address,
      },
      dependent: {
        dependent_name: userData.dependent.dependent_name,
        relation: userData.dependent.relation,
        date_of_birth: userData.dependent.date_of_birth,
      },
      education: {
        education_level: userData.education.education_level,
        institution: userData.education.institution,
        specialization: userData.education.specialization,
        field_of_study: userData.education.field_of_study,
        year_of_passing: userData.education.year_of_passing,
        percentage: userData.education.percentage,
      },
      emergency_contact: {
        emergency_contact_name:
          userData.emergency_contact.emergency_contact_name,
        relation: userData.emergency_contact.relation,
        emergency_contact_number:
          userData.emergency_contact.emergency_contact_number,
      },
      languages_spoken: {
        languages: userData.languages_spoken.languages,
      },
      skill: {
        skill: userData.skill.skill,
        certification: userData.skill.certification,
        license: userData.skill.license,
      },
    };
    e.preventDefault();
    axios
      .put(`/api/teachers/${teacherId}`, updateData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: `Profile updated successfully`,
          customClass: {
            icon: "swal-my-icon",
          },
          confirmButtonColor: "#7066E0",
          confirmButtonText: "OK",
        });
      })

      .catch((error) => {
        // console.log(error);
        Swal.fire({
          title: "Data was not updated due to some technical issue",
          icon: "error",
          customClass: {
            icon: "swal-my-icon",
          },
          confirmButtonColor: "#7066E0",
          confirmButtonText: "OK",
        });
      });
  };

  return (
    <>
      <Topbar heading={"Profile"} />
      <button
        onClick={handleBackClick}
        className="flex items-center space-x-2 text-teal-900 hover:text-blue-900"
      >
        <ArrowLeft className="w-6 h-6" />
        <span>Back</span>
      </button>
      {/* form get data  */}
      {show ? (
        <form onSubmit={handleUpdate}>
          <div className="flex lg:flex-col">
            <div className="p-5 w-[40%] lg:w-[90%] sm:w-[180%] sm:overflow-x-scroll ">
              <div className="font-semibold	text-[16px] mb-4 ml-1">
                Contact Details
              </div>
              <div className="h-full rounded-[10px] shadow-lg -w-[35%] p-4 text-[14px]">
                <div className="flex justify-between border-b-2 pb-2">
                  <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                    Name :
                  </span>
                  <input
                    className="w-[60%] text-[black]"
                    type="text"
                    id="autofillfoc"
                    value={userData?.name}
                    name="name"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex justify-between border-b-2 py-2">
                  <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                    Primary Email :
                  </span>
                  <input
                    className="w-[60%]"
                    id="autofillfoc"
                    type="text"
                    value={userData?.contact_info?.primary_email_id}
                    name="primary_email_id"
                    onChange={(e) => handleNestedInputChange(e, "contact_info")}
                  />
                </div>
                <div className="flex justify-between border-b-2 py-2">
                  <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                    Secondary Email :
                  </span>
                  <input
                    className="w-[60%]"
                    id="autofillfoc"
                    value={userData?.contact_info?.secondary_email_id || "-"}
                    type="text"
                    name="secondary_email_id"
                    onChange={(e) => handleNestedInputChange(e, "contact_info")}
                  />
                </div>
                <div className="flex justify-between border-b-2 py-2">
                  <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                    Address :
                  </span>
                  <input
                    className="w-[60%]"
                    id="autofillfoc"
                    value={userData?.contact_info?.current_address}
                    type="text"
                    name="current_address"
                    onChange={(e) => handleNestedInputChange(e, "contact_info")}
                  />
                </div>
                <div className="flex justify-between border-b-2 py-2">
                  <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                    Primary No :
                  </span>
                  <input
                    className="w-[60%]"
                    id="autofillfoc"
                    value={userData?.contact_info?.primary_number}
                    type="number"
                    name="primary_number"
                    onChange={(e) => handleNestedInputChange(e, "contact_info")}
                  />
                </div>
                <div className="flex justify-between border-b-2 py-2">
                  <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                    Secondary No :
                  </span>
                  <input
                    className="w-[60%]"
                    id="autofillfoc"
                    value={userData?.contact_info?.secondary_number || "-"}
                    type="number"
                    name="secondary_number"
                    onChange={(e) => handleNestedInputChange(e, "contact_info")}
                  />
                </div>
                <div className="flex justify-between border-b-2 py-2">
                  <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                    DOB :
                  </span>
                  <input
                    className="w-[60%]"
                    id="autofillfoc"
                    value={userData?.employee?.dob || ""}
                    type="date"
                    name="dob"
                    onChange={(e) => handleNestedInputChange(e, "employee")}
                  />
                </div>
                <div className="flex justify-between border-b-2 py-2">
                  <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                    Dependant name :
                  </span>
                  <input
                    className="w-[60%]"
                    id="autofillfoc"
                    value={userData?.dependent?.dependent_name || "-"}
                    type="text"
                    name="dependent_name"
                    onChange={(e) => handleNestedInputChange(e, "dependent")}
                  />
                </div>
                <div className="flex justify-between border-b-2 py-2">
                  <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                    Language :
                  </span>
                  <input
                    className="w-[60%]"
                    id="autofillfoc"
                    value={userData?.languages_spoken?.languages || "-"}
                    type="text"
                    name="languages"
                    onChange={(e) =>
                      handleNestedInputChange(e, "languages_spoken")
                    }
                  />
                </div>
              </div>
            </div>

            {/* Education Information */}

            <div className="w-[40%] lg:w-[90%] sm:w-[170%] sm:overflow-x-scroll">
              <div className="p-5">
                <div className="font-semibold	text-[16px] mb-4 ml-1">
                  Education Details
                </div>
                <div className=" rounded-[10px] shadow-lg -w-[35%] p-4 text-[14px]">
                  <div className="flex justify-between border-b-2 pb-2">
                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                      Education :
                    </span>
                    <input
                      className="w-[60%]"
                      id="autofillfoc"
                      type="text"
                      value={userData?.education?.education_level}
                      name="education_level"
                      onChange={(e) => handleNestedInputChange(e, "education")}
                    />
                  </div>
                  <div className="flex justify-between border-b-2 py-2">
                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                      Study :
                    </span>
                    <input
                      className="w-[60%]"
                      id="autofillfoc"
                      type="text"
                      value={userData?.education?.field_of_study}
                      name="field_of_study"
                      onChange={(e) => handleNestedInputChange(e, "education")}
                    />
                  </div>
                  <div className="flex justify-between border-b-2 py-2">
                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                      Institution :
                    </span>
                    <input
                      className="w-[60%]"
                      id="autofillfoc"
                      value={userData?.education?.institution || "-"}
                      type="text"
                      name="institution"
                      onChange={(e) => handleNestedInputChange(e, "education")}
                    />
                  </div>
                  <div className="flex justify-between border-b-2 py-2">
                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                      Specialization :
                    </span>
                    <input
                      className="w-[60%]"
                      id="autofillfoc"
                      value={userData?.education?.specialization}
                      type="text"
                      name="specialization"
                      onChange={(e) => handleNestedInputChange(e, "education")}
                    />
                  </div>
                  <div className="flex justify-between border-b-2 py-2">
                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                      Percentage :
                    </span>
                    <input
                      className="w-[60%]"
                      id="autofillfoc"
                      value={userData?.education?.percentage}
                      type="number"
                      name="percentage"
                      onChange={(e) => handleNestedInputChange(e, "education")}
                    />
                  </div>
                  <div className="flex justify-between border-b-2 py-2">
                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                      Passing year :
                    </span>
                    <input
                      className="w-[60%]"
                      id="autofillfoc"
                      value={userData?.education?.year_of_passing || "-"}
                      type="number"
                      name="year_of_passing"
                      onChange={(e) => handleNestedInputChange(e, "education")}
                    />
                  </div>
                </div>
              </div>

              {/* Certification Details */}

              <div className="p-5 ">
                <div className="font-semibold	text-[16px] mb-4 ml-1">Skills</div>
                <div className=" rounded-[10px] shadow-lg -w-[35%] p-4 text-[14px]">
                  <div className="flex justify-between border-b-2 pb-2 text-[14px]">
                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                      Certification :
                    </span>
                    <input
                      className="w-[60%]"
                      id="autofillfoc"
                      value={userData?.skill?.certification}
                      type="text"
                      name="certification"
                      onChange={(e) => handleNestedInputChange(e, "skill")}
                    />
                  </div>
                  {/* <div className="flex justify-between border-b-2 py-2 text-[14px]">
                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                      License :
                    </span>
                    <input
                      className="w-[60%]"
                      id="autofillfoc"
                      value={userData?.skill?.license}
                      type="text"
                      name="license"
                      onChange={(e) => handleNestedInputChange(e, "skill")}
                    />
                  </div> */}
                </div>
              </div>
            </div>
          </div>
          <div className="my-[50px] text-center">
            <Button
              size="lg"
              type="submit"
              className="  font-bold max-w-[250px]   z-10 transition hover:bg-white-A700 border bg-deep_orange-500 hover:text-deep_orange-500 border-deep_orange-500"
            >
              Update
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="py-[20px] px-[120px]">
          {/* Teacher Data */}
          <Heading
            size="3xl"
            className="block my-2 text-sm font-extrabold text-gray-900 dark:text-white-A700"
          >
            Personal Details
          </Heading>
          <div className="grid grid-cols-3 gap-x-10 gap-y-4 md:grid-cols-2 sm:grid-cols-1 sm:gap-6">
            <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Full Name<span className="text-red-500">*</span>
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="text"
                  name="name"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Remove non-alphabetic characters
                  }}
                  required
                />
              </div>
            </div>
            <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                DOB<span className="text-red-500">*</span>
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="date"
                  name="dob"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.dob}
                  onChange={(e) => handleChange("dob", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Gender<span className="text-red-500">*</span>
              </Heading>
              {/* <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"> */}
              <select
                name="gender"
                className="p-3 bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-[8px] focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                required
              >
                <option value="">Select a Gender...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {/* </div> */}
            </div>
            <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Nationality<span className="text-red-500">*</span>
              </Heading>
              <ReactFlagsSelect
                selected={formData.nationality} // Bind to formData's nationality value
                onSelect={(value) => handleChange("nationality", value)} // Use existing handleChange function
                searchable // Enable search
                placeholder="Select Country" // Optional placeholder
                className=" bg-teal-900 border border-teal-90 text-sm rounded-md border-none focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              />
              {/* <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="text"
                  name="nationality"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.nationality}
                  onChange={(e) => handleChange("nationality", e.target.value)}
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    e.target.value = e.target.value.replace(/[^a-zA-Z]/g, ""); // Remove non-alphabetic characters
                  }}
                  required
                />
              </div> */}
            </div>
            <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Marital status<span className="text-red-500">*</span>
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="text"
                  name="marital_status"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.marital_status}
                  onChange={(e) =>
                    handleChange("marital_status", e.target.value)
                  }
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Remove non-alphabetic characters
                  }}
                  required
                />
              </div>
            </div>
            {/* <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Citizenship status:
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="text"
                  name="citizenship_status"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.citizenship_status}
                  onChange={(e) =>
                    handleChange(
                      "citizenship_status",
                      e.target.value
                    )
                  }
                />
              </div>
            </div> */}
            <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Date of hire<span className="text-red-500">*</span>
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="date"
                  name="date_of_hire"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.date_of_hire}
                  onChange={(e) => handleChange("date_of_hire", e.target.value)}
                  required
                />
              </div>
            </div>
            {/* <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Date of termination:
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="date"
                  name="date_of_termination"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.date_of_termination}
                  onChange={(e) =>
                    handleChange(
                      "date_of_termination",
                      e.target.value
                    )
                  }
                />
              </div>
            </div> */}
            {/* {teacher_contact_info} */}
            <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Primary No<span className="text-red-500">*</span>
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="text"
                  name="primary_number"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.primary_number}
                  minLength={10}
                  maxLength={10}
                  onChange={(e) =>
                    handleChange("primary_number", e.target.value)
                  }
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    e.target.value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                  }}
                  required
                />
              </div>
            </div>
            <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Secondary No
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="text"
                  name="secondary_number"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.secondary_number}
                  minLength={10}
                  maxLength={10}
                  onChange={(e) =>
                    handleChange("secondary_number", e.target.value)
                  }
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    e.target.value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                  }}
                />
              </div>
            </div>
            <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Primary email<span className="text-red-500">*</span>
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="email"
                  name="primary_email_id"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.primary_email_id}
                  onChange={(e) =>
                    handleChange("primary_email_id", e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Secondary email
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="email"
                  name="secondary_email_id"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.secondary_email_id}
                  onChange={(e) =>
                    handleChange("secondary_email_id", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Current Address<span className="text-red-500">*</span>
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="text"
                  name="current_address"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.current_address}
                  onChange={(e) =>
                    handleChange("current_address", e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Permanent address<span className="text-red-500">*</span>
                <input
                  type="checkbox"
                  checked={copyAddress}
                  onChange={handleCheckboxChange}
                  className="mx-1"
                />
                <span>Same as Current</span>
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="text"
                  name="primary_number"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.permanent_address}
                  onChange={(e) =>
                    handleChange("permanent_address", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          </div>
          {/* changing the section from here */}
          {/* Dependent */}
          <Heading
            size="3xl"
            className="block my-2 text-sm font-extrabold text-gray-900 dark:text-white-A700 pt-4"
          >
            Dependent Details
          </Heading>
          <div className="grid grid-cols-3 gap-x-10 gap-y-4 md:grid-cols-2 sm:grid-cols-1 sm:gap-6">
            <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Dependent Name<span className="text-red-500">*</span>
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="text"
                  name="dependent_name"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.dependent_name}
                  onChange={(e) =>
                    handleChange("dependent_name", e.target.value)
                  }
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Remove non-alphabetic characters
                  }}
                  required
                />
              </div>
            </div>
            <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Relation<span className="text-red-500">*</span>
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="text"
                  name="relation"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.relation}
                  onChange={(e) => handleChange("relation", e.target.value)}
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");// Remove non-alphabetic characters
                  }}
                  required
                />
              </div>
            </div>
            <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Emergency Contact Number<span className="text-red-500">*</span>
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="text"
                  name="emergency_contact_number"
                  minLength={10}
                  maxLength={10}
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.emergency_contact_number}
                  onChange={(e) =>
                    handleChange("emergency_contact_number", e.target.value)
                  }
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    e.target.value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                  }}
                  required
                />
              </div>
            </div>
          </div>
          {/* {Education} */}
          <Heading
            size="3xl"
            className="block my-2 text-sm font-extrabold text-gray-900  dark:text-white-A700 pt-4"
          >
            Education
          </Heading>
          <div className="grid grid-cols-3 gap-x-10 gap-y-4 md:grid-cols-2 sm:grid-cols-1 sm:gap-6">
            <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Education level<span className="text-red-500">*</span>
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="text"
                  name="education_level"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.education_level}
                  onChange={(e) =>
                    handleChange("education_level", e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Institution<span className="text-red-500">*</span>
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="text"
                  name="institution"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.institution}
                  onChange={(e) => handleChange("institution", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Specialization<span className="text-red-500">*</span>
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="text"
                  name="specialization"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.specialization}
                  onChange={(e) =>
                    handleChange("specialization", e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Field of study<span className="text-red-500">*</span>
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="text"
                  name="field_of_study"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.field_of_study}
                  onChange={(e) =>
                    handleChange("field_of_study", e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Year of passing<span className="text-red-500">*</span>
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="number"
                  name="year_of_passing"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.year_of_passing}
                  onChange={(e) =>
                    handleChange("year_of_passing", e.target.value)
                  }
                  minLength={4}
                  maxLength={4}
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    e.target.value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                  }}
                  required
                />
              </div>
            </div>
            <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Percentage/Grade<span className="text-red-500">*</span>
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="text"
                  name="percentage"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.percentage}
                  onChange={(e) => handleChange("percentage", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          {/* {Skill} */}
          <Heading
            size="3xl"
            className="block my-2 text-sm font-extrabold text-gray-900 dark:text-white-A700 pt-4"
          >
            Skills
          </Heading>
          <div className="grid grid-cols-3 gap-x-10 gap-y-4 md:grid-cols-2 sm:grid-cols-1 sm:gap-6">
            <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Skill<span className="text-red-500">*</span>
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="text"
                  name="skill"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.skill}
                  onChange={(e) => handleChange("skill", e.target.value)}
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Remove non-alphabetic characters
                  }}
                  required
                />
              </div>
            </div>
            <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Certification<span className="text-red-500">*</span>
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="text"
                  name="certification"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.certification}
                  onChange={(e) =>
                    handleChange("certification", e.target.value)
                  }
                  required
                />
              </div>
            </div>
            {/* <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                License:
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="text"
                  name="license"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.license}
                  onChange={(e) =>
                    handleChange( "license", e.target.value)
                  }
                />
              </div>
            </div> */}
            {/* {Emergency Contact} */}
            {/* <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Emergency Contact Name:
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="text"
                  name="emergency_contact_name"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.emergency_contact_name}
                  onChange={(e) =>
                    handleChange(
                      "emergency_contact_name",
                      e.target.value
                    )
                  }
                />
              </div>
            </div> */}
            {/* <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Relation:
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="text"
                  name="relation"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.relation}
                  onChange={(e) =>
                    handleChange(
                      "relation",
                      e.target.value
                    )
                  }
                />
              </div>
            </div> */}

            {/* {Language spoken} */}
            <div className="sm:w-[400px]">
              <Heading
                size="s"
                className="block my-4 text-sm font-medium text-gray-900 dark:text-white-A700"
              >
                Language Known<span className="text-red-500">*</span>
              </Heading>
              <div className="h-[47px] rounded-lg pl-[23px] pr-[35px] items-center justify-center font-medium bg-teal-900 border border-teal-90 !text-white-A700 text-sm focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                <input
                  type="text"
                  name="emergency_contact_number"
                  className="bg-transparent outline-none w-full h-full px-2"
                  value={formData.languages}
                  onChange={(e) => handleChange("languages", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className=" flex my-5 mx-auto xs:h-[40px] sm:w-full   font-bold max-w-[250px] bg-deep_orange-500 z-10 transition hover:bg-white-A700 border hover:text-deep_orange-500 border-deep_orange-500"
          >
            Submit
          </Button>
        </form>
      )}

      {/* post form data */}
    </>
  );
};

export default TeacherEditProfile;