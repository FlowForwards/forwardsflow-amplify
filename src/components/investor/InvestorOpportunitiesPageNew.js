import React, { useState } from 'react';
import { 
  DollarSign, Calendar, Percent, TrendingUp, Shield, Globe,
  CheckCircle, Clock, AlertTriangle, Building2, Upload, FileText,
  CreditCard, ArrowRight, ArrowLeft, Download, Eye
} from 'lucide-react';
import { useDemoContext } from '../../context/DemoContext';

const statusConfig = {
  published: { label: 'Available', color: 'bg-green-100 text-green-700' },
  accepted: { label: 'Accepted', color: 'bg-purple-100 text-purple-700' },
  kyc_review: { label: 'KYC Review', color: 'bg-yellow-100 text-yellow-700' },
  processing: { label: 'Processing', color: 'bg-orange-100 text-orange-700' },
  completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700' },
};

const InvestorOpportunitiesPage = () => {
  const { 
    getCallsForInvestor, 
    acceptCapitalCall, 
    submitKycDocuments, 
    submitBankDetails,
    processTransaction,
    completeTransaction 
  } = useDemoContext();
  
  const opportunities = getCallsForInvestor();
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [kycData, setKycData] = useState({
    certificateOfIncorporation: null,
    cr12Document: null,
    proofOfAddress: null,
  });
  const [bankDetails, setBankDetails] = useState({
    sourceBank: '',
    sourceAccountNumber: '',
    sourceSwiftCode: '',
    redemptionBank: '',
    redemptionAccountNumber: '',
    redemptionSwiftCode: '',
  });

  const handleAcceptOffer = (opp) => {
    setSelectedOpp(opp);
    setCurrentStep('accept');
  };

  const handleConfirmAccept = () => {
    acceptCapitalCall(selectedOpp.id, {
      companyName: 'Shell Foundation',
      contactEmail: 'Mathieu.Fourn@shellfoundation.org',
    });
    setCurrentStep('kyc');
  };

  const handleKycSubmit = () => {
    submitKycDocuments(selectedOpp.id, kycData);
    setCurrentStep('bank-details');
  };

  const handleBankDetailsSubmit = () => {
    submitBankDetails(selectedOpp.id, bankDetails);
    setCurrentStep('review');
  };

  const handleConfirmTransaction = async () => {
    setIsProcessing(true);
    processTransaction(selectedOpp.id);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    completeTransaction(selectedOpp.id);
    setCurrentStep('success');
    setIsProcessing(false);
  };

  const handleClose = () => {
    setSelectedOpp(null);
    setCurrentStep(null);
    setKycData({ certificateOfIncorporation: null, cr12Document: null, proofOfAddress: null });
    setBankDetails({
      sourceBank: '',
      sourceAccountNumber: '',
      sourceSwiftCode: '',
      redemptionBank: '',
      redemptionAccountNumber: '',
      redemptionSwiftCode: '',
    });
  };

  // Modal content based on step
  const renderModalContent = () => {
    if (!selectedOpp) return null;

    const expectedReturn = selectedOpp.amount * (1 + selectedOpp.interestRate / 100);
    const maturityDate = new Date(Date.now() + selectedOpp.maturityMonths * 30 * 24 * 60 * 60 * 1000);

    switch (currentStep) {
      case 'accept':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Accept Investment Offer</h2>
            
            <div className="bg-gradient-to-br from-primary-600 to-blue-700 rounded-xl p-6 text-white mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-white/70 text-sm">Investment Amount</p>
                  <p className="text-3xl font-bold">${selectedOpp.amount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-sm">APR</p>
                  <p className="text-3xl font-bold">{selectedOpp.interestRate}%</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
                <div>
                  <p className="text-white/70 text-sm">Bank</p>
                  <p className="font-semibold">{selectedOpp.bankName}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Maturity</p>
                  <p className="font-semibold">{selectedOpp.maturityMonths} months</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Expected Return</p>
                  <p className="font-semibold">${expectedReturn.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">FX Terms</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Spot Rate</p>
                  <p className="font-semibold">{selectedOpp.currentFxRate} USD/KES</p>
                </div>
                <div>
                  <p className="text-gray-500">Hedged Rate</p>
                  <p className="font-semibold text-green-600">{selectedOpp.hedgedFxRate?.toFixed(2)} USD/KES</p>
                </div>
                <div>
                  <p className="text-gray-500">FX Spread</p>
                  <p className="font-semibold">Interbank + {selectedOpp.fxSpread}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Hedging Fee</p>
                  <p className="font-semibold">{selectedOpp.hedgingFee}%</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={handleClose} className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleConfirmAccept} className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 flex items-center justify-center gap-2">
                Accept Offer <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        );

      case 'kyc':
        return (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setCurrentStep('accept')} className="p-1 hover:bg-gray-100 rounded">
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </button>
              <h2 className="text-xl font-bold text-gray-900">KYC Documents</h2>
            </div>
            <p className="text-gray-500 mb-6">Upload your corporate verification documents</p>

            <div className="space-y-4 mb-6">
              {[
                { key: 'certificateOfIncorporation', label: 'Certificate of Incorporation', required: true },
                { key: 'cr12Document', label: 'Company CR12 / International Equivalent', required: true },
                { key: 'proofOfAddress', label: 'Proof of Address (Utility bill or Bank statement)', required: true },
              ].map((doc) => (
                <div key={doc.key} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        kycData[doc.key] ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {kycData[doc.key] ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <FileText className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doc.label}</p>
                        <p className="text-sm text-gray-500">
                          {kycData[doc.key] ? kycData[doc.key].name : 'PDF, JPG or PNG (Max 10MB)'}
                        </p>
                      </div>
                    </div>
                    <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200">
                      <Upload className="w-4 h-4 inline mr-2" />
                      Upload
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setKycData(prev => ({ 
                          ...prev, 
                          [doc.key]: e.target.files[0] || { name: 'document.pdf' }
                        }))}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Demo: Auto-fill button */}
            <button 
              onClick={() => setKycData({
                certificateOfIncorporation: { name: 'Shell_Foundation_CoI.pdf' },
                cr12Document: { name: 'Shell_Foundation_CR12.pdf' },
                proofOfAddress: { name: 'Shell_Foundation_Address.pdf' },
              })}
              className="w-full py-2 mb-4 border border-dashed border-gray-300 rounded-xl text-gray-500 hover:bg-gray-50 text-sm"
            >
              🎭 Demo: Auto-fill documents
            </button>

            <button 
              onClick={handleKycSubmit}
              disabled={!kycData.certificateOfIncorporation || !kycData.cr12Document || !kycData.proofOfAddress}
              className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        );

      case 'bank-details':
        return (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setCurrentStep('kyc')} className="p-1 hover:bg-gray-100 rounded">
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </button>
              <h2 className="text-xl font-bold text-gray-900">Bank Account Details</h2>
            </div>
            <p className="text-gray-500 mb-6">Provide your source and redemption account details</p>

            <div className="space-y-6">
              {/* Source Account */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary-600" />
                  Source Account (for MT103 pull)
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <input
                    placeholder="Bank Name"
                    value={bankDetails.sourceBank}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, sourceBank: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  />
                  <input
                    placeholder="Account Number / IBAN"
                    value={bankDetails.sourceAccountNumber}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, sourceAccountNumber: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  />
                  <input
                    placeholder="SWIFT/BIC Code"
                    value={bankDetails.sourceSwiftCode}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, sourceSwiftCode: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Redemption Account */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-green-600" />
                  Redemption Account (for maturity payout)
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <input
                    placeholder="Bank Name"
                    value={bankDetails.redemptionBank}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, redemptionBank: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  />
                  <input
                    placeholder="Account Number / IBAN"
                    value={bankDetails.redemptionAccountNumber}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, redemptionAccountNumber: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  />
                  <input
                    placeholder="SWIFT/BIC Code"
                    value={bankDetails.redemptionSwiftCode}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, redemptionSwiftCode: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Demo: Auto-fill button */}
              <button 
                onClick={() => setBankDetails({
                  sourceBank: 'HSBC UK',
                  sourceAccountNumber: 'GB82 WEST 1234 5698 7654 32',
                  sourceSwiftCode: 'HSBCGB2L',
                  redemptionBank: 'HSBC UK',
                  redemptionAccountNumber: 'GB82 WEST 1234 5698 7654 32',
                  redemptionSwiftCode: 'HSBCGB2L',
                })}
                className="w-full py-2 border border-dashed border-gray-300 rounded-xl text-gray-500 hover:bg-gray-50 text-sm"
              >
                🎭 Demo: Auto-fill bank details
              </button>

              <button 
                onClick={handleBankDetailsSubmit}
                disabled={!bankDetails.sourceBank || !bankDetails.sourceAccountNumber || !bankDetails.redemptionBank}
                className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue to Review <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setCurrentStep('bank-details')} className="p-1 hover:bg-gray-100 rounded">
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </button>
              <h2 className="text-xl font-bold text-gray-900">Review & Confirm</h2>
            </div>
            <p className="text-gray-500 mb-6">Please review all details before confirming</p>

            {/* Transaction Summary */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-6 text-white mb-6">
              <div className="text-center mb-4">
                <p className="text-white/70 text-sm">Transaction Reference</p>
                <p className="text-2xl font-bold font-mono">{selectedOpp.txnRef}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/70 text-sm">Investment</p>
                  <p className="text-xl font-bold">${selectedOpp.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Expected Return</p>
                  <p className="text-xl font-bold">${expectedReturn.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Interest Rate</p>
                  <p className="font-semibold">{selectedOpp.interestRate}% APR</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Maturity Date</p>
                  <p className="font-semibold">{maturityDate.toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Details Summary */}
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Counterparty</h3>
                <p className="text-gray-600">{selectedOpp.bankName}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">KYC Documents</h3>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">CoI ✓</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">CR12 ✓</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">Address ✓</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Source Account</h3>
                <p className="text-gray-600">{bankDetails.sourceBank} - {bankDetails.sourceAccountNumber}</p>
              </div>
            </div>

            {/* Compliance */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900">Compliance Verified</p>
                  <p className="text-sm text-blue-700">FATCA compliant • Sanctions screened • FDIC insured custodian</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleConfirmTransaction}
              disabled={isProcessing}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing Transaction...
                </>
              ) : (
                <>
                  Confirm Investment <CheckCircle className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        );

      case 'success':
        return (
          <div className="p-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Investment Confirmed!</h2>
            <p className="text-gray-500 mb-6">
              Your transaction has been processed successfully. You will receive a confirmation email shortly.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500">Transaction Reference</span>
                <span className="font-mono font-bold">{selectedOpp.txnRef}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500">Amount Invested</span>
                <span className="font-bold">${selectedOpp.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500">Expected Return</span>
                <span className="font-bold text-green-600">${expectedReturn.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Maturity Date</span>
                <span className="font-bold">{maturityDate.toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => window.open(`/api/certificate/${selectedOpp.txnRef}`, '_blank')}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> Download Certificate
              </button>
              <button 
                onClick={handleClose}
                className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700"
              >
                View Investments
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Investment Opportunities</h1>
        <p className="text-gray-500">Browse available fixed deposit instruments from partner banks</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-2xl font-bold text-gray-900">
                {opportunities.filter(o => o.status === 'published').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {opportunities.filter(o => ['accepted', 'kyc_review', 'processing'].includes(o.status)).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Available</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(opportunities.filter(o => o.status === 'published').reduce((sum, o) => sum + o.amount, 0) / 1000000).toFixed(0)}M
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {opportunities.map((opp) => {
          const daysLeft = Math.max(0, Math.ceil((new Date(opp.expiresAt) - new Date()) / (1000 * 60 * 60 * 24)));
          const expectedReturn = opp.amount * (1 + opp.interestRate / 100);

          return (
            <div key={opp.id} className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">
                    {opp.bankLogo}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{opp.bankName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[opp.status]?.color || 'bg-gray-100 text-gray-700'}`}>
                        {statusConfig[opp.status]?.label || opp.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{opp.txnRef}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        ${(opp.amount / 1000000).toFixed(0)}M
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Percent className="w-4 h-4" />
                        {opp.interestRate}% APR
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {opp.maturityMonths} months
                      </span>
                      <span className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        ${(expectedReturn / 1000000).toFixed(2)}M return
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  {opp.status === 'published' && (
                    <>
                      <p className="text-sm text-orange-600 mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Expires in {daysLeft} days
                      </p>
                      <button 
                        onClick={() => handleAcceptOffer(opp)}
                        className="px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700"
                      >
                        Accept Offer
                      </button>
                    </>
                  )}
                  {opp.status === 'completed' && (
                    <span className="text-green-600 font-semibold">✓ Investment Active</span>
                  )}
                  {['accepted', 'kyc_review', 'processing'].includes(opp.status) && (
                    <button 
                      onClick={() => {
                        setSelectedOpp(opp);
                        if (opp.status === 'accepted') setCurrentStep('kyc');
                        else if (opp.status === 'kyc_review') setCurrentStep('bank-details');
                        else setCurrentStep('review');
                      }}
                      className="px-4 py-2 bg-yellow-100 text-yellow-700 font-semibold rounded-lg hover:bg-yellow-200"
                    >
                      Continue
                    </button>
                  )}
                </div>
              </div>

              {/* FX Info */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-6 text-sm">
                <span className="flex items-center gap-1 text-gray-500">
                  <Globe className="w-4 h-4" />
                  FX: {opp.currentFxRate} USD/KES
                </span>
                <span className="flex items-center gap-1 text-green-600">
                  <Shield className="w-4 h-4" />
                  Hedged: {opp.hedgedFxRate?.toFixed(2)} ({opp.hedgingFee}% fee)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedOpp && currentStep && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestorOpportunitiesPage;
