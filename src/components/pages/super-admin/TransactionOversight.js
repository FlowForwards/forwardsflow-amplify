// TransactionOversight.js - Super Admin Transaction Oversight Page
import React, { useState } from 'react';
import { ArrowRightLeft, Search, Eye, RefreshCw, X, CheckCircle, Clock, AlertTriangle, Building2, Landmark, UserCheck, Shield, FileText } from 'lucide-react';

const SAMPLE_TRANSACTIONS = [
  { txnId: 'TXN-001', type: 'deposit', bankId: 'bank_001', bankName: 'Equity Bank Kenya', investorId: 'inv_001', investorName: 'Impact Capital Partners', amount: 50000000, currency: 'JPY', status: 'completed', kycStatus: 'cleared', kycOfficer: 'Peter Kimani', kycDate: '2024-12-08', kycDocs: ['KYC Form', 'ID Verification', 'Source of Funds'], amlStatus: 'cleared', amlOfficer: 'Grace Wanjiku', amlDate: '2024-12-09', amlDocs: ['AML Screening Report', 'PEP Check'], createdAt: '2024-12-05', completedAt: '2024-12-10' },
  { txnId: 'TXN-002', type: 'deposit', bankId: 'bank_002', bankName: 'KCB Bank', investorId: 'inv_002', investorName: 'Shell Foundation', amount: 35000000, currency: 'JPY', status: 'pending_kyc', kycStatus: 'pending', kycOfficer: null, kycDate: null, kycDocs: [], amlStatus: 'pending', amlOfficer: null, amlDate: null, amlDocs: [], createdAt: '2024-12-08', completedAt: null },
  { txnId: 'TXN-003', type: 'deposit', bankId: 'bank_003', bankName: 'DTB Kenya', investorId: 'inv_003', investorName: 'Nordic Impact Fund', amount: 25000000, currency: 'CHF', status: 'pending_aml', kycStatus: 'cleared', kycOfficer: 'Peter Kimani', kycDate: '2024-12-09', kycDocs: ['KYC Form', 'ID Verification'], amlStatus: 'pending', amlOfficer: null, amlDate: null, amlDocs: [], createdAt: '2024-12-07', completedAt: null },
  { txnId: 'TXN-004', type: 'maturity', bankId: 'bank_001', bankName: 'Equity Bank Kenya', investorId: 'inv_004', investorName: 'Acumen Fund', amount: 40000000, currency: 'JPY', status: 'completed', kycStatus: 'cleared', kycOfficer: 'Sarah Ochieng', kycDate: '2024-11-15', kycDocs: ['KYC Form', 'ID Verification', 'Source of Funds'], amlStatus: 'cleared', amlOfficer: 'Grace Wanjiku', amlDate: '2024-11-16', amlDocs: ['AML Screening Report'], createdAt: '2024-11-10', completedAt: '2024-12-01' },
  { txnId: 'TXN-005', type: 'deposit', bankId: 'bank_005', bankName: 'CRDB Bank Tanzania', investorId: 'inv_005', investorName: 'Triodos Investment', amount: 20000000, currency: 'JPY', status: 'processing', kycStatus: 'cleared', kycOfficer: 'Peter Kimani', kycDate: '2024-12-09', kycDocs: ['KYC Form', 'ID Verification'], amlStatus: 'cleared', amlOfficer: 'Grace Wanjiku', amlDate: '2024-12-10', amlDocs: ['AML Screening Report', 'PEP Check'], createdAt: '2024-12-06', completedAt: null },
  { txnId: 'TXN-006', type: 'deposit', bankId: 'bank_004', bankName: 'Stanbic Bank', investorId: 'inv_006', investorName: 'ResponsAbility', amount: 30000000, currency: 'CHF', status: 'pending_kyc', kycStatus: 'review', kycOfficer: 'Peter Kimani', kycDate: null, kycDocs: ['KYC Form'], amlStatus: 'pending', amlOfficer: null, amlDate: null, amlDocs: [], createdAt: '2024-12-09', completedAt: null },
  { txnId: 'TXN-007', type: 'maturity', bankId: 'bank_002', bankName: 'KCB Bank', investorId: 'inv_007', investorName: 'BlueOrchard Finance', amount: 15000000, currency: 'JPY', status: 'completed', kycStatus: 'cleared', kycOfficer: 'Sarah Ochieng', kycDate: '2024-10-20', kycDocs: ['KYC Form', 'ID Verification'], amlStatus: 'cleared', amlOfficer: 'Grace Wanjiku', amlDate: '2024-10-21', amlDocs: ['AML Screening Report'], createdAt: '2024-10-15', completedAt: '2024-11-15' }
];

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => {
  const colorClasses = { blue: 'bg-blue-100 text-blue-600', green: 'bg-green-100 text-green-600', amber: 'bg-amber-100 text-amber-600', red: 'bg-red-100 text-red-600' };
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
      <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10"><h3 className="text-lg font-semibold text-gray-900">{title}</h3><button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button></div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const TransactionOversight = () => {
  const [transactions] = useState(SAMPLE_TRANSACTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);

  const filteredTxns = transactions.filter(txn => {
    const matchesSearch = txn.txnId.toLowerCase().includes(searchTerm.toLowerCase()) || txn.bankName.toLowerCase().includes(searchTerm.toLowerCase()) || txn.investorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const completedTxns = transactions.filter(t => t.status === 'completed').length;
  const pendingKyc = transactions.filter(t => t.status === 'pending_kyc').length;
  const pendingAml = transactions.filter(t => t.status === 'pending_aml').length;

  const getStatusColor = (status) => ({ completed: 'bg-green-100 text-green-700', pending_kyc: 'bg-amber-100 text-amber-700', pending_aml: 'bg-red-100 text-red-700', processing: 'bg-blue-100 text-blue-700' }[status] || 'bg-gray-100 text-gray-700');
  const getComplianceColor = (status) => ({ cleared: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-700', review: 'bg-blue-100 text-blue-700', flagged: 'bg-red-100 text-red-700' }[status] || 'bg-gray-100 text-gray-700');

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transaction Oversight</h1>
        <p className="text-gray-600 mt-1">Monitor all platform transactions with KYC/AML compliance status</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Transactions" value={transactions.length} icon={ArrowRightLeft} color="blue" />
        <StatCard title="Completed" value={completedTxns} icon={CheckCircle} color="green" />
        <StatCard title="Pending KYC" value={pendingKyc} icon={UserCheck} color="amber" />
        <StatCard title="Pending AML" value={pendingAml} icon={Shield} color="red" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-lg font-semibold text-gray-900">All Transactions</h3>
            <div className="flex items-center gap-3">
              <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search transactions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64" /></div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg"><option value="all">All Status</option><option value="completed">Completed</option><option value="pending_kyc">Pending KYC</option><option value="pending_aml">Pending AML</option><option value="processing">Processing</option></select>
              <button className="p-2 hover:bg-gray-100 rounded-lg"><RefreshCw className="w-5 h-5 text-gray-500" /></button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">KYC</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">AML</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTxns.map(txn => (
                <tr key={txn.txnId} className="hover:bg-gray-50">
                  <td className="px-4 py-4"><p className="font-medium text-gray-900">{txn.txnId}</p><p className="text-xs text-gray-500 capitalize">{txn.type}</p></td>
                  <td className="px-4 py-4"><div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-purple-600" /><span className="text-sm">{txn.bankName}</span></div></td>
                  <td className="px-4 py-4"><div className="flex items-center gap-2"><Landmark className="w-4 h-4 text-emerald-600" /><span className="text-sm">{txn.investorName}</span></div></td>
                  <td className="px-4 py-4 font-medium">{txn.currency === 'JPY' ? '¥' : 'CHF '}{(txn.amount / 1000000).toFixed(0)}M</td>
                  <td className="px-4 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(txn.status)}`}>{txn.status.replace('_', ' ')}</span></td>
                  <td className="px-4 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplianceColor(txn.kycStatus)}`}>{txn.kycStatus}</span></td>
                  <td className="px-4 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplianceColor(txn.amlStatus)}`}>{txn.amlStatus}</span></td>
                  <td className="px-4 py-4"><button onClick={() => { setSelectedTxn(txn); setShowDetailsModal(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Transaction Details">
        {selectedTxn && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div><h3 className="text-xl font-bold text-gray-900">{selectedTxn.txnId}</h3><p className="text-gray-500 capitalize">{selectedTxn.type} Transaction</p></div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTxn.status)}`}>{selectedTxn.status.replace('_', ' ')}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg"><div className="flex items-center gap-2 mb-2"><Building2 className="w-5 h-5 text-purple-600" /><span className="font-medium text-gray-900">Bank</span></div><p className="text-gray-600">{selectedTxn.bankName}</p></div>
              <div className="bg-emerald-50 p-4 rounded-lg"><div className="flex items-center gap-2 mb-2"><Landmark className="w-5 h-5 text-emerald-600" /><span className="font-medium text-gray-900">Investor</span></div><p className="text-gray-600">{selectedTxn.investorName}</p></div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Amount</p><p className="font-bold text-xl">{selectedTxn.currency === 'JPY' ? '¥' : 'CHF '}{(selectedTxn.amount / 1000000).toFixed(0)}M</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Created</p><p className="font-semibold">{selectedTxn.createdAt}</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Completed</p><p className="font-semibold">{selectedTxn.completedAt || 'Pending'}</p></div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4"><UserCheck className="w-5 h-5 text-blue-600" /><h4 className="font-semibold">KYC Status</h4><span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${getComplianceColor(selectedTxn.kycStatus)}`}>{selectedTxn.kycStatus}</span></div>
                {selectedTxn.kycOfficer && <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Officer:</span> {selectedTxn.kycOfficer}</p>}
                {selectedTxn.kycDate && <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Date:</span> {selectedTxn.kycDate}</p>}
                {selectedTxn.kycDocs.length > 0 && <div><p className="text-sm font-medium text-gray-700 mb-1">Documents:</p><ul className="text-sm text-gray-600">{selectedTxn.kycDocs.map((doc, i) => <li key={i} className="flex items-center gap-1"><FileText className="w-3 h-3" />{doc}</li>)}</ul></div>}
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4"><Shield className="w-5 h-5 text-green-600" /><h4 className="font-semibold">AML Status</h4><span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${getComplianceColor(selectedTxn.amlStatus)}`}>{selectedTxn.amlStatus}</span></div>
                {selectedTxn.amlOfficer && <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Officer:</span> {selectedTxn.amlOfficer}</p>}
                {selectedTxn.amlDate && <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Date:</span> {selectedTxn.amlDate}</p>}
                {selectedTxn.amlDocs.length > 0 && <div><p className="text-sm font-medium text-gray-700 mb-1">Documents:</p><ul className="text-sm text-gray-600">{selectedTxn.amlDocs.map((doc, i) => <li key={i} className="flex items-center gap-1"><FileText className="w-3 h-3" />{doc}</li>)}</ul></div>}
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Transaction Timeline</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500" /><span className="text-sm">Transaction created - {selectedTxn.createdAt}</span></div>
                {selectedTxn.kycDate && <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500" /><span className="text-sm">KYC {selectedTxn.kycStatus} - {selectedTxn.kycDate}</span></div>}
                {selectedTxn.amlDate && <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500" /><span className="text-sm">AML {selectedTxn.amlStatus} - {selectedTxn.amlDate}</span></div>}
                {selectedTxn.completedAt ? <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500" /><span className="text-sm">Transaction completed - {selectedTxn.completedAt}</span></div> : <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-amber-500" /><span className="text-sm">Awaiting completion</span></div>}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TransactionOversight;
