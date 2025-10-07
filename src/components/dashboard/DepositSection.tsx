'use client';

import { useState } from 'react';
import { ArrowDownUp, DollarSign, CreditCard } from 'lucide-react';

const DepositSection = () => {
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');

  const paymentMethods = [
    {
      id: 'trust-wallet',
      name: 'Trust Wallet',
      logo: '/wallet_logos/trust_wallet.png',
      color: 'blue',
      description: 'Deposit using Trust Wallet'
    },
    {
      id: 'btc',
      name: 'Bitcoin (BTC)',
      logo: '/wallet_logos/bitcoin.png',
      color: 'orange',
      description: 'Deposit using Bitcoin'
    },
    {
      id: 'bank-transfer',
      name: 'Bank Transfer',
      logo: '/wallet_logos/bank_transfer.png',
      color: 'green',
      description: 'Direct bank transfer'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      logo: '/wallet_logos/paypal.png',
      color: 'purple',
      description: 'PayPal payment'
    }
  ];

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount || !selectedMethod) return;
    
    // Handle deposit logic here
    console.log('Deposit:', { amount: depositAmount, method: selectedMethod });
  };

  return (
    <div className="space-y-6">
      {/* Deposit Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-600 mb-6">
          Add funds to your account using various payment methods. Choose your preferred method and enter the amount you wish to deposit.
        </p>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Current Balance</p>
          <p className="text-2xl font-bold text-gray-900">$0.00 USD</p>
        </div>

        <form onSubmit={handleDeposit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deposit Amount ($)
            </label>
            <input
              type="number"
              placeholder="Enter deposit amount"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              min="10"
              step="0.01"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Minimum deposit: $10.00
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
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
                      name="payment-method"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={() => setSelectedMethod(method.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {depositAmount && selectedMethod && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Deposit Summary</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-semibold">${parseFloat(depositAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="font-semibold">{paymentMethods.find(m => m.id === selectedMethod)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fee:</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${parseFloat(depositAmount).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!depositAmount || !selectedMethod}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
          >
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default DepositSection;
