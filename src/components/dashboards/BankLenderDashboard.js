import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone, TrendingUp, CheckCircle, Clock, ArrowUpRight, ArrowDownRight,
  DollarSign, Users, AlertTriangle, Search, Filter, RefreshCw, Send,
  MessageSquare, CreditCard, Target, Zap, BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { db } from '../../services/DatabaseService';
import { useAuth } from '../../context/AuthContext';

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, trend, subValue, color = 'blue', onClick }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div 
      className={`bg-white rounded-xl border border-gray-100 p-5 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
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

// Loan Application Card
const LoanApplicationCard = ({ loan, onApprove, onReject, onReview }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'paid': return 'bg-blue-100 text-blue-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getCreditScoreColor = (score) => {
    if (score >= 700) return 'text-green-600';
    if (score >= 600) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <Phone className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{loan.borrowerName}</h4>
            <p className="text-xs text-gray-500">{loan.borrowerPhone}</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(loan.status)}`}>
          {loan.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Amount</p>
          <p className="font-semibold text-gray-900">KES {loan.amount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Term</p>
          <p className="font-semibold text-gray-900">{loan.term} days</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Credit Score</p>
          <p className={`font-semibold ${getCreditScoreColor(loan.creditScore)}`}>{loan.creditScore}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Due: {new Date(loan.dueDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          {loan.status === 'pending' && (
            <>
              <button onClick={() => onReject(loan)} className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
                Reject
              </button>
              <button onClick={() => onApprove(loan)} className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">
                Approve
              </button>
            </>
          )}
          <button onClick={() => onReview(loan)} className="px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

const BankLenderDashboard = () => {
  const { user, tenant } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLoan, setSelectedLoan] = useState(null);

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

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         loan.borrowerPhone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  const stats = [
    { icon: Phone, label: 'Active Loans', value: (metrics.activeLoans || 0).toString(), trend: 8.5, color: 'green' },
    { icon: DollarSign, label: 'Loan Book', value: `KES ${((metrics.loanBookValue || 0) / 1000000).toFixed(1)}M`, color: 'blue' },
    { icon: TrendingUp, label: 'Monthly Yield', value: `${metrics.monthlyYield || 0}%`, color: 'purple' },
    { icon: AlertTriangle, label: 'NPL Rate', value: `${metrics.nplRate || 0}%`, color: metrics.nplRate > 5 ? 'red' : 'yellow' },
    { icon: Zap, label: 'Disbursements Today', value: (metrics.disbursementsToday || 0).toString(), color: 'green' },
    { icon: CheckCircle, label: 'Collections Today', value: (metrics.collectionsToday || 0).toString(), color: 'blue' },
  ];

  const handleApprove = async (loan) => {
    console.log('Approving loan:', loan.id);
    // In production, this would call db.updateLoan
  };

  const handleReject = async (loan) => {
    console.log('Rejecting loan:', loan.id);
  };

  const handleReview = (loan) => {
    setSelectedLoan(loan);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mobile Lending Operations</h1>
          <p className="text-gray-500 mt-1">{tenant?.name || 'Bank'} • Lending Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Sync
          </button>
          <button className="btn-primary !w-auto flex items-center gap-2">
            <Send className="w-4 h-4" />
            Batch Disburse
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, idx) => <StatCard key={idx} {...stat} />)}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts & Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Disbursements Chart */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Weekly Disbursements</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={metrics.weeklyDisbursements || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v) => [`KES ${v.toLocaleString()}`, 'Disbursed']} />
                <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Loan Portfolio & Credit Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Portfolio Status */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Portfolio Status</h3>
              <div className="flex justify-center mb-4">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie data={metrics.loanStatusDistribution || []} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="count">
                      {(metrics.loanStatusDistribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
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

            {/* Credit Score Distribution */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Credit Score Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={metrics.creditScoreDistribution || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis dataKey="range" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} width={60} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Actions & Pending */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Batch Approve</p>
                  <p className="text-xs text-gray-500">Approve all eligible applications</p>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Send Reminders</p>
                  <p className="text-xs text-gray-500">WhatsApp payment reminders</p>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Auto-Approval Rules</p>
                  <p className="text-xs text-gray-500">Configure approval criteria</p>
                </div>
              </button>
            </div>
          </div>

          {/* Pending Applications */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Pending Review</h3>
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                {metrics.pendingApplications || 0}
              </span>
            </div>
            <div className="space-y-3">
              {filteredLoans.filter(l => l.status === 'pending' || l.status === 'current').slice(0, 3).map(loan => (
                <div key={loan.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{loan.borrowerName}</span>
                    <span className="text-sm font-semibold text-gray-900">KES {loan.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Score: {loan.creditScore}</span>
                    <button className="text-xs text-primary-600 hover:text-primary-700">Review</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Target */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-4">Today's Target</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-primary-200">Disbursements</span>
                  <span className="text-sm font-medium">{metrics.disbursementsToday || 0}/50</span>
                </div>
                <div className="h-2 bg-primary-800 rounded-full">
                  <div className="h-full bg-white rounded-full" style={{ width: `${((metrics.disbursementsToday || 0) / 50) * 100}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-primary-200">Collections</span>
                  <span className="text-sm font-medium">{metrics.collectionsToday || 0}/80</span>
                </div>
                <div className="h-2 bg-primary-800 rounded-full">
                  <div className="h-full bg-white rounded-full" style={{ width: `${((metrics.collectionsToday || 0) / 80) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Applications Table */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900">Loan Applications</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="all">All Status</option>
              <option value="current">Current</option>
              <option value="overdue">Overdue</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLoans.slice(0, 9).map(loan => (
            <LoanApplicationCard
              key={loan.id}
              loan={loan}
              onApprove={handleApprove}
              onReject={handleReject}
              onReview={handleReview}
            />
          ))}
        </div>

        {filteredLoans.length > 9 && (
          <div className="mt-6 text-center">
            <button className="px-6 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100">
              View All {filteredLoans.length} Applications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankLenderDashboard;
