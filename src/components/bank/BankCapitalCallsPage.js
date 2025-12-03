import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, DollarSign, Clock, CheckCircle, AlertCircle, 
  TrendingUp, Users, ArrowRight, FileText, Eye
} from 'lucide-react';
import { useDemoContext } from '../../context/DemoContext';

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: FileText },
  published: { label: 'Published', color: 'bg-blue-100 text-blue-700', icon: Eye },
  accepted: { label: 'Accepted', color: 'bg-purple-100 text-purple-700', icon: CheckCircle },
  kyc_review: { label: 'KYC Review', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  processing: { label: 'Processing', color: 'bg-orange-100 text-orange-700', icon: TrendingUp },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  expired: { label: 'Expired', color: 'bg-red-100 text-red-700', icon: AlertCircle },
};

const BankCapitalCallsPage = () => {
  const { getCallsForBank, notifications } = useDemoContext();
  const calls = getCallsForBank('all');

  // Stats
  const totalCalls = calls.length;
  const activeCalls = calls.filter(c => ['published', 'accepted', 'kyc_review', 'processing'].includes(c.status)).length;
  const completedCalls = calls.filter(c => c.status === 'completed').length;
  const totalRaised = calls.filter(c => c.status === 'completed').reduce((sum, c) => sum + c.amount, 0);

  // Recent notifications for bank
  const bankNotifications = notifications.filter(n => n.userId === 'bank-user' && !n.read).slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Capital Calls</h1>
          <p className="text-gray-500">Manage your fixed deposit instruments</p>
        </div>
        <Link 
          to="/bank/calls/create"
          className="px-4 py-2 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Create Capital Call
        </Link>
      </div>

      {/* Notifications */}
      {bankNotifications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Recent Activity</h3>
          <div className="space-y-2">
            {bankNotifications.map((notif) => (
              <div key={notif.id} className="flex items-center gap-2 text-blue-800 text-sm">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>{notif.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Calls</p>
              <p className="text-2xl font-bold text-gray-900">{totalCalls}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Calls</p>
              <p className="text-2xl font-bold text-gray-900">{activeCalls}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedCalls}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Raised</p>
              <p className="text-2xl font-bold text-gray-900">${(totalRaised / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calls List */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">All Capital Calls</h2>
        </div>
        
        {calls.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No capital calls yet</h3>
            <p className="text-gray-500 mb-6">Create your first capital call to start attracting investors</p>
            <Link 
              to="/bank/calls/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700"
            >
              <Plus className="w-5 h-5" /> Create Capital Call
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {calls.map((call) => {
              const StatusIcon = statusConfig[call.status].icon;
              const daysLeft = Math.max(0, Math.ceil((new Date(call.expiresAt) - new Date()) / (1000 * 60 * 60 * 24)));
              
              return (
                <div key={call.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            ${(call.amount / 1000000).toFixed(0)}M Fixed Deposit
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[call.status].color}`}>
                            {statusConfig[call.status].label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {call.txnRef} • {call.maturityMonths} months • {call.interestRate}% APR
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {call.status === 'published' ? `Expires in ${daysLeft} days` : 
                           call.status === 'completed' ? `Completed ${new Date(call.completedAt).toLocaleDateString()}` :
                           call.acceptedBy ? `Accepted by ${call.acceptedBy.companyName || 'Investor'}` : ''}
                        </p>
                        {call.status === 'completed' && (
                          <p className="text-sm font-semibold text-green-600">
                            Capital Received ✓
                          </p>
                        )}
                      </div>
                      
                      <Link 
                        to={`/bank/calls/${call.id}`}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </Link>
                    </div>
                  </div>
                  
                  {/* Progress bar for active calls */}
                  {['accepted', 'kyc_review', 'processing'].includes(call.status) && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm">
                        <span className={`w-3 h-3 rounded-full ${call.status === 'accepted' ? 'bg-purple-500' : 'bg-gray-300'}`} />
                        <span className={call.status === 'accepted' ? 'text-purple-700' : 'text-gray-400'}>Accepted</span>
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className={`w-3 h-3 rounded-full ${call.status === 'kyc_review' ? 'bg-yellow-500' : call.status === 'processing' ? 'bg-gray-300' : 'bg-gray-300'}`} />
                        <span className={call.status === 'kyc_review' ? 'text-yellow-700' : 'text-gray-400'}>KYC Review</span>
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className={`w-3 h-3 rounded-full ${call.status === 'processing' ? 'bg-orange-500' : 'bg-gray-300'}`} />
                        <span className={call.status === 'processing' ? 'text-orange-700' : 'text-gray-400'}>Processing</span>
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="w-3 h-3 rounded-full bg-gray-300" />
                        <span className="text-gray-400">Complete</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BankCapitalCallsPage;
