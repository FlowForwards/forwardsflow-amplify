// AllInstruments.js - Super Admin All Instruments Page
import React, { useState } from 'react';
import { FileText, Search, Eye, Ban, RefreshCw, X, CheckCircle, Clock, AlertTriangle, Building2, TrendingUp, Percent, UserCheck, Shield } from 'lucide-react';

const SAMPLE_INSTRUMENTS = [
  { instrumentId: 'INST-001', name: 'Equity 12M Fixed Deposit', type: 'fixed_deposit', bankId: 'bank_001', bankName: 'Equity Bank Kenya', currency: 'KES:JPY', interestRate: 8.5, forwardsPremium: 0.75, hedgingFee: 0.30, platformFee: 0.20, totalYield: 9.75, minAmount: 10000000, maxAmount: 100000000, totalIssued: 12, totalValue: 180000000, status: 'active', kycVerified: true, amlCleared: true, createdAt: '2024-01-15', maturityDate: '2025-01-15' },
  { instrumentId: 'INST-002', name: 'KCB 6M Time Deposit', type: 'time_deposit', bankId: 'bank_002', bankName: 'KCB Bank', currency: 'KES:JPY', interestRate: 7.5, forwardsPremium: 0.65, hedgingFee: 0.25, platformFee: 0.15, totalYield: 8.55, minAmount: 5000000, maxAmount: 50000000, totalIssued: 8, totalValue: 95000000, status: 'active', kycVerified: true, amlCleared: true, createdAt: '2024-03-01', maturityDate: '2024-09-01' },
  { instrumentId: 'INST-003', name: 'DTB 9M Certificate', type: 'certificate_of_deposit', bankId: 'bank_003', bankName: 'DTB Kenya', currency: 'KES:CHF', interestRate: 9.0, forwardsPremium: 0.95, hedgingFee: 0.35, platformFee: 0.20, totalYield: 10.50, minAmount: 10000000, maxAmount: 75000000, totalIssued: 5, totalValue: 55000000, status: 'active', kycVerified: true, amlCleared: true, createdAt: '2024-04-10', maturityDate: '2025-01-10' },
  { instrumentId: 'INST-004', name: 'CRDB 12M Fixed Deposit', type: 'fixed_deposit', bankId: 'bank_005', bankName: 'CRDB Bank Tanzania', currency: 'TZS:JPY', interestRate: 10.5, forwardsPremium: 1.25, hedgingFee: 0.30, platformFee: 0.20, totalYield: 12.25, minAmount: 5000000, maxAmount: 50000000, totalIssued: 4, totalValue: 45000000, status: 'active', kycVerified: true, amlCleared: false, createdAt: '2024-05-15', maturityDate: '2025-05-15' },
  { instrumentId: 'INST-005', name: 'Stanbic 3M Time Deposit', type: 'time_deposit', bankId: 'bank_004', bankName: 'Stanbic Bank', currency: 'KES:JPY', interestRate: 6.0, forwardsPremium: 0.50, hedgingFee: 0.15, platformFee: 0.10, totalYield: 6.75, minAmount: 5000000, maxAmount: 30000000, totalIssued: 3, totalValue: 25000000, status: 'suspended', kycVerified: true, amlCleared: true, createdAt: '2024-06-01', maturityDate: '2024-09-01' },
  { instrumentId: 'INST-006', name: 'NMB 6M Fixed Deposit', type: 'fixed_deposit', bankId: 'bank_006', bankName: 'NMB Bank Tanzania', currency: 'TZS:JPY', interestRate: 9.5, forwardsPremium: 1.10, hedgingFee: 0.25, platformFee: 0.15, totalYield: 11.00, minAmount: 3000000, maxAmount: 25000000, totalIssued: 2, totalValue: 15000000, status: 'active', kycVerified: true, amlCleared: true, createdAt: '2024-07-01', maturityDate: '2025-01-01' }
];

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => {
  const colorClasses = { blue: 'bg-blue-100 text-blue-600', green: 'bg-green-100 text-green-600', amber: 'bg-amber-100 text-amber-600', purple: 'bg-purple-100 text-purple-600' };
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

const AllInstruments = () => {
  const [instruments, setInstruments] = useState(SAMPLE_INSTRUMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState(null);

  const filteredInstruments = instruments.filter(inst => {
    const matchesSearch = inst.instrumentId.toLowerCase().includes(searchTerm.toLowerCase()) || inst.name.toLowerCase().includes(searchTerm.toLowerCase()) || inst.bankName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inst.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeInstruments = instruments.filter(i => i.status === 'active').length;
  const suspendedInstruments = instruments.filter(i => i.status === 'suspended').length;
  const totalValue = instruments.reduce((sum, i) => sum + i.totalValue, 0);

  const handleSuspend = (instrument) => {
    setInstruments(instruments.map(i => i.instrumentId === instrument.instrumentId ? { ...i, status: i.status === 'suspended' ? 'active' : 'suspended' } : i));
  };

  const getStatusColor = (status) => ({ active: 'bg-green-100 text-green-700', suspended: 'bg-amber-100 text-amber-700', cancelled: 'bg-red-100 text-red-700' }[status] || 'bg-gray-100 text-gray-700');
  const getTypeLabel = (type) => ({ fixed_deposit: 'Fixed Deposit', time_deposit: 'Time Deposit', certificate_of_deposit: 'Certificate of Deposit' }[type] || type);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Instruments</h1>
        <p className="text-gray-600 mt-1">View and manage all deposit instruments across the platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Instruments" value={instruments.length} icon={FileText} color="blue" />
        <StatCard title="Active" value={activeInstruments} icon={CheckCircle} color="green" />
        <StatCard title="Suspended" value={suspendedInstruments} icon={AlertTriangle} color="amber" />
        <StatCard title="Total Value" value={`¥${(totalValue / 1000000).toFixed(0)}M`} icon={TrendingUp} color="green" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-lg font-semibold text-gray-900">All Instruments</h3>
            <div className="flex items-center gap-3">
              <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search instruments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64" /></div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg"><option value="all">All Status</option><option value="active">Active</option><option value="suspended">Suspended</option></select>
              <button className="p-2 hover:bg-gray-100 rounded-lg"><RefreshCw className="w-5 h-5 text-gray-500" /></button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instrument</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Currency</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yield</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compliance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInstruments.map(inst => (
                <tr key={inst.instrumentId} className="hover:bg-gray-50">
                  <td className="px-4 py-4"><p className="font-medium text-gray-900">{inst.instrumentId}</p><p className="text-xs text-gray-500">{inst.name}</p></td>
                  <td className="px-4 py-4"><div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-purple-600" /><span className="text-sm">{inst.bankName}</span></div></td>
                  <td className="px-4 py-4 text-sm text-gray-600">{getTypeLabel(inst.type)}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{inst.currency}</td>
                  <td className="px-4 py-4"><span className="font-medium text-green-600">{inst.totalYield}%</span></td>
                  <td className="px-4 py-4 font-medium text-gray-900">¥{(inst.totalValue / 1000000).toFixed(0)}M</td>
                  <td className="px-4 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inst.status)}`}>{inst.status}</span></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center ${inst.kycVerified ? 'bg-green-100' : 'bg-red-100'}`}>{inst.kycVerified ? <UserCheck className="w-3 h-3 text-green-600" /> : <X className="w-3 h-3 text-red-600" />}</span>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center ${inst.amlCleared ? 'bg-green-100' : 'bg-red-100'}`}>{inst.amlCleared ? <Shield className="w-3 h-3 text-green-600" /> : <X className="w-3 h-3 text-red-600" />}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setSelectedInstrument(inst); setShowDetailsModal(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleSuspend(inst)} className={`p-1.5 rounded-lg ${inst.status === 'suspended' ? 'text-green-600 hover:bg-green-50' : 'text-amber-600 hover:bg-amber-50'}`}><Ban className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Instrument Details">
        {selectedInstrument && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div><h3 className="text-xl font-bold text-gray-900">{selectedInstrument.instrumentId}</h3><p className="text-gray-500">{selectedInstrument.name}</p></div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedInstrument.status)}`}>{selectedInstrument.status}</span>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg"><div className="flex items-center gap-2 mb-2"><Building2 className="w-5 h-5 text-purple-600" /><span className="font-medium">Issuing Bank</span></div><p className="text-lg font-semibold text-gray-900">{selectedInstrument.bankName}</p></div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Type</p><p className="font-semibold">{getTypeLabel(selectedInstrument.type)}</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Currency Pair</p><p className="font-semibold">{selectedInstrument.currency}</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Min Amount</p><p className="font-semibold">¥{(selectedInstrument.minAmount / 1000000).toFixed(0)}M</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Max Amount</p><p className="font-semibold">¥{(selectedInstrument.maxAmount / 1000000).toFixed(0)}M</p></div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Percent className="w-5 h-5 text-green-600" />Yield Breakdown</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-2 bg-gray-50 rounded"><p className="text-xs text-gray-500">Interest Rate</p><p className="font-bold text-gray-900">{selectedInstrument.interestRate}%</p></div>
                <div className="text-center p-2 bg-gray-50 rounded"><p className="text-xs text-gray-500">Forwards Premium</p><p className="font-bold text-gray-900">+{selectedInstrument.forwardsPremium}%</p></div>
                <div className="text-center p-2 bg-gray-50 rounded"><p className="text-xs text-gray-500">Hedging Fee</p><p className="font-bold text-red-600">-{selectedInstrument.hedgingFee}%</p></div>
                <div className="text-center p-2 bg-gray-50 rounded"><p className="text-xs text-gray-500">Platform Fee</p><p className="font-bold text-red-600">-{selectedInstrument.platformFee}%</p></div>
                <div className="text-center p-2 bg-green-50 rounded border border-green-200"><p className="text-xs text-gray-500">Total Yield</p><p className="font-bold text-green-600">{selectedInstrument.totalYield}%</p></div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Issued Count</p><p className="font-semibold">{selectedInstrument.totalIssued}</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Total Value</p><p className="font-semibold text-green-600">¥{(selectedInstrument.totalValue / 1000000).toFixed(0)}M</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Created</p><p className="font-semibold">{selectedInstrument.createdAt}</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Maturity</p><p className="font-semibold">{selectedInstrument.maturityDate}</p></div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Compliance Status</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${selectedInstrument.kycVerified ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center gap-2"><UserCheck className={`w-5 h-5 ${selectedInstrument.kycVerified ? 'text-green-600' : 'text-red-600'}`} /><span className="font-medium">KYC Verification</span></div>
                  <p className={`mt-1 text-sm ${selectedInstrument.kycVerified ? 'text-green-700' : 'text-red-700'}`}>{selectedInstrument.kycVerified ? 'Verified' : 'Pending Verification'}</p>
                </div>
                <div className={`p-4 rounded-lg ${selectedInstrument.amlCleared ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center gap-2"><Shield className={`w-5 h-5 ${selectedInstrument.amlCleared ? 'text-green-600' : 'text-red-600'}`} /><span className="font-medium">AML Clearance</span></div>
                  <p className={`mt-1 text-sm ${selectedInstrument.amlCleared ? 'text-green-700' : 'text-red-700'}`}>{selectedInstrument.amlCleared ? 'Cleared' : 'Pending Clearance'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AllInstruments;
