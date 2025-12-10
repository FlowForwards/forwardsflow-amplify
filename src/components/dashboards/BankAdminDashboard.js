import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign, Phone, TrendingUp, BarChart3, Plus, RefreshCw, CheckCircle, Clock, ArrowUpRight,
  Users, Settings, Smartphone, Shield, CreditCard, AlertTriangle, Eye, ChevronRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { db } from '../../services/DatabaseService';
import { useAuth } from '../../context/AuthContext';

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, trend, subValue, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <ArrowUpRight className="w-4 h-4" />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
        {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
      </div>
    </div>
  );
};

// Quick Action Card
const QuickActionCard = ({ icon: Icon, label, description, to, color }) => (
  <Link to={to} className={`block p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all ${color}`}>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-white/80 rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{label}</h4>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </div>
  </Link>
);

// Staff Card
const StaffCard = ({ staff }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
        <span className="text-sm font-medium text-primary-600">
          {staff.name.split(' ').map(n => n[0]).join('')}
        </span>
      </div>
      <div>
        <p className="font-medium text-gray-900">{staff.name}</p>
        <p className="text-xs text-gray-500">{staff.role} • {staff.email}</p>
      </div>
    </div>
    <button className="text-sm text-primary-600 hover:text-primary-700">Manage</button>
  </div>
);

const BankAdminDashboard = () => {
  const { user, tenant } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await db.getDashboardData(user.role, user.tenantId);
        setData(dashboardData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const loans = data?.loans || [];
  const capitalCalls = data?.capitalCalls || [];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  const stats = [
    { icon: DollarSign, label: 'Total Capital', value: `$${((metrics.totalCapital || 0) / 1000000).toFixed(1)}M`, subValue: `${metrics.deploymentRate || 0}% deployed`, color: 'blue' },
    { icon: Phone, label: 'Active Mobile Loans', value: (metrics.activeLoans || 0).toLocaleString(), trend: 8.5, color: 'green' },
    { icon: TrendingUp, label: 'Loan Book Value', value: `KES ${((metrics.loanBookValue || 0) / 1000000).toFixed(1)}M`, color: 'purple' },
    { icon: BarChart3, label: 'Monthly Yield', value: `${metrics.monthlyYield || 0}%`, subValue: `NPL: ${metrics.nplRate || 0}%`, color: 'yellow' },
  ];

  const quickActions = [
    { icon: Plus, label: 'Create Capital Call', description: 'Raise new investor capital', to: '/bank/calls/create', color: 'bg-green-50' },
    { icon: Smartphone, label: 'Mobile Lending', description: 'Manage loan operations', to: '/bank/lending', color: 'bg-blue-50' },
    { icon: Users, label: 'Manage Staff', description: 'Add or edit bank users', to: '/bank/admin/users', color: 'bg-purple-50' },
    { icon: Shield, label: 'Compliance', description: 'AML/KYC monitoring', to: '/bank/compliance', color: 'bg-orange-50' },
  ];

  // Mock staff data
  const staffMembers = [
    { name: 'Grace Mwangi', role: 'Lending Officer', email: 'lending@equityafrica.com' },
    { name: 'James Oduor', role: 'Capital Markets', email: 'calling@equityafrica.com' },
    { name: 'Faith Wambui', role: 'Compliance', email: 'compliance@equityafrica.com' },
    { name: 'David Kimani', role: 'Credit Risk', email: 'risk@equityafrica.com' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{tenant?.name || 'Bank'} Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name?.split(' ')[0]}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="btn-primary !w-auto flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => <StatCard key={idx} {...stat} />)}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, idx) => <QuickActionCard key={idx} {...action} />)}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Disbursements & Collections */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Weekly Disbursements vs Collections</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={metrics.weeklyDisbursements || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `KES ${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v) => [`KES ${v.toLocaleString()}`, '']} />
                <Bar dataKey="amount" name="Disbursed" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Loan Portfolio Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Loan Portfolio Status</h3>
              <div className="flex justify-center mb-4">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie data={metrics.loanStatusDistribution || []} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="count">
                      {(metrics.loanStatusDistribution || []).map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {(metrics.loanStatusDistribution || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                      <span className="text-sm text-gray-600">{item.status}</span>
                    </div>
                    <span className="text-sm font-medium">{item.count} ({item.pct}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Today's Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Disbursements</span>
                  </div>
                  <span className="text-lg font-bold text-green-700">{metrics.disbursementsToday || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Collections</span>
                  </div>
                  <span className="text-lg font-bold text-blue-700">{metrics.collectionsToday || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Pending Review</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-700">{metrics.pendingApplications || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">Avg Loan Size</span>
                  </div>
                  <span className="text-lg font-bold text-purple-700">KES {(metrics.avgLoanSize || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Staff Management */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Bank Staff</h3>
              <Link to="/bank/admin/users" className="text-sm text-primary-600 hover:text-primary-700">Manage</Link>
            </div>
            <div className="space-y-3">
              {staffMembers.map((staff, idx) => (
                <StaffCard key={idx} staff={staff} />
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100">
              + Add Staff Member
            </button>
          </div>

          {/* Capital Calls */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Capital Calls</h3>
              <Link to="/bank/calls" className="text-sm text-primary-600 hover:text-primary-700">View all</Link>
            </div>
            <div className="space-y-3">
              {capitalCalls.slice(0, 3).map((call, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{call.txnRef}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      call.status === 'published' ? 'bg-green-100 text-green-700' :
                      call.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {call.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">${(call.amount / 1000000).toFixed(1)}M @ {call.interestRate}%</p>
                  <p className="text-xs text-gray-400">{call.maturityMonths} months</p>
                </div>
              ))}
            </div>
            <Link to="/bank/calls/create" className="block w-full mt-4 py-2 text-sm font-medium text-center text-white bg-primary-600 rounded-lg hover:bg-primary-700">
              Create Capital Call
            </Link>
          </div>

          {/* Compliance Summary */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Compliance Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">KYC Completion</span>
                <span className="text-sm font-medium text-green-600">{metrics.complianceMetrics?.kycCompletionRate || 0}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">AML Alerts</span>
                <span className="text-sm font-medium text-yellow-600">{metrics.complianceMetrics?.amlAlertsThisMonth || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Regulatory Status</span>
                <span className={`text-sm font-medium ${metrics.complianceMetrics?.regulatoryFilingsUpToDate ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.complianceMetrics?.regulatoryFilingsUpToDate ? 'Up to Date' : 'Action Required'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Loans */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Recent Loan Applications</h3>
          <Link to="/bank/lending" className="text-sm text-primary-600 hover:text-primary-700">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrower</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Term</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.slice(0, 5).map((loan) => (
                <tr key={loan.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{loan.borrowerName}</p>
                      <p className="text-xs text-gray-500">{loan.borrowerPhone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">KES {loan.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{loan.term} days</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{loan.interestRate}%</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      loan.status === 'current' ? 'bg-green-100 text-green-700' :
                      loan.status === 'overdue' ? 'bg-red-100 text-red-700' :
                      loan.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-sm text-primary-600 hover:text-primary-700">View</button>
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

export default BankAdminDashboard;
