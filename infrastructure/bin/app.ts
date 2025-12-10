#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ForwardsFlowDatabaseStack } from '../lib/database-stack';
import { ForwardsFlowApiStack } from '../lib/api-stack';

const app = new cdk.App();

// Environment configuration
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.AWS_REGION || 'eu-west-1',
};

// Deploy Database Stack first
const databaseStack = new ForwardsFlowDatabaseStack(app, 'ForwardsFlowDatabaseStack', {
  env,
  description: 'ForwardsFlow DynamoDB Tables',
});

// Deploy API Stack (depends on Database Stack)
const apiStack = new ForwardsFlowApiStack(app, 'ForwardsFlowApiStack', {
  env,
  description: 'ForwardsFlow AppSync API and Cognito',
  organizationsTable: databaseStack.organizationsTable,
  usersTable: databaseStack.usersTable,
  capitalCallsTable: databaseStack.capitalCallsTable,
  investmentsTable: databaseStack.investmentsTable,
  mobileLoansTable: databaseStack.mobileLoansTable,
  paymentsTable: databaseStack.paymentsTable,
  metricsTable: databaseStack.metricsTable,
  auditLogsTable: databaseStack.auditLogsTable,
  notificationsTable: databaseStack.notificationsTable,
});

// Add stack dependencies
apiStack.addDependency(databaseStack);

// Tags
cdk.Tags.of(app).add('Project', 'ForwardsFlow');
cdk.Tags.of(app).add('Environment', process.env.ENVIRONMENT || 'development');
