import React, { useState } from 'react';
import axios from 'helper/axios';
import Swal from 'sweetalert2';
import Topbar from 'components/Topbar';
import { useAuthContext } from 'hooks/useAuthContext';
import { useBranch } from 'hooks/Branch';

const AdminBranch = () => {
    const { branchData } = useBranch();
    const { user }: any = useAuthContext();
    const [data, setData] = useState({ name: '' });
    const [selectedBranch, setSelectedBranch] = useState('');
    const [admissionDetails, setAdmissionDetails] = useState([]);
    const [teachersData, setTeachersData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(2);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('students');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/branches/', data, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
            });
            Swal.fire({
                icon: 'success',
                title: 'Branch Created Successfully',
                showConfirmButton: false,
                timer: 1500,
            });
            setData({ name: '' });
            setIsModalOpen(false);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Failed to Create Branch',
                text: 'Something went wrong!',
            });
        }
    };

    const handleChange = (fieldName, value) => {
        setData((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
    };

    const handleBranchChange = async (event) => {
        const branchId = event.target.value;
        setSelectedBranch(branchId);

        if (branchId) {
            try {
                const response = await axios.get(`/api/admission/forSearch/${branchId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setAdmissionDetails(response.data);
            } catch (error) {
                console.error('Error fetching admission details:', error);
                setAdmissionDetails([]);
            }
        } else {
            setAdmissionDetails([]);
        }
    };

    const handleBranchChangeTeachers = async (event) => {
        const branchId = event.target.value;
        setSelectedBranch(branchId);

        if (branchId) {
            try {
                const response = await axios.get(`/api/teachers/for_search/${branchId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setTeachersData(response.data);
            } catch (error) {
                console.error('Error fetching teachers details:', error);
                setTeachersData([]);
            }
        } else {
            setTeachersData([]);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = admissionDetails.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(admissionDetails.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <Topbar heading="Branch" />

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between mb-4">
                    <div>
                        <button
                            className={`px-4 py-2  rounded-md ${activeTab === 'students'
                                ? "bg-teal-900 text-white-A700"
                                : "bg-gray-200 text-gray-600"
                                }`}
                            onClick={() => setActiveTab('students')}
                        >
                            Students
                        </button>
                        <button
                            className={`px-4 py-2  rounded-md ${activeTab === 'teachers'
                                ? "bg-teal-900  text-white-A700"
                                : "bg-gray-200 text-gray-600"
                                }`}
                            onClick={() => setActiveTab('teachers')}
                        >
                            Teachers
                        </button>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white justify-between items-center">Branch Information</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-teal-900 hover:!bg-blue-900 text-white  py-2 px-4 rounded-lg transition duration-300 text-white-A700"
                    >
                        Create Branch
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 mt-6 flex flex-col items-center justify-center itr ">
                    <div className="flex items-center space-x-4 mb-8">
                        <label className="text-lg font-medium text-gray-700 dark:text-gray-300">
                            Select Branch
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                            value={selectedBranch}
                            onChange={activeTab === 'students' ? handleBranchChange : handleBranchChangeTeachers}
                            className="w-64 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition duration-150 ease-in-out"
                        >
                            <option value="">Select Branch</option>
                            {branchData.map((ele) => (
                                <option key={ele.id} value={ele.id}>
                                    {ele.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {activeTab === 'students' && admissionDetails.length > 0 && (
                        <div className="grid grid-cols-1 gap-6">
                            {currentItems.map((student) => (
                                <div key={student.user_id} className="bg-gray-50 dark:bg-gray-700 shadow-md rounded-lg p-6 transition duration-300 ease-in-out transform hover:scale-105">
                                    <div className="grid grid-cols-1 gap-4">
                                        <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                                            {student.first_name} {student.last_name}
                                        </h3>
                                        <div className="flex gap-6">
                                            <div className="rounded-lg p-4">
                                                <h4 className="font-semibold dark:text-gray-200 mb-2 text-indigo-500">Personal Details</h4>
                                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                                                    <InfoItem label="Gender" value={student.gender} />
                                                    <InfoItem label="Nationality" value={student.nationality} />
                                                    <InfoItem label="Date of Joining" value={student.date_of_joining} />
                                                    <InfoItem label="Referral" value={student.referral || 'N/A'} />
                                                    <InfoItem label="Branch Name" value={student.branch_name} />
                                                    <InfoItem label="Primary No" value={student.contact_info?.primary_no} />
                                                </div>
                                            </div>
                                            <div className="rounded-lg p-4">
                                                <h4 className="font-semibold text-indigo-500 dark:text-gray-200 mb-2">Course Details</h4>
                                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                                                    <InfoItem label="Course" value={student.course_details.courses?.name} />
                                                    <InfoItem label="Standard" value={student.course_details.standards?.name} />
                                                    <InfoItem label="Subject" value={student.course_details.subjects?.name} />
                                                    <InfoItem label="Module" value={student.course_details.modules?.name} />
                                                </div>
                                            </div>
                                            <div className="rounded-lg p-4">
                                                <h4 className="font-semibold text-indigo-500 dark:text-gray-200 mb-2">Payment Details</h4>
                                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                                                    <InfoItem label="Payment Mode" value={student.payment_details?.payment_mode} />
                                                    <InfoItem label="Amount" value={student.payment_details?.amount} />
                                                    <InfoItem label="Created On" value={new Date(student.payment_details?.created_on).toLocaleString()} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'teachers' && teachersData.length > 0 && (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                            {teachersData.map((teacher) => (
                                <div key={teacher.user_id} className="bg-gray-50 dark:bg-gray-700 shadow-md rounded-lg p-6 transition duration-300 ease-in-out transform hover:scale-105">
                                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                                        {teacher.name} {teacher.last_name}
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {/* Column 1: Personal Details */}
                                        <div>
                                            <h4 className="font-semibold dark:text-gray-200 mb-2 text-indigo-500">Personal Details</h4>
                                            <div className="space-y-2">
                                                <InfoItem label="Gender" value={teacher.gender} />
                                                <InfoItem label="Email" value={teacher.contact_info.primary_email_id} />
                                                <InfoItem label="Branch" value={teacher.branch_name} />
                                                <InfoItem label="Phone" value={teacher.contact_info.primary_number} />
                                                <InfoItem label="D.O.B" value={teacher.employee.dob} />
                                                <InfoItem label="Nationality" value={teacher.employee.nationality} />
                                            </div>
                                        </div>

                                        {/* Column 2: Education Details */}
                                        <div>
                                            <h4 className="font-semibold text-indigo-500 dark:text-gray-200 mb-2">Education Details</h4>
                                            <div className="space-y-2">
                                                <InfoItem label="Education level" value={teacher.education.education_level} />
                                                <InfoItem label="Field of study" value={teacher.education.field_of_study} />
                                                <InfoItem label="Year of passing" value={teacher.education.year_of_passing} />
                                                <InfoItem label="Percentage" value={teacher.education.percentage} />
                                            </div>
                                        </div>

                                        {/* Column 3: Skills Details */}
                                        <div>
                                            <h4 className="font-semibold text-indigo-500 dark:text-gray-200 mb-2">Skills Details</h4>
                                            <div className="space-y-2">
                                                <InfoItem label="Skill" value={teacher.skill.skill} />
                                                <InfoItem label="Certification" value={teacher.skill.certification} />
                                                <InfoItem label="Known Languages" value={teacher.languages_spoken.languages} />
                                                <InfoItem label="Date of hire" value={teacher.employee.date_of_hire} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {(activeTab === 'students' ? admissionDetails.length === 0 : teachersData.length === 0) && (
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">No data available</p>
                        </div>
                    )}

                    {activeTab === 'students' && admissionDetails.length > 0 && (
                        <div className="flex justify-center mt-6">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`mx-1 px-4 py-2 rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} transition duration-200`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full mt-32 ml-24">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Add New Branch</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2">Branch Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter branch name"
                                    value={data.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition duration-150 ease-in-out"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="mr-2 bg-red-500 text-white  py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-teal-900 hover:!bg-blue-900 text-white  py-2 px-4 rounded-lg  transition duration-300 text-white-A700"
                                >
                                    Create Branch
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

const InfoItem = ({ label, value }) => (
    <div>
        <span className="font-semibold text-gray-800 dark:text-gray-200">{label}: </span>
        <span className="text-gray-600 dark:text-gray-400">{value}</span>
    </div>
);

export default AdminBranch;