/**
 * Super Admin Dashboard - ForwardsFlow Platform
 * Connected to DynamoDB via AppSync with real-time subscriptions
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  Globe,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  Plus,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle,
  Search,
  Filter,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Bell,
  Settings,
  Smartphone,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useData, usePlatformMetrics, useOrganizations, useCapitalCalls, useNotifications } from '../../context/DataContext';

// Color palette
const COLORS = {
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  indigo: '#6366F1',
};

const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

// Stat Card Component
const StatCard = ({ title, value, change, changeType, icon: Icon, color, subtitle }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        {change !== undefined && (
          <div className={`flex items-center mt-2 ${changeType === 'positive' ? 'text-green-600' : 'text-red-500'}`}>
            {changeType === 'positive' ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            <span className="text-sm font-medium ml-1">{change}%</span>
            <span className="text-xs text-gray-400 ml-2">vs last month</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

// Organization Row Component
const OrganizationRow = ({ org, onView, onSuspend, onActivate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    SUSPENDED: 'bg-red-100 text-red-800',
    INACTIVE: 'bg-gray-100 text-gray-800',
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
            org.orgType === 'BANK' ? 'bg-blue-100' : 'bg-indigo-100'
          }`}>
            {org.orgType === 'BANK' ? (
              <Building2 className="h-5 w-5 text-blue-600" />
            ) : (
              <Briefcase className="h-5 w-5 text-indigo-600" />
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{org.name}</div>
            <div className="text-sm text-gray-500">{org.country}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          org.orgType === 'BANK' ? 'bg-blue-100 text-blue-800' : 'bg-indigo-100 text-indigo-800'
        }`}>
          {org.orgType}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[org.status]}`}>
          {org.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {org.orgType === 'BANK' ? (
          <div>
            <div>${((org.totalCapital || 0) / 1000000).toFixed(1)}M Capital</div>
            <div className="text-xs text-gray-400">{org.activeLoans || 0} Active Loans</div>
          </div>
        ) : (
          <div>
            <div>${((org.totalInvested || 0) / 1000000).toFixed(1)}M Invested</div>
            <div className="text-xs text-gray-400">{org.activeInvestments || 0} Investments</div>
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div>{org.adminCount || 0} Admins</div>
        <div className="text-xs text-gray-400">{org.userCount || 0} Users</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-400 hover:text-gray-600 p-1 rounded"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <button
              onClick={() => { onView(org); setMenuOpen(false); }}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Eye className="h-4 w-4 mr-2" /> View Details
            </button>
            {org.status === 'ACTIVE' ? (
              <button
                onClick={() => { onSuspend(org); setMenuOpen(false); }}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Ban className="h-4 w-4 mr-2" /> Suspend
              </button>
            ) : (
              <button
                onClick={() => { onActivate(org); setMenuOpen(false); }}
                className="w-full flex items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50"
              >
                <CheckCircle className="h-4 w-4 mr-2" /> Activate
              </button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
};

// Main Dashboard Component
export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const { 
    refreshPlatformMetrics, 
    suspendOrganization, 
    activateOrganization,
    seedDemoData,
    subscribeToCapitalCalls,
  } = useData();
  
  // Data hooks
  const { metrics, refresh: refreshMetrics, loading: metricsLoading } = usePlatformMetrics();
  const { organizations: banks } = useOrganizations('BANK');
  const { organizations: investors } = useOrganizations('INVESTOR');
  const { calls: recentCalls } = useCapitalCalls(null, false);
  const { notifications, unreadCount, markAllRead } = useNotifications(user?.userId);
  
  // UI State
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showOrgModal, setShowOrgModal] = useState(false);

  // Real-time subscription for new capital calls
  useEffect(() => {
    const subscription = subscribeToCapitalCalls((newCall) => {
      console.log('New capital call received:', newCall);
      // Could show a toast notification here
    });

    return () => {
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, [subscribeToCapitalCalls]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshMetrics();
    } finally {
      setRefreshing(false);
    }
  };

  // Handle seed demo data
  const handleSeedData = async () => {
    if (window.confirm('This will seed demo data into the database. Continue?')) {
      try {
        await seedDemoData();
        await refreshMetrics();
        alert('Demo data seeded successfully!');
      } catch (error) {
        alert('Error seeding data: ' + error.message);
      }
    }
  };

  // Handle org actions
  const handleViewOrg = (org) => {
    setSelectedOrg(org);
    setShowOrgModal(true);
  };

  const handleSuspendOrg = async (org) => {
    if (window.confirm(`Suspend ${org.name}? This will disable all their users.`)) {
      try {
        await suspendOrganization(org.orgId, 'Admin action');
        await refreshMetrics();
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  const handleActivateOrg = async (org) => {
    try {
      await activateOrganization(org.orgId);
      await refreshMetrics();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  // Format currency
  const formatCurrency = (value, compact = true) => {
    if (compact && value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Combined organizations for table
  const allOrganizations = [...banks, ...investors].filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Prepare chart data
  const capitalByMonth = metrics?.capitalByMonth || [];
  const revenueByMonth = metrics?.revenueByMonth || [];
  
  const orgTypeDistribution = [
    { name: 'Banks', value: banks.length },
    { name: 'Investors', value: investors.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ForwardsFlow</span>
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                SUPER ADMIN
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                      <span className="font-semibold">Notifications</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-sm text-gray-500 text-center">No notifications</p>
                      ) : (
                        notifications.slice(0, 5).map(notif => (
                          <div
                            key={notif.notificationId}
                            className={`p-4 border-b border-gray-100 ${!notif.read ? 'bg-blue-50' : ''}`}
                          >
                            <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Settings */}
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Settings className="h-5 w-5" />
              </button>
              
              {/* User Menu */}
              <div className="flex items-center border-l border-gray-200 pl-4">
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-red-600">
                    {user?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'banks', label: 'Banks', icon: Building2 },
              { id: 'investors', label: 'Investors', icon: Briefcase },
              { id: 'activity', label: 'Activity', icon: Activity },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Capital Deployed"
            value={formatCurrency(metrics?.totalCapitalDeployed || 0)}
            change={metrics?.monthlyGrowth || 0}
            changeType="positive"
            icon={DollarSign}
            color="bg-blue-500"
          />
          <StatCard
            title="Partner Banks"
            value={metrics?.totalBanks || banks.length}
            change={8.2}
            changeType="positive"
            icon={Building2}
            color="bg-green-500"
            subtitle="Active lending institutions"
          />
          <StatCard
            title="Impact Investors"
            value={metrics?.totalInvestors || investors.length}
            change={12.5}
            changeType="positive"
            icon={Briefcase}
            color="bg-indigo-500"
            subtitle="Registered investors"
          />
          <StatCard
            title="Active Mobile Loans"
            value={(metrics?.totalActiveLoans || 0).toLocaleString()}
            icon={Smartphone}
            color="bg-purple-500"
            subtitle={`${formatCurrency(metrics?.totalLoanVolume || 0)} volume`}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Platform Yield"
            value={`${(metrics?.avgPlatformYield || 0).toFixed(1)}%`}
            icon={TrendingUp}
            color="bg-emerald-500"
            subtitle="Average APR across instruments"
          />
          <StatCard
            title="Monthly Revenue"
            value={formatCurrency(metrics?.monthlyRevenue || 0)}
            change={metrics?.monthlyGrowth || 0}
            changeType="positive"
            icon={BarChart3}
            color="bg-orange-500"
          />
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">Quick Actions</span>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setShowOrgModal(true)}
                className="w-full flex items-center justify-between px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <span className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Organization
                </span>
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={handleSeedData}
                className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Seed Demo Data
                </span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Capital Deployed Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Capital Deployed (6 Months)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={capitalByMonth}>
                  <defs>
                    <linearGradient id="capitalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip
                    formatter={(value) => [`$${(value / 1000000).toFixed(2)}M`, 'Capital']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={COLORS.primary}
                    strokeWidth={2}
                    fill="url(#capitalGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" fill={COLORS.success} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Organizations Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">All Organizations</h3>
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search organizations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {/* Filter */}
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </button>
                
                {/* Add */}
                <button
                  onClick={() => setShowOrgModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Organization
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Users
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allOrganizations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-lg font-medium">No organizations yet</p>
                      <p className="text-sm">Click "Add Organization" or "Seed Demo Data" to get started</p>
                    </td>
                  </tr>
                ) : (
                  allOrganizations.map(org => (
                    <OrganizationRow
                      key={org.orgId}
                      org={org}
                      onView={handleViewOrg}
                      onSuspend={handleSuspendOrg}
                      onActivate={handleActivateOrg}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Capital Calls</h3>
          {recentCalls.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p>No capital calls yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentCalls.slice(0, 5).map(call => (
                <div
                  key={call.callId}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      call.status === 'PUBLISHED' ? 'bg-green-100' :
                      call.status === 'DRAFT' ? 'bg-gray-100' : 'bg-blue-100'
                    }`}>
                      <DollarSign className={`h-5 w-5 ${
                        call.status === 'PUBLISHED' ? 'text-green-600' :
                        call.status === 'DRAFT' ? 'text-gray-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {call.bank?.name || 'Unknown Bank'} - {call.txnRef}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(call.amount)} at {call.interestRate}% APR • {call.maturityMonths}mo
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      call.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                      call.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                      call.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {call.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {call.subscribedPct || 0}% subscribed
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Organization Modal (Placeholder) */}
      {showOrgModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">
              {selectedOrg ? 'Organization Details' : 'Add New Organization'}
            </h3>
            {selectedOrg ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{selectedOrg.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Type</label>
                  <p className="text-gray-900">{selectedOrg.orgType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Country</label>
                  <p className="text-gray-900">{selectedOrg.country}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Status</label>
                  <p className="text-gray-900">{selectedOrg.status}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Organization creation form would go here</p>
            )}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => { setShowOrgModal(false); setSelectedOrg(null); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
