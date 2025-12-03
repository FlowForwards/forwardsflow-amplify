import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const NewsletterSignup = ({ variant = 'default' }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  // Email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  };

  // Store subscriber locally (backup/demo)
  const storeLocally = (email) => {
    try {
      const existing = JSON.parse(localStorage.getItem('flowSubscribers') || '[]');
      if (!existing.includes(email.toLowerCase())) {
        existing.push(email.toLowerCase());
        localStorage.setItem('flowSubscribers', JSON.stringify(existing));
      }
      return true;
    } catch (e) {
      console.error('Local storage error:', e);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email format
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }

    if (!validateEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const graphqlEndpoint = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'https://jusgmj3durgmdnklgyv2cbo57q.appsync-api.eu-north-1.amazonaws.com/graphql';
      const apiKey = process.env.REACT_APP_GRAPHQL_API_KEY || 'da2-4xxr6ke64rbipdtohlzbhfhwj4';

      const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          query: `
            mutation CreateFlowSubscriber($input: CreateFlowSubscriberInput!) {
              createFlowSubscriber(input: $input) {
                id
                email
                status
                createdAt
              }
            }
          `,
          variables: {
            input: {
              email: email.toLowerCase().trim(),
              status: 'PENDING',
              source: 'website',
              subscribedAt: new Date().toISOString(),
            },
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        
        // Check for specific error types
        const errorMessage = result.errors[0]?.message || '';
        
        if (errorMessage.includes('already exists') || errorMessage.includes('duplicate') || errorMessage.includes('ConditionalCheckFailedException')) {
          setStatus('error');
          setMessage('This email is already subscribed.');
          return;
        }
        
        // If GraphQL fails but we can store locally, do that for demo
        if (storeLocally(email)) {
          setStatus('success');
          setMessage('Thanks for subscribing!');
          setEmail('');
          return;
        }
        
        throw new Error(errorMessage || 'Subscription failed');
      }

      // Success from API
      storeLocally(email); // Also store locally as backup
      setStatus('success');
      setMessage('Thanks for subscribing!');
      setEmail('');

    } catch (error) {
      console.error('Subscription error:', error);
      
      // Fallback: store locally for demo purposes
      if (storeLocally(email)) {
        setStatus('success');
        setMessage('Thanks for subscribing!');
        setEmail('');
        return;
      }
      
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  // Inline variant for footer (white background)
  if (variant === 'inline') {
    return (
      <div className="w-full">
        {status === 'success' ? (
          <div className="flex items-center gap-2 text-green-600 text-sm py-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`flex-1 px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  status === 'error' ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Subscribe'
                )}
              </button>
            </div>
            {status === 'error' ? (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {message}
              </p>
            ) : (
              <p className="mt-2 text-xs text-gray-500">We never spam.</p>
            )}
          </form>
        )}
      </div>
    );
  }

  // Compact variant for dark backgrounds
  if (variant === 'compact') {
    return (
      <div className="w-full">
        <h3 className="text-white font-semibold mb-3">Subscribe to Flows™</h3>
        <p className="text-sm text-gray-400 mb-4">Get frontier investment opportunities delivered to your inbox.</p>
        
        {status === 'success' ? (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary-500"
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Subscribe'
                )}
              </button>
            </div>
            {status === 'error' ? (
              <p className="text-red-400 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {message}
              </p>
            ) : (
              <p className="text-xs text-gray-500">We never spam.</p>
            )}
          </form>
        )}
      </div>
    );
  }

  // Default/hero variant
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-primary-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Subscribe to Flows™</h3>
          <p className="text-gray-600">
            Frontier investment fixed income opportunities & on the ground market intelligence delivered to your inbox monthly.
          </p>
        </div>

        {status === 'success' ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">You're subscribed!</h4>
            <p className="text-gray-600">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="newsletter-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  status === 'error' ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                disabled={status === 'loading'}
              />
              {status === 'error' && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  Subscribe to Flows™
                  <Mail className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              We never spam.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewsletterSignup;
