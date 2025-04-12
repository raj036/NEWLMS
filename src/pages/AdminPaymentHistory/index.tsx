import { useEffect, useState } from "react";
import axios from 'helper/axios';
import { Card } from "@/components/ui/card";
import { CircleCheck, CircleX, Search, SortAsc, SortDesc, Download } from "lucide-react";
import { useAuthContext } from "hooks/useAuthContext";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import { Button } from "components";

const PaymentDetails = () => {
    const { user }: any = useAuthContext();
    const [paymentData, setPaymentData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPayments = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await axios.get("/api/all-user-payments-details", {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            // Sort by created_at date by default
            const sortedData = [...res.data.data].sort((a, b) => {
                if (a.created_on && b.created_on) {
                    return new Date(b.created_on).getTime() - new Date(a.created_on).getTime();
                }
                else if (a.payment_date && b.payment_date) {
                    return new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime();
                }
                else if (a.payment_id && b.payment_id) {
                    return b.payment_id - a.payment_id;
                }
                return 0;
            });

            setPaymentData(sortedData);
            setFilteredData(sortedData);
        } catch (err) {
            console.error("Error fetching payment data:", err);
            setError("Failed to load payment data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    useEffect(() => {
        // Filter data based on search query
        if (searchQuery.trim() === "") {
            setFilteredData(paymentData);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = paymentData.filter(payment =>
                (payment.user_name?.toLowerCase().includes(query)) ||
                (payment.razorpay_payment_id?.toLowerCase().includes(query)) ||
                (payment.course_name?.toLowerCase().includes(query)) ||
                (payment.payment_mode?.toLowerCase().includes(query)) ||
                (payment.status?.toLowerCase().includes(query)) ||
                (String(payment.payment_id).includes(query)) ||
                (String(payment.amount).includes(query))
            );
            setFilteredData(filtered);
        }
    }, [searchQuery, paymentData]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        const sortedData = [...filteredData].sort((a, b) => {
            // Special handling for date fields
            if (key === 'created_on' || key === 'payment_date') {
                if (a[key] && b[key]) {
                    return direction === 'asc'
                        ? new Date(a[key]).getTime() - new Date(b[key]).getTime()
                        : new Date(b[key]).getTime() - new Date(a[key]).getTime();
                }
                return 0;
            }

            // Handle numeric fields
            if (key === 'payment_id' || key === 'amount' || key === 'final_amount') {
                return direction === 'asc'
                    ? a[key] - b[key]
                    : b[key] - a[key];
            }

            // Normal string comparison
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setFilteredData(sortedData);
    };

    const renderSortIcon = (columnName) => {
        if (sortConfig.key !== columnName) {
            return null;
        }
        return sortConfig.direction === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />;
    };

    // Function to check if all installments are paid
    const getPaymentStatus = (payment) => {
        // First check if payment has installments
        if (payment.installments && payment.installments.length > 0) {
            // Check if any installment is pending
            const hasPendingInstallment = payment.installments.some(
                (installment) => installment.status !== "paid"
            );

            return hasPendingInstallment ? "pending" : "paid";
        }

        // If no installments, return the payment's own status
        return payment.status === "captured" ? "paid" : payment.status;
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";

        try {
            return new Date(dateString).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch (e) {
            return "Invalid Date";
        }
    };

    const downloadPaymentPDF = (payment) => {
        const doc = new jsPDF();

        const paymentDate = payment.created_on || payment.payment_date || "N/A";
        const formattedDate = paymentDate !== "N/A" ? formatDate(paymentDate) : "N/A";

        // Special formatter just for PDF to avoid encoding issues
        const formatAmountForPDF = (amount) => {
            return `${parseFloat(amount).toLocaleString('en-IN', {
                maximumFractionDigits: 2
            })}`;
        };

        doc.setFontSize(20);
        doc.text("Payment Receipt", 105, 20, { align: "center" });

        doc.setFontSize(12);
        doc.text("ILATE (Learning Institute)", 105, 28, { align: "center" });

        doc.line(20, 33, 190, 33);

        doc.setFontSize(14);
        doc.text("Payment Information", 20, 42);

        doc.setFontSize(11);

        const details = [
            ["Payment ID", payment.payment_id?.toString() || "N/A"],
            ["Student Name", payment.user_name || "N/A"],
            ["Razorpay Payment ID", payment.razorpay_payment_id || "N/A"],
            ["Date", formattedDate],
            ["Course", payment.course_name || "N/A"],
            ["Standard", payment.standard_name || "N/A"],
            ["Subject", payment.subject_name || "N/A"],
            ["Module", payment.module_name || "N/A"],
            ["Batch", payment.batch_name || "N/A"],
            ["Total Amount", payment.amount ? formatAmountForPDF(payment.amount) : "N/A"],
            ["Installment Amount", payment.final_amount ? formatAmountForPDF(payment.final_amount) : "N/A"],
            ["Payment Mode", payment.payment_mode || "N/A"],
            ["Status", getPaymentStatus(payment) === "paid" ? "Paid" : "Pending"],
        ];

        let y = 50;

        details.forEach(([label, value]) => {
            doc.text(`${label} : `, 20, y);
            doc.text(`${value}`, 70, y);
            y += 7;
        });

        // Add Installment Details Table
        if (payment.installments && payment.installments.length > 0) {
            doc.setFontSize(14);
            doc.text("Installment Details", 20, y + 10);

            autoTable(doc, {
                startY: y + 15,
                head: [["Installment No", "Amount Due", "Due Date", "Status"]],
                body: payment.installments.map((inst) => [
                    inst.installment_number,
                    formatAmountForPDF(inst.amount_due),
                    formatDate(inst.due_date),
                    inst.status === "paid" ? "Paid" : "Pending",
                ]),
            });
        }

        const filename = `Payment_Receipt_${payment.payment_id || payment.razorpay_payment_id || Date.now()}.pdf`;
        doc.save(filename);
    };

    if (isLoading) {
        return (
            <div className="p-4 flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-2" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    <p>Loading payment data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <Card className="p-8 text-center shadow-md text-red-600">
                    <p>{error}</p>
                    <Button
                        className="mt-4"
                        onClick={fetchPayments}
                    >
                        Retry
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="font-extrabold text-xl">All User Payment Details</h1>
                <div className="relative flex items-center">
                    <Search className="absolute left-3 text-gray-400" size={16} />
                    <Input
                        type="text"
                        placeholder="Search by name, ID, course..."
                        className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {filteredData.length === 0 ? (
                <Card className="p-8 text-center shadow-md">
                    <p>{searchQuery ? "No matching payment records found" : "No Payment Records Found"}</p>
                </Card>
            ) : (
                <div className="overflow-x-auto">
                    <div className="min-w-full bg-white rounded-lg shadow-md">
                        {/* Table header */}
                        <div className="grid grid-cols-9 gap-1 bg-gray-100 p-3 font-bold text-sm border-b">
                            <div className="flex items-center cursor-pointer" onClick={() => handleSort('payment_id')}>
                                <span>ID</span>
                                {renderSortIcon('payment_id')}
                            </div>
                            <div className="flex items-center cursor-pointer" onClick={() => handleSort('user_name')}>
                                <span>User Name</span>
                                {renderSortIcon('user_name')}
                            </div>
                            <div className="flex items-center cursor-pointer" onClick={() => handleSort('razorpay_payment_id')}>
                                <span>Razorpay ID</span>
                                {renderSortIcon('razorpay_payment_id')}
                            </div>
                            <div className="flex items-center cursor-pointer" onClick={() => handleSort('amount')}>
                                <span>Total Amount</span>
                                {renderSortIcon('amount')}
                            </div>
                            <div className="flex items-center cursor-pointer" onClick={() => handleSort('final_amount')}>
                                <span>Installment</span>
                                {renderSortIcon('final_amount')}
                            </div>
                            <div className="flex items-center cursor-pointer" onClick={() => handleSort('course_name')}>
                                <span>Course</span>
                                {renderSortIcon('course_name')}
                            </div>
                            <div className="flex items-center cursor-pointer" onClick={() => handleSort('status')}>
                                <span>Status</span>
                                {renderSortIcon('status')}
                            </div>
                            <div className="flex items-center cursor-pointer" onClick={() => handleSort('created_on')}>
                                <span>Date</span>
                                {renderSortIcon('created_on')}
                            </div>
                            <div>Actions</div>
                        </div>

                        {/* Table rows */}
                        {filteredData.map((payment, index) => {
                            const currentStatus = getPaymentStatus(payment);
                            const paymentDate = payment.created_on || payment.payment_date || "N/A";

                            return (
                                <div key={index} className={`grid grid-cols-9 gap-1 p-3 text-sm ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b hover:bg-blue-50`}>
                                    <div className="truncate">{payment.payment_id}</div>
                                    <div className="truncate">{payment.user_name}</div>
                                    <div className="truncate">{payment.razorpay_payment_id}</div>
                                    <div>{formatAmount(payment.amount)}</div>
                                    <div>{formatAmount(payment.final_amount)}</div>
                                    <div className="truncate">{payment.course_name}</div>
                                    <div>
                                        {currentStatus === "paid" ? (
                                            <span className="text-green-500 flex items-center gap-1">
                                                Paid <CircleCheck size={16} />
                                            </span>
                                        ) : (
                                            <span className="text-red-500 flex items-center gap-1">
                                                Pending <CircleX size={16} />
                                            </span>
                                        )}
                                    </div>
                                    <div className="truncate">
                                        {formatDate(paymentDate)}
                                    </div>
                                    <div className="flex gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    onClick={() => setSelectedPayment(payment)}
                                                    className="px-3 py-1 text-xs"
                                                >
                                                    View
                                                </Button>
                                            </DialogTrigger>

                                            <DialogContent className="max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle className="flex justify-between items-center">
                                                        <span>Payment Details #{payment.payment_id}</span>
                                                    </DialogTitle>
                                                </DialogHeader>

                                                {selectedPayment && (
                                                    <div className="text-sm space-y-2">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="font-semibold">Payment ID:</p>
                                                                <p>{selectedPayment.payment_id}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold">User Name:</p>
                                                                <p>{selectedPayment.user_name}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold">Razorpay ID:</p>
                                                                <p>{selectedPayment.razorpay_payment_id}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold">Course:</p>
                                                                <p>{selectedPayment.course_name}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold">Standard:</p>
                                                                <p>{selectedPayment.standard_name}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold">Subject:</p>
                                                                <p>{selectedPayment.subject_name}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold">Module:</p>
                                                                <p>{selectedPayment.module_name}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold">Batch:</p>
                                                                <p>{selectedPayment.batch_name}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold">Total Amount:</p>
                                                                <p>{formatAmount(selectedPayment.amount)}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold">Installment Amount:</p>
                                                                <p>{formatAmount(selectedPayment.final_amount)}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold">Status:</p>
                                                                <p className={getPaymentStatus(selectedPayment) === "paid" ? "text-green-500" : "text-red-500"}>
                                                                    {getPaymentStatus(selectedPayment) === "paid" ? "Paid" : "Pending"}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold">Date:</p>
                                                                <p>
                                                                    {formatDate(selectedPayment.created_on || selectedPayment.payment_date)}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {selectedPayment.payment_info && (
                                                            <div>
                                                                <p className="font-semibold">Payment Info:</p>
                                                                <p>{selectedPayment.payment_info}</p>
                                                            </div>
                                                        )}

                                                        {selectedPayment.installments && selectedPayment.installments.length > 0 && (
                                                            <div className="mt-4">
                                                                <h3 className="font-semibold mb-2">Installments:</h3>
                                                                <div className="border rounded overflow-hidden">
                                                                    <div className="grid grid-cols-4 gap-1 bg-gray-100 p-2 font-bold text-xs">
                                                                        <div>Installment</div>
                                                                        <div>Amount Due</div>
                                                                        <div>Due Date</div>
                                                                        <div>Status</div>
                                                                    </div>
                                                                    {selectedPayment.installments.map((item, idx) => (
                                                                        <div key={idx} className={`grid grid-cols-4 gap-1 p-2 text-xs ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                            <div>{item.installment_number}</div>
                                                                            <div>{formatAmount(item.amount_due)}</div>
                                                                            <div>{formatDate(item.due_date)}</div>
                                                                            <div className={item.status === "paid" ? "text-green-500" : "text-red-500"}>
                                                                                {item.status === "paid" ? "Paid" : "Pending"}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}


                                                        <div className="mt-4 flex justify-end">
                                                            <Button
                                                                onClick={() => downloadPaymentPDF(selectedPayment)}
                                                                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                                                            >
                                                                <Download size={14} /> Download PDF
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                        <Button
                                            onClick={() => downloadPaymentPDF(payment)}
                                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs flex items-center gap-1"
                                        >
                                            <Download size={14} /> PDF
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentDetails;