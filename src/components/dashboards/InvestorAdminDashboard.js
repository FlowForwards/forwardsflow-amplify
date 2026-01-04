// InvestorAdminDashboard.js - Impact Investor Administrator Dashboard
// Full CRUD for investment analysts, portfolio management, compliance analytics
// Reads URL path to determine which tab to show

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Building2, Users, TrendingUp, DollarSign, Wallet, Shield, Settings, Plus, Eye, Edit, Ban, Trash2,
  RefreshCw, Search, ArrowUpRight, ArrowDownRight, CheckCircle, Clock, AlertTriangle, CreditCard,
  Activity, FileText, BarChart3, X, Save, Bell, Lock, Globe, Database, Mail, Smartphone, Key,
  Briefcase, Target, PieChart, LineChart as LineChartIcon, Award, UserCheck, AlertCircle,
  TrendingDown, Percent, Calendar, MapPin, ExternalLink, Download, Filter
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell, Legend, ComposedChart
} from 'recharts';
import AmazonQChat from '../chat/AmazonQChat';

// ============================================
// UNIVERSAL SAMPLE DATABASE
// Consistent data for Impact Investor Admin
// ============================================
const SAMPLE_DATABASE = {
  // Organization info
  organization: {
    name: 'Horizon Impact Partners',
    type: 'Impact Investment Fund',
    aum: 850000000, // USD $850M AUM
    currency: 'USD',
    headquarters: 'Singapore',
    founded: '2018',
    investmentFocus: ['Financial Inclusion', 'Clean Energy', 'Agriculture', 'Healthcare'],
    targetRegions: ['East Africa', 'Southeast Asia', 'South Asia']
  },

  // Portfolio metrics
  portfolioMetrics: {
    totalInvested: 180000000, // JPY 180M currently deployed
    totalInvestedUSD: 1200000, // ~USD 1.2M
    activeInvestments: 12,
    avgYield: 8.2,
    portfolioIRR: 14.5,
    realizedReturns: 24500000, // JPY
    unrealizedGains: 12800000, // JPY
    pendingSettlements: 2,
    impactScore: 87
  },

  // Investment analysts (team members)
  analysts: [
    { 
      id: 'analyst_001', 
      name: 'David Chen', 
      email: 'david.chen@horizonimpact.com', 
      phone: '+65 9123 4567', 
      role: 'investor_analyst', 
      roleDisplay: 'Senior Investment Analyst', 
      department: 'Investments',
      region: 'East Africa',
      status: 'active', 
      lastLogin: '2025-01-02T08:30:00Z', 
      createdAt: '2024-01-15',
      permissions: ['investments.view', 'investments.analyze', 'reports.generate'],
      portfolio: {
        assignedDeals: 4,
        totalValue: 45000000, // JPY
        avgReturn: 8.5,
        complianceScore: 95
      },
      kycStatus: 'verified',
      trainingCompleted: true
    },
    { 
      id: 'analyst_002', 
      name: 'Sarah Tanaka', 
      email: 'sarah.tanaka@horizonimpact.com', 
      phone: '+65 9234 5678', 
      role: 'investor_analyst', 
      roleDisplay: 'Investment Analyst', 
      department: 'Investments',
      region: 'Southeast Asia',
      status: 'active', 
      lastLogin: '2025-01-02T09:15:00Z', 
      createdAt: '2024-03-01',
      permissions: ['investments.view', 'investments.analyze'],
      portfolio: {
        assignedDeals: 3,
        totalValue: 38000000,
        avgReturn: 7.8,
        complianceScore: 92
      },
      kycStatus: 'verified',
      trainingCompleted: true
    },
    { 
      id: 'analyst_003', 
      name: 'Michael Okonkwo', 
      email: 'michael.okonkwo@horizonimpact.com', 
      phone: '+65 9345 6789', 
      role: 'investor_analyst', 
      roleDisplay: 'Junior Analyst', 
      department: 'Research',
      region: 'West Africa',
      status: 'active', 
      lastLogin: '2025-01-01T14:00:00Z', 
      createdAt: '2024-06-15',
      permissions: ['investments.view', 'reports.view'],
      portfolio: {
        assignedDeals: 2,
        totalValue: 22000000,
        avgReturn: 8.0,
        complianceScore: 88
      },
      kycStatus: 'verified',
      trainingCompleted: true
    },
    { 
      id: 'analyst_004', 
      name: 'Priya Sharma', 
      email: 'priya.sharma@horizonimpact.com', 
      phone: '+65 9456 7890', 
      role: 'investor_analyst', 
      roleDisplay: 'Investment Analyst', 
      department: 'Investments',
      region: 'South Asia',
      status: 'active', 
      lastLogin: '2025-01-02T07:45:00Z', 
      createdAt: '2024-04-01',
      permissions: ['investments.view', 'investments.analyze', 'reports.generate'],
      portfolio: {
        assignedDeals: 3,
        totalValue: 35000000,
        avgReturn: 9.2,
        complianceScore: 98
      },
      kycStatus: 'verified',
      trainingCompleted: true
    },
    { 
      id: 'analyst_005', 
      name: 'James Wong', 
      email: 'james.wong@horizonimpact.com', 
      phone: '+65 9567 8901', 
      role: 'investor_analyst', 
      roleDisplay: 'Research Analyst', 
      department: 'Research',
      region: 'Global',
      status: 'suspended', 
      lastLogin: '2024-11-15T10:00:00Z', 
      createdAt: '2024-02-15',
      permissions: ['investments.view'],
      portfolio: {
        assignedDeals: 0,
        totalValue: 0,
        avgReturn: 0,
        complianceScore: 65
      },
      kycStatus: 'expired',
      trainingCompleted: false
    }
  ],

  // Active investments
  investments: [
    {
      id: 'INV-001',
      bank: 'Equity Bank Kenya',
      country: 'Kenya',
      instrument: 'Fixed Deposit',
      principalJPY: 50000000,
      principalUSD: 333333,
      interestRate: 8.5,
      term: 12,
      startDate: '2024-03-15',
      maturityDate: '2025-03-15',
      status: 'active',
      assignedAnalyst: 'David Chen',
      impactMetrics: {
        borrowersReached: 12500,
        avgLoanSize: 15000,
        womenBorrowers: 65,
        ruralBorrowers: 45
      }
    },
    {
      id: 'INV-002',
      bank: 'KCB Bank',
      country: 'Kenya',
      instrument: 'Fixed Deposit',
      principalJPY: 75000000,
      principalUSD: 500000,
      interestRate: 9.0,
      term: 18,
      startDate: '2024-01-20',
      maturityDate: '2025-07-20',
      status: 'active',
      assignedAnalyst: 'Sarah Tanaka',
      impactMetrics: {
        borrowersReached: 18750,
        avgLoanSize: 20000,
        womenBorrowers: 58,
        ruralBorrowers: 52
      }
    },
    {
      id: 'INV-003',
      bank: 'CRDB Bank',
      country: 'Tanzania',
      instrument: 'Fixed Deposit',
      principalJPY: 25000000,
      principalUSD: 166667,
      interestRate: 7.5,
      term: 6,
      startDate: '2024-09-01',
      maturityDate: '2025-03-01',
      status: 'maturing',
      assignedAnalyst: 'Michael Okonkwo',
      impactMetrics: {
        borrowersReached: 6250,
        avgLoanSize: 12000,
        womenBorrowers: 72,
        ruralBorrowers: 68
      }
    },
    {
      id: 'INV-004',
      bank: 'Centenary Bank',
      country: 'Uganda',
      instrument: 'Fixed Deposit',
      principalJPY: 30000000,
      principalUSD: 200000,
      interestRate: 8.0,
      term: 12,
      startDate: '2024-06-10',
      maturityDate: '2025-06-10',
      status: 'active',
      assignedAnalyst: 'Priya Sharma',
      impactMetrics: {
        borrowersReached: 7500,
        avgLoanSize: 18000,
        womenBorrowers: 61,
        ruralBorrowers: 55
      }
    }
  ],

  // Performance trend
  performanceTrend: [
    { month: 'Jul', deployed: 120, returns: 8, yield: 7.8, deals: 8 },
    { month: 'Aug', deployed: 135, returns: 10, yield: 8.0, deals: 9 },
    { month: 'Sep', deployed: 150, returns: 12, yield: 8.2, deals: 10 },
    { month: 'Oct', deployed: 165, returns: 14, yield: 8.3, deals: 11 },
    { month: 'Nov', deployed: 175, returns: 16, yield: 8.4, deals: 11 },
    { month: 'Dec', deployed: 180, returns: 18, yield: 8.5, deals: 12 }
  ],

  // Geographic allocation
  geographicAllocation: [
    { region: 'Kenya', value: 69, color: '#8B5CF6' },
    { region: 'Tanzania', value: 14, color: '#3B82F6' },
    { region: 'Uganda', value: 17, color: '#10B981' }
  ],

  // Sector allocation
  sectorAllocation: [
    { sector: 'Mobile Lending', value: 45, color: '#8B5CF6' },
    { sector: 'SME Finance', value: 30, color: '#3B82F6' },
    { sector: 'Agricultural', value: 15, color: '#10B981' },
    { sector: 'Clean Energy', value: 10, color: '#F59E0B' }
  ],

  // Compliance metrics per analyst
  complianceMetrics: {
    overallScore: 91,
    kycCompliance: 95,
    amlCompliance: 92,
    reportingCompliance: 88,
    trainingCompliance: 90
  },

  // Available opportunities
  opportunities: [
    {
      id: 'OPP-001',
      bank: 'Cooperative Bank Kenya',
      country: 'Kenya',
      amount: 100000000,
      interestRate: 9.5,
      term: 12,
      status: 'open',
      deadline: '2025-01-15',
      impactFocus: 'Women Entrepreneurs'
    },
    {
      id: 'OPP-002',
      bank: 'I&M Bank Rwanda',
      country: 'Rwanda',
      amount: 50000000,
      interestRate: 8.8,
      term: 18,
      status: 'open',
      deadline: '2025-01-20',
      impactFocus: 'Agricultural Finance'
    }
  ],

  // Notifications
  notifications: [
    { id: 1, title: 'Investment Maturing', message: 'CRDB Bank deposit matures in 60 days', time: '2 hours ago', type: 'warning' },
    { id: 2, title: 'New Opportunity', message: 'Cooperative Bank Kenya posted new capital call', time: '5 hours ago', type: 'info' },
    { id: 3, title: 'Quarterly Interest', message: 'KCB Bank Q4 interest payment received: ¥1.69M', time: '1 day ago', type: 'success' },
    { id: 4, title: 'Compliance Alert', message: 'Annual KYC renewal due for James Wong', time: '2 days ago', type: 'warning' }
  ]
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
const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => {
  const colorClasses = {
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    teal: 'bg-teal-100 text-teal-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
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
  if (pathname.includes('/users') || pathname.includes('/team')) return 'team';
  if (pathname.includes('/investments') || pathname.includes('/portfolio')) return 'portfolio';
  if (pathname.includes('/opportunities')) return 'opportunities';
  if (pathname.includes('/compliance')) return 'compliance';
  if (pathname.includes('/impact')) return 'impact';
  if (pathname.includes('/analytics')) return 'analytics';
  if (pathname.includes('/reports')) return 'reports';
  if (pathname.includes('/notifications')) return 'notifications';
  if (pathname.includes('/settings')) return 'settings';
  return 'overview';
};

// ============================================
// MAIN INVESTOR ADMIN DASHBOARD
// ============================================
const InvestorAdminDashboard = () => {
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
  const [organization] = useState(SAMPLE_DATABASE.organization);
  const [portfolioMetrics] = useState(SAMPLE_DATABASE.portfolioMetrics);
  const [analysts, setAnalysts] = useState(SAMPLE_DATABASE.analysts);
  const [investments] = useState(SAMPLE_DATABASE.investments);
  const [performanceTrend] = useState(SAMPLE_DATABASE.performanceTrend);
  const [geographicAllocation] = useState(SAMPLE_DATABASE.geographicAllocation);
  const [sectorAllocation] = useState(SAMPLE_DATABASE.sectorAllocation);
  const [complianceMetrics] = useState(SAMPLE_DATABASE.complianceMetrics);
  const [opportunities] = useState(SAMPLE_DATABASE.opportunities);
  const [notifications] = useState(SAMPLE_DATABASE.notifications);
  
  // Modal states
  const [showAddAnalystModal, setShowAddAnalystModal] = useState(false);
  const [showEditAnalystModal, setShowEditAnalystModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showAnalystDetailsModal, setShowAnalystDetailsModal] = useState(false);
  const [selectedAnalyst, setSelectedAnalyst] = useState(null);
  
  // Analyst form data
  const [analystFormData, setAnalystFormData] = useState({
    name: '', email: '', phone: '', role: 'investor_analyst', department: 'Investments', region: 'East Africa'
  });
  
  // Settings state
  const [settings, setSettings] = useState({
    organizationName: 'Horizon Impact Partners',
    timezone: 'Asia/Singapore',
    baseCurrency: 'USD',
    reportingCurrency: 'JPY',
    autoReinvest: false,
    twoFactorRequired: true,
    emailNotifications: true,
    smsNotifications: false,
    weeklyDigest: true,
    impactReports: true,
    apiAccess: true
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
      overview: '/investor/admin',
      team: '/investor/admin/users',
      portfolio: '/investor/admin/investments',
      opportunities: '/investor/admin/opportunities',
      compliance: '/investor/admin/compliance',
      impact: '/investor/admin/impact',
      analytics: '/investor/admin/analytics',
      reports: '/investor/admin/reports',
      notifications: '/investor/admin/notifications',
      settings: '/investor/admin/settings'
    };
    if (tabToPath[tabId]) {
      navigate(tabToPath[tabId]);
    }
  };

  // ============================================
  // ANALYST MANAGEMENT FUNCTIONS
  // ============================================
  const handleAddAnalyst = (e) => {
    e.preventDefault();
    const roleDisplayMap = {
      investor_admin: 'Investment Director',
      investor_analyst: 'Investment Analyst',
      investor_junior: 'Junior Analyst',
      investor_research: 'Research Analyst'
    };
    const newAnalyst = {
      id: `analyst_${Date.now()}`,
      ...analystFormData,
      roleDisplay: roleDisplayMap[analystFormData.role] || 'Investment Analyst',
      status: 'pending',
      lastLogin: null,
      createdAt: new Date().toISOString().split('T')[0],
      permissions: ['investments.view'],
      portfolio: { assignedDeals: 0, totalValue: 0, avgReturn: 0, complianceScore: 0 },
      kycStatus: 'pending',
      trainingCompleted: false
    };
    setAnalysts([...analysts, newAnalyst]);
    setShowAddAnalystModal(false);
    setAnalystFormData({ name: '', email: '', phone: '', role: 'investor_analyst', department: 'Investments', region: 'East Africa' });
  };

  const handleEditAnalyst = (e) => {
    e.preventDefault();
    const roleDisplayMap = {
      investor_admin: 'Investment Director',
      investor_analyst: 'Investment Analyst',
      investor_junior: 'Junior Analyst',
      investor_research: 'Research Analyst'
    };
    setAnalysts(analysts.map(a => a.id === selectedAnalyst.id ? { 
      ...a, 
      ...analystFormData,
      roleDisplay: roleDisplayMap[analystFormData.role] || 'Investment Analyst'
    } : a));
    setShowEditAnalystModal(false);
    setSelectedAnalyst(null);
  };

  const handleSuspendAnalyst = (analyst) => {
    setAnalysts(analysts.map(a => a.id === analyst.id ? { ...a, status: a.status === 'suspended' ? 'active' : 'suspended' } : a));
  };

  const handleDeleteAnalyst = () => {
    setAnalysts(analysts.filter(a => a.id !== selectedAnalyst.id));
    setShowDeleteConfirmModal(false);
    setSelectedAnalyst(null);
  };

  const openEditModal = (analyst) => {
    setSelectedAnalyst(analyst);
    setAnalystFormData({
      name: analyst.name,
      email: analyst.email,
      phone: analyst.phone || '',
      role: analyst.role,
      department: analyst.department || 'Investments',
      region: analyst.region || 'East Africa'
    });
    setShowEditAnalystModal(true);
  };

  const openDeleteModal = (analyst) => {
    setSelectedAnalyst(analyst);
    setShowDeleteConfirmModal(true);
  };

  const openDetailsModal = (analyst) => {
    setSelectedAnalyst(analyst);
    setShowAnalystDetailsModal(true);
  };

  // Settings update
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Helper functions
  const getRoleColor = (role) => {
    const colors = {
      investor_admin: 'bg-purple-100 text-purple-700',
      investor_analyst: 'bg-blue-100 text-blue-700',
      investor_junior: 'bg-teal-100 text-teal-700',
      investor_research: 'bg-indigo-100 text-indigo-700'
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-700',
      suspended: 'bg-red-100 text-red-700',
      pending: 'bg-yellow-100 text-yellow-700',
      maturing: 'bg-amber-100 text-amber-700',
      open: 'bg-blue-100 text-blue-700',
      verified: 'bg-green-100 text-green-700',
      expired: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    if (diff < 3600000) return `${Math.floor(diff / 60000)} mins ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return formatDate(dateStr);
  };

  // Calculate totals
  const totalPortfolioJPY = investments.reduce((sum, inv) => sum + inv.principalJPY, 0);
  const totalBorrowersReached = investments.reduce((sum, inv) => sum + inv.impactMetrics.borrowersReached, 0);
  const avgWomenBorrowers = investments.reduce((sum, inv) => sum + inv.impactMetrics.womenBorrowers, 0) / investments.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading investor dashboard...</p>
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
              <Briefcase className="w-6 h-6" />
              <span className="text-indigo-200 text-sm font-medium">IMPACT INVESTOR ADMINISTRATION</span>
            </div>
            <h1 className="text-2xl font-bold">{organization.name}</h1>
            <p className="text-indigo-100 mt-1">
              {analysts.filter(a => a.status === 'active').length} active analysts • {investments.length} active investments
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-indigo-200">Portfolio Value</p>
            <p className="text-3xl font-bold">¥{(totalPortfolioJPY / 1000000).toFixed(0)}M</p>
            <p className="text-sm text-indigo-200 mt-1">{portfolioMetrics.avgYield}% avg yield</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 shadow-sm overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'team', label: 'Team Management', icon: Users },
          { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
          { id: 'opportunities', label: 'Opportunities', icon: Target },
          { id: 'compliance', label: 'Compliance', icon: Shield },
          { id: 'impact', label: 'Impact Metrics', icon: Award },
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
            {tab.id === 'opportunities' && opportunities.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                {opportunities.length}
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
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Active Analysts"
              value={analysts.filter(a => a.status === 'active').length}
              icon={Users}
              color="indigo"
              subtitle={`${analysts.length} total team members`}
            />
            <StatCard
              title="Portfolio Value"
              value={`¥${(totalPortfolioJPY / 1000000).toFixed(0)}M`}
              icon={Wallet}
              color="blue"
              trend={12}
            />
            <StatCard
              title="Average Yield"
              value={`${portfolioMetrics.avgYield}%`}
              icon={TrendingUp}
              color="green"
              trend={3}
            />
            <StatCard
              title="Impact Score"
              value={portfolioMetrics.impactScore}
              icon={Award}
              color="purple"
              subtitle="Out of 100"
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Geographic Allocation */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Allocation</h3>
              <div className="flex items-center gap-6">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={geographicAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {geographicAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3">
                  {geographicAllocation.map(item => (
                    <div key={item.region} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-600">{item.region}</span>
                      </div>
                      <span className="font-medium text-gray-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Portfolio Performance */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpRight className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-600">Total Deployed</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    ¥{(totalPortfolioJPY / 1000000).toFixed(0)}M
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{investments.length} active investments</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-600">Portfolio IRR</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{portfolioMetrics.portfolioIRR}%</p>
                  <p className="text-xs text-gray-500 mt-1">Annualized return</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span className="text-sm text-gray-600">Pending Settlements</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-600">{portfolioMetrics.pendingSettlements}</p>
                  <p className="text-xs text-gray-500 mt-1">Awaiting processing</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-600">Realized Returns</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    ¥{(portfolioMetrics.realizedReturns / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Lifetime earnings</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Deployment & Returns Trend (JPY Millions)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={performanceTrend}>
                <defs>
                  <linearGradient id="colorDeployed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="deployed" stroke="#6366F1" fill="url(#colorDeployed)" name="Deployed (¥M)" />
                <Bar yAxisId="right" dataKey="returns" fill="#10B981" name="Returns (¥M)" radius={[4, 4, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Notifications */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {notifications.slice(0, 4).map(notification => (
                <div key={notification.id} className={`p-4 rounded-lg border-l-4 ${
                  notification.type === 'warning' ? 'bg-amber-50 border-amber-500' :
                  notification.type === 'success' ? 'bg-green-50 border-green-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    </div>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* TEAM MANAGEMENT TAB */}
      {/* ============================================ */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Investment Analysts</h3>
                  <p className="text-sm text-gray-500 mt-1">Manage your team members and their access levels</p>
                </div>
                <button
                  onClick={() => setShowAddAnalystModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Analyst
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Portfolio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compliance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {analysts.map(analyst => (
                    <tr key={analyst.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-medium">
                              {analyst.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{analyst.name}</p>
                            <p className="text-xs text-gray-500">{analyst.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(analyst.role)}`}>
                          {analyst.roleDisplay}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{analyst.region}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{analyst.portfolio.assignedDeals} deals</p>
                          <p className="text-xs text-gray-500">¥{(analyst.portfolio.totalValue / 1000000).toFixed(1)}M</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            analyst.portfolio.complianceScore >= 90 ? 'bg-green-500' :
                            analyst.portfolio.complianceScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <span className="text-sm">{analyst.portfolio.complianceScore}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(analyst.status)}`}>
                          {analyst.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openDetailsModal(analyst)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => openEditModal(analyst)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSuspendAnalyst(analyst)}
                            className={`p-2 rounded-lg ${analyst.status === 'suspended' ? 'text-green-600 hover:bg-green-50' : 'text-amber-600 hover:bg-amber-50'}`}
                            title={analyst.status === 'suspended' ? 'Activate' : 'Suspend'}
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                          <button onClick={() => openDeleteModal(analyst)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Team Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-4">Team Overview</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Analysts</span>
                  <span className="font-medium">{analysts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active</span>
                  <span className="font-medium text-green-600">{analysts.filter(a => a.status === 'active').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Suspended</span>
                  <span className="font-medium text-red-600">{analysts.filter(a => a.status === 'suspended').length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-4">Compliance Status</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">KYC Verified</span>
                  <span className="font-medium text-green-600">{analysts.filter(a => a.kycStatus === 'verified').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">KYC Pending/Expired</span>
                  <span className="font-medium text-amber-600">{analysts.filter(a => a.kycStatus !== 'verified').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Training Completed</span>
                  <span className="font-medium">{analysts.filter(a => a.trainingCompleted).length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-4">Portfolio Distribution</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Deals Assigned</span>
                  <span className="font-medium">{analysts.reduce((sum, a) => sum + a.portfolio.assignedDeals, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Value Managed</span>
                  <span className="font-medium">¥{(analysts.reduce((sum, a) => sum + a.portfolio.totalValue, 0) / 1000000).toFixed(0)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Compliance Score</span>
                  <span className="font-medium">{(analysts.filter(a => a.portfolio.complianceScore > 0).reduce((sum, a) => sum + a.portfolio.complianceScore, 0) / analysts.filter(a => a.portfolio.complianceScore > 0).length).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* PORTFOLIO TAB */}
      {/* ============================================ */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          {/* Portfolio Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Active Investments"
              value={investments.filter(i => i.status === 'active').length}
              icon={Briefcase}
              color="indigo"
              subtitle={`${investments.length} total`}
            />
            <StatCard
              title="Total Deployed"
              value={`¥${(totalPortfolioJPY / 1000000).toFixed(0)}M`}
              icon={DollarSign}
              color="blue"
            />
            <StatCard
              title="Average Interest Rate"
              value={`${(investments.reduce((sum, i) => sum + i.interestRate, 0) / investments.length).toFixed(1)}%`}
              icon={Percent}
              color="green"
            />
            <StatCard
              title="Maturing Soon"
              value={investments.filter(i => i.status === 'maturing').length}
              icon={Clock}
              color="amber"
              subtitle="Within 90 days"
            />
          </div>

          {/* Investments Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Active Investments</h3>
              <p className="text-sm text-gray-500 mt-1">Track your deposit instruments across partner banks</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investment ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partner Bank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Principal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Term</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maturity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Analyst</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {investments.map(investment => (
                    <tr key={investment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-indigo-600">{investment.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{investment.bank}</p>
                          <p className="text-xs text-gray-500">{investment.country}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">¥{investment.principalJPY.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">~${investment.principalUSD.toLocaleString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-green-600">{investment.interestRate}%</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{investment.term} months</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(investment.maturityDate)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{investment.assignedAnalyst}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(investment.status)}`}>
                          {investment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Allocation Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sector Allocation</h3>
              <div className="flex items-center gap-6">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={sectorAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {sectorAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3">
                  {sectorAllocation.map(item => (
                    <div key={item.sector} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-600">{item.sector}</span>
                      </div>
                      <span className="font-medium text-gray-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Maturity Profile</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { period: 'Q1 2025', value: 75 },
                  { period: 'Q2 2025', value: 50 },
                  { period: 'Q3 2025', value: 30 },
                  { period: 'Q4 2025', value: 25 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => `¥${value}M`} />
                  <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* OPPORTUNITIES TAB */}
      {/* ============================================ */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Available Investment Opportunities</h3>
              <p className="text-sm text-gray-500 mt-1">Capital calls from partner banks seeking investment</p>
            </div>
            <div className="divide-y divide-gray-100">
              {opportunities.map(opp => (
                <div key={opp.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm text-indigo-600">{opp.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(opp.status)}`}>
                          {opp.status}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-lg">{opp.bank}</h4>
                      <p className="text-sm text-gray-500">{opp.country} • {opp.impactFocus}</p>
                      
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Amount</p>
                          <p className="font-semibold text-gray-900">¥{(opp.amount / 1000000).toFixed(0)}M</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Interest Rate</p>
                          <p className="font-semibold text-green-600">{opp.interestRate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Term</p>
                          <p className="font-semibold text-gray-900">{opp.term} months</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Deadline</p>
                          <p className="font-semibold text-amber-600">{formatDate(opp.deadline)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="View Details">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Invest
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {opportunities.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Open Opportunities</h3>
              <p className="text-gray-500">New capital calls from partner banks will appear here.</p>
            </div>
          )}
        </div>
      )}

      {/* ============================================ */}
      {/* COMPLIANCE TAB */}
      {/* ============================================ */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          {/* Compliance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="font-medium text-gray-900">Overall Score</span>
              </div>
              <p className="text-3xl font-bold text-green-600">{complianceMetrics.overallScore}%</p>
              <p className="text-sm text-gray-600 mt-1">Organization compliance</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <UserCheck className="w-6 h-6 text-blue-600" />
                <span className="font-medium text-gray-900">KYC</span>
              </div>
              <p className="text-3xl font-bold text-blue-600">{complianceMetrics.kycCompliance}%</p>
              <p className="text-sm text-gray-600 mt-1">Team KYC verified</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-purple-600" />
                <span className="font-medium text-gray-900">AML</span>
              </div>
              <p className="text-3xl font-bold text-purple-600">{complianceMetrics.amlCompliance}%</p>
              <p className="text-sm text-gray-600 mt-1">AML compliance</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-amber-200">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-6 h-6 text-amber-600" />
                <span className="font-medium text-gray-900">Training</span>
              </div>
              <p className="text-3xl font-bold text-amber-600">{complianceMetrics.trainingCompliance}%</p>
              <p className="text-sm text-gray-600 mt-1">Training completed</p>
            </div>
          </div>

          {/* Analyst Compliance Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Analyst Compliance Status</h3>
              <p className="text-sm text-gray-500 mt-1">Individual compliance metrics per team member</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Analyst</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">KYC Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Training</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compliance Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Activity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {analysts.map(analyst => (
                    <tr key={analyst.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-medium text-sm">
                              {analyst.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{analyst.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(analyst.kycStatus)}`}>
                          {analyst.kycStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {analyst.trainingCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-amber-600" />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                analyst.portfolio.complianceScore >= 90 ? 'bg-green-500' :
                                analyst.portfolio.complianceScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${analyst.portfolio.complianceScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{analyst.portfolio.complianceScore}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatTime(analyst.lastLogin)}</td>
                      <td className="px-6 py-4">
                        {analyst.kycStatus !== 'verified' || !analyst.trainingCompleted ? (
                          <span className="text-sm text-red-600 font-medium">
                            {analyst.kycStatus !== 'verified' ? 'Renew KYC' : 'Complete Training'}
                          </span>
                        ) : (
                          <span className="text-sm text-green-600">None</span>
                        )}
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
      {/* IMPACT METRICS TAB */}
      {/* ============================================ */}
      {activeTab === 'impact' && (
        <div className="space-y-6">
          {/* Impact Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Borrowers Reached"
              value={totalBorrowersReached.toLocaleString()}
              icon={Users}
              color="indigo"
              trend={18}
            />
            <StatCard
              title="Women Borrowers"
              value={`${avgWomenBorrowers.toFixed(0)}%`}
              icon={UserCheck}
              color="purple"
            />
            <StatCard
              title="Rural Coverage"
              value={`${(investments.reduce((sum, i) => sum + i.impactMetrics.ruralBorrowers, 0) / investments.length).toFixed(0)}%`}
              icon={MapPin}
              color="green"
            />
            <StatCard
              title="Impact Score"
              value={portfolioMetrics.impactScore}
              icon={Award}
              color="amber"
              subtitle="Out of 100"
            />
          </div>

          {/* Impact by Investment */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Impact Metrics by Investment</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partner Bank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrowers Reached</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Loan Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Women %</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rural %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {investments.map(investment => (
                    <tr key={investment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{investment.bank}</p>
                          <p className="text-xs text-gray-500">{investment.country}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {investment.impactMetrics.borrowersReached.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        KES {investment.impactMetrics.avgLoanSize.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${investment.impactMetrics.womenBorrowers}%` }} />
                          </div>
                          <span className="text-sm font-medium">{investment.impactMetrics.womenBorrowers}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${investment.impactMetrics.ruralBorrowers}%` }} />
                          </div>
                          <span className="text-sm font-medium">{investment.impactMetrics.ruralBorrowers}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Generate Report */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Impact Reports</h3>
                <p className="text-sm text-gray-500 mt-1">Generate detailed impact reports for stakeholders</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <Download className="w-4 h-4" />
                Generate Report
              </button>
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
            {/* General Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">General Settings</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                  <input type="text" value={settings.organizationName} onChange={(e) => updateSetting('organizationName', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                    <select value={settings.timezone} onChange={(e) => updateSetting('timezone', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                      <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                      <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Currency</label>
                    <select value={settings.baseCurrency} onChange={(e) => updateSetting('baseCurrency', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                      <option value="USD">USD (US Dollar)</option>
                      <option value="JPY">JPY (Japanese Yen)</option>
                      <option value="EUR">EUR (Euro)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Investment Settings</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reporting Currency</label>
                  <select value={settings.reportingCurrency} onChange={(e) => updateSetting('reportingCurrency', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                    <option value="JPY">JPY (Japanese Yen)</option>
                    <option value="USD">USD (US Dollar)</option>
                    <option value="EUR">EUR (Euro)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Auto-Reinvest Returns</p>
                    <p className="text-sm text-gray-500">Automatically reinvest matured returns</p>
                  </div>
                  <Toggle enabled={settings.autoReinvest} onChange={() => updateSetting('autoReinvest', !settings.autoReinvest)} />
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                <Lock className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Security Settings</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Require 2FA for all team logins</p>
                  </div>
                  <Toggle enabled={settings.twoFactorRequired} onChange={() => updateSetting('twoFactorRequired', !settings.twoFactorRequired)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">API Access</p>
                    <p className="text-sm text-gray-500">Enable programmatic API access</p>
                  </div>
                  <Toggle enabled={settings.apiAccess} onChange={() => updateSetting('apiAccess', !settings.apiAccess)} />
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
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive alerts via email</p>
                  </div>
                  <Toggle enabled={settings.emailNotifications} onChange={() => updateSetting('emailNotifications', !settings.emailNotifications)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Weekly Digest</p>
                    <p className="text-sm text-gray-500">Receive weekly portfolio summary</p>
                  </div>
                  <Toggle enabled={settings.weeklyDigest} onChange={() => updateSetting('weeklyDigest', !settings.weeklyDigest)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Impact Reports</p>
                    <p className="text-sm text-gray-500">Monthly impact metrics reports</p>
                  </div>
                  <Toggle enabled={settings.impactReports} onChange={() => updateSetting('impactReports', !settings.impactReports)} />
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

      {/* Add Analyst Modal */}
      <Modal isOpen={showAddAnalystModal} onClose={() => setShowAddAnalystModal(false)} title="Add New Team Member">
        <form onSubmit={handleAddAnalyst} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" required value={analystFormData.name} onChange={(e) => setAnalystFormData({ ...analystFormData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="Enter full name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={analystFormData.email} onChange={(e) => setAnalystFormData({ ...analystFormData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="analyst@company.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" value={analystFormData.phone} onChange={(e) => setAnalystFormData({ ...analystFormData, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="+65 XXXX XXXX" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select value={analystFormData.role} onChange={(e) => setAnalystFormData({ ...analystFormData, role: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                <option value="investor_analyst">Investment Analyst</option>
                <option value="investor_junior">Junior Analyst</option>
                <option value="investor_research">Research Analyst</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <select value={analystFormData.region} onChange={(e) => setAnalystFormData({ ...analystFormData, region: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                <option value="East Africa">East Africa</option>
                <option value="West Africa">West Africa</option>
                <option value="Southeast Asia">Southeast Asia</option>
                <option value="South Asia">South Asia</option>
                <option value="Global">Global</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setShowAddAnalystModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add Team Member</button>
          </div>
        </form>
      </Modal>

      {/* Edit Analyst Modal */}
      <Modal isOpen={showEditAnalystModal} onClose={() => { setShowEditAnalystModal(false); setSelectedAnalyst(null); }} title="Edit Team Member">
        <form onSubmit={handleEditAnalyst} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" required value={analystFormData.name} onChange={(e) => setAnalystFormData({ ...analystFormData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={analystFormData.email} onChange={(e) => setAnalystFormData({ ...analystFormData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" value={analystFormData.phone} onChange={(e) => setAnalystFormData({ ...analystFormData, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select value={analystFormData.role} onChange={(e) => setAnalystFormData({ ...analystFormData, role: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                <option value="investor_analyst">Investment Analyst</option>
                <option value="investor_junior">Junior Analyst</option>
                <option value="investor_research">Research Analyst</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <select value={analystFormData.region} onChange={(e) => setAnalystFormData({ ...analystFormData, region: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                <option value="East Africa">East Africa</option>
                <option value="West Africa">West Africa</option>
                <option value="Southeast Asia">Southeast Asia</option>
                <option value="South Asia">South Asia</option>
                <option value="Global">Global</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => { setShowEditAnalystModal(false); setSelectedAnalyst(null); }} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Changes</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteConfirmModal} onClose={() => { setShowDeleteConfirmModal(false); setSelectedAnalyst(null); }} title="Remove Team Member" size="sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-gray-600 mb-2">Are you sure you want to remove</p>
          <p className="font-semibold text-gray-900 mb-4">{selectedAnalyst?.name}?</p>
          <p className="text-sm text-gray-500 mb-6">This action cannot be undone. Their assigned deals will need to be reassigned.</p>
          <div className="flex gap-3">
            <button onClick={() => { setShowDeleteConfirmModal(false); setSelectedAnalyst(null); }} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={handleDeleteAnalyst} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Remove</button>
          </div>
        </div>
      </Modal>

      {/* Analyst Details Modal */}
      <Modal isOpen={showAnalystDetailsModal} onClose={() => { setShowAnalystDetailsModal(false); setSelectedAnalyst(null); }} title="Team Member Details" size="lg">
        {selectedAnalyst && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-bold text-xl">{selectedAnalyst.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedAnalyst.name}</h3>
                <p className="text-gray-500">{selectedAnalyst.email}</p>
              </div>
              <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedAnalyst.status)}`}>{selectedAnalyst.status}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-semibold">{selectedAnalyst.roleDisplay}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Region</p>
                <p className="font-semibold">{selectedAnalyst.region}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-semibold">{selectedAnalyst.department}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Joined</p>
                <p className="font-semibold">{formatDate(selectedAnalyst.createdAt)}</p>
              </div>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h4 className="font-semibold text-gray-900 mb-3">Portfolio Assignment</h4>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Assigned Deals</p>
                  <p className="text-xl font-bold text-indigo-600">{selectedAnalyst.portfolio.assignedDeals}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Value</p>
                  <p className="text-xl font-bold text-indigo-600">¥{(selectedAnalyst.portfolio.totalValue / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Avg Return</p>
                  <p className="text-xl font-bold text-green-600">{selectedAnalyst.portfolio.avgReturn}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Compliance</p>
                  <p className="text-xl font-bold text-purple-600">{selectedAnalyst.portfolio.complianceScore}%</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">KYC Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAnalyst.kycStatus)}`}>
                  {selectedAnalyst.kycStatus}
                </span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Training</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedAnalyst.trainingCompleted ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {selectedAnalyst.trainingCompleted ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">Last Login</p>
              <p className="font-semibold">{formatTime(selectedAnalyst.lastLogin)}</p>
            </div>

            {selectedAnalyst.permissions && selectedAnalyst.permissions.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Permissions</p>
                <div className="flex flex-wrap gap-2">
                  {selectedAnalyst.permissions.map(perm => (
                    <span key={perm} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">{perm}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
      {/* Amazon Q AI Assistant */}
      <AmazonQChat 
        userRole="investor_admin" 
        tenantId="default"
      />
    </div>
  );
};

export default InvestorAdminDashboard;
