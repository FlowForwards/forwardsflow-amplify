import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DemoProvider } from './context/DemoContext';
import { ROLES, getDashboardPath } from './config/roleConfig';

// Layouts
import { SuperAdminLayout, BankAdminLayout, InvestorAdminLayout, BankUserLayout, InvestorUserLayout } from './components/layouts/DashboardLayouts';

// Auth Pages
import LoginPage from './components/auth/LoginPage';
import InvestorRegistrationPage from './components/auth/InvestorRegistrationPage';
import BankRegistrationPage from './components/auth/BankRegistrationPage';

// Public Pages
import HomePage from './components/pages/HomePage';
import ProductsPage from './components/pages/ProductsPage';
import ConfirmSubscriptionPage from './components/pages/ConfirmSubscriptionPage';
import PrivacyPolicyPage from './components/pages/PrivacyPolicyPage';
import DisclaimerPage from './components/pages/DisclaimerPage';

// ==================================================
// DASHBOARD IMPORTS
// BankAdminDashboard & InvestorAdminDashboard imported directly
// (not from barrel) to use enhanced versions with full CRUD
// ==================================================
import {
  ForwardsFlowAdminDashboard,
  // BankAdminDashboard - REMOVED from barrel, using direct import below
  BankLenderDashboard,
  BankCallerDashboard,
  BankComplianceDashboard,
  BankRiskDashboard,
  // InvestorAdminDashboard - REMOVED from barrel, using direct import below
  InvestorAnalystDashboard,
} from './components/dashboards';

// NEW: Direct imports for enhanced dashboards with full CRUD
// These dashboards read URL path to show the correct tab
import BankAdminDashboard from './components/dashboards/BankAdminDashboard';
import InvestorAdminDashboard from './components/dashboards/InvestorAdminDashboard';

// Legacy Dashboard Pages (for backward compatibility)
import LegacySuperAdminDashboard from './components/super-admin/SuperAdminDashboard';
import LegacyBankAdminDashboard from './components/bank/BankAdminDashboard';
import LegacyInvestorUserDashboard from './components/investor/InvestorUserDashboard';
import InvestmentOpportunitiesPage from './components/investor/InvestmentOpportunitiesPage';

// Demo MVP Components
import CreateCapitalCallPage from './components/bank/CreateCapitalCallPage';
import BankCapitalCallsPage from './components/bank/BankCapitalCallsPage';
import InvestorOpportunitiesPage from './components/investor/InvestorOpportunitiesPageNew';
import InvestorInvestmentsPage from './components/investor/InvestorInvestmentsPage';

// ==================================================
// SUPER ADMIN PAGE COMPONENTS
// ==================================================
import BankManagement from './components/pages/super-admin/BankManagement';
import InvestorManagement from './components/pages/super-admin/InvestorManagement';
import UserManagement from './components/pages/super-admin/UserManagement';
import TransactionOversight from './components/pages/super-admin/TransactionOversight';
import PlatformPL from './components/pages/super-admin/PlatformPL';
import AllInstruments from './components/pages/super-admin/AllInstruments';
import Compliance from './components/pages/super-admin/Compliance';
import RiskManagement from './components/pages/super-admin/RiskManagement';
import AnalyticsDashboard from './components/pages/super-admin/AnalyticsDashboard';
import Notifications from './components/pages/super-admin/Notifications';
import Settings from './components/pages/super-admin/Settings';

// Registration Router
const RegisterRouter = () => (
  <div className="min-h-screen bg-gray-50 py-8 px-4">
    <div className="max-w-xl mx-auto text-center">
      <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Create Your Account</h1>
        <p className="text-gray-500 mb-8">Choose your account type to get started</p>
        <div className="space-y-4">
          <Link to="/register/investor" className="block w-full p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Impact Investor</h3>
                <p className="text-sm text-gray-500">Access high-yield frontier market opportunities</p>
              </div>
            </div>
          </Link>
          <Link to="/register/bank" className="block w-full p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Partner Bank</h3>
                <p className="text-sm text-gray-500">Access capital markets and mobile lending</p>
              </div>
            </div>
          </Link>
        </div>
        <p className="mt-6 text-sm text-gray-500">Already have an account? <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign in</Link></p>
      </div>
    </div>
  </div>
);

// Under Construction Page - For features not yet implemented
const UnderConstructionPage = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6">
      <svg className="w-12 h-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    </div>
    <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
    <p className="text-gray-500 max-w-md mb-6">{description || 'This feature is currently under development and will be available soon.'}</p>
    <div className="flex items-center gap-2 text-sm text-primary-600">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Check back soon for updates</span>
    </div>
  </div>
);

// Placeholder Page - Simpler version
const PlaceholderPage = ({ title, description }) => (
  <UnderConstructionPage title={title} description={description} />
);

// Unauthorized Page
const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="text-center">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
      <p className="text-gray-500 mb-6">You don't have permission to access this page.</p>
      <a href="/login" className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700">Return to Login</a>
    </div>
  </div>
);

// Smart Redirect - Updated for new role system
const SmartRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // New role-based routing
  const dashboardPath = getDashboardPath(user.role);
  return <Navigate to={dashboardPath} replace />;
};

function App() {
  return (
    <AuthProvider>
      <DemoProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterRouter />} />
            <Route path="/register/investor" element={<InvestorRegistrationPage />} />
            <Route path="/register/bank" element={<BankRegistrationPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/confirm-subscription" element={<ConfirmSubscriptionPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/dashboard" element={<SmartRedirect />} />

            {/* ================================================== */}
            {/* FORWARDSFLOW ADMIN (Platform Super Admin) Routes   */}
            {/* Role: forwardsflow_admin                           */}
            {/* ================================================== */}
            <Route path="/admin" element={<SuperAdminLayout />}>
              <Route index element={<ForwardsFlowAdminDashboard />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
              <Route path="investors" element={<InvestorManagement />} />
              <Route path="banks" element={<BankManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="instruments" element={<AllInstruments />} />
              <Route path="transactions" element={<TransactionOversight />} />
              <Route path="pnl" element={<PlatformPL />} />
              <Route path="compliance" element={<Compliance />} />
              <Route path="risk" element={<RiskManagement />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* ================================================== */}
            {/* BANK ADMIN Routes                                  */}
            {/* Role: bank_admin                                   */}
            {/* ALL routes go to BankAdminDashboard which reads    */}
            {/* the URL path to determine which tab to show        */}
            {/* ================================================== */}
            <Route path="/bank/admin" element={<BankAdminLayout />}>
              <Route index element={<BankAdminDashboard />} />
              <Route path="users" element={<BankAdminDashboard />} />
              <Route path="staff" element={<BankAdminDashboard />} />
              <Route path="instruments" element={<BankAdminDashboard />} />
              <Route path="settlement" element={<BankAdminDashboard />} />
              <Route path="compliance" element={<BankAdminDashboard />} />
              <Route path="lending" element={<BankAdminDashboard />} />
              <Route path="analytics" element={<BankAdminDashboard />} />
              <Route path="reports" element={<BankAdminDashboard />} />
              <Route path="pnl" element={<BankAdminDashboard />} />
              <Route path="notifications" element={<BankAdminDashboard />} />
              <Route path="settings" element={<BankAdminDashboard />} />
            </Route>

            {/* ================================================== */}
            {/* BANK LENDER Routes                                 */}
            {/* Role: bank_lender                                  */}
            {/* ================================================== */}
            <Route path="/bank/lending" element={<BankUserLayout />}>
              <Route index element={<BankLenderDashboard />} />
              <Route path="applications" element={<PlaceholderPage title="Loan Applications" description="Review and process loan applications." />} />
              <Route path="portfolio" element={<PlaceholderPage title="Loan Portfolio" description="View and manage active loans." />} />
              <Route path="disbursements" element={<PlaceholderPage title="Disbursements" description="Track and manage loan disbursements." />} />
              <Route path="collections" element={<PlaceholderPage title="Collections" description="Manage loan collections and repayments." />} />
              <Route path="whatsapp" element={<PlaceholderPage title="WhatsApp Bot" description="Configure and monitor WhatsApp lending bot." />} />
              <Route path="reports" element={<PlaceholderPage title="Lending Reports" description="Generate lending performance reports." />} />
            </Route>

            {/* ================================================== */}
            {/* BANK CALLER (Capital Markets) Routes               */}
            {/* Role: bank_caller                                  */}
            {/* ================================================== */}
            <Route path="/bank/capital" element={<BankUserLayout />}>
              <Route index element={<BankCallerDashboard />} />
              <Route path="calls" element={<BankCapitalCallsPage />} />
              <Route path="calls/create" element={<CreateCapitalCallPage />} />
              <Route path="investors" element={<PlaceholderPage title="Investor Relations" description="Manage investor relationships and communications." />} />
              <Route path="settlements" element={<PlaceholderPage title="Settlement Instructions" description="Manage settlement processes." />} />
              <Route path="reports" element={<PlaceholderPage title="Capital Reports" description="Generate capital markets reports." />} />
            </Route>

            {/* ================================================== */}
            {/* BANK COMPLIANCE Routes                             */}
            {/* Role: bank_compliance                              */}
            {/* ================================================== */}
            <Route path="/bank/compliance" element={<BankUserLayout />}>
              <Route index element={<BankComplianceDashboard />} />
              <Route path="aml" element={<PlaceholderPage title="AML Monitoring" description="Anti-money laundering monitoring and alerts." />} />
              <Route path="kyc" element={<PlaceholderPage title="KYC Management" description="Know Your Customer verification management." />} />
              <Route path="alerts" element={<PlaceholderPage title="Compliance Alerts" description="View and manage compliance alerts." />} />
              <Route path="reports" element={<PlaceholderPage title="Compliance Reports" description="Generate compliance reports." />} />
              <Route path="blacklist" element={<PlaceholderPage title="Blacklist Management" description="Manage blacklisted entities." />} />
            </Route>

            {/* ================================================== */}
            {/* BANK RISK Routes                                   */}
            {/* Role: bank_risk                                    */}
            {/* ================================================== */}
            <Route path="/bank/risk" element={<BankUserLayout />}>
              <Route index element={<BankRiskDashboard />} />
              <Route path="portfolio" element={<PlaceholderPage title="Portfolio Risk" description="Analyze portfolio risk metrics." />} />
              <Route path="credit-scores" element={<PlaceholderPage title="Credit Scores" description="View and analyze credit scoring data." />} />
              <Route path="vintage" element={<PlaceholderPage title="Vintage Analysis" description="Loan vintage performance analysis." />} />
              <Route path="stress-test" element={<PlaceholderPage title="Stress Testing" description="Run portfolio stress tests." />} />
              <Route path="reports" element={<PlaceholderPage title="Risk Reports" description="Generate risk assessment reports." />} />
            </Route>

            {/* ================================================== */}
            {/* BANK GENERIC Routes (backward compatibility)       */}
            {/* ================================================== */}
            <Route path="/bank" element={<BankUserLayout />}>
              <Route index element={<BankAdminDashboard />} />
              <Route path="calls" element={<BankCapitalCallsPage />} />
              <Route path="calls/create" element={<CreateCapitalCallPage />} />
              <Route path="instruments" element={<PlaceholderPage title="Instruments" description="View deposit instruments." />} />
              <Route path="lending" element={<BankLenderDashboard />} />
              <Route path="settlements" element={<PlaceholderPage title="Settlements" description="View settlement status." />} />
              <Route path="analytics" element={<PlaceholderPage title="Analytics" description="View analytics dashboard." />} />
              <Route path="reports" element={<PlaceholderPage title="Reports" description="Generate reports." />} />
              <Route path="notifications" element={<PlaceholderPage title="Notifications" description="View notifications." />} />
              <Route path="settings" element={<PlaceholderPage title="Settings" description="Manage settings." />} />
            </Route>

            {/* ================================================== */}
            {/* INVESTOR ADMIN Routes                              */}
            {/* Role: investor_admin                               */}
            {/* ALL routes go to InvestorAdminDashboard which reads*/}
            {/* the URL path to determine which tab to show        */}
            {/* ================================================== */}
            <Route path="/investor/admin" element={<InvestorAdminLayout />}>
              <Route index element={<InvestorAdminDashboard />} />
              <Route path="analytics" element={<InvestorAdminDashboard />} />
              <Route path="users" element={<InvestorAdminDashboard />} />
              <Route path="team" element={<InvestorAdminDashboard />} />
              <Route path="roles" element={<InvestorAdminDashboard />} />
              <Route path="investments" element={<InvestorAdminDashboard />} />
              <Route path="portfolio" element={<InvestorAdminDashboard />} />
              <Route path="opportunities" element={<InvestorAdminDashboard />} />
              <Route path="compliance" element={<InvestorAdminDashboard />} />
              <Route path="reports" element={<InvestorAdminDashboard />} />
              <Route path="performance" element={<InvestorAdminDashboard />} />
              <Route path="impact" element={<InvestorAdminDashboard />} />
              <Route path="notifications" element={<InvestorAdminDashboard />} />
              <Route path="settings" element={<InvestorAdminDashboard />} />
            </Route>

            {/* ================================================== */}
            {/* INVESTOR ANALYST Routes                            */}
            {/* Role: investor_analyst                             */}
            {/* ================================================== */}
            <Route path="/investor" element={<InvestorUserLayout />}>
              <Route index element={<InvestorAnalystDashboard />} />
              <Route path="opportunities" element={<InvestorOpportunitiesPage />} />
              <Route path="investments" element={<InvestorInvestmentsPage />} />
              <Route path="calls" element={<InvestorOpportunitiesPage />} />
              <Route path="puts" element={<PlaceholderPage title="Create Investment Request" description="Submit a new investment request." />} />
              <Route path="portfolio" element={<InvestorInvestmentsPage />} />
              <Route path="analytics" element={<PlaceholderPage title="Analytics" description="View investment analytics." />} />
              <Route path="reports" element={<PlaceholderPage title="Reports" description="Generate and download reports." />} />
              <Route path="impact" element={<PlaceholderPage title="Impact Reports" description="View social impact metrics." />} />
              <Route path="messages" element={<PlaceholderPage title="Messages" description="View messages and communications." />} />
              <Route path="settings" element={<PlaceholderPage title="Settings" description="Manage your settings." />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </DemoProvider>
    </AuthProvider>
  );
}

export default App;
