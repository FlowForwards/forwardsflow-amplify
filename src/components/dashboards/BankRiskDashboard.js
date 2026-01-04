// BankRiskDashboard.js - Credit Risk Analyst Dashboard
import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  RefreshCw,
  Search,
  Eye,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Gauge,
  ShieldAlert,
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
  ScatterChart,
  Scatter
} from 'recharts';
import { db } from '../../services/DatabaseService';
import { useAuth } from '../../context/AuthContext';
import AmazonQChat from '../chat/AmazonQChat';

const StatCard = ({ title, value, icon: Icon, color, trend, alert }) => {
  const colorClasses = {
    rose: 'bg-rose-100 text-rose-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600'
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm p-5 border ${alert ? 'border-rose-300' : 'border-gray-100'}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend >= 0 ? 'text-red-600' : 'text-green-600'}`}>
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

const BankRiskDashboard = () => {
  const { user, tenant } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [metrics, setMetrics] = useState(null);
  const [loans, setLoans] = useState([]);

  // Risk metrics
  const [riskMetrics] = useState({
    defaultRate: 2.8,
    nplRatio: 3.2,
    provisioningRatio: 125,
    riskWeightedAssets: 8500000000,
    expectedLoss: 85000000,
    var95: 120000000,
    avgCreditScore: 685,
    avgRiskRating: 'Medium'
  });

  // Credit score distribution
  const [scoreDistribution] = useState([
    { range: '300-500', count: 120, risk: 'High' },
    { range: '500-600', count: 450, risk: 'Medium-High' },
    { range: '600-700', count: 1200, risk: 'Medium' },
    { range: '700-800', count: 2100, risk: 'Low' },
    { range: '800-900', count: 650, risk: 'Very Low' }
  ]);

  // Default trend
  const [defaultTrend] = useState([
    { month: 'Jul', rate: 3.2, target: 3.0 },
    { month: 'Aug', rate: 3.1, target: 3.0 },
    { month: 'Sep', rate: 2.9, target: 3.0 },
    { month: 'Oct', rate: 3.0, target: 3.0 },
    { month: 'Nov', rate: 2.8, target: 3.0 },
    { month: 'Dec', rate: 2.8, target: 3.0 }
  ]);

  // Portfolio concentration
  const [concentration] = useState([
    { sector: 'Retail Trade', exposure: 35, limit: 40 },
    { sector: 'Agriculture', exposure: 25, limit: 30 },
    { sector: 'Services', exposure: 20, limit: 25 },
    { sector: 'Transport', exposure: 12, limit: 15 },
    { sector: 'Manufacturing', exposure: 8, limit: 15 }
  ]);

  const loadData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const dashboardData = await db.getDashboardData(user.role, user.tenantId);
      setMetrics(dashboardData?.metrics || {});
      setLoans(dashboardData?.loans || []);
    } catch (error) {
      console.error('Error loading risk data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user.tenantId]);

  const defaultedLoans = loans.filter(l => l.status === 'defaulted');
  const overdueLoans = loans.filter(l => l.status === 'overdue');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading risk analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-rose-800 rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-6 h-6" />
              <span className="text-rose-200 text-sm font-medium">CREDIT RISK MANAGEMENT</span>
            </div>
            <h1 className="text-2xl font-bold">Risk Analytics Dashboard</h1>
            <p className="text-rose-100 mt-1">
              {tenant?.name || 'Bank'} • Portfolio Risk Monitoring
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-rose-200">Portfolio Default Rate</p>
            <p className="text-3xl font-bold">{riskMetrics.defaultRate}%</p>
            <p className="text-sm text-rose-200 mt-1">Target: 3.0%</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Default Rate"
          value={`${riskMetrics.defaultRate}%`}
          icon={AlertTriangle}
          color="rose"
          trend={-5}
        />
        <StatCard
          title="NPL Ratio"
          value={`${riskMetrics.nplRatio}%`}
          icon={ShieldAlert}
          color="amber"
        />
        <StatCard
          title="Avg Credit Score"
          value={riskMetrics.avgCreditScore}
          icon={Target}
          color="blue"
        />
        <StatCard
          title="VaR (95%)"
          value={`KES ${(riskMetrics.var95 / 1000000).toFixed(0)}M`}
          icon={Gauge}
          color="rose"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 shadow-sm overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'portfolio', label: 'Portfolio Risk', icon: PieChartIcon },
          { id: 'scoring', label: 'Credit Scoring', icon: Target },
          { id: 'defaults', label: 'Default Analysis', icon: AlertTriangle },
          { id: 'stress', label: 'Stress Testing', icon: BarChart3 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-rose-600 text-white'
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
            {/* Default Rate Trend */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Default Rate Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={defaultTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Line type="monotone" dataKey="rate" stroke="#E11D48" strokeWidth={2} name="Actual" />
                  <Line type="monotone" dataKey="target" stroke="#10B981" strokeDasharray="5 5" name="Target" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Credit Score Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Credit Score Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#E11D48" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-rose-50 rounded-lg">
                <p className="text-sm text-gray-600">Risk Weighted Assets</p>
                <p className="text-xl font-bold text-rose-600">KES {(riskMetrics.riskWeightedAssets / 1000000000).toFixed(1)}B</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-gray-600">Expected Loss</p>
                <p className="text-xl font-bold text-amber-600">KES {(riskMetrics.expectedLoss / 1000000).toFixed(0)}M</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Provisioning Ratio</p>
                <p className="text-xl font-bold text-blue-600">{riskMetrics.provisioningRatio}%</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Avg Risk Rating</p>
                <p className="text-xl font-bold text-green-600">{riskMetrics.avgRiskRating}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Risk Tab */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sector Concentration</h3>
            <div className="space-y-4">
              {concentration.map(sector => (
                <div key={sector.sector}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{sector.sector}</span>
                    <span className="font-medium">{sector.exposure}% / {sector.limit}% limit</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        sector.exposure >= sector.limit ? 'bg-red-500' :
                        sector.exposure >= sector.limit * 0.8 ? 'bg-amber-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${(sector.exposure / sector.limit) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Rating Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Low Risk', value: 45 },
                      { name: 'Medium Risk', value: 35 },
                      { name: 'High Risk', value: 15 },
                      { name: 'Very High', value: 5 }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                  >
                    <Cell fill="#10B981" />
                    <Cell fill="#F59E0B" />
                    <Cell fill="#EF4444" />
                    <Cell fill="#7F1D1D" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Maturity Profile</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[
                  { period: '0-30d', value: 1200 },
                  { period: '31-60d', value: 800 },
                  { period: '61-90d', value: 600 },
                  { period: '91-180d', value: 400 },
                  { period: '180d+', value: 200 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Credit Scoring Tab */}
      {activeTab === 'scoring' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Credit Score Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score Range</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrowers</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Level</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Default Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exposure</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {scoreDistribution.map((dist, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{dist.range}</td>
                      <td className="px-4 py-3 text-gray-600">{dist.count.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          dist.risk === 'Very Low' ? 'bg-green-100 text-green-700' :
                          dist.risk === 'Low' ? 'bg-blue-100 text-blue-700' :
                          dist.risk === 'Medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {dist.risk}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {dist.risk === 'High' ? '12.5%' :
                         dist.risk === 'Medium-High' ? '6.2%' :
                         dist.risk === 'Medium' ? '2.8%' :
                         dist.risk === 'Low' ? '0.8%' : '0.2%'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        KES {((dist.count * 50000) / 1000000).toFixed(0)}M
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Defaults Tab */}
      {activeTab === 'defaults' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200">
              <h4 className="font-medium text-gray-900 mb-2">Defaulted Loans</h4>
              <p className="text-3xl font-bold text-red-600">{defaultedLoans.length}</p>
              <p className="text-sm text-gray-500 mt-1">Total exposure: KES 12.5M</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-amber-200">
              <h4 className="font-medium text-gray-900 mb-2">Overdue (1-30 days)</h4>
              <p className="text-3xl font-bold text-amber-600">{overdueLoans.length}</p>
              <p className="text-sm text-gray-500 mt-1">Early warning stage</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-green-200">
              <h4 className="font-medium text-gray-900 mb-2">Recovery Rate</h4>
              <p className="text-3xl font-bold text-green-600">68%</p>
              <p className="text-sm text-gray-500 mt-1">Last 12 months</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Default Analysis by Factor</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { factor: 'Low Credit Score', percentage: 35 },
                { factor: 'Income Instability', percentage: 25 },
                { factor: 'Previous Default', percentage: 20 },
                { factor: 'High DTI Ratio', percentage: 12 },
                { factor: 'Short Employment', percentage: 8 }
              ]} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 40]} />
                <YAxis type="category" dataKey="factor" width={120} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="percentage" fill="#E11D48" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Stress Testing Tab */}
      {activeTab === 'stress' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stress Test Scenarios</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scenario</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Default Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected Loss</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capital Impact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { scenario: 'Base Case', defaultRate: '2.8%', loss: 'KES 85M', impact: '-2.1%', status: 'Pass' },
                    { scenario: 'Mild Recession', defaultRate: '5.5%', loss: 'KES 165M', impact: '-4.2%', status: 'Pass' },
                    { scenario: 'Severe Recession', defaultRate: '9.2%', loss: 'KES 276M', impact: '-7.0%', status: 'Pass' },
                    { scenario: 'Economic Crisis', defaultRate: '15.0%', loss: 'KES 450M', impact: '-11.4%', status: 'Watch' }
                  ].map((test, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{test.scenario}</td>
                      <td className="px-4 py-3 text-gray-600">{test.defaultRate}</td>
                      <td className="px-4 py-3 text-gray-600">{test.loss}</td>
                      <td className="px-4 py-3 text-red-600">{test.impact}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          test.status === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {test.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900">Stress Testing Note</p>
                <p className="text-sm text-amber-700 mt-1">
                  Stress tests are run monthly. Economic crisis scenario shows potential capital impact requiring 
                  monitoring. Recommend reviewing concentration limits in high-risk sectors.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Assistant */}
      <AmazonQChat userRole="bank_risk" tenantId="default" />
    </div>
  );
};

export default BankRiskDashboard;
