'use client';

import { useState, useEffect, useRef } from 'react';

interface ChatbotConfig {
  isEnabled: boolean;
  welcomeMessage: string;
  position: 'bottom-right' | 'bottom-left';
  primaryColor: string;
  textColor: string;
  backgroundColor: string;
  borderRadius: string;
  showOnPages: string;
  autoOpenDelay?: number | null;
  offlineMessage: string;
  businessHours?: string | null;
  quickReplies: string;
}

interface ChatMessage {
  id: string;
  message: string;
  isFromGuest: boolean;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ChatbotConfig | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '' });
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showQAPanel, setShowQAPanel] = useState(false);
  const [qaPairs, setQaPairs] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Delay chatbot initialization to not block initial page load
    const timer = setTimeout(() => {
      loadChatbotConfig();
      loadQAPairs();
    }, 2000); // Load after 2 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (config?.autoOpenDelay && config.autoOpenDelay > 0) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, config.autoOpenDelay * 1000);
      return () => clearTimeout(timer);
    }
  }, [config]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatbotConfig = async () => {
    try {
      const response = await fetch('/api/chatbot/config');
      const data = await response.json();
      setConfig(data);
      
      // Add welcome message
      if (data.welcomeMessage) {
        setMessages([{
          id: 'welcome',
          message: data.welcomeMessage,
          isFromGuest: false,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error loading chatbot config:', error);
    }
  };

  const loadQAPairs = async () => {
    try {
      const response = await fetch('/api/chatbot/qa/public');
      if (response.ok) {
        const data = await response.json();
        setQaPairs(data.filter((qa: any) => qa.isActive));
      } else {
        // Use fallback data if API fails
        console.log('API failed, using fallback Q&A data');
        setQaPairs([
          {
            id: '1',
            question: 'What are your check-in and check-out times?',
            answer: 'Check-in is at 3:00 PM and check-out is at 11:00 AM. Early check-in or late check-out may be available upon request.',
            keywords: ['check-in', 'check-out', 'time']
          },
          {
            id: '2',
            question: 'Do you allow pets?',
            answer: 'We welcome well-behaved pets! There is a pet fee of $25 per night. Please let us know in advance if you\'re bringing a pet.',
            keywords: ['pets', 'dogs', 'cats']
          },
          {
            id: '3',
            question: 'Is parking available?',
            answer: 'Yes, we provide free parking for our guests. Each property has designated parking spaces available.',
            keywords: ['parking', 'car', 'vehicle']
          },
          {
            id: '4',
            question: 'What amenities do you offer?',
            answer: 'Our properties include WiFi, air conditioning, fully equipped kitchens, smart TVs, and premium bedding. Each property may have additional amenities.',
            keywords: ['amenities', 'facilities', 'wifi']
          },
          {
            id: '5',
            question: 'How do I make a reservation?',
            answer: 'I\'d love to help you book! Just let me know your preferred dates, number of guests, and which property interests you.',
            keywords: ['book', 'reserve', 'booking']
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading Q&A pairs:', error);
      // Use fallback data on any error
      setQaPairs([
        {
          id: '1',
          question: 'What are your check-in and check-out times?',
          answer: 'Check-in is at 3:00 PM and check-out is at 11:00 AM. Early check-in or late check-out may be available upon request.',
          keywords: ['check-in', 'check-out', 'time']
        },
        {
          id: '2',
          question: 'Do you allow pets?',
          answer: 'We welcome well-behaved pets! There is a pet fee of $25 per night. Please let us know in advance if you\'re bringing a pet.',
          keywords: ['pets', 'dogs', 'cats']
        },
        {
          id: '3',
          question: 'Is parking available?',
          answer: 'Yes, we provide free parking for our guests. Each property has designated parking spaces available.',
          keywords: ['parking', 'car', 'vehicle']
        }
      ]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      message: message.trim(),
      isFromGuest: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send to backend and get automated response
      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: message.trim(),
          guestName: guestInfo.name || undefined,
          guestEmail: guestInfo.email || undefined
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add the automated response to chat
        if (data.response) {
          const botMessage: ChatMessage = {
            id: `bot_${Date.now()}`,
            message: data.response.message,
            isFromGuest: false,
            timestamp: new Date(data.response.createdAt)
          };
          setMessages(prev => [...prev, botMessage]);
        }
      } else {
        // Fallback response if API fails
        const fallbackMessage: ChatMessage = {
          id: `bot_${Date.now()}`,
          message: "I'm having trouble connecting right now. Please try again in a moment or contact us directly.",
          isFromGuest: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, fallbackMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback response
      const fallbackMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        message: "I'm having trouble connecting right now. Please try again in a moment or contact us directly.",
        isFromGuest: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get contextual quick replies
  const getContextualQuickReplies = () => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.isFromGuest) {
      // Add "Common Questions" to default quick replies
      return [...quickReplies, "❓ Common Questions"];
    }
    
    const lastBotMessage = lastMessage.message.toLowerCase();
    
    // If bot asked about property preference
    if (lastBotMessage.includes('which property interests you')) {
      return ['Luxury Condo', 'Beach House', 'Mountain Retreat', 'Show me all properties'];
    }
    
    // If bot asked about guest count
    if (lastBotMessage.includes('how many guests')) {
      return ['1 guest', '2 guests', '4 guests', '6+ guests'];
    }
    
    // If bot asked about dates
    if (lastBotMessage.includes('what dates')) {
      return ['This weekend', 'Next week', 'Next month', 'Flexible dates'];
    }
    
    // If bot asked about next steps
    if (lastBotMessage.includes('what would be most helpful')) {
      return ['See photos', 'Get pricing', 'Check availability', 'Make inquiry'];
    }
    
    // If bot asked about location preference
    if (lastBotMessage.includes('which type of location')) {
      return ['City convenience', 'Beach relaxation', 'Mountain retreat', 'Show all locations'];
    }
    
    // If bot asked about amenities
    if (lastBotMessage.includes('what\'s most important')) {
      return ['Swimming pool', 'Parking space', 'Gym facilities', 'Family-friendly'];
    }
    
    // If bot asked about booking readiness
    if (lastBotMessage.includes('what works best for you')) {
      return ['Ready to book', 'More questions', 'Get quote', 'Contact host'];
    }
    
    // Default quick replies with common questions
    return [...quickReplies, "❓ Common Questions"];
  };

  const handleQuickReply = (reply: string) => {
    if (reply === "❓ Common Questions") {
      setShowQAPanel(true);
      return;
    }
    sendMessage(reply);
  };

  const handleQAClick = (qa: any) => {
    // Add the question as user message
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      message: qa.question,
      isFromGuest: true,
      timestamp: new Date()
    };
    
    // Add the answer as bot message
    const botMessage: ChatMessage = {
      id: `bot_${Date.now()}`,
      message: qa.answer + "\n\nIs there anything else I can help you with?",
      isFromGuest: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage, botMessage]);
    setShowQAPanel(false);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && !guestInfo.name && messages.length > 1) {
      setShowGuestForm(true);
    }
  };

  const handleGuestInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowGuestForm(false);
  };

  if (!config || !config.isEnabled) {
    return null;
  }

  const quickReplies = JSON.parse(config.quickReplies || '[]');
  const positionClasses = config.position === 'bottom-left' ? 'bottom-4 left-4' : 'bottom-4 right-4';

  return (
    <div className={`fixed ${positionClasses} z-50`}>
      {/* Chat Window */}
      {isOpen && (
        <div 
          className="mb-4 w-80 h-96 bg-white rounded-lg shadow-2xl border flex flex-col overflow-hidden"
          style={{ 
            backgroundColor: config.backgroundColor,
            borderRadius: config.borderRadius 
          }}
        >
          {/* Header */}
          <div 
            className="p-4 text-white flex items-center justify-between"
            style={{ backgroundColor: config.primaryColor }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Chat Support</h3>
                <p className="text-xs opacity-90">We're here to help!</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQAPanel(!showQAPanel)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors relative"
                title="Common Questions"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {qaPairs.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {qaPairs.length}
                  </span>
                )}
              </button>
              <button
                onClick={toggleChat}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Q&A Panel */}
          {showQAPanel && (
            <div className="border-b bg-gray-50 max-h-48 overflow-y-auto">
              <div className="p-3">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Common Questions</h4>
                <div className="space-y-2">
                  {qaPairs.slice(0, 5).map((qa) => (
                    <button
                      key={qa.id}
                      onClick={() => handleQAClick(qa)}
                      className="w-full text-left p-2 text-xs bg-white border rounded hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900 mb-1">{qa.question}</div>
                      <div className="text-gray-600 text-xs overflow-hidden" style={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {qa.answer.substring(0, 80)}...
                      </div>
                    </button>
                  ))}
                </div>
                {qaPairs.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No common questions available yet.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Guest Info Form */}
          {showGuestForm && (
            <div className="p-4 border-b bg-gray-50">
              <form onSubmit={handleGuestInfoSubmit} className="space-y-3">
                <p className="text-sm text-gray-600">Help us serve you better:</p>
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={guestInfo.name}
                  onChange={(e) => setGuestInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Your email (optional)"
                  value={guestInfo.email}
                  onChange={(e) => setGuestInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="w-full px-3 py-2 bg-brand-600 text-white rounded text-sm hover:bg-brand-700 transition-colors"
                >
                  Continue Chat
                </button>
              </form>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isFromGuest ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.isFromGuest
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                  style={message.isFromGuest ? { 
                    backgroundColor: config.primaryColor,
                    color: config.textColor 
                  } : {}}
                >
                  <div className="whitespace-pre-line">
                    {message.message.split('**').map((part, index) => 
                      index % 2 === 1 ? (
                        <strong key={index}>{part}</strong>
                      ) : (
                        part
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-3 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {(() => {
            const contextualReplies = getContextualQuickReplies();
            return contextualReplies.length > 0 && (
              <div className="px-4 py-2 border-t bg-gray-50">
                <p className="text-xs text-gray-600 mb-2">Quick options:</p>
                <div className="flex flex-wrap gap-1">
                  {contextualReplies.map((reply: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply)}
                      className="px-2 py-1 bg-white border rounded text-xs hover:bg-gray-100 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Input */}
          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(inputMessage);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="px-3 py-2 text-white rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ backgroundColor: config.primaryColor }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="w-14 h-14 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
        style={{ 
          backgroundColor: config.primaryColor,
          borderRadius: config.borderRadius 
        }}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        )}
      </button>
    </div>
  );
}