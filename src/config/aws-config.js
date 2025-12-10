// AWS Amplify Configuration
// Update these values after CDK deployment

const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.REACT_APP_USER_POOL_ID || 'eu-west-1_XXXXXXXXX',
      userPoolClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID || 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
      signUpVerificationMethod: 'code',
      loginWith: {
        email: true,
      },
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: process.env.REACT_APP_GRAPHQL_ENDPOINT || 'https://xxxxxxxxxx.appsync-api.eu-west-1.amazonaws.com/graphql',
      region: process.env.REACT_APP_AWS_REGION || 'eu-west-1',
      defaultAuthMode: 'userPool',
      apiKey: process.env.REACT_APP_GRAPHQL_API_KEY,
    },
  },
};

export default awsConfig;

// Role definitions for the platform
export const ROLES = {
  // Platform Level
  FORWARDSFLOW_ADMIN: 'FORWARDSFLOW_ADMIN',
  
  // Bank Tenant Roles
  BANK_ADMIN: 'BANK_ADMIN',
  BANK_LENDER: 'BANK_LENDER',
  BANK_CALLER: 'BANK_CALLER',
  BANK_COMPLIANCE: 'BANK_COMPLIANCE',
  BANK_RISK: 'BANK_RISK',
  
  // Investor Tenant Roles
  INVESTOR_ADMIN: 'INVESTOR_ADMIN',
  INVESTOR_ANALYST: 'INVESTOR_ANALYST',
};

// Role hierarchy and permissions
export const ROLE_CONFIG = {
  [ROLES.FORWARDSFLOW_ADMIN]: {
    level: 0,
    label: 'ForwardsFlow Admin',
    description: 'Platform super administrator',
    orgType: 'platform',
    dashboardPath: '/admin',
    permissions: {
      organizations: ['create', 'read', 'update', 'delete', 'suspend'],
      users: ['create', 'read', 'update', 'delete', 'suspend'],
      capitalCalls: ['read'],
      investments: ['read'],
      mobileLoans: ['read'],
      metrics: ['read', 'refresh'],
      auditLogs: ['read'],
      compliance: ['read'],
    },
  },
  [ROLES.BANK_ADMIN]: {
    level: 1,
    label: 'Bank Admin',
    description: 'Bank tenant administrator',
    orgType: 'bank',
    dashboardPath: '/bank/admin',
    permissions: {
      users: ['create', 'read', 'update', 'suspend'], // Own org only
      capitalCalls: ['create', 'read', 'update', 'delete', 'publish'],
      investments: ['read', 'approve'],
      mobileLoans: ['read', 'approve', 'disburse'],
      metrics: ['read'],
      auditLogs: ['read'], // Own org only
      compliance: ['read', 'update'],
      settings: ['read', 'update'],
    },
  },
  [ROLES.BANK_LENDER]: {
    level: 2,
    label: 'Bank Lender',
    description: 'Mobile lending operations',
    orgType: 'bank',
    dashboardPath: '/bank/lending',
    permissions: {
      mobileLoans: ['create', 'read', 'update', 'approve', 'disburse'],
      metrics: ['read'], // Lending metrics only
    },
  },
  [ROLES.BANK_CALLER]: {
    level: 2,
    label: 'Bank Caller',
    description: 'Capital call operations',
    orgType: 'bank',
    dashboardPath: '/bank/calls',
    permissions: {
      capitalCalls: ['create', 'read', 'update', 'publish'],
      investments: ['read'],
      metrics: ['read'], // Capital metrics only
    },
  },
  [ROLES.BANK_COMPLIANCE]: {
    level: 2,
    label: 'Bank Compliance',
    description: 'Compliance operations',
    orgType: 'bank',
    dashboardPath: '/bank/compliance',
    permissions: {
      investments: ['read', 'approveKyc', 'rejectKyc'],
      mobileLoans: ['read'],
      auditLogs: ['read'],
      compliance: ['read', 'update'],
    },
  },
  [ROLES.BANK_RISK]: {
    level: 2,
    label: 'Bank Risk',
    description: 'Credit risk management',
    orgType: 'bank',
    dashboardPath: '/bank/risk',
    permissions: {
      mobileLoans: ['read', 'writeOff'],
      metrics: ['read'], // Risk metrics
      compliance: ['read'],
    },
  },
  [ROLES.INVESTOR_ADMIN]: {
    level: 1,
    label: 'Investor Admin',
    description: 'Investor tenant administrator',
    orgType: 'investor',
    dashboardPath: '/investor/admin',
    permissions: {
      users: ['create', 'read', 'update', 'suspend'], // Own org only
      capitalCalls: ['read'],
      investments: ['create', 'read', 'update', 'cancel', 'submitKyc'],
      metrics: ['read'],
      auditLogs: ['read'], // Own org only
      settings: ['read', 'update'],
    },
  },
  [ROLES.INVESTOR_ANALYST]: {
    level: 2,
    label: 'Investor Analyst',
    description: 'Investment analysis',
    orgType: 'investor',
    dashboardPath: '/investor',
    permissions: {
      capitalCalls: ['read'],
      investments: ['read', 'create'],
      metrics: ['read'],
    },
  },
};

// Helper functions
export const getRoleConfig = (role) => ROLE_CONFIG[role] || null;

export const hasPermission = (role, resource, action) => {
  const config = getRoleConfig(role);
  if (!config) return false;
  
  const resourcePermissions = config.permissions[resource];
  if (!resourcePermissions) return false;
  
  return resourcePermissions.includes(action);
};

export const getOrgTypeForRole = (role) => {
  const config = getRoleConfig(role);
  return config?.orgType || null;
};

export const getDashboardPathForRole = (role) => {
  const config = getRoleConfig(role);
  return config?.dashboardPath || '/';
};

export const isBankRole = (role) => getOrgTypeForRole(role) === 'bank';
export const isInvestorRole = (role) => getOrgTypeForRole(role) === 'investor';
export const isPlatformRole = (role) => getOrgTypeForRole(role) === 'platform';

export const getRoleLabel = (role) => {
  const config = getRoleConfig(role);
  return config?.label || role;
};
