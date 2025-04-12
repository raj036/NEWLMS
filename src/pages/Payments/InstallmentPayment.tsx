import React, { useState, useEffect } from 'react';
import axios from 'helper/axios';
import { useAuthContext } from 'hooks/useAuthContext';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Clock, ChevronRight, CreditCard } from 'lucide-react';
import { Button } from 'components';

const InstallmentManagement = () => {
  const [allInstallments, setAllInstallments] = useState([]);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { user }:any = useAuthContext();
  const navigate = useNavigate();

  // Fetch all installments when component mounts
  useEffect(() => {
    fetchAllInstallments();
  }, []);

  const fetchAllInstallments = async () => {
    setIsFetching(true);
    try {
      const { data } = await axios.get('/api/all-user-installments', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      
      if (data.installments && data.installments.length > 0) {
        setAllInstallments(data.installments);
        
        // Find the first pending installment if any
        const firstPending = data.installments.find(item => item.status === 'pending');
        setSelectedInstallment(firstPending || data.installments[0]);
      } else {
        setAllInstallments([]);
        setSelectedInstallment(null);
      }
    } catch (error) {
      console.error('Error fetching installment data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.detail || 'Failed to fetch installment details',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setIsFetching(false);
    }
  };

  const loadRazorpay = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!selectedInstallment || selectedInstallment.status !== 'pending') {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Selection',
        text: 'Please select a pending installment to pay',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    setIsLoading(true);
    
    const res = await loadRazorpay('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      setIsLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'SDK Error',
        text: 'Failed to load Razorpay SDK',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    try {
      const { data } = await axios.post(
        `/api/pay-next-installment?installment_number=${selectedInstallment.installment_number}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const options = {
        key: "rzp_test_hqWvVqOn8QFGEF",
        amount: data.amount * 100,
        currency: data.currency,
        name: 'LMS Payment',
        description: `Installment ${data.installment_number}`,
        order_id: data.order_id,
        handler: async function (response) {
          try {
            const paymentData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              installment_number: data.installment_number,
            };

            await axios.post(
              '/api/verify-payment-callback',
              paymentData,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              }
            );

            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Payment completed successfully!',
              confirmButtonColor: '#3085d6',
            }).then(() => {
              // Refresh installments data
              fetchAllInstallments();
            });
          } catch (error) {
            handleError(error);
          }
        },
        theme: {
          color: '#2e8b57',
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error) => {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Payment Failed',
      text: error.response?.data?.detail || 'Something went wrong during payment!',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Okay'
    });
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const selectInstallment = (installment) => {
    setSelectedInstallment(installment);
  };

  const getStatusBadge = (status) => {
    if (status === 'paid') {
      return (
        <span className="px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          <Check className="w-3 h-3 mr-1" /> Paid
        </span>
      );
    } else if (status === 'pending') {
      return (
        <span className="px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" /> Pending
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
          {status}
        </span>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-5xl mx-auto p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">My Installments</h2>
        {/* <button
          onClick={handleBackClick}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button> */}
      </div>

      {isFetching ? (
        <div className="flex justify-center items-center p-12">
          <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : allInstallments.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-700">All Installments</h3>
            </div>
            <div className="overflow-y-auto max-h-96">
              {allInstallments.map((installment) => (
                <div
                  key={installment.installment_id}
                  onClick={() => selectInstallment(installment)}
                  className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                    selectedInstallment?.installment_id === installment.installment_id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      installment.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {installment.status === 'paid' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Installment {installment.installment_number}</p>
                      <p className="text-sm text-gray-500">Due: {formatDate(installment.due_date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {getStatusBadge(installment.status)}
                    <ChevronRight className="w-4 h-4 ml-2 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedInstallment ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-800">
                      Installment {selectedInstallment.installment_number} Details
                    </h3>
                    {getStatusBadge(selectedInstallment.status)}
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid-cols-1 md:grid-cols-2 gap-11 flex">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Amount Due</p>
                      <p className="text-xl font-semibold text-gray-800">₹{selectedInstallment.amount_due}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Due Date</p>
                      <p className="text-xl font-semibold text-gray-800">{formatDate(selectedInstallment.due_date)}</p>
                    </div>
                    
                    {selectedInstallment.status === 'paid' && (
                      <>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Payment Date</p>
                          <p className="text-xl font-semibold text-gray-800">{formatDate(selectedInstallment.payment_date)}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
                          <p className="text-xl font-semibold text-gray-800 break-all">{selectedInstallment.transaction_id || 'N/A'}</p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {selectedInstallment.status === 'pending' && (
                    <div className="flex justify-center mt-6">
                      <Button
                        onClick={handlePayment}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5 mr-2" />
                            Pay This Installment
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
                
                {selectedInstallment.status === 'paid' && (
                  <div className="bg-green-50 p-4 border-t border-green-100">
                    <div className="flex items-center text-green-700">
                      <Check className="w-5 h-5 mr-2" />
                      <p className="font-medium">This installment has been successfully paid.</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full border border-gray-200 rounded-lg p-12">
                <p className="text-gray-500">Select an installment to view details</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-500 text-xl">No installments found</div>
          <button 
            onClick={handleBackClick}
            className="mt-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Return to Dashboard
          </button>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Important Payment Information:</h3>
        <ul className="list-disc pl-6 space-y-2 text-base text-gray-600">
          <li>Payments are processed through Razorpay's secure gateway.</li>
          <li>If a payment fails, is cancelled, or gets stuck, the amount (if debited) will be refunded automatically within <strong>7-10 working days</strong>.</li>
          <li>Duplicate or extra payments will be refunded after verification.</li>
          <li>For any issues, contact our support team at <a href="mailto:support@example.com" className="text-blue-500 hover:text-blue-700 underline">support@example.com</a>.</li>
        </ul>
      </div>
    </div>
  );
};

export default InstallmentManagement;