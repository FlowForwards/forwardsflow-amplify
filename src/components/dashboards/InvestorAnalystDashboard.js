import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign, TrendingUp, Search, Filter, Eye, ChevronRight, MapPin,
  Building2, Briefcase, Target, BarChart3, FileText, Star, Clock
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { db } from '../../services/DatabaseService';
import { useAuth } from '../../context/AuthContext';

// Stat Card
const StatCard = ({ icon: Icon, label, value, trend, color = 'blue' }) => {
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
        {trend !== undefined && (
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>{trend}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  );
};

// Opportunity Card for Analyst View
const OpportunityCard = ({ opportunity, onAnalyze, onRecommend }) => {
  const getRiskLevel = (nplRate) => {
    if (nplRate < 3) return { level: 'Low', color: 'bg-green-100 text-green-700' };
    if (nplRate < 5) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-700' };
    return { level: 'High', color: 'bg-red-100 text-red-700' };
  };

  const risk = getRiskLevel(opportunity.projectedNPL || 2.5);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">{opportunity.bankName}</span>
          </div>
          <h4 className="font-semibold text-gray-900">${(opportunity.amount / 1000000).toFixed(0)}M Capital Call</h4>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${risk.color}`}>
          {risk.level} Risk
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Yield</p>
          <p className="font-semibold text-green-600">{opportunity.interestRate}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Term</p>
          <p className="font-semibold text-gray-900">{opportunity.maturityMonths}mo</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Projected NPL</p>
          <p className="font-semibold text-gray-900">{opportunity.projectedNPL || 2.5}%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
        <div>
          <p className="text-xs text-gray-500">Lending Yield</p>
          <p className="text-sm font-medium text-gray-900">{opportunity.projectedLendingYield || 32}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">FX Hedge</p>
          <p className="text-sm font-medium text-gray-900">{opportunity.hedgingFee || 2}%</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => onAnalyze(opportunity)} className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-1">
          <Eye className="w-4 h-4" />
          Analyze
        </button>
        <button onClick={() => onRecommend(opportunity)} className="flex-1 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 flex items-center justify-center gap-1">
          <Star className="w-4 h-4" />
          Recommend
        </button>
      </div>
    </div>
  );
};

// Analysis Checklist Item
const ChecklistItem = ({ label, completed, note }) => (
  <div className={`flex items-start gap-3 p-3 rounded-lg ${completed ? 'bg-green-50' : 'bg-gray-50'}`}>
    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${completed ? 'bg-green-500' : 'bg-gray-300'}`}>
      {completed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
    </div>
    <div>
      <p className={`text-sm font-medium ${completed ? 'text-green-800' : 'text-gray-700'}`}>{label}</p>
      {note && <p className="text-xs text-gray-500 mt-0.5">{note}</p>}
    </div>
  </div>
);

const InvestorAnalystDashboard = () => {
  const { user, tenant } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

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

  // Filter opportunities
  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.bankName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'all' || 
      (riskFilter === 'low' && (opp.projectedNPL || 2.5) < 3) ||
      (riskFilter === 'medium' && (opp.projectedNPL || 2.5) >= 3 && (opp.projectedNPL || 2.5) < 5) ||
      (riskFilter === 'high' && (opp.projectedNPL || 2.5) >= 5);
    return matchesSearch && matchesRisk && opp.status === 'published';
  });

  // Analysis checklist for current opportunity
  const analysisChecklist = [
    { label: 'Bank Credit Rating Review', completed: true, note: 'Reviewed CBK reports' },
    { label: 'Mobile Lending Portfolio Analysis', completed: true, note: 'NPL rate within tolerance' },
    { label: 'FX Risk Assessment', completed: true, note: 'Hedging strategy validated' },
    { label: 'Regulatory Compliance Check', completed: false, note: 'Pending CBK license verification' },
    { label: 'Impact Metrics Validation', completed: false, note: 'Awaiting borrower data' },
  ];

  // Yield comparison data
  const yieldComparisonData = [
    { category: 'US Treasuries', yield: 4.5 },
    { category: 'Corp Bonds', yield: 5.8 },
    { category: 'EM Bonds', yield: 7.2 },
    { category: 'This Opportunity', yield: 15.0 },
  ];

  const COLORS = ['#94a3b8', '#64748b', '#6366f1', '#10b981'];

  const stats = [
    { icon: Target, label: 'Opportunities Reviewed', value: '12', color: 'blue' },
    { icon: Star, label: 'Recommendations Made', value: '5', color: 'yellow' },
    { icon: FileText, label: 'Due Diligence Reports', value: '8', color: 'purple' },
    { icon: TrendingUp, label: 'Avg. Recommended Yield', value: '14.2%', color: 'green' },
  ];

  const handleAnalyze = (opportunity) => {
    setSelectedOpportunity(opportunity);
  };

  const handleRecommend = (opportunity) => {
    console.log('Recommending opportunity:', opportunity.id);
    // In production, this would send recommendation to admin
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investment Analysis</h1>
          <p className="text-gray-500 mt-1">{tenant?.name || 'Impact Capital'} • Analyst View</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <FileText className="w-4 h-4" />
            My Reports
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => <StatCard key={idx} {...stat} />)}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Opportunities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search & Filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>

          {/* Opportunities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOpportunities.map(opportunity => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                onAnalyze={handleAnalyze}
                onRecommend={handleRecommend}
              />
            ))}
          </div>

          {filteredOpportunities.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No opportunities match your criteria</p>
            </div>
          )}

          {/* Yield Comparison */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Yield Comparison</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={yieldComparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} width={120} />
                <Tooltip formatter={(v) => [`${v}%`, 'Yield']} />
                <Bar dataKey="yield" radius={[0, 4, 4, 0]}>
                  {yieldComparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column - Analysis Panel */}
        <div className="space-y-6">
          {/* Current Analysis */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Due Diligence Checklist</h3>
            {selectedOpportunity ? (
              <>
                <div className="mb-4 p-3 bg-primary-50 rounded-lg">
                  <p className="text-sm text-primary-800">Analyzing: {selectedOpportunity.bankName}</p>
                  <p className="text-xs text-primary-600">${(selectedOpportunity.amount / 1000000).toFixed(0)}M @ {selectedOpportunity.interestRate}%</p>
                </div>
                <div className="space-y-2">
                  {analysisChecklist.map((item, idx) => (
                    <ChecklistItem key={idx} {...item} />
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Completion: 60%</p>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Eye className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Select an opportunity to start analysis</p>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">My Recent Activity</h3>
            <div className="space-y-3">
              {[
                { action: 'Recommended', bank: 'Equity Africa Bank', time: '2h ago', status: 'pending' },
                { action: 'Analyzed', bank: 'Diamond Trust Bank', time: '1d ago', status: 'completed' },
                { action: 'Report Submitted', bank: 'KCB Group', time: '3d ago', status: 'approved' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.bank}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      activity.status === 'approved' ? 'bg-green-100 text-green-700' :
                      activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {activity.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Summary */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Current Portfolio</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Invested</span>
                <span className="font-semibold text-gray-900">${((metrics.totalInvested || 0) / 1000000).toFixed(1)}M</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Investments</span>
                <span className="font-semibold text-gray-900">{metrics.activeInvestments || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg. Yield</span>
                <span className="font-semibold text-green-600">{metrics.avgYield || 0}%</span>
              </div>
            </div>
            <Link to="/investor/investments" className="block w-full mt-4 py-2 text-sm font-medium text-center text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100">
              View Full Portfolio
            </Link>
          </div>

          {/* Quick Links */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-4">Resources</h3>
            <div className="space-y-2">
              <a href="#" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white">
                <FileText className="w-4 h-4" />
                Due Diligence Template
              </a>
              <a href="#" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white">
                <BarChart3 className="w-4 h-4" />
                Risk Assessment Guide
              </a>
              <a href="#" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white">
                <Target className="w-4 h-4" />
                Investment Criteria
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorAnalystDashboard;
