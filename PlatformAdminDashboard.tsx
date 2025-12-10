// PlatformAdminDashboard.tsx - ForwardsFlow System Admin Dashboard
// Place in: src/components/dashboards/PlatformAdminDashboard.tsx

import React, { useState, useEffect } from 'react';
import {
  Globe,
  Building2,
  Landmark,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Plus,
  Eye,
  Ban,
  MoreVertical,
  Search,
  Filter,
  Shield,
  Activity
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
import { apiService, Tenant, PlatformMetrics } from '../../services/apiService';

// ============================================
// STAT CARD COMPONENT
// ============================================
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: number;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend, subtitle }) => {
  const colorClasses: Record<string, string> = {
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    amber: 'bg-amber-100 text-amber-600',
    emerald: 'bg-emerald-100 text-emerald-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
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
        <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.blue}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// ============================================
// TENANT TABLE COMPONENT
// ============================================
interface TenantTableProps {
  tenants: Tenant[];
  type: 'bank' | 'investor';
  onView: (tenant: Tenant) => void;
  onSuspend: (tenant: Tenant) => void;
}

const TenantTable: React.FC<TenantTableProps> = ({ tenants, type, onView, onSuspend }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              {type === 'bank' ? 'Bank' : 'Investor'}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              {type === 'bank' ? 'Total Deposits' : 'Total Invested'}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tenants.map(tenant => (
            <tr key={tenant.tenantId} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    type === 'bank' ? 'bg-purple-100' : 'bg-emerald-100'
                  }`}>
                    {type === 'bank' 
                      ? <Building2 className="w-5 h-5 text-purple-600" />
                      : <Landmark className="w-5 h-5 text-emerald-600" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{tenant.name}</p>
                    <p className="text-xs text-gray-500">{tenant.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-600">{tenant.country}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  tenant.status === 'active' ? 'bg-green-100 text-green-700' :
                  tenant.status === 'suspended' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {tenant.status}
                </span>
              </td>
              <td className="px-6 py-4 font-medium text-gray-900">
                {type === 'bank' 
                  ? `¥${(tenant.totalDeposits || 0).toLocaleString()}`
                  : `$${(tenant.totalInvested || 0).toLocaleString()}`
                }
              </td>
              <td className="px-6 py-4 text-gray-600">
                ${(tenant.revenueToDate || 0).toLocaleString()}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onView(tenant)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onSuspend(tenant)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title={tenant.status === 'suspended' ? 'Activate' : 'Suspend'}
                  >
                    <Ban className="w-4 h-4" />
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
// MAIN PLATFORM ADMIN DASHBOARD
// ============================================
const PlatformAdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'banks' | 'investors' | 'compliance'>('overview');
  
  // Data state
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [banks, setBanks] = useState<Tenant[]>([]);
  const [investors, setInvestors] = useState<Tenant[]>([]);

  // Mock growth data for charts
  const [growthData] = useState([
    { month: 'Jul', deposits: 180, loans: 2400, revenue: 32 },
    { month: 'Aug', deposits: 220, loans: 2800, revenue: 38 },
    { month: 'Sep', deposits: 280, loans: 3200, revenue: 45 },
    { month: 'Oct', deposits: 350, loans: 3800, revenue: 52 },
    { month: 'Nov', deposits: 420, loans: 4500, revenue: 61 },
    { month: 'Dec', deposits: 500, loans: 5200, revenue: 72 }
  ]);

  const loadData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [metricsData, banksData, investorsData] = await Promise.all([
        apiService.getPlatformMetrics(),
        apiService.getTenants('bank'),
        apiService.getTenants('investor')
      ]);

      setMetrics(metricsData);
      setBanks(banksData);
      setInvestors(investorsData);
    } catch (error) {
      console.error('Error loading platform data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleViewTenant = (tenant: Tenant) => {
    console.log('View tenant:', tenant);
    // Navigate to tenant details
  };

  const handleSuspendTenant = async (tenant: Tenant) => {
    const newStatus = tenant.status === 'suspended' ? 'active' : 'suspended';
    await apiService.updateTenant(tenant.tenantId, { status: newStatus });
    loadData(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading platform data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-6 h-6" />
              <span className="text-red-200 text-sm font-medium">PLATFORM ADMINISTRATION</span>
            </div>
            <h1 className="text-2xl font-bold">ForwardsFlow Platform</h1>
            <p className="text-red-100 mt-1">
              Managing {banks.length} partner banks and {investors.length} impact investors
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-red-200">Platform Revenue (YTD)</p>
            <p className="text-3xl font-bold">${metrics?.platformRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 shadow-sm">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'banks', label: 'Partner Banks', icon: Building2 },
          { id: 'investors', label: 'Impact Investors', icon: Landmark },
          { id: 'compliance', label: 'Compliance', icon: Shield }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-red-600 text-white'
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
              title="Partner Banks"
              value={metrics?.totalBanks || 0}
              icon={Building2}
              color="purple"
              subtitle={`${metrics?.activeBanks || 0} active`}
              trend={12}
            />
            <StatCard
              title="Impact Investors"
              value={metrics?.totalInvestors || 0}
              icon={Landmark}
              color="emerald"
              subtitle={`${metrics?.activeInvestors || 0} active`}
              trend={8}
            />
            <StatCard
              title="Total Deposits Raised"
              value={`¥${((metrics?.totalDepositsRaised || 0) / 1000000).toFixed(0)}M`}
              icon={TrendingUp}
              color="blue"
              trend={15}
            />
            <StatCard
              title="Platform Revenue"
              value={`$${((metrics?.platformRevenue || 0) / 1000000).toFixed(2)}M`}
              icon={DollarSign}
              color="green"
              trend={22}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Growth Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Growth</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="deposits"
                    stroke="#8B5CF6"
                    fill="url(#colorDeposits)"
                    name="Deposits (¥M)"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    fill="url(#colorRevenue)"
                    name="Revenue ($K)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Tenant Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tenant Distribution</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Active Banks', value: metrics?.activeBanks || 0, color: '#8B5CF6' },
                      { name: 'Pending Banks', value: (metrics?.totalBanks || 0) - (metrics?.activeBanks || 0), color: '#C4B5FD' },
                      { name: 'Active Investors', value: metrics?.activeInvestors || 0, color: '#10B981' },
                      { name: 'Pending Investors', value: (metrics?.totalInvestors || 0) - (metrics?.activeInvestors || 0), color: '#6EE7B7' }
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
                      { color: '#8B5CF6' },
                      { color: '#C4B5FD' },
                      { color: '#10B981' },
                      { color: '#6EE7B7' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lending Performance */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mobile Lending Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Loans Originated</p>
                <p className="text-2xl font-bold text-blue-600">{metrics?.totalLoansOriginated.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Disbursed</p>
                <p className="text-2xl font-bold text-green-600">
                  KES {((metrics?.totalLoansDisbursed || 0) / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Average Yield</p>
                <p className="text-2xl font-bold text-purple-600">{metrics?.averageYield.toFixed(1)}%</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Default Rate</p>
                <p className="text-2xl font-bold text-red-600">{metrics?.defaultRate.toFixed(2)}%</p>
              </div>
            </div>
          </div>

          {/* Platform Notice */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Platform Administration Scope</p>
                <p className="text-sm text-red-700 mt-1">
                  As ForwardsFlow Admin, you manage tenant organizations and their administrators only. 
                  Individual tenant staff and borrower data is managed by each tenant's admin for data privacy compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banks Tab */}
      {activeTab === 'banks' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Partner Banks</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  <Plus className="w-4 h-4" />
                  Add Bank
                </button>
              </div>
            </div>
            <TenantTable
              tenants={banks}
              type="bank"
              onView={handleViewTenant}
              onSuspend={handleSuspendTenant}
            />
          </div>
        </div>
      )}

      {/* Investors Tab */}
      {activeTab === 'investors' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Impact Investors</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  <Plus className="w-4 h-4" />
                  Add Investor
                </button>
              </div>
            </div>
            <TenantTable
              tenants={investors}
              type="investor"
              onView={handleViewTenant}
              onSuspend={handleSuspendTenant}
            />
          </div>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-green-100">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">KYC Verified</p>
                  <p className="text-2xl font-bold text-gray-900">98.5%</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">All tenants compliant</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-amber-100">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">AML Alerts</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">3 requiring review</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-blue-100">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Due within 48 hours</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Overview by Tenant</h3>
            <p className="text-gray-500">
              Tenant-level compliance data is accessible for regulatory oversight. 
              Individual transaction details require tenant admin authorization.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformAdminDashboard;
