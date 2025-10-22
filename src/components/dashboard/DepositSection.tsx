'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Upload, CheckCircle, AlertCircle, CreditCard, DollarSign } from 'lucide-react';
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

interface DepositRequest {
  userId: string;
  paymentMethodId: string;
  amount: number;
  screenshot: string;
  status: 'pending' | 'approved' | 'rejected';
}

const DepositSection = () => {
  const { user, userProfile, forceRefresh } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [amount, setAmount] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation states
  const depositAmount = parseFloat(amount) || 0;
  const isAmountValid = depositAmount > 0;
  const isFormValid = isAmountValid && selectedMethod && screenshot;

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

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setScreenshotPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if email is verified
    if (!userProfile?.emailVerified) {
      showError('Please verify your email address before making a deposit. Check your inbox for the verification link.');
      return;
    }
    
    if (!selectedMethod || !amount || !screenshot) {
      showError('Please fill in all fields and upload a screenshot');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert screenshot to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Screenshot = reader.result as string;
        
        const depositRequest: DepositRequest = {
          userId: user?._id || '',
          paymentMethodId: selectedMethod._id,
          amount: parseFloat(amount),
          screenshot: base64Screenshot,
          status: 'pending'
        };

        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: 'deposit',
            ...depositRequest
          })
        });

        const result = await response.json();

        if (result.success) {
          showSuccess('Deposit request submitted successfully! Please wait for admin approval.');
          setAmount('');
          setScreenshot(null);
          setScreenshotPreview('');
          setSelectedMethod(null);
          // Force refresh user data to get updated balances and notifications
          await forceRefresh();
        } else {
          showError(result.error || 'Failed to submit deposit request');
        }
      };
      reader.readAsDataURL(screenshot);
    } catch (error) {
      console.error('Error submitting deposit request:', error);
      showError('An error occurred while submitting your request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-0 lg:px-6 py-6">
      <div className="bg-white rounded-none lg:rounded-lg shadow-none lg:shadow-lg p-4 lg:p-8">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-green-100 rounded-full">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Make a Deposit</h2>
            <p className="text-gray-600">Choose a payment method and submit your deposit request</p>
          </div>
        </div>

        {/* Email Verification Warning */}
        {!userProfile?.emailVerified && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Email Verification Required
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Please verify your email address before making a deposit. Check your inbox for the verification link.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Payment Method</label>
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

          {/* Selected Method Details */}
          {selectedMethod && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-gray-50 rounded-lg p-6"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Payment Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Account Name:</span>
                  <span className="ml-2 text-gray-900">{selectedMethod.accountDetails?.accountName || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Account Number:</span>
                  <span className="ml-2 text-gray-900 font-mono break-all">{selectedMethod.accountDetails?.accountNumber || 'N/A'}</span>
                </div>
                {selectedMethod.accountDetails?.bankName && (
                  <div>
                    <span className="font-medium text-gray-700">Bank:</span>
                    <span className="ml-2 text-gray-900">{selectedMethod.accountDetails.bankName}</span>
                  </div>
                )}
                {selectedMethod.accountDetails?.network && (
                  <div>
                    <span className="font-medium text-gray-700">Network:</span>
                    <span className="ml-2 text-gray-900">{selectedMethod.accountDetails.network}</span>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Instructions:</h4>
                <p className="text-sm text-gray-600 whitespace-pre-line">{selectedMethod.instructions}</p>
              </div>
            </motion.div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (USD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                amount && !isAmountValid 
                  ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                  : 'border-gray-300 focus:ring-red-500'
              }`}
              placeholder="Enter amount to deposit"
              min="1"
              step="0.01"
              required
            />
            {amount && !isAmountValid && (
              <p className="mt-1 text-sm text-red-600">
                Please enter a valid amount greater than $0
              </p>
            )}
            {amount && isAmountValid && (
              <p className="mt-1 text-sm text-green-600">
                Amount: ${depositAmount.toFixed(2)}
              </p>
            )}
          </div>

          {/* Screenshot Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Payment Screenshot</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleScreenshotChange}
                className="hidden"
                id="screenshot-upload"
                required
              />
              <label htmlFor="screenshot-upload" className="cursor-pointer">
                {screenshotPreview ? (
                  <div className="space-y-4">
                    <Image 
                      src={screenshotPreview} 
                      alt="Screenshot preview" 
                      width={400}
                      height={400}
                      className="mx-auto max-w-full max-h-96 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200" 
                    />
                    <p className="text-sm text-gray-600">Click to change screenshot</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-900">Upload Payment Screenshot</p>
                      <p className="text-sm text-gray-600">Click to select an image file</p>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting || !userProfile?.emailVerified}
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
                <span>Submit Deposit Request</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DepositSection;