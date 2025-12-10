# ForwardsFlow Database Integration

## Overview

This package contains the AWS infrastructure and frontend integration code to connect ForwardsFlow to DynamoDB with real-time updates via AppSync.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           ForwardsFlow Platform                          │
├─────────────────────────────────────────────────────────────────────────┤
│  React Frontend                                                          │
│  ├── DataContext (Real-time subscriptions)                              │
│  ├── AuthContext (8 roles, Cognito integration)                         │
│  └── Dashboards (Super Admin → Bank/Investor Staff)                     │
├─────────────────────────────────────────────────────────────────────────┤
│  AWS AppSync (GraphQL API)                                              │
│  ├── Queries (Organizations, Users, Calls, Investments, Loans)          │
│  ├── Mutations (CRUD operations with audit logging)                     │
│  └── Subscriptions (Real-time updates)                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  AWS Lambda (Resolvers)                                                 │
│  └── Business logic, validation, notifications                          │
├─────────────────────────────────────────────────────────────────────────┤
│  Amazon DynamoDB (9 Tables)                                             │
│  ├── Organizations (Banks & Investors)                                  │
│  ├── Users (All 8 roles)                                                │
│  ├── CapitalCalls (Deposit instruments)                                 │
│  ├── Investments (Investor positions)                                   │
│  ├── MobileLoans (WhatsApp lending)                                     │
│  ├── Payments (MPESA, SWIFT)                                            │
│  ├── Metrics (Aggregated KPIs)                                          │
│  ├── AuditLogs (Compliance trail)                                       │
│  └── Notifications (Real-time alerts)                                   │
├─────────────────────────────────────────────────────────────────────────┤
│  Amazon Cognito (Authentication)                                        │
│  └── User Pool with custom attributes (role, orgId, orgType)            │
└─────────────────────────────────────────────────────────────────────────┘
```

## 8 Roles Implemented

| Role | Level | Org Type | Dashboard Path |
|------|-------|----------|----------------|
| ForwardsFlow Admin | 0 | Platform | /admin |
| Bank Admin | 1 | Bank | /bank/admin |
| Bank Lender | 2 | Bank | /bank/lending |
| Bank Caller | 2 | Bank | /bank/capital |
| Bank Compliance | 2 | Bank | /bank/compliance |
| Bank Risk | 2 | Bank | /bank/risk |
| Investor Admin | 1 | Investor | /investor/admin |
| Investor Analyst | 2 | Investor | /investor |

## Deployment Instructions

### Prerequisites

1. AWS CLI configured with appropriate credentials
2. Node.js 18+ installed
3. AWS CDK CLI installed (`npm install -g aws-cdk`)

### Step 1: Deploy Infrastructure

```bash
cd infrastructure

# Install dependencies
npm install

# Bootstrap CDK (first time only)
cdk bootstrap

# Deploy database tables
cdk deploy ForwardsFlowDatabaseStack

# Deploy API and Cognito
cdk deploy ForwardsFlowApiStack
```

### Step 2: Configure Frontend

After deployment, update `src/config/aws-config.js` with the outputs:

```javascript
const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: '<UserPoolId from CDK output>',
      userPoolClientId: '<UserPoolClientId from CDK output>',
    },
  },
  API: {
    GraphQL: {
      endpoint: '<GraphQLApiUrl from CDK output>',
      region: 'eu-west-1',
      defaultAuthMode: 'userPool',
    },
  },
};
```

### Step 3: Install Amplify in Frontend

```bash
cd ../  # Back to React app root

npm install aws-amplify @aws-amplify/api

# Update index.js to configure Amplify
```

Add to `src/index.js`:

```javascript
import { Amplify } from 'aws-amplify';
import awsConfig from './config/aws-config';

Amplify.configure(awsConfig);
```

### Step 4: Seed Demo Data

Login as Super Admin and click "Seed Demo Data" button, or run:

```graphql
mutation {
  seedDemoData
}
```

## Files Structure

```
infrastructure/
├── bin/
│   └── app.ts                 # CDK app entry point
├── lib/
│   ├── database-stack.ts      # DynamoDB tables
│   └── api-stack.ts           # AppSync API + Cognito
├── graphql/
│   └── schema.graphql         # Full GraphQL schema
├── lambda/
│   └── resolvers/
│       ├── index.js           # Lambda resolver handler
│       └── package.json
├── package.json
├── tsconfig.json
└── cdk.json

src/
├── config/
│   └── aws-config.js          # AWS configuration
├── context/
│   ├── AuthContext.js         # Auth with 8 roles (existing, updated)
│   └── DataContext.js         # NEW: Data layer with subscriptions
├── graphql/
│   └── operations.js          # All GraphQL operations
└── components/
    └── super-admin/
        └── SuperAdminDashboardNew.js  # Connected to real DB
```

## Real-Time Updates

When a bank publishes a capital call:
1. Bank Caller/Admin creates and publishes call via mutation
2. AppSync triggers `onCapitalCallCreated` subscription
3. All connected investor dashboards receive the new call instantly
4. Notifications are created for all investor organizations

## Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@forwardsflow.com | admin123 | ForwardsFlow Admin |
| admin@equityafrica.com | demo123 | Bank Admin |
| lending@equityafrica.com | demo123 | Bank Lender |
| calling@equityafrica.com | demo123 | Bank Caller |
| compliance@equityafrica.com | demo123 | Bank Compliance |
| risk@equityafrica.com | demo123 | Bank Risk |
| admin@impactcapital.com | demo123 | Investor Admin |
| analyst@impactcapital.com | demo123 | Investor Analyst |

## Next Steps

1. **Deploy infrastructure** - Run CDK commands above
2. **Configure frontend** - Update aws-config.js with outputs
3. **Seed data** - Use Super Admin dashboard
4. **Test real-time** - Open two browsers (bank & investor), create a capital call
5. **Build remaining dashboards** - Bank Admin, Bank Staff, Investor dashboards

## Support

For issues with deployment, check CloudWatch logs for the Lambda resolver.
