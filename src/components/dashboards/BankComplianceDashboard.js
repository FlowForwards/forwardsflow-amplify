// BankComplianceDashboard.js - Compliance Officer Dashboard
import React, { useState, useEffect } from 'react';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  Search,
  Filter,
  RefreshCw,
  UserCheck,
  Flag,
  Download,
  ArrowUpRight
} from 'lucide-react';
import {
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
  LineChart,
  Line
} from 'recharts';
import { db } from '../../services/DatabaseService';
import { useAuth } from '../../context/AuthContext';
import AmazonQChat from '../shared/AmazonQChat';

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => {
  const colorClasses = {
    amber: 'bg-amber-100 text-amber-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

const BankComplianceDashboard = () => {
  const { user, tenant } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [amlAlerts, setAmlAlerts] = useState([]);
  
  // Mock KYC data
  const [kycRecords] = useState([
    { id: 'KYC-001', borrowerName: 'John Kamau', phoneNumber: '+254712345678', documentType: 'National ID', status: 'verified', submittedAt: '2024-12-01', verifiedAt: '2024-12-02' },
    { id: 'KYC-002', borrowerName: 'Mary Wanjiku', phoneNumber: '+254723456789', documentType: 'Passport', status: 'pending', submittedAt: '2024-12-08' },
    { id: 'KYC-003', borrowerName: 'Peter Ochieng', phoneNumber: '+254734567890', documentType: 'National ID', status: 'pending', submittedAt: '2024-12-09' },
    { id: 'KYC-004', borrowerName: 'Grace Muthoni', phoneNumber: '+254745678901', documentType: 'National ID', status: 'rejected', submittedAt: '2024-12-05' }
  ]);

  // Mock compliance metrics
  const [complianceMetrics] = useState({
    kycVerified: 4520,
    kycPending: 45,
    kycRejected: 12,
    kycRate: 98.5,
    amlOpen: 3,
    amlInvestigating: 2,
    amlResolved: 156,
    reportsGenerated: 24
  });

  // Chart data
  const [alertTrend] = useState([
    { month: 'Jul', alerts: 8, resolved: 7 },
    { month: 'Aug', alerts: 12, resolved: 11 },
    { month: 'Sep', alerts: 6, resolved: 6 },
    { month: 'Oct', alerts: 15, resolved: 14 },
    { month: 'Nov', alerts: 9, resolved: 8 },
    { month: 'Dec', alerts: 5, resolved: 3 }
  ]);

  const loadData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const dashboardData = await db.getDashboardData(user.role, user.tenantId);
      setAmlAlerts(dashboardData?.amlAlerts || []);
    } catch (error) {
      console.error('Error loading compliance data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user.tenantId]);

  const pendingKYC = kycRecords.filter(k => k.status === 'pending');
  const openAlerts = amlAlerts.filter(a => a.status === 'open' || a.status === 'investigating');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading compliance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-700 rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-6 h-6" />
              <span className="text-amber-100 text-sm font-medium">COMPLIANCE & RISK</span>
            </div>
            <h1 className="text-2xl font-bold">Compliance Dashboard</h1>
            <p className="text-amber-100 mt-1">
              {tenant?.name || 'Bank'} • AML/KYC Monitoring
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-amber-100">KYC Verification Rate</p>
            <p className="text-3xl font-bold">{complianceMetrics.kycRate}%</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Open AML Alerts"
          value={openAlerts.length}
          icon={AlertTriangle}
          color="amber"
          subtitle="Requiring review"
        />
        <StatCard
          title="KYC Verified"
          value={complianceMetrics.kycVerified.toLocaleString()}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Pending KYC"
          value={complianceMetrics.kycPending}
          icon={Clock}
          color="blue"
        />
        <StatCard
          title="Reports Generated"
          value={complianceMetrics.reportsGenerated}
          icon={FileText}
          color="blue"
          subtitle="This month"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 shadow-sm overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Shield },
          { id: 'aml', label: 'AML Monitoring', icon: AlertTriangle },
          { id: 'kyc', label: 'KYC Verification', icon: UserCheck },
          { id: 'reports', label: 'Reports', icon: FileText },
          { id: 'audit', label: 'Audit Trail', icon: Eye }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-amber-600 text-white'
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
            {/* Alert Trend */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AML Alert Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={alertTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="alerts" fill="#F59E0B" name="Alerts" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" fill="#10B981" name="Resolved" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* KYC Status */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">KYC Status Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Verified', value: complianceMetrics.kycVerified, color: '#10B981' },
                      { name: 'Pending', value: complianceMetrics.kycPending, color: '#F59E0B' },
                      { name: 'Rejected', value: complianceMetrics.kycRejected, color: '#EF4444' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    <Cell fill="#10B981" />
                    <Cell fill="#F59E0B" />
                    <Cell fill="#EF4444" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-600">Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm text-gray-600">Rejected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Priority Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-amber-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Priority Actions
            </h3>
            <div className="space-y-3">
              {openAlerts.slice(0, 3).map(alert => (
                <div key={alert.alertId} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Flag className={`w-5 h-5 ${
                      alert.severity === 'critical' ? 'text-red-600' :
                      alert.severity === 'high' ? 'text-amber-600' :
                      'text-blue-600'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">{alert.alertType.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-500">{alert.description}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-amber-600 text-white rounded-lg text-sm">
                    Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AML Tab */}
      {activeTab === 'aml' && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search alerts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alert ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {amlAlerts.map(alert => (
                  <tr key={alert.alertId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{alert.alertId}</td>
                    <td className="px-4 py-3 text-gray-600">{alert.alertType.replace('_', ' ')}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                        alert.severity === 'high' ? 'bg-amber-100 text-amber-700' :
                        alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{alert.description}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {alert.amount ? `KES ${alert.amount.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.status === 'open' ? 'bg-red-100 text-red-700' :
                        alert.status === 'investigating' ? 'bg-amber-100 text-amber-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {alert.status}
                      </span>
                    </td>
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

      {/* KYC Tab */}
      {activeTab === 'kyc' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">KYC Verification Queue</h3>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrower</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {kycRecords.map(kyc => (
                  <tr key={kyc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{kyc.borrowerName}</td>
                    <td className="px-4 py-3 text-gray-600">{kyc.phoneNumber}</td>
                    <td className="px-4 py-3 text-gray-600">{kyc.documentType}</td>
                    <td className="px-4 py-3 text-gray-600">{kyc.submittedAt}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        kyc.status === 'verified' ? 'bg-green-100 text-green-700' :
                        kyc.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {kyc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {kyc.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Approve">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Reject">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Monthly AML Summary', type: 'Regulatory', lastGenerated: '2024-12-01' },
              { name: 'KYC Compliance Report', type: 'Internal', lastGenerated: '2024-12-05' },
              { name: 'Suspicious Activity Report', type: 'Regulatory', lastGenerated: '2024-12-08' },
              { name: 'Transaction Monitoring', type: 'Internal', lastGenerated: '2024-12-09' },
              { name: 'Risk Assessment Report', type: 'Internal', lastGenerated: '2024-12-07' },
              { name: 'Regulatory Filing', type: 'Regulatory', lastGenerated: '2024-11-30' }
            ].map((report, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <FileText className="w-8 h-8 text-amber-600" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    report.type === 'Regulatory' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {report.type}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900">{report.name}</h4>
                <p className="text-sm text-gray-500 mt-1">Last: {report.lastGenerated}</p>
                <button className="mt-4 flex items-center gap-2 text-amber-600 hover:text-amber-700 text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Generate Report
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail</h3>
          <p className="text-gray-600 mb-4">Full audit log of all compliance actions and system events.</p>
          <div className="space-y-3">
            {[
              { action: 'KYC Approved', user: 'Peter Kimani', target: 'John Kamau', time: '10 mins ago' },
              { action: 'AML Alert Created', user: 'System', target: 'BOR-050', time: '2 hours ago' },
              { action: 'Report Generated', user: 'Peter Kimani', target: 'Monthly AML Summary', time: '1 day ago' },
              { action: 'KYC Rejected', user: 'Peter Kimani', target: 'Grace Muthoni', time: '2 days ago' }
            ].map((log, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{log.action}</p>
                    <p className="text-sm text-gray-500">{log.user} → {log.target}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Chat Assistant */}
      <AmazonQChat userRole="bank_compliance" userName={user?.name || 'User'} />
    </div>
  );
};

export default BankComplianceDashboard;
