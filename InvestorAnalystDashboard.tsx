// InvestorAnalystDashboard.tsx - Investment Analyst Dashboard
// Place in: src/components/dashboards/InvestorAnalystDashboard.tsx

import React, { useState, useEffect } from 'react';
import {
  LineChart as LineChartIcon,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Landmark,
  Clock,
  CheckCircle,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Search,
  Filter,
  Globe,
  Percent,
  Calendar,
  Target,
  Award
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
import { apiService, DepositCall, InvestorMetrics } from '../../services/apiService';

// ============================================
// TYPES
// ============================================
interface User {
  tenantId: string;
  tenantName: string;
  name: string;
}

interface InvestorAnalystDashboardProps {
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
    emerald: 'bg-emerald-100 text-emerald-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    amber: 'bg-amber-100 text-amber-600',
    green: 'bg-green-100 text-green-600'
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
// CALL CARD COMPONENT (Investment Opportunity)
// ============================================
const CallCard: React.FC<{
  call: DepositCall;
  onBid: (call: DepositCall) => void;
  onView: (call: DepositCall) => void;
}> = ({ call, onBid, onView }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-700';
      case 'partially_subscribed': return 'bg-blue-100 text-blue-700';
      case 'fully_subscribed': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-900">{call.bankName}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{call.instrumentType.replace('_', ' ')}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
          {call.status.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Currency Pair</p>
          <p className="font-semibold text-gray-900">{call.currencyPair}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Principal</p>
          <p className="font-semibold text-gray-900">¥{(call.principalAmount / 1000000).toFixed(0)}M</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Interest Rate</p>
          <p className="font-semibold text-emerald-600">{call.interestRate}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Total Yield</p>
          <p className="font-semibold text-emerald-600">{call.totalYield}%</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-500">Subscription</span>
          <span className="font-medium">{call.subscriptionPercentage}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${call.subscriptionPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Calendar className="w-4 h-4" />
        <span>Matures: {call.maturityDate}</span>
        <span className="text-gray-300">|</span>
        <span>{call.maturityDays} days</span>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
        {call.status === 'open' || call.status === 'partially_subscribed' ? (
          <button
            onClick={() => onBid(call)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <DollarSign className="w-4 h-4" />
            Place Bid
          </button>
        ) : (
          <button
            disabled
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
          >
            Fully Subscribed
          </button>
        )}
        <button
          onClick={() => onView(call)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ============================================
// PORTFOLIO ITEM COMPONENT
// ============================================
const PortfolioItem: React.FC<{
  investment: {
    callId: string;
    bankName: string;
    amount: number;
    yield: number;
    maturityDate: string;
    status: string;
    returns: number;
  };
}> = ({ investment }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-gray-900">{investment.bankName}</p>
          <p className="text-xs text-gray-500">{investment.callId}</p>
        </div>
      </td>
      <td className="px-4 py-3 font-medium text-gray-900">
        ${investment.amount.toLocaleString()}
      </td>
      <td className="px-4 py-3 text-emerald-600 font-medium">
        {investment.yield}%
      </td>
      <td className="px-4 py-3 text-gray-600">{investment.maturityDate}</td>
      <td className="px-4 py-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          investment.status === 'active' ? 'bg-green-100 text-green-700' :
          investment.status === 'matured' ? 'bg-blue-100 text-blue-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {investment.status}
        </span>
      </td>
      <td className="px-4 py-3 text-emerald-600 font-medium">
        +${investment.returns.toLocaleString()}
      </td>
    </tr>
  );
};

// ============================================
// MAIN INVESTOR ANALYST DASHBOARD
// ============================================
const InvestorAnalystDashboard: React.FC<InvestorAnalystDashboardProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'opportunities' | 'portfolio' | 'impact' | 'analytics'>('opportunities');
  
  // Data state
  const [metrics, setMetrics] = useState<InvestorMetrics | null>(null);
  const [availableCalls, setAvailableCalls] = useState<DepositCall[]>([]);
  
  // Mock portfolio data
  const [portfolio] = useState([
    { callId: 'CALL-001', bankName: 'Equity Bank Africa', amount: 15000000, yield: 9.7, maturityDate: '2025-12-15', status: 'active', returns: 485000 },
    { callId: 'CALL-002', bankName: 'Equity Bank Africa', amount: 8000000, yield: 8.7, maturityDate: '2025-06-15', status: 'active', returns: 232000 },
    { callId: 'CALL-003', bankName: 'DTB Kenya', amount: 12000000, yield: 10.5, maturityDate: '2025-09-01', status: 'active', returns: 420000 }
  ]);

  // Chart data
  const [returnsTrend] = useState([
    { month: 'Jul', returns: 180, invested: 25 },
    { month: 'Aug', returns: 220, invested: 30 },
    { month: 'Sep', returns: 280, invested: 35 },
    { month: 'Oct', returns: 350, invested: 40 },
    { month: 'Nov', returns: 420, invested: 50 },
    { month: 'Dec', returns: 485, invested: 50 }
  ]);

  const [impactMetrics] = useState({
    borrowersReached: 45000,
    loansEnabled: 12500000000, // KES
    avgInterestReduction: 15,
    financialInclusion: 28000,
    m2Generated: 62500000000
  });

  const loadData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [metricsData, callsData] = await Promise.all([
        apiService.getInvestorMetrics(user.tenantId),
        apiService.getAvailableCalls()
      ]);

      setMetrics(metricsData);
      setAvailableCalls(callsData);
    } catch (error) {
      console.error('Error loading investor data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user.tenantId]);

  const handleBid = (call: DepositCall) => {
    console.log('Place bid on:', call);
    // Open bid modal
  };

  const handleViewCall = (call: DepositCall) => {
    console.log('View call details:', call);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading investment data...</p>
        </div>
      </div>
    );
  }

  const totalPortfolioValue = portfolio.reduce((sum, p) => sum + p.amount, 0);
  const totalReturns = portfolio.reduce((sum, p) => sum + p.returns, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <LineChartIcon className="w-6 h-6" />
              <span className="text-emerald-200 text-sm font-medium">INVESTMENT OPERATIONS</span>
            </div>
            <h1 className="text-2xl font-bold">Investment Dashboard</h1>
            <p className="text-emerald-100 mt-1">
              {user.tenantName} • {availableCalls.length} opportunities available
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-emerald-200">Portfolio Value</p>
            <p className="text-3xl font-bold">${(totalPortfolioValue / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-emerald-200 mt-1">
              +${(totalReturns / 1000).toFixed(0)}K returns
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard
          title="Active Investments"
          value={metrics?.activeInvestments || 0}
          icon={CheckCircle}
          color="emerald"
        />
        <StatCard
          title="Total Invested"
          value={`$${((metrics?.totalInvested || 0) / 1000000).toFixed(1)}M`}
          icon={DollarSign}
          color="blue"
          trend={12}
        />
        <StatCard
          title="Realized Returns"
          value={`$${((metrics?.realizedReturns || 0) / 1000000).toFixed(2)}M`}
          icon={TrendingUp}
          color="green"
          trend={8}
        />
        <StatCard
          title="Portfolio Yield"
          value={`${metrics?.portfolioYield || 0}%`}
          icon={Percent}
          color="purple"
        />
        <StatCard
          title="Available Calls"
          value={metrics?.availableCalls || 0}
          icon={Target}
          color="amber"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 shadow-sm">
        {[
          { id: 'opportunities', label: 'Opportunities', icon: Target, count: availableCalls.length },
          { id: 'portfolio', label: 'My Portfolio', icon: Landmark, count: portfolio.length },
          { id: 'impact', label: 'Impact Metrics', icon: Globe },
          { id: 'analytics', label: 'Analytics', icon: LineChartIcon }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white'
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

      {/* Opportunities Tab */}
      {activeTab === 'opportunities' && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by bank or currency..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="all">All Currencies</option>
              <option value="KES:JPY">KES:JPY</option>
              <option value="KES:CHF">KES:CHF</option>
            </select>
            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="yield">Sort by Yield</option>
              <option value="maturity">Sort by Maturity</option>
              <option value="amount">Sort by Amount</option>
            </select>
          </div>

          {availableCalls.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">No opportunities available</h3>
              <p className="text-gray-600 mt-2">Check back later for new investment calls.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableCalls.map(call => (
                <CallCard
                  key={call.callId}
                  call={call}
                  onBid={handleBid}
                  onView={handleViewCall}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Portfolio Tab */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Active Investments</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank / Call ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invested</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yield</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maturity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Returns</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {portfolio.map(investment => (
                    <PortfolioItem key={investment.callId} investment={investment} />
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-gray-900">Total</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">${totalPortfolioValue.toLocaleString()}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">
                      {(portfolio.reduce((sum, p) => sum + p.yield, 0) / portfolio.length).toFixed(1)}% avg
                    </td>
                    <td className="px-4 py-3">-</td>
                    <td className="px-4 py-3">-</td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">+${totalReturns.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Impact Tab */}
      {activeTab === 'impact' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-6 h-6" />
              <h2 className="text-xl font-bold">Your Impact</h2>
            </div>
            <p className="text-emerald-100">
              Your investments have enabled financial access for thousands of underserved borrowers in frontier economies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{impactMetrics.borrowersReached.toLocaleString()}</p>
              <p className="text-gray-600 mt-1">Borrowers Reached</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                KES {(impactMetrics.loansEnabled / 1000000000).toFixed(1)}B
              </p>
              <p className="text-gray-600 mt-1">Credit Enabled</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{impactMetrics.avgInterestReduction}%</p>
              <p className="text-gray-600 mt-1">Avg Interest Rate Reduction</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Inclusion Impact</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">First-time borrowers reached</span>
                    <span className="font-medium">{impactMetrics.financialInclusion.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="w-4/5 h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">M2 money supply generated</span>
                    <span className="font-medium">KES {(impactMetrics.m2Generated / 1000000000).toFixed(1)}B</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="w-3/4 h-full bg-blue-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SDG Alignment</h3>
              <div className="space-y-3">
                {[
                  { sdg: 'SDG 1', name: 'No Poverty', score: 85 },
                  { sdg: 'SDG 8', name: 'Decent Work & Economic Growth', score: 92 },
                  { sdg: 'SDG 10', name: 'Reduced Inequalities', score: 78 }
                ].map(item => (
                  <div key={item.sdg} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-900 w-16">{item.sdg}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">{item.name}</span>
                        <span>{item.score}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Returns Trend */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Returns Over Time</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={returnsTrend}>
                  <defs>
                    <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value}K`} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="returns"
                    stroke="#10B981"
                    fill="url(#colorReturns)"
                    name="Cumulative Returns ($K)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Portfolio Allocation */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Allocation</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={portfolio.map(p => ({ name: p.bankName, value: p.amount }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {portfolio.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={['#8B5CF6', '#3B82F6', '#10B981'][index % 3]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-gray-600">Portfolio Yield</p>
                <p className="text-2xl font-bold text-emerald-600">{metrics?.portfolioYield}%</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Avg Investment Size</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${(totalPortfolioValue / portfolio.length / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Return on Investment</p>
                <p className="text-2xl font-bold text-purple-600">
                  {((totalReturns / totalPortfolioValue) * 100).toFixed(2)}%
                </p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-gray-600">Avg Maturity</p>
                <p className="text-2xl font-bold text-amber-600">8.2 months</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Placeholder for Users icon
const Users: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

export default InvestorAnalystDashboard;
