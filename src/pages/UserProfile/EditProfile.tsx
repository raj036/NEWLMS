import { Button } from "@/components/ui/button";
import Topbar from "components/Topbar";
import axios from "helper/axios";
import { useAuthContext } from "hooks/useAuthContext";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EditProfile = () => {
    const { user }: any = useAuthContext();
    const navigate = useNavigate();
    const [parentData, setParentData] = useState<any>();
    const [studentId, setStudentId] = useState<any>();
    const [studentData, setStudentData] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        date_of_birth: "",
        gender: "",
        nationality: "",
        referral: "",
        date_of_joining: "",
        date_of_completion: "",
        id_proof_url: "",
        address_proof_url: null,
        contact_info: {
            primary_no: "",
            secondary_no: "",
            primary_email: "",
            secondary_email: "",
            current_address: "",
            permanent_address: "",
        },
        pre_education: {
            student_class: "",
            school: "",
            year_of_passing: 0,
            percentage: 0,
        },
        parent_info: {
            p_first_name: "",
            p_middle_name: "",
            p_last_name: "",
            guardian: "",
            primary_no: "",
            primary_email: "",
        },
    });

    useEffect(() => {
        fetchStudentData();
    }, []);

    const fetchStudentData = () => {
        axios
            .get(`api/admission/${user.user_id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                setStudentData(response.data);
                setStudentId(response.data.student_id);
            })
            .catch((error) => {
                // console.error("There was an error fetching the data!", error);
            });
    };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setStudentData({
            ...studentData,
            [name]: value,
        });
    };

    const handleNestedInputChange = (e: any, section: any) => {
        const { name, value } = e.target;
        setStudentData({
            ...studentData,
            [section]: {
                ...studentData[section],
                [name]: value,
            },
        });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        // Prepare data structure for PUT request
        const updatedData = {
            student_update: {
                first_name: studentData.first_name,
                middle_name: studentData.middle_name,
                last_name: studentData.last_name,
                date_of_birth: studentData.date_of_birth,
                gender: studentData.gender,
                nationality: studentData.nationality,
                referral: studentData.referral,
                date_of_joining: studentData.date_of_joining,
                date_of_completion: studentData.date_of_completion,
            },
            contact_info: {
                primary_no: studentData.contact_info.primary_no,
                secondary_no: studentData.contact_info.secondary_no,
                primary_email: studentData.contact_info.primary_email,
                secondary_email: studentData.contact_info.secondary_email,
                current_address: studentData.contact_info.current_address,
                permanent_address: studentData.contact_info.permanent_address,
            },
            pre_education: {
                student_class: studentData.pre_education.student_class,
                school: studentData.pre_education.school,
                year_of_passing: studentData.pre_education.year_of_passing,
                percentage: studentData.pre_education.percentage,
            },
            parent_info: {
                p_first_name: studentData.parent_info.p_first_name,
                p_middle_name: studentData.parent_info.p_middle_name,
                p_last_name: studentData.parent_info.p_last_name,
                guardian: studentData.parent_info.guardian,
                primary_no: studentData.parent_info.primary_no,
                primary_email: studentData.parent_info.primary_email,
            },
        };

        axios
            .put(`/api/admission/${studentId}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                Swal.fire({
                    text: "Form updated Success Fully",
                    icon: "success",
                    customClass: {
                        icon: "swal-my-icon",
                    },
                    confirmButtonColor: "#7066E0",
                    confirmButtonText: "OK",
                });
                fetchStudentData(); // Fetch updated data after successful update
            })
            .catch((error) => {
                // console.error("There was an error updating the data!", error);
                Swal.fire({
                    text: "Form not updated due to some issue",
                    icon: "error",
                    customClass: {
                        icon: "swal-my-icon",
                    },
                    confirmButtonColor: "#7066E0",
                    confirmButtonText: "OK",
                });
            });
    };

    const handleBackClick = () => {
        navigate(-1);
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

            <form onSubmit={handleSubmit}>
                <div className="flex lg:flex-col">
                    <div className="p-5 w-[40%] lg:w-[90%] sm:w-[180%] sm:overflow-x-scroll ">
                        <div className="font-semibold	text-[16px] mb-4 ml-1">
                            Contact Details
                        </div>
                        <div className="h-full rounded-[10px] shadow-lg -w-[35%] p-4 text-[14px]">
                            <div className="flex justify-between border-b-2 py-2">
                                <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                                    First Name:
                                </span>
                                <input
                                    type="text"
                                    className="w-[60%]"
                                    name="first_name"
                                    value={studentData.first_name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex justify-between border-b-2 py-2">
                                <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                                    Middle Name:
                                </span>
                                <input
                                    type="text"
                                    className="w-[60%]"
                                    name="middle_name"
                                    value={studentData.middle_name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex justify-between border-b-2 py-2">
                                <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                                    Last Name:
                                </span>
                                <input
                                    type="text"
                                    className="w-[60%]"
                                    name="last_name"
                                    value={studentData.last_name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex justify-between border-b-2 py-2">
                                <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                                    Date of Birth:
                                </span>
                                <input
                                    type="date"
                                    className="w-[60%]"
                                    name="date_of_birth"
                                    value={studentData.date_of_birth}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex justify-between border-b-2 py-2">
                                <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                                    Gender:
                                </span>
                                <input
                                    type="text"
                                    className="w-[60%]"
                                    name="gender"
                                    value={studentData.gender}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex justify-between border-b-2 py-2">
                                <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                                    Nationality:
                                </span>
                                <input
                                    type="text"
                                    className="w-[60%]"
                                    name="nationality"
                                    value={studentData.nationality}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex justify-between border-b-2 py-2">
                                <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                                    Primary No:
                                </span>
                                <input
                                    type="text"
                                    className="w-[60%]"
                                    name="primary_no"
                                    value={studentData.contact_info.primary_no}
                                    onChange={(e) => handleNestedInputChange(e, "contact_info")}
                                />
                            </div>
                            <div className="flex justify-between border-b-2 py-2">
                                <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                                    Secondary No:
                                </span>
                                <input
                                    className="w-[60%]"
                                    type="text"
                                    name="secondary_no"
                                    value={studentData.contact_info.secondary_no}
                                    onChange={(e) => handleNestedInputChange(e, "contact_info")}
                                />
                            </div>
                            <div className="flex justify-between border-b-2 py-2">
                                <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                                    Primary Email:
                                </span>
                                <input
                                    type="email"
                                    className="w-[60%]"
                                    name="primary_email"
                                    value={studentData.contact_info.primary_email}
                                    onChange={(e) => handleNestedInputChange(e, "contact_info")}
                                />
                            </div>
                            <div className="flex justify-between border-b-2 py-2">
                                <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                                    Secondary Email:
                                </span>
                                <input
                                    type="email"
                                    className="w-[60%]"
                                    name="secondary_email"
                                    value={studentData.contact_info.secondary_email}
                                    onChange={(e) => handleNestedInputChange(e, "contact_info")}
                                />
                            </div>
                            <div className="flex justify-between border-b-2 py-2">
                                <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                                    Current Address:
                                </span>
                                <input
                                    type="text"
                                    className="w-[60%]"
                                    name="current_address"
                                    value={studentData.contact_info.current_address}
                                    onChange={(e) => handleNestedInputChange(e, "contact_info")}
                                />
                            </div>
                            <div className="flex justify-between border-b-2 py-2">
                                <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                                    Permanent Address:
                                </span>
                                <input
                                    type="text"
                                    className="w-[60%]"
                                    name="permanent_address"
                                    value={studentData.contact_info.permanent_address}
                                    onChange={(e) => handleNestedInputChange(e, "contact_info")}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Parents Information */}
                    <div className="w-[40%] lg:w-[90%] sm:w-[180%]  overflow-x-scroll">
                        <div className="p-5 ">
                            <div className="font-semibold	text-[16px] mb-4 ml-1">
                                Parent Details
                            </div>
                            <div className=" rounded-[10px] shadow-lg -w-[35%] p-4  text-[14px]">
                                <div className="flex justify-between border-b-2 pb-2 text-[14px]">
                                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                                        Parent First Name:
                                    </span>
                                    <input
                                        type="text"
                                        className="w-[60%]"
                                        name="p_first_name"
                                        value={studentData.parent_info.p_first_name}
                                        onChange={(e) => handleNestedInputChange(e, "parent_info")}
                                    />
                                </div>
                                <div className="flex justify-between border-b-2 pb-2 text-[14px]">
                                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                                        Parent Middle Name:
                                    </span>
                                    <input
                                        type="text"
                                        className="w-[60%]"
                                        name="p_middle_name"
                                        value={studentData.parent_info.p_middle_name}
                                        onChange={(e) => handleNestedInputChange(e, "parent_info")}
                                    />
                                </div>
                                <div className="flex justify-between border-b-2 pb-2 text-[14px]">
                                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                                        Parent Last Name:
                                    </span>
                                    <input
                                        type="text"
                                        className="w-[60%]"
                                        name="p_last_name"
                                        value={studentData.parent_info.p_last_name}
                                        onChange={(e) => handleNestedInputChange(e, "parent_info")}
                                    />
                                </div>
                                <div className="flex justify-between border-b-2 pb-2 text-[14px]">
                                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                                        Guardian:
                                    </span>
                                    <input
                                        type="text"
                                        className="w-[60%]"
                                        name="guardian"
                                        value={studentData.parent_info.guardian}
                                        onChange={(e) => handleNestedInputChange(e, "parent_info")}
                                    />
                                </div>
                                <div className="flex justify-between border-b-2 pb-2 text-[14px]">
                                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                                        Parent Primary No:
                                    </span>
                                    <input
                                        type="text"
                                        className="w-[60%]"
                                        name="primary_no"
                                        value={studentData.parent_info.primary_no}
                                        onChange={(e) => handleNestedInputChange(e, "parent_info")}
                                    />
                                </div>
                                <div className="flex justify-between border-b-2 pb-2 text-[14px]">
                                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                                        Parent Primary Email:
                                    </span>
                                    <input
                                        type="email"
                                        className="w-[60%]"
                                        name="primary_email"
                                        value={studentData.parent_info.primary_email}
                                        onChange={(e) => handleNestedInputChange(e, "parent_info")}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-5 ">
                            <div className="font-semibold	text-[16px] mb-4 ml-1">
                                Education Details
                            </div>
                            <div className=" rounded-[10px] shadow-lg -w-[35%] p-4 text-[14px]">
                                <div className="flex justify-between border-b-2 pb-2 text-[14px]">
                                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                                        Student Class:
                                    </span>
                                    <input
                                        type="text"
                                        className="w-[60%]"
                                        name="student_class"
                                        value={studentData.pre_education.student_class}
                                        onChange={(e) =>
                                            handleNestedInputChange(e, "pre_education")
                                        }
                                    />
                                </div>
                                <div className="flex justify-between border-b-2 pb-2 text-[14px]">
                                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                                        School:
                                    </span>
                                    <input
                                        type="text"
                                        className="w-[60%]"
                                        name="school"
                                        value={studentData.pre_education.school}
                                        onChange={(e) =>
                                            handleNestedInputChange(e, "pre_education")
                                        }
                                    />
                                </div>
                                <div className="flex justify-between border-b-2 pb-2 text-[14px]">
                                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                                        Year of Passing:
                                    </span>
                                    <input
                                        type="number"
                                        className="w-[60%]"
                                        name="year_of_passing"
                                        value={studentData.pre_education.year_of_passing}
                                        onChange={(e) =>
                                            handleNestedInputChange(e, "pre_education")
                                        }
                                    />
                                </div>
                                <div className="flex justify-between border-b-2 pb-2 text-[14px]">
                                    <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                                        Percentage:
                                    </span>
                                    <input
                                        type="number"
                                        className="w-[60%]"
                                        name="percentage"
                                        value={studentData.pre_education.percentage}
                                        onChange={(e) =>
                                            handleNestedInputChange(e, "pre_education")
                                        }
                                    />
                                </div>
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
        </>
    );
};

export default EditProfile;