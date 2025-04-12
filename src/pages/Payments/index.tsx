import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import profileImg from "assets/profile.jpg";
import { Heading, Input } from "components";
import { useAuthContext } from "hooks/useAuthContext";
import { Button } from "@/components/ui/button";
import FormatPrice from "helper/FormatPrice";
import Swal from "sweetalert2";
import axios from "helper/axios";
import { Link, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { useRef } from "react";
interface InstallmentData {
  installment_number: number;
  amount_due: number;
  paid_amount: number;
  status: string;
  due_date: string;
}

const Payments = () => {
  const navigate = useNavigate();
  const [batchSize, setBatchSize] = useState<number>(0);
  const [batchData, setBatchData] = useState<any>([]);
  const [amount, setAmount] = useState<number>(0);
  const [feesAmoutCh, setFeesAmoutCh] = useState<boolean>(false);
  const [years, setYears] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<string>("");
  const [paymentInfo, setPaymentInfo] = useState<string>("");
  const [otherInfo, setOtherInfo] = useState<string>("");
  const { user }: any = useAuthContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [reqData, setReqData] = useState<any>([]);
  const [courseData, setCourseData] = useState<any>({
    course: "",
    standard: "",
    subject: "",
    module: "",
  });
  const [referralCode, setReferralCode] = useState<string>("");
  const [installments, setInstallments] = useState<number>(1);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [finalAmount, setFinalAmount] = useState<number>(0);
  const [isReferralValid, setIsReferralValid] = useState<boolean>(false);
  const [installmentsData, setInstallmentsData] = useState<InstallmentData[]>(
    []
  );
  const [finalinstallmentsData, finalsetInstallmentsData] = useState<
    InstallmentData[]
  >([]);

  useEffect(() => {
    if (installments > 0 && finalAmount > 0) {
      calculateInstallments();
    }
  }, [installments, finalAmount]);

  const calculateInstallments = () => {
    const perInstallmentAmount =
      Math.round(((finalAmount - discountAmount) / installments) * 100) / 100;
    const data: InstallmentData[] = [];
    const currentDate = new Date();

    for (let i = 1; i <= installments; i++) {
      const dueDate = new Date(currentDate);
      dueDate.setDate(dueDate.getDate() + 30 * i);

      data.push({
        installment_number: i,
        amount_due: perInstallmentAmount,
        paid_amount: 0,
        status: "pending",
        due_date: dueDate.toISOString().split("T")[0],
      });
    }

    setInstallmentsData(data); // For UI update

    return data; // For immediate usage
  };

  useEffect(() => {
    fetchReqData();
    getBatches();
    checkReferralCode();
  }, [user]);

  useEffect(() => {
    if (amount > 0) {
      setFinalAmount(amount);
    }
  }, [amount]);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = (): void => {
      if (
        !document.querySelector(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        )
      ) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
      }
    };

    loadRazorpayScript();
  }, []);

  const getBatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/batches/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      setBatchData(await response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  // Make sure this ref is properly defined
  const pdfRef = React.useRef(null);

  // Add this function to handle PDF generation
  const generatePaymentSummaryPDF = (paymentID) => {
    const element = pdfRef.current;

    if (!element) return;

    // Clone the element to modify it for PDF
    const pdfContent = element.cloneNode(true);

    // Replace external SVG with blue text for Razorpay logo
    const svgImages = pdfContent.querySelectorAll(
      'img[src*="razorpay-logo.svg"]'
    );

    if (svgImages.length > 0) {
      svgImages.forEach((img) => {
        const textLogo = document.createElement("span");
        textLogo.textContent = "Razorpay";
        textLogo.style.color = "#0066FF"; // Blue color
        textLogo.style.fontWeight = "bold";
        textLogo.style.fontSize = "18px";
        textLogo.style.fontFamily = "Arial, sans-serif";
        img.parentNode.replaceChild(textLogo, img);
      });
    }

    const dueNowElements = pdfContent.querySelectorAll("*");
    dueNowElements.forEach((element) => {
      if (element.textContent && element.textContent.includes("Due now")) {
        element.textContent = element.textContent.replace(
          "Due now",
          "Paid now"
        );
      }

      // Also check for attributes like title, aria-label, etc.
      if (element.hasAttributes()) {
        const attributes = element.attributes;
        for (let i = 0; i < attributes.length; i++) {
          if (attributes[i].value && attributes[i].value.includes("Due now")) {
            attributes[i].value = attributes[i].value.replace(
              "Due now",
              "Paid now"
            );
          }
        }
      }
    });

    // Add a title to the PDF
    const titleElement = document.createElement("h1");
    titleElement.textContent = "ILATE - Payment Receipt";
    titleElement.style.textAlign = "center";
    titleElement.style.marginBottom = "20px";
    titleElement.style.color = "#7066E0";
    pdfContent.prepend(titleElement);

    // Add transaction details
    const transactionDiv = document.createElement("div");
    transactionDiv.innerHTML = `
    <div style="margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
      <p><strong>Transaction Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Transaction ID:</strong> ${paymentID} 
      <p><strong>Student Name:</strong> ${user.user_name}</p>
      <p><strong>Email:</strong> ${user.email_id}</p>
      <p><strong>Phone:</strong> ${user.phone_no}</p>
    </div>
  `;
    pdfContent.prepend(transactionDiv);

    // Add a thank you message at the bottom
    const thankYouElement = document.createElement("div");
    thankYouElement.innerHTML = `
    <div style="margin-top: 30px; text-align: center; color: #333;">
      <p>Thank you for enrolling with ILATE!</p>
      <p>For any queries, please contact support@ilate.com</p>
    </div>
  `;
    pdfContent.appendChild(thankYouElement);

    // PDF generation options
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `ILATE_Payment_Receipt_${
        new Date().toISOString().split("T")[0]
      }.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Generate PDF
    html2pdf().from(pdfContent).set(opt).save();
  };
  const getFees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `api/fees/bycriteria?course_id=${reqData?.course_details?.courses?.id}&standard_id=${reqData?.course_details?.standards?.id}&year=${years}&subject_id=${reqData?.course_details?.subjects?.id}&module_id=${reqData?.course_details?.modules?.id}&batch_id=${batchSize}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setAmount(response?.data?.amount);
      setFinalAmount(response?.data?.amount);
      setFeesAmoutCh(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setFeesAmoutCh(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.detail,
        showConfirmButton: true,
        customClass: {
          icon: "swal-my-icon",
        },
        confirmButtonColor: "red",
      });
    }
  };

  const fetchReqData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/admission/${user.user_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      setReqData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseResponse = await axios.get(
          `api/courses/${reqData?.course_details?.courses?.id}`
        );
        const standardResponse = await axios.get(
          `api/standards/${reqData?.course_details?.standards?.id}`
        );
        const subjectResponse = await axios.get(
          `api/subjects/${reqData?.course_details?.subjects?.id}`
        );
        const moduleResponse = await axios.get(
          `api/modules/${reqData?.course_details?.modules?.id}`
        );
        setCourseData({
          course: courseResponse.data.name,
          standard: standardResponse.data.name,
          subject: subjectResponse.data.name,
          module: moduleResponse.data.name,
        });
      } catch (error) {
        // Handle error
      }
    };
    fetchData();
  }, [reqData]);

  const checkReferralCode = async () => {
    if (!referralCode) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `/api/payments/validate-referral/?code=${referralCode}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.data.status === "valid") {
        const discount = (amount * response.data.discount_percentage) / 100;
        console.log("discount", discount);
        setDiscountAmount(discount);
        setIsReferralValid(true);

        Swal.fire({
          icon: "success",
          title: "Referral Code Applied",
          text: `Discount of ${response.data.discount_percentage}% applied!`,
          confirmButtonColor: "#7066E0",
          customClass: {
            icon: "swal-my-icon",
          },
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setDiscountAmount(0);
      setFinalAmount(amount);
      setIsReferralValid(false);

      Swal.fire({
        icon: "error",
        title: "Invalid Referral Code",
        text:
          error?.response?.data?.detail ||
          "The referral code is invalid or expired",
        showConfirmButton: true,
        customClass: {
          icon: "swal-my-icon",
        },
        confirmButtonColor: "red",
      });
    }
  };

  const createRazorpayOrder = async () => {
    try {
      setLoading(true);

      const latestInstallmentData = calculateInstallments();

      const orderData = {
        course_id: reqData?.course_details?.courses?.id,
        standard_id: reqData?.course_details?.standards?.id,
        subject_id: reqData?.course_details?.subjects?.id,
        module_id: reqData?.course_details?.modules?.id,
        batch_id: batchSize,
        years: years,
        amount: amount,
        discount: discountAmount,
        final_amount: finalAmount - discountAmount,
        installments_data: latestInstallmentData,
        payment_mode: paymentMode,
        payment_info: paymentInfo,
        other_info: otherInfo,
        currency: "INR",
        receipt: `RCPT_${new Date().getFullYear()}_${Math.floor(
          1000 + Math.random() * 9000
        )}`,
        referral_code: isReferralValid ? referralCode : null,
        installments: installments,
        process_first_installment_only: installments > 1,
      };
      console.log(orderData);

      const response = await axios.post(
        `/api/create_order/payment`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setLoading(false);

      if (response.data.status === "success") {
        // Store the installments data
        // if (response.data.installments_data) {
        //   setInstallmentsData(response.data.installments_data);
        // }

        // Get the payment amount - for installments, this will be just the first installment amount
        const installmentsData = response.data.installments_data || [];
        const isInstallmentEnabled = installmentsData.length > 0;

        const paymentAmount = isInstallmentEnabled
          ? installmentsData[0].amount_due
          : response.data.order_details.amount;

        console.log("paymentAmount", paymentAmount);
        if (paymentMode === "online") {
          const options = {
            key: response.data.key_id || "rzp_test_hqWvVqOn8QFGEF",
            amount: paymentAmount * 100, // This is collected from user now
            currency: response.data.order_details.currency,
            name: "ILATE",
            description:
              installments > 1
                ? `First installment payment for ${courseData.course} - ${courseData.module}`
                : `Full payment for ${courseData.course} - ${courseData.module}`,
            order_id: response.data.order_id,
            handler: function (response) {
              verifyPayment(response);
            },
            prefill: {
              name: user.user_name,
              email: user.email_id,
              contact: user.phone_no,
            },
            notes: {
              course: courseData.course,
              standard: courseData.standard,
              subject: courseData.subject,
              module: courseData.module,
              batch_size: batchData.find((b) => b.id === batchSize)?.size || "",
              years: years,
              referral_code: isReferralValid ? referralCode : "none",
              installment:
                installments > 1 ? "1 of " + installments : "Full payment",
            },
            theme: {
              color: "#7066E0",
            },
            modal: {
              ondismiss: function () {
                setLoading(false);
                Swal.fire({
                  icon: "warning",
                  title: "Payment Cancelled",
                  text: "You have cancelled the payment process. You can try again or choose another payment method.",
                  confirmButtonColor: "#7066E0",
                });
              },
            },
          };

          const razorpayInstance = new (window as any).Razorpay(options);
          razorpayInstance.open();
        } else {
          // For offline payments
          Swal.fire({
            icon: "success",
            text: "Thank you for Enrolling to ILATE, Kindly Wait for the Response from Admission Office",
            confirmButtonColor: "#7066E0",
            customClass: {
              icon: "swal-my-icon",
            },
            confirmButtonText: "OK",
          }).then((result: { isConfirmed: any }) => {
            if (result.isConfirmed) {
              navigate("/");
            }
          });
        }
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.detail || "Error creating payment order",
        showConfirmButton: true,
        customClass: {
          icon: "swal-my-icon",
        },
        confirmButtonColor: "red",
      });
    }
  };

  const verifyPayment = async (paymentData) => {
    try {
      setLoading(true);
      const verificationData = {
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
        course_id: reqData?.course_details?.courses?.id,
        standard_id: reqData?.course_details?.standards?.id,
        subject_id: reqData?.course_details?.subjects?.id,
        module_id: reqData?.course_details?.modules?.id,
        batch_id: batchSize,
        years: years,
        amount: finalAmount,
        referral_code: isReferralValid ? referralCode : null,
      };

      const response = await axios.post(
        `/api/verify_payment/`,
        verificationData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setLoading(false);

      if (response.data.status === "success") {
        // generatePaymentSummaryPDF(verificationData.razorpay_payment_id);
        Swal.fire({
          icon: "success",
          title: "Payment Successful!",
          text: "Thank you for enrolling with ILATE",
          confirmButtonColor: "#7066E0",
          customClass: {
            icon: "swal-my-icon",
          },
          confirmButtonText: "OK",
        }).then((result: { isConfirmed: any }) => {
          if (result.isConfirmed) {
            navigate("/");
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Payment Verification Failed",
          text:
            response.data.message ||
            "Your payment could not be verified. Please contact customer support.",
          showConfirmButton: true,
          customClass: {
            icon: "swal-my-icon",
          },
          confirmButtonColor: "red",
        });
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.detail || "Error verifying payment",
        showConfirmButton: true,
        customClass: {
          icon: "swal-my-icon",
        },
        confirmButtonColor: "red",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate payment mode is selected
    if (!paymentMode) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select a payment method",
        confirmButtonColor: "#7066E0",
      });
      return;
    }

    // For offline payments, validate payment info is provided
    if (paymentMode === "offline" && !paymentInfo) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please provide payment details for offline payment",
        confirmButtonColor: "#7066E0",
      });
      return;
    }

    createRazorpayOrder();
  };

  const handleFees = async (e: React.FormEvent) => {
    e.preventDefault();
    if (batchSize !== 0 && years !== 0) {
      getFees();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        customClass: {
          icon: "swal-my-icon",
        },
        text: "Please Select Batch Size and Years",
        showConfirmButton: true,
        confirmButtonColor: "red",
      });
      return;
    }
  };

  return (
    <>
      <Helmet>
        <title>Payments</title>
      </Helmet>
      <section className="container mx-auto my-10">
        <div className="grid grid-cols-2 sm:grid-cols-1">
          <div className="py-8 px-4 lg:py-16 md:col-span-1">
            <div className="mb-5">
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                Payment
              </h1>
              <p className="text-gray-500 mt-2">
                Some Data Has Been Taken From Admission Form You Have Submitted
              </p>
            </div>
            <div className="flex items-center justify-start gap-4 my-4">
              <div>
                <img
                  loading="lazy"
                  src={profileImg}
                  className="w-28 h-28 rounded-full border"
                  alt="Profile"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Heading className="text-black-900">{user.user_name}</Heading>
                <p className="text-gray-500">{user.email_id}</p>
                <p className="text-gray-500">{user.phone_no}</p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-3">
                You Have Enrolled for Below Criterias
              </h2>
              <p className="my-2">
                Course : <strong>{courseData.course}</strong>
              </p>
              <p className="my-2">
                Standard : <strong>{courseData.standard}</strong>
              </p>
              <p className="my-2">
                Subject : <strong>{courseData.subject}</strong>
              </p>
              <p className="my-2">
                Modules : <strong>{courseData.module}</strong>
              </p>
            </div>
            <h2 className="text-xl font-bold mt-4 mb-2">
              Kindly Fill Below Details
            </h2>
            <form onSubmit={handleFees}>
              <div className="flex justify-start items-center">
                <Heading
                  size="s"
                  className="w-full max-w-max mr-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Batch Size<span className="text-red-500">*</span>
                </Heading>
                <select
                  name="batchSize"
                  id="batchSize"
                  value={batchSize}
                  className="p-3 my-2 bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-[20px] focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  onChange={(e) => {
                    setBatchSize(parseInt(e.target.value));
                    setPaymentMode("");
                    setPaymentInfo("");
                    setYears(0);
                    setAmount(0);
                    setFinalAmount(0);
                    setDiscountAmount(0);
                    setIsReferralValid(false);
                    setReferralCode("");
                  }}
                  required
                >
                  <option value="0">
                    Select a Batch Size You Want to Apply For...
                  </option>
                  {loading ? (
                    <option value={0}>Loading...</option>
                  ) : (
                    batchData?.map((batch: any) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.size}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="flex justify-start items-center my-5">
                <Heading
                  size="s"
                  className="mr-4 w-full max-w-max text-sm font-medium text-gray-900 dark:text-white-A700"
                >
                  Number of Years
                  <span className="text-red-500">*</span>
                </Heading>
                <select
                  name="years"
                  id="years"
                  value={years}
                  className="p-3 my-2 bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-[20px] focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  onChange={(e) => {
                    setYears(parseInt(e.target.value));
                    setPaymentMode("");
                    setPaymentInfo("");
                    setAmount(0);
                    setFinalAmount(0);
                    setDiscountAmount(0);
                    setIsReferralValid(false);
                    setReferralCode("");
                  }}
                  required
                >
                  <option value="0">
                    Select Number of Years Admission Taking For...
                  </option>
                  <option value="1">1 Year</option>
                  <option value="2">2 Years</option>
                </select>
              </div>
              <Button
                variant="ilate"
                className="rounded-[20px]"
                size="lg"
                type="submit"
                disabled={loading}
              >
                {loading ? "Loading..." : "Save"}
              </Button>
            </form>
            {amount !== 0 && feesAmoutCh && batchSize !== 0 && years !== 0 && (
              <>
                <h2 className="text-xl font-bold my-2">
                  Fees Amount :{" "}
                  <span className="text-2xl">
                    <FormatPrice price={amount ? amount : 0} />
                  </span>
                  <p className="text-xs text-gray-500 font-medium">
                    Fees Has Been Calculated Based on the Criteria and Batch
                    Size You've Selected
                  </p>
                </h2>

                <div className="flex max-w-6xl justify-start items-center my-5">
                  <Heading
                    size="s"
                    className="w-full max-w-max mr-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                  >
                    Referral Code (Optional)
                  </Heading>
                  <div className="flex w-full">
                    <Input
                      size="xs"
                      type="text"
                      name="referralCode"
                      id="referralCode"
                      value={referralCode}
                      onChange={(value: string) => {
                        setReferralCode(value);
                        setIsReferralValid(false);
                        setDiscountAmount(0);
                        setFinalAmount(amount);
                      }}
                      className="w-full bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-l-md focus:ring-white-A700 focus:border-white-A700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      placeholder="Enter Referral Code"
                    />
                    <Button
                      variant="ilate"
                      className="rounded-r-md rounded-l-none"
                      type="button"
                      onClick={checkReferralCode}
                      disabled={!referralCode || loading}
                    >
                      {loading ? "Checking..." : "Apply"}
                    </Button>
                  </div>
                </div>

                {discountAmount > 0 && (
                  <div className="my-2 p-3 bg-green-50 border border-green-300 rounded-md">
                    <p className="text-green-800">
                      Discount Applied:{" "}
                      <strong>
                        <FormatPrice price={discountAmount} />
                      </strong>
                    </p>
                    <p className="text-green-800 font-bold">
                      Final Amount:{" "}
                      <FormatPrice price={finalAmount - discountAmount} />
                    </p>
                    {isReferralValid && (
                      <p className="text-sm text-green-600">
                        ✓ Referral code applied successfully
                      </p>
                    )}
                  </div>
                )}

                <div className="flex max-w-6xl justify-start items-center my-5">
                  <Heading
                    size="s"
                    className="w-full max-w-max mr-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                  >
                    Installments
                  </Heading>
                  <select
                    name="installments"
                    id="installments"
                    value={installments}
                    className="p-3 my-2 bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-[20px] focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    onChange={(e) => setInstallments(parseInt(e.target.value))}
                  >
                    <option value="1">Single Payment</option>
                    <option value="2">2 Installments</option>
                    <option value="3">3 Installments</option>
                  </select>
                </div>

                <div className="my-4 flex">
                  <label className="flex items-center mx-2">
                    <input
                      type="radio"
                      name="payment_method"
                      value="offline"
                      checked={paymentMode === "offline"}
                      onChange={() => {
                        setPaymentMode("offline");
                        setPaymentInfo("");
                        setOtherInfo("");
                      }}
                      required
                    />
                    <span className="ml-1 text-sm">Pay Offline</span>
                  </label>
                  <label className="flex items-center mx-2">
                    <input
                      type="radio"
                      name="payment_method"
                      value="online"
                      checked={paymentMode === "online"}
                      onChange={() => {
                        setPaymentMode("online");
                        setPaymentInfo("");
                        setOtherInfo("");
                      }}
                      required
                    />
                    <span className="ml-1 text-sm">Pay Online</span>
                  </label>
                </div>
                {paymentMode === "" && (
                  <p className="text-red-500">Please select a payment method</p>
                )}
              </>
            )}

            {batchSize !== 0 && paymentMode === "online" ? (
              <>
                <div className="my-5 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="mt-4 text-sm text-gray-600">
                    <h4 className="font-semibold mb-1">
                      Terms and Conditions:
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Payments are processed through Razorpay's secure
                        gateway.
                      </li>
                      <li>
                        If a payment fails, is cancelled, or gets stuck, the
                        amount (if debited) will be refunded automatically
                        within <strong>7-10 working days</strong>.
                      </li>
                      <li>
                        Duplicate or extra payments will be refunded after
                        verification.
                      </li>
                      <li>
                        For any issues, contact our support team at{" "}
                        <a
                          href="mailto:support@example.com"
                          className="text-blue-500 underline"
                        >
                          support@example.com
                        </a>
                        .
                      </li>
                    </ul>
                  </div>

                  {installments > 1 && (
                    <div className="mt-3">
                      <p className="font-semibold">Installment Details:</p>
                      <p>Number of installments: {installments}</p>
                      <p>
                        Amount per installment:{" "}
                        <FormatPrice
                          price={(finalAmount - discountAmount) / installments}
                        />
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex max-w-6xl justify-start items-center my-5">
                  <Heading
                    size="s"
                    className="w-full max-w-max mr-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                  >
                    Other Information (Optional)
                  </Heading>
                  <Input
                    size="xs"
                    type="text"
                    name="otherInfo"
                    id="otherInfo"
                    value={otherInfo}
                    onChange={(value: string) => setOtherInfo(value)}
                    className="w-full max-w-6xl bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    placeholder="Enter any additional information"
                  />
                </div>
                <div className="flex justify-center my-5">
                  <Button
                    variant="ilate"
                    className="rounded-[20px]"
                    size="lg"
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Pay Now"}
                  </Button>
                </div>
              </>
            ) : (
              batchSize !== 0 &&
              paymentMode === "offline" && (
                <>
                  <div className="border border-black-900 rounded-md p-4">
                    <div className="text-center">
                      <h2 className="text-xl font-bold">
                        Pay Via Bank Transfer
                      </h2>
                      <p className="text-sm text-gray-600">
                        Enter bank details as follows & pay
                      </p>
                    </div>
                    <table className="table-fixed border border-black-900 w-full h-full mt-4">
                      <tbody>
                        <tr>
                          <td className="border border-black-900 p-2 font-bold">
                            Account Name
                          </td>
                          <td className="border border-black-900 p-2">ILATE</td>
                        </tr>
                        <tr>
                          <td className="border border-black-900 p-2 font-bold">
                            Account No.
                          </td>
                          <td className="border border-black-900 p-2">
                            50200055073020
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-black-900 p-2 font-bold">
                            Bank
                          </td>
                          <td className="border border-black-900 p-2">
                            HDFC Bank
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-black-900 p-2 font-bold">
                            Account Type
                          </td>
                          <td className="border border-black-900 p-2">
                            Current Account
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-black-900 p-2 font-bold">
                            IFSC
                          </td>
                          <td className="border border-black-900 p-2">
                            HDFC0001946
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-black-900 p-2 font-bold">
                            Branch
                          </td>
                          <td className="border border-black-900 p-2">
                            Andheri East, Mumbai
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="flex max-w-6xl justify-start items-center my-5">
                    <Heading
                      size="s"
                      className="w-full max-w-max mr-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                    >
                      Payment Information<span className="text-red-500">*</span>
                    </Heading>
                    <Input
                      size="xs"
                      type="text"
                      name="payment_info"
                      id="payment_info"
                      value={paymentInfo}
                      onChange={(value: string) => setPaymentInfo(value)}
                      className="w-full max-w-6xl bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      placeholder="Enter UTR Number / Reference ID"
                      required
                    />
                  </div>
                  <div className="flex max-w-6xl justify-start items-center my-5">
                    <Heading
                      size="s"
                      className="w-full max-w-max mr-4 text-sm font-medium text-gray-900 dark:text-white-A700"
                    >
                      Other Information (Optional)
                    </Heading>
                    <Input
                      size="xs"
                      type="text"
                      name="otherInfo"
                      id="otherInfo"
                      value={otherInfo}
                      onChange={(value: string) => setOtherInfo(value)}
                      className="w-full max-w-6xl bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      placeholder="Enter any additional information"
                    />
                  </div>
                  <div className="flex justify-center my-5">
                    <Button
                      variant="ilate"
                      className="rounded-[20px]"
                      size="lg"
                      type="submit"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Submit Payment Details"}
                    </Button>
                  </div>
                </>
              )
            )}
          </div>
          <div ref={pdfRef} className="py-8 px-4 lg:py-16 md:col-span-1">
            {finalAmount > 0 ? (
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 sticky top-5">
                <h2 className="text-2xl font-bold mb-4">Payment Summary</h2>
                <div className="border-b pb-3 mb-3">
                  <p className="flex justify-between mb-2">
                    <span>Course:</span>
                    <span className="font-semibold">{courseData.course}</span>
                  </p>
                  <p className="flex justify-between mb-2">
                    <span>Standard:</span>
                    <span className="font-semibold">{courseData.standard}</span>
                  </p>
                  <p className="flex justify-between mb-2">
                    <span>Subject:</span>
                    <span className="font-semibold">{courseData.subject}</span>
                  </p>
                  <p className="flex justify-between mb-2">
                    <span>Module:</span>
                    <span className="font-semibold">{courseData.module}</span>
                  </p>
                  <p className="flex justify-between mb-2">
                    <span>Batch Size:</span>
                    <span className="font-semibold">
                      {batchData.find((b) => b.id === batchSize)?.size || ""}
                    </span>
                  </p>
                  <p className="flex justify-between mb-2">
                    <span>Duration:</span>
                    <span className="font-semibold">
                      {years} Year{years > 1 ? "s" : ""}
                    </span>
                  </p>
                </div>
                <div className="border-b pb-3 mb-3">
                  <p className="flex justify-between font-semibold mb-2">
                    <span>Total Amount:</span>
                    <span>
                      <FormatPrice price={amount} />
                    </span>
                  </p>
                  {discountAmount > 0 && (
                    <p className="flex justify-between text-green-600 mb-2">
                      <span>Discount:</span>
                      <span>
                        - <FormatPrice price={discountAmount} />
                      </span>
                    </p>
                  )}
                </div>
                <div className="pt-2">
                  <p className="flex justify-between text-xl font-bold">
                    <span>Final Amount:</span>
                    <span>
                      <FormatPrice price={finalAmount - discountAmount} />
                    </span>
                  </p>
                  {installments > 1 && installmentsData.length > 0 ? (
                    <div className="mt-3 border-t pt-3">
                      <p className="font-semibold">Your payment schedule:</p>
                      <br />
                      {installmentsData.map((installment, index) => (
                        <div
                          key={installment.installment_number}
                          className={`${
                            index === 0 ? "bg-blue-50 p-2 rounded" : ""
                          }`}
                        >
                          <p className="flex justify-between">
                            <span>
                              {index === 0 ? (
                                <strong>Due now:</strong>
                              ) : (
                                `Due on ${new Date(
                                  installment.due_date
                                ).toLocaleDateString()}:`
                              )}
                            </span>
                            <span className={index === 0 ? "font-bold" : ""}>
                              <FormatPrice price={installment.amount_due} />
                            </span>
                          </p>
                        </div>
                      ))}
                      {/* <p className="text-sm text-gray-600 mt-2">
                        {paymentMode === 'online' ? 'You will pay only the first installment now.' : 'Please mention your installment number in payment details.'}
                      </p> */}
                    </div>
                  ) : installments > 1 ? (
                    <p className="text-sm text-gray-600 mt-2 text-center">
                      {/* Payable in {installments} installments */}
                    </p>
                  ) : null}
                </div>

                {paymentMode === "online" && (
                  <div className="mt-6 flex flex-col justify-center items-center space-y-3">
                    <p className="text-sm text-center">Secured Payment By</p>
                    <img
                      src="https://razorpay.com/assets/razorpay-logo.svg"
                      alt="Razorpay"
                      className="h-8"
                    />

                    {/* <div className="flex justify-center space-x-2">
                      <img src="/assets/visa.png" alt="Visa" className="h-6" />
                      <img src="/assets/mastercard.png" alt="Mastercard" className="h-6" />
                      <img src="/assets/rupay.png" alt="RuPay" className="h-6" />
                      <img src="/assets/upi.png" alt="UPI" className="h-6" />
                    </div> */}
                  </div>
                )}
              </div>
            ) : (
              <>
                <p className="mb-5 font-bold text-lg">
                  Payment Terms & Conditions
                </p>
                <ul className="flex flex-col items-start justify-center gap-4 text-sm text-gray-500">
                  <li>
                    <strong>Payment Methods: </strong>We accept payments through
                    online channels such as bank transfers, credit/debit cards,
                    as well as cash and cheque payments.
                  </li>
                  <li>
                    <strong>Payment Schedule: </strong>Fees are due at the
                    beginning of each month/term/semester.
                  </li>
                  <li>
                    <strong>Late Payment Policy: </strong>Any payments not
                    received by the due date may be subject to a late fee or
                    penalty.
                  </li>
                  <li>
                    <strong>Invoice Issuance: </strong>Invoices will be provided
                    for all payments made, either electronically or in hard
                    copy, upon request.
                  </li>
                  <li>
                    <strong>Refund Policy: </strong>Refunds may be issued in
                    certain circumstances, subject to our refund policy. Please
                    refer to our refund policy for more details.
                  </li>
                  <li>
                    <strong>Currency: </strong>All payments must be made in
                    Indian Rupees (INR), unless otherwise specified.
                  </li>
                  <li>
                    <strong>Payment Confirmation: </strong>Upon successful
                    payment, you will receive a payment confirmation via email
                    or SMS.
                  </li>
                  <li>
                    <strong>Contact Information: </strong>For any
                    payment-related queries or concerns, please feel free to
                    reach out to our dedicated payment support team at
                    accounts@ilate.com.
                  </li>
                  <li>
                    <strong>Dispute Resolution: </strong>In the event of any
                    payment disputes or discrepancies, please contact us
                    immediately for prompt resolution.
                  </li>
                  <li>
                    <strong>Terms Acceptance: </strong>By enrolling in our
                    classes and making payments, you agree to abide by the above
                    payment terms and conditions.
                  </li>
                </ul>
              </>
            )}
          </div>
          {/* <Link to="/installment_payment">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded">
                        Pay Installment
                      </button>
                    </Link> */}
        </div>
      </section>
    </>
  );
};

export default Payments;
