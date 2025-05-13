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

interface Course {
    course_id: number;
    course_name: string;
    standards: Standard[];
}

interface Standard {
    standard_id: number;
    standard_name: string;
    subjects: Subject[];
}

interface Subject {
    subject_id: number;
    subject_name: string;
    modules: Module[];
}

interface Module {
    module_id: number;
    module_name: string;
}

interface Batch {
    id: number;
    size: string;
}

interface Fee {
    fee_id: number;
    course_id: number;
    course_name: string;
    standard_id: number;
    standard_name: string;
    subject_id: number;
    subject_name: string;
    module_id: number;
    module_name: string;
    batch_id: number;
    batch_name: string;
    year: number;
    amount: number;
}
interface InstallmentDetail {
    id: number;
    course_id: number;
    number_of_installments: number;
    total_amount: number;
    standard_id: number;
    year: number;
    subject_id: number;
    module_id: number;
    batch_id: number;
    installments: {
        installment_number: number;
        amount: number;
        due_date: string;
    }[];
}

interface InstallmentData {
    installment_number: number;
    amount: string;
    due_date: string;
}

const FessCreate = () => {
    const { user }: any = useAuthContext();
    const [isDialogue, setIsDialogue] = useState(false);
    const [isEditDialogue, setIsEditDialogue] = useState(false);
    const [isInstallmentDialogue, setIsInstallmentDialogue] = useState(false);
    const [years, setYears] = useState<number>(0);
    const [selectedInstallmentDetails, setSelectedInstallmentDetails] = useState<InstallmentDetail[]>([]);
    const [isInstallmentDetailsOpen, setIsInstallmentDetailsOpen] = useState(false);
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
    const [installmentFormData, setInstallmentFormData] = useState({
        fee_id: "",
        course_id: "",
        standard_id: "",
        subject_id: "",
        module_id: "",
        batch_id: "",
        branch_id: "",
        year: "",
        total_amount: "",
        number_of_installments: 1,
        installments_data: [
            {
                installment_number: 1,
                amount: "",
                due_date: ""
            }
        ] as InstallmentData[]
    });
    const [courses, setCourses] = useState<Course[]>([]);
    const [standards, setStandards] = useState<Standard[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [modules, setModules] = useState<Module[]>([]);
    const [editStandards, setEditStandards] = useState<Standard[]>([]);
    const [editSubjects, setEditSubjects] = useState<Subject[]>([]);
    const [editModules, setEditModules] = useState<Module[]>([]);
    const [batchData, setBatchData] = useState<Batch[]>([]);
    const [feeData, setFeeData] = useState<Fee[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [Batch, setBatch] = useState({ size: '' });
    const navigate = useNavigate();
    const [installmentDetails, setInstallmentDetails] = useState<InstallmentDetail[]>([]);
    const [showInstallmentDetails, setShowInstallmentDetails] = useState<{ [key: number]: boolean }>({});

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

    const handleInputChange = (field: string, value: string) => {
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

    const handleEditInputChange = (field: string, value: string) => {
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

    const handleCourseChange = (courseId: string) => {
        const selectedCourse = courses.find((c) => c.course_id.toString() === courseId);
        if (selectedCourse) {
            setStandards(selectedCourse.standards || []);
            setSubjects([]);
            setModules([]);

            setFormData(prev => ({
                ...prev,
                standard_id: "",
                subject_id: "",
                module_id: "",
                course_id: courseId
            }));
        }
    };

    const handleEditCourseChange = (courseId: string) => {
        const selectedCourse = courses.find((c) => c.course_id.toString() === courseId);
        if (selectedCourse) {
            setEditStandards(selectedCourse.standards || []);
            setEditSubjects([]);
            setEditModules([]);

            setEditFormData(prev => ({
                ...prev,
                standard_id: "",
                subject_id: "",
                module_id: "",
                course_id: courseId
            }));
        }
    };

    const handleStandardChange = (standardId: string) => {
        const selectedStandard = standards.find((s) => s.standard_id.toString() === standardId);
        if (selectedStandard) {
            setSubjects(selectedStandard.subjects || []);
            setModules([]);

            setFormData(prev => ({
                ...prev,
                subject_id: "",
                module_id: "",
                standard_id: standardId
            }));
        }
    };

    const handleEditStandardChange = (standardId: string) => {
        const selectedStandard = editStandards.find((s) => s.standard_id.toString() === standardId);
        if (selectedStandard) {
            setEditSubjects(selectedStandard.subjects || []);
            setEditModules([]);

            setEditFormData(prev => ({
                ...prev,
                subject_id: "",
                module_id: "",
                standard_id: standardId
            }));
        }
    };

    const handleSubjectChange = (subjectId: string) => {
        const selectedSubject = subjects.find((s) => s.subject_id.toString() === subjectId);
        if (selectedSubject) {
            setModules(selectedSubject.modules || []);

            setFormData(prev => ({
                ...prev,
                module_id: "",
                subject_id: subjectId
            }));
        }
    };

    const handleEditSubjectChange = (subjectId: string) => {
        const selectedSubject = editSubjects.find((s) => s.subject_id.toString() === subjectId);
        if (selectedSubject) {
            setEditModules(selectedSubject.modules || []);

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

    const handleSubmit = async (e: React.FormEvent) => {
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
        } catch (error: any) {
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

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.put(`/api/fees/update_fees/${editFormData.fee_id}`, editFormData, {
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
        } catch (error: any) {
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

            // Fetch installment details for each fee
            const installmentPromises = response.data.map(async (fee: Fee) => {
                try {
                    const installmentResponse = await axios.get(`/api/admin_installments/bycriteria`, {
                        params: {
                            course_id: fee.course_id,
                            standard_id: fee.standard_id,
                            year: fee.year,
                            subject_id: fee.subject_id,
                            module_id: fee.module_id,
                            batch_id: fee.batch_id
                        },
                        headers: { Authorization: `Bearer ${user.token}` },
                    });
                    return installmentResponse.data;
                } catch (error) {
                    console.error("Error fetching installment details:", error);
                    return [];
                }
            });

            const allInstallmentDetails = await Promise.all(installmentPromises);
            setInstallmentDetails(allInstallmentDetails.flat());
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

    const handleSubmit1 = async (e: React.FormEvent) => {
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

    const fetchInstallmentDetails = async (fee: Fee) => {
        try {
            const response = await axios.get(`/api/admin_installments/bycriteria`, {
                params: {
                    course_id: fee.course_id,
                    standard_id: fee.standard_id,
                    year: fee.year,
                    subject_id: fee.subject_id,
                    module_id: fee.module_id,
                    batch_id: fee.batch_id
                },
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setInstallmentDetails(response.data);
        } catch (error) {
            console.error("Error fetching installment details:", error);
            Swal.fire({
                icon: "error",
                title: "Error fetching installment details",
                text: "Please try again later.",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    const handleChange1 = (fieldName: string, value: string) => {
        setBatch((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
    };

    const handleEdit = async (fee: Fee) => {
        try {
            setEditFormData({
                fee_id: fee.fee_id.toString(),
                course_id: fee.course_id.toString(),
                standard_id: fee.standard_id.toString(),
                subject_id: fee.subject_id.toString(),
                module_id: fee.module_id.toString(),
                batch_id: fee.batch_id.toString(),
                amount: fee.amount.toString(),
                year: fee.year.toString(),
            });

            const selectedCourse = courses.find((c) => c.course_id.toString() === fee.course_id.toString());
            if (selectedCourse) {
                setEditStandards(selectedCourse.standards || []);

                const selectedStandard = selectedCourse.standards.find(
                    (s) => s.standard_id.toString() === fee.standard_id.toString()
                );

                if (selectedStandard) {
                    setEditSubjects(selectedStandard.subjects || []);

                    const selectedSubject = selectedStandard.subjects.find(
                        (s) => s.subject_id.toString() === fee.subject_id.toString()
                    );

                    if (selectedSubject) {
                        setEditModules(selectedSubject.modules || []);
                    }
                }
            }

            setTimeout(() => {
                setIsEditDialogue(true);
            }, 500);
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

    const handleInstallmentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post("/api/admin_installments/", {
                ...installmentFormData,
                total_amount: parseFloat(installmentFormData.total_amount),
                number_of_installments: parseInt(installmentFormData.number_of_installments.toString()),
                installments_data: installmentFormData.installments_data.map(installment => ({
                    ...installment,
                    amount: parseFloat(installment.amount)
                }))
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            });

            Swal.fire({
                icon: "success",
                title: `Installments Created Successfully`,
                customClass: {
                    icon: "swal-my-icon",
                },
                showConfirmButton: false,
                timer: 1500,
            });

            // Refresh installment details for this fee
            const fee = feeData.find(f => f.fee_id.toString() === installmentFormData.fee_id);
            if (fee) {
                await fetchInstallmentDetails(fee);
                setShowInstallmentDetails(prev => ({
                    ...prev,
                    [fee.fee_id]: true
                }));
            }

            setIsInstallmentDialogue(false);
        } catch (error: any) {
            console.error("Error creating installments:", error);
            Swal.fire({
                icon: "error",
                title: "Error creating installments.",
                customClass: {
                    icon: "swal-my-icon",
                },
                text: error?.response?.data?.message || "Please try again later.",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    const handleAddInstallment = () => {
        const newInstallmentNumber = installmentFormData.installments_data.length + 1;
        setInstallmentFormData({
            ...installmentFormData,
            installments_data: [
                ...installmentFormData.installments_data,
                {
                    installment_number: newInstallmentNumber,
                    amount: "",
                    due_date: ""
                }
            ]
        });
    };

    const handleRemoveInstallment = (index: number) => {
        const updatedInstallments = installmentFormData.installments_data.filter((_, i) => i !== index)
            .map((inst, idx) => ({ ...inst, installment_number: idx + 1 }));

        setInstallmentFormData({
            ...installmentFormData,
            installments_data: updatedInstallments,
            number_of_installments: updatedInstallments.length
        });
    };

    const handleInstallmentInputChange = (index: number, field: string, value: string) => {
        const updatedInstallments = [...installmentFormData.installments_data];
        updatedInstallments[index] = {
            ...updatedInstallments[index],
            [field]: value
        };

        setInstallmentFormData({
            ...installmentFormData,
            installments_data: updatedInstallments
        });
    };
    //fourth
    const handleInstallmentAction = async (fee: Fee) => {
        // Check if installments exist for this fee
        const feeInstallments = installmentDetails.filter(detail =>
            detail.course_id === fee.course_id &&
            detail.standard_id === fee.standard_id &&
            detail.year === fee.year &&
            detail.subject_id === fee.subject_id &&
            detail.module_id === fee.module_id &&
            detail.batch_id === fee.batch_id
        );

        if (feeInstallments.length > 0) {
            // Show installments in popup
            setSelectedInstallmentDetails(feeInstallments);
            setIsInstallmentDetailsOpen(true);
        } else {
            // Show create installment dialog
            setInstallmentFormData({
                fee_id: fee.fee_id.toString(),
                course_id: fee.course_id.toString(),
                standard_id: fee.standard_id.toString(),
                subject_id: fee.subject_id.toString(),
                module_id: fee.module_id.toString(),
                batch_id: fee.batch_id.toString(),
                branch_id: user.branch_id || "",
                year: fee.year.toString(),
                total_amount: fee.amount.toString(),
                number_of_installments: 1,
                installments_data: [
                    {
                        installment_number: 1,
                        amount: fee.amount.toString(),
                        due_date: ""
                    }
                ]
            });
            setIsInstallmentDialogue(true);
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 opacity-1 backdrop-blur-sm">
                        <div className="z-50 w-1/2 p-6 bg-white rounded-md shadow-lg">
                            <h2 className="mb-4 text-lg font-bold">Create Batch</h2>
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
                            <div className="grid items-center grid-cols-4 gap-4">
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
                            <div className="grid items-center grid-cols-4 gap-4">
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
                            <div className="grid items-center grid-cols-4 gap-4">
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
                            <div className="grid items-center grid-cols-4 gap-4">
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
                            <div className="grid items-center grid-cols-4 gap-4">
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

                            <div className="grid items-center grid-cols-4 gap-4">
                                <Label htmlFor="year" className="text-right">
                                    Year
                                </Label>
                                <Input
                                    id="year"
                                    type="number"
                                    className="col-span-3"
                                    value={formData.year}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === "" || Number(value) >= 0) {
                                            handleInputChange("year", value);
                                        }
                                    }}
                                    required
                                    min="0"
                                />
                            </div>

                            <div className="grid items-center grid-cols-4 gap-4">
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
                {/* Installment Details Popup */}
                <Dialog open={isInstallmentDetailsOpen} onOpenChange={setIsInstallmentDetailsOpen}>
                    <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>Installment Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                            {selectedInstallmentDetails.map((detail, idx) => (
                                <div key={idx} className="border rounded-lg p-4">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <span className="font-semibold">Total Amount: </span>
                                            {detail.total_amount}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Number of Installments: </span>
                                            {detail.number_of_installments}
                                        </div>
                                    </div>

                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Installment #</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Due Date</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {detail.installments.map((inst, i) => (
                                                <TableRow key={i}>
                                                    <TableCell>{inst.installment_number}</TableCell>
                                                    <TableCell>{inst.amount}</TableCell>
                                                    <TableCell>{new Date(inst.due_date).toLocaleDateString()}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ))}
                        </div>
                        <DialogFooter>
                            <Button
                                onClick={() => setIsInstallmentDetailsOpen(false)}
                                className="bg-teal-900 hover:!bg-blue-900"
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Fee Dialog */}
                <Dialog open={isEditDialogue} onOpenChange={setIsEditDialogue}>
                    <DialogContent className="overflow-scroll">
                        <DialogHeader>
                            <DialogTitle>Edit Fee</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit} className="grid gap-4 py-4">
                            <div className="grid items-center grid-cols-4 gap-4">
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

                            <div className="grid items-center grid-cols-4 gap-4">
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

                            <div className="grid items-center grid-cols-4 gap-4">
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

                            <div className="grid items-center grid-cols-4 gap-4">
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

                            <div className="grid items-center grid-cols-4 gap-4">
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

                            <div className="grid items-center grid-cols-4 gap-4">
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

                            <div className="grid items-center grid-cols-4 gap-4">
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

                {/* Installment Dialog */}
                <Dialog open={isInstallmentDialogue} onOpenChange={setIsInstallmentDialogue}>
                    <DialogContent className="overflow-scroll max-h-screen">
                        <DialogHeader>
                            <DialogTitle>Create Installments</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleInstallmentSubmit} className="grid gap-4 py-4">
                            <div className="grid items-center grid-cols-4 gap-4">
                                <Label htmlFor="total_amount" className="text-right">
                                    Total Amount
                                </Label>
                                <Input
                                    id="total_amount"
                                    type="number"
                                    className="col-span-3"
                                    value={installmentFormData.total_amount}
                                    onChange={(e) => setInstallmentFormData({
                                        ...installmentFormData,
                                        total_amount: e.target.value
                                    })}
                                    required
                                />
                            </div>

                            <div className="grid items-center grid-cols-4 gap-4">
                                <Label htmlFor="number_of_installments" className="text-right">
                                    Number of Installments
                                </Label>
                                <Input
                                    id="number_of_installments"
                                    type="number"
                                    className="col-span-3"
                                    value={installmentFormData.number_of_installments}
                                    onChange={(e) => {
                                        const count = parseInt(e.target.value) || 1;
                                        const currentCount = installmentFormData.installments_data.length;

                                        if (count > currentCount) {
                                            const newInstallments = [...installmentFormData.installments_data];
                                            for (let i = currentCount; i < count; i++) {
                                                newInstallments.push({
                                                    installment_number: i + 1,
                                                    amount: "",
                                                    due_date: ""
                                                });
                                            }
                                            setInstallmentFormData({
                                                ...installmentFormData,
                                                number_of_installments: count,
                                                installments_data: newInstallments
                                            });
                                        } else if (count < currentCount) {
                                            setInstallmentFormData({
                                                ...installmentFormData,
                                                number_of_installments: count,
                                                installments_data: installmentFormData.installments_data
                                                    .slice(0, count)
                                                    .map((inst, idx) => ({ ...inst, installment_number: idx + 1 }))
                                            });
                                        }
                                    }}
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="mt-4">
                                <Label className="block mb-2">Installments Details</Label>
                                {installmentFormData.installments_data.map((installment, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-4 mb-4 p-2 border rounded">
                                        <div className="col-span-12 sm:col-span-1">
                                            <Label># {installment.installment_number}</Label>
                                        </div>
                                        <div className="col-span-12 sm:col-span-4">
                                            <Label>Amount</Label>
                                            <Input
                                                type="number"
                                                value={installment.amount}
                                                onChange={(e) => handleInstallmentInputChange(
                                                    index,
                                                    'amount',
                                                    e.target.value
                                                )}
                                                required
                                            />
                                        </div>
                                        <div className="col-span-12 sm:col-span-4">
                                            <Label>Due Date</Label>
                                            <Input
                                                type="date"
                                                value={installment.due_date}
                                                onChange={(e) => handleInstallmentInputChange(
                                                    index,
                                                    'due_date',
                                                    e.target.value
                                                )}
                                                required
                                            />
                                        </div>
                                        <div className="col-span-12 sm:col-span-3 flex items-end">
                                            {installmentFormData.installments_data.length > 1 && (
                                                <Button
                                                    type="button"
                                                    onClick={() => handleRemoveInstallment(index)}
                                                    className="bg-red-500 hover:bg-red-600"
                                                    size="sm"
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between">
                                <Button
                                    type="button"
                                    onClick={handleAddInstallment}
                                    className="bg-blue-500 hover:bg-blue-600"
                                >
                                    Add Installment
                                </Button>
                                <div>
                                    <Button
                                        type="button"
                                        onClick={() => setIsInstallmentDialogue(false)}
                                        className="bg-gray-500 hover:bg-gray-600 mr-2"
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="bg-teal-900 hover:!bg-blue-900">
                                        Create Installments
                                    </Button>
                                </div>
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
                            <TableHead>Installment</TableHead>
                        </TableRow>
                    </TableHeader>
                    {/* fifth */}
                    <TableBody>
                        {feeData.map((fee) => {
                            const feeInstallments = installmentDetails.filter(detail =>
                                detail.course_id === fee.course_id &&
                                detail.standard_id === fee.standard_id &&
                                detail.year === fee.year &&
                                detail.subject_id === fee.subject_id &&
                                detail.module_id === fee.module_id &&
                                detail.batch_id === fee.batch_id
                            );
                            const hasInstallments = feeInstallments.length > 0;

                            return (
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
                                            <Edit className="w-4 h-4 mr-1" /> Edit
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => handleInstallmentAction(fee)}
                                            className={`${hasInstallments ? 'bg-green-600 hover:!bg-green-700' : 'bg-purple-900 hover:!bg-purple-700'}`}
                                            size="sm"
                                        >
                                            {hasInstallments ? 'Installments' : 'Create Installments'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </>
    );
};

export default FessCreate;