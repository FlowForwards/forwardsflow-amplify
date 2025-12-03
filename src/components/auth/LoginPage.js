import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { Logo, LoadingSpinner } from '../common';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error, getDashboardPath } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate(getDashboardPath());
    }
  };

  const fillDemoCredentials = (demoUser) => {
    const credentials = {
      superAdmin: { email: 'admin@forwardsflow.com', password: 'admin123' },
      bankAdmin: { email: 'admin@equityafrica.com', password: 'demo123' },
      investorAdmin: { email: 'admin@impactcapital.com', password: 'demo123' },
      bankUser: { email: 'lending@equityafrica.com', password: 'demo123' },
      investorUser: { email: 'analyst@impactcapital.com', password: 'demo123' },
    };
    const cred = credentials[demoUser];
    if (cred) {
      setEmail(cred.email);
      setPassword(cred.password);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-brand p-12 flex-col justify-between">
        <Logo variant="white" size="large" />
        
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Frontier Economy Returns,<br />
            Advanced Economy Security.
          </h1>
          <p className="text-lg text-white/80">
            Connect impact investors with frontier economy banks for high-yield deposit instruments.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {[
            { value: '$16.9M+', label: 'Capital Deployed' },
            { value: '31.2%', label: 'Avg Yield' },
            { value: '4,200+', label: 'Active Loans' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white/10 rounded-xl p-4 backdrop-blur">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo size="large" />
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-500 mb-8">Sign in to your account to continue</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-12"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-12 pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-primary-600 hover:text-primary-700">Forgot password?</a>
              </div>

              <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2">
                {loading ? <LoadingSpinner size="small" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-3 text-center">Quick Demo Access</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { key: 'superAdmin', label: 'Super Admin' },
                  { key: 'bankAdmin', label: 'Bank Admin' },
                  { key: 'investorAdmin', label: 'Investor Admin' },
                  { key: 'bankUser', label: 'Bank User' },
                  { key: 'investorUser', label: 'Investor User' },
                ].map((demo) => (
                  <button
                    key={demo.key}
                    onClick={() => fillDemoCredentials(demo.key)}
                    className="px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {demo.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
