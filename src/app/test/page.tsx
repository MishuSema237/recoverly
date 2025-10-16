'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function TestPage() {
  const { userProfile, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const processDailyGains = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-daily-gains');
      const result = await response.json();
      setMessage(result.message);
      await refreshUser(); // Refresh user data
    } catch (error) {
      setMessage('Error: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const createTestInvestment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-investment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName: 'Test Plan',
          amount: 100
        })
      });
      const result = await response.json();
      setMessage(result.message);
      await refreshUser(); // Refresh user data
    } catch (error) {
      setMessage('Error: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Test Page - Debug User Data</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Current User Data</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Total Deposit:</strong> ${userProfile?.totalDeposit || 0}</p>
            <p><strong>Total Withdraw:</strong> ${userProfile?.totalWithdraw || 0}</p>
            <p><strong>Referral Earnings:</strong> ${userProfile?.referralEarnings || 0}</p>
            <p><strong>Total Invested:</strong> ${userProfile?.totalInvested || 0}</p>
          </div>
          <div>
            <p><strong>Main Balance:</strong> ${userProfile?.balances?.main || 0}</p>
            <p><strong>Investment Balance:</strong> ${userProfile?.balances?.investment || 0}</p>
            <p><strong>Referral Balance:</strong> ${userProfile?.balances?.referral || 0}</p>
            <p><strong>Total Balance:</strong> ${userProfile?.balances?.total || 0}</p>
          </div>
        </div>
        <div className="mt-4">
          <p><strong>Investments:</strong> {userProfile?.investments?.length || 0}</p>
          <p><strong>Transactions:</strong> {userProfile?.transactions?.length || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
        <div className="space-y-4">
          <button
            onClick={createTestInvestment}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Test Investment ($100)'}
          </button>
          
          <button
            onClick={processDailyGains}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 ml-4"
          >
            {loading ? 'Processing...' : 'Process Daily Gains'}
          </button>

          <button
            onClick={refreshUser}
            disabled={loading}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 ml-4"
          >
            Refresh User Data
          </button>
        </div>
        
        {message && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p>{message}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Raw User Data</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
          {JSON.stringify(userProfile, null, 2)}
        </pre>
      </div>
    </div>
  );
}


