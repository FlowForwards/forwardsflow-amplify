// BankCallerDashboard.tsx - Capital Markets Officer Dashboard
// Place in: src/components/dashboards/BankCallerDashboard.tsx

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Landmark,
  Clock,
  CheckCircle,
  Plus,
  Eye,
  Edit,
  RefreshCw,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Users,
  FileText,
  MessageSquare,
  Send
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
import { apiService, DepositCall, BankMetrics } from '../../services/apiService';
import AmazonQChat from '../chat/AmazonQChat';

interface User {
  tenantId: string;
  tenantName: string;
  name: string;
}

interface BankCallerDashboardProps {
  user: User;
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: number;
}> = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses: Record<string, string> = {
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
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

const BankCallerDashboard: React.FC<BankCallerDashboardProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'create' | 'active' | 'negotiations' | 'settlements'>('overview');
  
  const [metrics, setMetrics] = useState<BankMetrics | null>(null);
  const [calls, setCalls] = useState<DepositCall[]>([]);

  // Mock negotiations data
  const [negotiations] = useState([
    { id: 'NEG-001', callId: 'CALL-001', investor: 'Impact Capital Partners', amount: 100000000, proposedRate: 9.2, status: 'pending', createdAt: '2 hours ago' },
    { id: 'NEG-002', callId: 'CALL-001', investor: 'Shell Foundation', amount: 150000000, proposedRate: 8.8, status: 'countered', createdAt: '4 hours ago' },
    { id: 'NEG-003', callId: 'CALL-003', investor: 'Green Finance Fund', amount: 50000000, proposedRate: 10.2, status: 'accepted', createdAt: '1 day ago' }
  ]);

  // Mock settlements
  const [settlements] = useState([
    { id: 'SET-001', callId: 'CALL-002', investor: 'Impact Capital Partners', amount: 200000000, currency: 'CHF', status: 'completed', date: '2024-11-15' },
    { id: 'SET-002', callId: 'CALL-001', investor: 'Shell Foundation', amount: 100000000, currency: 'JPY', status: 'pending', date: '2024-12-20' }
  ]);

  const loadData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [metricsData, callsData] = await Promise.all([
        apiService.getBankMetrics(user.tenantId),
        apiService.getDepositCalls(user.tenantId)
      ]);

      setMetrics(metricsData);
      setCalls(callsData);
    } catch (error) {
      console.error('Error loading capital data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user.tenantId]);

  const openCalls = calls.filter(c => c.status === 'open' || c.status === 'partially_subscribed');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading capital markets data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-6 h-6" />
              <span className="text-indigo-200 text-sm font-medium">CAPITAL MARKETS</span>
            </div>
            <h1 className="text-2xl font-bold">Capital Call Operations</h1>
            <p className="text-indigo-100 mt-1">
              {user.tenantName} • {openCalls.length} active calls
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-indigo-200">Total Deposits Raised</p>
            <p className="text-3xl font-bold">¥{((metrics?.totalDepositValue || 0) / 1000000).toFixed(0)}M</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Active Calls"
          value={openCalls.length}
          icon={TrendingUp}
          color="indigo"
        />
        <StatCard
          title="Total Raised"
          value={`¥${((metrics?.totalDepositValue || 0) / 1000000).toFixed(0)}M`}
          icon={DollarSign}
          color="green"
          trend={12}
        />
        <StatCard
          title="Active Investors"
          value={5}
          icon={Landmark}
          color="blue"
        />
        <StatCard
          title="Pending Negotiations"
          value={negotiations.filter(n => n.status === 'pending' || n.status === 'countered').length}
          icon={MessageSquare}
          color="amber"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 shadow-sm overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'create', label: 'Create Call', icon: Plus },
          { id: 'active', label: 'Active Calls', icon: Clock },
          { id: 'negotiations', label: 'Negotiations', icon: MessageSquare },
          { id: 'settlements', label: 'Settlements', icon: CheckCircle }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white'
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
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Calls */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Deposit Calls</h3>
              <div className="space-y-3">
                {calls.slice(0, 3).map(call => (
                  <div key={call.callId} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{call.callId}</p>
                        <p className="text-sm text-gray-500">{call.currencyPair} • {call.instrumentType}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        call.status === 'open' ? 'bg-green-100 text-green-700' :
                        call.status === 'fully_subscribed' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {call.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">¥{(call.principalAmount / 1000000).toFixed(0)}M @ {call.totalYield}%</span>
                      <span className="text-indigo-600 font-medium">{call.subscriptionPercentage}% filled</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Investor Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Investor Activity</h3>
              <div className="space-y-3">
                {negotiations.map(neg => (
                  <div key={neg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Landmark className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{neg.investor}</p>
                        <p className="text-xs text-gray-500">{neg.createdAt}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">¥{(neg.amount / 1000000).toFixed(0)}M</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        neg.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        neg.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {neg.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Call Tab */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Create New Deposit Call</h3>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instrument Type</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="fixed_deposit">Fixed Deposit</option>
                  <option value="time_deposit">Time Deposit</option>
                  <option value="certificate_of_deposit">Certificate of Deposit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency Pair</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="KES:JPY">KES:JPY (Japanese Yen)</option>
                  <option value="KES:CHF">KES:CHF (Swiss Franc)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Principal Amount</label>
                <input type="number" placeholder="500,000,000" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                <input type="number" step="0.1" placeholder="8.5" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maturity (Days)</label>
                <input type="number" placeholder="365" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Forwards Premium (%)</label>
                <input type="number" step="0.1" placeholder="1.2" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <Send className="w-4 h-4" />
                Create Call
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Calls Tab */}
      {activeTab === 'active' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Active Deposit Calls</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Call ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Currency</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Principal</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yield</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscription</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maturity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {calls.map(call => (
                  <tr key={call.callId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{call.callId}</td>
                    <td className="px-4 py-3 text-gray-600">{call.instrumentType.replace('_', ' ')}</td>
                    <td className="px-4 py-3 text-gray-600">{call.currencyPair}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">¥{(call.principalAmount / 1000000).toFixed(0)}M</td>
                    <td className="px-4 py-3 text-green-600 font-medium">{call.totalYield}%</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${call.subscriptionPercentage}%` }} />
                        </div>
                        <span className="text-sm text-gray-600">{call.subscriptionPercentage}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{call.maturityDate}</td>
                    <td className="px-4 py-3">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Negotiations Tab */}
      {activeTab === 'negotiations' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Active Negotiations</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {negotiations.map(neg => (
              <div key={neg.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Landmark className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{neg.investor}</p>
                      <p className="text-sm text-gray-500">Call: {neg.callId} • {neg.createdAt}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">¥{(neg.amount / 1000000).toFixed(0)}M</p>
                    <p className="text-sm text-indigo-600">Proposed: {neg.proposedRate}%</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      neg.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      neg.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {neg.status}
                    </span>
                    {neg.status !== 'accepted' && (
                      <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm">
                        Respond
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settlements Tab */}
      {activeTab === 'settlements' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Settlement History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Settlement ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Call</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {settlements.map(set => (
                  <tr key={set.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{set.id}</td>
                    <td className="px-4 py-3 text-gray-600">{set.callId}</td>
                    <td className="px-4 py-3 text-gray-600">{set.investor}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {set.currency === 'JPY' ? '¥' : 'CHF '}{(set.amount / 1000000).toFixed(0)}M
                    </td>
                    <td className="px-4 py-3 text-gray-600">{set.date}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        set.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {set.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Amazon Q AI Assistant */}
      <AmazonQChat 
        userRole="bank_caller" 
        tenantId={user.tenantId}
        dashboardMetrics={{
          activeCalls: openCalls.length,
          totalRaised: metrics?.totalDepositValue || 0,
          pendingNegotiations: negotiations.filter(n => n.status === 'pending' || n.status === 'countered').length,
          activeInvestors: 5
        }}
      />
    </div>
  );
};



