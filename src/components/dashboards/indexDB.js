// Database-Connected Dashboard Components
// These dashboards use real DynamoDB data via AppSync

export { default as SuperAdminDashboard } from './SuperAdminDashboardNew';
export { default as BankAdminDashboard } from './BankAdminDashboardDB';
export { default as BankLenderDashboard } from './BankLenderDashboardDB';
export { default as InvestorAdminDashboard } from './InvestorAdminDashboardDB';

// Role to Dashboard mapping
export const DASHBOARD_COMPONENTS = {
  FORWARDSFLOW_ADMIN: 'SuperAdminDashboard',
  BANK_ADMIN: 'BankAdminDashboard',
  BANK_LENDER: 'BankLenderDashboard',
  BANK_CALLER: 'BankCallerDashboard',
  BANK_COMPLIANCE: 'BankComplianceDashboard',
  BANK_RISK: 'BankRiskDashboard',
  INVESTOR_ADMIN: 'InvestorAdminDashboard',
  INVESTOR_ANALYST: 'InvestorAnalystDashboard',
};

// Dashboard paths
export const DASHBOARD_PATHS = {
  FORWARDSFLOW_ADMIN: '/admin',
  BANK_ADMIN: '/bank/admin',
  BANK_LENDER: '/bank/lending',
  BANK_CALLER: '/bank/capital',
  BANK_COMPLIANCE: '/bank/compliance',
  BANK_RISK: '/bank/risk',
  INVESTOR_ADMIN: '/investor/admin',
  INVESTOR_ANALYST: '/investor',
};
