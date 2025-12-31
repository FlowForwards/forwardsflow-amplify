// BankLenderDashboard.js - Lending Officer Dashboard
import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Phone,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Check,
  X,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CreditCard
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
  Cell
} from 'recharts';
import { db } from '../../services/DatabaseService';
import { useAuth } from '../../context/AuthContext';
import AmazonQChat from '../shared/AmazonQChat';

// ============================================
// STAT CARD COMPONENT
// ============================================
const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    amber: 'bg-amber-100 text-amber-600',
    purple: 'bg-purple-100 text-purple-600'
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
              <span>{Math.abs(trend)}%</span>
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
// APPLICATION CARD COMPONENT
// ============================================
const ApplicationCard = ({ application, onApprove, onReject, onView }) => {
  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'high': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Phone className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{application.borrowerName}</p>
            <p className="text-sm text-gray-500">{application.phoneNumber}</p>
          </div>
        </div>
        <span className="text-xs text-gray-400">{getTimeAgo(application.createdAt)}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-xs text-gray-500">Amount Requested</p>
          <p className="font-semibold text-gray-900">KES {application.amountRequested.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Duration</p>
          <p className="font-semibold text-gray-900">{application.durationDays} days</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Credit Score</p>
          <p className="font-semibold text-gray-900">{application.creditScore}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Risk Rating</p>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(application.riskRating)}`}>
            {application.riskRating.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          application.kycStatus === 'verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }`}>
          KYC: {application.kycStatus}
        </span>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={() => onApprove(application.applicationId)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Check className="w-4 h-4" />
          Approve
        </button>
        <button
          onClick={() => onReject(application.applicationId)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <X className="w-4 h-4" />
          Reject
        </button>
        <button
          onClick={() => onView(application)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ============================================
// LOAN ROW COMPONENT
// ============================================
const LoanRow = ({ loan, onView }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-700';
      case 'disbursed': return 'bg-blue-100 text-blue-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'defaulted': return 'bg-red-200 text-red-800';
      case 'paid_off': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <tr className="hover:bg-gray-50">
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
      <td className="px-4 py-3 text-gray-600">{loan.maturityDate}</td>
      <td className="px-4 py-3">
        <button
          onClick={() => onView(loan)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
        >
          <Eye className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};

// ============================================
// MAIN LENDER DASHBOARD
// ============================================
const BankLenderDashboard = () => {
  const { user, tenant } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('queue');
  
  // Data state
  const [metrics, setMetrics] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loans, setLoans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Chart data
  const [disbursementTrend] = useState([
    { day: 'Mon', disbursed: 1.2, collected: 0.9 },
    { day: 'Tue', disbursed: 1.8, collected: 1.1 },
    { day: 'Wed', disbursed: 1.5, collected: 1.3 },
    { day: 'Thu', disbursed: 2.1, collected: 1.0 },
    { day: 'Fri', disbursed: 1.9, collected: 1.5 },
    { day: 'Sat', disbursed: 0.8, collected: 0.7 },
    { day: 'Sun', disbursed: 0.4, collected: 0.3 }
  ]);

  const loadData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const dashboardData = await db.getDashboardData(user.role, user.tenantId);
      setMetrics(dashboardData?.metrics || {});
      setApplications(dashboardData?.applications || []);
      setLoans(dashboardData?.loans || []);
    } catch (error) {
      console.error('Error loading lending data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user.tenantId]);

  const handleApprove = async (applicationId) => {
    console.log('Approve application:', applicationId);
    // await db.updateApplicationStatus(applicationId, 'approved');
    loadData(true);
  };

  const handleReject = async (applicationId) => {
    console.log('Reject application:', applicationId);
    // await db.updateApplicationStatus(applicationId, 'rejected');
    loadData(true);
  };

  const handleViewApplication = (app) => {
    console.log('View application:', app);
  };

  const handleViewLoan = (loan) => {
    console.log('View loan:', loan);
  };

  const pendingApps = applications.filter(a => a.status === 'pending');
  const activeLoans = loans.filter(l => ['disbursed', 'current', 'overdue'].includes(l.status));
  const overdueLoans = loans.filter(l => l.status === 'overdue' || l.status === 'defaulted');

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.phoneNumber.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading lending data...</p>
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
            <h1 className="text-2xl font-bold">Lending Dashboard</h1>
            <p className="text-blue-100 mt-1">
              {tenant?.name || 'Bank'} • {pendingApps.length} applications pending review
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-200">Loan Book Value</p>
            <p className="text-3xl font-bold">KES {((metrics?.loanBookValue || 0) / 1000000).toFixed(1)}M</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard
          title="Pending Applications"
          value={pendingApps.length}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Active Loans"
          value={activeLoans.length}
          icon={CreditCard}
          color="blue"
        />
        <StatCard
          title="Disbursed Today"
          value={`KES ${((metrics?.disbursementsToday || 0) / 1000000).toFixed(1)}M`}
          icon={TrendingUp}
          color="green"
          trend={12}
        />
        <StatCard
          title="Collected Today"
          value={`KES ${((metrics?.repaymentsToday || 0) / 1000000).toFixed(1)}M`}
          icon={DollarSign}
          color="purple"
          trend={8}
        />
        <StatCard
          title="Overdue Loans"
          value={overdueLoans.length}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 shadow-sm">
        {[
          { id: 'queue', label: 'Application Queue', icon: Clock, count: pendingApps.length },
          { id: 'active', label: 'Active Loans', icon: CreditCard, count: activeLoans.length },
          { id: 'collections', label: 'Collections', icon: AlertTriangle, count: overdueLoans.length },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count !== undefined && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200'
              }`}>
                {tab.count}
              </span>
            )}
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

      {/* Application Queue Tab */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or phone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>

          {pendingApps.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">All caught up!</h3>
              <p className="text-gray-600 mt-2">No pending loan applications to review.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingApps.map(app => (
                <ApplicationCard
                  key={app.applicationId}
                  application={app}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onView={handleViewApplication}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Active Loans Tab */}
      {activeTab === 'active' && (
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maturity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLoans.map(loan => (
                  <LoanRow key={loan.loanId} loan={loan} onView={handleViewLoan} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Collections Tab */}
      {activeTab === 'collections' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-red-100">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Overdue (1-30 days)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overdueLoans.filter(l => l.daysOverdue <= 30).length}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                KES {overdueLoans.filter(l => l.daysOverdue <= 30)
                  .reduce((sum, l) => sum + l.outstandingBalance, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-red-100">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Overdue (31-90 days)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overdueLoans.filter(l => l.daysOverdue > 30 && l.daysOverdue <= 90).length}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Escalation required</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-gray-100">
                  <DollarSign className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Recovery Rate</p>
                  <p className="text-2xl font-bold text-gray-900">78%</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Last 30 days</p>
            </div>
          </div>

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
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Contact</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {overdueLoans.map(loan => (
                      <tr key={loan.loanId} className="hover:bg-gray-50">
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
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            +{loan.daysOverdue} days
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">2 days ago</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Send reminder">
                              <MessageSquare className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Call borrower">
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

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Disbursement vs Collection Trend */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Disbursement vs Collection</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={disbursementTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => `KES ${value}M`} />
                  <Bar dataKey="disbursed" fill="#3B82F6" name="Disbursed" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="collected" fill="#10B981" name="Collected" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Portfolio Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio by Status</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Current', value: loans.filter(l => l.status === 'current').length, color: '#10B981' },
                      { name: 'Disbursed', value: loans.filter(l => l.status === 'disbursed').length, color: '#3B82F6' },
                      { name: 'Overdue', value: loans.filter(l => l.status === 'overdue').length, color: '#F59E0B' },
                      { name: 'Defaulted', value: loans.filter(l => l.status === 'defaulted').length, color: '#EF4444' },
                      { name: 'Paid Off', value: loans.filter(l => l.status === 'paid_off').length, color: '#6B7280' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {[
                      { color: '#10B981' },
                      { color: '#3B82F6' },
                      { color: '#F59E0B' },
                      { color: '#EF4444' },
                      { color: '#6B7280' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Portfolio Yield</p>
                <p className="text-2xl font-bold text-blue-600">{metrics?.portfolioYield}%</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Default Rate</p>
                <p className="text-2xl font-bold text-red-600">{metrics?.defaultRate?.toFixed(2)}%</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Collection Rate</p>
                <p className="text-2xl font-bold text-green-600">94.2%</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Avg Loan Size</p>
                <p className="text-2xl font-bold text-purple-600">KES 45K</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Assistant */}
      <AmazonQChat userRole="bank_lender" userName={user?.name || 'User'} />
    </div>
  );
};

export default BankLenderDashboard;
