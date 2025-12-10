import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign, Briefcase, TrendingUp, PieChart as PieChartIcon, Users, Settings,
  Plus, Eye, ChevronRight, Globe, Target, BarChart3, CheckCircle, Clock
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { db } from '../../services/DatabaseService';
import { useAuth } from '../../context/AuthContext';

// Stat Card
const StatCard = ({ icon: Icon, label, value, trend, subValue, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    indigo: 'bg-indigo-100 text-indigo-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className="w-4 h-4" />
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

// Investment Card
const InvestmentCard = ({ investment }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div>
        <h4 className="font-semibold text-gray-900">{investment.bankName}</h4>
        <p className="text-sm text-gray-500">${(investment.amount / 1000000).toFixed(1)}M invested</p>
      </div>
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
        investment.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
      }`}>
        {investment.status}
      </span>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p className="text-xs text-gray-500">Current Value</p>
        <p className="font-semibold text-gray-900">${(investment.currentValue / 1000000).toFixed(2)}M</p>
      </div>
      <div>
        <p className="text-xs text-gray-500">Yield</p>
        <p className="font-semibold text-green-600">{investment.interestRate}%</p>
      </div>
    </div>

    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">Loans Deployed</span>
        <span className="text-xs font-medium">{investment.loansDeployed}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-primary-500 rounded-full" style={{ width: '100%' }} />
      </div>
    </div>

    <div className="flex items-center gap-2">
      <Link to={`/investor/investments/${investment.id}`} className="flex-1 py-2 text-sm font-medium text-center text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100">
        View Details
      </Link>
      <button className="flex-1 py-2 text-sm font-medium text-center text-white bg-primary-600 rounded-lg hover:bg-primary-700">
        Impact Report
      </button>
    </div>
  </div>
);

// Team Member Card
const TeamMemberCard = ({ member }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
        <span className="text-sm font-medium text-primary-600">
          {member.name.split(' ').map(n => n[0]).join('')}
        </span>
      </div>
      <div>
        <p className="font-medium text-gray-900">{member.name}</p>
        <p className="text-xs text-gray-500">{member.role} • {member.email}</p>
      </div>
    </div>
    <button className="text-sm text-primary-600 hover:text-primary-700">Manage</button>
  </div>
);

const InvestorAdminDashboard = () => {
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
  const investments = data?.investments || [];
  const opportunities = data?.opportunities || [];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6'];

  // Mock team members
  const teamMembers = [
    { name: 'Michael Torres', role: 'Investment Analyst', email: 'analyst@impactcapital.com' },
    { name: 'Emily Zhang', role: 'Due Diligence', email: 'emily@impactcapital.com' },
    { name: 'James Wilson', role: 'Portfolio Manager', email: 'james@impactcapital.com' },
  ];

  const stats = [
    { icon: DollarSign, label: 'Total Invested', value: `$${((metrics.totalInvested || 0) / 1000000).toFixed(1)}M`, trend: metrics.portfolioGrowth, color: 'blue' },
    { icon: Briefcase, label: 'Active Investments', value: (metrics.activeInvestments || 0).toString(), color: 'purple' },
    { icon: TrendingUp, label: 'Average Yield', value: `${metrics.avgYield || 0}%`, color: 'green' },
    { icon: Target, label: 'Portfolio Value', value: `$${((metrics.portfolioValue || 0) / 1000000).toFixed(2)}M`, subValue: `+$${((metrics.totalReturns || 0) / 1000).toFixed(0)}K returns`, color: 'indigo' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{tenant?.name || 'Impact Capital'}</h1>
          <p className="text-gray-500 mt-1">Investment Administration Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <Link to="/investor/opportunities" className="btn-primary !w-auto flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Investment
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => <StatCard key={idx} {...stat} />)}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Yield Performance */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Yield Performance</h3>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5">
                <option>Last 6 Months</option>
                <option>Last Year</option>
                <option>All Time</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={metrics.yieldHistory || []}>
                <defs>
                  <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `${v}%`} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip formatter={(v) => [`${v}%`, 'Yield']} />
                <Area type="monotone" dataKey="yield" stroke="#10b981" strokeWidth={2} fill="url(#yieldGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Active Investments */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Active Investments</h3>
              <Link to="/investor/investments" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {investments.slice(0, 4).map(investment => (
                <InvestmentCard key={investment.id} investment={investment} />
              ))}
            </div>
            {investments.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No active investments yet</p>
                <Link to="/investor/opportunities" className="text-primary-600 hover:text-primary-700 text-sm mt-2 inline-block">
                  Browse opportunities
                </Link>
              </div>
            )}
          </div>

          {/* Impact Summary */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Impact Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-green-200 text-sm">Borrowers Reached</p>
                <p className="text-3xl font-bold">{(metrics.impactMetrics?.totalBorrowersReached || 847).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-green-200 text-sm">M2 Generated</p>
                <p className="text-3xl font-bold">KES {((metrics.impactMetrics?.totalM2Generated || 95000000) / 1000000).toFixed(0)}M</p>
              </div>
              <div>
                <p className="text-green-200 text-sm">Rate Reduction</p>
                <p className="text-3xl font-bold">{metrics.impactMetrics?.avgLoanRateReduction || 8.5}%</p>
              </div>
              <div>
                <p className="text-green-200 text-sm">Jobs Supported</p>
                <p className="text-3xl font-bold">{(metrics.impactMetrics?.jobsSupported || 423).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Portfolio Allocation */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Portfolio Allocation</h3>
            <div className="flex justify-center mb-4">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={metrics.portfolioByBank || []} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="amount">
                    {(metrics.portfolioByBank || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {(metrics.portfolioByBank || []).map((bank, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-sm text-gray-600">{bank.bank}</span>
                  </div>
                  <span className="text-sm font-medium">${(bank.amount / 1000000).toFixed(1)}M</span>
                </div>
              ))}
            </div>
          </div>

          {/* Team Management */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Team</h3>
              <Link to="/investor/admin/users" className="text-sm text-primary-600 hover:text-primary-700">Manage</Link>
            </div>
            <div className="space-y-3">
              {teamMembers.map((member, idx) => (
                <TeamMemberCard key={idx} member={member} />
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100">
              + Add Team Member
            </button>
          </div>

          {/* Open Opportunities */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Open Opportunities</h3>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                {opportunities.filter(o => o.status === 'published').length} available
              </span>
            </div>
            <div className="space-y-3">
              {opportunities.filter(o => o.status === 'published').slice(0, 3).map(opp => (
                <div key={opp.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{opp.bankName}</span>
                    <span className="text-sm font-semibold text-green-600">{opp.interestRate}%</span>
                  </div>
                  <p className="text-sm text-gray-500">${(opp.amount / 1000000).toFixed(0)}M • {opp.maturityMonths} months</p>
                </div>
              ))}
            </div>
            <Link to="/investor/opportunities" className="block w-full mt-4 py-2 text-sm font-medium text-center text-white bg-primary-600 rounded-lg hover:bg-primary-700">
              Browse All Opportunities
            </Link>
          </div>

          {/* Pending Actions */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Pending Actions</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800">KYC Renewal Due</p>
                  <p className="text-xs text-yellow-600">Expires in 30 days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">Quarterly Report Ready</p>
                  <p className="text-xs text-blue-600">Q3 2024 Performance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorAdminDashboard;
