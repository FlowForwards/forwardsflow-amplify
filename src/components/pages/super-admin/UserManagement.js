// UserManagement.js - Super Admin User Management Page
import React, { useState } from 'react';
import { Users, Plus, Search, Edit, Ban, Trash2, Eye, RefreshCw, X, CheckCircle, Building2, Landmark, Shield, Mail, Clock } from 'lucide-react';

const SAMPLE_USERS = [
  { userId: 'usr_001', name: 'James Mwangi', email: 'james@equity.co.ke', role: 'bank_admin', roleDisplay: 'Bank Admin', tenantId: 'bank_001', tenantName: 'Equity Bank Kenya', tenantType: 'bank', status: 'active', lastLogin: '2024-12-10T10:30:00Z', createdAt: '2024-01-15' },
  { userId: 'usr_002', name: 'Sarah Ochieng', email: 'sarah@equity.co.ke', role: 'bank_lender', roleDisplay: 'Bank Lender', tenantId: 'bank_001', tenantName: 'Equity Bank Kenya', tenantType: 'bank', status: 'active', lastLogin: '2024-12-10T09:15:00Z', createdAt: '2024-02-20' },
  { userId: 'usr_003', name: 'Peter Kimani', email: 'peter@kcb.co.ke', role: 'bank_compliance', roleDisplay: 'Compliance Officer', tenantId: 'bank_002', tenantName: 'KCB Bank', tenantType: 'bank', status: 'active', lastLogin: '2024-12-09T16:45:00Z', createdAt: '2024-03-01' },
  { userId: 'usr_004', name: 'Grace Wanjiku', email: 'grace@kcb.co.ke', role: 'bank_risk', roleDisplay: 'Risk Officer', tenantId: 'bank_002', tenantName: 'KCB Bank', tenantType: 'bank', status: 'active', lastLogin: '2024-12-10T08:00:00Z', createdAt: '2024-03-15' },
  { userId: 'usr_005', name: 'Michael Oduya', email: 'michael@crdb.co.tz', role: 'bank_caller', roleDisplay: 'Capital Caller', tenantId: 'bank_005', tenantName: 'CRDB Bank Tanzania', tenantType: 'bank', status: 'pending', lastLogin: '', createdAt: '2024-12-08' },
  { userId: 'usr_006', name: 'John Smith', email: 'john@impactcapital.com', role: 'investor_admin', roleDisplay: 'Investor Admin', tenantId: 'inv_001', tenantName: 'Impact Capital Partners', tenantType: 'investor', status: 'active', lastLogin: '2024-12-10T11:00:00Z', createdAt: '2024-01-20' },
  { userId: 'usr_007', name: 'Emma Wilson', email: 'emma@impactcapital.com', role: 'investor_analyst', roleDisplay: 'Investment Analyst', tenantId: 'inv_001', tenantName: 'Impact Capital Partners', tenantType: 'investor', status: 'active', lastLogin: '2024-12-09T14:30:00Z', createdAt: '2024-02-25' },
  { userId: 'usr_008', name: 'David Admin', email: 'admin@forwardsflow.com', role: 'super_admin', roleDisplay: 'Super Admin', tenantId: 'platform', tenantName: 'ForwardsFlow Platform', tenantType: 'platform', status: 'active', lastLogin: '2024-12-10T12:00:00Z', createdAt: '2024-01-01' },
  { userId: 'usr_009', name: 'Lisa Support', email: 'support@forwardsflow.com', role: 'platform_support', roleDisplay: 'Platform Support', tenantId: 'platform', tenantName: 'ForwardsFlow Platform', tenantType: 'platform', status: 'active', lastLogin: '2024-12-10T10:00:00Z', createdAt: '2024-01-05' }
];

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => {
  const colorClasses = { blue: 'bg-blue-100 text-blue-600', purple: 'bg-purple-100 text-purple-600', emerald: 'bg-emerald-100 text-emerald-600', amber: 'bg-amber-100 text-amber-600' };
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
      <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100"><h3 className="text-lg font-semibold text-gray-900">{title}</h3><button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button></div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState(SAMPLE_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [tenantTypeFilter, setTenantTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'bank_lender', tenantType: 'bank', tenantName: '' });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTenantType = tenantTypeFilter === 'all' || user.tenantType === tenantTypeFilter;
    return matchesSearch && matchesTenantType;
  });

  const bankUsers = users.filter(u => u.tenantType === 'bank').length;
  const investorUsers = users.filter(u => u.tenantType === 'investor').length;
  const platformUsers = users.filter(u => u.tenantType === 'platform').length;

  const handleSuspend = (user) => setUsers(users.map(u => u.userId === user.userId ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' } : u));
  const handleDelete = (user) => { if (window.confirm(`Delete ${user.name}?`)) setUsers(users.filter(u => u.userId !== user.userId)); };

  const handleAddUser = (e) => {
    e.preventDefault();
    const roleDisplayMap = { bank_admin: 'Bank Admin', bank_lender: 'Bank Lender', bank_caller: 'Capital Caller', bank_compliance: 'Compliance Officer', bank_risk: 'Risk Officer', investor_admin: 'Investor Admin', investor_analyst: 'Investment Analyst', super_admin: 'Super Admin', platform_support: 'Platform Support' };
    const newUser = { userId: `usr_${Date.now()}`, ...formData, roleDisplay: roleDisplayMap[formData.role], tenantId: `${formData.tenantType}_${Date.now()}`, status: 'pending', lastLogin: '', createdAt: new Date().toISOString().split('T')[0] };
    setUsers([...users, newUser]);
    setShowAddModal(false);
    setFormData({ name: '', email: '', role: 'bank_lender', tenantType: 'bank', tenantName: '' });
  };

  const getStatusColor = (status) => ({ active: 'bg-green-100 text-green-700', suspended: 'bg-red-100 text-red-700', pending: 'bg-yellow-100 text-yellow-700' }[status] || 'bg-gray-100 text-gray-700');
  const getRoleColor = (role) => role.startsWith('bank') ? 'bg-purple-100 text-purple-700' : role.startsWith('investor') ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700';
  const getTenantIcon = (type) => type === 'bank' ? Building2 : type === 'investor' ? Landmark : Shield;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-gray-900">User Management</h1><p className="text-gray-600 mt-1">Manage users across all tenants and platform</p></div>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus className="w-4 h-4" />Add User</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Users" value={users.length} icon={Users} color="blue" />
        <StatCard title="Bank Users" value={bankUsers} icon={Building2} color="purple" />
        <StatCard title="Investor Users" value={investorUsers} icon={Landmark} color="emerald" />
        <StatCard title="Platform Users" value={platformUsers} icon={Shield} color="amber" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-lg font-semibold text-gray-900">All Users ({users.length})</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64" />
              </div>
              <select value={tenantTypeFilter} onChange={(e) => setTenantTypeFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg">
                <option value="all">All Types</option><option value="bank">Bank</option><option value="investor">Investor</option><option value="platform">Platform</option>
              </select>
              <button className="p-2 hover:bg-gray-100 rounded-lg"><RefreshCw className="w-5 h-5 text-gray-500" /></button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(user => {
                const TenantIcon = getTenantIcon(user.tenantType);
                return (
                  <tr key={user.userId} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">{user.name.split(' ').map(n => n[0]).join('')}</div>
                        <div><p className="font-medium text-gray-900">{user.name}</p><p className="text-xs text-gray-500">{user.email}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-4"><div className="flex items-center gap-2"><TenantIcon className={`w-4 h-4 ${user.tenantType === 'bank' ? 'text-purple-600' : user.tenantType === 'investor' ? 'text-emerald-600' : 'text-blue-600'}`} /><span className="text-gray-600 text-sm">{user.tenantName}</span></div></td>
                    <td className="px-4 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>{user.roleDisplay}</span></td>
                    <td className="px-4 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>{user.status}</span></td>
                    <td className="px-4 py-4 text-sm text-gray-500">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setSelectedUser(user); setShowDetailsModal(true); }} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"><Eye className="w-4 h-4" /></button>
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleSuspend(user)} className={`p-1.5 rounded-lg ${user.status === 'suspended' ? 'text-green-600 hover:bg-green-50' : 'text-amber-600 hover:bg-amber-50'}`}><Ban className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(user)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New User">
        <form onSubmit={handleAddUser} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="Enter full name" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="user@company.com" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Tenant Type</label><select value={formData.tenantType} onChange={(e) => setFormData({ ...formData, tenantType: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg"><option value="bank">Bank</option><option value="investor">Investor</option><option value="platform">Platform</option></select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Tenant Name</label><input type="text" required value={formData.tenantName} onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="Organization name" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Role</label><select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg"><option value="bank_admin">Bank Admin</option><option value="bank_lender">Bank Lender</option><option value="bank_caller">Capital Caller</option><option value="bank_compliance">Compliance Officer</option><option value="bank_risk">Risk Officer</option><option value="investor_admin">Investor Admin</option><option value="investor_analyst">Investment Analyst</option><option value="super_admin">Super Admin</option><option value="platform_support">Platform Support</option></select></div>
          <div className="flex gap-3 pt-4"><button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add User</button></div>
        </form>
      </Modal>

      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="User Details">
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">{selectedUser.name.split(' ').map(n => n[0]).join('')}</div>
              <div><h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3><p className="text-gray-500">{selectedUser.email}</p></div>
              <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedUser.status)}`}>{selectedUser.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Role</p><p className="font-semibold">{selectedUser.roleDisplay}</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Tenant</p><p className="font-semibold">{selectedUser.tenantName}</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Last Login</p><p className="font-semibold">{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Never'}</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Created</p><p className="font-semibold">{selectedUser.createdAt}</p></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
