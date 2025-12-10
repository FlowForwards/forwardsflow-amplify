// ForwardsFlow Database Service
// Handles all data operations with DynamoDB backend and local state fallback

import { ROLES, TENANT_TYPES } from '../config/roleConfig';

// ============================================
// DATABASE CONFIGURATION
// ============================================

const DB_CONFIG = {
  region: 'eu-west-1',
  // When Amplify is configured, these will be auto-populated
  tables: {
    organizations: 'ForwardsFlow-Organizations',
    users: 'ForwardsFlow-Users',
    capitalCalls: 'ForwardsFlow-CapitalCalls',
    investments: 'ForwardsFlow-Investments',
    loans: 'ForwardsFlow-Loans',
    transactions: 'ForwardsFlow-Transactions',
    metrics: 'ForwardsFlow-Metrics',
    auditLogs: 'ForwardsFlow-AuditLogs',
  },
};

// ============================================
// INITIAL SEED DATA
// ============================================

const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Organizations (Tenants)
const SEED_ORGANIZATIONS = [
  {
    id: 'forwardsflow',
    name: 'ForwardsFlow',
    type: TENANT_TYPES.PLATFORM,
    status: 'active',
    country: 'KE',
    email: 'admin@forwardsflow.com',
    createdAt: '2024-01-01T00:00:00Z',
    settings: {
      platformFeePercent: 2.5,
      defaultHedgingFee: 2.0,
    },
  },
  {
    id: 'equity-africa',
    name: 'Equity Africa Bank',
    type: TENANT_TYPES.BANK,
    status: 'active',
    country: 'KE',
    email: 'corporate@equityafrica.com',
    bankingLicense: 'CBK-2024-001',
    mobileLendingLicense: 'CBK-ML-2024-001',
    mpesaPaybill: '247247',
    whatsappNumber: '+254700000001',
    createdAt: '2024-02-01T00:00:00Z',
    settings: {
      autoApprovalLimit: 5000,
      maxLoanAmount: 100000,
      defaultInterestRate: 18,
      reserveRatio: 5.25,
    },
  },
  {
    id: 'dtb-africa',
    name: 'Diamond Trust Bank',
    type: TENANT_TYPES.BANK,
    status: 'active',
    country: 'KE',
    email: 'corporate@dtbafrica.com',
    bankingLicense: 'CBK-2024-002',
    mobileLendingLicense: 'CBK-ML-2024-002',
    mpesaPaybill: '329329',
    whatsappNumber: '+254700000002',
    createdAt: '2024-02-15T00:00:00Z',
    settings: {
      autoApprovalLimit: 3000,
      maxLoanAmount: 75000,
      defaultInterestRate: 16,
      reserveRatio: 5.25,
    },
  },
  {
    id: 'impact-capital',
    name: 'Impact Capital Partners',
    type: TENANT_TYPES.INVESTOR,
    status: 'active',
    country: 'US',
    email: 'contact@impactcapital.com',
    investorType: 'impact_fund',
    aum: 250000000,
    createdAt: '2024-02-15T00:00:00Z',
    settings: {
      minInvestment: 100000,
      targetYield: 12,
      riskTolerance: 'moderate',
    },
  },
  {
    id: 'shell-foundation',
    name: 'Shell Foundation',
    type: TENANT_TYPES.INVESTOR,
    status: 'active',
    country: 'GB',
    email: 'investments@shellfoundation.org',
    investorType: 'foundation',
    aum: 500000000,
    createdAt: '2024-03-01T00:00:00Z',
    settings: {
      minInvestment: 500000,
      targetYield: 10,
      riskTolerance: 'conservative',
    },
  },
];

// Capital Calls
const SEED_CAPITAL_CALLS = [
  {
    id: 'call-001',
    txnRef: 'TXN-2024-00001',
    bankId: 'equity-africa',
    bankName: 'Equity Africa Bank',
    amount: 10000000,
    currency: 'USD',
    targetCurrency: 'KES',
    maturityMonths: 12,
    interestRate: 15.0,
    fxRate: 153.50,
    hedgedFxRate: 156.57,
    hedgingFee: 2.0,
    status: 'published',
    subscribed: 0,
    subscribedPercent: 0,
    createdAt: '2024-11-01T10:00:00Z',
    expiresAt: '2024-12-01T10:00:00Z',
    purpose: 'Mobile Lending Deployment',
    projectedLendingYield: 32.4,
  },
  {
    id: 'call-002',
    txnRef: 'TXN-2024-00002',
    bankId: 'equity-africa',
    bankName: 'Equity Africa Bank',
    amount: 5000000,
    currency: 'USD',
    targetCurrency: 'KES',
    maturityMonths: 6,
    interestRate: 12.0,
    fxRate: 153.50,
    hedgedFxRate: 156.57,
    hedgingFee: 2.0,
    status: 'completed',
    subscribed: 5000000,
    subscribedPercent: 100,
    investorId: 'impact-capital',
    investorName: 'Impact Capital Partners',
    createdAt: '2024-08-01T10:00:00Z',
    completedAt: '2024-08-15T14:30:00Z',
    purpose: 'Mobile Lending Deployment',
    projectedLendingYield: 28.5,
  },
  {
    id: 'call-003',
    txnRef: 'TXN-2024-00003',
    bankId: 'dtb-africa',
    bankName: 'Diamond Trust Bank',
    amount: 15000000,
    currency: 'JPY',
    targetCurrency: 'KES',
    maturityMonths: 18,
    interestRate: 14.5,
    fxRate: 0.98,
    hedgedFxRate: 1.00,
    hedgingFee: 2.0,
    status: 'published',
    subscribed: 8500000,
    subscribedPercent: 56.7,
    createdAt: '2024-10-15T10:00:00Z',
    expiresAt: '2024-12-15T10:00:00Z',
    purpose: 'SME Lending Expansion',
    projectedLendingYield: 26.8,
  },
];

// Mobile Loans
const SEED_LOANS = [
  // Equity Africa Loans
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `loan-ea-${String(i + 1).padStart(4, '0')}`,
    bankId: 'equity-africa',
    borrowerPhone: `+2547${String(10000000 + i).slice(-8)}`,
    borrowerName: ['John Kamau', 'Mary Wanjiku', 'Peter Ochieng', 'Grace Njeri', 'David Mwangi', 'Faith Akinyi', 'James Otieno', 'Sarah Wambui', 'Michael Kiprop', 'Elizabeth Nyambura'][i % 10],
    amount: Math.floor(Math.random() * 45000) + 5000, // 5,000 - 50,000 KES
    currency: 'KES',
    interestRate: Math.floor(Math.random() * 6) + 15, // 15-20%
    term: [14, 30, 60, 90][Math.floor(Math.random() * 4)],
    status: ['current', 'current', 'current', 'current', 'current', 'overdue', 'paid'][Math.floor(Math.random() * 7)],
    disbursedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    amountPaid: 0, // Will be calculated
    creditScore: Math.floor(Math.random() * 300) + 500, // 500-800
    sourceCapitalCallId: 'call-002',
  })),
  
  // DTB Loans
  ...Array.from({ length: 30 }, (_, i) => ({
    id: `loan-dtb-${String(i + 1).padStart(4, '0')}`,
    bankId: 'dtb-africa',
    borrowerPhone: `+2557${String(10000000 + i).slice(-8)}`,
    borrowerName: ['Agnes Makena', 'Joseph Mutua', 'Catherine Muthoni', 'Robert Kibet', 'Anne Chebet'][i % 5],
    amount: Math.floor(Math.random() * 35000) + 3000,
    currency: 'KES',
    interestRate: Math.floor(Math.random() * 5) + 14,
    term: [14, 30, 45, 60][Math.floor(Math.random() * 4)],
    status: ['current', 'current', 'current', 'overdue', 'paid'][Math.floor(Math.random() * 5)],
    disbursedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + Math.random() * 45 * 24 * 60 * 60 * 1000).toISOString(),
    amountPaid: 0,
    creditScore: Math.floor(Math.random() * 300) + 500,
    sourceCapitalCallId: null,
  })),
];

// Calculate paid amounts
SEED_LOANS.forEach(loan => {
  if (loan.status === 'paid') {
    loan.amountPaid = loan.amount * (1 + loan.interestRate / 100);
  } else if (loan.status === 'current') {
    loan.amountPaid = loan.amount * Math.random() * 0.7;
  } else {
    loan.amountPaid = loan.amount * Math.random() * 0.3;
  }
  loan.amountPaid = Math.round(loan.amountPaid);
});

// Investments (Completed Capital Calls from Investor Perspective)
const SEED_INVESTMENTS = [
  {
    id: 'inv-001',
    investorId: 'impact-capital',
    capitalCallId: 'call-002',
    bankId: 'equity-africa',
    bankName: 'Equity Africa Bank',
    amount: 5000000,
    currency: 'USD',
    interestRate: 12.0,
    maturityDate: '2025-02-15',
    status: 'active',
    investedAt: '2024-08-15T14:30:00Z',
    expectedReturn: 5600000,
    currentValue: 5250000,
    accruedInterest: 250000,
    loansDeployed: 847,
    nplRate: 2.8,
    impactMetrics: {
      borrowersReached: 847,
      avgLoanSize: 5900,
      m2Generated: 95000000,
      jobsSupported: 423,
    },
  },
  {
    id: 'inv-002',
    investorId: 'shell-foundation',
    capitalCallId: null,
    bankId: 'dtb-africa',
    bankName: 'Diamond Trust Bank',
    amount: 8000000,
    currency: 'USD',
    interestRate: 11.5,
    maturityDate: '2025-06-01',
    status: 'active',
    investedAt: '2024-06-01T10:00:00Z',
    expectedReturn: 8920000,
    currentValue: 8460000,
    accruedInterest: 460000,
    loansDeployed: 1234,
    nplRate: 3.2,
    impactMetrics: {
      borrowersReached: 1234,
      avgLoanSize: 6480,
      m2Generated: 152000000,
      jobsSupported: 617,
    },
  },
];

// Transactions
const SEED_TRANSACTIONS = [
  // Capital inflows
  {
    id: 'txn-001',
    type: 'capital_inflow',
    bankId: 'equity-africa',
    investorId: 'impact-capital',
    amount: 5000000,
    currency: 'USD',
    status: 'completed',
    reference: 'SWIFT-2024-08-001',
    createdAt: '2024-08-15T14:30:00Z',
    completedAt: '2024-08-15T14:30:00Z',
  },
  // Loan disbursements (sampled)
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `txn-disb-${String(i + 1).padStart(4, '0')}`,
    type: 'loan_disbursement',
    bankId: 'equity-africa',
    loanId: SEED_LOANS[i]?.id,
    amount: SEED_LOANS[i]?.amount || 10000,
    currency: 'KES',
    status: 'completed',
    reference: `MPESA-${Date.now()}-${i}`,
    createdAt: SEED_LOANS[i]?.disbursedAt || new Date().toISOString(),
  })),
  // Loan repayments (sampled)
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `txn-repay-${String(i + 1).padStart(4, '0')}`,
    type: 'loan_repayment',
    bankId: 'equity-africa',
    loanId: SEED_LOANS[i]?.id,
    amount: Math.round((SEED_LOANS[i]?.amount || 10000) * 0.3),
    currency: 'KES',
    status: 'completed',
    reference: `MPESA-R-${Date.now()}-${i}`,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  })),
];

// Metrics (Pre-aggregated for performance)
const SEED_METRICS = {
  platform: {
    totalCapitalDeployed: 13000000,
    totalInvestors: 2,
    totalBanks: 2,
    totalActiveLoans: 80,
    totalLoanVolume: 1850000,
    avgPlatformYield: 31.2,
    monthlyRevenue: 125000,
    monthlyGrowth: 18.5,
    capitalByMonth: [
      { month: 'Jun', capital: 5000000 },
      { month: 'Jul', capital: 6500000 },
      { month: 'Aug', capital: 8000000 },
      { month: 'Sep', capital: 9500000 },
      { month: 'Oct', capital: 11000000 },
      { month: 'Nov', capital: 13000000 },
    ],
    revenueByMonth: [
      { month: 'Jun', revenue: 45000 },
      { month: 'Jul', revenue: 62000 },
      { month: 'Aug', revenue: 78000 },
      { month: 'Sep', revenue: 95000 },
      { month: 'Oct', revenue: 112000 },
      { month: 'Nov', revenue: 125000 },
    ],
  },
  
  'equity-africa': {
    totalCapital: 5000000,
    capitalDeployed: 4750000,
    deploymentRate: 95,
    activeLoans: 50,
    totalLoanVolume: 1250000,
    loanBookValue: 980000,
    monthlyYield: 32.4,
    nplRate: 2.8,
    avgLoanSize: 25000,
    avgInterestRate: 17.5,
    disbursementsToday: 12,
    collectionsToday: 28,
    pendingApplications: 8,
    loanStatusDistribution: [
      { status: 'Current', count: 42, pct: 84 },
      { status: 'Overdue', count: 5, pct: 10 },
      { status: 'Defaulted', count: 3, pct: 6 },
    ],
    weeklyDisbursements: [
      { day: 'Mon', amount: 185000, count: 8 },
      { day: 'Tue', amount: 220000, count: 11 },
      { day: 'Wed', amount: 165000, count: 7 },
      { day: 'Thu', amount: 275000, count: 13 },
      { day: 'Fri', amount: 195000, count: 9 },
      { day: 'Sat', amount: 98000, count: 4 },
      { day: 'Sun', amount: 42000, count: 2 },
    ],
    weeklyCollections: [
      { day: 'Mon', amount: 145000, count: 18 },
      { day: 'Tue', amount: 178000, count: 22 },
      { day: 'Wed', amount: 156000, count: 19 },
      { day: 'Thu', amount: 192000, count: 24 },
      { day: 'Fri', amount: 168000, count: 21 },
      { day: 'Sat', amount: 89000, count: 11 },
      { day: 'Sun', amount: 52000, count: 6 },
    ],
    creditScoreDistribution: [
      { range: '500-550', count: 5, pct: 10 },
      { range: '551-600', count: 8, pct: 16 },
      { range: '601-650', count: 12, pct: 24 },
      { range: '651-700', count: 15, pct: 30 },
      { range: '701-750', count: 7, pct: 14 },
      { range: '751-800', count: 3, pct: 6 },
    ],
    complianceMetrics: {
      kycCompletionRate: 98.5,
      amlAlertsThisMonth: 3,
      amlAlertsClosed: 2,
      suspiciousTransactions: 1,
      regulatoryFilingsUpToDate: true,
    },
    riskMetrics: {
      portfolioAtRisk: 8.5,
      expectedLoss: 2.1,
      exposureConcentration: 12.3,
      largestExposure: 85000,
      vintagePerformance: [
        { cohort: 'Aug 2024', disbursed: 450000, currentNPL: 2.1 },
        { cohort: 'Sep 2024', disbursed: 520000, currentNPL: 2.8 },
        { cohort: 'Oct 2024', disbursed: 380000, currentNPL: 3.5 },
        { cohort: 'Nov 2024', disbursed: 290000, currentNPL: 1.2 },
      ],
    },
  },
  
  'dtb-africa': {
    totalCapital: 8000000,
    capitalDeployed: 7200000,
    deploymentRate: 90,
    activeLoans: 30,
    totalLoanVolume: 600000,
    loanBookValue: 520000,
    monthlyYield: 28.6,
    nplRate: 3.2,
    avgLoanSize: 20000,
    avgInterestRate: 16.0,
    disbursementsToday: 8,
    collectionsToday: 19,
    pendingApplications: 5,
    loanStatusDistribution: [
      { status: 'Current', count: 24, pct: 80 },
      { status: 'Overdue', count: 4, pct: 13 },
      { status: 'Defaulted', count: 2, pct: 7 },
    ],
    weeklyDisbursements: [
      { day: 'Mon', amount: 125000, count: 6 },
      { day: 'Tue', amount: 148000, count: 7 },
      { day: 'Wed', amount: 112000, count: 5 },
      { day: 'Thu', amount: 185000, count: 9 },
      { day: 'Fri', amount: 135000, count: 6 },
      { day: 'Sat', amount: 65000, count: 3 },
      { day: 'Sun', amount: 28000, count: 1 },
    ],
    weeklyCollections: [
      { day: 'Mon', amount: 98000, count: 12 },
      { day: 'Tue', amount: 115000, count: 14 },
      { day: 'Wed', amount: 102000, count: 13 },
      { day: 'Thu', amount: 128000, count: 16 },
      { day: 'Fri', amount: 108000, count: 13 },
      { day: 'Sat', amount: 58000, count: 7 },
      { day: 'Sun', amount: 32000, count: 4 },
    ],
    creditScoreDistribution: [
      { range: '500-550', count: 3, pct: 10 },
      { range: '551-600', count: 5, pct: 17 },
      { range: '601-650', count: 7, pct: 23 },
      { range: '651-700', count: 9, pct: 30 },
      { range: '701-750', count: 4, pct: 13 },
      { range: '751-800', count: 2, pct: 7 },
    ],
    complianceMetrics: {
      kycCompletionRate: 97.2,
      amlAlertsThisMonth: 2,
      amlAlertsClosed: 2,
      suspiciousTransactions: 0,
      regulatoryFilingsUpToDate: true,
    },
    riskMetrics: {
      portfolioAtRisk: 9.2,
      expectedLoss: 2.5,
      exposureConcentration: 15.1,
      largestExposure: 72000,
      vintagePerformance: [
        { cohort: 'Aug 2024', disbursed: 280000, currentNPL: 2.5 },
        { cohort: 'Sep 2024', disbursed: 320000, currentNPL: 3.1 },
        { cohort: 'Oct 2024', disbursed: 250000, currentNPL: 3.8 },
        { cohort: 'Nov 2024', disbursed: 180000, currentNPL: 1.5 },
      ],
    },
  },
  
  'impact-capital': {
    totalInvested: 5000000,
    activeInvestments: 1,
    portfolioValue: 5250000,
    totalReturns: 250000,
    avgYield: 12.5,
    portfolioGrowth: 5.0,
    pendingMaturity: 0,
    portfolioByBank: [
      { bank: 'Equity Africa Bank', amount: 5000000, yield: 12.5 },
    ],
    yieldHistory: [
      { month: 'Jun', yield: 0 },
      { month: 'Jul', yield: 0 },
      { month: 'Aug', yield: 11.2 },
      { month: 'Sep', yield: 11.8 },
      { month: 'Oct', yield: 12.1 },
      { month: 'Nov', yield: 12.5 },
    ],
    impactMetrics: {
      totalBorrowersReached: 847,
      totalM2Generated: 95000000,
      avgLoanRateReduction: 8.5,
      jobsSupported: 423,
    },
  },
  
  'shell-foundation': {
    totalInvested: 8000000,
    activeInvestments: 1,
    portfolioValue: 8460000,
    totalReturns: 460000,
    avgYield: 11.5,
    portfolioGrowth: 5.75,
    pendingMaturity: 0,
    portfolioByBank: [
      { bank: 'Diamond Trust Bank', amount: 8000000, yield: 11.5 },
    ],
    yieldHistory: [
      { month: 'Jun', yield: 10.2 },
      { month: 'Jul', yield: 10.6 },
      { month: 'Aug', yield: 10.9 },
      { month: 'Sep', yield: 11.1 },
      { month: 'Oct', yield: 11.3 },
      { month: 'Nov', yield: 11.5 },
    ],
    impactMetrics: {
      totalBorrowersReached: 1234,
      totalM2Generated: 152000000,
      avgLoanRateReduction: 7.2,
      jobsSupported: 617,
    },
  },
};

// ============================================
// DATABASE SERVICE CLASS
// ============================================

class DatabaseService {
  constructor() {
    // Initialize with seed data (in production, this would be empty and fetch from DynamoDB)
    this.data = {
      organizations: [...SEED_ORGANIZATIONS],
      capitalCalls: [...SEED_CAPITAL_CALLS],
      loans: [...SEED_LOANS],
      investments: [...SEED_INVESTMENTS],
      transactions: [...SEED_TRANSACTIONS],
      metrics: { ...SEED_METRICS },
    };
    
    // Listeners for real-time updates
    this.listeners = new Map();
  }
  
  // ==========================================
  // SUBSCRIPTION MANAGEMENT
  // ==========================================
  
  subscribe(collection, callback) {
    const id = generateId('sub');
    if (!this.listeners.has(collection)) {
      this.listeners.set(collection, new Map());
    }
    this.listeners.get(collection).set(id, callback);
    return () => this.listeners.get(collection)?.delete(id);
  }
  
  notify(collection, data) {
    this.listeners.get(collection)?.forEach(callback => callback(data));
  }
  
  // ==========================================
  // ORGANIZATIONS (TENANTS)
  // ==========================================
  
  async getOrganizations(filters = {}) {
    let orgs = [...this.data.organizations];
    
    if (filters.type) {
      orgs = orgs.filter(o => o.type === filters.type);
    }
    if (filters.status) {
      orgs = orgs.filter(o => o.status === filters.status);
    }
    
    return orgs;
  }
  
  async getOrganization(id) {
    return this.data.organizations.find(o => o.id === id) || null;
  }
  
  async createOrganization(orgData) {
    const org = {
      id: generateId('org'),
      ...orgData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.data.organizations.push(org);
    this.notify('organizations', { type: 'created', data: org });
    return org;
  }
  
  async updateOrganization(id, updates) {
    const index = this.data.organizations.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Organization not found');
    
    this.data.organizations[index] = {
      ...this.data.organizations[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    this.notify('organizations', { type: 'updated', data: this.data.organizations[index] });
    return this.data.organizations[index];
  }
  
  // ==========================================
  // CAPITAL CALLS
  // ==========================================
  
  async getCapitalCalls(filters = {}) {
    let calls = [...this.data.capitalCalls];
    
    if (filters.bankId) {
      calls = calls.filter(c => c.bankId === filters.bankId);
    }
    if (filters.status) {
      calls = calls.filter(c => c.status === filters.status);
    }
    if (filters.investorId) {
      calls = calls.filter(c => c.investorId === filters.investorId);
    }
    
    // Sort by creation date (newest first)
    calls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return calls;
  }
  
  async getCapitalCall(id) {
    return this.data.capitalCalls.find(c => c.id === id) || null;
  }
  
  async createCapitalCall(callData) {
    const call = {
      id: generateId('call'),
      txnRef: `TXN-${new Date().getFullYear()}-${String(this.data.capitalCalls.length + 1).padStart(5, '0')}`,
      ...callData,
      status: 'published',
      subscribed: 0,
      subscribedPercent: 0,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
    
    this.data.capitalCalls.push(call);
    this.notify('capitalCalls', { type: 'created', data: call });
    
    // Update metrics
    this.recalculateMetrics(call.bankId);
    
    return call;
  }
  
  async updateCapitalCall(id, updates) {
    const index = this.data.capitalCalls.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Capital call not found');
    
    this.data.capitalCalls[index] = {
      ...this.data.capitalCalls[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    this.notify('capitalCalls', { type: 'updated', data: this.data.capitalCalls[index] });
    return this.data.capitalCalls[index];
  }
  
  async acceptCapitalCall(callId, investorData) {
    const call = await this.getCapitalCall(callId);
    if (!call) throw new Error('Capital call not found');
    
    const updated = await this.updateCapitalCall(callId, {
      status: 'accepted',
      investorId: investorData.investorId,
      investorName: investorData.investorName,
      acceptedAt: new Date().toISOString(),
      subscribed: call.amount,
      subscribedPercent: 100,
    });
    
    // Create investment record
    await this.createInvestment({
      investorId: investorData.investorId,
      capitalCallId: callId,
      bankId: call.bankId,
      bankName: call.bankName,
      amount: call.amount,
      currency: call.currency,
      interestRate: call.interestRate,
      maturityMonths: call.maturityMonths,
    });
    
    return updated;
  }
  
  // ==========================================
  // LOANS
  // ==========================================
  
  async getLoans(filters = {}) {
    let loans = [...this.data.loans];
    
    if (filters.bankId) {
      loans = loans.filter(l => l.bankId === filters.bankId);
    }
    if (filters.status) {
      loans = loans.filter(l => l.status === filters.status);
    }
    if (filters.limit) {
      loans = loans.slice(0, filters.limit);
    }
    
    // Sort by disbursement date (newest first)
    loans.sort((a, b) => new Date(b.disbursedAt) - new Date(a.disbursedAt));
    
    return loans;
  }
  
  async getLoan(id) {
    return this.data.loans.find(l => l.id === id) || null;
  }
  
  async createLoan(loanData) {
    const loan = {
      id: generateId('loan'),
      ...loanData,
      status: 'disbursed',
      amountPaid: 0,
      disbursedAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + (loanData.term || 30) * 24 * 60 * 60 * 1000).toISOString(),
    };
    
    this.data.loans.push(loan);
    this.notify('loans', { type: 'created', data: loan });
    
    // Create transaction record
    await this.createTransaction({
      type: 'loan_disbursement',
      bankId: loan.bankId,
      loanId: loan.id,
      amount: loan.amount,
      currency: loan.currency,
    });
    
    // Update metrics
    this.recalculateMetrics(loan.bankId);
    
    return loan;
  }
  
  async updateLoan(id, updates) {
    const index = this.data.loans.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Loan not found');
    
    this.data.loans[index] = {
      ...this.data.loans[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    this.notify('loans', { type: 'updated', data: this.data.loans[index] });
    return this.data.loans[index];
  }
  
  async recordLoanPayment(loanId, amount) {
    const loan = await this.getLoan(loanId);
    if (!loan) throw new Error('Loan not found');
    
    const newAmountPaid = loan.amountPaid + amount;
    const totalOwed = loan.amount * (1 + loan.interestRate / 100);
    
    let newStatus = loan.status;
    if (newAmountPaid >= totalOwed) {
      newStatus = 'paid';
    } else if (new Date() > new Date(loan.dueDate)) {
      newStatus = 'overdue';
    } else {
      newStatus = 'current';
    }
    
    await this.updateLoan(loanId, {
      amountPaid: newAmountPaid,
      status: newStatus,
    });
    
    // Create transaction record
    await this.createTransaction({
      type: 'loan_repayment',
      bankId: loan.bankId,
      loanId: loan.id,
      amount: amount,
      currency: loan.currency,
    });
    
    // Update metrics
    this.recalculateMetrics(loan.bankId);
    
    return this.getLoan(loanId);
  }
  
  // ==========================================
  // INVESTMENTS
  // ==========================================
  
  async getInvestments(filters = {}) {
    let investments = [...this.data.investments];
    
    if (filters.investorId) {
      investments = investments.filter(i => i.investorId === filters.investorId);
    }
    if (filters.bankId) {
      investments = investments.filter(i => i.bankId === filters.bankId);
    }
    if (filters.status) {
      investments = investments.filter(i => i.status === filters.status);
    }
    
    return investments;
  }
  
  async getInvestment(id) {
    return this.data.investments.find(i => i.id === id) || null;
  }
  
  async createInvestment(investmentData) {
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + (investmentData.maturityMonths || 12));
    
    const investment = {
      id: generateId('inv'),
      ...investmentData,
      status: 'active',
      investedAt: new Date().toISOString(),
      maturityDate: maturityDate.toISOString(),
      expectedReturn: investmentData.amount * (1 + investmentData.interestRate / 100),
      currentValue: investmentData.amount,
      accruedInterest: 0,
      loansDeployed: 0,
      nplRate: 0,
      impactMetrics: {
        borrowersReached: 0,
        avgLoanSize: 0,
        m2Generated: 0,
        jobsSupported: 0,
      },
    };
    
    this.data.investments.push(investment);
    this.notify('investments', { type: 'created', data: investment });
    
    // Update investor metrics
    this.recalculateMetrics(investment.investorId);
    
    return investment;
  }
  
  // ==========================================
  // TRANSACTIONS
  // ==========================================
  
  async getTransactions(filters = {}) {
    let transactions = [...this.data.transactions];
    
    if (filters.bankId) {
      transactions = transactions.filter(t => t.bankId === filters.bankId);
    }
    if (filters.investorId) {
      transactions = transactions.filter(t => t.investorId === filters.investorId);
    }
    if (filters.type) {
      transactions = transactions.filter(t => t.type === filters.type);
    }
    if (filters.limit) {
      transactions = transactions.slice(0, filters.limit);
    }
    
    // Sort by creation date (newest first)
    transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return transactions;
  }
  
  async createTransaction(txnData) {
    const transaction = {
      id: generateId('txn'),
      ...txnData,
      status: 'completed',
      reference: txnData.reference || `REF-${Date.now()}`,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
    
    this.data.transactions.push(transaction);
    this.notify('transactions', { type: 'created', data: transaction });
    
    return transaction;
  }
  
  // ==========================================
  // METRICS
  // ==========================================
  
  async getMetrics(orgId = 'platform') {
    return this.data.metrics[orgId] || this.data.metrics.platform;
  }
  
  async getPlatformMetrics() {
    return this.data.metrics.platform;
  }
  
  async getBankMetrics(bankId) {
    return this.data.metrics[bankId] || null;
  }
  
  async getInvestorMetrics(investorId) {
    return this.data.metrics[investorId] || null;
  }
  
  recalculateMetrics(orgId) {
    // In a real implementation, this would recalculate metrics from raw data
    // For now, we rely on the seeded metrics
    console.log(`Metrics recalculation triggered for: ${orgId}`);
  }
  
  // ==========================================
  // AUDIT LOGS
  // ==========================================
  
  async createAuditLog(logData) {
    const log = {
      id: generateId('log'),
      ...logData,
      createdAt: new Date().toISOString(),
    };
    
    // In production, this would write to DynamoDB
    console.log('Audit Log:', log);
    
    return log;
  }
  
  // ==========================================
  // UTILITY METHODS
  // ==========================================
  
  async getPublishedOpportunities() {
    const calls = await this.getCapitalCalls({ status: 'published' });
    return calls.map(call => ({
      ...call,
      bank: this.data.organizations.find(o => o.id === call.bankId),
    }));
  }
  
  async getDashboardData(role, tenantId) {
    switch (role) {
      case ROLES.FORWARDSFLOW_ADMIN:
        return {
          metrics: await this.getPlatformMetrics(),
          banks: await this.getOrganizations({ type: TENANT_TYPES.BANK }),
          investors: await this.getOrganizations({ type: TENANT_TYPES.INVESTOR }),
          capitalCalls: await this.getCapitalCalls({ limit: 10 }),
          transactions: await this.getTransactions({ limit: 20 }),
        };
        
      case ROLES.BANK_ADMIN:
      case ROLES.BANK_LENDER:
      case ROLES.BANK_CALLER:
      case ROLES.BANK_COMPLIANCE:
      case ROLES.BANK_RISK:
        return {
          metrics: await this.getBankMetrics(tenantId),
          capitalCalls: await this.getCapitalCalls({ bankId: tenantId }),
          loans: await this.getLoans({ bankId: tenantId, limit: 50 }),
          transactions: await this.getTransactions({ bankId: tenantId, limit: 50 }),
        };
        
      case ROLES.INVESTOR_ADMIN:
      case ROLES.INVESTOR_ANALYST:
        return {
          metrics: await this.getInvestorMetrics(tenantId),
          investments: await this.getInvestments({ investorId: tenantId }),
          opportunities: await this.getPublishedOpportunities(),
        };
        
      default:
        return {};
    }
  }
}

// Export singleton instance
export const db = new DatabaseService();

export default db;
