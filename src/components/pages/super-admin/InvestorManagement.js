// InvestorManagement.js - Super Admin Investor Management Page
import React, { useState } from 'react';
import { Landmark, Plus, Search, Edit, Ban, Trash2, Eye, RefreshCw, X, CheckCircle, DollarSign, TrendingUp, Phone } from 'lucide-react';

const SAMPLE_INVESTORS = [
  { tenantId: 'inv_001', name: 'Impact Capital Partners', email: 'admin@impactcapital.com', phone: '+1 212 555 0100', country: 'USA', status: 'active', totalInvested: 125000000, activeDeposits: 85000000, revenueToDate: 450000, joinedDate: '2024-01-10', usersCount: 12, subscriptionTier: 'enterprise', subscriptionStatus: 'active', riskProfile: 'moderate' },
  { tenantId: 'inv_002', name: 'Shell Foundation', email: 'investments@shellfoundation.org', phone: '+44 20 7934 8000', country: 'UK', status: 'active', totalInvested: 95000000, activeDeposits: 65000000, revenueToDate: 320000, joinedDate: '2024-02-15', usersCount: 8, subscriptionTier: 'enterprise', subscriptionStatus: 'active', riskProfile: 'conservative' },
  { tenantId: 'inv_003', name: 'Nordic Impact Fund', email: 'info@nordicimpact.no', phone: '+47 22 00 0000', country: 'Norway', status: 'active', totalInvested: 75000000, activeDeposits: 50000000, revenueToDate: 180000, joinedDate: '2024-03-20', usersCount: 6, subscriptionTier: 'professional', subscriptionStatus: 'active', riskProfile: 'moderate' },
  { tenantId: 'inv_004', name: 'Acumen Fund', email: 'invest@acumen.org', phone: '+1 212 566 8821', country: 'USA', status: 'active', totalInvested: 60000000, activeDeposits: 40000000, revenueToDate: 150000, joinedDate: '2024-04-10', usersCount: 5, subscriptionTier: 'professional', subscriptionStatus: 'active', riskProfile: 'aggressive' },
  { tenantId: 'inv_005', name: 'Triodos Investment', email: 'africa@triodos.com', phone: '+31 30 693 6500', country: 'Netherlands', status: 'active', totalInvested: 55000000, activeDeposits: 35000000, revenueToDate: 120000, joinedDate: '2024-05-05', usersCount: 4, subscriptionTier: 'professional', subscriptionStatus: 'active', riskProfile: 'conservative' },
  { tenantId: 'inv_006', name: 'ResponsAbility', email: 'investments@responsability.com', phone: '+41 44 403 0500', country: 'Switzerland', status: 'active', totalInvested: 45000000, activeDeposits: 30000000, revenueToDate: 95000, joinedDate: '2024-06-15', usersCount: 4, subscriptionTier: 'professional', subscriptionStatus: 'active', riskProfile: 'moderate' },
  { tenantId: 'inv_007', name: 'BlueOrchard Finance', email: 'info@blueorchard.com', phone: '+41 22 596 4777', country: 'Switzerland', status: 'active', totalInvested: 40000000, activeDeposits: 25000000, revenueToDate: 80000, joinedDate: '2024-07-01', usersCount: 3, subscriptionTier: 'starter', subscriptionStatus: 'active', riskProfile: 'moderate' },
  { tenantId: 'inv_008', name: 'Oikocredit', email: 'africa@oikocredit.org', phone: '+31 33 422 4040', country: 'Netherlands', status: 'active', totalInvested: 35000000, activeDeposits: 20000000, revenueToDate: 55000, joinedDate: '2024-08-10', usersCount: 3, subscriptionTier: 'starter', subscriptionStatus: 'active', riskProfile: 'conservative' },
  { tenantId: 'inv_009', name: 'Global Impact Fund', email: 'invest@globalimpact.jp', phone: '+81 3 1234 5678', country: 'Japan', status: 'suspended', totalInvested: 0, activeDeposits: 0, revenueToDate: 15000, joinedDate: '2024-09-01', usersCount: 2, subscriptionTier: 'starter', subscriptionStatus: 'expired', riskProfile: 'moderate' }
];

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => {
  const colorClasses = { emerald: 'bg-emerald-100 text-emerald-600', green: 'bg-green-100 text-green-600', blue: 'bg-blue-100 text-blue-600' };
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}><Icon className="w-6 h-6" /></div>
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizeClasses = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white rounded-xl shadow-xl ${sizeClasses[size]} w-full mx-4 max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const InvestorManagement = () => {
  const [investors, setInvestors] = useState(SAMPLE_INVESTORS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', country: 'USA', subscriptionTier: 'starter', riskProfile: 'moderate' });

  const filteredInvestors = investors.filter(inv => {
    const matchesSearch = inv.name.toLowerCase().includes(searchTerm.toLowerCase()) || inv.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeInvestors = investors.filter(i => i.status === 'active').length;
  const totalInvested = investors.reduce((sum, i) => sum + i.totalInvested, 0);
  const totalRevenue = investors.reduce((sum, i) => sum + i.revenueToDate, 0);

  const handleSuspend = (investor) => {
    setInvestors(investors.map(i => i.tenantId === investor.tenantId ? { ...i, status: i.status === 'suspended' ? 'active' : 'suspended' } : i));
  };

  const handleDelete = (investor) => {
    if (window.confirm(`Are you sure you want to delete ${investor.name}?`)) {
      setInvestors(investors.filter(i => i.tenantId !== investor.tenantId));
    }
  };

  const handleAddInvestor = (e) => {
    e.preventDefault();
    const newInvestor = { tenantId: `inv_${Date.now()}`, ...formData, status: 'pending', totalInvested: 0, activeDeposits: 0, revenueToDate: 0, joinedDate: new Date().toISOString().split('T')[0], usersCount: 0, subscriptionStatus: 'pending' };
    setInvestors([...investors, newInvestor]);
    setShowAddModal(false);
    setFormData({ name: '', email: '', phone: '', country: 'USA', subscriptionTier: 'starter', riskProfile: 'moderate' });
  };

  const getStatusColor = (status) => ({ active: 'bg-green-100 text-green-700', suspended: 'bg-red-100 text-red-700', pending: 'bg-yellow-100 text-yellow-700' }[status] || 'bg-gray-100 text-gray-700');
  const getRiskColor = (risk) => ({ conservative: 'bg-blue-100 text-blue-700', moderate: 'bg-amber-100 text-amber-700', aggressive: 'bg-red-100 text-red-700' }[risk] || 'bg-gray-100 text-gray-700');
  const getSubscriptionColor = (tier) => ({ enterprise: 'bg-purple-100 text-purple-700', professional: 'bg-blue-100 text-blue-700', starter: 'bg-gray-100 text-gray-700' }[tier] || 'bg-gray-100 text-gray-700');

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Investor Management</h1>
            <p className="text-gray-600 mt-1">Manage impact investors, allocations, and portfolio tracking</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
            <Plus className="w-4 h-4" />Add Investor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Investors" value={investors.length} icon={Landmark} color="emerald" subtitle={`${activeInvestors} active`} />
        <StatCard title="Active Investors" value={activeInvestors} icon={CheckCircle} color="green" />
        <StatCard title="Total Invested" value={`$${(totalInvested / 1000000).toFixed(0)}M`} icon={TrendingUp} color="blue" />
        <StatCard title="Revenue Generated" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} color="green" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Impact Investors ({investors.length})</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search investors..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64" />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
              <button className="p-2 hover:bg-gray-100 rounded-lg"><RefreshCw className="w-5 h-5 text-gray-500" /></button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Profile</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invested</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvestors.map(investor => (
                <tr key={investor.tenantId} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Landmark className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{investor.name}</p>
                        <p className="text-xs text-gray-500">{investor.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-600">{investor.country}</td>
                  <td className="px-4 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(investor.status)}`}>{investor.status}</span></td>
                  <td className="px-4 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(investor.riskProfile)}`}>{investor.riskProfile}</span></td>
                  <td className="px-4 py-4 font-medium text-gray-900">${(investor.totalInvested / 1000000).toFixed(0)}M</td>
                  <td className="px-4 py-4 text-green-600 font-medium">${investor.revenueToDate.toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setSelectedInvestor(investor); setShowDetailsModal(true); }} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleSuspend(investor)} className={`p-1.5 rounded-lg ${investor.status === 'suspended' ? 'text-green-600 hover:bg-green-50' : 'text-amber-600 hover:bg-amber-50'}`}><Ban className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(investor)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Investor">
        <form onSubmit={handleAddInvestor} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Investor Name</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="Enter investor name" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="admin@investor.com" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="+1 xxx xxx xxxx" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Country</label><select value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg"><option value="USA">USA</option><option value="UK">UK</option><option value="Switzerland">Switzerland</option><option value="Netherlands">Netherlands</option><option value="Norway">Norway</option><option value="Japan">Japan</option></select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Risk Profile</label><select value={formData.riskProfile} onChange={(e) => setFormData({ ...formData, riskProfile: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg"><option value="conservative">Conservative</option><option value="moderate">Moderate</option><option value="aggressive">Aggressive</option></select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Subscription Tier</label><select value={formData.subscriptionTier} onChange={(e) => setFormData({ ...formData, subscriptionTier: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg"><option value="starter">Starter - $2,500/mo</option><option value="professional">Professional - $7,500/mo</option><option value="enterprise">Enterprise - $15,000/mo</option></select></div>
          <div className="flex gap-3 pt-4"><button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Add Investor</button></div>
        </form>
      </Modal>

      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Investor Details" size="lg">
        {selectedInvestor && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-emerald-100 flex items-center justify-center"><Landmark className="w-8 h-8 text-emerald-600" /></div>
              <div><h3 className="text-xl font-bold text-gray-900">{selectedInvestor.name}</h3><p className="text-gray-500">{selectedInvestor.email}</p></div>
              <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedInvestor.status)}`}>{selectedInvestor.status}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Country</p><p className="font-semibold">{selectedInvestor.country}</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Risk Profile</p><p className="font-semibold capitalize">{selectedInvestor.riskProfile}</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Total Invested</p><p className="font-semibold text-emerald-600">${(selectedInvestor.totalInvested / 1000000).toFixed(0)}M</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Revenue</p><p className="font-semibold text-green-600">${selectedInvestor.revenueToDate.toLocaleString()}</p></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Active Deposits</p><p className="font-semibold">${(selectedInvestor.activeDeposits / 1000000).toFixed(0)}M</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Users</p><p className="font-semibold">{selectedInvestor.usersCount}</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Subscription</p><p className="font-semibold capitalize">{selectedInvestor.subscriptionTier}</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Joined</p><p className="font-semibold">{selectedInvestor.joinedDate}</p></div>
            </div>
            <div className="flex items-center gap-2 pt-4 border-t border-gray-100"><Phone className="w-4 h-4 text-gray-400" /><span className="text-gray-600">{selectedInvestor.phone}</span></div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InvestorManagement;
