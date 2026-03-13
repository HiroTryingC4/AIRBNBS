'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin'

export const dynamic = 'force-dynamic'

interface ChatbotConfig {
  id?: string;
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

interface ChatSession {
  sessionId: string;
  messageCount: number;
  lastMessageAt: string;
  guestName?: string;
  guestEmail?: string;
}

interface QAPair {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ChatbotManagementPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState('settings');
  const [config, setConfig] = useState<ChatbotConfig>({
    isEnabled: true,
    welcomeMessage: "Hi! How can I help you today?",
    position: 'bottom-right',
    primaryColor: '#E6D3B3',
    textColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    showOnPages: 'all',
    autoOpenDelay: null,
    offlineMessage: "We're currently offline. Please leave a message and we'll get back to you!",
    businessHours: null,
    quickReplies: JSON.stringify([
      "Check availability",
      "Property information", 
      "Booking inquiry",
      "Contact host"
    ])
  });
  
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [qaPairs, setQaPairs] = useState<QAPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadChatbotConfig();
    loadChatSessions();
    loadQAPairs();
  }, []);

  const loadChatbotConfig = async () => {
    try {
      const response = await fetch('/api/chatbot/config/admin');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      } else {
        console.error('Failed to load chatbot config');
        // Use default config if API fails
        setConfig({
          isEnabled: true,
          welcomeMessage: "Hi! How can I help you today?",
          position: 'bottom-right',
          primaryColor: '#E6D3B3',
          textColor: '#FFFFFF',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          showOnPages: 'all',
          autoOpenDelay: null,
          offlineMessage: "We're currently offline. Please leave a message and we'll get back to you!",
          businessHours: null,
          quickReplies: JSON.stringify([
            "Check availability",
            "Property information", 
            "Booking inquiry",
            "Contact host"
          ])
        });
      }
    } catch (error) {
      console.error('Error loading chatbot config:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChatSessions = async () => {
    try {
      const response = await fetch('/api/chatbot/sessions');
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      } else {
        console.error('Failed to load chat sessions');
        setSessions([]);
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      setSessions([]);
    }
  };

  const loadQAPairs = async () => {
    try {
      const response = await fetch('/api/chatbot/qa');
      if (response.ok) {
        const data = await response.json();
        setQaPairs(data);
      } else {
        console.error('Failed to load Q&A pairs');
        setQaPairs([]);
      }
    } catch (error) {
      console.error('Error loading Q&A pairs:', error);
      setQaPairs([]);
    }
  };
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/chatbot/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Chatbot settings saved successfully!' });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save chatbot settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleQuickRepliesChange = (replies: string[]) => {
    setConfig(prev => ({ ...prev, quickReplies: JSON.stringify(replies) }));
  };

  const addQAPair = () => {
    const newQA: QAPair = {
      id: Date.now().toString(),
      question: '',
      answer: '',
      keywords: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setQaPairs(prev => [...prev, newQA]);
  };

  const updateQAPair = (id: string, updates: Partial<QAPair>) => {
    setQaPairs(prev => prev.map(qa => 
      qa.id === id 
        ? { ...qa, ...updates, updatedAt: new Date().toISOString() }
        : qa
    ));
  };

  const deleteQAPair = (id: string) => {
    setQaPairs(prev => prev.filter(qa => qa.id !== id));
  };

  const saveQAPairs = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/chatbot/qa', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(qaPairs)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Q&A pairs saved successfully!' });
      } else {
        throw new Error('Failed to save Q&A pairs');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save Q&A pairs. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const quickReplies = JSON.parse(config.quickReplies || '[]');
  const ChatbotPreview = () => (
    <div className="bg-gray-100 rounded-lg p-6 h-96 relative overflow-hidden">
      <div className="text-center text-gray-500 mb-4">
        <h4 className="font-medium">Live Preview</h4>
        <p className="text-sm">See how your chatbot will look</p>
      </div>
      
      {/* Mock website background */}
      <div className="bg-white rounded border h-64 relative">
        <div className="h-12 bg-gray-200 rounded-t flex items-center px-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="ml-4 text-sm text-gray-600">Your Property Website</div>
        </div>
        
        {config.isEnabled && (
          <div className={`absolute bottom-4 ${config.position === 'bottom-right' ? 'right-4' : 'left-4'}`}>
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
              style={{ backgroundColor: config.primaryColor }}
            >
              <svg className="w-6 h-6" style={{ color: config.textColor }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            
            {/* Chat bubble preview */}
            <div 
              className="absolute bottom-16 w-64 rounded-lg shadow-xl p-4 border"
              style={{ 
                backgroundColor: config.backgroundColor,
                borderRadius: config.borderRadius,
                right: config.position === 'bottom-right' ? '0' : 'auto',
                left: config.position === 'bottom-left' ? '0' : 'auto'
              }}
            >
              <div className="text-sm text-gray-800 mb-3">{config.welcomeMessage}</div>
              <div className="space-y-2">
                {JSON.parse(config.quickReplies || '[]').slice(0, 2).map((reply: string, index: number) => (
                  <div key={index} className="text-xs bg-gray-100 rounded px-2 py-1 text-gray-600">
                    {reply}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading chatbot settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }
  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chatbot Management</h1>
          <p className="text-gray-600">Customize your website chatbot and manage conversations</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'settings'
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Settings
              </button>
              <button
                onClick={() => setActiveTab('qa')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'qa'
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Q&A ({qaPairs.filter(qa => qa.isActive).length})
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'messages'
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Messages ({sessions.length})
              </button>
            </nav>
          </div>
          <div className="p-6">
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                  {/* Basic Settings */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Settings</h3>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="font-medium text-gray-900">Enable Chatbot</p>
                          <p className="text-sm text-gray-500">Show chatbot on your website</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={config.isEnabled}
                          onChange={(e) => setConfig(prev => ({ ...prev, isEnabled: e.target.checked }))}
                          className="w-5 h-5 text-brand-600 rounded focus:ring-2 focus:ring-brand-600"
                        />
                      </label>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Position
                        </label>
                        <select
                          value={config.position}
                          onChange={(e) => setConfig(prev => ({ ...prev, position: e.target.value as 'bottom-right' | 'bottom-left' }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                        >
                          <option value="bottom-right">Bottom Right</option>
                          <option value="bottom-left">Bottom Left</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Messages</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Welcome Message
                        </label>
                        <textarea
                          rows={3}
                          value={config.welcomeMessage}
                          onChange={(e) => setConfig(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                          placeholder="Hi! How can I help you today?"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quick Replies
                        </label>
                        <div className="space-y-3">
                          {quickReplies.map((reply: string, index: number) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={reply}
                                onChange={(e) => {
                                  const newReplies = [...quickReplies];
                                  newReplies[index] = e.target.value;
                                  handleQuickRepliesChange(newReplies);
                                }}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                                placeholder="Quick reply option"
                              />
                              <button
                                onClick={() => {
                                  const newReplies = quickReplies.filter((_: string, i: number) => i !== index);
                                  handleQuickRepliesChange(newReplies);
                                }}
                                className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => handleQuickRepliesChange([...quickReplies, ''])}
                            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-brand-600 hover:text-brand-600 transition-colors"
                          >
                            + Add Quick Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-6 border-t">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
                  <ChatbotPreview />
                </div>
              </div>
            )}
            {/* Q&A Tab */}
            {activeTab === 'qa' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Questions & Answers</h3>
                    <p className="text-sm text-gray-600">Pre-configure responses for common questions</p>
                  </div>
                  <button
                    onClick={addQAPair}
                    className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700 transition-colors"
                  >
                    + Add Q&A
                  </button>
                </div>

                <div className="space-y-4">
                  {qaPairs.map((qa, index) => (
                    <div key={qa.id} className="bg-gray-50 rounded-lg p-6 border">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="bg-brand-100 text-brand-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Q&A #{index + 1}
                          </span>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={qa.isActive}
                              onChange={(e) => updateQAPair(qa.id, { isActive: e.target.checked })}
                              className="w-4 h-4 text-brand-600 rounded focus:ring-2 focus:ring-brand-600"
                            />
                            <span className="text-sm text-gray-600">Active</span>
                          </label>
                        </div>
                        <button
                          onClick={() => deleteQAPair(qa.id)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question
                          </label>
                          <input
                            type="text"
                            value={qa.question}
                            onChange={(e) => updateQAPair(qa.id, { question: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                            placeholder="What question might guests ask?"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Answer
                          </label>
                          <textarea
                            rows={3}
                            value={qa.answer}
                            onChange={(e) => updateQAPair(qa.id, { answer: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                            placeholder="How should the chatbot respond?"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Keywords (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={qa.keywords.join(', ')}
                            onChange={(e) => updateQAPair(qa.id, { 
                              keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k) 
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                            placeholder="parking, pets, check-in, wifi"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {qaPairs.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Q&A pairs yet</h3>
                      <p className="text-gray-500 mb-4">Add questions and answers to help your chatbot</p>
                      <button
                        onClick={addQAPair}
                        className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700 transition-colors"
                      >
                        Add Your First Q&A
                      </button>
                    </div>
                  )}
                </div>

                {qaPairs.length > 0 && (
                  <div className="flex justify-end pt-6 border-t">
                    <button
                      onClick={saveQAPairs}
                      disabled={saving}
                      className="px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Saving...' : 'Save Q&A Pairs'}
                    </button>
                  </div>
                )}
              </div>
            )}
            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Chat Sessions</h3>
                {sessions.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No chat sessions yet</h3>
                    <p className="text-gray-500">Chat sessions will appear here when guests start conversations.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session.sessionId} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {session.guestName || 'Anonymous Guest'}
                            </h4>
                            {session.guestEmail && (
                              <p className="text-sm text-gray-600">{session.guestEmail}</p>
                            )}
                            <p className="text-sm text-gray-500">
                              {session.messageCount} messages • Last active: {new Date(session.lastMessageAt).toLocaleString()}
                            </p>
                          </div>
                          <button className="px-3 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700 transition-colors">
                            View Chat
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}