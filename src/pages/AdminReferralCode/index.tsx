import React, { useEffect, useState } from "react";
import axios from 'helper/axios';
import { useAuthContext } from "hooks/useAuthContext";

interface ReferralCode {
  id: number;
  code: string;
  created_by: number;
  created_on: string;
  expiry_days: number;
  discount_percentage: number;
  status: string;
}

interface ReferralCodeCreate {
  code: string;
  expiry_days?: number;
  discount_percentage?: number;
}

const ReferralCodeForm: React.FC = () => {
  const [referralCode, setReferralCode] = useState<ReferralCodeCreate>({
    code: "",
    expiry_days: 2,
    discount_percentage: 10,
  });

  const [referralList, setReferralList] = useState<ReferralCode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [copySuccess, setCopySuccess] = useState<Record<string, boolean>>({});
  const [showShareTooltip, setShowShareTooltip] = useState<Record<string, boolean>>({});
  const { user }: any = useAuthContext();

  const fetchReferralCodes = async () => {
    try {
      const response = await axios.get(`api/get_all_referral_codes/`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setReferralList(response.data);
    } catch (error) {
      console.error("Error fetching referral codes:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReferralCode({ ...referralCode, [e.target.name]: e.target.value });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopySuccess({...copySuccess, [code]: true});
    
    // Reset copy success message after 2 seconds
    setTimeout(() => {
      setCopySuccess({...copySuccess, [code]: false});
    }, 2000);
  };

  const toggleShareTooltip = (code: string) => {
    setShowShareTooltip({
      ...showShareTooltip,
      [code]: !showShareTooltip[code]
    });
  };

  const handleShare = (platform: string, code: string) => {
    let shareUrl = "";
    const message = `Use my referral code ${code} to get a discount!`;
    const encodedMessage = encodeURIComponent(message);
    
    switch(platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedMessage}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodedMessage}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=Check%20out%20my%20referral%20code&body=${encodedMessage}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
    
    // Close tooltip after sharing
    toggleShareTooltip(code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `api/referral-codes_create/`,
        referralCode,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setMessage(response.data.message);
      setMessageType("success");
      setReferralCode({ code: "", expiry_days: 2, discount_percentage: 10 });
      fetchReferralCodes();
    } catch (error: any) {
      if (error.response) {
        setMessage(error.response.data.detail || "Failed to create referral code");
      } else {
        setMessage("Something went wrong.");
      }
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralCodes();
  }, []);

  return (
    <div className="max-w-6xl p-0 mx-auto mt-8">
      <div className="p-6 rounded-t-lg bg-gradient-to-r from-blue-500 to-indigo-600">
        <h1 className="text-3xl font-bold text-white">Referral Code Management</h1>
        <p className="mt-2 text-blue-100">Create and manage your referral codes</p>
      </div>
      
      <div className="bg-white rounded-b-lg shadow-lg">
        <div className="p-6 border-b">
          <h2 className="flex items-center mb-6 text-xl font-semibold text-gray-800">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create New Referral Code
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium text-gray-700">Referral Code</label>
                <input
                  type="text"
                  name="code"
                  value={referralCode.code}
                  onChange={handleChange}
                  required
                  placeholder="Enter code (e.g. WELCOME50)"
                  className="w-full px-4 py-2 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Expiry (Days)</label>
                <input
                  type="number"
                  name="expiry_days"
                  value={referralCode.expiry_days}
                  onChange={handleChange}
                  min="1"
                  max="365"
                  className="w-full px-4 py-2 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Discount (%)</label>
                <input
                  type="number"
                  name="discount_percentage"
                  value={referralCode.discount_percentage}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className="w-full px-4 py-2 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2 text-white transition-all bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Create Code
                  </>
                )}
              </button>
              
              {message && (
                <div className={`ml-4 flex items-center text-sm ${messageType === "success" ? "text-green-600" : "text-red-600"}`}>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {messageType === "success" ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    )}
                  </svg>
                  {message}
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="p-6">
          <h3 className="flex items-center mb-6 text-xl font-semibold text-gray-800">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Active Referral Codes
          </h3>
          
          <div className="overflow-x-auto border border-gray-200 rounded-lg bg-gray-50">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Code</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Created On</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Expiry</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Discount</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {referralList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-4 text-sm text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center py-6">
                        <svg className="w-12 h-12 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        <p>No referral codes found. Create your first code above.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  referralList.map((code) => (
                    <tr key={code.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{code.id}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{code.code}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          code.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {code.status.charAt(0).toUpperCase() + code.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(code.created_on).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {code.expiry_days} days
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {code.discount_percentage}%
                      </td>
                      <td className="flex px-4 py-3 space-x-2 text-sm text-gray-500">
                        <button 
                          onClick={() => handleCopyCode(code.code)}
                          className="text-blue-600 transition-colors hover:text-blue-800"
                          title="Copy code"
                        >
                          {copySuccess[code.code] ? (
                            <span className="text-xs text-green-600">Copied!</span>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                          )}
                        </button>
                        
                        <div className="relative">
                          <button 
                            onClick={() => toggleShareTooltip(code.code)}
                            className="text-blue-600 transition-colors hover:text-blue-800"
                            title="Share code"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                            </svg>
                          </button>
                          
                          {showShareTooltip[code.code] && (
                            <div className="absolute z-10 w-48 py-1 mt-2 bg-white border border-gray-200 rounded-md shadow-lg -left-24">
                              <div className="px-3 py-2 text-xs font-medium text-gray-600 border-b">Share via:</div>
                              <button 
                                onClick={() => handleShare("whatsapp", code.code)}
                                className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                              >
                                WhatsApp
                              </button>
                              <button 
                                onClick={() => handleShare("facebook", code.code)}
                                className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                              >
                                Facebook
                              </button>
                              <button 
                                onClick={() => handleShare("twitter", code.code)}
                                className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                              >
                                Twitter
                              </button>
                              <button 
                                onClick={() => handleShare("email", code.code)}
                                className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                              >
                                Email
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {referralList.length > 0 && (
            <div className="mt-4 text-xs text-gray-500">
              Showing {referralList.length} referral code{referralList.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralCodeForm;