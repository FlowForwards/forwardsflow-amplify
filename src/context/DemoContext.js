import React, { createContext, useContext, useState, useCallback } from 'react';

const DemoContext = createContext();

export const useDemoContext = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemoContext must be used within a DemoProvider');
  }
  return context;
};

// Generate transaction reference
const generateTxnRef = () => {
  const year = new Date().getFullYear();
  const num = String(Math.floor(Math.random() * 99999)).padStart(5, '0');
  return `TXN-${year}-${num}`;
};

// Initial demo capital calls
const initialCapitalCalls = [
  {
    id: 'demo-call-001',
    txnRef: 'TXN-2024-00001',
    bankId: 'equity-africa',
    bankName: 'Diamond Trust Bank',
    bankLogo: '🏦',
    amount: 10000000,
    currency: 'USD',
    targetCurrency: 'KES',
    maturityMonths: 12,
    interestRate: 15.0,
    fxSpread: 1.0, // interbank + 1%
    hedgingFee: 2.0,
    status: 'published', // draft, published, accepted, kyc_review, processing, completed, expired
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    currentFxRate: 153.50,
    hedgedFxRate: 156.57, // with 2% hedge
    acceptedBy: null,
    acceptedAt: null,
    kycDocuments: null,
    bankDetails: null,
    completedAt: null,
  }
];

export const DemoProvider = ({ children }) => {
  const [capitalCalls, setCapitalCalls] = useState(initialCapitalCalls);
  const [notifications, setNotifications] = useState([]);
  const [emailLog, setEmailLog] = useState([]);

  // Simulate sending email
  const sendEmail = useCallback((to, subject, body, type = 'notification') => {
    const email = {
      id: `email-${Date.now()}`,
      to,
      subject,
      body,
      type,
      sentAt: new Date().toISOString(),
      read: false,
    };
    setEmailLog(prev => [email, ...prev]);
    console.log('📧 Email sent:', { to, subject });
    return email;
  }, []);

  // Add notification
  const addNotification = useCallback((userId, message, type = 'info', link = null) => {
    const notification = {
      id: `notif-${Date.now()}`,
      userId,
      message,
      type,
      link,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [notification, ...prev]);
    return notification;
  }, []);

  // Create new capital call (Bank action)
  const createCapitalCall = useCallback((callData) => {
    const newCall = {
      id: `call-${Date.now()}`,
      txnRef: generateTxnRef(),
      bankId: callData.bankId || 'diamond-trust',
      bankName: callData.bankName || 'Diamond Trust Bank',
      bankLogo: '🏦',
      amount: callData.amount,
      currency: callData.currency || 'USD',
      targetCurrency: callData.targetCurrency || 'KES',
      maturityMonths: callData.maturityMonths,
      interestRate: callData.interestRate,
      fxSpread: callData.fxSpread || 1.0,
      hedgingFee: callData.hedgingFee || 2.0,
      status: 'published',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      currentFxRate: callData.currentFxRate || 153.50,
      hedgedFxRate: callData.hedgedFxRate || (callData.currentFxRate * 1.02),
      acceptedBy: null,
      acceptedAt: null,
      kycDocuments: null,
      bankDetails: null,
      completedAt: null,
    };

    setCapitalCalls(prev => [newCall, ...prev]);

    // Send email notification to investor
    sendEmail(
      'Mathieu.Fourn@shellfoundation.org',
      `New Investment Opportunity: $${(newCall.amount / 1000000).toFixed(0)}M at ${newCall.interestRate}% APR`,
      `
Dear Investment Manager,

A new capital call opportunity is available on ForwardsFlow:

Bank: ${newCall.bankName}
Amount: $${newCall.amount.toLocaleString()} USD
Maturity: ${newCall.maturityMonths} months
Interest Rate: ${newCall.interestRate}% APR
FX Rate: ${newCall.currentFxRate} (Hedged: ${newCall.hedgedFxRate})
Hedging Fee: ${newCall.hedgingFee}%

This offer expires in 7 days.

Login to your dashboard to review and accept this opportunity.

Best regards,
ForwardsFlow Platform
      `,
      'capital_call'
    );

    // Add dashboard notification
    addNotification(
      'investor-admin',
      `New $${(newCall.amount / 1000000).toFixed(0)}M opportunity from ${newCall.bankName}`,
      'opportunity',
      '/investor/opportunities'
    );

    return newCall;
  }, [sendEmail, addNotification]);

  // Accept capital call (Investor action)
  const acceptCapitalCall = useCallback((callId, investorData) => {
    setCapitalCalls(prev => prev.map(call => {
      if (call.id === callId) {
        return {
          ...call,
          status: 'accepted',
          acceptedBy: investorData,
          acceptedAt: new Date().toISOString(),
        };
      }
      return call;
    }));

    // Notify bank
    addNotification(
      'bank-user',
      `Shell Foundation has accepted your $10M capital call`,
      'success',
      '/bank/calls'
    );

    sendEmail(
      'lending@dtbafrica.com',
      'Capital Call Accepted - Shell Foundation',
      `Your capital call TXN-2024-00001 has been accepted by Shell Foundation. KYC documents pending.`,
      'acceptance'
    );
  }, [addNotification, sendEmail]);

  // Submit KYC documents (Investor action)
  const submitKycDocuments = useCallback((callId, documents) => {
    setCapitalCalls(prev => prev.map(call => {
      if (call.id === callId) {
        return {
          ...call,
          status: 'kyc_review',
          kycDocuments: documents,
        };
      }
      return call;
    }));

    addNotification(
      'bank-user',
      `KYC documents received for TXN-2024-00001`,
      'info',
      '/bank/calls'
    );
  }, [addNotification]);

  // Submit bank details (Investor action)
  const submitBankDetails = useCallback((callId, bankDetails) => {
    setCapitalCalls(prev => prev.map(call => {
      if (call.id === callId) {
        return {
          ...call,
          bankDetails: bankDetails,
        };
      }
      return call;
    }));
  }, []);

  // Process transaction (System action)
  const processTransaction = useCallback((callId) => {
    setCapitalCalls(prev => prev.map(call => {
      if (call.id === callId) {
        return {
          ...call,
          status: 'processing',
        };
      }
      return call;
    }));
  }, []);

  // Complete transaction (System action)
  const completeTransaction = useCallback((callId) => {
    setCapitalCalls(prev => prev.map(call => {
      if (call.id === callId) {
        const completedCall = {
          ...call,
          status: 'completed',
          completedAt: new Date().toISOString(),
        };

        // Send completion emails
        sendEmail(
          'Mathieu.Fourn@shellfoundation.org',
          `Investment Confirmed - ${call.txnRef}`,
          `
Dear Investment Manager,

Your investment has been successfully processed.

Transaction Reference: ${call.txnRef}
Amount: $${call.amount.toLocaleString()} USD
Bank: ${call.bankName}
Maturity Date: ${new Date(Date.now() + call.maturityMonths * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
Expected Return: $${(call.amount * (1 + call.interestRate / 100)).toLocaleString()} USD

Your Transaction Terms Certificate is available in your dashboard.

Best regards,
ForwardsFlow Platform
          `,
          'confirmation'
        );

        // Notify both parties
        addNotification(
          'investor-admin',
          `Investment ${call.txnRef} completed successfully`,
          'success',
          '/investor/investments'
        );

        addNotification(
          'bank-user',
          `Capital received for ${call.txnRef} - $${call.amount.toLocaleString()}`,
          'success',
          '/bank/calls'
        );

        return completedCall;
      }
      return call;
    }));
  }, [sendEmail, addNotification]);

  // Get calls for specific user type
  const getCallsForBank = useCallback((bankId) => {
    return capitalCalls.filter(call => call.bankId === bankId || bankId === 'all');
  }, [capitalCalls]);

  const getCallsForInvestor = useCallback(() => {
    return capitalCalls.filter(call => ['published', 'accepted', 'kyc_review', 'processing', 'completed'].includes(call.status));
  }, [capitalCalls]);

  const getInvestorInvestments = useCallback(() => {
    return capitalCalls.filter(call => call.status === 'completed');
  }, [capitalCalls]);

  const getNotificationsForUser = useCallback((userId) => {
    return notifications.filter(n => n.userId === userId);
  }, [notifications]);

  const markNotificationRead = useCallback((notifId) => {
    setNotifications(prev => prev.map(n => 
      n.id === notifId ? { ...n, read: true } : n
    ));
  }, []);

  const value = {
    capitalCalls,
    notifications,
    emailLog,
    createCapitalCall,
    acceptCapitalCall,
    submitKycDocuments,
    submitBankDetails,
    processTransaction,
    completeTransaction,
    getCallsForBank,
    getCallsForInvestor,
    getInvestorInvestments,
    getNotificationsForUser,
    markNotificationRead,
    addNotification,
    sendEmail,
  };

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
};

export default DemoContext;
