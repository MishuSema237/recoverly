'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Star, Zap, Crown, Gem, AlertCircle, TrendingUp, Diamond, Rocket, Shield, Gift, Target, Trophy, Flame, RefreshCw, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PlanService, InvestmentPlan } from '@/lib/services/PlanService';

interface UpgradePlanSectionProps {
  onBack: () => void;
  onUpgrade: (plan: InvestmentPlan, amount: number) => void;
}

const UpgradePlanSection = ({ onBack, onUpgrade }: UpgradePlanSectionProps) => {
  const { userProfile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);
  const [showCalculation, setShowCalculation] = useState<boolean>(false);
  const [amountError, setAmountError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const plansPerPage = 3;

  // Get actual account balance from user profile
  const accountBalance = userProfile?.balances?.main || 0;

  // Filter out the current plan
  const availablePlans = plans.filter(plan => plan.name !== userProfile?.investmentPlan);

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
      setAmountError('');
    }
    
    setShowCalculation(false);
  };

  // Validate investment amount
  const validateAmount = (amount: number, plan: InvestmentPlan): string => {
    if (amount < plan.minAmount) {
      return `Minimum investment is $${plan.minAmount.toLocaleString()}`;
    }
    if (amount > plan.maxAmount && plan.maxAmount !== Infinity) {
      return `Maximum investment is $${plan.maxAmount.toLocaleString()}`;
    }
    if (amount > accountBalance) {
      return `Insufficient balance. Available: $${accountBalance.toLocaleString()}`;
    }
    return '';
  };

  // Handle amount change
  const handleAmountChange = (amount: number) => {
    setInvestmentAmount(amount);
    
    if (selectedPlan) {
      const error = validateAmount(amount, selectedPlan);
      setAmountError(error);
      setShowCalculation(amount > 0 && !error);
    }
  };

  // Calculate returns
  const calculateReturns = (amount: number, plan: InvestmentPlan) => {
    const totalReturn = (amount * plan.roi) / 100;
    const dailyReturn = totalReturn / parseInt(plan.duration.toString());
    const netProfit = totalReturn;
    
    return {
      totalReturn,
      dailyReturn,
      netProfit
    };
  };

  // Handle investment submission
  const handleInvest = async () => {
    if (!selectedPlan || !investmentAmount || amountError) {
      setMessage({ type: 'error', text: 'Please select a plan and enter a valid amount.' });
      return;
    }

    setIsProcessing(true);
    setMessage({ type: '', text: '' });

    try {
      // Call the onUpgrade callback with the selected plan and amount
      await onUpgrade(selectedPlan, investmentAmount);
      
      setMessage({ type: 'success', text: 'Investment upgrade request submitted successfully!' });
      
      // Reset form
      setSelectedPlan(null);
      setInvestmentAmount(0);
      setShowCalculation(false);
      setAmountError('');
      
    } catch (error) {
      console.error('Investment error:', error);
      setMessage({ type: 'error', text: 'Failed to submit investment request. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Load plans
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const planService = new PlanService();
        const mongoPlans = await planService.getAllPlans();
        
        if (mongoPlans.length > 0) {
          setPlans(mongoPlans);
        } else {
          setPlans([]);
        }
        
        if (refreshing) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading plans from MongoDB:', error);
        setPlans([]);
        
        if (refreshing) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    };

    loadPlans();
  }, [refreshing]);

  // Manual refresh function
  const handleRefresh = async () => {
    setRefreshing(true);
    const planService = new PlanService();
    const mongoPlans = await planService.getAllPlans();
    
    if (mongoPlans.length > 0) {
      setPlans(mongoPlans);
    } else {
      setPlans([]);
    }
    setRefreshing(false);
  };

  // Pagination functions
  const totalPages = Math.ceil(availablePlans.length / plansPerPage);
  const startIndex = currentPage * plansPerPage;
  const paginatedPlans = availablePlans.slice(startIndex, startIndex + plansPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get icon component
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Medal': <Star className="w-6 h-6" />,
      'medal': <Star className="w-6 h-6" />,
      'Star': <Star className="w-6 h-6" />,
      'star': <Star className="w-6 h-6" />,
      'Crown': <Crown className="w-6 h-6" />,
      'crown': <Crown className="w-6 h-6" />,
      'Gem': <Gem className="w-6 h-6" />,
      'gem': <Gem className="w-6 h-6" />,
      'Zap': <Zap className="w-6 h-6" />,
      'zap': <Zap className="w-6 h-6" />,
      'Shield': <Shield className="w-6 h-6" />,
      'shield': <Shield className="w-6 h-6" />,
      'Trophy': <Trophy className="w-6 h-6" />,
      'trophy': <Trophy className="w-6 h-6" />,
      'Award': <Trophy className="w-6 h-6" />,
      'award': <Trophy className="w-6 h-6" />,
      'Diamond': <Diamond className="w-6 h-6" />,
      'diamond': <Diamond className="w-6 h-6" />,
      'Rocket': <Rocket className="w-6 h-6" />,
      'rocket': <Rocket className="w-6 h-6" />,
      'Gift': <Gift className="w-6 h-6" />,
      'gift': <Gift className="w-6 h-6" />,
      'Target': <Target className="w-6 h-6" />,
      'target': <Target className="w-6 h-6" />,
      'Flame': <Flame className="w-6 h-6" />,
      'flame': <Flame className="w-6 h-6" />
    };
    return iconMap[iconName] || <Star className="w-6 h-6" />;
  };

  // Get color gradient
  const getColorGradient = (color: string) => {
    const gradients: { [key: string]: string } = {
      'red': 'from-red-500 to-red-600',
      'blue': 'from-blue-500 to-blue-600',
      'green': 'from-green-500 to-green-600',
      'purple': 'from-purple-500 to-purple-600',
      'pink': 'from-pink-500 to-pink-600',
      'yellow': 'from-yellow-500 to-yellow-600',
      'indigo': 'from-indigo-500 to-indigo-600',
      'orange': 'from-orange-500 to-orange-600',
      'teal': 'from-teal-500 to-teal-600',
      'cyan': 'from-cyan-500 to-cyan-600'
    };
    return gradients[color] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="w-full p-6">
        <div className="p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Back to Investment Progress"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Upgrade Your Investment Plan</h2>
              <p className="text-gray-600">Choose a new plan to upgrade your current investment for better returns.</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
            title="Refresh plans"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Current Balance */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Available Balance</p>
          <p className="text-2xl font-bold text-gray-900">
            ${accountBalance.toLocaleString()} USD
          </p>
        </div>

        {/* Investment Plans Grid */}
        {availablePlans.length === 0 ? (
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Upgrade Plans Available</h3>
            <p className="text-gray-600">There are no other investment plans available for upgrade at the moment.</p>
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
                  className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                    selectedPlan?._id === plan._id ? 'ring-2 ring-red-500 border-red-500' : ''
                  }`}
                  onClick={() => handlePlanChange(plan)}
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
                        <span className="font-semibold">{plan.duration} days</span>
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
                      className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                        selectedPlan?._id === plan._id
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {selectedPlan?._id === plan._id ? 'Selected' : 'Select Plan'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 0}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages - 1}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Investment Form */}
        {selectedPlan && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Investment Details</h3>
            
            <div className="space-y-6">
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Amount (USD)
                </label>
                <input
                  type="number"
                  value={investmentAmount || ''}
                  onChange={(e) => handleAmountChange(parseFloat(e.target.value) || 0)}
                  placeholder={`Min: $${selectedPlan.minAmount.toLocaleString()}`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                {amountError && (
                  <p className="mt-2 text-sm text-red-600">{amountError}</p>
                )}
              </div>

              {/* Calculation Preview */}
              {showCalculation && !amountError && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Projected Returns</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Daily Return</p>
                      <p className="text-lg font-semibold text-green-600">
                        ${calculateReturns(investmentAmount, selectedPlan).dailyReturn.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Return</p>
                      <p className="text-lg font-semibold text-blue-600">
                        ${calculateReturns(investmentAmount, selectedPlan).totalReturn.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Net Profit</p>
                      <p className="text-lg font-semibold text-purple-600">
                        ${calculateReturns(investmentAmount, selectedPlan).netProfit.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleInvest}
                disabled={!selectedPlan || !investmentAmount || !!amountError || isProcessing}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Upgrade Investment'}
              </button>

              {/* Message */}
              {message.text && (
                <div className={`p-4 rounded-lg ${
                  message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {message.text}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpgradePlanSection;
