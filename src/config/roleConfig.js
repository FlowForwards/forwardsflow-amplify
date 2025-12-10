// ForwardsFlow Role Configuration
// Defines all roles, permissions, and access control

export const ROLES = {
  // Platform Level
  FORWARDSFLOW_ADMIN: 'forwardsflow_admin',
  
  // Bank Tenant Level
  BANK_ADMIN: 'bank_admin',
  BANK_LENDER: 'bank_lender',
  BANK_CALLER: 'bank_caller',
  BANK_COMPLIANCE: 'bank_compliance',
  BANK_RISK: 'bank_risk',
  
  // Investor Tenant Level
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
      // Tenant Management
      viewAllTenants: true,
      createTenants: true,
      editTenants: true,
      suspendTenants: true,
      deleteTenants: true,
      
      // User Management (Tenant Admins only)
      viewTenantAdmins: true,
      createTenantAdmins: true,
      editTenantAdmins: true,
      suspendTenantAdmins: true,
      
      // Cannot manage tenant staff (that's tenant admin's job)
      viewTenantStaff: false,
      manageTenantStaff: false,
      
      // Compliance & Oversight
      viewAllTransactions: true,
      viewComplianceData: true,
      viewAMLData: true,
      viewKYCData: true,
      
      // Platform Analytics
      viewPlatformPnL: true,
      viewPlatformRevenue: true,
      viewTenantUsage: true,
      viewSystemHealth: true,
      
      // System Settings
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
      // Staff Management
      viewOwnStaff: true,
      createStaff: true,
      editStaff: true,
      suspendStaff: true,
      deleteStaff: true,
      
      // All Bank Operations
      viewAllBankData: true,
      viewTransactions: true,
      viewComplianceData: true,
      viewAMLData: true,
      viewKYCData: true,
      
      // Capital Calls
      createCapitalCalls: true,
      editCapitalCalls: true,
      deleteCapitalCalls: true,
      viewCapitalCalls: true,
      
      // Mobile Lending
      viewLendingOperations: true,
      approveLoanApplications: true,
      configureAutoApproval: true,
      viewLoanPortfolio: true,
      manageLendingSettings: true,
      
      // Compliance
      submitComplianceReports: true,
      manageKYCSettings: true,
      
      // Analytics & Reports
      viewAllAnalytics: true,
      viewPnL: true,
      generateReports: true,
      exportData: true,
      
      // Settings
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
      // Lending Operations
      viewLendingOperations: true,
      viewLoanApplications: true,
      approveLoanApplications: true,
      rejectLoanApplications: true,
      viewLoanPortfolio: true,
      manageDisbursements: true,
      manageCollections: true,
      
      // Limited Capital Call Access
      viewCapitalCalls: true,
      createCapitalCalls: false,
      
      // Analytics
      viewLendingAnalytics: true,
      viewPortfolioMetrics: true,
      
      // Reports
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
      // Capital Calls
      viewCapitalCalls: true,
      createCapitalCalls: true,
      editCapitalCalls: true,
      negotiateTerms: true,
      
      // Investor Relations
      viewInvestorBids: true,
      respondToBids: true,
      manageSettlements: true,
      
      // Limited Lending Access
      viewLendingOperations: false,
      viewLoanPortfolio: true, // Can see deployment stats
      
      // Analytics
      viewCapitalAnalytics: true,
      viewFXAnalytics: true,
      
      // Reports
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
      // Compliance
      viewComplianceData: true,
      viewAMLData: true,
      viewKYCData: true,
      flagSuspiciousActivity: true,
      submitComplianceReports: true,
      manageBlacklist: true,
      
      // Transaction Monitoring
      viewAllTransactions: true,
      flagTransactions: true,
      
      // View Only Access to Operations
      viewCapitalCalls: true,
      viewLendingOperations: true,
      viewLoanPortfolio: true,
      
      // Reports
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
      // Risk Management
      viewRiskMetrics: true,
      viewCreditScores: true,
      viewNPLData: true,
      viewDefaultAnalysis: true,
      configureRiskModels: true,
      setExposureLimits: true,
      
      // Portfolio Analysis
      viewLoanPortfolio: true,
      viewPortfolioConcentration: true,
      viewVintageAnalysis: true,
      
      // View Access
      viewCapitalCalls: true,
      viewLendingOperations: true,
      
      // Reports
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
      // Staff Management
      viewOwnStaff: true,
      createStaff: true,
      editStaff: true,
      suspendStaff: true,
      deleteStaff: true,
      
      // Investment Operations
      viewAllInvestments: true,
      createInvestments: true,
      approveInvestments: true,
      viewOpportunities: true,
      submitBids: true,
      
      // Portfolio
      viewPortfolio: true,
      managePortfolio: true,
      
      // Compliance
      viewComplianceData: true,
      submitKYCDocuments: true,
      viewTransactionHistory: true,
      
      // Analytics & Reports
      viewAllAnalytics: true,
      viewPnL: true,
      viewImpactMetrics: true,
      generateReports: true,
      exportData: true,
      
      // Settings
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
      // Investment Operations (View/Recommend)
      viewOpportunities: true,
      viewAllInvestments: true,
      recommendInvestments: true,
      submitBids: false, // Needs admin approval
      
      // Portfolio
      viewPortfolio: true,
      
      // Analytics
      viewAnalytics: true,
      viewImpactMetrics: true,
      performDueDiligence: true,
      
      // Reports
      generateAnalysisReports: true,
      createInvestmentMemos: true,
    },
    dashboardPath: '/investor',
    defaultRoute: '/investor',
  },
};

// Demo Users Configuration
export const DEMO_USERS = {
  // Platform Admin
  'admin@forwardsflow.com': {
    id: 'ff-admin-001',
    email: 'admin@forwardsflow.com',
    password: 'admin123',
    name: 'System Administrator',
    role: ROLES.FORWARDSFLOW_ADMIN,
    tenantId: 'forwardsflow',
    tenantName: 'ForwardsFlow',
    tenantType: TENANT_TYPES.PLATFORM,
    avatar: null,
    createdAt: '2024-01-01T00:00:00Z',
  },
  
  // Bank - Equity Africa
  'admin@equityafrica.com': {
    id: 'ea-admin-001',
    email: 'admin@equityafrica.com',
    password: 'demo123',
    name: 'Amoroso Gombe',
    role: ROLES.BANK_ADMIN,
    tenantId: 'equity-africa',
    tenantName: 'Equity Africa Bank',
    tenantType: TENANT_TYPES.BANK,
    jobTitle: 'Treasury Director',
    avatar: null,
    createdAt: '2024-02-01T00:00:00Z',
  },
  'lending@equityafrica.com': {
    id: 'ea-lender-001',
    email: 'lending@equityafrica.com',
    password: 'demo123',
    name: 'Grace Mwangi',
    role: ROLES.BANK_LENDER,
    tenantId: 'equity-africa',
    tenantName: 'Equity Africa Bank',
    tenantType: TENANT_TYPES.BANK,
    jobTitle: 'Mobile Lending Manager',
    avatar: null,
    createdAt: '2024-03-01T00:00:00Z',
  },
  'calling@equityafrica.com': {
    id: 'ea-caller-001',
    email: 'calling@equityafrica.com',
    password: 'demo123',
    name: 'James Oduor',
    role: ROLES.BANK_CALLER,
    tenantId: 'equity-africa',
    tenantName: 'Equity Africa Bank',
    tenantType: TENANT_TYPES.BANK,
    jobTitle: 'Capital Markets Officer',
    avatar: null,
    createdAt: '2024-03-15T00:00:00Z',
  },
  'compliance@equityafrica.com': {
    id: 'ea-compliance-001',
    email: 'compliance@equityafrica.com',
    password: 'demo123',
    name: 'Faith Wambui',
    role: ROLES.BANK_COMPLIANCE,
    tenantId: 'equity-africa',
    tenantName: 'Equity Africa Bank',
    tenantType: TENANT_TYPES.BANK,
    jobTitle: 'Compliance Officer',
    avatar: null,
    createdAt: '2024-03-20T00:00:00Z',
  },
  'risk@equityafrica.com': {
    id: 'ea-risk-001',
    email: 'risk@equityafrica.com',
    password: 'demo123',
    name: 'David Kimani',
    role: ROLES.BANK_RISK,
    tenantId: 'equity-africa',
    tenantName: 'Equity Africa Bank',
    tenantType: TENANT_TYPES.BANK,
    jobTitle: 'Credit Risk Analyst',
    avatar: null,
    createdAt: '2024-04-01T00:00:00Z',
  },
  
  // Investor - Impact Capital
  'admin@impactcapital.com': {
    id: 'ic-admin-001',
    email: 'admin@impactcapital.com',
    password: 'demo123',
    name: 'Sarah Chen',
    role: ROLES.INVESTOR_ADMIN,
    tenantId: 'impact-capital',
    tenantName: 'Impact Capital Partners',
    tenantType: TENANT_TYPES.INVESTOR,
    jobTitle: 'Managing Director',
    avatar: null,
    createdAt: '2024-02-15T00:00:00Z',
  },
  'analyst@impactcapital.com': {
    id: 'ic-analyst-001',
    email: 'analyst@impactcapital.com',
    password: 'demo123',
    name: 'Michael Torres',
    role: ROLES.INVESTOR_ANALYST,
    tenantId: 'impact-capital',
    tenantName: 'Impact Capital Partners',
    tenantType: TENANT_TYPES.INVESTOR,
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

export const isPlatformRole = (role) => {
  return getTenantType(role) === TENANT_TYPES.PLATFORM;
};

export const isBankRole = (role) => {
  return getTenantType(role) === TENANT_TYPES.BANK;
};

export const isInvestorRole = (role) => {
  return getTenantType(role) === TENANT_TYPES.INVESTOR;
};

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
