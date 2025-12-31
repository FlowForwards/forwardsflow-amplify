/**
 * ForwardsFlow Amazon Q Contextual Chatbot Service
 * 
 * Provides role-aware AI assistance across all dashboards.
 * Features:
 * - Role-specific context and knowledge base
 * - Organization-level feature toggle (premium feature)
 * - Conversation history management
 * - Suggested prompts based on current view
 * 
 * Integration: AWS Amazon Q Business API
 */

// Role-specific context configurations
export const ROLE_CONTEXTS = {
  super_admin: {
    role: 'Super Administrator',
    description: 'Platform-wide management and oversight',
    capabilities: [
      'View and manage all banks and investors',
      'Access platform-wide profit & loss data',
      'Monitor all transactions and compliance',
      'Manage billing and subscriptions',
      'Configure system-wide settings'
    ],
    knowledgeBase: [
      'Platform administration',
      'Multi-tenant management',
      'Revenue analytics',
      'Compliance oversight',
      'User management'
    ],
    suggestedPrompts: [
      'Show me the platform revenue for this month',
      'Which banks have the highest transaction volume?',
      'Are there any pending compliance issues?',
      'Generate a summary of all active capital calls',
      'What is the current NPL rate across all banks?'
    ]
  },
  bank_admin: {
    role: 'Bank Administrator',
    description: 'Bank-level administration and user management',
    capabilities: [
      'Manage bank staff and permissions',
      'View bank-wide analytics',
      'Configure bank settings',
      'Monitor all bank operations'
    ],
    knowledgeBase: [
      'User management',
      'Bank settings',
      'Staff permissions',
      'Operational oversight'
    ],
    suggestedPrompts: [
      'How many active users does our bank have?',
      'Show me staff activity for this week',
      'What permissions does the compliance team have?',
      'Generate a user access report'
    ]
  },
  bank_caller: {
    role: 'Bank Capital Caller',
    description: 'Capital call management and investor relations',
    capabilities: [
      'Create and manage capital calls',
      'Track investor responses',
      'Monitor deposits and settlements',
      'Generate capital raising reports'
    ],
    knowledgeBase: [
      'Capital calls',
      'Fixed deposits',
      'Investor management',
      'FX hedging',
      'Settlement processes'
    ],
    suggestedPrompts: [
      'What is the status of my active capital calls?',
      'Which investors have responded to TXN-2024-00001?',
      'How much capital have we raised this quarter?',
      'What is the average yield on our instruments?',
      'Show me pending settlements for this month'
    ]
  },
  bank_lender: {
    role: 'Bank Lender',
    description: 'Mobile lending operations and loan management',
    capabilities: [
      'Process loan applications',
      'Manage disbursements and collections',
      'Monitor loan portfolio performance',
      'Configure lending parameters'
    ],
    knowledgeBase: [
      'Loan processing',
      'Credit scoring',
      'Disbursements',
      'Collections',
      'NPL management',
      'WhatsApp lending'
    ],
    suggestedPrompts: [
      'How many loan applications are pending review?',
      'What is our NPL rate this month?',
      'Show me today\'s disbursement targets',
      'Which loans are 30+ days past due?',
      'Generate a collections performance report'
    ]
  },
  bank_compliance: {
    role: 'Bank Compliance Officer',
    description: 'KYC/AML verification and regulatory compliance',
    capabilities: [
      'Review and approve KYC documents',
      'Monitor AML alerts',
      'Manage compliance workflows',
      'Generate regulatory reports'
    ],
    knowledgeBase: [
      'KYC verification',
      'AML monitoring',
      'Sanctions screening',
      'Risk assessment',
      'Regulatory reporting'
    ],
    suggestedPrompts: [
      'How many KYC reviews are pending?',
      'Are there any high-risk AML alerts?',
      'Show me the compliance score trend',
      'Which investors need KYC renewal?',
      'Generate a regulatory compliance report'
    ]
  },
  bank_risk: {
    role: 'Bank Risk Officer',
    description: 'Risk analysis and portfolio monitoring',
    capabilities: [
      'Monitor portfolio at risk metrics',
      'Analyze credit concentration',
      'Track NPL trends',
      'Generate risk reports'
    ],
    knowledgeBase: [
      'Portfolio at risk',
      'Credit risk',
      'Concentration risk',
      'NPL analysis',
      'Vintage analysis'
    ],
    suggestedPrompts: [
      'What is the current PAR 30 rate?',
      'Show me the largest exposure concentrations',
      'How has NPL trended over the last 6 months?',
      'Which vintage cohort has the highest default rate?',
      'Generate a risk dashboard summary'
    ]
  },
  investor_admin: {
    role: 'Investor Administrator',
    description: 'Investment portfolio and organization management',
    capabilities: [
      'Browse and respond to opportunities',
      'Manage investment portfolio',
      'Configure organization settings',
      'Manage team access'
    ],
    knowledgeBase: [
      'Investment opportunities',
      'Portfolio management',
      'KYC requirements',
      'Settlement processes',
      'Yield analysis'
    ],
    suggestedPrompts: [
      'What new opportunities are available?',
      'Show me my portfolio performance',
      'What is my total invested capital?',
      'When is my next maturity date?',
      'What documents do I need for KYC?'
    ]
  },
  investor_analyst: {
    role: 'Investor Analyst',
    description: 'Investment analysis and reporting',
    capabilities: [
      'Analyze investment opportunities',
      'Monitor portfolio performance',
      'Generate investment reports'
    ],
    knowledgeBase: [
      'Investment analysis',
      'Yield calculations',
      'Risk assessment',
      'Market trends'
    ],
    suggestedPrompts: [
      'Compare yields across available opportunities',
      'What is the risk-adjusted return on our portfolio?',
      'Show me the maturity schedule for this year',
      'Generate a quarterly investment report'
    ]
  }
};

// Premium feature configuration
export const PREMIUM_FEATURES = {
  AMAZON_Q_CHAT: {
    id: 'amazon_q_chat',
    name: 'AI Assistant (Amazon Q)',
    description: 'Contextual AI-powered chat assistant for all dashboards',
    defaultEnabled: false,
    tier: 'premium'
  },
  ADVANCED_ANALYTICS: {
    id: 'advanced_analytics',
    name: 'Advanced Analytics',
    description: 'Deep dive analytics and custom reporting',
    defaultEnabled: false,
    tier: 'premium'
  },
  WHATSAPP_INTEGRATION: {
    id: 'whatsapp_integration',
    name: 'WhatsApp Integration',
    description: 'WhatsApp messaging for loan notifications',
    defaultEnabled: true,
    tier: 'standard'
  }
};

class AmazonQService {
  constructor() {
    this.conversations = new Map();
    this.organizationSettings = new Map();
    this.isDemo = true; // Set to false for production AWS integration
    
    // Demo responses for different contexts
    this.demoResponses = this.initializeDemoResponses();
  }

  // ============================================================================
  // ORGANIZATION FEATURE MANAGEMENT
  // ============================================================================

  /**
   * Initialize organization with default feature settings
   */
  initializeOrganization(organizationId, organizationType = 'bank') {
    const settings = {
      organizationId,
      organizationType,
      features: {
        amazon_q_chat: false, // Premium - disabled by default
        advanced_analytics: false,
        whatsapp_integration: true // Standard - enabled by default
      },
      tier: 'standard', // 'standard', 'premium', 'enterprise'
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.organizationSettings.set(organizationId, settings);
    return settings;
  }

  /**
   * Get organization feature settings
   */
  getOrganizationSettings(organizationId) {
    return this.organizationSettings.get(organizationId) || this.initializeOrganization(organizationId);
  }

  /**
   * Check if a feature is enabled for an organization
   */
  isFeatureEnabled(organizationId, featureId) {
    const settings = this.getOrganizationSettings(organizationId);
    return settings.features[featureId] || false;
  }

  /**
   * Enable/disable a feature for an organization (Super Admin only)
   */
  setFeatureEnabled(organizationId, featureId, enabled, adminUserId) {
    const settings = this.getOrganizationSettings(organizationId);
    
    settings.features[featureId] = enabled;
    settings.updatedAt = new Date().toISOString();
    settings.lastModifiedBy = adminUserId;
    
    this.organizationSettings.set(organizationId, settings);
    
    console.log(`[AmazonQ] Feature ${featureId} ${enabled ? 'enabled' : 'disabled'} for org ${organizationId}`);
    
    return settings;
  }

  /**
   * Upgrade organization tier
   */
  upgradeOrganizationTier(organizationId, newTier, adminUserId) {
    const settings = this.getOrganizationSettings(organizationId);
    
    settings.tier = newTier;
    settings.updatedAt = new Date().toISOString();
    settings.lastModifiedBy = adminUserId;
    
    // Auto-enable features based on tier
    if (newTier === 'premium' || newTier === 'enterprise') {
      settings.features.amazon_q_chat = true;
      settings.features.advanced_analytics = true;
    }
    
    this.organizationSettings.set(organizationId, settings);
    
    return settings;
  }

  // ============================================================================
  // CHAT FUNCTIONALITY
  // ============================================================================

  /**
   * Start a new conversation
   */
  startConversation(userId, userRole, organizationId) {
    // Check if Amazon Q is enabled for this organization
    if (!this.isFeatureEnabled(organizationId, 'amazon_q_chat')) {
      throw new Error('Amazon Q Chat is not enabled for your organization. Please contact your administrator to enable this premium feature.');
    }

    const conversationId = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const roleContext = ROLE_CONTEXTS[userRole] || ROLE_CONTEXTS.investor_analyst;
    
    const conversation = {
      id: conversationId,
      userId,
      userRole,
      organizationId,
      roleContext,
      messages: [],
      createdAt: new Date().toISOString(),
      lastMessageAt: null
    };
    
    this.conversations.set(conversationId, conversation);
    
    return {
      conversationId,
      welcomeMessage: this.generateWelcomeMessage(roleContext),
      suggestedPrompts: roleContext.suggestedPrompts
    };
  }

  /**
   * Send a message and get AI response
   */
  async sendMessage(conversationId, message, currentView = null) {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Check if still enabled
    if (!this.isFeatureEnabled(conversation.organizationId, 'amazon_q_chat')) {
      throw new Error('Amazon Q Chat has been disabled for your organization.');
    }

    // Add user message
    const userMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
      currentView
    };
    conversation.messages.push(userMessage);

    // Generate AI response
    const response = await this.generateResponse(conversation, message, currentView);
    
    // Add AI message
    const aiMessage = {
      id: `msg-${Date.now()}-ai`,
      role: 'assistant',
      content: response.content,
      data: response.data,
      actions: response.actions,
      timestamp: new Date().toISOString()
    };
    conversation.messages.push(aiMessage);
    conversation.lastMessageAt = new Date().toISOString();

    return {
      message: aiMessage,
      suggestedFollowUps: response.suggestedFollowUps
    };
  }

  /**
   * Generate AI response based on context
   */
  async generateResponse(conversation, message, currentView) {
    if (this.isDemo) {
      return this.generateDemoResponse(conversation, message, currentView);
    } else {
      return this.callAmazonQAPI(conversation, message, currentView);
    }
  }

  /**
   * Generate demo response (for testing without AWS)
   */
  generateDemoResponse(conversation, message, currentView) {
    const { userRole, roleContext } = conversation;
    const lowerMessage = message.toLowerCase();

    // Simulate processing delay
    return new Promise((resolve) => {
      setTimeout(() => {
        let response = {
          content: '',
          data: null,
          actions: [],
          suggestedFollowUps: []
        };

        // Role-specific responses
        if (userRole === 'bank_caller') {
          response = this.getBankCallerResponse(lowerMessage, currentView);
        } else if (userRole === 'bank_compliance') {
          response = this.getBankComplianceResponse(lowerMessage, currentView);
        } else if (userRole === 'bank_lender') {
          response = this.getBankLenderResponse(lowerMessage, currentView);
        } else if (userRole === 'bank_risk') {
          response = this.getBankRiskResponse(lowerMessage, currentView);
        } else if (userRole.startsWith('investor')) {
          response = this.getInvestorResponse(lowerMessage, currentView);
        } else if (userRole === 'super_admin') {
          response = this.getSuperAdminResponse(lowerMessage, currentView);
        } else {
          response.content = this.getGenericResponse(lowerMessage);
        }

        resolve(response);
      }, 800); // Simulate API latency
    });
  }

  /**
   * Call actual Amazon Q API (production)
   */
  async callAmazonQAPI(conversation, message, currentView) {
    // This would integrate with AWS Amazon Q Business API
    // For now, return a placeholder
    
    const systemPrompt = this.buildSystemPrompt(conversation.roleContext, currentView);
    
    try {
      // In production, this would call:
      // const response = await amazonQ.chat({
      //   applicationId: process.env.AMAZON_Q_APP_ID,
      //   conversationId: conversation.id,
      //   userMessage: message,
      //   systemPrompt: systemPrompt
      // });
      
      return {
        content: 'Amazon Q integration pending. Please configure AWS credentials.',
        data: null,
        actions: [],
        suggestedFollowUps: []
      };
    } catch (error) {
      console.error('Amazon Q API error:', error);
      throw error;
    }
  }

  // ============================================================================
  // ROLE-SPECIFIC RESPONSE GENERATORS
  // ============================================================================

  getBankCallerResponse(message, currentView) {
    if (message.includes('capital call') && message.includes('status')) {
      return {
        content: `Here's the status of your active capital calls:\n\n• **TXN-2024-00001**: $10M Fixed Deposit - Completed ✓\n• **TXN-2024-00002**: $15M Fixed Deposit - KYC Review (Shell Foundation)\n• **TXN-2024-00003**: $8M Certificate of Deposit - Accepted\n• **TXN-2024-00004**: $20M Fixed Deposit - Published (awaiting responses)\n\nTotal capital raised this quarter: **$53M**`,
        data: { totalCalls: 4, completed: 1, inProgress: 3 },
        actions: [
          { label: 'View All Calls', action: 'navigate', target: '/bank/calls' },
          { label: 'Create New Call', action: 'modal', target: 'createCapitalCall' }
        ],
        suggestedFollowUps: [
          'Which investors have responded to TXN-2024-00004?',
          'What is the average time to close a capital call?',
          'Show me the yield comparison across instruments'
        ]
      };
    }

    if (message.includes('investor') && message.includes('respond')) {
      return {
        content: `For TXN-2024-00004 ($20M Fixed Deposit), here are the investor responses:\n\n• **Horizon Impact Partners**: Reviewing (viewed 2 hours ago)\n• **Nordic Impact Fund**: No response yet\n• **Shell Foundation**: Currently in KYC for another transaction\n\nThe call expires in **6 days**. Consider sending a follow-up notification to increase response rate.`,
        data: { viewedBy: 1, pending: 2 },
        actions: [
          { label: 'Send Reminder', action: 'function', target: 'sendInvestorReminder' }
        ],
        suggestedFollowUps: [
          'What yield would attract more investors?',
          'Show me historical response rates'
        ]
      };
    }

    if (message.includes('raised') || message.includes('quarter')) {
      return {
        content: `**Capital Raised This Quarter (Q4 2024)**\n\n• Total Raised: **$53,000,000**\n• Completed Transactions: 1\n• In Progress: 3\n• Average Yield: 17.3%\n• Average Tenor: 13.5 months\n\nCompared to Q3, this represents a **28% increase** in capital raised.`,
        data: { total: 53000000, change: 28 },
        actions: [],
        suggestedFollowUps: [
          'Break down by instrument type',
          'Which bank has the highest capital raised?'
        ]
      };
    }

    return {
      content: `I can help you with capital call management. As a Bank Caller, you can ask me about:\n\n• Status of your capital calls\n• Investor responses and activity\n• Settlement tracking\n• Yield and performance analytics\n\nWhat would you like to know?`,
      data: null,
      actions: [],
      suggestedFollowUps: ROLE_CONTEXTS.bank_caller.suggestedPrompts.slice(0, 3)
    };
  }

  getBankComplianceResponse(message, currentView) {
    if (message.includes('pending') || message.includes('kyc')) {
      return {
        content: `**Pending KYC Reviews: 1**\n\n• **Shell Foundation** (TXN-2024-00002)\n  - Submitted: Dec 27, 2024\n  - Documents: 4/5 uploaded\n  - Sanctions: Cleared ✓\n  - AML: Pending review\n  - Risk Rating: Medium\n\nThe missing document is a **Bank Reference Letter**. You may want to request this before final approval.`,
        data: { pending: 1, avgReviewTime: 2.5 },
        actions: [
          { label: 'Start Review', action: 'navigate', target: '/bank/compliance/kyc/kyc-001' },
          { label: 'Request Document', action: 'function', target: 'requestDocument' }
        ],
        suggestedFollowUps: [
          'What documents are typically required for foundations?',
          'Show me the AML alert details',
          'What is our average KYC approval time?'
        ]
      };
    }

    if (message.includes('aml') || message.includes('alert')) {
      return {
        content: `**Active AML Alerts: 1**\n\n• **Unusual Activity Alert** (Medium severity)\n  - Type: Large transaction volume spike\n  - Detected: Dec 27, 2024\n  - Status: Under review\n\nThis alert was triggered by a 40% increase in transaction volume from Horizon Impact Partners. Their pattern appears consistent with year-end capital deployment, which is typical behavior for impact funds.`,
        data: { alerts: 1, severity: 'medium' },
        actions: [
          { label: 'Review Alert', action: 'navigate', target: '/bank/compliance/aml' },
          { label: 'Mark as Resolved', action: 'function', target: 'resolveAlert' }
        ],
        suggestedFollowUps: [
          'What is the false positive rate for these alerts?',
          'Show me the investor\'s historical activity'
        ]
      };
    }

    if (message.includes('compliance score') || message.includes('trend')) {
      return {
        content: `**Compliance Score: 94.5%** (Excellent)\n\n**Trend (Last 6 Months):**\n• Jul: 91.2%\n• Aug: 92.8%\n• Sep: 93.5%\n• Oct: 94.0%\n• Nov: 94.2%\n• Dec: 94.5%\n\nYour compliance score has improved by **3.3 percentage points** over the past 6 months. Key improvements include faster KYC processing and zero sanctions hits.`,
        data: { score: 94.5, trend: 'improving' },
        actions: [],
        suggestedFollowUps: [
          'What factors affect the compliance score?',
          'How do we compare to other banks?'
        ]
      };
    }

    return {
      content: `I'm here to assist with compliance matters. As a Compliance Officer, I can help with:\n\n• KYC review status and approvals\n• AML monitoring and alerts\n• Sanctions screening results\n• Regulatory reporting\n• Compliance analytics\n\nWhat would you like to know?`,
      data: null,
      actions: [],
      suggestedFollowUps: ROLE_CONTEXTS.bank_compliance.suggestedPrompts.slice(0, 3)
    };
  }

  getBankLenderResponse(message, currentView) {
    if (message.includes('pending') || message.includes('application')) {
      return {
        content: `**Pending Loan Applications: 234**\n\n**Priority Queue:**\n• 45 applications ready for auto-approval (score > 700)\n• 89 applications need manual review\n• 100 applications pending additional documents\n\n**Today's Targets:**\n• Disbursement Target: KES 850,000\n• Current Progress: KES 620,000 (73%)\n• Time Remaining: 6 hours`,
        data: { pending: 234, autoApprove: 45 },
        actions: [
          { label: 'Batch Approve (45)', action: 'function', target: 'batchApprove' },
          { label: 'Review Queue', action: 'navigate', target: '/bank/lending/applications' }
        ],
        suggestedFollowUps: [
          'What is the average credit score in the queue?',
          'Show me rejection reasons breakdown'
        ]
      };
    }

    if (message.includes('npl') || message.includes('non-performing')) {
      return {
        content: `**NPL Rate: 3.2%** (Within target)\n\n**Breakdown:**\n• PAR 1-30: 7.9% (KES 3.54M)\n• PAR 31-60: 3.4% (KES 1.52M)\n• PAR 61-90: 1.2% (KES 540K)\n• PAR 90+: 0.4% (KES 200K)\n\n**Trend:** NPL has decreased from 3.8% in July to 3.2% now, representing a **16% improvement**.`,
        data: { nplRate: 3.2, trend: 'decreasing' },
        actions: [
          { label: 'View NPL Details', action: 'navigate', target: '/bank/lending/npl' }
        ],
        suggestedFollowUps: [
          'Which customer segments have the highest NPL?',
          'What collection strategies are most effective?'
        ]
      };
    }

    if (message.includes('disbursement') || message.includes('today')) {
      return {
        content: `**Today's Disbursements**\n\n• Total Disbursed: **KES 850,000**\n• Transactions: 145\n• Average Loan Size: KES 5,862\n• Largest Loan: KES 50,000\n\n**Collections Today:**\n• Total Collected: KES 920,000\n• Recovery Rate: 94.2%\n\n**Net Position:** +KES 70,000 (positive cash flow)`,
        data: { disbursed: 850000, collected: 920000 },
        actions: [],
        suggestedFollowUps: [
          'Compare to yesterday\'s performance',
          'Which channels have the highest conversion?'
        ]
      };
    }

    return {
      content: `I can assist with lending operations. As a Bank Lender, I can help with:\n\n• Loan application processing\n• Disbursement tracking\n• Collections management\n• NPL monitoring\n• WhatsApp borrower communications\n\nWhat would you like to know?`,
      data: null,
      actions: [],
      suggestedFollowUps: ROLE_CONTEXTS.bank_lender.suggestedPrompts.slice(0, 3)
    };
  }

  getBankRiskResponse(message, currentView) {
    if (message.includes('par') || message.includes('portfolio at risk')) {
      return {
        content: `**Portfolio at Risk Analysis**\n\n• **PAR 30:** 3.2% (Low risk - threshold 5%)\n• **PAR 60:** 1.8% (Low risk - threshold 3%)\n• **PAR 90:** 0.6% (Low risk - threshold 2%)\n\n**Expected Loss:** KES 1.25M (2.8% of portfolio)\n**Provision Coverage:** KES 1.5M (120% coverage)\n\nAll risk metrics are within acceptable thresholds. The portfolio is performing well.`,
        data: { par30: 3.2, expectedLoss: 1250000 },
        actions: [
          { label: 'View Risk Dashboard', action: 'navigate', target: '/bank/risk' }
        ],
        suggestedFollowUps: [
          'Show me the concentration risk breakdown',
          'Which sectors have the highest PAR?'
        ]
      };
    }

    if (message.includes('concentration') || message.includes('exposure')) {
      return {
        content: `**Concentration Risk Analysis**\n\n**Largest Exposures:**\n1. Horizon Impact Partners: $35M (28%)\n2. Nordic Impact Fund: $28M (22%)\n3. Shell Foundation: $15M (12%)\n\n**Sector Concentration:**\n• Financial Services: 45%\n• Agriculture: 25%\n• Manufacturing: 20%\n• Retail: 10%\n\n⚠️ Top 3 investors represent 62% of the portfolio. Consider diversification strategies.`,
        data: { top3Concentration: 62 },
        actions: [],
        suggestedFollowUps: [
          'What is the recommended concentration limit?',
          'Show me sector performance comparison'
        ]
      };
    }

    if (message.includes('vintage') || message.includes('cohort')) {
      return {
        content: `**Vintage Performance Analysis**\n\n| Cohort | Disbursed | NPL | Status |\n|--------|-----------|-----|--------|\n| Q1 2024 | $15M | 2.8% | Good |\n| Q2 2024 | $18M | 3.1% | Good |\n| Q3 2024 | $22M | 3.5% | Watch |\n| Q4 2024 | $12M | 2.2% | Excellent |\n\n**Observation:** Q3 2024 cohort shows slightly elevated NPL. This correlates with a relaxation of credit criteria during that period.`,
        data: { cohorts: 4 },
        actions: [],
        suggestedFollowUps: [
          'What caused the Q3 NPL increase?',
          'Recommend adjustments to credit criteria'
        ]
      };
    }

    return {
      content: `I'm here to help with risk analysis. As a Risk Officer, I can assist with:\n\n• Portfolio at risk metrics\n• Concentration risk analysis\n• NPL trend monitoring\n• Credit score distribution\n• Vintage performance analysis\n\nWhat would you like to know?`,
      data: null,
      actions: [],
      suggestedFollowUps: ROLE_CONTEXTS.bank_risk.suggestedPrompts.slice(0, 3)
    };
  }

  getInvestorResponse(message, currentView) {
    if (message.includes('opportunit') || message.includes('available')) {
      return {
        content: `**Available Investment Opportunities: 1**\n\n**New Opportunity:**\n• **Equity Africa Bank** - $20M Fixed Deposit\n• Yield: 17.8% (Interest 15.5% + FX 0.8% + Hedging 1.5%)\n• Tenor: 24 months\n• Maturity: Dec 2026\n• Status: Published (expires in 6 days)\n\n**Compliance:** FATCA compliant, Sanctions cleared, Capital adequacy 18.2%`,
        data: { opportunities: 1 },
        actions: [
          { label: 'View Opportunity', action: 'navigate', target: '/investor/opportunities' },
          { label: 'Accept Terms', action: 'modal', target: 'respondToCall' }
        ],
        suggestedFollowUps: [
          'How does this yield compare to previous opportunities?',
          'What is the bank\'s credit rating?'
        ]
      };
    }

    if (message.includes('portfolio') || message.includes('performance')) {
      return {
        content: `**Your Portfolio Summary**\n\n• **Total Invested:** $35,000,000\n• **Active Instruments:** 4\n• **Total Returns (YTD):** $4,200,000\n• **Average Yield:** 14.5%\n\n**Holdings:**\n1. Equity Africa Bank FD - $10M (15% yield, matures Dec 2025)\n2. DTB Africa CD - $8M (14.2% yield, matures Sep 2025)\n3. Stanbic Uganda FD - $12M (14.8% yield, matures Mar 2026)\n4. Equity Africa Bank FD - $5M (15.2% yield, matures Jun 2026)`,
        data: { totalInvested: 35000000, returns: 4200000 },
        actions: [
          { label: 'View Portfolio', action: 'navigate', target: '/investor/portfolio' }
        ],
        suggestedFollowUps: [
          'When is my next maturity date?',
          'What is the currency exposure breakdown?'
        ]
      };
    }

    if (message.includes('kyc') || message.includes('document')) {
      return {
        content: `**KYC Status: Verified ✓**\n\n**Required Documents:**\n• Certificate of Incorporation ✓\n• Directors List (CR12) ✓\n• Proof of Address ✓\n• Source of Funds Declaration ✓\n• Bank Reference Letter ✓\n\n**Next Review:** Jan 25, 2025\n\nAll your documents are up to date. No action required.`,
        data: { kycStatus: 'verified' },
        actions: [],
        suggestedFollowUps: [
          'How do I update my KYC documents?',
          'What is the renewal process?'
        ]
      };
    }

    return {
      content: `I'm here to help with your investments. As an Impact Investor, I can assist with:\n\n• Available investment opportunities\n• Portfolio performance tracking\n• Settlement and maturity dates\n• KYC document management\n• Yield calculations\n\nWhat would you like to know?`,
      data: null,
      actions: [],
      suggestedFollowUps: ROLE_CONTEXTS.investor_admin.suggestedPrompts.slice(0, 3)
    };
  }

  getSuperAdminResponse(message, currentView) {
    if (message.includes('revenue') || message.includes('profit')) {
      return {
        content: `**Platform Revenue (December 2024)**\n\n**Revenue Breakdown:**\n• Subscriptions: $290,000\n• Transaction Fees: $125,000\n• FX Spread: $85,000\n• **Total Revenue:** $500,000\n\n**Costs:**\n• Infrastructure: $45,000\n• Personnel: $180,000\n• Compliance: $25,000\n• Marketing: $35,000\n• **Total Costs:** $285,000\n\n**Net Profit:** $215,000 (43% margin)`,
        data: { revenue: 500000, profit: 215000, margin: 43 },
        actions: [
          { label: 'View P&L Dashboard', action: 'navigate', target: '/admin/pnl' }
        ],
        suggestedFollowUps: [
          'Compare to last month',
          'Which revenue stream is growing fastest?'
        ]
      };
    }

    if (message.includes('transaction') && message.includes('volume')) {
      return {
        content: `**Transaction Volume by Bank**\n\n1. **Equity Africa Bank:** $45M (42%)\n2. **DTB Africa:** $28M (26%)\n3. **Stanbic Uganda:** $18M (17%)\n4. **Others:** $16M (15%)\n\n**Total Platform Volume:** $107M this month\n**YTD Volume:** $425M (+15.2% vs last year)`,
        data: { totalVolume: 107000000 },
        actions: [],
        suggestedFollowUps: [
          'Which bank has the fastest growth?',
          'Show me investor activity breakdown'
        ]
      };
    }

    if (message.includes('compliance') || message.includes('issue')) {
      return {
        content: `**Platform Compliance Status**\n\n✅ **No Critical Issues**\n\n**Pending Items:**\n• 1 KYC review (Shell Foundation - Medium priority)\n• 1 AML alert (Under review - Medium severity)\n\n**Compliance Metrics:**\n• Average compliance score: 94.5%\n• KYC approval rate: 97%\n• Sanctions hits: 0\n• False positive rate: 12%`,
        data: { criticalIssues: 0 },
        actions: [
          { label: 'View Compliance Dashboard', action: 'navigate', target: '/admin/compliance' }
        ],
        suggestedFollowUps: [
          'Which organization has the lowest compliance score?',
          'Show me the audit log for this week'
        ]
      };
    }

    return {
      content: `As Super Administrator, I can help you with:\n\n• Platform revenue and P&L analysis\n• Bank and investor management\n• Transaction oversight\n• Compliance monitoring\n• Billing and subscriptions\n\nWhat would you like to know?`,
      data: null,
      actions: [],
      suggestedFollowUps: ROLE_CONTEXTS.super_admin.suggestedPrompts.slice(0, 3)
    };
  }

  getGenericResponse(message) {
    return `I understand you're asking about "${message}". I'm here to help you with tasks related to your role. Could you please provide more specific details about what you'd like to know?`;
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  generateWelcomeMessage(roleContext) {
    return `Hello! I'm your AI assistant for ForwardsFlow. As a **${roleContext.role}**, I can help you with:\n\n${roleContext.capabilities.map(c => `• ${c}`).join('\n')}\n\nHow can I assist you today?`;
  }

  buildSystemPrompt(roleContext, currentView) {
    return `You are an AI assistant for the ForwardsFlow platform, helping a ${roleContext.role}.

Role Description: ${roleContext.description}

Capabilities:
${roleContext.capabilities.map(c => `- ${c}`).join('\n')}

Knowledge Base Topics:
${roleContext.knowledgeBase.map(k => `- ${k}`).join('\n')}

${currentView ? `The user is currently viewing: ${currentView}` : ''}

Provide helpful, concise responses relevant to the user's role. Use data from the platform when available. Suggest relevant actions the user can take.`;
  }

  getConversation(conversationId) {
    return this.conversations.get(conversationId);
  }

  getConversationHistory(conversationId) {
    const conversation = this.conversations.get(conversationId);
    return conversation ? conversation.messages : [];
  }

  endConversation(conversationId) {
    this.conversations.delete(conversationId);
  }

  initializeDemoResponses() {
    // Initialize any demo-specific data here
    return {};
  }
}

// Export singleton instance
const amazonQService = new AmazonQService();
export default amazonQService;

// Also export the class for testing
export { AmazonQService };
