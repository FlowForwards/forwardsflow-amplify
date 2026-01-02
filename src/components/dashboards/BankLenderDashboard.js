// BankLenderDashboard.js - Mobile Lending Operations Dashboard
// Enhanced with universal sample database, reports, notifications, settings
// URL-based tab routing, WhatsApp notification integration

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Wallet, Users, Clock, CheckCircle, XCircle, AlertTriangle, TrendingUp, DollarSign,
  Phone, Search, Filter, RefreshCw, Eye, Check, X, MessageSquare, ArrowUpRight,
  ArrowDownRight, Calendar, CreditCard, Settings, Bell, FileText, BarChart3,
  Send, Zap, Target, Play, Pause, Download, Printer, ChevronRight, Edit,
  Save, Smartphone, Mail, Percent, Timer, Shield, Database, Activity,
  Banknote, ArrowRightLeft, TrendingDown, Globe, Layers, PieChart as PieChartIcon,
  Calculator, Receipt, Building2, ExternalLink
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend, ComposedChart
} from 'recharts';

// ============================================
// UNIVERSAL SAMPLE DATABASE
// Consistent with platform overview data
// ============================================
const SAMPLE_DATABASE = {
  // Bank metrics (consistent with BankAdminDashboard)
  bankMetrics: {
    loanBookValue: 4500000000, // KES 4.5B
    totalDepositValue: 180000000, // JPY 180M
    activeDeposits: 12,
    activeLoanCount: 8542,
    pendingApplications: 156,
    defaultRate: 4.2,
    portfolioYield: 24.5,
    disbursementsToday: 12500000, // KES 12.5M
    repaymentsToday: 8750000, // KES 8.75M
    avgLoanSize: 15000, // KES 15,000
    collectionRate: 96.8,
    nplRate: 4.2,
    monthlyYield: 2.04
  },

  // Loan portfolio breakdown (consistent)
  loanPortfolio: {
    performing: 7845, // 91.8%
    watchlist: 412, // 4.8%
    substandard: 198, // 2.3%
    doubtful: 62, // 0.7%
    loss: 25 // 0.3%
  },

  // Today's activity (consistent)
  todayActivity: {
    disbursements: 12500000,
    collections: 8750000,
    pendingReview: 156,
    avgLoanSize: 15000,
    newApplications: 89,
    approvedToday: 67,
    rejectedToday: 12,
    targetDisbursements: 15000000,
    targetCollections: 10000000
  },

  // Weekly disbursement trend
  weeklyTrend: [
    { day: 'Mon', disbursed: 11.2, collected: 7.9, applications: 78 },
    { day: 'Tue', disbursed: 13.8, collected: 8.1, applications: 92 },
    { day: 'Wed', disbursed: 12.5, collected: 9.3, applications: 85 },
    { day: 'Thu', disbursed: 14.1, collected: 8.0, applications: 96 },
    { day: 'Fri', disbursed: 12.9, collected: 9.5, applications: 88 },
    { day: 'Sat', disbursed: 8.8, collected: 6.7, applications: 45 },
    { day: 'Sun', disbursed: 4.4, collected: 3.3, applications: 22 }
  ],

  // Credit score distribution
  creditScoreDistribution: [
    { range: '300-499', count: 856, color: '#EF4444' },
    { range: '500-599', count: 1842, color: '#F59E0B' },
    { range: '600-699', count: 2945, color: '#10B981' },
    { range: '700-799', count: 2156, color: '#3B82F6' },
    { range: '800-850', count: 743, color: '#8B5CF6' }
  ],

  // ============================================
  // DEPOSIT INSTRUMENTS (Fully Subscribed Capital Calls)
  // These are active deposits from impact investors
  // ============================================
  depositInstruments: [
    {
      id: 'DEP-001',
      capitalCallId: 'CC-2024-001',
      investor: 'Sakura Capital Partners',
      currency: 'JPY',
      principalForeign: 50000000, // JPY 50M
      principalKES: 51500000, // KES 51.5M
      depositRate: 0.0103, // JPY/KES at deposit
      interestRate: 8.5,
      tenor: 12,
      startDate: '2024-03-15',
      maturityDate: '2025-03-15',
      status: 'active',
      forwardRate: 0.0098,
      forwardPremium: 4.85,
      m2Created: 51500000,
      m2Deployed: 48925000, // 95% deployed
      deploymentRate: 95
    },
    {
      id: 'DEP-002',
      capitalCallId: 'CC-2024-002',
      investor: 'Nordic Impact Fund',
      currency: 'JPY',
      principalForeign: 75000000, // JPY 75M
      principalKES: 76500000, // KES 76.5M
      depositRate: 0.0102,
      interestRate: 9.0,
      tenor: 18,
      startDate: '2024-01-20',
      maturityDate: '2025-07-20',
      status: 'active',
      forwardRate: 0.0095,
      forwardPremium: 6.86,
      m2Created: 76500000,
      m2Deployed: 74205000, // 97% deployed
      deploymentRate: 97
    },
    {
      id: 'DEP-003',
      capitalCallId: 'CC-2024-003',
      investor: 'Geneva Wealth Partners',
      currency: 'JPY',
      principalForeign: 25000000, // JPY 25M
      principalKES: 25750000, // KES 25.75M
      depositRate: 0.0103,
      interestRate: 7.5,
      tenor: 6,
      startDate: '2024-09-01',
      maturityDate: '2025-03-01',
      status: 'maturing',
      forwardRate: 0.0100,
      forwardPremium: 2.91,
      m2Created: 25750000,
      m2Deployed: 24462500, // 95% deployed
      deploymentRate: 95
    },
    {
      id: 'DEP-004',
      capitalCallId: 'CC-2024-004',
      investor: 'Singapore Sovereign Fund',
      currency: 'JPY',
      principalForeign: 100000000, // JPY 100M
      principalKES: 102000000, // KES 102M
      depositRate: 0.0102,
      interestRate: 8.0,
      tenor: 12,
      startDate: '2024-06-10',
      maturityDate: '2025-06-10',
      status: 'active',
      forwardRate: 0.0096,
      forwardPremium: 5.88,
      m2Created: 102000000,
      m2Deployed: 99960000, // 98% deployed
      deploymentRate: 98
    }
  ],

  // ============================================
  // SETTLED CAPITAL CALLS (Fully Redeemed)
  // Historical data for completed capital call lifecycles
  // ============================================
  settledCapitalCalls: [
    {
      id: 'SET-001',
      capitalCallId: 'CC-2023-001',
      investor: 'Tokyo Investment Trust',
      currency: 'JPY',
      principalForeign: 40000000,
      principalKES: 40800000,
      depositRate: 0.0102,
      interestRate: 8.0,
      tenor: 12,
      startDate: '2023-01-15',
      maturityDate: '2024-01-15',
      settledDate: '2024-01-15',
      status: 'settled',
      redemptionRate: 0.0098,
      interestPaidJPY: 3200000,
      interestPaidKES: 3264000,
      totalReturnedJPY: 43200000,
      fxGainLoss: 1632000, // KES gain from favorable rate
      netPL: 4896000 // Net P&L in KES
    },
    {
      id: 'SET-002',
      capitalCallId: 'CC-2023-002',
      investor: 'European Development Fund',
      currency: 'EUR',
      principalForeign: 500000,
      principalKES: 62500000,
      depositRate: 125.0, // KES per EUR
      interestRate: 7.5,
      tenor: 9,
      startDate: '2023-03-01',
      maturityDate: '2023-12-01',
      settledDate: '2023-12-01',
      status: 'settled',
      redemptionRate: 128.5,
      interestPaidEUR: 28125,
      interestPaidKES: 3515625,
      totalReturnedEUR: 528125,
      fxGainLoss: -1750000, // KES loss from unfavorable rate
      netPL: 1765625 // Net P&L in KES
    },
    {
      id: 'SET-003',
      capitalCallId: 'CC-2023-003',
      investor: 'Osaka Capital',
      currency: 'JPY',
      principalForeign: 30000000,
      principalKES: 30600000,
      depositRate: 0.0102,
      interestRate: 8.5,
      tenor: 6,
      startDate: '2023-06-01',
      maturityDate: '2023-12-01',
      settledDate: '2023-12-01',
      status: 'settled',
      redemptionRate: 0.0100,
      interestPaidJPY: 1275000,
      interestPaidKES: 1300500,
      totalReturnedJPY: 31275000,
      fxGainLoss: 612000, // KES gain
      netPL: 1912500 // Net P&L in KES
    }
  ],

  // ============================================
  // CAPITAL CALL LIFECYCLE ANALYTICS
  // Full P&L breakdown for each capital call
  // ============================================
  capitalCallAnalytics: [
    {
      id: 'CCA-001',
      capitalCallId: 'CC-2024-001',
      investor: 'Sakura Capital Partners',
      status: 'active',
      // Inflow
      calledAmount: 50000000, // JPY
      calledCurrency: 'JPY',
      depositExchangeRate: 0.0103, // JPY to KES
      m2Created: 51500000, // KES created
      forwardContractRate: 0.0098,
      forwardPremiumPaid: 2500000, // KES (4.85%)
      // Lending Operations
      m2Deployed: 48925000, // KES lent out
      deploymentRatio: 95,
      avgLendingRate: 24.5, // APR
      expectedInterestIncome: 11986625, // KES annually
      nplRatio: 3.8,
      provisionAmount: 1859150, // KES
      netYield: 20.7, // After provisions
      actualCollected: 47850000, // KES collected to date
      // Outflow (projected for active)
      projectedRedemptionRate: 0.0098,
      projectedReturnJPY: 54250000, // Principal + interest
      projectedFxImpact: 2575000, // KES (favorable)
      // P&L Summary
      grossInterestIncome: 11986625,
      lessProvisions: 1859150,
      lessFxHedgeCost: 2500000,
      plusFxGain: 2575000,
      netPLProjected: 10202475, // KES
      roi: 19.8 // %
    },
    {
      id: 'CCA-002',
      capitalCallId: 'CC-2024-002',
      investor: 'Nordic Impact Fund',
      status: 'active',
      calledAmount: 75000000,
      calledCurrency: 'JPY',
      depositExchangeRate: 0.0102,
      m2Created: 76500000,
      forwardContractRate: 0.0095,
      forwardPremiumPaid: 5250000, // 6.86%
      m2Deployed: 74205000,
      deploymentRatio: 97,
      avgLendingRate: 24.5,
      expectedInterestIncome: 18180225,
      nplRatio: 4.1,
      provisionAmount: 3042405,
      netYield: 20.4,
      actualCollected: 71500000,
      projectedRedemptionRate: 0.0095,
      projectedReturnJPY: 81750000,
      projectedFxImpact: 5355000,
      grossInterestIncome: 18180225,
      lessProvisions: 3042405,
      lessFxHedgeCost: 5250000,
      plusFxGain: 5355000,
      netPLProjected: 15242820,
      roi: 19.9
    },
    {
      id: 'CCA-003',
      capitalCallId: 'CC-2023-001',
      investor: 'Tokyo Investment Trust',
      status: 'settled',
      calledAmount: 40000000,
      calledCurrency: 'JPY',
      depositExchangeRate: 0.0102,
      m2Created: 40800000,
      forwardContractRate: 0.0098,
      forwardPremiumPaid: 1632000,
      m2Deployed: 38760000,
      deploymentRatio: 95,
      avgLendingRate: 23.8,
      expectedInterestIncome: 9224880,
      nplRatio: 3.2,
      provisionAmount: 1240320,
      netYield: 20.6,
      actualCollected: 47200000,
      projectedRedemptionRate: 0.0098, // Actual
      projectedReturnJPY: 43200000, // Actual
      projectedFxImpact: 1632000, // Actual gain
      grossInterestIncome: 9224880,
      lessProvisions: 1240320,
      lessFxHedgeCost: 1632000,
      plusFxGain: 1632000,
      netPLProjected: 7984560, // Actual
      roi: 19.6
    },
    {
      id: 'CCA-004',
      capitalCallId: 'CC-2024-004',
      investor: 'Singapore Sovereign Fund',
      status: 'active',
      calledAmount: 100000000,
      calledCurrency: 'JPY',
      depositExchangeRate: 0.0102,
      m2Created: 102000000,
      forwardContractRate: 0.0096,
      forwardPremiumPaid: 6000000, // 5.88%
      m2Deployed: 99960000,
      deploymentRatio: 98,
      avgLendingRate: 24.5,
      expectedInterestIncome: 24490200,
      nplRatio: 4.5,
      provisionAmount: 4498200,
      netYield: 20.0,
      actualCollected: 95500000,
      projectedRedemptionRate: 0.0096,
      projectedReturnJPY: 108000000,
      projectedFxImpact: 6120000,
      grossInterestIncome: 24490200,
      lessProvisions: 4498200,
      lessFxHedgeCost: 6000000,
      plusFxGain: 6120000,
      netPLProjected: 20112000,
      roi: 19.7
    }
  ],

  // Loan applications queue
  loanApplications: [
    { id: 'APP-001', borrowerName: 'John Kamau', phoneNumber: '+254722123456', amountRequested: 25000, durationDays: 30, creditScore: 720, riskRating: 'low', kycStatus: 'verified', status: 'pending', createdAt: '2025-01-02T08:30:00Z', purpose: 'Business inventory', monthlyIncome: 45000 },
    { id: 'APP-002', borrowerName: 'Mary Wanjiku', phoneNumber: '+254733234567', amountRequested: 15000, durationDays: 14, creditScore: 680, riskRating: 'low', kycStatus: 'verified', status: 'pending', createdAt: '2025-01-02T08:15:00Z', purpose: 'School fees', monthlyIncome: 35000 },
    { id: 'APP-003', borrowerName: 'Peter Odhiambo', phoneNumber: '+254711345678', amountRequested: 50000, durationDays: 60, creditScore: 590, riskRating: 'medium', kycStatus: 'verified', status: 'pending', createdAt: '2025-01-02T07:45:00Z', purpose: 'Equipment purchase', monthlyIncome: 62000 },
    { id: 'APP-004', borrowerName: 'Grace Muthoni', phoneNumber: '+254700456789', amountRequested: 10000, durationDays: 7, creditScore: 750, riskRating: 'low', kycStatus: 'verified', status: 'pending', createdAt: '2025-01-02T07:30:00Z', purpose: 'Emergency', monthlyIncome: 28000 },
    { id: 'APP-005', borrowerName: 'David Kiprop', phoneNumber: '+254788567890', amountRequested: 35000, durationDays: 30, creditScore: 520, riskRating: 'high', kycStatus: 'pending', status: 'pending', createdAt: '2025-01-02T07:00:00Z', purpose: 'Debt consolidation', monthlyIncome: 40000 },
    { id: 'APP-006', borrowerName: 'Alice Njeri', phoneNumber: '+254722678901', amountRequested: 20000, durationDays: 21, creditScore: 640, riskRating: 'medium', kycStatus: 'verified', status: 'pending', createdAt: '2025-01-02T06:30:00Z', purpose: 'Medical bills', monthlyIncome: 32000 },
    { id: 'APP-007', borrowerName: 'Samuel Otieno', phoneNumber: '+254733789012', amountRequested: 8000, durationDays: 7, creditScore: 780, riskRating: 'low', kycStatus: 'verified', status: 'pending', createdAt: '2025-01-02T06:00:00Z', purpose: 'Utility bills', monthlyIncome: 25000 },
    { id: 'APP-008', borrowerName: 'Faith Akinyi', phoneNumber: '+254711890123', amountRequested: 45000, durationDays: 45, creditScore: 480, riskRating: 'high', kycStatus: 'verified', status: 'pending', createdAt: '2025-01-01T23:30:00Z', purpose: 'Business expansion', monthlyIncome: 55000 }
  ],

  // Active loans
  activeLoans: [
    { id: 'LN-001', borrowerName: 'James Mwangi', phoneNumber: '+254722111222', principalAmount: 30000, outstandingBalance: 18500, apr: 24, status: 'current', daysOverdue: 0, maturityDate: '2025-01-15', disbursedDate: '2024-12-15', nextPaymentDate: '2025-01-08', nextPaymentAmount: 6500 },
    { id: 'LN-002', borrowerName: 'Susan Wairimu', phoneNumber: '+254733222333', principalAmount: 20000, outstandingBalance: 22400, apr: 24, status: 'current', daysOverdue: 0, maturityDate: '2025-01-20', disbursedDate: '2024-12-20', nextPaymentDate: '2025-01-10', nextPaymentAmount: 5600 },
    { id: 'LN-003', borrowerName: 'Michael Ochieng', phoneNumber: '+254711333444', principalAmount: 50000, outstandingBalance: 35200, apr: 24, status: 'overdue', daysOverdue: 5, maturityDate: '2025-01-05', disbursedDate: '2024-12-05', nextPaymentDate: '2024-12-28', nextPaymentAmount: 12800 },
    { id: 'LN-004', borrowerName: 'Jane Njoki', phoneNumber: '+254700444555', principalAmount: 15000, outstandingBalance: 8200, apr: 24, status: 'current', daysOverdue: 0, maturityDate: '2025-01-10', disbursedDate: '2024-12-25', nextPaymentDate: '2025-01-05', nextPaymentAmount: 4100 },
    { id: 'LN-005', borrowerName: 'Robert Kipchoge', phoneNumber: '+254788555666', principalAmount: 45000, outstandingBalance: 52800, apr: 24, status: 'overdue', daysOverdue: 12, maturityDate: '2024-12-28', disbursedDate: '2024-11-28', nextPaymentDate: '2024-12-21', nextPaymentAmount: 17600 },
    { id: 'LN-006', borrowerName: 'Catherine Wambui', phoneNumber: '+254722666777', principalAmount: 25000, outstandingBalance: 0, apr: 24, status: 'paid_off', daysOverdue: 0, maturityDate: '2024-12-30', disbursedDate: '2024-12-01', nextPaymentDate: null, nextPaymentAmount: 0 },
    { id: 'LN-007', borrowerName: 'Patrick Kimani', phoneNumber: '+254733777888', principalAmount: 35000, outstandingBalance: 42800, apr: 24, status: 'overdue', daysOverdue: 35, maturityDate: '2024-12-01', disbursedDate: '2024-11-01', nextPaymentDate: '2024-11-28', nextPaymentAmount: 14300 },
    { id: 'LN-008', borrowerName: 'Elizabeth Auma', phoneNumber: '+254711888999', principalAmount: 12000, outstandingBalance: 6800, apr: 24, status: 'current', daysOverdue: 0, maturityDate: '2025-01-12', disbursedDate: '2024-12-28', nextPaymentDate: '2025-01-07', nextPaymentAmount: 3400 }
  ],

  // P&L projection
  plProjection: {
    projectedRevenue: 98500000,
    projectedInterestIncome: 85200000,
    projectedFees: 13300000,
    projectedProvisions: 18500000,
    projectedNetIncome: 68700000,
    actualMTD: 45600000,
    targetMTD: 50000000
  },

  // Notifications - Lending specific
  notifications: [
    { id: 1, title: 'New Loan Application', message: 'John Kamau applied for KES 25,000 loan via WhatsApp', time: '2 mins ago', type: 'info', read: false, category: 'application' },
    { id: 2, title: 'Loan Auto-Approved', message: 'Mary Wanjiku - KES 15,000 approved (credit score: 680)', time: '15 mins ago', type: 'success', read: false, category: 'approval' },
    { id: 3, title: 'Payment Overdue', message: 'Michael Ochieng payment overdue by 5 days - KES 35,200 outstanding', time: '1 hour ago', type: 'warning', read: false, category: 'collection' },
    { id: 4, title: 'High Risk Application', message: 'David Kiprop flagged as high risk - manual review required', time: '2 hours ago', type: 'warning', read: true, category: 'risk' },
    { id: 5, title: 'Deposit Maturing', message: 'Geneva Wealth Partners deposit matures in 60 days - JPY 25M', time: '3 hours ago', type: 'info', read: false, category: 'deposit' },
    { id: 6, title: 'Collection Success', message: 'KES 52,400 collected from 8 borrowers today', time: '4 hours ago', type: 'success', read: true, category: 'collection' },
    { id: 7, title: 'Forward Contract Alert', message: 'Forward rate for CC-2024-002 moved 0.5% - review hedging position', time: '5 hours ago', type: 'warning', read: true, category: 'fx' },
    { id: 8, title: 'Default Alert', message: 'Patrick Kimani loan defaulted - 35 days overdue, KES 42,800', time: '1 day ago', type: 'error', read: true, category: 'default' },
    { id: 9, title: 'M2 Deployment Update', message: '98% of Singapore Sovereign Fund deposit now deployed', time: '1 day ago', type: 'success', read: true, category: 'deployment' },
    { id: 10, title: 'Settlement Completed', message: 'Tokyo Investment Trust - JPY 43.2M successfully repatriated', time: '2 days ago', type: 'success', read: true, category: 'settlement' }
  ],

  // Lending settings defaults
  lendingSettings: {
    // Loan Parameters
    minLoanAmount: 1000,
    maxLoanAmount: 100000,
    minDuration: 7,
    maxDuration: 90,
    // Interest Rates
    baseInterestRate: 24,
    riskPremiumLow: 0,
    riskPremiumMedium: 3,
    riskPremiumHigh: 6,
    // Auto-Approval
    autoApprovalEnabled: true,
    autoApprovalMaxAmount: 20000,
    autoApprovalMinCreditScore: 650,
    autoApprovalRequireKYC: true,
    // Penalties & Grace
    latePaymentPenalty: 5,
    gracePeriodDays: 3,
    maxDebtToIncome: 40,
    // Notifications
    whatsappNotifications: true,
    smsNotifications: true,
    emailNotifications: false,
    // M2 Management
    targetDeploymentRatio: 95,
    minLiquidityBuffer: 5,
    maxSingleBorrowerExposure: 500000,
    // FX Settings
    autoHedgeEnabled: true,
    maxHedgePremium: 8.0,
    hedgeRatio: 100,
    // Provisioning
    watchlistProvision: 5,
    substandardProvision: 20,
    doubtfulProvision: 50,
    lossProvision: 100,
    // Collection
    reminderDay1: 1,
    reminderDay2: 3,
    reminderDay3: 7,
    escalationDay: 14,
    defaultDay: 30
  }
};

// ============================================
// MODAL COMPONENT
// ============================================
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizeClasses = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white rounded-xl shadow-xl ${sizeClasses[size]} w-full mx-4 max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// ============================================
// STAT CARD COMPONENT
// ============================================
const StatCard = ({ title, value, icon: Icon, color, trend, subtitle, onClick }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    amber: 'bg-amber-100 text-amber-600',
    purple: 'bg-purple-100 text-purple-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm p-5 border border-gray-100 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{Math.abs(trend)}% vs yesterday</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

// ============================================
// TOGGLE COMPONENT
// ============================================
const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-300'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

// ============================================
// URL PATH TO TAB MAPPING
// Handles both /bank/lending/* and /bank/* routes
// ============================================
const getTabFromPath = (pathname) => {
  // Check for specific paths (handle both /bank/lending/X and /bank/X)
  if (pathname.includes('/queue') || pathname.includes('/applications')) return 'queue';
  if (pathname.includes('/loans') || pathname.includes('/active') || pathname.includes('/portfolio')) return 'loans';
  if (pathname.includes('/collections')) return 'collections';
  if (pathname.includes('/instruments') || pathname.includes('/deposits')) return 'instruments';
  if (pathname.includes('/settlement') || pathname.includes('/settlements')) return 'settlement';
  if (pathname.includes('/analytics')) return 'analytics';
  if (pathname.includes('/reports')) return 'reports';
  if (pathname.includes('/notifications')) return 'notifications';
  if (pathname.includes('/settings')) return 'settings';
  // Default to overview for /bank/lending or /bank
  return 'overview';
};

// ============================================
// MAIN BANK LENDER DASHBOARD
// ============================================
const BankLenderDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Determine active tab from URL path
  const [activeTab, setActiveTab] = useState(() => getTabFromPath(location.pathname));
  
  // Update tab when URL changes
  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);
  
  // Data state from universal sample database
  const [metrics] = useState(SAMPLE_DATABASE.bankMetrics);
  const [loanPortfolio] = useState(SAMPLE_DATABASE.loanPortfolio);
  const [todayActivity] = useState(SAMPLE_DATABASE.todayActivity);
  const [weeklyTrend] = useState(SAMPLE_DATABASE.weeklyTrend);
  const [creditScoreDistribution] = useState(SAMPLE_DATABASE.creditScoreDistribution);
  const [applications, setApplications] = useState(SAMPLE_DATABASE.loanApplications);
  const [loans, setLoans] = useState(SAMPLE_DATABASE.activeLoans);
  const [plProjection] = useState(SAMPLE_DATABASE.plProjection);
  const [notifications, setNotifications] = useState(SAMPLE_DATABASE.notifications);
  const [settings, setSettings] = useState(SAMPLE_DATABASE.lendingSettings);
  const [depositInstruments] = useState(SAMPLE_DATABASE.depositInstruments);
  const [settledCapitalCalls] = useState(SAMPLE_DATABASE.settledCapitalCalls);
  const [capitalCallAnalytics] = useState(SAMPLE_DATABASE.capitalCallAnalytics);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [notificationFilter, setNotificationFilter] = useState('all');
  
  // Modal states
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [whatsAppMessage, setWhatsAppMessage] = useState('');
  const [whatsAppRecipient, setWhatsAppRecipient] = useState('');

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Handle tab change - update URL
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Use /bank/* paths to match sidebar navigation
    const tabToPath = {
      overview: '/bank',
      queue: '/bank/applications',
      loans: '/bank/loans',
      collections: '/bank/collections',
      instruments: '/bank/instruments',
      settlement: '/bank/settlements',
      analytics: '/bank/analytics',
      reports: '/bank/reports',
      notifications: '/bank/notifications',
      settings: '/bank/settings'
    };
    if (tabToPath[tabId]) {
      navigate(tabToPath[tabId]);
    }
  };

  // ============================================
  // LOAN APPLICATION FUNCTIONS
  // ============================================
  const handleApprove = (appId) => {
    const app = applications.find(a => a.id === appId);
    setApplications(applications.map(a => 
      a.id === appId ? { ...a, status: 'approved' } : a
    ));
    
    // Simulate WhatsApp notification
    if (settings.whatsappNotifications && app) {
      setWhatsAppRecipient(app.phoneNumber);
      setWhatsAppMessage(`🎉 Congratulations ${app.borrowerName}! Your loan of KES ${app.amountRequested.toLocaleString()} has been APPROVED. Funds will be disbursed to your M-Pesa shortly. Thank you for choosing Equity Bank.`);
      setShowWhatsAppModal(true);
    }
    
    // Add notification
    const newNotification = {
      id: Date.now(),
      title: 'Loan Approved',
      message: `Approved: ${app?.borrowerName} - KES ${app?.amountRequested.toLocaleString()}`,
      time: 'Just now',
      type: 'success',
      read: false
    };
    setNotifications([newNotification, ...notifications]);
  };

  const handleReject = (appId) => {
    const app = applications.find(a => a.id === appId);
    setApplications(applications.map(a => 
      a.id === appId ? { ...a, status: 'rejected' } : a
    ));
    
    // Simulate WhatsApp notification
    if (settings.whatsappNotifications && app) {
      setWhatsAppRecipient(app.phoneNumber);
      setWhatsAppMessage(`Dear ${app.borrowerName}, we regret to inform you that your loan application for KES ${app.amountRequested.toLocaleString()} was not approved at this time. Please contact us for more information or to discuss alternatives.`);
      setShowWhatsAppModal(true);
    }
  };

  const handleBatchApprove = () => {
    const eligibleApps = pendingApplications.filter(app => 
      app.creditScore >= settings.autoApprovalMinCreditScore &&
      app.amountRequested <= settings.autoApprovalMaxAmount &&
      app.kycStatus === 'verified' &&
      app.riskRating === 'low'
    );
    
    eligibleApps.forEach(app => {
      setApplications(prev => prev.map(a => 
        a.id === app.id ? { ...a, status: 'approved' } : a
      ));
    });
    
    const newNotification = {
      id: Date.now(),
      title: 'Batch Approval Complete',
      message: `${eligibleApps.length} applications approved automatically`,
      time: 'Just now',
      type: 'success',
      read: false
    };
    setNotifications([newNotification, ...notifications]);
  };

  const handleSendReminders = () => {
    const overdueLoans = loans.filter(l => l.status === 'overdue');
    overdueLoans.forEach(loan => {
      // Simulate sending WhatsApp reminders
      console.log(`Sending reminder to ${loan.phoneNumber}`);
    });
    
    const newNotification = {
      id: Date.now(),
      title: 'Reminders Sent',
      message: `Payment reminders sent to ${overdueLoans.length} borrowers via WhatsApp`,
      time: 'Just now',
      type: 'info',
      read: false
    };
    setNotifications([newNotification, ...notifications]);
  };

  const handleDisburse = (appId) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    // Create new loan from approved application
    const newLoan = {
      id: `LN-${Date.now()}`,
      borrowerName: app.borrowerName,
      phoneNumber: app.phoneNumber,
      principalAmount: app.amountRequested,
      outstandingBalance: app.amountRequested * 1.12, // Add interest
      apr: settings.baseInterestRate,
      status: 'disbursed',
      daysOverdue: 0,
      maturityDate: new Date(Date.now() + app.durationDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      disbursedDate: new Date().toISOString().split('T')[0],
      nextPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      nextPaymentAmount: Math.round((app.amountRequested * 1.12) / (app.durationDays / 7))
    };

    setLoans([newLoan, ...loans]);
    setApplications(applications.filter(a => a.id !== appId));

    // Send WhatsApp disbursement notification
    if (settings.whatsappNotifications) {
      setWhatsAppRecipient(app.phoneNumber);
      setWhatsAppMessage(`💰 ${app.borrowerName}, your loan of KES ${app.amountRequested.toLocaleString()} has been DISBURSED to your M-Pesa number ${app.phoneNumber}. Repayment of KES ${newLoan.outstandingBalance.toLocaleString()} due by ${newLoan.maturityDate}. Thank you!`);
      setShowWhatsAppModal(true);
    }
  };

  // Settings update
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Computed values
  const pendingApplications = applications.filter(a => a.status === 'pending');
  const approvedApplications = applications.filter(a => a.status === 'approved');
  const activeLoans = loans.filter(l => ['disbursed', 'current'].includes(l.status));
  const overdueLoans = loans.filter(l => l.status === 'overdue');
  const unreadNotifications = notifications.filter(n => !n.read);

  const filteredApplications = pendingApplications.filter(app => {
    const matchesSearch = app.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.phoneNumber.includes(searchTerm);
    const matchesRisk = riskFilter === 'all' || app.riskRating === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.phoneNumber.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Portfolio chart data
  const portfolioChartData = [
    { name: 'Performing', value: loanPortfolio.performing, color: '#10B981' },
    { name: 'Watchlist', value: loanPortfolio.watchlist, color: '#F59E0B' },
    { name: 'Substandard', value: loanPortfolio.substandard, color: '#EF4444' },
    { name: 'Doubtful', value: loanPortfolio.doubtful, color: '#DC2626' },
    { name: 'Loss', value: loanPortfolio.loss, color: '#7F1D1D' }
  ];

  const totalLoans = Object.values(loanPortfolio).reduce((a, b) => a + b, 0);

  // Helper functions
  const getRiskColor = (risk) => {
    const colors = { low: 'bg-green-100 text-green-700', medium: 'bg-amber-100 text-amber-700', high: 'bg-red-100 text-red-700' };
    return colors[risk] || 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status) => {
    const colors = {
      current: 'bg-green-100 text-green-700',
      disbursed: 'bg-blue-100 text-blue-700',
      overdue: 'bg-red-100 text-red-700',
      defaulted: 'bg-red-200 text-red-800',
      paid_off: 'bg-gray-100 text-gray-700',
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-blue-100 text-blue-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatTime = (timeStr) => timeStr;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading lending dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-6 h-6" />
              <span className="text-blue-200 text-sm font-medium">MOBILE LENDING OPERATIONS</span>
            </div>
            <h1 className="text-2xl font-bold">Equity Africa Bank • Lending Dashboard</h1>
            <p className="text-blue-100 mt-1">
              {pendingApplications.length} applications pending • {activeLoans.length} active loans
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-200">Loan Book Value</p>
            <p className="text-3xl font-bold">KES {(metrics.loanBookValue / 1000000000).toFixed(2)}B</p>
            <p className="text-sm text-blue-200 mt-1">{metrics.monthlyYield}% monthly yield</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 shadow-sm overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'queue', label: 'Applications', icon: Clock, count: pendingApplications.length },
          { id: 'loans', label: 'Loan Book', icon: CreditCard, count: activeLoans.length },
          { id: 'collections', label: 'Collections', icon: AlertTriangle, count: overdueLoans.length },
          { id: 'instruments', label: 'Deposit Instruments', icon: Wallet },
          { id: 'settlement', label: 'Settlement', icon: CheckCircle },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'reports', label: 'Reports', icon: FileText },
          { id: 'notifications', label: 'Notifications', icon: Bell, count: unreadNotifications.length },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-white/20' : tab.id === 'collections' ? 'bg-red-500 text-white' : 'bg-blue-100 text-blue-700'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ============================================ */}
      {/* OVERVIEW TAB */}
      {/* ============================================ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              title="Active Loans"
              value={metrics.activeLoanCount.toLocaleString()}
              icon={CreditCard}
              color="blue"
              subtitle="Loan book"
            />
            <StatCard
              title="Monthly Yield"
              value={`${metrics.monthlyYield}%`}
              icon={Percent}
              color="green"
              trend={0.3}
            />
            <StatCard
              title="NPL Rate"
              value={`${metrics.nplRate}%`}
              icon={AlertTriangle}
              color="amber"
            />
            <StatCard
              title="Disbursements Today"
              value={`KES ${(todayActivity.disbursements / 1000000).toFixed(1)}M`}
              icon={TrendingUp}
              color="green"
              trend={12}
            />
            <StatCard
              title="Collections Today"
              value={`KES ${(todayActivity.collections / 1000000).toFixed(1)}M`}
              icon={DollarSign}
              color="purple"
              trend={8}
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={handleBatchApprove}
                className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
              >
                <Zap className="w-6 h-6 text-blue-600 mb-2" />
                <p className="font-medium text-gray-900">Batch Approve</p>
                <p className="text-xs text-gray-500">Auto-approve eligible apps</p>
              </button>
              <button 
                onClick={handleSendReminders}
                className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors text-left"
              >
                <Send className="w-6 h-6 text-green-600 mb-2" />
                <p className="font-medium text-gray-900">Send Reminders</p>
                <p className="text-xs text-gray-500">WhatsApp payment reminders</p>
              </button>
              <button 
                onClick={() => handleTabChange('settings')}
                className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors text-left"
              >
                <Settings className="w-6 h-6 text-purple-600 mb-2" />
                <p className="font-medium text-gray-900">Auto-Approval Rules</p>
                <p className="text-xs text-gray-500">Configure approval criteria</p>
              </button>
              <button 
                onClick={() => handleTabChange('reports')}
                className="p-4 border border-gray-200 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-colors text-left"
              >
                <FileText className="w-6 h-6 text-amber-600 mb-2" />
                <p className="font-medium text-gray-900">Generate Report</p>
                <p className="text-xs text-gray-500">Lending operations report</p>
              </button>
            </div>
          </div>

          {/* Today's Progress */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Pending Review</h4>
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{todayActivity.pendingReview}</p>
              <p className="text-sm text-gray-500 mt-1">{todayActivity.newApplications} new today</p>
              <button 
                onClick={() => handleTabChange('queue')}
                className="mt-4 w-full py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 font-medium text-sm"
              >
                Review Applications
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Today's Target</h4>
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Disbursements</span>
                    <span className="font-medium">{((todayActivity.disbursements / todayActivity.targetDisbursements) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full" 
                      style={{ width: `${(todayActivity.disbursements / todayActivity.targetDisbursements) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Collections</span>
                    <span className="font-medium">{((todayActivity.collections / todayActivity.targetCollections) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-600 rounded-full" 
                      style={{ width: `${(todayActivity.collections / todayActivity.targetCollections) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Avg Loan Size</h4>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">KES {todayActivity.avgLoanSize.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">Mobile lending average</p>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-green-600 flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" />
                  5.2%
                </span>
                <span className="text-gray-500">vs last week</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Disbursements vs Collections */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Disbursements vs Collections (KES M)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => `KES ${value}M`} />
                  <Legend />
                  <Bar dataKey="disbursed" fill="#3B82F6" name="Disbursed" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="collected" fill="#10B981" name="Collected" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Loan Portfolio Status */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Portfolio Status</h3>
              <div className="flex items-center gap-6">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={portfolioChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {portfolioChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => value.toLocaleString()} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {portfolioChartData.map(item => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-600">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium text-gray-900">{item.value.toLocaleString()}</span>
                        <span className="text-xs text-gray-500 ml-2">({((item.value / totalLoans) * 100).toFixed(1)}%)</span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-100 flex justify-between">
                    <span className="font-medium text-gray-900">Total</span>
                    <span className="font-bold text-gray-900">{totalLoans.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Credit Score Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Credit Score Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={creditScoreDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="range" width={80} />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {creditScoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* APPLICATION QUEUE TAB */}
      {/* ============================================ */}
      {activeTab === 'queue' && (
        <div className="space-y-6">
          {/* Queue Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select 
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Risk Levels</option>
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
              </select>
            </div>
            <button
              onClick={handleBatchApprove}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Zap className="w-4 h-4" />
              Batch Approve ({pendingApplications.filter(a => a.creditScore >= settings.autoApprovalMinCreditScore && a.amountRequested <= settings.autoApprovalMaxAmount && a.kycStatus === 'verified' && a.riskRating === 'low').length})
            </button>
          </div>

          {/* Approved awaiting disbursement */}
          {approvedApplications.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Approved - Awaiting Disbursement ({approvedApplications.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedApplications.map(app => (
                  <div key={app.id} className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{app.borrowerName}</span>
                      <span className="text-sm text-gray-500">{app.phoneNumber}</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">KES {app.amountRequested.toLocaleString()}</p>
                    <button
                      onClick={() => handleDisburse(app.id)}
                      className="mt-3 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Disburse via M-Pesa
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Application Cards */}
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">All caught up!</h3>
              <p className="text-gray-600 mt-2">No pending loan applications to review.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredApplications.map(app => (
                <div key={app.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{app.borrowerName}</p>
                        <p className="text-sm text-gray-500">{app.phoneNumber}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">{app.id}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Amount Requested</p>
                      <p className="font-semibold text-gray-900">KES {app.amountRequested.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-semibold text-gray-900">{app.durationDays} days</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Credit Score</p>
                      <p className="font-semibold text-gray-900">{app.creditScore}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Risk Rating</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(app.riskRating)}`}>
                        {app.riskRating.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      app.kycStatus === 'verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      KYC: {app.kycStatus}
                    </span>
                    <span className="text-xs text-gray-500">Purpose: {app.purpose}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleApprove(app.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(app.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => { setSelectedApplication(app); setShowApplicationModal(true); }}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================ */}
      {/* LOAN BOOK TAB */}
      {/* ============================================ */}
      {activeTab === 'loans' && (
        <div className="space-y-6">
          {/* P&L Projection */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-500">Projected Revenue</p>
              <p className="text-xl font-bold text-gray-900">KES {(plProjection.projectedRevenue / 1000000).toFixed(1)}M</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-500">Projected Provisions</p>
              <p className="text-xl font-bold text-red-600">KES {(plProjection.projectedProvisions / 1000000).toFixed(1)}M</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-500">Net Income (Projected)</p>
              <p className="text-xl font-bold text-green-600">KES {(plProjection.projectedNetIncome / 1000000).toFixed(1)}M</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-500">MTD Progress</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${(plProjection.actualMTD / plProjection.targetMTD) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{((plProjection.actualMTD / plProjection.targetMTD) * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* Loans Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search loans..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="disbursed">Disbursed</option>
                  <option value="current">Current</option>
                  <option value="overdue">Overdue</option>
                  <option value="paid_off">Paid Off</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrower</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Principal</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Outstanding</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">APR</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Payment</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLoans.map(loan => (
                    <tr key={loan.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{loan.borrowerName}</p>
                          <p className="text-xs text-gray-500">{loan.phoneNumber}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        KES {loan.principalAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        KES {loan.outstandingBalance.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{loan.apr}%</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                          {loan.status.replace('_', ' ')}
                        </span>
                        {loan.daysOverdue > 0 && (
                          <span className="ml-2 text-xs text-red-600">+{loan.daysOverdue}d</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {loan.nextPaymentDate ? (
                          <div>
                            <p className="text-sm text-gray-900">{loan.nextPaymentDate}</p>
                            <p className="text-xs text-gray-500">KES {loan.nextPaymentAmount?.toLocaleString()}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => { setSelectedLoan(loan); setShowLoanModal(true); }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setWhatsAppRecipient(loan.phoneNumber);
                              setWhatsAppMessage(`Dear ${loan.borrowerName}, this is a reminder that your payment of KES ${loan.nextPaymentAmount?.toLocaleString()} is due on ${loan.nextPaymentDate}. Please ensure timely payment to avoid penalties.`);
                              setShowWhatsAppModal(true);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* COLLECTIONS TAB */}
      {/* ============================================ */}
      {activeTab === 'collections' && (
        <div className="space-y-6">
          {/* Collections Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <span className="font-medium text-gray-900">Overdue (1-30 days)</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {overdueLoans.filter(l => l.daysOverdue <= 30).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                KES {overdueLoans.filter(l => l.daysOverdue <= 30)
                  .reduce((sum, l) => sum + l.outstandingBalance, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200">
              <div className="flex items-center gap-3 mb-3">
                <XCircle className="w-6 h-6 text-red-600" />
                <span className="font-medium text-gray-900">Overdue (31-90 days)</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {overdueLoans.filter(l => l.daysOverdue > 30 && l.daysOverdue <= 90).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Escalation required</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="w-6 h-6 text-green-600" />
                <span className="font-medium text-gray-900">Recovery Rate</span>
              </div>
              <p className="text-3xl font-bold text-green-600">{metrics.collectionRate}%</p>
              <p className="text-sm text-gray-600 mt-1">Last 30 days</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <Send className="w-6 h-6 text-blue-600" />
                <span className="font-medium text-gray-900">Reminders Sent</span>
              </div>
              <p className="text-3xl font-bold text-blue-600">24</p>
              <p className="text-sm text-gray-600 mt-1">Today via WhatsApp</p>
            </div>
          </div>

          {/* Send Bulk Reminders */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Overdue Payment Reminders</h3>
                <p className="text-sm text-gray-500 mt-1">Send WhatsApp reminders to all overdue borrowers</p>
              </div>
              <button
                onClick={handleSendReminders}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Send className="w-4 h-4" />
                Send All Reminders ({overdueLoans.length})
              </button>
            </div>
          </div>

          {/* Overdue Loans Table */}
          {overdueLoans.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Overdue Loans Requiring Action</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrower</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Outstanding</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Overdue</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maturity Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {overdueLoans.map(loan => (
                      <tr key={loan.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900">{loan.borrowerName}</p>
                            <p className="text-xs text-gray-500">{loan.phoneNumber}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-red-600">
                          KES {loan.outstandingBalance.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            loan.daysOverdue > 30 ? 'bg-red-200 text-red-800' : 'bg-red-100 text-red-700'
                          }`}>
                            +{loan.daysOverdue} days
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{loan.maturityDate}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => {
                                setWhatsAppRecipient(loan.phoneNumber);
                                setWhatsAppMessage(`URGENT: Dear ${loan.borrowerName}, your loan payment of KES ${loan.outstandingBalance.toLocaleString()} is ${loan.daysOverdue} days overdue. Please make payment immediately to avoid additional penalties and credit score impact.`);
                                setShowWhatsAppModal(true);
                              }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg" 
                              title="Send WhatsApp reminder"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Call borrower">
                              <Phone className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================ */}
      {/* DEPOSIT INSTRUMENTS TAB */}
      {/* Fully subscribed capital calls */}
      {/* ============================================ */}
      {activeTab === 'instruments' && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <Banknote className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Active Deposits</p>
                  <p className="text-2xl font-bold text-gray-900">{depositInstruments.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Total M2 Created</p>
                  <p className="text-2xl font-bold text-gray-900">
                    KES {(depositInstruments.reduce((sum, d) => sum + d.m2Created, 0) / 1000000).toFixed(0)}M
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Avg Deployment Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(depositInstruments.reduce((sum, d) => sum + d.deploymentRate, 0) / depositInstruments.length).toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-amber-200">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-amber-600" />
                <div>
                  <p className="text-sm text-gray-500">Maturing Soon</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {depositInstruments.filter(d => d.status === 'maturing').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Deposit Instruments Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Active Deposit Instruments</h3>
              <p className="text-sm text-gray-500 mt-1">Fully subscribed capital calls available for mobile lending deployment</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instrument</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Principal</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">M2 Created</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maturity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deployed</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {depositInstruments.map(deposit => (
                    <tr key={deposit.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-mono text-sm text-blue-600">{deposit.id}</p>
                          <p className="text-xs text-gray-500">{deposit.capitalCallId}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{deposit.investor}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{deposit.currency} {deposit.principalForeign.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">@ {deposit.depositRate}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-green-600">
                        KES {(deposit.m2Created / 1000000).toFixed(1)}M
                      </td>
                      <td className="px-4 py-3 text-gray-900">{deposit.interestRate}%</td>
                      <td className="px-4 py-3 text-gray-600">{deposit.tenor} months</td>
                      <td className="px-4 py-3 text-gray-600">{deposit.maturityDate}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${deposit.deploymentRate}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{deposit.deploymentRate}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          deposit.status === 'active' ? 'bg-green-100 text-green-700' :
                          deposit.status === 'maturing' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {deposit.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Forward Contract Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Forward Contract Hedging</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {depositInstruments.map(deposit => (
                <div key={deposit.id} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">{deposit.investor.split(' ')[0]}</p>
                  <p className="font-semibold text-gray-900">Forward: {deposit.forwardRate}</p>
                  <p className="text-sm text-gray-600">Premium: {deposit.forwardPremium}%</p>
                  <p className="text-xs text-green-600 mt-1">
                    Hedge Cost: KES {((deposit.m2Created * deposit.forwardPremium) / 100 / 1000000).toFixed(2)}M
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* SETTLEMENT TAB */}
      {/* Fully settled capital calls */}
      {/* ============================================ */}
      {activeTab === 'settlement' && (
        <div className="space-y-6">
          {/* Settlement Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Completed Settlements</p>
                  <p className="text-2xl font-bold text-gray-900">{settledCapitalCalls.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Total Repatriated</p>
                  <p className="text-2xl font-bold text-gray-900">
                    JPY {(settledCapitalCalls.filter(s => s.currency === 'JPY').reduce((sum, s) => sum + s.totalReturnedJPY, 0) / 1000000).toFixed(0)}M
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <ArrowRightLeft className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Net FX Impact</p>
                  <p className="text-2xl font-bold text-green-600">
                    +KES {(settledCapitalCalls.reduce((sum, s) => sum + s.fxGainLoss, 0) / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-amber-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-amber-600" />
                <div>
                  <p className="text-sm text-gray-500">Total Net P&L</p>
                  <p className="text-2xl font-bold text-green-600">
                    KES {(settledCapitalCalls.reduce((sum, s) => sum + s.netPL, 0) / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Settled Capital Calls Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Settled Capital Calls</h3>
              <p className="text-sm text-gray-500 mt-1">Completed capital call lifecycles with full redemption</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capital Call</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Principal</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Settled Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interest Paid</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">FX Impact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {settledCapitalCalls.map(settlement => (
                    <tr key={settlement.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-mono text-sm text-blue-600">{settlement.capitalCallId}</p>
                          <p className="text-xs text-gray-500">{settlement.id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{settlement.investor}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{settlement.currency} {settlement.principalForeign.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">KES {(settlement.principalKES / 1000000).toFixed(1)}M</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-900">{settlement.interestRate}%</td>
                      <td className="px-4 py-3 text-gray-600">{settlement.tenor} months</td>
                      <td className="px-4 py-3 text-gray-600">{settlement.settledDate}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {settlement.currency} {(settlement.currency === 'JPY' ? settlement.interestPaidJPY : settlement.interestPaidEUR)?.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            KES {(settlement.interestPaidKES / 1000000).toFixed(2)}M
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${settlement.fxGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {settlement.fxGainLoss >= 0 ? '+' : ''}KES {(settlement.fxGainLoss / 1000000).toFixed(2)}M
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-green-600">
                          KES {(settlement.netPL / 1000000).toFixed(2)}M
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Settlement Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {settledCapitalCalls.map(settlement => (
              <div key={settlement.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">{settlement.investor}</h4>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Settled</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Deposit Rate</span>
                    <span className="font-medium">{settlement.depositRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Redemption Rate</span>
                    <span className="font-medium">{settlement.redemptionRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Rate Difference</span>
                    <span className={`font-medium ${(settlement.redemptionRate - settlement.depositRate) < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {((settlement.redemptionRate - settlement.depositRate) * 100 / settlement.depositRate).toFixed(2)}%
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Returned</span>
                      <span className="font-bold text-gray-900">
                        {settlement.currency} {(settlement.currency === 'JPY' ? settlement.totalReturnedJPY : settlement.totalReturnedEUR)?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* ANALYTICS TAB */}
      {/* Capital call lifecycle profitability */}
      {/* ============================================ */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Analytics Overview */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Capital Call Lifecycle Analytics</h3>
            <p className="text-blue-100">Full P&L breakdown from capital call to redemption</p>
            <div className="grid grid-cols-4 gap-6 mt-6">
              <div>
                <p className="text-blue-200 text-sm">Total M2 Created</p>
                <p className="text-2xl font-bold">KES {(capitalCallAnalytics.reduce((sum, c) => sum + c.m2Created, 0) / 1000000).toFixed(0)}M</p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Total Interest Income</p>
                <p className="text-2xl font-bold">KES {(capitalCallAnalytics.reduce((sum, c) => sum + c.grossInterestIncome, 0) / 1000000).toFixed(0)}M</p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Total Net P&L</p>
                <p className="text-2xl font-bold">KES {(capitalCallAnalytics.reduce((sum, c) => sum + c.netPLProjected, 0) / 1000000).toFixed(0)}M</p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Average ROI</p>
                <p className="text-2xl font-bold">{(capitalCallAnalytics.reduce((sum, c) => sum + c.roi, 0) / capitalCallAnalytics.length).toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* Detailed Analytics Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Capital Call P&L Analysis</h3>
              <p className="text-sm text-gray-500 mt-1">Comprehensive breakdown of each capital call lifecycle</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capital Call</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Called Amount</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">M2 Created</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">FX Rate</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hedge Cost</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">M2 Deployed</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lending Rate</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">NPL</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Yield</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">FX Gain/Loss</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net P&L</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">ROI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {capitalCallAnalytics.map(analytics => (
                    <tr key={analytics.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3">
                        <div>
                          <p className="font-mono text-xs text-blue-600">{analytics.capitalCallId}</p>
                          <p className="text-xs text-gray-500">{analytics.investor.split(' ')[0]}</p>
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            analytics.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {analytics.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-medium">{analytics.calledCurrency} {(analytics.calledAmount / 1000000).toFixed(0)}M</p>
                      </td>
                      <td className="px-3 py-3 font-medium text-green-600">
                        KES {(analytics.m2Created / 1000000).toFixed(1)}M
                      </td>
                      <td className="px-3 py-3 text-gray-600">{analytics.depositExchangeRate}</td>
                      <td className="px-3 py-3 text-red-600">
                        KES {(analytics.forwardPremiumPaid / 1000000).toFixed(1)}M
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">KES {(analytics.m2Deployed / 1000000).toFixed(1)}M</span>
                          <span className="text-xs text-gray-500">({analytics.deploymentRatio}%)</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-gray-900">{analytics.avgLendingRate}%</td>
                      <td className="px-3 py-3">
                        <span className={`${analytics.nplRatio > 4 ? 'text-red-600' : 'text-green-600'}`}>
                          {analytics.nplRatio}%
                        </span>
                      </td>
                      <td className="px-3 py-3 font-medium text-green-600">{analytics.netYield}%</td>
                      <td className="px-3 py-3">
                        <span className={`font-medium ${analytics.projectedFxImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {analytics.projectedFxImpact >= 0 ? '+' : ''}KES {(analytics.projectedFxImpact / 1000000).toFixed(1)}M
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="font-bold text-green-600">
                          KES {(analytics.netPLProjected / 1000000).toFixed(1)}M
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                          {analytics.roi}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* P&L Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capitalCallAnalytics.slice(0, 2).map(analytics => (
              <div key={analytics.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{analytics.investor}</h4>
                      <p className="text-sm text-gray-500">{analytics.capitalCallId}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      analytics.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {analytics.status}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Inflow Section */}
                    <div>
                      <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <ArrowDownRight className="w-4 h-4 text-green-600" />
                        Capital Inflow
                      </h5>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Called</span>
                          <span className="font-medium">{analytics.calledCurrency} {(analytics.calledAmount / 1000000).toFixed(0)}M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">FX Rate</span>
                          <span className="font-medium">{analytics.depositExchangeRate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">M2 Created</span>
                          <span className="font-medium text-green-600">KES {(analytics.m2Created / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Hedge Premium</span>
                          <span className="font-medium text-red-600">-KES {(analytics.forwardPremiumPaid / 1000000).toFixed(1)}M</span>
                        </div>
                      </div>
                    </div>

                    {/* Lending Section */}
                    <div className="pt-4 border-t border-gray-100">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        Lending Operations
                      </h5>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Deployed</span>
                          <span className="font-medium">KES {(analytics.m2Deployed / 1000000).toFixed(1)}M ({analytics.deploymentRatio}%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Lending Rate</span>
                          <span className="font-medium">{analytics.avgLendingRate}% APR</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Interest Income</span>
                          <span className="font-medium text-green-600">+KES {(analytics.grossInterestIncome / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">NPL Ratio</span>
                          <span className={`font-medium ${analytics.nplRatio > 4 ? 'text-red-600' : 'text-green-600'}`}>{analytics.nplRatio}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Provisions</span>
                          <span className="font-medium text-red-600">-KES {(analytics.lessProvisions / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Net Yield</span>
                          <span className="font-medium text-green-600">{analytics.netYield}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Outflow Section */}
                    <div className="pt-4 border-t border-gray-100">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <ArrowUpRight className="w-4 h-4 text-purple-600" />
                        Capital Outflow
                      </h5>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Redemption Rate</span>
                          <span className="font-medium">{analytics.projectedRedemptionRate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Return Amount</span>
                          <span className="font-medium">{analytics.calledCurrency} {(analytics.projectedReturnJPY / 1000000).toFixed(0)}M</span>
                        </div>
                        <div className="flex justify-between col-span-2">
                          <span className="text-gray-500">FX Gain/Loss</span>
                          <span className={`font-medium ${analytics.projectedFxImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {analytics.projectedFxImpact >= 0 ? '+' : ''}KES {(analytics.projectedFxImpact / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="pt-4 border-t-2 border-gray-200 bg-gray-50 -mx-6 -mb-6 px-6 py-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm text-gray-500">Net P&L</span>
                          <p className="text-2xl font-bold text-green-600">KES {(analytics.netPLProjected / 1000000).toFixed(1)}M</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-500">ROI</span>
                          <p className="text-2xl font-bold text-blue-600">{analytics.roi}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* REPORTS TAB */}
      {/* ============================================ */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Lending Reports</h3>
            <p className="text-gray-600 mb-6">Select report type and parameters to generate customized lending operations reports.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: 'disbursement', title: 'Disbursement Report', desc: 'Daily/weekly/monthly disbursements', icon: TrendingUp, color: 'blue' },
                { id: 'collection', title: 'Collection Report', desc: 'Payment collections and recovery', icon: DollarSign, color: 'green' },
                { id: 'portfolio', title: 'Portfolio Quality Report', desc: 'NPL, PAR, and provisioning', icon: BarChart3, color: 'purple' },
                { id: 'aging', title: 'Aging Analysis Report', desc: 'Loan aging buckets and trends', icon: Clock, color: 'amber' },
                { id: 'performance', title: 'Performance Report', desc: 'Yield, margins, and profitability', icon: Target, color: 'indigo' },
                { id: 'borrower', title: 'Borrower Analysis', desc: 'Credit score and risk distribution', icon: Users, color: 'red' },
                { id: 'capitalcall', title: 'Capital Call P&L Report', desc: 'Full lifecycle profitability analysis', icon: Calculator, color: 'teal' },
                { id: 'deployment', title: 'M2 Deployment Report', desc: 'Deposit deployment and utilization', icon: Layers, color: 'cyan' },
                { id: 'fx', title: 'FX Hedging Report', desc: 'Forward contracts and FX impact', icon: ArrowRightLeft, color: 'pink' }
              ].map(report => (
                <button 
                  key={report.id}
                  onClick={() => setShowReportModal(true)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
                >
                  <report.icon className={`w-6 h-6 text-${report.color}-600 mb-2`} />
                  <p className="font-medium text-gray-900">{report.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{report.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats for Reports */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-4">Recent Reports Generated</h4>
              <div className="space-y-3">
                {[
                  { name: 'Daily Disbursement Report', date: 'Jan 1, 2025', status: 'completed' },
                  { name: 'Weekly Collection Summary', date: 'Dec 29, 2024', status: 'completed' },
                  { name: 'Monthly Portfolio Report', date: 'Dec 31, 2024', status: 'completed' }
                ].map((report, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{report.name}</p>
                      <p className="text-xs text-gray-500">{report.date}</p>
                    </div>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-4">Scheduled Reports</h4>
              <div className="space-y-3">
                {[
                  { name: 'Daily Operations Summary', schedule: 'Every day at 6:00 PM', active: true },
                  { name: 'Weekly NPL Report', schedule: 'Every Monday at 9:00 AM', active: true },
                  { name: 'Monthly P&L Report', schedule: '1st of every month', active: false }
                ].map((report, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{report.name}</p>
                      <p className="text-xs text-gray-500">{report.schedule}</p>
                    </div>
                    <Toggle enabled={report.active} onChange={() => {}} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* NOTIFICATIONS TAB */}
      {/* ============================================ */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          {/* Notification Categories */}
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'all', label: 'All', count: notifications.length },
              { id: 'application', label: 'Applications', count: notifications.filter(n => n.category === 'application').length },
              { id: 'approval', label: 'Approvals', count: notifications.filter(n => n.category === 'approval').length },
              { id: 'collection', label: 'Collections', count: notifications.filter(n => n.category === 'collection').length },
              { id: 'risk', label: 'Risk Alerts', count: notifications.filter(n => n.category === 'risk').length },
              { id: 'deposit', label: 'Deposits', count: notifications.filter(n => n.category === 'deposit').length },
              { id: 'fx', label: 'FX Alerts', count: notifications.filter(n => n.category === 'fx').length },
              { id: 'default', label: 'Defaults', count: notifications.filter(n => n.category === 'default').length }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setNotificationFilter(cat.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${
                  notificationFilter === cat.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat.label}
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                  notificationFilter === cat.id ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Lending Notifications</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {unreadNotifications.length} unread notifications
                  </p>
                </div>
                <button 
                  onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Mark all as read
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {notifications
                .filter(n => notificationFilter === 'all' || n.category === notificationFilter)
                .map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      notification.type === 'error' ? 'bg-red-100' :
                      notification.type === 'warning' ? 'bg-amber-100' :
                      notification.type === 'success' ? 'bg-green-100' :
                      'bg-blue-100'
                    }`}>
                      {notification.type === 'error' ? <XCircle className="w-5 h-5 text-red-600" /> :
                       notification.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-amber-600" /> :
                       notification.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                       <Bell className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{notification.title}</p>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{notification.category}</span>
                        </div>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* SETTINGS TAB */}
      {/* ============================================ */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Loan Parameters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Loan Parameters</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Loan Amount (KES)</label>
                    <input 
                      type="number" 
                      value={settings.minLoanAmount} 
                      onChange={(e) => updateSetting('minLoanAmount', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Loan Amount (KES)</label>
                    <input 
                      type="number" 
                      value={settings.maxLoanAmount} 
                      onChange={(e) => updateSetting('maxLoanAmount', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Duration (days)</label>
                    <input 
                      type="number" 
                      value={settings.minDuration} 
                      onChange={(e) => updateSetting('minDuration', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Duration (days)</label>
                    <input 
                      type="number" 
                      value={settings.maxDuration} 
                      onChange={(e) => updateSetting('maxDuration', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Interest Rates */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                <Percent className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Interest Rates</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Interest Rate (% APR)</label>
                  <input 
                    type="number" 
                    value={settings.baseInterestRate} 
                    onChange={(e) => updateSetting('baseInterestRate', parseInt(e.target.value))} 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Low Risk Premium</label>
                    <input 
                      type="number" 
                      value={settings.riskPremiumLow} 
                      onChange={(e) => updateSetting('riskPremiumLow', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medium Risk Premium</label>
                    <input 
                      type="number" 
                      value={settings.riskPremiumMedium} 
                      onChange={(e) => updateSetting('riskPremiumMedium', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">High Risk Premium</label>
                    <input 
                      type="number" 
                      value={settings.riskPremiumHigh} 
                      onChange={(e) => updateSetting('riskPremiumHigh', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Late Payment Penalty (%)</label>
                    <input 
                      type="number" 
                      value={settings.latePaymentPenalty} 
                      onChange={(e) => updateSetting('latePaymentPenalty', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grace Period (days)</label>
                    <input 
                      type="number" 
                      value={settings.gracePeriodDays} 
                      onChange={(e) => updateSetting('gracePeriodDays', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-Approval Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                <Zap className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Auto-Approval Settings</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Enable Auto-Approval</p>
                    <p className="text-sm text-gray-500">Automatically approve eligible applications</p>
                  </div>
                  <Toggle 
                    enabled={settings.autoApprovalEnabled} 
                    onChange={() => updateSetting('autoApprovalEnabled', !settings.autoApprovalEnabled)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Auto-Approval Amount (KES)</label>
                  <input 
                    type="number" 
                    value={settings.autoApprovalMaxAmount} 
                    onChange={(e) => updateSetting('autoApprovalMaxAmount', parseInt(e.target.value))} 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    disabled={!settings.autoApprovalEnabled}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Credit Score for Auto-Approval</label>
                  <input 
                    type="number" 
                    value={settings.autoApprovalMinCreditScore} 
                    onChange={(e) => updateSetting('autoApprovalMinCreditScore', parseInt(e.target.value))} 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    disabled={!settings.autoApprovalEnabled}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Require KYC Verification</p>
                    <p className="text-sm text-gray-500">Only auto-approve verified borrowers</p>
                  </div>
                  <Toggle 
                    enabled={settings.autoApprovalRequireKYC} 
                    onChange={() => updateSetting('autoApprovalRequireKYC', !settings.autoApprovalRequireKYC)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Debt-to-Income Ratio (%)</label>
                  <input 
                    type="number" 
                    value={settings.maxDebtToIncome} 
                    onChange={(e) => updateSetting('maxDebtToIncome', parseInt(e.target.value))} 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                  />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Notification Settings</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">WhatsApp Notifications</p>
                      <p className="text-sm text-gray-500">Send loan updates via WhatsApp</p>
                    </div>
                  </div>
                  <Toggle 
                    enabled={settings.whatsappNotifications} 
                    onChange={() => updateSetting('whatsappNotifications', !settings.whatsappNotifications)} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">SMS Notifications</p>
                      <p className="text-sm text-gray-500">Send loan updates via SMS</p>
                    </div>
                  </div>
                  <Toggle 
                    enabled={settings.smsNotifications} 
                    onChange={() => updateSetting('smsNotifications', !settings.smsNotifications)} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Send loan updates via email</p>
                    </div>
                  </div>
                  <Toggle 
                    enabled={settings.emailNotifications} 
                    onChange={() => updateSetting('emailNotifications', !settings.emailNotifications)} 
                  />
                </div>
              </div>
            </div>

            {/* M2 Deployment Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                <Layers className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">M2 Deployment Settings</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Deployment Ratio (%)</label>
                    <input 
                      type="number" 
                      value={settings.targetDeploymentRatio} 
                      onChange={(e) => updateSetting('targetDeploymentRatio', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Liquidity Buffer (%)</label>
                    <input 
                      type="number" 
                      value={settings.minLiquidityBuffer} 
                      onChange={(e) => updateSetting('minLiquidityBuffer', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Single Borrower Exposure (KES)</label>
                  <input 
                    type="number" 
                    value={settings.maxSingleBorrowerExposure} 
                    onChange={(e) => updateSetting('maxSingleBorrowerExposure', parseInt(e.target.value))} 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                  />
                </div>
              </div>
            </div>

            {/* FX Hedging Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                <ArrowRightLeft className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">FX Hedging Settings</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Auto-Hedge New Deposits</p>
                    <p className="text-sm text-gray-500">Automatically hedge FX exposure on new deposits</p>
                  </div>
                  <Toggle 
                    enabled={settings.autoHedgeEnabled} 
                    onChange={() => updateSetting('autoHedgeEnabled', !settings.autoHedgeEnabled)} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Hedge Premium (%)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={settings.maxHedgePremium} 
                      onChange={(e) => updateSetting('maxHedgePremium', parseFloat(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hedge Ratio (%)</label>
                    <input 
                      type="number" 
                      value={settings.hedgeRatio} 
                      onChange={(e) => updateSetting('hedgeRatio', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Provisioning Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Provisioning Rules</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Watchlist Provision (%)</label>
                    <input 
                      type="number" 
                      value={settings.watchlistProvision} 
                      onChange={(e) => updateSetting('watchlistProvision', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Substandard Provision (%)</label>
                    <input 
                      type="number" 
                      value={settings.substandardProvision} 
                      onChange={(e) => updateSetting('substandardProvision', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Doubtful Provision (%)</label>
                    <input 
                      type="number" 
                      value={settings.doubtfulProvision} 
                      onChange={(e) => updateSetting('doubtfulProvision', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loss Provision (%)</label>
                    <input 
                      type="number" 
                      value={settings.lossProvision} 
                      onChange={(e) => updateSetting('lossProvision', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Collection Workflow Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Collection Workflow</h3>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-500 mb-2">Configure when automated reminders and escalations occur</p>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">1st Reminder (day)</label>
                    <input 
                      type="number" 
                      value={settings.reminderDay1} 
                      onChange={(e) => updateSetting('reminderDay1', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">2nd Reminder (day)</label>
                    <input 
                      type="number" 
                      value={settings.reminderDay2} 
                      onChange={(e) => updateSetting('reminderDay2', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">3rd Reminder (day)</label>
                    <input 
                      type="number" 
                      value={settings.reminderDay3} 
                      onChange={(e) => updateSetting('reminderDay3', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Escalation (day)</label>
                    <input 
                      type="number" 
                      value={settings.escalationDay} 
                      onChange={(e) => updateSetting('escalationDay', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Classification (day)</label>
                  <input 
                    type="number" 
                    value={settings.defaultDay} 
                    onChange={(e) => updateSetting('defaultDay', parseInt(e.target.value))} 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                  />
                  <p className="text-xs text-gray-500 mt-1">Loans overdue by this many days are classified as defaulted</p>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* MODALS */}
      {/* ============================================ */}

      {/* Application Details Modal */}
      <Modal isOpen={showApplicationModal} onClose={() => setShowApplicationModal(false)} title="Loan Application Details" size="lg">
        {selectedApplication && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedApplication.borrowerName}</h3>
                <p className="text-gray-500">{selectedApplication.phoneNumber}</p>
              </div>
              <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(selectedApplication.riskRating)}`}>
                {selectedApplication.riskRating.toUpperCase()} RISK
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Amount Requested</p>
                <p className="text-xl font-bold">KES {selectedApplication.amountRequested.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Duration</p>
                <p className="text-xl font-bold">{selectedApplication.durationDays} days</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Credit Score</p>
                <p className="text-xl font-bold">{selectedApplication.creditScore}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Monthly Income</p>
                <p className="text-xl font-bold">KES {selectedApplication.monthlyIncome.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Purpose</p>
                <p className="font-semibold">{selectedApplication.purpose}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">KYC Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedApplication.kycStatus === 'verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {selectedApplication.kycStatus}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => { handleApprove(selectedApplication.id); setShowApplicationModal(false); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Check className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={() => { handleReject(selectedApplication.id); setShowApplicationModal(false); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <X className="w-4 h-4" />
                Reject
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Loan Details Modal */}
      <Modal isOpen={showLoanModal} onClose={() => setShowLoanModal(false)} title="Loan Details" size="lg">
        {selectedLoan && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedLoan.borrowerName}</h3>
                <p className="text-gray-500">{selectedLoan.phoneNumber}</p>
              </div>
              <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedLoan.status)}`}>
                {selectedLoan.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Principal</p>
                <p className="text-xl font-bold">KES {selectedLoan.principalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Outstanding</p>
                <p className="text-xl font-bold text-red-600">KES {selectedLoan.outstandingBalance.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">APR</p>
                <p className="text-xl font-bold">{selectedLoan.apr}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Maturity Date</p>
                <p className="text-xl font-bold">{selectedLoan.maturityDate}</p>
              </div>
            </div>

            {selectedLoan.daysOverdue > 0 && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="font-medium text-red-800">This loan is {selectedLoan.daysOverdue} days overdue</p>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setWhatsAppRecipient(selectedLoan.phoneNumber);
                  setWhatsAppMessage(`Dear ${selectedLoan.borrowerName}, this is a reminder about your loan. Outstanding balance: KES ${selectedLoan.outstandingBalance.toLocaleString()}. Please contact us if you need assistance.`);
                  setShowWhatsAppModal(true);
                  setShowLoanModal(false);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <MessageSquare className="w-4 h-4" />
                Send WhatsApp Message
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* WhatsApp Notification Modal */}
      <Modal isOpen={showWhatsAppModal} onClose={() => setShowWhatsAppModal(false)} title="WhatsApp Notification" size="md">
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">WhatsApp Message Preview</span>
            </div>
            <p className="text-sm text-gray-600">To: {whatsAppRecipient}</p>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-800 whitespace-pre-wrap">{whatsAppMessage}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowWhatsAppModal(false)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                console.log(`Sending WhatsApp to ${whatsAppRecipient}: ${whatsAppMessage}`);
                setShowWhatsAppModal(false);
                // Add success notification
                const newNotification = {
                  id: Date.now(),
                  title: 'WhatsApp Sent',
                  message: `Message sent to ${whatsAppRecipient}`,
                  time: 'Just now',
                  type: 'success',
                  read: false
                };
                setNotifications([newNotification, ...notifications]);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </div>
        </div>
      </Modal>

      {/* Report Generation Modal */}
      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Generate Report" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
              <option>Disbursement Report</option>
              <option>Collection Report</option>
              <option>Portfolio Quality Report</option>
              <option>Aging Analysis Report</option>
              <option>Performance Report</option>
              <option>Borrower Analysis</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
              <option>PDF</option>
              <option>Excel (XLSX)</option>
              <option>CSV</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowReportModal(false)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowReportModal(false);
                const newNotification = {
                  id: Date.now(),
                  title: 'Report Generated',
                  message: 'Your report is ready for download',
                  time: 'Just now',
                  type: 'success',
                  read: false
                };
                setNotifications([newNotification, ...notifications]);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BankLenderDashboard;
