import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class ForwardsFlowDatabaseStack extends cdk.Stack {
  public readonly organizationsTable: dynamodb.Table;
  public readonly usersTable: dynamodb.Table;
  public readonly capitalCallsTable: dynamodb.Table;
  public readonly investmentsTable: dynamodb.Table;
  public readonly mobileLoansTable: dynamodb.Table;
  public readonly paymentsTable: dynamodb.Table;
  public readonly metricsTable: dynamodb.Table;
  public readonly auditLogsTable: dynamodb.Table;
  public readonly notificationsTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ============================================
    // ORGANIZATIONS TABLE (Tenants: Banks & Investors)
    // ============================================
    this.organizationsTable = new dynamodb.Table(this, 'OrganizationsTable', {
      tableName: 'ForwardsFlow-Organizations',
      partitionKey: { name: 'orgId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    // GSI: Query by organization type (bank/investor)
    this.organizationsTable.addGlobalSecondaryIndex({
      indexName: 'byType',
      partitionKey: { name: 'orgType', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI: Query by status
    this.organizationsTable.addGlobalSecondaryIndex({
      indexName: 'byStatus',
      partitionKey: { name: 'status', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'orgType', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // ============================================
    // USERS TABLE (All platform users with roles)
    // ============================================
    this.usersTable = new dynamodb.Table(this, 'UsersTable', {
      tableName: 'ForwardsFlow-Users',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    // GSI: Query by email (for login)
    this.usersTable.addGlobalSecondaryIndex({
      indexName: 'byEmail',
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI: Query by organization
    this.usersTable.addGlobalSecondaryIndex({
      indexName: 'byOrganization',
      partitionKey: { name: 'orgId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'role', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI: Query by role (platform-wide)
    this.usersTable.addGlobalSecondaryIndex({
      indexName: 'byRole',
      partitionKey: { name: 'role', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // ============================================
    // CAPITAL CALLS TABLE (Deposit instruments/calls)
    // ============================================
    this.capitalCallsTable = new dynamodb.Table(this, 'CapitalCallsTable', {
      tableName: 'ForwardsFlow-CapitalCalls',
      partitionKey: { name: 'callId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    // GSI: Query by issuing bank
    this.capitalCallsTable.addGlobalSecondaryIndex({
      indexName: 'byBank',
      partitionKey: { name: 'bankOrgId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI: Query by status (for investors browsing opportunities)
    this.capitalCallsTable.addGlobalSecondaryIndex({
      indexName: 'byStatus',
      partitionKey: { name: 'status', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI: Query by transaction reference
    this.capitalCallsTable.addGlobalSecondaryIndex({
      indexName: 'byTxnRef',
      partitionKey: { name: 'txnRef', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // ============================================
    // INVESTMENTS TABLE (Investor positions in calls)
    // ============================================
    this.investmentsTable = new dynamodb.Table(this, 'InvestmentsTable', {
      tableName: 'ForwardsFlow-Investments',
      partitionKey: { name: 'investmentId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    // GSI: Query by investor organization
    this.investmentsTable.addGlobalSecondaryIndex({
      indexName: 'byInvestor',
      partitionKey: { name: 'investorOrgId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI: Query by capital call
    this.investmentsTable.addGlobalSecondaryIndex({
      indexName: 'byCapitalCall',
      partitionKey: { name: 'callId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'status', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI: Query by status
    this.investmentsTable.addGlobalSecondaryIndex({
      indexName: 'byStatus',
      partitionKey: { name: 'status', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'maturityDate', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // ============================================
    // MOBILE LOANS TABLE (WhatsApp lending)
    // ============================================
    this.mobileLoansTable = new dynamodb.Table(this, 'MobileLoansTable', {
      tableName: 'ForwardsFlow-MobileLoans',
      partitionKey: { name: 'loanId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    // GSI: Query by bank
    this.mobileLoansTable.addGlobalSecondaryIndex({
      indexName: 'byBank',
      partitionKey: { name: 'bankOrgId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI: Query by borrower phone
    this.mobileLoansTable.addGlobalSecondaryIndex({
      indexName: 'byBorrower',
      partitionKey: { name: 'borrowerPhone', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI: Query by status
    this.mobileLoansTable.addGlobalSecondaryIndex({
      indexName: 'byStatus',
      partitionKey: { name: 'status', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'dueDate', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // ============================================
    // PAYMENTS TABLE (MPESA, settlements, etc.)
    // ============================================
    this.paymentsTable = new dynamodb.Table(this, 'PaymentsTable', {
      tableName: 'ForwardsFlow-Payments',
      partitionKey: { name: 'paymentId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    // GSI: Query by loan
    this.paymentsTable.addGlobalSecondaryIndex({
      indexName: 'byLoan',
      partitionKey: { name: 'loanId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI: Query by investment
    this.paymentsTable.addGlobalSecondaryIndex({
      indexName: 'byInvestment',
      partitionKey: { name: 'investmentId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI: Query by MPESA reference
    this.paymentsTable.addGlobalSecondaryIndex({
      indexName: 'byMpesaRef',
      partitionKey: { name: 'mpesaRef', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // ============================================
    // METRICS TABLE (Aggregated KPIs)
    // ============================================
    this.metricsTable = new dynamodb.Table(this, 'MetricsTable', {
      tableName: 'ForwardsFlow-Metrics',
      partitionKey: { name: 'metricId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'periodDate', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      timeToLiveAttribute: 'ttl',
    });

    // GSI: Query by organization
    this.metricsTable.addGlobalSecondaryIndex({
      indexName: 'byOrganization',
      partitionKey: { name: 'orgId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'periodDate', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI: Query by metric type
    this.metricsTable.addGlobalSecondaryIndex({
      indexName: 'byMetricType',
      partitionKey: { name: 'metricType', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'periodDate', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // ============================================
    // AUDIT LOGS TABLE (Compliance trail)
    // ============================================
    this.auditLogsTable = new dynamodb.Table(this, 'AuditLogsTable', {
      tableName: 'ForwardsFlow-AuditLogs',
      partitionKey: { name: 'logId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      timeToLiveAttribute: 'ttl',
    });

    // GSI: Query by user
    this.auditLogsTable.addGlobalSecondaryIndex({
      indexName: 'byUser',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI: Query by organization
    this.auditLogsTable.addGlobalSecondaryIndex({
      indexName: 'byOrganization',
      partitionKey: { name: 'orgId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI: Query by action type
    this.auditLogsTable.addGlobalSecondaryIndex({
      indexName: 'byAction',
      partitionKey: { name: 'action', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // ============================================
    // NOTIFICATIONS TABLE (Real-time alerts)
    // ============================================
    this.notificationsTable = new dynamodb.Table(this, 'NotificationsTable', {
      tableName: 'ForwardsFlow-Notifications',
      partitionKey: { name: 'notificationId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      timeToLiveAttribute: 'ttl',
    });

    // GSI: Query by user
    this.notificationsTable.addGlobalSecondaryIndex({
      indexName: 'byUser',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI: Query by organization
    this.notificationsTable.addGlobalSecondaryIndex({
      indexName: 'byOrganization',
      partitionKey: { name: 'orgId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // ============================================
    // OUTPUTS
    // ============================================
    new cdk.CfnOutput(this, 'OrganizationsTableName', {
      value: this.organizationsTable.tableName,
      exportName: 'ForwardsFlow-OrganizationsTable',
    });

    new cdk.CfnOutput(this, 'UsersTableName', {
      value: this.usersTable.tableName,
      exportName: 'ForwardsFlow-UsersTable',
    });

    new cdk.CfnOutput(this, 'CapitalCallsTableName', {
      value: this.capitalCallsTable.tableName,
      exportName: 'ForwardsFlow-CapitalCallsTable',
    });

    new cdk.CfnOutput(this, 'InvestmentsTableName', {
      value: this.investmentsTable.tableName,
      exportName: 'ForwardsFlow-InvestmentsTable',
    });

    new cdk.CfnOutput(this, 'MobileLoansTableName', {
      value: this.mobileLoansTable.tableName,
      exportName: 'ForwardsFlow-MobileLoansTable',
    });

    new cdk.CfnOutput(this, 'PaymentsTableName', {
      value: this.paymentsTable.tableName,
      exportName: 'ForwardsFlow-PaymentsTable',
    });

    new cdk.CfnOutput(this, 'MetricsTableName', {
      value: this.metricsTable.tableName,
      exportName: 'ForwardsFlow-MetricsTable',
    });

    new cdk.CfnOutput(this, 'AuditLogsTableName', {
      value: this.auditLogsTable.tableName,
      exportName: 'ForwardsFlow-AuditLogsTable',
    });

    new cdk.CfnOutput(this, 'NotificationsTableName', {
      value: this.notificationsTable.tableName,
      exportName: 'ForwardsFlow-NotificationsTable',
    });
  }
}
