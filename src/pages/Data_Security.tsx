import React from 'react';

const DataSecurity: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Data & Security</h1>
      
      <p className="mb-4">
        At <strong>Your Guide To Academic Excellence</strong>, the safety of your personal information is a top priority. We are committed to implementing robust security measures to protect your data from unauthorized access, alteration, or destruction.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">1. Encryption and Secure Storage</h2>
      <p className="mb-4">
        We utilize Secure Socket Layer (SSL) encryption technology to ensure that your personal and financial information is securely transmitted. Our platform stores your data in encrypted form using advanced encryption methods.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">2. Access Control and Authentication</h2>
      <p className="mb-4">
        Only authorized personnel have access to your personal data, and all access is governed by strict role-based access control (RBAC). We also utilize multi-factor authentication (MFA) to further safeguard user accounts.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">3. Secure Payment Processing</h2>
      <p className="mb-4">
        Payment information is processed securely via third-party payment gateways like Razorpay. We do not store sensitive financial details on our servers to reduce the risk of data exposure.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">4. Data Retention Policy</h2>
      <p className="mb-4">
        We retain your data for as long as necessary to fulfill our contractual obligations, provide services, or comply with legal obligations. Once your data is no longer needed, it will be securely deleted.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">5. Regular Security Audits</h2>
      <p className="mb-4">
        We conduct regular security audits and vulnerability assessments to identify and mitigate potential security risks. These audits help us stay up-to-date with the latest security standards.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">6. Data Breach Notification</h2>
      <p className="mb-4">
        In the rare event of a data breach, we will notify affected users immediately via email. We will also work with authorities to address the issue and take steps to prevent future occurrences.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">7. Data Anonymization</h2>
      <p className="mb-4">
        Where possible, we anonymize data to reduce the risks associated with potential data exposure. This means that even if data is compromised, it cannot be traced back to individual users.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">8. User Responsibility</h2>
      <p className="mb-4">
        While we take every precaution to protect your data, you are also responsible for maintaining the security of your account. We recommend that you use strong passwords and never share your login details with others.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">9. Third-Party Security Practices</h2>
      <p className="mb-4">
        We work with third-party vendors who provide services on our platform. We ensure that these vendors adhere to strict security practices to protect your data. However, we are not responsible for the security practices of third-party platforms.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">10. Security Updates</h2>
      <p className="mb-4">
        We regularly update our security measures to keep up with the latest threats. Our team monitors the platform for vulnerabilities and applies patches promptly to ensure your data is secure.
      </p>
    </div>
  );
};

export default DataSecurity;