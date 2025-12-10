// forwardsflow-stack.ts - CDK Infrastructure for ForwardsFlow
// Place in: amplify/backend/custom/forwardsflow-infra/cdk-stack.ts

import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class ForwardsFlowStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ==========================================
    // DYNAMODB TABLES
    // ==========================================

    // Tenants Table
    const tenantsTable = new dynamodb.Table(this, 'TenantsTable', {
      tableName: 'forwardsflow-tenants',
      partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    // Users Table
    const usersTable = new dynamodb.Table(this, 'UsersTable', {
      tableName: 'forwardsflow-users',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    // GSI for email lookup
    usersTable.addGlobalSecondaryIndex({
      indexName: 'users-by-email-index',
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Deposit Calls Table
    const depositCallsTable = new dynamodb.Table(this, 'DepositCallsTable', {
      tableName: 'forwardsflow-deposit-calls',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    // GSI for calls by status
    depositCallsTable.addGlobalSecondaryIndex({
      indexName: 'calls-by-status-index',
      partitionKey: { name: 'status', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Investor Bids Table
    const investorBidsTable = new dynamodb.Table(this, 'InvestorBidsTable', {
      tableName: 'forwardsflow-investor-bids',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Loan Applications Table
    const loanApplicationsTable = new dynamodb.Table(this, 'LoanApplicationsTable', {
      tableName: 'forwardsflow-loan-applications',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    // GSI for applications by status
    loanApplicationsTable.addGlobalSecondaryIndex({
      indexName: 'applications-by-status-index',
      partitionKey: { name: 'status', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Loans Table
    const loansTable = new dynamodb.Table(this, 'LoansTable', {
      tableName: 'forwardsflow-loans',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    // GSI for loans by status
    loansTable.addGlobalSecondaryIndex({
      indexName: 'loans-by-status-index',
      partitionKey: { name: 'status', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Loan Repayments Table
    const loanRepaymentsTable = new dynamodb.Table(this, 'LoanRepaymentsTable', {
      tableName: 'forwardsflow-loan-repayments',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Borrowers Table
    const borrowersTable = new dynamodb.Table(this, 'BorrowersTable', {
      tableName: 'forwardsflow-borrowers',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    // Settlements Table
    const settlementsTable = new dynamodb.Table(this, 'SettlementsTable', {
      tableName: 'forwardsflow-settlements',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    });

    // KYC Records Table
    const kycRecordsTable = new dynamodb.Table(this, 'KYCRecordsTable', {
      tableName: 'forwardsflow-kyc-records',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // AML Alerts Table
    const amlAlertsTable = new dynamodb.Table(this, 'AMLAlertsTable', {
      tableName: 'forwardsflow-aml-alerts',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // GSI for AML by status
    amlAlertsTable.addGlobalSecondaryIndex({
      indexName: 'aml-by-status-index',
      partitionKey: { name: 'status', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'severity', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Audit Logs Table
    const auditLogsTable = new dynamodb.Table(this, 'AuditLogsTable', {
      tableName: 'forwardsflow-audit-logs',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      timeToLiveAttribute: 'ttl', // Auto-expire old logs
    });

    // Platform Metrics Table
    const platformMetricsTable = new dynamodb.Table(this, 'PlatformMetricsTable', {
      tableName: 'forwardsflow-platform-metrics',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Tenant Metrics Table
    const tenantMetricsTable = new dynamodb.Table(this, 'TenantMetricsTable', {
      tableName: 'forwardsflow-tenant-metrics',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // ==========================================
    // LAMBDA FUNCTIONS
    // ==========================================

    // Create IAM role for Lambda
    const lambdaRole = new iam.Role(this, 'ForwardsFlowLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });

    // Grant DynamoDB access
    const allTables = [
      tenantsTable, usersTable, depositCallsTable, investorBidsTable,
      loanApplicationsTable, loansTable, loanRepaymentsTable, borrowersTable,
      settlementsTable, kycRecordsTable, amlAlertsTable, auditLogsTable,
      platformMetricsTable, tenantMetricsTable
    ];

    allTables.forEach(table => {
      table.grantReadWriteData(lambdaRole);
    });

    // API Lambda Function
    const apiHandler = new lambda.Function(this, 'ForwardsFlowAPIHandler', {
      functionName: 'forwardsflow-api-handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        // Placeholder - will be replaced with actual code
        exports.handler = async (event) => {
          return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'ForwardsFlow API' })
          };
        };
      `),
      role: lambdaRole,
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      environment: {
        TENANTS_TABLE: tenantsTable.tableName,
        USERS_TABLE: usersTable.tableName,
        DEPOSIT_CALLS_TABLE: depositCallsTable.tableName,
        INVESTOR_BIDS_TABLE: investorBidsTable.tableName,
        LOAN_APPLICATIONS_TABLE: loanApplicationsTable.tableName,
        LOANS_TABLE: loansTable.tableName,
        LOAN_REPAYMENTS_TABLE: loanRepaymentsTable.tableName,
        BORROWERS_TABLE: borrowersTable.tableName,
        SETTLEMENTS_TABLE: settlementsTable.tableName,
        KYC_RECORDS_TABLE: kycRecordsTable.tableName,
        AML_ALERTS_TABLE: amlAlertsTable.tableName,
        AUDIT_LOGS_TABLE: auditLogsTable.tableName,
        PLATFORM_METRICS_TABLE: platformMetricsTable.tableName,
        TENANT_METRICS_TABLE: tenantMetricsTable.tableName,
        AWS_REGION_CUSTOM: 'eu-west-1'
      }
    });

    // ==========================================
    // API GATEWAY
    // ==========================================

    const api = new apigateway.RestApi(this, 'ForwardsFlowAPI', {
      restApiName: 'ForwardsFlow API',
      description: 'API for ForwardsFlow platform',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    const lambdaIntegration = new apigateway.LambdaIntegration(apiHandler);

    // API Resources
    const tenantsResource = api.root.addResource('tenants');
    tenantsResource.addMethod('GET', lambdaIntegration);
    tenantsResource.addMethod('POST', lambdaIntegration);
    
    const tenantResource = tenantsResource.addResource('{tenantId}');
    tenantResource.addMethod('GET', lambdaIntegration);
    tenantResource.addMethod('PUT', lambdaIntegration);
    tenantResource.addMethod('DELETE', lambdaIntegration);

    const usersResource = api.root.addResource('users');
    usersResource.addMethod('GET', lambdaIntegration);
    usersResource.addMethod('POST', lambdaIntegration);

    const callsResource = api.root.addResource('calls');
    callsResource.addMethod('GET', lambdaIntegration);
    callsResource.addMethod('POST', lambdaIntegration);

    const loansResource = api.root.addResource('loans');
    loansResource.addMethod('GET', lambdaIntegration);
    loansResource.addMethod('POST', lambdaIntegration);

    const applicationsResource = api.root.addResource('applications');
    applicationsResource.addMethod('GET', lambdaIntegration);
    applicationsResource.addMethod('POST', lambdaIntegration);

    const metricsResource = api.root.addResource('metrics');
    metricsResource.addMethod('GET', lambdaIntegration);

    const complianceResource = api.root.addResource('compliance');
    complianceResource.addMethod('GET', lambdaIntegration);

    // ==========================================
    // OUTPUTS
    // ==========================================

    new cdk.CfnOutput(this, 'APIEndpoint', {
      value: api.url,
      description: 'ForwardsFlow API endpoint',
    });

    new cdk.CfnOutput(this, 'TenantsTableName', {
      value: tenantsTable.tableName,
      description: 'Tenants DynamoDB table name',
    });

    new cdk.CfnOutput(this, 'UsersTableName', {
      value: usersTable.tableName,
      description: 'Users DynamoDB table name',
    });
  }
}
