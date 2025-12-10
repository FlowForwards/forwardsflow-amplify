// GraphQL Operations for ForwardsFlow
// Queries, Mutations, and Subscriptions

// ============================================
// FRAGMENTS
// ============================================

export const ORGANIZATION_FRAGMENT = /* GraphQL */ `
  fragment OrganizationFields on Organization {
    orgId
    orgType
    name
    email
    country
    status
    institutionType
    moodysRating
    website
    address
    phone
    logo
    swiftCode
    centralBankLicense
    aum
    investmentFocus
    totalCapital
    totalInvested
    activeLoans
    activeInvestments
    adminCount
    userCount
    createdAt
    updatedAt
  }
`;

export const USER_FRAGMENT = /* GraphQL */ `
  fragment UserFields on User {
    userId
    email
    name
    role
    status
    orgId
    jobRole
    phone
    avatar
    lastLogin
    mfaEnabled
    createdAt
    updatedAt
  }
`;

export const CAPITAL_CALL_FRAGMENT = /* GraphQL */ `
  fragment CapitalCallFields on CapitalCall {
    callId
    txnRef
    bankOrgId
    amount
    currency
    targetCurrency
    maturityMonths
    interestRate
    fxSpread
    hedgingFee
    currentFxRate
    hedgedFxRate
    status
    subscribed
    subscribedPct
    projectedYield
    intendedUse
    notes
    createdAt
    updatedAt
    publishedAt
    expiresAt
    acceptedBy
    acceptedAt
    completedAt
    bank {
      orgId
      name
      country
      moodysRating
      logo
    }
  }
`;

export const INVESTMENT_FRAGMENT = /* GraphQL */ `
  fragment InvestmentFields on Investment {
    investmentId
    txnRef
    callId
    investorOrgId
    amount
    currency
    interestRate
    maturityDate
    status
    expectedReturn
    accruedInterest
    daysToMaturity
    kycSubmittedAt
    kycApprovedAt
    createdAt
    updatedAt
    capitalCall {
      callId
      txnRef
      bankOrgId
      bank {
        name
        country
      }
    }
    investor {
      orgId
      name
    }
  }
`;

export const MOBILE_LOAN_FRAGMENT = /* GraphQL */ `
  fragment MobileLoanFields on MobileLoan {
    loanId
    loanRef
    bankOrgId
    borrowerPhone
    borrowerName
    borrowerIdNumber
    amount
    currency
    interestRate
    term
    status
    amountPaid
    amountOutstanding
    daysOverdue
    creditScore
    creditLimit
    approvedAt
    disbursedAt
    dueDate
    settledAt
    createdAt
    updatedAt
  }
`;

export const NOTIFICATION_FRAGMENT = /* GraphQL */ `
  fragment NotificationFields on Notification {
    notificationId
    userId
    orgId
    type
    title
    message
    link
    read
    readAt
    createdAt
  }
`;

// ============================================
// QUERIES
// ============================================

// Organizations
export const GET_ORGANIZATION = /* GraphQL */ `
  query GetOrganization($orgId: ID!) {
    getOrganization(orgId: $orgId) {
      ...OrganizationFields
    }
  }
  ${ORGANIZATION_FRAGMENT}
`;

export const LIST_ORGANIZATIONS = /* GraphQL */ `
  query ListOrganizations($filter: OrganizationType, $pagination: PaginationInput) {
    listOrganizations(filter: $filter, pagination: $pagination) {
      items {
        ...OrganizationFields
      }
      nextToken
      totalCount
    }
  }
  ${ORGANIZATION_FRAGMENT}
`;

export const LIST_BANKS = /* GraphQL */ `
  query ListBanks($pagination: PaginationInput) {
    listBanks(pagination: $pagination) {
      items {
        ...OrganizationFields
      }
      nextToken
      totalCount
    }
  }
  ${ORGANIZATION_FRAGMENT}
`;

export const LIST_INVESTORS = /* GraphQL */ `
  query ListInvestors($pagination: PaginationInput) {
    listInvestors(pagination: $pagination) {
      items {
        ...OrganizationFields
      }
      nextToken
      totalCount
    }
  }
  ${ORGANIZATION_FRAGMENT}
`;

// Users
export const GET_USER = /* GraphQL */ `
  query GetUser($userId: ID!) {
    getUser(userId: $userId) {
      ...UserFields
      organization {
        orgId
        name
        orgType
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const GET_USER_BY_EMAIL = /* GraphQL */ `
  query GetUserByEmail($email: String!) {
    getUserByEmail(email: $email) {
      ...UserFields
      organization {
        orgId
        name
        orgType
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const LIST_USERS = /* GraphQL */ `
  query ListUsers($pagination: PaginationInput) {
    listUsers(pagination: $pagination) {
      items {
        ...UserFields
      }
      nextToken
      totalCount
    }
  }
  ${USER_FRAGMENT}
`;

export const LIST_USERS_BY_ORGANIZATION = /* GraphQL */ `
  query ListUsersByOrganization($orgId: ID!, $pagination: PaginationInput) {
    listUsersByOrganization(orgId: $orgId, pagination: $pagination) {
      items {
        ...UserFields
      }
      nextToken
      totalCount
    }
  }
  ${USER_FRAGMENT}
`;

// Capital Calls
export const GET_CAPITAL_CALL = /* GraphQL */ `
  query GetCapitalCall($callId: ID!) {
    getCapitalCall(callId: $callId) {
      ...CapitalCallFields
      investments {
        investmentId
        investorOrgId
        amount
        status
        investor {
          name
        }
      }
    }
  }
  ${CAPITAL_CALL_FRAGMENT}
`;

export const LIST_CAPITAL_CALLS = /* GraphQL */ `
  query ListCapitalCalls($pagination: PaginationInput) {
    listCapitalCalls(pagination: $pagination) {
      items {
        ...CapitalCallFields
      }
      nextToken
      totalCount
    }
  }
  ${CAPITAL_CALL_FRAGMENT}
`;

export const LIST_CAPITAL_CALLS_BY_BANK = /* GraphQL */ `
  query ListCapitalCallsByBank($bankOrgId: ID!, $pagination: PaginationInput) {
    listCapitalCallsByBank(bankOrgId: $bankOrgId, pagination: $pagination) {
      items {
        ...CapitalCallFields
      }
      nextToken
      totalCount
    }
  }
  ${CAPITAL_CALL_FRAGMENT}
`;

export const LIST_PUBLISHED_CALLS = /* GraphQL */ `
  query ListPublishedCalls($pagination: PaginationInput) {
    listPublishedCalls(pagination: $pagination) {
      items {
        ...CapitalCallFields
      }
      nextToken
      totalCount
    }
  }
  ${CAPITAL_CALL_FRAGMENT}
`;

// Investments
export const GET_INVESTMENT = /* GraphQL */ `
  query GetInvestment($investmentId: ID!) {
    getInvestment(investmentId: $investmentId) {
      ...InvestmentFields
    }
  }
  ${INVESTMENT_FRAGMENT}
`;

export const LIST_INVESTMENTS = /* GraphQL */ `
  query ListInvestments($pagination: PaginationInput) {
    listInvestments(pagination: $pagination) {
      items {
        ...InvestmentFields
      }
      nextToken
      totalCount
    }
  }
  ${INVESTMENT_FRAGMENT}
`;

export const LIST_INVESTMENTS_BY_INVESTOR = /* GraphQL */ `
  query ListInvestmentsByInvestor($investorOrgId: ID!, $pagination: PaginationInput) {
    listInvestmentsByInvestor(investorOrgId: $investorOrgId, pagination: $pagination) {
      items {
        ...InvestmentFields
      }
      nextToken
      totalCount
    }
  }
  ${INVESTMENT_FRAGMENT}
`;

// Mobile Loans
export const GET_MOBILE_LOAN = /* GraphQL */ `
  query GetMobileLoan($loanId: ID!) {
    getMobileLoan(loanId: $loanId) {
      ...MobileLoanFields
      payments {
        paymentId
        paymentRef
        amount
        mpesaRef
        status
        createdAt
      }
    }
  }
  ${MOBILE_LOAN_FRAGMENT}
`;

export const LIST_MOBILE_LOANS_BY_BANK = /* GraphQL */ `
  query ListMobileLoansByBank($bankOrgId: ID!, $status: MobileLoanStatus, $pagination: PaginationInput) {
    listMobileLoansByBank(bankOrgId: $bankOrgId, status: $status, pagination: $pagination) {
      items {
        ...MobileLoanFields
      }
      nextToken
      totalCount
    }
  }
  ${MOBILE_LOAN_FRAGMENT}
`;

// Metrics
export const GET_PLATFORM_METRICS = /* GraphQL */ `
  query GetPlatformMetrics {
    getPlatformMetrics {
      totalCapitalDeployed
      totalInvestors
      totalBanks
      totalActiveLoans
      totalLoanVolume
      avgPlatformYield
      monthlyRevenue
      monthlyGrowth
      capitalByMonth {
        month
        value
      }
      revenueByMonth {
        month
        value
      }
      lastUpdated
    }
  }
`;

export const GET_BANK_METRICS = /* GraphQL */ `
  query GetBankMetrics($orgId: ID!) {
    getBankMetrics(orgId: $orgId) {
      orgId
      totalCapital
      activeLoans
      loanVolume
      monthlyYield
      nplRate
      avgLoanSize
      disbursementsToday
      collectionsToday
      loanStatusDistribution {
        status
        count
        pct
      }
      weeklyDisbursements {
        day
        amount
      }
      lastUpdated
    }
  }
`;

export const GET_INVESTOR_METRICS = /* GraphQL */ `
  query GetInvestorMetrics($orgId: ID!) {
    getInvestorMetrics(orgId: $orgId) {
      orgId
      totalInvested
      activeInstruments
      avgYield
      portfolioGrowth
      pendingMaturity
      portfolioByBank {
        bank
        bankId
        amount
      }
      yieldHistory {
        month
        value
      }
      lastUpdated
    }
  }
`;

// Notifications
export const LIST_NOTIFICATIONS = /* GraphQL */ `
  query ListNotifications($userId: ID!, $unreadOnly: Boolean, $pagination: PaginationInput) {
    listNotifications(userId: $userId, unreadOnly: $unreadOnly, pagination: $pagination) {
      items {
        ...NotificationFields
      }
      nextToken
      unreadCount
    }
  }
  ${NOTIFICATION_FRAGMENT}
`;

// Audit Logs
export const LIST_AUDIT_LOGS = /* GraphQL */ `
  query ListAuditLogs($orgId: ID, $userId: ID, $action: AuditAction, $dateRange: DateRangeInput, $pagination: PaginationInput) {
    listAuditLogs(orgId: $orgId, userId: $userId, action: $action, dateRange: $dateRange, pagination: $pagination) {
      items {
        logId
        userId
        orgId
        action
        entityType
        entityId
        timestamp
      }
      nextToken
      totalCount
    }
  }
`;

// ============================================
// MUTATIONS
// ============================================

// Organizations
export const CREATE_ORGANIZATION = /* GraphQL */ `
  mutation CreateOrganization($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      ...OrganizationFields
    }
  }
  ${ORGANIZATION_FRAGMENT}
`;

export const UPDATE_ORGANIZATION = /* GraphQL */ `
  mutation UpdateOrganization($input: UpdateOrganizationInput!) {
    updateOrganization(input: $input) {
      ...OrganizationFields
    }
  }
  ${ORGANIZATION_FRAGMENT}
`;

export const SUSPEND_ORGANIZATION = /* GraphQL */ `
  mutation SuspendOrganization($orgId: ID!, $reason: String) {
    suspendOrganization(orgId: $orgId, reason: $reason) {
      ...OrganizationFields
    }
  }
  ${ORGANIZATION_FRAGMENT}
`;

export const ACTIVATE_ORGANIZATION = /* GraphQL */ `
  mutation ActivateOrganization($orgId: ID!) {
    activateOrganization(orgId: $orgId) {
      ...OrganizationFields
    }
  }
  ${ORGANIZATION_FRAGMENT}
`;

// Users
export const CREATE_USER = /* GraphQL */ `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;

export const UPDATE_USER = /* GraphQL */ `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;

export const SUSPEND_USER = /* GraphQL */ `
  mutation SuspendUser($userId: ID!, $reason: String) {
    suspendUser(userId: $userId, reason: $reason) {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;

// Capital Calls
export const CREATE_CAPITAL_CALL = /* GraphQL */ `
  mutation CreateCapitalCall($input: CreateCapitalCallInput!) {
    createCapitalCall(input: $input) {
      ...CapitalCallFields
    }
  }
  ${CAPITAL_CALL_FRAGMENT}
`;

export const UPDATE_CAPITAL_CALL = /* GraphQL */ `
  mutation UpdateCapitalCall($input: UpdateCapitalCallInput!) {
    updateCapitalCall(input: $input) {
      ...CapitalCallFields
    }
  }
  ${CAPITAL_CALL_FRAGMENT}
`;

export const PUBLISH_CAPITAL_CALL = /* GraphQL */ `
  mutation PublishCapitalCall($callId: ID!) {
    publishCapitalCall(callId: $callId) {
      ...CapitalCallFields
    }
  }
  ${CAPITAL_CALL_FRAGMENT}
`;

export const CANCEL_CAPITAL_CALL = /* GraphQL */ `
  mutation CancelCapitalCall($callId: ID!, $reason: String) {
    cancelCapitalCall(callId: $callId, reason: $reason) {
      ...CapitalCallFields
    }
  }
  ${CAPITAL_CALL_FRAGMENT}
`;

// Investments
export const CREATE_INVESTMENT = /* GraphQL */ `
  mutation CreateInvestment($input: CreateInvestmentInput!) {
    createInvestment(input: $input) {
      ...InvestmentFields
    }
  }
  ${INVESTMENT_FRAGMENT}
`;

export const SUBMIT_KYC = /* GraphQL */ `
  mutation SubmitKyc($input: SubmitKycInput!) {
    submitKyc(input: $input) {
      ...InvestmentFields
    }
  }
  ${INVESTMENT_FRAGMENT}
`;

export const APPROVE_KYC = /* GraphQL */ `
  mutation ApproveKyc($investmentId: ID!) {
    approveKyc(investmentId: $investmentId) {
      ...InvestmentFields
    }
  }
  ${INVESTMENT_FRAGMENT}
`;

export const REJECT_KYC = /* GraphQL */ `
  mutation RejectKyc($investmentId: ID!, $reason: String!) {
    rejectKyc(investmentId: $investmentId, reason: $reason) {
      ...InvestmentFields
    }
  }
  ${INVESTMENT_FRAGMENT}
`;

export const COMPLETE_INVESTMENT = /* GraphQL */ `
  mutation CompleteInvestment($investmentId: ID!) {
    completeInvestment(investmentId: $investmentId) {
      ...InvestmentFields
    }
  }
  ${INVESTMENT_FRAGMENT}
`;

// Mobile Loans
export const CREATE_MOBILE_LOAN = /* GraphQL */ `
  mutation CreateMobileLoan($input: CreateMobileLoanInput!) {
    createMobileLoan(input: $input) {
      ...MobileLoanFields
    }
  }
  ${MOBILE_LOAN_FRAGMENT}
`;

export const APPROVE_MOBILE_LOAN = /* GraphQL */ `
  mutation ApproveMobileLoan($loanId: ID!) {
    approveMobileLoan(loanId: $loanId) {
      ...MobileLoanFields
    }
  }
  ${MOBILE_LOAN_FRAGMENT}
`;

export const DISBURSE_MOBILE_LOAN = /* GraphQL */ `
  mutation DisburseMobileLoan($loanId: ID!) {
    disburseMobileLoan(loanId: $loanId) {
      ...MobileLoanFields
    }
  }
  ${MOBILE_LOAN_FRAGMENT}
`;

export const RECORD_LOAN_PAYMENT = /* GraphQL */ `
  mutation RecordLoanPayment($input: RecordPaymentInput!) {
    recordLoanPayment(input: $input) {
      ...MobileLoanFields
    }
  }
  ${MOBILE_LOAN_FRAGMENT}
`;

// Notifications
export const MARK_NOTIFICATION_READ = /* GraphQL */ `
  mutation MarkNotificationRead($notificationId: ID!) {
    markNotificationRead(notificationId: $notificationId) {
      ...NotificationFields
    }
  }
  ${NOTIFICATION_FRAGMENT}
`;

export const MARK_ALL_NOTIFICATIONS_READ = /* GraphQL */ `
  mutation MarkAllNotificationsRead($userId: ID!) {
    markAllNotificationsRead(userId: $userId)
  }
`;

// Admin
export const SEED_DEMO_DATA = /* GraphQL */ `
  mutation SeedDemoData {
    seedDemoData
  }
`;

export const REFRESH_PLATFORM_METRICS = /* GraphQL */ `
  mutation RefreshPlatformMetrics {
    refreshPlatformMetrics {
      totalCapitalDeployed
      totalInvestors
      totalBanks
      totalActiveLoans
      lastUpdated
    }
  }
`;

// ============================================
// SUBSCRIPTIONS
// ============================================

export const ON_CAPITAL_CALL_CREATED = /* GraphQL */ `
  subscription OnCapitalCallCreated {
    onCapitalCallCreated {
      ...CapitalCallFields
    }
  }
  ${CAPITAL_CALL_FRAGMENT}
`;

export const ON_CAPITAL_CALL_UPDATED = /* GraphQL */ `
  subscription OnCapitalCallUpdated($callId: ID, $bankOrgId: ID) {
    onCapitalCallUpdated(callId: $callId, bankOrgId: $bankOrgId) {
      ...CapitalCallFields
    }
  }
  ${CAPITAL_CALL_FRAGMENT}
`;

export const ON_INVESTMENT_CREATED = /* GraphQL */ `
  subscription OnInvestmentCreated($bankOrgId: ID) {
    onInvestmentCreated(bankOrgId: $bankOrgId) {
      ...InvestmentFields
    }
  }
  ${INVESTMENT_FRAGMENT}
`;

export const ON_INVESTMENT_UPDATED = /* GraphQL */ `
  subscription OnInvestmentUpdated($investmentId: ID, $investorOrgId: ID, $bankOrgId: ID) {
    onInvestmentUpdated(investmentId: $investmentId, investorOrgId: $investorOrgId, bankOrgId: $bankOrgId) {
      ...InvestmentFields
    }
  }
  ${INVESTMENT_FRAGMENT}
`;

export const ON_NOTIFICATION_CREATED = /* GraphQL */ `
  subscription OnNotificationCreated($userId: ID!, $orgId: ID) {
    onNotificationCreated(userId: $userId, orgId: $orgId) {
      ...NotificationFields
    }
  }
  ${NOTIFICATION_FRAGMENT}
`;

export const ON_MOBILE_LOAN_UPDATED = /* GraphQL */ `
  subscription OnMobileLoanUpdated($bankOrgId: ID!) {
    onMobileLoanUpdated(bankOrgId: $bankOrgId) {
      ...MobileLoanFields
    }
  }
  ${MOBILE_LOAN_FRAGMENT}
`;
