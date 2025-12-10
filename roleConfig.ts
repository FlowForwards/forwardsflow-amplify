// roleConfig.ts - ForwardsFlow Multi-tenant Role Configuration
// Place in: src/config/roleConfig.ts

// ============================================
// ARCHITECTURE OVERVIEW
// ============================================
//
// PLATFORM LEVEL (ForwardsFlow - Your Company)
// └── ForwardsFlow Admin (Level 0) - Manages tenants only
//     ├── Partner Bank Tenants
//     │   └── Bank Admins
//     └── Impact Investor Tenants
//         └── Investor Admins
//
// TENANT LEVEL - PARTNER BANKS
// └── Bank Admin (Level 1) - Top of bank org
//     ├── Lender (Level 2)
//     ├── Caller (Level 2)
//     ├── Compliance (Level 2)
//     └── Credit Risk (Level 2)
//
// TENANT LEVEL - IMPACT INVESTORS
// └── Investor Admin (Level 1) - Top of investor org
//     └── Analyst (Level 2)
//
// ============================================

export enum TenantType {
  PLATFORM = 'platform',
  BANK = 'bank',
  INVESTOR = 'investor'
}

export enum RoleLevel {
  PLATFORM_ADMIN = 0,
  TENANT_ADMIN = 1,
  TENANT_STAFF = 2
}

// ============================================
// ROLE DEFINITIONS
// ============================================
export interface RoleConfig {
  id: string;
  level: RoleLevel;
  tenantType: TenantType;
  displayName: string;
  description: string;
  color: string;
  icon: string;
  canManage: string[];
  permissions: string[];
  dashboardTabs: string[];
}

export const ROLES: Record<string, RoleConfig> = {
  // ==========================================
  // PLATFORM LEVEL - ForwardsFlow
  // ==========================================
  forwardsflow_admin: {
    id: 'forwardsflow_admin',
    level: RoleLevel.PLATFORM_ADMIN,
    tenantType: TenantType.PLATFORM,
    displayName: 'ForwardsFlow Admin',
    description: 'Platform super administrator - manages all tenants',
    color: 'red',
    icon: 'Globe',
    canManage: ['bank_admin', 'investor_admin'],
    permissions: [
      // Tenant management
      'tenants:view',
      'tenants:create',
      'tenants:edit',
      'tenants:suspend',
      'tenants:delete',
      // Tenant admin management
      'tenant_admins:view',
      'tenant_admins:create',
      'tenant_admins:edit',
      'tenant_admins:suspend',
      // Compliance & oversight
      'transactions:view_all',
      'compliance:view_all',
      'aml:view_all',
      'kyc:view_all',
      // Platform metrics
      'platform_pl:view',
      'platform_revenue:view',
      'platform_usage:view',
      // System settings
      'system:settings',
      'system:audit_logs',
      // DENIED - Cannot access tenant staff
      // 'tenant_staff:view' - NOT INCLUDED
      // 'tenant_staff:manage' - NOT INCLUDED
    ],
    dashboardTabs: [
      'overview',
      'banks',
      'investors',
      'transactions',
      'platform_pl',
      'compliance',
      'system_settings'
    ]
  },

  // ==========================================
  // PARTNER BANK TENANT LEVEL
  // ==========================================
  bank_admin: {
    id: 'bank_admin',
    level: RoleLevel.TENANT_ADMIN,
    tenantType: TenantType.BANK,
    displayName: 'Bank Admin',
    description: 'Partner bank administrator - full bank access',
    color: 'purple',
    icon: 'Building2',
    canManage: ['bank_lender', 'bank_caller', 'bank_compliance', 'bank_risk'],
    permissions: [
      // Staff management
      'staff:view',
      'staff:create',
      'staff:edit',
      'staff:suspend',
      'staff:delete',
      // All banking operations
      'deposits:full_access',
      'lending:full_access',
      'settlements:full_access',
      'compliance:full_access',
      'risk:full_access',
      // Transactions & reporting
      'transactions:view',
      'transactions:export',
      'reports:full_access',
      // Bank P&L
      'bank_pl:view',
      'bank_revenue:view',
      'bank_usage:view',
      // Settings
      'bank:settings'
    ],
    dashboardTabs: [
      'overview',
      'user_management',
      'deposits',
      'lending',
      'settlements',
      'compliance',
      'analytics',
      'reports',
      'settings'
    ]
  },

  bank_lender: {
    id: 'bank_lender',
    level: RoleLevel.TENANT_STAFF,
    tenantType: TenantType.BANK,
    displayName: 'Lending Officer',
    description: 'Mobile lending operations specialist',
    color: 'blue',
    icon: 'Wallet',
    canManage: [],
    permissions: [
      'lending:view',
      'lending:approve',
      'lending:reject',
      'lending:disburse',
      'loans:view',
      'loans:manage',
      'borrowers:view',
      'collections:view',
      'lending_analytics:view'
    ],
    dashboardTabs: [
      'overview',
      'loan_queue',
      'active_loans',
      'collections',
      'lending_analytics'
    ]
  },

  bank_caller: {
    id: 'bank_caller',
    level: RoleLevel.TENANT_STAFF,
    tenantType: TenantType.BANK,
    displayName: 'Capital Markets Officer',
    description: 'Capital call and deposit operations',
    color: 'indigo',
    icon: 'TrendingUp',
    canManage: [],
    permissions: [
      'deposits:view',
      'deposits:create',
      'deposits:negotiate',
      'calls:view',
      'calls:create',
      'calls:manage',
      'investors:view',
      'settlements:view',
      'capital_analytics:view'
    ],
    dashboardTabs: [
      'overview',
      'create_call',
      'active_calls',
      'negotiations',
      'settlements',
      'capital_analytics'
    ]
  },

  bank_compliance: {
    id: 'bank_compliance',
    level: RoleLevel.TENANT_STAFF,
    tenantType: TenantType.BANK,
    displayName: 'Compliance Officer',
    description: 'AML, KYC and regulatory compliance',
    color: 'amber',
    icon: 'Shield',
    canManage: [],
    permissions: [
      'compliance:view',
      'compliance:flag',
      'compliance:approve',
      'aml:view',
      'aml:report',
      'kyc:view',
      'kyc:verify',
      'audit:view',
      'regulatory:view',
      'compliance_reports:view',
      'compliance_reports:generate'
    ],
    dashboardTabs: [
      'overview',
      'aml_monitoring',
      'kyc_verification',
      'suspicious_activity',
      'regulatory_reports',
      'audit_trail'
    ]
  },

  bank_risk: {
    id: 'bank_risk',
    level: RoleLevel.TENANT_STAFF,
    tenantType: TenantType.BANK,
    displayName: 'Credit Risk Analyst',
    description: 'Credit risk and portfolio management',
    color: 'rose',
    icon: 'AlertTriangle',
    canManage: [],
    permissions: [
      'risk:view',
      'risk:assess',
      'risk:report',
      'credit_scoring:view',
      'portfolio:view',
      'portfolio:analyze',
      'defaults:view',
      'defaults:manage',
      'risk_reports:view',
      'risk_reports:generate'
    ],
    dashboardTabs: [
      'overview',
      'portfolio_risk',
      'credit_scoring',
      'default_analysis',
      'stress_testing',
      'risk_reports'
    ]
  },

  // ==========================================
  // IMPACT INVESTOR TENANT LEVEL
  // ==========================================
  investor_admin: {
    id: 'investor_admin',
    level: RoleLevel.TENANT_ADMIN,
    tenantType: TenantType.INVESTOR,
    displayName: 'Investor Admin',
    description: 'Impact investor administrator - full investor access',
    color: 'emerald',
    icon: 'Landmark',
    canManage: ['investor_analyst'],
    permissions: [
      // Staff management
      'staff:view',
      'staff:create',
      'staff:edit',
      'staff:suspend',
      'staff:delete',
      // All investor operations
      'investments:full_access',
      'calls:full_access',
      'puts:full_access',
      'settlements:full_access',
      // Transactions & reporting
      'transactions:view',
      'transactions:export',
      'reports:full_access',
      // Investor P&L
      'investor_pl:view',
      'investor_returns:view',
      'investor_usage:view',
      // Settings
      'investor:settings'
    ],
    dashboardTabs: [
      'overview',
      'user_management',
      'calls',
      'puts',
      'portfolio',
      'settlements',
      'analytics',
      'reports',
      'settings'
    ]
  },

  investor_analyst: {
    id: 'investor_analyst',
    level: RoleLevel.TENANT_STAFF,
    tenantType: TenantType.INVESTOR,
    displayName: 'Investment Analyst',
    description: 'Investment analysis and operations',
    color: 'teal',
    icon: 'LineChart',
    canManage: [],
    permissions: [
      'calls:view',
      'calls:bid',
      'puts:view',
      'puts:create',
      'portfolio:view',
      'portfolio:analyze',
      'settlements:view',
      'analytics:view',
      'reports:view'
    ],
    dashboardTabs: [
      'overview',
      'available_calls',
      'my_investments',
      'portfolio_analytics',
      'impact_metrics'
    ]
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getRole = (roleId: string): RoleConfig | undefined => {
  return ROLES[roleId];
};

export const getRoleLevel = (roleId: string): RoleLevel => {
  return ROLES[roleId]?.level ?? RoleLevel.TENANT_STAFF;
};

export const isPlatformRole = (roleId: string): boolean => {
  return ROLES[roleId]?.tenantType === TenantType.PLATFORM;
};

export const isBankRole = (roleId: string): boolean => {
  return ROLES[roleId]?.tenantType === TenantType.BANK;
};

export const isInvestorRole = (roleId: string): boolean => {
  return ROLES[roleId]?.tenantType === TenantType.INVESTOR;
};

export const isTenantAdmin = (roleId: string): boolean => {
  return ROLES[roleId]?.level === RoleLevel.TENANT_ADMIN;
};

export const canManageUsers = (roleId: string): boolean => {
  return (ROLES[roleId]?.canManage?.length ?? 0) > 0;
};

export const getManageableRoles = (roleId: string): string[] => {
  return ROLES[roleId]?.canManage ?? [];
};

export const hasPermission = (roleId: string, permission: string): boolean => {
  return ROLES[roleId]?.permissions?.includes(permission) ?? false;
};

export const getDashboardTabs = (roleId: string): string[] => {
  return ROLES[roleId]?.dashboardTabs ?? [];
};

export const getRolesByTenantType = (tenantType: TenantType): RoleConfig[] => {
  return Object.values(ROLES).filter(role => role.tenantType === tenantType);
};

export const getBankStaffRoles = (): RoleConfig[] => {
  return Object.values(ROLES).filter(
    role => role.tenantType === TenantType.BANK && role.level === RoleLevel.TENANT_STAFF
  );
};

export const getInvestorStaffRoles = (): RoleConfig[] => {
  return Object.values(ROLES).filter(
    role => role.tenantType === TenantType.INVESTOR && role.level === RoleLevel.TENANT_STAFF
  );
};

// ============================================
// DEMO USERS
// ============================================
export const DEMO_USERS = [
  {
    email: 'admin@forwardsflow.com',
    name: 'System Administrator',
    role: 'forwardsflow_admin',
    tenantId: 'forwardsflow',
    tenantName: 'ForwardsFlow'
  },
  {
    email: 'admin@equityafrica.com',
    name: 'Bank Administrator',
    role: 'bank_admin',
    tenantId: 'equity-africa',
    tenantName: 'Equity Bank Africa'
  },
  {
    email: 'lending@equityafrica.com',
    name: 'James Mwangi',
    role: 'bank_lender',
    tenantId: 'equity-africa',
    tenantName: 'Equity Bank Africa'
  },
  {
    email: 'calling@equityafrica.com',
    name: 'Sarah Ochieng',
    role: 'bank_caller',
    tenantId: 'equity-africa',
    tenantName: 'Equity Bank Africa'
  },
  {
    email: 'compliance@equityafrica.com',
    name: 'Peter Kimani',
    role: 'bank_compliance',
    tenantId: 'equity-africa',
    tenantName: 'Equity Bank Africa'
  },
  {
    email: 'risk@equityafrica.com',
    name: 'Grace Wanjiku',
    role: 'bank_risk',
    tenantId: 'equity-africa',
    tenantName: 'Equity Bank Africa'
  },
  {
    email: 'admin@impactcapital.com',
    name: 'Investor Administrator',
    role: 'investor_admin',
    tenantId: 'impact-capital',
    tenantName: 'Impact Capital Partners'
  },
  {
    email: 'analyst@impactcapital.com',
    name: 'Michael Chen',
    role: 'investor_analyst',
    tenantId: 'impact-capital',
    tenantName: 'Impact Capital Partners'
  }
];

export default {
  TenantType,
  RoleLevel,
  ROLES,
  DEMO_USERS,
  getRole,
  getRoleLevel,
  isPlatformRole,
  isBankRole,
  isInvestorRole,
  isTenantAdmin,
  canManageUsers,
  getManageableRoles,
  hasPermission,
  getDashboardTabs,
  getRolesByTenantType,
  getBankStaffRoles,
  getInvestorStaffRoles
};
