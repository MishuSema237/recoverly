'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Plus,
  Edit,
  Trash2,
  Search,
  Shield,
  UserCheck,
  RefreshCw,
  Ban,
  CheckCircle,
  XCircle,
  Bell,
  Mail,
  Phone,
  MapPin,
  Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { showSuccess, showError } from '@/utils/toast';
import { canAccessAdmin } from '@/utils/adminUtils';
import { PlanService, InvestmentPlan } from '@/lib/services/PlanService';
// Note: UserService is server-side only, we'll use API calls instead

interface PaymentMethod {
  _id?: string;
  name: string;
  logo: string;
  accountDetails: {
    accountName: string;
    accountNumber: string;
    bankName?: string;
    walletAddress?: string;
    network?: string;
  };
  instructions: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AdminUser {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  emailVerified: boolean;
  userCode: string;
  isAdmin: boolean;
  isActive: boolean;
  profilePicture?: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: string;
  totalInvested: number;
  currentInvestment: number;
  investmentPlan?: string;
  totalDeposit: number;
  totalWithdraw: number;
  referralEarnings: number;
  referredBy?: string;
  referredByCode?: string;
  balances?: {
    main: number;
    investment: number;
    referral: number;
    total: number;
  };
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  activityLog?: Array<{
    action: string;
    timestamp: string;
  }>;
}

interface DepositRequest {
  _id?: string;
  userId: string;
  paymentMethodId: string;
  amount: number;
  screenshot: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
}

interface WithdrawalRequest {
  _id?: string;
  userId: string;
  paymentMethodId: string;
  amount: number;
  accountDetails: {
    accountName: string;
    accountNumber: string;
    bankName?: string;
    walletAddress?: string;
    network?: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  processedBy?: string;
  processedAt?: Date;
  rejectionReason?: string;
}

const AdminSection = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'plans' | 'payments' | 'transactions' | 'notifications'>('users');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Notification states
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationType, setNotificationType] = useState<'broadcast' | 'individual'>('broadcast');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationDetails, setNotificationDetails] = useState('');
  const [notificationFiles, setNotificationFiles] = useState<File[]>([]);
  const [selectedUsersForNotification, setSelectedUsersForNotification] = useState<string[]>([]);
  const [sendingNotification, setSendingNotification] = useState(false);
  
  // User detail states
  const [showUserDetailModal, setShowUserDetailModal] = useState(false);
  const [userDetailData, setUserDetailData] = useState<AdminUser | null>(null);
  const [userIndividualMessage, setUserIndividualMessage] = useState('');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<InvestmentPlan | null>(null);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);
  const [newPlan, setNewPlan] = useState<Partial<InvestmentPlan>>({});
  const [newPayment, setNewPayment] = useState<Partial<PaymentMethod>>({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isProcessingPlan, setIsProcessingPlan] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Transaction modal states
  const [selectedTransaction, setSelectedTransaction] = useState<DepositRequest | WithdrawalRequest | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransactionType, setSelectedTransactionType] = useState<'deposits' | 'withdrawals'>('deposits');
  const [rejectionReason, setRejectionReason] = useState('');
  const [depositFilter, setDepositFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [withdrawalFilter, setWithdrawalFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'rejected'>('all');
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'deletePlan' | 'deleteUser' | 'deletePayment';
    id: string;
    name: string;
  } | null>(null);

  // MongoDB services
  const planService = new PlanService();

  // Check if user is admin
  const isAdmin = canAccessAdmin(userProfile);

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

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch('/api/users');
      const result = await response.json();
      if (result.success) {
        setUsers(result.data);
      } else {
        console.error('Error loading users:', result.error);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const loadPlans = useCallback(async () => {
    setLoadingPlans(true);
    try {
      const mongoPlans = await planService.getAllPlans();
      // Convert MongoDB plans to component format
      const formattedPlans = mongoPlans.map(plan => ({
        _id: plan._id || '',
        id: plan._id || '',
        name: plan.name,
        minAmount: plan.minAmount,
        maxAmount: plan.maxAmount,
        duration: plan.duration,
        roi: plan.roi,
        capitalBack: plan.capitalBack,
        color: plan.color,
        gradient: plan.gradient,
        icon: plan.icon,
        isActive: plan.isActive
      }));
      setPlans(formattedPlans);
    } catch (error) {
      console.error('Error loading plans:', error);
      // Set empty array if both MongoDB and fallback fail
      setPlans([]);
    } finally {
      setLoadingPlans(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
      loadPlans();
      loadPaymentMethods();
      loadTransactions();
    }
  }, [isAdmin, loadUsers, loadPlans]);



  const loadPaymentMethods = async () => {
    setLoadingPayments(true);
    try {
      const response = await fetch('/api/payment-methods');
      const result = await response.json();
      
      if (result.success) {
        setPaymentMethods(result.data);
      } else {
        console.error('Error loading payment methods:', result.error);
        setPaymentMethods([]);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
      setPaymentMethods([]);
    } finally {
      setLoadingPayments(false);
    }
  };

  const loadTransactions = async () => {
    setIsLoadingTransactions(true);
    try {
      // Load deposit requests
      const depositsResponse = await fetch('/api/transactions?type=deposits');
      const depositsResult = await depositsResponse.json();
      
      if (depositsResult.success) {
        setDepositRequests(depositsResult.data);
      }
      
      // Load withdrawal requests
      const withdrawalsResponse = await fetch('/api/transactions?type=withdrawals');
      const withdrawalsResult = await withdrawalsResponse.json();
      
      if (withdrawalsResult.success) {
        setWithdrawalRequests(withdrawalsResult.data);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      showError('Failed to load transactions');
    } finally {
      setIsLoadingTransactions(false);
    }
  };



  const getUserInfo = (userId: string) => {
    const user = users.find(u => u._id === userId);
    return user ? {
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
      userCode: user.userCode || 'N/A',
      userId: user._id || 'N/A',
      email: user.email || 'N/A'
    } : {
      name: 'Unknown User',
      userCode: 'N/A',
      userId: userId,
      email: 'N/A'
    };
  };

  const getFilteredDeposits = () => {
    if (depositFilter === 'all') return depositRequests;
    return depositRequests.filter(deposit => deposit.status === depositFilter);
  };

  const getFilteredWithdrawals = () => {
    if (withdrawalFilter === 'all') return withdrawalRequests;
    return withdrawalRequests.filter(withdrawal => withdrawal.status === withdrawalFilter);
  };

  const updateTransactionStatus = async (transactionId: string, type: 'deposit' | 'withdrawal', status: string, rejectionReason?: string) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          _id: transactionId,
          type,
          status,
          rejectionReason,
          approvedBy: user?._id,
          approvedAt: new Date(),
          userId: selectedTransaction?.userId,
          amount: selectedTransaction?.amount
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        showSuccess(`Transaction ${status} successfully!`);
        loadTransactions();
      } else {
        showError(result.error || 'Failed to update transaction');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      showError('An error occurred while updating the transaction');
    }
  };

  const updateUser = async (userId: string, updates: Partial<AdminUser>) => {
    try {
      const success = await userService.updateUser(userId, updates);
      if (success) {
        setMessage({ type: 'success', text: 'User updated successfully' });
        loadUsers();
      } else {
        setMessage({ type: 'error', text: 'Failed to update user' });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setMessage({ type: 'error', text: 'Failed to update user' });
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    await updateUser(userId, { isActive });
  };

  const makeAdmin = async (userId: string, isAdmin: boolean) => {
    await updateUser(userId, { isAdmin });
  };

  const handleDeletePlan = (planId: string, planName: string) => {
    setConfirmAction({ type: 'deletePlan', id: planId, name: planName });
    setShowConfirmModal(true);
  };


  const handleDeletePayment = (paymentId: string, paymentName: string) => {
    setConfirmAction({ type: 'deletePayment', id: paymentId, name: paymentName });
    setShowConfirmModal(true);
  };

  const executeDeleteAction = async () => {
    if (!confirmAction) return;

    setIsDeleting(true);
    try {
      switch (confirmAction.type) {
        case 'deletePlan':
          const success = await planService.deletePlan(confirmAction.id);
          if (success) {
            setMessage({ type: 'success', text: 'Plan deleted successfully' });
            loadPlans();
          } else {
            setMessage({ type: 'error', text: 'Failed to delete plan' });
          }
          break;
        
        case 'deleteUser':
          const deleteSuccess = await userService.deleteUser(confirmAction.id);
          if (deleteSuccess) {
            setMessage({ type: 'success', text: 'User deleted successfully' });
            loadUsers();
          } else {
            setMessage({ type: 'error', text: 'Failed to delete user' });
          }
          break;
        
        case 'deletePayment':
          const response = await fetch(`/api/payment-methods?id=${confirmAction.id}`, {
            method: 'DELETE'
          });
          const result = await response.json();
          
          if (result.success) {
            setMessage({ type: 'success', text: 'Payment method deleted successfully' });
            loadPaymentMethods();
          } else {
            setMessage({ type: 'error', text: result.error || 'Failed to delete payment method' });
          }
          break;
      }
    } catch (error) {
      console.error('Error deleting:', error);
      setMessage({ type: 'error', text: 'Failed to delete item' });
    } finally {
      setIsDeleting(false);
      setShowConfirmModal(false);
      setConfirmAction(null);
    }
  };

  const savePlan = async () => {
    setIsProcessingPlan(true);
    try {
      // Validate required fields
      if (!newPlan.name || !newPlan.minAmount || !newPlan.maxAmount || !newPlan.roi || !newPlan.duration || !newPlan.icon) {
        setMessage({ type: 'error', text: 'Please fill in all required fields including icon' });
        setIsProcessingPlan(false);
        return;
      }

      if (editingPlan && editingPlan._id) {
        console.log('Updating plan with ID:', editingPlan._id);
        // Update existing plan in MongoDB
        const success = await planService.updatePlan(editingPlan._id, {
          name: newPlan.name!,
          minAmount: newPlan.minAmount!,
          maxAmount: newPlan.maxAmount!,
          duration: newPlan.duration!,
          roi: newPlan.roi!,
          capitalBack: newPlan.capitalBack || false,
          color: newPlan.color || 'blue',
          icon: newPlan.icon!,
          isActive: newPlan.isActive !== false,
          updatedBy: userProfile?.email || 'admin'
        });
        
        if (success) {
          setMessage({ type: 'success', text: 'Plan updated successfully' });
        } else {
          setMessage({ type: 'error', text: 'Failed to update plan' });
        }
      } else {
        console.log('Creating new plan - editingPlan:', editingPlan);
        // Create new plan in MongoDB
        const newMongoPlan = await planService.createPlan({
          name: newPlan.name!,
          minAmount: newPlan.minAmount!,
          maxAmount: newPlan.maxAmount!,
          duration: newPlan.duration!,
          roi: newPlan.roi!,
          capitalBack: newPlan.capitalBack || false,
          color: newPlan.color || 'blue',
          icon: newPlan.icon!,
          isActive: newPlan.isActive !== false,
          createdBy: userProfile?.email || 'admin'
        });
        
        if (newMongoPlan) {
          setMessage({ type: 'success', text: 'Plan created successfully' });
        } else {
          setMessage({ type: 'error', text: 'Failed to create plan' });
        }
      }
      setShowPlanModal(false);
      setEditingPlan(null);
      setNewPlan({});
      loadPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      setMessage({ type: 'error', text: 'Failed to save plan' });
    } finally {
      setIsProcessingPlan(false);
    }
  };


  const savePaymentMethod = async () => {
    setIsProcessingPayment(true);
    try {
      // Validate required fields
      if (!newPayment.name || !newPayment.logo || !newPayment.accountDetails?.accountName || !newPayment.accountDetails?.accountNumber || !newPayment.instructions) {
        setMessage({ type: 'error', text: 'Please fill in all required fields' });
        setIsProcessingPayment(false);
        return;
      }

      const paymentData = {
        name: newPayment.name,
        logo: newPayment.logo,
        accountDetails: newPayment.accountDetails,
        instructions: newPayment.instructions,
        isActive: newPayment.isActive !== false
      };

      if (editingPayment) {
        // Update existing payment method
        const response = await fetch('/api/payment-methods', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            _id: editingPayment._id,
            ...paymentData
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          setMessage({ type: 'success', text: 'Payment method updated successfully' });
          loadPaymentMethods();
          setShowPaymentModal(false);
          setEditingPayment(null);
          setNewPayment({});
        } else {
          setMessage({ type: 'error', text: result.error || 'Failed to update payment method' });
        }
      } else {
        // Create new payment method
        const response = await fetch('/api/payment-methods', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(paymentData)
        });
        
        const result = await response.json();
        
        if (result.success) {
          setMessage({ type: 'success', text: 'Payment method created successfully' });
          loadPaymentMethods();
          setShowPaymentModal(false);
          setNewPayment({});
        } else {
          setMessage({ type: 'error', text: result.error || 'Failed to create payment method' });
        }
      }
    } catch (error) {
      console.error('Error saving payment method:', error);
      setMessage({ type: 'error', text: 'An error occurred while saving the payment method' });
    } finally {
      setIsProcessingPayment(false);
    }
  };


  // Notification functions
  const sendNotification = async () => {
    if (!notificationMessage.trim() || !notificationTitle.trim()) return;
    
    setSendingNotification(true);
    try {
      // Upload files first if any
      const attachments = [];
      for (const file of notificationFiles) {
        const formData = new FormData();
        formData.append('file', file);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        const uploadResult = await uploadResponse.json();
        if (uploadResult.success) {
          attachments.push(uploadResult.data);
        }
      }

      const notificationData = {
        title: notificationTitle,
        message: notificationMessage,
        details: notificationDetails,
        type: notificationType,
        recipients: notificationType === 'broadcast' ? 'all' : selectedUsersForNotification,
        sentBy: user?.uid,
        attachments: attachments.length > 0 ? attachments : undefined
      };

      // Save notification to MongoDB via API
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notificationData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Reset form
        setNotificationMessage('');
        setNotificationTitle('');
        setNotificationDetails('');
        setNotificationFiles([]);
        setSelectedUsersForNotification([]);
        setShowNotificationModal(false);
        
        showSuccess('Notification sent successfully!');
      } else {
        showError('Failed to send notification: ' + result.error);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      showError('Failed to send notification');
    } finally {
      setSendingNotification(false);
    }
  };

  const openUserDetail = async (user: AdminUser) => {
    setUserDetailData(user);
    setShowUserDetailModal(true);
    
    // Load additional user data
    try {
      // Load user's financial data, transactions, etc.
      const userDetail = {
        ...user,
        balances: {
          main: 0, // This would come from your database
          investment: 0,
          referral: 0,
          total: 0
        },
        transactions: [], // Load from database
        activityLog: [
          {
            action: 'Account Created',
            timestamp: user.createdAt ? (typeof user.createdAt === 'string' ? user.createdAt : user.createdAt.toISOString()) : new Date().toISOString(),
            details: 'User account was created'
          }
        ]
      };
      setUserDetailData(userDetail);
    } catch (error) {
      console.error('Error loading user details:', error);
    }
  };

  const sendUserNotification = async (userReferralCode: string, message: string) => {
    if (!message.trim()) return;
    
    setIsSendingMessage(true);
    
    try {
      const notificationData = {
        message,
        type: 'individual',
        recipients: [userReferralCode], // Using referral code instead of userId
        sentBy: user?.uid
      };

      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notificationData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setUserIndividualMessage('');
        showSuccess('Message sent successfully!');
      } else {
        showError('Failed to send message: ' + result.error);
      }
    } catch (error) {
      console.error('Error sending user notification:', error);
      showError('Failed to send message');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You don&apos;t have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            <p className="text-red-100">Manage users, plans, and payment methods</p>
          </div>
          <Shield className="w-12 h-12 text-red-200" />
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Admin Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
            { id: 'plans', label: 'Investment Plans', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'payments', label: 'Payment Methods', icon: <CreditCard className="w-4 h-4" /> },
            { id: 'transactions', label: 'Transactions', icon: <DollarSign className="w-4 h-4" /> },
            { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'users' | 'plans' | 'payments' | 'transactions' | 'notifications')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {isOffline && (
                  <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <span className="text-sm font-medium">Offline</span>
                  </div>
                )}
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                onClick={loadUsers}
                disabled={loadingUsers}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loadingUsers ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                ) : (
                  <RefreshCw className="h-4 w-4 mr-1" />
                )}
                Refresh
              </button>
            </div>

            {loadingUsers ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map(user => (
                  <div
                    key={user._id || user.uid}
                    className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => openUserDetail(user)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {user.firstName?.[0] || user.email?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                          <div className="text-xs text-gray-500 font-mono">{user.userCode}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {user.isActive !== false ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        {user.isAdmin && <Shield className="w-4 h-4 text-yellow-600" />}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Email:</span>
                        <span className="text-sm text-gray-900">{user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Balance:</span>
                        <span className="text-sm font-semibold text-gray-900">${user.totalInvested?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Plan:</span>
                        <span className="text-sm text-gray-900">{user.investmentPlan || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleUserStatus(user._id || user.uid, user.isActive === false);
                        }}
                        className={`flex-1 px-3 py-1 rounded text-xs font-medium transition-colors duration-200 flex items-center justify-center space-x-1 ${
                          user.isActive !== false 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {user.isActive !== false ? <Ban className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                        <span>{user.isActive !== false ? 'Disable' : 'Enable'}</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          makeAdmin(user._id || user.uid, !user.isAdmin);
                        }}
                        className={`flex-1 px-3 py-1 rounded text-xs font-medium transition-colors duration-200 flex items-center justify-center space-x-1 ${
                          user.isAdmin 
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                            : 'bg-gray-600 hover:bg-gray-700 text-white'
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        <span>{user.isAdmin ? 'Admin' : 'User'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Broadcast Notification */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Bell className="w-5 h-5 text-red-600" />
                  <h4 className="text-lg font-semibold text-gray-900">Broadcast Message</h4>
                </div>
                <p className="text-gray-600 mb-4">Send a message to all users</p>
                <button
                  onClick={() => {
                    setNotificationType('broadcast');
                    setShowNotificationModal(true);
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Send to All Users
                </button>
              </div>

              {/* Individual Notification */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-900">Individual Message</h4>
                </div>
                <p className="text-gray-600 mb-4">Send a message to specific users</p>
                <button
                  onClick={() => {
                    setNotificationType('individual');
                    setShowNotificationModal(true);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Send to Selected Users
                </button>
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Notifications</h4>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-gray-500 text-center">No notifications sent yet</p>
              </div>
            </div>
          </div>
        )}

        {/* Investment Plans Tab */}
        {activeTab === 'plans' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold text-gray-900">Investment Plans</h3>
                {isOffline && (
                  <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <span className="text-sm font-medium">Offline</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setEditingPlan(null);
                  setShowPlanModal(true);
                }}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Plan</span>
              </button>
            </div>

            {loadingPlans ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map(plan => (
                <div key={plan._id || `plan-${Math.random()}`} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          console.log('Edit button clicked for plan:', plan);
                          setEditingPlan(plan);
                          setNewPlan(plan);
                          setShowPlanModal(true);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan._id || '', plan.name)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Min:</span> ${plan.minAmount.toLocaleString()}</p>
                    <p><span className="font-medium">Max:</span> ${plan.maxAmount.toLocaleString()}</p>
                    <p><span className="font-medium">ROI:</span> {plan.roi}%</p>
                    <p><span className="font-medium">Duration:</span> {plan.duration}</p>
                    <p><span className="font-medium">Capital Back:</span> {plan.capitalBack ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="mt-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* Payment Methods Tab */}
        {activeTab === 'payments' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
                {isOffline && (
                  <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <span className="text-sm font-medium">Offline</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setEditingPayment(null);
                  setShowPaymentModal(true);
                }}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Payment Method</span>
              </button>
            </div>

            {loadingPayments ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paymentMethods.map(method => (
                <div key={method._id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">{method.name}</h4>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingPayment(method);
                          setNewPayment(method);
                          setShowPaymentModal(true);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => method._id && handleDeletePayment(method._id, method.name)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Account Number:</span> {method.accountDetails?.accountNumber || 'N/A'}</p>
                    {method.accountDetails?.bankName && (
                      <p><span className="font-medium">Bank:</span> {method.accountDetails.bankName}</p>
                    )}
                    {method.accountDetails?.network && (
                      <p><span className="font-medium">Network:</span> {method.accountDetails.network}</p>
                    )}
                  </div>
                  <div className="mt-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      method.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {method.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Transaction Management</h3>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={loadTransactions}
                  disabled={isLoadingTransactions}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg"
                >
                  {isLoadingTransactions ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span>{isLoadingTransactions ? 'Loading...' : 'Refresh'}</span>
                </button>
              </div>
            </div>

            {/* Transaction Type Toggle */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setSelectedTransactionType('deposits')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  selectedTransactionType === 'deposits'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Deposits ({getFilteredDeposits().length})
              </button>
              <button
                onClick={() => setSelectedTransactionType('withdrawals')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  selectedTransactionType === 'withdrawals'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Withdrawals ({getFilteredWithdrawals().length})
              </button>
            </div>

            {/* Filter Options */}
            <div className="mb-6">
              {selectedTransactionType === 'deposits' ? (
                <div className="flex space-x-2">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setDepositFilter(filter)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        depositFilter === filter
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex space-x-2">
                  {(['all', 'pending', 'processing', 'completed', 'rejected'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setWithdrawalFilter(filter)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        withdrawalFilter === filter
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Transaction Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedTransactionType === 'deposits' ? (
                getFilteredDeposits().map((deposit) => (
                  <div
                    key={deposit._id}
                    className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedTransaction(deposit);
                      setShowTransactionModal(true);
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-600">Deposit</span>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        deposit.status === 'approved' ? 'bg-green-100 text-green-800' :
                        deposit.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {deposit.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Amount:</span>
                        <span className="text-sm font-semibold text-gray-900">${deposit.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">User:</span>
                        <div className="text-sm text-gray-900 text-right">
                          <div className="font-medium">{getUserInfo(deposit.userId).name}</div>
                          <div className="text-xs text-gray-500">Code: {getUserInfo(deposit.userId).userCode}</div>
                          <div className="text-xs text-gray-400">ID: {getUserInfo(deposit.userId).userId}</div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Date:</span>
                        <span className="text-sm text-gray-900">{new Date(deposit.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-center">
                      <span className="text-xs text-gray-500">Click for details</span>
                    </div>
                  </div>
                ))
              ) : (
                getFilteredWithdrawals().map((withdrawal) => (
                  <div
                    key={withdrawal._id}
                    className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedTransaction(withdrawal);
                      setShowTransactionModal(true);
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-600">Withdrawal</span>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        withdrawal.status === 'completed' ? 'bg-green-100 text-green-800' :
                        withdrawal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        withdrawal.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {withdrawal.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Amount:</span>
                        <span className="text-sm font-semibold text-gray-900">${withdrawal.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">User:</span>
                        <div className="text-sm text-gray-900 text-right">
                          <div className="font-medium">{getUserInfo(withdrawal.userId).name}</div>
                          <div className="text-xs text-gray-500">Code: {getUserInfo(withdrawal.userId).userCode}</div>
                          <div className="text-xs text-gray-400">ID: {getUserInfo(withdrawal.userId).userId}</div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Date:</span>
                        <span className="text-sm text-gray-900">{new Date(withdrawal.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-center">
                      <span className="text-xs text-gray-500">Click for details</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* No transactions message */}
            {((selectedTransactionType === 'deposits' && getFilteredDeposits().length === 0) || 
              (selectedTransactionType === 'withdrawals' && getFilteredWithdrawals().length === 0)) && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <CreditCard className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No {selectedTransactionType} found</h3>
                <p className="text-gray-500">There are no {selectedTransactionType} requests with the current filter.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingPlan ? 'Edit Plan' : 'Add New Plan'}
                </h3>
                <button
                  onClick={() => {
                    setShowPlanModal(false);
                    setEditingPlan(null);
                    setNewPlan({});
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
                  <input
                    type="text"
                    value={newPlan.name || ''}
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., Silver, Gold, Platinum"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Amount ($)</label>
                    <input
                      type="number"
                      value={newPlan.minAmount || ''}
                      onChange={(e) => setNewPlan({ ...newPlan, minAmount: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Amount ($)</label>
                    <input
                      type="number"
                      value={newPlan.maxAmount || ''}
                      onChange={(e) => setNewPlan({ ...newPlan, maxAmount: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="9999"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ROI (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newPlan.roi || ''}
                      onChange={(e) => setNewPlan({ ...newPlan, roi: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <input
                      type="text"
                      value={newPlan.duration || ''}
                      onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="30 days"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <select
                      value={newPlan.color || ''}
                      onChange={(e) => setNewPlan({ ...newPlan, color: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Select Color</option>
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                      <option value="purple">Purple</option>
                      <option value="gold">Gold</option>
                      <option value="red">red</option>
                      <option value="cyan">Cyan</option>
                      <option value="orange">Orange</option>
                      <option value="pink">Pink</option>
                      <option value="indigo">Indigo</option>
                      <option value="teal">Teal</option>
                      <option value="lime">Lime</option>
                      <option value="amber">Amber</option>
                      <option value="emerald">Emerald</option>
                      <option value="rose">Rose</option>
                      <option value="violet">Violet</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                    <select
                      value={newPlan.icon || ''}
                      onChange={(e) => setNewPlan({ ...newPlan, icon: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Select Icon</option>
                      <option value="star">Star</option>
                      <option value="diamond">Diamond</option>
                      <option value="crown">Crown</option>
                      <option value="rocket">Rocket</option>
                      <option value="trending-up">Trending Up</option>
                      <option value="zap">Lightning</option>
                      <option value="shield">Shield</option>
                      <option value="gem">Gem</option>
                      <option value="trophy">Trophy</option>
                      <option value="medal">Medal</option>
                      <option value="target">Target</option>
                      <option value="flame">Flame</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gradient (Optional)</label>
                  <select
                    value={newPlan.gradient || ''}
                    onChange={(e) => setNewPlan({ ...newPlan, gradient: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select Gradient</option>
                    <option value="blue-to-purple">Blue to Purple</option>
                    <option value="green-to-blue">Green to Blue</option>
                    <option value="purple-to-pink">Purple to Pink</option>
                    <option value="red-to-orange">Red to Orange</option>
                    <option value="gold-to-amber">Gold to Amber</option>
                    <option value="cyan-to-blue">Cyan to Blue</option>
                    <option value="pink-to-rose">Pink to Rose</option>
                    <option value="indigo-to-purple">Indigo to Purple</option>
                    <option value="emerald-to-teal">Emerald to Teal</option>
                    <option value="orange-to-red">Orange to Red</option>
                    <option value="rose-to-pink">Rose to Pink</option>
                    <option value="violet-to-purple">Violet to Purple</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="capitalBack"
                    checked={newPlan.capitalBack || false}
                    onChange={(e) => setNewPlan({ ...newPlan, capitalBack: e.target.checked })}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="capitalBack" className="text-sm font-medium text-gray-700">
                    Capital Back
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={newPlan.isActive !== false}
                    onChange={(e) => setNewPlan({ ...newPlan, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowPlanModal(false);
                    setEditingPlan(null);
                    setNewPlan({});
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={savePlan}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                  disabled={isProcessingPlan}
                >
                  {isProcessingPlan && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <span>{isProcessingPlan ? 'Saving...' : (editingPlan ? 'Update Plan' : 'Create Plan')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingPayment ? 'Edit Payment Method' : 'Add New Payment Method'}
                </h3>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setEditingPayment(null);
                    setNewPayment({});
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Method Name</label>
                  <input
                    type="text"
                    value={newPayment.name || ''}
                    onChange={(e) => setNewPayment({ ...newPayment, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., Bank Transfer, Bitcoin, Ethereum"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                  <input
                    type="url"
                    value={newPayment.logo || ''}
                    onChange={(e) => setNewPayment({ ...newPayment, logo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                  <input
                    type="text"
                    value={newPayment.accountDetails?.accountName || ''}
                    onChange={(e) => setNewPayment({ 
                      ...newPayment, 
                      accountDetails: { 
                        accountName: e.target.value,
                        accountNumber: newPayment.accountDetails?.accountNumber || '',
                        bankName: newPayment.accountDetails?.bankName || '',
                        walletAddress: newPayment.accountDetails?.walletAddress || '',
                        network: newPayment.accountDetails?.network || ''
                      } 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Account holder name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Number/Address</label>
                  <input
                    type="text"
                    value={newPayment.accountDetails?.accountNumber || ''}
                    onChange={(e) => setNewPayment({ 
                      ...newPayment, 
                      accountDetails: { 
                        accountName: newPayment.accountDetails?.accountName || '',
                        accountNumber: e.target.value,
                        bankName: newPayment.accountDetails?.bankName || '',
                        walletAddress: newPayment.accountDetails?.walletAddress || '',
                        network: newPayment.accountDetails?.network || ''
                      } 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Account number or wallet address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name (Optional)</label>
                  <input
                    type="text"
                    value={newPayment.accountDetails?.bankName || ''}
                    onChange={(e) => setNewPayment({ 
                      ...newPayment, 
                      accountDetails: { 
                        accountName: newPayment.accountDetails?.accountName || '',
                        accountNumber: newPayment.accountDetails?.accountNumber || '',
                        bankName: e.target.value,
                        walletAddress: newPayment.accountDetails?.walletAddress || '',
                        network: newPayment.accountDetails?.network || ''
                      } 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Bank name (for bank transfers)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Network (Optional)</label>
                  <input
                    type="text"
                    value={newPayment.accountDetails?.network || ''}
                    onChange={(e) => setNewPayment({ 
                      ...newPayment, 
                      accountDetails: { 
                        accountName: newPayment.accountDetails?.accountName || '',
                        accountNumber: newPayment.accountDetails?.accountNumber || '',
                        bankName: newPayment.accountDetails?.bankName || '',
                        walletAddress: newPayment.accountDetails?.walletAddress || '',
                        network: e.target.value
                      } 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Network (e.g., Ethereum, BSC, Polygon)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
                  <textarea
                    value={newPayment.instructions || ''}
                    onChange={(e) => setNewPayment({ ...newPayment, instructions: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={4}
                    placeholder="Instructions for users on how to make deposits using this method"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="paymentActive"
                    checked={newPayment.isActive !== false}
                    onChange={(e) => setNewPayment({ ...newPayment, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="paymentActive" className="text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setEditingPayment(null);
                    setNewPayment({});
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={savePaymentMethod}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <span>{isProcessingPayment ? 'Saving...' : (editingPayment ? 'Update Payment Method' : 'Create Payment Method')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-gray-900">&ldquo;{confirmAction?.name}&rdquo;</span>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {confirmAction?.type === 'deletePlan' && 'This will permanently remove the investment plan.'}
                {confirmAction?.type === 'deleteUser' && 'This will permanently remove the user account.'}
                {confirmAction?.type === 'deletePayment' && 'This will permanently remove the payment method.'}
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmAction(null);
                }}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={executeDeleteAction}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isDeleting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {notificationType === 'broadcast' ? 'Send Broadcast Message' : 'Send Individual Message'}
            </h3>
            
            {notificationType === 'individual' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Users</label>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
                  {users.map(user => (
                    <label key={user._id || user.uid} className="flex items-center space-x-2 p-2 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={selectedUsersForNotification.includes(user.userCode)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsersForNotification([...selectedUsersForNotification, user.userCode]);
                          } else {
                            setSelectedUsersForNotification(selectedUsersForNotification.filter(code => code !== user.userCode));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{user.firstName} {user.lastName} ({user.userCode})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                placeholder="Enter notification title..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
              <textarea
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                placeholder="Enter your message here..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={4}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Details (Optional)</label>
              <textarea
                value={notificationDetails}
                onChange={(e) => setNotificationDetails(e.target.value)}
                placeholder="Enter additional details..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Attachments (Optional)</label>
              <input
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    setNotificationFiles(Array.from(e.target.files));
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                accept="image/*,.pdf,.doc,.docx,.txt,.zip"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: Images, PDF, DOC, DOCX, TXT, ZIP (Max 10MB each)
              </p>
              {notificationFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Selected files:</p>
                  <ul className="text-sm text-gray-600">
                    {notificationFiles.map((file, index) => (
                      <li key={index}>• {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowNotificationModal(false);
                  setNotificationMessage('');
                  setNotificationTitle('');
                  setNotificationDetails('');
                  setNotificationFiles([]);
                  setSelectedUsersForNotification([]);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={sendNotification}
                disabled={sendingNotification || !notificationMessage.trim() || !notificationTitle.trim() || (notificationType === 'individual' && selectedUsersForNotification.length === 0)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {sendingNotification && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{sendingNotification ? 'Sending...' : 'Send'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {showUserDetailModal && userDetailData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">User Details</h3>
                <button
                  onClick={() => setShowUserDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Information */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Name:</span>
                        <span className="font-medium">{userDetailData?.firstName} {userDetailData?.lastName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="font-medium">{userDetailData?.email}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          userDetailData?.emailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {userDetailData?.emailVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Phone:</span>
                        <span className="font-medium">{userDetailData?.phone || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Location:</span>
                        <span className="font-medium">{userDetailData.location || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Referral Code:</span>
                        <span className="font-medium">{userDetailData.userCode}</span>
                      </div>
                    </div>
                  </div>

                  {/* Account Balances */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Account Balances</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Main Balance:</span>
                        <span className="font-medium">${userDetailData.balances?.main || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Investment Balance:</span>
                        <span className="font-medium">${userDetailData.balances?.investment || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Referral Balance:</span>
                        <span className="font-medium">${userDetailData.balances?.referral || 0}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-sm font-semibold text-gray-900">Total Balance:</span>
                        <span className="font-bold text-red-600">${userDetailData.balances?.total || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction Logs and Activity */}
                <div className="space-y-4">
                  {/* Send Message */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Send Message</h4>
                    <div className="space-y-3">
                      <textarea
                        value={userIndividualMessage}
                        onChange={(e) => setUserIndividualMessage(e.target.value)}
                        placeholder="Type your message here..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        rows={3}
                      />
                        <button
                          onClick={() => sendUserNotification(userDetailData.userCode, userIndividualMessage)}
                          disabled={!userIndividualMessage.trim() || isSendingMessage}
                          className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          {isSendingMessage && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          )}
                          <span>{isSendingMessage ? 'Sending...' : 'Send Message'}</span>
                        </button>
                    </div>
                  </div>

                  {/* Activity Log */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Activity Log</h4>
                    <div className="space-y-2">
                      {userDetailData?.activityLog?.map((activity: { action: string; timestamp: string }, index: number) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <Activity className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{activity.action}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500">{new Date(activity.timestamp).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Transaction Detail Modal */}
      {showTransactionModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedTransactionType === 'deposits' ? 'Deposit' : 'Withdrawal'} Details
                </h3>
                <button
                  onClick={() => {
                    setShowTransactionModal(false);
                    setSelectedTransaction(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Transaction Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <div className="text-lg font-semibold text-gray-900">${selectedTransaction.amount}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      selectedTransaction.status === 'approved' || selectedTransaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      selectedTransaction.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      selectedTransaction.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedTransaction.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">{getUserInfo(selectedTransaction.userId).name}</div>
                      <div className="text-xs text-gray-500 font-mono">Code: {getUserInfo(selectedTransaction.userId).userCode}</div>
                      <div className="text-xs text-gray-500 font-mono">ID: {getUserInfo(selectedTransaction.userId).userId}</div>
                      <div className="text-xs text-gray-500 font-mono">Email: {getUserInfo(selectedTransaction.userId).email}</div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <div className="text-sm text-gray-900">{new Date(selectedTransaction.createdAt).toLocaleString()}</div>
                  </div>
                </div>

                {/* Payment Method Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method ID</label>
                  <div className="text-sm text-gray-900 font-mono">{selectedTransaction.paymentMethodId}</div>
                </div>

                {/* Screenshot for deposits */}
                {selectedTransactionType === 'deposits' && selectedTransaction && 'screenshot' in selectedTransaction && selectedTransaction.screenshot && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Screenshot</label>
                    <img 
                      src={selectedTransaction.screenshot} 
                      alt="Payment Screenshot" 
                      className="w-full max-w-md h-auto rounded border"
                    />
                  </div>
                )}

                {/* Account Details for withdrawals */}
                {selectedTransactionType === 'withdrawals' && selectedTransaction && 'accountDetails' in selectedTransaction && selectedTransaction.accountDetails && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Details</label>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div><span className="font-medium">Account Name:</span> {selectedTransaction.accountDetails.accountName}</div>
                      <div><span className="font-medium">Account Number:</span> <span className="font-mono break-all">{selectedTransaction.accountDetails.accountNumber}</span></div>
                      {selectedTransaction.accountDetails.bankName && (
                        <div><span className="font-medium">Bank:</span> {selectedTransaction.accountDetails.bankName}</div>
                      )}
                      {selectedTransaction.accountDetails.network && (
                        <div><span className="font-medium">Network:</span> {selectedTransaction.accountDetails.network}</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-4 pt-4 border-t">
                  {/* Rejection Reason Input */}
                  {selectedTransaction.status === 'pending' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason (if rejecting)</label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        rows={3}
                        placeholder="Enter reason for rejection (optional)"
                      />
                    </div>
                  )}

                  <div className="flex space-x-4">
                    {selectedTransaction.status === 'pending' && (
                      <>
                        {selectedTransactionType === 'deposits' ? (
                          <>
                            <button
                              onClick={() => {
                                if (selectedTransaction._id) {
                                  updateTransactionStatus(selectedTransaction._id, 'deposit', 'approved');
                                }
                                setShowTransactionModal(false);
                                setSelectedTransaction(null);
                                setRejectionReason('');
                              }}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                if (selectedTransaction._id) {
                                  updateTransactionStatus(selectedTransaction._id, 'deposit', 'rejected', rejectionReason);
                                }
                                setShowTransactionModal(false);
                                setSelectedTransaction(null);
                                setRejectionReason('');
                              }}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                if (selectedTransaction._id) {
                                  updateTransactionStatus(selectedTransaction._id, 'withdrawal', 'processing');
                                }
                                setShowTransactionModal(false);
                                setSelectedTransaction(null);
                                setRejectionReason('');
                              }}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                            >
                              Process
                            </button>
                            <button
                              onClick={() => {
                                if (selectedTransaction._id) {
                                  updateTransactionStatus(selectedTransaction._id, 'withdrawal', 'rejected', rejectionReason);
                                }
                                setShowTransactionModal(false);
                                setSelectedTransaction(null);
                                setRejectionReason('');
                              }}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </>
                    )}
                    
                    {selectedTransactionType === 'withdrawals' && selectedTransaction.status === 'processing' && (
                      <button
                        onClick={() => {
                          if (selectedTransaction._id) {
                            updateTransactionStatus(selectedTransaction._id, 'withdrawal', 'completed');
                          }
                          setShowTransactionModal(false);
                          setSelectedTransaction(null);
                          setRejectionReason('');
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
                      >
                        Complete
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        setShowTransactionModal(false);
                        setSelectedTransaction(null);
                        setRejectionReason('');
                      }}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSection;
