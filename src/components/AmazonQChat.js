/**
 * ForwardsFlow Amazon Q Chat Component
 * 
 * Reusable chat widget that can be embedded in any dashboard.
 * Features:
 * - Floating chat button
 * - Expandable chat panel
 * - Role-aware suggestions
 * - Conversation history
 * - Action buttons in responses
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageCircle, X, Send, Bot, User, ChevronDown,
  Sparkles, Loader2, ExternalLink, AlertCircle
} from 'lucide-react';

import amazonQService, { ROLE_CONTEXTS, PREMIUM_FEATURES } from '../../services/AmazonQService';

const AmazonQChat = ({ 
  userId, 
  userRole, 
  organizationId, 
  currentView = null,
  onAction = null,  // Callback for action buttons
  position = 'bottom-right' // 'bottom-right', 'bottom-left'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestedPrompts, setSuggestedPrompts] = useState([]);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check if feature is enabled for organization
  useEffect(() => {
    const checkFeatureEnabled = () => {
      try {
        const enabled = amazonQService.isFeatureEnabled(organizationId, 'amazon_q_chat');
        setIsEnabled(enabled);
      } catch (err) {
        setIsEnabled(false);
      }
    };
    
    checkFeatureEnabled();
  }, [organizationId]);

  // Auto-scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Start conversation when chat opens
  const startConversation = useCallback(() => {
    try {
      const result = amazonQService.startConversation(userId, userRole, organizationId);
      setConversationId(result.conversationId);
      setSuggestedPrompts(result.suggestedPrompts);
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: result.welcomeMessage,
        timestamp: new Date().toISOString()
      }]);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, [userId, userRole, organizationId]);

  // Handle opening chat
  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    if (!conversationId) {
      startConversation();
    }
  };

  // Handle sending a message
  const handleSend = async (messageText = null) => {
    const text = messageText || inputValue.trim();
    if (!text || isLoading) return;

    setInputValue('');
    setIsLoading(true);
    setError(null);

    // Add user message immediately
    const userMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await amazonQService.sendMessage(conversationId, text, currentView);
      setMessages(prev => [...prev, response.message]);
      
      if (response.suggestedFollowUps?.length > 0) {
        setSuggestedPrompts(response.suggestedFollowUps);
      }
    } catch (err) {
      setError(err.message);
      // Remove the user message if there was an error
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle action button clicks
  const handleActionClick = (action) => {
    if (onAction) {
      onAction(action);
    } else {
      // Default handling
      if (action.action === 'navigate' && action.target) {
        window.location.href = action.target;
      }
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Get role context for display
  const roleContext = ROLE_CONTEXTS[userRole] || ROLE_CONTEXTS.investor_analyst;

  // Position classes
  const positionClasses = position === 'bottom-left' 
    ? 'left-6 bottom-6' 
    : 'right-6 bottom-6';

  // If feature is not enabled, don't render anything
  if (!isEnabled) {
    return null;
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className={`fixed ${positionClasses} z-50 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group`}
          title="AI Assistant"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
          
          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 right-0 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            <Sparkles className="w-4 h-4 inline mr-1" />
            AI Assistant
          </div>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={`fixed ${positionClasses} z-50 ${
            isMinimized ? 'w-80' : 'w-96 h-[600px]'
          } bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 transition-all`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs text-indigo-200">{roleContext.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition"
              >
                <ChevronDown className={`w-5 h-5 transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Body (hidden when minimized) */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] ${
                        message.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-2xl rounded-br-md'
                          : 'bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-100'
                      } p-4`}
                    >
                      {/* Message Content */}
                      <div className="text-sm whitespace-pre-wrap">
                        {message.content.split('\n').map((line, i) => {
                          // Handle markdown-like formatting
                          if (line.startsWith('**') && line.endsWith('**')) {
                            return <p key={i} className="font-bold">{line.slice(2, -2)}</p>;
                          }
                          if (line.startsWith('• ')) {
                            return <p key={i} className="ml-2">{line}</p>;
                          }
                          if (line.startsWith('|')) {
                            return <p key={i} className="font-mono text-xs">{line}</p>;
                          }
                          return <p key={i}>{line}</p>;
                        })}
                      </div>

                      {/* Action Buttons */}
                      {message.actions && message.actions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.actions.map((action, i) => (
                            <button
                              key={i}
                              onClick={() => handleActionClick(action)}
                              className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-200 transition flex items-center gap-1"
                            >
                              {action.label}
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Timestamp */}
                      <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-100 p-4">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                        <span className="text-sm text-gray-500">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div className="flex justify-center">
                    <div className="bg-red-50 text-red-700 rounded-lg p-3 flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Prompts */}
              {suggestedPrompts.length > 0 && messages.length < 4 && (
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedPrompts.slice(0, 3).map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(prompt)}
                        disabled={isLoading}
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition truncate max-w-[200px]"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!inputValue.trim() || isLoading}
                    className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Powered by Amazon Q • <span className="text-indigo-500">Premium Feature</span>
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AmazonQChat;
