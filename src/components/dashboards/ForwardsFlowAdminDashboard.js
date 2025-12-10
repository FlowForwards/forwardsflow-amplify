import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign, Users, Building2, Briefcase, TrendingUp, CreditCard, Plus,
  Activity, AlertTriangle, CheckCircle, Clock, ArrowUpRight, ArrowDownRight,
  Globe, Shield, Eye, BarChart3, PieChart as PieChartIcon
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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
    indigo: 'bg-indigo-100 text-indigo-600',
    pink: 'bg-pink-100 text-pink-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
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

// Badge Component
const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Tenant Card Component
const TenantCard = ({ tenant, type }) => {
  const isBank = type === 'bank';
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isBank ? 'bg-green-100' : 'bg-blue-100'}`}>
            {isBank ? <Building2 className="w-5 h-5 text-green-600" /> : <Briefcase className="w-5 h-5 text-blue-600" />}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{tenant.name}</h4>
            <p className="text-xs text-gray-500">{tenant.country} • {tenant.email}</p>
          </div>
        </div>
        <Badge variant={tenant.status === 'active' ? 'success' : 'warning'}>
          {tenant.status}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
        {isBank ? (
          <>
            <div>
              <p className="text-xs text-gray-500">Active Loans</p>
              <p className="font-semibold text-gray-900">-</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">NPL Rate</p>
              <p className="font-semibold text-gray-900">-</p>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-xs text-gray-500">AUM</p>
              <p className="font-semibold text-gray-900">${((tenant.aum || 0) / 1000000).toFixed(0)}M</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Investments</p>
              <p className="font-semibold text-gray-900">-</p>
            </div>
          </>
        )}
      </div>
      
      <div className="flex gap-2 mt-4">
        <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100">
          View Details
        </button>
        <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
          Manage
        </button>
      </div>
    </div>
  );
};

const ForwardsFlowAdminDashboard = () => {
  const { user } = useAuth();
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
  const banks = data?.banks || [];
  const investors = data?.investors || [];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  const stats = [
    { icon: DollarSign, label: 'Total Capital Deployed', value: `$${((metrics.totalCapitalDeployed || 0) / 1000000).toFixed(1)}M`, trend: metrics.monthlyGrowth, color: 'blue' },
    { icon: Building2, label: 'Partner Banks', value: banks.length.toString(), subValue: `${banks.filter(b => b.status === 'active').length} active`, color: 'green' },
    { icon: Briefcase, label: 'Impact Investors', value: investors.length.toString(), subValue: `${investors.filter(i => i.status === 'active').length} active`, color: 'purple' },
    { icon: CreditCard, label: 'Active Mobile Loans', value: (metrics.totalActiveLoans || 0).toLocaleString(), trend: 12.1, color: 'yellow' },
    { icon: TrendingUp, label: 'Platform Yield', value: `${metrics.avgPlatformYield || 0}%`, color: 'indigo' },
    { icon: DollarSign, label: 'Monthly Revenue', value: `$${((metrics.monthlyRevenue || 0) / 1000).toFixed(0)}K`, trend: metrics.monthlyGrowth, color: 'pink' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Dashboard</h1>
          <p className="text-gray-500 mt-1">ForwardsFlow System Administration</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Reports
          </button>
          <button className="btn-primary !w-auto flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Tenant
          </button>
        </div>
      </div>

      {/* Platform Notice */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-red-800">Platform Administration Mode</p>
          <p className="text-sm text-red-600">You are managing tenant organizations. Individual tenant employee data is not accessible from this level for privacy compliance.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, idx) => <StatCard key={idx} {...stat} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Capital Deployed (6 Months)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={metrics.capitalByMonth || []}>
              <defs>
                <linearGradient id="colorCapital" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`} />
              <Tooltip formatter={(v) => [`$${(v / 1000000).toFixed(2)}M`, 'Capital']} />
              <Area type="monotone" dataKey="capital" stroke="#6366f1" strokeWidth={2} fill="url(#colorCapital)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={metrics.revenueByMonth || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex gap-1 p-1 border-b border-gray-100">
          {['overview', 'banks', 'investors', 'compliance'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'banks' && ` (${banks.length})`}
              {tab === 'investors' && ` (${investors.length})`}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Partner Banks */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Partner Banks</h4>
                  <Link to="/admin/banks" className="text-sm text-primary-600 hover:text-primary-700">View all</Link>
                </div>
                <div className="space-y-3">
                  {banks.slice(0, 3).map(bank => (
                    <TenantCard key={bank.id} tenant={bank} type="bank" />
                  ))}
                </div>
              </div>

              {/* Impact Investors */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Impact Investors</h4>
                  <Link to="/admin/investors" className="text-sm text-primary-600 hover:text-primary-700">View all</Link>
                </div>
                <div className="space-y-3">
                  {investors.slice(0, 3).map(investor => (
                    <TenantCard key={investor.id} tenant={investor} type="investor" />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'banks' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {banks.map(bank => (
                <TenantCard key={bank.id} tenant={bank} type="bank" />
              ))}
            </div>
          )}

          {activeTab === 'investors' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {investors.map(investor => (
                <TenantCard key={investor.id} tenant={investor} type="investor" />
              ))}
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-6">
              {/* Compliance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Compliant Banks</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">{banks.filter(b => b.status === 'active').length}</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-yellow-600 mb-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">AML Alerts</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-700">5</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Pending KYC</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">2</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-purple-600 mb-2">
                    <Activity className="w-5 h-5" />
                    <span className="font-medium">Transactions Today</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-700">147</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Recent Compliance Activity</h4>
                <div className="space-y-2">
                  {[
                    { action: 'KYC Verified', entity: 'Impact Capital Partners', time: '2 hours ago', status: 'success' },
                    { action: 'AML Alert Triggered', entity: 'Transaction TXN-2024-00123', time: '4 hours ago', status: 'warning' },
                    { action: 'License Renewed', entity: 'Equity Africa Bank', time: '1 day ago', status: 'success' },
                    { action: 'Document Expired', entity: 'Shell Foundation', time: '2 days ago', status: 'danger' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          item.status === 'success' ? 'bg-green-500' :
                          item.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <p className="font-medium text-gray-900">{item.action}</p>
                          <p className="text-sm text-gray-500">{item.entity}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Platform P&L Summary */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white">
        <h3 className="font-semibold text-lg mb-4">Platform P&L Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-gray-400 text-sm">Gross Revenue</p>
            <p className="text-2xl font-bold">${((metrics.monthlyRevenue || 0) * 6 / 1000).toFixed(0)}K</p>
            <p className="text-green-400 text-sm">+{metrics.monthlyGrowth || 0}% MoM</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Operating Costs</p>
            <p className="text-2xl font-bold">$245K</p>
            <p className="text-gray-400 text-sm">Infrastructure + Team</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Net Profit</p>
            <p className="text-2xl font-bold text-green-400">$505K</p>
            <p className="text-gray-400 text-sm">67% margin</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">LTV:CAC Ratio</p>
            <p className="text-2xl font-bold">8.2x</p>
            <p className="text-gray-400 text-sm">Target: 5x</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForwardsFlowAdminDashboard;
