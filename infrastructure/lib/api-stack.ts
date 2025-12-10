import * as cdk from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as path from 'path';

interface ApiStackProps extends cdk.StackProps {
  organizationsTable: dynamodb.Table;
  usersTable: dynamodb.Table;
  capitalCallsTable: dynamodb.Table;
  investmentsTable: dynamodb.Table;
  mobileLoansTable: dynamodb.Table;
  paymentsTable: dynamodb.Table;
  metricsTable: dynamodb.Table;
  auditLogsTable: dynamodb.Table;
  notificationsTable: dynamodb.Table;
}

export class ForwardsFlowApiStack extends cdk.Stack {
  public readonly api: appsync.GraphqlApi;
  public readonly userPool: cognito.UserPool;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // ============================================
    // COGNITO USER POOL
    // ============================================
    this.userPool = new cognito.UserPool(this, 'ForwardsFlowUserPool', {
      userPoolName: 'ForwardsFlow-Users',
      selfSignUpEnabled: false, // Admin-controlled signup
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: { required: true, mutable: true },
        fullname: { required: true, mutable: true },
      },
      customAttributes: {
        orgId: new cognito.StringAttribute({ mutable: true }),
        role: new cognito.StringAttribute({ mutable: true }),
        orgType: new cognito.StringAttribute({ mutable: true }),
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const userPoolClient = this.userPool.addClient('ForwardsFlowWebClient', {
      userPoolClientName: 'ForwardsFlow-WebApp',
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.EMAIL, cognito.OAuthScope.OPENID, cognito.OAuthScope.PROFILE],
      },
    });

    // ============================================
    // APPSYNC GRAPHQL API
    // ============================================
    this.api = new appsync.GraphqlApi(this, 'ForwardsFlowApi', {
      name: 'ForwardsFlow-API',
      definition: appsync.Definition.fromFile(path.join(__dirname, '../graphql/schema.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: this.userPool,
          },
        },
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.API_KEY,
            apiKeyConfig: {
              expires: cdk.Expiration.after(cdk.Duration.days(365)),
              description: 'API Key for public endpoints',
            },
          },
          {
            authorizationType: appsync.AuthorizationType.IAM,
          },
        ],
      },
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ERROR,
      },
      xrayEnabled: true,
    });

    // ============================================
    // LAMBDA RESOLVERS
    // ============================================
    const resolverLambda = new lambda.Function(this, 'ResolverLambda', {
      functionName: 'ForwardsFlow-GraphQL-Resolver',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/resolvers')),
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      environment: {
        ORGANIZATIONS_TABLE: props.organizationsTable.tableName,
        USERS_TABLE: props.usersTable.tableName,
        CAPITAL_CALLS_TABLE: props.capitalCallsTable.tableName,
        INVESTMENTS_TABLE: props.investmentsTable.tableName,
        MOBILE_LOANS_TABLE: props.mobileLoansTable.tableName,
        PAYMENTS_TABLE: props.paymentsTable.tableName,
        METRICS_TABLE: props.metricsTable.tableName,
        AUDIT_LOGS_TABLE: props.auditLogsTable.tableName,
        NOTIFICATIONS_TABLE: props.notificationsTable.tableName,
      },
    });

    // Grant DynamoDB permissions
    props.organizationsTable.grantReadWriteData(resolverLambda);
    props.usersTable.grantReadWriteData(resolverLambda);
    props.capitalCallsTable.grantReadWriteData(resolverLambda);
    props.investmentsTable.grantReadWriteData(resolverLambda);
    props.mobileLoansTable.grantReadWriteData(resolverLambda);
    props.paymentsTable.grantReadWriteData(resolverLambda);
    props.metricsTable.grantReadWriteData(resolverLambda);
    props.auditLogsTable.grantReadWriteData(resolverLambda);
    props.notificationsTable.grantReadWriteData(resolverLambda);

    // Lambda Data Source
    const lambdaDataSource = this.api.addLambdaDataSource('LambdaDataSource', resolverLambda);

    // ============================================
    // QUERY RESOLVERS
    // ============================================
    
    // Organizations
    lambdaDataSource.createResolver('GetOrganizationResolver', {
      typeName: 'Query',
      fieldName: 'getOrganization',
    });

    lambdaDataSource.createResolver('ListOrganizationsResolver', {
      typeName: 'Query',
      fieldName: 'listOrganizations',
    });

    lambdaDataSource.createResolver('ListBanksResolver', {
      typeName: 'Query',
      fieldName: 'listBanks',
    });

    lambdaDataSource.createResolver('ListInvestorsResolver', {
      typeName: 'Query',
      fieldName: 'listInvestors',
    });

    // Users
    lambdaDataSource.createResolver('GetUserResolver', {
      typeName: 'Query',
      fieldName: 'getUser',
    });

    lambdaDataSource.createResolver('ListUsersResolver', {
      typeName: 'Query',
      fieldName: 'listUsers',
    });

    lambdaDataSource.createResolver('ListUsersByOrgResolver', {
      typeName: 'Query',
      fieldName: 'listUsersByOrganization',
    });

    // Capital Calls
    lambdaDataSource.createResolver('GetCapitalCallResolver', {
      typeName: 'Query',
      fieldName: 'getCapitalCall',
    });

    lambdaDataSource.createResolver('ListCapitalCallsResolver', {
      typeName: 'Query',
      fieldName: 'listCapitalCalls',
    });

    lambdaDataSource.createResolver('ListCapitalCallsByBankResolver', {
      typeName: 'Query',
      fieldName: 'listCapitalCallsByBank',
    });

    lambdaDataSource.createResolver('ListPublishedCallsResolver', {
      typeName: 'Query',
      fieldName: 'listPublishedCalls',
    });

    // Investments
    lambdaDataSource.createResolver('GetInvestmentResolver', {
      typeName: 'Query',
      fieldName: 'getInvestment',
    });

    lambdaDataSource.createResolver('ListInvestmentsResolver', {
      typeName: 'Query',
      fieldName: 'listInvestments',
    });

    lambdaDataSource.createResolver('ListInvestmentsByInvestorResolver', {
      typeName: 'Query',
      fieldName: 'listInvestmentsByInvestor',
    });

    // Mobile Loans
    lambdaDataSource.createResolver('GetMobileLoanResolver', {
      typeName: 'Query',
      fieldName: 'getMobileLoan',
    });

    lambdaDataSource.createResolver('ListMobileLoansByBankResolver', {
      typeName: 'Query',
      fieldName: 'listMobileLoansByBank',
    });

    // Metrics & Analytics
    lambdaDataSource.createResolver('GetPlatformMetricsResolver', {
      typeName: 'Query',
      fieldName: 'getPlatformMetrics',
    });

    lambdaDataSource.createResolver('GetBankMetricsResolver', {
      typeName: 'Query',
      fieldName: 'getBankMetrics',
    });

    lambdaDataSource.createResolver('GetInvestorMetricsResolver', {
      typeName: 'Query',
      fieldName: 'getInvestorMetrics',
    });

    // Notifications
    lambdaDataSource.createResolver('ListNotificationsResolver', {
      typeName: 'Query',
      fieldName: 'listNotifications',
    });

    // Audit Logs
    lambdaDataSource.createResolver('ListAuditLogsResolver', {
      typeName: 'Query',
      fieldName: 'listAuditLogs',
    });

    // ============================================
    // MUTATION RESOLVERS
    // ============================================

    // Organizations
    lambdaDataSource.createResolver('CreateOrganizationResolver', {
      typeName: 'Mutation',
      fieldName: 'createOrganization',
    });

    lambdaDataSource.createResolver('UpdateOrganizationResolver', {
      typeName: 'Mutation',
      fieldName: 'updateOrganization',
    });

    lambdaDataSource.createResolver('SuspendOrganizationResolver', {
      typeName: 'Mutation',
      fieldName: 'suspendOrganization',
    });

    // Users
    lambdaDataSource.createResolver('CreateUserResolver', {
      typeName: 'Mutation',
      fieldName: 'createUser',
    });

    lambdaDataSource.createResolver('UpdateUserResolver', {
      typeName: 'Mutation',
      fieldName: 'updateUser',
    });

    lambdaDataSource.createResolver('SuspendUserResolver', {
      typeName: 'Mutation',
      fieldName: 'suspendUser',
    });

    // Capital Calls
    lambdaDataSource.createResolver('CreateCapitalCallResolver', {
      typeName: 'Mutation',
      fieldName: 'createCapitalCall',
    });

    lambdaDataSource.createResolver('UpdateCapitalCallResolver', {
      typeName: 'Mutation',
      fieldName: 'updateCapitalCall',
    });

    lambdaDataSource.createResolver('PublishCapitalCallResolver', {
      typeName: 'Mutation',
      fieldName: 'publishCapitalCall',
    });

    lambdaDataSource.createResolver('CancelCapitalCallResolver', {
      typeName: 'Mutation',
      fieldName: 'cancelCapitalCall',
    });

    // Investments
    lambdaDataSource.createResolver('CreateInvestmentResolver', {
      typeName: 'Mutation',
      fieldName: 'createInvestment',
    });

    lambdaDataSource.createResolver('UpdateInvestmentResolver', {
      typeName: 'Mutation',
      fieldName: 'updateInvestment',
    });

    lambdaDataSource.createResolver('SubmitKycResolver', {
      typeName: 'Mutation',
      fieldName: 'submitKyc',
    });

    lambdaDataSource.createResolver('ApproveInvestmentResolver', {
      typeName: 'Mutation',
      fieldName: 'approveInvestment',
    });

    lambdaDataSource.createResolver('CompleteInvestmentResolver', {
      typeName: 'Mutation',
      fieldName: 'completeInvestment',
    });

    // Mobile Loans
    lambdaDataSource.createResolver('CreateMobileLoanResolver', {
      typeName: 'Mutation',
      fieldName: 'createMobileLoan',
    });

    lambdaDataSource.createResolver('ApproveMobileLoanResolver', {
      typeName: 'Mutation',
      fieldName: 'approveMobileLoan',
    });

    lambdaDataSource.createResolver('DisburseMobileLoanResolver', {
      typeName: 'Mutation',
      fieldName: 'disburseMobileLoan',
    });

    lambdaDataSource.createResolver('RecordLoanPaymentResolver', {
      typeName: 'Mutation',
      fieldName: 'recordLoanPayment',
    });

    // Notifications
    lambdaDataSource.createResolver('MarkNotificationReadResolver', {
      typeName: 'Mutation',
      fieldName: 'markNotificationRead',
    });

    lambdaDataSource.createResolver('MarkAllNotificationsReadResolver', {
      typeName: 'Mutation',
      fieldName: 'markAllNotificationsRead',
    });

    // ============================================
    // SUBSCRIPTION RESOLVERS (Real-time)
    // ============================================
    
    // None data source for subscriptions (they're handled by AppSync)
    const noneDataSource = this.api.addNoneDataSource('NoneDataSource');

    noneDataSource.createResolver('OnCapitalCallCreatedResolver', {
      typeName: 'Subscription',
      fieldName: 'onCapitalCallCreated',
      requestMappingTemplate: appsync.MappingTemplate.fromString(`{
        "version": "2017-02-28",
        "payload": $util.toJson($context.arguments)
      }`),
      responseMappingTemplate: appsync.MappingTemplate.fromString('$util.toJson($context.result)'),
    });

    noneDataSource.createResolver('OnCapitalCallUpdatedResolver', {
      typeName: 'Subscription',
      fieldName: 'onCapitalCallUpdated',
      requestMappingTemplate: appsync.MappingTemplate.fromString(`{
        "version": "2017-02-28",
        "payload": $util.toJson($context.arguments)
      }`),
      responseMappingTemplate: appsync.MappingTemplate.fromString('$util.toJson($context.result)'),
    });

    noneDataSource.createResolver('OnInvestmentCreatedResolver', {
      typeName: 'Subscription',
      fieldName: 'onInvestmentCreated',
      requestMappingTemplate: appsync.MappingTemplate.fromString(`{
        "version": "2017-02-28",
        "payload": $util.toJson($context.arguments)
      }`),
      responseMappingTemplate: appsync.MappingTemplate.fromString('$util.toJson($context.result)'),
    });

    noneDataSource.createResolver('OnInvestmentUpdatedResolver', {
      typeName: 'Subscription',
      fieldName: 'onInvestmentUpdated',
      requestMappingTemplate: appsync.MappingTemplate.fromString(`{
        "version": "2017-02-28",
        "payload": $util.toJson($context.arguments)
      }`),
      responseMappingTemplate: appsync.MappingTemplate.fromString('$util.toJson($context.result)'),
    });

    noneDataSource.createResolver('OnNotificationCreatedResolver', {
      typeName: 'Subscription',
      fieldName: 'onNotificationCreated',
      requestMappingTemplate: appsync.MappingTemplate.fromString(`{
        "version": "2017-02-28",
        "payload": $util.toJson($context.arguments)
      }`),
      responseMappingTemplate: appsync.MappingTemplate.fromString('$util.toJson($context.result)'),
    });

    noneDataSource.createResolver('OnMobileLoanUpdatedResolver', {
      typeName: 'Subscription',
      fieldName: 'onMobileLoanUpdated',
      requestMappingTemplate: appsync.MappingTemplate.fromString(`{
        "version": "2017-02-28",
        "payload": $util.toJson($context.arguments)
      }`),
      responseMappingTemplate: appsync.MappingTemplate.fromString('$util.toJson($context.result)'),
    });

    // ============================================
    // OUTPUTS
    // ============================================
    new cdk.CfnOutput(this, 'GraphQLApiUrl', {
      value: this.api.graphqlUrl,
      exportName: 'ForwardsFlow-GraphQLUrl',
    });

    new cdk.CfnOutput(this, 'GraphQLApiId', {
      value: this.api.apiId,
      exportName: 'ForwardsFlow-GraphQLApiId',
    });

    new cdk.CfnOutput(this, 'UserPoolId', {
      value: this.userPool.userPoolId,
      exportName: 'ForwardsFlow-UserPoolId',
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
      exportName: 'ForwardsFlow-UserPoolClientId',
    });
  }
}
