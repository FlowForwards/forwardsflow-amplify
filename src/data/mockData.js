// Mock data for ForwardsFlow Demo Application

// Institution Types
export const investorTypes = [
  { value: 'asset_manager', label: 'Asset Manager' },
  { value: 'broker_dealer', label: 'Broker-Dealer' },
  { value: 'endowment_fund', label: 'Endowment Fund' },
  { value: 'family_office', label: 'Family Office' },
  { value: 'hedge_fund', label: 'Hedge Fund' },
  { value: 'impact_fund', label: 'Impact Fund' },
  { value: 'investment_bank', label: 'Investment Bank' },
  { value: 'mfi_bank', label: 'Microfinance Bank (MFI)' },
  { value: 'money_market_fund', label: 'Money Market Fund' },
  { value: 'pension_fund', label: 'Pension Fund' },
  { value: 'private_equity', label: 'Private Equity Fund' },
  { value: 'private_lending', label: 'Private Lending Fund' },
  { value: 'swf', label: 'Sovereign Wealth Fund (SWF)' },
  { value: 'unit_trust', label: 'Unit Trust / Mutual Fund' },
  { value: 'venture_capital', label: 'Venture Capital Fund' },
  { value: 'other', label: 'Other (please specify)' },
];

export const lendingInstitutionTypes = [
  { value: 'asset_finance', label: 'Asset Finance Company' },
  { value: 'commercial_bank', label: 'Commercial Bank' },
  { value: 'credit_union', label: 'Credit Union' },
  { value: 'dfi', label: 'Development Finance Institution (DFI)' },
  { value: 'digital_neobank', label: 'Digital / Neobank' },
  { value: 'exim_bank', label: 'Export-Import Bank (EXIM Bank)' },
  { value: 'housing_finance', label: 'Housing Finance Company / Mortgage Bank' },
  { value: 'industrial_bank', label: 'Industrial Bank (specialized lending)' },
  { value: 'investment_bank', label: 'Investment Bank' },
  { value: 'islamic_bank', label: 'Islamic Bank' },
  { value: 'leasing_company', label: 'Leasing Company' },
  { value: 'merchant_bank', label: 'Merchant Bank' },
  { value: 'microfinance_bank', label: 'Microfinance Bank' },
  { value: 'mfi', label: 'Microfinance Institution (MFI)' },
  { value: 'sacco', label: 'Savings & Credit Cooperative Organization (SACCO)' },
  { value: 'shariah_compliant', label: 'Shariah-Compliant Lending Institution' },
  { value: 'other', label: 'Other (please specify)' },
];

export const moodysRatings = [
  { value: 'Aaa', label: 'Aaa - Prime' },
  { value: 'Aa1', label: 'Aa1 - High Grade' },
  { value: 'Aa2', label: 'Aa2 - High Grade' },
  { value: 'Aa3', label: 'Aa3 - High Grade' },
  { value: 'A1', label: 'A1 - Upper Medium Grade' },
  { value: 'A2', label: 'A2 - Upper Medium Grade' },
  { value: 'A3', label: 'A3 - Upper Medium Grade' },
  { value: 'Baa1', label: 'Baa1 - Lower Medium Grade' },
  { value: 'Baa2', label: 'Baa2 - Lower Medium Grade' },
  { value: 'Baa3', label: 'Baa3 - Lower Medium Grade' },
];

export const investmentTerms = [
  { value: '3m', label: '3 Months' },
  { value: '6m', label: '6 Months' },
  { value: '12m', label: '12 Months' },
  { value: '18m', label: '18 Months' },
  { value: '24m', label: '24 Months' },
  { value: '36m', label: '36 Months' },
];

export const currencies = [
  { value: 'USD', label: 'US Dollar (USD)' },
  { value: 'JPY', label: 'Japanese Yen (JPY)' },
  { value: 'CHF', label: 'Swiss Franc (CHF)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'GBP', label: 'British Pound (GBP)' },
];

export const countries = [
  { value: 'KE', label: 'Kenya' },
  { value: 'UG', label: 'Uganda' },
  { value: 'TZ', label: 'Tanzania' },
  { value: 'RW', label: 'Rwanda' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'GH', label: 'Ghana' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'JP', label: 'Japan' },
  { value: 'CH', label: 'Switzerland' },
];

// Demo Users
export const demoUsers = {
  superAdmin: {
    id: 'sa-001',
    email: 'admin@forwardsflow.com',
    password: 'admin123',
    name: 'System Administrator',
    role: 'super_admin',
    createdAt: '2024-01-15T10:00:00Z',
    lastLogin: new Date().toISOString(),
  },
  investorAdmin: {
    id: 'ia-001',
    email: 'admin@impactcapital.com',
    password: 'demo123',
    name: 'Sarah Chen',
    role: 'tenant_admin',
    tenantType: 'investor',
    tenantId: 'inv-001',
    tenantName: 'Impact Capital Partners',
    jobRole: 'Managing Director',
    createdAt: '2024-03-20T14:00:00Z',
  },
  bankAdmin: {
    id: 'ba-001',
    email: 'admin@equityafrica.com',
    password: 'demo123',
    name: 'Amoroso Gombe',
    role: 'tenant_admin',
    tenantType: 'bank',
    tenantId: 'bank-001',
    tenantName: 'Equity Africa Bank',
    jobRole: 'Treasury Director',
    createdAt: '2024-02-10T09:00:00Z',
  },
  investorUser: {
    id: 'iu-001',
    email: 'analyst@impactcapital.com',
    password: 'demo123',
    name: 'Michael Torres',
    role: 'tenant_user',
    tenantType: 'investor',
    tenantId: 'inv-001',
    tenantName: 'Impact Capital Partners',
    jobRole: 'Investment Analyst',
    createdAt: '2024-05-15T11:00:00Z',
  },
  bankUser: {
    id: 'bu-001',
    email: 'lending@equityafrica.com',
    password: 'demo123',
    name: 'Grace Mwangi',
    role: 'tenant_user',
    tenantType: 'bank',
    tenantId: 'bank-001',
    tenantName: 'Equity Africa Bank',
    jobRole: 'Mobile Lending Manager',
    createdAt: '2024-04-01T08:30:00Z',
  },
};

// Demo Tenants
export const demoTenants = {
  investors: [
    {
      id: 'inv-001',
      name: 'Impact Capital Partners',
      type: 'impact_fund',
      email: 'contact@impactcapital.com',
      country: 'US',
      status: 'active',
      totalInvested: 5200000,
      activeInstruments: 8,
      avgYield: 12.5,
      adminCount: 2,
      userCount: 5,
    },
    {
      id: 'inv-002',
      name: 'Nordic Sustainable Fund',
      type: 'pension_fund',
      email: 'info@nordicsustainable.com',
      country: 'SE',
      status: 'active',
      totalInvested: 8500000,
      activeInstruments: 12,
      avgYield: 11.8,
      adminCount: 1,
      userCount: 3,
    },
  ],
  banks: [
    {
      id: 'bank-001',
      name: 'Equity Africa Bank',
      type: 'commercial_bank',
      email: 'corporate@equityafrica.com',
      country: 'KE',
      status: 'active',
      totalCapital: 2500000,
      activeLoans: 847,
      loanVolume: 15420000,
      monthlyYield: 32.4,
      adminCount: 2,
      userCount: 12,
    },
    {
      id: 'bank-002',
      name: 'Kilimanjaro Microfinance',
      type: 'microfinance_bank',
      email: 'info@kilimicrofinance.co.tz',
      country: 'TZ',
      status: 'active',
      totalCapital: 1800000,
      activeLoans: 1234,
      loanVolume: 8900000,
      monthlyYield: 28.6,
      adminCount: 1,
      userCount: 8,
    },
  ],
};

// Demo Instruments
export const demoInstruments = [
  {
    id: 'inst-001',
    bankId: 'bank-001',
    bankName: 'Frontier Bank Tanzania',
    type: 'Mobile Lending Capital',
    currencyPair: 'TZS:JPY',
    principal: 50000000,
    currency: 'JPY',
    interestRate: 12.5,
    forwardsRate: 2.3,
    maturityDate: '2025-06-15',
    status: 'open',
    subscribed: 35000000,
    subscribedPct: 70,
    projectedYield: 28.5,
  },
  {
    id: 'inst-002',
    bankId: 'bank-002',
    bankName: 'Nigeria Mobile Finance',
    type: 'High Yield Deposit',
    currencyPair: 'NGN:JPY',
    principal: 30000000,
    currency: 'JPY',
    interestRate: 13.2,
    forwardsRate: 2.1,
    maturityDate: '2026-01-30',
    status: 'open',
    subscribed: 18000000,
    subscribedPct: 60,
    projectedYield: 32.1,
  },
  {
    id: 'inst-003',
    bankId: 'bank-001',
    bankName: 'Equity Africa Bank',
    type: 'Fixed Deposit',
    currencyPair: 'KES:JPY',
    principal: 75000000,
    currency: 'JPY',
    interestRate: 11.8,
    forwardsRate: 1.9,
    maturityDate: '2025-09-01',
    status: 'fully_subscribed',
    subscribed: 75000000,
    subscribedPct: 100,
    projectedYield: 13.7,
  },
];

// Demo Loans
export const demoLoans = [
  {
    id: 'loan-001',
    bankId: 'bank-001',
    borrowerPhone: '+254712345678',
    borrowerName: 'John Kamau',
    amount: 15000,
    currency: 'KES',
    interestRate: 18,
    term: 30,
    status: 'current',
    disbursedAt: '2024-11-01T00:00:00Z',
    dueDate: '2024-12-01',
    amountPaid: 8500,
    creditScore: 720,
  },
  {
    id: 'loan-002',
    bankId: 'bank-001',
    borrowerPhone: '+254723456789',
    borrowerName: 'Mary Wanjiku',
    amount: 25000,
    currency: 'KES',
    interestRate: 16,
    term: 60,
    status: 'current',
    disbursedAt: '2024-10-15T00:00:00Z',
    dueDate: '2024-12-15',
    amountPaid: 12000,
    creditScore: 780,
  },
  {
    id: 'loan-003',
    bankId: 'bank-001',
    borrowerPhone: '+254734567890',
    borrowerName: 'Peter Ochieng',
    amount: 8000,
    currency: 'KES',
    interestRate: 20,
    term: 14,
    status: 'overdue',
    disbursedAt: '2024-11-10T00:00:00Z',
    dueDate: '2024-11-24',
    amountPaid: 2000,
    creditScore: 580,
    daysOverdue: 6,
  },
];

// Platform Analytics
export const platformAnalytics = {
  totalCapitalDeployed: 16950000,
  totalInvestors: 4,
  totalBanks: 4,
  totalActiveLoans: 4237,
  totalLoanVolume: 30020000,
  avgPlatformYield: 31.2,
  monthlyRevenue: 125000,
  monthlyGrowth: 18.5,
  
  capitalByMonth: [
    { month: 'Jun', capital: 8500000 },
    { month: 'Jul', capital: 9200000 },
    { month: 'Aug', capital: 10800000 },
    { month: 'Sep', capital: 12500000 },
    { month: 'Oct', capital: 14200000 },
    { month: 'Nov', capital: 16950000 },
  ],
  
  revenueByMonth: [
    { month: 'Jun', revenue: 65000 },
    { month: 'Jul', revenue: 78000 },
    { month: 'Aug', revenue: 92000 },
    { month: 'Sep', revenue: 105000 },
    { month: 'Oct', revenue: 118000 },
    { month: 'Nov', revenue: 125000 },
  ],
};

// Bank Analytics
export const bankAnalytics = {
  'bank-001': {
    totalCapital: 2500000,
    activeLoans: 847,
    loanVolume: 15420000,
    monthlyYield: 32.4,
    nplRate: 2.8,
    avgLoanSize: 18200,
    disbursementsToday: 45,
    collectionsToday: 78,
    
    loanStatusDistribution: [
      { status: 'Current', count: 720, pct: 85 },
      { status: 'Overdue', count: 85, pct: 10 },
      { status: 'Defaulted', count: 42, pct: 5 },
    ],
    
    weeklyDisbursements: [
      { day: 'Mon', amount: 450000 },
      { day: 'Tue', amount: 520000 },
      { day: 'Wed', amount: 380000 },
      { day: 'Thu', amount: 610000 },
      { day: 'Fri', amount: 490000 },
      { day: 'Sat', amount: 280000 },
      { day: 'Sun', amount: 120000 },
    ],
  },
};

// Investor Analytics
export const investorAnalytics = {
  'inv-001': {
    totalInvested: 5200000,
    activeInstruments: 8,
    avgYield: 12.5,
    portfolioGrowth: 8.2,
    pendingMaturity: 2,
    
    portfolioByBank: [
      { bank: 'Equity Africa Bank', amount: 2100000 },
      { bank: 'Kilimanjaro Microfinance', amount: 1800000 },
      { bank: 'Rwanda Digital Bank', amount: 1300000 },
    ],
    
    yieldHistory: [
      { month: 'Jun', yield: 11.2 },
      { month: 'Jul', yield: 11.8 },
      { month: 'Aug', yield: 12.1 },
      { month: 'Sep', yield: 12.3 },
      { month: 'Oct', yield: 12.4 },
      { month: 'Nov', yield: 12.5 },
    ],
  },
};

export default {
  investorTypes,
  lendingInstitutionTypes,
  moodysRatings,
  investmentTerms,
  currencies,
  countries,
  demoUsers,
  demoTenants,
  demoInstruments,
  demoLoans,
  platformAnalytics,
  bankAnalytics,
  investorAnalytics,
};
