// RiskManagement.js - Super Admin Risk Management Page
import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, TrendingDown, TrendingUp, Building2, Landmark, Eye, RefreshCw, X, CheckCircle, Clock, Target, Percent } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const RISK_DATA = {
  overallScore: 72,
  creditRisk: 68,
  operationalRisk: 75,
  marketRisk: 71,
  liquidityRisk: 78,
  concentrationRisk: 65
};

const BANK_RISK_SCORES = [
  { name: 'Equity Bank', score: 78, trend: 'up', nplRatio: 4.2, capitalAdequacy: 18.5, liquidity: 42 },
  { name: 'KCB Bank', score: 75, trend: 'stable', nplRatio: 5.1, capitalAdequacy: 17.2, liquidity: 38 },
  { name: 'DTB Kenya', score: 72, trend: 'up', nplRatio: 5.8, capitalAdequacy: 16.8, liquidity: 35 },
  { name: 'Stanbic Bank', score: 70, trend: 'down', nplRatio: 6.2, capitalAdequacy: 15.9, liquidity: 32 },
  { name: 'CRDB Tanzania', score: 65, trend: 'down', nplRatio: 7.5, capitalAdequacy: 14.5, liquidity: 28 },
  { name: 'NMB Tanzania', score: 68, trend: 'stable', nplRatio: 6.8, capitalAdequacy: 15.2, liquidity: 30 }
];

const RISK_ALERTS = [
  { id: 'RSK-001', type: 'concentration', severity: 'high', entity: 'Impact Capital Partners', description: 'Single investor exposure exceeds 25% threshold', status: 'open' },
  { id: 'RSK-002', type: 'credit', severity: 'medium', entity: 'CRDB Bank Tanzania', description: 'NPL ratio trending above target (7.5% vs 5% target)', status: 'monitoring' },
  { id: 'RSK-003', type: 'liquidity', severity: 'low', entity: 'NMB Bank Tanzania', description: 'Liquidity buffer approaching minimum threshold', status: 'monitoring' },
  { id: 'RSK-004', type: 'operational', severity: 'medium', entity: 'Platform', description: 'System latency increased by 15% in last 24 hours', status: 'investigating' }
];

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => {
  const colorClasses = { green: 'bg-green-100 text-green-600', blue: 'bg-blue-100 text-blue-600', amber: 'bg-amber-100 text-amber-600', red: 'bg-red-100 text-red-600', purple: 'bg-purple-100 text-purple-600' };
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          {trend && <p className={`text-sm mt-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>{trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month</p>}
        </div>
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

const RiskManagement = () => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);

  const riskBreakdown = [
    { name: 'Credit Risk', value: RISK_DATA.creditRisk },
    { name: 'Operational Risk', value: RISK_DATA.operationalRisk },
    { name: 'Market Risk', value: RISK_DATA.marketRisk },
    { name: 'Liquidity Risk', value: RISK_DATA.liquidityRisk },
    { name: 'Concentration Risk', value: RISK_DATA.concentrationRisk }
  ];

  const getScoreColor = (score) => score >= 75 ? 'text-green-600' : score >= 60 ? 'text-amber-600' : 'text-red-600';
  const getScoreBg = (score) => score >= 75 ? 'bg-green-100' : score >= 60 ? 'bg-amber-100' : 'bg-red-100';
  const getSeverityColor = (severity) => ({ high: 'bg-red-100 text-red-700', medium: 'bg-amber-100 text-amber-700', low: 'bg-blue-100 text-blue-700' }[severity] || 'bg-gray-100 text-gray-700');
  const getTrendIcon = (trend) => trend === 'up' ? <TrendingUp className="w-4 h-4 text-green-500" /> : trend === 'down' ? <TrendingDown className="w-4 h-4 text-red-500" /> : <span className="w-4 h-4 text-gray-400">—</span>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-gray-900">Risk Management</h1><p className="text-gray-600 mt-1">Platform risk assessment and monitoring dashboard</p></div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"><RefreshCw className="w-4 h-4" />Refresh Data</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Overall Risk Score" value={`${RISK_DATA.overallScore}/100`} icon={Target} color="green" subtitle="Good standing" trend={3} />
        <StatCard title="Credit Risk" value={`${RISK_DATA.creditRisk}/100`} icon={TrendingDown} color="amber" />
        <StatCard title="Active Alerts" value={RISK_ALERTS.filter(a => a.status !== 'resolved').length} icon={AlertTriangle} color="red" />
        <StatCard title="Banks Monitored" value={BANK_RISK_SCORES.length} icon={Building2} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Score Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" /><XAxis type="number" domain={[0, 100]} /><YAxis dataKey="name" type="category" width={120} /><Tooltip />
              <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={riskBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                {riskBreakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Risk Scores</h3>
          <div className="space-y-3">
            {BANK_RISK_SCORES.map(bank => (
              <div key={bank.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => { setSelectedBank(bank); setShowDetailsModal(true); }}>
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">{bank.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  {getTrendIcon(bank.trend)}
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreBg(bank.score)} ${getScoreColor(bank.score)}`}>{bank.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Alerts</h3>
          <div className="space-y-3">
            {RISK_ALERTS.map(alert => (
              <div key={alert.id} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{alert.id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>{alert.severity}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{alert.entity}</span>
                  <span className={`${alert.status === 'open' ? 'text-red-600' : alert.status === 'monitoring' ? 'text-amber-600' : 'text-blue-600'}`}>{alert.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Risk Metrics</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Score</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trend</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NPL Ratio</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capital Adequacy</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Liquidity Ratio</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {BANK_RISK_SCORES.map(bank => (
                <tr key={bank.name} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-purple-600" /><span className="font-medium">{bank.name}</span></div></td>
                  <td className="px-4 py-3"><span className={`font-bold ${getScoreColor(bank.score)}`}>{bank.score}/100</span></td>
                  <td className="px-4 py-3">{getTrendIcon(bank.trend)}</td>
                  <td className="px-4 py-3"><span className={bank.nplRatio > 6 ? 'text-red-600' : bank.nplRatio > 5 ? 'text-amber-600' : 'text-green-600'}>{bank.nplRatio}%</span></td>
                  <td className="px-4 py-3"><span className={bank.capitalAdequacy < 15 ? 'text-red-600' : 'text-green-600'}>{bank.capitalAdequacy}%</span></td>
                  <td className="px-4 py-3"><span className={bank.liquidity < 30 ? 'text-red-600' : 'text-green-600'}>{bank.liquidity}%</span></td>
                  <td className="px-4 py-3"><button onClick={() => { setSelectedBank(bank); setShowDetailsModal(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Bank Risk Details">
        {selectedBank && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-purple-100 flex items-center justify-center"><Building2 className="w-8 h-8 text-purple-600" /></div>
              <div><h3 className="text-xl font-bold text-gray-900">{selectedBank.name}</h3><p className="text-gray-500">Risk Assessment</p></div>
              <span className={`ml-auto px-4 py-2 rounded-full text-lg font-bold ${getScoreBg(selectedBank.score)} ${getScoreColor(selectedBank.score)}`}>{selectedBank.score}/100</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center"><p className="text-sm text-gray-500">NPL Ratio</p><p className={`text-2xl font-bold ${selectedBank.nplRatio > 6 ? 'text-red-600' : selectedBank.nplRatio > 5 ? 'text-amber-600' : 'text-green-600'}`}>{selectedBank.nplRatio}%</p><p className="text-xs text-gray-400">Target: &lt;5%</p></div>
              <div className="bg-gray-50 p-4 rounded-lg text-center"><p className="text-sm text-gray-500">Capital Adequacy</p><p className={`text-2xl font-bold ${selectedBank.capitalAdequacy < 15 ? 'text-red-600' : 'text-green-600'}`}>{selectedBank.capitalAdequacy}%</p><p className="text-xs text-gray-400">Min: 14.5%</p></div>
              <div className="bg-gray-50 p-4 rounded-lg text-center"><p className="text-sm text-gray-500">Liquidity Ratio</p><p className={`text-2xl font-bold ${selectedBank.liquidity < 30 ? 'text-red-600' : 'text-green-600'}`}>{selectedBank.liquidity}%</p><p className="text-xs text-gray-400">Min: 25%</p></div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Risk Trend</h4>
              <div className="flex items-center gap-2">
                {getTrendIcon(selectedBank.trend)}
                <span className="text-gray-600 capitalize">{selectedBank.trend === 'up' ? 'Improving' : selectedBank.trend === 'down' ? 'Declining' : 'Stable'}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RiskManagement;
