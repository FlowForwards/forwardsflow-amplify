// PlatformAdminDashboard.js - ForwardsFlow Complete Platform Admin Dashboard
// Full platform management with all administrative functions

import React, { useState, useEffect } from 'react';
import {
  Globe, Building2, Landmark, TrendingUp, TrendingDown, DollarSign, Users, AlertCircle,
  CheckCircle, Clock, ArrowUpRight, ArrowDownRight, RefreshCw, Plus, Eye, Ban, Edit,
  Trash2, Search, Shield, Activity, FileText, CreditCard, PieChart as PieChartIcon,
  BarChart3, UserCheck, X, AlertTriangle, Settings, Bell, User, Mail, Calendar,
  Database, Zap, XSquare, AlertOctagon, Info, Target
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend, ComposedChart
} from 'recharts';
import { db } from '../../services/DatabaseService';
import { useAuth } from '../../context/AuthContext';
import AmazonQChat from '../shared/AmazonQChat';

// ============================================
// UNIVERSAL SAMPLE DATABASE
// ============================================
const SAMPLE_DATABASE = {
  platformMetrics: {
    totalBanks: 8, activeBanks: 7, totalInvestors: 12, activeInvestors: 10,
    totalUsers: 186, activeUsers: 172, totalDepositsRaised: 500000000,
    platformRevenue: 2450000, totalLoansOriginated: 45000, totalLoansDisbursed: 12500000000,
    averageYield: 31.2, defaultRate: 2.8, totalTransactions: 156, pendingTransactions: 14,
    totalInstruments: 39, activeInstruments: 35
  },
  banks: [
    { tenantId: 'bank_001', name: 'Equity Bank Kenya', email: 'admin@equity.co.ke', phone: '+254 20 2262000', country: 'Kenya', status: 'active', capitalCallingLimit: 200000000, totalDeposits: 180000000, loansDisbursed: 4500000000, revenueToDate: 850000, joinedDate: '2024-01-15', usersCount: 45, subscriptionTier: 'enterprise', subscriptionStatus: 'active', subscriptionExpiry: '2025-01-15' },
    { tenantId: 'bank_002', name: 'KCB Bank', email: 'admin@kcb.co.ke', phone: '+254 20 3270000', country: 'Kenya', status: 'active', capitalCallingLimit: 180000000, totalDeposits: 150000000, loansDisbursed: 3800000000, revenueToDate: 680000, joinedDate: '2024-02-20', usersCount: 38, subscriptionTier: 'enterprise', subscriptionStatus: 'active', subscriptionExpiry: '2025-02-20' },
    { tenantId: 'bank_003', name: 'DTB Kenya', email: 'admin@dtb.co.ke', phone: '+254 20 2851000', country: 'Kenya', status: 'active', capitalCallingLimit: 120000000, totalDeposits: 95000000, loansDisbursed: 2200000000, revenueToDate: 420000, joinedDate: '2024-03-10', usersCount: 28, subscriptionTier: 'professional', subscriptionStatus: 'active', subscriptionExpiry: '2025-03-10' },
    { tenantId: 'bank_004', name: 'Stanbic Bank', email: 'admin@stanbic.co.ke', phone: '+254 20 3638000', country: 'Kenya', status: 'active', capitalCallingLimit: 100000000, totalDeposits: 75000000, loansDisbursed: 1500000000, revenueToDate: 280000, joinedDate: '2024-04-05', usersCount: 22, subscriptionTier: 'professional', subscriptionStatus: 'active', subscriptionExpiry: '2025-04-05' },
    { tenantId: 'bank_005', name: 'CRDB Bank', email: 'admin@crdb.co.tz', phone: '+255 22 2117442', country: 'Tanzania', status: 'active', capitalCallingLimit: 80000000, totalDeposits: 0, loansDisbursed: 500000000, revenueToDate: 120000, joinedDate: '2024-05-15', usersCount: 15, subscriptionTier: 'professional', subscriptionStatus: 'active', subscriptionExpiry: '2025-05-15' },
    { tenantId: 'bank_006', name: 'NMB Bank', email: 'admin@nmb.co.tz', phone: '+255 22 2116264', country: 'Tanzania', status: 'active', capitalCallingLimit: 60000000, totalDeposits: 0, loansDisbursed: 0, revenueToDate: 45000, joinedDate: '2024-06-01', usersCount: 8, subscriptionTier: 'starter', subscriptionStatus: 'active', subscriptionExpiry: '2025-06-01' },
    { tenantId: 'bank_007', name: 'Centenary Bank', email: 'admin@centenary.co.ug', phone: '+256 417 251276', country: 'Uganda', status: 'active', capitalCallingLimit: 50000000, totalDeposits: 0, loansDisbursed: 0, revenueToDate: 35000, joinedDate: '2024-07-10', usersCount: 6, subscriptionTier: 'starter', subscriptionStatus: 'active', subscriptionExpiry: '2025-07-10' },
    { tenantId: 'bank_008', name: 'Access Bank Rwanda', email: 'admin@accessbank.rw', phone: '+250 788 145000', country: 'Rwanda', status: 'suspended', capitalCallingLimit: 40000000, totalDeposits: 0, loansDisbursed: 0, revenueToDate: 20000, joinedDate: '2024-08-01', usersCount: 4, subscriptionTier: 'starter', subscriptionStatus: 'expired', subscriptionExpiry: '2024-11-01' }
  ],
  investors: [
    { tenantId: 'inv_001', name: 'Impact Capital Partners', email: 'invest@impactcap.com', phone: '+1 212 555 0100', country: 'USA', status: 'active', totalInvested: 125000000, activeDeposits: 3, revenueToDate: 425000, joinedDate: '2024-01-10', usersCount: 8, subscriptionTier: 'enterprise', subscriptionStatus: 'active', subscriptionExpiry: '2025-01-10', riskProfile: 'moderate' },
    { tenantId: 'inv_002', name: 'Shell Foundation', email: 'invest@shellfdn.org', phone: '+44 20 7934 3000', country: 'UK', status: 'active', totalInvested: 95000000, activeDeposits: 2, revenueToDate: 320000, joinedDate: '2024-02-01', usersCount: 6, subscriptionTier: 'enterprise', subscriptionStatus: 'active', subscriptionExpiry: '2025-02-01', riskProfile: 'conservative' },
    { tenantId: 'inv_003', name: 'Nordic Impact Fund', email: 'invest@nordicif.com', phone: '+47 22 00 0000', country: 'Norway', status: 'active', totalInvested: 78000000, activeDeposits: 2, revenueToDate: 265000, joinedDate: '2024-03-15', usersCount: 5, subscriptionTier: 'professional', subscriptionStatus: 'active', subscriptionExpiry: '2025-03-15', riskProfile: 'moderate' },
    { tenantId: 'inv_004', name: 'Acumen Fund', email: 'invest@acumen.org', phone: '+1 212 566 8821', country: 'USA', status: 'active', totalInvested: 62000000, activeDeposits: 2, revenueToDate: 210000, joinedDate: '2024-04-20', usersCount: 5, subscriptionTier: 'professional', subscriptionStatus: 'active', subscriptionExpiry: '2025-04-20', riskProfile: 'aggressive' },
    { tenantId: 'inv_005', name: 'Triodos Investment', email: 'invest@triodos.com', phone: '+31 30 693 6500', country: 'Netherlands', status: 'active', totalInvested: 55000000, activeDeposits: 1, revenueToDate: 185000, joinedDate: '2024-05-10', usersCount: 4, subscriptionTier: 'professional', subscriptionStatus: 'active', subscriptionExpiry: '2025-05-10', riskProfile: 'conservative' },
    { tenantId: 'inv_006', name: 'ResponsAbility', email: 'invest@responsability.com', phone: '+41 44 403 0500', country: 'Switzerland', status: 'active', totalInvested: 45000000, activeDeposits: 1, revenueToDate: 155000, joinedDate: '2024-06-01', usersCount: 4, subscriptionTier: 'professional', subscriptionStatus: 'active', subscriptionExpiry: '2025-06-01', riskProfile: 'moderate' },
    { tenantId: 'inv_007', name: 'BlueOrchard Finance', email: 'invest@blueorchard.com', phone: '+41 22 596 4777', country: 'Switzerland', status: 'active', totalInvested: 25000000, activeDeposits: 1, revenueToDate: 95000, joinedDate: '2024-07-15', usersCount: 3, subscriptionTier: 'starter', subscriptionStatus: 'active', subscriptionExpiry: '2025-07-15', riskProfile: 'moderate' },
    { tenantId: 'inv_008', name: 'Developing World Markets', email: 'invest@dwmarkets.com', phone: '+1 203 629 8500', country: 'USA', status: 'active', totalInvested: 15000000, activeDeposits: 0, revenueToDate: 55000, joinedDate: '2024-08-01', usersCount: 3, subscriptionTier: 'starter', subscriptionStatus: 'active', subscriptionExpiry: '2025-08-01', riskProfile: 'aggressive' },
    { tenantId: 'inv_009', name: 'Oikocredit', email: 'invest@oikocredit.org', phone: '+31 33 422 4040', country: 'Netherlands', status: 'active', totalInvested: 0, activeDeposits: 0, revenueToDate: 25000, joinedDate: '2024-09-01', usersCount: 2, subscriptionTier: 'starter', subscriptionStatus: 'active', subscriptionExpiry: '2025-09-01', riskProfile: 'conservative' },
    { tenantId: 'inv_010', name: 'FMO Netherlands', email: 'invest@fmo.nl', phone: '+31 70 314 9696', country: 'Netherlands', status: 'active', totalInvested: 0, activeDeposits: 0, revenueToDate: 15000, joinedDate: '2024-10-01', usersCount: 2, subscriptionTier: 'starter', subscriptionStatus: 'active', subscriptionExpiry: '2025-10-01', riskProfile: 'moderate' },
    { tenantId: 'inv_011', name: 'Global Impact Fund', email: 'invest@globalimpact.com', phone: '+44 20 7123 4567', country: 'UK', status: 'suspended', totalInvested: 0, activeDeposits: 0, revenueToDate: 0, joinedDate: '2024-11-01', usersCount: 1, subscriptionTier: 'starter', subscriptionStatus: 'cancelled', subscriptionExpiry: '2024-12-01', riskProfile: 'moderate' },
    { tenantId: 'inv_012', name: 'Africa Growth Capital', email: 'invest@africagrowth.com', phone: '+27 11 123 4567', country: 'South Africa', status: 'suspended', totalInvested: 0, activeDeposits: 0, revenueToDate: 0, joinedDate: '2024-11-15', usersCount: 1, subscriptionTier: 'starter', subscriptionStatus: 'expired', subscriptionExpiry: '2024-11-15', riskProfile: 'aggressive' }
  ],
  users: [
    { userId: 'user_001', name: 'Peter Kimani', email: 'peter.kimani@equity.co.ke', role: 'bank_admin', tenantId: 'bank_001', tenantName: 'Equity Bank Kenya', status: 'active', lastLogin: '2024-12-29', createdAt: '2024-01-15' },
    { userId: 'user_002', name: 'Mary Wanjiku', email: 'mary.wanjiku@equity.co.ke', role: 'bank_compliance', tenantId: 'bank_001', tenantName: 'Equity Bank Kenya', status: 'active', lastLogin: '2024-12-28', createdAt: '2024-01-20' },
    { userId: 'user_003', name: 'John Ochieng', email: 'john.ochieng@kcb.co.ke', role: 'bank_admin', tenantId: 'bank_002', tenantName: 'KCB Bank', status: 'active', lastLogin: '2024-12-29', createdAt: '2024-02-20' },
    { userId: 'user_004', name: 'Grace Muthoni', email: 'grace.muthoni@kcb.co.ke', role: 'bank_lender', tenantId: 'bank_002', tenantName: 'KCB Bank', status: 'active', lastLogin: '2024-12-27', createdAt: '2024-02-25' },
    { userId: 'user_005', name: 'James Smith', email: 'james.smith@impactcap.com', role: 'investor_admin', tenantId: 'inv_001', tenantName: 'Impact Capital Partners', status: 'active', lastLogin: '2024-12-29', createdAt: '2024-01-10' },
    { userId: 'user_006', name: 'Sarah Johnson', email: 'sarah.johnson@shellfdn.org', role: 'investor_analyst', tenantId: 'inv_002', tenantName: 'Shell Foundation', status: 'active', lastLogin: '2024-12-28', createdAt: '2024-02-01' },
    { userId: 'user_007', name: 'Admin User', email: 'admin@forwardsflow.com', role: 'super_admin', tenantId: 'platform', tenantName: 'ForwardsFlow', status: 'active', lastLogin: '2024-12-30', createdAt: '2024-01-01' },
    { userId: 'user_008', name: 'Support User', email: 'support@forwardsflow.com', role: 'platform_support', tenantId: 'platform', tenantName: 'ForwardsFlow', status: 'active', lastLogin: '2024-12-30', createdAt: '2024-01-01' }
  ],
  transactions: [
    { txnId: 'TXN-2024-001', type: 'Capital Call', bank: 'Equity Bank Kenya', bankId: 'bank_001', investor: 'Impact Capital Partners', investorId: 'inv_001', amount: 50000000, currency: 'JPY', status: 'completed', kycStatus: 'verified', amlStatus: 'cleared', kycOfficer: 'Peter Kimani', amlOfficer: 'Mary Wanjiku', kycDate: '2024-12-02', amlDate: '2024-12-03', kycDocuments: ['ID Verification', 'Address Proof', 'Source of Funds'], amlDocuments: ['PEP Check', 'Sanctions Screen', 'Transaction Analysis'], createdAt: '2024-12-01', completedAt: '2024-12-05', instrumentId: 'INST-001' },
    { txnId: 'TXN-2024-002', type: 'Capital Call', bank: 'KCB Bank', bankId: 'bank_002', investor: 'Shell Foundation', investorId: 'inv_002', amount: 35000000, currency: 'JPY', status: 'pending_kyc', kycStatus: 'pending', amlStatus: 'pending', kycOfficer: null, amlOfficer: null, kycDate: null, amlDate: null, kycDocuments: [], amlDocuments: [], createdAt: '2024-12-08', completedAt: null, instrumentId: 'INST-002' },
    { txnId: 'TXN-2024-003', type: 'Settlement', bank: 'DTB Kenya', bankId: 'bank_003', investor: 'Nordic Impact Fund', investorId: 'inv_003', amount: 28000000, currency: 'JPY', status: 'completed', kycStatus: 'verified', amlStatus: 'cleared', kycOfficer: 'John Ochieng', amlOfficer: 'Grace Muthoni', kycDate: '2024-12-11', amlDate: '2024-12-11', kycDocuments: ['ID Verification', 'Company Registration'], amlDocuments: ['PEP Check', 'Sanctions Screen'], createdAt: '2024-12-10', completedAt: '2024-12-12', instrumentId: 'INST-001' },
    { txnId: 'TXN-2024-004', type: 'Capital Call', bank: 'Stanbic Bank', bankId: 'bank_004', investor: 'Acumen Fund', investorId: 'inv_004', amount: 42000000, currency: 'CHF', status: 'pending_aml', kycStatus: 'verified', amlStatus: 'under_review', kycOfficer: 'Peter Kimani', amlOfficer: 'Mary Wanjiku', kycDate: '2024-12-14', amlDate: null, kycDocuments: ['ID Verification', 'Address Proof'], amlDocuments: ['PEP Check - In Progress'], createdAt: '2024-12-15', completedAt: null, instrumentId: 'INST-003' },
    { txnId: 'TXN-2024-005', type: 'Capital Call', bank: 'Equity Bank Kenya', bankId: 'bank_001', investor: 'Triodos Investment', investorId: 'inv_005', amount: 55000000, currency: 'JPY', status: 'completed', kycStatus: 'verified', amlStatus: 'cleared', kycOfficer: 'Grace Muthoni', amlOfficer: 'John Ochieng', kycDate: '2024-11-20', amlDate: '2024-11-21', kycDocuments: ['Full KYC Package'], amlDocuments: ['Full AML Clearance'], createdAt: '2024-11-18', completedAt: '2024-11-25', instrumentId: 'INST-001' }
  ],
  instruments: [
    { instrumentId: 'INST-001', name: 'Fixed Deposit - 12M', type: 'fixed_deposit', currency: 'KES:JPY', minAmount: 10000000, maxAmount: 100000000, interestRate: 9.5, hedgingFee: 1.2, platformFee: 0.5, status: 'active', totalIssued: 12, totalValue: 180000000, bankId: 'bank_001', bankName: 'Equity Bank Kenya', createdAt: '2024-01-01', maturityDate: '2025-01-01', kycVerified: true, amlCleared: true },
    { instrumentId: 'INST-002', name: 'Fixed Deposit - 6M', type: 'fixed_deposit', currency: 'KES:CHF', minAmount: 5000000, maxAmount: 50000000, interestRate: 8.5, hedgingFee: 1.0, platformFee: 0.4, status: 'active', totalIssued: 8, totalValue: 95000000, bankId: 'bank_002', bankName: 'KCB Bank', createdAt: '2024-02-01', maturityDate: '2024-08-01', kycVerified: true, amlCleared: true },
    { instrumentId: 'INST-003', name: 'Fixed Deposit - 3M', type: 'fixed_deposit', currency: 'KES:JPY', minAmount: 2000000, maxAmount: 25000000, interestRate: 7.0, hedgingFee: 0.8, platformFee: 0.3, status: 'active', totalIssued: 15, totalValue: 45000000, bankId: 'bank_003', bankName: 'DTB Kenya', createdAt: '2024-03-01', maturityDate: '2024-06-01', kycVerified: true, amlCleared: true },
    { instrumentId: 'INST-004', name: 'High Yield Note - 18M', type: 'note', currency: 'KES:USD', minAmount: 25000000, maxAmount: 200000000, interestRate: 11.5, hedgingFee: 1.5, platformFee: 0.6, status: 'active', totalIssued: 3, totalValue: 125000000, bankId: 'bank_001', bankName: 'Equity Bank Kenya', createdAt: '2024-04-01', maturityDate: '2025-10-01', kycVerified: true, amlCleared: true },
    { instrumentId: 'INST-005', name: 'Impact Bond - 24M', type: 'bond', currency: 'KES:EUR', minAmount: 50000000, maxAmount: 500000000, interestRate: 10.0, hedgingFee: 1.3, platformFee: 0.5, status: 'suspended', totalIssued: 1, totalValue: 55000000, bankId: 'bank_004', bankName: 'Stanbic Bank', createdAt: '2024-05-01', maturityDate: '2026-05-01', kycVerified: true, amlCleared: false }
  ],
  complianceRules: [
    { ruleId: 'RULE-001', name: 'KYC Verification Required', category: 'KYC', description: 'All investors must complete KYC before transactions', threshold: 'All transactions', enforcement: 'mandatory', status: 'active', lastUpdated: '2024-11-01', updatedBy: 'System Admin' },
    { ruleId: 'RULE-002', name: 'AML Screening - High Value', category: 'AML', description: 'Enhanced due diligence for high value transactions', threshold: '>$100,000', enforcement: 'mandatory', status: 'active', lastUpdated: '2024-11-01', updatedBy: 'System Admin' },
    { ruleId: 'RULE-003', name: 'PEP Check Required', category: 'AML', description: 'Politically exposed persons screening', threshold: 'All investors', enforcement: 'mandatory', status: 'active', lastUpdated: '2024-10-15', updatedBy: 'Compliance Team' },
    { ruleId: 'RULE-004', name: 'Source of Funds Verification', category: 'KYC', description: 'Verify source of funds for large investments', threshold: '>$500,000', enforcement: 'mandatory', status: 'active', lastUpdated: '2024-09-20', updatedBy: 'Compliance Team' },
    { ruleId: 'RULE-005', name: 'Sanctions List Check', category: 'AML', description: 'Check all parties against OFAC, UN, EU sanctions lists', threshold: 'All parties', enforcement: 'mandatory', status: 'active', lastUpdated: '2024-11-10', updatedBy: 'System Admin' },
    { ruleId: 'RULE-006', name: 'Annual KYC Refresh', category: 'KYC', description: 'Refresh KYC documentation annually', threshold: 'All active tenants', enforcement: 'recommended', status: 'active', lastUpdated: '2024-08-01', updatedBy: 'Compliance Team' }
  ],
  riskAlerts: [
    { alertId: 'RISK-001', type: 'concentration_risk', severity: 'high', title: 'High Concentration in Kenya', description: '75% of deposits concentrated in Kenya', affected: ['bank_001', 'bank_002', 'bank_003', 'bank_004'], status: 'open', createdAt: '2024-12-15' },
    { alertId: 'RISK-002', type: 'currency_risk', severity: 'medium', title: 'JPY Exposure Elevated', description: 'JPY exposure at 68% of portfolio', affected: ['INST-001', 'INST-003'], status: 'monitoring', createdAt: '2024-12-10' },
    { alertId: 'RISK-003', type: 'credit_risk', severity: 'low', title: 'Default Rate Increase', description: 'Default rate increased by 0.3% this month', affected: ['bank_005'], status: 'resolved', createdAt: '2024-12-01' }
  ],
  notifications: [
    { notifId: 'NOTIF-001', type: 'subscription_expiring', title: 'Subscription Expiring Soon', message: 'Access Bank Rwanda subscription expires in 30 days', tenantId: 'bank_008', severity: 'warning', status: 'unread', createdAt: '2024-12-01' },
    { notifId: 'NOTIF-002', type: 'subscription_expired', title: 'Subscription Expired', message: 'Africa Growth Capital subscription has expired', tenantId: 'inv_012', severity: 'critical', status: 'unread', createdAt: '2024-11-16' },
    { notifId: 'NOTIF-003', type: 'feature_request', title: 'Feature Increase Request', message: 'Equity Bank Kenya requested increase in capital calling limit', tenantId: 'bank_001', severity: 'info', status: 'pending', createdAt: '2024-12-20' },
    { notifId: 'NOTIF-004', type: 'cancellation_request', title: 'Subscription Cancellation Request', message: 'Global Impact Fund requested subscription cancellation', tenantId: 'inv_011', severity: 'warning', status: 'pending', createdAt: '2024-11-28' },
    { notifId: 'NOTIF-005', type: 'payment_overdue', title: 'Payment Overdue', message: 'NMB Bank payment overdue by 15 days', tenantId: 'bank_006', severity: 'critical', status: 'unread', createdAt: '2024-12-15' },
    { notifId: 'NOTIF-006', type: 'kyc_expiring', title: 'KYC Documents Expiring', message: 'KCB Bank KYC documents expire in 30 days', tenantId: 'bank_002', severity: 'warning', status: 'unread', createdAt: '2024-12-25' }
  ],
  settings: {
    platformName: 'ForwardsFlow', platformEmail: 'admin@forwardsflow.com', supportEmail: 'support@forwardsflow.com',
    defaultCurrency: 'USD', supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'KES'],
    defaultPlatformFee: 0.5, defaultHedgingFee: 1.0, kycExpiryDays: 365, amlScreeningInterval: 90,
    maxCapitalCallingLimit: 500000000, minInvestmentAmount: 1000000,
    subscriptionTiers: [
      { name: 'starter', monthlyFee: 2500, features: ['5 users', 'Basic reporting', 'Email support'] },
      { name: 'professional', monthlyFee: 7500, features: ['25 users', 'Advanced reporting', 'Priority support', 'API access'] },
      { name: 'enterprise', monthlyFee: 15000, features: ['Unlimited users', 'Custom reporting', '24/7 support', 'Full API access', 'Dedicated account manager'] }
    ],
    maintenanceMode: false, lastBackup: '2024-12-30T02:00:00Z'
  },
  pnl: {
    revenue: { platformFees: 1850000, hedgingFees: 420000, subscriptionFees: 180000, totalRevenue: 2450000 },
    expenses: { operations: 450000, technology: 280000, compliance: 120000, marketing: 95000, totalExpenses: 945000 },
    netIncome: 1505000,
    monthlyTrend: [
      { month: 'Jul', revenue: 320000, expenses: 145000, profit: 175000, transactions: 18 },
      { month: 'Aug', revenue: 380000, expenses: 152000, profit: 228000, transactions: 22 },
      { month: 'Sep', revenue: 420000, expenses: 158000, profit: 262000, transactions: 28 },
      { month: 'Oct', revenue: 465000, expenses: 165000, profit: 300000, transactions: 31 },
      { month: 'Nov', revenue: 510000, expenses: 172000, profit: 338000, transactions: 35 },
      { month: 'Dec', revenue: 355000, expenses: 153000, profit: 202000, transactions: 22 }
    ]
  },
  analytics: {
    userGrowth: [
      { month: 'Jul', banks: 5, investors: 6, users: 95 },
      { month: 'Aug', banks: 6, investors: 7, users: 115 },
      { month: 'Sep', banks: 6, investors: 8, users: 135 },
      { month: 'Oct', banks: 7, investors: 10, users: 158 },
      { month: 'Nov', banks: 8, investors: 11, users: 175 },
      { month: 'Dec', banks: 8, investors: 12, users: 186 }
    ],
    transactionVolume: [
      { month: 'Jul', volume: 85000000, count: 18 },
      { month: 'Aug', volume: 112000000, count: 22 },
      { month: 'Sep', volume: 145000000, count: 28 },
      { month: 'Oct', volume: 178000000, count: 31 },
      { month: 'Nov', volume: 210000000, count: 35 },
      { month: 'Dec', volume: 155000000, count: 22 }
    ],
    geographicDistribution: [
      { country: 'Kenya', banks: 4, investors: 0, volume: 320000000 },
      { country: 'Tanzania', banks: 2, investors: 0, volume: 45000000 },
      { country: 'Uganda', banks: 1, investors: 0, volume: 12000000 },
      { country: 'Rwanda', banks: 1, investors: 0, volume: 8000000 },
      { country: 'USA', banks: 0, investors: 3, volume: 202000000 },
      { country: 'UK', banks: 0, investors: 2, volume: 95000000 },
      { country: 'Netherlands', banks: 0, investors: 3, volume: 55000000 },
      { country: 'Switzerland', banks: 0, investors: 2, volume: 70000000 },
      { country: 'Norway', banks: 0, investors: 1, volume: 78000000 }
    ]
  }
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizeClasses = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white rounded-xl shadow-xl ${sizeClasses[size]} w-full mx-4 max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ title, value, icon: Icon, color, trend, subtitle, onClick }) => {
  const colorClasses = {
    red: 'bg-red-100 text-red-600', blue: 'bg-blue-100 text-blue-600', green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600', amber: 'bg-amber-100 text-amber-600', emerald: 'bg-emerald-100 text-emerald-600'
  };
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 border border-gray-100 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`} onClick={onClick}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{Math.abs(trend)}% vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.blue}`}><Icon className="w-6 h-6" /></div>
      </div>
    </div>
  );
};

// Main Platform Admin Dashboard Component
const PlatformAdminDashboard = () => {
  const { user, tenant } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Data state from universal database
  const [metrics, setMetrics] = useState(SAMPLE_DATABASE.platformMetrics);
  const [banks, setBanks] = useState(SAMPLE_DATABASE.banks);
  const [investors, setInvestors] = useState(SAMPLE_DATABASE.investors);
  const [users, setUsers] = useState(SAMPLE_DATABASE.users);
  const [transactions, setTransactions] = useState(SAMPLE_DATABASE.transactions);
  const [instruments, setInstruments] = useState(SAMPLE_DATABASE.instruments);
  const [complianceRules, setComplianceRules] = useState(SAMPLE_DATABASE.complianceRules);
  const [riskAlerts, setRiskAlerts] = useState(SAMPLE_DATABASE.riskAlerts);
  const [notifications, setNotifications] = useState(SAMPLE_DATABASE.notifications);
  const [platformSettings, setPlatformSettings] = useState(SAMPLE_DATABASE.settings);
  const [pnlData, setPnlData] = useState(SAMPLE_DATABASE.pnl);
  const [analyticsData, setAnalyticsData] = useState(SAMPLE_DATABASE.analytics);

  // Modal states
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [showEditBankModal, setShowEditBankModal] = useState(false);
  const [showAddInvestorModal, setShowAddInvestorModal] = useState(false);
  const [showEditInvestorModal, setShowEditInvestorModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showInstrumentModal, setShowInstrumentModal] = useState(false);
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [showEditRuleModal, setShowEditRuleModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form states
  const [tenantForm, setTenantForm] = useState({ type: 'bank', name: '', email: '', phone: '', country: 'Kenya', capitalCallingLimit: 50000000, subscriptionTier: 'starter' });
  const [bankForm, setBankForm] = useState({ name: '', email: '', phone: '', country: 'Kenya', capitalCallingLimit: 50000000, subscriptionTier: 'starter' });
  const [investorForm, setInvestorForm] = useState({ name: '', email: '', phone: '', country: 'USA', subscriptionTier: 'starter', riskProfile: 'moderate' });
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'bank_admin', tenantId: '' });
  const [ruleForm, setRuleForm] = useState({ name: '', category: 'KYC', threshold: '', enforcement: 'mandatory' });
  const [settingsForm, setSettingsForm] = useState({ ...SAMPLE_DATABASE.settings });

  // Recalculate metrics from data
  const recalculateMetrics = () => {
    const activeBanks = banks.filter(b => b.status === 'active').length;
    const activeInvestors = investors.filter(i => i.status === 'active').length;
    const totalDeposits = banks.reduce((sum, b) => sum + (b.totalDeposits || 0), 0);
    const totalRevenue = banks.reduce((sum, b) => sum + (b.revenueToDate || 0), 0) + investors.reduce((sum, i) => sum + (i.revenueToDate || 0), 0);
    const activeInstruments = instruments.filter(i => i.status === 'active').length;
    setMetrics(prev => ({
      ...prev, totalBanks: banks.length, activeBanks, totalInvestors: investors.length, activeInvestors,
      totalUsers: users.length, activeUsers: users.filter(u => u.status === 'active').length,
      totalDepositsRaised: totalDeposits, platformRevenue: totalRevenue, totalInstruments: instruments.length, activeInstruments
    }));
  };

  useEffect(() => { recalculateMetrics(); }, [banks, investors, users, instruments]);

  const loadData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true); else setLoading(true);
    try { await new Promise(resolve => setTimeout(resolve, 500)); } catch (error) { console.error('Error loading platform data:', error); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { loadData(); }, []);

  // TENANT MANAGEMENT
  const handleAddTenant = (e) => {
    e.preventDefault();
    if (tenantForm.type === 'bank') {
      const newBank = { tenantId: `bank_${Date.now()}`, name: tenantForm.name, email: tenantForm.email, phone: tenantForm.phone, country: tenantForm.country, capitalCallingLimit: tenantForm.capitalCallingLimit, status: 'pending', totalDeposits: 0, loansDisbursed: 0, revenueToDate: 0, joinedDate: new Date().toISOString().split('T')[0], usersCount: 0, subscriptionTier: tenantForm.subscriptionTier, subscriptionStatus: 'pending', subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] };
      setBanks([...banks, newBank]);
    } else {
      const newInvestor = { tenantId: `inv_${Date.now()}`, name: tenantForm.name, email: tenantForm.email, phone: tenantForm.phone, country: tenantForm.country, status: 'pending', totalInvested: 0, activeDeposits: 0, revenueToDate: 0, joinedDate: new Date().toISOString().split('T')[0], usersCount: 0, subscriptionTier: tenantForm.subscriptionTier, subscriptionStatus: 'pending', subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], riskProfile: 'moderate' };
      setInvestors([...investors, newInvestor]);
    }
    setShowAddTenantModal(false);
    setTenantForm({ type: 'bank', name: '', email: '', phone: '', country: 'Kenya', capitalCallingLimit: 50000000, subscriptionTier: 'starter' });
  };

  // BANK MANAGEMENT
  const handleAddBank = (e) => { e.preventDefault(); const newBank = { tenantId: `bank_${Date.now()}`, ...bankForm, status: 'pending', totalDeposits: 0, loansDisbursed: 0, revenueToDate: 0, joinedDate: new Date().toISOString().split('T')[0], usersCount: 0, subscriptionStatus: 'pending', subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }; setBanks([...banks, newBank]); setShowAddBankModal(false); setBankForm({ name: '', email: '', phone: '', country: 'Kenya', capitalCallingLimit: 50000000, subscriptionTier: 'starter' }); };
  const handleEditBank = (e) => { e.preventDefault(); setBanks(banks.map(b => b.tenantId === selectedItem.tenantId ? { ...b, ...bankForm } : b)); setShowEditBankModal(false); setSelectedItem(null); };
  const handleSuspendBank = (bank) => { const newStatus = bank.status === 'suspended' ? 'active' : 'suspended'; setBanks(banks.map(b => b.tenantId === bank.tenantId ? { ...b, status: newStatus } : b)); };
  const handleDeleteBank = (bank) => { if (window.confirm(`Delete ${bank.name}?`)) { setBanks(banks.filter(b => b.tenantId !== bank.tenantId)); } };
  const openEditBank = (bank) => { setSelectedItem(bank); setBankForm({ name: bank.name, email: bank.email, phone: bank.phone || '', country: bank.country, capitalCallingLimit: bank.capitalCallingLimit, subscriptionTier: bank.subscriptionTier }); setShowEditBankModal(true); };

  // INVESTOR MANAGEMENT
  const handleAddInvestor = (e) => { e.preventDefault(); const newInvestor = { tenantId: `inv_${Date.now()}`, ...investorForm, status: 'pending', totalInvested: 0, activeDeposits: 0, revenueToDate: 0, joinedDate: new Date().toISOString().split('T')[0], usersCount: 0, subscriptionStatus: 'pending', subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }; setInvestors([...investors, newInvestor]); setShowAddInvestorModal(false); setInvestorForm({ name: '', email: '', phone: '', country: 'USA', subscriptionTier: 'starter', riskProfile: 'moderate' }); };
  const handleEditInvestor = (e) => { e.preventDefault(); setInvestors(investors.map(i => i.tenantId === selectedItem.tenantId ? { ...i, ...investorForm } : i)); setShowEditInvestorModal(false); setSelectedItem(null); };
  const handleSuspendInvestor = (investor) => { const newStatus = investor.status === 'suspended' ? 'active' : 'suspended'; setInvestors(investors.map(i => i.tenantId === investor.tenantId ? { ...i, status: newStatus } : i)); };
  const handleDeleteInvestor = (investor) => { if (window.confirm(`Delete ${investor.name}?`)) { setInvestors(investors.filter(i => i.tenantId !== investor.tenantId)); } };
  const openEditInvestor = (investor) => { setSelectedItem(investor); setInvestorForm({ name: investor.name, email: investor.email, phone: investor.phone || '', country: investor.country, subscriptionTier: investor.subscriptionTier, riskProfile: investor.riskProfile }); setShowEditInvestorModal(true); };

  // USER MANAGEMENT
  const handleAddUser = (e) => { e.preventDefault(); const tenant = [...banks, ...investors].find(t => t.tenantId === userForm.tenantId); const newUser = { userId: `user_${Date.now()}`, ...userForm, tenantName: tenant?.name || 'ForwardsFlow', status: 'active', lastLogin: null, createdAt: new Date().toISOString().split('T')[0] }; setUsers([...users, newUser]); setShowAddUserModal(false); setUserForm({ name: '', email: '', role: 'bank_admin', tenantId: '' }); };
  const handleEditUser = (e) => { e.preventDefault(); setUsers(users.map(u => u.userId === selectedItem.userId ? { ...u, ...userForm } : u)); setShowEditUserModal(false); setSelectedItem(null); };
  const handleSuspendUser = (userItem) => { const newStatus = userItem.status === 'suspended' ? 'active' : 'suspended'; setUsers(users.map(u => u.userId === userItem.userId ? { ...u, status: newStatus } : u)); };
  const handleDeleteUser = (userItem) => { if (window.confirm(`Delete user ${userItem.name}?`)) { setUsers(users.filter(u => u.userId !== userItem.userId)); } };
  const openEditUser = (userItem) => { setSelectedItem(userItem); setUserForm({ name: userItem.name, email: userItem.email, role: userItem.role, tenantId: userItem.tenantId }); setShowEditUserModal(true); };

  // INSTRUMENT MANAGEMENT
  const handleSuspendInstrument = (instrument) => { const newStatus = instrument.status === 'suspended' ? 'active' : 'suspended'; setInstruments(instruments.map(i => i.instrumentId === instrument.instrumentId ? { ...i, status: newStatus } : i)); };
  const handleCancelInstrument = (instrument) => { if (window.confirm(`Cancel instrument ${instrument.name}?`)) { setInstruments(instruments.map(i => i.instrumentId === instrument.instrumentId ? { ...i, status: 'cancelled' } : i)); } };
  const openInstrumentDetails = (instrument) => { setSelectedItem(instrument); setShowInstrumentModal(true); };

  // COMPLIANCE MANAGEMENT
  const handleAddRule = (e) => { e.preventDefault(); const newRule = { ruleId: `RULE-${String(complianceRules.length + 1).padStart(3, '0')}`, ...ruleForm, description: '', status: 'active', lastUpdated: new Date().toISOString().split('T')[0], updatedBy: user?.name || 'Admin' }; setComplianceRules([...complianceRules, newRule]); setShowAddRuleModal(false); setRuleForm({ name: '', category: 'KYC', threshold: '', enforcement: 'mandatory' }); };
  const handleEditRule = (e) => { e.preventDefault(); setComplianceRules(complianceRules.map(r => r.ruleId === selectedItem.ruleId ? { ...r, ...ruleForm, lastUpdated: new Date().toISOString().split('T')[0] } : r)); setShowEditRuleModal(false); setSelectedItem(null); };
  const handleSuspendRule = (rule) => { const newStatus = rule.status === 'suspended' ? 'active' : 'suspended'; setComplianceRules(complianceRules.map(r => r.ruleId === rule.ruleId ? { ...r, status: newStatus } : r)); };
  const handleDeleteRule = (rule) => { if (window.confirm(`Delete rule "${rule.name}"?`)) { setComplianceRules(complianceRules.filter(r => r.ruleId !== rule.ruleId)); } };
  const openEditRule = (rule) => { setSelectedItem(rule); setRuleForm({ name: rule.name, category: rule.category, threshold: rule.threshold, enforcement: rule.enforcement }); setShowEditRuleModal(true); };

  // NOTIFICATION MANAGEMENT
  const handleMarkNotificationRead = (notif) => { setNotifications(notifications.map(n => n.notifId === notif.notifId ? { ...n, status: 'read' } : n)); };
  const handleResolveNotification = (notif) => { setNotifications(notifications.map(n => n.notifId === notif.notifId ? { ...n, status: 'resolved' } : n)); };
  const handleDismissNotification = (notif) => { setNotifications(notifications.filter(n => n.notifId !== notif.notifId)); };

  // SETTINGS MANAGEMENT
  const handleSaveSettings = (e) => { e.preventDefault(); setPlatformSettings(settingsForm); setShowSettingsModal(false); alert('Settings saved!'); };

  // RISK MANAGEMENT
  const handleResolveRisk = (alert) => { setRiskAlerts(riskAlerts.map(r => r.alertId === alert.alertId ? { ...r, status: 'resolved' } : r)); };
  const handleEscalateRisk = (alert) => { setRiskAlerts(riskAlerts.map(r => r.alertId === alert.alertId ? { ...r, severity: 'critical', status: 'escalated' } : r)); };

  // Filter functions
  const filteredBanks = banks.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.country.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredInvestors = investors.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.country.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));
  const unreadNotifications = notifications.filter(n => n.status === 'unread' || n.status === 'pending');

  if (loading) {
    return (<div className="flex items-center justify-center min-h-[60vh]"><div className="text-center"><div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div><p className="text-gray-600 mt-4">Loading platform data...</p></div></div>);
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2"><Globe className="w-6 h-6" /><span className="text-red-200 text-sm font-medium">PLATFORM ADMINISTRATION</span></div>
            <h1 className="text-2xl font-bold">ForwardsFlow Platform</h1>
            <p className="text-red-100 mt-1">Managing {metrics.totalBanks} banks, {metrics.totalInvestors} investors, {metrics.totalUsers} users</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-red-200">Platform Revenue (YTD)</p>
            <p className="text-3xl font-bold">${(metrics.platformRevenue / 1000000).toFixed(2)}M</p>
            {unreadNotifications.length > 0 && (<div className="mt-2 flex items-center justify-end gap-2"><Bell className="w-4 h-4" /><span className="bg-white text-red-600 px-2 py-0.5 rounded-full text-xs font-bold">{unreadNotifications.length} alerts</span></div>)}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 shadow-sm overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'banks', label: 'Banks', icon: Building2 },
          { id: 'investors', label: 'Investors', icon: Landmark },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'transactions', label: 'Transactions', icon: CreditCard },
          { id: 'pnl', label: 'P&L', icon: DollarSign },
          { id: 'instruments', label: 'Instruments', icon: FileText },
          { id: 'compliance', label: 'Compliance', icon: Shield },
          { id: 'risk', label: 'Risk', icon: AlertTriangle },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${activeTab === tab.id ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            <tab.icon className="w-4 h-4" />{tab.label}
            {tab.id === 'notifications' && unreadNotifications.length > 0 && (<span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white text-red-600' : 'bg-red-600 text-white'}`}>{unreadNotifications.length}</span>)}
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={() => loadData(true)} disabled={refreshing} className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"><RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /></button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => setShowAddTenantModal(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"><Plus className="w-4 h-4" />Add Tenant</button>
            <button onClick={() => setShowAddUserModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><UserCheck className="w-4 h-4" />Add User</button>
            <button onClick={() => setActiveTab('notifications')} className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"><Bell className="w-4 h-4" />View Alerts ({unreadNotifications.length})</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Partner Banks" value={metrics.totalBanks} icon={Building2} color="purple" subtitle={`${metrics.activeBanks} active`} trend={12} onClick={() => setActiveTab('banks')} />
            <StatCard title="Impact Investors" value={metrics.totalInvestors} icon={Landmark} color="emerald" subtitle={`${metrics.activeInvestors} active`} trend={8} onClick={() => setActiveTab('investors')} />
            <StatCard title="Total Users" value={metrics.totalUsers} icon={Users} color="blue" subtitle={`${metrics.activeUsers} active`} trend={15} onClick={() => setActiveTab('users')} />
            <StatCard title="Platform Revenue" value={`$${(metrics.platformRevenue / 1000000).toFixed(2)}M`} icon={DollarSign} color="green" trend={22} onClick={() => setActiveTab('pnl')} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Growth</h3>
              <ResponsiveContainer width="100%" height={280}><AreaChart data={analyticsData.userGrowth}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="users" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} name="Total Users" /><Area type="monotone" dataKey="banks" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} name="Banks" /><Area type="monotone" dataKey="investors" stroke="#10B981" fill="#10B981" fillOpacity={0.2} name="Investors" /></AreaChart></ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={280}><ComposedChart data={pnlData.monthlyTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis yAxisId="left" tickFormatter={(v) => `$${v/1000}K`} /><YAxis yAxisId="right" orientation="right" /><Tooltip formatter={(v, n) => n === 'transactions' ? v : `$${v.toLocaleString()}`} /><Legend /><Bar yAxisId="left" dataKey="revenue" fill="#10B981" name="Revenue" /><Bar yAxisId="left" dataKey="profit" fill="#3B82F6" name="Profit" /><Line yAxisId="right" type="monotone" dataKey="transactions" stroke="#EF4444" name="Transactions" /></ComposedChart></ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-100"><FileText className="w-5 h-5 text-blue-600" /></div><div><p className="text-sm text-gray-500">Active Instruments</p><p className="text-xl font-bold text-gray-900">{metrics.activeInstruments}</p></div></div></div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-green-100"><CreditCard className="w-5 h-5 text-green-600" /></div><div><p className="text-sm text-gray-500">Transactions (MTD)</p><p className="text-xl font-bold text-gray-900">{transactions.length}</p></div></div></div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-100"><AlertTriangle className="w-5 h-5 text-amber-600" /></div><div><p className="text-sm text-gray-500">Open Risk Alerts</p><p className="text-xl font-bold text-gray-900">{riskAlerts.filter(r => r.status !== 'resolved').length}</p></div></div></div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-purple-100"><Shield className="w-5 h-5 text-purple-600" /></div><div><p className="text-sm text-gray-500">Compliance Rules</p><p className="text-xl font-bold text-gray-900">{complianceRules.filter(r => r.status === 'active').length}</p></div></div></div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Notifications</h3>
            <div className="space-y-3">
              {notifications.slice(0, 5).map(notif => (
                <div key={notif.notifId} className={`flex items-center gap-4 p-3 rounded-lg ${notif.severity === 'critical' ? 'bg-red-50' : notif.severity === 'warning' ? 'bg-amber-50' : 'bg-blue-50'}`}>
                  <div className={`p-2 rounded-full ${notif.severity === 'critical' ? 'bg-red-100' : notif.severity === 'warning' ? 'bg-amber-100' : 'bg-blue-100'}`}>
                    {notif.severity === 'critical' ? <AlertOctagon className="w-4 h-4 text-red-600" /> : notif.severity === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-600" /> : <Info className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="flex-1"><p className="font-medium text-gray-900">{notif.title}</p><p className="text-sm text-gray-600">{notif.message}</p></div>
                  <span className="text-xs text-gray-500">{notif.createdAt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BANKS TAB */}
      {activeTab === 'banks' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h3 className="text-lg font-semibold text-gray-900">Partner Banks ({banks.length})</h3>
              <div className="flex items-center gap-3">
                <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search banks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-64" /></div>
                <button onClick={() => setShowAddBankModal(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"><Plus className="w-4 h-4" />Add Bank</button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capital Limit</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deposits</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscription</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBanks.map(bank => (
                  <tr key={bank.tenantId} className="hover:bg-gray-50">
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center"><Building2 className="w-5 h-5 text-purple-600" /></div><div><p className="font-medium text-gray-900">{bank.name}</p><p className="text-xs text-gray-500">{bank.email}</p></div></div></td>
                    <td className="px-4 py-3 text-gray-600">{bank.country}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${bank.status === 'active' ? 'bg-green-100 text-green-700' : bank.status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{bank.status}</span></td>
                    <td className="px-4 py-3 text-gray-600">¥{(bank.capitalCallingLimit / 1000000).toFixed(0)}M</td>
                    <td className="px-4 py-3 font-medium text-gray-900">¥{(bank.totalDeposits / 1000000).toFixed(0)}M</td>
                    <td className="px-4 py-3 text-green-600 font-medium">${bank.revenueToDate.toLocaleString()}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${bank.subscriptionStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{bank.subscriptionTier}</span></td>
                    <td className="px-4 py-3"><div className="flex items-center gap-1"><button onClick={() => openEditBank(bank)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button><button onClick={() => handleSuspendBank(bank)} className={`p-1.5 rounded-lg ${bank.status === 'suspended' ? 'text-green-600 hover:bg-green-50' : 'text-amber-600 hover:bg-amber-50'}`}><Ban className="w-4 h-4" /></button><button onClick={() => handleDeleteBank(bank)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INVESTORS TAB */}
      {activeTab === 'investors' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100"><div className="flex items-center justify-between flex-wrap gap-4"><h3 className="text-lg font-semibold text-gray-900">Impact Investors ({investors.length})</h3><div className="flex items-center gap-3"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search investors..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-64" /></div><button onClick={() => setShowAddInvestorModal(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"><Plus className="w-4 h-4" />Add Investor</button></div></div></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investor</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Profile</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Invested</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscription</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInvestors.map(investor => (
                  <tr key={investor.tenantId} className="hover:bg-gray-50">
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center"><Landmark className="w-5 h-5 text-emerald-600" /></div><div><p className="font-medium text-gray-900">{investor.name}</p><p className="text-xs text-gray-500">{investor.email}</p></div></div></td>
                    <td className="px-4 py-3 text-gray-600">{investor.country}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${investor.status === 'active' ? 'bg-green-100 text-green-700' : investor.status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{investor.status}</span></td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${investor.riskProfile === 'conservative' ? 'bg-blue-100 text-blue-700' : investor.riskProfile === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{investor.riskProfile}</span></td>
                    <td className="px-4 py-3 font-medium text-gray-900">${(investor.totalInvested / 1000000).toFixed(0)}M</td>
                    <td className="px-4 py-3 text-green-600 font-medium">${investor.revenueToDate.toLocaleString()}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${investor.subscriptionStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{investor.subscriptionTier}</span></td>
                    <td className="px-4 py-3"><div className="flex items-center gap-1"><button onClick={() => openEditInvestor(investor)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button><button onClick={() => handleSuspendInvestor(investor)} className={`p-1.5 rounded-lg ${investor.status === 'suspended' ? 'text-green-600 hover:bg-green-50' : 'text-amber-600 hover:bg-amber-50'}`}><Ban className="w-4 h-4" /></button><button onClick={() => handleDeleteInvestor(investor)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100"><div className="flex items-center justify-between flex-wrap gap-4"><h3 className="text-lg font-semibold text-gray-900">Platform Users ({users.length})</h3><div className="flex items-center gap-3"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-64" /></div><button onClick={() => setShowAddUserModal(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"><Plus className="w-4 h-4" />Add User</button></div></div></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map(userItem => (
                  <tr key={userItem.userId} className="hover:bg-gray-50">
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"><User className="w-5 h-5 text-blue-600" /></div><div><p className="font-medium text-gray-900">{userItem.name}</p><p className="text-xs text-gray-500">{userItem.email}</p></div></div></td>
                    <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">{userItem.role.replace('_', ' ')}</span></td>
                    <td className="px-4 py-3 text-gray-600">{userItem.tenantName}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${userItem.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{userItem.status}</span></td>
                    <td className="px-4 py-3 text-gray-600">{userItem.lastLogin || 'Never'}</td>
                    <td className="px-4 py-3 text-gray-600">{userItem.createdAt}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-1"><button onClick={() => openEditUser(userItem)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button><button onClick={() => handleSuspendUser(userItem)} className={`p-1.5 rounded-lg ${userItem.status === 'suspended' ? 'text-green-600 hover:bg-green-50' : 'text-amber-600 hover:bg-amber-50'}`}><Ban className="w-4 h-4" /></button><button onClick={() => handleDeleteUser(userItem)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TRANSACTIONS TAB */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <StatCard title="Total Transactions" value={transactions.length} icon={CreditCard} color="blue" />
            <StatCard title="Completed" value={transactions.filter(t => t.status === 'completed').length} icon={CheckCircle} color="green" />
            <StatCard title="Pending KYC" value={transactions.filter(t => t.kycStatus === 'pending').length} icon={UserCheck} color="amber" />
            <StatCard title="Pending AML" value={transactions.filter(t => t.amlStatus === 'under_review' || t.amlStatus === 'pending').length} icon={Shield} color="red" />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100"><h3 className="text-lg font-semibold text-gray-900">Transaction Management</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investor</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">KYC</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">AML</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map(txn => (
                    <tr key={txn.txnId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{txn.txnId}</td>
                      <td className="px-4 py-3 text-gray-600">{txn.type}</td>
                      <td className="px-4 py-3 text-gray-600">{txn.bank}</td>
                      <td className="px-4 py-3 text-gray-600">{txn.investor}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">¥{txn.amount.toLocaleString()}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${txn.kycStatus === 'verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{txn.kycStatus}</span></td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${txn.amlStatus === 'cleared' ? 'bg-green-100 text-green-700' : txn.amlStatus === 'under_review' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>{txn.amlStatus.replace('_', ' ')}</span></td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${txn.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{txn.status.replace('_', ' ')}</span></td>
                      <td className="px-4 py-3"><button onClick={() => { setSelectedItem(txn); setShowTransactionModal(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* P&L TAB */}
      {activeTab === 'pnl' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-green-200"><p className="text-sm text-gray-500">Total Revenue</p><p className="text-3xl font-bold text-green-600">${(pnlData.revenue.totalRevenue / 1000000).toFixed(2)}M</p></div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200"><p className="text-sm text-gray-500">Total Expenses</p><p className="text-3xl font-bold text-red-600">${(pnlData.expenses.totalExpenses / 1000).toFixed(0)}K</p></div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-200"><p className="text-sm text-gray-500">Net Income</p><p className="text-3xl font-bold text-blue-600">${(pnlData.netIncome / 1000000).toFixed(2)}M</p></div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-200"><p className="text-sm text-gray-500">Profit Margin</p><p className="text-3xl font-bold text-purple-600">{((pnlData.netIncome / pnlData.revenue.totalRevenue) * 100).toFixed(1)}%</p></div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly P&L Trend</h3>
            <ResponsiveContainer width="100%" height={320}><BarChart data={pnlData.monthlyTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis tickFormatter={(v) => `$${v/1000}K`} /><Tooltip formatter={(v) => `$${v.toLocaleString()}`} /><Legend /><Bar dataKey="revenue" fill="#10B981" name="Revenue" /><Bar dataKey="expenses" fill="#EF4444" name="Expenses" /><Bar dataKey="profit" fill="#3B82F6" name="Profit" /></BarChart></ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"><h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3><div className="space-y-4"><div className="flex justify-between"><span className="text-gray-600">Platform Fees</span><span className="font-semibold text-green-600">${(pnlData.revenue.platformFees / 1000000).toFixed(2)}M</span></div><div className="flex justify-between"><span className="text-gray-600">Hedging Fees</span><span className="font-semibold text-green-600">${(pnlData.revenue.hedgingFees / 1000).toFixed(0)}K</span></div><div className="flex justify-between"><span className="text-gray-600">Subscriptions</span><span className="font-semibold text-green-600">${(pnlData.revenue.subscriptionFees / 1000).toFixed(0)}K</span></div><div className="border-t pt-4 flex justify-between"><span className="font-semibold">Total</span><span className="font-bold text-green-600">${(pnlData.revenue.totalRevenue / 1000000).toFixed(2)}M</span></div></div></div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"><h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3><div className="space-y-4"><div className="flex justify-between"><span className="text-gray-600">Operations</span><span className="font-semibold text-red-600">${(pnlData.expenses.operations / 1000).toFixed(0)}K</span></div><div className="flex justify-between"><span className="text-gray-600">Technology</span><span className="font-semibold text-red-600">${(pnlData.expenses.technology / 1000).toFixed(0)}K</span></div><div className="flex justify-between"><span className="text-gray-600">Compliance</span><span className="font-semibold text-red-600">${(pnlData.expenses.compliance / 1000).toFixed(0)}K</span></div><div className="flex justify-between"><span className="text-gray-600">Marketing</span><span className="font-semibold text-red-600">${(pnlData.expenses.marketing / 1000).toFixed(0)}K</span></div><div className="border-t pt-4 flex justify-between"><span className="font-semibold">Total</span><span className="font-bold text-red-600">${(pnlData.expenses.totalExpenses / 1000).toFixed(0)}K</span></div></div></div>
          </div>
        </div>
      )}

      {/* INSTRUMENTS TAB */}
      {activeTab === 'instruments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <StatCard title="Total Instruments" value={instruments.length} icon={FileText} color="blue" />
            <StatCard title="Active" value={instruments.filter(i => i.status === 'active').length} icon={CheckCircle} color="green" />
            <StatCard title="Suspended" value={instruments.filter(i => i.status === 'suspended').length} icon={Ban} color="amber" />
            <StatCard title="Total Value" value={`¥${(instruments.reduce((s, i) => s + i.totalValue, 0) / 1000000).toFixed(0)}M`} icon={DollarSign} color="purple" />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100"><h3 className="text-lg font-semibold text-gray-900">All Instruments</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instrument</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">KYC</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">AML</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {instruments.map(inst => (
                    <tr key={inst.instrumentId} className="hover:bg-gray-50">
                      <td className="px-4 py-3"><div><p className="font-medium text-gray-900">{inst.name}</p><p className="text-xs text-gray-500">{inst.instrumentId}</p></div></td>
                      <td className="px-4 py-3 text-gray-600">{inst.bankName}</td>
                      <td className="px-4 py-3 text-gray-600 capitalize">{inst.type.replace('_', ' ')}</td>
                      <td className="px-4 py-3 font-medium text-green-600">{inst.interestRate}%</td>
                      <td className="px-4 py-3 text-gray-900">¥{(inst.totalValue / 1000000).toFixed(0)}M</td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${inst.kycVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{inst.kycVerified ? 'Verified' : 'Pending'}</span></td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${inst.amlCleared ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{inst.amlCleared ? 'Cleared' : 'Review'}</span></td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${inst.status === 'active' ? 'bg-green-100 text-green-700' : inst.status === 'suspended' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{inst.status}</span></td>
                      <td className="px-4 py-3"><div className="flex items-center gap-1"><button onClick={() => openInstrumentDetails(inst)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button><button onClick={() => handleSuspendInstrument(inst)} className={`p-1.5 rounded-lg ${inst.status === 'suspended' ? 'text-green-600 hover:bg-green-50' : 'text-amber-600 hover:bg-amber-50'}`}><Ban className="w-4 h-4" /></button><button onClick={() => handleCancelInstrument(inst)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><XSquare className="w-4 h-4" /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* COMPLIANCE TAB */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"><div className="flex items-center gap-3"><div className="p-3 rounded-lg bg-green-100"><CheckCircle className="w-6 h-6 text-green-600" /></div><div><p className="text-sm text-gray-500">KYC Compliance</p><p className="text-2xl font-bold text-gray-900">98.5%</p></div></div></div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"><div className="flex items-center gap-3"><div className="p-3 rounded-lg bg-amber-100"><AlertCircle className="w-6 h-6 text-amber-600" /></div><div><p className="text-sm text-gray-500">AML Alerts</p><p className="text-2xl font-bold text-gray-900">{transactions.filter(t => t.amlStatus === 'under_review').length}</p></div></div></div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"><div className="flex items-center gap-3"><div className="p-3 rounded-lg bg-blue-100"><Shield className="w-6 h-6 text-blue-600" /></div><div><p className="text-sm text-gray-500">Active Rules</p><p className="text-2xl font-bold text-gray-900">{complianceRules.filter(r => r.status === 'active').length}</p></div></div></div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100"><div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-gray-900">Compliance Rules</h3><button onClick={() => setShowAddRuleModal(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"><Plus className="w-4 h-4" />Add Rule</button></div></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rule</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Threshold</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enforcement</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {complianceRules.map(rule => (
                    <tr key={rule.ruleId} className="hover:bg-gray-50">
                      <td className="px-4 py-3"><div><p className="font-medium text-gray-900">{rule.name}</p><p className="text-xs text-gray-500">{rule.ruleId}</p></div></td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${rule.category === 'KYC' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{rule.category}</span></td>
                      <td className="px-4 py-3 text-gray-600">{rule.threshold}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${rule.enforcement === 'mandatory' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{rule.enforcement}</span></td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${rule.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{rule.status}</span></td>
                      <td className="px-4 py-3"><div className="flex items-center gap-1"><button onClick={() => openEditRule(rule)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button><button onClick={() => handleSuspendRule(rule)} className={`p-1.5 rounded-lg ${rule.status === 'suspended' ? 'text-green-600 hover:bg-green-50' : 'text-amber-600 hover:bg-amber-50'}`}><Ban className="w-4 h-4" /></button><button onClick={() => handleDeleteRule(rule)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* RISK TAB */}
      {activeTab === 'risk' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard title="Open Alerts" value={riskAlerts.filter(r => r.status !== 'resolved').length} icon={AlertTriangle} color="amber" />
            <StatCard title="High Severity" value={riskAlerts.filter(r => r.severity === 'high' || r.severity === 'critical').length} icon={AlertOctagon} color="red" />
            <StatCard title="Default Rate" value={`${metrics.defaultRate}%`} icon={TrendingDown} color="red" />
            <StatCard title="Concentration" value="Kenya 75%" icon={Target} color="purple" />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100"><h3 className="text-lg font-semibold text-gray-900">Risk Alerts</h3></div>
            <div className="divide-y divide-gray-100">
              {riskAlerts.map(alert => (
                <div key={alert.alertId} className={`p-4 ${alert.severity === 'high' || alert.severity === 'critical' ? 'bg-red-50' : alert.severity === 'medium' ? 'bg-amber-50' : 'bg-gray-50'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${alert.severity === 'high' || alert.severity === 'critical' ? 'bg-red-100' : alert.severity === 'medium' ? 'bg-amber-100' : 'bg-gray-100'}`}><AlertTriangle className={`w-5 h-5 ${alert.severity === 'high' || alert.severity === 'critical' ? 'text-red-600' : alert.severity === 'medium' ? 'text-amber-600' : 'text-gray-600'}`} /></div>
                      <div>
                        <div className="flex items-center gap-2"><p className="font-medium text-gray-900">{alert.title}</p><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${alert.severity === 'high' || alert.severity === 'critical' ? 'bg-red-100 text-red-700' : alert.severity === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>{alert.severity}</span><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${alert.status === 'resolved' ? 'bg-green-100 text-green-700' : alert.status === 'escalated' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{alert.status}</span></div>
                        <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                        <p className="text-xs text-gray-500 mt-1">Created: {alert.createdAt}</p>
                      </div>
                    </div>
                    {alert.status !== 'resolved' && (<div className="flex items-center gap-2"><button onClick={() => handleResolveRisk(alert)} className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">Resolve</button><button onClick={() => handleEscalateRisk(alert)} className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Escalate</button></div>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"><h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3><ResponsiveContainer width="100%" height={280}><LineChart data={analyticsData.userGrowth}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="users" stroke="#3B82F6" name="Users" /><Line type="monotone" dataKey="banks" stroke="#8B5CF6" name="Banks" /><Line type="monotone" dataKey="investors" stroke="#10B981" name="Investors" /></LineChart></ResponsiveContainer></div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"><h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Volume</h3><ResponsiveContainer width="100%" height={280}><ComposedChart data={analyticsData.transactionVolume}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis yAxisId="left" tickFormatter={(v) => `¥${v/1000000}M`} /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Legend /><Bar yAxisId="left" dataKey="volume" fill="#10B981" name="Volume (¥)" /><Line yAxisId="right" type="monotone" dataKey="count" stroke="#3B82F6" name="Count" /></ComposedChart></ResponsiveContainer></div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"><h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
            <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Banks</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investors</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volume</th></tr></thead><tbody className="divide-y divide-gray-100">{analyticsData.geographicDistribution.map((geo, idx) => (<tr key={idx} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium text-gray-900">{geo.country}</td><td className="px-4 py-3 text-gray-600">{geo.banks}</td><td className="px-4 py-3 text-gray-600">{geo.investors}</td><td className="px-4 py-3 text-gray-900">¥{(geo.volume / 1000000).toFixed(0)}M</td></tr>))}</tbody></table></div>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS TAB */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard title="Unread" value={notifications.filter(n => n.status === 'unread').length} icon={Bell} color="blue" />
            <StatCard title="Pending Action" value={notifications.filter(n => n.status === 'pending').length} icon={Clock} color="amber" />
            <StatCard title="Critical" value={notifications.filter(n => n.severity === 'critical').length} icon={AlertOctagon} color="red" />
            <StatCard title="Total" value={notifications.length} icon={Mail} color="purple" />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100"><h3 className="text-lg font-semibold text-gray-900">All Notifications</h3></div>
            <div className="divide-y divide-gray-100">
              {notifications.map(notif => (
                <div key={notif.notifId} className={`p-4 ${notif.status === 'unread' ? 'bg-blue-50' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${notif.severity === 'critical' ? 'bg-red-100' : notif.severity === 'warning' ? 'bg-amber-100' : 'bg-blue-100'}`}>
                        {notif.type === 'subscription_expiring' || notif.type === 'subscription_expired' ? <Calendar className={`w-5 h-5 ${notif.severity === 'critical' ? 'text-red-600' : 'text-amber-600'}`} /> : notif.type === 'payment_overdue' ? <DollarSign className="w-5 h-5 text-red-600" /> : notif.type === 'feature_request' ? <Zap className="w-5 h-5 text-blue-600" /> : notif.type === 'cancellation_request' ? <XSquare className="w-5 h-5 text-amber-600" /> : <Bell className="w-5 h-5 text-blue-600" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2"><p className="font-medium text-gray-900">{notif.title}</p><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${notif.severity === 'critical' ? 'bg-red-100 text-red-700' : notif.severity === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{notif.severity}</span></div>
                        <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {notif.status === 'unread' && <button onClick={() => handleMarkNotificationRead(notif)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Mark Read</button>}
                      {notif.status === 'pending' && <button onClick={() => handleResolveNotification(notif)} className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">Resolve</button>}
                      <button onClick={() => handleDismissNotification(notif)} className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Dismiss</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><h4 className="font-medium text-gray-900 mb-4">General Settings</h4><div className="space-y-4"><div><label className="block text-sm text-gray-600 mb-1">Platform Name</label><p className="font-medium">{platformSettings.platformName}</p></div><div><label className="block text-sm text-gray-600 mb-1">Admin Email</label><p className="font-medium">{platformSettings.platformEmail}</p></div><div><label className="block text-sm text-gray-600 mb-1">Support Email</label><p className="font-medium">{platformSettings.supportEmail}</p></div><div><label className="block text-sm text-gray-600 mb-1">Default Currency</label><p className="font-medium">{platformSettings.defaultCurrency}</p></div></div></div>
            <div><h4 className="font-medium text-gray-900 mb-4">Fee Settings</h4><div className="space-y-4"><div><label className="block text-sm text-gray-600 mb-1">Default Platform Fee</label><p className="font-medium">{platformSettings.defaultPlatformFee}%</p></div><div><label className="block text-sm text-gray-600 mb-1">Default Hedging Fee</label><p className="font-medium">{platformSettings.defaultHedgingFee}%</p></div><div><label className="block text-sm text-gray-600 mb-1">Max Capital Calling Limit</label><p className="font-medium">¥{(platformSettings.maxCapitalCallingLimit / 1000000).toFixed(0)}M</p></div><div><label className="block text-sm text-gray-600 mb-1">Min Investment Amount</label><p className="font-medium">¥{(platformSettings.minInvestmentAmount / 1000000).toFixed(0)}M</p></div></div></div>
          </div>
          <div className="mt-6 pt-6 border-t"><h4 className="font-medium text-gray-900 mb-4">Subscription Tiers</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {platformSettings.subscriptionTiers.map(tier => (<div key={tier.name} className="border border-gray-200 rounded-lg p-4"><h5 className="font-semibold text-gray-900 capitalize">{tier.name}</h5><p className="text-2xl font-bold text-green-600 mt-2">${tier.monthlyFee.toLocaleString()}<span className="text-sm text-gray-500">/mo</span></p><ul className="mt-3 space-y-1">{tier.features.map((f, i) => <li key={i} className="text-sm text-gray-600 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />{f}</li>)}</ul></div>))}
            </div>
          </div>
          <div className="mt-6 pt-6 border-t"><h4 className="font-medium text-gray-900 mb-4">System Status</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3"><div className={`w-3 h-3 rounded-full ${platformSettings.maintenanceMode ? 'bg-amber-500' : 'bg-green-500'}`} /><span className="text-gray-600">Maintenance Mode: {platformSettings.maintenanceMode ? 'On' : 'Off'}</span></div>
              <div className="flex items-center gap-3"><Database className="w-5 h-5 text-gray-400" /><span className="text-gray-600">Last Backup: {new Date(platformSettings.lastBackup).toLocaleString()}</span></div>
              <button onClick={() => { setSettingsForm({ ...platformSettings }); setShowSettingsModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"><Settings className="w-4 h-4" />Edit Settings</button>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      
      {/* Add Tenant Modal */}
      <Modal isOpen={showAddTenantModal} onClose={() => setShowAddTenantModal(false)} title="Add New Tenant">
        <form onSubmit={handleAddTenant}>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Tenant Type *</label><select value={tenantForm.type} onChange={(e) => setTenantForm({...tenantForm, type: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"><option value="bank">Bank</option><option value="investor">Impact Investor</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input type="text" value={tenantForm.name} onChange={(e) => setTenantForm({...tenantForm, name: e.target.value})} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" value={tenantForm.email} onChange={(e) => setTenantForm({...tenantForm, email: e.target.value})} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="tel" value={tenantForm.phone} onChange={(e) => setTenantForm({...tenantForm, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Country *</label><select value={tenantForm.country} onChange={(e) => setTenantForm({...tenantForm, country: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"><option value="Kenya">Kenya</option><option value="Tanzania">Tanzania</option><option value="Uganda">Uganda</option><option value="Rwanda">Rwanda</option><option value="USA">USA</option><option value="UK">UK</option><option value="Netherlands">Netherlands</option><option value="Switzerland">Switzerland</option><option value="Norway">Norway</option></select></div>
            {tenantForm.type === 'bank' && (<div><label className="block text-sm font-medium text-gray-700 mb-1">Capital Calling Limit (¥) *</label><input type="number" value={tenantForm.capitalCallingLimit} onChange={(e) => setTenantForm({...tenantForm, capitalCallingLimit: parseInt(e.target.value)})} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>)}
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Subscription Tier *</label><select value={tenantForm.subscriptionTier} onChange={(e) => setTenantForm({...tenantForm, subscriptionTier: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"><option value="starter">Starter ($2,500/mo)</option><option value="professional">Professional ($7,500/mo)</option><option value="enterprise">Enterprise ($15,000/mo)</option></select></div>
            <div className="flex gap-3 pt-4"><button type="button" onClick={() => setShowAddTenantModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Add Tenant</button></div>
          </div>
        </form>
      </Modal>

      {/* Add Bank Modal */}
      <Modal isOpen={showAddBankModal} onClose={() => setShowAddBankModal(false)} title="Add New Bank">
        <form onSubmit={handleAddBank}>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label><input type="text" value={bankForm.name} onChange={(e) => setBankForm({...bankForm, name: e.target.value})} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" value={bankForm.email} onChange={(e) => setBankForm({...bankForm, email: e.target.value})} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="tel" value={bankForm.phone} onChange={(e) => setBankForm({...bankForm, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Country *</label><select value={bankForm.country} onChange={(e) => setBankForm({...bankForm, country: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"><option value="Kenya">Kenya</option><option value="Tanzania">Tanzania</option><option value="Uganda">Uganda</option><option value="Rwanda">Rwanda</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Capital Calling Limit (¥) *</label><input type="number" value={bankForm.capitalCallingLimit} onChange={(e) => setBankForm({...bankForm, capitalCallingLimit: parseInt(e.target.value)})} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Subscription Tier *</label><select value={bankForm.subscriptionTier} onChange={(e) => setBankForm({...bankForm, subscriptionTier: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"><option value="starter">Starter</option><option value="professional">Professional</option><option value="enterprise">Enterprise</option></select></div>
            <div className="flex gap-3 pt-4"><button type="button" onClick={() => setShowAddBankModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Add Bank</button></div>
          </div>
        </form>
      </Modal>

      {/* Edit Bank Modal */}
      <Modal isOpen={showEditBankModal} onClose={() => { setShowEditBankModal(false); setSelectedItem(null); }} title="Edit Bank">
        <form onSubmit={handleEditBank}>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label><input type="text" value={bankForm.name} onChange={(e) => setBankForm({...bankForm, name: e.target.value})} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" value={bankForm.email} onChange={(e) => setBankForm({...bankForm, email: e.target.value})} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="tel" value={bankForm.phone} onChange={(e) => setBankForm({...bankForm, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Country *</label><select value={bankForm.country} onChange={(e) => setBankForm({...bankForm, country: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"><option value="Kenya">Kenya</option><option value="Tanzania">Tanzania</option><option value="Uganda">Uganda</option><option value="Rwanda">Rwanda</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Capital Calling Limit (¥) *</label><input type="number" value={bankForm.capitalCallingLimit} onChange={(e) => setBankForm({...bankForm, capitalCallingLimit: parseInt(e.target.value)})} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Subscription Tier *</label><select value={bankForm.subscriptionTier} onChange={(e) => setBankForm({...bankForm, subscriptionTier: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"><option value="starter">Starter</option><option value="professional">Professional</option><option value="enterprise">Enterprise</option></select></div>
            <div className="flex gap-3 pt-4"><button type="button" onClick={() => { setShowEditBankModal(false); setSelectedItem(null); }} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Save Changes</button></div>
          </div>
        </form>
      </Modal>

      {/* Add Investor Modal */}
      <Modal isOpen={showAddInvestorModal} onClose={() => setShowAddInvestorModal(false)} title="Add New Investor">
        <form onSubmit={handleAddInvestor}>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Investor Name *</label><input type="text" value={investorForm.name} onChange={(e) => setInvestorForm({...investorForm, name: e.target.value})} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" value={investorForm.email} onChange={(e) => setInvestorForm({...investorForm, email: e.target.value})} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="tel" value={investorForm.phone} onChange={(e) => setInvestorForm({...investorForm, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Country *</label><select value={investorForm.country} onChange={(e) => setInvestorForm({...investorForm, country: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"><option value="USA">USA</option><option value="UK">UK</option><option value="Netherlands">Netherlands</option><option value="Switzerland">Switzerland</option><option value="Norway">Norway</option><option value="Japan">Japan</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Risk Profile *</label><select value={investorForm.riskProfile} onChange={(e) => setInvestorForm({...investorForm, riskProfile: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"><option value="conservative">Conservative</option><option value="moderate">Moderate</option><option value="aggressive">Aggressive</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Subscription Tier *</label><select value={investorForm.subscriptionTier} onChange={(e) => setInvestorForm({...investorForm, subscriptionTier: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"><option value="starter">Starter</option><option value="professional">Professional</option><option value="enterprise">Enterprise</option></select></div>
            <div className="flex gap-3 pt-4"><button type="button" onClick={() => setShowAddInvestorModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Add Investor</button></div>
          </div>
        </form>
      </Modal>

      {/* Edit Investor Modal */}
      <Modal isOpen={showEditInvestorModal} onClose={() => { setShowEditInvestorModal(false); setSelectedItem(null); }} title="Edit Investor">
        <form onSubmit={handleEditInvestor}>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Investor Name *</label><input type="text" value={investorForm.name} onChange={(e) => setInvestorForm({...investorForm, name: e.target.value})} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" value={investorForm.email} onChange={(e) => setInvestorForm({...investorForm, email: e.target.value})} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="tel" value={investorForm.phone} onChange={(e) => setInvestorForm({...investorForm, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Country *</label><select value={investorForm.country} onChange={(e) => setInvestorForm({...investorForm, country: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"><option value="USA">USA</option><option value="UK">UK</option><option value="Netherlands">Netherlands</option><option value="Switzerland">Switzerland</option><option value="Norway">Norway</option><option value="Japan">Japan</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Risk Profile *</label><select value={investorForm.riskProfile} onChange={(e) => setInvestorForm({...investorForm, riskProfile: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"><option value="conservative">Conservative</option><option value="moderate">Moderate</option><option value="aggressive">Aggressive</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Subscription Tier *</label><select value={investorForm.subscriptionTier} onChange={(e) => setInvestorForm({...investorForm, subscriptionTier: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"><option value="starter">Starter</option><option value="professional">Professional</option><option value="enterprise">Enterprise</option></select></div>
            <div className="flex gap-3 pt-4"><button type="button" onClick={() => { setShowEditInvestorModal(false); setSelectedItem(null); }} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Save Changes</button></div>
          </div>
        </form>
      </Modal>

      {/* Add User Modal */}
      <Modal isOpen={showAddUserModal} onClose={() => setShowAddUserModal(false)} title="Add New User">
        <form onSubmit={handleAddUser}>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input type="text" value={userForm.name} onChange={(e) => setUserForm({...userForm, name: e.target.value})} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" value={userForm.email} onChange={(e) => setUserForm({...userForm, email: e.target.value})} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Role *</label><select value={userForm.role} onChange={(e) => setUserForm({...userForm, role: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"><option value="bank_admin">Bank Admin</option><option value="bank_lender">Bank Lender</option><option value="bank_compliance">Bank Compliance</option><option value="bank_risk">Bank Risk</option><option value="investor_admin">Investor Admin</option><option value="investor_analyst">Investor Analyst</option><option value="super_admin">Super Admin</option><option value="platform_support">Platform Support</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Tenant *</label><select value={userForm.tenantId} onChange={(e) => setUserForm({...userForm, tenantId: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"><option value="">Select Tenant</option><option value="platform">ForwardsFlow (Platform)</option><optgroup label="Banks">{banks.map(b => <option key={b.tenantId} value={b.tenantId}>{b.name}</option>)}</optgroup><optgroup label="Investors">{investors.map(i => <option key={i.tenantId} value={i.tenantId}>{i.name}</option>)}</optgroup></select></div>
            <div className="flex gap-3 pt-4"><button type="button" onClick={() => setShowAddUserModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Add User</button></div>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={showEditUserModal} onClose={() => { setShowEditUserModal(false); setSelectedItem(null); }} title="Edit User">
        <form onSubmit={handleEditUser}>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input type="text" value={userForm.name} onChange={(e) => setUserForm({...userForm, name: e.target.value})} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" value={userForm.email} onChange={(e) => setUserForm({...userForm, email: e.target.value})} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Role *</label><select value={userForm.role} onChange={(e) => setUserForm({...userForm, role: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"><option value="bank_admin">Bank Admin</option><option value="bank_lender">Bank Lender</option><option value="bank_compliance">Bank Compliance</option><option value="bank_risk">Bank Risk</option><option value="investor_admin">Investor Admin</option><option value="investor_analyst">Investor Analyst</option><option value="super_admin">Super Admin</option><option value="platform_support">Platform Support</option></select></div>
            <div className="flex gap-3 pt-4"><button type="button" onClick={() => { setShowEditUserModal(false); setSelectedItem(null); }} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Save Changes</button></div>
          </div>
        </form>
      </Modal>

      {/* Transaction Details Modal */}
      <Modal isOpen={showTransactionModal} onClose={() => { setShowTransactionModal(false); setSelectedItem(null); }} title="Transaction Details" size="lg">
        {selectedItem && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Transaction ID</p><p className="font-semibold">{selectedItem.txnId}</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Type</p><p className="font-semibold">{selectedItem.type}</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Amount</p><p className="font-semibold text-green-600">¥{selectedItem.amount?.toLocaleString()}</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Status</p><span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedItem.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{selectedItem.status?.replace('_', ' ')}</span></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4"><div className="flex items-center gap-2 mb-2"><Building2 className="w-5 h-5 text-purple-600" /><span className="font-medium">Bank</span></div><p className="text-gray-900">{selectedItem.bank}</p></div>
              <div className="border border-gray-200 rounded-lg p-4"><div className="flex items-center gap-2 mb-2"><Landmark className="w-5 h-5 text-emerald-600" /><span className="font-medium">Investor</span></div><p className="text-gray-900">{selectedItem.investor}</p></div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4"><UserCheck className="w-5 h-5 text-blue-600" /><span className="font-semibold">KYC Verification</span><span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${selectedItem.kycStatus === 'verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{selectedItem.kycStatus}</span></div>
              <div className="grid grid-cols-2 gap-4 mb-4"><div><p className="text-sm text-gray-500">Officer</p><p className="font-medium">{selectedItem.kycOfficer || 'Not assigned'}</p></div><div><p className="text-sm text-gray-500">Date</p><p className="font-medium">{selectedItem.kycDate || 'Pending'}</p></div></div>
              <div><p className="text-sm text-gray-500 mb-2">Documents</p><div className="flex flex-wrap gap-2">{selectedItem.kycDocuments?.length > 0 ? selectedItem.kycDocuments.map((doc, idx) => (<span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center gap-1"><FileText className="w-3 h-3" />{doc}</span>)) : <span className="text-gray-500">No documents</span>}</div></div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4"><Shield className="w-5 h-5 text-purple-600" /><span className="font-semibold">AML Screening</span><span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${selectedItem.amlStatus === 'cleared' ? 'bg-green-100 text-green-700' : selectedItem.amlStatus === 'under_review' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>{selectedItem.amlStatus?.replace('_', ' ')}</span></div>
              <div className="grid grid-cols-2 gap-4 mb-4"><div><p className="text-sm text-gray-500">Officer</p><p className="font-medium">{selectedItem.amlOfficer || 'Not assigned'}</p></div><div><p className="text-sm text-gray-500">Date</p><p className="font-medium">{selectedItem.amlDate || 'Pending'}</p></div></div>
              <div><p className="text-sm text-gray-500 mb-2">Documents</p><div className="flex flex-wrap gap-2">{selectedItem.amlDocuments?.length > 0 ? selectedItem.amlDocuments.map((doc, idx) => (<span key={idx} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm flex items-center gap-1"><FileText className="w-3 h-3" />{doc}</span>)) : <span className="text-gray-500">No documents</span>}</div></div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4"><div className="flex items-center gap-2 mb-4"><Clock className="w-5 h-5 text-gray-600" /><span className="font-semibold">Timeline</span></div><div className="space-y-3"><div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-sm text-gray-600">Created: {selectedItem.createdAt}</span></div>{selectedItem.completedAt && (<div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-sm text-gray-600">Completed: {selectedItem.completedAt}</span></div>)}</div></div>
          </div>
        )}
      </Modal>

      {/* Instrument Details Modal */}
      <Modal isOpen={showInstrumentModal} onClose={() => { setShowInstrumentModal(false); setSelectedItem(null); }} title="Instrument Details" size="lg">
        {selectedItem && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Instrument ID</p><p className="font-semibold">{selectedItem.instrumentId}</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Type</p><p className="font-semibold capitalize">{selectedItem.type?.replace('_', ' ')}</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Interest Rate</p><p className="font-semibold text-green-600">{selectedItem.interestRate}%</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Status</p><span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedItem.status === 'active' ? 'bg-green-100 text-green-700' : selectedItem.status === 'suspended' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{selectedItem.status}</span></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4"><h4 className="font-semibold text-gray-900 mb-3">Instrument Details</h4><div className="space-y-2"><div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-medium">{selectedItem.name}</span></div><div className="flex justify-between"><span className="text-gray-500">Currency Pair</span><span className="font-medium">{selectedItem.currency}</span></div><div className="flex justify-between"><span className="text-gray-500">Min Amount</span><span className="font-medium">¥{(selectedItem.minAmount / 1000000).toFixed(0)}M</span></div><div className="flex justify-between"><span className="text-gray-500">Max Amount</span><span className="font-medium">¥{(selectedItem.maxAmount / 1000000).toFixed(0)}M</span></div><div className="flex justify-between"><span className="text-gray-500">Hedging Fee</span><span className="font-medium">{selectedItem.hedgingFee}%</span></div><div className="flex justify-between"><span className="text-gray-500">Platform Fee</span><span className="font-medium">{selectedItem.platformFee}%</span></div></div></div>
              <div className="border border-gray-200 rounded-lg p-4"><h4 className="font-semibold text-gray-900 mb-3">Issuance Info</h4><div className="space-y-2"><div className="flex justify-between"><span className="text-gray-500">Issuing Bank</span><span className="font-medium">{selectedItem.bankName}</span></div><div className="flex justify-between"><span className="text-gray-500">Total Issued</span><span className="font-medium">{selectedItem.totalIssued}</span></div><div className="flex justify-between"><span className="text-gray-500">Total Value</span><span className="font-medium">¥{(selectedItem.totalValue / 1000000).toFixed(0)}M</span></div><div className="flex justify-between"><span className="text-gray-500">Created</span><span className="font-medium">{selectedItem.createdAt}</span></div><div className="flex justify-between"><span className="text-gray-500">Maturity</span><span className="font-medium">{selectedItem.maturityDate}</span></div></div></div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4"><h4 className="font-semibold text-gray-900 mb-3">Compliance Status</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3"><div className={`p-2 rounded-full ${selectedItem.kycVerified ? 'bg-green-100' : 'bg-amber-100'}`}>{selectedItem.kycVerified ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Clock className="w-5 h-5 text-amber-600" />}</div><div><p className="font-medium">KYC Documentation</p><p className="text-sm text-gray-500">{selectedItem.kycVerified ? 'Verified' : 'Pending Review'}</p></div></div>
                <div className="flex items-center gap-3"><div className={`p-2 rounded-full ${selectedItem.amlCleared ? 'bg-green-100' : 'bg-amber-100'}`}>{selectedItem.amlCleared ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Clock className="w-5 h-5 text-amber-600" />}</div><div><p className="font-medium">AML Clearance</p><p className="text-sm text-gray-500">{selectedItem.amlCleared ? 'Cleared' : 'Under Review'}</p></div></div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { handleSuspendInstrument(selectedItem); setShowInstrumentModal(false); }} className={`flex-1 px-4 py-2 rounded-lg ${selectedItem.status === 'suspended' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'}`}>{selectedItem.status === 'suspended' ? 'Reactivate Instrument' : 'Suspend Instrument'}</button>
              <button onClick={() => { handleCancelInstrument(selectedItem); setShowInstrumentModal(false); }} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Cancel Instrument</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Compliance Rule Modal */}
      <Modal isOpen={showAddRuleModal} onClose={() => setShowAddRuleModal(false)} title="Add Compliance Rule">
        <form onSubmit={handleAddRule}>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Rule Name *</label><input type="text" value={ruleForm.name} onChange={(e) => setRuleForm({...ruleForm, name: e.target.value})} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Enter rule name" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Category *</label><select value={ruleForm.category} onChange={(e) => setRuleForm({...ruleForm, category: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"><option value="KYC">KYC</option><option value="AML">AML</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Threshold *</label><input type="text" value={ruleForm.threshold} onChange={(e) => setRuleForm({...ruleForm, threshold: e.target.value})} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g., All transactions, >$100,000" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Enforcement *</label><select value={ruleForm.enforcement} onChange={(e) => setRuleForm({...ruleForm, enforcement: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"><option value="mandatory">Mandatory</option><option value="recommended">Recommended</option></select></div>
            <div className="flex gap-3 pt-4"><button type="button" onClick={() => setShowAddRuleModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Add Rule</button></div>
          </div>
        </form>
      </Modal>

      {/* Edit Compliance Rule Modal */}
      <Modal isOpen={showEditRuleModal} onClose={() => { setShowEditRuleModal(false); setSelectedItem(null); }} title="Edit Compliance Rule">
        <form onSubmit={handleEditRule}>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Rule Name *</label><input type="text" value={ruleForm.name} onChange={(e) => setRuleForm({...ruleForm, name: e.target.value})} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Category *</label><select value={ruleForm.category} onChange={(e) => setRuleForm({...ruleForm, category: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"><option value="KYC">KYC</option><option value="AML">AML</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Threshold *</label><input type="text" value={ruleForm.threshold} onChange={(e) => setRuleForm({...ruleForm, threshold: e.target.value})} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Enforcement *</label><select value={ruleForm.enforcement} onChange={(e) => setRuleForm({...ruleForm, enforcement: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"><option value="mandatory">Mandatory</option><option value="recommended">Recommended</option></select></div>
            <div className="flex gap-3 pt-4"><button type="button" onClick={() => { setShowEditRuleModal(false); setSelectedItem(null); }} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Save Changes</button></div>
          </div>
        </form>
      </Modal>

      {/* Settings Modal */}
      <Modal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} title="Edit Platform Settings" size="lg">
        <form onSubmit={handleSaveSettings}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label><input type="text" value={settingsForm.platformName} onChange={(e) => setSettingsForm({...settingsForm, platformName: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label><input type="email" value={settingsForm.platformEmail} onChange={(e) => setSettingsForm({...settingsForm, platformEmail: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label><input type="email" value={settingsForm.supportEmail} onChange={(e) => setSettingsForm({...settingsForm, supportEmail: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label><select value={settingsForm.defaultCurrency} onChange={(e) => setSettingsForm({...settingsForm, defaultCurrency: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"><option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="JPY">JPY</option></select></div>
            </div>
            <div className="border-t pt-4"><h4 className="font-medium text-gray-900 mb-4">Fee Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Default Platform Fee (%)</label><input type="number" step="0.1" value={settingsForm.defaultPlatformFee} onChange={(e) => setSettingsForm({...settingsForm, defaultPlatformFee: parseFloat(e.target.value)})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Default Hedging Fee (%)</label><input type="number" step="0.1" value={settingsForm.defaultHedgingFee} onChange={(e) => setSettingsForm({...settingsForm, defaultHedgingFee: parseFloat(e.target.value)})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Max Capital Calling Limit (¥)</label><input type="number" value={settingsForm.maxCapitalCallingLimit} onChange={(e) => setSettingsForm({...settingsForm, maxCapitalCallingLimit: parseInt(e.target.value)})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Min Investment Amount (¥)</label><input type="number" value={settingsForm.minInvestmentAmount} onChange={(e) => setSettingsForm({...settingsForm, minInvestmentAmount: parseInt(e.target.value)})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
              </div>
            </div>
            <div className="border-t pt-4"><h4 className="font-medium text-gray-900 mb-4">Compliance Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">KYC Expiry (Days)</label><input type="number" value={settingsForm.kycExpiryDays} onChange={(e) => setSettingsForm({...settingsForm, kycExpiryDays: parseInt(e.target.value)})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">AML Screening Interval (Days)</label><input type="number" value={settingsForm.amlScreeningInterval} onChange={(e) => setSettingsForm({...settingsForm, amlScreeningInterval: parseInt(e.target.value)})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
              </div>
            </div>
            <div className="border-t pt-4"><div className="flex items-center gap-3"><input type="checkbox" id="maintenanceMode" checked={settingsForm.maintenanceMode} onChange={(e) => setSettingsForm({...settingsForm, maintenanceMode: e.target.checked})} className="w-4 h-4 text-red-600 rounded focus:ring-red-500" /><label htmlFor="maintenanceMode" className="text-sm font-medium text-gray-700">Enable Maintenance Mode</label></div></div>
            <div className="flex gap-3 pt-4"><button type="button" onClick={() => setShowSettingsModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Save Settings</button></div>
          </div>
        </form>
      </Modal>

      {/* AI Chat Assistant */}
      <AmazonQChat userRole="super_admin" userName={user?.name || 'Admin'} />
    </div>
  );
};

export default PlatformAdminDashboard;
