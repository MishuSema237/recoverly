'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Settings,
  LogOut,
  Bell,
  BarChart3,
  History,
  AlertCircle,
  ArrowUpDown,
  ArrowDownUp,
  Users,
  Menu,
  X,
  Copy,
  CreditCard,
  User,
  HelpCircle,
  Shield,
  ShieldCheck,
  Zap,
  MoreVertical,
  Plus,
  Send,
  PieChart,
  Globe,
  HeadphonesIcon,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessAdmin } from '@/utils/adminUtils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense, useMemo } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLoader from '@/components/DashboardLoader';
import { AnimatePresence } from 'framer-motion';

// Navigation components (keep existing if possible, but redesigning core)
import dynamic from 'next/dynamic';

const DepositSection = dynamic(() => import('@/components/dashboard/DepositSection'));
const WithdrawSection = dynamic(() => import('@/components/dashboard/WithdrawSection'));
const TransferMoneySection = dynamic(() => import('@/components/dashboard/TransferMoneySection'));
const UnifiedLogsSection = dynamic(() => import('@/components/dashboard/UnifiedLogsSection'));
const ProfileSection = dynamic(() => import('@/components/dashboard/ProfileSection'));
const NotificationsSection = dynamic(() => import('@/components/dashboard/NotificationsSection'));
const SupportSection = dynamic(() => import('@/components/dashboard/SupportSection'));
const KYCSection = dynamic(() => import('@/components/dashboard/KYCSection'));
const AdminSection = dynamic(() => import('@/components/dashboard/AdminSection'));

const DashboardContent = () => {
  const { user, userProfile, logout, loading, refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [statIndex, setStatIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStatIndex((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const dashboardLinks = useMemo(() => [
    { id: 'dashboard', name: 'Overview', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'transfer', name: 'Send Money', icon: <Send className="w-5 h-5" /> },
    { id: 'deposit', name: 'Deposit', icon: <ArrowDownUp className="w-5 h-5" /> },
    { id: 'withdraw', name: 'Withdrawal', icon: <ArrowUpDown className="w-5 h-5" /> },
    { id: 'logs', name: 'History', icon: <History className="w-5 h-5" /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'kyc', name: 'Identity Verification', icon: <Shield className="w-5 h-5" /> },
    { id: 'profile', name: 'Account Info', icon: <User className="w-5 h-5" /> },
    { id: 'support', name: 'Contact Support', icon: <HeadphonesIcon className="w-5 h-5" /> },
    ...(canAccessAdmin(userProfile) ? [{ id: 'admin', name: 'Administration', icon: <ShieldCheck className="w-5 h-5" /> }] : []),
  ], [userProfile]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/');
    } catch (e) { console.error(e); }
  };

  return (
    <ProtectedRoute>
      <DashboardLoader>
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
          {/* Sidebar */}
          <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0b1626] text-white transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} hidden lg:block`}>
            <div className="flex flex-col h-full">
              <div className="p-4 mobile:p-6 border-b border-navy-800 flex items-center justify-between">
                <span className="text-xl mobile:text-2xl font-bold tracking-tighter text-gold-500">RECOVERLY</span>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden"><X className="w-5 h-5 mobile:w-6 mobile:h-6" /></button>
              </div>

              <nav className="flex-1 px-3 mobile:px-4 py-4 mobile:py-8 space-y-1 mobile:space-y-2 overflow-y-auto">
                {dashboardLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => { setActiveSection(link.id); setIsSidebarOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-3.5 mobile:px-4 py-2.5 mobile:py-3 rounded-xl transition-all ${activeSection === link.id ? 'bg-gold-500 text-[#0b1626] shadow-lg shadow-gold-500/20' : 'text-gray-400 hover:bg-navy-800 hover:text-white'}`}
                  >
                    <span className="scale-90 mobile:scale-100">{link.icon}</span>
                    <span className="text-sm mobile:text-base font-semibold">{link.name}</span>
                  </button>
                ))}
              </nav>

              <div className="p-4 mobile:p-6 border-t border-navy-800">
                <button onClick={handleLogout} className="flex items-center space-x-3 text-red-400 hover:text-red-300 transition-colors w-full">
                  <LogOut className="w-4 h-4 mobile:w-5 mobile:h-5" />
                  <span className="text-sm mobile:text-base font-semibold">Logout</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Navbar */}
            <header className="h-16 mobile:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 mobile:px-6 shrink-0">
              <div className="flex items-center space-x-4">
                {/* Mobile menu toggle removed in favor of Bottom Nav */}
                <div className="lg:hidden w-2" />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-400">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right mr-4 hidden sm:block">
                  <p className="text-lg mobile:text-xl font-bold text-navy-900">$0</p>
                </div>
                <button
                  onClick={() => setActiveSection('notifications')}
                  className="p-2 text-gray-400 hover:text-navy-900 relative"
                >
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-[#c9933a] rounded-full"></span>
                </button>
                <div className="flex items-center space-x-3 p-1 pl-3 bg-gray-50 rounded-full border border-gray-100">
                  <span className="hidden sm:inline font-semibold text-navy-900">User</span>
                  <div className="w-8 h-8 mobile:w-10 mobile:h-10 bg-navy-900 text-gold-500 rounded-full flex items-center justify-center font-bold text-xs mobile:text-sm">UU</div>
                </div>
              </div>
            </header>

            {/* Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-3.5 mobile:p-6 space-y-4 mobile:space-y-8 pb-20">
              {activeSection === 'dashboard' ? (
                <>
                  {/* Top Stats Cards Removed per request - replaced by slideshow in Welcome section */}

                  {/* Main Overview Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column (2/3) */}
                    <div className="lg:col-span-2 space-y-4 mobile:space-y-8">
                      {/* Welcome & Balance */}
                      <div className="bg-[#0b1626] rounded-2xl mobile:rounded-3xl p-5 mobile:p-8 text-white relative overflow-hidden min-h-[300px] mobile:min-h-[350px] flex flex-col justify-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center w-full">
                          <div className="w-full md:w-auto text-center md:text-left">
                            <p className="text-gold-400 font-medium mb-0.5 mobile:mb-1 text-sm mobile:text-base">Good Morning,</p>
                            <h2 className="text-2xl mobile:text-3xl font-bold mb-4 mobile:mb-8">{userProfile?.firstName || 'User'}</h2>

                            <div className="relative h-24 overflow-hidden">
                              <AnimatePresence mode="wait">
                                {statIndex === 0 && (
                                  <motion.div
                                    key="balance"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="absolute inset-0 flex flex-col justify-center md:items-start items-center"
                                  >
                                    <p className="text-3xl mobile:text-5xl lg:text-5xl xl:text-6xl font-black text-white tracking-tighter break-words">
                                      ${(userProfile?.balances?.main || 0).toFixed(2)} <span className="text-lg mobile:text-2xl font-medium text-gray-400">USD</span>
                                    </p>
                                    <p className="text-gold-500/80 font-medium flex items-center text-xs mobile:text-sm">Available Balance</p>
                                  </motion.div>
                                )}
                                {statIndex === 1 && (
                                  <motion.div
                                    key="income"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="absolute inset-0 flex flex-col justify-center md:items-start items-center"
                                  >
                                    <p className="text-3xl mobile:text-5xl lg:text-5xl xl:text-6xl font-black text-white tracking-tighter break-words">
                                      $0.00 <span className="text-lg mobile:text-2xl font-medium text-gray-400">USD</span>
                                    </p>
                                    <p className="text-green-400/80 font-medium flex items-center text-xs mobile:text-sm">Monthly Income</p>
                                  </motion.div>
                                )}
                                {statIndex === 2 && (
                                  <motion.div
                                    key="outgoing"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="absolute inset-0 flex flex-col justify-center md:items-start items-center"
                                  >
                                    <p className="text-3xl mobile:text-5xl lg:text-5xl xl:text-6xl font-black text-white tracking-tighter break-words">
                                      $0.00 <span className="text-lg mobile:text-2xl font-medium text-gray-400">USD</span>
                                    </p>
                                    <p className="text-red-400/80 font-medium flex items-center text-xs mobile:text-sm">Monthly Outgoing</p>
                                  </motion.div>
                                )}
                                {statIndex === 3 && (
                                  <motion.div
                                    key="limit"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="absolute inset-0 flex flex-col justify-center md:items-start items-center"
                                  >
                                    <p className="text-3xl mobile:text-5xl lg:text-5xl xl:text-6xl font-black text-white tracking-tighter break-words">
                                      $500,000.00 <span className="text-lg mobile:text-2xl font-medium text-gray-400">USD</span>
                                    </p>
                                    <p className="text-blue-400/80 font-medium flex items-center text-xs mobile:text-sm">Transaction Limit</p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                          <div className="mt-8 md:mt-0 text-center md:text-right border-t md:border-t-0 border-white/10 pt-6 md:pt-0 w-full md:w-auto">
                            <p className="text-gray-400 text-[10px] mobile:text-sm mb-0.5 mobile:mb-1 uppercase tracking-widest">User Code</p>
                            <p className="text-xl mobile:text-2xl font-mono font-bold tracking-widest text-white mb-2 decoration-gold-500/50 underline underline-offset-4 mobile:underline-offset-8 uppercase">{userProfile?.userCode || 'RECOVERLY_USER'}</p>
                            <button
                              onClick={() => setActiveSection('kyc')}
                              className="inline-flex items-center px-2 py-0.5 mobile:px-3 mobile:py-1 bg-gold-500/20 text-gold-500 rounded-full text-[10px] mobile:text-xs font-bold uppercase tracking-wider border border-gold-500/20 hover:bg-gold-500/30 transition-colors"
                            >
                              {userProfile?.kycStatus === 'verified' ? 'Verified Account' : 'Action Required'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="space-y-3 mobile:space-y-4">
                        <h3 className="text-lg mobile:text-xl font-bold text-navy-900">What would you like to do today?</h3>
                        <p className="text-sm mobile:text-base text-gray-400">Choose from our popular actions below</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mobile:gap-4">
                          {[
                            { label: 'Account Info', icon: <User className="w-5 h-5 mobile:w-6 mobile:h-6" />, action: () => setActiveSection('profile') },
                            { label: 'Send Money', icon: <Send className="w-5 h-5 mobile:w-6 mobile:h-6" />, action: () => setActiveSection('transfer') },
                            { label: 'Deposit', icon: <Plus className="w-5 h-5 mobile:w-6 mobile:h-6" />, action: () => setActiveSection('deposit') },
                            { label: 'History', icon: <History className="w-5 h-5 mobile:w-6 mobile:h-6" />, action: () => setActiveSection('logs') },
                          ].map((act, i) => (
                            <button key={i} onClick={act.action} className="flex flex-col items-center justify-center p-4 mobile:p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-gold-500 hover:text-navy-900 group transition-all">
                              <div className="w-10 h-10 mobile:w-12 mobile:h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-2 mobile:mb-3 group-hover:bg-gold-50 group-hover:text-gold-600 transition-colors">
                                {act.icon}
                              </div>
                              <span className="text-xs mobile:text-sm font-semibold text-gray-500 group-hover:text-navy-900">{act.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Recent Transactions */}
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="p-4 mobile:p-6 border-b border-gray-50 flex justify-between items-center">
                          <h3 className="font-bold text-navy-900 text-base mobile:text-lg">Recent Transactions</h3>
                          <button onClick={() => setActiveSection('logs')} className="text-gold-600 font-bold text-xs mobile:text-sm hover:underline">View all</button>
                        </div>
                        <div className="p-8 mobile:p-12 text-center">
                          <div className="w-12 h-12 mobile:w-16 mobile:h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 mobile:mb-4">
                            <History className="text-gray-300 w-6 h-6 mobile:w-8 mobile:h-8" />
                          </div>
                          <p className="font-bold text-navy-900 text-sm mobile:text-base">No transactions yet</p>
                          <p className="text-gray-400 text-xs mobile:text-sm mt-1 mb-4 mobile:mb-6">Your transaction history will appear here</p>
                          <button onClick={() => setActiveSection('deposit')} className="px-5 py-2 mobile:px-6 mobile:py-2 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-colors text-sm mobile:text-base">Make your first deposit</button>
                        </div>
                      </div>
                    </div>

                    {/* Right Column (1/3) */}
                    <div className="space-y-4 mobile:space-y-8">
                      {/* Time & Card Section */}
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mobile:p-6 space-y-4 mobile:space-y-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2 mobile:space-x-3 text-navy-900">
                            <Calendar className="w-4 h-4 mobile:w-5 mobile:h-5 text-gold-600" />
                            <span className="font-bold uppercase tracking-wider text-[10px] mobile:text-xs">{formattedDate.split(',')[0]}</span>
                          </div>
                          <span className="text-xl mobile:text-2xl font-black text-navy-900">{formattedTime}</span>
                        </div>

                        <div className="pt-4 mobile:pt-6 border-t border-gray-100">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-navy-900 text-sm mobile:text-base">Asset Overview</h3>
                            <PieChart className="w-4 h-4 text-gold-600" />
                          </div>
                          <div className="flex flex-col items-center">
                            {/* Simple SVG Pie Chart */}
                            <div className="relative w-40 h-40">
                              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                {/* Main Balance - Always visible if > 0 */}
                                <circle
                                  cx="50" cy="50" r="40"
                                  fill="transparent"
                                  stroke="#0b1626"
                                  strokeWidth="12"
                                  strokeDasharray="251.2"
                                  strokeDashoffset={(userProfile?.balances?.main || 0) > 0 ? "0" : "251.2"}
                                  className="transition-all duration-1000"
                                />
                                {/* Example Investment slice (mock data for visualization) */}
                                <circle
                                  cx="50" cy="50" r="40"
                                  fill="transparent"
                                  stroke="#c9933a"
                                  strokeWidth="12"
                                  strokeDasharray="251.2"
                                  strokeDashoffset="180"
                                  className="transition-all duration-1000"
                                />
                                {/* Example Referral slice */}
                                <circle
                                  cx="50" cy="50" r="40"
                                  fill="transparent"
                                  stroke="#3b82f6"
                                  strokeWidth="12"
                                  strokeDasharray="251.2"
                                  strokeDashoffset="240"
                                  className="transition-all duration-1000"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-black text-navy-900 leading-none">
                                  {Math.round(((userProfile?.balances?.main || 0) / (userProfile?.balances?.total || 1)) * 100)}%
                                </span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase">Main</span>
                              </div>
                            </div>

                            <div className="mt-6 w-full space-y-2">
                              <div className="flex items-center justify-between text-[11px] font-bold">
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 bg-[#0b1626] rounded-sm"></div>
                                  <span className="text-gray-500 uppercase">Main Wallet</span>
                                </div>
                                <span className="text-navy-900">${(userProfile?.balances?.main || 0).toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between text-[11px] font-bold">
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 bg-[#c9933a] rounded-sm"></div>
                                  <span className="text-gray-500 uppercase">Investment</span>
                                </div>
                                <span className="text-navy-900">${(userProfile?.balances?.investment || 0).toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between text-[11px] font-bold">
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                                  <span className="text-gray-500 uppercase">Referral</span>
                                </div>
                                <span className="text-navy-900">${(userProfile?.balances?.referral || 0).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Account Statistics */}
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mobile:p-6">
                        <h3 className="font-bold text-navy-900 mb-4 mobile:mb-6 text-sm mobile:text-base">Account Statistics</h3>
                        <div className="space-y-3 mobile:space-y-4">
                          {[
                            { label: 'Transaction Limit', value: '$500,000.00' },
                            { label: 'Pending Transactions', value: '$0.00' },
                            { label: 'Transaction Volume', value: '$0.00' },
                            { label: 'Account Age', value: '1 second' },
                          ].map((stat, i) => (
                            <div key={i} className="flex justify-between items-center py-2.5 mobile:py-3 border-b border-gray-50 last:border-0">
                              <span className="text-gray-400 text-xs mobile:text-sm">{stat.label}</span>
                              <span className="text-navy-900 font-bold text-xs mobile:text-sm">{stat.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quick Transfer Side */}
                      <div className="bg-[#0b1626] rounded-2xl p-4 mobile:p-6 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full -mr-16 -mt-16 blur-xl"></div>
                        <h3 className="font-bold mb-3 mobile:mb-4 relative z-10 text-sm mobile:text-base">Quick Transfer</h3>
                        <div className="space-y-2.5 mobile:space-y-3 relative z-10">
                          <button onClick={() => setActiveSection('transfer')} className="w-full flex items-center justify-between p-3 mobile:p-4 bg-navy-800 rounded-xl border border-navy-700 hover:border-gold-500 transition-colors group">
                            <div className="flex items-center space-x-2.5 mobile:space-x-3">
                              <div className="w-9 h-9 mobile:w-10 mobile:h-10 bg-navy-700 rounded-lg flex items-center justify-center group-hover:bg-gold-500/20 group-hover:text-gold-500 transition-colors">
                                <Globe className="w-4 h-4 mobile:w-5 mobile:h-5" />
                              </div>
                              <div className="text-left leading-tight">
                                <p className="font-bold text-xs mobile:text-sm">Local Transfer</p>
                                <p className="text-gold-500 text-[8px] mobile:text-[10px] uppercase font-bold mt-0.5 mobile:mt-1">0% Handling charges</p>
                              </div>
                            </div>
                            <Plus className="w-3.5 h-3.5 mobile:w-4 mobile:h-4 text-gray-500" />
                          </button>
                          <button onClick={() => setActiveSection('transfer')} className="w-full flex items-center justify-between p-3 mobile:p-4 bg-navy-800 rounded-xl border border-navy-700 hover:border-gold-500 transition-colors group">
                            <div className="flex items-center space-x-2.5 mobile:space-x-3">
                              <div className="w-9 h-9 mobile:w-10 mobile:h-10 bg-navy-700 rounded-lg flex items-center justify-center group-hover:bg-gold-500/20 group-hover:text-gold-500 transition-colors">
                                <Zap className="w-4 h-4 mobile:w-5 mobile:h-5" />
                              </div>
                              <div className="text-left leading-tight">
                                <p className="font-bold text-xs mobile:text-sm">International Transfer</p>
                                <p className="text-gold-500 text-[8px] mobile:text-[10px] uppercase font-bold mt-0.5 mobile:mt-1">Global reach, 0% fee</p>
                              </div>
                            </div>
                            <Plus className="w-3.5 h-3.5 mobile:w-4 mobile:h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>

                      {/* Help & Support */}
                      <div className="bg-gold-50 border border-gold-100 rounded-2xl p-4 mobile:p-6 text-center">
                        <HeadphonesIcon className="w-8 h-8 mobile:w-10 mobile:h-10 text-gold-600 mx-auto mb-2 mobile:mb-3" />
                        <h4 className="font-bold text-navy-900 text-sm mobile:text-base">Need Help?</h4>
                        <p className="text-navy-900/60 text-[10px] mobile:text-xs mt-1 mb-3 mobile:mb-4 leading-relaxed">Our support team is here to assist you 24/7</p>
                        <button onClick={() => setActiveSection('support')} className="w-full py-2 bg-navy-900 text-gold-500 rounded-xl font-bold text-xs mobile:text-sm">Contact Support</button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-3xl p-5 mobile:p-8 border border-gray-100 shadow-sm min-h-[500px]">
                  <div className="flex items-center justify-between mb-6 mobile:mb-8 pb-4 mobile:pb-6 border-b border-gray-50">
                    <h2 className="text-xl mobile:text-2xl font-bold text-navy-900 flex items-center">
                      <span className="w-8 h-8 mobile:w-10 mobile:h-10 bg-gold-50 text-gold-600 rounded-lg mobile:rounded-xl flex items-center justify-center mr-2.5 mobile:mr-3 scale-90 mobile:scale-100">
                        {dashboardLinks.find(l => l.id === activeSection)?.icon}
                      </span>
                      {dashboardLinks.find(l => l.id === activeSection)?.name}
                    </h2>
                    <button onClick={() => setActiveSection('dashboard')} className="text-gray-400 hover:text-navy-900 flex items-center text-xs mobile:text-sm font-bold">
                      <X className="w-3.5 h-3.5 mobile:w-4 mobile:h-4 mr-1" /> Close
                    </button>
                  </div>
                  {activeSection === 'deposit' && <DepositSection />}
                  {activeSection === 'withdraw' && <WithdrawSection />}
                  {activeSection === 'transfer' && <TransferMoneySection />}
                  {activeSection === 'logs' && <UnifiedLogsSection />}
                  {activeSection === 'profile' && <ProfileSection />}
                  {activeSection === 'support' && <SupportSection />}
                  {activeSection === 'notifications' && <NotificationsSection />}
                  {activeSection === 'admin' && <AdminSection />}
                </div>
              )}
            </div>

            {/* Bottom Nav for Mobile */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[92vw] max-w-[400px]">
              <div className="bg-[#0b1626]/95 backdrop-blur-xl border border-navy-800 rounded-full p-2 flex items-center justify-between shadow-2xl">
                {[
                  { id: 'dashboard', icon: <BarChart3 className="w-5 h-5" />, name: 'Home' },
                  { id: 'transfer', icon: <Send className="w-5 h-5" />, name: 'Send' },
                  { id: 'deposit', icon: <ArrowDownUp className="w-5 h-5" />, name: 'Deposit' },
                  { id: 'withdraw', icon: <ArrowUpDown className="w-5 h-5" />, name: 'Withdraw' },
                  ...(canAccessAdmin(userProfile) ? [{ id: 'admin', icon: <ShieldCheck className="w-5 h-5" />, name: 'Admin' }] : [{ id: 'profile', icon: <User className="w-5 h-5" />, name: 'Account' }]),
                ].map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => setActiveSection(link.id)}
                      className={`flex items-center transition-all duration-500 ease-out group ${isActive
                        ? 'bg-gold-500 text-[#0b1626] rounded-full pr-4 pl-1.5 py-1.5'
                        : 'text-gray-400 p-3 hover:text-white'
                        }`}
                    >
                      <div className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-300 ${isActive ? 'bg-[#0b1626] text-gold-500 shadow-sm' : 'bg-transparent'
                        }`}>
                        {link.icon}
                      </div>
                      {isActive && (
                        <motion.span
                          initial={{ opacity: 0, width: 0, x: -10 }}
                          animate={{ opacity: 1, width: 'auto', x: 0 }}
                          className="ml-2 font-black text-[10px] uppercase tracking-tighter"
                        >
                          {link.name}
                        </motion.span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </main>
        </div>
      </DashboardLoader>
    </ProtectedRoute>
  );
};

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0b1626]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gold-500 font-bold tracking-widest uppercase text-xs">Recoverly Secure Login...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
