// Notifications.js - Super Admin Notifications Page
import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, Info, XCircle, Trash2, Check, RefreshCw, Filter, Building2, Landmark, Shield, DollarSign, Users, Settings } from 'lucide-react';

const SAMPLE_NOTIFICATIONS = [
  { id: 'NOT-001', type: 'alert', priority: 'high', title: 'AML Alert Escalated', message: 'Critical sanction list match requires immediate review for DTB Kenya transaction', category: 'compliance', tenantName: 'DTB Kenya', tenantType: 'bank', read: false, createdAt: '2024-12-10T10:30:00Z' },
  { id: 'NOT-002', type: 'info', priority: 'medium', title: 'New Bank Onboarding Complete', message: 'Centenary Bank Uganda has completed all onboarding requirements and is now active', category: 'onboarding', tenantName: 'Centenary Bank Uganda', tenantType: 'bank', read: false, createdAt: '2024-12-10T09:15:00Z' },
  { id: 'NOT-003', type: 'success', priority: 'low', title: 'Transaction Completed', message: 'Deposit transaction TXN-001 for ¥50M has been successfully processed', category: 'transaction', tenantName: 'Impact Capital Partners', tenantType: 'investor', read: false, createdAt: '2024-12-10T08:45:00Z' },
  { id: 'NOT-004', type: 'warning', priority: 'medium', title: 'Subscription Expiring', message: 'Access Bank Rwanda subscription expires in 7 days - renewal required', category: 'billing', tenantName: 'Access Bank Rwanda', tenantType: 'bank', read: true, createdAt: '2024-12-09T16:00:00Z' },
  { id: 'NOT-005', type: 'alert', priority: 'high', title: 'System Performance Alert', message: 'API response time exceeded threshold (>500ms) for 15 minutes', category: 'system', tenantName: 'Platform', tenantType: 'platform', read: true, createdAt: '2024-12-09T14:30:00Z' },
  { id: 'NOT-006', type: 'info', priority: 'low', title: 'New User Registered', message: 'Michael Oduya (bank_caller) has been added to CRDB Bank Tanzania', category: 'users', tenantName: 'CRDB Bank Tanzania', tenantType: 'bank', read: true, createdAt: '2024-12-08T11:00:00Z' },
  { id: 'NOT-007', type: 'success', priority: 'medium', title: 'KYC Verification Complete', message: 'Nordic Impact Fund KYC documentation has been verified and approved', category: 'compliance', tenantName: 'Nordic Impact Fund', tenantType: 'investor', read: true, createdAt: '2024-12-07T15:20:00Z' },
  { id: 'NOT-008', type: 'warning', priority: 'high', title: 'Large Transaction Pending', message: 'Transaction of ¥75M awaiting AML clearance - exceeds standard threshold', category: 'transaction', tenantName: 'Shell Foundation', tenantType: 'investor', read: true, createdAt: '2024-12-06T09:00:00Z' }
];

const NotificationIcon = ({ type }) => {
  const icons = { alert: AlertTriangle, warning: AlertTriangle, success: CheckCircle, info: Info, error: XCircle };
  const colors = { alert: 'text-red-500', warning: 'text-amber-500', success: 'text-green-500', info: 'text-blue-500', error: 'text-red-500' };
  const Icon = icons[type] || Info;
  return <Icon className={`w-5 h-5 ${colors[type] || 'text-gray-500'}`} />;
};

const CategoryIcon = ({ category }) => {
  const icons = { compliance: Shield, transaction: DollarSign, onboarding: Building2, billing: DollarSign, system: Settings, users: Users };
  const Icon = icons[category] || Bell;
  return <Icon className="w-4 h-4 text-gray-400" />;
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredNotifications = notifications.filter(n => {
    const matchesRead = filter === 'all' || (filter === 'unread' && !n.read) || (filter === 'read' && n.read);
    const matchesCategory = categoryFilter === 'all' || n.category === categoryFilter;
    return matchesRead && matchesCategory;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.read).length;

  const markAsRead = (id) => setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllAsRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));
  const deleteNotification = (id) => setNotifications(notifications.filter(n => n.id !== id));

  const getPriorityColor = (priority) => ({ high: 'border-l-red-500', medium: 'border-l-amber-500', low: 'border-l-blue-500' }[priority] || 'border-l-gray-300');
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">{unreadCount}</span>}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={markAllAsRead} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"><Check className="w-4 h-4" />Mark All Read</button>
            <button className="p-2 hover:bg-gray-100 rounded-lg"><RefreshCw className="w-5 h-5 text-gray-500" /></button>
          </div>
        </div>
        <p className="text-gray-600 mt-1">Platform notifications and alerts</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between"><p className="text-sm text-gray-500">Unread</p><Bell className="w-5 h-5 text-blue-500" /></div>
          <p className="text-3xl font-bold text-gray-900 mt-2">{unreadCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between"><p className="text-sm text-gray-500">High Priority</p><AlertTriangle className="w-5 h-5 text-red-500" /></div>
          <p className="text-3xl font-bold text-red-600 mt-2">{highPriorityCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between"><p className="text-sm text-gray-500">Total</p><Info className="w-5 h-5 text-gray-500" /></div>
          <p className="text-3xl font-bold text-gray-900 mt-2">{notifications.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"><option value="all">All</option><option value="unread">Unread</option><option value="read">Read</option></select>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"><option value="all">All Categories</option><option value="compliance">Compliance</option><option value="transaction">Transaction</option><option value="onboarding">Onboarding</option><option value="billing">Billing</option><option value="system">System</option><option value="users">Users</option></select>
            </div>
            <span className="text-sm text-gray-500">{filteredNotifications.length} notifications</span>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500"><Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p>No notifications found</p></div>
          ) : (
            filteredNotifications.map(notification => (
              <div key={notification.id} className={`p-4 border-l-4 ${getPriorityColor(notification.priority)} ${!notification.read ? 'bg-blue-50/50' : ''} hover:bg-gray-50`}>
                <div className="flex items-start gap-4">
                  <NotificationIcon type={notification.type} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>{notification.title}</h4>
                      {!notification.read && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><CategoryIcon category={notification.category} />{notification.category}</span>
                      <span className="flex items-center gap-1">{notification.tenantType === 'bank' ? <Building2 className="w-3 h-3" /> : notification.tenantType === 'investor' ? <Landmark className="w-3 h-3" /> : <Settings className="w-3 h-3" />}{notification.tenantName}</span>
                      <span>{formatTime(notification.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!notification.read && <button onClick={() => markAsRead(notification.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Mark as read"><Check className="w-4 h-4" /></button>}
                    <button onClick={() => deleteNotification(notification.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
