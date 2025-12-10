import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardPath } from '../../config/roleConfig';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');
  
  const { login, isAuthenticated, user, error: authError, clearError, logout } = useAuth();
  const navigate = useNavigate();

  // Clear any stale state on mount
  useEffect(() => {
    if (clearError) clearError();
    setLocalError('');
  }, [clearError]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardPath = getDashboardPath(user.role);
      console.log('Already authenticated, redirecting to:', dashboardPath);
      navigate(dashboardPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Clear errors when inputs change
  useEffect(() => {
    if (localError) setLocalError('');
    if (authError && clearError) clearError();
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!email.trim()) {
      setLocalError('Please enter your email address');
      return;
    }
    
    if (!password) {
      setLocalError('Please enter your password');
      return;
    }

    setIsSubmitting(true);
    setLocalError('');
    
    try {
      console.log('Attempting login for:', email);
      const result = await login(email, password);
      
      if (result.success) {
        const dashboardPath = getDashboardPath(result.user.role);
        console.log('Login successful, navigating to:', dashboardPath);
        navigate(dashboardPath, { replace: true });
      } else {
        setLocalError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLocalError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearAndRetry = () => {
    localStorage.clear();
    if (logout) logout();
    setLocalError('');
    setEmail('');
    setPassword('');
    window.location.href = '/login';
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* ForwardsFlow Logo - Original */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">ForwardsFlow</span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-1">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {displayError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-red-700">{displayError}</span>
              </div>
              <button
                type="button"
                onClick={handleClearAndRetry}
                className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
              >
                Clear session & Retry
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Create one
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Demo Accounts
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 bg-red-50 rounded-lg">
              <span className="font-medium text-red-700">Super Admin</span>
              <span className="text-red-600 font-mono">admin@forwardsflow.com / Admin123!</span>
            </div>
            <div className="flex justify-between p-2 bg-green-50 rounded-lg">
              <span className="font-medium text-green-700">Bank Admin</span>
              <span className="text-green-600 font-mono">admin@equityafrica.com / Demo123!</span>
            </div>
            <div className="flex justify-between p-2 bg-blue-50 rounded-lg">
              <span className="font-medium text-blue-700">Bank Lender</span>
              <span className="text-blue-600 font-mono">lending@equityafrica.com / Demo123!</span>
            </div>
            <div className="flex justify-between p-2 bg-indigo-50 rounded-lg">
              <span className="font-medium text-indigo-700">Investor Admin</span>
              <span className="text-indigo-600 font-mono">admin@shellfoundation.org / Demo123!</span>
            </div>
            <div className="flex justify-between p-2 bg-cyan-50 rounded-lg">
              <span className="font-medium text-cyan-700">Investor Analyst</span>
              <span className="text-cyan-600 font-mono">analyst@shellfoundation.org / Demo123!</span>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="mt-4 text-center">
          <button
            onClick={handleClearAndRetry}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Having trouble? Click here to reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
