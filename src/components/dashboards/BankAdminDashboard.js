// BankAdminDashboard.js - Partner Bank Administrator Dashboard
// Enhanced with functional user/staff management, settings, and consistent sample data
// Now reads URL path to determine which tab to show
// Includes Settlement Management and Deposit Instruments tabs

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Building2, Users, TrendingUp, DollarSign, Wallet, Shield, Settings, Plus, Eye, Edit, Ban, Trash2,
  RefreshCw, Search, ArrowUpRight, ArrowDownRight, CheckCircle, Clock, AlertTriangle, CreditCard,
  Activity, FileText, BarChart3, X, Save, Bell, Lock, Globe, Database, Mail, Smartphone, Key,
  Banknote, ArrowRightLeft, Percent, Receipt, Check, XCircle, ExternalLink, Calculator
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';

// ============================================
// UNIVERSAL SAMPLE DATABASE
// This data is consistent across all dashboards
// ============================================
const SAMPLE_DATABASE = {
  // Bank metrics (consistent with super-admin view)
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
    collectionRate: 96.8
  },
  
  // Loan portfolio breakdown
  loanPortfolio: {
    performing: 7845, // 91.8%
    watchlist: 412, // 4.8%
    substandard: 198, // 2.3%
    doubtful: 62, // 0.7%
    loss: 25 // 0.3%
  },
  
  // Today's activity
  todayActivity: {
    disbursements: 12500000,
    collections: 8750000,
    pendingReview: 156,
    avgLoanSize: 15000,
    newApplications: 89,
    approvedToday: 67,
    rejectedToday: 12
  },
  
  // Staff members
  staff: [
    { id: 'staff_001', name: 'James Mwangi', email: 'james.mwangi@equityafrica.com', phone: '+254 722 123 456', role: 'bank_lender', roleDisplay: 'Lending Officer', department: 'Lending', status: 'active', lastLogin: '2024-12-10T10:30:00Z', createdAt: '2024-01-15', permissions: ['loans.view', 'loans.approve', 'loans.disburse'] },
    { id: 'staff_002', name: 'Sarah Ochieng', email: 'sarah.ochieng@equityafrica.com', phone: '+254 733 234 567', role: 'bank_caller', roleDisplay: 'Capital Markets Officer', department: 'Treasury', status: 'active', lastLogin: '2024-12-10T09:15:00Z', createdAt: '2024-02-01', permissions: ['deposits.view', 'deposits.create', 'investors.contact'] },
    { id: 'staff_003', name: 'Peter Kimani', email: 'peter.kimani@equityafrica.com', phone: '+254 711 345 678', role: 'bank_compliance', roleDisplay: 'Compliance Officer', department: 'Compliance', status: 'active', lastLogin: '2024-12-10T08:45:00Z', createdAt: '2024-01-20', permissions: ['compliance.view', 'compliance.approve', 'reports.generate'] },
    { id: 'staff_004', name: 'Grace Wanjiku', email: 'grace.wanjiku@equityafrica.com', phone: '+254 700 456 789', role: 'bank_risk', roleDisplay: 'Credit Risk Analyst', department: 'Risk', status: 'active', lastLogin: '2024-12-09T16:00:00Z', createdAt: '2024-03-01', permissions: ['risk.view', 'risk.assess', 'reports.generate'] },
    { id: 'staff_005', name: 'Michael Oduya', email: 'michael.oduya@equityafrica.com', phone: '+254 788 567 890', role: 'bank_lender', roleDisplay: 'Senior Lending Officer', department: 'Lending', status: 'active', lastLogin: '2024-12-10T11:00:00Z', createdAt: '2024-04-15', permissions: ['loans.view', 'loans.approve', 'loans.disburse', 'staff.manage'] },
    { id: 'staff_006', name: 'Faith Akinyi', email: 'faith.akinyi@equityafrica.com', phone: '+254 722 678 901', role: 'bank_lender', roleDisplay: 'Lending Officer', department: 'Lending', status: 'suspended', lastLogin: '2024-11-28T14:30:00Z', createdAt: '2024-05-01', permissions: ['loans.view', 'loans.approve'] }
  ],
  
  // Revenue trend data
  revenueTrend: [
    { month: 'Jul', revenue: 28, costs: 8, profit: 20, loans: 6200, collections: 5800 },
    { month: 'Aug', revenue: 32, costs: 9, profit: 23, loans: 6800, collections: 6400 },
    { month: 'Sep', revenue: 36, costs: 10, profit: 26, loans: 7400, collections: 7000 },
    { month: 'Oct', revenue: 40, costs: 11, profit: 29, loans: 7900, collections: 7600 },
    { month: 'Nov', revenue: 42, costs: 11, profit: 31, loans: 8200, collections: 8000 },
    { month: 'Dec', revenue: 45, costs: 12, profit: 33, loans: 8542, collections: 8250 }
  ],
  
  // P&L data
  plData: {
    grossRevenue: 45600000,
    interestIncome: 38500000,
    fees: 7100000,
    operatingCosts: 12300000,
    netProfit: 33300000,
    margin: 73,
    mtdRevenue: 8500000,
    mtdTarget: 10000000
  },

  // Deposit Instruments
  depositInstruments: [
    { 
      id: 'DEP-001', 
      investor: 'Sakura Capital Partners', 
      investorCountry: 'Japan',
      principalJPY: 50000000, 
      principalKES: 52500000,
      depositRate: 0.0095, // JPY/KES at deposit
      currentRate: 0.0098,
      interestRate: 8.5,
      term: 12,
      startDate: '2024-03-15',
      maturityDate: '2025-03-15',
      status: 'active',
      forwardRate: 0.0092, // Locked forward rate for repatriation
      forwardCost: 125000, // Cost to hedge in KES
    },
    { 
      id: 'DEP-002', 
      investor: 'Nordic Impact Fund', 
      investorCountry: 'Sweden',
      principalJPY: 75000000, 
      principalKES: 78750000,
      depositRate: 0.0095,
      currentRate: 0.0098,
      interestRate: 9.0,
      term: 18,
      startDate: '2024-01-20',
      maturityDate: '2025-07-20',
      status: 'active',
      forwardRate: 0.0091,
      forwardCost: 210000,
    },
    { 
      id: 'DEP-003', 
      investor: 'Geneva Wealth Management', 
      investorCountry: 'Switzerland',
      principalJPY: 25000000, 
      principalKES: 26250000,
      depositRate: 0.0095,
      currentRate: 0.0098,
      interestRate: 7.5,
      term: 6,
      startDate: '2024-09-01',
      maturityDate: '2025-03-01',
      status: 'maturing',
      forwardRate: 0.0094,
      forwardCost: 45000,
    },
    { 
      id: 'DEP-004', 
      investor: 'Singapore Sovereign Fund', 
      investorCountry: 'Singapore',
      principalJPY: 30000000, 
      principalKES: 31500000,
      depositRate: 0.0095,
      currentRate: 0.0098,
      interestRate: 8.0,
      term: 12,
      startDate: '2024-06-10',
      maturityDate: '2025-06-10',
      status: 'active',
      forwardRate: 0.0093,
      forwardCost: 85000,
    }
  ],

  // Settlement records for capital repatriation
  settlements: [
    {
      id: 'SET-001',
      depositId: 'DEP-003',
      investor: 'Geneva Wealth Management',
      investorCountry: 'Switzerland',
      status: 'pending_approval',
      type: 'maturity',
      // Original deposit details
      principalJPY: 25000000,
      principalKES: 26250000,
      depositDate: '2024-09-01',
      maturityDate: '2025-03-01',
      // Interest earned
      interestRate: 7.5,
      interestEarnedKES: 984375, // 7.5% for 6 months
      totalRepaymentKES: 27234375, // Principal + Interest
      // Exchange rates
      depositExchangeRate: 0.0095, // JPY/KES at deposit
      remittanceExchangeRate: 0.0098, // Current JPY/KES for remittance
      forwardContractRate: 0.0094, // Locked forward rate
      // Amounts in JPY
      principalRemittanceJPY: 25000000,
      interestRemittanceJPY: 937500, // At forward rate
      totalRemittanceJPY: 25937500,
      // Forwards contract details
      forwardContractId: 'FWD-003',
      forwardContractCostKES: 45000,
      forwardContractDate: '2024-09-01',
      // ROI calculations
      spotRateGainLoss: -78750, // Loss if using spot vs deposit rate
      forwardRateGainLoss: 26250, // Gain from using forward vs spot
      netFxImpact: -52500,
      // Fees
      platformFeeKES: 136172, // 0.5% of total
      swiftFeeKES: 5000,
      correspondentBankFeeKES: 15000,
      totalFeesKES: 156172,
      // Net settlement
      netSettlementKES: 27078203,
      netSettlementJPY: 25819717,
      // Timestamps
      requestedAt: '2024-12-28T10:30:00Z',
      requestedBy: 'System (Auto-maturity)',
    },
    {
      id: 'SET-002',
      depositId: 'DEP-001',
      investor: 'Sakura Capital Partners',
      investorCountry: 'Japan',
      status: 'pending_approval',
      type: 'partial_withdrawal',
      // Original deposit details
      principalJPY: 50000000,
      principalKES: 52500000,
      depositDate: '2024-03-15',
      maturityDate: '2025-03-15',
      // Partial withdrawal
      withdrawalAmountKES: 15000000,
      remainingPrincipalKES: 37500000,
      // Interest earned (prorated)
      interestRate: 8.5,
      interestEarnedKES: 956250, // Prorated interest
      totalRepaymentKES: 15956250,
      // Exchange rates
      depositExchangeRate: 0.0095,
      remittanceExchangeRate: 0.0098,
      forwardContractRate: 0.0092,
      // Amounts in JPY
      withdrawalRemittanceJPY: 14680000,
      interestRemittanceJPY: 879575,
      totalRemittanceJPY: 15559575,
      // Forwards contract details
      forwardContractId: 'FWD-001-P',
      forwardContractCostKES: 38000,
      forwardContractDate: '2024-03-15',
      // ROI calculations
      spotRateGainLoss: -47850,
      forwardRateGainLoss: 95700,
      netFxImpact: 47850,
      // Fees
      platformFeeKES: 79781,
      swiftFeeKES: 5000,
      correspondentBankFeeKES: 15000,
      totalFeesKES: 99781,
      // Net settlement
      netSettlementKES: 15856469,
      netSettlementJPY: 15459794,
      // Timestamps
      requestedAt: '2024-12-29T14:15:00Z',
      requestedBy: 'Sakura Capital Partners',
    },
    {
      id: 'SET-003',
      depositId: 'DEP-002',
      investor: 'Nordic Impact Fund',
      investorCountry: 'Sweden',
      status: 'approved',
      type: 'interest_payment',
      // Interest payment only
      principalJPY: 75000000,
      principalKES: 78750000,
      interestRate: 9.0,
      interestPeriod: 'Q4 2024',
      interestEarnedKES: 1771875, // Quarterly interest
      totalRepaymentKES: 1771875,
      // Exchange rates
      depositExchangeRate: 0.0095,
      remittanceExchangeRate: 0.0097,
      forwardContractRate: 0.0091,
      // Amounts in JPY
      interestRemittanceJPY: 1612406,
      totalRemittanceJPY: 1612406,
      // Forwards contract details
      forwardContractId: 'FWD-002-Q4',
      forwardContractCostKES: 12000,
      forwardContractDate: '2024-10-01',
      // ROI calculations
      spotRateGainLoss: -35438,
      forwardRateGainLoss: 106313,
      netFxImpact: 70875,
      // Fees
      platformFeeKES: 8859,
      swiftFeeKES: 3000,
      correspondentBankFeeKES: 8000,
      totalFeesKES: 19859,
      // Net settlement
      netSettlementKES: 1752016,
      netSettlementJPY: 1594335,
      // Timestamps
      requestedAt: '2024-12-20T09:00:00Z',
      requestedBy: 'Nordic Impact Fund',
      approvedAt: '2024-12-21T11:30:00Z',
      approvedBy: 'Sarah Ochieng',
    },
    {
      id: 'SET-004',
      depositId: 'DEP-004',
      investor: 'Singapore Sovereign Fund',
      investorCountry: 'Singapore',
      status: 'completed',
      type: 'interest_payment',
      // Interest payment only
      principalJPY: 30000000,
      principalKES: 31500000,
      interestRate: 8.0,
      interestPeriod: 'Q3 2024',
      interestEarnedKES: 630000,
      totalRepaymentKES: 630000,
      // Exchange rates
      depositExchangeRate: 0.0095,
      remittanceExchangeRate: 0.0096,
      forwardContractRate: 0.0093,
      // Amounts in JPY
      interestRemittanceJPY: 585900,
      totalRemittanceJPY: 585900,
      // Forwards contract details
      forwardContractId: 'FWD-004-Q3',
      forwardContractCostKES: 8500,
      forwardContractDate: '2024-06-10',
      // ROI calculations
      spotRateGainLoss: -6300,
      forwardRateGainLoss: 18900,
      netFxImpact: 12600,
      // Fees
      platformFeeKES: 3150,
      swiftFeeKES: 3000,
      correspondentBankFeeKES: 5000,
      totalFeesKES: 11150,
      // Net settlement
      netSettlementKES: 618850,
      netSettlementJPY: 575530,
      // Timestamps
      requestedAt: '2024-09-25T10:00:00Z',
      requestedBy: 'Singapore Sovereign Fund',
      approvedAt: '2024-09-26T09:15:00Z',
      approvedBy: 'Peter Kimani',
      completedAt: '2024-09-28T14:00:00Z',
      remittanceRef: 'SWIFT-2024092800145',
    }
  ],

  // Forward contracts summary
  forwardContracts: {
    totalActive: 4,
    totalNotionalKES: 188500000,
    totalCostKES: 465000,
    avgForwardRate: 0.0093,
    currentSpotRate: 0.0098,
    unrealizedGainKES: 942500,
    hedgeRatio: 100 // Percentage of deposits hedged
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
const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => {
  const colorClasses = {
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
    indigo: 'bg-indigo-100 text-indigo-600'
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
              <span>{Math.abs(trend)}% vs last month</span>
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
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-purple-600' : 'bg-gray-300'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

// ============================================
// URL PATH TO TAB MAPPING
// ============================================
const getTabFromPath = (pathname) => {
  if (pathname.includes('/users') || pathname.includes('/staff')) return 'staff';
  if (pathname.includes('/pnl')) return 'pl';
  if (pathname.includes('/settings')) return 'settings';
  if (pathname.includes('/compliance')) return 'compliance';
  if (pathname.includes('/operations') || pathname.includes('/lending')) return 'operations';
  if (pathname.includes('/analytics')) return 'analytics';
  if (pathname.includes('/reports')) return 'reports';
  if (pathname.includes('/notifications')) return 'notifications';
  if (pathname.includes('/instruments')) return 'instruments';
  if (pathname.includes('/settlement')) return 'settlement';
  return 'overview';
};

// ============================================
// MAIN BANK ADMIN DASHBOARD
// ============================================
const BankAdminDashboard = () => {
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
  const [staff, setStaff] = useState(SAMPLE_DATABASE.staff);
  const [revenueTrend] = useState(SAMPLE_DATABASE.revenueTrend);
  const [plData] = useState(SAMPLE_DATABASE.plData);
  const [depositInstruments] = useState(SAMPLE_DATABASE.depositInstruments);
  const [settlements, setSettlements] = useState(SAMPLE_DATABASE.settlements);
  const [forwardContracts] = useState(SAMPLE_DATABASE.forwardContracts);
  
  // Modal states
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showEditStaffModal, setShowEditStaffModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showStaffDetailsModal, setShowStaffDetailsModal] = useState(false);
  const [showSettlementDetailsModal, setShowSettlementDetailsModal] = useState(false);
  const [showApproveSettlementModal, setShowApproveSettlementModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  
  // Staff form data
  const [staffFormData, setStaffFormData] = useState({
    name: '', email: '', phone: '', role: 'bank_lender', department: 'Lending'
  });
  
  // Settings state
  const [settings, setSettings] = useState({
    bankName: 'Equity Bank Kenya',
    timezone: 'Africa/Nairobi',
    currency: 'KES',
    loanApprovalThreshold: 100000,
    autoApprovalEnabled: false,
    twoFactorRequired: true,
    emailNotifications: true,
    smsNotifications: true,
    dailyReports: true,
    weeklyDigest: true,
    whatsappIntegration: true,
    mpesaIntegration: true,
    apiAccess: false
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
      overview: '/bank/admin',
      staff: '/bank/admin/users',
      operations: '/bank/admin/lending',
      compliance: '/bank/admin/compliance',
      pl: '/bank/admin/pnl',
      settings: '/bank/admin/settings',
      analytics: '/bank/admin/analytics',
      reports: '/bank/admin/reports',
      notifications: '/bank/admin/notifications',
      instruments: '/bank/admin/instruments',
      settlement: '/bank/admin/settlement'
    };
    if (tabToPath[tabId]) {
      navigate(tabToPath[tabId]);
    }
  };

  // ============================================
  // STAFF MANAGEMENT FUNCTIONS
  // ============================================
  const handleAddStaff = (e) => {
    e.preventDefault();
    const roleDisplayMap = {
      bank_admin: 'Bank Administrator',
      bank_lender: 'Lending Officer',
      bank_caller: 'Capital Markets Officer',
      bank_compliance: 'Compliance Officer',
      bank_risk: 'Credit Risk Analyst'
    };
    const newStaff = {
      id: `staff_${Date.now()}`,
      ...staffFormData,
      roleDisplay: roleDisplayMap[staffFormData.role],
      status: 'pending',
      lastLogin: null,
      createdAt: new Date().toISOString().split('T')[0],
      permissions: []
    };
    setStaff([...staff, newStaff]);
    setShowAddStaffModal(false);
    setStaffFormData({ name: '', email: '', phone: '', role: 'bank_lender', department: 'Lending' });
  };

  const handleEditStaff = (e) => {
    e.preventDefault();
    const roleDisplayMap = {
      bank_admin: 'Bank Administrator',
      bank_lender: 'Lending Officer',
      bank_caller: 'Capital Markets Officer',
      bank_compliance: 'Compliance Officer',
      bank_risk: 'Credit Risk Analyst'
    };
    setStaff(staff.map(s => s.id === selectedStaff.id ? { 
      ...s, 
      ...staffFormData,
      roleDisplay: roleDisplayMap[staffFormData.role]
    } : s));
    setShowEditStaffModal(false);
    setSelectedStaff(null);
  };

  const handleSuspendStaff = (member) => {
    setStaff(staff.map(s => s.id === member.id ? { ...s, status: s.status === 'suspended' ? 'active' : 'suspended' } : s));
  };

  const handleDeleteStaff = () => {
    setStaff(staff.filter(s => s.id !== selectedStaff.id));
    setShowDeleteConfirmModal(false);
    setSelectedStaff(null);
  };

  const openEditModal = (member) => {
    setSelectedStaff(member);
    setStaffFormData({
      name: member.name,
      email: member.email,
      phone: member.phone || '',
      role: member.role,
      department: member.department || 'Lending'
    });
    setShowEditStaffModal(true);
  };

  const openDeleteModal = (member) => {
    setSelectedStaff(member);
    setShowDeleteConfirmModal(true);
  };

  const openDetailsModal = (member) => {
    setSelectedStaff(member);
    setShowStaffDetailsModal(true);
  };

  // ============================================
  // SETTLEMENT FUNCTIONS
  // ============================================
  const handleApproveSettlement = () => {
    setSettlements(settlements.map(s => 
      s.id === selectedSettlement.id 
        ? { ...s, status: 'approved', approvedAt: new Date().toISOString(), approvedBy: 'Current User' }
        : s
    ));
    setShowApproveSettlementModal(false);
    setSelectedSettlement(null);
  };

  const handleRejectSettlement = () => {
    setSettlements(settlements.map(s => 
      s.id === selectedSettlement.id 
        ? { ...s, status: 'rejected', rejectedAt: new Date().toISOString(), rejectedBy: 'Current User' }
        : s
    ));
    setShowApproveSettlementModal(false);
    setSelectedSettlement(null);
  };

  // ============================================
  // SETTINGS UPDATE FUNCTION
  // ============================================
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Helper functions
  const getRoleColor = (role) => {
    const colors = {
      bank_admin: 'bg-purple-100 text-purple-700',
      bank_lender: 'bg-blue-100 text-blue-700',
      bank_caller: 'bg-indigo-100 text-indigo-700',
      bank_compliance: 'bg-amber-100 text-amber-700',
      bank_risk: 'bg-rose-100 text-rose-700'
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-700',
      suspended: 'bg-red-100 text-red-700',
      pending: 'bg-yellow-100 text-yellow-700',
      maturing: 'bg-amber-100 text-amber-700',
      pending_approval: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getSettlementTypeLabel = (type) => {
    const labels = {
      maturity: 'Full Maturity',
      partial_withdrawal: 'Partial Withdrawal',
      interest_payment: 'Interest Payment'
    };
    return labels[type] || type;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' });
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

  const formatCurrency = (amount, currency = 'KES') => {
    if (currency === 'JPY') {
      return `¥${amount.toLocaleString()}`;
    }
    return `KES ${amount.toLocaleString()}`;
  };

  // Portfolio data for pie chart
  const portfolioChartData = [
    { name: 'Performing', value: loanPortfolio.performing, color: '#10B981' },
    { name: 'Watchlist', value: loanPortfolio.watchlist, color: '#F59E0B' },
    { name: 'Substandard', value: loanPortfolio.substandard, color: '#EF4444' },
    { name: 'Doubtful', value: loanPortfolio.doubtful, color: '#DC2626' },
    { name: 'Loss', value: loanPortfolio.loss, color: '#7F1D1D' }
  ];

  const totalLoans = Object.values(loanPortfolio).reduce((a, b) => a + b, 0);

  // Calculate settlement stats
  const pendingSettlements = settlements.filter(s => s.status === 'pending_approval');
  const totalPendingValueKES = pendingSettlements.reduce((sum, s) => sum + s.totalRepaymentKES, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading bank dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-6 h-6" />
              <span className="text-purple-200 text-sm font-medium">BANK ADMINISTRATION</span>
            </div>
            <h1 className="text-2xl font-bold">Equity Bank Kenya</h1>
            <p className="text-purple-100 mt-1">
              {staff.filter(s => s.status === 'active').length} active staff • {metrics.activeLoanCount.toLocaleString()} active loans
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-purple-200">Net Profit (YTD)</p>
            <p className="text-3xl font-bold">KES {(plData.netProfit / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-purple-200 mt-1">{plData.margin}% margin</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 shadow-sm overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'staff', label: 'Staff Management', icon: Users },
          { id: 'instruments', label: 'Deposit Instruments', icon: Banknote },
          { id: 'settlement', label: 'Settlement Management', icon: ArrowRightLeft },
          { id: 'operations', label: 'Operations', icon: Wallet },
          { id: 'compliance', label: 'Compliance', icon: Shield },
          { id: 'pl', label: 'P&L Account', icon: BarChart3 },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.id === 'settlement' && pendingSettlements.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {pendingSettlements.length}
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
              title="Active Staff"
              value={staff.filter(s => s.status === 'active').length}
              icon={Users}
              color="purple"
              subtitle={`${staff.length} total`}
            />
            <StatCard
              title="Loan Book Value"
              value={`KES ${(metrics.loanBookValue / 1000000000).toFixed(2)}B`}
              icon={Wallet}
              color="blue"
              trend={15}
            />
            <StatCard
              title="Total Deposits"
              value={`¥${(metrics.totalDepositValue / 1000000).toFixed(0)}M`}
              icon={TrendingUp}
              color="green"
              trend={8}
            />
            <StatCard
              title="Default Rate"
              value={`${metrics.defaultRate}%`}
              icon={AlertTriangle}
              color="amber"
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <span className="font-medium text-gray-900">Total Loans</span>
                    <span className="font-bold text-gray-900">{totalLoans.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Activity</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpRight className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-600">Disbursements</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    KES {(todayActivity.disbursements / 1000000).toFixed(2)}M
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{todayActivity.approvedToday} loans approved</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowDownRight className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-600">Collections</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    KES {(todayActivity.collections / 1000000).toFixed(2)}M
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{metrics.collectionRate}% collection rate</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span className="text-sm text-gray-600">Pending Review</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-600">{todayActivity.pendingReview}</p>
                  <p className="text-xs text-gray-500 mt-1">{todayActivity.newApplications} new today</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-600">Avg Loan Size</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    KES {todayActivity.avgLoanSize.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Mobile lending average</p>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend (KES Millions)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `KES ${value}M`} />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" fill="url(#colorRevenue)" name="Revenue" />
                <Line type="monotone" dataKey="profit" stroke="#10B981" name="Profit" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* STAFF MANAGEMENT TAB */}
      {/* ============================================ */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Staff Members</h3>
                  <p className="text-sm text-gray-500 mt-1">Manage your bank staff and their access levels</p>
                </div>
                <button
                  onClick={() => setShowAddStaffModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Staff
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {staff.map(member => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-medium">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                          {member.roleDisplay}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{member.department}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatTime(member.lastLogin)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openDetailsModal(member)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => openEditModal(member)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSuspendStaff(member)}
                            className={`p-2 rounded-lg ${member.status === 'suspended' ? 'text-green-600 hover:bg-green-50' : 'text-amber-600 hover:bg-amber-50'}`}
                            title={member.status === 'suspended' ? 'Activate' : 'Suspend'}
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                          <button onClick={() => openDeleteModal(member)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
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
        </div>
      )}

      {/* ============================================ */}
      {/* DEPOSIT INSTRUMENTS TAB */}
      {/* ============================================ */}
      {activeTab === 'instruments' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Active Deposits"
              value={depositInstruments.filter(d => d.status === 'active').length}
              icon={Banknote}
              color="green"
              subtitle={`${depositInstruments.length} total instruments`}
            />
            <StatCard
              title="Total Principal (JPY)"
              value={`¥${(depositInstruments.reduce((sum, d) => sum + d.principalJPY, 0) / 1000000).toFixed(0)}M`}
              icon={DollarSign}
              color="blue"
            />
            <StatCard
              title="Avg Interest Rate"
              value={`${(depositInstruments.reduce((sum, d) => sum + d.interestRate, 0) / depositInstruments.length).toFixed(1)}%`}
              icon={Percent}
              color="purple"
            />
            <StatCard
              title="Maturing Soon"
              value={depositInstruments.filter(d => d.status === 'maturing').length}
              icon={Clock}
              color="amber"
              subtitle="Within 90 days"
            />
          </div>

          {/* Deposit Instruments Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Deposit Instruments</h3>
              <p className="text-sm text-gray-500 mt-1">Manage investor deposit instruments and track maturities</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instrument ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Principal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Term</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maturity Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Forward Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {depositInstruments.map(deposit => (
                    <tr key={deposit.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-purple-600">{deposit.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{deposit.investor}</p>
                          <p className="text-xs text-gray-500">{deposit.investorCountry}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">¥{deposit.principalJPY.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">KES {deposit.principalKES.toLocaleString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-green-600">{deposit.interestRate}%</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{deposit.term} months</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(deposit.maturityDate)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deposit.status)}`}>
                          {deposit.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-900">{deposit.forwardRate.toFixed(4)}</p>
                          <p className="text-xs text-gray-500">Cost: KES {deposit.forwardCost.toLocaleString()}</p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Exchange Rate Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Exchange Rates</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Spot Rate (JPY/KES)</span>
                  <span className="font-bold text-gray-900">{forwardContracts.currentSpotRate.toFixed(4)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Avg Forward Rate</span>
                  <span className="font-bold text-gray-900">{forwardContracts.avgForwardRate.toFixed(4)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-600">Unrealized FX Gain</span>
                  <span className="font-bold text-green-600">KES {forwardContracts.unrealizedGainKES.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Forward Contracts Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Active Contracts</span>
                  <span className="font-bold text-gray-900">{forwardContracts.totalActive}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Total Notional</span>
                  <span className="font-bold text-gray-900">KES {(forwardContracts.totalNotionalKES / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Total Hedge Cost</span>
                  <span className="font-bold text-gray-900">KES {forwardContracts.totalCostKES.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-600">Hedge Ratio</span>
                  <span className="font-bold text-blue-600">{forwardContracts.hedgeRatio}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* SETTLEMENT MANAGEMENT TAB */}
      {/* ============================================ */}
      {activeTab === 'settlement' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Pending Approvals"
              value={pendingSettlements.length}
              icon={Clock}
              color="amber"
              subtitle={`KES ${(totalPendingValueKES / 1000000).toFixed(1)}M value`}
            />
            <StatCard
              title="Approved (Processing)"
              value={settlements.filter(s => s.status === 'approved').length}
              icon={CheckCircle}
              color="blue"
            />
            <StatCard
              title="Completed (This Month)"
              value={settlements.filter(s => s.status === 'completed').length}
              icon={Check}
              color="green"
            />
            <StatCard
              title="Total Fees Collected"
              value={`KES ${(settlements.reduce((sum, s) => sum + s.totalFeesKES, 0) / 1000).toFixed(0)}K`}
              icon={Receipt}
              color="purple"
            />
          </div>

          {/* Pending Settlements */}
          {pendingSettlements.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden">
              <div className="p-6 border-b border-amber-100 bg-amber-50">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Pending Settlement Approvals</h3>
                    <p className="text-sm text-gray-600">Review and approve capital repatriation requests</p>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {pendingSettlements.map(settlement => (
                  <div key={settlement.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-sm text-purple-600">{settlement.id}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            settlement.type === 'maturity' ? 'bg-green-100 text-green-700' :
                            settlement.type === 'partial_withdrawal' ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {getSettlementTypeLabel(settlement.type)}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900">{settlement.investor}</h4>
                        <p className="text-sm text-gray-500">{settlement.investorCountry} • Deposit: {settlement.depositId}</p>
                        
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Repayment Amount</p>
                            <p className="font-semibold text-gray-900">KES {settlement.totalRepaymentKES.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Remittance (JPY)</p>
                            <p className="font-semibold text-gray-900">¥{settlement.totalRemittanceJPY.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Exchange Rate</p>
                            <p className="font-semibold text-gray-900">{settlement.forwardContractRate.toFixed(4)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Total Fees</p>
                            <p className="font-semibold text-gray-900">KES {settlement.totalFeesKES.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-4 text-sm">
                          <span className={`flex items-center gap-1 ${settlement.netFxImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {settlement.netFxImpact >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            Net FX Impact: KES {Math.abs(settlement.netFxImpact).toLocaleString()}
                          </span>
                          <span className="text-gray-500">
                            Requested: {formatTime(settlement.requestedAt)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => {
                            setSelectedSettlement(settlement);
                            setShowSettlementDetailsModal(true);
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSettlement(settlement);
                            setShowApproveSettlementModal(true);
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Review
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Settlements Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">All Settlements</h3>
              <p className="text-sm text-gray-500 mt-1">Complete history of capital repatriation settlements</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Settlement ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount (KES)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount (JPY)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">FX Impact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {settlements.map(settlement => (
                    <tr key={settlement.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-purple-600">{settlement.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{settlement.investor}</p>
                          <p className="text-xs text-gray-500">{settlement.depositId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          settlement.type === 'maturity' ? 'bg-green-100 text-green-700' :
                          settlement.type === 'partial_withdrawal' ? 'bg-blue-100 text-blue-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {getSettlementTypeLabel(settlement.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {settlement.totalRepaymentKES.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        ¥{settlement.totalRemittanceJPY.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${settlement.netFxImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {settlement.netFxImpact >= 0 ? '+' : ''}{settlement.netFxImpact.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(settlement.status)}`}>
                          {settlement.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedSettlement(settlement);
                            setShowSettlementDetailsModal(true);
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
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

          {/* ROI & Fee Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Forward Contract ROI Analysis */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Calculator className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Forward Contract ROI</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Total Forward Cost</span>
                    <span className="font-medium text-gray-900">KES {forwardContracts.totalCostKES.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Unrealized FX Gain</span>
                    <span className="font-medium text-green-600">KES {forwardContracts.unrealizedGainKES.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">Net ROI on Hedging</span>
                      <span className="font-bold text-green-600">
                        +{(((forwardContracts.unrealizedGainKES - forwardContracts.totalCostKES) / forwardContracts.totalCostKES) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Forward contracts have protected against JPY appreciation, generating net positive returns after hedging costs.
                </p>
              </div>
            </div>

            {/* Fee Breakdown */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Receipt className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Transaction Fee Summary</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Platform Fees (0.5%)</span>
                  <span className="font-medium text-gray-900">
                    KES {settlements.reduce((sum, s) => sum + s.platformFeeKES, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">SWIFT Fees</span>
                  <span className="font-medium text-gray-900">
                    KES {settlements.reduce((sum, s) => sum + s.swiftFeeKES, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Correspondent Bank Fees</span>
                  <span className="font-medium text-gray-900">
                    KES {settlements.reduce((sum, s) => sum + s.correspondentBankFeeKES, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="font-medium text-gray-900">Total Fees Collected</span>
                  <span className="font-bold text-purple-600">
                    KES {settlements.reduce((sum, s) => sum + s.totalFeesKES, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* OPERATIONS TAB */}
      {/* ============================================ */}
      {activeTab === 'operations' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lending Operations */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-blue-100">
                  <Wallet className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Mobile Lending</h3>
                  <p className="text-sm text-gray-500">WhatsApp loan operations</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Disbursed Today</span>
                  <span className="font-medium">KES {(todayActivity.disbursements / 1000000).toFixed(2)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Collected Today</span>
                  <span className="font-medium">KES {(todayActivity.collections / 1000000).toFixed(2)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Queue</span>
                  <span className="font-medium">{todayActivity.pendingReview} applications</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Loan Size</span>
                  <span className="font-medium">KES {todayActivity.avgLoanSize.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Capital Markets */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-indigo-100">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Capital Markets</h3>
                  <p className="text-sm text-gray-500">Deposit instruments & investor relations</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Deposits</span>
                  <span className="font-medium">{metrics.activeDeposits} instruments</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Value</span>
                  <span className="font-medium">¥{(metrics.totalDepositValue / 1000000).toFixed(0)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Portfolio Yield</span>
                  <span className="font-medium">{metrics.portfolioYield}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Settlements</span>
                  <span className="font-medium">{pendingSettlements.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Loan Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan & Collection Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="loans" fill="#3B82F6" name="Active Loans" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collections" fill="#10B981" name="Collections" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* COMPLIANCE TAB */}
      {/* ============================================ */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="font-medium text-gray-900">KYC Status</span>
              </div>
              <p className="text-3xl font-bold text-green-600">98.5%</p>
              <p className="text-sm text-gray-600 mt-1">Borrowers verified</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-amber-200">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                <span className="font-medium text-gray-900">AML Alerts</span>
              </div>
              <p className="text-3xl font-bold text-amber-600">3</p>
              <p className="text-sm text-gray-600 mt-1">Requiring review</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <span className="font-medium text-gray-900">Reports</span>
              </div>
              <p className="text-3xl font-bold text-blue-600">12</p>
              <p className="text-sm text-gray-600 mt-1">Generated this month</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Dashboard</h3>
            <p className="text-gray-600 mb-4">
              Full access to transaction databases for AML, KYC, and financial reporting compliance purposes.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                <FileText className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <span className="text-sm font-medium">AML Report</span>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                <Shield className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <span className="text-sm font-medium">KYC Audit</span>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                <BarChart3 className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <span className="text-sm font-medium">CBK Report</span>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                <Database className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <span className="text-sm font-medium">Transaction Log</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* P&L TAB */}
      {/* ============================================ */}
      {activeTab === 'pl' && (
        <div className="space-y-6">
          {/* P&L Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm text-gray-500">Gross Revenue (YTD)</p>
              <p className="text-2xl font-bold text-gray-900">KES {(plData.grossRevenue / 1000000).toFixed(1)}M</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm text-gray-500">Interest Income</p>
              <p className="text-2xl font-bold text-green-600">KES {(plData.interestIncome / 1000000).toFixed(1)}M</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm text-gray-500">Operating Costs</p>
              <p className="text-2xl font-bold text-red-600">KES {(plData.operatingCosts / 1000000).toFixed(1)}M</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm text-gray-500">Net Profit</p>
              <p className="text-2xl font-bold text-purple-600">KES {(plData.netProfit / 1000000).toFixed(1)}M</p>
            </div>
          </div>

          {/* MTD Progress */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Month-to-Date Progress</h3>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-gray-600">Revenue Target</span>
              <span className="font-medium">KES {(plData.mtdRevenue / 1000000).toFixed(1)}M / {(plData.mtdTarget / 1000000).toFixed(1)}M</span>
            </div>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 rounded-full transition-all" style={{ width: `${(plData.mtdRevenue / plData.mtdTarget) * 100}%` }} />
            </div>
            <p className="text-sm text-gray-500 mt-2">{((plData.mtdRevenue / plData.mtdTarget) * 100).toFixed(0)}% of monthly target</p>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">P&L Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `KES ${value}M`} />
                <Legend />
                <Bar dataKey="revenue" fill="#8B5CF6" name="Revenue" radius={[4, 4, 0, 0]} />
                <Bar dataKey="costs" fill="#EF4444" name="Costs" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" fill="#10B981" name="Profit" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* ANALYTICS TAB */}
      {/* ============================================ */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h3>
            <p className="text-gray-600 mb-6">Comprehensive analytics and insights for your bank operations.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-4">Loan Performance</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={revenueTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="loans" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} name="Active Loans" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-4">Collection Performance</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={revenueTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="collections" stroke="#10B981" fill="#10B981" fillOpacity={0.2} name="Collections" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports</h3>
            <p className="text-gray-600 mb-6">Generate and download operational reports.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Monthly Performance Report', desc: 'Summary of lending and collections', icon: BarChart3 },
                { title: 'Compliance Report', desc: 'KYC/AML status and alerts', icon: Shield },
                { title: 'Financial Statement', desc: 'P&L and balance sheet', icon: FileText },
                { title: 'Risk Assessment', desc: 'Portfolio risk analysis', icon: AlertTriangle },
                { title: 'Staff Activity', desc: 'User actions and performance', icon: Users },
                { title: 'Transaction Log', desc: 'Full transaction history', icon: Database }
              ].map(report => (
                <button key={report.title} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <report.icon className="w-6 h-6 text-purple-600 mb-2" />
                  <p className="font-medium text-gray-900">{report.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{report.desc}</p>
                </button>
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
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
            <div className="space-y-3">
              {[
                { id: 1, title: 'New loan application', message: 'John Doe applied for KES 50,000 loan', time: '5 mins ago', type: 'info' },
                { id: 2, title: 'Settlement Pending', message: 'Geneva Wealth Management maturity settlement requires approval', time: '30 mins ago', type: 'warning' },
                { id: 3, title: 'AML Alert', message: 'Transaction flagged for review - TXN-123456', time: '1 hour ago', type: 'warning' },
                { id: 4, title: 'Settlement complete', message: 'Singapore Sovereign Fund Q3 interest payment processed', time: '2 hours ago', type: 'success' },
                { id: 5, title: 'System update', message: 'Platform maintenance scheduled for tonight', time: '1 day ago', type: 'info' }
              ].map(notification => (
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                  <input type="text" value={settings.bankName} onChange={(e) => updateSetting('bankName', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                    <select value={settings.timezone} onChange={(e) => updateSetting('timezone', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                      <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select value={settings.currency} onChange={(e) => updateSetting('currency', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                      <option value="KES">KES (Kenya Shilling)</option>
                      <option value="TZS">TZS (Tanzania Shilling)</option>
                      <option value="UGX">UGX (Uganda Shilling)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Loan Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Loan Settings</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Auto-Approval Threshold (KES)</label>
                  <input type="number" value={settings.loanApprovalThreshold} onChange={(e) => updateSetting('loanApprovalThreshold', parseInt(e.target.value))} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                  <p className="text-xs text-gray-500 mt-1">Loans below this amount can be auto-approved</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Enable Auto-Approval</p>
                    <p className="text-sm text-gray-500">Automatically approve qualifying loans</p>
                  </div>
                  <Toggle enabled={settings.autoApprovalEnabled} onChange={() => updateSetting('autoApprovalEnabled', !settings.autoApprovalEnabled)} />
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
                    <p className="text-sm text-gray-500">Require 2FA for all staff logins</p>
                  </div>
                  <Toggle enabled={settings.twoFactorRequired} onChange={() => updateSetting('twoFactorRequired', !settings.twoFactorRequired)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">API Access</p>
                    <p className="text-sm text-gray-500">Enable external API integrations</p>
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
                    <p className="font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-500">Receive alerts via SMS</p>
                  </div>
                  <Toggle enabled={settings.smsNotifications} onChange={() => updateSetting('smsNotifications', !settings.smsNotifications)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Daily Reports</p>
                    <p className="text-sm text-gray-500">Receive daily summary reports</p>
                  </div>
                  <Toggle enabled={settings.dailyReports} onChange={() => updateSetting('dailyReports', !settings.dailyReports)} />
                </div>
              </div>
            </div>

            {/* Integration Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Integrations</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-green-600" />
                        <span className="font-medium">WhatsApp</span>
                      </div>
                      <Toggle enabled={settings.whatsappIntegration} onChange={() => updateSetting('whatsappIntegration', !settings.whatsappIntegration)} />
                    </div>
                    <p className="text-sm text-gray-500">WhatsApp Business messaging</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span className="font-medium">M-Pesa</span>
                      </div>
                      <Toggle enabled={settings.mpesaIntegration} onChange={() => updateSetting('mpesaIntegration', !settings.mpesaIntegration)} />
                    </div>
                    <p className="text-sm text-gray-500">Mobile money payments</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Key className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">API Keys</span>
                      </div>
                      <button className="text-sm text-purple-600 hover:text-purple-700">Manage</button>
                    </div>
                    <p className="text-sm text-gray-500">External API access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* MODALS */}
      {/* ============================================ */}

      {/* Add Staff Modal */}
      <Modal isOpen={showAddStaffModal} onClose={() => setShowAddStaffModal(false)} title="Add New Staff Member">
        <form onSubmit={handleAddStaff} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" required value={staffFormData.name} onChange={(e) => setStaffFormData({ ...staffFormData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="Enter full name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={staffFormData.email} onChange={(e) => setStaffFormData({ ...staffFormData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="staff@bank.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" value={staffFormData.phone} onChange={(e) => setStaffFormData({ ...staffFormData, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="+254 7XX XXX XXX" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select value={staffFormData.role} onChange={(e) => setStaffFormData({ ...staffFormData, role: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                <option value="bank_lender">Lending Officer</option>
                <option value="bank_caller">Capital Markets Officer</option>
                <option value="bank_compliance">Compliance Officer</option>
                <option value="bank_risk">Credit Risk Analyst</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select value={staffFormData.department} onChange={(e) => setStaffFormData({ ...staffFormData, department: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                <option value="Lending">Lending</option>
                <option value="Treasury">Treasury</option>
                <option value="Compliance">Compliance</option>
                <option value="Risk">Risk</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setShowAddStaffModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Add Staff</button>
          </div>
        </form>
      </Modal>

      {/* Edit Staff Modal */}
      <Modal isOpen={showEditStaffModal} onClose={() => { setShowEditStaffModal(false); setSelectedStaff(null); }} title="Edit Staff Member">
        <form onSubmit={handleEditStaff} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" required value={staffFormData.name} onChange={(e) => setStaffFormData({ ...staffFormData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={staffFormData.email} onChange={(e) => setStaffFormData({ ...staffFormData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" value={staffFormData.phone} onChange={(e) => setStaffFormData({ ...staffFormData, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select value={staffFormData.role} onChange={(e) => setStaffFormData({ ...staffFormData, role: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                <option value="bank_lender">Lending Officer</option>
                <option value="bank_caller">Capital Markets Officer</option>
                <option value="bank_compliance">Compliance Officer</option>
                <option value="bank_risk">Credit Risk Analyst</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select value={staffFormData.department} onChange={(e) => setStaffFormData({ ...staffFormData, department: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                <option value="Lending">Lending</option>
                <option value="Treasury">Treasury</option>
                <option value="Compliance">Compliance</option>
                <option value="Risk">Risk</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => { setShowEditStaffModal(false); setSelectedStaff(null); }} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Save Changes</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteConfirmModal} onClose={() => { setShowDeleteConfirmModal(false); setSelectedStaff(null); }} title="Delete Staff Member" size="sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-gray-600 mb-2">Are you sure you want to delete</p>
          <p className="font-semibold text-gray-900 mb-4">{selectedStaff?.name}?</p>
          <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={() => { setShowDeleteConfirmModal(false); setSelectedStaff(null); }} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={handleDeleteStaff} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
          </div>
        </div>
      </Modal>

      {/* Staff Details Modal */}
      <Modal isOpen={showStaffDetailsModal} onClose={() => { setShowStaffDetailsModal(false); setSelectedStaff(null); }} title="Staff Details">
        {selectedStaff && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-xl">{selectedStaff.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedStaff.name}</h3>
                <p className="text-gray-500">{selectedStaff.email}</p>
              </div>
              <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedStaff.status)}`}>{selectedStaff.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-semibold">{selectedStaff.roleDisplay}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-semibold">{selectedStaff.department}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold">{selectedStaff.phone || 'Not set'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Joined</p>
                <p className="font-semibold">{formatDate(selectedStaff.createdAt)}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">Last Login</p>
              <p className="font-semibold">{formatTime(selectedStaff.lastLogin)}</p>
            </div>
            {selectedStaff.permissions && selectedStaff.permissions.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Permissions</p>
                <div className="flex flex-wrap gap-2">
                  {selectedStaff.permissions.map(perm => (
                    <span key={perm} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">{perm}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Settlement Details Modal */}
      <Modal isOpen={showSettlementDetailsModal} onClose={() => { setShowSettlementDetailsModal(false); setSelectedSettlement(null); }} title="Settlement Details" size="lg">
        {selectedSettlement && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <p className="font-mono text-sm text-purple-600">{selectedSettlement.id}</p>
                <h3 className="text-xl font-bold text-gray-900 mt-1">{selectedSettlement.investor}</h3>
                <p className="text-sm text-gray-500">{selectedSettlement.investorCountry} • {selectedSettlement.depositId}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedSettlement.status)}`}>
                {selectedSettlement.status.replace('_', ' ')}
              </span>
            </div>

            {/* Settlement Type & Amounts */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500">Settlement Type</p>
                <p className="font-semibold text-purple-600">{getSettlementTypeLabel(selectedSettlement.type)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500">Repayment (KES)</p>
                <p className="font-semibold">KES {selectedSettlement.totalRepaymentKES.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500">Remittance (JPY)</p>
                <p className="font-semibold">¥{selectedSettlement.totalRemittanceJPY.toLocaleString()}</p>
              </div>
            </div>

            {/* Exchange Rate Comparison */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-blue-600" />
                Exchange Rate Analysis
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Deposit Rate (JPY/KES)</p>
                  <p className="font-semibold">{selectedSettlement.depositExchangeRate.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Current Spot Rate</p>
                  <p className="font-semibold">{selectedSettlement.remittanceExchangeRate.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Forward Contract Rate</p>
                  <p className="font-semibold text-green-600">{selectedSettlement.forwardContractRate.toFixed(4)}</p>
                </div>
              </div>
            </div>

            {/* ROI Analysis */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-purple-600" />
                Forward Contract ROI
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Spot Rate Impact</p>
                  <p className={`font-semibold ${selectedSettlement.spotRateGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedSettlement.spotRateGainLoss >= 0 ? '+' : ''}KES {selectedSettlement.spotRateGainLoss.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Forward Rate Benefit</p>
                  <p className={`font-semibold ${selectedSettlement.forwardRateGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedSettlement.forwardRateGainLoss >= 0 ? '+' : ''}KES {selectedSettlement.forwardRateGainLoss.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Net FX Impact</p>
                  <p className={`font-bold ${selectedSettlement.netFxImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedSettlement.netFxImpact >= 0 ? '+' : ''}KES {selectedSettlement.netFxImpact.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-purple-200">
                <p className="text-xs text-gray-600">
                  Forward Contract: <span className="font-mono">{selectedSettlement.forwardContractId}</span> • 
                  Cost: KES {selectedSettlement.forwardContractCostKES.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Fee Breakdown */}
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-600" />
                Transaction Fees
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee (0.5%)</span>
                  <span className="font-medium">KES {selectedSettlement.platformFeeKES.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SWIFT Fee</span>
                  <span className="font-medium">KES {selectedSettlement.swiftFeeKES.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Correspondent Bank Fee</span>
                  <span className="font-medium">KES {selectedSettlement.correspondentBankFeeKES.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-amber-200">
                  <span className="font-semibold text-gray-900">Total Fees</span>
                  <span className="font-bold text-amber-600">KES {selectedSettlement.totalFeesKES.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Net Settlement */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-gray-900 mb-3">Net Settlement Amount</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Net Amount (KES)</p>
                  <p className="text-2xl font-bold text-green-600">KES {selectedSettlement.netSettlementKES.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Net Remittance (JPY)</p>
                  <p className="text-2xl font-bold text-green-600">¥{selectedSettlement.netSettlementJPY.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="text-sm text-gray-500 space-y-1">
              <p>Requested: {formatDate(selectedSettlement.requestedAt)} by {selectedSettlement.requestedBy}</p>
              {selectedSettlement.approvedAt && (
                <p>Approved: {formatDate(selectedSettlement.approvedAt)} by {selectedSettlement.approvedBy}</p>
              )}
              {selectedSettlement.completedAt && (
                <p>Completed: {formatDate(selectedSettlement.completedAt)} • Ref: {selectedSettlement.remittanceRef}</p>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Approve Settlement Modal */}
      <Modal isOpen={showApproveSettlementModal} onClose={() => { setShowApproveSettlementModal(false); setSelectedSettlement(null); }} title="Review Settlement" size="lg">
        {selectedSettlement && (
          <div className="space-y-6">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Review Required</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Please review the settlement details carefully before approving. This will initiate the capital repatriation process.
                  </p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500">Investor</p>
                <p className="font-semibold">{selectedSettlement.investor}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500">Settlement Type</p>
                <p className="font-semibold">{getSettlementTypeLabel(selectedSettlement.type)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500">Amount to Remit</p>
                <p className="font-semibold">¥{selectedSettlement.totalRemittanceJPY.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500">Forward Rate Used</p>
                <p className="font-semibold">{selectedSettlement.forwardContractRate.toFixed(4)}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button 
                onClick={() => { setShowApproveSettlementModal(false); setSelectedSettlement(null); }} 
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleRejectSettlement} 
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
              <button 
                onClick={handleApproveSettlement} 
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4" />
                Approve Settlement
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BankAdminDashboard;
