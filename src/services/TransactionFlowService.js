/**
 * ForwardsFlow Transaction Flow Service
 * 
 * Manages the complete 16-step demo transaction cycle:
 * 1. Bank caller creates capital call
 * 2. Impact investor notified
 * 3. Impact investor responds
 * 4. Bank caller notified of response
 * 5. Bank caller accepts response
 * 6. Impact investor notified of acceptance
 * 7. Impact investor inputs settlement bank parameters
 * 8. Impact investor inputs repatriation account details
 * 9. Impact investor inputs KYC details
 * 10. Bank compliance notified of settlement intent
 * 11. Bank compliance approves KYC
 * 12. Impact investor notified of KYC approval
 * 13. Impact investor makes settlement (simulated)
 * 14. Bank caller notified of settlement
 * 15. Instrument appears in investor portfolio
 * 16. Instrument appears in bank caller dashboard
 */

import { v4 as uuidv4 } from 'uuid';

// Transaction Status Flow
export const TRANSACTION_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  INVESTOR_NOTIFIED: 'investor_notified',
  INVESTOR_RESPONDED: 'investor_responded',
  BANK_REVIEWING: 'bank_reviewing',
  ACCEPTED: 'accepted',
  SETTLEMENT_DETAILS_PENDING: 'settlement_details_pending',
  KYC_SUBMITTED: 'kyc_submitted',
  KYC_REVIEW: 'kyc_review',
  KYC_APPROVED: 'kyc_approved',
  SETTLEMENT_PENDING: 'settlement_pending',
  SETTLEMENT_PROCESSING: 'settlement_processing',
  COMPLETED: 'completed'
};

// Notification Types
export const NOTIFICATION_TYPE = {
  CAPITAL_CALL_PUBLISHED: 'capital_call_published',
  INVESTOR_RESPONSE: 'investor_response',
  BANK_ACCEPTANCE: 'bank_acceptance',
  KYC_REQUIRED: 'kyc_required',
  KYC_SUBMITTED: 'kyc_submitted',
  KYC_APPROVED: 'kyc_approved',
  SETTLEMENT_INTENT: 'settlement_intent',
  SETTLEMENT_COMPLETED: 'settlement_completed',
  INSTRUMENT_ADDED: 'instrument_added'
};

class TransactionFlowService {
  constructor() {
    this.transactions = new Map();
    this.notifications = [];
    this.eventListeners = new Map();
  }

  // ============================================================================
  // EVENT SYSTEM
  // ============================================================================

  addEventListener(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  removeEventListener(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => callback(data));
    }
  }

  // ============================================================================
  // STEP 1: Bank Caller Creates Capital Call
  // ============================================================================

  createCapitalCall(bankId, callerId, callDetails) {
    const txnId = `TXN-${new Date().getFullYear()}-${String(this.transactions.size + 1).padStart(5, '0')}`;
    
    const transaction = {
      id: uuidv4(),
      txnRef: txnId,
      bankId,
      createdBy: callerId,
      status: TRANSACTION_STATUS.DRAFT,
      currentStep: 1,
      instrumentType: callDetails.instrumentType || 'Fixed Deposit',
      amount: callDetails.amount,
      currency: callDetails.currency || 'USD',
      interestRate: callDetails.interestRate,
      fxSpread: callDetails.fxSpread || 1.0,
      hedgingFee: callDetails.hedgingFee || 2.0,
      totalYield: callDetails.interestRate + (callDetails.fxSpread || 1.0) + (callDetails.hedgingFee || 2.0),
      tenorMonths: callDetails.tenorMonths,
      maturityDate: this.calculateMaturityDate(callDetails.tenorMonths),
      fxRate: callDetails.fxRate || {
        spot: 155.00,
        forward: null,
        hedgedRate: null
      },
      compliance: {
        fatcaCompliant: true,
        sanctionsCleared: true,
        capitalAdequacy: callDetails.capitalAdequacy || 18.2
      },
      createdAt: new Date().toISOString(),
      publishedAt: null,
      acceptedAt: null,
      acceptedBy: null,
      investorResponse: null,
      settlementDetails: null,
      kycDetails: null,
      kycApprovedAt: null,
      kycApprovedBy: null,
      settledAt: null,
      completedAt: null,
      history: [{
        step: 1,
        action: 'Capital call created',
        actor: callerId,
        timestamp: new Date().toISOString()
      }]
    };

    // Calculate forward FX rate based on tenor
    transaction.fxRate.forward = this.calculateForwardRate(
      transaction.fxRate.spot,
      transaction.tenorMonths,
      transaction.hedgingFee
    );
    transaction.fxRate.hedgedRate = transaction.fxRate.spot * (1 + transaction.hedgingFee / 100);

    this.transactions.set(transaction.id, transaction);
    this.emit('transaction_created', transaction);

    return transaction;
  }

  // ============================================================================
  // STEP 1b: Publish Capital Call (triggers Step 2)
  // ============================================================================

  publishCapitalCall(transactionId) {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) throw new Error('Transaction not found');

    transaction.status = TRANSACTION_STATUS.PUBLISHED;
    transaction.publishedAt = new Date().toISOString();
    transaction.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
    transaction.history.push({
      step: 1,
      action: 'Capital call published',
      timestamp: new Date().toISOString()
    });

    this.emit('capital_call_published', transaction);

    // Step 2: Notify investors
    this.notifyInvestors(transaction);

    return transaction;
  }

  // ============================================================================
  // STEP 2: Notify Impact Investor
  // ============================================================================

  notifyInvestors(transaction) {
    const notification = {
      id: uuidv4(),
      type: NOTIFICATION_TYPE.CAPITAL_CALL_PUBLISHED,
      transactionId: transaction.id,
      txnRef: transaction.txnRef,
      recipientRole: 'investor',
      recipientId: null, // Broadcast to all qualified investors
      title: 'New Capital Call Available',
      message: `A new ${this.formatCurrency(transaction.amount)} ${transaction.instrumentType} opportunity is available from ${transaction.bankId} at ${transaction.totalYield}% yield.`,
      data: {
        amount: transaction.amount,
        currency: transaction.currency,
        yield: transaction.totalYield,
        tenorMonths: transaction.tenorMonths,
        expiresAt: transaction.expiresAt
      },
      read: false,
      createdAt: new Date().toISOString()
    };

    this.notifications.push(notification);
    
    transaction.status = TRANSACTION_STATUS.INVESTOR_NOTIFIED;
    transaction.currentStep = 2;
    transaction.history.push({
      step: 2,
      action: 'Investors notified',
      timestamp: new Date().toISOString()
    });

    this.emit('investors_notified', { transaction, notification });

    return notification;
  }

  // ============================================================================
  // STEP 3: Impact Investor Responds
  // ============================================================================

  investorRespond(transactionId, investorId, response) {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) throw new Error('Transaction not found');

    transaction.investorResponse = {
      investorId,
      action: response.action, // 'accept', 'counter', 'decline'
      proposedAmount: response.proposedAmount || transaction.amount,
      proposedRate: response.proposedRate || transaction.interestRate,
      message: response.message,
      respondedAt: new Date().toISOString()
    };

    transaction.status = TRANSACTION_STATUS.INVESTOR_RESPONDED;
    transaction.currentStep = 3;
    transaction.history.push({
      step: 3,
      action: `Investor ${response.action === 'accept' ? 'accepted' : response.action === 'counter' ? 'countered' : 'declined'}`,
      actor: investorId,
      timestamp: new Date().toISOString()
    });

    this.emit('investor_responded', transaction);

    // Step 4: Notify bank caller
    this.notifyBankOfResponse(transaction);

    return transaction;
  }

  // ============================================================================
  // STEP 4: Bank Caller Notified of Response
  // ============================================================================

  notifyBankOfResponse(transaction) {
    const notification = {
      id: uuidv4(),
      type: NOTIFICATION_TYPE.INVESTOR_RESPONSE,
      transactionId: transaction.id,
      txnRef: transaction.txnRef,
      recipientRole: 'bank_caller',
      recipientId: transaction.createdBy,
      title: 'Investor Response Received',
      message: `An investor has ${transaction.investorResponse.action === 'accept' ? 'accepted' : 'responded to'} your capital call ${transaction.txnRef}.`,
      data: transaction.investorResponse,
      read: false,
      createdAt: new Date().toISOString()
    };

    this.notifications.push(notification);
    
    transaction.status = TRANSACTION_STATUS.BANK_REVIEWING;
    transaction.currentStep = 4;
    transaction.history.push({
      step: 4,
      action: 'Bank caller notified of response',
      timestamp: new Date().toISOString()
    });

    this.emit('bank_notified_of_response', { transaction, notification });

    return notification;
  }

  // ============================================================================
  // STEP 5: Bank Caller Accepts Response
  // ============================================================================

  bankAcceptResponse(transactionId, callerId, acceptanceDetails = {}) {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) throw new Error('Transaction not found');

    transaction.acceptedBy = transaction.investorResponse.investorId;
    transaction.acceptedAt = new Date().toISOString();
    transaction.status = TRANSACTION_STATUS.ACCEPTED;
    transaction.currentStep = 5;

    // Update terms if counter-offer was accepted
    if (acceptanceDetails.acceptCounterTerms) {
      transaction.amount = transaction.investorResponse.proposedAmount;
      transaction.interestRate = transaction.investorResponse.proposedRate;
      transaction.totalYield = transaction.interestRate + transaction.fxSpread + transaction.hedgingFee;
    }

    transaction.history.push({
      step: 5,
      action: 'Bank caller accepted investor response',
      actor: callerId,
      timestamp: new Date().toISOString()
    });

    this.emit('bank_accepted_response', transaction);

    // Step 6: Notify investor of acceptance
    this.notifyInvestorOfAcceptance(transaction);

    return transaction;
  }

  // ============================================================================
  // STEP 6: Investor Notified of Acceptance
  // ============================================================================

  notifyInvestorOfAcceptance(transaction) {
    const notification = {
      id: uuidv4(),
      type: NOTIFICATION_TYPE.BANK_ACCEPTANCE,
      transactionId: transaction.id,
      txnRef: transaction.txnRef,
      recipientRole: 'investor',
      recipientId: transaction.acceptedBy,
      title: 'Capital Call Accepted',
      message: `Your response to capital call ${transaction.txnRef} has been accepted. Please provide settlement details.`,
      data: {
        amount: transaction.amount,
        yield: transaction.totalYield,
        nextStep: 'settlement_details'
      },
      read: false,
      createdAt: new Date().toISOString()
    };

    this.notifications.push(notification);
    
    transaction.status = TRANSACTION_STATUS.SETTLEMENT_DETAILS_PENDING;
    transaction.currentStep = 6;
    transaction.history.push({
      step: 6,
      action: 'Investor notified of acceptance',
      timestamp: new Date().toISOString()
    });

    this.emit('investor_notified_of_acceptance', { transaction, notification });

    return notification;
  }

  // ============================================================================
  // STEP 7: Investor Inputs Settlement Bank Parameters
  // ============================================================================

  submitSettlementDetails(transactionId, investorId, settlementDetails) {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) throw new Error('Transaction not found');
    if (transaction.acceptedBy !== investorId) throw new Error('Unauthorized');

    transaction.settlementDetails = {
      bank: settlementDetails.bank,
      accountNumber: settlementDetails.accountNumber,
      swiftCode: settlementDetails.swiftCode,
      currency: settlementDetails.currency,
      correspondentBank: settlementDetails.correspondentBank,
      reference: settlementDetails.reference,
      submittedAt: new Date().toISOString()
    };

    transaction.currentStep = 7;
    transaction.history.push({
      step: 7,
      action: 'Settlement bank parameters submitted',
      actor: investorId,
      timestamp: new Date().toISOString()
    });

    this.emit('settlement_details_submitted', transaction);

    return transaction;
  }

  // ============================================================================
  // STEP 8: Investor Inputs Repatriation Account (Settings)
  // ============================================================================

  submitRepatriationAccount(investorId, accountDetails) {
    // This is stored at investor profile level, not transaction level
    const repatriationAccount = {
      investorId,
      bank: accountDetails.bank,
      accountNumber: accountDetails.accountNumber,
      swiftCode: accountDetails.swiftCode,
      currency: accountDetails.currency,
      updatedAt: new Date().toISOString()
    };

    this.emit('repatriation_account_updated', repatriationAccount);

    return repatriationAccount;
  }

  // ============================================================================
  // STEP 9: Investor Inputs KYC Details (Settings)
  // ============================================================================

  submitKycDetails(transactionId, investorId, kycDetails) {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) throw new Error('Transaction not found');

    transaction.kycDetails = {
      documents: kycDetails.documents.map(doc => ({
        type: doc.type,
        filename: doc.filename,
        uploadedAt: new Date().toISOString(),
        status: 'pending_review'
      })),
      sourceOfFunds: kycDetails.sourceOfFunds,
      beneficialOwners: kycDetails.beneficialOwners,
      submittedAt: new Date().toISOString()
    };

    transaction.status = TRANSACTION_STATUS.KYC_SUBMITTED;
    transaction.currentStep = 9;
    transaction.history.push({
      step: 9,
      action: 'KYC documents submitted',
      actor: investorId,
      timestamp: new Date().toISOString()
    });

    this.emit('kyc_submitted', transaction);

    // Step 10: Notify compliance
    this.notifyComplianceOfKyc(transaction);

    return transaction;
  }

  // ============================================================================
  // STEP 10: Bank Compliance Notified
  // ============================================================================

  notifyComplianceOfKyc(transaction) {
    const notification = {
      id: uuidv4(),
      type: NOTIFICATION_TYPE.KYC_SUBMITTED,
      transactionId: transaction.id,
      txnRef: transaction.txnRef,
      recipientRole: 'bank_compliance',
      recipientId: null, // All compliance officers for this bank
      title: 'KYC Review Required',
      message: `KYC documents submitted for ${transaction.txnRef}. Please review and approve.`,
      data: {
        investorId: transaction.acceptedBy,
        documentCount: transaction.kycDetails.documents.length
      },
      read: false,
      createdAt: new Date().toISOString()
    };

    this.notifications.push(notification);
    
    transaction.status = TRANSACTION_STATUS.KYC_REVIEW;
    transaction.currentStep = 10;
    transaction.history.push({
      step: 10,
      action: 'Compliance officer notified',
      timestamp: new Date().toISOString()
    });

    this.emit('compliance_notified', { transaction, notification });

    return notification;
  }

  // ============================================================================
  // STEP 11: Bank Compliance Approves KYC
  // ============================================================================

  approveKyc(transactionId, complianceOfficerId, approvalDetails = {}) {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) throw new Error('Transaction not found');

    transaction.kycApprovedAt = new Date().toISOString();
    transaction.kycApprovedBy = complianceOfficerId;
    transaction.kycDetails.documents = transaction.kycDetails.documents.map(doc => ({
      ...doc,
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: complianceOfficerId
    }));
    transaction.kycDetails.amlStatus = 'cleared';
    transaction.kycDetails.riskRating = approvalDetails.riskRating || 'low';

    transaction.status = TRANSACTION_STATUS.KYC_APPROVED;
    transaction.currentStep = 11;
    transaction.history.push({
      step: 11,
      action: 'KYC approved by compliance',
      actor: complianceOfficerId,
      timestamp: new Date().toISOString()
    });

    this.emit('kyc_approved', transaction);

    // Step 12: Notify investor
    this.notifyInvestorOfKycApproval(transaction);

    return transaction;
  }

  // ============================================================================
  // STEP 12: Investor Notified of KYC Approval
  // ============================================================================

  notifyInvestorOfKycApproval(transaction) {
    const notification = {
      id: uuidv4(),
      type: NOTIFICATION_TYPE.KYC_APPROVED,
      transactionId: transaction.id,
      txnRef: transaction.txnRef,
      recipientRole: 'investor',
      recipientId: transaction.acceptedBy,
      title: 'KYC Approved',
      message: `Your KYC for ${transaction.txnRef} has been approved. You may now proceed with settlement.`,
      data: {
        amount: transaction.amount,
        settlementDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days
      },
      read: false,
      createdAt: new Date().toISOString()
    };

    this.notifications.push(notification);
    
    transaction.status = TRANSACTION_STATUS.SETTLEMENT_PENDING;
    transaction.currentStep = 12;
    transaction.history.push({
      step: 12,
      action: 'Investor notified of KYC approval',
      timestamp: new Date().toISOString()
    });

    this.emit('investor_notified_of_kyc_approval', { transaction, notification });

    return notification;
  }

  // ============================================================================
  // STEP 13: Investor Makes Settlement (Simulated)
  // ============================================================================

  processSettlement(transactionId, investorId, settlementConfirmation) {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) throw new Error('Transaction not found');
    if (transaction.acceptedBy !== investorId) throw new Error('Unauthorized');

    transaction.settlementDetails = {
      ...transaction.settlementDetails,
      confirmationNumber: settlementConfirmation.confirmationNumber || `SWIFT-${Date.now()}`,
      settlementAmount: transaction.amount,
      currency: transaction.currency,
      settledAt: new Date().toISOString()
    };

    transaction.status = TRANSACTION_STATUS.SETTLEMENT_PROCESSING;
    transaction.settledAt = new Date().toISOString();
    transaction.currentStep = 13;
    transaction.history.push({
      step: 13,
      action: 'Settlement processed',
      actor: investorId,
      data: { confirmationNumber: transaction.settlementDetails.confirmationNumber },
      timestamp: new Date().toISOString()
    });

    this.emit('settlement_processed', transaction);

    // Step 14: Notify bank caller
    this.notifyBankOfSettlement(transaction);

    return transaction;
  }

  // ============================================================================
  // STEP 14: Bank Caller Notified of Settlement
  // ============================================================================

  notifyBankOfSettlement(transaction) {
    const notification = {
      id: uuidv4(),
      type: NOTIFICATION_TYPE.SETTLEMENT_COMPLETED,
      transactionId: transaction.id,
      txnRef: transaction.txnRef,
      recipientRole: 'bank_caller',
      recipientId: transaction.createdBy,
      title: 'Settlement Received',
      message: `${this.formatCurrency(transaction.amount)} settlement received for ${transaction.txnRef}.`,
      data: {
        amount: transaction.amount,
        confirmationNumber: transaction.settlementDetails.confirmationNumber
      },
      read: false,
      createdAt: new Date().toISOString()
    };

    this.notifications.push(notification);
    
    transaction.currentStep = 14;
    transaction.history.push({
      step: 14,
      action: 'Bank caller notified of settlement',
      timestamp: new Date().toISOString()
    });

    this.emit('bank_notified_of_settlement', { transaction, notification });

    // Steps 15 & 16: Complete transaction and add to portfolios
    this.completeTransaction(transaction);

    return notification;
  }

  // ============================================================================
  // STEPS 15 & 16: Add to Portfolios and Complete
  // ============================================================================

  completeTransaction(transaction) {
    transaction.status = TRANSACTION_STATUS.COMPLETED;
    transaction.completedAt = new Date().toISOString();
    transaction.currentStep = 16;

    // Create portfolio entries
    const investorPortfolioEntry = {
      id: uuidv4(),
      transactionId: transaction.id,
      txnRef: transaction.txnRef,
      type: 'investment',
      investorId: transaction.acceptedBy,
      bankId: transaction.bankId,
      instrumentType: transaction.instrumentType,
      principal: transaction.amount,
      currency: transaction.currency,
      yield: transaction.totalYield,
      maturityDate: transaction.maturityDate,
      expectedReturn: transaction.amount * (transaction.totalYield / 100),
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const bankPortfolioEntry = {
      id: uuidv4(),
      transactionId: transaction.id,
      txnRef: transaction.txnRef,
      type: 'liability',
      bankId: transaction.bankId,
      investorId: transaction.acceptedBy,
      instrumentType: transaction.instrumentType,
      principal: transaction.amount,
      currency: transaction.currency,
      interestRate: transaction.interestRate,
      maturityDate: transaction.maturityDate,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    transaction.history.push({
      step: 15,
      action: 'Instrument added to investor portfolio',
      timestamp: new Date().toISOString()
    });

    transaction.history.push({
      step: 16,
      action: 'Instrument added to bank dashboard',
      timestamp: new Date().toISOString()
    });

    // Emit completion events
    this.emit('investor_portfolio_updated', investorPortfolioEntry);
    this.emit('bank_portfolio_updated', bankPortfolioEntry);
    this.emit('transaction_completed', transaction);

    // Notify both parties
    this.notifications.push({
      id: uuidv4(),
      type: NOTIFICATION_TYPE.INSTRUMENT_ADDED,
      transactionId: transaction.id,
      txnRef: transaction.txnRef,
      recipientRole: 'investor',
      recipientId: transaction.acceptedBy,
      title: 'Investment Active',
      message: `Your ${this.formatCurrency(transaction.amount)} investment is now active in your portfolio.`,
      read: false,
      createdAt: new Date().toISOString()
    });

    this.notifications.push({
      id: uuidv4(),
      type: NOTIFICATION_TYPE.INSTRUMENT_ADDED,
      transactionId: transaction.id,
      txnRef: transaction.txnRef,
      recipientRole: 'bank_caller',
      recipientId: transaction.createdBy,
      title: 'Capital Received',
      message: `${this.formatCurrency(transaction.amount)} has been added to your capital dashboard.`,
      read: false,
      createdAt: new Date().toISOString()
    });

    return transaction;
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  calculateMaturityDate(tenorMonths) {
    const date = new Date();
    date.setMonth(date.getMonth() + tenorMonths);
    return date.toISOString().split('T')[0];
  }

  calculateForwardRate(spotRate, tenorMonths, hedgingFee) {
    // Simplified forward rate calculation
    const annualizedFee = hedgingFee * (tenorMonths / 12);
    return spotRate * (1 + annualizedFee / 100);
  }

  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  getTransaction(transactionId) {
    return this.transactions.get(transactionId);
  }

  getAllTransactions() {
    return Array.from(this.transactions.values());
  }

  getTransactionsByStatus(status) {
    return this.getAllTransactions().filter(t => t.status === status);
  }

  getTransactionsByBank(bankId) {
    return this.getAllTransactions().filter(t => t.bankId === bankId);
  }

  getTransactionsByInvestor(investorId) {
    return this.getAllTransactions().filter(t => t.acceptedBy === investorId);
  }

  getNotificationsByRecipient(recipientId) {
    return this.notifications.filter(n => n.recipientId === recipientId || n.recipientId === null);
  }

  getUnreadNotifications(recipientId) {
    return this.getNotificationsByRecipient(recipientId).filter(n => !n.read);
  }

  markNotificationRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
    return notification;
  }

  // Get transaction flow progress
  getTransactionProgress(transactionId) {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) return null;

    return {
      currentStep: transaction.currentStep,
      totalSteps: 16,
      percentage: Math.round((transaction.currentStep / 16) * 100),
      status: transaction.status,
      history: transaction.history
    };
  }
}

// Export singleton instance
const transactionFlowService = new TransactionFlowService();
export default transactionFlowService;

// Also export the class for testing
export { TransactionFlowService };
