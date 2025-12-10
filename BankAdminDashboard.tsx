// BankAdminDashboard.tsx - Partner Bank Administrator Dashboard
// Place in: src/components/dashboards/BankAdminDashboard.tsx

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  Wallet,
  Shield,
  Settings,
  Plus,
  Eye,
  Edit,
  Ban,
  Trash2,
  RefreshCw,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  CreditCard,
  Activity,
  FileText,
  BarChart3
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { apiService, BankMetrics, Loan } from '../../services/apiService';

// ============================================
// TYPES
// ============================================
interface User {
  odeTenantId: string;
  tenantName: string;
  name: string;
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  roleDisplay: string;
  status: 'active' | 'suspended' | 'pending';
  lastLogin?: string;
  createdAt: string;
}

interface BankAdminDashboardProps {
  user: User;
}

// ============================================
// STAT CARD COMPONENT
// ============================================
const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: number;
  subtitle?: string;
}> = ({ title, value, icon: Icon, color, trend, subtitle }) => {
  const colorClasses: Record<string, string> = {
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600'
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
// STAFF TABLE COMPONENT
// ============================================
const StaffTable: React.FC<{
  staff: StaffMember[];
  onEdit: (member: StaffMember) => void;
  onSuspend: (member: StaffMember) => void;
  onDelete: (member: StaffMember) => void;
}> = ({ staff, onEdit, onSuspend, onDelete }) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'bank_lender': return 'bg-blue-100 text-blue-700';
      case 'bank_caller': return 'bg-indigo-100 text-indigo-700';
      case 'bank_compliance': return 'bg-amber-100 text-amber-700';
      case 'bank_risk': return 'bg-rose-100 text-rose-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff Member</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
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
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  member.status === 'active' ? 'bg-green-100 text-green-700' :
                  member.status === 'suspended' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {member.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {member.lastLogin || 'Never'}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(member)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onSuspend(member)}
                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"
                    title={member.status === 'suspended' ? 'Activate' : 'Suspend'}
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(member)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================================
// MAIN BANK ADMIN DASHBOARD
// ============================================
const BankAdminDashboard: React.FC<BankAdminDashboardProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'staff' | 'operations' | 'compliance' | 'pl'>('overview');
  
  // Data state
  const [metrics, setMetrics] = useState<BankMetrics | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  
  // Mock staff data (would come from API)
  const [staff] = useState<StaffMember[]>([
    { id: '1', name: 'James Mwangi', email: 'lending@equityafrica.com', role: 'bank_lender', roleDisplay: 'Lending Officer', status: 'active', lastLogin: '2 hours ago', createdAt: '2024-01-15' },
    { id: '2', name: 'Sarah Ochieng', email: 'calling@equityafrica.com', role: 'bank_caller', roleDisplay: 'Capital Markets', status: 'active', lastLogin: '1 hour ago', createdAt: '2024-02-01' },
    { id: '3', name: 'Peter Kimani', email: 'compliance@equityafrica.com', role: 'bank_compliance', roleDisplay: 'Compliance Officer', status: 'active', lastLogin: '30 mins ago', createdAt: '2024-01-20' },
    { id: '4', name: 'Grace Wanjiku', email: 'risk@equityafrica.com', role: 'bank_risk', roleDisplay: 'Credit Risk Analyst', status: 'active', lastLogin: '4 hours ago', createdAt: '2024-03-01' }
  ]);

  // P&L data
  const [plData] = useState({
    grossRevenue: 45600000, // KES
    interestIncome: 38500000,
    fees: 7100000,
    operatingCosts: 12300000,
    netProfit: 33300000,
    margin: 73,
    mtdRevenue: 8500000,
    mtdTarget: 10000000
  });

  // Chart data
  const [revenueTrend] = useState([
    { month: 'Jul', revenue: 28, costs: 8, profit: 20 },
    { month: 'Aug', revenue: 32, costs: 9, profit: 23 },
    { month: 'Sep', revenue: 36, costs: 10, profit: 26 },
    { month: 'Oct', revenue: 40, costs: 11, profit: 29 },
    { month: 'Nov', revenue: 42, costs: 11, profit: 31 },
    { month: 'Dec', revenue: 45, costs: 12, profit: 33 }
  ]);

  const loadData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [metricsData, loansData] = await Promise.all([
        apiService.getBankMetrics(user.tenantId),
        apiService.getLoans(user.tenantId)
      ]);

      setMetrics(metricsData);
      setLoans(loansData);
    } catch (error) {
      console.error('Error loading bank data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user.tenantId]);

  const handleEditStaff = (member: StaffMember) => {
    console.log('Edit staff:', member);
  };

  const handleSuspendStaff = (member: StaffMember) => {
    console.log('Suspend staff:', member);
  };

  const handleDeleteStaff = (member: StaffMember) => {
    console.log('Delete staff:', member);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading bank data...</p>
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
            <h1 className="text-2xl font-bold">{user.tenantName}</h1>
            <p className="text-purple-100 mt-1">
              {staff.length} staff members • Full administrative access
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
          { id: 'operations', label: 'Operations', icon: Wallet },
          { id: 'compliance', label: 'Compliance', icon: Shield },
          { id: 'pl', label: 'P&L Account', icon: BarChart3 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
        
        <div className="flex-1" />
        
        <button
          onClick={() => loadData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Overview Tab */}
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
              value={`KES ${((metrics?.loanBookValue || 0) / 1000000).toFixed(1)}M`}
              icon={Wallet}
              color="blue"
              trend={15}
            />
            <StatCard
              title="Total Deposits"
              value={`¥${((metrics?.totalDepositValue || 0) / 1000000).toFixed(0)}M`}
              icon={TrendingUp}
              color="green"
              trend={8}
            />
            <StatCard
              title="Default Rate"
              value={`${metrics?.defaultRate.toFixed(2)}%`}
              icon={AlertTriangle}
              color="amber"
            />
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

            {/* Operations Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Operations Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Active Loans</span>
                  </div>
                  <span className="font-bold text-blue-600">{metrics?.activeLoanCount}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Active Deposits</span>
                  </div>
                  <span className="font-bold text-green-600">{metrics?.activeDeposits}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span className="text-gray-700">Pending Applications</span>
                  </div>
                  <span className="font-bold text-amber-600">{metrics?.pendingApplications}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">Portfolio Yield</span>
                  </div>
                  <span className="font-bold text-purple-600">{metrics?.portfolioYield}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Staff Management Tab */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Staff Members</h3>
                  <p className="text-sm text-gray-500 mt-1">Manage your bank staff and their access levels</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  <Plus className="w-4 h-4" />
                  Add Staff
                </button>
              </div>
            </div>
            <StaffTable
              staff={staff}
              onEdit={handleEditStaff}
              onSuspend={handleSuspendStaff}
              onDelete={handleDeleteStaff}
            />
          </div>

          {/* Role Permissions Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Roles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { role: 'Lending Officer', desc: 'Loan approval, disbursement, portfolio management', color: 'blue' },
                { role: 'Capital Markets', desc: 'Deposit calls, investor negotiations, settlements', color: 'indigo' },
                { role: 'Compliance Officer', desc: 'AML monitoring, KYC verification, regulatory reports', color: 'amber' },
                { role: 'Credit Risk Analyst', desc: 'Risk assessment, credit scoring, default analysis', color: 'rose' }
              ].map(item => (
                <div key={item.role} className={`p-4 rounded-lg bg-${item.color}-50 border border-${item.color}-200`}>
                  <p className="font-medium text-gray-900">{item.role}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Operations Tab */}
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
                  <span className="font-medium">KES {((metrics?.disbursementsToday || 0) / 1000000).toFixed(2)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Collected Today</span>
                  <span className="font-medium">KES {((metrics?.repaymentsToday || 0) / 1000000).toFixed(2)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Queue</span>
                  <span className="font-medium">{metrics?.pendingApplications} applications</span>
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
                  <span className="font-medium">{metrics?.activeDeposits} instruments</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Value</span>
                  <span className="font-medium">¥{((metrics?.totalDepositValue || 0) / 1000000).toFixed(0)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Settlements</span>
                  <span className="font-medium">2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Log */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
            <p className="text-gray-500">Full transaction database accessible for compliance review.</p>
          </div>
        </div>
      )}

      {/* Compliance Tab */}
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
            <p className="text-gray-600">
              Full access to transaction databases for AML, KYC, and financial reporting compliance purposes.
            </p>
          </div>
        </div>
      )}

      {/* P&L Tab */}
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
              <div 
                className="h-full bg-purple-600 rounded-full transition-all"
                style={{ width: `${(plData.mtdRevenue / plData.mtdTarget) * 100}%` }}
              />
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
    </div>
  );
};

export default BankAdminDashboard;
