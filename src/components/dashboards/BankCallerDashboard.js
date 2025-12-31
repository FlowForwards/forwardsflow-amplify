import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign, TrendingUp, Plus, Clock, ArrowUpRight, RefreshCw,
  Briefcase, Globe, Target, PieChart as PieChartIcon, BarChart3,
  CheckCircle, XCircle, Send, FileText, Users
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { db } from '../../services/DatabaseService';
import { useAuth } from '../../context/AuthContext';
import AmazonQChat from '../shared/AmazonQChat';

// Stat Card
const StatCard = ({ icon: Icon, label, value, trend, subValue, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-sm text-green-600">
            <ArrowUpRight className="w-4 h-4" />
            <span>{trend}%</span>
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

// Capital Call Card
const CapitalCallCard = ({ call, onAction }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'published': return { color: 'bg-green-100 text-green-700', label: 'Open' };
      case 'accepted': return { color: 'bg-blue-100 text-blue-700', label: 'Accepted' };
      case 'completed': return { color: 'bg-purple-100 text-purple-700', label: 'Completed' };
      case 'expired': return { color: 'bg-gray-100 text-gray-700', label: 'Expired' };
      default: return { color: 'bg-yellow-100 text-yellow-700', label: status };
    }
  };

  const statusConfig = getStatusConfig(call.status);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-primary-600">{call.txnRef}</p>
          <h4 className="font-semibold text-gray-900 mt-1">${(call.amount / 1000000).toFixed(1)}M Capital Call</h4>
        </div>
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusConfig.color}`}>
          {statusConfig.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Interest Rate</p>
          <p className="font-semibold text-green-600">{call.interestRate}% APR</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Maturity</p>
          <p className="font-semibold text-gray-900">{call.maturityMonths} months</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">FX Rate</p>
          <p className="font-semibold text-gray-900">{call.fxRate}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Hedging Fee</p>
          <p className="font-semibold text-gray-900">{call.hedgingFee}%</p>
        </div>
      </div>

      {/* Subscription Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Subscription</span>
          <span className="text-xs font-medium">{call.subscribedPercent || 0}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full"
            style={{ width: `${call.subscribedPercent || 0}%` }}
          />
        </div>
      </div>

      {call.investorName && (
        <div className="flex items-center gap-2 mb-4 p-2 bg-blue-50 rounded-lg">
          <Briefcase className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-800">{call.investorName}</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={() => onAction(call, 'view')}
          className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100"
        >
          View Details
        </button>
        {call.status === 'published' && (
          <button
            onClick={() => onAction(call, 'edit')}
            className="flex-1 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

const BankCallerDashboard = () => {
  const { user, tenant } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

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
  const capitalCalls = data?.capitalCalls || [];

  const filteredCalls = activeTab === 'all' 
    ? capitalCalls 
    : capitalCalls.filter(c => c.status === activeTab);

  const stats = [
    { icon: DollarSign, label: 'Total Capital Raised', value: `$${((metrics.totalCapital || 0) / 1000000).toFixed(1)}M`, color: 'blue' },
    { icon: Target, label: 'Active Calls', value: capitalCalls.filter(c => c.status === 'published').length.toString(), color: 'green' },
    { icon: CheckCircle, label: 'Completed', value: capitalCalls.filter(c => c.status === 'completed').length.toString(), color: 'purple' },
    { icon: TrendingUp, label: 'Avg. Interest Rate', value: `${(capitalCalls.reduce((sum, c) => sum + c.interestRate, 0) / capitalCalls.length || 0).toFixed(1)}%`, color: 'yellow' },
  ];

  // FX Data for chart
  const fxData = [
    { date: 'Mon', rate: 153.2 },
    { date: 'Tue', rate: 153.5 },
    { date: 'Wed', rate: 153.8 },
    { date: 'Thu', rate: 153.4 },
    { date: 'Fri', rate: 153.6 },
    { date: 'Today', rate: 153.5 },
  ];

  const handleCallAction = (call, action) => {
    console.log(`Action: ${action} on call:`, call.id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Capital Markets</h1>
          <p className="text-gray-500 mt-1">{tenant?.name || 'Bank'} • Capital Call Operations</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <Link to="/bank/calls/create" className="btn-primary !w-auto flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Capital Call
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => <StatCard key={idx} {...stat} />)}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* FX Rate Chart */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">USD/KES Exchange Rate</h3>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Live Rate: 153.50</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={fxData}>
                <defs>
                  <linearGradient id="fxGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip formatter={(v) => [v.toFixed(2), 'Rate']} />
                <Area type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={2} fill="url(#fxGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Capital Calls */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Capital Calls</h3>
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                {['all', 'published', 'completed'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCalls.map(call => (
                <CapitalCallCard
                  key={call.id}
                  call={call}
                  onAction={handleCallAction}
                />
              ))}
            </div>

            {filteredCalls.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No capital calls found</p>
                <Link to="/bank/calls/create" className="text-primary-600 hover:text-primary-700 text-sm mt-2 inline-block">
                  Create your first capital call
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Investor Interest */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Investor Activity</h3>
            <div className="space-y-3">
              {[
                { name: 'Impact Capital Partners', action: 'Viewed', call: 'TXN-2024-00001', time: '2h ago' },
                { name: 'Shell Foundation', action: 'Interested', call: 'TXN-2024-00003', time: '5h ago' },
                { name: 'Nordic Fund', action: 'Downloaded', call: 'TXN-2024-00001', time: '1d ago' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.name}</p>
                      <p className="text-xs text-gray-500">{activity.action} {activity.call}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deployment Status */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Capital Deployment</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Deployed to Lending</span>
                  <span className="text-sm font-medium">{metrics.deploymentRate || 0}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${metrics.deploymentRate || 0}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Active Loans</p>
                  <p className="text-lg font-bold text-gray-900">{metrics.activeLoans || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Lending Yield</p>
                  <p className="text-lg font-bold text-green-600">{metrics.monthlyYield || 0}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Calculator */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-4">Quick Calculator</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-purple-200">Capital Amount (USD)</label>
                <input
                  type="text"
                  placeholder="1,000,000"
                  className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
              <div>
                <label className="text-sm text-purple-200">Interest Rate (%)</label>
                <input
                  type="text"
                  placeholder="15"
                  className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
              <div className="pt-4 border-t border-white/20">
                <p className="text-sm text-purple-200">Estimated Annual Return</p>
                <p className="text-2xl font-bold">$150,000</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Assistant */}
      <AmazonQChat userRole="bank_caller" userName={user?.name || 'User'} />
    </div>
  );
};

export default BankCallerDashboard;
