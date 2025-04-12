import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

      <p className="mb-4">
        At <strong>Your Guide To Academic Excellence</strong>, we are committed to protecting and respecting your privacy. This Privacy Policy outlines how we collect, use, disclose, and safeguard your personal information when you visit our platform.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">1. Information We Collect</h2>
      <p className="mb-4">
        We collect the following types of information when you use our services:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li><strong>Personal Information:</strong> Includes details such as your name, email address, phone number, and payment information.</li>
        <li><strong>Account Information:</strong> Information related to your registration and account activities, including login details and preferences.</li>
        <li><strong>Course Data:</strong> Information regarding the courses you enroll in, your progress, and interaction with course materials.</li>
        <li><strong>Technical Data:</strong> Includes IP address, browser type, operating system, and access times. This helps us improve our website's functionality.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4 mb-2">2. How We Use Your Information</h2>
      <p className="mb-4">
        Your information helps us deliver personalized and high-quality educational services, such as:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li><strong>Course Access:</strong> Providing you with access to the courses you enroll in and managing your course progress.</li>
        <li><strong>Customer Support:</strong> Responding to your queries and providing assistance regarding the platform and courses.</li>
        <li><strong>Payment Processing:</strong> To process payments securely and provide access to paid content.</li>
        <li><strong>Marketing Communications:</strong> Sending newsletters, promotions, and updates, but only with your explicit consent.</li>
        <li><strong>Improvement of Services:</strong> Analyzing data to enhance our platform and content offerings, ensuring a better user experience.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4 mb-2">3. Data Sharing and Disclosure</h2>
      <p className="mb-4">
        We are committed to keeping your information secure and will not share your personal details with any third parties except in the following cases:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li><strong>Third-Party Service Providers:</strong> We may share your data with third parties who help us process payments, manage the platform, or provide customer support (e.g., Razorpay).</li>
        <li><strong>Legal Obligations:</strong> If required by law, we may disclose your personal data to comply with legal processes or enforce our terms of service.</li>
        <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of our business assets, user data may be transferred as part of that transaction.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4 mb-2">4. Your Rights Regarding Data</h2>
      <p className="mb-4">
        As a user, you have the following rights regarding your personal data:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li><strong>Access:</strong> You have the right to request access to your personal data stored by us.</li>
        <li><strong>Correction:</strong> You can request corrections to any inaccuracies in your data.</li>
        <li><strong>Deletion:</strong> You may request the deletion of your account and associated data, subject to applicable laws.</li>
        <li><strong>Data Portability:</strong> You can request a copy of your data in a structured, commonly used, and machine-readable format.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4 mb-2">5. Data Security</h2>
      <p className="mb-4">
        We use various security technologies to protect your data:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li><strong>Encryption:</strong> Sensitive data, including payment information, is encrypted using Secure Socket Layer (SSL) encryption.</li>
        <li><strong>Secure Servers:</strong> Your data is stored on servers that are protected by strong security measures to prevent unauthorized access.</li>
        <li><strong>Access Controls:</strong> Access to your personal data is restricted to authorized personnel only who need it for legitimate business purposes.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4 mb-2">6. Retention of Data</h2>
      <p className="mb-4">
        We retain your personal information only as long as necessary to provide our services and comply with legal obligations. If you wish to delete your account or request data removal, please contact us.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">7. Changes to this Privacy Policy</h2>
      <p>
        We reserve the right to update this Privacy Policy at any time. When we do, the updated policy will be posted on this page with the revision date. We encourage you to review this policy periodically.
      </p>
    </div>
  );
};

export default PrivacyPolicy;