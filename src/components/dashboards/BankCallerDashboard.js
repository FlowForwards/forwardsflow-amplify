// BankCallerDashboard.js - Capital Markets Officer Dashboard
// Enhanced with universal sample database, URL-based tab routing
// Focus: Capital calling from impact investors (M1) - NO mobile lending functions

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  TrendingUp, DollarSign, Landmark, Clock, CheckCircle, Plus, Eye, Edit,
  RefreshCw, Search, ArrowUpRight, ArrowDownRight, Calendar, Users, FileText,
  MessageSquare, Send, Settings, Bell, BarChart3, X, Save, Wallet, CreditCard,
  Globe, Percent, Target, Download, Filter, AlertTriangle, Activity, Building2,
  ArrowRightLeft, Banknote, PieChart as PieChartIcon, Calculator, Receipt,
  ExternalLink, CheckCircle2, XCircle, AlertCircle, Briefcase, TrendingDown,
  Layers, Shield, Timer, Zap, Phone, Mail
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend, ComposedChart
} from 'recharts';
import AmazonQChat from '../chat/AmazonQChat';

// ============================================
// UNIVERSAL SAMPLE DATABASE
// Consistent with platform overview data
// Focus: Capital Markets / Impact Investor deposits
// ============================================
const SAMPLE_DATABASE = {
  // Capital Markets Overview Metrics
  capitalMetrics: {
    totalCapitalRaised: 250000000, // JPY 250M
    totalCapitalDeployed: 237500000, // JPY 237.5M (95% deployed)
    activeDepositCalls: 4,
    fullySubscribedCalls: 8,
    pendingSettlements: 2,
    completedSettlements: 6,
    avgYield: 8.5,
    avgTenor: 12, // months
    activeInvestors: 7,
    totalInvestorRelationships: 12
  },

  // Capital Calls
  capitalCalls: [
    {
      id: 'CC-2025-001',
      instrumentType: 'Fixed Deposit',
      currencyPair: 'KES:JPY',
      currency: 'JPY',
      principalAmount: 75000000,
      targetAmount: 75000000,
      subscribedAmount: 75000000,
      subscriptionPercentage: 100,
      interestRate: 9.0,
      forwardsPremium: 6.86,
      totalYield: 9.0,
      tenor: 18,
      status: 'fully_subscribed',
      createdAt: '2024-01-20',
      maturityDate: '2025-07-20',
      investors: ['Nordic Impact Fund'],
      description: 'Q1 2024 Capital Call - SME Lending'
    },
    {
      id: 'CC-2025-002',
      instrumentType: 'Fixed Deposit',
      currencyPair: 'KES:JPY',
      currency: 'JPY',
      principalAmount: 50000000,
      targetAmount: 50000000,
      subscribedAmount: 50000000,
      subscriptionPercentage: 100,
      interestRate: 8.5,
      forwardsPremium: 4.85,
      totalYield: 8.5,
      tenor: 12,
      status: 'fully_subscribed',
      createdAt: '2024-03-15',
      maturityDate: '2025-03-15',
      investors: ['Sakura Capital Partners'],
      description: 'Q1 2024 Capital Call - Mobile Lending Expansion'
    },
    {
      id: 'CC-2025-003',
      instrumentType: 'Fixed Deposit',
      currencyPair: 'KES:JPY',
      currency: 'JPY',
      principalAmount: 25000000,
      targetAmount: 25000000,
      subscribedAmount: 25000000,
      subscriptionPercentage: 100,
      interestRate: 7.5,
      forwardsPremium: 2.91,
      totalYield: 7.5,
      tenor: 6,
      status: 'maturing',
      createdAt: '2024-09-01',
      maturityDate: '2025-03-01',
      investors: ['Geneva Wealth Partners'],
      description: 'Q3 2024 Capital Call - Short-term Facility'
    },
    {
      id: 'CC-2025-004',
      instrumentType: 'Fixed Deposit',
      currencyPair: 'KES:JPY',
      currency: 'JPY',
      principalAmount: 100000000,
      targetAmount: 100000000,
      subscribedAmount: 100000000,
      subscriptionPercentage: 100,
      interestRate: 8.0,
      forwardsPremium: 5.88,
      totalYield: 8.0,
      tenor: 12,
      status: 'fully_subscribed',
      createdAt: '2024-06-10',
      maturityDate: '2025-06-10',
      investors: ['Singapore Sovereign Fund'],
      description: 'Q2 2024 Capital Call - Agricultural Lending'
    },
    {
      id: 'CC-2025-005',
      instrumentType: 'Fixed Deposit',
      currencyPair: 'KES:JPY',
      currency: 'JPY',
      principalAmount: 60000000,
      targetAmount: 80000000,
      subscribedAmount: 60000000,
      subscriptionPercentage: 75,
      interestRate: 8.75,
      forwardsPremium: 5.2,
      totalYield: 8.75,
      tenor: 12,
      status: 'partially_subscribed',
      createdAt: '2024-12-01',
      maturityDate: '2025-12-01',
      investors: ['Tokyo Investment Trust', 'Osaka Capital'],
      description: 'Q4 2024 Capital Call - Clean Energy Lending'
    },
    {
      id: 'CC-2025-006',
      instrumentType: 'Fixed Deposit',
      currencyPair: 'KES:JPY',
      currency: 'JPY',
      principalAmount: 0,
      targetAmount: 50000000,
      subscribedAmount: 0,
      subscriptionPercentage: 0,
      interestRate: 9.25,
      forwardsPremium: 5.5,
      totalYield: 9.25,
      tenor: 18,
      status: 'open',
      createdAt: '2025-01-02',
      maturityDate: '2026-07-02',
      investors: [],
      description: 'Q1 2025 Capital Call - Financial Inclusion Initiative'
    }
  ],

  // Deposit Instruments (Investor deposits against capital calls)
  depositInstruments: [
    {
      id: 'DEP-001',
      capitalCallId: 'CC-2025-002',
      investor: 'Sakura Capital Partners',
      investorType: 'Impact Investment Fund',
      currency: 'JPY',
      depositAmount: 50000000,
      depositRate: 0.0103,
      kesEquivalent: 51500000,
      interestRate: 8.5,
      tenor: 12,
      depositDate: '2024-03-15',
      maturityDate: '2025-03-15',
      status: 'active',
      accruedInterest: 3541667,
      forwardRate: 0.0098,
      forwardPremium: 4.85
    },
    {
      id: 'DEP-002',
      capitalCallId: 'CC-2025-001',
      investor: 'Nordic Impact Fund',
      investorType: 'Development Finance',
      currency: 'JPY',
      depositAmount: 75000000,
      depositRate: 0.0102,
      kesEquivalent: 76500000,
      interestRate: 9.0,
      tenor: 18,
      depositDate: '2024-01-20',
      maturityDate: '2025-07-20',
      status: 'active',
      accruedInterest: 6375000,
      forwardRate: 0.0095,
      forwardPremium: 6.86
    },
    {
      id: 'DEP-003',
      capitalCallId: 'CC-2025-003',
      investor: 'Geneva Wealth Partners',
      investorType: 'Family Office',
      currency: 'JPY',
      depositAmount: 25000000,
      depositRate: 0.0103,
      kesEquivalent: 25750000,
      interestRate: 7.5,
      tenor: 6,
      depositDate: '2024-09-01',
      maturityDate: '2025-03-01',
      status: 'maturing',
      accruedInterest: 781250,
      forwardRate: 0.0100,
      forwardPremium: 2.91
    },
    {
      id: 'DEP-004',
      capitalCallId: 'CC-2025-004',
      investor: 'Singapore Sovereign Fund',
      investorType: 'Sovereign Wealth Fund',
      currency: 'JPY',
      depositAmount: 100000000,
      depositRate: 0.0102,
      kesEquivalent: 102000000,
      interestRate: 8.0,
      tenor: 12,
      depositDate: '2024-06-10',
      maturityDate: '2025-06-10',
      status: 'active',
      accruedInterest: 4666667,
      forwardRate: 0.0096,
      forwardPremium: 5.88
    },
    {
      id: 'DEP-005',
      capitalCallId: 'CC-2025-005',
      investor: 'Tokyo Investment Trust',
      investorType: 'Investment Trust',
      currency: 'JPY',
      depositAmount: 40000000,
      depositRate: 0.0101,
      kesEquivalent: 40400000,
      interestRate: 8.75,
      tenor: 12,
      depositDate: '2024-12-01',
      maturityDate: '2025-12-01',
      status: 'active',
      accruedInterest: 291667,
      forwardRate: 0.0096,
      forwardPremium: 5.2
    },
    {
      id: 'DEP-006',
      capitalCallId: 'CC-2025-005',
      investor: 'Osaka Capital',
      investorType: 'Private Equity',
      currency: 'JPY',
      depositAmount: 20000000,
      depositRate: 0.0101,
      kesEquivalent: 20200000,
      interestRate: 8.75,
      tenor: 12,
      depositDate: '2024-12-15',
      maturityDate: '2025-12-15',
      status: 'active',
      accruedInterest: 97222,
      forwardRate: 0.0096,
      forwardPremium: 5.2
    }
  ],

  // Settlements (Completed redemptions/repatriations)
  settlements: [
    {
      id: 'SET-001',
      capitalCallId: 'CC-2023-001',
      investor: 'Tokyo Investment Trust',
      currency: 'JPY',
      principalAmount: 40000000,
      interestPaid: 3200000,
      totalReturned: 43200000,
      depositRate: 0.0102,
      redemptionRate: 0.0098,
      fxGainLoss: 1632000,
      settlementDate: '2024-01-15',
      status: 'completed',
      tenor: 12,
      interestRate: 8.0
    },
    {
      id: 'SET-002',
      capitalCallId: 'CC-2023-002',
      investor: 'European Development Fund',
      currency: 'EUR',
      principalAmount: 500000,
      interestPaid: 28125,
      totalReturned: 528125,
      depositRate: 125.0,
      redemptionRate: 128.5,
      fxGainLoss: -1750000,
      settlementDate: '2023-12-01',
      status: 'completed',
      tenor: 9,
      interestRate: 7.5
    },
    {
      id: 'SET-003',
      capitalCallId: 'CC-2023-003',
      investor: 'Osaka Capital',
      currency: 'JPY',
      principalAmount: 30000000,
      interestPaid: 1275000,
      totalReturned: 31275000,
      depositRate: 0.0102,
      redemptionRate: 0.0100,
      fxGainLoss: 612000,
      settlementDate: '2023-12-01',
      status: 'completed',
      tenor: 6,
      interestRate: 8.5
    },
    {
      id: 'SET-004',
      capitalCallId: 'CC-2024-001',
      investor: 'Shell Foundation',
      currency: 'JPY',
      principalAmount: 60000000,
      interestPaid: 4500000,
      totalReturned: 64500000,
      depositRate: 0.0103,
      redemptionRate: 0.0099,
      fxGainLoss: 2580000,
      settlementDate: '2024-06-15',
      status: 'completed',
      tenor: 12,
      interestRate: 7.5
    },
    {
      id: 'SET-005',
      capitalCallId: 'CC-2025-003',
      investor: 'Geneva Wealth Partners',
      currency: 'JPY',
      principalAmount: 25000000,
      interestPaid: 937500,
      totalReturned: 25937500,
      depositRate: 0.0103,
      redemptionRate: null,
      fxGainLoss: null,
      settlementDate: '2025-03-01',
      status: 'pending',
      tenor: 6,
      interestRate: 7.5
    },
    {
      id: 'SET-006',
      capitalCallId: 'CC-2025-002',
      investor: 'Sakura Capital Partners',
      currency: 'JPY',
      principalAmount: 50000000,
      interestPaid: 4250000,
      totalReturned: 54250000,
      depositRate: 0.0103,
      redemptionRate: null,
      fxGainLoss: null,
      settlementDate: '2025-03-15',
      status: 'pending',
      tenor: 12,
      interestRate: 8.5
    }
  ],

  // Capital Call Analytics
  callAnalytics: {
    monthlyRaised: [
      { month: 'Aug', raised: 0, target: 50 },
      { month: 'Sep', raised: 25, target: 50 },
      { month: 'Oct', raised: 0, target: 50 },
      { month: 'Nov', raised: 0, target: 50 },
      { month: 'Dec', raised: 60, target: 80 },
      { month: 'Jan', raised: 0, target: 50 }
    ],
    byInvestorType: [
      { type: 'Impact Investment Fund', value: 125000000, color: '#8B5CF6' },
      { type: 'Sovereign Wealth Fund', value: 100000000, color: '#3B82F6' },
      { type: 'Development Finance', value: 75000000, color: '#10B981' },
      { type: 'Family Office', value: 25000000, color: '#F59E0B' },
      { type: 'Investment Trust', value: 40000000, color: '#EF4444' }
    ],
    byTenor: [
      { tenor: '6 months', value: 25000000 },
      { tenor: '12 months', value: 210000000 },
      { tenor: '18 months', value: 75000000 }
    ],
    yieldTrend: [
      { month: 'Jul', avgYield: 7.8 },
      { month: 'Aug', avgYield: 8.0 },
      { month: 'Sep', avgYield: 8.2 },
      { month: 'Oct', avgYield: 8.3 },
      { month: 'Nov', avgYield: 8.5 },
      { month: 'Dec', avgYield: 8.75 }
    ]
  },

  // Investor relationships
  investors: [
    { id: 'INV-001', name: 'Sakura Capital Partners', type: 'Impact Investment Fund', country: 'Japan', totalDeposited: 50000000, activeDeposits: 1, status: 'active' },
    { id: 'INV-002', name: 'Nordic Impact Fund', type: 'Development Finance', country: 'Sweden', totalDeposited: 75000000, activeDeposits: 1, status: 'active' },
    { id: 'INV-003', name: 'Geneva Wealth Partners', type: 'Family Office', country: 'Switzerland', totalDeposited: 25000000, activeDeposits: 1, status: 'active' },
    { id: 'INV-004', name: 'Singapore Sovereign Fund', type: 'Sovereign Wealth Fund', country: 'Singapore', totalDeposited: 100000000, activeDeposits: 1, status: 'active' },
    { id: 'INV-005', name: 'Tokyo Investment Trust', type: 'Investment Trust', country: 'Japan', totalDeposited: 80000000, activeDeposits: 1, status: 'active' },
    { id: 'INV-006', name: 'Osaka Capital', type: 'Private Equity', country: 'Japan', totalDeposited: 50000000, activeDeposits: 1, status: 'active' },
    { id: 'INV-007', name: 'Shell Foundation', type: 'Corporate Foundation', country: 'UK', totalDeposited: 60000000, activeDeposits: 0, status: 'inactive' }
  ],

  // Notifications
  notifications: [
    { id: 1, title: 'New Subscription', message: 'Osaka Capital subscribed JPY 20M to CC-2025-005', time: '2 hours ago', type: 'success', read: false, category: 'subscription' },
    { id: 2, title: 'Call 75% Subscribed', message: 'CC-2025-005 has reached 75% subscription', time: '2 hours ago', type: 'info', read: false, category: 'milestone' },
    { id: 3, title: 'Settlement Due', message: 'Geneva Wealth Partners settlement due in 60 days', time: '1 day ago', type: 'warning', read: false, category: 'settlement' },
    { id: 4, title: 'New Investor Interest', message: 'Dubai Investment Authority inquiring about CC-2025-006', time: '1 day ago', type: 'info', read: true, category: 'inquiry' },
    { id: 5, title: 'Call Fully Subscribed', message: 'CC-2025-004 is now fully subscribed at JPY 100M', time: '2 days ago', type: 'success', read: true, category: 'subscription' },
    { id: 6, title: 'Forward Contract Executed', message: 'Hedge position established for CC-2025-004', time: '3 days ago', type: 'success', read: true, category: 'hedging' },
    { id: 7, title: 'Maturity Alert', message: 'CC-2025-003 matures in 60 days - prepare settlement', time: '5 days ago', type: 'warning', read: true, category: 'settlement' },
    { id: 8, title: 'New Call Created', message: 'CC-2025-006 created for JPY 50M targeting Q1 2025', time: '1 week ago', type: 'info', read: true, category: 'call' }
  ],

  // Capital calling settings
  callingSettings: {
    // Ticket Settings
    minimumTicketSize: 10000000, // JPY 10M minimum
    maximumTicketSize: 200000000, // JPY 200M maximum
    preferredTicketSize: 50000000, // JPY 50M preferred
    // Call Parameters
    defaultTenor: 12, // months
    minTenor: 6,
    maxTenor: 24,
    defaultCoupon: 8.5, // % interest rate
    minCoupon: 7.0,
    maxCoupon: 12.0,
    // FX Hedging
    autoHedgeEnabled: true,
    defaultHedgeRatio: 100, // % of principal hedged
    maxForwardPremium: 8.0, // max acceptable forward premium %
    preferredCurrencies: ['JPY', 'CHF', 'EUR'],
    // Automated Acceptance
    autoAcceptEnabled: false,
    autoAcceptMaxAmount: 50000000,
    autoAcceptMinRating: 'A',
    requireKYCVerification: true,
    // Notifications
    emailNotifications: true,
    whatsappNotifications: true,
    subscriptionAlerts: true,
    maturityAlerts: true,
    alertDaysBeforeMaturity: 60
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
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600'
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
              <span>{Math.abs(trend)}% vs last quarter</span>
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
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-indigo-600' : 'bg-gray-300'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

// ============================================
// URL PATH TO TAB MAPPING
// ============================================
const getTabFromPath = (pathname) => {
  if (pathname.includes('/create')) return 'create';
  if (pathname.includes('/calls') && !pathname.includes('/create')) return 'calls';
  if (pathname.includes('/deposits') || pathname.includes('/instruments')) return 'deposits';
  if (pathname.includes('/settlements') || pathname.includes('/settlement')) return 'settlements';
  if (pathname.includes('/analytics')) return 'analytics';
  if (pathname.includes('/reports')) return 'reports';
  if (pathname.includes('/notifications')) return 'notifications';
  if (pathname.includes('/settings')) return 'settings';
  if (pathname.includes('/investors')) return 'investors';
  return 'overview';
};

// ============================================
// MAIN BANK CALLER DASHBOARD
// ============================================
const BankCallerDashboard = () => {
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
  const [metrics] = useState(SAMPLE_DATABASE.capitalMetrics);
  const [capitalCalls, setCapitalCalls] = useState(SAMPLE_DATABASE.capitalCalls);
  const [depositInstruments] = useState(SAMPLE_DATABASE.depositInstruments);
  const [settlements] = useState(SAMPLE_DATABASE.settlements);
  const [callAnalytics] = useState(SAMPLE_DATABASE.callAnalytics);
  const [investors] = useState(SAMPLE_DATABASE.investors);
  const [notifications, setNotifications] = useState(SAMPLE_DATABASE.notifications);
  const [settings, setSettings] = useState(SAMPLE_DATABASE.callingSettings);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notificationFilter, setNotificationFilter] = useState('all');
  
  // Modal states
  const [showCreateCallModal, setShowCreateCallModal] = useState(false);
  const [showCallDetailModal, setShowCallDetailModal] = useState(false);
  const [showDepositDetailModal, setShowDepositDetailModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  
  // New call form state
  const [newCall, setNewCall] = useState({
    instrumentType: 'Fixed Deposit',
    currencyPair: 'KES:JPY',
    targetAmount: '',
    interestRate: settings.defaultCoupon,
    tenor: settings.defaultTenor,
    forwardsPremium: '',
    description: ''
  });

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
    const tabToPath = {
      overview: '/bank/capital',
      create: '/bank/capital/calls/create',
      calls: '/bank/capital/calls',
      deposits: '/bank/capital/deposits',
      settlements: '/bank/capital/settlements',
      analytics: '/bank/capital/analytics',
      reports: '/bank/capital/reports',
      notifications: '/bank/capital/notifications',
      settings: '/bank/capital/settings',
      investors: '/bank/capital/investors'
    };
    if (tabToPath[tabId]) {
      navigate(tabToPath[tabId]);
    }
  };

  // Create new capital call
  const handleCreateCall = () => {
    const newCallData = {
      id: `CC-2025-${String(capitalCalls.length + 1).padStart(3, '0')}`,
      instrumentType: newCall.instrumentType,
      currencyPair: newCall.currencyPair,
      currency: newCall.currencyPair.split(':')[1],
      principalAmount: 0,
      targetAmount: parseInt(newCall.targetAmount),
      subscribedAmount: 0,
      subscriptionPercentage: 0,
      interestRate: parseFloat(newCall.interestRate),
      forwardsPremium: parseFloat(newCall.forwardsPremium) || 5.0,
      totalYield: parseFloat(newCall.interestRate),
      tenor: parseInt(newCall.tenor),
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0],
      maturityDate: new Date(Date.now() + parseInt(newCall.tenor) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      investors: [],
      description: newCall.description
    };
    
    setCapitalCalls([newCallData, ...capitalCalls]);
    setShowCreateCallModal(false);
    
    // Add notification
    const notification = {
      id: Date.now(),
      title: 'New Call Created',
      message: `${newCallData.id} created for ${newCallData.currency} ${(newCallData.targetAmount / 1000000).toFixed(0)}M`,
      time: 'Just now',
      type: 'success',
      read: false,
      category: 'call'
    };
    setNotifications([notification, ...notifications]);
    
    // Reset form
    setNewCall({
      instrumentType: 'Fixed Deposit',
      currencyPair: 'KES:JPY',
      targetAmount: '',
      interestRate: settings.defaultCoupon,
      tenor: settings.defaultTenor,
      forwardsPremium: '',
      description: ''
    });
  };

  // Settings update
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Computed values
  const openCalls = capitalCalls.filter(c => c.status === 'open' || c.status === 'partially_subscribed');
  const fullySubscribedCalls = capitalCalls.filter(c => c.status === 'fully_subscribed');
  const pendingSettlements = settlements.filter(s => s.status === 'pending');
  const completedSettlements = settlements.filter(s => s.status === 'completed');
  const unreadNotifications = notifications.filter(n => !n.read);

  const filteredCalls = capitalCalls.filter(call => {
    const matchesSearch = call.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || call.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate totals
  const totalRaised = depositInstruments.reduce((sum, d) => sum + d.depositAmount, 0);
  const totalDeployed = depositInstruments.reduce((sum, d) => sum + d.kesEquivalent, 0);

  // Helper functions
  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-green-100 text-green-700',
      partially_subscribed: 'bg-amber-100 text-amber-700',
      fully_subscribed: 'bg-blue-100 text-blue-700',
      maturing: 'bg-purple-100 text-purple-700',
      matured: 'bg-gray-100 text-gray-700',
      active: 'bg-green-100 text-green-700',
      pending: 'bg-amber-100 text-amber-700',
      completed: 'bg-blue-100 text-blue-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading capital markets data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-6 h-6" />
              <span className="text-indigo-200 text-sm font-medium">CAPITAL MARKETS</span>
            </div>
            <h1 className="text-2xl font-bold">Equity Africa Bank • Capital Calling</h1>
            <p className="text-indigo-100 mt-1">
              {openCalls.length} active calls • {metrics.activeInvestors} investor relationships
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-indigo-200">Total Capital Raised</p>
            <p className="text-3xl font-bold">¥{(totalRaised / 1000000).toFixed(0)}M</p>
            <p className="text-sm text-indigo-200 mt-1">KES {(totalDeployed / 1000000).toFixed(0)}M deployed</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 shadow-sm overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'create', label: 'Create Call', icon: Plus },
          { id: 'calls', label: 'Capital Calls', icon: TrendingUp, count: capitalCalls.length },
          { id: 'deposits', label: 'Deposits', icon: Banknote, count: depositInstruments.length },
          { id: 'settlements', label: 'Settlements', icon: CheckCircle, count: pendingSettlements.length },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'reports', label: 'Reports', icon: FileText },
          { id: 'notifications', label: 'Notifications', icon: Bell, count: unreadNotifications.length },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-indigo-100 text-indigo-700'
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
        </button>
      </div>

      {/* ============================================ */}
      {/* OVERVIEW TAB */}
      {/* ============================================ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Capital Raised"
              value={`¥${(totalRaised / 1000000).toFixed(0)}M`}
              icon={DollarSign}
              color="green"
              trend={15}
            />
            <StatCard
              title="Capital Deployed"
              value={`KES ${(totalDeployed / 1000000).toFixed(0)}M`}
              icon={TrendingUp}
              color="blue"
              subtitle="95% deployment rate"
            />
            <StatCard
              title="Active Deposit Calls"
              value={openCalls.length}
              icon={Landmark}
              color="indigo"
            />
            <StatCard
              title="Active Investors"
              value={metrics.activeInvestors}
              icon={Users}
              color="purple"
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => handleTabChange('create')}
                className="p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors text-left"
              >
                <Plus className="w-6 h-6 text-indigo-600 mb-2" />
                <p className="font-medium text-gray-900">Create Capital Call</p>
                <p className="text-xs text-gray-500">Raise new investor capital</p>
              </button>
              <button 
                onClick={() => handleTabChange('calls')}
                className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
              >
                <Eye className="w-6 h-6 text-blue-600 mb-2" />
                <p className="font-medium text-gray-900">View All Calls</p>
                <p className="text-xs text-gray-500">{capitalCalls.length} total calls</p>
              </button>
              <button 
                onClick={() => handleTabChange('deposits')}
                className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors text-left"
              >
                <Banknote className="w-6 h-6 text-green-600 mb-2" />
                <p className="font-medium text-gray-900">Deposit Instruments</p>
                <p className="text-xs text-gray-500">{depositInstruments.length} active deposits</p>
              </button>
              <button 
                onClick={() => handleTabChange('settlements')}
                className="p-4 border border-gray-200 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-colors text-left"
              >
                <CheckCircle className="w-6 h-6 text-amber-600 mb-2" />
                <p className="font-medium text-gray-900">Pending Settlements</p>
                <p className="text-xs text-gray-500">{pendingSettlements.length} awaiting settlement</p>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Capital Calls */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Capital Calls</h3>
              <div className="space-y-3">
                {capitalCalls.slice(0, 4).map(call => (
                  <div key={call.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{call.id}</p>
                        <p className="text-sm text-gray-500">{call.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                        {call.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {call.currency} {(call.targetAmount / 1000000).toFixed(0)}M @ {call.interestRate}%
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${call.subscriptionPercentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-indigo-600">{call.subscriptionPercentage}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => handleTabChange('calls')}
                className="w-full mt-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium"
              >
                View All Calls →
              </button>
            </div>

            {/* Investor Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Investors</h3>
              <div className="space-y-3">
                {investors.filter(i => i.status === 'active').slice(0, 4).map(investor => (
                  <div key={investor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{investor.name}</p>
                        <p className="text-xs text-gray-500">{investor.type} • {investor.country}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">¥{(investor.totalDeposited / 1000000).toFixed(0)}M</p>
                      <p className="text-xs text-gray-500">{investor.activeDeposits} active</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Capital Raised Trend */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Capital Raised vs Target (JPY M)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={callAnalytics.monthlyRaised}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `¥${value}M`} />
                  <Legend />
                  <Bar dataKey="raised" fill="#6366F1" name="Raised" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" fill="#E5E7EB" name="Target" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* By Investor Type */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Deposits by Investor Type</h3>
              <div className="flex items-center gap-6">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={callAnalytics.byInvestorType}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {callAnalytics.byInvestorType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `¥${(value / 1000000).toFixed(0)}M`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {callAnalytics.byInvestorType.map(item => (
                    <div key={item.type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-600">{item.type}</span>
                      </div>
                      <span className="font-medium text-gray-900">¥{(item.value / 1000000).toFixed(0)}M</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* CREATE CALL TAB */}
      {/* ============================================ */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Create New Capital Call</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instrument Type</label>
                <select 
                  value={newCall.instrumentType}
                  onChange={(e) => setNewCall({ ...newCall, instrumentType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Fixed Deposit">Fixed Deposit</option>
                  <option value="Time Deposit">Time Deposit</option>
                  <option value="Certificate of Deposit">Certificate of Deposit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency Pair</label>
                <select 
                  value={newCall.currencyPair}
                  onChange={(e) => setNewCall({ ...newCall, currencyPair: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="KES:JPY">KES:JPY (Japanese Yen)</option>
                  <option value="KES:CHF">KES:CHF (Swiss Franc)</option>
                  <option value="KES:EUR">KES:EUR (Euro)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount ({newCall.currencyPair.split(':')[1]})</label>
                <input 
                  type="number" 
                  placeholder="50,000,000"
                  value={newCall.targetAmount}
                  onChange={(e) => setNewCall({ ...newCall, targetAmount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
                <p className="text-xs text-gray-500 mt-1">Min: ¥{(settings.minimumTicketSize / 1000000).toFixed(0)}M • Max: ¥{(settings.maximumTicketSize / 1000000).toFixed(0)}M</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate / Coupon (%)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  placeholder="8.5"
                  value={newCall.interestRate}
                  onChange={(e) => setNewCall({ ...newCall, interestRate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
                <p className="text-xs text-gray-500 mt-1">Range: {settings.minCoupon}% - {settings.maxCoupon}%</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tenor (Months)</label>
                <input 
                  type="number" 
                  placeholder="12"
                  value={newCall.tenor}
                  onChange={(e) => setNewCall({ ...newCall, tenor: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
                <p className="text-xs text-gray-500 mt-1">Range: {settings.minTenor} - {settings.maxTenor} months</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Forward Premium (%)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  placeholder="5.0"
                  value={newCall.forwardsPremium}
                  onChange={(e) => setNewCall({ ...newCall, forwardsPremium: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
                <p className="text-xs text-gray-500 mt-1">Max acceptable: {settings.maxForwardPremium}%</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description / Purpose</label>
              <textarea 
                rows={3}
                placeholder="Q1 2025 Capital Call - Financial Inclusion Initiative"
                value={newCall.description}
                onChange={(e) => setNewCall({ ...newCall, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              />
            </div>

            {/* Summary Preview */}
            {newCall.targetAmount && (
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <h4 className="font-semibold text-indigo-800 mb-3">Call Summary Preview</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-indigo-600">Target Amount</p>
                    <p className="font-bold text-indigo-900">{newCall.currencyPair.split(':')[1]} {(parseInt(newCall.targetAmount) / 1000000).toFixed(0)}M</p>
                  </div>
                  <div>
                    <p className="text-indigo-600">Total Yield</p>
                    <p className="font-bold text-indigo-900">{newCall.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-indigo-600">Tenor</p>
                    <p className="font-bold text-indigo-900">{newCall.tenor} months</p>
                  </div>
                  <div>
                    <p className="text-indigo-600">Maturity Date</p>
                    <p className="font-bold text-indigo-900">
                      {new Date(Date.now() + parseInt(newCall.tenor || 12) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => handleTabChange('overview')}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateCall}
                disabled={!newCall.targetAmount || !newCall.interestRate}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Create Capital Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* CAPITAL CALLS TAB */}
      {/* ============================================ */}
      {activeTab === 'calls' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search calls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="partially_subscribed">Partially Subscribed</option>
              <option value="fully_subscribed">Fully Subscribed</option>
              <option value="maturing">Maturing</option>
            </select>
            <button
              onClick={() => handleTabChange('create')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              New Call
            </button>
          </div>

          {/* Calls Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Call ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Currency</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscribed</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yield</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCalls.map(call => (
                    <tr key={call.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-mono text-sm text-indigo-600">{call.id}</p>
                        <p className="text-xs text-gray-500">{call.createdAt}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-900">{call.description}</p>
                        <p className="text-xs text-gray-500">{call.instrumentType}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{call.currency}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        ¥{(call.targetAmount / 1000000).toFixed(0)}M
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                call.subscriptionPercentage === 100 ? 'bg-green-500' :
                                call.subscriptionPercentage > 0 ? 'bg-indigo-500' : 'bg-gray-300'
                              }`}
                              style={{ width: `${call.subscriptionPercentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{call.subscriptionPercentage}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-green-600 font-medium">{call.interestRate}%</td>
                      <td className="px-4 py-3 text-gray-600">{call.tenor}m</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                          {call.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => { setSelectedCall(call); setShowCallDetailModal(true); }}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
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
      {/* DEPOSITS TAB */}
      {/* ============================================ */}
      {activeTab === 'deposits' && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <Banknote className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Total Deposits</p>
                  <p className="text-2xl font-bold text-gray-900">¥{(totalRaised / 1000000).toFixed(0)}M</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">KES Equivalent</p>
                  <p className="text-2xl font-bold text-gray-900">KES {(totalDeployed / 1000000).toFixed(0)}M</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <Percent className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Avg Interest Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(depositInstruments.reduce((sum, d) => sum + d.interestRate, 0) / depositInstruments.length).toFixed(1)}%
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

          {/* Deposits Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Investor Deposits</h3>
              <p className="text-sm text-gray-500 mt-1">All deposits made against capital calls</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deposit ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capital Call</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">KES Created</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maturity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {depositInstruments.map(deposit => {
                    const call = capitalCalls.find(c => c.id === deposit.capitalCallId);
                    return (
                      <tr key={deposit.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-mono text-sm text-indigo-600">{deposit.id}</p>
                          <p className="text-xs text-gray-500">{deposit.depositDate}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-mono text-sm text-gray-900">{deposit.capitalCallId}</p>
                          {call && (
                            <div className="flex items-center gap-1 mt-1">
                              <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-indigo-500 rounded-full"
                                  style={{ width: `${call.subscriptionPercentage}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500">{call.subscriptionPercentage}%</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{deposit.investor}</p>
                          <p className="text-xs text-gray-500">{deposit.investorType}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{deposit.currency} {(deposit.depositAmount / 1000000).toFixed(0)}M</p>
                          <p className="text-xs text-gray-500">@ {deposit.depositRate}</p>
                        </td>
                        <td className="px-4 py-3 font-medium text-green-600">
                          KES {(deposit.kesEquivalent / 1000000).toFixed(1)}M
                        </td>
                        <td className="px-4 py-3 text-gray-900">{deposit.interestRate}%</td>
                        <td className="px-4 py-3 text-gray-600">{deposit.tenor}m</td>
                        <td className="px-4 py-3 text-gray-600">{deposit.maturityDate}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deposit.status)}`}>
                            {deposit.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* SETTLEMENTS TAB */}
      {/* ============================================ */}
      {activeTab === 'settlements' && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{completedSettlements.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-amber-200">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-amber-600" />
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingSettlements.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Total Repatriated</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ¥{(completedSettlements.reduce((sum, s) => sum + s.totalReturned, 0) / 1000000).toFixed(0)}M
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
                    +KES {(completedSettlements.reduce((sum, s) => sum + (s.fxGainLoss || 0), 0) / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Settlements */}
          {pendingSettlements.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Pending Settlements ({pendingSettlements.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingSettlements.map(settlement => (
                  <div key={settlement.id} className="bg-white rounded-lg p-4 border border-amber-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-mono text-sm text-indigo-600">{settlement.id}</p>
                        <p className="font-medium text-gray-900">{settlement.investor}</p>
                      </div>
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                        Due: {settlement.settlementDate}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Principal</p>
                        <p className="font-medium">{settlement.currency} {(settlement.principalAmount / 1000000).toFixed(0)}M</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Interest</p>
                        <p className="font-medium">{settlement.currency} {(settlement.interestPaid / 1000000).toFixed(2)}M</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total Return</p>
                        <p className="font-bold text-green-600">{settlement.currency} {(settlement.totalReturned / 1000000).toFixed(2)}M</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tenor</p>
                        <p className="font-medium">{settlement.tenor} months @ {settlement.interestRate}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Settlements Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Settlement History</h3>
              <p className="text-sm text-gray-500 mt-1">Completed capital repatriations to investors</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Settlement</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Principal</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interest</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">FX Impact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {settlements.map(settlement => (
                    <tr key={settlement.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-mono text-sm text-indigo-600">{settlement.id}</p>
                        <p className="text-xs text-gray-500">{settlement.capitalCallId}</p>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{settlement.investor}</td>
                      <td className="px-4 py-3 text-gray-900">
                        {settlement.currency} {(settlement.principalAmount / 1000000).toFixed(0)}M
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {settlement.currency} {(settlement.interestPaid / 1000000).toFixed(2)}M
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900">
                        {settlement.currency} {(settlement.totalReturned / 1000000).toFixed(2)}M
                      </td>
                      <td className="px-4 py-3">
                        {settlement.fxGainLoss !== null ? (
                          <span className={`font-medium ${settlement.fxGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {settlement.fxGainLoss >= 0 ? '+' : ''}KES {(settlement.fxGainLoss / 1000000).toFixed(2)}M
                          </span>
                        ) : (
                          <span className="text-gray-400">TBD</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{settlement.settlementDate}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(settlement.status)}`}>
                          {settlement.status}
                        </span>
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
      {/* ANALYTICS TAB */}
      {/* ============================================ */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Capital Markets Analytics</h3>
            <p className="text-indigo-100">Performance metrics and trends</p>
            <div className="grid grid-cols-4 gap-6 mt-6">
              <div>
                <p className="text-indigo-200 text-sm">Total Raised (YTD)</p>
                <p className="text-2xl font-bold">¥{(totalRaised / 1000000).toFixed(0)}M</p>
              </div>
              <div>
                <p className="text-indigo-200 text-sm">Avg Yield</p>
                <p className="text-2xl font-bold">{metrics.avgYield}%</p>
              </div>
              <div>
                <p className="text-indigo-200 text-sm">Avg Tenor</p>
                <p className="text-2xl font-bold">{metrics.avgTenor} months</p>
              </div>
              <div>
                <p className="text-indigo-200 text-sm">Investor Relationships</p>
                <p className="text-2xl font-bold">{metrics.totalInvestorRelationships}</p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Yield Trend */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Yield Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={callAnalytics.yieldTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[7, 10]} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Area type="monotone" dataKey="avgYield" stroke="#6366F1" fill="#6366F1" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* By Tenor */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Deposits by Tenor</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={callAnalytics.byTenor} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(v) => `¥${v / 1000000}M`} />
                  <YAxis type="category" dataKey="tenor" width={80} />
                  <Tooltip formatter={(value) => `¥${(value / 1000000).toFixed(0)}M`} />
                  <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Call Performance Table */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Call Performance Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Call</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscribed</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fill Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yield</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investors</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days to Fill</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {capitalCalls.filter(c => c.status === 'fully_subscribed').map(call => (
                    <tr key={call.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-indigo-600">{call.id}</td>
                      <td className="px-4 py-3">¥{(call.targetAmount / 1000000).toFixed(0)}M</td>
                      <td className="px-4 py-3">¥{(call.subscribedAmount / 1000000).toFixed(0)}M</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }} />
                          </div>
                          <span className="text-green-600 font-medium">100%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-green-600">{call.interestRate}%</td>
                      <td className="px-4 py-3">{call.investors.length}</td>
                      <td className="px-4 py-3 text-gray-600">~30</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* REPORTS TAB */}
      {/* ============================================ */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Capital Markets Reports</h3>
            <p className="text-gray-600 mb-6">Select report type and parameters to generate customized capital calling reports.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: 'calls', title: 'Capital Calls Report', desc: 'Summary of all capital calls', icon: TrendingUp, color: 'indigo' },
                { id: 'deposits', title: 'Deposit Instruments Report', desc: 'All investor deposits', icon: Banknote, color: 'green' },
                { id: 'settlements', title: 'Settlements Report', desc: 'Settlement history and FX impact', icon: CheckCircle, color: 'blue' },
                { id: 'investor', title: 'Investor Analysis', desc: 'Investor relationships and activity', icon: Users, color: 'purple' },
                { id: 'yield', title: 'Yield Analysis', desc: 'Interest rate and yield trends', icon: Percent, color: 'amber' },
                { id: 'fx', title: 'FX Hedging Report', desc: 'Forward contracts and FX positions', icon: ArrowRightLeft, color: 'red' }
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

          {/* Recent Reports */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-4">Recent Reports Generated</h4>
            <div className="space-y-3">
              {[
                { name: 'Q4 2024 Capital Calls Summary', date: 'Dec 31, 2024', status: 'completed' },
                { name: 'Investor Performance Report', date: 'Dec 28, 2024', status: 'completed' },
                { name: 'FX Hedging Analysis', date: 'Dec 20, 2024', status: 'completed' }
              ].map((report, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{report.name}</p>
                    <p className="text-xs text-gray-500">{report.date}</p>
                  </div>
                  <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* NOTIFICATIONS TAB */}
      {/* ============================================ */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          {/* Category Filters */}
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'all', label: 'All', count: notifications.length },
              { id: 'subscription', label: 'Subscriptions', count: notifications.filter(n => n.category === 'subscription').length },
              { id: 'settlement', label: 'Settlements', count: notifications.filter(n => n.category === 'settlement').length },
              { id: 'call', label: 'Calls', count: notifications.filter(n => n.category === 'call').length },
              { id: 'inquiry', label: 'Inquiries', count: notifications.filter(n => n.category === 'inquiry').length },
              { id: 'hedging', label: 'Hedging', count: notifications.filter(n => n.category === 'hedging').length }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setNotificationFilter(cat.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${
                  notificationFilter === cat.id 
                    ? 'bg-indigo-600 text-white' 
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
                  <h3 className="text-lg font-semibold text-gray-900">Capital Markets Notifications</h3>
                  <p className="text-sm text-gray-500 mt-1">{unreadNotifications.length} unread</p>
                </div>
                <button 
                  onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
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
                  className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-indigo-50' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      notification.type === 'error' ? 'bg-red-100' :
                      notification.type === 'warning' ? 'bg-amber-100' :
                      notification.type === 'success' ? 'bg-green-100' :
                      'bg-indigo-100'
                    }`}>
                      {notification.type === 'error' ? <XCircle className="w-5 h-5 text-red-600" /> :
                       notification.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-amber-600" /> :
                       notification.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                       <Bell className="w-5 h-5 text-indigo-600" />}
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
                      <div className="w-2 h-2 bg-indigo-600 rounded-full" />
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
            {/* Ticket Size Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                <Banknote className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Ticket Size Settings</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Ticket (JPY)</label>
                    <input 
                      type="number" 
                      value={settings.minimumTicketSize} 
                      onChange={(e) => updateSetting('minimumTicketSize', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Ticket (JPY)</label>
                    <input 
                      type="number" 
                      value={settings.maximumTicketSize} 
                      onChange={(e) => updateSetting('maximumTicketSize', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Ticket Size (JPY)</label>
                  <input 
                    type="number" 
                    value={settings.preferredTicketSize} 
                    onChange={(e) => updateSetting('preferredTicketSize', parseInt(e.target.value))} 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                  />
                </div>
              </div>
            </div>

            {/* Call Parameters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Call Parameters</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Tenor (months)</label>
                    <input 
                      type="number" 
                      value={settings.defaultTenor} 
                      onChange={(e) => updateSetting('defaultTenor', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Tenor</label>
                    <input 
                      type="number" 
                      value={settings.minTenor} 
                      onChange={(e) => updateSetting('minTenor', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Tenor</label>
                    <input 
                      type="number" 
                      value={settings.maxTenor} 
                      onChange={(e) => updateSetting('maxTenor', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Coupon (%)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={settings.defaultCoupon} 
                      onChange={(e) => updateSetting('defaultCoupon', parseFloat(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Coupon (%)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={settings.minCoupon} 
                      onChange={(e) => updateSetting('minCoupon', parseFloat(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Coupon (%)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={settings.maxCoupon} 
                      onChange={(e) => updateSetting('maxCoupon', parseFloat(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
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
                    <p className="text-sm text-gray-500">Automatically hedge FX exposure</p>
                  </div>
                  <Toggle 
                    enabled={settings.autoHedgeEnabled} 
                    onChange={() => updateSetting('autoHedgeEnabled', !settings.autoHedgeEnabled)} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Hedge Ratio (%)</label>
                    <input 
                      type="number" 
                      value={settings.defaultHedgeRatio} 
                      onChange={(e) => updateSetting('defaultHedgeRatio', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Forward Premium (%)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={settings.maxForwardPremium} 
                      onChange={(e) => updateSetting('maxForwardPremium', parseFloat(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Currencies</label>
                  <input 
                    type="text" 
                    value={settings.preferredCurrencies.join(', ')} 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50" 
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Auto-Acceptance Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                <Zap className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Auto-Acceptance Settings</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Enable Auto-Acceptance</p>
                    <p className="text-sm text-gray-500">Auto-accept qualifying subscriptions</p>
                  </div>
                  <Toggle 
                    enabled={settings.autoAcceptEnabled} 
                    onChange={() => updateSetting('autoAcceptEnabled', !settings.autoAcceptEnabled)} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Auto-Accept Amount</label>
                    <input 
                      type="number" 
                      value={settings.autoAcceptMaxAmount} 
                      onChange={(e) => updateSetting('autoAcceptMaxAmount', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                      disabled={!settings.autoAcceptEnabled}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Investor Rating</label>
                    <select 
                      value={settings.autoAcceptMinRating}
                      onChange={(e) => updateSetting('autoAcceptMinRating', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      disabled={!settings.autoAcceptEnabled}
                    >
                      <option value="AAA">AAA</option>
                      <option value="AA">AA</option>
                      <option value="A">A</option>
                      <option value="BBB">BBB</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Require KYC Verification</p>
                    <p className="text-sm text-gray-500">Only accept verified investors</p>
                  </div>
                  <Toggle 
                    enabled={settings.requireKYCVerification} 
                    onChange={() => updateSetting('requireKYCVerification', !settings.requireKYCVerification)} 
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
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive updates via email</p>
                    </div>
                  </div>
                  <Toggle 
                    enabled={settings.emailNotifications} 
                    onChange={() => updateSetting('emailNotifications', !settings.emailNotifications)} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">WhatsApp Notifications</p>
                      <p className="text-sm text-gray-500">Receive updates via WhatsApp</p>
                    </div>
                  </div>
                  <Toggle 
                    enabled={settings.whatsappNotifications} 
                    onChange={() => updateSetting('whatsappNotifications', !settings.whatsappNotifications)} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Subscription Alerts</p>
                    <p className="text-sm text-gray-500">Alert on new subscriptions</p>
                  </div>
                  <Toggle 
                    enabled={settings.subscriptionAlerts} 
                    onChange={() => updateSetting('subscriptionAlerts', !settings.subscriptionAlerts)} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Maturity Alerts</p>
                    <p className="text-sm text-gray-500">Alert before call matures</p>
                  </div>
                  <Toggle 
                    enabled={settings.maturityAlerts} 
                    onChange={() => updateSetting('maturityAlerts', !settings.maturityAlerts)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Days Before Maturity Alert</label>
                  <input 
                    type="number" 
                    value={settings.alertDaysBeforeMaturity} 
                    onChange={(e) => updateSetting('alertDaysBeforeMaturity', parseInt(e.target.value))} 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* MODALS */}
      {/* ============================================ */}

      {/* Call Detail Modal */}
      <Modal isOpen={showCallDetailModal} onClose={() => setShowCallDetailModal(false)} title="Capital Call Details" size="lg">
        {selectedCall && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedCall.id}</h3>
                <p className="text-gray-500">{selectedCall.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCall.status)}`}>
                {selectedCall.status.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Target Amount</p>
                <p className="text-xl font-bold">{selectedCall.currency} {(selectedCall.targetAmount / 1000000).toFixed(0)}M</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Subscribed</p>
                <p className="text-xl font-bold text-green-600">{selectedCall.subscriptionPercentage}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Interest Rate</p>
                <p className="text-xl font-bold">{selectedCall.interestRate}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Tenor</p>
                <p className="text-xl font-bold">{selectedCall.tenor} months</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-semibold">{selectedCall.createdAt}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Maturity Date</p>
                <p className="font-semibold">{selectedCall.maturityDate}</p>
              </div>
            </div>

            {selectedCall.investors.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Participating Investors</h4>
                <div className="space-y-2">
                  {selectedCall.investors.map((investor, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Building2 className="w-5 h-5 text-indigo-600" />
                      <span className="font-medium">{investor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Report Generation Modal */}
      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Generate Report" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
              <option>Capital Calls Report</option>
              <option>Deposit Instruments Report</option>
              <option>Settlements Report</option>
              <option>Investor Analysis</option>
              <option>Yield Analysis</option>
              <option>FX Hedging Report</option>
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
                  read: false,
                  category: 'call'
                };
                setNotifications([newNotification, ...notifications]);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Download className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>
      </Modal>
{/* Amazon Q AI Assistant */}
      <AmazonQChat 
        userRole="bank_caller" 
        tenantId="default"
      />
    </div>
  );
};

export default BankCallerDashboard;
