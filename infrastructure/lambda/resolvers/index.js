/**
 * ForwardsFlow GraphQL Lambda Resolver
 * Handles all API operations with DynamoDB
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
  ScanCommand,
  DeleteCommand,
} = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

// Initialize DynamoDB client
const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-west-1' });
const docClient = DynamoDBDocumentClient.from(client);

// Table names from environment
const TABLES = {
  organizations: process.env.ORGANIZATIONS_TABLE,
  users: process.env.USERS_TABLE,
  capitalCalls: process.env.CAPITAL_CALLS_TABLE,
  investments: process.env.INVESTMENTS_TABLE,
  mobileLoans: process.env.MOBILE_LOANS_TABLE,
  payments: process.env.PAYMENTS_TABLE,
  metrics: process.env.METRICS_TABLE,
  auditLogs: process.env.AUDIT_LOGS_TABLE,
  notifications: process.env.NOTIFICATIONS_TABLE,
};

// Utility functions
const generateId = () => uuidv4();
const generateTxnRef = (prefix = 'TXN') => {
  const year = new Date().getFullYear();
  const num = String(Math.floor(Math.random() * 99999)).padStart(5, '0');
  return `${prefix}-${year}-${num}`;
};
const now = () => new Date().toISOString();

// ============================================
// MAIN HANDLER
// ============================================
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const { fieldName, arguments: args, identity } = event;

  try {
    switch (fieldName) {
      // Organizations
      case 'getOrganization':
        return await getOrganization(args.orgId);
      case 'listOrganizations':
        return await listOrganizations(args.filter, args.pagination);
      case 'listBanks':
        return await listOrganizations('BANK', args.pagination);
      case 'listInvestors':
        return await listOrganizations('INVESTOR', args.pagination);
      case 'createOrganization':
        return await createOrganization(args.input, identity);
      case 'updateOrganization':
        return await updateOrganization(args.input, identity);
      case 'suspendOrganization':
        return await suspendOrganization(args.orgId, args.reason, identity);
      case 'activateOrganization':
        return await activateOrganization(args.orgId, identity);

      // Users
      case 'getUser':
        return await getUser(args.userId);
      case 'getUserByEmail':
        return await getUserByEmail(args.email);
      case 'listUsers':
        return await listUsers(args.pagination);
      case 'listUsersByOrganization':
        return await listUsersByOrganization(args.orgId, args.pagination);
      case 'createUser':
        return await createUser(args.input, identity);
      case 'updateUser':
        return await updateUser(args.input, identity);
      case 'suspendUser':
        return await suspendUser(args.userId, args.reason, identity);
      case 'activateUser':
        return await activateUser(args.userId, identity);

      // Capital Calls
      case 'getCapitalCall':
        return await getCapitalCall(args.callId);
      case 'getCapitalCallByTxnRef':
        return await getCapitalCallByTxnRef(args.txnRef);
      case 'listCapitalCalls':
        return await listCapitalCalls(args.pagination);
      case 'listCapitalCallsByBank':
        return await listCapitalCallsByBank(args.bankOrgId, args.pagination);
      case 'listPublishedCalls':
        return await listPublishedCalls(args.pagination);
      case 'createCapitalCall':
        return await createCapitalCall(args.input, identity);
      case 'updateCapitalCall':
        return await updateCapitalCall(args.input, identity);
      case 'publishCapitalCall':
        return await publishCapitalCall(args.callId, identity);
      case 'cancelCapitalCall':
        return await cancelCapitalCall(args.callId, args.reason, identity);

      // Investments
      case 'getInvestment':
        return await getInvestment(args.investmentId);
      case 'listInvestments':
        return await listInvestments(args.pagination);
      case 'listInvestmentsByInvestor':
        return await listInvestmentsByInvestor(args.investorOrgId, args.pagination);
      case 'listInvestmentsByCapitalCall':
        return await listInvestmentsByCapitalCall(args.callId, args.pagination);
      case 'createInvestment':
        return await createInvestment(args.input, identity);
      case 'updateInvestment':
        return await updateInvestment(args.investmentId, args.amount, identity);
      case 'submitKyc':
        return await submitKyc(args.input, identity);
      case 'approveKyc':
        return await approveKyc(args.investmentId, identity);
      case 'rejectKyc':
        return await rejectKyc(args.investmentId, args.reason, identity);
      case 'approveInvestment':
        return await approveInvestment(args.investmentId, identity);
      case 'completeInvestment':
        return await completeInvestment(args.investmentId, identity);
      case 'cancelInvestment':
        return await cancelInvestment(args.investmentId, args.reason, identity);

      // Mobile Loans
      case 'getMobileLoan':
        return await getMobileLoan(args.loanId);
      case 'listMobileLoansByBank':
        return await listMobileLoansByBank(args.bankOrgId, args.status, args.pagination);
      case 'listMobileLoansByBorrower':
        return await listMobileLoansByBorrower(args.borrowerPhone, args.pagination);
      case 'createMobileLoan':
        return await createMobileLoan(args.input, identity);
      case 'approveMobileLoan':
        return await approveMobileLoan(args.loanId, identity);
      case 'rejectMobileLoan':
        return await rejectMobileLoan(args.loanId, args.reason, identity);
      case 'disburseMobileLoan':
        return await disburseMobileLoan(args.loanId, identity);
      case 'recordLoanPayment':
        return await recordLoanPayment(args.input, identity);
      case 'writeOffLoan':
        return await writeOffLoan(args.loanId, args.reason, identity);

      // Metrics
      case 'getPlatformMetrics':
        return await getPlatformMetrics();
      case 'getBankMetrics':
        return await getBankMetrics(args.orgId);
      case 'getInvestorMetrics':
        return await getInvestorMetrics(args.orgId);
      case 'refreshPlatformMetrics':
        return await refreshPlatformMetrics();
      case 'refreshBankMetrics':
        return await refreshBankMetrics(args.orgId);

      // Notifications
      case 'listNotifications':
        return await listNotifications(args.userId, args.unreadOnly, args.pagination);
      case 'markNotificationRead':
        return await markNotificationRead(args.notificationId);
      case 'markAllNotificationsRead':
        return await markAllNotificationsRead(args.userId);

      // Audit Logs
      case 'listAuditLogs':
        return await listAuditLogs(args.orgId, args.userId, args.action, args.dateRange, args.pagination);

      // Admin
      case 'seedDemoData':
        return await seedDemoData();

      default:
        throw new Error(`Unknown field: ${fieldName}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// ============================================
// ORGANIZATION OPERATIONS
// ============================================

async function getOrganization(orgId) {
  const result = await docClient.send(new GetCommand({
    TableName: TABLES.organizations,
    Key: { orgId },
  }));
  return result.Item || null;
}

async function listOrganizations(filter, pagination = {}) {
  const params = {
    TableName: TABLES.organizations,
    Limit: pagination.limit || 20,
  };

  if (filter) {
    params.IndexName = 'byType';
    params.KeyConditionExpression = 'orgType = :type';
    params.ExpressionAttributeValues = { ':type': filter };
  }

  if (pagination.nextToken) {
    params.ExclusiveStartKey = JSON.parse(Buffer.from(pagination.nextToken, 'base64').toString());
  }

  const result = filter
    ? await docClient.send(new QueryCommand(params))
    : await docClient.send(new ScanCommand(params));

  return {
    items: result.Items || [],
    nextToken: result.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      : null,
    totalCount: result.Count,
  };
}

async function createOrganization(input, identity) {
  const orgId = generateId();
  const timestamp = now();

  const item = {
    orgId,
    ...input,
    status: 'PENDING',
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy: identity?.sub,
    totalCapital: 0,
    totalInvested: 0,
    activeLoans: 0,
    activeInvestments: 0,
    adminCount: 0,
    userCount: 0,
  };

  await docClient.send(new PutCommand({
    TableName: TABLES.organizations,
    Item: item,
  }));

  await createAuditLog({
    userId: identity?.sub,
    orgId,
    action: 'CREATE',
    entityType: 'Organization',
    entityId: orgId,
    newValue: item,
  });

  return item;
}

async function updateOrganization(input, identity) {
  const { orgId, ...updates } = input;
  const existing = await getOrganization(orgId);

  if (!existing) {
    throw new Error('Organization not found');
  }

  const updateExpression = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      updateExpression.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    }
  });

  updateExpression.push('#updatedAt = :updatedAt');
  expressionAttributeNames['#updatedAt'] = 'updatedAt';
  expressionAttributeValues[':updatedAt'] = now();

  const result = await docClient.send(new UpdateCommand({
    TableName: TABLES.organizations,
    Key: { orgId },
    UpdateExpression: `SET ${updateExpression.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  }));

  await createAuditLog({
    userId: identity?.sub,
    orgId,
    action: 'UPDATE',
    entityType: 'Organization',
    entityId: orgId,
    previousValue: existing,
    newValue: result.Attributes,
  });

  return result.Attributes;
}

async function suspendOrganization(orgId, reason, identity) {
  return await updateOrganization({ orgId, status: 'SUSPENDED', suspendReason: reason }, identity);
}

async function activateOrganization(orgId, identity) {
  return await updateOrganization({ orgId, status: 'ACTIVE', suspendReason: null }, identity);
}

// ============================================
// USER OPERATIONS
// ============================================

async function getUser(userId) {
  const result = await docClient.send(new GetCommand({
    TableName: TABLES.users,
    Key: { userId },
  }));
  return result.Item || null;
}

async function getUserByEmail(email) {
  const result = await docClient.send(new QueryCommand({
    TableName: TABLES.users,
    IndexName: 'byEmail',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: { ':email': email.toLowerCase() },
    Limit: 1,
  }));
  return result.Items?.[0] || null;
}

async function listUsers(pagination = {}) {
  const params = {
    TableName: TABLES.users,
    Limit: pagination.limit || 20,
  };

  if (pagination.nextToken) {
    params.ExclusiveStartKey = JSON.parse(Buffer.from(pagination.nextToken, 'base64').toString());
  }

  const result = await docClient.send(new ScanCommand(params));

  return {
    items: result.Items || [],
    nextToken: result.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      : null,
    totalCount: result.Count,
  };
}

async function listUsersByOrganization(orgId, pagination = {}) {
  const params = {
    TableName: TABLES.users,
    IndexName: 'byOrganization',
    KeyConditionExpression: 'orgId = :orgId',
    ExpressionAttributeValues: { ':orgId': orgId },
    Limit: pagination.limit || 20,
  };

  if (pagination.nextToken) {
    params.ExclusiveStartKey = JSON.parse(Buffer.from(pagination.nextToken, 'base64').toString());
  }

  const result = await docClient.send(new QueryCommand(params));

  return {
    items: result.Items || [],
    nextToken: result.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      : null,
    totalCount: result.Count,
  };
}

async function createUser(input, identity) {
  const userId = generateId();
  const timestamp = now();

  const item = {
    userId,
    ...input,
    email: input.email.toLowerCase(),
    status: 'ACTIVE',
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy: identity?.sub,
    mfaEnabled: false,
  };

  await docClient.send(new PutCommand({
    TableName: TABLES.users,
    Item: item,
  }));

  // Update organization user count
  if (input.orgId) {
    await incrementOrgUserCount(input.orgId, input.role.includes('ADMIN') ? 'admin' : 'user');
  }

  await createAuditLog({
    userId: identity?.sub,
    orgId: input.orgId,
    action: 'CREATE',
    entityType: 'User',
    entityId: userId,
    newValue: { ...item, password: undefined },
  });

  return item;
}

async function updateUser(input, identity) {
  const { userId, ...updates } = input;
  const existing = await getUser(userId);

  if (!existing) {
    throw new Error('User not found');
  }

  const updateExpression = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      updateExpression.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    }
  });

  updateExpression.push('#updatedAt = :updatedAt');
  expressionAttributeNames['#updatedAt'] = 'updatedAt';
  expressionAttributeValues[':updatedAt'] = now();

  const result = await docClient.send(new UpdateCommand({
    TableName: TABLES.users,
    Key: { userId },
    UpdateExpression: `SET ${updateExpression.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  }));

  await createAuditLog({
    userId: identity?.sub,
    orgId: existing.orgId,
    action: 'UPDATE',
    entityType: 'User',
    entityId: userId,
    previousValue: existing,
    newValue: result.Attributes,
  });

  return result.Attributes;
}

async function suspendUser(userId, reason, identity) {
  return await updateUser({ userId, status: 'SUSPENDED', suspendReason: reason }, identity);
}

async function activateUser(userId, identity) {
  return await updateUser({ userId, status: 'ACTIVE', suspendReason: null }, identity);
}

async function incrementOrgUserCount(orgId, type) {
  const field = type === 'admin' ? 'adminCount' : 'userCount';
  await docClient.send(new UpdateCommand({
    TableName: TABLES.organizations,
    Key: { orgId },
    UpdateExpression: `SET #field = if_not_exists(#field, :zero) + :one`,
    ExpressionAttributeNames: { '#field': field },
    ExpressionAttributeValues: { ':zero': 0, ':one': 1 },
  }));
}

// ============================================
// CAPITAL CALL OPERATIONS
// ============================================

async function getCapitalCall(callId) {
  const result = await docClient.send(new GetCommand({
    TableName: TABLES.capitalCalls,
    Key: { callId },
  }));

  if (result.Item) {
    // Enrich with bank info
    const bank = await getOrganization(result.Item.bankOrgId);
    result.Item.bank = bank;
  }

  return result.Item || null;
}

async function getCapitalCallByTxnRef(txnRef) {
  const result = await docClient.send(new QueryCommand({
    TableName: TABLES.capitalCalls,
    IndexName: 'byTxnRef',
    KeyConditionExpression: 'txnRef = :txnRef',
    ExpressionAttributeValues: { ':txnRef': txnRef },
    Limit: 1,
  }));
  return result.Items?.[0] || null;
}

async function listCapitalCalls(pagination = {}) {
  const params = {
    TableName: TABLES.capitalCalls,
    Limit: pagination.limit || 20,
  };

  if (pagination.nextToken) {
    params.ExclusiveStartKey = JSON.parse(Buffer.from(pagination.nextToken, 'base64').toString());
  }

  const result = await docClient.send(new ScanCommand(params));

  return {
    items: result.Items || [],
    nextToken: result.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      : null,
    totalCount: result.Count,
  };
}

async function listCapitalCallsByBank(bankOrgId, pagination = {}) {
  const params = {
    TableName: TABLES.capitalCalls,
    IndexName: 'byBank',
    KeyConditionExpression: 'bankOrgId = :bankOrgId',
    ExpressionAttributeValues: { ':bankOrgId': bankOrgId },
    ScanIndexForward: false,
    Limit: pagination.limit || 20,
  };

  if (pagination.nextToken) {
    params.ExclusiveStartKey = JSON.parse(Buffer.from(pagination.nextToken, 'base64').toString());
  }

  const result = await docClient.send(new QueryCommand(params));

  return {
    items: result.Items || [],
    nextToken: result.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      : null,
    totalCount: result.Count,
  };
}

async function listPublishedCalls(pagination = {}) {
  const params = {
    TableName: TABLES.capitalCalls,
    IndexName: 'byStatus',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: { ':status': 'PUBLISHED' },
    ScanIndexForward: false,
    Limit: pagination.limit || 20,
  };

  if (pagination.nextToken) {
    params.ExclusiveStartKey = JSON.parse(Buffer.from(pagination.nextToken, 'base64').toString());
  }

  const result = await docClient.send(new QueryCommand(params));

  // Enrich with bank info
  const items = await Promise.all(
    (result.Items || []).map(async (item) => {
      const bank = await getOrganization(item.bankOrgId);
      return { ...item, bank };
    })
  );

  return {
    items,
    nextToken: result.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      : null,
    totalCount: result.Count,
  };
}

async function createCapitalCall(input, identity) {
  const callId = generateId();
  const txnRef = generateTxnRef('CALL');
  const timestamp = now();

  // Calculate hedged rate
  const hedgedFxRate = input.currentFxRate
    ? input.currentFxRate * (1 + (input.hedgingFee || 2) / 100)
    : null;

  // Calculate projected yield
  const projectedYield = input.interestRate - (input.fxSpread || 1) - (input.hedgingFee || 2);

  const item = {
    callId,
    txnRef,
    ...input,
    hedgedFxRate,
    projectedYield,
    status: 'DRAFT',
    subscribed: 0,
    subscribedPct: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy: identity?.sub,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };

  await docClient.send(new PutCommand({
    TableName: TABLES.capitalCalls,
    Item: item,
  }));

  await createAuditLog({
    userId: identity?.sub,
    orgId: input.bankOrgId,
    action: 'CREATE',
    entityType: 'CapitalCall',
    entityId: callId,
    newValue: item,
  });

  return item;
}

async function updateCapitalCall(input, identity) {
  const { callId, ...updates } = input;
  const existing = await getCapitalCall(callId);

  if (!existing) {
    throw new Error('Capital call not found');
  }

  if (existing.status !== 'DRAFT') {
    throw new Error('Can only update draft capital calls');
  }

  const updateExpression = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      updateExpression.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    }
  });

  updateExpression.push('#updatedAt = :updatedAt');
  expressionAttributeNames['#updatedAt'] = 'updatedAt';
  expressionAttributeValues[':updatedAt'] = now();

  const result = await docClient.send(new UpdateCommand({
    TableName: TABLES.capitalCalls,
    Key: { callId },
    UpdateExpression: `SET ${updateExpression.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  }));

  await createAuditLog({
    userId: identity?.sub,
    orgId: existing.bankOrgId,
    action: 'UPDATE',
    entityType: 'CapitalCall',
    entityId: callId,
    previousValue: existing,
    newValue: result.Attributes,
  });

  return result.Attributes;
}

async function publishCapitalCall(callId, identity) {
  const existing = await getCapitalCall(callId);

  if (!existing) {
    throw new Error('Capital call not found');
  }

  if (existing.status !== 'DRAFT') {
    throw new Error('Can only publish draft capital calls');
  }

  const timestamp = now();

  const result = await docClient.send(new UpdateCommand({
    TableName: TABLES.capitalCalls,
    Key: { callId },
    UpdateExpression: 'SET #status = :status, publishedAt = :publishedAt, updatedAt = :updatedAt',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: {
      ':status': 'PUBLISHED',
      ':publishedAt': timestamp,
      ':updatedAt': timestamp,
    },
    ReturnValues: 'ALL_NEW',
  }));

  // Create notifications for all investors
  await notifyAllInvestors({
    type: 'OPPORTUNITY',
    title: 'New Investment Opportunity',
    message: `${existing.bank?.name || 'A bank'} has published a new capital call for ${formatCurrency(existing.amount, existing.currency)} at ${existing.interestRate}% APR`,
    link: `/investor/opportunities`,
  });

  await createAuditLog({
    userId: identity?.sub,
    orgId: existing.bankOrgId,
    action: 'UPDATE',
    entityType: 'CapitalCall',
    entityId: callId,
    previousValue: { status: existing.status },
    newValue: { status: 'PUBLISHED' },
  });

  return result.Attributes;
}

async function cancelCapitalCall(callId, reason, identity) {
  const existing = await getCapitalCall(callId);

  if (!existing) {
    throw new Error('Capital call not found');
  }

  if (['COMPLETED', 'CANCELLED'].includes(existing.status)) {
    throw new Error('Cannot cancel completed or already cancelled calls');
  }

  const timestamp = now();

  const result = await docClient.send(new UpdateCommand({
    TableName: TABLES.capitalCalls,
    Key: { callId },
    UpdateExpression: 'SET #status = :status, cancelReason = :reason, updatedAt = :updatedAt',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: {
      ':status': 'CANCELLED',
      ':reason': reason,
      ':updatedAt': timestamp,
    },
    ReturnValues: 'ALL_NEW',
  }));

  await createAuditLog({
    userId: identity?.sub,
    orgId: existing.bankOrgId,
    action: 'UPDATE',
    entityType: 'CapitalCall',
    entityId: callId,
    previousValue: { status: existing.status },
    newValue: { status: 'CANCELLED', cancelReason: reason },
  });

  return result.Attributes;
}

// ============================================
// INVESTMENT OPERATIONS
// ============================================

async function getInvestment(investmentId) {
  const result = await docClient.send(new GetCommand({
    TableName: TABLES.investments,
    Key: { investmentId },
  }));

  if (result.Item) {
    const [capitalCall, investor] = await Promise.all([
      getCapitalCall(result.Item.callId),
      getOrganization(result.Item.investorOrgId),
    ]);
    result.Item.capitalCall = capitalCall;
    result.Item.investor = investor;
  }

  return result.Item || null;
}

async function listInvestments(pagination = {}) {
  const params = {
    TableName: TABLES.investments,
    Limit: pagination.limit || 20,
  };

  if (pagination.nextToken) {
    params.ExclusiveStartKey = JSON.parse(Buffer.from(pagination.nextToken, 'base64').toString());
  }

  const result = await docClient.send(new ScanCommand(params));

  return {
    items: result.Items || [],
    nextToken: result.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      : null,
    totalCount: result.Count,
  };
}

async function listInvestmentsByInvestor(investorOrgId, pagination = {}) {
  const params = {
    TableName: TABLES.investments,
    IndexName: 'byInvestor',
    KeyConditionExpression: 'investorOrgId = :investorOrgId',
    ExpressionAttributeValues: { ':investorOrgId': investorOrgId },
    ScanIndexForward: false,
    Limit: pagination.limit || 20,
  };

  if (pagination.nextToken) {
    params.ExclusiveStartKey = JSON.parse(Buffer.from(pagination.nextToken, 'base64').toString());
  }

  const result = await docClient.send(new QueryCommand(params));

  return {
    items: result.Items || [],
    nextToken: result.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      : null,
    totalCount: result.Count,
  };
}

async function listInvestmentsByCapitalCall(callId, pagination = {}) {
  const params = {
    TableName: TABLES.investments,
    IndexName: 'byCapitalCall',
    KeyConditionExpression: 'callId = :callId',
    ExpressionAttributeValues: { ':callId': callId },
    Limit: pagination.limit || 20,
  };

  if (pagination.nextToken) {
    params.ExclusiveStartKey = JSON.parse(Buffer.from(pagination.nextToken, 'base64').toString());
  }

  const result = await docClient.send(new QueryCommand(params));

  return {
    items: result.Items || [],
    nextToken: result.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      : null,
    totalCount: result.Count,
  };
}

async function createInvestment(input, identity) {
  const capitalCall = await getCapitalCall(input.callId);

  if (!capitalCall) {
    throw new Error('Capital call not found');
  }

  if (capitalCall.status !== 'PUBLISHED') {
    throw new Error('Can only invest in published capital calls');
  }

  const investmentId = generateId();
  const txnRef = generateTxnRef('INV');
  const timestamp = now();

  // Calculate maturity date
  const maturityDate = new Date();
  maturityDate.setMonth(maturityDate.getMonth() + capitalCall.maturityMonths);

  const item = {
    investmentId,
    txnRef,
    callId: input.callId,
    investorOrgId: input.investorOrgId,
    amount: input.amount,
    currency: capitalCall.currency,
    interestRate: capitalCall.interestRate,
    maturityDate: maturityDate.toISOString(),
    status: 'PENDING',
    expectedReturn: input.amount * (1 + capitalCall.projectedYield / 100),
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy: identity?.sub,
  };

  await docClient.send(new PutCommand({
    TableName: TABLES.investments,
    Item: item,
  }));

  // Update capital call subscribed amount
  await docClient.send(new UpdateCommand({
    TableName: TABLES.capitalCalls,
    Key: { callId: input.callId },
    UpdateExpression: 'SET subscribed = subscribed + :amount, subscribedPct = (subscribed + :amount) / amount * :hundred, #status = :status, updatedAt = :updatedAt',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: {
      ':amount': input.amount,
      ':hundred': 100,
      ':status': 'ACCEPTED',
      ':updatedAt': timestamp,
    },
  }));

  // Notify bank
  await createNotification({
    userId: null,
    orgId: capitalCall.bankOrgId,
    type: 'SUCCESS',
    title: 'Investment Received',
    message: `New investment of ${formatCurrency(input.amount, capitalCall.currency)} received for capital call ${capitalCall.txnRef}`,
    link: '/bank/calls',
  });

  await createAuditLog({
    userId: identity?.sub,
    orgId: input.investorOrgId,
    action: 'CREATE',
    entityType: 'Investment',
    entityId: investmentId,
    newValue: item,
  });

  return item;
}

async function submitKyc(input, identity) {
  const existing = await getInvestment(input.investmentId);

  if (!existing) {
    throw new Error('Investment not found');
  }

  const timestamp = now();

  const result = await docClient.send(new UpdateCommand({
    TableName: TABLES.investments,
    Key: { investmentId: input.investmentId },
    UpdateExpression: 'SET #status = :status, kycDocuments = :kycDocuments, bankDetails = :bankDetails, kycSubmittedAt = :kycSubmittedAt, updatedAt = :updatedAt',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: {
      ':status': 'KYC_SUBMITTED',
      ':kycDocuments': input.kycDocuments,
      ':bankDetails': input.bankDetails,
      ':kycSubmittedAt': timestamp,
      ':updatedAt': timestamp,
    },
    ReturnValues: 'ALL_NEW',
  }));

  // Notify bank compliance
  const capitalCall = await getCapitalCall(existing.callId);
  await createNotification({
    userId: null,
    orgId: capitalCall.bankOrgId,
    type: 'INFO',
    title: 'KYC Documents Received',
    message: `KYC documents submitted for investment ${existing.txnRef}. Please review.`,
    link: '/bank/compliance',
  });

  return result.Attributes;
}

async function approveKyc(investmentId, identity) {
  const timestamp = now();

  const result = await docClient.send(new UpdateCommand({
    TableName: TABLES.investments,
    Key: { investmentId },
    UpdateExpression: 'SET #status = :status, kycApprovedAt = :kycApprovedAt, kycApprovedBy = :kycApprovedBy, updatedAt = :updatedAt',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: {
      ':status': 'KYC_APPROVED',
      ':kycApprovedAt': timestamp,
      ':kycApprovedBy': identity?.sub,
      ':updatedAt': timestamp,
    },
    ReturnValues: 'ALL_NEW',
  }));

  return result.Attributes;
}

async function rejectKyc(investmentId, reason, identity) {
  const timestamp = now();

  const result = await docClient.send(new UpdateCommand({
    TableName: TABLES.investments,
    Key: { investmentId },
    UpdateExpression: 'SET #status = :status, kycRejectedReason = :reason, updatedAt = :updatedAt',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: {
      ':status': 'PENDING',
      ':reason': reason,
      ':updatedAt': timestamp,
    },
    ReturnValues: 'ALL_NEW',
  }));

  return result.Attributes;
}

async function approveInvestment(investmentId, identity) {
  const timestamp = now();

  const result = await docClient.send(new UpdateCommand({
    TableName: TABLES.investments,
    Key: { investmentId },
    UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: {
      ':status': 'FUNDS_PENDING',
      ':updatedAt': timestamp,
    },
    ReturnValues: 'ALL_NEW',
  }));

  return result.Attributes;
}

async function completeInvestment(investmentId, identity) {
  const timestamp = now();

  const result = await docClient.send(new UpdateCommand({
    TableName: TABLES.investments,
    Key: { investmentId },
    UpdateExpression: 'SET #status = :status, completedAt = :completedAt, updatedAt = :updatedAt',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: {
      ':status': 'ACTIVE',
      ':completedAt': timestamp,
      ':updatedAt': timestamp,
    },
    ReturnValues: 'ALL_NEW',
  }));

  const investment = result.Attributes;

  // Notify investor
  await createNotification({
    userId: null,
    orgId: investment.investorOrgId,
    type: 'SUCCESS',
    title: 'Investment Completed',
    message: `Your investment ${investment.txnRef} is now active. Expected return: ${formatCurrency(investment.expectedReturn, investment.currency)}`,
    link: '/investor/investments',
  });

  return investment;
}

async function cancelInvestment(investmentId, reason, identity) {
  const timestamp = now();

  const result = await docClient.send(new UpdateCommand({
    TableName: TABLES.investments,
    Key: { investmentId },
    UpdateExpression: 'SET #status = :status, cancelReason = :reason, updatedAt = :updatedAt',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: {
      ':status': 'CANCELLED',
      ':reason': reason,
      ':updatedAt': timestamp,
    },
    ReturnValues: 'ALL_NEW',
  }));

  return result.Attributes;
}

async function updateInvestment(investmentId, amount, identity) {
  const timestamp = now();

  const result = await docClient.send(new UpdateCommand({
    TableName: TABLES.investments,
    Key: { investmentId },
    UpdateExpression: 'SET amount = :amount, updatedAt = :updatedAt',
    ExpressionAttributeValues: {
      ':amount': amount,
      ':updatedAt': timestamp,
    },
    ReturnValues: 'ALL_NEW',
  }));

  return result.Attributes;
}

// ============================================
// MOBILE LOAN OPERATIONS
// ============================================

async function getMobileLoan(loanId) {
  const result = await docClient.send(new GetCommand({
    TableName: TABLES.mobileLoans,
    Key: { loanId },
  }));
  return result.Item || null;
}

async function listMobileLoansByBank(bankOrgId, status, pagination = {}) {
  let params;

  if (status) {
    params = {
      TableName: TABLES.mobileLoans,
      IndexName: 'byStatus',
      KeyConditionExpression: '#status = :status',
      FilterExpression: 'bankOrgId = :bankOrgId',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':status': status, ':bankOrgId': bankOrgId },
      ScanIndexForward: false,
      Limit: pagination.limit || 20,
    };
  } else {
    params = {
      TableName: TABLES.mobileLoans,
      IndexName: 'byBank',
      KeyConditionExpression: 'bankOrgId = :bankOrgId',
      ExpressionAttributeValues: { ':bankOrgId': bankOrgId },
      ScanIndexForward: false,
      Limit: pagination.limit || 20,
    };
  }

  if (pagination.nextToken) {
    params.ExclusiveStartKey = JSON.parse(Buffer.from(pagination.nextToken, 'base64').toString());
  }

  const result = await docClient.send(new QueryCommand(params));

  return {
    items: result.Items || [],
    nextToken: result.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      : null,
    totalCount: result.Count,
  };
}

async function listMobileLoansByBorrower(borrowerPhone, pagination = {}) {
  const params = {
    TableName: TABLES.mobileLoans,
    IndexName: 'byBorrower',
    KeyConditionExpression: 'borrowerPhone = :borrowerPhone',
    ExpressionAttributeValues: { ':borrowerPhone': borrowerPhone },
    ScanIndexForward: false,
    Limit: pagination.limit || 20,
  };

  if (pagination.nextToken) {
    params.ExclusiveStartKey = JSON.parse(Buffer.from(pagination.nextToken, 'base64').toString());
  }

  const result = await docClient.send(new QueryCommand(params));

  return {
    items: result.Items || [],
    nextToken: result.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      : null,
    totalCount: result.Count,
  };
}

async function createMobileLoan(input, identity) {
  const loanId = generateId();
  const loanRef = generateTxnRef('LOAN');
  const timestamp = now();

  // Calculate due date
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + input.term);

  const item = {
    loanId,
    loanRef,
    ...input,
    status: 'PENDING',
    amountPaid: 0,
    amountOutstanding: input.amount * (1 + input.interestRate / 100),
    dueDate: dueDate.toISOString(),
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy: identity?.sub,
  };

  await docClient.send(new PutCommand({
    TableName: TABLES.mobileLoans,
    Item: item,
  }));

  await createAuditLog({
    userId: identity?.sub,
    orgId: input.bankOrgId,
    action: 'CREATE',
    entityType: 'MobileLoan',
    entityId: loanId,
    newValue: item,
  });

  return item;
}

async function approveMobileLoan(loanId, identity) {
  const timestamp = now();

  const result = await docClient.send(new UpdateCommand({
    TableName: TABLES.mobileLoans,
    Key: { loanId },
    UpdateExpression: 'SET #status = :status, approvedAt = :approvedAt, approvedBy = :approvedBy, updatedAt = :updatedAt',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: {
      ':status': 'APPROVED',
      ':approvedAt': timestamp,
      ':approvedBy': identity?.sub,
      ':updatedAt': timestamp,
    },
    ReturnValues: 'ALL_NEW',
  }));

  return result.Attributes;
}

async function rejectMobileLoan(loanId, reason, identity) {
  const timestamp = now();

  const result = await docClient.send(new UpdateCommand({
    TableName: TABLES.mobileLoans,
    Key: { loanId },
    UpdateExpression: 'SET #status = :status, rejectReason = :reason, updatedAt = :updatedAt',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: {
      ':status': 'REJECTED',
      ':reason': reason,
      ':updatedAt': timestamp,
    },
    ReturnValues: 'ALL_NEW',
  }));

  return result.Attributes;
}

async function disburseMobileLoan(loanId, identity) {
  const timestamp = now();

  const result = await docClient.send(new UpdateCommand({
    TableName: TABLES.mobileLoans,
    Key: { loanId },
    UpdateExpression: 'SET #status = :status, disbursedAt = :disbursedAt, updatedAt = :updatedAt',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: {
      ':status': 'DISBURSED',
      ':disbursedAt': timestamp,
      ':updatedAt': timestamp,
    },
    ReturnValues: 'ALL_NEW',
  }));

  return result.Attributes;
}

async function recordLoanPayment(input, identity) {
  const loan = await getMobileLoan(input.loanId);

  if (!loan) {
    throw new Error('Loan not found');
  }

  const timestamp = now();
  const newAmountPaid = loan.amountPaid + input.amount;
  const newAmountOutstanding = loan.amountOutstanding - input.amount;
  const newStatus = newAmountOutstanding <= 0 ? 'SETTLED' : loan.status;

  // Create payment record
  const paymentId = generateId();
  await docClient.send(new PutCommand({
    TableName: TABLES.payments,
    Item: {
      paymentId,
      paymentRef: generateTxnRef('PAY'),
      type: 'MPESA_REPAYMENT',
      status: 'COMPLETED',
      loanId: input.loanId,
      orgId: loan.bankOrgId,
      amount: input.amount,
      currency: loan.currency,
      mpesaRef: input.mpesaRef,
      mpesaPhone: input.mpesaPhone || loan.borrowerPhone,
      createdAt: timestamp,
      updatedAt: timestamp,
      completedAt: timestamp,
    },
  }));

  // Update loan
  const result = await docClient.send(new UpdateCommand({
    TableName: TABLES.mobileLoans,
    Key: { loanId: input.loanId },
    UpdateExpression: 'SET #status = :status, amountPaid = :amountPaid, amountOutstanding = :amountOutstanding, updatedAt = :updatedAt' + (newStatus === 'SETTLED' ? ', settledAt = :settledAt' : ''),
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: {
      ':status': newStatus,
      ':amountPaid': newAmountPaid,
      ':amountOutstanding': Math.max(0, newAmountOutstanding),
      ':updatedAt': timestamp,
      ...(newStatus === 'SETTLED' ? { ':settledAt': timestamp } : {}),
    },
    ReturnValues: 'ALL_NEW',
  }));

  return result.Attributes;
}

async function writeOffLoan(loanId, reason, identity) {
  const timestamp = now();

  const result = await docClient.send(new UpdateCommand({
    TableName: TABLES.mobileLoans,
    Key: { loanId },
    UpdateExpression: 'SET #status = :status, writeOffReason = :reason, updatedAt = :updatedAt',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: {
      ':status': 'WRITTEN_OFF',
      ':reason': reason,
      ':updatedAt': timestamp,
    },
    ReturnValues: 'ALL_NEW',
  }));

  return result.Attributes;
}

// ============================================
// METRICS OPERATIONS
// ============================================

async function getPlatformMetrics() {
  // In production, this would aggregate from the metrics table
  // For now, compute on-the-fly
  const [orgs, calls, loans] = await Promise.all([
    listOrganizations(null, { limit: 100 }),
    listCapitalCalls({ limit: 100 }),
    docClient.send(new ScanCommand({ TableName: TABLES.mobileLoans, Limit: 1000 })),
  ]);

  const banks = orgs.items.filter(o => o.orgType === 'BANK');
  const investors = orgs.items.filter(o => o.orgType === 'INVESTOR');

  const totalCapitalDeployed = calls.items
    .filter(c => c.status === 'COMPLETED')
    .reduce((sum, c) => sum + (c.subscribed || 0), 0);

  const totalLoanVolume = (loans.Items || [])
    .reduce((sum, l) => sum + (l.amount || 0), 0);

  const activeLoans = (loans.Items || [])
    .filter(l => ['DISBURSED', 'CURRENT', 'OVERDUE'].includes(l.status));

  return {
    totalCapitalDeployed,
    totalInvestors: investors.length,
    totalBanks: banks.length,
    totalActiveLoans: activeLoans.length,
    totalLoanVolume,
    avgPlatformYield: 31.2, // Would be calculated from actual data
    monthlyRevenue: 125000,
    monthlyGrowth: 18.5,
    capitalByMonth: generateMonthlyData('capital'),
    revenueByMonth: generateMonthlyData('revenue'),
    lastUpdated: now(),
  };
}

async function getBankMetrics(orgId) {
  const loans = await listMobileLoansByBank(orgId, null, { limit: 1000 });
  const loanItems = loans.items;

  const activeLoans = loanItems.filter(l => ['DISBURSED', 'CURRENT', 'OVERDUE'].includes(l.status));
  const overdueLoans = loanItems.filter(l => l.status === 'OVERDUE');
  const defaultedLoans = loanItems.filter(l => l.status === 'DEFAULTED');

  const totalVolume = activeLoans.reduce((sum, l) => sum + (l.amount || 0), 0);
  const avgLoanSize = activeLoans.length > 0 ? totalVolume / activeLoans.length : 0;

  return {
    orgId,
    totalCapital: 2500000, // Would come from actual data
    activeLoans: activeLoans.length,
    loanVolume: totalVolume,
    monthlyYield: 32.4,
    nplRate: loanItems.length > 0 ? ((overdueLoans.length + defaultedLoans.length) / loanItems.length * 100).toFixed(1) : 0,
    avgLoanSize: Math.round(avgLoanSize),
    disbursementsToday: 45, // Would be calculated
    collectionsToday: 78,
    loanStatusDistribution: [
      { status: 'Current', count: activeLoans.filter(l => l.status === 'CURRENT' || l.status === 'DISBURSED').length, pct: 85 },
      { status: 'Overdue', count: overdueLoans.length, pct: 10 },
      { status: 'Defaulted', count: defaultedLoans.length, pct: 5 },
    ],
    weeklyDisbursements: generateWeeklyData(),
    lastUpdated: now(),
  };
}

async function getInvestorMetrics(orgId) {
  const investments = await listInvestmentsByInvestor(orgId, { limit: 100 });
  const investmentItems = investments.items;

  const activeInvestments = investmentItems.filter(i => i.status === 'ACTIVE');
  const totalInvested = activeInvestments.reduce((sum, i) => sum + (i.amount || 0), 0);

  return {
    orgId,
    totalInvested,
    activeInstruments: activeInvestments.length,
    avgYield: 12.5,
    portfolioGrowth: 8.2,
    pendingMaturity: investmentItems.filter(i => {
      const maturityDate = new Date(i.maturityDate);
      const daysToMaturity = Math.ceil((maturityDate - new Date()) / (1000 * 60 * 60 * 24));
      return daysToMaturity > 0 && daysToMaturity <= 30;
    }).length,
    portfolioByBank: [
      { bank: 'Equity Africa Bank', bankId: 'bank-001', amount: 2100000 },
      { bank: 'Kilimanjaro Microfinance', bankId: 'bank-002', amount: 1800000 },
      { bank: 'Rwanda Digital Bank', bankId: 'bank-003', amount: 1300000 },
    ],
    yieldHistory: generateYieldHistory(),
    lastUpdated: now(),
  };
}

async function refreshPlatformMetrics() {
  return await getPlatformMetrics();
}

async function refreshBankMetrics(orgId) {
  return await getBankMetrics(orgId);
}

// ============================================
// NOTIFICATION OPERATIONS
// ============================================

async function createNotification(input) {
  const notificationId = generateId();
  const timestamp = now();

  const item = {
    notificationId,
    ...input,
    read: false,
    createdAt: timestamp,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days TTL
    ttl: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
  };

  await docClient.send(new PutCommand({
    TableName: TABLES.notifications,
    Item: item,
  }));

  return item;
}

async function notifyAllInvestors(notification) {
  const investors = await listOrganizations('INVESTOR', { limit: 100 });

  for (const investor of investors.items) {
    await createNotification({
      ...notification,
      orgId: investor.orgId,
    });
  }
}

async function listNotifications(userId, unreadOnly, pagination = {}) {
  const params = {
    TableName: TABLES.notifications,
    IndexName: 'byUser',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': userId },
    ScanIndexForward: false,
    Limit: pagination.limit || 20,
  };

  if (unreadOnly) {
    params.FilterExpression = '#read = :read';
    params.ExpressionAttributeNames = { '#read': 'read' };
    params.ExpressionAttributeValues[':read'] = false;
  }

  if (pagination.nextToken) {
    params.ExclusiveStartKey = JSON.parse(Buffer.from(pagination.nextToken, 'base64').toString());
  }

  const result = await docClient.send(new QueryCommand(params));

  const unreadCount = (result.Items || []).filter(n => !n.read).length;

  return {
    items: result.Items || [],
    nextToken: result.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      : null,
    unreadCount,
  };
}

async function markNotificationRead(notificationId) {
  const timestamp = now();

  const result = await docClient.send(new UpdateCommand({
    TableName: TABLES.notifications,
    Key: { notificationId },
    UpdateExpression: 'SET #read = :read, readAt = :readAt',
    ExpressionAttributeNames: { '#read': 'read' },
    ExpressionAttributeValues: { ':read': true, ':readAt': timestamp },
    ReturnValues: 'ALL_NEW',
  }));

  return result.Attributes;
}

async function markAllNotificationsRead(userId) {
  const notifications = await listNotifications(userId, true, { limit: 100 });

  for (const notif of notifications.items) {
    await markNotificationRead(notif.notificationId);
  }

  return true;
}

// ============================================
// AUDIT LOG OPERATIONS
// ============================================

async function createAuditLog(input) {
  const logId = generateId();
  const timestamp = now();

  const item = {
    logId,
    ...input,
    timestamp,
    ttl: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60, // 1 year TTL
  };

  await docClient.send(new PutCommand({
    TableName: TABLES.auditLogs,
    Item: item,
  }));

  return item;
}

async function listAuditLogs(orgId, userId, action, dateRange, pagination = {}) {
  let params;

  if (userId) {
    params = {
      TableName: TABLES.auditLogs,
      IndexName: 'byUser',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId },
    };
  } else if (orgId) {
    params = {
      TableName: TABLES.auditLogs,
      IndexName: 'byOrganization',
      KeyConditionExpression: 'orgId = :orgId',
      ExpressionAttributeValues: { ':orgId': orgId },
    };
  } else {
    params = {
      TableName: TABLES.auditLogs,
    };
  }

  params.ScanIndexForward = false;
  params.Limit = pagination.limit || 50;

  if (pagination.nextToken) {
    params.ExclusiveStartKey = JSON.parse(Buffer.from(pagination.nextToken, 'base64').toString());
  }

  const result = params.KeyConditionExpression
    ? await docClient.send(new QueryCommand(params))
    : await docClient.send(new ScanCommand(params));

  return {
    items: result.Items || [],
    nextToken: result.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      : null,
    totalCount: result.Count,
  };
}

// ============================================
// SEED DATA
// ============================================

async function seedDemoData() {
  const timestamp = now();

  // Create ForwardsFlow org (platform)
  const forwardsflowOrg = {
    orgId: 'forwardsflow-platform',
    orgType: 'PLATFORM',
    name: 'ForwardsFlow',
    email: 'admin@forwardsflow.com',
    country: 'KE',
    status: 'ACTIVE',
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  // Create demo banks
  const banks = [
    {
      orgId: 'bank-equity-africa',
      orgType: 'BANK',
      name: 'Equity Africa Bank',
      email: 'corporate@equityafrica.com',
      country: 'KE',
      institutionType: 'commercial_bank',
      moodysRating: 'B1',
      status: 'ACTIVE',
      swiftCode: 'EABORBI',
      totalCapital: 2500000,
      activeLoans: 847,
      adminCount: 1,
      userCount: 4,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      orgId: 'bank-dtb',
      orgType: 'BANK',
      name: 'Diamond Trust Bank',
      email: 'corporate@dtbafrica.com',
      country: 'KE',
      institutionType: 'commercial_bank',
      moodysRating: 'B2',
      status: 'ACTIVE',
      swiftCode: 'DABORBI',
      totalCapital: 1800000,
      activeLoans: 523,
      adminCount: 1,
      userCount: 3,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  // Create demo investors
  const investors = [
    {
      orgId: 'inv-shell-foundation',
      orgType: 'INVESTOR',
      name: 'Shell Foundation',
      email: 'investments@shellfoundation.org',
      country: 'GB',
      institutionType: 'impact_fund',
      status: 'ACTIVE',
      aum: 500000000,
      investmentFocus: ['financial_inclusion', 'clean_energy', 'agriculture'],
      totalInvested: 5200000,
      activeInvestments: 8,
      adminCount: 1,
      userCount: 2,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      orgId: 'inv-impact-capital',
      orgType: 'INVESTOR',
      name: 'Impact Capital Partners',
      email: 'contact@impactcapital.com',
      country: 'US',
      institutionType: 'impact_fund',
      status: 'ACTIVE',
      aum: 250000000,
      investmentFocus: ['microfinance', 'sme_lending'],
      totalInvested: 3800000,
      activeInvestments: 5,
      adminCount: 1,
      userCount: 2,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  // Create demo users with 8 roles
  const users = [
    // ForwardsFlow Admin
    {
      userId: 'user-ff-admin',
      email: 'admin@forwardsflow.com',
      name: 'System Administrator',
      role: 'FORWARDSFLOW_ADMIN',
      orgId: 'forwardsflow-platform',
      jobRole: 'Platform Administrator',
      status: 'ACTIVE',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    // Bank Admin - Equity
    {
      userId: 'user-equity-admin',
      email: 'admin@equityafrica.com',
      name: 'Amoroso Gombe',
      role: 'BANK_ADMIN',
      orgId: 'bank-equity-africa',
      jobRole: 'Treasury Director',
      status: 'ACTIVE',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    // Bank Lender - Equity
    {
      userId: 'user-equity-lender',
      email: 'lending@equityafrica.com',
      name: 'Grace Mwangi',
      role: 'BANK_LENDER',
      orgId: 'bank-equity-africa',
      jobRole: 'Mobile Lending Manager',
      status: 'ACTIVE',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    // Bank Caller - Equity
    {
      userId: 'user-equity-caller',
      email: 'calling@equityafrica.com',
      name: 'James Ochieng',
      role: 'BANK_CALLER',
      orgId: 'bank-equity-africa',
      jobRole: 'Capital Markets Officer',
      status: 'ACTIVE',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    // Bank Compliance - Equity
    {
      userId: 'user-equity-compliance',
      email: 'compliance@equityafrica.com',
      name: 'Sarah Kimani',
      role: 'BANK_COMPLIANCE',
      orgId: 'bank-equity-africa',
      jobRole: 'Compliance Officer',
      status: 'ACTIVE',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    // Bank Risk - Equity
    {
      userId: 'user-equity-risk',
      email: 'risk@equityafrica.com',
      name: 'Peter Njoroge',
      role: 'BANK_RISK',
      orgId: 'bank-equity-africa',
      jobRole: 'Credit Risk Manager',
      status: 'ACTIVE',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    // Investor Admin - Shell Foundation
    {
      userId: 'user-shell-admin',
      email: 'admin@shellfoundation.org',
      name: 'Mathieu Fournier',
      role: 'INVESTOR_ADMIN',
      orgId: 'inv-shell-foundation',
      jobRole: 'Investment Director',
      status: 'ACTIVE',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    // Investor Analyst - Shell Foundation
    {
      userId: 'user-shell-analyst',
      email: 'analyst@shellfoundation.org',
      name: 'Emily Chen',
      role: 'INVESTOR_ANALYST',
      orgId: 'inv-shell-foundation',
      jobRole: 'Investment Analyst',
      status: 'ACTIVE',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    // Investor Admin - Impact Capital
    {
      userId: 'user-impact-admin',
      email: 'admin@impactcapital.com',
      name: 'Sarah Chen',
      role: 'INVESTOR_ADMIN',
      orgId: 'inv-impact-capital',
      jobRole: 'Managing Director',
      status: 'ACTIVE',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    // Investor Analyst - Impact Capital
    {
      userId: 'user-impact-analyst',
      email: 'analyst@impactcapital.com',
      name: 'Michael Torres',
      role: 'INVESTOR_ANALYST',
      orgId: 'inv-impact-capital',
      jobRole: 'Investment Analyst',
      status: 'ACTIVE',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  // Create demo capital calls
  const capitalCalls = [
    {
      callId: 'call-001',
      txnRef: 'CALL-2024-00001',
      bankOrgId: 'bank-equity-africa',
      amount: 10000000,
      currency: 'USD',
      targetCurrency: 'KES',
      maturityMonths: 12,
      interestRate: 15.0,
      fxSpread: 1.0,
      hedgingFee: 2.0,
      currentFxRate: 153.50,
      hedgedFxRate: 156.57,
      projectedYield: 12.0,
      status: 'PUBLISHED',
      subscribed: 0,
      subscribedPct: 0,
      intendedUse: 'Mobile Lending Deployment',
      createdAt: timestamp,
      updatedAt: timestamp,
      publishedAt: timestamp,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      callId: 'call-002',
      txnRef: 'CALL-2024-00002',
      bankOrgId: 'bank-dtb',
      amount: 5000000,
      currency: 'USD',
      targetCurrency: 'KES',
      maturityMonths: 6,
      interestRate: 12.5,
      fxSpread: 1.0,
      hedgingFee: 1.5,
      currentFxRate: 153.50,
      hedgedFxRate: 155.80,
      projectedYield: 10.0,
      status: 'PUBLISHED',
      subscribed: 2000000,
      subscribedPct: 40,
      intendedUse: 'SME Lending Program',
      createdAt: timestamp,
      updatedAt: timestamp,
      publishedAt: timestamp,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Create demo mobile loans
  const mobileLoans = [
    {
      loanId: 'loan-001',
      loanRef: 'LOAN-2024-00001',
      bankOrgId: 'bank-equity-africa',
      borrowerPhone: '+254712345678',
      borrowerName: 'John Kamau',
      amount: 15000,
      currency: 'KES',
      interestRate: 18,
      term: 30,
      status: 'CURRENT',
      amountPaid: 8500,
      amountOutstanding: 9200,
      creditScore: 720,
      disbursedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      loanId: 'loan-002',
      loanRef: 'LOAN-2024-00002',
      bankOrgId: 'bank-equity-africa',
      borrowerPhone: '+254723456789',
      borrowerName: 'Mary Wanjiku',
      amount: 25000,
      currency: 'KES',
      interestRate: 16,
      term: 60,
      status: 'CURRENT',
      amountPaid: 12000,
      amountOutstanding: 17000,
      creditScore: 780,
      disbursedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      loanId: 'loan-003',
      loanRef: 'LOAN-2024-00003',
      bankOrgId: 'bank-equity-africa',
      borrowerPhone: '+254734567890',
      borrowerName: 'Peter Ochieng',
      amount: 8000,
      currency: 'KES',
      interestRate: 20,
      term: 14,
      status: 'OVERDUE',
      amountPaid: 2000,
      amountOutstanding: 7600,
      creditScore: 580,
      daysOverdue: 6,
      disbursedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  // Write all data to DynamoDB
  try {
    // Organizations
    await docClient.send(new PutCommand({ TableName: TABLES.organizations, Item: forwardsflowOrg }));
    for (const bank of banks) {
      await docClient.send(new PutCommand({ TableName: TABLES.organizations, Item: bank }));
    }
    for (const investor of investors) {
      await docClient.send(new PutCommand({ TableName: TABLES.organizations, Item: investor }));
    }

    // Users
    for (const user of users) {
      await docClient.send(new PutCommand({ TableName: TABLES.users, Item: user }));
    }

    // Capital Calls
    for (const call of capitalCalls) {
      await docClient.send(new PutCommand({ TableName: TABLES.capitalCalls, Item: call }));
    }

    // Mobile Loans
    for (const loan of mobileLoans) {
      await docClient.send(new PutCommand({ TableName: TABLES.mobileLoans, Item: loan }));
    }

    console.log('Demo data seeded successfully');
    return true;
  } catch (error) {
    console.error('Error seeding demo data:', error);
    throw error;
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatCurrency(amount, currency) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount);
}

function generateMonthlyData(type) {
  const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
  const baseValues = type === 'capital'
    ? [8500000, 9200000, 10800000, 12500000, 14200000, 16950000]
    : [65000, 78000, 92000, 105000, 118000, 125000];

  return months.map((month, idx) => ({
    month,
    value: baseValues[idx],
  }));
}

function generateWeeklyData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const amounts = [450000, 520000, 380000, 610000, 490000, 280000, 120000];

  return days.map((day, idx) => ({
    day,
    amount: amounts[idx],
  }));
}

function generateYieldHistory() {
  const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
  const yields = [11.2, 11.8, 12.1, 12.3, 12.4, 12.5];

  return months.map((month, idx) => ({
    month,
    value: yields[idx],
  }));
}
