import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LoadingSpinner } from '../common';
import { useAuth } from '../../context/AuthContext';
import { lendingInstitutionTypes, countries } from '../../data/mockData';

const BankRegistrationPage = () => {
  const { register, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    institutionType: '',
    institutionTypeOther: '',
    country: '',
    jobRole: '',
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

    const result = await register({ ...formData, type: 'bank' });
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
          {/* Logo Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 rounded-lg">
              <span className="text-white font-bold text-lg">FF</span>
              <span className="text-white font-semibold">Forwards Flow</span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Partner Bank Registration</h1>
            <p className="text-gray-500">Partner with ForwardsFlow to access capital markets and deploy via mobile lending</p>
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
                    placeholder="contact@bank.com"
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

            {/* Institution Profile */}
            <section>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Institution Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Institution Type</label>
                  <select 
                    name="institutionType" 
                    value={formData.institutionType} 
                    onChange={handleChange} 
                    className="select-field" 
                    required
                  >
                    <option value="">Select institution type</option>
                    {lendingInstitutionTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                {formData.institutionType === 'other' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Please specify</label>
                    <input 
                      type="text" 
                      name="institutionTypeOther" 
                      value={formData.institutionTypeOther} 
                      onChange={handleChange} 
                      className="input-field" 
                      required 
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Headquarters Country</label>
                  <select 
                    name="country" 
                    value={formData.country} 
                    onChange={handleChange} 
                    className="select-field" 
                    required
                  >
                    <option value="">Select country</option>
                    {countries.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Role</label>
                  <input 
                    type="text" 
                    name="jobRole" 
                    value={formData.jobRole} 
                    onChange={handleChange} 
                    className="input-field" 
                    placeholder="e.g., CFO, Treasury Director, CEO"
                  />
                </div>
              </div>
            </section>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary flex items-center justify-center gap-2"
            >
              {loading ? <LoadingSpinner size="small" /> : 'Create Partner Account'}
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

export default BankRegistrationPage;
