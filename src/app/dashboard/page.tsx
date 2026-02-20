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

// Navigation components (keep existing if possible, but redesigning core)
import dynamic from 'next/dynamic';

const DepositSection = dynamic(() => import('@/components/dashboard/DepositSection'));
const WithdrawSection = dynamic(() => import('@/components/dashboard/WithdrawSection'));
const TransferMoneySection = dynamic(() => import('@/components/dashboard/TransferMoneySection'));
const UnifiedLogsSection = dynamic(() => import('@/components/dashboard/UnifiedLogsSection'));
const ProfileSection = dynamic(() => import('@/components/dashboard/ProfileSection'));
const NotificationsSection = dynamic(() => import('@/components/dashboard/NotificationsSection'));
const SupportSection = dynamic(() => import('@/components/dashboard/SupportSection'));

const DashboardContent = () => {
  const { user, userProfile, logout, loading, refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

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
    { id: 'logs', name: 'History', icon: <History className="w-5 h-5" /> },
    { id: 'profile', name: 'Account Info', icon: <User className="w-5 h-5" /> },
    { id: 'support', name: 'Contact Support', icon: <HeadphonesIcon className="w-5 h-5" /> },
  ], []);

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
          <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0b1626] text-white transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-navy-800 flex items-center justify-between">
                <span className="text-2xl font-bold tracking-tighter text-gold-500">RECOVERLY</span>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden"><X className="w-6 h-6" /></button>
              </div>

              <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                {dashboardLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => { setActiveSection(link.id); setIsSidebarOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeSection === link.id ? 'bg-gold-500 text-[#0b1626] shadow-lg shadow-gold-500/20' : 'text-gray-400 hover:bg-navy-800 hover:text-white'}`}
                  >
                    {link.icon}
                    <span className="font-semibold">{link.name}</span>
                  </button>
                ))}
              </nav>

              <div className="p-6 border-t border-navy-800">
                <button onClick={handleLogout} className="flex items-center space-x-3 text-red-400 hover:text-red-300 transition-colors w-full">
                  <LogOut className="w-5 h-5" />
                  <span className="font-semibold">Logout</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Navbar */}
            <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
              <div className="flex items-center space-x-4">
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2"><Menu className="w-6 h-6 text-navy-900" /></button>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-400">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right mr-4 hidden sm:block">
                  <p className="text-xl font-bold text-navy-900">$0</p>
                </div>
                <button className="p-2 text-gray-400 hover:text-navy-900 relative">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-[#c9933a] rounded-full"></span>
                </button>
                <div className="flex items-center space-x-3 p-1 pl-3 bg-gray-50 rounded-full border border-gray-100">
                  <span className="hidden sm:inline font-semibold text-navy-900">User</span>
                  <div className="w-10 h-10 bg-navy-900 text-gold-500 rounded-full flex items-center justify-center font-bold">UU</div>
                </div>
              </div>
            </header>

            {/* Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-20">
              {activeSection === 'dashboard' ? (
                <>
                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Current Balance', value: `$${(userProfile?.balances?.main || 0).toLocaleString()}`, icon: <DollarSign className="text-blue-600" />, bg: 'bg-blue-50' },
                      { label: 'Monthly Income', value: '$0', icon: <ArrowDownUp className="text-green-600" />, bg: 'bg-green-50' },
                      { label: 'Monthly Outgoing', value: '$0', icon: <ArrowUpDown className="text-[#c9933a]" />, bg: 'bg-[#fdfcf0]' },
                      { label: 'Transaction Limit', value: '$500,000.00', icon: <Shield className="text-gold-600" />, bg: 'bg-gold-50' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
                          {stat.icon}
                        </div>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
                        <p className="text-2xl font-bold text-navy-900 mt-1">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Main Overview Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column (2/3) */}
                    <div className="lg:col-span-2 space-y-8">
                      {/* Welcome & Balance */}
                      <div className="bg-[#0b1626] rounded-3xl p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
                          <div>
                            <p className="text-gold-400 font-medium mb-1">Good Morning</p>
                            <h2 className="text-3xl font-bold mb-6">{userProfile?.firstName || 'User'}</h2>
                            <div className="space-y-1">
                              <p className="text-6xl font-black text-white tracking-tighter">${(userProfile?.balances?.main || 0).toFixed(2)} <span className="text-2xl font-medium text-gray-400">USD</span></p>
                              <p className="text-gold-500/80 font-medium flex items-center"><Zap className="w-4 h-4 mr-1" /> Available Balance</p>
                            </div>
                          </div>
                          <div className="mt-8 md:mt-0 text-left md:text-right">
                            <p className="text-gray-400 text-sm mb-1 uppercase tracking-widest">Account Number</p>
                            <p className="text-2xl font-mono font-bold tracking-widest text-white mb-2 decoration-gold-500/50 underline underline-offset-8">9742584063</p>
                            <span className="inline-flex items-center px-3 py-1 bg-[#c9933a]/20 text-[#c9933a] rounded-full text-xs font-bold uppercase tracking-wider border border-[#c9933a]/20">Inactive</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-navy-900">What would you like to do today?</h3>
                        <p className="text-gray-400">Choose from our popular actions below</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {[
                            { label: 'Account Info', icon: <User />, action: () => setActiveSection('profile') },
                            { label: 'Send Money', icon: <Send />, action: () => setActiveSection('transfer') },
                            { label: 'Deposit', icon: <Plus />, action: () => setActiveSection('deposit') },
                            { label: 'History', icon: <History />, action: () => setActiveSection('logs') },
                          ].map((act, i) => (
                            <button key={i} onClick={act.action} className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-gold-500 hover:text-navy-900 group transition-all">
                              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-gold-50 group-hover:text-gold-600 transition-colors">
                                {act.icon}
                              </div>
                              <span className="font-semibold text-gray-500 group-hover:text-navy-900">{act.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Recent Transactions */}
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                          <h3 className="font-bold text-navy-900 text-lg">Recent Transactions</h3>
                          <button onClick={() => setActiveSection('logs')} className="text-gold-600 font-bold text-sm hover:underline">View all</button>
                        </div>
                        <div className="p-12 text-center">
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <History className="text-gray-300 w-8 h-8" />
                          </div>
                          <p className="font-bold text-navy-900">No transactions yet</p>
                          <p className="text-gray-400 text-sm mt-1 mb-6">Your transaction history will appear here</p>
                          <button onClick={() => setActiveSection('deposit')} className="px-6 py-2 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-colors">Make your first deposit</button>
                        </div>
                      </div>
                    </div>

                    {/* Right Column (1/3) */}
                    <div className="space-y-8">
                      {/* Time & Card Section */}
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3 text-navy-900">
                            <Calendar className="w-5 h-5 text-gold-600" />
                            <span className="font-bold uppercase tracking-wider text-xs">{formattedDate.split(',')[0]}</span>
                          </div>
                          <span className="text-2xl font-black text-navy-900">{formattedTime}</span>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-navy-900">Your Cards</h3>
                            <button className="text-gold-600 font-bold text-sm">View all</button>
                          </div>
                          <div className="bg-gray-50 rounded-2xl p-8 border border-dashed border-gray-200 text-center">
                            <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                            <p className="font-bold text-navy-900 text-sm">No cards yet</p>
                            <p className="text-gray-400 text-xs mt-1 mb-4 leading-relaxed">You haven&apos;t applied for any virtual cards yet. Apply for a new card to get started with secure online payments.</p>
                            <button className="w-full py-2 bg-navy-900 text-gold-500 rounded-xl font-bold text-sm hover:bg-navy-800 transition-colors">Apply for Card</button>
                          </div>
                        </div>
                      </div>

                      {/* Account Statistics */}
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="font-bold text-navy-900 mb-6">Account Statistics</h3>
                        <div className="space-y-4">
                          {[
                            { label: 'Transaction Limit', value: '$500,000.00' },
                            { label: 'Pending Transactions', value: '$0.00' },
                            { label: 'Transaction Volume', value: '$0.00' },
                            { label: 'Account Age', value: '1 second' },
                          ].map((stat, i) => (
                            <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                              <span className="text-gray-400 text-sm">{stat.label}</span>
                              <span className="text-navy-900 font-bold">{stat.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quick Transfer Side */}
                      <div className="bg-[#0b1626] rounded-2xl p-6 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full -mr-16 -mt-16 blur-xl"></div>
                        <h3 className="font-bold mb-4 relative z-10">Quick Transfer</h3>
                        <div className="space-y-3 relative z-10">
                          <button onClick={() => setActiveSection('transfer')} className="w-full flex items-center justify-between p-4 bg-navy-800 rounded-xl border border-navy-700 hover:border-gold-500 transition-colors group">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-navy-700 rounded-lg flex items-center justify-center group-hover:bg-gold-500/20 group-hover:text-gold-500 transition-colors">
                                <Globe className="w-5 h-5" />
                              </div>
                              <div className="text-left leading-none">
                                <p className="font-bold text-sm">Local Transfer</p>
                                <p className="text-gold-500 text-[10px] uppercase font-bold mt-1">0% Handling charges</p>
                              </div>
                            </div>
                            <Plus className="w-4 h-4 text-gray-500" />
                          </button>
                          <button onClick={() => setActiveSection('transfer')} className="w-full flex items-center justify-between p-4 bg-navy-800 rounded-xl border border-navy-700 hover:border-gold-500 transition-colors group">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-navy-700 rounded-lg flex items-center justify-center group-hover:bg-gold-500/20 group-hover:text-gold-500 transition-colors">
                                <Zap className="w-5 h-5" />
                              </div>
                              <div className="text-left leading-none">
                                <p className="font-bold text-sm">International Transfer</p>
                                <p className="text-gold-500 text-[10px] uppercase font-bold mt-1">Global reach, 0% fee</p>
                              </div>
                            </div>
                            <Plus className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>

                      {/* Help & Support */}
                      <div className="bg-gold-50 border border-gold-100 rounded-2xl p-6 text-center">
                        <HeadphonesIcon className="w-10 h-10 text-gold-600 mx-auto mb-3" />
                        <h4 className="font-bold text-navy-900">Need Help?</h4>
                        <p className="text-navy-900/60 text-xs mt-1 mb-4 leading-relaxed">Our support team is here to assist you 24/7</p>
                        <button onClick={() => setActiveSection('support')} className="w-full py-2 bg-navy-900 text-gold-500 rounded-xl font-bold text-sm">Contact Support</button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm min-h-[500px]">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-50">
                    <h2 className="text-2xl font-bold text-navy-900 flex items-center">
                      <span className="w-10 h-10 bg-gold-50 text-gold-600 rounded-xl flex items-center justify-center mr-3">
                        {dashboardLinks.find(l => l.id === activeSection)?.icon}
                      </span>
                      {dashboardLinks.find(l => l.id === activeSection)?.name}
                    </h2>
                    <button onClick={() => setActiveSection('dashboard')} className="text-gray-400 hover:text-navy-900 flex items-center text-sm font-bold">
                      <X className="w-4 h-4 mr-1" /> Close
                    </button>
                  </div>
                  {activeSection === 'deposit' && <DepositSection />}
                  {activeSection === 'withdraw' && <WithdrawSection />}
                  {activeSection === 'transfer' && <TransferMoneySection />}
                  {activeSection === 'logs' && <UnifiedLogsSection />}
                  {activeSection === 'profile' && <ProfileSection />}
                  {activeSection === 'support' && <SupportSection />}
                  {activeSection === 'notifications' && <NotificationsSection />}
                </div>
              )}
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
