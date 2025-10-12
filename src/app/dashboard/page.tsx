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
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessAdmin } from '@/utils/adminUtils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLoader from '@/components/DashboardLoader';

// Import dashboard components with dynamic loading
import dynamic from 'next/dynamic';

const DepositSection = dynamic(() => import('@/components/dashboard/DepositSection'), {
  loading: () => <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
});

const WithdrawSection = dynamic(() => import('@/components/dashboard/WithdrawSection'), {
  loading: () => <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
});

const TransferMoneySection = dynamic(() => import('@/components/dashboard/TransferMoneySection'), {
  loading: () => <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
});

const ReferralLogSection = dynamic(() => import('@/components/dashboard/ReferralLogSection'), {
  loading: () => <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
});

const UnifiedLogsSection = dynamic(() => import('@/components/dashboard/UnifiedLogsSection'), {
  loading: () => <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
});

const AdminSection = dynamic(() => import('@/components/dashboard/AdminSection'), {
  loading: () => <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
});

const ProfileSection = dynamic(() => import('@/components/dashboard/ProfileSection'), {
  loading: () => <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
});

const InvestmentPlans = dynamic(() => import('@/components/InvestmentPlans'), {
  loading: () => <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
});

const NotificationsSection = dynamic(() => import('@/components/dashboard/NotificationsSection'), {
  loading: () => <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
});

const SettingsSection = dynamic(() => import('@/components/dashboard/SettingsSection'), {
  loading: () => <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
});

const SupportSection = dynamic(() => import('@/components/dashboard/SupportSection'), {
  loading: () => <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
});

const DashboardContent = () => {
  const { user, userProfile, logout, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const dashboardLinks = [
    { id: 'dashboard', name: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'investment', name: 'Investment', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'deposit', name: 'Deposit', icon: <ArrowDownUp className="w-5 h-5" /> },
    { id: 'withdraw', name: 'Withdraw', icon: <ArrowUpDown className="w-5 h-5" /> },
    { id: 'transfer', name: 'Transfer Money', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'logs', name: 'Transaction Logs', icon: <History className="w-5 h-5" /> },
    { id: 'referral-log', name: 'Referral Log', icon: <Users className="w-5 h-5" /> },
    { id: 'profile', name: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-5 h-5" /> },
    { id: 'support', name: 'Support', icon: <HelpCircle className="w-5 h-5" /> },
    ...(canAccessAdmin(userProfile) ? [{ id: 'admin', name: 'Admin Panel', icon: <Shield className="w-5 h-5" /> }] : [])
  ];

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Handle URL parameters for active section
  useEffect(() => {
    const section = searchParams.get('section');
    if (section && dashboardLinks.some(link => link.id === section)) {
      setActiveSection(section);
    }
  }, [searchParams, dashboardLinks]);

  // Fetch unread notifications count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (userProfile?.userCode) {
        try {
          const response = await fetch(`/api/user-notifications?referralCode=${userProfile.userCode}`);
          const result = await response.json();
          
          if (result.success) {
            const unreadCount = result.data.filter((n: { read: boolean }) => !n.read).length;
            setUnreadNotifications(unreadCount);
          }
        } catch (error) {
          console.error('Error fetching unread notifications:', error);
        }
      }
    };

    fetchUnreadCount();
    // Refresh every 5 minutes (300000ms) instead of 30 seconds
    const interval = setInterval(fetchUnreadCount, 300000);
    return () => clearInterval(interval);
  }, [userProfile?.userCode]);

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('section', sectionId);
    window.history.replaceState({}, '', url.toString());
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // Clear any cached data
      localStorage.clear();
      sessionStorage.clear();
      // Force page refresh to clear everything
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };



  return (
    <ProtectedRoute>
      <DashboardLoader>

        <div className="h-screen bg-gray-50 flex">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`w-64 bg-white shadow-lg flex flex-col fixed lg:relative z-50 h-full transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="p-5 border-b border-gray-200 flex-shrink-0 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-red-600">Tesla Capital</h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent" style={{ direction: 'rtl' }}>
            <nav className="mt-6" style={{ direction: 'ltr' }}>
              {dashboardLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    handleSectionChange(link.id);
                    setIsSidebarOpen(false); // Close sidebar on mobile after selection
                  }}
                  className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors duration-200 ${
                    activeSection === link.id
                      ? 'bg-red-50 text-red-600 border-r-4 border-red-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="relative">
                    {link.icon}
                    {link.id === 'notifications' && unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                      </span>
                    )}
                  </div>
                  <span className="font-medium">{link.name}</span>
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-6 border-t border-gray-200 flex-shrink-0">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center space-x-3 px-6 py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  {/* Mobile Menu Toggle */}
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 capitalize">
                      {dashboardLinks.find(link => link.id === activeSection)?.name || 'Dashboard'}
                    </h2>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setActiveSection('notifications')}
                    className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <Bell className="w-6 h-6" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Email Verification Warning */}
          {!user?.emailVerified && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 border-l-4 border-yellow-400 p-4"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-yellow-700">
                    <strong>Email verification required:</strong> Please verify your email address to access all features and make investments.
                  </p>
                </div>
                <div className="ml-3 flex-shrink-0">
                  <button
                    onClick={() => router.push('/activate-email')}
                    className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Verify Now
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Dashboard Content */}
          <main className="flex-1 overflow-y-auto">
            {activeSection === 'dashboard' && (
              <div>
                {/* Hero Section with Gradient Background - Only on Dashboard */}
                <section className="relative bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 text-white overflow-hidden">
                  <div className="absolute inset-0 bg-black opacity-20"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent"></div>
                  
                  <div className="relative px-4 lg:px-6 py-12 lg:py-16">
                    <div className="max-w-7xl mx-auto">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center space-y-6"
                      >
                        <h1 className="text-3xl lg:text-5xl font-bold leading-tight">
                          Welcome back, <span className="text-red-400">
                            {userProfile?.firstName || 
                             user?.displayName?.split(' ')[0] || 
                             user?.email?.split('@')[0] || 
                             'Investor'}
                          </span>
                        </h1>
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                          Manage your investments and grow your wealth with Tesla Capital&apos;s advanced platform
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </section>

                {/* Account Balance Card */}
                <div className="px-4 lg:px-6 -mt-8 relative z-10">
                  <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Overview</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
                      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 lg:p-6 border border-red-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs lg:text-sm text-red-700 font-medium">Account Balance</p>
                            <p className="text-xl lg:text-3xl font-bold text-red-900">$0.00</p>
                          </div>
                          <div className="bg-red-600 p-2 lg:p-3 rounded-xl">
                            <DollarSign className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 lg:p-6 border border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs lg:text-sm text-green-700 font-medium">Total Deposit</p>
                            <p className="text-xl lg:text-3xl font-bold text-green-900">$0.00</p>
                          </div>
                          <div className="bg-green-600 p-2 lg:p-3 rounded-xl">
                            <ArrowDownUp className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 lg:p-6 border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs lg:text-sm text-blue-700 font-medium">Total Withdraw</p>
                            <p className="text-xl lg:text-3xl font-bold text-blue-900">$0.00</p>
                          </div>
                          <div className="bg-blue-600 p-2 lg:p-3 rounded-xl">
                            <ArrowUpDown className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 lg:p-6 border border-purple-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs lg:text-sm text-purple-700 font-medium">Total Invest</p>
                            <p className="text-xl lg:text-3xl font-bold text-purple-900">$0.00</p>
                          </div>
                          <div className="bg-purple-600 p-2 lg:p-3 rounded-xl">
                            <TrendingUp className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Dashboard Content */}
                <div className="px-4 lg:px-6 py-6 space-y-6">

                {/* Current Plan */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">N/A</p>
                      <p className="text-sm text-gray-600">No active investment plan</p>
                    </div>
                    <button 
                      onClick={() => handleSectionChange('investment')}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Update Plan
                    </button>
                  </div>
                </div>

                {/* Referral Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Referral Program</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600">Your Referral Link</p>
                        <p className="text-sm sm:text-lg font-mono text-gray-900 break-all">
                          https://tesla-capital.com/ref/{userProfile?.userCode || 'loading...'}
                        </p>
                      </div>
                      <button 
                        onClick={async () => {
                          try {
                            const referralLink = `https://tesla-capital.com/ref/${userProfile?.userCode || ''}`;
                            
                            // Check if clipboard API is available
                            if (navigator.clipboard && window.isSecureContext) {
                              await navigator.clipboard.writeText(referralLink);
                            } else {
                              // Fallback for older browsers or non-secure contexts
                              const textArea = document.createElement('textarea');
                              textArea.value = referralLink;
                              textArea.style.position = 'fixed';
                              textArea.style.left = '-999999px';
                              textArea.style.top = '-999999px';
                              document.body.appendChild(textArea);
                              textArea.focus();
                              textArea.select();
                              document.execCommand('copy');
                              textArea.remove();
                            }
                            
                            setCopySuccess(true);
                            setTimeout(() => setCopySuccess(false), 2000);
                          } catch (error) {
                            console.error('Failed to copy link:', error);
                            // Still show success to user even if copy failed
                            setCopySuccess(true);
                            setTimeout(() => setCopySuccess(false), 2000);
                          }
                        }}
                        className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap"
                      >
                        <Copy className="w-4 h-4" />
                        <span>{copySuccess ? 'Copied ✓' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">$0.00</p>
                      <p className="text-sm text-gray-600">Referral Earnings</p>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            )}

            {/* Other Dashboard Pages - Simple Header */}
            {/*activeSection !== 'dashboard' && (
              <div className="px-4 lg:px-6 py-6">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {dashboardLinks.find(link => link.id === activeSection)?.name || 'Dashboard'}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {activeSection === 'investment' && 'Manage your investment portfolio and track performance'}
                    {activeSection === 'deposit' && 'Add funds to your account using various payment methods'}
                    {activeSection === 'withdraw' && 'Withdraw your earnings to your preferred payment method'}
                    {activeSection === 'transfer' && 'Transfer money between accounts'}
                    {activeSection === 'support' && 'Get help and contact our support team'}
                    {activeSection === 'profile' && 'Manage your account settings and personal information'}
                    {activeSection === 'investment-plans' && 'Browse and purchase investment plans'}
                    {activeSection === 'notifications' && 'View your account notifications and updates'}
                    {activeSection === 'settings' && 'Configure your account preferences and security'}
                    {activeSection === 'logs' && 'View all your transaction history in one place'}
                    {activeSection === 'referral-log' && 'Monitor your referral program activity'}
                  </p>
                </div>
              </div>
            )}*/}

            {/* Support Section */}
            {activeSection === 'support' && <SupportSection />}

            {/* Transfer Money Section */}
            {activeSection === 'transfer' && <TransferMoneySection />}

            {/* Investment Section */}
            {activeSection === 'investment' && (
              <div className="px-4 lg:px-6 py-6">
                <InvestmentPlans isDashboard={true} />
              </div>
            )}

            {/* Deposit Section */}
            {activeSection === 'deposit' && <DepositSection />}

            {/* Withdraw Section */}
            {activeSection === 'withdraw' && <WithdrawSection />}

            {/* Transaction Logs */}
            {activeSection === 'logs' && <UnifiedLogsSection />}

            {/* Referral Log */}
            {activeSection === 'referral-log' && <ReferralLogSection />}

            {/* Profile Settings Section */}
            {activeSection === 'profile' && <ProfileSection />}


            {/* Notifications Section */}
            {activeSection === 'notifications' && <NotificationsSection />}

            {/* Settings Section */}
            {activeSection === 'settings' && <SettingsSection />}

            {/* 2FA Section */}

            {/* Admin Section */}
            {activeSection === 'admin' && <AdminSection />}

            {/* Other sections */}
            {!['dashboard', 'support', 'transfer', 'investment', 'deposit', 'withdraw', 'logs', 'referral-log', 'profile', 'investment-plans', 'notifications', 'settings', 'admin'].includes(activeSection) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {dashboardLinks.find(link => link.id === activeSection)?.name}
                </h3>
                <p className="text-gray-600">This feature is coming soon!</p>
              </div>
            )}
          </main>
        </div>
      </div>
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
                <p className="text-sm text-gray-600">Are you sure you want to logout?</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoggingOut && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      </DashboardLoader>
    </ProtectedRoute>
  );
};

const DashboardPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
};

export default DashboardPage;
