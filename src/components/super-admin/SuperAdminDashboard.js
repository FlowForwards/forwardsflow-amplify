import React, { useState } from 'react';
import { DollarSign, Users, Building2, Briefcase, TrendingUp, CreditCard } from 'lucide-react';
import { StatCard, Badge, DataTable, Modal } from '../common';
import { platformAnalytics, demoTenants, demoInstruments } from '../../data/mockData';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showModal, setShowModal] = useState(false);

  const stats = [
    { icon: DollarSign, label: 'Total Capital Deployed', value: `$${(platformAnalytics.totalCapitalDeployed / 1000000).toFixed(1)}M`, trend: platformAnalytics.monthlyGrowth, color: 'blue' },
    { icon: Briefcase, label: 'Active Investors', value: platformAnalytics.totalInvestors.toString(), color: 'purple' },
    { icon: Building2, label: 'Partner Banks', value: platformAnalytics.totalBanks.toString(), color: 'green' },
    { icon: CreditCard, label: 'Active Mobile Loans', value: platformAnalytics.totalActiveLoans.toLocaleString(), trend: 12.1, color: 'yellow' },
    { icon: TrendingUp, label: 'Platform Yield', value: `${platformAnalytics.avgPlatformYield}%`, color: 'indigo' },
    { icon: DollarSign, label: 'Monthly Revenue', value: `$${(platformAnalytics.monthlyRevenue / 1000).toFixed(0)}K`, trend: platformAnalytics.monthlyGrowth, color: 'pink' },
  ];

  const investorColumns = [
    { header: 'Name', accessor: 'name', render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><Briefcase className="w-4 h-4" /></div>
        <span className="font-medium text-gray-900">{row.name}</span>
      </div>
    )},
    { header: 'Type', accessor: 'type', render: (row) => <span className="capitalize">{row.type.replace('_', ' ')}</span> },
    { header: 'Total Invested', accessor: 'totalInvested', render: (row) => `$${(row.totalInvested / 1000000).toFixed(1)}M` },
    { header: 'Avg Yield', accessor: 'avgYield', render: (row) => <span className="text-green-600">{row.avgYield}%</span> },
    { header: 'Status', accessor: 'status', render: (row) => <Badge variant={row.status === 'active' ? 'success' : 'warning'}>{row.status}</Badge> },
  ];

  const bankColumns = [
    { header: 'Name', accessor: 'name', render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center"><Building2 className="w-4 h-4" /></div>
        <div>
          <span className="font-medium text-gray-900 block">{row.name}</span>
          <span className="text-xs text-gray-500">{row.country}</span>
        </div>
      </div>
    )},
    { header: 'Type', accessor: 'type', render: (row) => <span className="capitalize">{row.type.replace('_', ' ')}</span> },
    { header: 'Capital', accessor: 'totalCapital', render: (row) => `$${(row.totalCapital / 1000000).toFixed(1)}M` },
    { header: 'Active Loans', accessor: 'activeLoans', render: (row) => row.activeLoans.toLocaleString() },
    { header: 'Monthly Yield', accessor: 'monthlyYield', render: (row) => <span className="text-green-600">{row.monthlyYield}%</span> },
    { header: 'Status', accessor: 'status', render: (row) => <Badge variant={row.status === 'active' ? 'success' : 'warning'}>{row.status}</Badge> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Dashboard</h1>
          <p className="text-gray-500">Monitor your ForwardsFlow platform performance</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary !w-auto">+ Add Tenant</button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, idx) => <StatCard key={idx} {...stat} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Capital Deployed (6 Months)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={platformAnalytics.capitalByMonth}>
              <defs>
                <linearGradient id="colorCapital" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`} />
              <Tooltip formatter={(v) => [`$${(v / 1000000).toFixed(2)}M`, 'Capital']} />
              <Area type="monotone" dataKey="capital" stroke="#6366f1" strokeWidth={2} fill="url(#colorCapital)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={platformAnalytics.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex gap-4 border-b border-gray-100 mb-6">
          {['overview', 'investors', 'banks'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${activeTab === tab ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab !== 'overview' && `(${tab === 'investors' ? demoTenants.investors.length : demoTenants.banks.length})`}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Recent Investors</h4>
              <DataTable columns={investorColumns.slice(0, 3)} data={demoTenants.investors.slice(0, 3)} />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Partner Banks</h4>
              <DataTable columns={bankColumns.slice(0, 3)} data={demoTenants.banks.slice(0, 3)} />
            </div>
          </div>
        )}

        {activeTab === 'investors' && <DataTable columns={investorColumns} data={demoTenants.investors} />}
        {activeTab === 'banks' && <DataTable columns={bankColumns} data={demoTenants.banks} />}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Tenant">
        <p className="text-gray-500">Tenant creation form would go here.</p>
      </Modal>
    </div>
  );
};

export default SuperAdminDashboard;
