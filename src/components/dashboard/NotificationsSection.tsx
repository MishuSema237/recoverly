'use client';

import { Bell, DollarSign, AlertCircle } from 'lucide-react';

const NotificationsSection = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-600 mb-6">
          View your account notifications and updates. Stay informed about your investments and account activity.
        </p>
        
        <div className="space-y-4">
          {/* Notification Item */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bell className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">Investment Completed</h4>
                <p className="text-sm text-gray-600 mt-1">Your investment in the Silver plan has been successfully processed.</p>
                <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
              </div>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          </div>

          {/* Notification Item */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">Daily Interest Earned</h4>
                <p className="text-sm text-gray-600 mt-1">You have earned $150.00 in interest from your Gold investment.</p>
                <p className="text-xs text-gray-500 mt-2">1 day ago</p>
              </div>
            </div>
          </div>

          {/* Notification Item */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">Email Verification Required</h4>
                <p className="text-sm text-gray-600 mt-1">Please verify your email address to access all features.</p>
                <p className="text-xs text-gray-500 mt-2">3 days ago</p>
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No more notifications</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsSection;

