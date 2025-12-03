import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Phone, TrendingUp, BarChart3, Plus, RefreshCw, CheckCircle, Clock, ArrowUpRight } from 'lucide-react';
import { Badge, DataTable, Modal } from '../common';
import { bankAnalytics, demoLoans, demoInstruments } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Stat Card Component matching screenshot exactly
const BankStatCard = ({ icon: Icon, label, value, iconBg, iconColor }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
      <Icon className={`w-6 h-6 ${iconColor}`} />
    </div>
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const BankAdminDashboard = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const analytics = bankAnalytics['bank-001'];
  
  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  const instrumentColumns = [
    { header: 'Type', accessor: 'type', render: (row) => <span className="font-medium text-gray-900">{row.type}</span> },
    { header: 'Currency', accessor: 'currencyPair' },
    { header: 'Principal', accessor: 'principal', render: (row) => `¥${row.principal.toLocaleString()}` },
    { header: 'Rate', accessor: 'interestRate', render: (row) => <span className="text-green-600">{row.interestRate}%</span> },
    { header: 'Subscribed', accessor: 'subscribedPct', render: (row) => (
      <div className="flex items-center gap-2">
        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary-500 rounded-full" style={{ width: `${row.subscribedPct}%` }} />
        </div>
        <span className="text-sm">{row.subscribedPct}%</span>
      </div>
    )},
    { header: 'Status', accessor: 'status', render: (row) => (
      <Badge variant={row.status === 'open' ? 'success' : row.status === 'fully_subscribed' ? 'purple' : 'warning'}>
        {row.status.replace('_', ' ')}
      </Badge>
    )},
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bank Overview</h1>
        <p className="text-gray-500 mt-1">Monitor your bank's performance and mobile lending operations</p>
      </div>

      {/* Stats - Matching screenshot exactly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BankStatCard 
          icon={DollarSign} 
          label="Total Capital" 
          value="¥2,500,000" 
          iconBg="bg-blue-100" 
          iconColor="text-blue-600" 
        />
        <BankStatCard 
          icon={Phone} 
          label="Active Mobile Loans" 
          value="847" 
          iconBg="bg-green-100" 
          iconColor="text-green-600" 
        />
        <BankStatCard 
          icon={TrendingUp} 
          label="Mobile Loans Volume" 
          value="¥15,420,000" 
          iconBg="bg-purple-100" 
          iconColor="text-purple-600" 
        />
        <BankStatCard 
          icon={BarChart3} 
          label="Monthly Yield" 
          value="32.4%" 
          iconBg="bg-yellow-100" 
          iconColor="text-yellow-600" 
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h3 className="font-semibold text-gray-900 mb-6">Weekly Disbursements</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={analytics.weeklyDisbursements}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `¥${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => [`¥${v.toLocaleString()}`, 'Disbursed']} />
              <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-6">Loan Portfolio Status</h3>
          <div className="flex justify-center mb-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={analytics.loanStatusDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="count">
                  {analytics.loanStatusDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {analytics.loanStatusDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                  <span className="text-sm text-gray-600">{item.status}</span>
                </div>
                <span className="text-sm font-medium">{item.count} ({item.pct}%)</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
            <span className="text-sm text-gray-500">NPL Rate</span>
            <span className="text-lg font-bold text-red-600">{analytics.nplRate}%</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <ArrowUpRight className="w-4 h-4" />
            <span className="text-sm font-medium">Disbursements Today</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.disbursementsToday}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Collections Today</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.collectionsToday}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm font-medium">Avg Loan Size</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">KES {analytics.avgLoanSize.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 text-yellow-600 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Pending Review</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">12</p>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Active Instruments</h3>
            <Link to="/bank/admin/instruments" className="text-sm text-primary-600 hover:text-primary-700">View all</Link>
          </div>
          <DataTable columns={instrumentColumns.slice(0, 4)} data={demoInstruments.slice(0, 3)} />
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Pending Loan Applications</h3>
            <Link to="/bank/admin/lending" className="text-sm text-primary-600 hover:text-primary-700">View all</Link>
          </div>
          <div className="space-y-3">
            {demoLoans.slice(0, 3).map(loan => (
              <div key={loan.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{loan.borrowerName}</p>
                    <p className="text-sm text-gray-500">{loan.borrowerPhone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">KES {loan.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{loan.term} days</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">Approve</button>
                  <button className="px-3 py-1.5 bg-white text-gray-700 text-sm font-medium rounded-lg border hover:bg-gray-50">Review</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-3">
        <button onClick={() => setShowCreateModal(true)} className="btn-primary !w-auto flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Call
        </button>
        <button className="btn-secondary flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh Data
        </button>
      </div>

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Deposit Instrument" size="large">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instrument Type</label>
              <select className="select-field">
                <option value="">Select type</option>
                <option value="fixed_deposit">Fixed Deposit</option>
                <option value="time_deposit">Time Deposit</option>
                <option value="certificate_of_deposit">Certificate of Deposit</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency Pair</label>
              <select className="select-field">
                <option value="">Select pair</option>
                <option value="KES:JPY">KES:JPY</option>
                <option value="KES:CHF">KES:CHF</option>
                <option value="TZS:JPY">TZS:JPY</option>
                <option value="NGN:JPY">NGN:JPY</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Principal Amount</label>
              <input type="number" className="input-field" placeholder="e.g., 500000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
              <input type="number" className="input-field" placeholder="e.g., 12.5" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maturity Date</label>
              <input type="date" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Forwards Premium (%)</label>
              <input type="number" className="input-field" placeholder="e.g., 3.5" step="0.1" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Intended Use</label>
            <textarea className="input-field" rows={2} placeholder="e.g., Mobile Lending Deployment"></textarea>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setShowCreateModal(false)} className="btn-secondary">Cancel</button>
            <button className="btn-primary !w-auto">Create Instrument</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BankAdminDashboard;
