import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon,
  Target, Percent, DollarSign, Activity, Shield, Eye, Calculator
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { db } from '../../services/DatabaseService';
import { useAuth } from '../../context/AuthContext';

// Stat Card
const StatCard = ({ icon: Icon, label, value, trend, color = 'blue', warning }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className={`bg-white rounded-xl border ${warning ? 'border-red-200' : 'border-gray-100'} p-5`}>
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {warning && <AlertTriangle className="w-5 h-5 text-red-500" />}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 mt-2 text-sm ${trend >= 0 ? 'text-red-600' : 'text-green-600'}`}>
            {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(trend)}% vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Risk Gauge Component
const RiskGauge = ({ value, label, thresholds = { low: 30, medium: 60 } }) => {
  const getColor = () => {
    if (value <= thresholds.low) return 'text-green-600';
    if (value <= thresholds.medium) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBarColor = () => {
    if (value <= thresholds.low) return 'bg-green-500';
    if (value <= thresholds.medium) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        <span className={`text-lg font-bold ${getColor()}`}>{value}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${getBarColor()} rounded-full transition-all duration-500`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-400">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
    </div>
  );
};

// Vintage Cohort Row
const VintageRow = ({ cohort }) => (
  <tr className="border-b border-gray-50 hover:bg-gray-50">
    <td className="px-4 py-3 text-sm font-medium text-gray-900">{cohort.cohort}</td>
    <td className="px-4 py-3 text-sm text-gray-600">KES {(cohort.disbursed / 1000).toFixed(0)}K</td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${cohort.currentNPL > 3 ? 'bg-red-500' : cohort.currentNPL > 2 ? 'bg-yellow-500' : 'bg-green-500'}`} 
            style={{ width: `${Math.min(cohort.currentNPL * 10, 100)}%` }} 
          />
        </div>
        <span className={`text-sm font-medium ${cohort.currentNPL > 3 ? 'text-red-600' : cohort.currentNPL > 2 ? 'text-yellow-600' : 'text-green-600'}`}>
          {cohort.currentNPL}%
        </span>
      </div>
    </td>
    <td className="px-4 py-3">
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        cohort.currentNPL > 3 ? 'bg-red-100 text-red-700' : 
        cohort.currentNPL > 2 ? 'bg-yellow-100 text-yellow-700' : 
        'bg-green-100 text-green-700'
      }`}>
        {cohort.currentNPL > 3 ? 'At Risk' : cohort.currentNPL > 2 ? 'Monitor' : 'Healthy'}
      </span>
    </td>
  </tr>
);

const BankRiskDashboard = () => {
  const { user, tenant } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');

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
  const riskMetrics = metrics.riskMetrics || {};

  // Credit score distribution for chart
  const creditDistribution = metrics.creditScoreDistribution || [];

  // NPL trend data
  const nplTrendData = [
    { month: 'Jun', npl: 2.1 },
    { month: 'Jul', npl: 2.3 },
    { month: 'Aug', npl: 2.5 },
    { month: 'Sep', npl: 2.4 },
    { month: 'Oct', npl: 2.6 },
    { month: 'Nov', npl: 2.8 },
  ];

  // Exposure by segment
  const exposureData = [
    { segment: 'Micro (<5K)', exposure: 35, count: 420 },
    { segment: 'Small (5-15K)', exposure: 40, count: 280 },
    { segment: 'Medium (15-50K)', exposure: 20, count: 95 },
    { segment: 'Large (>50K)', exposure: 5, count: 12 },
  ];

  const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444'];

  const stats = [
    { icon: AlertTriangle, label: 'Portfolio at Risk', value: `${riskMetrics.portfolioAtRisk || 8.5}%`, color: riskMetrics.portfolioAtRisk > 10 ? 'red' : 'yellow', warning: riskMetrics.portfolioAtRisk > 10 },
    { icon: Percent, label: 'Expected Loss', value: `${riskMetrics.expectedLoss || 2.1}%`, color: 'purple' },
    { icon: Target, label: 'Concentration Risk', value: `${riskMetrics.exposureConcentration || 12.3}%`, color: 'blue' },
    { icon: DollarSign, label: 'Largest Exposure', value: `KES ${((riskMetrics.largestExposure || 85000) / 1000).toFixed(0)}K`, color: 'green' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Credit Risk Dashboard</h1>
          <p className="text-gray-500 mt-1">{tenant?.name || 'Bank'} • Portfolio Risk Analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Stress Test
          </button>
          <button className="btn-primary !w-auto flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Risk Report
          </button>
        </div>
      </div>

      {/* Risk Alert Banner */}
      {(riskMetrics.portfolioAtRisk || 8.5) > 10 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-red-800">Portfolio at Risk Exceeds Threshold</p>
            <p className="text-sm text-red-600">Current PAR is above the 10% risk tolerance. Review underperforming segments.</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">
            View Details
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => <StatCard key={idx} {...stat} />)}
      </div>

      {/* Risk Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RiskGauge value={riskMetrics.portfolioAtRisk || 8.5} label="Portfolio at Risk (PAR 30)" thresholds={{ low: 5, medium: 10 }} />
        <RiskGauge value={metrics.nplRate || 2.8} label="Non-Performing Loans" thresholds={{ low: 3, medium: 5 }} />
        <RiskGauge value={riskMetrics.exposureConcentration || 12.3} label="Concentration Risk" thresholds={{ low: 15, medium: 25 }} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* NPL Trend */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">NPL Trend (6 Months)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={nplTrendData}>
                <defs>
                  <linearGradient id="nplGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `${v}%`} domain={[0, 5]} />
                <Tooltip formatter={(v) => [`${v}%`, 'NPL Rate']} />
                <Area type="monotone" dataKey="npl" stroke="#ef4444" strokeWidth={2} fill="url(#nplGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Credit Score Distribution */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Credit Score Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={creditDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Vintage Analysis */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Vintage Performance Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cohort</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disbursed</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current NPL</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(riskMetrics.vintagePerformance || []).map((cohort, idx) => (
                    <VintageRow key={idx} cohort={cohort} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Exposure by Segment */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Exposure by Segment</h3>
            <div className="flex justify-center mb-4">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={exposureData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="exposure">
                    {exposureData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {exposureData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                    <span className="text-sm text-gray-600">{item.segment}</span>
                  </div>
                  <span className="text-sm font-medium">{item.exposure}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Limits */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Risk Limits</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Max Single Exposure</span>
                  <span className="text-sm font-medium">KES 100K</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">Current: KES 85K</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Sector Concentration</span>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: '49%' }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">Current: 12.3%</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">NPL Threshold</span>
                  <span className="text-sm font-medium">5%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '56%' }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">Current: 2.8%</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-4">Risk Actions</h3>
            <div className="space-y-3">
              <button className="w-full py-2.5 text-sm font-medium bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                Run Stress Test
              </button>
              <button className="w-full py-2.5 text-sm font-medium bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                Update Risk Models
              </button>
              <button className="w-full py-2.5 text-sm font-medium bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                Set New Limits
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankRiskDashboard;
