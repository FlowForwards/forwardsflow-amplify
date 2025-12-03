import React from 'react';
import { 
  DollarSign, Calendar, TrendingUp, Download, Eye,
  CheckCircle, Building2, FileText, ExternalLink
} from 'lucide-react';
import { useDemoContext } from '../../context/DemoContext';

const InvestorInvestmentsPage = () => {
  const { getInvestorInvestments } = useDemoContext();
  const investments = getInvestorInvestments();

  // Calculate totals
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalExpectedReturns = investments.reduce((sum, inv) => sum + (inv.amount * (1 + inv.interestRate / 100)), 0);
  const totalInterest = totalExpectedReturns - totalInvested;

  const generateCertificatePDF = (investment) => {
    // Create a simple text-based certificate for demo
    const maturityDate = new Date(Date.now() + investment.maturityMonths * 30 * 24 * 60 * 60 * 1000);
    const expectedReturn = investment.amount * (1 + investment.interestRate / 100);
    
    const certificateContent = `
FORWARDSFLOW INVESTMENT CERTIFICATE

================================================================================
TRANSACTION TERMS CERTIFICATE
================================================================================

Transaction Reference: ${investment.txnRef}
Issue Date: ${new Date().toLocaleDateString()}

PARTIES
-------
Investor: Shell Foundation
Bank: ${investment.bankName}
Custodian: FDIC Insured Sweep Network (Delaware)

INVESTMENT DETAILS
------------------
Principal Amount: USD ${investment.amount.toLocaleString()}
Interest Rate: ${investment.interestRate}% per annum
Investment Date: ${new Date(investment.completedAt).toLocaleDateString()}
Maturity Date: ${maturityDate.toLocaleDateString()}
Term: ${investment.maturityMonths} months

EXPECTED RETURNS
----------------
Principal: USD ${investment.amount.toLocaleString()}
Interest: USD ${(expectedReturn - investment.amount).toLocaleString()}
Total at Maturity: USD ${expectedReturn.toLocaleString()}

FOREIGN EXCHANGE TERMS
----------------------
Spot Rate at Investment: ${investment.currentFxRate} USD/KES
Hedged Forward Rate: ${investment.hedgedFxRate?.toFixed(4)} USD/KES
Hedging Fee: ${investment.hedgingFee}%
FX Spread: Interbank + ${investment.fxSpread}%

COMPLIANCE & SECURITY
---------------------
✓ FATCA Compliant Structure
✓ Sanctions Screening Passed
✓ FDIC Insured Custodian
✓ Moody's A+ Rated Counterparty
✓ 18%+ BIS Capital Adequacy Ratio

================================================================================
This certificate is issued by ForwardsFlow Platform
Flow inc. | KOFISI Square, 104 Riverside Drive, Nairobi, Kenya
WIPO utility patents pending. We defend IP.
================================================================================
    `;

    // Create and download the file
    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ForwardsFlow_Certificate_${investment.txnRef}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Investments</h1>
        <p className="text-gray-500">Track your active fixed deposit investments</p>
      </div>

      {/* Portfolio Summary */}
      <div className="bg-gradient-to-br from-primary-600 to-blue-700 rounded-2xl p-6 text-white">
        <h2 className="text-lg font-semibold text-white/80 mb-4">Portfolio Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-white/70 text-sm">Total Invested</p>
            <p className="text-3xl font-bold">${(totalInvested / 1000000).toFixed(1)}M</p>
          </div>
          <div>
            <p className="text-white/70 text-sm">Expected Returns</p>
            <p className="text-3xl font-bold">${(totalExpectedReturns / 1000000).toFixed(2)}M</p>
          </div>
          <div>
            <p className="text-white/70 text-sm">Total Interest</p>
            <p className="text-3xl font-bold text-green-300">+${(totalInterest / 1000000).toFixed(2)}M</p>
          </div>
          <div>
            <p className="text-white/70 text-sm">Active Investments</p>
            <p className="text-3xl font-bold">{investments.length}</p>
          </div>
        </div>
      </div>

      {/* Investments List */}
      {investments.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">No investments yet</h3>
          <p className="text-gray-500 mb-6">Browse available opportunities to start investing</p>
          <a 
            href="/investor/opportunities"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700"
          >
            <Eye className="w-5 h-5" /> View Opportunities
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {investments.map((investment) => {
            const maturityDate = new Date(Date.now() + investment.maturityMonths * 30 * 24 * 60 * 60 * 1000);
            const expectedReturn = investment.amount * (1 + investment.interestRate / 100);
            const daysToMaturity = Math.ceil((maturityDate - new Date()) / (1000 * 60 * 60 * 24));
            const progress = ((investment.maturityMonths * 30 - daysToMaturity) / (investment.maturityMonths * 30)) * 100;

            return (
              <div key={investment.id} className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{investment.bankName}</h3>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Active
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 font-mono">{investment.txnRef}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => generateCertificatePDF(investment)}
                    className="px-4 py-2 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Certificate
                  </button>
                </div>

                {/* Investment Details */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Principal</p>
                    <p className="font-semibold text-gray-900">${investment.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Interest Rate</p>
                    <p className="font-semibold text-gray-900">{investment.interestRate}% APR</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expected Return</p>
                    <p className="font-semibold text-green-600">${expectedReturn.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Maturity Date</p>
                    <p className="font-semibold text-gray-900">{maturityDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Days Remaining</p>
                    <p className="font-semibold text-gray-900">{daysToMaturity} days</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Investment Progress</span>
                    <span>{Math.min(100, Math.max(0, progress)).toFixed(0)}% complete</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    />
                  </div>
                </div>

                {/* FX Info */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-6 text-sm">
                  <span className="text-gray-500">
                    Investment Date: {new Date(investment.completedAt).toLocaleDateString()}
                  </span>
                  <span className="text-gray-500">
                    Hedged Rate: {investment.hedgedFxRate?.toFixed(2)} USD/KES
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InvestorInvestmentsPage;
