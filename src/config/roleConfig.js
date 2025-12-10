// ForwardsFlow Role Configuration
// Defines all roles, permissions, and access control

export const ROLES = {
  FORWARDSFLOW_ADMIN: 'forwardsflow_admin',
  BANK_ADMIN: 'bank_admin',
  BANK_LENDER: 'bank_lender',
  BANK_CALLER: 'bank_caller',
  BANK_COMPLIANCE: 'bank_compliance',
  BANK_RISK: 'bank_risk',
  INVESTOR_ADMIN: 'investor_admin',
  INVESTOR_ANALYST: 'investor_analyst',
};

export const TENANT_TYPES = {
  PLATFORM: 'platform',
  BANK: 'bank',
  INVESTOR: 'investor',
};

export const ROLE_CONFIG = {
  [ROLES.FORWARDSFLOW_ADMIN]: {
    label: 'ForwardsFlow Admin',
    tenantType: TENANT_TYPES.PLATFORM,
    level: 0,
    color: 'red',
    icon: 'Shield',
    description: 'System super admin - manages all tenants',
    permissions: {
      viewAllTenants: true,
      createTenants: true,
      editTenants: true,
      suspendTenants: true,
      deleteTenants: true,
      viewTenantAdmins: true,
      createTenantAdmins: true,
      editTenantAdmins: true,
      suspendTenantAdmins: true,
      viewAllTransactions: true,
      viewComplianceData: true,
      viewAMLData: true,
      viewKYCData: true,
      viewPlatformPnL: true,
      viewPlatformRevenue: true,
      viewTenantUsage: true,
      viewSystemHealth: true,
      manageSystemSettings: true,
      manageBilling: true,
      manageIntegrations: true,
    },
    dashboardPath: '/admin',
    defaultRoute: '/admin',
  },
  
  [ROLES.BANK_ADMIN]: {
    label: 'Bank Admin',
    tenantType: TENANT_TYPES.BANK,
    level: 1,
    color: 'green',
    icon: 'Building2',
    description: 'Bank administrator - full access within own bank',
    permissions: {
      viewOwnStaff: true,
      createStaff: true,
      editStaff: true,
      suspendStaff: true,
      deleteStaff: true,
      viewAllBankData: true,
      viewTransactions: true,
      viewComplianceData: true,
      createCapitalCalls: true,
      editCapitalCalls: true,
      deleteCapitalCalls: true,
      viewCapitalCalls: true,
      viewLendingOperations: true,
      approveLoanApplications: true,
      viewLoanPortfolio: true,
      viewAllAnalytics: true,
      viewPnL: true,
      generateReports: true,
      exportData: true,
      manageBankSettings: true,
      manageIntegrations: true,
    },
    dashboardPath: '/bank/admin',
    defaultRoute: '/bank/admin',
  },
  
  [ROLES.BANK_LENDER]: {
    label: 'Lending Officer',
    tenantType: TENANT_TYPES.BANK,
    level: 2,
    color: 'blue',
    icon: 'Smartphone',
    description: 'Mobile lending operations specialist',
    permissions: {
      viewLendingOperations: true,
      viewLoanApplications: true,
      approveLoanApplications: true,
      rejectLoanApplications: true,
      viewLoanPortfolio: true,
      manageDisbursements: true,
      manageCollections: true,
      viewCapitalCalls: true,
      viewLendingAnalytics: true,
      viewPortfolioMetrics: true,
      generateLendingReports: true,
    },
    dashboardPath: '/bank/lending',
    defaultRoute: '/bank/lending',
  },
  
  [ROLES.BANK_CALLER]: {
    label: 'Capital Markets Officer',
    tenantType: TENANT_TYPES.BANK,
    level: 2,
    color: 'purple',
    icon: 'TrendingUp',
    description: 'Capital call and investor relations',
    permissions: {
      viewCapitalCalls: true,
      createCapitalCalls: true,
      editCapitalCalls: true,
      negotiateTerms: true,
      viewInvestorBids: true,
      respondToBids: true,
      manageSettlements: true,
      viewLoanPortfolio: true,
      viewCapitalAnalytics: true,
      viewFXAnalytics: true,
      generateCapitalReports: true,
    },
    dashboardPath: '/bank/capital',
    defaultRoute: '/bank/capital',
  },
  
  [ROLES.BANK_COMPLIANCE]: {
    label: 'Compliance Officer',
    tenantType: TENANT_TYPES.BANK,
    level: 2,
    color: 'orange',
    icon: 'Shield',
    description: 'AML, KYC and regulatory compliance',
    permissions: {
      viewComplianceData: true,
      viewAMLData: true,
      viewKYCData: true,
      flagSuspiciousActivity: true,
      submitComplianceReports: true,
      manageBlacklist: true,
      viewAllTransactions: true,
      flagTransactions: true,
      viewCapitalCalls: true,
      viewLendingOperations: true,
      viewLoanPortfolio: true,
      generateComplianceReports: true,
      exportComplianceData: true,
    },
    dashboardPath: '/bank/compliance',
    defaultRoute: '/bank/compliance',
  },
  
  [ROLES.BANK_RISK]: {
    label: 'Credit Risk Analyst',
    tenantType: TENANT_TYPES.BANK,
    level: 2,
    color: 'red',
    icon: 'AlertTriangle',
    description: 'Credit risk assessment and portfolio monitoring',
    permissions: {
      viewRiskMetrics: true,
      viewCreditScores: true,
      viewNPLData: true,
      viewDefaultAnalysis: true,
      configureRiskModels: true,
      setExposureLimits: true,
      viewLoanPortfolio: true,
      viewPortfolioConcentration: true,
      viewVintageAnalysis: true,
      viewCapitalCalls: true,
      viewLendingOperations: true,
      generateRiskReports: true,
      performStressTesting: true,
    },
    dashboardPath: '/bank/risk',
    defaultRoute: '/bank/risk',
  },
  
  [ROLES.INVESTOR_ADMIN]: {
    label: 'Impact Investor Admin',
    tenantType: TENANT_TYPES.INVESTOR,
    level: 1,
    color: 'indigo',
    icon: 'Briefcase',
    description: 'Investor administrator - full access within own organization',
    permissions: {
      viewOwnStaff: true,
      createStaff: true,
      editStaff: true,
      suspendStaff: true,
      deleteStaff: true,
      viewAllInvestments: true,
      createInvestments: true,
      approveInvestments: true,
      viewOpportunities: true,
      submitBids: true,
      viewPortfolio: true,
      managePortfolio: true,
      viewComplianceData: true,
      submitKYCDocuments: true,
      viewTransactionHistory: true,
      viewAllAnalytics: true,
      viewPnL: true,
      viewImpactMetrics: true,
      generateReports: true,
      exportData: true,
      manageOrgSettings: true,
      managePaymentMethods: true,
    },
    dashboardPath: '/investor/admin',
    defaultRoute: '/investor/admin',
  },
  
  [ROLES.INVESTOR_ANALYST]: {
    label: 'Investment Analyst',
    tenantType: TENANT_TYPES.INVESTOR,
    level: 2,
    color: 'cyan',
    icon: 'LineChart',
    description: 'Investment analysis and research',
    permissions: {
      viewOpportunities: true,
      viewAllInvestments: true,
      recommendInvestments: true,
      submitBids: false,
      viewPortfolio: true,
      viewAnalytics: true,
      viewImpactMetrics: true,
      performDueDiligence: true,
      generateAnalysisReports: true,
      createInvestmentMemos: true,
    },
    dashboardPath: '/investor',
    defaultRoute: '/investor',
  },
};

// ============================================================
// DEMO USERS - ALL 8 CREDENTIALS VERIFIED
// ============================================================
export const DEMO_USERS = {
  // 1. Super Admin - Password: Admin123!
  'admin@forwardsflow.com': {
    id: 'ff-admin-001',
    email: 'admin@forwardsflow.com',
    password: 'Admin123!',
    name: 'System Administrator',
    role: ROLES.FORWARDSFLOW_ADMIN,
    tenantId: 'forwardsflow-platform',
    tenantName: 'ForwardsFlow',
    tenantType: TENANT_TYPES.PLATFORM,
    orgId: 'forwardsflow-platform',
    avatar: null,
    createdAt: '2024-01-01T00:00:00Z',
  },
  
  // 2. Bank Admin - Password: Demo123!
  'admin@equityafrica.com': {
    id: 'ea-admin-001',
    email: 'admin@equityafrica.com',
    password: 'Demo123!',
    name: 'Amoroso Gombe',
    role: ROLES.BANK_ADMIN,
    tenantId: 'bank-equity-africa',
    tenantName: 'Equity Africa Bank',
    tenantType: TENANT_TYPES.BANK,
    orgId: 'bank-equity-africa',
    jobTitle: 'Treasury Director',
    avatar: null,
    createdAt: '2024-02-01T00:00:00Z',
  },
  
  // 3. Bank Lender - Password: Demo123!
  'lending@equityafrica.com': {
    id: 'ea-lender-001',
    email: 'lending@equityafrica.com',
    password: 'Demo123!',
    name: 'Grace Mwangi',
    role: ROLES.BANK_LENDER,
    tenantId: 'bank-equity-africa',
    tenantName: 'Equity Africa Bank',
    tenantType: TENANT_TYPES.BANK,
    orgId: 'bank-equity-africa',
    jobTitle: 'Mobile Lending Manager',
    avatar: null,
    createdAt: '2024-03-01T00:00:00Z',
  },
  
  // 4. Bank Caller - Password: Demo123!
  'calling@equityafrica.com': {
    id: 'ea-caller-001',
    email: 'calling@equityafrica.com',
    password: 'Demo123!',
    name: 'James Ochieng',
    role: ROLES.BANK_CALLER,
    tenantId: 'bank-equity-africa',
    tenantName: 'Equity Africa Bank',
    tenantType: TENANT_TYPES.BANK,
    orgId: 'bank-equity-africa',
    jobTitle: 'Capital Markets Officer',
    avatar: null,
    createdAt: '2024-03-15T00:00:00Z',
  },
  
  // 5. Bank Compliance - Password: Demo123!
  'compliance@equityafrica.com': {
    id: 'ea-compliance-001',
    email: 'compliance@equityafrica.com',
    password: 'Demo123!',
    name: 'Sarah Kimani',
    role: ROLES.BANK_COMPLIANCE,
    tenantId: 'bank-equity-africa',
    tenantName: 'Equity Africa Bank',
    tenantType: TENANT_TYPES.BANK,
    orgId: 'bank-equity-africa',
    jobTitle: 'Compliance Officer',
    avatar: null,
    createdAt: '2024-03-20T00:00:00Z',
  },
  
  // 6. Bank Risk - Password: Demo123!
  'risk@equityafrica.com': {
    id: 'ea-risk-001',
    email: 'risk@equityafrica.com',
    password: 'Demo123!',
    name: 'Peter Njoroge',
    role: ROLES.BANK_RISK,
    tenantId: 'bank-equity-africa',
    tenantName: 'Equity Africa Bank',
    tenantType: TENANT_TYPES.BANK,
    orgId: 'bank-equity-africa',
    jobTitle: 'Credit Risk Analyst',
    avatar: null,
    createdAt: '2024-04-01T00:00:00Z',
  },
  
  // 7. Investor Admin - Password: Demo123!
  'admin@shellfoundation.org': {
    id: 'sf-admin-001',
    email: 'admin@shellfoundation.org',
    password: 'Demo123!',
    name: 'Mathieu Fournier',
    role: ROLES.INVESTOR_ADMIN,
    tenantId: 'inv-shell-foundation',
    tenantName: 'Shell Foundation',
    tenantType: TENANT_TYPES.INVESTOR,
    orgId: 'inv-shell-foundation',
    jobTitle: 'Managing Director',
    avatar: null,
    createdAt: '2024-02-15T00:00:00Z',
  },
  
  // 8. Investor Analyst - Password: Demo123!
  'analyst@shellfoundation.org': {
    id: 'sf-analyst-001',
    email: 'analyst@shellfoundation.org',
    password: 'Demo123!',
    name: 'Emily Chen',
    role: ROLES.INVESTOR_ANALYST,
    tenantId: 'inv-shell-foundation',
    tenantName: 'Shell Foundation',
    tenantType: TENANT_TYPES.INVESTOR,
    orgId: 'inv-shell-foundation',
    jobTitle: 'Investment Analyst',
    avatar: null,
    createdAt: '2024-05-01T00:00:00Z',
  },
};

// Helper Functions
export const getRoleConfig = (role) => ROLE_CONFIG[role] || null;

export const hasPermission = (userRole, permission) => {
  const config = ROLE_CONFIG[userRole];
  return config?.permissions?.[permission] === true;
};

export const getTenantType = (role) => {
  const config = ROLE_CONFIG[role];
  return config?.tenantType || null;
};

export const isPlatformRole = (role) => getTenantType(role) === TENANT_TYPES.PLATFORM;
export const isBankRole = (role) => getTenantType(role) === TENANT_TYPES.BANK;
export const isInvestorRole = (role) => getTenantType(role) === TENANT_TYPES.INVESTOR;

export const isAdminRole = (role) => {
  return [ROLES.FORWARDSFLOW_ADMIN, ROLES.BANK_ADMIN, ROLES.INVESTOR_ADMIN].includes(role);
};

export const getDashboardPath = (role) => {
  const config = ROLE_CONFIG[role];
  return config?.dashboardPath || '/login';
};

export const getRolesByTenantType = (tenantType) => {
  return Object.entries(ROLE_CONFIG)
    .filter(([_, config]) => config.tenantType === tenantType)
    .map(([role, config]) => ({ role, ...config }));
};

export default {
  ROLES,
  TENANT_TYPES,
  ROLE_CONFIG,
  DEMO_USERS,
  getRoleConfig,
  hasPermission,
  getTenantType,
  isPlatformRole,
  isBankRole,
  isInvestorRole,
  isAdminRole,
  getDashboardPath,
  getRolesByTenantType,
};
