import React from 'react';
import { Bell, ChevronDown, LogOut, Settings, User, Search, Menu, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// ForwardsFlow Logo SVG Component
const LogoIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="6" fill="#3832E3"/>
    <g stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none">
      <path d="M 8 8 L 24 16 L 8 24"/>
      <path d="M 8 11 L 20 16 L 8 21"/>
      <path d="M 8 14 L 16 16"/>
      <path d="M 22 10 L 26 14"/>
      <path d="M 23 11 L 26 14"/>
    </g>
  </svg>
);

// ForwardsFlow Logo
export const Logo = ({ size = 'default', showText = true, variant = 'default' }) => {
  const sizeClasses = { small: 'w-8 h-8', default: 'w-10 h-10', large: 'w-12 h-12' };
  const textSizeClasses = { small: 'text-lg', default: 'text-xl', large: 'text-2xl' };

  return (
    <div className="flex items-center gap-2.5">
      <LogoIcon className={`${sizeClasses[size]} rounded-lg shadow-sm`} />
      {showText && (
        <span className={`${textSizeClasses[size]} font-semibold`}>
          <span className={variant === 'white' ? 'text-white' : 'text-gray-900'}>Forwards</span>
          <span className="text-primary-600">Flow</span>
        </span>
      )}
    </div>
  );
};

// Header Component
export const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <div className="hidden lg:flex items-center gap-3"><Logo size="small" /></div>
      </div>

      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 hover:bg-gray-100 rounded-lg">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">Filters</span>
        </button>

        <div className="relative">
          <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-3 pl-3 pr-2 py-1.5 hover:bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.role?.replace('_', ' ')}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fade-in">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                <Settings className="w-4 h-4" /> Settings
              </button>
              <button onClick={logout} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Stat Card
export const StatCard = ({ icon: Icon, label, value, subValue, trend, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    pink: 'bg-pink-50 text-pink-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-lg ${colorClasses[color]}`}><Icon className="w-5 h-5" /></div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
      </div>
    </div>
  );
};

// Badge
export const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
  };
  return <span className={`badge ${variants[variant]}`}>{children}</span>;
};

// Loading Spinner
export const LoadingSpinner = ({ size = 'default' }) => {
  const sizeClasses = { small: 'w-4 h-4', default: 'w-8 h-8', large: 'w-12 h-12' };
  return <div className={`spinner ${sizeClasses[size]}`}></div>;
};

// Page Loading
export const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <Logo size="large" />
      <LoadingSpinner size="large" />
      <p className="text-gray-500">Loading...</p>
    </div>
  </div>
);

// Modal
export const Modal = ({ isOpen, onClose, title, children, size = 'default' }) => {
  if (!isOpen) return null;
  const sizeClasses = { small: 'max-w-md', default: 'max-w-lg', large: 'max-w-2xl' };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${sizeClasses[size]}`} onClick={e => e.stopPropagation()}>
        {title && (
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Data Table
export const DataTable = ({ columns, data, emptyMessage = 'No data available' }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map((col, idx) => <th key={idx} className="table-header">{col.header}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx} className="border-b border-gray-50 hover:bg-gray-50">
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="table-cell">
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default { Logo, Header, StatCard, Badge, LoadingSpinner, PageLoading, Modal, DataTable };
