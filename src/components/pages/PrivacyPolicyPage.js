import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Logo } from '../common';
import Footer from '../common/Footer';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/"><Logo /></Link>
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-xl text-white/80">How we collect, use, and protect your information</p>
          <p className="text-sm text-white/60 mt-4">Last updated: December 2024</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 md:p-12">
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Flow inc. ("ForwardsFlow", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using our services, you agree to this Privacy Policy. If you do not agree with the terms of this policy, please do not access the site or use our services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-3">2.1 Personal Information</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may collect personal information that you voluntarily provide when registering for an account, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Full name and contact information (email address, phone number, postal address)</li>
              <li>Financial information (bank account details, investment preferences, accreditation status)</li>
              <li>Identity verification documents (passport, national ID, proof of address)</li>
              <li>Professional and employment information</li>
              <li>Tax identification numbers and residency information</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">2.2 Automatically Collected Information</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              When you access our platform, we automatically collect certain information, including:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, time spent, click patterns)</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Location data (country, region)</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Provide, operate, and maintain our services</li>
              <li>Process transactions and send related information</li>
              <li>Verify your identity and accreditation status</li>
              <li>Comply with legal and regulatory requirements (KYC/AML)</li>
              <li>Send administrative information, updates, and marketing communications</li>
              <li>Respond to inquiries and provide customer support</li>
              <li>Monitor and analyze usage patterns to improve our services</li>
              <li>Detect, prevent, and address fraud and security issues</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-gray-600 leading-relaxed mb-4">We may share your information with:</p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li><strong>Partner Banks:</strong> To facilitate investment transactions and deposits</li>
              <li><strong>Service Providers:</strong> Third parties who perform services on our behalf (payment processors, identity verification, cloud hosting)</li>
              <li><strong>Regulatory Authorities:</strong> When required by law or to comply with legal processes</li>
              <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              We do not sell your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your personal information, including:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Encryption of data in transit and at rest (AES-256)</li>
              <li>Multi-factor authentication</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls and employee training</li>
              <li>FDIC-insured custodial banking partners</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Financial records may be retained for a minimum of 7 years as required by applicable regulations.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify inaccurate or incomplete information</li>
              <li>Request deletion of your personal data (subject to legal requirements)</li>
              <li>Object to or restrict processing of your data</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              To exercise these rights, please contact us at <a href="mailto:privacy@forwardsflow.com" className="text-primary-600 hover:underline">privacy@forwardsflow.com</a>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. International Data Transfers</h2>
            <p className="text-gray-600 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence, including the United States, Kenya, and other jurisdictions where our partners operate. We ensure appropriate safeguards are in place for such transfers in compliance with applicable data protection laws.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookies Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content. You can control cookie preferences through your browser settings. Essential cookies required for platform functionality cannot be disabled.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our services after such modifications constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-800 font-semibold">Flow inc.</p>
              <p className="text-gray-600">KOFISI Square, 104 Riverside Drive</p>
              <p className="text-gray-600">Nairobi, Kenya</p>
              <p className="text-gray-600 mt-2">
                Email: <a href="mailto:privacy@forwardsflow.com" className="text-primary-600 hover:underline">privacy@forwardsflow.com</a>
              </p>
              <p className="text-gray-600">
                Phone: <a href="tel:+254785654887" className="text-primary-600 hover:underline">+254 785 654 887</a>
              </p>
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
