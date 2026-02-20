'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const ProfileSection = () => {
  const { user, userProfile } = useAuth();




  return (
    <div className="space-y-4 mobile:space-y-6">

      {/* Detailed User Information */}
      <div className="bg-white rounded-lg shadow-sm p-4 mobile:p-6">
        <p className="text-sm mobile:text-base text-gray-600 mb-4 mobile:mb-6">
          View and manage your personal account information and profile details.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mobile:gap-8">
          {/* Personal Information */}
          <div>
            <h4 className="text-sm mobile:text-base font-semibold text-gray-800 mb-3 mobile:mb-4">Personal Details</h4>
            <div className="space-y-2 mobile:space-y-3">
              <div className="flex justify-between py-1.5 mobile:py-2 border-b border-gray-100 items-center">
                <span className="text-xs mobile:text-sm text-gray-600">Full Name:</span>
                <span className="text-xs mobile:text-sm font-medium text-gray-900">
                  {userProfile?.firstName && userProfile?.lastName
                    ? `${userProfile.firstName} ${userProfile.lastName}`
                    : userProfile?.displayName ||
                    userProfile?.email?.split('@')[0] ||
                    'Not provided'
                  }
                </span>
              </div>
              <div className="flex justify-between py-1.5 mobile:py-2 border-b border-gray-100 items-center">
                <span className="text-xs mobile:text-sm text-gray-600">Email:</span>
                <span className="text-xs mobile:text-sm font-medium text-gray-900">{userProfile?.email}</span>
              </div>
              <div className="flex justify-between py-1.5 mobile:py-2 border-b border-gray-100 items-center">
                <span className="text-xs mobile:text-sm text-gray-600">Phone:</span>
                <span className="text-xs mobile:text-sm font-medium text-gray-900">{userProfile?.phone || 'Not provided'}</span>
              </div>
              <div className="flex justify-between py-1.5 mobile:py-2 border-b border-gray-100 items-center">
                <span className="text-xs mobile:text-sm text-gray-600">User Code:</span>
                <span className="text-xs mobile:text-sm font-medium text-gray-900 font-mono">{userProfile?.userCode || 'Loading...'}</span>
              </div>
              <div className="flex justify-between py-1.5 mobile:py-2 border-b border-gray-100 items-center">
                <span className="text-xs mobile:text-sm text-gray-600">Account Created:</span>
                <span className="text-xs mobile:text-sm font-medium text-gray-900">
                  {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h4 className="text-sm mobile:text-base font-semibold text-gray-800 mb-3 mobile:mb-4">Location Details</h4>
            <div className="space-y-2 mobile:space-y-3">
              <div className="flex justify-between py-1.5 mobile:py-2 border-b border-gray-100 items-center">
                <span className="text-xs mobile:text-sm text-gray-600">Country:</span>
                <span className="text-xs mobile:text-sm font-medium text-gray-900">{userProfile?.country || 'Not provided'}</span>
              </div>
              <div className="flex justify-between py-1.5 mobile:py-2 border-b border-gray-100 items-center">
                <span className="text-xs mobile:text-sm text-gray-600">State:</span>
                <span className="text-xs mobile:text-sm font-medium text-gray-900">{userProfile?.state || 'Not provided'}</span>
              </div>
              <div className="flex justify-between py-1.5 mobile:py-2 border-b border-gray-100 items-center">
                <span className="text-xs mobile:text-sm text-gray-600">City:</span>
                <span className="text-xs mobile:text-sm font-medium text-gray-900">{userProfile?.city || 'Not provided'}</span>
              </div>
              <div className="flex justify-between py-1.5 mobile:py-2 border-b border-gray-100 items-center">
                <span className="text-xs mobile:text-sm text-gray-600">ZIP Code:</span>
                <span className="text-xs mobile:text-sm font-medium text-gray-900">{userProfile?.zip || 'Not provided'}</span>
              </div>
              <div className="flex justify-between py-1.5 mobile:py-2 border-b border-gray-100 items-center">
                <span className="text-xs mobile:text-sm text-gray-600">Last Login:</span>
                <span className="text-xs mobile:text-sm font-medium text-gray-900">
                  {userProfile?.lastLoginAt ? new Date(userProfile.lastLoginAt).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Information */}
      <div className="bg-white rounded-lg shadow-sm p-4 mobile:p-6">
        <p className="text-sm mobile:text-base text-gray-600 mb-4 mobile:mb-6">
          View your investment statistics and current plan information.
        </p>

        <div className="text-center p-4 mobile:p-6 bg-blue-50 rounded-lg">
          <div className="text-2xl mobile:text-3xl font-bold text-blue-600">
            ${userProfile?.totalInvested?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
          </div>
          <div className="text-xs mobile:text-sm text-blue-800 mt-1.5 mobile:mt-2">Total Invested</div>
        </div>
      </div>

    </div>
  );
};

export default ProfileSection;
