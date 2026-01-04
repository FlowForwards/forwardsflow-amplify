// BankComplianceDashboard.js - Compliance Officer Dashboard
// Enhanced with universal sample database, URL-based tab routing
// Focus: AML/KYC Monitoring, Compliance Analytics - NO capital calling or lending functions

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Shield, AlertTriangle, CheckCircle, XCircle, Clock, Eye, FileText, Search,
  Filter, RefreshCw, UserCheck, Flag, Download, ArrowUpRight, ArrowDownRight,
  Settings, Bell, BarChart3, X, Save, Users, Activity, Calendar, Percent,
  AlertCircle, CheckCircle2, TrendingUp, TrendingDown, List, Lock, Unlock,
  UserX, UserPlus, FileCheck, FileMinus, Globe, Phone, Mail, Building2,
  CreditCard, Fingerprint, Camera, IdCard, FileWarning, Scale, Gavel,
  ClipboardCheck, ClipboardList, Timer, Zap, Ban, ShieldCheck, ShieldAlert,
  ShieldOff, BookOpen, History, Archive
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend, ComposedChart
} from 'recharts';
import AmazonQChat from '../chat/AmazonQChat';

// ============================================
// UNIVERSAL SAMPLE DATABASE
// Consistent with platform overview data
// Focus: Compliance / AML / KYC
// ============================================
const SAMPLE_DATABASE = {
  // Compliance Overview Metrics (aligned with platform metrics)
  complianceMetrics: {
    // KYC Metrics
    totalBorrowers: 8542, // matches platform loan book
    kycVerified: 8247,
    kycPending: 245,
    kycExpiring: 38,
    kycRejected: 12,
    kycVerificationRate: 96.5,
    avgVerificationTime: 2.4, // hours
    
    // AML Metrics
    totalTransactions: 156420,
    transactionsScreened: 156420,
    amlAlertsOpen: 8,
    amlAlertsInvestigating: 5,
    amlAlertsResolved: 342,
    amlAlertsEscalated: 3,
    falsePositiveRate: 82.5,
    
    // Risk Metrics
    highRiskBorrowers: 127,
    mediumRiskBorrowers: 1245,
    lowRiskBorrowers: 6875,
    pepsIdentified: 23,
    sanctionsMatches: 0,
    
    // Reporting
    sarsFiledThisMonth: 2,
    sarsFiledYTD: 18,
    regulatoryReportsGenerated: 24,
    auditLogEntries: 45680
  },

  // AML Alerts
  amlAlerts: [
    {
      id: 'AML-2025-001',
      alertType: 'unusual_transaction_pattern',
      severity: 'high',
      borrowerId: 'BOR-2847',
      borrowerName: 'James Mwangi',
      phoneNumber: '+254712345678',
      description: 'Multiple high-value transactions in short period exceeding normal pattern',
      amount: 485000,
      transactionCount: 12,
      timeframe: '48 hours',
      status: 'investigating',
      createdAt: '2025-01-02T08:30:00Z',
      assignedTo: 'Peter Kimani',
      riskScore: 78
    },
    {
      id: 'AML-2025-002',
      alertType: 'velocity_breach',
      severity: 'medium',
      borrowerId: 'BOR-3921',
      borrowerName: 'Grace Wanjiku',
      phoneNumber: '+254723456789',
      description: 'Transaction velocity exceeded threshold - 8 transactions in 1 hour',
      amount: 125000,
      transactionCount: 8,
      timeframe: '1 hour',
      status: 'open',
      createdAt: '2025-01-02T10:15:00Z',
      assignedTo: null,
      riskScore: 62
    },
    {
      id: 'AML-2025-003',
      alertType: 'large_cash_transaction',
      severity: 'high',
      borrowerId: 'BOR-1567',
      borrowerName: 'David Ochieng',
      phoneNumber: '+254734567890',
      description: 'Single transaction of KES 950,000 - approaching CTR threshold',
      amount: 950000,
      transactionCount: 1,
      timeframe: 'single',
      status: 'open',
      createdAt: '2025-01-02T11:45:00Z',
      assignedTo: null,
      riskScore: 85
    },
    {
      id: 'AML-2025-004',
      alertType: 'structuring_suspected',
      severity: 'critical',
      borrowerId: 'BOR-4521',
      borrowerName: 'Mary Njeri',
      phoneNumber: '+254745678901',
      description: 'Suspected structuring - multiple transactions just below reporting threshold',
      amount: 2850000,
      transactionCount: 6,
      timeframe: '72 hours',
      status: 'escalated',
      createdAt: '2025-01-01T14:20:00Z',
      assignedTo: 'Peter Kimani',
      riskScore: 95
    },
    {
      id: 'AML-2025-005',
      alertType: 'dormant_account_activity',
      severity: 'medium',
      borrowerId: 'BOR-0892',
      borrowerName: 'Samuel Kipchoge',
      phoneNumber: '+254756789012',
      description: 'Sudden activity on dormant account after 8 months of inactivity',
      amount: 175000,
      transactionCount: 3,
      timeframe: '24 hours',
      status: 'investigating',
      createdAt: '2025-01-01T16:30:00Z',
      assignedTo: 'Jane Akinyi',
      riskScore: 58
    },
    {
      id: 'AML-2025-006',
      alertType: 'geographic_anomaly',
      severity: 'low',
      borrowerId: 'BOR-6734',
      borrowerName: 'Peter Kamau',
      phoneNumber: '+254767890123',
      description: 'Transaction from unusual geographic location - different county',
      amount: 45000,
      transactionCount: 1,
      timeframe: 'single',
      status: 'open',
      createdAt: '2025-01-02T09:00:00Z',
      assignedTo: null,
      riskScore: 35
    },
    {
      id: 'AML-2025-007',
      alertType: 'pep_transaction',
      severity: 'high',
      borrowerId: 'BOR-2156',
      borrowerName: 'John Mutiso',
      phoneNumber: '+254778901234',
      description: 'Transaction by Politically Exposed Person flagged for enhanced due diligence',
      amount: 320000,
      transactionCount: 2,
      timeframe: '7 days',
      status: 'investigating',
      createdAt: '2024-12-30T11:15:00Z',
      assignedTo: 'Peter Kimani',
      riskScore: 72
    },
    {
      id: 'AML-2025-008',
      alertType: 'round_amount_pattern',
      severity: 'low',
      borrowerId: 'BOR-8923',
      borrowerName: 'Elizabeth Wambui',
      phoneNumber: '+254789012345',
      description: 'Multiple round-amount transactions detected',
      amount: 200000,
      transactionCount: 4,
      timeframe: '5 days',
      status: 'open',
      createdAt: '2025-01-02T07:45:00Z',
      assignedTo: null,
      riskScore: 28
    }
  ],

  // KYC Records
  kycRecords: [
    {
      id: 'KYC-2025-001',
      borrowerId: 'BOR-9001',
      borrowerName: 'John Kamau',
      phoneNumber: '+254712345678',
      nationalId: '12345678',
      documentType: 'National ID',
      documentNumber: '12345678',
      dateOfBirth: '1985-03-15',
      gender: 'Male',
      county: 'Nairobi',
      occupation: 'Business Owner',
      status: 'pending',
      riskLevel: 'low',
      submittedAt: '2025-01-02T08:00:00Z',
      documents: ['id_front.jpg', 'id_back.jpg', 'selfie.jpg'],
      verificationNotes: '',
      pepCheck: false,
      sanctionsCheck: true,
      adverseMediaCheck: true
    },
    {
      id: 'KYC-2025-002',
      borrowerId: 'BOR-9002',
      borrowerName: 'Mary Wanjiku',
      phoneNumber: '+254723456789',
      nationalId: '23456789',
      documentType: 'Passport',
      documentNumber: 'A12345678',
      dateOfBirth: '1990-07-22',
      gender: 'Female',
      county: 'Kiambu',
      occupation: 'Teacher',
      status: 'pending',
      riskLevel: 'low',
      submittedAt: '2025-01-02T09:30:00Z',
      documents: ['passport.jpg', 'selfie.jpg'],
      verificationNotes: '',
      pepCheck: false,
      sanctionsCheck: true,
      adverseMediaCheck: true
    },
    {
      id: 'KYC-2025-003',
      borrowerId: 'BOR-9003',
      borrowerName: 'Peter Ochieng',
      phoneNumber: '+254734567890',
      nationalId: '34567890',
      documentType: 'National ID',
      documentNumber: '34567890',
      dateOfBirth: '1978-11-08',
      gender: 'Male',
      county: 'Kisumu',
      occupation: 'Farmer',
      status: 'pending',
      riskLevel: 'medium',
      submittedAt: '2025-01-02T10:15:00Z',
      documents: ['id_front.jpg', 'id_back.jpg', 'selfie.jpg'],
      verificationNotes: 'ID image quality requires review',
      pepCheck: false,
      sanctionsCheck: true,
      adverseMediaCheck: true
    },
    {
      id: 'KYC-2025-004',
      borrowerId: 'BOR-9004',
      borrowerName: 'Grace Muthoni',
      phoneNumber: '+254745678901',
      nationalId: '45678901',
      documentType: 'National ID',
      documentNumber: '45678901',
      dateOfBirth: '1995-02-28',
      gender: 'Female',
      county: 'Nakuru',
      occupation: 'Nurse',
      status: 'verified',
      riskLevel: 'low',
      submittedAt: '2025-01-01T14:00:00Z',
      verifiedAt: '2025-01-01T15:30:00Z',
      verifiedBy: 'Peter Kimani',
      documents: ['id_front.jpg', 'id_back.jpg', 'selfie.jpg'],
      verificationNotes: 'All checks passed',
      pepCheck: false,
      sanctionsCheck: true,
      adverseMediaCheck: true
    },
    {
      id: 'KYC-2025-005',
      borrowerId: 'BOR-9005',
      borrowerName: 'Samuel Kipchoge',
      phoneNumber: '+254756789012',
      nationalId: '56789012',
      documentType: 'National ID',
      documentNumber: '56789012',
      dateOfBirth: '1982-06-10',
      gender: 'Male',
      county: 'Uasin Gishu',
      occupation: 'Athlete',
      status: 'rejected',
      riskLevel: 'high',
      submittedAt: '2024-12-28T11:00:00Z',
      rejectedAt: '2024-12-28T14:00:00Z',
      rejectedBy: 'Jane Akinyi',
      documents: ['id_front.jpg', 'id_back.jpg', 'selfie.jpg'],
      verificationNotes: 'Document appears tampered - image manipulation detected',
      pepCheck: true,
      sanctionsCheck: true,
      adverseMediaCheck: false
    },
    {
      id: 'KYC-2025-006',
      borrowerId: 'BOR-9006',
      borrowerName: 'Elizabeth Wambui',
      phoneNumber: '+254767890123',
      nationalId: '67890123',
      documentType: 'National ID',
      documentNumber: '67890123',
      dateOfBirth: '1988-09-03',
      gender: 'Female',
      county: 'Mombasa',
      occupation: 'Trader',
      status: 'expiring',
      riskLevel: 'low',
      submittedAt: '2024-01-15T10:00:00Z',
      verifiedAt: '2024-01-15T12:00:00Z',
      verifiedBy: 'Peter Kimani',
      expiresAt: '2025-01-15T00:00:00Z',
      documents: ['id_front.jpg', 'id_back.jpg', 'selfie.jpg'],
      verificationNotes: 'KYC expiring - needs renewal',
      pepCheck: false,
      sanctionsCheck: true,
      adverseMediaCheck: true
    }
  ],

  // Compliance Analytics
  complianceAnalytics: {
    alertTrend: [
      { month: 'Aug', open: 12, investigating: 8, resolved: 45, escalated: 2 },
      { month: 'Sep', open: 8, investigating: 5, resolved: 52, escalated: 1 },
      { month: 'Oct', open: 15, investigating: 10, resolved: 48, escalated: 3 },
      { month: 'Nov', open: 10, investigating: 7, resolved: 55, escalated: 2 },
      { month: 'Dec', open: 6, investigating: 4, resolved: 62, escalated: 1 },
      { month: 'Jan', open: 8, investigating: 5, resolved: 28, escalated: 1 }
    ],
    kycTrend: [
      { month: 'Aug', verified: 820, pending: 45, rejected: 8 },
      { month: 'Sep', verified: 890, pending: 52, rejected: 12 },
      { month: 'Oct', verified: 945, pending: 38, rejected: 6 },
      { month: 'Nov', verified: 1020, pending: 41, rejected: 9 },
      { month: 'Dec', verified: 1150, pending: 35, rejected: 7 },
      { month: 'Jan', verified: 380, pending: 28, rejected: 3 }
    ],
    alertsByType: [
      { type: 'Unusual Pattern', count: 45, color: '#8B5CF6' },
      { type: 'Velocity Breach', count: 38, color: '#3B82F6' },
      { type: 'Large Transaction', count: 28, color: '#10B981' },
      { type: 'Structuring', count: 12, color: '#EF4444' },
      { type: 'Dormant Activity', count: 22, color: '#F59E0B' },
      { type: 'Geographic Anomaly', count: 18, color: '#EC4899' }
    ],
    riskDistribution: [
      { level: 'Low Risk', count: 6875, percentage: 80.5, color: '#10B981' },
      { level: 'Medium Risk', count: 1245, percentage: 14.6, color: '#F59E0B' },
      { level: 'High Risk', count: 127, percentage: 1.5, color: '#EF4444' },
      { level: 'PEP', count: 23, percentage: 0.3, color: '#8B5CF6' }
    ],
    resolutionTime: [
      { severity: 'Critical', avgHours: 4.2 },
      { severity: 'High', avgHours: 12.5 },
      { severity: 'Medium', avgHours: 24.8 },
      { severity: 'Low', avgHours: 48.3 }
    ]
  },

  // Notifications
  notifications: [
    { id: 1, title: 'New KYC Pending', message: 'John Kamau submitted KYC documents for verification', time: '30 mins ago', type: 'info', read: false, category: 'kyc' },
    { id: 2, title: 'Critical AML Alert', message: 'Suspected structuring detected - Mary Njeri (BOR-4521)', time: '2 hours ago', type: 'error', read: false, category: 'aml' },
    { id: 3, title: 'KYC Expiring', message: 'Elizabeth Wambui KYC expires in 13 days', time: '3 hours ago', type: 'warning', read: false, category: 'kyc' },
    { id: 4, title: 'High-Risk Alert', message: 'Large cash transaction flagged for David Ochieng', time: '4 hours ago', type: 'warning', read: false, category: 'aml' },
    { id: 5, title: 'SAR Filed', message: 'Suspicious Activity Report filed for case AML-2024-342', time: '1 day ago', type: 'success', read: true, category: 'sar' },
    { id: 6, title: 'New KYC Pending', message: 'Mary Wanjiku submitted passport for verification', time: '1 day ago', type: 'info', read: true, category: 'kyc' },
    { id: 7, title: 'Alert Resolved', message: 'AML-2024-338 closed as false positive', time: '2 days ago', type: 'success', read: true, category: 'aml' },
    { id: 8, title: 'Regulatory Report Due', message: 'Monthly AML summary report due in 5 days', time: '2 days ago', type: 'warning', read: true, category: 'report' },
    { id: 9, title: 'PEP Alert', message: 'Transaction by PEP flagged for John Mutiso', time: '3 days ago', type: 'warning', read: true, category: 'aml' },
    { id: 10, title: 'KYC Rejected', message: 'Samuel Kipchoge KYC rejected - document tampering', time: '5 days ago', type: 'error', read: true, category: 'kyc' }
  ],

  // Compliance Settings
  complianceSettings: {
    // KYC Settings
    kycExpiryMonths: 12,
    kycRenewalReminderDays: 30,
    requireSelfie: true,
    requireIdFrontBack: true,
    allowPassport: true,
    allowDrivingLicense: false,
    autoRejectBlurryImages: true,
    minImageQualityScore: 70,
    
    // AML Transaction Thresholds
    ctrThreshold: 1000000, // Cash Transaction Report threshold
    sarThreshold: 500000, // Suspicious Activity threshold
    velocityLimit: 10, // transactions per hour
    velocityPeriodHours: 1,
    dailyTransactionLimit: 5000000,
    
    // Risk Scoring
    highRiskThreshold: 70,
    mediumRiskThreshold: 40,
    pepAutoEscalate: true,
    sanctionsAutoBlock: true,
    
    // Alert Settings
    autoAssignAlerts: true,
    alertEscalationHours: 24,
    criticalAlertNotifyManagement: true,
    
    // Reporting
    monthlyReportAutoGenerate: true,
    sarAutoPopulate: true,
    auditLogRetentionDays: 2555, // 7 years
    
    // Notifications
    emailNotifications: true,
    smsNotifications: true,
    whatsappNotifications: false,
    kycPendingAlerts: true,
    amlAlertNotifications: true,
    reportDueReminders: true
  },

  // Audit Log
  auditLog: [
    { id: 1, action: 'KYC Verified', user: 'Peter Kimani', target: 'Grace Muthoni (BOR-9004)', timestamp: '2025-01-01T15:30:00Z', details: 'All checks passed - Low risk' },
    { id: 2, action: 'AML Alert Created', user: 'System', target: 'AML-2025-004', timestamp: '2025-01-01T14:20:00Z', details: 'Structuring suspected - Critical severity' },
    { id: 3, action: 'Alert Assigned', user: 'Peter Kimani', target: 'AML-2025-001', timestamp: '2025-01-02T09:00:00Z', details: 'Assigned for investigation' },
    { id: 4, action: 'KYC Rejected', user: 'Jane Akinyi', target: 'Samuel Kipchoge (BOR-9005)', timestamp: '2024-12-28T14:00:00Z', details: 'Document tampering detected' },
    { id: 5, action: 'SAR Filed', user: 'Peter Kimani', target: 'AML-2024-342', timestamp: '2025-01-01T10:00:00Z', details: 'Filed with FRC' },
    { id: 6, action: 'Settings Updated', user: 'Admin', target: 'CTR Threshold', timestamp: '2024-12-20T11:00:00Z', details: 'Changed from 500K to 1M' },
    { id: 7, action: 'Report Generated', user: 'System', target: 'Monthly AML Summary', timestamp: '2025-01-01T00:00:00Z', details: 'Auto-generated for December 2024' },
    { id: 8, action: 'Alert Escalated', user: 'Peter Kimani', target: 'AML-2025-004', timestamp: '2025-01-01T16:00:00Z', details: 'Escalated to management' }
  ]
};

// ============================================
// HELPER COMPONENTS
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

const StatCard = ({ title, value, icon: Icon, color, trend, subtitle, onClick }) => {
  const colorClasses = {
    amber: 'bg-amber-100 text-amber-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-600',
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
              {trend >= 0 ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
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

const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-amber-600' : 'bg-gray-300'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

// ============================================
// URL PATH TO TAB MAPPING
// ============================================
const getTabFromPath = (pathname) => {
  if (pathname.includes('/aml')) return 'aml';
  if (pathname.includes('/kyc')) return 'kyc';
  if (pathname.includes('/analytics')) return 'analytics';
  if (pathname.includes('/reports')) return 'reports';
  if (pathname.includes('/notifications')) return 'notifications';
  if (pathname.includes('/settings')) return 'settings';
  if (pathname.includes('/audit')) return 'audit';
  return 'overview';
};

// ============================================
// MAIN BANK COMPLIANCE DASHBOARD
// ============================================
const BankComplianceDashboard = () => {
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
  const [metrics] = useState(SAMPLE_DATABASE.complianceMetrics);
  const [amlAlerts, setAmlAlerts] = useState(SAMPLE_DATABASE.amlAlerts);
  const [kycRecords, setKycRecords] = useState(SAMPLE_DATABASE.kycRecords);
  const [analytics] = useState(SAMPLE_DATABASE.complianceAnalytics);
  const [notifications, setNotifications] = useState(SAMPLE_DATABASE.notifications);
  const [settings, setSettings] = useState(SAMPLE_DATABASE.complianceSettings);
  const [auditLog] = useState(SAMPLE_DATABASE.auditLog);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [kycStatusFilter, setKycStatusFilter] = useState('all');
  const [notificationFilter, setNotificationFilter] = useState('all');
  
  // Modal states
  const [showAlertDetailModal, setShowAlertDetailModal] = useState(false);
  const [showKycDetailModal, setShowKycDetailModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [selectedKyc, setSelectedKyc] = useState(null);

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
      overview: '/bank/compliance',
      aml: '/bank/compliance/aml',
      kyc: '/bank/compliance/kyc',
      analytics: '/bank/compliance/analytics',
      reports: '/bank/compliance/reports',
      notifications: '/bank/compliance/notifications',
      settings: '/bank/compliance/settings',
      audit: '/bank/compliance/audit'
    };
    if (tabToPath[tabId]) {
      navigate(tabToPath[tabId]);
    }
  };

  // KYC Actions
  const handleKycAction = (kycId, action) => {
    setKycRecords(prev => prev.map(kyc => {
      if (kyc.id === kycId) {
        if (action === 'approve') {
          return { ...kyc, status: 'verified', verifiedAt: new Date().toISOString(), verifiedBy: 'Current User' };
        } else if (action === 'reject') {
          return { ...kyc, status: 'rejected', rejectedAt: new Date().toISOString(), rejectedBy: 'Current User' };
        }
      }
      return kyc;
    }));
    
    const notification = {
      id: Date.now(),
      title: action === 'approve' ? 'KYC Approved' : 'KYC Rejected',
      message: `KYC ${kycId} has been ${action === 'approve' ? 'approved' : 'rejected'}`,
      time: 'Just now',
      type: action === 'approve' ? 'success' : 'error',
      read: false,
      category: 'kyc'
    };
    setNotifications([notification, ...notifications]);
  };

  // Alert Actions
  const handleAlertAction = (alertId, action) => {
    setAmlAlerts(prev => prev.map(alert => {
      if (alert.id === alertId) {
        if (action === 'investigate') {
          return { ...alert, status: 'investigating', assignedTo: 'Current User' };
        } else if (action === 'escalate') {
          return { ...alert, status: 'escalated' };
        } else if (action === 'resolve') {
          return { ...alert, status: 'resolved' };
        }
      }
      return alert;
    }));
  };

  // Settings update
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Computed values
  const openAlerts = amlAlerts.filter(a => a.status === 'open');
  const investigatingAlerts = amlAlerts.filter(a => a.status === 'investigating');
  const pendingKyc = kycRecords.filter(k => k.status === 'pending');
  const expiringKyc = kycRecords.filter(k => k.status === 'expiring');
  const unreadNotifications = notifications.filter(n => !n.read);

  // Filter alerts
  const filteredAlerts = amlAlerts.filter(alert => {
    const matchesSearch = alert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.borrowerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  // Filter KYC records
  const filteredKyc = kycRecords.filter(kyc => {
    const matchesSearch = kyc.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kyc.phoneNumber.includes(searchTerm);
    const matchesStatus = kycStatusFilter === 'all' || kyc.status === kycStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Helper functions
  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-700 border-red-200',
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      medium: 'bg-amber-100 text-amber-700 border-amber-200',
      low: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    return colors[severity] || 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-red-100 text-red-700',
      investigating: 'bg-amber-100 text-amber-700',
      escalated: 'bg-purple-100 text-purple-700',
      resolved: 'bg-green-100 text-green-700',
      pending: 'bg-amber-100 text-amber-700',
      verified: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      expiring: 'bg-orange-100 text-orange-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading compliance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-700 rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-6 h-6" />
              <span className="text-amber-100 text-sm font-medium">COMPLIANCE & RISK</span>
            </div>
            <h1 className="text-2xl font-bold">Equity Africa Bank • Compliance</h1>
            <p className="text-amber-100 mt-1">
              AML/KYC Monitoring • {openAlerts.length + investigatingAlerts.length} active alerts • {pendingKyc.length} pending KYC
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-amber-100">KYC Verification Rate</p>
            <p className="text-3xl font-bold">{metrics.kycVerificationRate}%</p>
            <p className="text-sm text-amber-200 mt-1">{metrics.kycVerified.toLocaleString()} verified borrowers</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 shadow-sm overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Shield },
          { id: 'aml', label: 'AML Monitoring', icon: AlertTriangle, count: openAlerts.length + investigatingAlerts.length },
          { id: 'kyc', label: 'KYC Verification', icon: UserCheck, count: pendingKyc.length },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'reports', label: 'Reports', icon: FileText },
          { id: 'notifications', label: 'Notifications', icon: Bell, count: unreadNotifications.length },
          { id: 'settings', label: 'Settings', icon: Settings },
          { id: 'audit', label: 'Audit Trail', icon: History }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id ? 'bg-amber-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-amber-100 text-amber-700'
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
              title="Open AML Alerts"
              value={openAlerts.length + investigatingAlerts.length}
              icon={AlertTriangle}
              color="amber"
              subtitle={`${openAlerts.length} new, ${investigatingAlerts.length} investigating`}
            />
            <StatCard
              title="KYC Verified"
              value={metrics.kycVerified.toLocaleString()}
              icon={CheckCircle}
              color="green"
              subtitle={`${metrics.kycVerificationRate}% verification rate`}
            />
            <StatCard
              title="Pending KYC"
              value={metrics.kycPending}
              icon={Clock}
              color="blue"
              subtitle={`Avg ${metrics.avgVerificationTime}h verification time`}
            />
            <StatCard
              title="High Risk Borrowers"
              value={metrics.highRiskBorrowers}
              icon={ShieldAlert}
              color="red"
              subtitle={`${metrics.pepsIdentified} PEPs identified`}
            />
          </div>

          {/* Priority Actions */}
          {(openAlerts.length > 0 || pendingKyc.length > 0 || expiringKyc.length > 0) && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Priority Actions Required
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {openAlerts.filter(a => a.severity === 'critical' || a.severity === 'high').slice(0, 2).map(alert => (
                  <div key={alert.id} className="bg-white rounded-lg p-4 border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">{formatTimeAgo(alert.createdAt)}</span>
                    </div>
                    <p className="font-medium text-gray-900">{alert.alertType.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-gray-600 mt-1">{alert.borrowerName}</p>
                    <button
                      onClick={() => { setSelectedAlert(alert); setShowAlertDetailModal(true); }}
                      className="mt-3 w-full py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700"
                    >
                      Review Now
                    </button>
                  </div>
                ))}
                {pendingKyc.length > 0 && (
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        KYC PENDING
                      </span>
                      <span className="text-xs text-gray-500">{pendingKyc.length} waiting</span>
                    </div>
                    <p className="font-medium text-gray-900">KYC Verifications Pending</p>
                    <p className="text-sm text-gray-600 mt-1">{pendingKyc[0]?.borrowerName} and {pendingKyc.length - 1} others</p>
                    <button
                      onClick={() => handleTabChange('kyc')}
                      className="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                      Review Queue
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alert Trend */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AML Alert Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={analytics.alertTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="open" fill="#EF4444" name="Open" stackId="a" />
                  <Bar dataKey="investigating" fill="#F59E0B" name="Investigating" stackId="a" />
                  <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
                  <Line type="monotone" dataKey="escalated" stroke="#8B5CF6" name="Escalated" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Risk Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Borrower Risk Distribution</h3>
              <div className="flex items-center gap-6">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.riskDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="count"
                      >
                        {analytics.riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => value.toLocaleString()} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {analytics.riskDistribution.map(item => (
                    <div key={item.level} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-600">{item.level}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium text-gray-900">{item.count.toLocaleString()}</span>
                        <span className="text-xs text-gray-500 ml-2">({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Transactions Screened</p>
                  <p className="text-xl font-bold">{metrics.totalTransactions.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <FileWarning className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">SARs Filed (YTD)</p>
                  <p className="text-xl font-bold">{metrics.sarsFiledYTD}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Percent className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">False Positive Rate</p>
                  <p className="text-xl font-bold">{metrics.falsePositiveRate}%</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Ban className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sanctions Matches</p>
                  <p className="text-xl font-bold">{metrics.sanctionsMatches}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* AML MONITORING TAB */}
      {/* ============================================ */}
      {activeTab === 'aml' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search alerts by ID or borrower..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="escalated">Escalated</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Alerts Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">AML Alerts ({filteredAlerts.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alert ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrower</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Score</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAlerts.map(alert => (
                    <tr key={alert.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-mono text-sm text-amber-600">{alert.id}</p>
                        <p className="text-xs text-gray-500">{formatTimeAgo(alert.createdAt)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-900">{alert.alertType.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-gray-500">{alert.transactionCount} txn in {alert.timeframe}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{alert.borrowerName}</p>
                        <p className="text-xs text-gray-500">{alert.borrowerId}</p>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        KES {alert.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                alert.riskScore >= 70 ? 'bg-red-500' :
                                alert.riskScore >= 40 ? 'bg-amber-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${alert.riskScore}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{alert.riskScore}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                          {alert.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setSelectedAlert(alert); setShowAlertDetailModal(true); }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {alert.status === 'open' && (
                            <button
                              onClick={() => handleAlertAction(alert.id, 'investigate')}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"
                              title="Start Investigation"
                            >
                              <Search className="w-4 h-4" />
                            </button>
                          )}
                          {(alert.status === 'open' || alert.status === 'investigating') && (
                            <button
                              onClick={() => handleAlertAction(alert.id, 'escalate')}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                              title="Escalate"
                            >
                              <ArrowUpRight className="w-4 h-4" />
                            </button>
                          )}
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
      {/* KYC VERIFICATION TAB */}
      {/* ============================================ */}
      {activeTab === 'kyc' && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Verified</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.kycVerified.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-amber-200">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-amber-600" />
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingKyc.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-orange-200">
              <div className="flex items-center gap-3">
                <Timer className="w-6 h-6 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-500">Expiring Soon</p>
                  <p className="text-2xl font-bold text-gray-900">{expiringKyc.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-red-200">
              <div className="flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.kycRejected}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <select
              value={kycStatusFilter}
              onChange={(e) => setKycStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
              <option value="expiring">Expiring</option>
            </select>
          </div>

          {/* KYC Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">KYC Verification Queue</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrower</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Level</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Checks</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredKyc.map(kyc => (
                    <tr key={kyc.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{kyc.borrowerName}</p>
                        <p className="text-xs text-gray-500">{kyc.borrowerId}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{kyc.phoneNumber}</td>
                      <td className="px-4 py-3">
                        <p className="text-gray-900">{kyc.documentType}</p>
                        <p className="text-xs text-gray-500">{kyc.documentNumber}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{kyc.county}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          kyc.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                          kyc.riskLevel === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {kyc.riskLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${kyc.pepCheck ? 'bg-amber-500' : 'bg-green-500'}`} title="PEP Check" />
                          <span className={`w-2 h-2 rounded-full ${kyc.sanctionsCheck ? 'bg-green-500' : 'bg-red-500'}`} title="Sanctions Check" />
                          <span className={`w-2 h-2 rounded-full ${kyc.adverseMediaCheck ? 'bg-green-500' : 'bg-red-500'}`} title="Adverse Media" />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(kyc.status)}`}>
                          {kyc.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {kyc.status === 'pending' ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => { setSelectedKyc(kyc); setShowKycDetailModal(true); }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleKycAction(kyc.id, 'approve')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleKycAction(kyc.id, 'reject')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setSelectedKyc(kyc); setShowKycDetailModal(true); }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
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
      {/* ANALYTICS TAB */}
      {/* ============================================ */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Overview Banner */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Compliance Analytics</h3>
            <p className="text-amber-100">Performance metrics and trend analysis</p>
            <div className="grid grid-cols-4 gap-6 mt-6">
              <div>
                <p className="text-amber-200 text-sm">Total Alerts (YTD)</p>
                <p className="text-2xl font-bold">{metrics.amlAlertsResolved + metrics.amlAlertsOpen + metrics.amlAlertsInvestigating}</p>
              </div>
              <div>
                <p className="text-amber-200 text-sm">Resolution Rate</p>
                <p className="text-2xl font-bold">95.2%</p>
              </div>
              <div>
                <p className="text-amber-200 text-sm">Avg Resolution Time</p>
                <p className="text-2xl font-bold">18.4h</p>
              </div>
              <div>
                <p className="text-amber-200 text-sm">False Positive Rate</p>
                <p className="text-2xl font-bold">{metrics.falsePositiveRate}%</p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* KYC Trend */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">KYC Verification Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={analytics.kycTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="verified" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Verified" />
                  <Area type="monotone" dataKey="pending" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} name="Pending" />
                  <Area type="monotone" dataKey="rejected" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} name="Rejected" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Alerts by Type */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts by Type</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics.alertsByType} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="type" width={120} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {analytics.alertsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Resolution Time by Severity */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Resolution Time by Severity</h3>
            <div className="grid grid-cols-4 gap-4">
              {analytics.resolutionTime.map(item => (
                <div key={item.severity} className={`p-4 rounded-lg ${
                  item.severity === 'Critical' ? 'bg-red-50 border border-red-200' :
                  item.severity === 'High' ? 'bg-orange-50 border border-orange-200' :
                  item.severity === 'Medium' ? 'bg-amber-50 border border-amber-200' :
                  'bg-blue-50 border border-blue-200'
                }`}>
                  <p className="text-sm text-gray-600">{item.severity}</p>
                  <p className="text-2xl font-bold text-gray-900">{item.avgHours}h</p>
                  <p className="text-xs text-gray-500">avg resolution</p>
                </div>
              ))}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Compliance Reports</h3>
            <p className="text-gray-600 mb-6">Select report type and parameters to generate customized compliance reports.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: 'aml-summary', title: 'AML Summary Report', desc: 'Monthly alert summary and trends', icon: AlertTriangle, color: 'amber', type: 'Regulatory' },
                { id: 'kyc-status', title: 'KYC Status Report', desc: 'Verification status and compliance', icon: UserCheck, color: 'green', type: 'Internal' },
                { id: 'sar', title: 'SAR Filing Report', desc: 'Suspicious Activity Report', icon: FileWarning, color: 'red', type: 'Regulatory' },
                { id: 'ctr', title: 'CTR Report', desc: 'Cash Transaction Report', icon: CreditCard, color: 'blue', type: 'Regulatory' },
                { id: 'risk', title: 'Risk Assessment', desc: 'Borrower risk distribution', icon: ShieldAlert, color: 'purple', type: 'Internal' },
                { id: 'audit', title: 'Audit Trail Report', desc: 'Compliance actions log', icon: ClipboardList, color: 'indigo', type: 'Internal' }
              ].map(report => (
                <button 
                  key={report.id}
                  onClick={() => setShowReportModal(true)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <report.icon className={`w-6 h-6 text-${report.color}-600`} />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.type === 'Regulatory' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {report.type}
                    </span>
                  </div>
                  <p className="font-medium text-gray-900">{report.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{report.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-4">Recently Generated Reports</h4>
            <div className="space-y-3">
              {[
                { name: 'December 2024 AML Summary', type: 'Regulatory', date: '2025-01-01', status: 'completed' },
                { name: 'Q4 2024 Risk Assessment', type: 'Internal', date: '2024-12-31', status: 'completed' },
                { name: 'SAR Filing - AML-2024-342', type: 'Regulatory', date: '2024-12-28', status: 'submitted' },
                { name: 'KYC Compliance Status', type: 'Internal', date: '2024-12-25', status: 'completed' }
              ].map((report, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{report.name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        report.type === 'Regulatory' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {report.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{report.date}</p>
                  </div>
                  <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg">
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
              { id: 'kyc', label: 'KYC', count: notifications.filter(n => n.category === 'kyc').length },
              { id: 'aml', label: 'AML', count: notifications.filter(n => n.category === 'aml').length },
              { id: 'sar', label: 'SAR', count: notifications.filter(n => n.category === 'sar').length },
              { id: 'report', label: 'Reports', count: notifications.filter(n => n.category === 'report').length }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setNotificationFilter(cat.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${
                  notificationFilter === cat.id 
                    ? 'bg-amber-600 text-white' 
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
                  <h3 className="text-lg font-semibold text-gray-900">Compliance Notifications</h3>
                  <p className="text-sm text-gray-500 mt-1">{unreadNotifications.length} unread</p>
                </div>
                <button 
                  onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                  className="text-sm text-amber-600 hover:text-amber-700"
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
                  className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-amber-50' : ''}`}
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
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{notification.category.toUpperCase()}</span>
                        </div>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-amber-600 rounded-full" />
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
            {/* KYC Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">KYC Settings</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">KYC Expiry (months)</label>
                    <input 
                      type="number" 
                      value={settings.kycExpiryMonths} 
                      onChange={(e) => updateSetting('kycExpiryMonths', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Renewal Reminder (days)</label>
                    <input 
                      type="number" 
                      value={settings.kycRenewalReminderDays} 
                      onChange={(e) => updateSetting('kycRenewalReminderDays', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Require Selfie</p>
                    <p className="text-sm text-gray-500">Liveness check with selfie</p>
                  </div>
                  <Toggle 
                    enabled={settings.requireSelfie} 
                    onChange={() => updateSetting('requireSelfie', !settings.requireSelfie)} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Require ID Front & Back</p>
                    <p className="text-sm text-gray-500">Both sides of ID document</p>
                  </div>
                  <Toggle 
                    enabled={settings.requireIdFrontBack} 
                    onChange={() => updateSetting('requireIdFrontBack', !settings.requireIdFrontBack)} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Auto-Reject Blurry Images</p>
                    <p className="text-sm text-gray-500">Automatically reject low-quality images</p>
                  </div>
                  <Toggle 
                    enabled={settings.autoRejectBlurryImages} 
                    onChange={() => updateSetting('autoRejectBlurryImages', !settings.autoRejectBlurryImages)} 
                  />
                </div>
              </div>
            </div>

            {/* AML Thresholds */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">AML Thresholds</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CTR Threshold (KES)</label>
                    <input 
                      type="number" 
                      value={settings.ctrThreshold} 
                      onChange={(e) => updateSetting('ctrThreshold', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SAR Threshold (KES)</label>
                    <input 
                      type="number" 
                      value={settings.sarThreshold} 
                      onChange={(e) => updateSetting('sarThreshold', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Velocity Limit (txn/hour)</label>
                    <input 
                      type="number" 
                      value={settings.velocityLimit} 
                      onChange={(e) => updateSetting('velocityLimit', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Daily Limit (KES)</label>
                    <input 
                      type="number" 
                      value={settings.dailyTransactionLimit} 
                      onChange={(e) => updateSetting('dailyTransactionLimit', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Scoring */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Risk Scoring</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">High Risk Threshold</label>
                    <input 
                      type="number" 
                      value={settings.highRiskThreshold} 
                      onChange={(e) => updateSetting('highRiskThreshold', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medium Risk Threshold</label>
                    <input 
                      type="number" 
                      value={settings.mediumRiskThreshold} 
                      onChange={(e) => updateSetting('mediumRiskThreshold', parseInt(e.target.value))} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg" 
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Auto-Escalate PEP</p>
                    <p className="text-sm text-gray-500">Escalate politically exposed persons</p>
                  </div>
                  <Toggle 
                    enabled={settings.pepAutoEscalate} 
                    onChange={() => updateSetting('pepAutoEscalate', !settings.pepAutoEscalate)} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Auto-Block Sanctions Match</p>
                    <p className="text-sm text-gray-500">Block transactions matching sanctions</p>
                  </div>
                  <Toggle 
                    enabled={settings.sanctionsAutoBlock} 
                    onChange={() => updateSetting('sanctionsAutoBlock', !settings.sanctionsAutoBlock)} 
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
                      <p className="text-sm text-gray-500">Receive alerts via email</p>
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
                      <p className="font-medium text-gray-900">SMS Notifications</p>
                      <p className="text-sm text-gray-500">Receive alerts via SMS</p>
                    </div>
                  </div>
                  <Toggle 
                    enabled={settings.smsNotifications} 
                    onChange={() => updateSetting('smsNotifications', !settings.smsNotifications)} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">KYC Pending Alerts</p>
                    <p className="text-sm text-gray-500">Alert on new KYC submissions</p>
                  </div>
                  <Toggle 
                    enabled={settings.kycPendingAlerts} 
                    onChange={() => updateSetting('kycPendingAlerts', !settings.kycPendingAlerts)} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">AML Alert Notifications</p>
                    <p className="text-sm text-gray-500">Alert on new AML alerts</p>
                  </div>
                  <Toggle 
                    enabled={settings.amlAlertNotifications} 
                    onChange={() => updateSetting('amlAlertNotifications', !settings.amlAlertNotifications)} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* AUDIT TRAIL TAB */}
      {/* ============================================ */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Audit Trail</h3>
              <p className="text-sm text-gray-500 mt-1">Complete log of all compliance actions and system events</p>
            </div>
            <div className="divide-y divide-gray-100">
              {auditLog.map(log => (
                <div key={log.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <History className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{log.action}</p>
                        <span className="text-xs text-gray-500">{formatTimeAgo(log.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{log.user} → {log.target}</p>
                      <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* MODALS */}
      {/* ============================================ */}

      {/* Alert Detail Modal */}
      <Modal isOpen={showAlertDetailModal} onClose={() => setShowAlertDetailModal(false)} title="AML Alert Details" size="lg">
        {selectedAlert && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedAlert.id}</h3>
                <p className="text-gray-500">{selectedAlert.alertType.replace(/_/g, ' ')}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(selectedAlert.severity)}`}>
                {selectedAlert.severity.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Borrower</p>
                <p className="font-semibold">{selectedAlert.borrowerName}</p>
                <p className="text-xs text-gray-500">{selectedAlert.borrowerId}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-semibold">KES {selectedAlert.amount.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Risk Score</p>
                <p className="font-semibold">{selectedAlert.riskScore}/100</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAlert.status)}`}>
                  {selectedAlert.status}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">Description</p>
              <p className="text-gray-900">{selectedAlert.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Transactions</p>
                <p className="font-semibold">{selectedAlert.transactionCount} in {selectedAlert.timeframe}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Assigned To</p>
                <p className="font-semibold">{selectedAlert.assignedTo || 'Unassigned'}</p>
              </div>
            </div>

            <div className="flex gap-3">
              {selectedAlert.status === 'open' && (
                <button
                  onClick={() => { handleAlertAction(selectedAlert.id, 'investigate'); setShowAlertDetailModal(false); }}
                  className="flex-1 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700"
                >
                  Start Investigation
                </button>
              )}
              {(selectedAlert.status === 'open' || selectedAlert.status === 'investigating') && (
                <>
                  <button
                    onClick={() => { handleAlertAction(selectedAlert.id, 'escalate'); setShowAlertDetailModal(false); }}
                    className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                  >
                    Escalate
                  </button>
                  <button
                    onClick={() => { handleAlertAction(selectedAlert.id, 'resolve'); setShowAlertDetailModal(false); }}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                  >
                    Mark Resolved
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* KYC Detail Modal */}
      <Modal isOpen={showKycDetailModal} onClose={() => setShowKycDetailModal(false)} title="KYC Verification Details" size="lg">
        {selectedKyc && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedKyc.borrowerName}</h3>
                <p className="text-gray-500">{selectedKyc.borrowerId}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedKyc.status)}`}>
                {selectedKyc.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-semibold">{selectedKyc.phoneNumber}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Document Type</p>
                <p className="font-semibold">{selectedKyc.documentType}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">County</p>
                <p className="font-semibold">{selectedKyc.county}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Risk Level</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedKyc.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                  selectedKyc.riskLevel === 'medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {selectedKyc.riskLevel}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">Verification Checks</p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${selectedKyc.pepCheck ? 'bg-amber-500' : 'bg-green-500'}`} />
                  <span className="text-sm">PEP: {selectedKyc.pepCheck ? 'Flagged' : 'Clear'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${selectedKyc.sanctionsCheck ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm">Sanctions: {selectedKyc.sanctionsCheck ? 'Clear' : 'Match'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${selectedKyc.adverseMediaCheck ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm">Adverse Media: {selectedKyc.adverseMediaCheck ? 'Clear' : 'Found'}</span>
                </div>
              </div>
            </div>

            {selectedKyc.verificationNotes && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Notes</p>
                <p className="text-gray-900">{selectedKyc.verificationNotes}</p>
              </div>
            )}

            {selectedKyc.status === 'pending' && (
              <div className="flex gap-3">
                <button
                  onClick={() => { handleKycAction(selectedKyc.id, 'approve'); setShowKycDetailModal(false); }}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                >
                  Approve KYC
                </button>
                <button
                  onClick={() => { handleKycAction(selectedKyc.id, 'reject'); setShowKycDetailModal(false); }}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                >
                  Reject KYC
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Report Generation Modal */}
      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Generate Compliance Report" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
              <option>AML Summary Report</option>
              <option>KYC Status Report</option>
              <option>SAR Filing Report</option>
              <option>CTR Report</option>
              <option>Risk Assessment</option>
              <option>Audit Trail Report</option>
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
                  message: 'Your compliance report is ready for download',
                  time: 'Just now',
                  type: 'success',
                  read: false,
                  category: 'report'
                };
                setNotifications([newNotification, ...notifications]);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              <Download className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>
    </Modal>
      {/* Amazon Q AI Assistant */}
      <AmazonQChat 
        userRole="bank_compliance" 
        tenantId="default"
      />
    </div>
  );
};
export default BankComplianceDashboard;

