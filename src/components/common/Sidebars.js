import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, Briefcase, BarChart3, Settings, Bell,
  CreditCard, Phone, FileText, Shield, DollarSign, TrendingUp, PieChart,
  Home, UserCog, Wallet, MessageSquare, Target, Activity, Search, Command
} from 'lucide-react';
import { Logo } from './index';

const SidebarLink = ({ to, icon: Icon, children, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
  >
    <Icon className="w-5 h-5" />
    <span className="flex-1">{children}</span>
  </NavLink>
);

const SidebarSection = ({ title, children }) => (
  <div className="mb-6">
    <p className="sidebar-section-title">{title}</p>
    <div className="space-y-1">{children}</div>
  </div>
);

const SidebarSearch = () => (
  <div className="px-4 mb-6">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder="Search"
        className="w-full pl-9 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-gray-400">
        <Command className="w-3 h-3" />
        <span className="text-xs">F</span>
      </div>
    </div>
  </div>
);

// ============================================================
// SUPER ADMIN SIDEBAR
// Routes: /admin/*
// ============================================================
export const SuperAdminSidebar = () => (
  <aside className="w-64 bg-white border-r border-gray-100 h-screen overflow-y-auto flex flex-col">
    <div className="p-5 border-b border-gray-100">
      <Logo />
    </div>
    <SidebarSearch />
    <nav className="flex-1 px-3 space-y-1">
      <SidebarSection title="PLATFORM OVERVIEW">
        <SidebarLink to="/admin" icon={Home} end>Home/Overview</SidebarLink>
      </SidebarSection>
      <SidebarSection title="TENANT MANAGEMENT">
        <SidebarLink to="/admin/banks" icon={Building2}>Bank Management</SidebarLink>
        <SidebarLink to="/admin/investors" icon={Briefcase}>Investor Management</SidebarLink>
        <SidebarLink to="/admin/users" icon={Users}>User Management</SidebarLink>
      </SidebarSection>
      <SidebarSection title="OPERATIONS">
        <SidebarLink to="/admin/transactions" icon={DollarSign}>Transaction Oversight</SidebarLink>
        <SidebarLink to="/admin/pnl" icon={TrendingUp}>Platform P&L</SidebarLink>
        <SidebarLink to="/admin/instruments" icon={CreditCard}>All Instruments</SidebarLink>
      </SidebarSection>
      <SidebarSection title="COMPLIANCE & RISK">
        <SidebarLink to="/admin/compliance" icon={Shield}>Compliance</SidebarLink>
        <SidebarLink to="/admin/risk" icon={Activity}>Risk Management</SidebarLink>
      </SidebarSection>
      <SidebarSection title="ANALYTICS & REPORTING">
        <SidebarLink to="/admin/analytics" icon={BarChart3}>Analytics Dashboard</SidebarLink>
      </SidebarSection>
      <SidebarSection title="ACCOUNT">
        <SidebarLink to="/admin/notifications" icon={Bell}>Notifications</SidebarLink>
        <SidebarLink to="/admin/settings" icon={Settings}>Settings</SidebarLink>
      </SidebarSection>
    </nav>
    <div className="p-4 border-t border-gray-100">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        Platform Admin
      </div>
    </div>
  </aside>
);

// ============================================================
// BANK ADMIN SIDEBAR
// Routes: /bank/admin/*
// ============================================================
export const BankAdminSidebar = () => (
  <aside className="w-64 bg-white border-r border-gray-100 h-screen overflow-y-auto flex flex-col">
    <div className="p-5 border-b border-gray-100">
      <Logo />
    </div>
    <SidebarSearch />
    <nav className="flex-1 px-3 space-y-1">
      <SidebarSection title="BANKING OPERATIONS">
        <SidebarLink to="/bank/admin" icon={Home} end>Home/Overview</SidebarLink>
        <SidebarLink to="/bank/admin/users" icon={Users}>User Management</SidebarLink>
      </SidebarSection>
      <SidebarSection title="CAPITAL MARKETS">
        <SidebarLink to="/bank/admin/instruments" icon={CreditCard}>Deposit Instruments</SidebarLink>
        <SidebarLink to="/bank/admin/settlement" icon={Wallet}>Settlement Management</SidebarLink>
        <SidebarLink to="/bank/admin/compliance" icon={Shield}>Legal & Compliance</SidebarLink>
      </SidebarSection>
      <SidebarSection title="LENDING OPERATIONS">
        <SidebarLink to="/bank/admin/lending" icon={Phone}>Mobile Lending</SidebarLink>
      </SidebarSection>
      <SidebarSection title="ANALYTICS & REPORTING">
        <SidebarLink to="/bank/admin/analytics" icon={BarChart3}>Analytics Dashboard</SidebarLink>
        <SidebarLink to="/bank/admin/reports" icon={FileText}>Reports</SidebarLink>
        <SidebarLink to="/bank/admin/pnl" icon={TrendingUp}>P&L</SidebarLink>
      </SidebarSection>
      <SidebarSection title="ACCOUNT MANAGEMENT">
        <SidebarLink to="/bank/admin/notifications" icon={Bell}>Notifications</SidebarLink>
        <SidebarLink to="/bank/admin/settings" icon={Settings}>Settings</SidebarLink>
      </SidebarSection>
    </nav>
    <div className="p-4 border-t border-gray-100">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        Bank Admin
      </div>
    </div>
  </aside>
);

// ============================================================
// BANK USER SIDEBAR
// Routes: /bank/*
// ============================================================
export const BankUserSidebar = () => (
  <aside className="w-64 bg-white border-r border-gray-100 h-screen overflow-y-auto flex flex-col">
    <div className="p-5 border-b border-gray-100">
      <Logo />
    </div>
    <SidebarSearch />
    <nav className="flex-1 px-3 space-y-1">
      <SidebarSection title="BANKING OPERATIONS">
        <SidebarLink to="/bank" icon={Home} end>Home/Overview</SidebarLink>
      </SidebarSection>
      <SidebarSection title="CAPITAL MARKETS">
        <SidebarLink to="/bank/calls" icon={DollarSign}>Capital Calls</SidebarLink>
        <SidebarLink to="/bank/instruments" icon={CreditCard}>Deposit Instruments</SidebarLink>
        <SidebarLink to="/bank/settlements" icon={Wallet}>Settlement</SidebarLink>
      </SidebarSection>
      <SidebarSection title="LENDING OPERATIONS">
        <SidebarLink to="/bank/lending" icon={Phone}>Mobile Lending</SidebarLink>
      </SidebarSection>
      <SidebarSection title="ANALYTICS & REPORTING">
        <SidebarLink to="/bank/analytics" icon={BarChart3}>Analytics</SidebarLink>
        <SidebarLink to="/bank/reports" icon={FileText}>Reports</SidebarLink>
      </SidebarSection>
      <SidebarSection title="ACCOUNT MANAGEMENT">
        <SidebarLink to="/bank/notifications" icon={Bell}>Notifications</SidebarLink>
        <SidebarLink to="/bank/settings" icon={Settings}>Settings</SidebarLink>
      </SidebarSection>
    </nav>
    <div className="p-4 border-t border-gray-100">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        Bank Dashboard
      </div>
    </div>
  </aside>
);

// ============================================================
// INVESTOR ADMIN SIDEBAR
// Routes: /investor/admin/*
// ============================================================
export const InvestorAdminSidebar = () => (
  <aside className="w-64 bg-white border-r border-gray-100 h-screen overflow-y-auto flex flex-col">
    <div className="p-5 border-b border-gray-100">
      <Logo />
    </div>
    <SidebarSearch />
    <nav className="flex-1 px-3 space-y-1">
      <SidebarSection title="PORTFOLIO MANAGEMENT">
        <SidebarLink to="/investor/admin" icon={Home} end>Home/Dashboard</SidebarLink>
        <SidebarLink to="/investor/admin/investments" icon={Briefcase}>My Investments</SidebarLink>
        <SidebarLink to="/investor/admin/users" icon={Users}>Team Management</SidebarLink>
      </SidebarSection>
      <SidebarSection title="INVESTMENT OPPORTUNITIES">
        <SidebarLink to="/investor/admin/opportunities" icon={Target}>Available Opportunities</SidebarLink>
      </SidebarSection>
      <SidebarSection title="ANALYTICS & REPORTING">
        <SidebarLink to="/investor/admin/analytics" icon={BarChart3}>Analytics</SidebarLink>
        <SidebarLink to="/investor/admin/reports" icon={FileText}>Reports</SidebarLink>
        <SidebarLink to="/investor/admin/performance" icon={TrendingUp}>Performance</SidebarLink>
      </SidebarSection>
      <SidebarSection title="IMPACT TRACKING">
        <SidebarLink to="/investor/admin/impact" icon={Activity}>Impact Reports</SidebarLink>
      </SidebarSection>
      <SidebarSection title="ACCOUNT MANAGEMENT">
        <SidebarLink to="/investor/admin/notifications" icon={Bell}>Notifications</SidebarLink>
        <SidebarLink to="/investor/admin/settings" icon={Settings}>Settings</SidebarLink>
      </SidebarSection>
    </nav>
    <div className="p-4 border-t border-gray-100">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
        Investor Admin
      </div>
    </div>
  </aside>
);

// ============================================================
// INVESTOR USER SIDEBAR
// Routes: /investor/*
// ============================================================
export const InvestorUserSidebar = () => (
  <aside className="w-64 bg-white border-r border-gray-100 h-screen overflow-y-auto flex flex-col">
    <div className="p-5 border-b border-gray-100">
      <Logo />
    </div>
    <SidebarSearch />
    <nav className="flex-1 px-3 space-y-1">
      <SidebarSection title="PORTFOLIO MANAGEMENT">
        <SidebarLink to="/investor" icon={Home} end>Home/Dashboard</SidebarLink>
        <SidebarLink to="/investor/investments" icon={Briefcase}>My Investments</SidebarLink>
      </SidebarSection>
      <SidebarSection title="INVESTMENT OPPORTUNITIES">
        <SidebarLink to="/investor/opportunities" icon={Target}>Available Opportunities</SidebarLink>
      </SidebarSection>
      <SidebarSection title="ANALYTICS & REPORTING">
        <SidebarLink to="/investor/analytics" icon={BarChart3}>Analytics</SidebarLink>
        <SidebarLink to="/investor/reports" icon={FileText}>Reports</SidebarLink>
      </SidebarSection>
      <SidebarSection title="IMPACT TRACKING">
        <SidebarLink to="/investor/impact" icon={Activity}>Impact Reports</SidebarLink>
      </SidebarSection>
      <SidebarSection title="ACCOUNT MANAGEMENT">
        <SidebarLink to="/investor/settings" icon={Settings}>Settings</SidebarLink>
      </SidebarSection>
    </nav>
    <div className="p-4 border-t border-gray-100">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        Investor Dashboard
      </div>
    </div>
  </aside>
);

const Sidebars = { SuperAdminSidebar, BankAdminSidebar, BankUserSidebar, InvestorAdminSidebar, InvestorUserSidebar };
export default Sidebars;
