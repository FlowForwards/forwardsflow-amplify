// AnalyticsDashboard.js - Super Admin Analytics Page
import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Building2, Landmark, DollarSign, ArrowRightLeft, Calendar, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend, PieChart, Pie, Cell } from 'recharts';

const MONTHLY_METRICS = [
  { month: 'Jul', deposits: 85, transactions: 42, newBanks: 1, newInvestors: 2, volume: 125000000 },
  { month: 'Aug', deposits: 92, transactions: 48, newBanks: 0, newInvestors: 1, volume: 145000000 },
  { month: 'Sep', deposits: 108, transactions: 55, newBanks: 1, newInvestors: 2, volume: 168000000 },
  { month: 'Oct', deposits: 125, transactions: 62, newBanks: 1, newInvestors: 1, volume: 192000000 },
  { month: 'Nov', deposits: 142, transactions: 71, newBanks: 0, newInvestors: 2, volume: 218000000 },
  { month: 'Dec', deposits: 158, transactions: 78, newBanks: 1, newInvestors: 1, volume: 245000000 }
];

const GEOGRAPHIC_DATA = [
  { country: 'Kenya', banks: 4, investors: 3, volume: 350000000, color: '#8B5CF6' },
  { country: 'Tanzania', banks: 2, investors: 2, volume: 95000000, color: '#10B981' },
  { country: 'Uganda', banks: 1, investors: 1, volume: 45000000, color: '#3B82F6' },
  { country: 'Rwanda', banks: 1, investors: 0, volume: 25000000, color: '#F59E0B' }
];

const COLORS = ['#8B5CF6', '#10B981', '#3B82F6', '#F59E0B'];

const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => {
  const colorClasses = { purple: 'bg-purple-100 text-purple-600', green: 'bg-green-100 text-green-600', blue: 'bg-blue-100 text-blue-600', amber: 'bg-amber-100 text-amber-600' };
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          {trend !== undefined && <p className={`text-sm mt-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>{trend >= 0 ? '+' : ''}{trend}% vs last month</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}><Icon className="w-6 h-6" /></div>
      </div>
    </div>
  );
};

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('6m');

  const totalVolume = MONTHLY_METRICS.reduce((sum, m) => sum + m.volume, 0);
  const totalDeposits = MONTHLY_METRICS.reduce((sum, m) => sum + m.deposits, 0);
  const totalTransactions = MONTHLY_METRICS.reduce((sum, m) => sum + m.transactions, 0);
  
  const currentMonth = MONTHLY_METRICS[MONTHLY_METRICS.length - 1];
  const prevMonth = MONTHLY_METRICS[MONTHLY_METRICS.length - 2];
  const volumeTrend = ((currentMonth.volume - prevMonth.volume) / prevMonth.volume * 100).toFixed(1);
  const depositTrend = ((currentMonth.deposits - prevMonth.deposits) / prevMonth.deposits * 100).toFixed(1);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1><p className="text-gray-600 mt-1">Comprehensive analytics across all tenants and transactions</p></div>
          <div className="flex items-center gap-3">
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg"><option value="6m">Last 6 Months</option><option value="1y">Last Year</option><option value="ytd">Year to Date</option></select>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"><Download className="w-4 h-4" />Export</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Volume" value={`$${(totalVolume / 1000000000).toFixed(2)}B`} icon={DollarSign} color="green" trend={parseFloat(volumeTrend)} />
        <StatCard title="Active Deposits" value={totalDeposits} icon={TrendingUp} color="blue" trend={parseFloat(depositTrend)} />
        <StatCard title="Total Transactions" value={totalTransactions} icon={ArrowRightLeft} color="purple" />
        <StatCard title="Active Tenants" value="17" icon={Users} color="amber" subtitle="8 Banks • 9 Investors" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Volume Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={MONTHLY_METRICS}>
              <defs><linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/><stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis tickFormatter={(value) => `$${value / 1000000}M`} /><Tooltip formatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
              <Area type="monotone" dataKey="volume" stroke="#8B5CF6" fill="url(#colorVolume)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={MONTHLY_METRICS}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend />
              <Bar dataKey="deposits" fill="#10B981" name="Deposits" radius={[4, 4, 0, 0]} />
              <Bar dataKey="transactions" fill="#3B82F6" name="Transactions" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={GEOGRAPHIC_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="volume" label={({ country, percent }) => `${country} ${(percent * 100).toFixed(0)}%`}>
                {GEOGRAPHIC_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Banks</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investors</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volume</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {GEOGRAPHIC_DATA.map(region => (
                  <tr key={region.country} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{region.country}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-purple-600" />{region.banks}</div></td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><Landmark className="w-4 h-4 text-emerald-600" />{region.investors}</div></td>
                    <td className="px-4 py-3 font-medium">${(region.volume / 1000000).toFixed(0)}M</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2"><div className="h-2 rounded-full" style={{ width: `${(region.volume / totalVolume * 100)}%`, backgroundColor: region.color }}></div></div>
                        <span className="text-sm text-gray-600">{(region.volume / totalVolume * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Banks by Volume</h3>
          <div className="space-y-3">
            {[{ name: 'Equity Bank Kenya', volume: 180000000 }, { name: 'KCB Bank', volume: 150000000 }, { name: 'DTB Kenya', volume: 95000000 }, { name: 'Stanbic Bank', volume: 75000000 }, { name: 'CRDB Bank Tanzania', volume: 45000000 }].map((bank, i) => (
              <div key={bank.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <div className="flex-1"><p className="font-medium text-gray-900">{bank.name}</p><div className="w-full bg-gray-200 rounded-full h-1.5 mt-1"><div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${(bank.volume / 180000000 * 100)}%` }}></div></div></div>
                <span className="font-semibold text-gray-900">${(bank.volume / 1000000).toFixed(0)}M</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Investors by Volume</h3>
          <div className="space-y-3">
            {[{ name: 'Impact Capital Partners', volume: 125000000 }, { name: 'Shell Foundation', volume: 95000000 }, { name: 'Nordic Impact Fund', volume: 75000000 }, { name: 'Acumen Fund', volume: 60000000 }, { name: 'Triodos Investment', volume: 55000000 }].map((inv, i) => (
              <div key={inv.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <div className="flex-1"><p className="font-medium text-gray-900">{inv.name}</p><div className="w-full bg-gray-200 rounded-full h-1.5 mt-1"><div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${(inv.volume / 125000000 * 100)}%` }}></div></div></div>
                <span className="font-semibold text-gray-900">${(inv.volume / 1000000).toFixed(0)}M</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
