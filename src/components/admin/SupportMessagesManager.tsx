'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Reply, Clock, User, Mail, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface SupportMessage {
  _id: string;
  userId: string;
  userEmail: string;
  subject: string;
  message: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  adminReplies: Array<{
    adminId: string;
    adminEmail: string;
    reply: string;
    createdAt: string;
  }>;
}

const SupportMessagesManager = () => {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    fetchSupportMessages();
  }, [statusFilter, priorityFilter]);

  const fetchSupportMessages = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);
      
      const response = await fetch(`/api/admin/support-messages?${params.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setMessages(result.data);
      }
    } catch (error) {
      console.error('Error fetching support messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    
    setReplying(true);
    try {
      const response = await fetch('/api/admin/support-messages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId: selectedMessage._id,
          adminReply: replyText.trim(),
          status: 'replied'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setReplyText('');
        fetchSupportMessages();
        // Update selected message
        const updatedMessage = messages.find(m => m._id === selectedMessage._id);
        if (updatedMessage) {
          setSelectedMessage(updatedMessage);
        }
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setReplying(false);
    }
  };

  const updateStatus = async (messageId: string, status: string) => {
    try {
      const response = await fetch('/api/admin/support-messages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId,
          status
        })
      });

      const result = await response.json();
      
      if (result.success) {
        fetchSupportMessages();
        if (selectedMessage && selectedMessage._id === messageId) {
          setSelectedMessage({ ...selectedMessage, status });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'replied':
        return <Reply className="w-4 h-4 text-blue-500" />;
      case 'closed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-[#b08132]';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <MessageSquare className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Support Messages</h3>
          <p className="text-sm text-gray-600">Manage user support requests and replies</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="replied">Replied</option>
          <option value="closed">Closed</option>
        </select>
        
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-semibold text-gray-900">Support Requests ({messages.length})</h4>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p>No support messages found</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message._id}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedMessage?._id === message._id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 truncate">{message.subject}</h5>
                      <p className="text-sm text-gray-600">{message.userEmail}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(message.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                        {message.priority}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                    {message.adminReplies.length > 0 && (
                      <span className="text-xs text-blue-600">
                        {message.adminReplies.length} reply{message.adminReplies.length > 1 ? 'ies' : ''}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Details and Reply */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {selectedMessage ? (
            <>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{selectedMessage.subject}</h4>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedMessage.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedMessage.priority)}`}>
                      {selectedMessage.priority}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{selectedMessage.userEmail}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-b border-gray-200">
                <h5 className="font-medium text-gray-900 mb-2">Message:</h5>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              {/* Admin Replies */}
              {selectedMessage.adminReplies.length > 0 && (
                <div className="p-4 border-b border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-3">Admin Replies:</h5>
                  <div className="space-y-3">
                    {selectedMessage.adminReplies.map((reply, index) => (
                      <div key={index} className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-900">{reply.adminEmail}</span>
                          <span className="text-xs text-blue-600">
                            {new Date(reply.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-blue-800 whitespace-pre-wrap">{reply.reply}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply Form */}
              <div className="p-4">
                <h5 className="font-medium text-gray-900 mb-3">Reply:</h5>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateStatus(selectedMessage._id, 'closed')}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => updateStatus(selectedMessage._id, 'open')}
                      className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Reopen
                    </button>
                  </div>
                  <button
                    onClick={handleReply}
                    disabled={replying || !replyText.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Reply className="w-4 h-4" />
                    <span>{replying ? 'Sending...' : 'Send Reply'}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p>Select a support message to view details and reply</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportMessagesManager;
