'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Notification {
  _id: string;
  title?: string;
  message: string;
  details?: string;
  type: 'broadcast' | 'individual';
  recipients: string[] | 'all';
  sentBy: string;
  sentAt: string;
  read: boolean;
}

const NotificationsSection = () => {
  const { userProfile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [expandedNotifications, setExpandedNotifications] = useState<Set<string>>(new Set());

  const loadNotifications = useCallback(async () => {
    try {
      const response = await fetch(`/api/user-notifications?userCode=${userProfile?.userCode}`);
      const result = await response.json();
      
      if (result.success) {
        setNotifications(result.data);
        setUnreadCount(result.data.filter((n: Notification) => !n.read).length);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [userProfile?.userCode]);

  useEffect(() => {
    if (userProfile?.userCode) {
      loadNotifications();
      
      // Set up polling every 30 seconds
      const interval = setInterval(() => {
        loadNotifications();
      }, 30000); // 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [userProfile?.userCode, loadNotifications]);

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/user-notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notificationId,
          userCode: userProfile?.userCode
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(n => 
            n._id === notificationId ? { ...n, read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Auto-mark notifications as read when viewing the page
  useEffect(() => {
    if (notifications.length > 0) {
      const unreadNotifications = notifications.filter(n => !n.read);
      unreadNotifications.forEach(notification => {
        markAsRead(notification._id);
      });
    }
  }, [notifications]);

  const toggleExpanded = (notificationId: string) => {
    setExpandedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="px-0 lg:px-6">
        <div className="bg-white rounded-none lg:rounded-lg shadow-none lg:shadow-lg p-4 lg:p-8">
          <div className="animate-pulse">
            <div className="h-6 lg:h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 lg:h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-0 lg:px-6">
      <div className="bg-white rounded-none lg:rounded-lg shadow-none lg:shadow-lg p-4 lg:p-8">
        <div className="flex items-center mb-6">
          <div className="p-2 lg:p-3 bg-blue-100 rounded-full">
            <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Notifications</h2>
            <p className="text-sm lg:text-base text-gray-600">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-600">You&apos;ll see important updates and messages here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => {
              const isExpanded = expandedNotifications.has(notification._id);
              return (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => toggleExpanded(notification._id)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`p-2 rounded-full ${
                            notification.type === 'broadcast' 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-green-100 text-green-600'
                          }`}>
                            {notification.type === 'broadcast' ? (
                              <AlertCircle className="w-4 h-4" />
                            ) : (
                              <Bell className="w-4 h-4" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className={`text-sm font-semibold break-words ${
                                notification.read ? 'text-gray-700' : 'text-gray-900'
                              }`}>
                                {notification.title || (notification.type === 'broadcast' ? 'System Announcement' : 'Support Message')}
                              </h3>
                              {!notification.read && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                                  New
                                </span>
                              )}
                            </div>
                            
                            <p className={`text-sm text-gray-600 mt-1 break-words ${
                              notification.read ? '' : 'font-medium'
                            }`}>
                              {notification.message}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-xs text-gray-500">
                            {new Date(notification.sentAt).toLocaleString()}
                          </p>
                          
                          {notification.details && (
                            <span className="text-xs text-blue-600 font-medium">
                              {isExpanded ? 'Show less' : 'Show details'}
                            </span>
                          )}
                        </div>
                        
                        {isExpanded && notification.details && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-gray-100"
                          >
                            <p className="text-sm text-gray-700 whitespace-pre-line break-words">
                              {notification.details}
                            </p>
                          </motion.div>
                        )}
                      </div>
                      
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification._id);
                          }}
                          className="ml-4 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                          title="Mark as read"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsSection;