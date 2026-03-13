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
    
    // If bot showed availability results
    if (lastBotMessage.includes('great news') && lastBotMessage.includes('available unit')) {
      return ['Book now', 'Call James', 'More details', 'Different dates', 'View amenities'];
    }
    
    // If bot asked about dates for availability
    if (lastBotMessage.includes('what dates') || lastBotMessage.includes('when would you like')) {
      return ['This weekend', 'Next week', 'Next month', 'Today', 'Tomorrow'];
    }
    
    // If bot asked about property preference
    if (lastBotMessage.includes('which property interests you')) {
      return ['Cozy Studio', 'Family Unit', 'City View', 'Executive Suite', 'Show all units'];
    }
    
    // If bot asked about guest count
    if (lastBotMessage.includes('how many guests')) {
      return ['1 guest', '2 guests', '4 guests', '6+ guests'];
    }
    
    // If bot asked about next steps
    if (lastBotMessage.includes('what would be most helpful')) {
      return ['Check availability', 'Get pricing', 'Call James', 'View location'];
    }
    
    // If bot asked about location preference
    if (lastBotMessage.includes('which type of location')) {
      return ['City convenience', 'Near transport', 'Shopping area', 'Show location'];
    }
    
    // If bot asked about amenities
    if (lastBotMessage.includes('what\'s most important')) {
      return ['WiFi & Kitchen', 'Parking space', 'City view', 'All amenities'];
    }
    
    // If bot asked about booking readiness
    if (lastBotMessage.includes('what works best for you')) {
      return ['Ready to book', 'More questions', 'Call James', 'Check dates'];
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
  const positionClasses = config.position === 'bottom-left' ? 'bottom-4 left-4' : 'bottom-4 right-4 sm:right-6';

  return (
    <div className={`fixed ${positionClasses} z-50`}>
      {/* Chat Window */}
      {isOpen && (
        <div 
          className="mb-4 w-full max-w-md bg-white rounded-2xl shadow-2xl border-0 flex flex-col overflow-hidden transform transition-all duration-300 ease-out animate-in slide-in-from-bottom-4"
          style={{ 
            backgroundColor: config.backgroundColor,
            borderRadius: config.borderRadius,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            height: 'calc(100vh - 8rem)',
            maxHeight: '600px',
            minHeight: '400px'
          }}
        >
          {/* Header with Gradient */}
          <div 
            className="p-4 text-white flex items-center justify-between relative overflow-hidden flex-shrink-0"
            style={{ 
              background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.primaryColor}dd 100%)`,
              backdropFilter: 'blur(10px)'
            }}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12 animate-pulse delay-1000"></div>
            </div>
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">Evangelina's Support</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-xs opacity-90 font-medium">Online • Ready to help!</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 relative z-10">
              <button
                onClick={() => setShowQAPanel(!showQAPanel)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200 relative group"
                title="Common Questions"
              >
                <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {qaPairs.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-bounce">
                    {qaPairs.length}
                  </span>
                )}
              </button>
              <button
                onClick={toggleChat}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200 group"
              >
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Q&A Panel as Modal Overlay */}
          {showQAPanel && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-fade-in">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden modal-scale-in">
                <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-bold">Frequently Asked Questions</h4>
                    </div>
                    <button
                      onClick={() => setShowQAPanel(false)}
                      className="text-white hover:bg-white hover:bg-opacity-20 transition-colors p-1.5 rounded-full"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-4 max-h-96 overflow-y-auto chat-scrollbar">
                  <div className="space-y-3">
                    {qaPairs.slice(0, 8).map((qa, index) => (
                      <button
                        key={qa.id}
                        onClick={() => handleQAClick(qa)}
                        className="w-full text-left p-4 text-sm bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-200 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <span className="text-white text-xs font-bold">Q</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors leading-tight">{qa.question}</div>
                            <div className="text-gray-600 text-xs leading-relaxed" style={{ 
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {qa.answer.substring(0, 150)}...
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {qaPairs.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500">No questions available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Guest Info Form - More Compact */}
          {showGuestForm && (
            <div className="p-3 border-b bg-gradient-to-br from-blue-50 to-purple-50 animate-in slide-in-from-top-2 flex-shrink-0">
              <form onSubmit={handleGuestInfoSubmit} className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Let's personalize your experience!</p>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Your name (optional)"
                      value={guestInfo.name}
                      onChange={(e) => setGuestInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-400"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Your email (optional)"
                      value={guestInfo.email}
                      onChange={(e) => setGuestInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-400"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    Continue Chat
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
              </form>
            </div>
          )}

          {/* Messages with Enhanced Design */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white chat-scrollbar" style={{ minHeight: '200px' }}>
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.isFromGuest ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`flex items-end gap-3 max-w-full ${message.isFromGuest ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                    message.isFromGuest 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                      : 'bg-gradient-to-r from-green-500 to-teal-500'
                  }`}>
                    {message.isFromGuest ? (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm shadow-lg relative max-w-xs ${
                      message.isFromGuest
                        ? 'text-white rounded-br-md'
                        : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
                    }`}
                    style={message.isFromGuest ? { 
                      background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.primaryColor}dd 100%)`,
                      color: config.textColor 
                    } : {}}
                  >
                    <div className="whitespace-pre-line leading-relaxed">
                      {message.message.split('**').map((part, index) => 
                        index % 2 === 1 ? (
                          <strong key={index} className="font-bold">{part}</strong>
                        ) : (
                          part
                        )
                      )}
                    </div>
                    
                    {/* Message tail */}
                    <div 
                      className={`absolute bottom-0 w-3 h-3 ${
                        message.isFromGuest 
                          ? 'right-0 translate-x-1 translate-y-1' 
                          : 'left-0 -translate-x-1 translate-y-1'
                      }`}
                      style={message.isFromGuest ? {
                        background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.primaryColor}dd 100%)`,
                        clipPath: 'polygon(0 0, 100% 0, 0 100%)'
                      } : {
                        background: 'white',
                        border: '1px solid #f3f4f6',
                        clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {/* Enhanced Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start animate-in slide-in-from-bottom-2">
                <div className="flex items-end gap-3 max-w-full">
                  <div className="w-9 h-9 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-lg border border-gray-100 relative max-w-xs">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <div 
                      className="absolute bottom-0 left-0 w-3 h-3 -translate-x-1 translate-y-1 bg-white border border-gray-100"
                      style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Quick Replies - More Compact */}
          {(() => {
            const contextualReplies = getContextualQuickReplies();
            return contextualReplies.length > 0 && (
              <div className="px-4 py-2 border-t bg-gradient-to-r from-gray-50 to-gray-100/50 flex-shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-gray-700">Quick options:</p>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto chat-scrollbar">
                  {contextualReplies.slice(0, 6).map((reply: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply)}
                      className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all duration-200 transform hover:scale-105 hover:shadow-sm whitespace-nowrap"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Enhanced Input - More Compact */}
          <div className="p-3 border-t bg-white flex-shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(inputMessage);
              }}
              className="flex gap-2"
            >
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-500"
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
              </div>
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="w-10 h-10 text-white rounded-xl text-sm hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.primaryColor}dd 100%)` 
                }}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="w-16 h-16 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center transform hover:scale-110 active:scale-95 relative overflow-hidden group"
        style={{ 
          background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.primaryColor}dd 100%)`,
          borderRadius: config.borderRadius 
        }}
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Icon with animation */}
        <div className="relative z-10 transition-transform duration-300">
          {isOpen ? (
            <svg className="w-7 h-7 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <div className="relative">
              <svg className="w-7 h-7 transform group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              {/* Notification dot */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
        
        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
      </button>
    </div>
  );
}