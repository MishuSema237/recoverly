'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, User, LogOut, Bell, Shield, Scale } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const { user, userProfile, logout, loading } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch(`/api/user-notifications?referralCode=${userProfile?.userCode}`);
      const result = await response.json();
      if (result.success) {
        const unreadNotifications = result.data.filter((notification: { read: boolean }) => !notification.read);
        setUnreadCount(unreadNotifications.length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [userProfile?.userCode]);

  useEffect(() => {
    if (userProfile?.userCode) {
      fetchNotifications();
      const interval = setInterval(() => {
        fetchNotifications();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [userProfile?.userCode, fetchNotifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: notificationId, read: true })
      });
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Asset Recovery', href: '/asset-recovery' },
    { name: 'Banking', href: '/banking' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-navy-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/RecoverlyLogo.png"
                alt="Recoverly Trust Bank"
                width={200}
                height={50}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden mobile:flex space-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-semibold transition-all duration-200 ${isActive
                    ? 'text-navy-700 border-b-2 border-gold-500'
                    : 'text-gray-600 hover:text-navy-600 hover:border-b-2 hover:border-navy-200'
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Auth Buttons / User Menu */}
          <div className="hidden mobile:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-navy-700 hover:text-gold-600 px-3 py-2 rounded-lg hover:bg-navy-50 transition-colors duration-200 text-sm font-medium"
                >
                  Dashboard
                </Link>

                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 hover:text-navy-600 hover:bg-navy-50 rounded-lg transition-colors duration-200"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <NotificationDropdown
                      userReferralCode={userProfile?.userCode || ''}
                      isOpen={showNotifications}
                      onClose={() => setShowNotifications(false)}
                      unreadCount={unreadCount}
                      onMarkAsRead={handleMarkAsRead}
                    />
                  )}
                </div>

                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-navy-600 px-3 py-2 rounded-lg hover:bg-navy-50 transition-colors duration-200"
                  >
                    <div className="w-9 h-9 bg-navy-700 rounded-full flex items-center justify-center text-white font-semibold text-sm border-2 border-gold-400">
                      {userProfile?.firstName?.[0] || user.email?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-navy-800">
                      {userProfile?.firstName || 'Client'}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100 bg-navy-50">
                        <p className="text-sm font-bold text-navy-900">
                          {userProfile?.firstName} {userProfile?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="flex items-center space-x-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-navy-600"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Client Dashboard</span>
                      </Link>
                      <button
                        onClick={() => {
                          setShowLogoutModal(true);
                          setShowUserMenu(false);
                        }}
                        className="flex items-center space-x-2 px-4 py-3 text-sm text-[#c9933a] hover:bg-[#fdfcf0] w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Secure Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-navy-700 hover:text-navy-900 px-4 py-2 font-medium transition-colors duration-200"
                >
                  Client Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-navy-700 hover:bg-navy-800 text-white px-5 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg border border-transparent hover:border-gold-500/30"
                >
                  Open Account
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          {!loading && (
            <div className="mobile:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-navy-700 hover:text-gold-600 p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mobile:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100 shadow-lg mb-4 rounded-b-xl">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-3 text-base font-medium rounded-md transition-colors duration-200 ${isActive
                      ? 'text-navy-800 bg-navy-50 border-l-4 border-gold-500'
                      : 'text-gray-600 hover:text-navy-600 hover:bg-gray-50'
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <div className="pt-4 pb-3 border-t border-gray-200 mt-2">
                {user ? (
                  <div className="space-y-3 px-2">
                    <div className="px-3 py-3 bg-navy-50 rounded-lg border border-navy-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-navy-700 rounded-full flex items-center justify-center text-white font-semibold border border-gold-400">
                          {userProfile?.firstName?.[0] || user.email?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-navy-900">
                            {userProfile?.firstName} {userProfile?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5 text-gold-600" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        setShowLogoutModal(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-3 text-[#c9933a] hover:bg-[#fdfcf0] rounded-lg text-base font-medium w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3 px-2">
                    <Link
                      href="/login"
                      className="border-2 border-navy-200 text-navy-700 hover:bg-navy-50 px-4 py-3 rounded-lg text-base font-medium text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Client Login
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-navy-700 hover:bg-navy-800 text-white px-4 py-3 rounded-lg text-base font-bold text-center shadow-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Start A Claim / Open Account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 border border-navy-100">
            <div className="flex items-center space-x-4 mb-5">
              <div className="w-12 h-12 bg-[#fdfcf0] rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#c9933a]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-navy-900">Secure Logout</h3>
                <p className="text-sm text-gray-500">End your secure session?</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-3 bg-navy-700 hover:bg-navy-800 text-white rounded-lg font-medium transition-colors shadow-lg flex items-center justify-center space-x-2"
              >
                {isLoggingOut && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{isLoggingOut ? 'Ending Session...' : 'Logout Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
