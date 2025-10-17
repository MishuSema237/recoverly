'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowUpDown, CheckCircle, AlertCircle, CreditCard, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { showSuccess, showError } from '@/utils/toast';

interface PaymentMethod {
  _id: string;
  name: string;
  logo: string;
  accountDetails: {
    accountName: string;
    accountNumber: string;
    bankName?: string;
    walletAddress?: string;
    network?: string;
  };
  instructions: string;
  isActive: boolean;
}

interface WithdrawalRequest {
  userId: string;
  paymentMethodId: string;
  amount: number;
  accountDetails: {
    accountName: string;
    accountNumber: string;
    bankName?: string;
    walletAddress?: string;
    network?: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'rejected';
}

const WithdrawSection = () => {
  const { user, userProfile, forceRefresh } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [amount, setAmount] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [network, setNetwork] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation states
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const availableBalance = userProfile?.balances?.main || 0;
  const withdrawalAmount = parseFloat(amount) || 0;
  const isAmountValid = withdrawalAmount <= availableBalance && withdrawalAmount > 0;
  const isFormValid = isAmountValid && selectedMethod && accountName && accountNumber;

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const response = await fetch('/api/payment-methods');
      const result = await response.json();
      
      if (result.success) {
        setPaymentMethods(result.data.filter((method: PaymentMethod) => method.isActive));
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
      showError('An error occurred while loading payment methods');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMethod || !amount || !accountName || !accountNumber) {
      showError('Please fill in all required fields');
      return;
    }

    const withdrawalAmount = parseFloat(amount);
    const availableBalance = userProfile?.balances?.main || 0;

    if (withdrawalAmount > availableBalance) {
      showError('Insufficient balance. Available balance: $' + availableBalance);
      return;
    }

    setIsSubmitting(true);

    try {
      const withdrawalRequest: WithdrawalRequest = {
        userId: user?._id || '',
        paymentMethodId: selectedMethod._id,
        amount: withdrawalAmount,
        accountDetails: {
          accountName,
          accountNumber,
          bankName: bankName || undefined,
          walletAddress: accountNumber,
          network: network || undefined
        },
        status: 'pending'
      };

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'withdrawal',
          ...withdrawalRequest
        })
      });

      const result = await response.json();

      if (result.success) {
        showSuccess('Withdrawal request submitted successfully! Please wait for admin processing.');
        setAmount('');
        setAccountName('');
        setAccountNumber('');
        setBankName('');
        setNetwork('');
        setSelectedMethod(null);
        // Force refresh user data to get updated balances and notifications
        await forceRefresh();
      } else {
        showError(result.error || 'Failed to submit withdrawal request');
      }
    } catch (error) {
      console.error('Error submitting withdrawal request:', error);
      showError('An error occurred while submitting your request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-blue-100 rounded-full">
            <ArrowUpDown className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Request Withdrawal</h2>
            <p className="text-gray-600">Withdraw funds to your preferred payment method</p>
          </div>
        </div>

        {/* Balance Display */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Available Balance:</span>
            <span className="text-lg font-bold text-gray-900">${userProfile?.balances?.main || 0}</span>
          </div>
          </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Withdrawal Method</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <motion.div
                  key={method._id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedMethod?._id === method._id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMethod(method)}
                >
                    <div className="flex items-center space-x-3">
                    {method.logo && (
                      <Image src={method.logo} alt={method.name} width={32} height={32} className="w-8 h-8 rounded" />
                    )}
                      <div>
                              <h3 className="font-semibold text-gray-900">{method.name}</h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Withdrawal Amount (USD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                amount && !isAmountValid 
                  ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                  : 'border-gray-300 focus:ring-red-500'
              }`}
              placeholder="Enter amount to withdraw"
              min="1"
              step="0.01"
              max={availableBalance}
              required
            />
            {amount && !isAmountValid && (
              <p className="mt-1 text-sm text-red-600">
                Amount exceeds available balance (${availableBalance.toFixed(2)})
              </p>
            )}
            {amount && isAmountValid && (
              <p className="mt-1 text-sm text-green-600">
                Available balance: ${availableBalance.toFixed(2)}
              </p>
            )}
            {!amount && (
              <p className="text-sm text-gray-500 mt-1">
                Available balance: ${availableBalance.toFixed(2)}
              </p>
            )}
          </div>

          {/* Account Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Account Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name *</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter account holder name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Number/Wallet Address *</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter account number or wallet address"
                required
              />
                </div>

            {selectedMethod?.accountDetails.bankName && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter bank name"
                />
            </div>
          )}

            {selectedMethod?.accountDetails.network && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Network</label>
                <input
                  type="text"
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter network (e.g., Ethereum, BSC)"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 ${
              !isFormValid && !isSubmitting
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-red-600 hover:bg-red-700 disabled:bg-gray-400'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Submit Withdrawal Request</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WithdrawSection;