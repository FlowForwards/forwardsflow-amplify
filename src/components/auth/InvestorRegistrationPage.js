import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Logo, LoadingSpinner } from '../common';
import { useAuth } from '../../context/AuthContext';
import { investorTypes, currencies, moodysRatings, investmentTerms } from '../../data/mockData';

const InvestorRegistrationPage = () => {
  const { register, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    investorType: '',
    investorTypeOther: '',
    jobRole: '',
    ticketMin: '',
    ticketMax: '',
    preferredCurrency: '',
    targetYieldMin: '',
    targetYieldMax: '',
    moodysRatingMin: '',
    moodysRatingMax: '',
    preferredTerm: '',
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    const result = await register({ ...formData, type: 'investor' });
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-soft p-8 max-w-md w-full text-center border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Submitted!</h2>
          <p className="text-gray-500 mb-6">Your application is pending admin approval. You'll receive an email once approved.</p>
          <Link to="/login" className="btn-primary inline-block">Return to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Back to Home */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Impact Investor Registration</h1>
            <p className="text-gray-500">Join ForwardsFlow to access frontier economy returns with advanced economy security</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Account Credentials */}
            <section>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Account Credentials</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="input-field" 
                    placeholder="investor@example.com"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    className="input-field" 
                    placeholder="Min. 8 characters"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword" 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    className="input-field" 
                    required 
                  />
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Investor Profile */}
            <section>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Investor Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Investor Type</label>
                  <select 
                    name="investorType" 
                    value={formData.investorType} 
                    onChange={handleChange} 
                    className="select-field" 
                    required
                  >
                    <option value="">Select investor type</option>
                    {investorTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                {formData.investorType === 'other' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Please specify</label>
                    <input 
                      type="text" 
                      name="investorTypeOther" 
                      value={formData.investorTypeOther} 
                      onChange={handleChange} 
                      className="input-field" 
                      required 
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Role</label>
                  <input 
                    type="text" 
                    name="jobRole" 
                    value={formData.jobRole} 
                    onChange={handleChange} 
                    className="input-field" 
                    placeholder="e.g., Portfolio Manager, Investment Director"
                  />
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Investment Preferences */}
            <section>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Investment Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ticket Range (USD)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="number" 
                      name="ticketMin" 
                      value={formData.ticketMin} 
                      onChange={handleChange} 
                      className="input-field" 
                      placeholder="Min"
                    />
                    <input 
                      type="number" 
                      name="ticketMax" 
                      value={formData.ticketMax} 
                      onChange={handleChange} 
                      className="input-field" 
                      placeholder="Max"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Deployment Currency</label>
                  <select 
                    name="preferredCurrency" 
                    value={formData.preferredCurrency} 
                    onChange={handleChange} 
                    className="select-field"
                  >
                    <option value="">Select currency</option>
                    {currencies.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Target Yield Range (% annually)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="number" 
                      name="targetYieldMin" 
                      value={formData.targetYieldMin} 
                      onChange={handleChange} 
                      className="input-field" 
                      placeholder="Min %"
                      step="0.1"
                    />
                    <input 
                      type="number" 
                      name="targetYieldMax" 
                      value={formData.targetYieldMax} 
                      onChange={handleChange} 
                      className="input-field" 
                      placeholder="Max %"
                      step="0.1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Target Moody's Instrument Risk Rating Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <select 
                      name="moodysRatingMin" 
                      value={formData.moodysRatingMin} 
                      onChange={handleChange} 
                      className="select-field"
                    >
                      <option value="">Min Rating</option>
                      {moodysRatings.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                    <select 
                      name="moodysRatingMax" 
                      value={formData.moodysRatingMax} 
                      onChange={handleChange} 
                      className="select-field"
                    >
                      <option value="">Max Rating</option>
                      {moodysRatings.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Investment Term</label>
                  <select 
                    name="preferredTerm" 
                    value={formData.preferredTerm} 
                    onChange={handleChange} 
                    className="select-field"
                  >
                    <option value="">Select term</option>
                    {investmentTerms.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary flex items-center justify-center gap-2"
            >
              {loading ? <LoadingSpinner size="small" /> : 'Create Investor Account'}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account? <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvestorRegistrationPage;
