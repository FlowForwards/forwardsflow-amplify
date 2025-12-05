import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, Phone, TrendingUp, BarChart3, Plus, RefreshCw, CheckCircle, Clock, ArrowUpRight,
  Lock, Smartphone, MessageSquare, Zap, Globe, Shield, Users, Banknote, PieChart as PieChartIcon,
  Eye, EyeOff, ChevronDown, ChevronUp
} from 'lucide-react';
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

// Strategic Capital Deployment Section - Bank Admin Only
const MobileLendingStrategy = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  const whatsappBenefits = [
    { icon: Smartphone, title: '2.7 Billion Users', description: 'WhatsApp is the world\'s most popular messaging app with unparalleled reach in emerging markets.' },
    { icon: Zap, title: 'Zero App Download', description: 'No app installation required. Customers access loans through their existing WhatsApp - zero friction.' },
    { icon: Clock, title: '< 3 Minutes', description: 'Average loan application to disbursement time. Instant credit decisions powered by AI.' },
    { icon: Lock, title: 'End-to-End Encrypted', description: 'WhatsApp\'s built-in encryption ensures secure transmission of sensitive financial data.' },
    { icon: MessageSquare, title: 'Conversational UX', description: 'Natural language processing enables intuitive, human-like loan application experience.' },
    { icon: Globe, title: '180+ Countries', description: 'WhatsApp\'s global presence enables expansion across multiple frontier markets.' },
  ];

  const marketStats = [
    { icon: Banknote, value: 'KES 600Bn+', label: 'Mobile Lending Market Size' },
    { icon: TrendingUp, value: '365%', label: 'Maximum APR' },
    { icon: Users, value: '20M+', label: 'Potential Borrowers' },
    { icon: PieChartIcon, value: '85%+', label: 'Smartphone Penetration' },
  ];

  const revenueProjections = [
    { capital: '$100,000', loans: '~3,300', monthlyRevenue: '$25,000+', annualRevenue: '$300,000+' },
    { capital: '$500,000', loans: '~16,500', monthlyRevenue: '$125,000+', annualRevenue: '$1,500,000+' },
    { capital: '$1,000,000', loans: '~33,000', monthlyRevenue: '$250,000+', annualRevenue: '$3,000,000+' },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div 
        className="p-6 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Strategic Capital Deployment</h3>
            <p className="text-gray-400 text-sm">Maximize returns through WhatsApp mobile lending infrastructure</p>
          </div>
        </div>
        {isExpanded ? <ChevronUp className="w-6 h-6 text-gray-400" /> : <ChevronDown className="w-6 h-6 text-gray-400" />}
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-6">
          {/* The Strategy Explanation */}
          <div className="bg-white/5 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              How It Works
            </h4>
            <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
              <p>
                <span className="text-white font-semibold">Step 1: Investor Capital Arrives</span><br />
                Impact investors deposit USD/EUR/GBP seeking high frontier market yields (15%+ APR).
              </p>
              <p>
                <span className="text-white font-semibold">Step 2: M2 Money Generation via Prudential Reserve Ratio</span><br />
                Your bank converts foreign currency deposits to local currency (KES). Under prudential regulations, 
                banks maintain a reserve ratio (typically 5.25% in Kenya). This means for every $1M deposited, 
                you can generate approximately <span className="text-green-400 font-semibold">KES 2.9Bn in lending capacity</span> (M2 money supply creation).
              </p>
              <p>
                <span className="text-white font-semibold">Step 3: WhatsApp Mobile Lending Deployment</span><br />
                Deploy the generated M2 into the KES 600Bn+ mobile lending market via WhatsApp. 
                Average yields of <span className="text-green-400 font-semibold">30%+ monthly</span> on micro-loans (KES 3,000 average, 30-day terms).
              </p>
              <p>
                <span className="text-white font-semibold">Step 4: Ultra-Low Cost FX Hedging</span><br />
                The massive spread between mobile lending yields (365%+ APR) and investor deposit rates (15% APR) 
                creates enough margin to <span className="text-green-400 font-semibold">self-fund FX hedging at near-zero cost</span>. 
                You can offer investors 2% hedging fees while your actual cost approaches zero.
              </p>
              <p className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-300">
                <span className="font-bold">Result:</span> Investors get 15% USD returns with FX protection. 
                Banks generate 300%+ returns on deployed capital. A win-win arrangement.
              </p>
            </div>
          </div>

          {/* Market Opportunity Stats */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Kenya Mobile Lending Market</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {marketStats.map((stat, idx) => (
                <div key={idx} className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <stat.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Benefits */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">WhatsApp: The Frictionless Route to Market</h4>
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
              >
                {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showDetails ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
            {showDetails && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {whatsappBenefits.map((benefit, idx) => (
                  <div key={idx} className="bg-white/5 rounded-xl p-4 flex gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-white text-sm">{benefit.title}</h5>
                      <p className="text-xs text-gray-400 mt-1">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Revenue Projections */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Revenue Potential from Mobile Lending</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Capital Deployed</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">Est. Loans/Month</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">Monthly Revenue</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">Annual Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueProjections.map((row, idx) => (
                    <tr key={idx} className="border-b border-white/5">
                      <td className="px-4 py-3 text-sm font-medium text-white">{row.capital}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-300">{row.loans}</td>
                      <td className="px-4 py-3 text-center text-sm font-medium text-green-400">{row.monthlyRevenue}</td>
                      <td className="px-4 py-3 text-center text-sm font-bold text-green-400">{row.annualRevenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              *Based on average loan size of KES 3,000 (~$30), 30-day terms, and 15% monthly interest. Actual results may vary.
            </p>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link 
              to="/bank/lending" 
              className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 text-center"
            >
              Configure Mobile Lending
            </Link>
            <Link 
              to="/bank/calls" 
              className="flex-1 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 text-center"
            >
              Create Capital Call
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

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

      {/* Strategic Capital Deployment - Bank Admin Only */}
      <MobileLendingStrategy />

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
