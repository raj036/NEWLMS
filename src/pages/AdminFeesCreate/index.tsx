import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Topbar from "components/Topbar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import Swal from "sweetalert2";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "hooks/useAuthContext";
import axios from "helper/axios";
import { ArrowLeft, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FessCreate = () => {
    const { user }: any = useAuthContext();
    const [isDialogue, setIsDialogue] = useState(false);
    const [isEditDialogue, setIsEditDialogue] = useState(false);
    const [years, setYears] = useState<number>(0);
    const [formData, setFormData] = useState({
        course_id: "",
        standard_id: "",
        subject_id: "",
        module_id: "",
        batch_id: "",
        amount: "",
        year: years,
    });
    const [editFormData, setEditFormData] = useState({
        fee_id: "",
        course_id: "",
        standard_id: "",
        subject_id: "",
        module_id: "",
        batch_id: "",
        amount: "",
        year: "",
    });
    const [courses, setCourses] = useState([]);
    const [standards, setStandards] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [modules, setModules] = useState([]);
    const [editStandards, setEditStandards] = useState([]);
    const [editSubjects, setEditSubjects] = useState([]);
    const [editModules, setEditModules] = useState([]);
    const [batchData, setBatchData] = useState([]);
    const [feeData, setFeeData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [Batch, setBatch] = useState({ size: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`api/courses_all/`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setCourses(response.data.course_list);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        fetchCourses();
    }, [user.token]);

    const handleInputChange = (field: any, value: any) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));

        if (field === 'course_id') {
            handleCourseChange(value);
        } else if (field === 'standard_id') {
            handleStandardChange(value);
        } else if (field === 'subject_id') {
            handleSubjectChange(value);
        }
    };

    const handleEditInputChange = (field: any, value: any) => {
        setEditFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));

        if (field === 'course_id') {
            handleEditCourseChange(value);
        } else if (field === 'standard_id') {
            handleEditStandardChange(value);
        } else if (field === 'subject_id') {
            handleEditSubjectChange(value);
        }
    };

    const handleCourseChange = (courseId) => {
        const selectedCourse = courses.find((c) => c.course_id.toString() === courseId);
        if (selectedCourse) {
            setStandards(selectedCourse.standards || []);
            setSubjects([]);
            setModules([]);
            
            // Reset dependent fields
            setFormData(prev => ({
                ...prev,
                standard_id: "",
                subject_id: "",
                module_id: "",
                course_id: courseId
            }));
        }
    };

    const handleEditCourseChange = (courseId) => {
        const selectedCourse = courses.find((c) => c.course_id.toString() === courseId);
        if (selectedCourse) {
            setEditStandards(selectedCourse.standards || []);
            setEditSubjects([]);
            setEditModules([]);
            
            // Reset dependent fields
            setEditFormData(prev => ({
                ...prev,
                standard_id: "",
                subject_id: "",
                module_id: "",
                course_id: courseId
            }));
        }
    };

    const handleStandardChange = (standardId) => {
        const selectedStandard = standards.find((s) => s.standard_id.toString() === standardId);
        if (selectedStandard) {
            setSubjects(selectedStandard.subjects || []);
            setModules([]);
            
            // Reset dependent fields
            setFormData(prev => ({
                ...prev,
                subject_id: "",
                module_id: "",
                standard_id: standardId
            }));
        }
    };

    const handleEditStandardChange = (standardId) => {
        const selectedStandard = editStandards.find((s) => s.standard_id.toString() === standardId);
        if (selectedStandard) {
            setEditSubjects(selectedStandard.subjects || []);
            setEditModules([]);
            
            // Reset dependent fields
            setEditFormData(prev => ({
                ...prev,
                subject_id: "",
                module_id: "",
                standard_id: standardId
            }));
        }
    };

    const handleSubjectChange = (subjectId) => {
        const selectedSubject = subjects.find((s) => s.subject_id.toString() === subjectId);
        if (selectedSubject) {
            setModules(selectedSubject.modules || []);
            
            // Update form data
            setFormData(prev => ({
                ...prev,
                module_id: "",
                subject_id: subjectId
            }));
        }
    };

    const handleEditSubjectChange = (subjectId) => {
        const selectedSubject = editSubjects.find((s) => s.subject_id.toString() === subjectId);
        if (selectedSubject) {
            setEditModules(selectedSubject.modules || []);
            
            // Update form data
            setEditFormData(prev => ({
                ...prev,
                module_id: "",
                subject_id: subjectId
            }));
        }
    };

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const response = await axios.get(`/api/batches/`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setBatchData(response.data);
            } catch (error) {
                console.error("Error fetching batches:", error);
            }
        };

        fetchBatches();
    }, [user.token]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await axios.post("/api/fees/create_fees/", formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            });

            Swal.fire({
                icon: "success",
                title: `Fee Created Successfully`,
                customClass: {
                    icon: "swal-my-icon",
                },
                showConfirmButton: false,
                timer: 1500,
            });
            setIsDialogue(false);
            setFormData({
                course_id: "",
                standard_id: "",
                subject_id: "",
                module_id: "",
                batch_id: "",
                amount: "",
                year: years,
            });
            fetchFees();
        } catch (error) {
            console.error("Error creating fee:", error);
            Swal.fire({
                icon: "error",
                title: "Error creating fee.",
                customClass: {
                    icon: "swal-my-icon",
                },
                text: error?.response?.data?.message || "Please try again later.",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    const handleEditSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await axios.put(`/api/fees/update_fees/${editFormData.fee_id}/`, editFormData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            });

            Swal.fire({
                icon: "success",
                title: `Fee Updated Successfully`,
                customClass: {
                    icon: "swal-my-icon",
                },
                showConfirmButton: false,
                timer: 1500,
            });
            setIsEditDialogue(false);
            fetchFees();
        } catch (error) {
            console.error("Error updating fee:", error);
            Swal.fire({
                icon: "error",
                title: "Error updating fee.",
                customClass: {
                    icon: "swal-my-icon",
                },
                text: error?.response?.data?.message || "Please try again later.",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    const fetchFees = async () => {
        try {
            const response = await axios.get(`/api/fees/all_fees/`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setFeeData(response.data);
        } catch (error) {
            console.error("Error fetching fees:", error);
        }
    };

    useEffect(() => {
        fetchFees();
    }, [user.token]);

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleSubmit1 = async (e: any) => {
        e.preventDefault();
        try {
            await axios.post('/api/batches/', Batch, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
            });
            Swal.fire({
                icon: 'success',
                title: 'Batch Created Successfully',
                showConfirmButton: false,
                timer: 1500,
            });
            setIsModalOpen(false);
            // Refresh batch data after creating new batch
            const response = await axios.get(`/api/batches/`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setBatchData(response.data);
            setBatch({ size: '' });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Failed to Create Batch',
                text: 'Something went wrong!',
            });
        }
    };

    const handleChange1 = (fieldName: string, value: any) => {
        setBatch((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
    };

    // Function to handle edit action
    const handleEdit = async (fee) => {
        try {
            // Set the form data with the selected fee's values
            setEditFormData({
                fee_id: fee.fee_id,
                course_id: fee.course_id.toString(),
                standard_id: fee.standard_id.toString(),
                subject_id: fee.subject_id.toString(),
                module_id: fee.module_id.toString(),
                batch_id: fee.batch_id.toString(),
                amount: fee.amount.toString(),
                year: fee.year.toString(),
            });

            // First, load the course data
            const selectedCourse = courses.find((c) => c.course_id.toString() === fee.course_id.toString());
            if (selectedCourse) {
                setEditStandards(selectedCourse.standards || []);
                
                // Then load standard data
                const selectedStandard = selectedCourse.standards.find(
                    (s) => s.standard_id.toString() === fee.standard_id.toString()
                );
                
                if (selectedStandard) {
                    setEditSubjects(selectedStandard.subjects || []);
                    
                    // Then load subject data
                    const selectedSubject = selectedStandard.subjects.find(
                        (s) => s.subject_id.toString() === fee.subject_id.toString()
                    );
                    
                    if (selectedSubject) {
                        setEditModules(selectedSubject.modules || []);
                    }
                }
            }
            
            // Open the edit dialog
            setTimeout(() => {
                setIsEditDialogue(true);
            },1000)
        } catch (error) {
            console.error("Error setting up edit form:", error);
            Swal.fire({
                icon: "error",
                title: "Error loading fee data.",
                text: "Please try again later.",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    return (
        <>
            <Topbar heading={"Fees"} />
            <div className="container py-5">
                <button
                    onClick={handleBackClick}
                    className="flex items-center space-x-2 text-teal-900 hover:text-blue-900"
                >
                    <ArrowLeft className="w-6 h-6" />
                    <span>Back</span>
                </button>

                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 opacity-1 bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white p-6 rounded-md shadow-lg w-1/2 z-50">
                            <h2 className="text-lg font-bold mb-4">Create Batch</h2>
                            <form onSubmit={handleSubmit1}>
                                <div className="mb-4">
                                    <Label htmlFor="batch_size">Batch Size</Label>
                                    <Input
                                        id="batch_size"
                                        type="text"
                                        value={Batch.size}
                                        onChange={(e) => handleChange1("size", e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" className="bg-teal-900 hover:!bg-blue-900">
                                        Submit
                                    </Button>
                                    <Button
                                        onClick={() => setIsModalOpen(false)}
                                        className="ml-4 bg-red-600 hover:bg-red-700"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-teal-900 hover:!bg-blue-900 text-white py-2 px-4 rounded-lg transition duration-300 text-white-A700 mt-4"
                >
                    Create Batch
                </button>

                {/* Create Fee Dialog */}
                <Dialog open={isDialogue} onOpenChange={setIsDialogue}>
                    <div className="flex justify-end my-4">
                        <DialogTrigger asChild>
                            <Button className="bg-teal-900 hover:!bg-blue-900 mb-4">
                                Create Fees
                            </Button>
                        </DialogTrigger>
                    </div>
                    <DialogContent className="overflow-scroll">
                        <DialogHeader>Add fees here</DialogHeader>
                        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="course_id" className="text-right">
                                    Course
                                </Label>
                                <select
                                    id="course_id"
                                    className="col-span-3"
                                    value={formData.course_id}
                                    onChange={(e) => handleInputChange("course_id", e.target.value)}
                                    required
                                >
                                    <option value="">Select course...</option>
                                    {courses.map((course) => (
                                        <option key={course.course_id} value={course.course_id}>
                                            {course.course_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="standard_id" className="text-right">
                                    Standard
                                </Label>
                                <select
                                    id="standard_id"
                                    className="col-span-3"
                                    value={formData.standard_id}
                                    onChange={(e) => handleInputChange("standard_id", e.target.value)}
                                    required
                                >
                                    <option value="">Select standard...</option>
                                    {standards.map((standard) => (
                                        <option key={standard.standard_id} value={standard.standard_id}>
                                            {standard.standard_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="subject_id" className="text-right">
                                    Subject
                                </Label>
                                <select
                                    id="subject_id"
                                    className="col-span-3"
                                    value={formData.subject_id}
                                    onChange={(e) => handleInputChange("subject_id", e.target.value)}
                                    required
                                >
                                    <option value="">Select subject...</option>
                                    {subjects.map((subject) => (
                                        <option key={subject.subject_id} value={subject.subject_id}>
                                            {subject.subject_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="module_id" className="text-right">
                                    Module
                                </Label>
                                <select
                                    id="module_id"
                                    className="col-span-3"
                                    value={formData.module_id}
                                    onChange={(e) => handleInputChange("module_id", e.target.value)}
                                    required
                                >
                                    <option value="">Select module...</option>
                                    {modules.map((module) => (
                                        <option key={module.module_id} value={module.module_id}>
                                            {module.module_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="batch_id" className="text-right">
                                    Batch
                                </Label>
                                <select
                                    id="batch_id"
                                    className="col-span-3"
                                    value={formData.batch_id}
                                    onChange={(e) => handleInputChange("batch_id", e.target.value)}
                                    required
                                >
                                    <option value="">Select batch...</option>
                                    {batchData.map((batch) => (
                                        <option key={batch.id} value={batch.id}>
                                            {batch.size}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="year" className="text-right">
                                    Year
                                </Label>
                                <Input
                                    id="year"
                                    type="number"
                                    className="col-span-3"
                                    value={formData.year}
                                    onChange={(e) => handleInputChange("year", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="amount" className="text-right">
                                    Amount
                                </Label>
                                <Input
                                    type="number"
                                    id="amount"
                                    className="col-span-3"
                                    value={formData.amount}
                                    onChange={(e) => handleInputChange("amount", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit">Submit</Button>
                            </div>
                        </form>
                    </DialogContent>
                    <DialogFooter />
                </Dialog>

                {/* Edit Fee Dialog */}
                <Dialog open={isEditDialogue} onOpenChange={setIsEditDialogue}>
                    <DialogContent className="overflow-scroll">
                        <DialogHeader>
                            <DialogTitle>Edit Fee</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit} className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit_course_id" className="text-right">
                                    Course
                                </Label>
                                <select
                                    id="edit_course_id"
                                    className="col-span-3"
                                    value={editFormData.course_id}
                                    onChange={(e) => handleEditInputChange("course_id", e.target.value)}
                                    required
                                >
                                    <option value="">Select course...</option>
                                    {courses.map((course) => (
                                        <option key={course.course_id} value={course.course_id}>
                                            {course.course_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit_standard_id" className="text-right">
                                    Standard
                                </Label>
                                <select
                                    id="edit_standard_id"
                                    className="col-span-3"
                                    value={editFormData.standard_id}
                                    onChange={(e) => handleEditInputChange("standard_id", e.target.value)}
                                    required
                                >
                                    <option value="">Select standard...</option>
                                    {editStandards.map((standard) => (
                                        <option key={standard.standard_id} value={standard.standard_id}>
                                            {standard.standard_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit_subject_id" className="text-right">
                                    Subject
                                </Label>
                                <select
                                    id="edit_subject_id"
                                    className="col-span-3"
                                    value={editFormData.subject_id}
                                    onChange={(e) => handleEditInputChange("subject_id", e.target.value)}
                                    required
                                >
                                    <option value="">Select subject...</option>
                                    {editSubjects.map((subject) => (
                                        <option key={subject.subject_id} value={subject.subject_id}>
                                            {subject.subject_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit_module_id" className="text-right">
                                    Module
                                </Label>
                                <select
                                    id="edit_module_id"
                                    className="col-span-3"
                                    value={editFormData.module_id}
                                    onChange={(e) => handleEditInputChange("module_id", e.target.value)}
                                    required
                                >
                                    <option value="">Select module...</option>
                                    {editModules.map((module) => (
                                        <option key={module.module_id} value={module.module_id}>
                                            {module.module_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit_batch_id" className="text-right">
                                    Batch
                                </Label>
                                <select
                                    id="edit_batch_id"
                                    className="col-span-3"
                                    value={editFormData.batch_id}
                                    onChange={(e) => handleEditInputChange("batch_id", e.target.value)}
                                    required
                                >
                                    <option value="">Select batch...</option>
                                    {batchData.map((batch) => (
                                        <option key={batch.id} value={batch.id}>
                                            {batch.size}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit_year" className="text-right">
                                    Year
                                </Label>
                                <Input
                                    id="edit_year"
                                    type="number"
                                    className="col-span-3"
                                    value={editFormData.year}
                                    onChange={(e) => handleEditInputChange("year", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit_amount" className="text-right">
                                    Amount
                                </Label>
                                <Input
                                    type="number"
                                    id="edit_amount"
                                    className="col-span-3"
                                    value={editFormData.amount}
                                    onChange={(e) => handleEditInputChange("amount", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" className="bg-teal-900 hover:!bg-blue-900 mr-2">Update</Button>
                                <Button type="button" onClick={() => setIsEditDialogue(false)} className="bg-gray-500 hover:bg-gray-600">Cancel</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Course</TableHead>
                            <TableHead>Standard</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Module</TableHead>
                            <TableHead>Batch</TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {feeData.map((fee) => (
                            <TableRow key={fee.fee_id}>
                                <TableCell>{fee.course_name}</TableCell>
                                <TableCell>{fee.standard_name}</TableCell>
                                <TableCell>{fee.subject_name}</TableCell>
                                <TableCell>{fee.module_name}</TableCell>
                                <TableCell>{fee.batch_name}</TableCell>
                                <TableCell>{fee.year}</TableCell>
                                <TableCell>{fee.amount}</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => handleEdit(fee)}
                                        className="bg-teal-900 hover:!bg-blue-900"
                                        size="sm"
                                    >
                                        <Edit className="h-4 w-4 mr-1" /> Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
};

export default FessCreate;