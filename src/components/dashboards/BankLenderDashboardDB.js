/**
 * Bank Lender Dashboard - Connected to DynamoDB
 * Mobile lending operations - loan approvals, disbursements, collections
 */

import React, { useState, useEffect } from 'react';
import {
  Smartphone, Users, TrendingUp, DollarSign, CheckCircle, XCircle,
  Clock, AlertTriangle, Search, Filter, Download, RefreshCw,
  ArrowUpRight, ArrowDownRight, CreditCard, Send, Bell,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useData, useBankMetrics, useMobileLoans } from '../../context/DataContext';

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        {trend && (
          <div className={`flex items-center mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {trend > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            <span className="text-sm font-medium ml-1">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

export default function BankLenderDashboard() {
  const { user } = useAuth();
  const { 
    createMobileLoan, 
    approveMobileLoan, 
    disburseMobileLoan,
    recordLoanPayment,
    subscribeToMobileLoans,
  } = useData();

  const { metrics } = useBankMetrics(user?.orgId);
  const { loans, loading: loansLoading } = useMobileLoans(user?.orgId);

  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewLoanModal, setShowNewLoanModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  // Real-time subscription
  useEffect(() => {
    if (!user?.orgId) return;
    
    const subscription = subscribeToMobileLoans(user.orgId, (updatedLoan) => {
      console.log('Loan updated:', updatedLoan);
    });

    return () => subscription?.unsubscribe?.();
  }, [user?.orgId, subscribeToMobileLoans]);

  // Filter loans by tab
  const filteredLoans = loans.filter(loan => {
    const matchesSearch = 
      loan.borrowerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.borrowerPhone?.includes(searchTerm);
    
    if (activeTab === 'pending') {
      return matchesSearch && ['PENDING', 'APPROVED'].includes(loan.status);
    } else if (activeTab === 'active') {
      return matchesSearch && ['DISBURSED', 'CURRENT'].includes(loan.status);
    } else if (activeTab === 'overdue') {
      return matchesSearch && ['OVERDUE', 'DEFAULTED'].includes(loan.status);
    }
    return matchesSearch;
  });

  const handleApproveLoan = async (loanId) => {
    try {
      await approveMobileLoan(loanId);
    } catch (error) {
      alert('Error approving loan: ' + error.message);
    }
  };

  const handleDisburseLoan = async (loanId) => {
    try {
      await disburseMobileLoan(loanId);
    } catch (error) {
      alert('Error disbursing loan: ' + error.message);
    }
  };

  const handleRecordPayment = async (paymentData) => {
    try {
      await recordLoanPayment(paymentData);
      setShowPaymentModal(false);
      setSelectedLoan(null);
    } catch (error) {
      alert('Error recording payment: ' + error.message);
    }
  };

  const handleCreateLoan = async (loanData) => {
    try {
      await createMobileLoan({
        bankOrgId: user.orgId,
        ...loanData,
      });
      setShowNewLoanModal(false);
    } catch (error) {
      alert('Error creating loan: ' + error.message);
    }
  };

  // Stats calculations
  const pendingCount = loans.filter(l => l.status === 'PENDING').length;
  const approvedCount = loans.filter(l => l.status === 'APPROVED').length;
  const activeCount = loans.filter(l => ['DISBURSED', 'CURRENT'].includes(l.status)).length;
  const overdueCount = loans.filter(l => l.status === 'OVERDUE').length;

  const todaysDisbursements = loans.filter(l => {
    if (!l.disbursedAt) return false;
    const today = new Date().toDateString();
    return new Date(l.disbursedAt).toDateString() === today;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Smartphone className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <span className="text-xl font-bold text-gray-900">Mobile Lending</span>
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  LENDER
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <RefreshCw className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 relative">
                <Bell className="h-5 w-5" />
              </button>
              <div className="flex items-center border-l border-gray-200 pl-4">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">{user?.name?.charAt(0)}</span>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Pending Approval"
            value={pendingCount}
            subtitle={`${approvedCount} approved, awaiting disbursement`}
            icon={Clock}
            color="bg-yellow-500"
          />
          <StatCard
            title="Active Loans"
            value={activeCount}
            trend={8.5}
            icon={CheckCircle}
            color="bg-green-500"
          />
          <StatCard
            title="Overdue Loans"
            value={overdueCount}
            subtitle="Requires follow-up"
            icon={AlertTriangle}
            color="bg-red-500"
          />
          <StatCard
            title="Today's Disbursements"
            value={todaysDisbursements}
            subtitle={`KES ${(metrics?.disbursementsToday || 0) * 15000}`}
            icon={Send}
            color="bg-blue-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setShowNewLoanModal(true)}
            className="flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Create New Loan
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className="flex items-center justify-center px-6 py-4 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors"
          >
            <Clock className="h-5 w-5 mr-2" />
            Review Pending ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className="flex items-center justify-center px-6 py-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
          >
            <AlertTriangle className="h-5 w-5 mr-2" />
            Follow Up Overdue ({overdueCount})
          </button>
        </div>

        {/* Loans Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Tabs & Search */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                {[
                  { id: 'pending', label: 'Pending', count: pendingCount + approvedCount },
                  { id: 'active', label: 'Active', count: activeCount },
                  { id: 'overdue', label: 'Overdue', count: overdueCount },
                  { id: 'all', label: 'All Loans', count: loans.length },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search borrower..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <Download className="h-4 w-4 mr-2" /> Export
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrower</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Term</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Outstanding</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLoans.map(loan => (
                  <tr key={loan.loanId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{loan.borrowerName}</div>
                        <div className="text-sm text-gray-500">{loan.borrowerPhone}</div>
                        {loan.creditScore && (
                          <div className="text-xs text-gray-400">Score: {loan.creditScore}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        KES {loan.amount?.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">{loan.interestRate}% APR</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {loan.term} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        loan.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        loan.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                        loan.status === 'DISBURSED' || loan.status === 'CURRENT' ? 'bg-green-100 text-green-800' :
                        loan.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                        loan.status === 'DEFAULTED' ? 'bg-gray-800 text-white' :
                        loan.status === 'SETTLED' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {loan.status}
                      </span>
                      {loan.daysOverdue > 0 && (
                        <span className="ml-2 text-xs text-red-600">
                          {loan.daysOverdue}d overdue
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      KES {loan.amountOutstanding?.toLocaleString() || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {loan.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApproveLoan(loan.loanId)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Reject
                          </button>
                        </>
                      )}
                      {loan.status === 'APPROVED' && (
                        <button
                          onClick={() => handleDisburseLoan(loan.loanId)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Disburse
                        </button>
                      )}
                      {['DISBURSED', 'CURRENT', 'OVERDUE'].includes(loan.status) && (
                        <button
                          onClick={() => { setSelectedLoan(loan); setShowPaymentModal(true); }}
                          className="text-green-600 hover:text-green-900"
                        >
                          Record Payment
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-gray-900">View</button>
                    </td>
                  </tr>
                ))}
                {filteredLoans.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <Smartphone className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <p>No loans found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* New Loan Modal */}
      {showNewLoanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">Create New Loan</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleCreateLoan({
                borrowerPhone: formData.get('phone'),
                borrowerName: formData.get('name'),
                borrowerIdNumber: formData.get('idNumber'),
                amount: parseFloat(formData.get('amount')),
                currency: 'KES',
                interestRate: parseFloat(formData.get('rate')),
                term: parseInt(formData.get('term')),
                creditScore: parseInt(formData.get('creditScore')) || null,
              });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input name="phone" type="tel" placeholder="+254..." className="w-full border rounded-lg px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input name="name" type="text" className="w-full border rounded-lg px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                <input name="idNumber" type="text" className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (KES)</label>
                  <input name="amount" type="number" defaultValue={15000} className="w-full border rounded-lg px-3 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Term (Days)</label>
                  <input name="term" type="number" defaultValue={30} className="w-full border rounded-lg px-3 py-2" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                  <input name="rate" type="number" step="0.1" defaultValue={18} className="w-full border rounded-lg px-3 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credit Score</label>
                  <input name="creditScore" type="number" placeholder="Optional" className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowNewLoanModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create Loan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">Record Payment</h3>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Borrower: <span className="font-medium text-gray-900">{selectedLoan.borrowerName}</span></p>
              <p className="text-sm text-gray-600">Outstanding: <span className="font-medium text-gray-900">KES {selectedLoan.amountOutstanding?.toLocaleString()}</span></p>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleRecordPayment({
                loanId: selectedLoan.loanId,
                amount: parseFloat(formData.get('amount')),
                mpesaRef: formData.get('mpesaRef'),
              });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount (KES)</label>
                <input name="amount" type="number" className="w-full border rounded-lg px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MPESA Reference</label>
                <input name="mpesaRef" type="text" placeholder="e.g., QK7ABC123" className="w-full border rounded-lg px-3 py-2" required />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => { setShowPaymentModal(false); setSelectedLoan(null); }} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Record Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
