/**
 * DataContext - Central data layer for ForwardsFlow
 * Handles all API calls, caching, and real-time subscriptions
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from './AuthContext';
import * as queries from '../graphql/operations';

// Create the Amplify GraphQL client
const client = generateClient();

// Create context
const DataContext = createContext(null);

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

// DataProvider Component
export function DataProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  
  // Cache state
  const [cache, setCache] = useState({});
  const subscriptionsRef = useRef([]);
  
  // Loading states
  const [loading, setLoading] = useState({});
  
  // Error state
  const [errors, setErrors] = useState({});

  // ============================================
  // CACHE MANAGEMENT
  // ============================================
  
  const getCached = useCallback((key) => {
    const cached = cache[key];
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > CACHE_TTL;
    if (isExpired) {
      setCache(prev => {
        const newCache = { ...prev };
        delete newCache[key];
        return newCache;
      });
      return null;
    }
    
    return cached.data;
  }, [cache]);
  
  const setCached = useCallback((key, data) => {
    setCache(prev => ({
      ...prev,
      [key]: { data, timestamp: Date.now() }
    }));
  }, []);
  
  const invalidateCache = useCallback((pattern) => {
    setCache(prev => {
      const newCache = { ...prev };
      Object.keys(newCache).forEach(key => {
        if (key.includes(pattern)) {
          delete newCache[key];
        }
      });
      return newCache;
    });
  }, []);

  // ============================================
  // GENERIC API HELPERS
  // ============================================
  
  const executeQuery = useCallback(async (query, variables = {}, cacheKey = null) => {
    // Check cache first
    if (cacheKey) {
      const cached = getCached(cacheKey);
      if (cached) return cached;
    }
    
    setLoading(prev => ({ ...prev, [cacheKey || 'query']: true }));
    setErrors(prev => ({ ...prev, [cacheKey || 'query']: null }));
    
    try {
      const response = await client.graphql({
        query,
        variables,
      });
      
      const data = response.data;
      
      if (cacheKey) {
        setCached(cacheKey, data);
      }
      
      return data;
    } catch (error) {
      console.error('Query error:', error);
      setErrors(prev => ({ ...prev, [cacheKey || 'query']: error.message }));
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, [cacheKey || 'query']: false }));
    }
  }, [getCached, setCached]);
  
  const executeMutation = useCallback(async (mutation, variables = {}, invalidatePatterns = []) => {
    try {
      const response = await client.graphql({
        query: mutation,
        variables,
      });
      
      // Invalidate related cache entries
      invalidatePatterns.forEach(pattern => invalidateCache(pattern));
      
      return response.data;
    } catch (error) {
      console.error('Mutation error:', error);
      throw error;
    }
  }, [invalidateCache]);

  // ============================================
  // SUBSCRIPTION MANAGEMENT
  // ============================================
  
  const subscribe = useCallback((subscription, variables, onData, onError) => {
    try {
      const sub = client.graphql({
        query: subscription,
        variables,
      }).subscribe({
        next: ({ data }) => {
          if (data) {
            onData(data);
          }
        },
        error: (error) => {
          console.error('Subscription error:', error);
          if (onError) onError(error);
        },
      });
      
      subscriptionsRef.current.push(sub);
      return sub;
    } catch (error) {
      console.error('Failed to create subscription:', error);
      if (onError) onError(error);
    }
  }, []);
  
  // Cleanup subscriptions on unmount
  useEffect(() => {
    return () => {
      subscriptionsRef.current.forEach(sub => {
        if (sub && sub.unsubscribe) {
          sub.unsubscribe();
        }
      });
    };
  }, []);

  // ============================================
  // ORGANIZATION OPERATIONS
  // ============================================
  
  const getOrganization = useCallback(async (orgId) => {
    const data = await executeQuery(
      queries.GET_ORGANIZATION,
      { orgId },
      `org:${orgId}`
    );
    return data?.getOrganization;
  }, [executeQuery]);
  
  const listOrganizations = useCallback(async (filter = null, pagination = {}) => {
    const data = await executeQuery(
      queries.LIST_ORGANIZATIONS,
      { filter, pagination },
      `orgs:${filter || 'all'}:${pagination.nextToken || 'first'}`
    );
    return data?.listOrganizations;
  }, [executeQuery]);
  
  const listBanks = useCallback(async (pagination = {}) => {
    const data = await executeQuery(
      queries.LIST_BANKS,
      { pagination },
      `banks:${pagination.nextToken || 'first'}`
    );
    return data?.listBanks;
  }, [executeQuery]);
  
  const listInvestors = useCallback(async (pagination = {}) => {
    const data = await executeQuery(
      queries.LIST_INVESTORS,
      { pagination },
      `investors:${pagination.nextToken || 'first'}`
    );
    return data?.listInvestors;
  }, [executeQuery]);
  
  const createOrganization = useCallback(async (input) => {
    const data = await executeMutation(
      queries.CREATE_ORGANIZATION,
      { input },
      ['orgs', 'banks', 'investors']
    );
    return data?.createOrganization;
  }, [executeMutation]);
  
  const updateOrganization = useCallback(async (input) => {
    const data = await executeMutation(
      queries.UPDATE_ORGANIZATION,
      { input },
      ['orgs', `org:${input.orgId}`]
    );
    return data?.updateOrganization;
  }, [executeMutation]);
  
  const suspendOrganization = useCallback(async (orgId, reason) => {
    const data = await executeMutation(
      queries.SUSPEND_ORGANIZATION,
      { orgId, reason },
      ['orgs', `org:${orgId}`]
    );
    return data?.suspendOrganization;
  }, [executeMutation]);
  
  const activateOrganization = useCallback(async (orgId) => {
    const data = await executeMutation(
      queries.ACTIVATE_ORGANIZATION,
      { orgId },
      ['orgs', `org:${orgId}`]
    );
    return data?.activateOrganization;
  }, [executeMutation]);

  // ============================================
  // USER OPERATIONS
  // ============================================
  
  const getUser = useCallback(async (userId) => {
    const data = await executeQuery(
      queries.GET_USER,
      { userId },
      `user:${userId}`
    );
    return data?.getUser;
  }, [executeQuery]);
  
  const getUserByEmail = useCallback(async (email) => {
    const data = await executeQuery(
      queries.GET_USER_BY_EMAIL,
      { email },
      `user:email:${email}`
    );
    return data?.getUserByEmail;
  }, [executeQuery]);
  
  const listUsers = useCallback(async (pagination = {}) => {
    const data = await executeQuery(
      queries.LIST_USERS,
      { pagination },
      `users:all:${pagination.nextToken || 'first'}`
    );
    return data?.listUsers;
  }, [executeQuery]);
  
  const listUsersByOrganization = useCallback(async (orgId, pagination = {}) => {
    const data = await executeQuery(
      queries.LIST_USERS_BY_ORGANIZATION,
      { orgId, pagination },
      `users:org:${orgId}:${pagination.nextToken || 'first'}`
    );
    return data?.listUsersByOrganization;
  }, [executeQuery]);
  
  const createUser = useCallback(async (input) => {
    const data = await executeMutation(
      queries.CREATE_USER,
      { input },
      ['users']
    );
    return data?.createUser;
  }, [executeMutation]);
  
  const updateUser = useCallback(async (input) => {
    const data = await executeMutation(
      queries.UPDATE_USER,
      { input },
      ['users', `user:${input.userId}`]
    );
    return data?.updateUser;
  }, [executeMutation]);
  
  const suspendUser = useCallback(async (userId, reason) => {
    const data = await executeMutation(
      queries.SUSPEND_USER,
      { userId, reason },
      ['users', `user:${userId}`]
    );
    return data?.suspendUser;
  }, [executeMutation]);

  // ============================================
  // CAPITAL CALL OPERATIONS
  // ============================================
  
  const getCapitalCall = useCallback(async (callId) => {
    const data = await executeQuery(
      queries.GET_CAPITAL_CALL,
      { callId },
      `call:${callId}`
    );
    return data?.getCapitalCall;
  }, [executeQuery]);
  
  const listCapitalCalls = useCallback(async (pagination = {}) => {
    const data = await executeQuery(
      queries.LIST_CAPITAL_CALLS,
      { pagination },
      `calls:all:${pagination.nextToken || 'first'}`
    );
    return data?.listCapitalCalls;
  }, [executeQuery]);
  
  const listCapitalCallsByBank = useCallback(async (bankOrgId, pagination = {}) => {
    const data = await executeQuery(
      queries.LIST_CAPITAL_CALLS_BY_BANK,
      { bankOrgId, pagination },
      `calls:bank:${bankOrgId}:${pagination.nextToken || 'first'}`
    );
    return data?.listCapitalCallsByBank;
  }, [executeQuery]);
  
  const listPublishedCalls = useCallback(async (pagination = {}) => {
    const data = await executeQuery(
      queries.LIST_PUBLISHED_CALLS,
      { pagination },
      `calls:published:${pagination.nextToken || 'first'}`
    );
    return data?.listPublishedCalls;
  }, [executeQuery]);
  
  const createCapitalCall = useCallback(async (input) => {
    const data = await executeMutation(
      queries.CREATE_CAPITAL_CALL,
      { input },
      ['calls']
    );
    return data?.createCapitalCall;
  }, [executeMutation]);
  
  const updateCapitalCall = useCallback(async (input) => {
    const data = await executeMutation(
      queries.UPDATE_CAPITAL_CALL,
      { input },
      ['calls', `call:${input.callId}`]
    );
    return data?.updateCapitalCall;
  }, [executeMutation]);
  
  const publishCapitalCall = useCallback(async (callId) => {
    const data = await executeMutation(
      queries.PUBLISH_CAPITAL_CALL,
      { callId },
      ['calls', `call:${callId}`]
    );
    return data?.publishCapitalCall;
  }, [executeMutation]);
  
  const cancelCapitalCall = useCallback(async (callId, reason) => {
    const data = await executeMutation(
      queries.CANCEL_CAPITAL_CALL,
      { callId, reason },
      ['calls', `call:${callId}`]
    );
    return data?.cancelCapitalCall;
  }, [executeMutation]);

  // ============================================
  // INVESTMENT OPERATIONS
  // ============================================
  
  const getInvestment = useCallback(async (investmentId) => {
    const data = await executeQuery(
      queries.GET_INVESTMENT,
      { investmentId },
      `investment:${investmentId}`
    );
    return data?.getInvestment;
  }, [executeQuery]);
  
  const listInvestments = useCallback(async (pagination = {}) => {
    const data = await executeQuery(
      queries.LIST_INVESTMENTS,
      { pagination },
      `investments:all:${pagination.nextToken || 'first'}`
    );
    return data?.listInvestments;
  }, [executeQuery]);
  
  const listInvestmentsByInvestor = useCallback(async (investorOrgId, pagination = {}) => {
    const data = await executeQuery(
      queries.LIST_INVESTMENTS_BY_INVESTOR,
      { investorOrgId, pagination },
      `investments:investor:${investorOrgId}:${pagination.nextToken || 'first'}`
    );
    return data?.listInvestmentsByInvestor;
  }, [executeQuery]);
  
  const createInvestment = useCallback(async (input) => {
    const data = await executeMutation(
      queries.CREATE_INVESTMENT,
      { input },
      ['investments', 'calls']
    );
    return data?.createInvestment;
  }, [executeMutation]);
  
  const submitKyc = useCallback(async (input) => {
    const data = await executeMutation(
      queries.SUBMIT_KYC,
      { input },
      [`investment:${input.investmentId}`]
    );
    return data?.submitKyc;
  }, [executeMutation]);
  
  const approveKyc = useCallback(async (investmentId) => {
    const data = await executeMutation(
      queries.APPROVE_KYC,
      { investmentId },
      [`investment:${investmentId}`]
    );
    return data?.approveKyc;
  }, [executeMutation]);
  
  const rejectKyc = useCallback(async (investmentId, reason) => {
    const data = await executeMutation(
      queries.REJECT_KYC,
      { investmentId, reason },
      [`investment:${investmentId}`]
    );
    return data?.rejectKyc;
  }, [executeMutation]);
  
  const completeInvestment = useCallback(async (investmentId) => {
    const data = await executeMutation(
      queries.COMPLETE_INVESTMENT,
      { investmentId },
      ['investments', `investment:${investmentId}`]
    );
    return data?.completeInvestment;
  }, [executeMutation]);

  // ============================================
  // MOBILE LOAN OPERATIONS
  // ============================================
  
  const getMobileLoan = useCallback(async (loanId) => {
    const data = await executeQuery(
      queries.GET_MOBILE_LOAN,
      { loanId },
      `loan:${loanId}`
    );
    return data?.getMobileLoan;
  }, [executeQuery]);
  
  const listMobileLoansByBank = useCallback(async (bankOrgId, status = null, pagination = {}) => {
    const data = await executeQuery(
      queries.LIST_MOBILE_LOANS_BY_BANK,
      { bankOrgId, status, pagination },
      `loans:bank:${bankOrgId}:${status || 'all'}:${pagination.nextToken || 'first'}`
    );
    return data?.listMobileLoansByBank;
  }, [executeQuery]);
  
  const createMobileLoan = useCallback(async (input) => {
    const data = await executeMutation(
      queries.CREATE_MOBILE_LOAN,
      { input },
      ['loans']
    );
    return data?.createMobileLoan;
  }, [executeMutation]);
  
  const approveMobileLoan = useCallback(async (loanId) => {
    const data = await executeMutation(
      queries.APPROVE_MOBILE_LOAN,
      { loanId },
      ['loans', `loan:${loanId}`]
    );
    return data?.approveMobileLoan;
  }, [executeMutation]);
  
  const disburseMobileLoan = useCallback(async (loanId) => {
    const data = await executeMutation(
      queries.DISBURSE_MOBILE_LOAN,
      { loanId },
      ['loans', `loan:${loanId}`]
    );
    return data?.disburseMobileLoan;
  }, [executeMutation]);
  
  const recordLoanPayment = useCallback(async (input) => {
    const data = await executeMutation(
      queries.RECORD_LOAN_PAYMENT,
      { input },
      ['loans', `loan:${input.loanId}`]
    );
    return data?.recordLoanPayment;
  }, [executeMutation]);

  // ============================================
  // METRICS OPERATIONS
  // ============================================
  
  const getPlatformMetrics = useCallback(async () => {
    const data = await executeQuery(
      queries.GET_PLATFORM_METRICS,
      {},
      'metrics:platform'
    );
    return data?.getPlatformMetrics;
  }, [executeQuery]);
  
  const getBankMetrics = useCallback(async (orgId) => {
    const data = await executeQuery(
      queries.GET_BANK_METRICS,
      { orgId },
      `metrics:bank:${orgId}`
    );
    return data?.getBankMetrics;
  }, [executeQuery]);
  
  const getInvestorMetrics = useCallback(async (orgId) => {
    const data = await executeQuery(
      queries.GET_INVESTOR_METRICS,
      { orgId },
      `metrics:investor:${orgId}`
    );
    return data?.getInvestorMetrics;
  }, [executeQuery]);
  
  const refreshPlatformMetrics = useCallback(async () => {
    invalidateCache('metrics:platform');
    const data = await executeMutation(
      queries.REFRESH_PLATFORM_METRICS,
      {},
      ['metrics:platform']
    );
    return data?.refreshPlatformMetrics;
  }, [executeMutation, invalidateCache]);

  // ============================================
  // NOTIFICATION OPERATIONS
  // ============================================
  
  const listNotifications = useCallback(async (userId, unreadOnly = false, pagination = {}) => {
    const data = await executeQuery(
      queries.LIST_NOTIFICATIONS,
      { userId, unreadOnly, pagination },
      `notifications:${userId}:${unreadOnly}:${pagination.nextToken || 'first'}`
    );
    return data?.listNotifications;
  }, [executeQuery]);
  
  const markNotificationRead = useCallback(async (notificationId) => {
    const data = await executeMutation(
      queries.MARK_NOTIFICATION_READ,
      { notificationId },
      ['notifications']
    );
    return data?.markNotificationRead;
  }, [executeMutation]);
  
  const markAllNotificationsRead = useCallback(async (userId) => {
    const data = await executeMutation(
      queries.MARK_ALL_NOTIFICATIONS_READ,
      { userId },
      ['notifications']
    );
    return data?.markAllNotificationsRead;
  }, [executeMutation]);

  // ============================================
  // AUDIT LOG OPERATIONS
  // ============================================
  
  const listAuditLogs = useCallback(async (orgId, userId, action, dateRange, pagination = {}) => {
    const data = await executeQuery(
      queries.LIST_AUDIT_LOGS,
      { orgId, userId, action, dateRange, pagination },
      `auditLogs:${orgId || 'all'}:${pagination.nextToken || 'first'}`
    );
    return data?.listAuditLogs;
  }, [executeQuery]);

  // ============================================
  // ADMIN OPERATIONS
  // ============================================
  
  const seedDemoData = useCallback(async () => {
    const data = await executeMutation(
      queries.SEED_DEMO_DATA,
      {},
      ['orgs', 'users', 'calls', 'investments', 'loans']
    );
    return data?.seedDemoData;
  }, [executeMutation]);

  // ============================================
  // REAL-TIME SUBSCRIPTIONS
  // ============================================
  
  const subscribeToCapitalCalls = useCallback((onNewCall) => {
    return subscribe(
      queries.ON_CAPITAL_CALL_CREATED,
      {},
      (data) => {
        invalidateCache('calls');
        if (onNewCall) onNewCall(data.onCapitalCallCreated);
      }
    );
  }, [subscribe, invalidateCache]);
  
  const subscribeToCapitalCallUpdates = useCallback((callId, bankOrgId, onUpdate) => {
    return subscribe(
      queries.ON_CAPITAL_CALL_UPDATED,
      { callId, bankOrgId },
      (data) => {
        invalidateCache(`call:${callId}`);
        if (onUpdate) onUpdate(data.onCapitalCallUpdated);
      }
    );
  }, [subscribe, invalidateCache]);
  
  const subscribeToInvestments = useCallback((bankOrgId, onNewInvestment) => {
    return subscribe(
      queries.ON_INVESTMENT_CREATED,
      { bankOrgId },
      (data) => {
        invalidateCache('investments');
        invalidateCache('calls');
        if (onNewInvestment) onNewInvestment(data.onInvestmentCreated);
      }
    );
  }, [subscribe, invalidateCache]);
  
  const subscribeToInvestmentUpdates = useCallback((investorOrgId, bankOrgId, onUpdate) => {
    return subscribe(
      queries.ON_INVESTMENT_UPDATED,
      { investorOrgId, bankOrgId },
      (data) => {
        invalidateCache('investments');
        if (onUpdate) onUpdate(data.onInvestmentUpdated);
      }
    );
  }, [subscribe, invalidateCache]);
  
  const subscribeToNotifications = useCallback((userId, orgId, onNotification) => {
    return subscribe(
      queries.ON_NOTIFICATION_CREATED,
      { userId, orgId },
      (data) => {
        invalidateCache('notifications');
        if (onNotification) onNotification(data.onNotificationCreated);
      }
    );
  }, [subscribe, invalidateCache]);
  
  const subscribeToMobileLoans = useCallback((bankOrgId, onUpdate) => {
    return subscribe(
      queries.ON_MOBILE_LOAN_UPDATED,
      { bankOrgId },
      (data) => {
        invalidateCache('loans');
        if (onUpdate) onUpdate(data.onMobileLoanUpdated);
      }
    );
  }, [subscribe, invalidateCache]);

  // ============================================
  // CONTEXT VALUE
  // ============================================
  
  const value = {
    // State
    loading,
    errors,
    
    // Cache management
    invalidateCache,
    
    // Organizations
    getOrganization,
    listOrganizations,
    listBanks,
    listInvestors,
    createOrganization,
    updateOrganization,
    suspendOrganization,
    activateOrganization,
    
    // Users
    getUser,
    getUserByEmail,
    listUsers,
    listUsersByOrganization,
    createUser,
    updateUser,
    suspendUser,
    
    // Capital Calls
    getCapitalCall,
    listCapitalCalls,
    listCapitalCallsByBank,
    listPublishedCalls,
    createCapitalCall,
    updateCapitalCall,
    publishCapitalCall,
    cancelCapitalCall,
    
    // Investments
    getInvestment,
    listInvestments,
    listInvestmentsByInvestor,
    createInvestment,
    submitKyc,
    approveKyc,
    rejectKyc,
    completeInvestment,
    
    // Mobile Loans
    getMobileLoan,
    listMobileLoansByBank,
    createMobileLoan,
    approveMobileLoan,
    disburseMobileLoan,
    recordLoanPayment,
    
    // Metrics
    getPlatformMetrics,
    getBankMetrics,
    getInvestorMetrics,
    refreshPlatformMetrics,
    
    // Notifications
    listNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    
    // Audit Logs
    listAuditLogs,
    
    // Admin
    seedDemoData,
    
    // Subscriptions
    subscribeToCapitalCalls,
    subscribeToCapitalCallUpdates,
    subscribeToInvestments,
    subscribeToInvestmentUpdates,
    subscribeToNotifications,
    subscribeToMobileLoans,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

// ============================================
// CUSTOM HOOKS
// ============================================

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// Hook for platform metrics (Super Admin)
export function usePlatformMetrics() {
  const { getPlatformMetrics, refreshPlatformMetrics, loading, errors } = useData();
  const [metrics, setMetrics] = useState(null);
  
  useEffect(() => {
    getPlatformMetrics().then(setMetrics).catch(console.error);
  }, [getPlatformMetrics]);
  
  return {
    metrics,
    refresh: async () => {
      const updated = await refreshPlatformMetrics();
      setMetrics(updated);
      return updated;
    },
    loading: loading['metrics:platform'],
    error: errors['metrics:platform'],
  };
}

// Hook for bank metrics
export function useBankMetrics(orgId) {
  const { getBankMetrics, loading, errors } = useData();
  const [metrics, setMetrics] = useState(null);
  
  useEffect(() => {
    if (orgId) {
      getBankMetrics(orgId).then(setMetrics).catch(console.error);
    }
  }, [orgId, getBankMetrics]);
  
  return {
    metrics,
    loading: loading[`metrics:bank:${orgId}`],
    error: errors[`metrics:bank:${orgId}`],
  };
}

// Hook for investor metrics
export function useInvestorMetrics(orgId) {
  const { getInvestorMetrics, loading, errors } = useData();
  const [metrics, setMetrics] = useState(null);
  
  useEffect(() => {
    if (orgId) {
      getInvestorMetrics(orgId).then(setMetrics).catch(console.error);
    }
  }, [orgId, getInvestorMetrics]);
  
  return {
    metrics,
    loading: loading[`metrics:investor:${orgId}`],
    error: errors[`metrics:investor:${orgId}`],
  };
}

// Hook for organizations list
export function useOrganizations(filter = null) {
  const { listOrganizations, listBanks, listInvestors, loading, errors } = useData();
  const [organizations, setOrganizations] = useState([]);
  const [nextToken, setNextToken] = useState(null);
  
  useEffect(() => {
    const fetchOrgs = async () => {
      let result;
      if (filter === 'BANK') {
        result = await listBanks();
      } else if (filter === 'INVESTOR') {
        result = await listInvestors();
      } else {
        result = await listOrganizations(filter);
      }
      setOrganizations(result?.items || []);
      setNextToken(result?.nextToken);
    };
    
    fetchOrgs().catch(console.error);
  }, [filter, listOrganizations, listBanks, listInvestors]);
  
  return {
    organizations,
    nextToken,
    loading: loading[`orgs:${filter || 'all'}:first`],
    error: errors[`orgs:${filter || 'all'}:first`],
  };
}

// Hook for capital calls with real-time updates
export function useCapitalCalls(bankOrgId = null, publishedOnly = false) {
  const { 
    listCapitalCalls, 
    listCapitalCallsByBank, 
    listPublishedCalls,
    subscribeToCapitalCalls,
    loading, 
    errors 
  } = useData();
  const [calls, setCalls] = useState([]);
  const [nextToken, setNextToken] = useState(null);
  
  useEffect(() => {
    const fetchCalls = async () => {
      let result;
      if (publishedOnly) {
        result = await listPublishedCalls();
      } else if (bankOrgId) {
        result = await listCapitalCallsByBank(bankOrgId);
      } else {
        result = await listCapitalCalls();
      }
      setCalls(result?.items || []);
      setNextToken(result?.nextToken);
    };
    
    fetchCalls().catch(console.error);
    
    // Subscribe to real-time updates
    const subscription = subscribeToCapitalCalls((newCall) => {
      setCalls(prev => [newCall, ...prev]);
    });
    
    return () => {
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, [bankOrgId, publishedOnly, listCapitalCalls, listCapitalCallsByBank, listPublishedCalls, subscribeToCapitalCalls]);
  
  return {
    calls,
    nextToken,
    loading: loading['calls:all:first'] || loading[`calls:bank:${bankOrgId}:first`],
    error: errors['calls:all:first'] || errors[`calls:bank:${bankOrgId}:first`],
  };
}

// Hook for investments with real-time updates
export function useInvestments(investorOrgId = null) {
  const {
    listInvestments,
    listInvestmentsByInvestor,
    subscribeToInvestmentUpdates,
    loading,
    errors,
  } = useData();
  const [investments, setInvestments] = useState([]);
  
  useEffect(() => {
    const fetchInvestments = async () => {
      let result;
      if (investorOrgId) {
        result = await listInvestmentsByInvestor(investorOrgId);
      } else {
        result = await listInvestments();
      }
      setInvestments(result?.items || []);
    };
    
    fetchInvestments().catch(console.error);
    
    // Subscribe to updates
    const subscription = subscribeToInvestmentUpdates(investorOrgId, null, (updated) => {
      setInvestments(prev => 
        prev.map(inv => inv.investmentId === updated.investmentId ? updated : inv)
      );
    });
    
    return () => {
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, [investorOrgId, listInvestments, listInvestmentsByInvestor, subscribeToInvestmentUpdates]);
  
  return {
    investments,
    loading: loading[`investments:${investorOrgId ? `investor:${investorOrgId}` : 'all'}:first`],
    error: errors[`investments:${investorOrgId ? `investor:${investorOrgId}` : 'all'}:first`],
  };
}

// Hook for mobile loans with real-time updates
export function useMobileLoans(bankOrgId, status = null) {
  const {
    listMobileLoansByBank,
    subscribeToMobileLoans,
    loading,
    errors,
  } = useData();
  const [loans, setLoans] = useState([]);
  
  useEffect(() => {
    if (!bankOrgId) return;
    
    const fetchLoans = async () => {
      const result = await listMobileLoansByBank(bankOrgId, status);
      setLoans(result?.items || []);
    };
    
    fetchLoans().catch(console.error);
    
    // Subscribe to updates
    const subscription = subscribeToMobileLoans(bankOrgId, (updated) => {
      setLoans(prev => {
        const exists = prev.find(l => l.loanId === updated.loanId);
        if (exists) {
          return prev.map(l => l.loanId === updated.loanId ? updated : l);
        }
        return [updated, ...prev];
      });
    });
    
    return () => {
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, [bankOrgId, status, listMobileLoansByBank, subscribeToMobileLoans]);
  
  return {
    loans,
    loading: loading[`loans:bank:${bankOrgId}:${status || 'all'}:first`],
    error: errors[`loans:bank:${bankOrgId}:${status || 'all'}:first`],
  };
}

// Hook for notifications with real-time updates
export function useNotifications(userId) {
  const {
    listNotifications,
    subscribeToNotifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useData();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    if (!userId) return;
    
    const fetchNotifications = async () => {
      const result = await listNotifications(userId);
      setNotifications(result?.items || []);
      setUnreadCount(result?.unreadCount || 0);
    };
    
    fetchNotifications().catch(console.error);
    
    // Subscribe to new notifications
    const subscription = subscribeToNotifications(userId, null, (newNotif) => {
      setNotifications(prev => [newNotif, ...prev]);
      setUnreadCount(prev => prev + 1);
    });
    
    return () => {
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, [userId, listNotifications, subscribeToNotifications]);
  
  const markRead = async (notificationId) => {
    await markNotificationRead(notificationId);
    setNotifications(prev =>
      prev.map(n => n.notificationId === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };
  
  const markAllRead = async () => {
    await markAllNotificationsRead(userId);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };
  
  return {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
  };
}

export default DataContext;
