import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Lock } from 'lucide-react';

const TermsAndConditions: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-12 px-4"
    >
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <FileText className="mr-3" />
            Terms and Conditions
          </h1>
        </div>

        <div className="p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <Shield className="mr-2 text-blue-600" />
              Data Usage Policy
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                The water resource data provided through HydroSpatial India is intended for informational purposes only. Users agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the data responsibly and in accordance with applicable laws</li>
                <li>Not redistribute or sell the data without explicit permission</li>
                <li>Acknowledge HydroSpatial India as the data source in any derived works</li>
                <li>Report any discrepancies or inaccuracies in the data</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <Lock className="mr-2 text-blue-600" />
              Privacy and Security
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                We are committed to protecting your privacy and ensuring the security of your data. Our privacy practices include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Secure storage of user information using industry-standard encryption</li>
                <li>No sharing of personal data with third parties without consent</li>
                <li>Regular security audits and updates</li>
                <li>Transparent data collection and usage policies</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Disclaimer</h2>
            <p className="text-gray-600">
              While we strive to maintain accurate and up-to-date information, HydroSpatial India makes no warranties about the completeness, reliability, or accuracy of the data. Users acknowledge that any reliance on the information is at their own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Updates to Terms</h2>
            <p className="text-gray-600">
              These terms may be updated periodically. Users will be notified of any significant changes, and continued use of the platform constitutes acceptance of the updated terms.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default TermsAndConditions;