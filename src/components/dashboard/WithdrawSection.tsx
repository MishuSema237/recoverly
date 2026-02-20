'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowUpDown, CheckCircle, AlertCircle, CreditCard, DollarSign, Clock, Calendar } from 'lucide-react';
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

interface WithdrawalSchedule {
  enabled: boolean;
  allowedDays: string[];
  allowedTimes: {
    start: string;
    end: string;
  };
  timezone: string;
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
  const [withdrawalSchedule, setWithdrawalSchedule] = useState<WithdrawalSchedule | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(true);

  // Validation states
  // const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const availableBalance = userProfile?.balances?.main || 0;
  const withdrawalAmount = parseFloat(amount) || 0;

  // Fetch withdrawal schedule
  useEffect(() => {
    const fetchWithdrawalSchedule = async () => {
      try {
        const response = await fetch('/api/withdrawal-schedule');
        const result = await response.json();

        if (result.success) {
          setWithdrawalSchedule(result.data);
        }
      } catch (error) {
        console.error('Error fetching withdrawal schedule:', error);
      } finally {
        setScheduleLoading(false);
      }
    };

    fetchWithdrawalSchedule();
  }, []);

  // Check if withdrawals are currently allowed
  const isWithdrawalAllowed = () => {
    if (!withdrawalSchedule || !withdrawalSchedule.enabled) {
      return true; // If no schedule is set, allow withdrawals
    }

    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });

    // Check if current day is allowed
    if (!withdrawalSchedule.allowedDays.includes(currentDay)) {
      return false;
    }

    // Check if current time is within allowed range
    const startTime = withdrawalSchedule.allowedTimes.start;
    const endTime = withdrawalSchedule.allowedTimes.end;

    return currentTime >= startTime && currentTime <= endTime;
  };

  const getNextAllowedTime = () => {
    if (!withdrawalSchedule || !withdrawalSchedule.enabled) {
      return null;
    }

    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });

    // Find next allowed day
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDayIndex = daysOfWeek.indexOf(currentDay);

    for (let i = 0; i < 7; i++) {
      const dayIndex = (currentDayIndex + i) % 7;
      const day = daysOfWeek[dayIndex];

      if (withdrawalSchedule.allowedDays.includes(day)) {
        const nextDate = new Date(now);
        nextDate.setDate(now.getDate() + i);

        if (i === 0 && currentTime < withdrawalSchedule.allowedTimes.start) {
          // Same day, but before start time
          return {
            date: nextDate.toLocaleDateString(),
            time: withdrawalSchedule.allowedTimes.start,
            day: day
          };
        } else if (i > 0) {
          // Next allowed day
          return {
            date: nextDate.toLocaleDateString(),
            time: withdrawalSchedule.allowedTimes.start,
            day: day
          };
        }
      }
    }

    return null;
  };
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
    <div className="px-0 py-4 mobile:px-6 mobile:py-6">
      <div className="bg-white rounded-none lg:rounded-lg shadow-none lg:shadow-lg p-4 mobile:p-6 lg:p-8">
        <div className="flex items-center space-x-3 mb-5 mobile:mb-8">
          <div className="p-2.5 mobile:p-3 bg-blue-100 rounded-full">
            <ArrowUpDown className="w-5 h-5 mobile:w-6 mobile:h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl mobile:text-2xl font-bold text-gray-900">Request Withdrawal</h2>
            <p className="text-xs mobile:text-sm text-gray-600">Withdraw funds to your preferred payment method</p>
          </div>
        </div>

        {/* Withdrawal Schedule Check */}
        {scheduleLoading ? (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ) : !isWithdrawalAllowed() ? (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Clock className="h-5 w-5 mobile:h-6 mobile:w-6 text-orange-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-base mobile:text-lg font-semibold text-orange-800 mb-1 mobile:mb-2">
                  Withdrawals Currently Not Available
                </h3>
                <p className="text-xs mobile:text-sm text-orange-700 mb-3 mobile:mb-4">
                  Withdrawals are only allowed during specific days and times as set by our administrators.
                </p>
                {withdrawalSchedule && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-orange-600" />
                      <span className="text-sm text-orange-700">
                        <strong>Allowed Days:</strong> {withdrawalSchedule.allowedDays.map(day =>
                          day.charAt(0).toUpperCase() + day.slice(1)
                        ).join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span className="text-sm text-orange-700">
                        <strong>Allowed Times:</strong> {withdrawalSchedule.allowedTimes.start} - {withdrawalSchedule.allowedTimes.end} ({withdrawalSchedule.timezone})
                      </span>
                    </div>
                    {(() => {
                      const nextTime = getNextAllowedTime();
                      return nextTime && (
                        <div className="mt-3 p-3 bg-orange-100 rounded-lg">
                          <p className="text-sm text-orange-800">
                            <strong>Next Available:</strong> {nextTime.day.charAt(0).toUpperCase() + nextTime.day.slice(1)} at {nextTime.time}
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* Balance Display */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Available Balance:</span>
            <span className="text-lg font-bold text-gray-900">${userProfile?.balances?.main || 0}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mobile:space-y-6" style={{
          opacity: !isWithdrawalAllowed() ? 0.5 : 1,
          pointerEvents: !isWithdrawalAllowed() ? 'none' : 'auto'
        }}>
          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Withdrawal Method</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <motion.div
                  key={method._id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 mobile:p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedMethod?._id === method._id
                    ? 'border-[#c9933a] bg-[#fdfcf0]'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                  onClick={() => setSelectedMethod(method)}
                >
                  <div className="flex items-center space-x-3">
                    {method.logo && (
                      <Image src={method.logo} alt={method.name} width={28} height={28} className="w-7 h-7 mobile:w-8 mobile:h-8 rounded" />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mobile:text-base">{method.name}</h3>
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
              className={`w-full px-4 py-2.5 mobile:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-sm mobile:text-base ${amount && !isAmountValid
                ? 'border-[#c9933a] focus:ring-[#c9933a] bg-[#fdfcf0]'
                : 'border-gray-300 focus:ring-[#c9933a]'
                }`}
              placeholder="Enter amount to withdraw"
              min="1"
              step="0.01"
              max={availableBalance}
              required
            />
            {amount && !isAmountValid && (
              <p className="mt-1 text-sm text-[#c9933a]">
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
          <div className="space-y-3 mobile:space-y-4">
            <h3 className="text-base mobile:text-lg font-semibold text-gray-900">Your Account Details</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name *</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-4 py-2.5 mobile:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9933a] focus:border-transparent text-sm mobile:text-base"
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
                className="w-full px-4 py-2.5 mobile:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9933a] focus:border-transparent text-sm mobile:text-base"
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
                  className="w-full px-4 py-2.5 mobile:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9933a] focus:border-transparent text-sm mobile:text-base"
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
                  className="w-full px-4 py-2.5 mobile:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9933a] focus:border-transparent text-sm mobile:text-base"
                  placeholder="Enter network (e.g., Ethereum, BSC)"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full text-white py-2.5 mobile:py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 text-sm mobile:text-base ${!isFormValid && !isSubmitting
              ? 'bg-[#c9933a] hover:bg-[#c9933a]'
              : 'bg-[#c9933a] hover:bg-[#b08132] disabled:bg-gray-400'
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
