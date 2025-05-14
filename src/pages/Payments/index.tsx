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
interface InstallmentPlan {
  id: number;
  course_id: number;
  number_of_installments: number;
  total_amount: number;
  standard_id: number;
  year: number;
  subject_id: number;
  module_id: number;
  batch_id: number;
  branch_id: number;
  installments: InstallmentData[];
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
  const [installmentPlan, setInstallmentPlan] = useState<InstallmentPlan | null>(null);
  const [installmentsData, setInstallmentsData] = useState<InstallmentData[]>(
    []
  );
  const [finalinstallmentsData, finalsetInstallmentsData] = useState<
    InstallmentData[]
  >([]);

  const fetchInstallmentPlan = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/admin_installments/bycriteria?course_id=${reqData?.course_details?.courses?.id}&standard_id=${reqData?.course_details?.standards?.id}&year=${years}&subject_id=${reqData?.course_details?.subjects?.id}&module_id=${reqData?.course_details?.modules?.id}&batch_id=${batchSize}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
console.log(response.data)
      if (response.data && response.data.length > 0) {
        // API plan exists
        setInstallmentPlan(response.data[0]);
        setInstallments(response.data[0].number_of_installments);
        setInstallmentsData(response.data[0].installments);
        setAmount(response.data[0].total_amount);
        setFinalAmount(response.data[0].total_amount);
      } else {
        // No API plan - reset to defaults
        setInstallmentPlan(null);
        setInstallments(1);
        setAmount(0);
        setFinalAmount(0);
        Swal.fire({
          icon: "info",
          title: "No Installment Plan Found",
          text: "No predefined installment plan found. You can set up custom installments.",
          confirmButtonColor: "#7066E0",
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching installment plan:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch installment plans. Please try again.",
        confirmButtonColor: "#7066E0",
      });
    }
  };

  // Calculate installments only when no API plan exists
  useEffect(() => {
    if (!installmentPlan && installments > 0 && finalAmount > 0) {
      calculateInstallments();
    }
  }, [installments, finalAmount, installmentPlan]);

  // Update installments data when either API plan or local calculation changes
  useEffect(() => {
    if (installmentPlan) {
      setInstallmentsData(installmentPlan.installments);
    }
  }, [installmentPlan]);
  useEffect(() => {
    if (batchSize && years && reqData?.course_details?.courses?.id) {
      fetchInstallmentPlan();
    }
  }, [batchSize, years, reqData]);

  // Calculate installments if no plan exists from API


  // Use API installments if available, otherwise calculate
  useEffect(() => {
    if (installmentPlan) {
      // Use installments from API
      setInstallmentsData(installmentPlan.installments);
    } else if (installments > 0 && finalAmount > 0) {
      // Calculate installments locally
      calculateInstallments();
    }
  }, [installments, finalAmount, installmentPlan]);


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
      console.log(response.data);

      if (response.data.status === "valid") {
        const discount = (response.data.discount_rupees);
        console.log("discount", discount);
        setDiscountAmount(discount);
        setIsReferralValid(true);

        Swal.fire({
          icon: "success",
          title: "Referral Code Applied",
          text: `Discount of ${response.data.discount_rupees}rs applied!`,
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
        if (response.data.installments_data) {
          setInstallmentsData(response.data.installments_data);
        }

        // Get the payment amount - for installments, this will be just the first installment amount
        const installmentsData = response.data.installments_data || [];
        console.log("paymentAmt",installmentsData)
        const isInstallmentEnabled = installmentsData.length > 0;

        const paymentAmount = isInstallmentEnabled
          ? installmentsData[0].amount
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
  const pdfRef = React.useRef(null);

  //    const generatePaymentSummaryPDF = (paymentID) => {
  //     console.log("hi generate pdf summary")
  //      const element = pdfRef.current;
   
  //      if (!element) return;
   
  //      // Create a new container for the AMMP-style invoice
  //      const pdfContent = document.createElement("div");
  //      pdfContent.style.fontFamily = "Arial, sans-serif";
  //      pdfContent.style.padding = "20px";
   
  //      // Add logo at the top (centered)
  //      const logoDiv = document.createElement("div");
  //      logoDiv.style.textAlign = "center";
  //      logoDiv.style.marginBottom = "20px";
       
  //      const logoImg = document.createElement("img");
  //      logoImg.src = "/images/ILATE_Classes_Final_Logo-02.jpg"; // Replace with your actual logo URL
  //      logoImg.style.maxWidth = "180px";
  //      logoImg.style.height = "auto";
  //      logoImg.alt = "ILATE Logo";
  //      logoDiv.appendChild(logoImg);
  //      pdfContent.appendChild(logoDiv);
   
  //      // Add the invoice header
  //      const header = document.createElement("h1");
  //      header.textContent = "Tax Invoice";
  //      header.style.textAlign = "center";
  //      header.style.marginBottom = "20px";
  //      header.style.color = "#000";
  //      header.style.fontSize = "24px";
  //      pdfContent.appendChild(header);
   
  //      // Create the invoice table
  //      const table = document.createElement("table");
  //      table.style.width = "100%";
  //      table.style.borderCollapse = "collapse";
  //      table.style.marginBottom = "20px";
   
  //      // Table header
  //      const thead = document.createElement("thead");
  //      thead.innerHTML = `
  //          <tr style="border-bottom: 1px solid #000;">
  //              <th style="text-align: left; padding: 8px;">Description</th>
  //              <th style="text-align: left; padding: 8px;">Code</th>
  //              <th style="text-align: right; padding: 8px;">Amount(₹)</th>
  //          </tr>
  //      `;
  //      table.appendChild(thead);
   
  //      // Table body with actual payment data
  //      const tbody = document.createElement("tbody");
  //      tbody.innerHTML = `
  //          <tr style="border-bottom: 1px solid #ddd;">
  //              <td style="padding: 8px;">Tuition & Counselling Fees (SAC Code 999293)</td>
  //              <td style="padding: 8px;">A</td>
  //              <td style="text-align: right; padding: 8px;">45,000.00</td>
  //          </tr>
  //          <tr style="border-bottom: 1px solid #ddd;">
  //              <td style="padding: 8px;">CGST @ 9%</td>
  //              <td style="padding: 8px;">B</td>
  //              <td style="text-align: right; padding: 8px;">4,050.00</td>
  //          </tr>
  //          <tr style="border-bottom: 1px solid #ddd;">
  //              <td style="padding: 8px;">SGST @ 9%</td>
  //              <td style="padding: 8px;">C</td>
  //              <td style="text-align: right; padding: 8px;">4,050.00</td>
  //          </tr>
  //          <tr style="border-bottom: 1px solid #ddd;">
  //              <td style="padding: 8px;">Subtotal TDS</td>
  //              <td style="padding: 8px;">A+B+C D</td>
  //              <td style="text-align: right; padding: 8px;">0</td>
  //          </tr>
  //          <tr style="border-top: 2px solid #000; font-weight: bold;">
  //              <td style="padding: 8px;">Total</td>
  //              <td style="padding: 8px;">A+B+C-D</td>
  //              <td style="text-align: right; padding: 8px;">53,100.00</td>
  //          </tr>
  //      `;
  //      table.appendChild(tbody);
  //      pdfContent.appendChild(table);
   
  //      // Add horizontal line
  //      const hr = document.createElement("hr");
  //      hr.style.margin = "20px 0";
  //      pdfContent.appendChild(hr);
   
  //      // Add address information
  //      const addressDiv = document.createElement("div");
  //      addressDiv.style.marginBottom = "20px";
  //      addressDiv.innerHTML = `
  //          <p>404, B Wing, Ganga Jamuna CHS</p>
  //          <p>Rd Number 24, Next to Starbucks,</p>
  //          <p>Bandra West, Mumbai - 400 052.</p>
  //          <p>Contact No : 9702279804 | 9702071599</p>
  //          <p>Email : info.ilate@gmail.com</p>
  //      `;
  //      pdfContent.appendChild(addressDiv);
   
  //      // Add another horizontal line
  //      pdfContent.appendChild(hr.cloneNode());
   
  //      // Add payment details section
  //      const paymentDetails = document.createElement("div");
  //      paymentDetails.style.marginBottom = "20px";
  //      paymentDetails.innerHTML = `
  //          <p>GST # : 27AAECI2456R1Z1</p>
  //          <p>Account Name : ILATE Education Pvt Ltd</p>
  //          <p>Account # : 1234567890</p>
  //          <p>IFSC : HDFC0000123</p>
  //      `;
  //      pdfContent.appendChild(paymentDetails);
   
  //      // Add another horizontal line
  //      pdfContent.appendChild(hr.cloneNode());
   
  //      // Add invoice number and date
  //      const invoiceNumber = `AMMP${Math.floor(1000 + Math.random() * 9000)}`;
  //      const invoiceInfo = document.createElement("div");
  //      invoiceInfo.style.display = "flex";
  //      invoiceInfo.style.justifyContent = "space-between";
  //      invoiceInfo.style.marginBottom = "20px";
  //      invoiceInfo.innerHTML = `
  //          <div><strong>${invoiceNumber}</strong></div>
  //          <div>${new Date().toLocaleDateString('en-IN')}</div>
  //      `;
  //      pdfContent.appendChild(invoiceInfo);
   
  //      // Add another horizontal line
  //      pdfContent.appendChild(hr.cloneNode());
   
  //      // Add bill to section with student details
  //      const billTo = document.createElement("div");
  //      billTo.style.marginBottom = "20px";
  //      billTo.innerHTML = `
  //          <p><strong>Bill To</strong></p>
  //          <p>Name : ${user.user_name}</p>
  //          <p>Email : ${user.email_id}</p>
  //          <p>Phone : ${user.phone_no}</p>
  //          <p>Address : </p>
  //          <p>GST # : </p>
  //      `;
  //      pdfContent.appendChild(billTo);
   
  //      // Add payment method
  //      const paymentMethod = document.createElement("div");
  //      paymentMethod.style.textAlign = "center";
  //      paymentMethod.style.marginTop = "30px";
  //      paymentMethod.style.color = "#0066FF";
  //      paymentMethod.style.fontWeight = "bold";
  //      paymentMethod.style.fontSize = "18px";
  //      paymentMethod.textContent = "Secured Payment By Razorpay";
  //      pdfContent.appendChild(paymentMethod);
   
  //      // Add transaction ID
  //      const transactionInfo = document.createElement("div");
  //      transactionInfo.style.textAlign = "center";
  //      transactionInfo.style.margin = "10px 0";
  //      transactionInfo.innerHTML = `
  //          <p>Transaction ID: ${paymentID}</p>
  //          <p>Payment Date: ${new Date().toLocaleString('en-IN')}</p>
  //      `;
  //      pdfContent.appendChild(transactionInfo);
   
  //      // Add thank you message
  //      const thankYou = document.createElement("div");
  //      thankYou.style.textAlign = "center";
  //      thankYou.style.marginTop = "20px";
  //      thankYou.style.color = "#333";
  //      thankYou.innerHTML = `
  //          <p>Thank you for enrolling with ILATE!</p>
  //          <p>For any queries, please contact support@ilate.com</p>
  //      `;
  //      pdfContent.appendChild(thankYou);
   
  //      // PDF generation options
  //      const opt = {
  //          margin: [10, 10, 10, 10],
  //          filename: `${invoiceNumber}_${user.user_name.replace(" ", "_")}.pdf`,
  //          image: { type: "jpeg", quality: 0.98 },
  //          html2canvas: { 
  //              scale: 2,
  //              useCORS: true,
  //              allowTaint: true,
  //              logging: true
  //          },
  //          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  //      };
   
  //      // Generate PDF
  //      html2pdf().from(pdfContent).set(opt).save();
  //  };

// const generatePaymentSummaryPDF = (paymentID) => {
//     const element = pdfRef.current;

//     if (!element) return;

//     // Clone the element to modify it for PDF
//     const pdfContent = element.cloneNode(true);

//     // Replace external SVG with blue text for Razorpay logo
//     const svgImages = pdfContent.querySelectorAll(
//       'img[src*="razorpay-logo.svg"]'
//     );

//     if (svgImages.length > 0) {
//       svgImages.forEach((img) => {
//         const textLogo = document.createElement("span");
//         textLogo.textContent = "Razorpay";
//         textLogo.style.color = "#0066FF"; // Blue color
//         textLogo.style.fontWeight = "bold";
//         textLogo.style.fontSize = "18px";
//         textLogo.style.fontFamily = "Arial, sans-serif";
//         img.parentNode.replaceChild(textLogo, img);
//       });
//     }

//     const dueNowElements = pdfContent.querySelectorAll("*");
//     dueNowElements.forEach((element) => {
//       if (element.textContent && element.textContent.includes("Due now")) {
//         element.textContent = element.textContent.replace(
//           "Due now",
//           "Paid now"
//         );
//       }

//       // Also check for attributes like title, aria-label, etc.
//       if (element.hasAttributes()) {
//         const attributes = element.attributes;
//         for (let i = 0; i < attributes.length; i++) {
//           if (attributes[i].value && attributes[i].value.includes("Due now")) {
//             attributes[i].value = attributes[i].value.replace(
//               "Due now",
//               "Paid now"
//             );
//           }
//         }
//       }
//     });

//     // Add a title to the PDF
//     // const titleElement = document.createElement("h1");
//     // titleElement.textContent = "ILATE - Payment Receipt";
//     // titleElement.style.textAlign = "center";
//     // titleElement.style.marginBottom = "20px";
//     // titleElement.style.color = "#7066E0";
//     // pdfContent.prepend(titleElement);

//     // Add transaction details
//     const transactionDiv = document.createElement("div");
//     transactionDiv.innerHTML = `
//     <div style="margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
//       <p><strong>Transaction Date:</strong> ${new Date().toLocaleDateString()}</p>
//       <p><strong>Transaction ID:</strong> ${paymentID} 
//       <p><strong>Student Name:</strong> ${user.user_name}</p>
//       <p><strong>Email:</strong> ${user.email_id}</p>
//       <p><strong>Phone:</strong> ${user.phone_no}</p>
//     </div>
//   `;
//     pdfContent.prepend(transactionDiv);

//     // Add a thank you message at the bottom
//     const thankYouElement = document.createElement("div");
//     thankYouElement.innerHTML = `
//     <div style="margin-top: 30px; text-align: center; color: #333;">
//       <p>Thank you for enrolling with ILATE!</p>
//       <p>For any queries, please contact support@ilate.com</p>
//     </div>
//   `;
//     pdfContent.appendChild(thankYouElement);

//     // PDF generation options
//     const opt = {
//       margin: [10, 10, 10, 10],
//       filename: `ILATE_Payment_Receipt_${
//         new Date().toISOString().split("T")[0]
//       }.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2, useCORS: true },
//       jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//     };

//     // Generate PDF
//     html2pdf().from(pdfContent).set(opt).save();
//   }; 

const generatePaymentSummaryPDF = (paymentID) => {
    const element = pdfRef.current;

    if (!element) return;

    // Clone the element to modify it for PDF
    const pdfContent = element.cloneNode(true);

    // Replace external SVG with blue text for Razorpay logo
    const svgImages = pdfContent.querySelectorAll('img[src*="razorpay-logo.svg"]');
    if (svgImages.length > 0) {
      svgImages.forEach((img) => {
        const textLogo = document.createElement("span");
        textLogo.textContent = "Razorpay";
        textLogo.style.color = "#0066FF";
        textLogo.style.fontWeight = "bold";
        textLogo.style.fontSize = "18px";
        textLogo.style.fontFamily = "Arial, sans-serif";
        img.parentNode.replaceChild(textLogo, img);
      });
    }

    // Update "Due now" to "Paid now"
    const dueNowElements = pdfContent.querySelectorAll("*");
    dueNowElements.forEach((element) => {
      if (element.textContent && element.textContent.includes("Due now")) {
        element.textContent = element.textContent.replace("Due now", "Paid now");
      }

      if (element.hasAttributes()) {
        const attributes = element.attributes;
        for (let i = 0; i < attributes.length; i++) {
          if (attributes[i].value && attributes[i].value.includes("Due now")) {
            attributes[i].value = attributes[i].value.replace("Due now", "Paid now");
          }
        }
      }
    });

    // Create header container with improved layout
    const headerContainer = document.createElement("div");
    headerContainer.style.display = "flex";
    headerContainer.style.justifyContent = "space-between";
    headerContainer.style.alignItems = "flex-start"; // Changed to flex-start for better alignment
    headerContainer.style.marginBottom = "25px"; // Increased margin
    headerContainer.style.borderBottom = "1px solid #ccc";
    headerContainer.style.paddingBottom = "15px"; // Increased padding
    headerContainer.style.width = "100%";

    // Add logo on the left with proper sizing
    const logoContainer = document.createElement("div");
    logoContainer.style.flex = "0 0 auto"; // Prevent logo from stretching
    logoContainer.style.marginRight = "20px"; // Add space between logo and details
    logoContainer.innerHTML = `
      <img src="images/ILATE_Classes_Final_Logo-02.jpg" 
           alt="ILATE Logo" 
           style="height: 60px; max-width: 150px; object-fit: contain;"/>
    `;
    headerContainer.appendChild(logoContainer);

    // Add transaction details on the right with better spacing
    const transactionDiv = document.createElement("div");
    transactionDiv.style.flex = "1 1 auto"; // Allow details to take remaining space
    transactionDiv.style.textAlign = "right";
    transactionDiv.style.minWidth = "0"; // Prevent overflow
    transactionDiv.innerHTML = `
      <p style="margin: 4px 0; line-height: 1.4;"><strong>Transaction Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p style="margin: 4px 0; line-height: 1.4;"><strong>Transaction ID:</strong> ${paymentID}</p>
      <p style="margin: 4px 0; line-height: 1.4;"><strong>Student Name:</strong> ${user.user_name}</p>
      <p style="margin: 4px 0; line-height: 1.4;"><strong>Email:</strong> ${user.email_id}</p>
      <p style="margin: 4px 0; line-height: 1.4;"><strong>Phone:</strong> ${user.phone_no}</p>
    `;
    headerContainer.appendChild(transactionDiv);

    // Add the header container to the PDF content
    pdfContent.prepend(headerContainer);

    // Add spacing to payment schedule section to prevent overlap
    const paymentSchedule = pdfContent.querySelector('.payment-schedule'); // Add this class to your payment schedule section
    if (paymentSchedule) {
      paymentSchedule.style.marginTop = "20px";
      paymentSchedule.style.marginBottom = "20px";
    }

    // Add thank you message at the bottom
    const thankYouElement = document.createElement("div");
    thankYouElement.innerHTML = `
    <div style="margin-top: 30px; padding-top: 20px; text-align: center; color: #333; border-top: 1px solid #ccc;">
      <p style="margin-bottom: 8px;">Thank you for enrolling with ILATE!</p>
      <p>For any queries, please contact support@ilate.com</p>
    </div>
    `;
    pdfContent.appendChild(thankYouElement);

    // Improved PDF generation options
    const opt = {
      margin: [15, 15, 15, 15], // Increased margins
      filename: `ILATE_Payment_Receipt_${new Date().toISOString().split("T")[0]}.pdf`,
      image: { 
        type: "jpeg", 
        quality: 0.98,
        backgroundColor: '#FFFFFF' // Ensure white background for images
      },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        allowTaint: true,
        logging: true // Helpful for debugging
      },
      jsPDF: { 
        unit: "mm", 
        format: "a4", 
        orientation: "portrait",
        hotfixes: ["px_scaling"]
      },
    };

    // Generate PDF with error handling
    try {
      html2pdf().from(pdfContent).set(opt).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an error generating the PDF. Please try again.");
    }
};

  const verifyPayment = async (paymentData) => {
    try {
      setLoading(true);
      const installmentsToSend = calculateInstallments();
      const verificationData = {
                installments_data:installmentsData,
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
         discount: discountAmount,  // Add discount amount
      final_amount: finalAmount - discountAmount,  // Add final amount after discount
      referral_code: isReferralValid ? referralCode : null  // Add referral code if valid

      };
      console.log(verificationData, 'verify data');

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
       generatePaymentSummaryPDF(verificationData.razorpay_payment_id);

        Swal.fire({
          icon: "success",
          title: "Payment Successful!",
          text: "Thank you for enrolling with ILATE. Your payment has been received successfully. Your application is under verification. Please wait for further confirmation.",
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
          <div className="px-4 py-8 lg:py-16 md:col-span-1">
            <div className="mb-5">
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                Payment
              </h1>
              <p className="mt-2 text-gray-500">
                Some Data Has Been Taken From Admission Form You Have Submitted
              </p>
            </div>
            <div className="flex items-center justify-start gap-4 my-4">
              <div>
                <img
                  loading="lazy"
                  src={profileImg}
                  className="border rounded-full w-28 h-28"
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
              <h2 className="mb-3 text-xl font-bold">
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
            <h2 className="mt-4 mb-2 text-xl font-bold">
              Kindly Fill Below Details
            </h2>
            <form onSubmit={handleFees}>
              <div className="flex items-center justify-start">
                <Heading
                  size="s"
                  className="w-full mr-4 text-sm font-medium text-gray-900 max-w-max dark:text-white-A700"
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
              <div className="flex items-center justify-start my-5">
                <Heading
                  size="s"
                  className="w-full mr-4 text-sm font-medium text-gray-900 max-w-max dark:text-white-A700"
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
                  <option value="3">3 Years</option>



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
                <h2 className="my-2 text-xl font-bold">
                  Fees Amount :{" "}
                  <span className="text-2xl">
                    <FormatPrice price={amount ? amount : 0} />
                  </span>
                  <p className="text-xs font-medium text-gray-500">
                    Fees Has Been Calculated Based on the Criteria and Batch
                    Size You've Selected
                  </p>
                </h2>

                <div className="flex items-center justify-start max-w-6xl my-5">
                  <Heading
                    size="s"
                    className="w-full mr-4 text-sm font-medium text-gray-900 max-w-max dark:text-white-A700"
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
                      className="rounded-l-none rounded-r-md"
                      type="button"
                      onClick={checkReferralCode}
                      disabled={!referralCode || loading}
                    >
                      {loading ? "Checking..." : "Apply"}
                    </Button>
                  </div>
                </div>

                {discountAmount > 0 && (
                  <div className="p-3 my-2 border border-green-300 rounded-md bg-green-50">
                    <p className="text-green-800">
                      Discount Applied:{" "}
                      <strong>
                        <FormatPrice price={discountAmount} />
                      </strong>
                    </p>
                    <p className="font-bold text-green-800">
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

                <div className="flex items-center justify-start max-w-6xl my-5">
                  <Heading
                    size="s"
                    className="w-full mr-4 text-sm font-medium text-gray-900 max-w-max dark:text-white-A700"
                  >
                    Installments
                  </Heading>
                  <select
                    name="installments"
                    id="installments"
                    value={installments}
                    onChange={(e) => setInstallments(parseInt(e.target.value))}
                    disabled={!!installmentPlan} // Disable if API plan exists
                    className="p-3 my-2 bg-teal-900 border border-teal-90 !text-white-A700 text-sm rounded-[20px] focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  >
                    <option value="1">Single Payment</option>
                    <option value="2">2 Installments</option>
                    <option value="3">3 Installments</option>
                  </select>
                </div>

                <div className="flex my-4">
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
                <div className="p-4 my-5 border border-blue-200 rounded-md bg-blue-50">
                  <div className="mt-4 text-sm text-gray-600">
                    <h4 className="mb-1 font-semibold">
                      Terms and Conditions:
                    </h4>
                    <ul className="pl-5 space-y-1 list-disc">
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
                <div className="flex items-center justify-start max-w-6xl my-5">
                  <Heading
                    size="s"
                    className="w-full mr-4 text-sm font-medium text-gray-900 max-w-max dark:text-white-A700"
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
                  <div className="p-4 border rounded-md border-black-900">
                    <div className="text-center">
                      <h2 className="text-xl font-bold">
                        Pay Via Bank Transfer
                      </h2>
                      <p className="text-sm text-gray-600">
                        Enter bank details as follows & pay
                      </p>
                    </div>
                    <table className="w-full h-full mt-4 border table-fixed border-black-900">
                      <tbody>
                        <tr>
                          <td className="p-2 font-bold border border-black-900">
                            Account Name
                          </td>
                          <td className="p-2 border border-black-900">ILATE</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold border border-black-900">
                            Account No.
                          </td>
                          <td className="p-2 border border-black-900">
                            50200055073020
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold border border-black-900">
                            Bank
                          </td>
                          <td className="p-2 border border-black-900">
                            HDFC Bank
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold border border-black-900">
                            Account Type
                          </td>
                          <td className="p-2 border border-black-900">
                            Current Account
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold border border-black-900">
                            IFSC
                          </td>
                          <td className="p-2 border border-black-900">
                            HDFC0001946
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold border border-black-900">
                            Branch
                          </td>
                          <td className="p-2 border border-black-900">
                            Andheri East, Mumbai
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-start max-w-6xl my-5">
                    <Heading
                      size="s"
                      className="w-full mr-4 text-sm font-medium text-gray-900 max-w-max dark:text-white-A700"
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
                  <div className="flex items-center justify-start max-w-6xl my-5">
                    <Heading
                      size="s"
                      className="w-full mr-4 text-sm font-medium text-gray-900 max-w-max dark:text-white-A700"
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
          <div ref={pdfRef} className="px-4 py-8 lg:py-16 md:col-span-1">
            {finalAmount > 0 ? (
              <>
                <div className="sticky p-5 border border-gray-200 rounded-lg bg-gray-50 top-5">
                  <h2 className="mb-4 text-2xl font-bold">Payment Summary</h2>
                  <div className="pb-3 mb-3 border-b">
                    <p className="flex justify-between mb-2">
                      <span>Course:</span>
                      <span className="font-semibold">{courseData.course}</span>
                    </p>
                    <p className="flex justify-between mb-2">
                      <span>Standard:</span>
                      <span className="font-semibold">
                        {courseData.standard}
                      </span>
                    </p>
                    <p className="flex justify-between mb-2">
                      <span>Subject:</span>
                      <span className="font-semibold">
                        {courseData.subject}
                      </span>
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
                  <div className="pb-3 mb-3 border-b">
                    <p className="flex justify-between mb-2 font-semibold">
                      <span>Total Amount:</span>
                      <span>
                        <FormatPrice price={amount} />
                      </span>
                    </p>
                    {discountAmount > 0 && (
                      <p className="flex justify-between mb-2 text-green-600">
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
                    {installmentsData.length > 0 && (
                      <div className="pt-3 mt-3 border-t">
                        <p className="font-semibold m-4">Your payment schedule:</p>
                        {installmentsData.map((installment, index) => (
                          <div
                            key={installment.installment_number}
                            className={`p-3 rounded ${index === 0 ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'}`}
                          >
                            <p className="flex justify-between items-center">
                              <span className="font-medium">
                                {index === 0 ? 'First Installment' : `Installment ${installment.installment_number}`}
                              </span>
                              <span className={`${index === 0 ? 'font-bold text-blue-600' : 'font-medium'}`}>
                                <FormatPrice price={installment.amount_due} />     
                              </span>
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Due date: {(installment.due_date)}
                            </p>
                            {index === 0 && (
                              <p className="text-xs text-blue-500 mt-1">Payment due immediately</p>
                            )}
                          </div>
                        ))}
                        {installmentPlan ? (
                          <p className="mt-2 text-xs text-gray-500">
                            This is a pre-defined installment plan from the institute.
                          </p>
                        ) : (
                          <p className="mt-2 text-xs text-gray-500">
                            This is a custom installment plan.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {paymentMode === "online" && (
                    <div className="flex flex-col items-center justify-center mt-6 space-y-3">
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
              </>
            ) : (
              <>
                <p className="mb-5 text-lg font-bold">
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
        </div>
      </section>
    </>
  );
};

export default Payments;
