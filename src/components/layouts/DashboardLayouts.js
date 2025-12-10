import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Header, PageLoading } from '../common';
import {
  SuperAdminSidebar,
  BankAdminSidebar,
  BankUserSidebar,
  InvestorAdminSidebar,
  InvestorUserSidebar
} from '../common/Sidebars';

// Base Dashboard Layout
const DashboardLayout = ({ sidebar: Sidebar, allowedRoles, requiredTenantType }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) return <PageLoading />;
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Check role access - if allowedRoles is specified, user must have one of them
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      console.log('Access denied - user role:', user.role, 'allowed roles:', allowedRoles);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check tenant type for tenant users/admins
  if (requiredTenantType && user.tenantType !== requiredTenantType) {
    console.log('Access denied - user tenantType:', user.tenantType, 'required:', requiredTenantType);
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white z-50">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Super Admin Layout - ForwardsFlow Platform Admin
export const SuperAdminLayout = () => (
  <DashboardLayout
    sidebar={SuperAdminSidebar}
    allowedRoles={['forwardsflow_admin']}
  />
);

// Bank Admin Layout - Bank Administrator
export const BankAdminLayout = () => (
  <DashboardLayout
    sidebar={BankAdminSidebar}
    allowedRoles={['bank_admin']}
    requiredTenantType="bank"
  />
);

// Bank User Layout - All bank roles
export const BankUserLayout = () => (
  <DashboardLayout
    sidebar={BankUserSidebar}
    allowedRoles={['bank_admin', 'bank_lender', 'bank_caller', 'bank_compliance', 'bank_risk']}
    requiredTenantType="bank"
  />
);

// Investor Admin Layout - Investor Administrator
export const InvestorAdminLayout = () => (
  <DashboardLayout
    sidebar={InvestorAdminSidebar}
    allowedRoles={['investor_admin']}
    requiredTenantType="investor"
  />
);

// Investor User Layout - All investor roles
export const InvestorUserLayout = () => (
  <DashboardLayout
    sidebar={InvestorUserSidebar}
    allowedRoles={['investor_admin', 'investor_analyst']}
    requiredTenantType="investor"
  />
);

export default { SuperAdminLayout, BankAdminLayout, BankUserLayout, InvestorAdminLayout, InvestorUserLayout };
