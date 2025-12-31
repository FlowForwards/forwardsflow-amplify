// PlatformPL.js - Super Admin Platform P&L Page
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Download, RefreshCw, Building2, Landmark, Percent } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend, PieChart, Pie, Cell } from 'recharts';

const MONTHLY_DATA = [
  { month: 'Jul', revenue: 135000, bankSubs: 52000, investorSubs: 36000, txnFees: 47000, expenses: 123000, infrastructure: 37000, personnel: 60000, compliance: 16000, operations: 10000, profit: 12000 },
  { month: 'Aug', revenue: 154500, bankSubs: 60000, investorSubs: 42000, txnFees: 52500, expenses: 127500, infrastructure: 38000, personnel: 62000, compliance: 17000, operations: 10500, profit: 27000 },
  { month: 'Sep', revenue: 173000, bankSubs: 68000, investorSubs: 47000, txnFees: 58000, expenses: 130500, infrastructure: 39000, personnel: 64000, compliance: 17000, operations: 10500, profit: 42500 },
  { month: 'Oct', revenue: 192500, bankSubs: 75000, investorSubs: 52000, txnFees: 65500, expenses: 133500, infrastructure: 40000, personnel: 65000, compliance: 17500, operations: 11000, profit: 59000 },
  { month: 'Nov', revenue: 212000, bankSubs: 82000, investorSubs: 58000, txnFees: 72000, expenses: 136500, infrastructure: 41000, personnel: 67000, compliance: 17500, operations: 11000, profit: 75500 },
  { month: 'Dec', revenue: 232500, bankSubs: 90000, investorSubs: 64000, txnFees: 78500, expenses: 138000, infrastructure: 42000, personnel: 68000, compliance: 17000, operations: 11000, profit: 94500 }
];

const COLORS = ['#8B5CF6', '#10B981', '#3B82F6', '#F59E0B'];

const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => {
  const colorClasses = { green: 'bg-green-100 text-green-600', blue: 'bg-blue-100 text-blue-600', red: 'bg-red-100 text-red-600', purple: 'bg-purple-100 text-purple-600' };
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

const PlatformPL = () => {
  const [timeRange, setTimeRange] = useState('6m');

  const totalRevenue = MONTHLY_DATA.reduce((sum, m) => sum + m.revenue, 0);
  const totalExpenses = MONTHLY_DATA.reduce((sum, m) => sum + m.expenses, 0);
  const totalProfit = MONTHLY_DATA.reduce((sum, m) => sum + m.profit, 0);
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);

  const currentMonth = MONTHLY_DATA[MONTHLY_DATA.length - 1];
  const prevMonth = MONTHLY_DATA[MONTHLY_DATA.length - 2];
  const revenueTrend = ((currentMonth.revenue - prevMonth.revenue) / prevMonth.revenue * 100).toFixed(1);
  const expenseTrend = ((currentMonth.expenses - prevMonth.expenses) / prevMonth.expenses * 100).toFixed(1);
  const profitTrend = ((currentMonth.profit - prevMonth.profit) / prevMonth.profit * 100).toFixed(1);

  const revenueBreakdown = [
    { name: 'Bank Subscriptions', value: currentMonth.bankSubs, color: '#8B5CF6' },
    { name: 'Investor Subscriptions', value: currentMonth.investorSubs, color: '#10B981' },
    { name: 'Transaction Fees', value: currentMonth.txnFees, color: '#3B82F6' }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-gray-900">Platform P&L</h1><p className="text-gray-600 mt-1">View platform-wide profit and loss statements</p></div>
          <div className="flex items-center gap-3">
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg"><option value="6m">Last 6 Months</option><option value="1y">Last Year</option><option value="ytd">Year to Date</option></select>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"><Download className="w-4 h-4" />Export</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Revenue" value={`$${(totalRevenue / 1000).toFixed(0)}K`} icon={TrendingUp} color="green" trend={parseFloat(revenueTrend)} />
        <StatCard title="Total Expenses" value={`$${(totalExpenses / 1000).toFixed(0)}K`} icon={TrendingDown} color="red" trend={parseFloat(expenseTrend)} />
        <StatCard title="Net Profit" value={`$${(totalProfit / 1000).toFixed(0)}K`} icon={DollarSign} color="blue" trend={parseFloat(profitTrend)} />
        <StatCard title="Profit Margin" value={`${profitMargin}%`} icon={Percent} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Profit Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={MONTHLY_DATA}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/></linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip formatter={(value) => `$${value.toLocaleString()}`} /><Legend />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="url(#colorRevenue)" name="Revenue" />
              <Area type="monotone" dataKey="profit" stroke="#3B82F6" fill="url(#colorProfit)" name="Profit" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown (Current Month)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={revenueBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                {revenueBreakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip formatter={(value) => `$${value.toLocaleString()}`} /><Legend />
              <Bar dataKey="revenue" fill="#10B981" name="Revenue" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#EF4444" name="Expenses" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" fill="#3B82F6" name="Profit" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Sources</h3>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><Building2 className="w-5 h-5 text-purple-600" /><span className="font-medium">Bank Subscriptions</span></div><span className="font-bold text-purple-600">${(currentMonth.bankSubs / 1000).toFixed(0)}K</span></div>
              <div className="w-full bg-purple-200 rounded-full h-2"><div className="bg-purple-600 h-2 rounded-full" style={{ width: `${(currentMonth.bankSubs / currentMonth.revenue * 100)}%` }}></div></div>
              <p className="text-sm text-gray-600 mt-2">8 active banks • {(currentMonth.bankSubs / currentMonth.revenue * 100).toFixed(0)}% of revenue</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><Landmark className="w-5 h-5 text-emerald-600" /><span className="font-medium">Investor Subscriptions</span></div><span className="font-bold text-emerald-600">${(currentMonth.investorSubs / 1000).toFixed(0)}K</span></div>
              <div className="w-full bg-emerald-200 rounded-full h-2"><div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${(currentMonth.investorSubs / currentMonth.revenue * 100)}%` }}></div></div>
              <p className="text-sm text-gray-600 mt-2">9 active investors • {(currentMonth.investorSubs / currentMonth.revenue * 100).toFixed(0)}% of revenue</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><DollarSign className="w-5 h-5 text-blue-600" /><span className="font-medium">Transaction Fees</span></div><span className="font-bold text-blue-600">${(currentMonth.txnFees / 1000).toFixed(0)}K</span></div>
              <div className="w-full bg-blue-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(currentMonth.txnFees / currentMonth.revenue * 100)}%` }}></div></div>
              <p className="text-sm text-gray-600 mt-2">0.15% platform fee • {(currentMonth.txnFees / currentMonth.revenue * 100).toFixed(0)}% of revenue</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Bank Subs</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Investor Subs</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Txn Fees</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Revenue</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Expenses</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Net Profit</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MONTHLY_DATA.map(month => (
                <tr key={month.month} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{month.month}</td>
                  <td className="px-4 py-3 text-right text-gray-600">${(month.bankSubs / 1000).toFixed(0)}K</td>
                  <td className="px-4 py-3 text-right text-gray-600">${(month.investorSubs / 1000).toFixed(0)}K</td>
                  <td className="px-4 py-3 text-right text-gray-600">${(month.txnFees / 1000).toFixed(0)}K</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">${(month.revenue / 1000).toFixed(0)}K</td>
                  <td className="px-4 py-3 text-right text-red-600">${(month.expenses / 1000).toFixed(0)}K</td>
                  <td className="px-4 py-3 text-right font-medium text-green-600">${(month.profit / 1000).toFixed(0)}K</td>
                  <td className="px-4 py-3 text-right text-gray-600">{(month.profit / month.revenue * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlatformPL;
