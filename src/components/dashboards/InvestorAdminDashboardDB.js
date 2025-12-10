/**
 * Investor Admin Dashboard - Connected to DynamoDB
 * Investment opportunities, portfolio management, team management
 */

import React, { useState, useEffect } from 'react';
import {
  Briefcase, Users, TrendingUp, DollarSign, Globe, Search,
  Filter, Download, RefreshCw, Bell, Settings, Plus, Eye,
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle, FileText,
  Building2, Calendar, PieChart as PieChartIcon,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { 
  useData, 
  useInvestorMetrics, 
  useCapitalCalls, 
  useInvestments,
  useNotifications 
} from '../../context/DataContext';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

const StatCard = ({ title, value, subtitle, change, changeType, icon: Icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        {change !== undefined && (
          <div className={`flex items-center mt-2 ${changeType === 'positive' ? 'text-green-600' : 'text-red-500'}`}>
            {changeType === 'positive' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            <span className="text-sm font-medium ml-1">{change}%</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

// Opportunity Card Component
const OpportunityCard = ({ call, onInvest }) => {
  const fundingPct = call.subscribedPct || 0;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-gray-900">{call.bank?.name || 'Bank'}</h3>
            <p className="text-sm text-gray-500">{call.bank?.country || 'Kenya'}</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          call.bank?.moodysRating?.startsWith('A') ? 'bg-green-100 text-green-800' :
          call.bank?.moodysRating?.startsWith('B') ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {call.bank?.moodysRating || 'NR'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Amount</p>
          <p className="font-semibold text-gray-900">${(call.amount / 1000000).toFixed(1)}M</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Yield</p>
          <p className="font-semibold text-green-600">{call.projectedYield || call.interestRate}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Term</p>
          <p className="font-semibold text-gray-900">{call.maturityMonths}mo</p>
        </div>
      </div>

      {/* Funding Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500">Funded</span>
          <span className="font-medium text-gray-900">{fundingPct.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(fundingPct, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          Expires {call.expiresAt ? new Date(call.expiresAt).toLocaleDateString() : 'N/A'}
        </span>
        <span>{call.intendedUse || 'Mobile Lending'}</span>
      </div>

      <button
        onClick={() => onInvest(call)}
        className="w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
      >
        Invest Now
      </button>
    </div>
  );
};

export default function InvestorAdminDashboard() {
  const { user } = useAuth();
  const { 
    createInvestment, 
    submitKyc,
    listUsersByOrganization,
    createUser,
    subscribeToCapitalCalls,
  } = useData();

  const { metrics } = useInvestorMetrics(user?.orgId);
  const { calls: opportunities } = useCapitalCalls(null, true); // Published calls only
  const { investments } = useInvestments(user?.orgId);
  const { notifications, unreadCount, markAllRead } = useNotifications(user?.userId);

  const [activeTab, setActiveTab] = useState('opportunities');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [team, setTeam] = useState([]);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);

  // Load team members
  useEffect(() => {
    if (user?.orgId) {
      loadTeam();
    }
  }, [user?.orgId]);

  // Subscribe to new opportunities
  useEffect(() => {
    const subscription = subscribeToCapitalCalls((newCall) => {
      console.log('New opportunity:', newCall);
      // Could show toast notification
    });

    return () => subscription?.unsubscribe?.();
  }, [subscribeToCapitalCalls]);

  const loadTeam = async () => {
    try {
      const result = await listUsersByOrganization(user.orgId);
      setTeam(result?.items || []);
    } catch (error) {
      console.error('Error loading team:', error);
    }
  };

  const handleInvest = (call) => {
    setSelectedCall(call);
    setShowInvestModal(true);
  };

  const handleSubmitInvestment = async (investmentData) => {
    try {
      await createInvestment({
        callId: selectedCall.callId,
        investorOrgId: user.orgId,
        amount: investmentData.amount,
      });
      setShowInvestModal(false);
      setSelectedCall(null);
    } catch (error) {
      alert('Error creating investment: ' + error.message);
    }
  };

  const handleAddTeamMember = async (memberData) => {
    try {
      await createUser({
        ...memberData,
        orgId: user.orgId,
      });
      await loadTeam();
      setShowAddTeamModal(false);
    } catch (error) {
      alert('Error adding team member: ' + error.message);
    }
  };

  const formatCurrency = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  // Portfolio allocation chart data
  const portfolioAllocation = metrics?.portfolioByBank || [];

  // Yield history chart data
  const yieldHistory = metrics?.yieldHistory || [];

  // Filter opportunities
  const filteredOpportunities = opportunities.filter(call =>
    call.bank?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.bank?.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-indigo-600" />
              <div className="ml-3">
                <span className="text-xl font-bold text-gray-900">{user?.orgName || 'Investor'}</span>
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded">
                  ADMIN
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <RefreshCw className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <div className="flex items-center border-l border-gray-200 pl-4">
                <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-600">{user?.name?.charAt(0)}</span>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'opportunities', label: 'Opportunities', icon: Globe },
              { id: 'portfolio', label: 'Portfolio', icon: PieChartIcon },
              { id: 'investments', label: 'Investments', icon: TrendingUp },
              { id: 'team', label: 'Team', icon: Users },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Invested"
            value={formatCurrency(metrics?.totalInvested || 5200000)}
            change={8.2}
            changeType="positive"
            icon={DollarSign}
            color="bg-indigo-500"
          />
          <StatCard
            title="Active Instruments"
            value={metrics?.activeInstruments || investments.filter(i => i.status === 'ACTIVE').length}
            subtitle={`${metrics?.pendingMaturity || 2} maturing soon`}
            icon={FileText}
            color="bg-blue-500"
          />
          <StatCard
            title="Avg Yield"
            value={`${metrics?.avgYield || 12.5}%`}
            change={0.8}
            changeType="positive"
            icon={TrendingUp}
            color="bg-green-500"
          />
          <StatCard
            title="Portfolio Growth"
            value={`${metrics?.portfolioGrowth || 8.2}%`}
            subtitle="Year to date"
            icon={ArrowUpRight}
            color="bg-purple-500"
          />
        </div>

        {/* Opportunities Tab */}
        {activeTab === 'opportunities' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Available Opportunities ({filteredOpportunities.length})
              </h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search banks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <Filter className="h-4 w-4 mr-2" /> Filter
                </button>
              </div>
            </div>

            {filteredOpportunities.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <Globe className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No investment opportunities available</p>
                <p className="text-sm text-gray-400 mt-1">Check back soon for new capital calls</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOpportunities.map(call => (
                  <OpportunityCard key={call.callId} call={call} onInvest={handleInvest} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Portfolio Allocation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Allocation</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={portfolioAllocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="amount"
                      nameKey="bank"
                      label={({ bank, percent }) => `${bank}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {portfolioAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Yield History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Yield Performance</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={yieldHistory}>
                    <defs>
                      <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Yield']} />
                    <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2} fill="url(#yieldGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Investments Tab */}
        {activeTab === 'investments' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Active Investments</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yield</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maturity</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {investments.map(inv => (
                    <tr key={inv.investmentId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {inv.txnRef}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {inv.capitalCall?.bank?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(inv.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        {inv.interestRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          inv.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          inv.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          inv.status === 'KYC_SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {inv.maturityDate ? new Date(inv.maturityDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900">View</button>
                      </td>
                    </tr>
                  ))}
                  {investments.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        <TrendingUp className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <p>No investments yet</p>
                        <button
                          onClick={() => setActiveTab('opportunities')}
                          className="mt-2 text-indigo-600 hover:text-indigo-700"
                        >
                          Browse opportunities →
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                <button
                  onClick={() => setShowAddTeamModal(true)}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Member
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {team.map(member => (
                    <tr key={member.userId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-indigo-600">{member.name?.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          member.role === 'INVESTOR_ADMIN' ? 'bg-indigo-100 text-indigo-800' : 'bg-cyan-100 text-cyan-800'
                        }`}>
                          {member.role?.replace('INVESTOR_', '')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          member.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.lastLogin ? new Date(member.lastLogin).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Investment Modal */}
      {showInvestModal && selectedCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">Invest in {selectedCall.bank?.name}</h3>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Target:</span>
                  <span className="ml-2 font-medium">{formatCurrency(selectedCall.amount)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Yield:</span>
                  <span className="ml-2 font-medium text-green-600">{selectedCall.projectedYield}%</span>
                </div>
                <div>
                  <span className="text-gray-500">Term:</span>
                  <span className="ml-2 font-medium">{selectedCall.maturityMonths} months</span>
                </div>
                <div>
                  <span className="text-gray-500">Subscribed:</span>
                  <span className="ml-2 font-medium">{selectedCall.subscribedPct || 0}%</span>
                </div>
              </div>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const amount = parseFloat(new FormData(e.target).get('amount'));
              handleSubmitInvestment({ amount });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Investment Amount (USD)</label>
                <input
                  name="amount"
                  type="number"
                  min={100000}
                  step={50000}
                  defaultValue={500000}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimum: $100,000</p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-sm text-indigo-900">
                  <span className="font-medium">Expected Return:</span> Calculated after KYC approval
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => { setShowInvestModal(false); setSelectedCall(null); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Submit Investment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Team Member Modal */}
      {showAddTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">Add Team Member</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleAddTeamMember({
                name: formData.get('name'),
                email: formData.get('email'),
                role: formData.get('role'),
                jobRole: formData.get('jobRole'),
              });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input name="name" type="text" className="w-full border rounded-lg px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input name="email" type="email" className="w-full border rounded-lg px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select name="role" className="w-full border rounded-lg px-3 py-2">
                  <option value="INVESTOR_ANALYST">Investment Analyst</option>
                  <option value="INVESTOR_ADMIN">Investor Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input name="jobRole" type="text" className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowAddTeamModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
