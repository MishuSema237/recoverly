'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const TransferMoneySection = () => {
  const { userProfile } = useAuth();
  const [receiverEmail, setReceiverEmail] = useState('');
  const [receiverUserCode, setReceiverUserCode] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [receiverValid, setReceiverValid] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  // Reset validation when email or user code changes
  useEffect(() => {
    if (receiverValid) {
      setReceiverValid(false);
      setError('');
    }
  }, [receiverEmail, receiverUserCode, receiverValid]);

  const validateReceiver = useCallback(async () => {
    if (!receiverEmail || !receiverUserCode) {
      setError('Please enter both email and user code');
      return false;
    }

    setIsValidating(true);
    setError('');

    try {
      // Check if user exists with matching email and user code using MongoDB API
      const response = await fetch('/api/users/lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: receiverEmail,
          userCode: receiverUserCode
        })
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || 'Error validating receiver');
        setReceiverValid(false);
        return false;
      }

      setReceiverValid(true);
      return true;
    } catch (error) {
      console.error('Error validating receiver:', error);
      setError('Error validating receiver. Please try again.');
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [receiverEmail, receiverUserCode]);

  // Auto-validate when both email and user code are entered
  useEffect(() => {
    if (receiverEmail && receiverUserCode && !isValidating && !receiverValid) {
      const timeoutId = setTimeout(() => {
        validateReceiver();
      }, 500); // Debounce validation

      return () => clearTimeout(timeoutId);
    }
  }, [receiverEmail, receiverUserCode, isValidating, validateReceiver]);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!receiverValid) {
      setError('Please validate the receiver first');
      return;
    }

    if (!transferAmount || parseFloat(transferAmount) < 500 || parseFloat(transferAmount) > 10000) {
      setError('Please enter a valid transfer amount between $500 and $10,000');
      return;
    }

    setIsTransferring(true);
    setError('');

    try {
      // Here you would make the actual transfer API call
      const response = await fetch('/api/transfers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverEmail,
          receiverUserCode,
          amount: parseFloat(transferAmount)
        })
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || 'Transfer failed. Please try again.');
        return;
      }

      // Success - show success message and reset form
      alert('Transfer completed successfully!');
      
      // Reset form
      setReceiverEmail('');
      setReceiverUserCode('');
      setTransferAmount('');
      setError('');
      setReceiverValid(false);
      
    } catch (error) {
      console.error('Transfer error:', error);
      setError('Transfer failed. Please try again.');
    } finally {
      setIsTransferring(false);
    }
  };

  const transferFee = 2; // 2% fee
  const feeAmount = parseFloat(transferAmount) * (transferFee / 100);
  const totalAmount = parseFloat(transferAmount) + feeAmount;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-600 mb-6">
          Transfer money to other users using their email and unique user code. Enter the recipient details and amount.
        </p>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Current Balance</p>
          <p className="text-2xl font-bold text-gray-900">
            ${((userProfile?.balances?.main || 0) + (userProfile?.balances?.investment || 0) + (userProfile?.balances?.referral || 0)).toFixed(2)} USD
          </p>
        </div>

        <form onSubmit={handleTransfer} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Receiver Email
            </label>
            <input
              type="email"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                receiverValid ? 'border-green-300 bg-green-50' : 
                error && receiverEmail ? 'border-red-300 bg-red-50' : 
                'border-gray-300'
              }`}
              placeholder="receiver@example.com"
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              required
            />
            {isValidating && (
              <p className="text-sm text-blue-600 mt-1">Validating...</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Receiver User Code
            </label>
            <input
              type="text"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                receiverValid ? 'border-green-300 bg-green-50' : 
                error && receiverUserCode ? 'border-red-300 bg-red-50' : 
                'border-gray-300'
              }`}
              placeholder="ABC12345"
              value={receiverUserCode}
              onChange={(e) => setReceiverUserCode(e.target.value.toUpperCase())}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Ask the receiver for their unique user code
            </p>
            {receiverValid && (
              <p className="text-sm text-green-600 mt-1">✓ Receiver validated successfully</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transfer Amount
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="0.00"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              min="500"
              step="0.01"
              required
            />
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          
          {transferAmount && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Transfer Summary</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <div className="flex justify-between">
                  <span>Transfer Amount:</span>
                  <span className="font-semibold">${parseFloat(transferAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transfer Fee ({transferFee}%):</span>
                  <span className="font-semibold">${feeAmount.toFixed(2)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total Deducted:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Transfer Charge:</strong> {transferFee}%
            </p>
            <p className="text-sm text-yellow-800 mt-1">
              <strong>Min Transfer Amount:</strong> 500 USD
            </p>
            <p className="text-sm text-yellow-800">
              <strong>Max Transfer Amount:</strong> 10000 USD
            </p>
          </div>

          <button
            type="submit"
            disabled={!receiverValid || !transferAmount || parseFloat(transferAmount) < 500 || parseFloat(transferAmount) > 10000 || isTransferring}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
          >
            {isTransferring ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Transfer...
              </>
            ) : (
              'Transfer Money'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferMoneySection;
