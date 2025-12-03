import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { Logo } from '../common';

const ConfirmSubscriptionPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading, success, error, already_confirmed
  const [message, setMessage] = useState('');

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    const confirmSubscription = async () => {
      if (!token || !email) {
        setStatus('error');
        setMessage('Invalid confirmation link.');
        return;
      }

      try {
        // Call GraphQL to update subscriber status
        const response = await fetch(process.env.REACT_APP_GRAPHQL_ENDPOINT || 'https://jusgmj3durgmdnklgyv2cbo57q.appsync-api.eu-north-1.amazonaws.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.REACT_APP_GRAPHQL_API_KEY || 'da2-4xxr6ke64rbipdtohlzbhfhwj4',
          },
          body: JSON.stringify({
            query: `
              query GetSubscriberByEmail($email: String!) {
                subscriberByEmail(email: $email) {
                  items {
                    id
                    email
                    status
                    confirmationToken
                  }
                }
              }
            `,
            variables: { email: decodeURIComponent(email) },
          }),
        });

        const result = await response.json();
        const subscribers = result.data?.subscriberByEmail?.items || [];
        
        if (subscribers.length === 0) {
          setStatus('error');
          setMessage('Subscription not found. Please subscribe again.');
          return;
        }

        const subscriber = subscribers[0];

        if (subscriber.status === 'CONFIRMED') {
          setStatus('already_confirmed');
          setMessage('Your subscription is already confirmed!');
          return;
        }

        // Update status to CONFIRMED
        const updateResponse = await fetch(process.env.REACT_APP_GRAPHQL_ENDPOINT || 'https://jusgmj3durgmdnklgyv2cbo57q.appsync-api.eu-north-1.amazonaws.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.REACT_APP_GRAPHQL_API_KEY || 'da2-4xxr6ke64rbipdtohlzbhfhwj4',
          },
          body: JSON.stringify({
            query: `
              mutation UpdateSubscriber($input: UpdateFlowSubscriberInput!) {
                updateFlowSubscriber(input: $input) {
                  id
                  email
                  status
                  confirmedAt
                }
              }
            `,
            variables: {
              input: {
                id: subscriber.id,
                status: 'CONFIRMED',
                confirmedAt: new Date().toISOString(),
              },
            },
          }),
        });

        const updateResult = await updateResponse.json();

        if (updateResult.errors) {
          throw new Error(updateResult.errors[0]?.message || 'Confirmation failed');
        }

        setStatus('success');
        setMessage('Your subscription has been confirmed!');

      } catch (error) {
        console.error('Confirmation error:', error);
        setStatus('error');
        setMessage('Something went wrong. Please try again or contact support.');
      }
    };

    confirmSubscription();
  }, [token, email]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/"><Logo /></Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center">
          
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirming...</h1>
              <p className="text-gray-600">Please wait while we confirm your subscription.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Subscription Confirmed!</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="text-gray-500 text-sm mb-8">
                You'll now receive Flows™ newsletter with exclusive frontier investment opportunities.
              </p>
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700"
              >
                Go to Homepage
              </Link>
            </>
          )}

          {status === 'already_confirmed' && (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Already Confirmed</h1>
              <p className="text-gray-600 mb-8">{message}</p>
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700"
              >
                Go to Homepage
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirmation Failed</h1>
              <p className="text-gray-600 mb-8">{message}</p>
              <div className="space-y-3">
                <Link 
                  to="/" 
                  className="block w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700"
                >
                  Go to Homepage
                </Link>
                <a 
                  href="mailto:info@forwardsflow.com" 
                  className="block w-full px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50"
                >
                  Contact Support
                </a>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default ConfirmSubscriptionPage;
