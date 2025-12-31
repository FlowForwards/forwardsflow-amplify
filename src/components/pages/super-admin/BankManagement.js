// BankManagement.js - Super Admin Bank Management Page
import React, { useState } from 'react';
import { Building2, Plus, Search, Edit, Ban, Trash2, Eye, RefreshCw, X, CheckCircle, Clock, AlertTriangle, DollarSign, Users, TrendingUp, Phone, Mail, MapPin, Shield } from 'lucide-react';

const SAMPLE_BANKS = [
  { tenantId: 'bank_001', name: 'Equity Bank Kenya', email: 'admin@equity.co.ke', phone: '+254 20 2262000', country: 'Kenya', status: 'active', capitalCallingLimit: 200000000, totalDeposits: 180000000, loansDisbursed: 4500000000, revenueToDate: 850000, joinedDate: '2024-01-15', usersCount: 45, subscriptionTier: 'enterprise', subscriptionStatus: 'active', subscriptionExpiry: '2025-01-15' },
  { tenantId: 'bank_002', name: 'KCB Bank', email: 'admin@kcb.co.ke', phone: '+254 20 3270000', country: 'Kenya', status: 'active', capitalCallingLimit: 180000000, totalDeposits: 150000000, loansDisbursed: 3800000000, revenueToDate: 680000, joinedDate: '2024-02-20', usersCount: 38, subscriptionTier: 'enterprise', subscriptionStatus: 'active', subscriptionExpiry: '2025-02-20' },
  { tenantId: 'bank_003', name: 'DTB Kenya', email: 'admin@dtb.co.ke', phone: '+254 20 2851000', country: 'Kenya', status: 'active', capitalCallingLimit: 120000000, totalDeposits: 95000000, loansDisbursed: 2200000000, revenueToDate: 420000, joinedDate: '2024-03-10', usersCount: 28, subscriptionTier: 'professional', subscriptionStatus: 'active', subscriptionExpiry: '2025-03-10' },
  { tenantId: 'bank_004', name: 'Stanbic Bank', email: 'admin@stanbic.co.ke', phone: '+254 20 3638000', country: 'Kenya', status: 'active', capitalCallingLimit: 100000000, totalDeposits: 75000000, loansDisbursed: 1500000000, revenueToDate: 280000, joinedDate: '2024-04-05', usersCount: 22, subscriptionTier: 'professional', subscriptionStatus: 'active', subscriptionExpiry: '2025-04-05' },
  { tenantId: 'bank_005', name: 'CRDB Bank Tanzania', email: 'admin@crdb.co.tz', phone: '+255 22 2117442', country: 'Tanzania', status: 'active', capitalCallingLimit: 80000000, totalDeposits: 45000000, loansDisbursed: 500000000, revenueToDate: 120000, joinedDate: '2024-05-15', usersCount: 15, subscriptionTier: 'professional', subscriptionStatus: 'active', subscriptionExpiry: '2025-05-15' },
  { tenantId: 'bank_006', name: 'NMB Bank Tanzania', email: 'admin@nmb.co.tz', phone: '+255 22 2116264', country: 'Tanzania', status: 'active', capitalCallingLimit: 60000000, totalDeposits: 30000000, loansDisbursed: 350000000, revenueToDate: 45000, joinedDate: '2024-06-01', usersCount: 8, subscriptionTier: 'starter', subscriptionStatus: 'active', subscriptionExpiry: '2025-06-01' },
  { tenantId: 'bank_007', name: 'Centenary Bank Uganda', email: 'admin@centenary.co.ug', phone: '+256 417 251276', country: 'Uganda', status: 'active', capitalCallingLimit: 50000000, totalDeposits: 25000000, loansDisbursed: 280000000, revenueToDate: 35000, joinedDate: '2024-07-10', usersCount: 6, subscriptionTier: 'starter', subscriptionStatus: 'active', subscriptionExpiry: '2025-07-10' },
  { tenantId: 'bank_008', name: 'Access Bank Rwanda', email: 'admin@accessbank.rw', phone: '+250 788 145000', country: 'Rwanda', status: 'suspended', capitalCallingLimit: 40000000, totalDeposits: 0, loansDisbursed: 0, revenueToDate: 20000, joinedDate: '2024-08-01', usersCount: 4, subscriptionTier: 'starter', subscriptionStatus: 'expired', subscriptionExpiry: '2024-11-01' }
];

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => {
  const colorClasses = {
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600'
  };
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
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

const BankManagement = () => {
  const [banks, setBanks] = useState(SAMPLE_BANKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', country: 'Kenya', subscriptionTier: 'starter' });

  const filteredBanks = banks.filter(bank => {
    const matchesSearch = bank.name.toLowerCase().includes(searchTerm.toLowerCase()) || bank.email.toLowerCase().includes(searchTerm.toLowerCase()) || bank.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bank.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeBanks = banks.filter(b => b.status === 'active').length;
  const totalDeposits = banks.reduce((sum, b) => sum + b.totalDeposits, 0);
  const totalRevenue = banks.reduce((sum, b) => sum + b.revenueToDate, 0);

  const handleSuspend = (bank) => {
    setBanks(banks.map(b => b.tenantId === bank.tenantId ? { ...b, status: b.status === 'suspended' ? 'active' : 'suspended' } : b));
  };

  const handleDelete = (bank) => {
    if (window.confirm(`Are you sure you want to delete ${bank.name}?`)) {
      setBanks(banks.filter(b => b.tenantId !== bank.tenantId));
    }
  };

  const handleAddBank = (e) => {
    e.preventDefault();
    const newBank = {
      tenantId: `bank_${Date.now()}`,
      ...formData,
      status: 'pending',
      capitalCallingLimit: 50000000,
      totalDeposits: 0,
      loansDisbursed: 0,
      revenueToDate: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      usersCount: 0,
      subscriptionStatus: 'pending',
      subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setBanks([...banks, newBank]);
    setShowAddModal(false);
    setFormData({ name: '', email: '', phone: '', country: 'Kenya', subscriptionTier: 'starter' });
  };

  const getStatusColor = (status) => {
    const colors = { active: 'bg-green-100 text-green-700', suspended: 'bg-red-100 text-red-700', pending: 'bg-yellow-100 text-yellow-700' };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getSubscriptionColor = (tier) => {
    const colors = { enterprise: 'bg-purple-100 text-purple-700', professional: 'bg-blue-100 text-blue-700', starter: 'bg-gray-100 text-gray-700' };
    return colors[tier] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bank Management</h1>
            <p className="text-gray-600 mt-1">Manage partner banks, onboarding, and integration status</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <Plus className="w-4 h-4" />Add Bank
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Banks" value={banks.length} icon={Building2} color="purple" subtitle={`${activeBanks} active`} />
        <StatCard title="Active Banks" value={activeBanks} icon={CheckCircle} color="green" />
        <StatCard title="Total Deposits" value={`¥${(totalDeposits / 1000000).toFixed(0)}M`} icon={TrendingUp} color="blue" />
        <StatCard title="Revenue Generated" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} color="green" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Partner Banks ({banks.length})</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search banks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64" />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deposits</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBanks.map(bank => (
                <tr key={bank.tenantId} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{bank.name}</p>
                        <p className="text-xs text-gray-500">{bank.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-600">{bank.country}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bank.status)}`}>{bank.status}</span>
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900">¥{(bank.totalDeposits / 1000000).toFixed(0)}M</td>
                  <td className="px-4 py-4 text-green-600 font-medium">${bank.revenueToDate.toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getSubscriptionColor(bank.subscriptionTier)}`}>{bank.subscriptionTier}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setSelectedBank(bank); setShowDetailsModal(true); }} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg" title="View Details"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleSuspend(bank)} className={`p-1.5 rounded-lg ${bank.status === 'suspended' ? 'text-green-600 hover:bg-green-50' : 'text-amber-600 hover:bg-amber-50'}`} title={bank.status === 'suspended' ? 'Reactivate' : 'Suspend'}><Ban className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(bank)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Bank Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Bank">
        <form onSubmit={handleAddBank} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter bank name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="admin@bank.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="+254 xxx xxx xxx" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="Kenya">Kenya</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Uganda">Uganda</option>
              <option value="Rwanda">Rwanda</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Tier</label>
            <select value={formData.subscriptionTier} onChange={(e) => setFormData({ ...formData, subscriptionTier: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="starter">Starter - $2,500/mo</option>
              <option value="professional">Professional - $7,500/mo</option>
              <option value="enterprise">Enterprise - $15,000/mo</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Add Bank</button>
          </div>
        </form>
      </Modal>

      {/* Bank Details Modal */}
      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Bank Details" size="lg">
        {selectedBank && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-purple-100 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedBank.name}</h3>
                <p className="text-gray-500">{selectedBank.email}</p>
              </div>
              <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBank.status)}`}>{selectedBank.status}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Country</p>
                <p className="font-semibold text-gray-900">{selectedBank.country}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Capital Limit</p>
                <p className="font-semibold text-gray-900">¥{(selectedBank.capitalCallingLimit / 1000000).toFixed(0)}M</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Deposits</p>
                <p className="font-semibold text-green-600">¥{(selectedBank.totalDeposits / 1000000).toFixed(0)}M</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="font-semibold text-green-600">${selectedBank.revenueToDate.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Users</p>
                <p className="font-semibold text-gray-900">{selectedBank.usersCount}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Loans Disbursed</p>
                <p className="font-semibold text-gray-900">KES {(selectedBank.loansDisbursed / 1000000000).toFixed(1)}B</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Subscription</p>
                <p className="font-semibold capitalize">{selectedBank.subscriptionTier}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Joined</p>
                <p className="font-semibold text-gray-900">{selectedBank.joinedDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{selectedBank.phone}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BankManagement;
