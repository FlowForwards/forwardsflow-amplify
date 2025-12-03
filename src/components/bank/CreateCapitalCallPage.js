import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, DollarSign, Calendar, Percent, TrendingUp, 
  CheckCircle, AlertCircle, Globe, Shield, Send
} from 'lucide-react';
import { useDemoContext } from '../../context/DemoContext';

const CreateCapitalCallPage = () => {
  const navigate = useNavigate();
  const { createCapitalCall } = useDemoContext();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: 10000000,
    currency: 'USD',
    targetCurrency: 'KES',
    maturityMonths: 12,
    interestRate: 15.0,
    fxSpread: 1.0,
    hedgingFee: 2.0,
  });

  // Live FX rate (simulated)
  const currentFxRate = 153.50;
  const hedgedFxRate = currentFxRate * (1 + formData.hedgingFee / 100);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' || name === 'maturityMonths' ? parseInt(value) || 0 
            : name === 'interestRate' || name === 'fxSpread' || name === 'hedgingFee' ? parseFloat(value) || 0
            : value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    createCapitalCall({
      ...formData,
      bankId: 'diamond-trust',
      bankName: 'Diamond Trust Bank',
      currentFxRate,
      hedgedFxRate,
    });
    
    setStep(3); // Success step
    setIsSubmitting(false);
  };

  const expectedReturn = formData.amount * (1 + formData.interestRate / 100);
  const localCurrencyAmount = formData.amount * hedgedFxRate;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <button 
          onClick={() => navigate('/bank/calls')} 
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Capital Calls
        </button>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-20 h-1 ${step > s ? 'bg-primary-600' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Instrument Details */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Capital Call</h1>
            <p className="text-gray-500 mb-8">Define the terms of your fixed deposit instrument</p>

            <div className="space-y-6">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Investment Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="10000"
                    step="10000"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">Minimum: $10,000</p>
              </div>

              {/* Maturity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Maturity Period
                </label>
                <select
                  name="maturityMonths"
                  value={formData.maturityMonths}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value={3}>3 Months</option>
                  <option value={6}>6 Months</option>
                  <option value={12}>12 Months</option>
                  <option value={24}>24 Months</option>
                  <option value={36}>36 Months</option>
                </select>
              </div>

              {/* Interest Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Percent className="w-4 h-4 inline mr-1" />
                  Annual Interest Rate (APR)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="interestRate"
                    value={formData.interestRate}
                    onChange={handleChange}
                    className="w-full pr-8 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="1"
                    max="50"
                    step="0.1"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>

              {/* FX Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    FX Spread (Interbank +)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="fxSpread"
                      value={formData.fxSpread}
                      onChange={handleChange}
                      className="w-full pr-8 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="0"
                      max="5"
                      step="0.1"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Shield className="w-4 h-4 inline mr-1" />
                    Hedging Fee
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="hedgingFee"
                      value={formData.hedgingFee}
                      onChange={handleChange}
                      className="w-full pr-8 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="0"
                      max="10"
                      step="0.1"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 flex items-center justify-center gap-2"
              >
                Review Terms <TrendingUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Review Capital Call</h1>
            <p className="text-gray-500 mb-8">Confirm the terms before publishing to investors</p>

            {/* Summary Card */}
            <div className="bg-gradient-to-br from-primary-600 to-blue-700 rounded-2xl p-6 text-white mb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-white/70 text-sm">Investment Amount</p>
                  <p className="text-3xl font-bold">${formData.amount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-sm">Interest Rate</p>
                  <p className="text-3xl font-bold">{formData.interestRate}%</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
                <div>
                  <p className="text-white/70 text-sm">Maturity</p>
                  <p className="font-semibold">{formData.maturityMonths} months</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Expected Return</p>
                  <p className="font-semibold">${expectedReturn.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Offer Expires</p>
                  <p className="font-semibold">7 days</p>
                </div>
              </div>
            </div>

            {/* FX Details */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Foreign Exchange Terms</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Current USD/KES Rate</p>
                  <p className="text-xl font-semibold text-gray-900">{currentFxRate.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hedged Rate (with {formData.hedgingFee}% fee)</p>
                  <p className="text-xl font-semibold text-green-600">{hedgedFxRate.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">FX Spread</p>
                  <p className="text-lg font-semibold text-gray-900">Interbank + {formData.fxSpread}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Local Currency Equivalent</p>
                  <p className="text-lg font-semibold text-gray-900">KES {localCurrencyAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Compliance Checklist */}
            <div className="bg-green-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Compliance Checklist</h3>
              <div className="space-y-2">
                {[
                  'FATCA compliant structure',
                  'Sanctions screening passed',
                  'Capital adequacy ratio: 18.2%',
                  "Moody's rating: A+",
                  'FDIC sweep network custodian',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50"
              >
                Back to Edit
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    Publish to Investors <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Capital Call Published!</h1>
            <p className="text-gray-500 mb-8">
              Your capital call has been published and notifications have been sent to qualified investors.
            </p>

            <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-blue-900 mb-3">📧 Notification Sent</h3>
              <p className="text-blue-800 text-sm">
                An email notification has been sent to <strong>Mathieu.Fourn@shellfoundation.org</strong> with the investment opportunity details.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/bank/calls')}
                className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50"
              >
                View All Calls
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setFormData({
                    amount: 10000000,
                    currency: 'USD',
                    targetCurrency: 'KES',
                    maturityMonths: 12,
                    interestRate: 15.0,
                    fxSpread: 1.0,
                    hedgingFee: 2.0,
                  });
                }}
                className="flex-1 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700"
              >
                Create Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCapitalCallPage;
