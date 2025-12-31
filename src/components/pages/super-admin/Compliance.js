// Compliance.js - Super Admin Compliance Page
import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, Flag, Search, Eye, RefreshCw, X, Building2, Landmark, FileText, UserCheck, Scale } from 'lucide-react';

const SAMPLE_ALERTS = [
  { alertId: 'ALT-001', type: 'aml', severity: 'high', tenantId: 'bank_005', tenantName: 'CRDB Bank Tanzania', tenantType: 'bank', description: 'Unusual transaction pattern detected - multiple large deposits from single source', status: 'investigating', assignedTo: 'Grace Wanjiku', createdAt: '2024-12-08', updatedAt: '2024-12-09' },
  { alertId: 'ALT-002', type: 'kyc', severity: 'medium', tenantId: 'inv_009', tenantName: 'Global Impact Fund', tenantType: 'investor', description: 'KYC documentation expired - renewal required', status: 'open', assignedTo: null, createdAt: '2024-12-10', updatedAt: '2024-12-10' },
  { alertId: 'ALT-003', type: 'sanction', severity: 'critical', tenantId: 'bank_003', tenantName: 'DTB Kenya', tenantType: 'bank', description: 'Potential sanction list match for beneficiary - requires immediate review', status: 'escalated', assignedTo: 'Peter Kimani', createdAt: '2024-12-05', updatedAt: '2024-12-07' },
  { alertId: 'ALT-004', type: 'pep', severity: 'medium', tenantId: 'inv_004', tenantName: 'Acumen Fund', tenantType: 'investor', description: 'PEP (Politically Exposed Person) identified in transaction', status: 'investigating', assignedTo: 'Sarah Ochieng', createdAt: '2024-12-06', updatedAt: '2024-12-08' },
  { alertId: 'ALT-005', type: 'aml', severity: 'low', tenantId: 'bank_002', tenantName: 'KCB Bank', tenantType: 'bank', description: 'Transaction velocity threshold exceeded - routine check required', status: 'resolved', assignedTo: 'Grace Wanjiku', createdAt: '2024-12-01', updatedAt: '2024-12-03' },
  { alertId: 'ALT-006', type: 'kyc', severity: 'high', tenantId: 'bank_008', tenantName: 'Access Bank Rwanda', tenantType: 'bank', description: 'Missing beneficial ownership documentation', status: 'open', assignedTo: null, createdAt: '2024-12-09', updatedAt: '2024-12-09' }
];

const COMPLIANCE_STATS = { totalReviews: 156, pendingKyc: 8, pendingAml: 5, resolvedThisMonth: 42, avgResolutionTime: 2.3, complianceRate: 96.8 };

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => {
  const colorClasses = { amber: 'bg-amber-100 text-amber-600', red: 'bg-red-100 text-red-600', green: 'bg-green-100 text-green-600', blue: 'bg-blue-100 text-blue-600', purple: 'bg-purple-100 text-purple-600' };
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-start justify-between">
        <div><p className="text-sm text-gray-500 font-medium">{title}</p><p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>{subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}</div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}><Icon className="w-6 h-6" /></div>
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100"><h3 className="text-lg font-semibold text-gray-900">{title}</h3><button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button></div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const Compliance = () => {
  const [alerts, setAlerts] = useState(SAMPLE_ALERTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.alertId.toLowerCase().includes(searchTerm.toLowerCase()) || alert.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) || alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const openAlerts = alerts.filter(a => a.status !== 'resolved').length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
  const resolvedAlerts = alerts.filter(a => a.status === 'resolved').length;

  const handleResolve = (alert) => {
    setAlerts(alerts.map(a => a.alertId === alert.alertId ? { ...a, status: 'resolved', updatedAt: new Date().toISOString().split('T')[0] } : a));
  };

  const getSeverityColor = (severity) => ({ critical: 'bg-red-100 text-red-700', high: 'bg-orange-100 text-orange-700', medium: 'bg-amber-100 text-amber-700', low: 'bg-blue-100 text-blue-700' }[severity] || 'bg-gray-100 text-gray-700');
  const getStatusColor = (status) => ({ open: 'bg-amber-100 text-amber-700', investigating: 'bg-blue-100 text-blue-700', escalated: 'bg-purple-100 text-purple-700', resolved: 'bg-green-100 text-green-700' }[status] || 'bg-gray-100 text-gray-700');
  const getTypeIcon = (type) => ({ aml: Shield, kyc: UserCheck, sanction: Scale, pep: Flag }[type] || AlertTriangle);
  const getTypeColor = (type) => ({ aml: 'text-red-600', kyc: 'text-blue-600', sanction: 'text-purple-600', pep: 'text-amber-600' }[type] || 'text-gray-600');

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Compliance Center</h1>
        <p className="text-gray-600 mt-1">Platform-wide compliance monitoring and reporting</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Open Alerts" value={openAlerts} icon={AlertTriangle} color="amber" />
        <StatCard title="Critical Alerts" value={criticalAlerts} icon={Flag} color="red" />
        <StatCard title="Resolved (Month)" value={resolvedAlerts} icon={CheckCircle} color="green" />
        <StatCard title="Compliance Rate" value={`${COMPLIANCE_STATS.complianceRate}%`} icon={Shield} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">KYC Overview</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-gray-600">Pending Reviews</span><span className="font-semibold text-amber-600">{COMPLIANCE_STATS.pendingKyc}</span></div>
            <div className="flex items-center justify-between"><span className="text-gray-600">Completed Today</span><span className="font-semibold text-green-600">12</span></div>
            <div className="flex items-center justify-between"><span className="text-gray-600">Avg Processing Time</span><span className="font-semibold">1.8 days</span></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">AML Monitoring</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-gray-600">Active Alerts</span><span className="font-semibold text-red-600">{COMPLIANCE_STATS.pendingAml}</span></div>
            <div className="flex items-center justify-between"><span className="text-gray-600">Under Investigation</span><span className="font-semibold text-blue-600">3</span></div>
            <div className="flex items-center justify-between"><span className="text-gray-600">Escalated Cases</span><span className="font-semibold text-purple-600">1</span></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-gray-600">Total Reviews (Month)</span><span className="font-semibold">{COMPLIANCE_STATS.totalReviews}</span></div>
            <div className="flex items-center justify-between"><span className="text-gray-600">Avg Resolution Time</span><span className="font-semibold">{COMPLIANCE_STATS.avgResolutionTime} days</span></div>
            <div className="flex items-center justify-between"><span className="text-gray-600">SLA Compliance</span><span className="font-semibold text-green-600">98.5%</span></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Compliance Alerts</h3>
            <div className="flex items-center gap-3">
              <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search alerts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64" /></div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg"><option value="all">All Status</option><option value="open">Open</option><option value="investigating">Investigating</option><option value="escalated">Escalated</option><option value="resolved">Resolved</option></select>
              <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg"><option value="all">All Severity</option><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select>
              <button className="p-2 hover:bg-gray-100 rounded-lg"><RefreshCw className="w-5 h-5 text-gray-500" /></button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alert</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAlerts.map(alert => {
                const TypeIcon = getTypeIcon(alert.type);
                return (
                  <tr key={alert.alertId} className="hover:bg-gray-50">
                    <td className="px-4 py-4"><p className="font-medium text-gray-900">{alert.alertId}</p><p className="text-xs text-gray-500 truncate max-w-[200px]">{alert.description}</p></td>
                    <td className="px-4 py-4"><div className="flex items-center gap-2"><TypeIcon className={`w-4 h-4 ${getTypeColor(alert.type)}`} /><span className="text-sm uppercase">{alert.type}</span></div></td>
                    <td className="px-4 py-4"><div className="flex items-center gap-2">{alert.tenantType === 'bank' ? <Building2 className="w-4 h-4 text-purple-600" /> : <Landmark className="w-4 h-4 text-emerald-600" />}<span className="text-sm">{alert.tenantName}</span></div></td>
                    <td className="px-4 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>{alert.severity}</span></td>
                    <td className="px-4 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>{alert.status}</span></td>
                    <td className="px-4 py-4 text-sm text-gray-600">{alert.assignedTo || <span className="text-gray-400">Unassigned</span>}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setSelectedAlert(alert); setShowDetailsModal(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                        {alert.status !== 'resolved' && <button onClick={() => handleResolve(alert)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"><CheckCircle className="w-4 h-4" /></button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Alert Details">
        {selectedAlert && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {React.createElement(getTypeIcon(selectedAlert.type), { className: `w-8 h-8 ${getTypeColor(selectedAlert.type)}` })}
                <div><h3 className="text-xl font-bold text-gray-900">{selectedAlert.alertId}</h3><p className="text-sm text-gray-500 uppercase">{selectedAlert.type} Alert</p></div>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(selectedAlert.severity)}`}>{selectedAlert.severity}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedAlert.status)}`}>{selectedAlert.status}</span>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${selectedAlert.tenantType === 'bank' ? 'bg-purple-50' : 'bg-emerald-50'}`}>
              <div className="flex items-center gap-2 mb-2">{selectedAlert.tenantType === 'bank' ? <Building2 className="w-5 h-5 text-purple-600" /> : <Landmark className="w-5 h-5 text-emerald-600" />}<span className="font-medium">Affected Tenant</span></div>
              <p className="text-lg font-semibold text-gray-900">{selectedAlert.tenantName}</p>
              <p className="text-sm text-gray-500 capitalize">{selectedAlert.tenantType}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-medium text-gray-900 mb-2">Description</h4><p className="text-gray-600">{selectedAlert.description}</p></div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Assigned To</p><p className="font-semibold">{selectedAlert.assignedTo || 'Unassigned'}</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Created</p><p className="font-semibold">{selectedAlert.createdAt}</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Last Updated</p><p className="font-semibold">{selectedAlert.updatedAt}</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Days Open</p><p className="font-semibold">{Math.ceil((new Date() - new Date(selectedAlert.createdAt)) / (1000 * 60 * 60 * 24))} days</p></div>
            </div>

            {selectedAlert.status !== 'resolved' && (
              <div className="flex gap-3 pt-4 border-t">
                <button onClick={() => { handleResolve(selectedAlert); setShowDetailsModal(false); }} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Mark Resolved</button>
                <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Escalate</button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Compliance;
