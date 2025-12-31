// PlatformAdminDashboard.tsx - Complete Platform Admin Dashboard with Sidebar Navigation
// Place in: src/components/dashboards/PlatformAdminDashboard.tsx

import React, { useState, useEffect } from 'react';
import {
  Home, Building2, Landmark, Users, ArrowRightLeft, TrendingUp, FileText,
  Shield, AlertTriangle, BarChart3, Bell, Settings, Search, Menu, X,
  ChevronRight, LogOut, User, HelpCircle, DollarSign, CheckCircle, Clock,
  Plus, Edit, Ban, Trash2, Eye, RefreshCw, Mail, Phone, MapPin, UserCheck,
  Download, Calendar, Flag, Info, Activity, Gauge, Target, Globe, Percent
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type NavSection = 'overview' | 'bank-management' | 'investor-management' | 'user-management' | 
                  'transaction-oversight' | 'platform-pl' | 'all-instruments' | 'compliance' | 
                  'risk-management' | 'analytics' | 'notifications' | 'settings';

interface Bank {
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  status: 'active' | 'suspended' | 'pending';
  capitalCallingLimit: number;
  totalDeposits: number;
  loansDisbursed: number;
  revenueToDate: number;
  joinedDate: string;
  usersCount: number;
  subscriptionTier: 'starter' | 'professional' | 'enterprise';
  subscriptionStatus: 'active' | 'expired' | 'pending';
  subscriptionExpiry: string;
}

interface Investor {
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  status: 'active' | 'suspended' | 'pending';
  totalInvested: number;
  activeDeposits: number;
  revenueToDate: number;
  joinedDate: string;
  usersCount: number;
  subscriptionTier: 'starter' | 'professional' | 'enterprise';
  subscriptionStatus: 'active' | 'expired' | 'pending';
  subscriptionExpiry: string;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
}

interface PlatformUser {
  userId: string;
  name: string;
  email: string;
  role: string;
  roleDisplay: string;
  tenantId: string;
  tenantName: string;
  tenantType: 'bank' | 'investor' | 'platform';
  status: 'active' | 'suspended' | 'pending';
  lastLogin: string;
  createdAt: string;
}

interface Transaction {
  txnId: string;
  type: 'deposit' | 'maturity';
  bankId: string;
  bankName: string;
  investorId: string;
  investorName: string;
  amount: number;
  currency: 'JPY' | 'CHF';
  status: 'completed' | 'pending_kyc' | 'pending_aml' | 'processing';
  kycStatus: 'cleared' | 'pending' | 'review';
  kycOfficer: string | null;
  kycDate: string | null;
  amlStatus: 'cleared' | 'pending' | 'flagged';
  amlOfficer: string | null;
  amlDate: string | null;
  createdAt: string;
  completedAt: string | null;
}

interface Instrument {
  instrumentId: string;
  name: string;
  type: string;
  bankId: string;
  bankName: string;
  currency: string;
  totalYield: number;
  totalValue: number;
  status: 'active' | 'suspended' | 'cancelled';
  kycVerified: boolean;
  amlCleared: boolean;
  createdAt: string;
  maturityDate: string;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  category: string;
  title: string;
  message: string;
  tenantName?: string;
  tenantType?: string;
  isRead: boolean;
  createdAt: string;
}

interface ComplianceAlert {
  alertId: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  tenantName: string;
  tenantType: 'bank' | 'investor';
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'escalated';
  createdAt: string;
}

// ============================================================================
// SAMPLE DATA
// ============================================================================

const SAMPLE_BANKS: Bank[] = [
  { tenantId: 'bank_001', name: 'Equity Bank Kenya', email: 'admin@equity.co.ke', phone: '+254 20 2262000', country: 'Kenya', status: 'active', capitalCallingLimit: 200000000, totalDeposits: 180000000, loansDisbursed: 4500000000, revenueToDate: 850000, joinedDate: '2024-01-15', usersCount: 45, subscriptionTier: 'enterprise', subscriptionStatus: 'active', subscriptionExpiry: '2025-01-15' },
  { tenantId: 'bank_002', name: 'KCB Bank', email: 'admin@kcb.co.ke', phone: '+254 20 3270000', country: 'Kenya', status: 'active', capitalCallingLimit: 180000000, totalDeposits: 150000000, loansDisbursed: 3800000000, revenueToDate: 680000, joinedDate: '2024-02-20', usersCount: 38, subscriptionTier: 'enterprise', subscriptionStatus: 'active', subscriptionExpiry: '2025-02-20' },
  { tenantId: 'bank_003', name: 'DTB Kenya', email: 'admin@dtb.co.ke', phone: '+254 20 2851000', country: 'Kenya', status: 'active', capitalCallingLimit: 120000000, totalDeposits: 95000000, loansDisbursed: 2200000000, revenueToDate: 420000, joinedDate: '2024-03-10', usersCount: 28, subscriptionTier: 'professional', subscriptionStatus: 'active', subscriptionExpiry: '2025-03-10' },
  { tenantId: 'bank_004', name: 'Stanbic Bank', email: 'admin@stanbic.co.ke', phone: '+254 20 3638000', country: 'Kenya', status: 'active', capitalCallingLimit: 100000000, totalDeposits: 75000000, loansDisbursed: 1500000000, revenueToDate: 280000, joinedDate: '2024-04-05', usersCount: 22, subscriptionTier: 'professional', subscriptionStatus: 'active', subscriptionExpiry: '2025-04-05' },
  { tenantId: 'bank_005', name: 'CRDB Bank Tanzania', email: 'admin@crdb.co.tz', phone: '+255 22 2117442', country: 'Tanzania', status: 'active', capitalCallingLimit: 80000000, totalDeposits: 45000000, loansDisbursed: 500000000, revenueToDate: 120000, joinedDate: '2024-05-15', usersCount: 15, subscriptionTier: 'professional', subscriptionStatus: 'active', subscriptionExpiry: '2025-05-15' },
  { tenantId: 'bank_006', name: 'NMB Bank Tanzania', email: 'admin@nmb.co.tz', phone: '+255 22 2116264', country: 'Tanzania', status: 'active', capitalCallingLimit: 60000000, totalDeposits: 30000000, loansDisbursed: 350000000, revenueToDate: 45000, joinedDate: '2024-06-01', usersCount: 8, subscriptionTier: 'starter', subscriptionStatus: 'active', subscriptionExpiry: '2025-06-01' },
  { tenantId: 'bank_007', name: 'Centenary Bank Uganda', email: 'admin@centenary.co.ug', phone: '+256 417 251276', country: 'Uganda', status: 'active', capitalCallingLimit: 50000000, totalDeposits: 25000000, loansDisbursed: 280000000, revenueToDate: 35000, joinedDate: '2024-07-10', usersCount: 6, subscriptionTier: 'starter', subscriptionStatus: 'active', subscriptionExpiry: '2025-07-10' },
  { tenantId: 'bank_008', name: 'Access Bank Rwanda', email: 'admin@accessbank.rw', phone: '+250 788 145000', country: 'Rwanda', status: 'suspended', capitalCallingLimit: 40000000, totalDeposits: 0, loansDisbursed: 0, revenueToDate: 20000, joinedDate: '2024-08-01', usersCount: 4, subscriptionTier: 'starter', subscriptionStatus: 'expired', subscriptionExpiry: '2024-11-01' }
];

const SAMPLE_INVESTORS: Investor[] = [
  { tenantId: 'inv_001', name: 'Impact Capital Partners', email: 'admin@impactcapital.com', phone: '+1 212 555 0100', country: 'USA', status: 'active', totalInvested: 125000000, activeDeposits: 85000000, revenueToDate: 450000, joinedDate: '2024-01-10', usersCount: 12, subscriptionTier: 'enterprise', subscriptionStatus: 'active', subscriptionExpiry: '2025-01-10', riskProfile: 'moderate' },
  { tenantId: 'inv_002', name: 'Shell Foundation', email: 'investments@shellfoundation.org', phone: '+44 20 7934 8000', country: 'UK', status: 'active', totalInvested: 95000000, activeDeposits: 65000000, revenueToDate: 320000, joinedDate: '2024-02-15', usersCount: 8, subscriptionTier: 'enterprise', subscriptionStatus: 'active', subscriptionExpiry: '2025-02-15', riskProfile: 'conservative' },
  { tenantId: 'inv_003', name: 'Nordic Impact Fund', email: 'info@nordicimpact.no', phone: '+47 22 00 0000', country: 'Norway', status: 'active', totalInvested: 75000000, activeDeposits: 50000000, revenueToDate: 180000, joinedDate: '2024-03-20', usersCount: 6, subscriptionTier: 'professional', subscriptionStatus: 'active', subscriptionExpiry: '2025-03-20', riskProfile: 'moderate' },
  { tenantId: 'inv_004', name: 'Acumen Fund', email: 'invest@acumen.org', phone: '+1 212 566 8821', country: 'USA', status: 'active', totalInvested: 60000000, activeDeposits: 40000000, revenueToDate: 150000, joinedDate: '2024-04-10', usersCount: 5, subscriptionTier: 'professional', subscriptionStatus: 'active', subscriptionExpiry: '2025-04-10', riskProfile: 'aggressive' },
  { tenantId: 'inv_005', name: 'Triodos Investment', email: 'africa@triodos.com', phone: '+31 30 693 6500', country: 'Netherlands', status: 'active', totalInvested: 55000000, activeDeposits: 35000000, revenueToDate: 120000, joinedDate: '2024-05-05', usersCount: 4, subscriptionTier: 'professional', subscriptionStatus: 'active', subscriptionExpiry: '2025-05-05', riskProfile: 'conservative' },
  { tenantId: 'inv_006', name: 'ResponsAbility', email: 'investments@responsability.com', phone: '+41 44 403 0500', country: 'Switzerland', status: 'active', totalInvested: 45000000, activeDeposits: 30000000, revenueToDate: 95000, joinedDate: '2024-06-15', usersCount: 4, subscriptionTier: 'professional', subscriptionStatus: 'active', subscriptionExpiry: '2025-06-15', riskProfile: 'moderate' },
  { tenantId: 'inv_007', name: 'BlueOrchard Finance', email: 'info@blueorchard.com', phone: '+41 22 596 4777', country: 'Switzerland', status: 'active', totalInvested: 40000000, activeDeposits: 25000000, revenueToDate: 80000, joinedDate: '2024-07-01', usersCount: 3, subscriptionTier: 'starter', subscriptionStatus: 'active', subscriptionExpiry: '2025-07-01', riskProfile: 'moderate' },
  { tenantId: 'inv_008', name: 'Oikocredit', email: 'africa@oikocredit.org', phone: '+31 33 422 4040', country: 'Netherlands', status: 'active', totalInvested: 35000000, activeDeposits: 20000000, revenueToDate: 55000, joinedDate: '2024-08-10', usersCount: 3, subscriptionTier: 'starter', subscriptionStatus: 'active', subscriptionExpiry: '2025-08-10', riskProfile: 'conservative' },
  { tenantId: 'inv_009', name: 'Global Impact Fund', email: 'invest@globalimpact.jp', phone: '+81 3 1234 5678', country: 'Japan', status: 'suspended', totalInvested: 0, activeDeposits: 0, revenueToDate: 15000, joinedDate: '2024-09-01', usersCount: 2, subscriptionTier: 'starter', subscriptionStatus: 'expired', subscriptionExpiry: '2024-12-01', riskProfile: 'moderate' }
];

const SAMPLE_USERS: PlatformUser[] = [
  { userId: 'usr_001', name: 'James Mwangi', email: 'james@equity.co.ke', role: 'bank_admin', roleDisplay: 'Bank Admin', tenantId: 'bank_001', tenantName: 'Equity Bank Kenya', tenantType: 'bank', status: 'active', lastLogin: '2024-12-10T10:30:00Z', createdAt: '2024-01-15' },
  { userId: 'usr_002', name: 'Sarah Ochieng', email: 'sarah@equity.co.ke', role: 'bank_lender', roleDisplay: 'Bank Lender', tenantId: 'bank_001', tenantName: 'Equity Bank Kenya', tenantType: 'bank', status: 'active', lastLogin: '2024-12-10T09:15:00Z', createdAt: '2024-02-20' },
  { userId: 'usr_003', name: 'Peter Kimani', email: 'peter@kcb.co.ke', role: 'bank_compliance', roleDisplay: 'Compliance Officer', tenantId: 'bank_002', tenantName: 'KCB Bank', tenantType: 'bank', status: 'active', lastLogin: '2024-12-09T16:45:00Z', createdAt: '2024-03-01' },
  { userId: 'usr_004', name: 'Grace Wanjiku', email: 'grace@kcb.co.ke', role: 'bank_risk', roleDisplay: 'Risk Officer', tenantId: 'bank_002', tenantName: 'KCB Bank', tenantType: 'bank', status: 'active', lastLogin: '2024-12-10T08:00:00Z', createdAt: '2024-03-15' },
  { userId: 'usr_005', name: 'Michael Oduya', email: 'michael@crdb.co.tz', role: 'bank_caller', roleDisplay: 'Capital Caller', tenantId: 'bank_005', tenantName: 'CRDB Bank Tanzania', tenantType: 'bank', status: 'pending', lastLogin: '', createdAt: '2024-12-08' },
  { userId: 'usr_006', name: 'John Smith', email: 'john@impactcapital.com', role: 'investor_admin', roleDisplay: 'Investor Admin', tenantId: 'inv_001', tenantName: 'Impact Capital Partners', tenantType: 'investor', status: 'active', lastLogin: '2024-12-10T11:00:00Z', createdAt: '2024-01-20' },
  { userId: 'usr_007', name: 'Emma Wilson', email: 'emma@impactcapital.com', role: 'investor_analyst', roleDisplay: 'Investment Analyst', tenantId: 'inv_001', tenantName: 'Impact Capital Partners', tenantType: 'investor', status: 'active', lastLogin: '2024-12-09T14:30:00Z', createdAt: '2024-02-25' },
  { userId: 'usr_008', name: 'David Admin', email: 'admin@forwardsflow.com', role: 'super_admin', roleDisplay: 'Super Admin', tenantId: 'platform', tenantName: 'ForwardsFlow Platform', tenantType: 'platform', status: 'active', lastLogin: '2024-12-10T12:00:00Z', createdAt: '2024-01-01' },
  { userId: 'usr_009', name: 'Lisa Support', email: 'support@forwardsflow.com', role: 'platform_support', roleDisplay: 'Platform Support', tenantId: 'platform', tenantName: 'ForwardsFlow Platform', tenantType: 'platform', status: 'active', lastLogin: '2024-12-10T10:00:00Z', createdAt: '2024-01-05' }
];

const SAMPLE_TRANSACTIONS: Transaction[] = [
  { txnId: 'TXN-001', type: 'deposit', bankId: 'bank_001', bankName: 'Equity Bank Kenya', investorId: 'inv_001', investorName: 'Impact Capital Partners', amount: 50000000, currency: 'JPY', status: 'completed', kycStatus: 'cleared', kycOfficer: 'Peter Kimani', kycDate: '2024-12-08', amlStatus: 'cleared', amlOfficer: 'Grace Wanjiku', amlDate: '2024-12-09', createdAt: '2024-12-05', completedAt: '2024-12-10' },
  { txnId: 'TXN-002', type: 'deposit', bankId: 'bank_002', bankName: 'KCB Bank', investorId: 'inv_002', investorName: 'Shell Foundation', amount: 35000000, currency: 'JPY', status: 'pending_kyc', kycStatus: 'pending', kycOfficer: null, kycDate: null, amlStatus: 'pending', amlOfficer: null, amlDate: null, createdAt: '2024-12-08', completedAt: null },
  { txnId: 'TXN-003', type: 'deposit', bankId: 'bank_003', bankName: 'DTB Kenya', investorId: 'inv_003', investorName: 'Nordic Impact Fund', amount: 25000000, currency: 'CHF', status: 'pending_aml', kycStatus: 'cleared', kycOfficer: 'Peter Kimani', kycDate: '2024-12-09', amlStatus: 'pending', amlOfficer: null, amlDate: null, createdAt: '2024-12-07', completedAt: null },
  { txnId: 'TXN-004', type: 'maturity', bankId: 'bank_001', bankName: 'Equity Bank Kenya', investorId: 'inv_004', investorName: 'Acumen Fund', amount: 40000000, currency: 'JPY', status: 'completed', kycStatus: 'cleared', kycOfficer: 'Sarah Ochieng', kycDate: '2024-11-15', amlStatus: 'cleared', amlOfficer: 'Grace Wanjiku', amlDate: '2024-11-16', createdAt: '2024-11-10', completedAt: '2024-12-01' },
  { txnId: 'TXN-005', type: 'deposit', bankId: 'bank_005', bankName: 'CRDB Bank Tanzania', investorId: 'inv_005', investorName: 'Triodos Investment', amount: 20000000, currency: 'JPY', status: 'processing', kycStatus: 'cleared', kycOfficer: 'Peter Kimani', kycDate: '2024-12-09', amlStatus: 'cleared', amlOfficer: 'Grace Wanjiku', amlDate: '2024-12-10', createdAt: '2024-12-06', completedAt: null },
];

const SAMPLE_INSTRUMENTS: Instrument[] = [
  { instrumentId: 'INST-001', name: 'Equity 12M Fixed Deposit', type: 'fixed_deposit', bankId: 'bank_001', bankName: 'Equity Bank Kenya', currency: 'KES:JPY', totalYield: 9.75, totalValue: 180000000, status: 'active', kycVerified: true, amlCleared: true, createdAt: '2024-01-15', maturityDate: '2025-01-15' },
  { instrumentId: 'INST-002', name: 'KCB 6M Time Deposit', type: 'time_deposit', bankId: 'bank_002', bankName: 'KCB Bank', currency: 'KES:JPY', totalYield: 8.5, totalValue: 95000000, status: 'active', kycVerified: true, amlCleared: true, createdAt: '2024-03-01', maturityDate: '2024-09-01' },
  { instrumentId: 'INST-003', name: 'DTB 9M Certificate', type: 'certificate_of_deposit', bankId: 'bank_003', bankName: 'DTB Kenya', currency: 'KES:CHF', totalYield: 10.5, totalValue: 55000000, status: 'active', kycVerified: true, amlCleared: true, createdAt: '2024-04-10', maturityDate: '2025-01-10' },
  { instrumentId: 'INST-004', name: 'CRDB 12M Fixed Deposit', type: 'fixed_deposit', bankId: 'bank_005', bankName: 'CRDB Bank Tanzania', currency: 'TZS:JPY', totalYield: 12.25, totalValue: 45000000, status: 'active', kycVerified: true, amlCleared: false, createdAt: '2024-05-15', maturityDate: '2025-05-15' },
  { instrumentId: 'INST-005', name: 'Stanbic 3M Time Deposit', type: 'time_deposit', bankId: 'bank_004', bankName: 'Stanbic Bank', currency: 'KES:JPY', totalYield: 6.75, totalValue: 25000000, status: 'suspended', kycVerified: true, amlCleared: true, createdAt: '2024-06-01', maturityDate: '2024-09-01' },
];

const SAMPLE_NOTIFICATIONS: Notification[] = [
  { id: 'not_001', type: 'alert', category: 'compliance', title: 'Critical AML Alert', message: 'Unusual transaction pattern detected for CRDB Bank Tanzania.', tenantName: 'CRDB Bank Tanzania', tenantType: 'bank', isRead: false, createdAt: '2024-12-10T10:30:00Z' },
  { id: 'not_002', type: 'warning', category: 'tenant', title: 'Subscription Expiring', message: 'Access Bank Rwanda subscription expires in 7 days.', tenantName: 'Access Bank Rwanda', tenantType: 'bank', isRead: false, createdAt: '2024-12-10T09:15:00Z' },
  { id: 'not_003', type: 'success', category: 'transaction', title: 'Transaction Completed', message: 'Deposit transaction TXN-001 for ¥50M has been successfully completed.', isRead: false, createdAt: '2024-12-10T08:45:00Z' },
  { id: 'not_004', type: 'info', category: 'user', title: 'New User Registration', message: 'New user Michael Oduya registered for CRDB Bank Tanzania.', tenantName: 'CRDB Bank Tanzania', tenantType: 'bank', isRead: true, createdAt: '2024-12-09T16:20:00Z' },
  { id: 'not_005', type: 'success', category: 'tenant', title: 'Bank Onboarded', message: 'Centenary Bank Uganda has completed onboarding and is now active.', tenantName: 'Centenary Bank Uganda', tenantType: 'bank', isRead: true, createdAt: '2024-12-09T14:00:00Z' },
];

const SAMPLE_ALERTS: ComplianceAlert[] = [
  { alertId: 'ALT-001', type: 'aml', severity: 'high', tenantName: 'CRDB Bank Tanzania', tenantType: 'bank', description: 'Unusual transaction pattern detected', status: 'investigating', createdAt: '2024-12-08' },
  { alertId: 'ALT-002', type: 'kyc', severity: 'medium', tenantName: 'Global Impact Fund', tenantType: 'investor', description: 'KYC documentation expired', status: 'open', createdAt: '2024-12-10' },
  { alertId: 'ALT-003', type: 'sanction', severity: 'critical', tenantName: 'DTB Kenya', tenantType: 'bank', description: 'Potential sanction list match', status: 'escalated', createdAt: '2024-12-05' },
];

const MONTHLY_PL_DATA = [
  { month: 'Jul', revenue: 135000, expenses: 123000, profit: 12000 },
  { month: 'Aug', revenue: 154500, expenses: 127500, profit: 27000 },
  { month: 'Sep', revenue: 173000, expenses: 130500, profit: 42500 },
  { month: 'Oct', revenue: 192500, expenses: 133500, profit: 59000 },
  { month: 'Nov', revenue: 212000, expenses: 136500, profit: 75500 },
  { month: 'Dec', revenue: 232500, expenses: 138000, profit: 94500 },
];

const RISK_DATA = [
  { month: 'Jul', portfolioRisk: 35, defaultRate: 3.2 },
  { month: 'Aug', portfolioRisk: 33, defaultRate: 3.0 },
  { month: 'Sep', portfolioRisk: 31, defaultRate: 2.9 },
  { month: 'Oct', portfolioRisk: 32, defaultRate: 2.8 },
  { month: 'Nov', portfolioRisk: 30, defaultRate: 2.7 },
  { month: 'Dec', portfolioRisk: 28, defaultRate: 2.5 },
];

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizeClasses = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl' };
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

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  subtitle?: string;
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, subtitle, trend }) => {
  const colorClasses: Record<string, string> = {
    purple: 'bg-purple-100 text-purple-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
    rose: 'bg-rose-100 text-rose-600'
  };
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          {trend !== undefined && (
            <p className={`text-sm mt-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '+' : ''}{trend}% vs last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.blue}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PAGE COMPONENTS
// ============================================================================

// Home/Overview Page
const OverviewPage: React.FC = () => {
  const totalBanks = SAMPLE_BANKS.length;
  const activeBanks = SAMPLE_BANKS.filter(b => b.status === 'active').length;
  const totalInvestors = SAMPLE_INVESTORS.length;
  const activeInvestors = SAMPLE_INVESTORS.filter(i => i.status === 'active').length;
  const totalDeposits = SAMPLE_BANKS.reduce((sum, b) => sum + b.totalDeposits, 0);
  const totalRevenue = SAMPLE_BANKS.reduce((sum, b) => sum + b.revenueToDate, 0) + SAMPLE_INVESTORS.reduce((sum, i) => sum + i.revenueToDate, 0);
  const pendingTxns = SAMPLE_TRANSACTIONS.filter(t => t.status !== 'completed').length;
  const unreadNotifications = SAMPLE_NOTIFICATIONS.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening on ForwardsFlow.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Partner Banks" value={totalBanks} icon={Building2} color="purple" subtitle={`${activeBanks} active`} />
        <StatCard title="Impact Investors" value={totalInvestors} icon={Landmark} color="emerald" subtitle={`${activeInvestors} active`} />
        <StatCard title="Total Deposits" value={`¥${(totalDeposits / 1000000).toFixed(0)}M`} icon={TrendingUp} color="blue" trend={15} />
        <StatCard title="Platform Revenue" value={`$${(totalRevenue / 1000).toFixed(0)}K`} icon={DollarSign} color="green" trend={22} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={MONTHLY_PL_DATA}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${(value/1000).toFixed(0)}K`} />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
              <Building2 className="w-6 h-6 text-purple-600 mb-2" />
              <p className="font-medium text-gray-900">Add Bank</p>
              <p className="text-sm text-gray-500">Onboard new partner</p>
            </button>
            <button className="p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors text-left">
              <Landmark className="w-6 h-6 text-emerald-600 mb-2" />
              <p className="font-medium text-gray-900">Add Investor</p>
              <p className="text-sm text-gray-500">Register new investor</p>
            </button>
            <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left">
              <Users className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-medium text-gray-900">Manage Users</p>
              <p className="text-sm text-gray-500">{SAMPLE_USERS.length} total users</p>
            </button>
            <button className="p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors text-left">
              <Shield className="w-6 h-6 text-amber-600 mb-2" />
              <p className="font-medium text-gray-900">Compliance</p>
              <p className="text-sm text-gray-500">{SAMPLE_ALERTS.filter(a => a.status !== 'resolved').length} open alerts</p>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Transactions</h3>
          <div className="space-y-3">
            {SAMPLE_TRANSACTIONS.filter(t => t.status !== 'completed').slice(0, 3).map(txn => (
              <div key={txn.txnId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{txn.txnId}</p>
                  <p className="text-sm text-gray-500">{txn.bankName}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  txn.status === 'pending_kyc' ? 'bg-amber-100 text-amber-700' :
                  txn.status === 'pending_aml' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {txn.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Notifications</h3>
          <div className="space-y-3">
            {SAMPLE_NOTIFICATIONS.slice(0, 3).map(notif => (
              <div key={notif.id} className={`flex items-start gap-3 p-3 rounded-lg ${notif.isRead ? 'bg-gray-50' : 'bg-blue-50'}`}>
                <div className={`p-1.5 rounded-full ${
                  notif.type === 'alert' ? 'bg-red-100' :
                  notif.type === 'warning' ? 'bg-amber-100' :
                  notif.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <Bell className={`w-3 h-3 ${
                    notif.type === 'alert' ? 'text-red-600' :
                    notif.type === 'warning' ? 'text-amber-600' :
                    notif.type === 'success' ? 'text-green-600' : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{notif.title}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[200px]">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Alerts</h3>
          <div className="space-y-3">
            {SAMPLE_ALERTS.slice(0, 3).map(alert => (
              <div key={alert.alertId} className={`flex items-center justify-between p-3 rounded-lg ${
                alert.severity === 'critical' ? 'bg-red-50' :
                alert.severity === 'high' ? 'bg-orange-50' :
                alert.severity === 'medium' ? 'bg-amber-50' : 'bg-blue-50'
              }`}>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{alert.tenantName}</p>
                  <p className="text-xs text-gray-500 uppercase">{alert.type}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                  alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                  alert.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {alert.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Bank Management Page
const BankManagementPage: React.FC = () => {
  const [banks, setBanks] = useState<Bank[]>(SAMPLE_BANKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

  const filteredBanks = banks.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeBanks = banks.filter(b => b.status === 'active').length;
  const totalDeposits = banks.reduce((sum, b) => sum + b.totalDeposits, 0);
  const totalRevenue = banks.reduce((sum, b) => sum + b.revenueToDate, 0);

  const handleSuspend = (bank: Bank) => {
    setBanks(banks.map(b => b.tenantId === bank.tenantId ? { ...b, status: b.status === 'suspended' ? 'active' : 'suspended' } : b));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bank Management</h1>
        <p className="text-gray-600 mt-1">Manage partner banks, onboarding, and integration status</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Banks" value={banks.length} icon={Building2} color="purple" subtitle={`${activeBanks} active`} />
        <StatCard title="Active Banks" value={activeBanks} icon={CheckCircle} color="green" />
        <StatCard title="Total Deposits" value={`¥${(totalDeposits / 1000000).toFixed(0)}M`} icon={TrendingUp} color="blue" />
        <StatCard title="Revenue Generated" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} color="green" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Partner Banks ({banks.length})</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search banks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64" />
              </div>
              <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                <Plus className="w-4 h-4" />Add Bank
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deposits</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscription</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBanks.map(bank => (
                <tr key={bank.tenantId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{bank.name}</p>
                        <p className="text-xs text-gray-500">{bank.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{bank.country}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      bank.status === 'active' ? 'bg-green-100 text-green-700' :
                      bank.status === 'suspended' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{bank.status}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">¥{(bank.totalDeposits / 1000000).toFixed(0)}M</td>
                  <td className="px-4 py-3 text-green-600 font-medium">${bank.revenueToDate.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      bank.subscriptionStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>{bank.subscriptionTier}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setSelectedBank(bank); setShowDetailsModal(true); }} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleSuspend(bank)} className={`p-1.5 rounded-lg ${bank.status === 'suspended' ? 'text-green-600 hover:bg-green-50' : 'text-amber-600 hover:bg-amber-50'}`}><Ban className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Bank Details" size="lg">
        {selectedBank && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-purple-100 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedBank.name}</h3>
                <p className="text-gray-500">{selectedBank.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Country</p><p className="font-semibold">{selectedBank.country}</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Capital Limit</p><p className="font-semibold">¥{(selectedBank.capitalCallingLimit / 1000000).toFixed(0)}M</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Total Deposits</p><p className="font-semibold text-green-600">¥{(selectedBank.totalDeposits / 1000000).toFixed(0)}M</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Revenue</p><p className="font-semibold text-green-600">${selectedBank.revenueToDate.toLocaleString()}</p></div>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Bank">
        <form className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label><input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="Enter bank name" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="admin@bank.com" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg"><option>Kenya</option><option>Tanzania</option><option>Uganda</option><option>Rwanda</option></select>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Add Bank</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// Investor Management Page
const InvestorManagementPage: React.FC = () => {
  const [investors, setInvestors] = useState<Investor[]>(SAMPLE_INVESTORS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);

  const filteredInvestors = investors.filter(i =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeInvestors = investors.filter(i => i.status === 'active').length;
  const totalInvested = investors.reduce((sum, i) => sum + i.totalInvested, 0);
  const totalRevenue = investors.reduce((sum, i) => sum + i.revenueToDate, 0);

  const getRiskColor = (risk: string) => {
    const colors: Record<string, string> = { conservative: 'bg-blue-100 text-blue-700', moderate: 'bg-amber-100 text-amber-700', aggressive: 'bg-red-100 text-red-700' };
    return colors[risk] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Investor Management</h1>
        <p className="text-gray-600 mt-1">Manage impact investors, allocations, and portfolio tracking</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Investors" value={investors.length} icon={Landmark} color="emerald" subtitle={`${activeInvestors} active`} />
        <StatCard title="Active Investors" value={activeInvestors} icon={CheckCircle} color="green" />
        <StatCard title="Total Invested" value={`$${(totalInvested / 1000000).toFixed(0)}M`} icon={TrendingUp} color="blue" />
        <StatCard title="Revenue Generated" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} color="green" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Impact Investors ({investors.length})</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search investors..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64" />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                <Plus className="w-4 h-4" />Add Investor
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Profile</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invested</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvestors.map(investor => (
                <tr key={investor.tenantId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Landmark className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{investor.name}</p>
                        <p className="text-xs text-gray-500">{investor.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{investor.country}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      investor.status === 'active' ? 'bg-green-100 text-green-700' :
                      investor.status === 'suspended' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{investor.status}</span>
                  </td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(investor.riskProfile)}`}>{investor.riskProfile}</span></td>
                  <td className="px-4 py-3 font-medium text-gray-900">${(investor.totalInvested / 1000000).toFixed(0)}M</td>
                  <td className="px-4 py-3 text-green-600 font-medium">${investor.revenueToDate.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setSelectedInvestor(investor); setShowDetailsModal(true); }} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                      <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg"><Ban className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Investor Details" size="lg">
        {selectedInvestor && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Landmark className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedInvestor.name}</h3>
                <p className="text-gray-500">{selectedInvestor.email}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(selectedInvestor.riskProfile)}`}>{selectedInvestor.riskProfile} risk</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Country</p><p className="font-semibold">{selectedInvestor.country}</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Total Invested</p><p className="font-semibold text-emerald-600">${(selectedInvestor.totalInvested / 1000000).toFixed(0)}M</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Active Deposits</p><p className="font-semibold text-blue-600">${(selectedInvestor.activeDeposits / 1000000).toFixed(0)}M</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Revenue</p><p className="font-semibold text-green-600">${selectedInvestor.revenueToDate.toLocaleString()}</p></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// User Management Page
const UserManagementPage: React.FC = () => {
  const [users] = useState<PlatformUser[]>(SAMPLE_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [tenantTypeFilter, setTenantTypeFilter] = useState('all');

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTenantType = tenantTypeFilter === 'all' || u.tenantType === tenantTypeFilter;
    return matchesSearch && matchesTenantType;
  });

  const bankUsers = users.filter(u => u.tenantType === 'bank').length;
  const investorUsers = users.filter(u => u.tenantType === 'investor').length;
  const platformUsers = users.filter(u => u.tenantType === 'platform').length;

  const getRoleColor = (role: string) => {
    if (role.startsWith('bank')) return 'bg-purple-100 text-purple-700';
    if (role.startsWith('investor')) return 'bg-emerald-100 text-emerald-700';
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">Manage users across all tenants and platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={users.length} icon={Users} color="blue" />
        <StatCard title="Bank Users" value={bankUsers} icon={Building2} color="purple" />
        <StatCard title="Investor Users" value={investorUsers} icon={Landmark} color="emerald" />
        <StatCard title="Platform Users" value={platformUsers} icon={Shield} color="amber" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-lg font-semibold text-gray-900">All Users ({users.length})</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
              </div>
              <select value={tenantTypeFilter} onChange={(e) => setTenantTypeFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg">
                <option value="all">All Types</option>
                <option value="bank">Bank</option>
                <option value="investor">Investor</option>
                <option value="platform">Platform</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-4 h-4" />Add User
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(user => (
                <tr key={user.userId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {user.tenantType === 'bank' ? <Building2 className="w-4 h-4 text-purple-600" /> : 
                       user.tenantType === 'investor' ? <Landmark className="w-4 h-4 text-emerald-600" /> : 
                       <Shield className="w-4 h-4 text-blue-600" />}
                      <span className="text-gray-600 text-sm">{user.tenantName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>{user.roleDisplay}</span></td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-100 text-green-700' :
                      user.status === 'suspended' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{user.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                      <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg"><Ban className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Transaction Oversight Page
const TransactionOversightPage: React.FC = () => {
  const [transactions] = useState<Transaction[]>(SAMPLE_TRANSACTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTxns = transactions.filter(t => {
    const matchesSearch = t.txnId.toLowerCase().includes(searchTerm.toLowerCase()) || t.bankName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const completedTxns = transactions.filter(t => t.status === 'completed').length;
  const pendingKyc = transactions.filter(t => t.status === 'pending_kyc').length;
  const pendingAml = transactions.filter(t => t.status === 'pending_aml').length;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = { completed: 'bg-green-100 text-green-700', pending_kyc: 'bg-amber-100 text-amber-700', pending_aml: 'bg-red-100 text-red-700', processing: 'bg-blue-100 text-blue-700' };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transaction Oversight</h1>
        <p className="text-gray-600 mt-1">Monitor all platform transactions with KYC/AML compliance status</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Transactions" value={transactions.length} icon={ArrowRightLeft} color="blue" />
        <StatCard title="Completed" value={completedTxns} icon={CheckCircle} color="green" />
        <StatCard title="Pending KYC" value={pendingKyc} icon={UserCheck} color="amber" />
        <StatCard title="Pending AML" value={pendingAml} icon={Shield} color="red" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-lg font-semibold text-gray-900">All Transactions</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64" />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg">
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending_kyc">Pending KYC</option>
                <option value="pending_aml">Pending AML</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">KYC</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">AML</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTxns.map(txn => (
                <tr key={txn.txnId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{txn.txnId}</p>
                    <p className="text-xs text-gray-500 capitalize">{txn.type}</p>
                  </td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-purple-600" /><span className="text-sm">{txn.bankName}</span></div></td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><Landmark className="w-4 h-4 text-emerald-600" /><span className="text-sm">{txn.investorName}</span></div></td>
                  <td className="px-4 py-3 font-medium">{txn.currency === 'JPY' ? '¥' : 'CHF '}{(txn.amount / 1000000).toFixed(0)}M</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(txn.status)}`}>{txn.status.replace('_', ' ')}</span></td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${txn.kycStatus === 'cleared' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{txn.kycStatus}</span></td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${txn.amlStatus === 'cleared' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{txn.amlStatus}</span></td>
                  <td className="px-4 py-3"><button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Platform P&L Page
const PlatformPLPage: React.FC = () => {
  const totalRevenue = MONTHLY_PL_DATA.reduce((sum, m) => sum + m.revenue, 0);
  const totalExpenses = MONTHLY_PL_DATA.reduce((sum, m) => sum + m.expenses, 0);
  const totalProfit = MONTHLY_PL_DATA.reduce((sum, m) => sum + m.profit, 0);
  const profitMargin = Math.round((totalProfit / totalRevenue) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform P&L</h1>
          <p className="text-gray-600 mt-1">Revenue, expenses, and profitability analysis</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Download className="w-4 h-4" />Export
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`$${(totalRevenue / 1000).toFixed(0)}K`} icon={TrendingUp} color="green" trend={15} />
        <StatCard title="Total Expenses" value={`$${(totalExpenses / 1000).toFixed(0)}K`} icon={ArrowRightLeft} color="red" trend={8} />
        <StatCard title="Net Profit" value={`$${(totalProfit / 1000).toFixed(0)}K`} icon={DollarSign} color="green" trend={22} />
        <StatCard title="Profit Margin" value={`${profitMargin}%`} icon={Percent} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Profit Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={MONTHLY_PL_DATA}>
              <defs>
                <linearGradient id="colorRev2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${(value/1000).toFixed(0)}K`} />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="url(#colorRev2)" name="Revenue" />
              <Area type="monotone" dataKey="profit" stroke="#3B82F6" fill="url(#colorProf)" name="Profit" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={MONTHLY_PL_DATA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${(value/1000).toFixed(0)}K`} />
              <Legend />
              <Bar dataKey="revenue" fill="#10B981" name="Revenue" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#EF4444" name="Expenses" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" fill="#3B82F6" name="Profit" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// All Instruments Page
const AllInstrumentsPage: React.FC = () => {
  const [instruments] = useState<Instrument[]>(SAMPLE_INSTRUMENTS);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInstruments = instruments.filter(i =>
    i.instrumentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.bankName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeInstruments = instruments.filter(i => i.status === 'active').length;
  const totalValue = instruments.reduce((sum, i) => sum + i.totalValue, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Instruments</h1>
        <p className="text-gray-600 mt-1">Manage all deposit instruments across partner banks</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Instruments" value={instruments.length} icon={FileText} color="blue" />
        <StatCard title="Active" value={activeInstruments} icon={CheckCircle} color="green" />
        <StatCard title="Suspended" value={instruments.filter(i => i.status === 'suspended').length} icon={AlertTriangle} color="amber" />
        <StatCard title="Total Value" value={`¥${(totalValue / 1000000).toFixed(0)}M`} icon={TrendingUp} color="green" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-lg font-semibold text-gray-900">All Instruments</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instrument</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Currency</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yield</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInstruments.map(inst => (
                <tr key={inst.instrumentId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{inst.instrumentId}</p>
                    <p className="text-xs text-gray-500">{inst.name}</p>
                  </td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-purple-600" /><span className="text-sm">{inst.bankName}</span></div></td>
                  <td className="px-4 py-3 text-gray-600">{inst.currency}</td>
                  <td className="px-4 py-3"><span className="font-medium text-green-600">{inst.totalYield}%</span></td>
                  <td className="px-4 py-3 font-medium">¥{(inst.totalValue / 1000000).toFixed(0)}M</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      inst.status === 'active' ? 'bg-green-100 text-green-700' :
                      inst.status === 'suspended' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>{inst.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg"><Ban className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Compliance Page
const CompliancePage: React.FC = () => {
  const [alerts] = useState<ComplianceAlert[]>(SAMPLE_ALERTS);
  const openAlerts = alerts.filter(a => a.status !== 'resolved').length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = { critical: 'bg-red-100 text-red-700', high: 'bg-orange-100 text-orange-700', medium: 'bg-amber-100 text-amber-700', low: 'bg-blue-100 text-blue-700' };
    return colors[severity] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Compliance Center</h1>
        <p className="text-gray-600 mt-1">Monitor KYC, AML, and regulatory compliance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Open Alerts" value={openAlerts} icon={AlertTriangle} color="amber" />
        <StatCard title="Critical Alerts" value={criticalAlerts} icon={Flag} color="red" />
        <StatCard title="Resolved (Month)" value={alerts.filter(a => a.status === 'resolved').length} icon={CheckCircle} color="green" />
        <StatCard title="Compliance Rate" value="96.8%" icon={Shield} color="blue" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Compliance Alerts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alert</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {alerts.map(alert => (
                <tr key={alert.alertId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{alert.alertId}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{alert.description}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {alert.tenantType === 'bank' ? <Building2 className="w-4 h-4 text-purple-600" /> : <Landmark className="w-4 h-4 text-emerald-600" />}
                      <span className="text-sm">{alert.tenantName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 uppercase text-sm">{alert.type}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>{alert.severity}</span></td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      alert.status === 'escalated' ? 'bg-purple-100 text-purple-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>{alert.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"><CheckCircle className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Risk Management Page
const RiskManagementPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Risk Management</h1>
        <p className="text-gray-600 mt-1">Monitor and manage platform-wide risk exposure</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Avg Risk Score" value="28" icon={Gauge} color="blue" subtitle="Out of 100" trend={-5} />
        <StatCard title="High Risk Tenants" value="1" icon={AlertTriangle} color="amber" />
        <StatCard title="Avg Default Rate" value="2.5%" icon={Target} color="rose" trend={-8} />
        <StatCard title="Total Exposure" value="¥420M" icon={Shield} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={RISK_DATA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="portfolioRisk" stroke="#E11D48" strokeWidth={2} name="Portfolio Risk" />
              <Line type="monotone" dataKey="defaultRate" stroke="#F59E0B" strokeWidth={2} name="Default Rate %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Risk Indicators</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-rose-50 rounded-lg"><p className="text-sm text-gray-600">VaR (95%)</p><p className="text-2xl font-bold text-rose-600">¥120M</p></div>
            <div className="text-center p-4 bg-amber-50 rounded-lg"><p className="text-sm text-gray-600">Expected Loss</p><p className="text-2xl font-bold text-amber-600">¥85M</p></div>
            <div className="text-center p-4 bg-blue-50 rounded-lg"><p className="text-sm text-gray-600">NPL Ratio</p><p className="text-2xl font-bold text-blue-600">3.2%</p></div>
            <div className="text-center p-4 bg-green-50 rounded-lg"><p className="text-sm text-gray-600">Provisioning</p><p className="text-2xl font-bold text-green-600">125%</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Analytics Dashboard Page
const AnalyticsDashboardPage: React.FC = () => {
  const totalDeposits = SAMPLE_BANKS.reduce((sum, b) => sum + b.totalDeposits, 0);
  const totalLoans = SAMPLE_BANKS.reduce((sum, b) => sum + b.loansDisbursed, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Platform-wide performance metrics and insights</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Tenants" value={SAMPLE_BANKS.length + SAMPLE_INVESTORS.length} icon={Users} color="blue" trend={8} />
        <StatCard title="Total Deposits" value={`¥${(totalDeposits / 1000000).toFixed(0)}M`} icon={TrendingUp} color="green" trend={15} />
        <StatCard title="Loans Disbursed" value={`KES ${(totalLoans / 1000000000).toFixed(1)}B`} icon={DollarSign} color="purple" trend={22} />
        <StatCard title="Platform Revenue" value="$2.45M" icon={BarChart3} color="emerald" trend={18} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={MONTHLY_PL_DATA}>
              <defs>
                <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" fill="url(#colorGrowth)" name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg"><p className="text-sm text-gray-600">Total Users</p><p className="text-2xl font-bold text-blue-600">{SAMPLE_USERS.length}</p></div>
            <div className="text-center p-4 bg-green-50 rounded-lg"><p className="text-sm text-gray-600">Avg Yield</p><p className="text-2xl font-bold text-green-600">9.5%</p></div>
            <div className="text-center p-4 bg-purple-50 rounded-lg"><p className="text-sm text-gray-600">Transactions</p><p className="text-2xl font-bold text-purple-600">{SAMPLE_TRANSACTIONS.length}</p></div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg"><p className="text-sm text-gray-600">MRR</p><p className="text-2xl font-bold text-emerald-600">$72K</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notifications Page
const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = { alert: 'bg-red-100 text-red-600', warning: 'bg-amber-100 text-amber-600', success: 'bg-green-100 text-green-600', info: 'bg-blue-100 text-blue-600' };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay updated with platform activities</p>
        </div>
        <button onClick={() => setNotifications(notifications.map(n => ({ ...n, isRead: true })))} className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200">
          Mark All as Read
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total" value={notifications.length} icon={Bell} color="blue" />
        <StatCard title="Unread" value={unreadCount} icon={Bell} color="amber" />
        <StatCard title="Alerts" value={notifications.filter(n => n.type === 'alert').length} icon={AlertTriangle} color="red" />
        <StatCard title="Read" value={notifications.filter(n => n.isRead).length} icon={CheckCircle} color="green" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="divide-y divide-gray-100">
          {notifications.map(notif => (
            <div key={notif.id} className={`p-4 hover:bg-gray-50 ${!notif.isRead ? 'bg-blue-50/50' : ''}`}>
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${getTypeColor(notif.type)}`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">{notif.title}</h4>
                    {!notif.isRead && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                  {notif.tenantName && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      {notif.tenantType === 'bank' ? <Building2 className="w-3 h-3" /> : <Landmark className="w-3 h-3" />}
                      {notif.tenantName}
                    </p>
                  )}
                </div>
                {!notif.isRead && (
                  <button onClick={() => handleMarkAsRead(notif.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg">
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Settings Page
const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'fees' | 'security' | 'notifications'>('general');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-600 mt-1">Configure platform-wide settings and preferences</p>
      </div>

      <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm">
        {[
          { id: 'general', label: 'General', icon: Globe },
          { id: 'fees', label: 'Fees & Limits', icon: DollarSign },
          { id: 'security', label: 'Security', icon: Shield },
          { id: 'notifications', label: 'Notifications', icon: Bell }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {activeTab === 'general' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">General Settings</h3>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label><input type="text" defaultValue="ForwardsFlow" className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label><input type="email" defaultValue="admin@forwardsflow.com" className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label><input type="email" defaultValue="support@forwardsflow.com" className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
          </div>
        )}
        {activeTab === 'fees' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Fees & Limits</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Platform Fee (%)</label><input type="number" defaultValue="0.15" className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Hedging Fee (%)</label><input type="number" defaultValue="0.30" className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Min Deposit (¥)</label><input type="number" defaultValue="10000000" className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Max Deposit (¥)</label><input type="number" defaultValue="500000000" className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
            </div>
          </div>
        )}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Security Settings</h3>
            <div className="flex items-center justify-between py-3"><div><p className="font-medium">Require Two-Factor Authentication</p><p className="text-sm text-gray-500">All users must enable 2FA</p></div><button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600"><span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" /></button></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (Minutes)</label><input type="number" defaultValue="30" className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Min Password Length</label><input type="number" defaultValue="12" className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
          </div>
        )}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Notification Settings</h3>
            <div className="flex items-center justify-between py-3"><div><p className="font-medium">Email Notifications</p><p className="text-sm text-gray-500">Send notifications via email</p></div><button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600"><span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" /></button></div>
            <div className="flex items-center justify-between py-3"><div><p className="font-medium">WhatsApp Notifications</p><p className="text-sm text-gray-500">Send via WhatsApp Business API</p></div><button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600"><span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" /></button></div>
            <div className="flex items-center justify-between py-3"><div><p className="font-medium">Alert on High-Value Transactions</p><p className="text-sm text-gray-500">Transactions above threshold</p></div><button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600"><span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" /></button></div>
          </div>
        )}
        <div className="flex gap-3 pt-6 mt-6 border-t border-gray-100">
          <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Reset to Defaults</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

const PlatformAdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<NavSection>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { section: 'platform', label: 'PLATFORM OVERVIEW', items: [
      { id: 'overview' as NavSection, label: 'Home/Overview', icon: Home }
    ]},
    { section: 'tenant', label: 'TENANT MANAGEMENT', items: [
      { id: 'bank-management' as NavSection, label: 'Bank Management', icon: Building2 },
      { id: 'investor-management' as NavSection, label: 'Investor Management', icon: Landmark },
      { id: 'user-management' as NavSection, label: 'User Management', icon: Users }
    ]},
    { section: 'operations', label: 'OPERATIONS', items: [
      { id: 'transaction-oversight' as NavSection, label: 'Transaction Oversight', icon: ArrowRightLeft },
      { id: 'platform-pl' as NavSection, label: 'Platform P&L', icon: TrendingUp },
      { id: 'all-instruments' as NavSection, label: 'All Instruments', icon: FileText }
    ]},
    { section: 'compliance', label: 'COMPLIANCE & RISK', items: [
      { id: 'compliance' as NavSection, label: 'Compliance', icon: Shield },
      { id: 'risk-management' as NavSection, label: 'Risk Management', icon: AlertTriangle },
      { id: 'analytics' as NavSection, label: 'Analytics Dashboard', icon: BarChart3 }
    ]},
    { section: 'system', label: 'SYSTEM', items: [
      { id: 'notifications' as NavSection, label: 'Notifications', icon: Bell },
      { id: 'settings' as NavSection, label: 'Settings', icon: Settings }
    ]}
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return <OverviewPage />;
      case 'bank-management': return <BankManagementPage />;
      case 'investor-management': return <InvestorManagementPage />;
      case 'user-management': return <UserManagementPage />;
      case 'transaction-oversight': return <TransactionOversightPage />;
      case 'platform-pl': return <PlatformPLPage />;
      case 'all-instruments': return <AllInstrumentsPage />;
      case 'compliance': return <CompliancePage />;
      case 'risk-management': return <RiskManagementPage />;
      case 'analytics': return <AnalyticsDashboardPage />;
      case 'notifications': return <NotificationsPage />;
      case 'settings': return <SettingsPage />;
      default: return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex flex-col`}>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Forwards<span className="text-blue-600">Flow</span></span>
          </div>
        </div>

        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search" className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2">
          {navItems.map(group => (
            <div key={group.section} className="mb-4">
              <p className="text-xs font-medium text-gray-400 px-3 mb-2">{group.label}</p>
              {group.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm">Help & Support</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-xl">Forwards<span className="text-blue-600">Flow</span></span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg w-64" />
              </div>
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">System Administrator</p>
                  <p className="text-xs text-gray-500">forwardsflow admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default PlatformAdminDashboard;
