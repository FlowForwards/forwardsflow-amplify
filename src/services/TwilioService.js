/**
 * ForwardsFlow Twilio WhatsApp Service
 * 
 * Handles WhatsApp messaging for:
 * - Loan application notifications
 * - Loan approval/disbursement notifications
 * - Payment reminders
 * - Collection notifications
 * 
 * Twilio Configuration:
 * All credentials are stored in Amplify Environment Variables:
 * - REACT_APP_TWILIO_ACCOUNT_SID
 * - REACT_APP_TWILIO_AUTH_TOKEN
 * - REACT_APP_TWILIO_PHONE_NUMBER
 * - REACT_APP_TWILIO_API_KEY
 * - REACT_APP_TWILIO_API_SECRET
 */

// For demo purposes, we'll simulate the Twilio API calls
// In production, you would use the actual Twilio SDK

const TWILIO_CONFIG = {
  accountSid: process.env.REACT_APP_TWILIO_ACCOUNT_SID || '',
  authToken: process.env.REACT_APP_TWILIO_AUTH_TOKEN || '',
  trialNumber: process.env.REACT_APP_TWILIO_PHONE_NUMBER || '',
  apiKey: process.env.REACT_APP_TWILIO_API_KEY || '',
  apiSecret: process.env.REACT_APP_TWILIO_API_SECRET || ''
};

// Message Templates
export const MESSAGE_TEMPLATES = {
  LOAN_APPLICATION_RECEIVED: {
    id: 'loan_app_received',
    template: `Hi {{name}}, your loan application for KES {{amount}} has been received. Reference: {{reference}}. We'll process it within 24 hours.`
  },
  LOAN_APPROVED: {
    id: 'loan_approved',
    template: `Great news {{name}}! Your loan of KES {{amount}} has been approved. The funds will be sent to your M-Pesa shortly. Reference: {{reference}}`
  },
  LOAN_DISBURSED: {
    id: 'loan_disbursed',
    template: `{{name}}, KES {{amount}} has been sent to your M-Pesa {{phone}}. Your loan reference is {{reference}}. Repayment due: {{dueDate}}.`
  },
  PAYMENT_REMINDER: {
    id: 'payment_reminder',
    template: `Hi {{name}}, your loan payment of KES {{amount}} is due on {{dueDate}}. Pay via M-Pesa Paybill: {{paybill}} Account: {{reference}}`
  },
  PAYMENT_OVERDUE: {
    id: 'payment_overdue',
    template: `{{name}}, your payment of KES {{amount}} is now {{days}} days overdue. Please pay immediately to avoid penalties. Reference: {{reference}}`
  },
  PAYMENT_RECEIVED: {
    id: 'payment_received',
    template: `Thank you {{name}}! We received your payment of KES {{amount}}. Remaining balance: KES {{balance}}. Reference: {{reference}}`
  },
  LOAN_REJECTED: {
    id: 'loan_rejected',
    template: `Hi {{name}}, unfortunately your loan application ({{reference}}) was not approved at this time. You may reapply after 30 days.`
  }
};

class TwilioService {
  constructor() {
    this.config = TWILIO_CONFIG;
    this.messageLog = [];
    this.isDemo = true; // Set to false in production
  }

  /**
   * Check if Twilio is properly configured
   * @returns {boolean} True if all required config values are present
   */
  isConfigured() {
    return !!(
      this.config.accountSid &&
      this.config.authToken &&
      this.config.trialNumber
    );
  }

  /**
   * Format phone number to WhatsApp format
   * @param {string} phone - Phone number
   * @returns {string} Formatted WhatsApp number
   */
  formatWhatsAppNumber(phone) {
    // Remove any spaces or special characters
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // Ensure it starts with +
    if (!cleaned.startsWith('+')) {
      // Assume Kenya if no country code
      if (cleaned.startsWith('0')) {
        cleaned = '+254' + cleaned.substring(1);
      } else if (cleaned.startsWith('254')) {
        cleaned = '+' + cleaned;
      } else {
        cleaned = '+254' + cleaned;
      }
    }
    
    return `whatsapp:${cleaned}`;
  }

  /**
   * Replace template variables with actual values
   * @param {string} template - Message template
   * @param {object} variables - Variable values
   * @returns {string} Formatted message
   */
  formatMessage(template, variables) {
    let message = template;
    Object.keys(variables).forEach(key => {
      message = message.replace(new RegExp(`{{${key}}}`, 'g'), variables[key]);
    });
    return message;
  }

  /**
   * Send WhatsApp message
   * @param {string} to - Recipient phone number
   * @param {string} templateId - Template ID from MESSAGE_TEMPLATES
   * @param {object} variables - Template variables
   * @returns {Promise<object>} Message result
   */
  async sendMessage(to, templateId, variables) {
    const template = Object.values(MESSAGE_TEMPLATES).find(t => t.id === templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const formattedTo = this.formatWhatsAppNumber(to);
    const formattedFrom = `whatsapp:${this.config.trialNumber}`;
    const body = this.formatMessage(template.template, variables);

    const messageRecord = {
      id: `MSG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      to: formattedTo,
      from: formattedFrom,
      templateId,
      body,
      variables,
      status: 'pending',
      createdAt: new Date().toISOString(),
      sentAt: null,
      deliveredAt: null,
      readAt: null
    };

    if (this.isDemo) {
      // Simulate sending in demo mode
      return this.simulateSend(messageRecord);
    } else {
      // Check configuration before attempting real send
      if (!this.isConfigured()) {
        console.warn('[TwilioService] Missing configuration. Set environment variables.');
        return this.simulateSend(messageRecord);
      }
      // Real Twilio API call
      return this.sendViaTwilio(messageRecord);
    }
  }

  /**
   * Simulate sending a message (demo mode)
   */
  async simulateSend(messageRecord) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    messageRecord.status = 'sent';
    messageRecord.sentAt = new Date().toISOString();
    messageRecord.twilioSid = `SM${Math.random().toString(36).substr(2, 32)}`;

    // Simulate delivery after 1 second
    setTimeout(() => {
      messageRecord.status = 'delivered';
      messageRecord.deliveredAt = new Date().toISOString();
    }, 1000);

    this.messageLog.push(messageRecord);

    console.log(`[WhatsApp Demo] Sent to ${messageRecord.to}:`, messageRecord.body);

    return {
      success: true,
      messageId: messageRecord.id,
      twilioSid: messageRecord.twilioSid,
      status: messageRecord.status
    };
  }

  /**
   * Send via actual Twilio API (production)
   */
  async sendViaTwilio(messageRecord) {
    try {
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.config.accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + btoa(`${this.config.accountSid}:${this.config.authToken}`),
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            From: messageRecord.from,
            To: messageRecord.to,
            Body: messageRecord.body
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        messageRecord.status = 'sent';
        messageRecord.sentAt = new Date().toISOString();
        messageRecord.twilioSid = data.sid;
        this.messageLog.push(messageRecord);

        return {
          success: true,
          messageId: messageRecord.id,
          twilioSid: data.sid,
          status: data.status
        };
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      messageRecord.status = 'failed';
      messageRecord.error = error.message;
      this.messageLog.push(messageRecord);

      return {
        success: false,
        messageId: messageRecord.id,
        error: error.message
      };
    }
  }

  // ============================================================================
  // CONVENIENCE METHODS FOR COMMON MESSAGE TYPES
  // ============================================================================

  /**
   * Send loan application received notification
   */
  async sendLoanApplicationReceived(phone, name, amount, reference) {
    return this.sendMessage(phone, 'loan_app_received', {
      name,
      amount: this.formatAmount(amount),
      reference
    });
  }

  /**
   * Send loan approved notification
   */
  async sendLoanApproved(phone, name, amount, reference) {
    return this.sendMessage(phone, 'loan_approved', {
      name,
      amount: this.formatAmount(amount),
      reference
    });
  }

  /**
   * Send loan disbursed notification
   */
  async sendLoanDisbursed(phone, name, amount, reference, dueDate) {
    return this.sendMessage(phone, 'loan_disbursed', {
      name,
      amount: this.formatAmount(amount),
      phone: this.formatPhone(phone),
      reference,
      dueDate: this.formatDate(dueDate)
    });
  }

  /**
   * Send payment reminder
   */
  async sendPaymentReminder(phone, name, amount, dueDate, reference, paybill = '123456') {
    return this.sendMessage(phone, 'payment_reminder', {
      name,
      amount: this.formatAmount(amount),
      dueDate: this.formatDate(dueDate),
      reference,
      paybill
    });
  }

  /**
   * Send overdue payment notification
   */
  async sendPaymentOverdue(phone, name, amount, days, reference) {
    return this.sendMessage(phone, 'payment_overdue', {
      name,
      amount: this.formatAmount(amount),
      days: days.toString(),
      reference
    });
  }

  /**
   * Send payment received confirmation
   */
  async sendPaymentReceived(phone, name, amount, balance, reference) {
    return this.sendMessage(phone, 'payment_received', {
      name,
      amount: this.formatAmount(amount),
      balance: this.formatAmount(balance),
      reference
    });
  }

  /**
   * Send loan rejection notification
   */
  async sendLoanRejected(phone, name, reference) {
    return this.sendMessage(phone, 'loan_rejected', {
      name,
      reference
    });
  }

  // ============================================================================
  // BATCH OPERATIONS
  // ============================================================================

  /**
   * Send batch reminders to multiple recipients
   */
  async sendBatchReminders(recipients) {
    const results = [];
    for (const recipient of recipients) {
      try {
        const result = await this.sendPaymentReminder(
          recipient.phone,
          recipient.name,
          recipient.amount,
          recipient.dueDate,
          recipient.reference
        );
        results.push({ ...recipient, ...result });
        
        // Rate limiting: wait 100ms between messages
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        results.push({ ...recipient, success: false, error: error.message });
      }
    }
    return results;
  }

  /**
   * Send batch disbursement notifications
   */
  async sendBatchDisbursements(disbursements) {
    const results = [];
    for (const disbursement of disbursements) {
      try {
        const result = await this.sendLoanDisbursed(
          disbursement.phone,
          disbursement.name,
          disbursement.amount,
          disbursement.reference,
          disbursement.dueDate
        );
        results.push({ ...disbursement, ...result });
        
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        results.push({ ...disbursement, success: false, error: error.message });
      }
    }
    return results;
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  formatAmount(amount) {
    return new Intl.NumberFormat('en-KE').format(amount);
  }

  formatPhone(phone) {
    // Return last 9 digits with asterisks for privacy
    const digits = phone.replace(/\D/g, '');
    const last4 = digits.slice(-4);
    return `****${last4}`;
  }

  formatDate(date) {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return date.toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Get message log
   */
  getMessageLog(filters = {}) {
    let log = [...this.messageLog];
    
    if (filters.phone) {
      log = log.filter(m => m.to.includes(filters.phone));
    }
    if (filters.templateId) {
      log = log.filter(m => m.templateId === filters.templateId);
    }
    if (filters.status) {
      log = log.filter(m => m.status === filters.status);
    }
    if (filters.fromDate) {
      log = log.filter(m => new Date(m.createdAt) >= new Date(filters.fromDate));
    }
    if (filters.toDate) {
      log = log.filter(m => new Date(m.createdAt) <= new Date(filters.toDate));
    }
    
    return log.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  /**
   * Get message statistics
   */
  getMessageStats() {
    const log = this.messageLog;
    return {
      total: log.length,
      sent: log.filter(m => m.status === 'sent' || m.status === 'delivered').length,
      delivered: log.filter(m => m.status === 'delivered').length,
      failed: log.filter(m => m.status === 'failed').length,
      pending: log.filter(m => m.status === 'pending').length,
      byTemplate: Object.values(MESSAGE_TEMPLATES).map(t => ({
        templateId: t.id,
        count: log.filter(m => m.templateId === t.id).length
      }))
    };
  }
}

// Export singleton instance
const twilioService = new TwilioService();
export default twilioService;

// Also export the class for testing
export { TwilioService };
