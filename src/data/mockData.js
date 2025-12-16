// Demo Users for Authentication
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
    email: 'admin@horizonimpact.com',
    password: 'demo123',
    name: 'Victoria Chen',
    role: 'tenant_admin',
    tenantType: 'investor',
    tenantId: 'inv-001',
    tenantName: 'Horizon Impact Partners',
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
    email: 'analyst@horizonimpact.com',
    password: 'demo123',
    name: 'James Okonkwo',
    role: 'tenant_user',
    tenantType: 'investor',
    tenantId: 'inv-001',
    tenantName: 'Horizon Impact Partners',
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
    jobRole: 'Lending Officer',
    createdAt: '2024-04-01T08:00:00Z',
  },
};

// Demo Tenants
export const demoTenants = {
  investors: [
    {
      id: 'inv-001',
      name: 'Horizon Impact Partners',
      type: 'Investment Fund',
      country: 'United Kingdom',
      aum: 850000000,
      moodysRating: 'Aa2',
      status: 'active',
      createdAt: '2024-03-20T14:00:00Z',
    },
    {
      id: 'inv-002',
      name: 'Atlas Growth Capital',
      type: 'Private Equity',
      country: 'United States',
      aum: 1200000000,
      moodysRating: 'Aa3',
      status: 'active',
      createdAt: '2024-04-10T10:00:00Z',
    },
  ],
  banks: [
    {
      id: 'bank-001',
      name: 'Equity Africa Bank',
      type: 'Commercial Bank',
      country: 'Kenya',
      capitalAdequacy: 18.2,
      moodysRating: 'A+',
      status: 'active',
      createdAt: '2024-02-10T09:00:00Z',
    },
    {
      id: 'bank-002',
      name: 'Diamond Trust Bank',
      type: 'Commercial Bank',
      country: 'Kenya',
      capitalAdequacy: 17.8,
      moodysRating: 'A',
      status: 'active',
      createdAt: '2024-03-05T11:00:00Z',
    },
  ],
};

// Investor Types for Registration
export const investorTypes = [
  { value: 'individual', label: 'Individual Investor' },
  { value: 'family_office', label: 'Family Office' },
  { value: 'foundation', label: 'Foundation / Endowment' },
  { value: 'pension_fund', label: 'Pension Fund' },
  { value: 'insurance', label: 'Insurance Company' },
  { value: 'hedge_fund', label: 'Hedge Fund' },
  { value: 'private_equity', label: 'Private Equity Fund' },
  { value: 'sovereign_wealth', label: 'Sovereign Wealth Fund' },
  { value: 'other', label: 'Other' },
];

// Currencies
export const currencies = [
  { value: 'USD', label: 'US Dollar (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'GBP', label: 'British Pound (GBP)' },
  { value: 'JPY', label: 'Japanese Yen (JPY)' },
  { value: 'CHF', label: 'Swiss Franc (CHF)' },
];

// Moody's Ratings
export const moodysRatings = [
  { value: 'Aaa', label: 'Aaa - Highest Quality' },
  { value: 'Aa1', label: 'Aa1 - High Quality' },
  { value: 'Aa2', label: 'Aa2 - High Quality' },
  { value: 'Aa3', label: 'Aa3 - High Quality' },
  { value: 'A1', label: 'A1 - Upper Medium Grade' },
  { value: 'A2', label: 'A2 - Upper Medium Grade' },
  { value: 'A3', label: 'A3 - Upper Medium Grade' },
  { value: 'Baa1', label: 'Baa1 - Medium Grade' },
  { value: 'Baa2', label: 'Baa2 - Medium Grade' },
  { value: 'Baa3', label: 'Baa3 - Medium Grade' },
  { value: 'not_rated', label: 'Not Rated' },
];

// Investment Terms
export const investmentTerms = [
  { value: '3', label: '3 Months' },
  { value: '6', label: '6 Months' },
  { value: '12', label: '12 Months' },
  { value: '24', label: '24 Months' },
  { value: '36', label: '36 Months' },
];

// Lending Institution Types
export const lendingInstitutionTypes = [
  { value: 'commercial_bank', label: 'Commercial Bank' },
  { value: 'microfinance', label: 'Microfinance Institution' },
  { value: 'sacco', label: 'SACCO / Credit Union' },
  { value: 'development_bank', label: 'Development Finance Institution' },
  { value: 'fintech', label: 'Fintech / Digital Lender' },
  { value: 'other', label: 'Other' },
];

// Countries
export const countries = [
  { value: 'KE', label: 'Kenya' },
  { value: 'TZ', label: 'Tanzania' },
  { value: 'UG', label: 'Uganda' },
  { value: 'RW', label: 'Rwanda' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'GH', label: 'Ghana' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'EG', label: 'Egypt' },
  { value: 'other', label: 'Other' },
];

// Bank Analytics Data
export const bankAnalytics = {
  'bank-001': {
    totalCapital: 250000000,
    activeMobileLoans: 847,
    mobileLoansVolume: 1542000000,
    monthlyYield: 32.4,
    nplRate: 3.2,
    disbursementsToday: 156,
    collectionsToday: 142,
    avgLoanSize: 3200,
    weeklyDisbursements: [
      { day: 'Mon', amount: 12500000 },
      { day: 'Tue', amount: 15200000 },
      { day: 'Wed', amount: 18300000 },
      { day: 'Thu', amount: 14700000 },
      { day: 'Fri', amount: 21000000 },
      { day: 'Sat', amount: 8500000 },
      { day: 'Sun', amount: 5200000 },
    ],
    loanStatusDistribution: [
      { status: 'Current', count: 720, pct: 85 },
      { status: 'Overdue', count: 100, pct: 12 },
      { status: 'Default', count: 27, pct: 3 },
    ],
  },
};

// Demo Loans
export const demoLoans = [
  { id: 'loan-001', borrowerName: 'John Kamau', borrowerPhone: '+254712345678', amount: 5000, term: 30, status: 'pending' },
  { id: 'loan-002', borrowerName: 'Mary Wanjiku', borrowerPhone: '+254723456789', amount: 3000, term: 14, status: 'pending' },
  { id: 'loan-003', borrowerName: 'Peter Ochieng', borrowerPhone: '+254734567890', amount: 10000, term: 30, status: 'pending' },
];

// Demo Instruments
export const demoInstruments = [
  { id: 'inst-001', type: 'Fixed Deposit', currencyPair: 'KES:JPY', principal: 50000000, interestRate: 12.5, subscribedPct: 85, status: 'open' },
  { id: 'inst-002', type: 'Time Deposit', currencyPair: 'KES:CHF', principal: 30000000, interestRate: 10.0, subscribedPct: 100, status: 'fully_subscribed' },
  { id: 'inst-003', type: 'Certificate of Deposit', currencyPair: 'KES:JPY', principal: 75000000, interestRate: 14.0, subscribedPct: 45, status: 'open' },
];

// Investor Analytics Data
export const investorAnalytics = {
  'inv-001': {
    totalInvested: 25000000,
    activeInvestments: 4,
    expectedReturns: 28750000,
    avgYield: 15.0,
    portfolioByBank: [
      { bank: 'Equity Africa Bank', amount: 10000000, pct: 40 },
      { bank: 'Diamond Trust Bank', amount: 8000000, pct: 32 },
      { bank: 'KCB Group', amount: 7000000, pct: 28 },
    ],
    portfolioByMaturity: [
      { term: '3 months', amount: 5000000, pct: 20 },
      { term: '6 months', amount: 8000000, pct: 32 },
      { term: '12 months', amount: 12000000, pct: 48 },
    ],
    monthlyReturns: [
      { month: 'Jul', returns: 312500 },
      { month: 'Aug', returns: 312500 },
      { month: 'Sep', returns: 312500 },
      { month: 'Oct', returns: 312500 },
      { month: 'Nov', returns: 312500 },
      { month: 'Dec', returns: 312500 },
    ],
    recentTransactions: [
      { id: 'txn-001', type: 'Investment', bank: 'Equity Africa Bank', amount: 5000000, date: '2024-11-15', status: 'active' },
      { id: 'txn-002', type: 'Interest', bank: 'Diamond Trust Bank', amount: 100000, date: '2024-11-30', status: 'completed' },
      { id: 'txn-003', type: 'Investment', bank: 'KCB Group', amount: 3000000, date: '2024-10-20', status: 'active' },
    ],
  },
};
