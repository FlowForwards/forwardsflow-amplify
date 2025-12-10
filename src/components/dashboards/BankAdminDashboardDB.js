/**
 * Bank Admin Dashboard - Connected to DynamoDB
 * Full access to bank operations, staff management, and analytics
 */

import React, { useState, useEffect } from 'react';
import {
  Building2, Users, TrendingUp, DollarSign, Smartphone, Phone,
  ChevronRight, RefreshCw, Plus, MoreVertical, Eye, Ban, CheckCircle,
  Search, Filter, Download, BarChart3, Activity, Bell, Settings,
  UserPlus, Shield, AlertTriangle, FileText, CreditCard,
  ArrowUpRight, ArrowDownRight, Calendar, Clock,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { 
  useData, 
  useBankMetrics, 
  useCapitalCalls, 
  useMobileLoans,
  useNotifications 
} from '../../context/DataContext';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

// Stat Card Component
const StatCard = ({ title, value, change, changeType, icon: Icon, color, subtitle, onClick }) => (
  <div 
    className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all ${onClick ? 'cursor-pointer' : ''}`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        {change !== undefined && (
          <div className={`flex items-center mt-2 ${changeType === 'positive' ? 'text-green-600' : 'text-red-500'}`}>
            {changeType === 'positive' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            <span className="text-sm font-medium ml-1">{change}%</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

// Staff Member Row
const StaffRow = ({ staff, onView, onSuspend }) => {
  const roleColors = {
    BANK_ADMIN: 'bg-green-100 text-green-800',
    BANK_LENDER: 'bg-blue-100 text-blue-800',
    BANK_CALLER: 'bg-purple-100 text-purple-800',
    BANK_COMPLIANCE: 'bg-orange-100 text-orange-800',
    BANK_RISK: 'bg-red-100 text-red-800',
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {staff.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{staff.name}</div>
            <div className="text-sm text-gray-500">{staff.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[staff.role] || 'bg-gray-100 text-gray-800'}`}>
          {staff.role?.replace('BANK_', '')}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {staff.jobRole || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
          staff.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {staff.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {staff.lastLogin ? new Date(staff.lastLogin).toLocaleDateString() : 'Never'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button onClick={() => onView(staff)} className="text-blue-600 hover:text-blue-900 mr-4">
          View
        </button>
        <button onClick={() => onSuspend(staff)} className="text-red-600 hover:text-red-900">
          {staff.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
        </button>
      </td>
    </tr>
  );
};

export default function BankAdminDashboard() {
  const { user, tenant } = useAuth();
  const { 
    listUsersByOrganization, 
    createUser, 
    suspendUser, 
    activateUser,
    createCapitalCall,
    publishCapitalCall,
    subscribeToInvestments,
  } = useData();

  // Data hooks
  const { metrics, loading: metricsLoading } = useBankMetrics(user?.orgId);
  const { calls } = useCapitalCalls(user?.orgId);
  const { loans } = useMobileLoans(user?.orgId);
  const { notifications, unreadCount } = useNotifications(user?.userId);

  // Local state
  const [activeTab, setActiveTab] = useState('overview');
  const [staff, setStaff] = useState([]);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load staff
  useEffect(() => {
    if (user?.orgId) {
      loadStaff();
    }
  }, [user?.orgId]);

  // Subscribe to incoming investments
  useEffect(() => {
    if (!user?.orgId) return;
    
    const subscription = subscribeToInvestments(user.orgId, (newInvestment) => {
      console.log('New investment received:', newInvestment);
      // Show toast notification
    });

    return () => subscription?.unsubscribe?.();
  }, [user?.orgId, subscribeToInvestments]);

  const loadStaff = async () => {
    try {
      const result = await listUsersByOrganization(user.orgId);
      setStaff(result?.items || []);
    } catch (error) {
      console.error('Error loading staff:', error);
    }
  };

  const handleAddStaff = async (staffData) => {
    try {
      await createUser({
        ...staffData,
        orgId: user.orgId,
      });
      await loadStaff();
      setShowAddStaffModal(false);
    } catch (error) {
      alert('Error creating user: ' + error.message);
    }
  };

  const handleSuspendStaff = async (staffMember) => {
    const action = staffMember.status === 'ACTIVE' ? 'suspend' : 'activate';
    if (window.confirm(`${action} ${staffMember.name}?`)) {
      try {
        if (staffMember.status === 'ACTIVE') {
          await suspendUser(staffMember.userId, 'Admin action');
        } else {
          await activateUser(staffMember.userId);
        }
        await loadStaff();
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  const handleCreateCall = async (callData) => {
    try {
      const newCall = await createCapitalCall({
        bankOrgId: user.orgId,
        ...callData,
      });
      setShowCallModal(false);
      return newCall;
    } catch (error) {
      alert('Error creating capital call: ' + error.message);
    }
  };

  const formatCurrency = (value, compact = true) => {
    if (compact && value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (compact && value >= 1000) {
      return `KES ${(value / 1000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Chart data
  const loanStatusData = metrics?.loanStatusDistribution || [
    { status: 'Current', count: 720, pct: 85 },
    { status: 'Overdue', count: 85, pct: 10 },
    { status: 'Defaulted', count: 42, pct: 5 },
  ];

  const weeklyDisbursements = metrics?.weeklyDisbursements || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <span className="text-xl font-bold text-gray-900">{user?.orgName || 'Bank'}</span>
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                  ADMIN
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <div className="flex items-center border-l border-gray-200 pl-4">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-green-600">{user?.name?.charAt(0)}</span>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'staff', label: 'Staff Management', icon: Users },
              { id: 'capital', label: 'Capital Calls', icon: Phone },
              { id: 'lending', label: 'Mobile Lending', icon: Smartphone },
              { id: 'compliance', label: 'Compliance', icon: Shield },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Capital"
            value={formatCurrency(metrics?.totalCapital || 2500000)}
            change={12.5}
            changeType="positive"
            icon={DollarSign}
            color="bg-blue-500"
          />
          <StatCard
            title="Active Loans"
            value={(metrics?.activeLoans || 847).toLocaleString()}
            subtitle={`${formatCurrency(metrics?.loanVolume || 12500000)} volume`}
            icon={Smartphone}
            color="bg-green-500"
          />
          <StatCard
            title="Monthly Yield"
            value={`${metrics?.monthlyYield || 32.4}%`}
            change={2.1}
            changeType="positive"
            icon={TrendingUp}
            color="bg-purple-500"
          />
          <StatCard
            title="NPL Rate"
            value={`${metrics?.nplRate || 4.2}%`}
            subtitle="Non-performing loans"
            icon={AlertTriangle}
            color="bg-orange-500"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Disbursements Today"
            value={metrics?.disbursementsToday || 45}
            icon={ArrowUpRight}
            color="bg-emerald-500"
          />
          <StatCard
            title="Collections Today"
            value={metrics?.collectionsToday || 78}
            icon={ArrowDownRight}
            color="bg-cyan-500"
          />
          <StatCard
            title="Avg Loan Size"
            value={`KES ${((metrics?.avgLoanSize || 15000) / 1000).toFixed(1)}K`}
            icon={CreditCard}
            color="bg-indigo-500"
          />
          <StatCard
            title="Active Staff"
            value={staff.filter(s => s.status === 'ACTIVE').length}
            subtitle={`${staff.length} total`}
            icon={Users}
            color="bg-pink-500"
            onClick={() => setActiveTab('staff')}
          />
        </div>

        {/* Content based on tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Disbursements Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Disbursements</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyDisbursements}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                    <Tooltip formatter={(value) => [`KES ${value.toLocaleString()}`, 'Disbursed']} />
                    <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Loan Portfolio Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Portfolio Status</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={loanStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="status"
                      label={({ status, pct }) => `${status}: ${pct}%`}
                    >
                      {loanStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Capital Calls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Capital Calls</h3>
                <button
                  onClick={() => setShowCallModal(true)}
                  className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-1" /> New Call
                </button>
              </div>
              <div className="space-y-3">
                {calls.slice(0, 4).map(call => (
                  <div key={call.callId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{call.txnRef}</p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(call.amount)} • {call.interestRate}% APR
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      call.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                      call.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {call.status}
                    </span>
                  </div>
                ))}
                {calls.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No capital calls yet</p>
                )}
              </div>
            </div>

            {/* Recent Loans */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Loans</h3>
                <button
                  onClick={() => setActiveTab('lending')}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-3">
                {loans.slice(0, 4).map(loan => (
                  <div key={loan.loanId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{loan.borrowerName}</p>
                      <p className="text-xs text-gray-500">
                        KES {loan.amount?.toLocaleString()} • {loan.borrowerPhone}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      loan.status === 'CURRENT' || loan.status === 'DISBURSED' ? 'bg-green-100 text-green-800' :
                      loan.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {loan.status}
                    </span>
                  </div>
                ))}
                {loans.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No loans yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Staff Management Tab */}
        {activeTab === 'staff' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Staff Management</h3>
                <button
                  onClick={() => setShowAddStaffModal(true)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" /> Add Staff Member
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {staff.map(member => (
                    <StaffRow
                      key={member.userId}
                      staff={member}
                      onView={(s) => console.log('View', s)}
                      onSuspend={handleSuspendStaff}
                    />
                  ))}
                  {staff.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <p>No staff members yet</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Capital Calls Tab */}
        {activeTab === 'capital' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Capital Calls</h3>
                <button
                  onClick={() => setShowCallModal(true)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" /> Create Capital Call
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {calls.map(call => (
                  <div key={call.callId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{call.txnRef}</h4>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(call.amount)} • {call.interestRate}% APR • {call.maturityMonths}mo
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          call.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                          call.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                          call.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {call.status}
                        </span>
                        {call.status === 'DRAFT' && (
                          <button
                            onClick={() => publishCapitalCall(call.callId)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            Publish
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center space-x-6 text-sm text-gray-500">
                      <span>Subscribed: {call.subscribedPct || 0}%</span>
                      <span>Created: {new Date(call.createdAt).toLocaleDateString()}</span>
                      {call.intendedUse && <span>Use: {call.intendedUse}</span>}
                    </div>
                  </div>
                ))}
                {calls.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Phone className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p>No capital calls yet</p>
                    <button
                      onClick={() => setShowCallModal(true)}
                      className="mt-4 text-green-600 hover:text-green-700"
                    >
                      Create your first capital call →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Lending Tab */}
        {activeTab === 'lending' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Mobile Loans</h3>
                <div className="flex items-center space-x-3">
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option value="">All Status</option>
                    <option value="CURRENT">Current</option>
                    <option value="OVERDUE">Overdue</option>
                    <option value="DEFAULTED">Defaulted</option>
                  </select>
                  <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <Download className="h-4 w-4 mr-2" /> Export
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrower</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Outstanding</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loans.map(loan => (
                    <tr key={loan.loanId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{loan.borrowerName}</div>
                          <div className="text-sm text-gray-500">{loan.borrowerPhone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        KES {loan.amount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          loan.status === 'CURRENT' || loan.status === 'DISBURSED' ? 'bg-green-100 text-green-800' :
                          loan.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                          loan.status === 'DEFAULTED' ? 'bg-gray-800 text-white' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {loan.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        KES {loan.amountOutstanding?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <AddStaffModal
          onClose={() => setShowAddStaffModal(false)}
          onSubmit={handleAddStaff}
        />
      )}

      {/* Create Capital Call Modal */}
      {showCallModal && (
        <CreateCallModal
          onClose={() => setShowCallModal(false)}
          onSubmit={handleCreateCall}
        />
      )}
    </div>
  );
}

// Add Staff Modal Component
function AddStaffModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'BANK_LENDER',
    jobRole: '',
    phone: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-semibold mb-4">Add Staff Member</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="BANK_LENDER">Lending Officer</option>
              <option value="BANK_CALLER">Capital Markets Officer</option>
              <option value="BANK_COMPLIANCE">Compliance Officer</option>
              <option value="BANK_RISK">Credit Risk Analyst</option>
              <option value="BANK_ADMIN">Bank Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              type="text"
              value={formData.jobRole}
              onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Create Capital Call Modal
function CreateCallModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    amount: 1000000,
    currency: 'USD',
    targetCurrency: 'KES',
    maturityMonths: 12,
    interestRate: 15,
    fxSpread: 1,
    hedgingFee: 2,
    currentFxRate: 153.5,
    intendedUse: 'Mobile Lending Deployment',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Create Capital Call</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maturity (Months)</label>
              <select
                value={formData.maturityMonths}
                onChange={(e) => setFormData({ ...formData, maturityMonths: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
                <option value={12}>12 Months</option>
                <option value={24}>24 Months</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: parseFloat(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current FX Rate</label>
              <input
                type="number"
                step="0.01"
                value={formData.currentFxRate}
                onChange={(e) => setFormData({ ...formData, currentFxRate: parseFloat(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Intended Use</label>
            <input
              type="text"
              value={formData.intendedUse}
              onChange={(e) => setFormData({ ...formData, intendedUse: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700">Projected Investor Yield</p>
            <p className="text-2xl font-bold text-green-600">
              {(formData.interestRate - formData.fxSpread - formData.hedgingFee).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">After FX spread and hedging fees</p>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Create Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
