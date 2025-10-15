'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle, Star, Zap, Crown, Gem, Mail, AlertCircle, TrendingUp, Diamond, Rocket, Shield, Gift, Target, Trophy, Flame, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PlanService, InvestmentPlan } from '@/lib/services/PlanService';

interface InvestmentPlansProps {
  isDashboard?: boolean;
}

const InvestmentPlans = ({ isDashboard = false }: InvestmentPlansProps) => {
  const { user, userProfile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [showCalculation, setShowCalculation] = useState<boolean>(false);
  const [amountError, setAmountError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [offlinePlans, setOfflinePlans] = useState<InvestmentPlan[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const plansPerPage = 3;

  // Mock account balance - in real app, this would come from user profile
  const accountBalance = userProfile?.totalInvested ? 10000 : 0; // Example: $10,000 if user has invested before

  // Recalculate when plan changes
  const handlePlanChange = (plan: InvestmentPlan | null) => {
    setSelectedPlan(plan);
    
    if (plan && investmentAmount > 0) {
      // Revalidate current amount against new plan
      const error = validateAmount(investmentAmount, plan);
      setAmountError(error);
    } else if (plan && investmentAmount === 0) {
      // Reset amount error when plan changes but no amount is set
      setAmountError('');
    } else {
      // Clear error when no plan is selected
      setAmountError('');
    }
  };

  // Check online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    // Check initial status
    setIsOffline(!navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load plans from MongoDB with caching
  useEffect(() => {
    const loadPlans = async (showRefreshing = false) => {
      try {
        if (showRefreshing) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        
        const planService = new PlanService();
        const mongoPlans = await planService.getAllPlans();
        
        if (mongoPlans.length > 0) {
          setPlans(mongoPlans);
          // Cache plans for offline use
          localStorage.setItem('investmentPlans', JSON.stringify(mongoPlans));
        } else {
          // Clear cached plans if database has no plans
          localStorage.removeItem('investmentPlans');
          setPlans([]);
        }
        
        if (showRefreshing) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading plans from MongoDB:', error);
        
        // Clear cached plans on error to ensure fresh data
        localStorage.removeItem('investmentPlans');
        setPlans([]);
        
        if (showRefreshing) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    };

    loadPlans();

    // Refresh plans every 2 minutes to get updates from admin (only when online and authenticated)
    if (!isOffline && user) {
      const interval = setInterval(() => loadPlans(true), 120000); // 2 minutes
      return () => clearInterval(interval);
    }
  }, [isOffline, user]);

  // Manual refresh function
  const handleRefresh = async () => {
    if (isOffline) {
      // If offline, try to load from cache
      const cachedPlans = localStorage.getItem('investmentPlans');
      if (cachedPlans) {
        const parsedPlans = JSON.parse(cachedPlans);
        setPlans(parsedPlans);
        setOfflinePlans(parsedPlans);
      }
      return;
    }

    const loadPlans = async () => {
      try {
        setRefreshing(true);
        const planService = new PlanService();
        const mongoPlans = await planService.getAllPlans();
        
        if (mongoPlans.length > 0) {
          setPlans(mongoPlans);
          // Cache plans for offline use
          localStorage.setItem('investmentPlans', JSON.stringify(mongoPlans));
        } else {
          // Try to load cached plans if API fails
          const cachedPlans = localStorage.getItem('investmentPlans');
          if (cachedPlans) {
            const parsedPlans = JSON.parse(cachedPlans);
            setPlans(parsedPlans);
            setOfflinePlans(parsedPlans);
          } else {
            setPlans([]);
          }
        }
        setRefreshing(false);
      } catch (error) {
        console.error('Error loading plans from MongoDB:', error);
        // Try to load cached plans on error
        const cachedPlans = localStorage.getItem('investmentPlans');
        if (cachedPlans) {
          const parsedPlans = JSON.parse(cachedPlans);
          setPlans(parsedPlans);
          setOfflinePlans(parsedPlans);
        } else {
          setPlans([]);
        }
        setRefreshing(false);
      }
    };
    
    await loadPlans();
  };

  // Use only MongoDB plans
  const currentPlans = plans;

  // Pagination functions
  const totalPages = Math.ceil(currentPlans.length / plansPerPage);
  
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = currentPage * plansPerPage;
  const endIndex = startIndex + plansPerPage;
  const paginatedPlans = currentPlans.slice(startIndex, endIndex);

  // Color mapping function
  const getColorGradient = (colorName?: string) => {
    const colorMap: { [key: string]: string } = {
      'blue': 'from-blue-500 to-blue-600',
      'green': 'from-green-500 to-green-600',
      'purple': 'from-purple-500 to-purple-600',
      'gold': 'from-yellow-500 to-yellow-600',
      'red': 'from-red-500 to-red-600',
      'cyan': 'from-cyan-500 to-cyan-600',
      'orange': 'from-orange-500 to-orange-600',
      'pink': 'from-pink-500 to-pink-600',
      'indigo': 'from-indigo-500 to-indigo-600',
      'teal': 'from-teal-500 to-teal-600',
      'lime': 'from-lime-500 to-lime-600',
      'amber': 'from-amber-500 to-amber-600',
      'emerald': 'from-emerald-500 to-emerald-600',
      'rose': 'from-rose-500 to-rose-600',
      'violet': 'from-violet-500 to-violet-600',
      'gray': 'from-gray-400 to-gray-500',
    };
    return colorMap[colorName || 'blue'] || 'from-blue-500 to-blue-600';
  };

  // Icon mapping function - return SVG icons
  const getIcon = (iconName?: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      'zap': <Zap className="w-6 h-6" />,
      'star': <Star className="w-6 h-6" />,
      'crown': <Crown className="w-6 h-6" />,
      'gem': <Gem className="w-6 h-6" />,
      'diamond': <Diamond className="w-6 h-6" />,
      'rocket': <Rocket className="w-6 h-6" />,
      'shield': <Shield className="w-6 h-6" />,
      'gift': <Gift className="w-6 h-6" />,
      'target': <Target className="w-6 h-6" />,
      'trophy': <Trophy className="w-6 h-6" />,
      'flame': <Flame className="w-6 h-6" />,
      'trending-up': <TrendingUp className="w-6 h-6" />,
      'medal': <Trophy className="w-6 h-6" />,
    };
    return iconMap[iconName || 'zap'] || <Zap className="w-6 h-6" />;
  };

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

  const calculateEarnings = (amount: number, roi: number, duration: string) => {
    if (duration === 'Daily') {
      return (amount * roi / 100).toFixed(2);
    } else {
      return (amount * roi / 100 * 30).toFixed(2);
    }
  };

  const handleInvestment = async () => {
    if (!user || !selectedPlan) return;

    // Disable button immediately to prevent multiple clicks
    setIsProcessing(true);

    // Check if user has sufficient balance
    if (investmentAmount > accountBalance) {
      setMessage({ 
        type: 'error', 
        text: `Insufficient balance. You need $${investmentAmount.toLocaleString()} but only have $${accountBalance.toLocaleString()} in your account. Please deposit funds first.` 
      });
      setIsProcessing(false);
      return;
    }

    setMessage({ type: '', text: '' });

    try {
      // Update user's investment via API
      const response = await fetch('/api/users/invest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: selectedPlan._id,
          amount: investmentAmount,
          planName: selectedPlan.name
        }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Investment failed');
      }

      setMessage({ 
        type: 'success', 
        text: `Investment of $${investmentAmount.toLocaleString()} in ${selectedPlan.name} plan confirmed! Your investment is now active.` 
      });

      // Reset form
      setSelectedPlan(null);
      setInvestmentAmount(0);
      setShowCalculation(false);
      setAmountError('');

    } catch (error) {
      console.error('Error processing investment:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to process investment. Please try again or contact support.' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const validateAmount = (amount: number, plan: InvestmentPlan) => {
    if (amount < plan.minAmount) {
      return `Minimum investment amount is $${plan.minAmount.toLocaleString()}`;
    }
    if (plan.maxAmount !== Infinity && amount > plan.maxAmount) {
      return `Maximum investment amount is $${plan.maxAmount.toLocaleString()}`;
    }
    return '';
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16" id="investment-plans">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-4xl font-bold text-gray-900">
              Our Investment Plans
            </h2>
            {isOffline && (
              <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span className="text-sm font-medium">Offline</span>
              </div>
            )}
            {user && (
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                title="Refresh plans"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our carefully crafted investment plans designed to maximize your returns 
            while maintaining security and transparency.
          </p>
        </div>

        {/* Investment Plans Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
          </div>
        ) : currentPlans.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">
              {isOffline 
                ? "No cached investment plans available. Please connect to the internet to load plans."
                : "No investment plans available at the moment."
              }
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {paginatedPlans.map((plan, index) => (
            <motion.div
              key={plan._id || `${index}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                selectedPlan?._id === plan._id ? 'ring-2 ring-red-500 border-red-500' : ''
              }`}
            >
              
              <div className={`bg-gradient-to-r ${getColorGradient(plan.color)} p-6 rounded-t-2xl`}>
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-3">
                    {getIcon(plan.icon)}
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{plan.roi}%</div>
                    <div className="text-sm opacity-90">ROI</div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">{plan.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Amount:</span>
                    <span className="font-semibold">${plan.minAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Amount:</span>
                    <span className="font-semibold">
                      {plan.maxAmount === Infinity ? 'Unlimited' : `$${plan.maxAmount.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capital Back:</span>
                    <span className="font-semibold text-green-600">
                      {plan.capitalBack ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (isDashboard && user && user.emailVerified) {
                      handlePlanChange(plan);
                      setShowCalculation(true);
                    } else if (!user) {
                      window.location.href = '/login';
                    } else if (!user.emailVerified) {
                      window.location.href = '/activate-email';
                    } else {
                      handlePlanChange(plan);
                    }
                  }}
                  disabled={isProcessing}
                  className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold transition-colors duration-200 bg-gradient-to-r ${getColorGradient(plan.color)} text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {!user ? 'Invest' : !user.emailVerified ? 'Verify Email First' : isDashboard ? (selectedPlan?._id === plan._id ? 'Selected' : 'Select Plan') : 'Invest Now'}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-4 mt-8">
                {/* Previous Button */}
                <button
                  onClick={prevPage}
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:bg-red-50"
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                {/* Pagination Dots */}
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => goToPage(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        currentPage === index
                          ? 'bg-red-600 scale-125'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={nextPage}
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:bg-red-50"
                  disabled={currentPage === totalPages - 1}
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Dashboard Calculation Section */}
        {isDashboard && showCalculation && selectedPlan && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Investment Calculation
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Amount ($)
                  </label>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => {
                      const amount = Number(e.target.value);
                      setInvestmentAmount(amount);
                      if (amount > 0) {
                        const error = validateAmount(amount, selectedPlan);
                        setAmountError(error);
                      } else {
                        setAmountError('');
                      }
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      amountError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter amount"
                    min={selectedPlan.minAmount}
                    max={selectedPlan.maxAmount === Infinity ? undefined : selectedPlan.maxAmount}
                  />
                  {amountError ? (
                    <p className="text-sm text-red-500 mt-1">{amountError}</p>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">
                      Min: ${selectedPlan.minAmount.toLocaleString()} | 
                      Max: {selectedPlan.maxAmount === Infinity ? 'Unlimited' : `$${selectedPlan.maxAmount.toLocaleString()}`}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Plan
                  </label>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getIcon(selectedPlan.icon)}
                      <div>
                        <h4 className="font-semibold text-gray-900">{selectedPlan.name}</h4>
                        <p className="text-sm text-gray-600">{selectedPlan.roi}% ROI • {selectedPlan.duration}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Investment Summary</h4>
                {investmentAmount > 0 ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Investment Amount:</span>
                      <span className="font-semibold">${investmentAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <span className="font-semibold">{selectedPlan.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ROI:</span>
                      <span className="font-semibold">{selectedPlan.roi}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold">{selectedPlan.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capital Back:</span>
                      <span className={`font-semibold ${selectedPlan.capitalBack ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedPlan.capitalBack ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <hr className="my-3" />
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-900 font-semibold">Expected Earnings:</span>
                      <span className="font-bold text-green-600">
                        ${calculateEarnings(investmentAmount, selectedPlan.roi, selectedPlan.duration)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Enter an investment amount to see calculations.
                  </p>
                )}
              </div>
            </div>

            {/* Investment Details */}
            {investmentAmount > 0 && !amountError && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Investment Details</h4>
                
                {/* How Your Money Multiplies */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
                  <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    How Your Money Multiplies
                  </h5>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">Initial Investment:</span>
                      <span className="font-semibold text-gray-900">${investmentAmount.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">ROI Rate:</span>
                      <span className="font-semibold text-green-600">{selectedPlan.roi}%</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">Investment Duration:</span>
                      <span className="font-semibold text-gray-900">{selectedPlan.duration}</span>
                    </div>
                    
                    {selectedPlan.duration === 'Daily' ? (
                      <>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-700">Daily Earnings:</span>
                          <span className="font-semibold text-green-600">
                            ${(investmentAmount * selectedPlan.roi / 100).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-700">Total Earnings (30 days):</span>
                          <span className="font-semibold text-green-600">
                            ${(investmentAmount * selectedPlan.roi / 100 * 30).toFixed(2)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-700">Total Earnings:</span>
                        <span className="font-semibold text-green-600">
                          ${(investmentAmount * selectedPlan.roi / 100).toFixed(2)}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">Capital Return:</span>
                      <span className={`font-semibold ${selectedPlan.capitalBack ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedPlan.capitalBack ? 'Yes' : 'No'}
                      </span>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total Return:</span>
                        <span className="text-xl font-bold text-green-600">
                          ${selectedPlan.capitalBack 
                            ? (parseFloat(calculateEarnings(investmentAmount, selectedPlan.roi, selectedPlan.duration)) + investmentAmount).toFixed(2)
                            : calculateEarnings(investmentAmount, selectedPlan.roi, selectedPlan.duration)
                          }
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {selectedPlan.capitalBack 
                          ? 'Includes your initial investment + earnings'
                          : 'Earnings only (capital not returned)'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Investment Process */}
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                    Investment Process
                  </h5>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <p>Your investment will be deducted from your account balance</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <p>Your investment will be locked for the duration period</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <p>Earnings will be calculated based on the selected plan</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                      <p>At maturity, earnings {selectedPlan.capitalBack ? 'and capital' : ''} will be credited to your account</p>
                    </div>
                  </div>
                </div>

                {/* Proceed Button */}
                <div className="text-center">
                  <button
                    className={`py-3 px-8 rounded-lg font-semibold transition-colors duration-200 ${
                      isProcessing || investmentAmount === 0 || amountError || accountBalance === 0
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                    onClick={handleInvestment}
                    disabled={isProcessing || investmentAmount === 0 || !!amountError || accountBalance === 0}
                  >
                    {isProcessing ? 'Processing...' : 'Confirm Investment'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Investment Calculator */}
        {!isDashboard && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Investment Calculator
            </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Amount ($)
                </label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => {
                    const amount = Number(e.target.value);
                    setInvestmentAmount(amount);
                    if (selectedPlan && amount > 0) {
                      const error = validateAmount(amount, selectedPlan);
                      setAmountError(error);
                    } else {
                      setAmountError('');
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    amountError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter amount"
                  min={selectedPlan?.minAmount || 0}
                  max={selectedPlan?.maxAmount === Infinity ? undefined : selectedPlan?.maxAmount}
                />
                {amountError && (
                  <p className="text-sm text-red-500 mt-1">{amountError}</p>
                )}
                {selectedPlan && !amountError && (
                  <p className="text-sm text-gray-500 mt-1">
                    Min: ${selectedPlan.minAmount.toLocaleString()} | 
                    Max: {selectedPlan.maxAmount === Infinity ? 'Unlimited' : `$${selectedPlan.maxAmount.toLocaleString()}`}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Plan
                </label>
                <select
                  onChange={(e) => {
                    const plan = plans.find(p => p._id === e.target.value);
                    handlePlanChange(plan || null);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select a plan</option>
                  {currentPlans.map(plan => (
                    <option key={plan._id} value={plan._id}>
                      {plan.name} ({plan.roi}% ROI)
                    </option>
                  ))}
                </select>
              </div>

              {!user ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    Please log in to start investing with Tesla Capital.
                  </p>
                </div>
              ) : !user.emailVerified ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                    <p className="text-yellow-800 text-sm">
                      Please verify your email address to start investing.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <p className="text-green-800 text-sm">
                      Your email is verified. You can start investing!
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Calculate Earnings</h4>
              {selectedPlan && investmentAmount > 0 ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Investment Amount:</span>
                    <span className="font-semibold">${investmentAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-semibold">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ROI:</span>
                    <span className="font-semibold">{selectedPlan.roi}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">{selectedPlan.duration}</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-900 font-semibold">Expected Earnings:</span>
                    <span className="font-bold text-green-600">
                      ${calculateEarnings(investmentAmount, selectedPlan.roi, selectedPlan.duration)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Select a plan and enter an amount to calculate your potential earnings.
                </p>
              )}
            </div>
          </div>
        </div>
        )}

        {/* Investment Details */}
        {!isDashboard && user && user.emailVerified && selectedPlan && investmentAmount > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Investment Details
            </h3>
            
            {/* Message Display */}
            {message.text && (
              <div className={`p-4 rounded-lg mb-6 ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            {/* Account Balance Warning */}
            {accountBalance === 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                  <div>
                    <p className="font-medium text-yellow-800">No Account Balance</p>
                    <p className="text-sm text-yellow-700">You need to deposit funds before making an investment.</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* How Your Money Multiplies */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
              <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                How Your Money Multiplies
              </h5>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Initial Investment:</span>
                  <span className="font-semibold text-gray-900">${investmentAmount.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">ROI Rate:</span>
                  <span className="font-semibold text-green-600">{selectedPlan.roi}%</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Investment Duration:</span>
                  <span className="font-semibold text-gray-900">{selectedPlan.duration}</span>
                </div>
                
                {selectedPlan.duration === 'Daily' ? (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">Daily Earnings:</span>
                      <span className="font-semibold text-green-600">
                        ${(investmentAmount * selectedPlan.roi / 100).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">Total Earnings (30 days):</span>
                      <span className="font-semibold text-green-600">
                        ${(investmentAmount * selectedPlan.roi / 100 * 30).toFixed(2)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-700">Total Earnings:</span>
                    <span className="font-semibold text-green-600">
                      ${(investmentAmount * selectedPlan.roi / 100).toFixed(2)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Capital Return:</span>
                  <span className={`font-semibold ${selectedPlan.capitalBack ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedPlan.capitalBack ? 'Yes' : 'No'}
                  </span>
                </div>
                
                <div className="bg-white rounded-lg p-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Return:</span>
                    <span className="text-xl font-bold text-green-600">
                      ${selectedPlan.capitalBack 
                        ? (parseFloat(calculateEarnings(investmentAmount, selectedPlan.roi, selectedPlan.duration)) + investmentAmount).toFixed(2)
                        : calculateEarnings(investmentAmount, selectedPlan.roi, selectedPlan.duration)
                      }
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedPlan.capitalBack 
                      ? 'Includes your initial investment + earnings'
                      : 'Earnings only (capital not returned)'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Investment Process */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                Investment Process
              </h5>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <p>Your investment will be deducted from your account balance</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <p>Your investment will be locked for the duration period</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <p>Earnings will be calculated based on the selected plan</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                  <p>At maturity, earnings {selectedPlan.capitalBack ? 'and capital' : ''} will be credited to your account</p>
                </div>
              </div>
            </div>

            {/* Proceed Button */}
            <div className="text-center">
              <button
                className={`py-3 px-8 rounded-lg font-semibold transition-colors duration-200 ${
                  isProcessing || investmentAmount === 0 || amountError || accountBalance === 0
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
                onClick={handleInvestment}
                disabled={isProcessing || investmentAmount === 0 || !!amountError || accountBalance === 0}
              >
                {isProcessing ? 'Processing...' : 'Confirm Investment'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default InvestmentPlans;
