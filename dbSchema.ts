// dbSchema.ts - DynamoDB Table Schemas for ForwardsFlow
// Place in: src/config/dbSchema.ts

// ============================================
// TABLE DEFINITIONS
// ============================================

export const TABLES = {
  // ==========================================
  // CORE ENTITY TABLES
  // ==========================================
  
  TENANTS: 'forwardsflow-tenants',
  USERS: 'forwardsflow-users',
  
  // ==========================================
  // BANKING / DEPOSIT TABLES
  // ==========================================
  
  DEPOSIT_CALLS: 'forwardsflow-deposit-calls',
  INVESTOR_BIDS: 'forwardsflow-investor-bids',
  SETTLEMENTS: 'forwardsflow-settlements',
  
  // ==========================================
  // MOBILE LENDING TABLES
  // ==========================================
  
  LOAN_APPLICATIONS: 'forwardsflow-loan-applications',
  LOANS: 'forwardsflow-loans',
  LOAN_REPAYMENTS: 'forwardsflow-loan-repayments',
  BORROWERS: 'forwardsflow-borrowers',
  
  // ==========================================
  // COMPLIANCE TABLES
  // ==========================================
  
  KYC_RECORDS: 'forwardsflow-kyc-records',
  AML_ALERTS: 'forwardsflow-aml-alerts',
  AUDIT_LOGS: 'forwardsflow-audit-logs',
  
  // ==========================================
  // ANALYTICS / METRICS TABLES
  // ==========================================
  
  PLATFORM_METRICS: 'forwardsflow-platform-metrics',
  TENANT_METRICS: 'forwardsflow-tenant-metrics',
  DAILY_SNAPSHOTS: 'forwardsflow-daily-snapshots'
};

// ============================================
// TYPESCRIPT INTERFACES
// ============================================

// Tenant (Bank or Investor Organization)
export interface Tenant {
  tenantId: string;              // PK
  type: 'bank' | 'investor';
  name: string;
  legalName: string;
  country: string;
  status: 'active' | 'suspended' | 'pending';
  
  // Contact info
  email: string;
  phone: string;
  address: string;
  
  // Regulatory
  licenseNumber?: string;
  regulatoryBody?: string;
  
  // Financials
  totalDeposits?: number;        // For banks
  totalInvested?: number;        // For investors
  revenueToDate?: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// User
export interface User {
  pk: string;                    // PK: TENANT#<tenantId>
  sk: string;                    // SK: USER#<userId>
  
  userId: string;
  tenantId: string;
  email: string;
  name: string;
  role: string;
  status: 'active' | 'suspended' | 'pending';
  
  // Profile
  phone?: string;
  department?: string;
  
  // Auth
  cognitoSub?: string;
  lastLogin?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Deposit Call (Capital Raising Instrument)
export interface DepositCall {
  pk: string;                    // PK: BANK#<tenantId>
  sk: string;                    // SK: CALL#<callId>
  
  callId: string;
  bankId: string;
  bankName: string;
  
  // Instrument details
  instrumentType: 'fixed_deposit' | 'time_deposit' | 'certificate_of_deposit';
  currencyPair: string;          // e.g., "KES:JPY"
  principalAmount: number;
  minTicketSize: number;
  maxTicketSize: number;
  
  // Rates
  interestRate: number;          // Annual %
  fxRate: number;
  forwardsPremium: number;       // %
  totalYield: number;            // Calculated
  
  // Timeline
  maturityDays: number;
  maturityDate: string;
  subscriptionDeadline: string;
  
  // Status
  status: 'open' | 'partially_subscribed' | 'fully_subscribed' | 'closed' | 'matured' | 'settled';
  totalSubscribed: number;
  subscriptionPercentage: number;
  
  // Deployment tracking
  deployedToLoans: number;
  deploymentPercentage: number;
  currentROI: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Investor Bid
export interface InvestorBid {
  pk: string;                    // PK: CALL#<callId>
  sk: string;                    // SK: BID#<bidId>
  
  bidId: string;
  callId: string;
  investorId: string;
  investorName: string;
  
  // Bid details
  bidAmount: number;
  proposedRate?: number;         // Counter-offer
  
  // Status
  status: 'pending' | 'accepted' | 'rejected' | 'countered' | 'withdrawn';
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  respondedAt?: string;
}

// Loan Application
export interface LoanApplication {
  pk: string;                    // PK: BANK#<tenantId>
  sk: string;                    // SK: APP#<applicationId>
  
  applicationId: string;
  bankId: string;
  borrowerId: string;
  
  // Borrower info
  phoneNumber: string;
  borrowerName: string;
  
  // Request
  amountRequested: number;
  durationDays: number;
  purpose?: string;
  
  // Scoring
  creditScore?: number;
  riskRating: 'low' | 'medium' | 'high' | 'very_high';
  kycStatus: 'verified' | 'pending' | 'failed';
  previousLoans: number;
  defaultHistory: boolean;
  
  // Status
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'disbursed';
  reviewedBy?: string;
  reviewNotes?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
}

// Active Loan
export interface Loan {
  pk: string;                    // PK: BANK#<tenantId>
  sk: string;                    // SK: LOAN#<loanId>
  
  loanId: string;
  applicationId: string;
  bankId: string;
  borrowerId: string;
  
  // Borrower info
  phoneNumber: string;
  borrowerName: string;
  
  // Loan terms
  principalAmount: number;
  interestRate: number;          // Annual %
  apr: number;                   // APR including fees
  durationDays: number;
  repaymentSchedule: 'daily' | 'weekly' | 'bi_weekly' | 'monthly';
  
  // Amounts
  totalRepayable: number;
  totalPaid: number;
  outstandingBalance: number;
  
  // Dates
  disbursementDate: string;
  maturityDate: string;
  nextPaymentDate: string;
  
  // Status
  status: 'disbursed' | 'current' | 'overdue' | 'defaulted' | 'paid_off' | 'written_off';
  daysOverdue: number;
  
  // Funding source
  fundedFromCallId?: string;     // Links to deposit call
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Loan Repayment
export interface LoanRepayment {
  pk: string;                    // PK: LOAN#<loanId>
  sk: string;                    // SK: REPAY#<timestamp>
  
  repaymentId: string;
  loanId: string;
  borrowerId: string;
  bankId: string;
  
  // Payment details
  amount: number;
  principalPortion: number;
  interestPortion: number;
  feesPortion: number;
  
  // MPESA
  mpesaRef?: string;
  paymentMethod: 'mpesa' | 'bank_transfer' | 'cash';
  
  // Status
  status: 'completed' | 'pending' | 'failed' | 'reversed';
  
  // Timestamps
  createdAt: string;
}

// Borrower Profile
export interface Borrower {
  pk: string;                    // PK: BORROWER#<phoneNumber>
  sk: string;                    // SK: PROFILE
  
  borrowerId: string;
  phoneNumber: string;
  name: string;
  
  // KYC
  nationalId?: string;
  kycStatus: 'verified' | 'pending' | 'failed';
  kycDate?: string;
  
  // Credit profile
  creditScore: number;
  totalLoans: number;
  activeLoans: number;
  totalBorrowed: number;
  totalRepaid: number;
  defaultCount: number;
  
  // Status
  status: 'active' | 'blacklisted' | 'dormant';
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Settlement
export interface Settlement {
  pk: string;                    // PK: TENANT#<tenantId>
  sk: string;                    // SK: SETTLE#<settlementId>
  
  settlementId: string;
  type: 'deposit_maturity' | 'loan_disbursement' | 'repayment_batch' | 'fee_payment';
  
  // Parties
  fromTenantId: string;
  toTenantId: string;
  
  // Amounts
  amount: number;
  currency: string;
  fxRate?: number;
  fxAmount?: number;
  fxCurrency?: string;
  
  // Reference
  referenceType: 'call' | 'loan' | 'fee';
  referenceId: string;
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed';
  
  // Payment details
  paymentMethod: 'swift' | 'mpesa' | 'internal';
  paymentRef?: string;
  
  // Timestamps
  createdAt: string;
  completedAt?: string;
}

// KYC Record
export interface KYCRecord {
  pk: string;                    // PK: ENTITY#<entityType>#<entityId>
  sk: string;                    // SK: KYC#<recordId>
  
  recordId: string;
  entityType: 'borrower' | 'tenant';
  entityId: string;
  
  // Documents
  documentType: 'national_id' | 'passport' | 'business_license' | 'tax_certificate';
  documentNumber: string;
  documentUrl?: string;
  
  // Verification
  status: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verificationNotes?: string;
  
  // Timestamps
  createdAt: string;
  verifiedAt?: string;
}

// AML Alert
export interface AMLAlert {
  pk: string;                    // PK: TENANT#<tenantId>
  sk: string;                    // SK: AML#<alertId>
  
  alertId: string;
  tenantId: string;
  
  // Alert details
  alertType: 'suspicious_transaction' | 'high_volume' | 'blacklist_match' | 'pattern_detected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  // Reference
  referenceType: 'loan' | 'settlement' | 'borrower';
  referenceId: string;
  
  // Details
  description: string;
  amount?: number;
  
  // Status
  status: 'open' | 'investigating' | 'escalated' | 'resolved' | 'dismissed';
  assignedTo?: string;
  resolution?: string;
  
  // Timestamps
  createdAt: string;
  resolvedAt?: string;
}

// Audit Log
export interface AuditLog {
  pk: string;                    // PK: TENANT#<tenantId>
  sk: string;                    // SK: AUDIT#<timestamp>#<logId>
  
  logId: string;
  tenantId: string;
  userId: string;
  userName: string;
  
  // Action
  action: string;
  resource: string;
  resourceId: string;
  
  // Details
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  
  // Timestamps
  createdAt: string;
}

// Platform Metrics (Daily Snapshot)
export interface PlatformMetrics {
  pk: string;                    // PK: METRICS#PLATFORM
  sk: string;                    // SK: <date>
  
  date: string;
  
  // Tenant metrics
  totalBanks: number;
  activeBanks: number;
  totalInvestors: number;
  activeInvestors: number;
  
  // Volume metrics
  totalDepositsRaised: number;
  totalLoansOriginated: number;
  totalLoansDisbursed: number;
  totalRepaymentsCollected: number;
  
  // Financial metrics
  platformRevenue: number;
  platformFees: number;
  
  // Performance
  averageYield: number;
  defaultRate: number;
  
  // Timestamps
  createdAt: string;
}

// Tenant Metrics (Daily Snapshot)
export interface TenantMetrics {
  pk: string;                    // PK: METRICS#TENANT#<tenantId>
  sk: string;                    // SK: <date>
  
  tenantId: string;
  tenantType: 'bank' | 'investor';
  date: string;
  
  // Bank-specific metrics
  activeDeposits?: number;
  totalDepositValue?: number;
  activeLoanCount?: number;
  loanBookValue?: number;
  disbursementsToday?: number;
  repaymentsToday?: number;
  defaultRate?: number;
  portfolioYield?: number;
  
  // Investor-specific metrics
  activeInvestments?: number;
  totalInvested?: number;
  pendingSettlements?: number;
  realizedReturns?: number;
  unrealizedReturns?: number;
  
  // Common metrics
  revenue: number;
  transactionCount: number;
  
  // Timestamps
  createdAt: string;
}

// ============================================
// INDEX DEFINITIONS (GSIs)
// ============================================

export const INDEXES = {
  // Users by email (for login)
  USERS_BY_EMAIL: {
    name: 'users-by-email-index',
    pk: 'email',
    sk: 'tenantId'
  },
  
  // Calls by status (for marketplace)
  CALLS_BY_STATUS: {
    name: 'calls-by-status-index',
    pk: 'status',
    sk: 'createdAt'
  },
  
  // Loans by status (for portfolio management)
  LOANS_BY_STATUS: {
    name: 'loans-by-status-index',
    pk: 'status',
    sk: 'createdAt'
  },
  
  // Applications by status (for queue management)
  APPLICATIONS_BY_STATUS: {
    name: 'applications-by-status-index',
    pk: 'status',
    sk: 'createdAt'
  },
  
  // AML alerts by status (for compliance dashboard)
  AML_BY_STATUS: {
    name: 'aml-by-status-index',
    pk: 'status',
    sk: 'severity'
  }
};

export default {
  TABLES,
  INDEXES
};
