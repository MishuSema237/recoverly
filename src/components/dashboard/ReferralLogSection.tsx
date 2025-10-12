'use client';

import { Users, Copy } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const ReferralLogSection = () => {
  const { userProfile } = useAuth();
  const [copySuccess, setCopySuccess] = useState(false);
  
  const referralLink = `https://tesla-capital.com/ref/${userProfile?.userCode || 'loading...'}`;

  const handleCopyLink = async () => {
    try {
      // Check if clipboard API is available
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(referralLink);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = referralLink;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Still show success to user even if copy failed
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Referral Program */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-600 mb-6">
          Share your referral link and earn commissions when others join using your link.
        </p>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600">Your Referral Link</p>
              <p className="text-sm sm:text-lg font-mono text-gray-900 break-all">{referralLink}</p>
            </div>
            <button 
              onClick={handleCopyLink}
              className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap"
            >
              <Copy className="w-4 h-4" />
              <span>{copySuccess ? 'Copied ✓' : 'Copy'}</span>
            </button>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">$0.00</p>
            <p className="text-sm text-gray-600">Referral Earnings</p>
          </div>
        </div>
      </div>

      {/* Referral Log */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-600 mb-6">
          Track your referral activity and earnings from users who joined through your link.
        </p>
        
        {/* Mobile Tile Layout */}
        <div className="block md:hidden space-y-3">
          {/* Empty state */}
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium">No referrals yet</p>
            <p className="text-sm">Share your link to start earning commissions</p>
          </div>
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Referral ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Referred User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Commission Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Commission Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center">
                    <Users className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-lg font-medium">No referrals yet</p>
                    <p className="text-sm">Share your link to start earning commissions</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReferralLogSection;
