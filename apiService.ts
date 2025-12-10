// apiService.ts - Database API Service for ForwardsFlow
// Place in: src/services/apiService.ts

import { v4 as uuidv4 } from 'uuid';

// ============================================
// CONFIGURATION
// ============================================

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.forwardsflow.com';
const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK === 'true' || true; // Default to mock for demo

// ============================================
// TYPES
// ============================================

export interface Tenant {
  tenantId: string;
  type: 'bank' | 'investor';
  name: string;
  legalName: string;
  country: string;
  status: 'active' | 'suspended' | 'pending';
  email: string;
  totalDeposits?: number;
  totalInvested?: number;
  revenueToDate?: number;
  createdAt: string;
}

export interface DepositCall {
  callId: string;
  bankId: string;
  bankName: string;
  instrumentType: string;
  currencyPair: string;
  principalAmount: number;
  interestRate: number;
  fxRate: number;
  forwardsPremium: number;
  totalYield: number;
  maturityDays: number;
  maturityDate: string;
  status: string;
  totalSubscribed: number;
  subscriptionPercentage: number;
  deployedToLoans: number;
  createdAt: string;
}

export interface LoanApplication {
  applicationId: string;
  bankId: string;
  borrowerId: string;
  phoneNumber: string;
  borrowerName: string;
  amountRequested: number;
  durationDays: number;
  creditScore: number;
  riskRating: string;
  kycStatus: string;
  status: string;
  createdAt: string;
}

export interface Loan {
  loanId: string;
  bankId: string;
  borrowerId: string;
  phoneNumber: string;
  borrowerName: string;
  principalAmount: number;
  interestRate: number;
  apr: number;
  totalRepayable: number;
  totalPaid: number;
  outstandingBalance: number;
  status: string;
  daysOverdue: number;
  disbursementDate: string;
  maturityDate: string;
  createdAt: string;
}

export interface PlatformMetrics {
  totalBanks: number;
  activeBanks: number;
  totalInvestors: number;
  activeInvestors: number;
  totalDepositsRaised: number;
  totalLoansOriginated: number;
  totalLoansDisbursed: number;
  platformRevenue: number;
  averageYield: number;
  defaultRate: number;
}

export interface BankMetrics {
  activeDeposits: number;
  totalDepositValue: number;
  activeLoanCount: number;
  loanBookValue: number;
  disbursementsToday: number;
  repaymentsToday: number;
  defaultRate: number;
  portfolioYield: number;
  pendingApplications: number;
  revenue: number;
}

export interface InvestorMetrics {
  activeInvestments: number;
  totalInvested: number;
  pendingSettlements: number;
  realizedReturns: number;
  unrealizedReturns: number;
  availableCalls: number;
  portfolioYield: number;
}

export interface AMLAlert {
  alertId: string;
  tenantId: string;
  alertType: string;
  severity: string;
  referenceType: string;
  referenceId: string;
  description: string;
  amount?: number;
  status: string;
  createdAt: string;
}

// ============================================
// MOCK DATA STORE (In-memory for demo)
// ============================================

class MockDataStore {
  private tenants: Map<string, Tenant> = new Map();
  private depositCalls: Map<string, DepositCall> = new Map();
  private loanApplications: Map<string, LoanApplication> = new Map();
  private loans: Map<string, Loan> = new Map();
  private amlAlerts: Map<string, AMLAlert> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize Tenants
    const tenants: Tenant[] = [
      {
        tenantId: 'equity-africa',
        type: 'bank',
        name: 'Equity Bank Africa',
        legalName: 'Equity Bank Limited',
        country: 'Kenya',
        status: 'active',
        email: 'admin@equityafrica.com',
        totalDeposits: 125000000,
        revenueToDate: 2450000,
        createdAt: '2024-01-15T00:00:00Z'
      },
      {
        tenantId: 'dtb-kenya',
        type: 'bank',
        name: 'DTB Kenya',
        legalName: 'Diamond Trust Bank Kenya Limited',
        country: 'Kenya',
        status: 'active',
        email: 'admin@dtbkenya.com',
        totalDeposits: 85000000,
        revenueToDate: 1650000,
        createdAt: '2024-02-20T00:00:00Z'
      },
      {
        tenantId: 'impact-capital',
        type: 'investor',
        name: 'Impact Capital Partners',
        legalName: 'Impact Capital Partners LLC',
        country: 'United States',
        status: 'active',
        email: 'admin@impactcapital.com',
        totalInvested: 75000000,
        revenueToDate: 0,
        createdAt: '2024-01-10T00:00:00Z'
      },
      {
        tenantId: 'shell-foundation',
        type: 'investor',
        name: 'Shell Foundation',
        legalName: 'Shell Foundation',
        country: 'United Kingdom',
        status: 'active',
        email: 'admin@shellfoundation.org',
        totalInvested: 50000000,
        revenueToDate: 0,
        createdAt: '2024-03-05T00:00:00Z'
      }
    ];
    tenants.forEach(t => this.tenants.set(t.tenantId, t));

    // Initialize Deposit Calls
    const calls: DepositCall[] = [
      {
        callId: 'CALL-001',
        bankId: 'equity-africa',
        bankName: 'Equity Bank Africa',
        instrumentType: 'fixed_deposit',
        currencyPair: 'KES:JPY',
        principalAmount: 500000000, // 500M JPY
        interestRate: 8.5,
        fxRate: 0.92,
        forwardsPremium: 1.2,
        totalYield: 9.7,
        maturityDays: 365,
        maturityDate: '2025-12-15',
        status: 'open',
        totalSubscribed: 350000000,
        subscriptionPercentage: 70,
        deployedToLoans: 280000000,
        createdAt: '2024-12-01T10:00:00Z'
      },
      {
        callId: 'CALL-002',
        bankId: 'equity-africa',
        bankName: 'Equity Bank Africa',
        instrumentType: 'certificate_of_deposit',
        currencyPair: 'KES:CHF',
        principalAmount: 200000000,
        interestRate: 7.8,
        fxRate: 1.05,
        forwardsPremium: 0.9,
        totalYield: 8.7,
        maturityDays: 180,
        maturityDate: '2025-06-15',
        status: 'fully_subscribed',
        totalSubscribed: 200000000,
        subscriptionPercentage: 100,
        deployedToLoans: 180000000,
        createdAt: '2024-11-15T14:30:00Z'
      },
      {
        callId: 'CALL-003',
        bankId: 'dtb-kenya',
        bankName: 'DTB Kenya',
        instrumentType: 'time_deposit',
        currencyPair: 'KES:JPY',
        principalAmount: 300000000,
        interestRate: 9.0,
        fxRate: 0.91,
        forwardsPremium: 1.5,
        totalYield: 10.5,
        maturityDays: 270,
        maturityDate: '2025-09-01',
        status: 'open',
        totalSubscribed: 150000000,
        subscriptionPercentage: 50,
        deployedToLoans: 100000000,
        createdAt: '2024-12-05T09:15:00Z'
      }
    ];
    calls.forEach(c => this.depositCalls.set(c.callId, c));

    // Initialize Loan Applications
    const applications: LoanApplication[] = [
      {
        applicationId: 'APP-001',
        bankId: 'equity-africa',
        borrowerId: 'BOR-001',
        phoneNumber: '+254712345678',
        borrowerName: 'John Kamau',
        amountRequested: 50000,
        durationDays: 30,
        creditScore: 720,
        riskRating: 'low',
        kycStatus: 'verified',
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        applicationId: 'APP-002',
        bankId: 'equity-africa',
        borrowerId: 'BOR-002',
        phoneNumber: '+254723456789',
        borrowerName: 'Mary Wanjiku',
        amountRequested: 25000,
        durationDays: 14,
        creditScore: 680,
        riskRating: 'medium',
        kycStatus: 'verified',
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        applicationId: 'APP-003',
        bankId: 'equity-africa',
        borrowerId: 'BOR-003',
        phoneNumber: '+254734567890',
        borrowerName: 'Peter Ochieng',
        amountRequested: 100000,
        durationDays: 60,
        creditScore: 580,
        riskRating: 'high',
        kycStatus: 'pending',
        status: 'pending',
        createdAt: new Date(Date.now() - 7200000).toISOString()
      }
    ];
    applications.forEach(a => this.loanApplications.set(a.applicationId, a));

    // Initialize Active Loans
    const activeLoans: Loan[] = [
      {
        loanId: 'LOAN-001',
        bankId: 'equity-africa',
        borrowerId: 'BOR-010',
        phoneNumber: '+254745678901',
        borrowerName: 'Grace Muthoni',
        principalAmount: 75000,
        interestRate: 36,
        apr: 365,
        totalRepayable: 82500,
        totalPaid: 45000,
        outstandingBalance: 37500,
        status: 'current',
        daysOverdue: 0,
        disbursementDate: '2024-11-15',
        maturityDate: '2024-12-15',
        createdAt: '2024-11-15T00:00:00Z'
      },
      {
        loanId: 'LOAN-002',
        bankId: 'equity-africa',
        borrowerId: 'BOR-011',
        phoneNumber: '+254756789012',
        borrowerName: 'David Kiprop',
        principalAmount: 150000,
        interestRate: 30,
        apr: 300,
        totalRepayable: 165000,
        totalPaid: 0,
        outstandingBalance: 165000,
        status: 'overdue',
        daysOverdue: 5,
        disbursementDate: '2024-11-01',
        maturityDate: '2024-12-01',
        createdAt: '2024-11-01T00:00:00Z'
      },
      {
        loanId: 'LOAN-003',
        bankId: 'equity-africa',
        borrowerId: 'BOR-012',
        phoneNumber: '+254767890123',
        borrowerName: 'Faith Akinyi',
        principalAmount: 30000,
        interestRate: 42,
        apr: 420,
        totalRepayable: 34200,
        totalPaid: 34200,
        outstandingBalance: 0,
        status: 'paid_off',
        daysOverdue: 0,
        disbursementDate: '2024-10-01',
        maturityDate: '2024-10-31',
        createdAt: '2024-10-01T00:00:00Z'
      }
    ];
    activeLoans.forEach(l => this.loans.set(l.loanId, l));

    // Initialize AML Alerts
    const alerts: AMLAlert[] = [
      {
        alertId: 'AML-001',
        tenantId: 'equity-africa',
        alertType: 'high_volume',
        severity: 'medium',
        referenceType: 'borrower',
        referenceId: 'BOR-050',
        description: 'Multiple loan applications in 24 hours',
        amount: 500000,
        status: 'open',
        createdAt: new Date().toISOString()
      },
      {
        alertId: 'AML-002',
        tenantId: 'equity-africa',
        alertType: 'suspicious_transaction',
        severity: 'high',
        referenceType: 'loan',
        referenceId: 'LOAN-099',
        description: 'Immediate full repayment after disbursement',
        amount: 250000,
        status: 'investigating',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    alerts.forEach(a => this.amlAlerts.set(a.alertId, a));
  }

  // Tenant operations
  getTenants(type?: 'bank' | 'investor'): Tenant[] {
    const all = Array.from(this.tenants.values());
    return type ? all.filter(t => t.type === type) : all;
  }

  getTenant(tenantId: string): Tenant | undefined {
    return this.tenants.get(tenantId);
  }

  createTenant(tenant: Omit<Tenant, 'tenantId' | 'createdAt'>): Tenant {
    const newTenant: Tenant = {
      ...tenant,
      tenantId: uuidv4(),
      createdAt: new Date().toISOString()
    };
    this.tenants.set(newTenant.tenantId, newTenant);
    return newTenant;
  }

  updateTenant(tenantId: string, updates: Partial<Tenant>): Tenant | undefined {
    const tenant = this.tenants.get(tenantId);
    if (tenant) {
      const updated = { ...tenant, ...updates };
      this.tenants.set(tenantId, updated);
      return updated;
    }
    return undefined;
  }

  // Deposit Call operations
  getDepositCalls(bankId?: string, status?: string): DepositCall[] {
    let calls = Array.from(this.depositCalls.values());
    if (bankId) calls = calls.filter(c => c.bankId === bankId);
    if (status) calls = calls.filter(c => c.status === status);
    return calls;
  }

  getAvailableCalls(): DepositCall[] {
    return Array.from(this.depositCalls.values())
      .filter(c => c.status === 'open' || c.status === 'partially_subscribed');
  }

  createDepositCall(call: Omit<DepositCall, 'callId' | 'createdAt'>): DepositCall {
    const newCall: DepositCall = {
      ...call,
      callId: `CALL-${String(this.depositCalls.size + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString()
    };
    this.depositCalls.set(newCall.callId, newCall);
    return newCall;
  }

  // Loan Application operations
  getLoanApplications(bankId: string, status?: string): LoanApplication[] {
    let apps = Array.from(this.loanApplications.values())
      .filter(a => a.bankId === bankId);
    if (status) apps = apps.filter(a => a.status === status);
    return apps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  updateApplicationStatus(applicationId: string, status: string): LoanApplication | undefined {
    const app = this.loanApplications.get(applicationId);
    if (app) {
      app.status = status;
      this.loanApplications.set(applicationId, app);
      return app;
    }
    return undefined;
  }

  // Loan operations
  getLoans(bankId: string, status?: string): Loan[] {
    let loans = Array.from(this.loans.values())
      .filter(l => l.bankId === bankId);
    if (status) loans = loans.filter(l => l.status === status);
    return loans;
  }

  // AML operations
  getAMLAlerts(tenantId: string, status?: string): AMLAlert[] {
    let alerts = Array.from(this.amlAlerts.values())
      .filter(a => a.tenantId === tenantId);
    if (status) alerts = alerts.filter(a => a.status === status);
    return alerts;
  }

  // Metrics
  getPlatformMetrics(): PlatformMetrics {
    const banks = this.getTenants('bank');
    const investors = this.getTenants('investor');
    const loans = Array.from(this.loans.values());
    const calls = Array.from(this.depositCalls.values());

    return {
      totalBanks: banks.length,
      activeBanks: banks.filter(b => b.status === 'active').length,
      totalInvestors: investors.length,
      activeInvestors: investors.filter(i => i.status === 'active').length,
      totalDepositsRaised: calls.reduce((sum, c) => sum + c.totalSubscribed, 0),
      totalLoansOriginated: loans.length,
      totalLoansDisbursed: loans.reduce((sum, l) => sum + l.principalAmount, 0),
      platformRevenue: banks.reduce((sum, b) => sum + (b.revenueToDate || 0), 0),
      averageYield: calls.length > 0 ? calls.reduce((sum, c) => sum + c.totalYield, 0) / calls.length : 0,
      defaultRate: loans.length > 0 
        ? (loans.filter(l => l.status === 'defaulted').length / loans.length) * 100 
        : 0
    };
  }

  getBankMetrics(bankId: string): BankMetrics {
    const calls = this.getDepositCalls(bankId);
    const loans = this.getLoans(bankId);
    const applications = this.getLoanApplications(bankId);
    const tenant = this.getTenant(bankId);

    const activeLoans = loans.filter(l => ['disbursed', 'current', 'overdue'].includes(l.status));
    const defaultedLoans = loans.filter(l => l.status === 'defaulted');

    return {
      activeDeposits: calls.filter(c => c.status !== 'settled' && c.status !== 'closed').length,
      totalDepositValue: calls.reduce((sum, c) => sum + c.totalSubscribed, 0),
      activeLoanCount: activeLoans.length,
      loanBookValue: activeLoans.reduce((sum, l) => sum + l.outstandingBalance, 0),
      disbursementsToday: 2450000, // Mock
      repaymentsToday: 1850000, // Mock
      defaultRate: loans.length > 0 ? (defaultedLoans.length / loans.length) * 100 : 0,
      portfolioYield: 42.5, // Mock average
      pendingApplications: applications.filter(a => a.status === 'pending').length,
      revenue: tenant?.revenueToDate || 0
    };
  }

  getInvestorMetrics(investorId: string): InvestorMetrics {
    const tenant = this.getTenant(investorId);
    const availableCalls = this.getAvailableCalls();

    return {
      activeInvestments: 5,
      totalInvested: tenant?.totalInvested || 0,
      pendingSettlements: 2,
      realizedReturns: 3250000,
      unrealizedReturns: 1450000,
      availableCalls: availableCalls.length,
      portfolioYield: 9.2
    };
  }
}

// Singleton instance
const mockStore = new MockDataStore();

// ============================================
// API SERVICE CLASS
// ============================================

class APIService {
  private baseUrl: string;
  private useMock: boolean;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.useMock = USE_MOCK_DATA;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    if (this.useMock) {
      throw new Error('Use mock methods directly');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  // ==========================================
  // TENANT OPERATIONS
  // ==========================================

  async getTenants(type?: 'bank' | 'investor'): Promise<Tenant[]> {
    if (this.useMock) return mockStore.getTenants(type);
    return this.fetch(`/tenants${type ? `?type=${type}` : ''}`);
  }

  async getTenant(tenantId: string): Promise<Tenant | undefined> {
    if (this.useMock) return mockStore.getTenant(tenantId);
    return this.fetch(`/tenants/${tenantId}`);
  }

  async createTenant(tenant: Omit<Tenant, 'tenantId' | 'createdAt'>): Promise<Tenant> {
    if (this.useMock) return mockStore.createTenant(tenant);
    return this.fetch('/tenants', {
      method: 'POST',
      body: JSON.stringify(tenant)
    });
  }

  async updateTenant(tenantId: string, updates: Partial<Tenant>): Promise<Tenant | undefined> {
    if (this.useMock) return mockStore.updateTenant(tenantId, updates);
    return this.fetch(`/tenants/${tenantId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  // ==========================================
  // DEPOSIT CALL OPERATIONS
  // ==========================================

  async getDepositCalls(bankId?: string, status?: string): Promise<DepositCall[]> {
    if (this.useMock) return mockStore.getDepositCalls(bankId, status);
    const params = new URLSearchParams();
    if (bankId) params.append('bankId', bankId);
    if (status) params.append('status', status);
    return this.fetch(`/calls?${params}`);
  }

  async getAvailableCalls(): Promise<DepositCall[]> {
    if (this.useMock) return mockStore.getAvailableCalls();
    return this.fetch('/calls?available=true');
  }

  async createDepositCall(call: Omit<DepositCall, 'callId' | 'createdAt'>): Promise<DepositCall> {
    if (this.useMock) return mockStore.createDepositCall(call);
    return this.fetch('/calls', {
      method: 'POST',
      body: JSON.stringify(call)
    });
  }

  // ==========================================
  // LOAN OPERATIONS
  // ==========================================

  async getLoanApplications(bankId: string, status?: string): Promise<LoanApplication[]> {
    if (this.useMock) return mockStore.getLoanApplications(bankId, status);
    const params = new URLSearchParams({ bankId });
    if (status) params.append('status', status);
    return this.fetch(`/applications?${params}`);
  }

  async updateApplicationStatus(applicationId: string, status: string): Promise<LoanApplication | undefined> {
    if (this.useMock) return mockStore.updateApplicationStatus(applicationId, status);
    return this.fetch(`/applications/${applicationId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async getLoans(bankId: string, status?: string): Promise<Loan[]> {
    if (this.useMock) return mockStore.getLoans(bankId, status);
    const params = new URLSearchParams({ bankId });
    if (status) params.append('status', status);
    return this.fetch(`/loans?${params}`);
  }

  // ==========================================
  // COMPLIANCE OPERATIONS
  // ==========================================

  async getAMLAlerts(tenantId: string, status?: string): Promise<AMLAlert[]> {
    if (this.useMock) return mockStore.getAMLAlerts(tenantId, status);
    const params = new URLSearchParams({ tenantId });
    if (status) params.append('status', status);
    return this.fetch(`/compliance/aml?${params}`);
  }

  // ==========================================
  // METRICS OPERATIONS
  // ==========================================

  async getPlatformMetrics(): Promise<PlatformMetrics> {
    if (this.useMock) return mockStore.getPlatformMetrics();
    return this.fetch('/metrics/platform');
  }

  async getBankMetrics(bankId: string): Promise<BankMetrics> {
    if (this.useMock) return mockStore.getBankMetrics(bankId);
    return this.fetch(`/metrics/bank/${bankId}`);
  }

  async getInvestorMetrics(investorId: string): Promise<InvestorMetrics> {
    if (this.useMock) return mockStore.getInvestorMetrics(investorId);
    return this.fetch(`/metrics/investor/${investorId}`);
  }
}

// Export singleton instance
export const apiService = new APIService();
export default apiService;
