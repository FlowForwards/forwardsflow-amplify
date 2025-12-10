import React, { useState, useEffect } from 'react';
import {
  Shield, AlertTriangle, CheckCircle, Clock, Search, Filter, Eye,
  FileText, Users, Flag, XCircle, TrendingUp, Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { db } from '../../services/DatabaseService';
import { useAuth } from '../../context/AuthContext';

// Stat Card
const StatCard = ({ icon: Icon, label, value, color = 'blue', trend }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  );
};

// Alert Card
const AlertCard = ({ alert, onReview, onDismiss }) => {
  const severityColors = {
    high: 'border-red-200 bg-red-50',
    medium: 'border-yellow-200 bg-yellow-50',
    low: 'border-blue-200 bg-blue-50',
  };

  const severityBadge = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className={`rounded-xl border p-4 ${severityColors[alert.severity]}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className={`w-5 h-5 ${alert.severity === 'high' ? 'text-red-600' : alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'}`} />
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${severityBadge[alert.severity]}`}>
            {alert.severity.toUpperCase()}
          </span>
        </div>
        <span className="text-xs text-gray-500">{alert.time}</span>
      </div>
      <h4 className="font-medium text-gray-900 mb-1">{alert.title}</h4>
      <p className="text-sm text-gray-600 mb-3">{alert.description}</p>
      <div className="flex items-center gap-2">
        <button onClick={() => onReview(alert)} className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
          Review
        </button>
        <button onClick={() => onDismiss(alert)} className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          Dismiss
        </button>
      </div>
    </div>
  );
};

// Transaction Row
const TransactionRow = ({ txn, onFlag }) => (
  <tr className="border-b border-gray-50 hover:bg-gray-50">
    <td className="px-4 py-3">
      <div>
        <p className="font-medium text-gray-900">{txn.reference}</p>
        <p className="text-xs text-gray-500">{txn.type}</p>
      </div>
    </td>
    <td className="px-4 py-3 text-sm text-gray-600">{txn.borrower}</td>
    <td className="px-4 py-3 text-sm font-medium text-gray-900">KES {txn.amount.toLocaleString()}</td>
    <td className="px-4 py-3">
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        txn.riskScore > 70 ? 'bg-red-100 text-red-700' :
        txn.riskScore > 40 ? 'bg-yellow-100 text-yellow-700' :
        'bg-green-100 text-green-700'
      }`}>
        {txn.riskScore}
      </span>
    </td>
    <td className="px-4 py-3">
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        txn.status === 'cleared' ? 'bg-green-100 text-green-700' :
        txn.status === 'flagged' ? 'bg-red-100 text-red-700' :
        'bg-yellow-100 text-yellow-700'
      }`}>
        {txn.status}
      </span>
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-2">
        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
          <Eye className="w-4 h-4" />
        </button>
        <button onClick={() => onFlag(txn)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
          <Flag className="w-4 h-4" />
        </button>
      </div>
    </td>
  </tr>
);

const BankComplianceDashboard = () => {
  const { user, tenant } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

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
  const complianceMetrics = metrics.complianceMetrics || {};

  // Mock alerts
  const alerts = [
    { id: 1, severity: 'high', title: 'Suspicious Transaction Pattern', description: 'Multiple high-value transactions from single phone number in 24h period.', time: '2h ago' },
    { id: 2, severity: 'medium', title: 'KYC Document Expired', description: 'ID document for borrower +254712345678 expired 30 days ago.', time: '5h ago' },
    { id: 3, severity: 'low', title: 'Unusual Login Location', description: 'Admin login detected from new IP address.', time: '1d ago' },
  ];

  // Mock transactions for monitoring
  const transactions = [
    { reference: 'TXN-2024-00456', type: 'Loan Disbursement', borrower: 'John Kamau', amount: 45000, riskScore: 25, status: 'cleared' },
    { reference: 'TXN-2024-00457', type: 'Loan Repayment', borrower: 'Mary Wanjiku', amount: 12500, riskScore: 15, status: 'cleared' },
    { reference: 'TXN-2024-00458', type: 'Loan Disbursement', borrower: 'Peter Ochieng', amount: 85000, riskScore: 72, status: 'flagged' },
    { reference: 'TXN-2024-00459', type: 'Loan Disbursement', borrower: 'Grace Njeri', amount: 35000, riskScore: 45, status: 'pending' },
    { reference: 'TXN-2024-00460', type: 'Loan Repayment', borrower: 'David Mwangi', amount: 28000, riskScore: 18, status: 'cleared' },
  ];

  // KYC Status Data
  const kycStatusData = [
    { status: 'Verified', count: 720, color: '#10b981' },
    { status: 'Pending', count: 85, color: '#f59e0b' },
    { status: 'Expired', count: 42, color: '#ef4444' },
  ];

  // Monthly AML alerts
  const amlTrendData = [
    { month: 'Jun', alerts: 8 },
    { month: 'Jul', alerts: 12 },
    { month: 'Aug', alerts: 6 },
    { month: 'Sep', alerts: 9 },
    { month: 'Oct', alerts: 5 },
    { month: 'Nov', alerts: 3 },
  ];

  const stats = [
    { icon: Shield, label: 'KYC Completion', value: `${complianceMetrics.kycCompletionRate || 98.5}%`, color: 'green' },
    { icon: AlertTriangle, label: 'Open AML Alerts', value: (complianceMetrics.amlAlertsThisMonth - complianceMetrics.amlAlertsClosed || 1).toString(), color: 'yellow' },
    { icon: Flag, label: 'Flagged Transactions', value: (complianceMetrics.suspiciousTransactions || 1).toString(), color: 'red' },
    { icon: CheckCircle, label: 'Regulatory Status', value: complianceMetrics.regulatoryFilingsUpToDate ? 'Compliant' : 'Action Needed', color: complianceMetrics.regulatoryFilingsUpToDate ? 'green' : 'red' },
  ];

  const handleReviewAlert = (alert) => {
    console.log('Reviewing alert:', alert.id);
  };

  const handleDismissAlert = (alert) => {
    console.log('Dismissing alert:', alert.id);
  };

  const handleFlagTransaction = (txn) => {
    console.log('Flagging transaction:', txn.reference);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Dashboard</h1>
          <p className="text-gray-500 mt-1">{tenant?.name || 'Bank'} • AML/KYC Monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => <StatCard key={idx} {...stat} />)}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts & Tables */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="bg-white rounded-xl border border-gray-100">
            <div className="flex gap-1 p-1 border-b border-gray-100">
              {['overview', 'transactions', 'kyc', 'reports'].map(tab => (
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
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* AML Trend */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">AML Alerts Trend</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={amlTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="alerts" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* KYC Status */}
                  <div className="grid grid-cols-3 gap-4">
                    {kycStatusData.map((item, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-xl text-center">
                        <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: item.color }} />
                        <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                        <p className="text-sm text-gray-500">{item.status}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'transactions' && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                      />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <Filter className="w-4 h-4" />
                      Filter
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrower</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map(txn => (
                          <TransactionRow key={txn.reference} txn={txn} onFlag={handleFlagTransaction} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'kyc' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">KYC System Active</p>
                        <p className="text-sm text-green-600">All verification services operational</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-green-700">{complianceMetrics.kycCompletionRate || 98.5}%</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-100 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Documents Verified Today</p>
                      <p className="text-2xl font-bold text-gray-900">24</p>
                    </div>
                    <div className="p-4 border border-gray-100 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Pending Verification</p>
                      <p className="text-2xl font-bold text-yellow-600">8</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="space-y-4">
                  {[
                    { name: 'Monthly AML Report', date: 'Nov 2024', status: 'generated' },
                    { name: 'Quarterly Compliance Summary', date: 'Q3 2024', status: 'generated' },
                    { name: 'CBK Regulatory Filing', date: 'Oct 2024', status: 'submitted' },
                    { name: 'Annual Risk Assessment', date: '2024', status: 'pending' },
                  ].map((report, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{report.name}</p>
                          <p className="text-sm text-gray-500">{report.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          report.status === 'submitted' ? 'bg-green-100 text-green-700' :
                          report.status === 'generated' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {report.status}
                        </span>
                        <button className="text-sm text-primary-600 hover:text-primary-700">View</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Alerts */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Active Alerts</h3>
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                {alerts.length}
              </span>
            </div>
            <div className="space-y-4">
              {alerts.map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onReview={handleReviewAlert}
                  onDismiss={handleDismissAlert}
                />
              ))}
            </div>
          </div>

          {/* Blacklist Summary */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Blacklist Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Phone Numbers</span>
                <span className="font-medium text-gray-900">23</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">National IDs</span>
                <span className="font-medium text-gray-900">15</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">IP Addresses</span>
                <span className="font-medium text-gray-900">8</span>
              </div>
            </div>
            <button className="w-full mt-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100">
              Manage Blacklist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankComplianceDashboard;
