'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Shield,
  UserCheck,
  RefreshCw,
  Ban,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bell,
  Send,
  Mail,
  Phone,
  MapPin,
  Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessAdmin } from '@/utils/adminUtils';
import { 
  collection, 
  query, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { PlanService, InvestmentPlan } from '@/lib/services/PlanService';
import { UserService, User } from '@/lib/services/UserService';

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

interface AdminUser extends User {
  location?: string;
  balances?: {
    main: number;
    investment: number;
    referral: number;
    total: number;
  };
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
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  
  // Notification states
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationType, setNotificationType] = useState<'broadcast' | 'individual'>('broadcast');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationDetails, setNotificationDetails] = useState('');
  const [notificationFiles, setNotificationFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
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
  const [confirmAction, setConfirmAction] = useState<{
    type: 'deletePlan' | 'deleteUser' | 'deletePayment';
    id: string;
    name: string;
  } | null>(null);
  const [isSyncingUsers, setIsSyncingUsers] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    mongoUserCount: number;
    firestoreUserCount: number;
    needsSync: boolean;
  } | null>(null);

  // MongoDB services
  const planService = new PlanService();
  const userService = new UserService();

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

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
      loadPlans();
      loadPaymentMethods();
      loadTransactions();
      checkSyncStatus();
    }
  }, [isAdmin]);

  const checkSyncStatus = async () => {
    try {
      const response = await fetch('/api/users/sync-firestore');
      const result = await response.json();
      if (result.success) {
        setSyncStatus(result.data);
      }
    } catch (error) {
      console.error('Error checking sync status:', error);
    }
  };

  const syncUsersFromFirestore = async () => {
    setIsSyncingUsers(true);
    try {
      const response = await fetch('/api/users/sync-firestore', {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: `Successfully synced ${result.totalUsers} users from Firestore to MongoDB` 
        });
        // Reload users after sync
        await loadUsers();
        await checkSyncStatus();
      } else {
        setMessage({ 
          type: 'error', 
          text: result.error || 'Failed to sync users' 
        });
      }
    } catch (error) {
      console.error('Error syncing users:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to sync users from Firestore' 
      });
    } finally {
      setIsSyncingUsers(false);
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const mongoUsers = await userService.getAllUsers();
      setUsers(mongoUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadPlans = async () => {
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
  };

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
    }
  };

  const syncAllUsers = async () => {
    try {
      const response = await fetch('/api/users/sync-all', {
        method: 'POST'
      });
      const result = await response.json();
      
      if (result.success) {
        alert(`Successfully synced ${result.results.length} users!`);
        loadUsers();
      } else {
        alert('Failed to sync users: ' + result.error);
      }
    } catch (error) {
      console.error('Error syncing all users:', error);
      alert('Failed to sync users');
    }
  };

  const clearDefaultPaymentMethods = async () => {
    try {
      const response = await fetch('/api/payment-methods/clear-defaults', {
        method: 'POST'
      });
      const result = await response.json();
      
      if (result.success) {
        alert(`Cleared ${result.deletedCount} default payment methods`);
        loadPaymentMethods();
      } else {
        alert('Failed to clear payment methods: ' + result.error);
      }
    } catch (error) {
      console.error('Error clearing payment methods:', error);
      alert('Failed to clear payment methods');
    }
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
          approvedBy: user?.uid,
          approvedAt: new Date()
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Transaction status updated successfully');
        loadTransactions();
      } else {
        alert('Failed to update transaction: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Failed to update transaction');
    }
  };

  const updateUser = async (userId: string, updates: Partial<User>) => {
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
        setUploadedFiles([]);
        setSelectedUsersForNotification([]);
        setShowNotificationModal(false);
        
        alert('Notification sent successfully!');
      } else {
        alert('Failed to send notification: ' + result.error);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification');
    } finally {
      setSendingNotification(false);
    }
  };

  const openUserDetail = async (user: User) => {
    setSelectedUser(user);
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
            timestamp: user.createdAt ? user.createdAt.toISOString() : new Date().toISOString(),
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
        alert('Message sent successfully!');
      } else {
        alert('Failed to send message: ' + result.error);
      }
    } catch (error) {
      console.error('Error sending user notification:', error);
      alert('Failed to send message');
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
                {syncStatus && (
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-600">
                      MongoDB: {syncStatus.mongoUserCount} | Firestore: {syncStatus.firestoreUserCount}
                    </span>
                    {syncStatus.needsSync && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                        Sync Needed
                      </span>
                    )}
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
                {syncStatus?.needsSync && (
                  <button
                    onClick={syncUsersFromFirestore}
                    disabled={isSyncingUsers}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
                  >
                    {isSyncingUsers ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Syncing...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        <span>Sync from Firestore</span>
                      </>
                    )}
                  </button>
                )}
                <button 
                  onClick={syncAllUsers}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Sync All Users</span>
                </button>
                <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {loadingUsers ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Balance</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Plan</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr 
                      key={user._id || user.uid} 
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => openUserDetail(user)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {user.firstName?.[0] || user.email?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-gray-500">{user.userCode}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <p className="font-medium">${user.totalInvested?.toLocaleString() || '0'}</p>
                          <p className="text-gray-500">Invested</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{user.investmentPlan || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {user.isActive !== false ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span className="text-sm">{user.isActive !== false ? 'Active' : 'Inactive'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                            className="p-1 text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleUserStatus(user._id || user.uid, user.isActive === false)}
                            className={`p-1 ${user.isActive !== false ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                          >
                            {user.isActive !== false ? <Ban className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => makeAdmin(user._id || user.uid, !user.isAdmin)}
                            className={`p-1 ${user.isAdmin ? 'text-yellow-600 hover:text-yellow-800' : 'text-gray-600 hover:text-gray-800'}`}
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <button
                onClick={() => setShowNotificationModal(true)}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Send className="w-4 h-4" />
                <span>Send Notification</span>
              </button>
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
              <div className="flex space-x-3">
                <button
                  onClick={clearDefaultPaymentMethods}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear Defaults</span>
                </button>
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
                    <p><span className="font-medium">Account Name:</span> {method.accountDetails?.accountName || 'N/A'}</p>
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
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Deposit Requests */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Deposit Requests</h4>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Screenshot</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {depositRequests.map((deposit) => (
                        <tr key={deposit._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {deposit.userId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${deposit.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {deposit.paymentMethodId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {deposit.screenshot ? (
                              <img src={deposit.screenshot} alt="Screenshot" className="w-16 h-16 object-cover rounded" />
                            ) : 'No screenshot'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              deposit.status === 'approved' ? 'bg-green-100 text-green-800' :
                              deposit.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {deposit.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(deposit.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {deposit.status === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => updateTransactionStatus(deposit._id!, 'deposit', 'approved')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = prompt('Rejection reason:');
                                    if (reason) {
                                      updateTransactionStatus(deposit._id!, 'deposit', 'rejected', reason);
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Withdrawal Requests */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Withdrawal Requests</h4>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Details</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {withdrawalRequests.map((withdrawal) => (
                        <tr key={withdrawal._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {withdrawal.userId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${withdrawal.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <div>{withdrawal.accountDetails.accountName}</div>
                              <div className="text-gray-500">{withdrawal.accountDetails.accountNumber}</div>
                              {withdrawal.accountDetails.bankName && (
                                <div className="text-gray-500">{withdrawal.accountDetails.bankName}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              withdrawal.status === 'completed' ? 'bg-green-100 text-green-800' :
                              withdrawal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              withdrawal.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {withdrawal.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(withdrawal.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {withdrawal.status === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => updateTransactionStatus(withdrawal._id!, 'withdrawal', 'processing')}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  Process
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = prompt('Rejection reason:');
                                    if (reason) {
                                      updateTransactionStatus(withdrawal._id!, 'withdrawal', 'rejected', reason);
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                            {withdrawal.status === 'processing' && (
                              <button
                                onClick={() => updateTransactionStatus(withdrawal._id!, 'withdrawal', 'completed')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Complete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
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
                  setUploadedFiles([]);
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
                          disabled={!userIndividualMessage.trim()}
                          className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          Send Message
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
    </div>
  );
};

export default AdminSection;
