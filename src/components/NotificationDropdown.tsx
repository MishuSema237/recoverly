'use client';

import React, { useState, useEffect } from 'react';
import { Bell, X, FileText, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'broadcast' | 'individual';
  recipients: string[] | 'all';
  sentBy: string;
  sentAt: string;
  read: boolean;
  attachments?: Array<{
    filename: string;
    originalName: string;
    contentType: string;
    size: number;
    url: string;
  }>;
}

interface NotificationDropdownProps {
  userReferralCode: string;
  isOpen: boolean;
  onClose: () => void;
  unreadCount: number;
  onMarkAsRead: (notificationId: string) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  userReferralCode,
  isOpen,
  onClose,
  unreadCount,
  onMarkAsRead
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  useEffect(() => {
    if (isOpen && userReferralCode) {
      fetchNotifications();
    }
  }, [isOpen, userReferralCode]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/user-notifications?referralCode=${userReferralCode}`);
      const result = await response.json();
      if (result.success) {
        setNotifications(result.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onMarkAsRead(notification._id);
    }
    setSelectedNotification(notification);
  };

  const handleDownloadAttachment = (attachment: { url: string; originalName: string }) => {
    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-hidden"
      >
        <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-3 text-center text-gray-500 text-sm">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-3 text-center text-gray-500 text-sm">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    !notification.read ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {notification.title || 'Notification'}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {formatDate(notification.sentAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    {notification.attachments && notification.attachments.length > 0 && (
                      <div className="mt-2 flex items-center space-x-1">
                        <FileText className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {notification.attachments.length} attachment(s)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-100">
            <button
              onClick={() => {/* Navigate to full notifications page */}}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              View all notifications
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationDropdown;


