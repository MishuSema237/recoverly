'use client';

import { useState } from 'react';
import { ArrowUpDown, DollarSign, CreditCard } from 'lucide-react';

const WithdrawSection = () => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');

  const withdrawalMethods = [
    {
      id: 'trust-wallet',
      name: 'Trust Wallet',
      logo: '/wallet_logos/trust_wallet.png',
      color: 'blue',
      description: 'Withdraw to Trust Wallet',
      requiresAddress: true
    },
    {
      id: 'btc',
      name: 'Bitcoin (BTC)',
      logo: '/wallet_logos/bitcoin.png',
      color: 'orange',
      description: 'Withdraw to Bitcoin wallet',
      requiresAddress: true
    },
    {
      id: 'bank-transfer',
      name: 'Bank Transfer',
      logo: '/wallet_logos/bank_transfer.png',
      color: 'green',
      description: 'Direct bank transfer',
      requiresAddress: false
    },
    {
      id: 'paypal',
      name: 'PayPal',
      logo: '/wallet_logos/paypal.png',
      color: 'purple',
      description: 'Withdraw to PayPal account',
      requiresAddress: false
    }
  ];

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || !selectedMethod) return;
    
    // Handle withdrawal logic here
    console.log('Withdraw:', { 
      amount: withdrawAmount, 
      method: selectedMethod, 
      address: withdrawAddress 
    });
  };

  const selectedMethodData = withdrawalMethods.find(m => m.id === selectedMethod);
  const withdrawalFee = 2.5; // 2.5% fee
  const feeAmount = parseFloat(withdrawAmount) * (withdrawalFee / 100);
  const totalAmount = parseFloat(withdrawAmount) - feeAmount;

  return (
    <div className="space-y-6">
      {/* Withdrawal Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-600 mb-6">
          Withdraw your earnings to your preferred payment method. Enter the amount and select your withdrawal method.
        </p>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Available Balance</p>
          <p className="text-2xl font-bold text-gray-900">$0.00 USD</p>
        </div>

        <form onSubmit={handleWithdraw} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Withdrawal Amount ($)
            </label>
            <input
              type="number"
              placeholder="Enter withdrawal amount"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              min="50"
              step="0.01"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Minimum withdrawal: $50.00
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Withdrawal Method
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {withdrawalMethods.map((method) => (
                <div
                  key={method.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors duration-200 ${
                    selectedMethod === method.id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={method.logo} 
                        alt={method.name} 
                        className="w-20 h-10 rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className={`w-20 h-10 bg-${method.color}-600 rounded-lg flex items-center justify-center text-white font-bold hidden`}>
                        {method.name[0]}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{method.name}</h4>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="withdrawal-method"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={() => setSelectedMethod(method.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedMethodData?.requiresAddress && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {selectedMethodData.name} Address
              </label>
              <input
                type="text"
                placeholder={`Enter your ${selectedMethodData.name} address`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
                required={selectedMethodData.requiresAddress}
              />
            </div>
          )}

          {withdrawAmount && selectedMethod && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Withdrawal Summary</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-semibold">${parseFloat(withdrawAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="font-semibold">{selectedMethodData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fee ({withdrawalFee}%):</span>
                  <span className="font-semibold">${feeAmount.toFixed(2)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>You will receive:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Important Notice</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Withdrawal requests are processed within 24-48 hours</li>
              <li>• A 2.5% processing fee applies to all withdrawals</li>
              <li>• Minimum withdrawal amount is $50.00</li>
              <li>• Please ensure your withdrawal address is correct</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={!withdrawAmount || !selectedMethod || (selectedMethodData?.requiresAddress && !withdrawAddress)}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
          >
            Request Withdrawal
          </button>
        </form>
      </div>
    </div>
  );
};

export default WithdrawSection;
