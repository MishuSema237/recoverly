'use client';

import { useState } from 'react';
import { CreditCard, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

const TransferMoneySection = () => {
  const { userProfile } = useAuth();
  const [receiverEmail, setReceiverEmail] = useState('');
  const [receiverUserCode, setReceiverUserCode] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const validateReceiver = async () => {
    if (!receiverEmail || !receiverUserCode) {
      setError('Please enter both email and user code');
      return false;
    }

    setIsValidating(true);
    setError('');

    try {
      // Check if user exists with matching email and user code
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', receiverEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('No user found with this email address');
        return false;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      if (userData.userCode !== receiverUserCode) {
        setError('Email and user code do not match. Please verify the details.');
        return false;
      }

      if (userData._id === userProfile?._id) {
        setError('You cannot transfer money to yourself');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating receiver:', error);
      setError('Error validating receiver. Please try again.');
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = await validateReceiver();
    if (!isValid) return;
    
    // Handle transfer logic here
    console.log('Transfer:', { 
      receiverEmail, 
      receiverUserCode,
      amount: transferAmount 
    });
    
    // Reset form
    setReceiverEmail('');
    setReceiverUserCode('');
    setTransferAmount('');
    setError('');
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
          <p className="text-2xl font-bold text-gray-900">$0.00 USD</p>
        </div>

        <form onSubmit={handleTransfer} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Receiver Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="receiver@example.com"
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Receiver User Code
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="ABC12345"
              value={receiverUserCode}
              onChange={(e) => setReceiverUserCode(e.target.value.toUpperCase())}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Ask the receiver for their unique user code
            </p>
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
              min="1000"
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
              <strong>Min Transfer Amount:</strong> 1000 USD
            </p>
            <p className="text-sm text-yellow-800">
              <strong>Max Transfer Amount:</strong> 10000 USD
            </p>
          </div>

          <button
            type="submit"
            disabled={!receiverEmail || !receiverUserCode || !transferAmount || parseFloat(transferAmount) < 1000}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
          >
            Transfer Money
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferMoneySection;
