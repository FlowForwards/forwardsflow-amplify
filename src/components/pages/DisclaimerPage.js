import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Scale, Globe, FileWarning } from 'lucide-react';
import { Logo } from '../common';
import Footer from '../common/Footer';

const DisclaimerPage = () => {
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
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Important Disclaimer</h1>
          <p className="text-xl text-white/80">Please read carefully before using our services</p>
          <p className="text-sm text-white/60 mt-4">Last updated: December 2024</p>
        </div>
      </div>

      {/* Qualified Investor Notice - Prominent */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Scale className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-amber-800 mb-2">Qualified Investor Requirement</h2>
              <p className="text-amber-700 leading-relaxed">
                <strong>This website and the investment opportunities presented herein are intended solely for persons who qualify as "professional investors" or "qualified investors" as defined under applicable laws and regulations.</strong>
              </p>
              <p className="text-amber-700 leading-relaxed mt-3">
                Under the European Union's Markets in Financial Instruments Directive (MiFID II) and related regulations, you should only access this website and consider the investment opportunities if you meet the definition of a <strong>Professional Client</strong> or <strong>Eligible Counterparty</strong>, or if you qualify as a <strong>Professional Investor</strong> under the EU Prospectus Regulation.
              </p>
              <p className="text-amber-700 leading-relaxed mt-3">
                By continuing to use this website, you confirm that you meet at least one of the following criteria:
              </p>
              <ul className="list-disc list-inside text-amber-700 mt-3 space-y-2">
                <li>You are a credit institution, investment firm, insurance company, collective investment scheme, pension fund, or other authorised financial institution</li>
                <li>You are a large undertaking meeting at least two of: (i) balance sheet total of €20,000,000, (ii) net turnover of €40,000,000, (iii) own funds of €2,000,000</li>
                <li>You are a national or regional government, public body managing public debt, central bank, or supranational institution</li>
                <li>You are a natural person who satisfies at least two of: (i) carried out transactions of significant size at an average frequency of 10 per quarter over the previous four quarters, (ii) portfolio exceeding €500,000, (iii) works or has worked in the financial sector for at least one year in a professional position</li>
              </ul>
              <p className="text-amber-800 font-semibold mt-4">
                If you do not meet these criteria, please do not use this website or our services.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 md:p-12">
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. General Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The information contained on this website is provided by Flow inc. ("ForwardsFlow", "we", "us", or "our") for general informational purposes only. All information on the site is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Not Financial Advice</h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-4">
              <p className="text-red-800 font-semibold">
                The content on this website does not constitute financial, investment, legal, tax, or other professional advice. You should not construe any such information or other material as financial advice.
              </p>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Nothing contained on this website constitutes a solicitation, recommendation, endorsement, or offer by ForwardsFlow or any third-party service provider to buy or sell any securities or other financial instruments in any jurisdiction where such solicitation or offer would be unlawful.
            </p>
            <p className="text-gray-600 leading-relaxed">
              All content on this site is information of a general nature and does not address the circumstances of any particular individual or entity. You alone assume the sole responsibility of evaluating the merits and risks associated with the use of any information or other content on the site before making any decisions based on such information.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Investment Risks</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-4">
              <div className="flex items-start gap-3">
                <FileWarning className="w-6 h-6 text-gray-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-800 font-semibold mb-2">Capital at Risk</p>
                  <p className="text-gray-700">
                    Investments in financial instruments carry risk. The value of investments and the income from them can fall as well as rise, and you may not get back the amount originally invested. Past performance is not a reliable indicator of future results.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Investing in frontier and emerging market fixed income instruments involves significant risks, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li><strong>Currency Risk:</strong> Exchange rate fluctuations may adversely affect the value of investments denominated in foreign currencies</li>
              <li><strong>Political and Economic Risk:</strong> Political instability, changes in government policies, and economic conditions in frontier markets may affect investment values</li>
              <li><strong>Credit Risk:</strong> The risk that a counterparty may fail to meet its obligations</li>
              <li><strong>Liquidity Risk:</strong> Investments may not be easily convertible to cash without substantial loss in value</li>
              <li><strong>Interest Rate Risk:</strong> Changes in interest rates may affect the value of fixed income investments</li>
              <li><strong>Regulatory Risk:</strong> Changes in laws and regulations may adversely affect investments</li>
              <li><strong>Operational Risk:</strong> Failures in internal processes, systems, or external events may cause losses</li>
              <li><strong>Counterparty Risk:</strong> The risk of loss due to the failure of a financial counterparty</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              You should carefully consider whether investing is suitable for you in light of your financial circumstances and ability to bear financial risks. We recommend that you seek independent financial advice before making any investment decisions.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Forward-Looking Statements</h2>
            <p className="text-gray-600 leading-relaxed">
              This website may contain forward-looking statements, including statements about expected returns, market opportunities, and business strategies. These statements are based on current expectations and assumptions and involve known and unknown risks and uncertainties. Actual results may differ materially from those expressed or implied in such forward-looking statements. We undertake no obligation to update or revise any forward-looking statements.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. No Guarantee of Returns</h2>
            <p className="text-gray-600 leading-relaxed">
              Any projections, estimates, or illustrations of potential returns on this website are hypothetical and for illustrative purposes only. They are not guarantees of future performance. Actual returns may be higher or lower than those projected and may vary significantly. There is no guarantee that any investment will achieve its objectives or that investors will receive any return on their investment.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Jurisdictional Restrictions</h2>
            <div className="flex items-start gap-4 mb-4">
              <Globe className="w-6 h-6 text-gray-700 flex-shrink-0 mt-1" />
              <p className="text-gray-600 leading-relaxed">
                The information on this website is not intended for distribution to, or use by, any person or entity in any jurisdiction or country where such distribution or use would be contrary to local law or regulation. It is your responsibility to ascertain the terms of and comply with any local laws or regulations to which you are subject.
              </p>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              In particular, the services described on this website are not available to:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Residents of the United States (unless they are Accredited Investors as defined under SEC Regulation D)</li>
              <li>Persons subject to sanctions imposed by the United Nations, European Union, United States, or United Kingdom</li>
              <li>Residents of jurisdictions where the provision of such services would require licensing or registration not held by ForwardsFlow</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Regulatory Status</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Flow inc. is incorporated in the State of Delaware, United States, with operations in Nairobi, Kenya. We operate through regulated partner institutions in applicable jurisdictions. Our custodial services are provided through FDIC-insured banking partners.
            </p>
            <p className="text-gray-600 leading-relaxed">
              ForwardsFlow is not a registered broker-dealer, investment adviser, or bank. We do not provide investment advisory services. All investment products are offered through our regulated partner institutions.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Content</h2>
            <p className="text-gray-600 leading-relaxed">
              This website may contain links to third-party websites or content. Such links are provided for convenience only and do not imply endorsement. We have no control over the content, privacy policies, or practices of third-party sites and accept no responsibility or liability for them.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              To the fullest extent permitted by applicable law, ForwardsFlow, its affiliates, directors, officers, employees, agents, and licensors shall not be liable for any indirect, incidental, special, consequential, punitive, or exemplary damages, including but not limited to damages for loss of profits, goodwill, use, data, or other intangible losses, arising out of or in connection with your use of this website or our services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed">
              All content on this website, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, is the property of Flow inc. or its content suppliers and is protected by international copyright, trademark, and other intellectual property laws.
            </p>
            <div className="mt-4 p-4 bg-primary-50 rounded-xl">
              <p className="text-primary-800 font-semibold">
                WIPO utility patents pending. We actively defend our intellectual property rights.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have any questions about this disclaimer, please contact us:
            </p>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-800 font-semibold">Flow inc.</p>
              <p className="text-gray-600">KOFISI Square, 104 Riverside Drive</p>
              <p className="text-gray-600">Nairobi, Kenya</p>
              <p className="text-gray-600 mt-2">
                Email: <a href="mailto:legal@forwardsflow.com" className="text-primary-600 hover:underline">legal@forwardsflow.com</a>
              </p>
              <p className="text-gray-600">
                Phone: <a href="tel:+254785654887" className="text-primary-600 hover:underline">+254 785 654 887</a>
              </p>
            </div>
          </section>

        </div>

        {/* Final Acknowledgment */}
        <div className="mt-8 bg-gray-100 rounded-2xl p-6 md:p-8 text-center">
          <p className="text-gray-700 leading-relaxed">
            By using this website, you acknowledge that you have read, understood, and agree to be bound by this disclaimer and that you meet the qualified investor criteria outlined above.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DisclaimerPage;
