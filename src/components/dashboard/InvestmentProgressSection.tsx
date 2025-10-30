'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Calendar, 
  Target, 
  ArrowUpRight,
  RefreshCw,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Medal,
  Star,
  Crown,
  Gem,
  Zap,
  Shield,
  Trophy,
  Award
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UpgradePlanSection from './UpgradePlanSection';
import { InvestmentPlan } from '@/lib/services/PlanService';

interface InvestmentProgress {
  planName: string;
  amount: number;
  dailyEarnings: number;
  totalEarnings: number;
  daysActive: number;
  daysRemaining: number;
  nextPayout: string; // ISO string format for proper Date parsing
  status: 'active' | 'completed' | 'pending';
  planIcon: string;
  planDuration: number;
  planROI: number;
  planColor: string;
  investmentDate: Date;
}

interface InvestmentProgressSectionProps {
  onUpgradePlan?: () => void;
}

const InvestmentProgressSection = ({ onUpgradePlan }: InvestmentProgressSectionProps) => {
  const { userProfile, forceRefresh } = useAuth();
  const [progress, setProgress] = useState<InvestmentProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showUpgradeInterface, setShowUpgradeInterface] = useState(false);

  const calculateProgress = useCallback(async () => {
    if (!userProfile?.currentInvestment || !userProfile?.investmentPlan) {
      setLoading(false);
      return;
    }

    try {
      // Fetch the actual plan data from the database
      const planResponse = await fetch(`/api/plans?name=${userProfile.investmentPlan}`);
      const planResult = await planResponse.json();
      
      if (!planResult.success || !planResult.data) {
        console.warn('Plan not found, falling back to basic progress:', userProfile.investmentPlan);
        setProgress({
          planName: userProfile.investmentPlan,
          amount: investmentAmount,
          dailyEarnings: 0,
          totalEarnings: 0,
          daysActive: 0,
          daysRemaining: 0,
          nextPayout: new Date().toISOString(),
          status: 'active',
          planIcon: 'Medal',
          planDuration: 0,
          planROI: 0,
          planColor: 'red',
          investmentDate: new Date(userProfile.investments?.[0]?.createdAt || new Date())
        });
        setLoading(false);
        return;
      }

      const plan = planResult.data;
      const investmentAmount = userProfile.currentInvestment;
      
      console.log('Plan data from API:', plan);
      
      // Convert duration to number - handle string like "10 Days" or just "10"
      let planDuration = 0;
      if (typeof plan.duration === 'string') {
        // Extract numbers from string like "10 Days" -> 10
        const match = plan.duration.match(/\d+/);
        planDuration = match ? parseInt(match[0]) : 0;
      } else if (typeof plan.duration === 'number') {
        planDuration = plan.duration;
      }
      
      // Ensure ROI is a valid number
      const planROI = typeof plan.roi === 'number' ? plan.roi : parseFloat(plan.roi || '0');
      
      // Validate plan data
      if (!planDuration || isNaN(planDuration) || !planROI || isNaN(planROI)) {
        console.error('Invalid plan data:', { 
          duration: plan.duration, 
          parsedDuration: planDuration,
          roi: plan.roi,
          parsedROI: planROI
        });
        setLoading(false);
        return;
      }
      
      // Calculate daily earnings based on actual plan ROI
      // ROI is the total return over the duration, so daily rate = ROI / duration
      const dailyRate = planROI / planDuration;
      const dailyEarnings = (investmentAmount * dailyRate) / 100;
      
      // Calculate days active from actual investment date
      const investmentDate = userProfile.investments?.[0]?.createdAt || new Date();
      const daysActive = Math.floor((new Date().getTime() - new Date(investmentDate).getTime()) / (1000 * 60 * 60 * 24));
      
      // Calculate total earnings from actual transactions
      let totalEarnings = 0;
      if (userProfile.transactions) {
        totalEarnings = userProfile.transactions
          .filter(t => t.type === 'daily_gain' && t.planName === plan.name)
          .reduce((sum, t) => sum + t.amount, 0);
      }
      
      // Calculate remaining days based on actual plan duration
      const daysRemaining = Math.max(0, planDuration - daysActive);
      
      // Next payout (daily at midnight)
      const nextPayout = new Date();
      nextPayout.setDate(nextPayout.getDate() + 1);
      nextPayout.setHours(0, 0, 0, 0);

      setProgress({
        planName: plan.name,
        amount: investmentAmount,
        dailyEarnings,
        totalEarnings,
        daysActive: Math.max(0, daysActive),
        daysRemaining,
        nextPayout: nextPayout.toISOString(), // Store as ISO string for proper Date parsing
        status: daysRemaining > 0 ? 'active' : 'completed',
        planIcon: plan.icon || 'Medal',
        planDuration: planDuration,
        planROI: planROI,
        planColor: plan.color || 'pink',
        investmentDate: new Date(investmentDate)
      });
      
    } catch (error) {
      console.error('Error calculating progress:', error);
    } finally {
      setLoading(false);
    }
  }, [userProfile]);

  const getPlanIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Medal': <Medal className="w-6 h-6" />,
      'medal': <Medal className="w-6 h-6" />,
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
      'Award': <Award className="w-6 h-6" />,
      'award': <Award className="w-6 h-6" />
    };
    return iconMap[iconName] || <Medal className="w-6 h-6" />;
  };

  useEffect(() => {
    if (userProfile?.currentInvestment && userProfile?.investmentPlan) {
      // Process daily gains for this user's investment
      const processDailyGains = async () => {
        try {
          await fetch('/api/investments/process-daily-gains', {
            method: 'POST'
          });
        } catch (error) {
          console.error('Error processing daily gains:', error);
        }
      };
      processDailyGains();
      calculateProgress();
    } else {
      setLoading(false);
    }
  }, [userProfile, calculateProgress]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await forceRefresh();
    calculateProgress();
    setRefreshing(false);
  };

  const handleUpgrade = async (plan: InvestmentPlan, amount: number) => {
    try {
      // Call the original onUpgradePlan callback if provided
      if (onUpgradePlan) {
        onUpgradePlan();
      }
      
      // Here you would typically make an API call to upgrade the investment
      // For now, we'll just show a success message and refresh
      console.log('Upgrading to plan:', plan.name, 'with amount:', amount);
      
      // Refresh the user profile to get updated data
      await forceRefresh();
      
      // Go back to the progress view
      setShowUpgradeInterface(false);
      
    } catch (error) {
      console.error('Error upgrading investment:', error);
      throw error;
    }
  };

  const handleBackToProgress = () => {
    setShowUpgradeInterface(false);
  };

  // Show upgrade interface if requested
  if (showUpgradeInterface) {
    return (
      <UpgradePlanSection
        onBack={handleBackToProgress}
        onUpgrade={handleUpgrade}
      />
    );
  }

  if (loading) {
    return (
      <div className="w-full px-0 lg:px-6 py-6">
        <div className="p-4 lg:p-8">
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

  if (!progress) {
    return (
      <div className="w-full px-0 lg:px-6 py-6">
        <div className="p-4 lg:p-8 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Investment</h3>
          <p className="text-gray-600">You don&apos;t have an active investment plan. Start investing to see your progress here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-0 lg:px-6 py-6">
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className={`p-3 bg-${progress.planColor}-100 rounded-full`}>
              {getPlanIcon(progress.planIcon)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Investment Progress</h2>
              <p className="text-gray-600">Track your {progress.planName} plan performance</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
            title="Refresh data"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Investment</p>
                <p className="text-2xl font-bold">${progress.amount.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Earnings</p>
                <p className="text-2xl font-bold">${progress.totalEarnings.toFixed(2)}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Today&apos;s Earnings</p>
                <p className="text-2xl font-bold">${progress.dailyEarnings.toFixed(2)}</p>
              </div>
              <ArrowUpRight className="w-8 h-8 text-purple-200" />
            </div>
          </motion.div>
        </div>

        {/* Detailed Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Investment Timeline */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Investment Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Days Active:</span>
                <span className="font-semibold text-gray-900">{progress.daysActive} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Days Remaining:</span>
                <span className="font-semibold text-gray-900">{progress.daysRemaining} days</span>
              </div>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Next Payout:</span>
                  <span className="font-semibold text-gray-900">{new Date(progress.nextPayout).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Time:</span>
                  <span className="font-medium text-gray-700">{new Date(progress.nextPayout).toLocaleTimeString()}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Earnings Breakdown */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Earnings Breakdown
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Daily Rate:</span>
                <span className="font-semibold text-gray-900">{(progress.planROI / progress.planDuration).toFixed(2)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Daily Earnings:</span>
                <span className="font-semibold text-green-600">${progress.dailyEarnings.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Earned:</span>
                <span className="font-semibold text-green-600">${progress.totalEarnings.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Projected Total:</span>
                <span className="font-semibold text-blue-600">
                  ${(progress.dailyEarnings * progress.planDuration).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Investment Progress</span>
            <span className="text-sm font-medium text-gray-700">
              {progress.daysActive}/{progress.planDuration} days
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(progress.daysActive / progress.planDuration) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
            />
          </div>
        </div>

        {/* Upgrade Plan Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowUpgradeInterface(true)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Upgrade Plan
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Want to increase your investment? Upgrade to a higher plan for better returns.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvestmentProgressSection;
