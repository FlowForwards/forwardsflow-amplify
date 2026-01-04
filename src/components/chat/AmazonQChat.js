// AmazonQChat.js - AI Chat Assistant for ForwardsFlow Dashboards
// Pure JavaScript version

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Minimize2, Maximize2, Copy, Check, Bot, User } from 'lucide-react';

// Role configurations for different dashboard users
const ROLE_CONFIGS = {
  platform_admin: {
    title: 'Platform AI Assistant',
    subtitle: 'Platform Administration Support',
    systemPrompt: 'You are an AI assistant for ForwardsFlow platform administrators. Help with platform-wide analytics, tenant management, system configuration, and compliance oversight.',
    suggestedQuestions: [
      'Show platform-wide metrics summary',
      'List all active tenants',
      'What are the current compliance alerts?',
      'Generate monthly platform report'
    ],
    accentColor: '#DC2626'
  },
  bank_admin: {
    title: 'Bank AI Assistant',
    subtitle: 'Bank Administration Support',
    systemPrompt: 'You are an AI assistant for bank administrators on ForwardsFlow. Help with bank operations, staff management, P&L analysis, and operational oversight.',
    suggestedQuestions: [
      'Show our bank performance summary',
      'List pending approvals',
      'What is our current P&L?',
      'Show staff performance metrics'
    ],
    accentColor: '#9333EA'
  },
  bank_lender: {
    title: 'Lending AI Assistant',
    subtitle: 'Loan Management Support',
    systemPrompt: 'You are an AI assistant for bank lenders on ForwardsFlow. Help with loan applications, credit scoring, portfolio management, and lending decisions.',
    suggestedQuestions: [
      'Show pending loan applications',
      'What is our current default rate?',
      'Analyze loan portfolio performance',
      'Show high-risk loans'
    ],
    accentColor: '#2563EB'
  },
  bank_caller: {
    title: 'Capital Markets AI',
    subtitle: 'Deposit & Investment Support',
    systemPrompt: 'You are an AI assistant for capital markets officers (bank callers) on ForwardsFlow. Help with deposit calls, investor negotiations, yield optimization, and capital raising activities.',
    suggestedQuestions: [
      'Show active deposit calls',
      'What investors have pending negotiations?',
      'Analyze current yield rates',
      'Show upcoming maturities'
    ],
    accentColor: '#4F46E5'
  },
  bank_compliance: {
    title: 'Compliance AI Assistant',
    subtitle: 'Regulatory & Compliance Support',
    systemPrompt: 'You are an AI assistant for compliance officers on ForwardsFlow. Help with AML alerts, KYC verification, regulatory reporting, and compliance monitoring.',
    suggestedQuestions: [
      'Show pending AML alerts',
      'List incomplete KYC verifications',
      'What regulatory reports are due?',
      'Show compliance risk summary'
    ],
    accentColor: '#D97706'
  },
  bank_risk: {
    title: 'Risk AI Assistant',
    subtitle: 'Risk Management Support',
    systemPrompt: 'You are an AI assistant for risk managers on ForwardsFlow. Help with portfolio risk assessment, credit scoring models, stress testing, and risk reporting.',
    suggestedQuestions: [
      'Show portfolio risk summary',
      'What is our VaR exposure?',
      'Run stress test scenario',
      'Show credit concentration risks'
    ],
    accentColor: '#E11D48'
  },
  investor_admin: {
    title: 'Investor AI Assistant',
    subtitle: 'Investment Management Support',
    systemPrompt: 'You are an AI assistant for investor administrators on ForwardsFlow. Help with investment team management, portfolio strategy, impact measurement, and investor relations.',
    suggestedQuestions: [
      'Show our investment portfolio',
      'What opportunities are available?',
      'Analyze our impact metrics',
      'Show team performance'
    ],
    accentColor: '#059669'
  },
  investor_analyst: {
    title: 'Analyst AI Assistant',
    subtitle: 'Investment Analysis Support',
    systemPrompt: 'You are an AI assistant for investment analysts on ForwardsFlow. Help with opportunity evaluation, portfolio performance analysis, impact metrics, and due diligence.',
    suggestedQuestions: [
      'Show new investment opportunities',
      'Analyze portfolio performance',
      'What is our impact score?',
      'Compare yields across banks'
    ],
    accentColor: '#10B981'
  }
};

const AmazonQChat = ({ userRole = 'bank_caller', tenantId, dashboardMetrics }) => {
  const config = ROLE_CONFIGS[userRole] || ROLE_CONFIGS.bank_caller;
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const copyToClipboard = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const sendMessage = async (content) => {
    if (!content.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const apiEndpoint = process.env.REACT_APP_AMAZONQ_API_ENDPOINT;
      
      if (!apiEndpoint) {
        throw new Error('API endpoint not configured');
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          context: {
            userRole,
            tenantId,
            systemPrompt: config.systemPrompt,
            dashboardMetrics
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I apologize, but I was unable to process your request. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please check that the API is configured correctly and try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleSuggestedQuestion = (question) => {
    sendMessage(question);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-50"
        style={{ backgroundColor: config.accentColor }}
        title={config.title}
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 bg-white rounded-xl shadow-2xl z-50 flex flex-col transition-all duration-300 ${
        isMinimized ? 'w-80 h-14' : 'w-96 h-[600px]'
      }`}
      style={{ maxHeight: 'calc(100vh - 100px)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-t-xl text-white cursor-pointer"
        style={{ backgroundColor: config.accentColor }}
        onClick={() => isMinimized && setIsMinimized(false)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{config.title}</h3>
            {!isMinimized && (
              <p className="text-xs opacity-80">{config.subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${config.accentColor}15` }}
                >
                  <Bot className="w-8 h-8" style={{ color: config.accentColor }} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  How can I help you today?
                </h4>
                <p className="text-sm text-gray-500 mb-6">
                  Ask me anything about your dashboard or try a suggestion below.
                </p>
                <div className="space-y-2">
                  {config.suggestedQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="w-full text-left px-4 py-2 text-sm rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-gray-600'
                        : ''
                    }`}
                    style={message.role === 'assistant' ? { backgroundColor: config.accentColor } : {}}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="mt-2 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: config.accentColor }}
                >
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm"
                style={{ '--tw-ring-color': config.accentColor }}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: config.accentColor }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default AmazonQChat;
