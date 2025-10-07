'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  CreditCard, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  Shield,
  UserCheck,
  UserX,
  Ban,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessAdmin } from '@/utils/adminUtils';
import { 
  collection, 
  query, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  addDoc,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { PlanService, InvestmentPlan } from '@/lib/services/PlanService';
import { UserService, User } from '@/lib/services/UserService';

interface PaymentMethod {
  id: string;
  name: string;
  currency: string;
  address: string;
  qrCode?: string;
  trustWalletLink?: string;
  isActive: boolean;
}

const AdminSection = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'plans' | 'payments' | 'transactions'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
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
    }
  }, [isAdmin]);

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
      const paymentsRef = collection(db, 'paymentMethods');
      const querySnapshot = await getDocs(paymentsRef);
      const paymentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PaymentMethod[];
      setPaymentMethods(paymentsData);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    } finally {
      setLoadingPayments(false);
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

  const handleDeleteUser = (userId: string, userName: string) => {
    setConfirmAction({ type: 'deleteUser', id: userId, name: userName });
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
          await deleteDoc(doc(db, 'paymentMethods', confirmAction.id));
          setMessage({ type: 'success', text: 'Payment method deleted successfully' });
          loadPaymentMethods();
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

  const deletePlan = async (planId: string) => {
    // This function is now replaced by handleDeletePlan
    console.warn('deletePlan function is deprecated, use handleDeletePlan instead');
  };

  const savePaymentMethod = async () => {
    setIsProcessingPayment(true);
    try {
      // Validate required fields
      if (!newPayment.name || !newPayment.currency || !newPayment.address) {
        setMessage({ type: 'error', text: 'Please fill in all required fields' });
        setIsProcessingPayment(false);
        return;
      }

      if (editingPayment) {
        // Update existing payment method
        const paymentRef = doc(db, 'paymentMethods', editingPayment.id);
        await updateDoc(paymentRef, {
          name: newPayment.name,
          currency: newPayment.currency,
          address: newPayment.address,
          qrCode: newPayment.qrCode || '',
          trustWalletLink: newPayment.trustWalletLink || '',
          isActive: newPayment.isActive !== false,
          updatedAt: new Date(),
          updatedBy: userProfile?.email || 'admin'
        });
        setMessage({ type: 'success', text: 'Payment method updated successfully' });
      } else {
        // Create new payment method
        await addDoc(collection(db, 'paymentMethods'), {
          name: newPayment.name,
          currency: newPayment.currency,
          address: newPayment.address,
          qrCode: newPayment.qrCode || '',
          trustWalletLink: newPayment.trustWalletLink || '',
          isActive: newPayment.isActive !== false,
          createdAt: new Date(),
          createdBy: userProfile?.email || 'admin',
          updatedAt: new Date(),
          updatedBy: userProfile?.email || 'admin'
        });
        setMessage({ type: 'success', text: 'Payment method created successfully' });
      }
      setShowPaymentModal(false);
      setEditingPayment(null);
      setNewPayment({});
      loadPaymentMethods();
    } catch (error) {
      console.error('Error saving payment method:', error);
      setMessage({ type: 'error', text: 'Failed to save payment method' });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const deletePaymentMethod = async (paymentId: string) => {
    // This function is now replaced by handleDeletePayment
    console.warn('deletePaymentMethod function is deprecated, use handleDeletePayment instead');
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
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
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
            { id: 'transactions', label: 'Transactions', icon: <DollarSign className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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
                    <tr key={user._id || user.uid} className="border-b border-gray-100 hover:bg-gray-50">
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
                <div key={method.id} className="bg-white border border-gray-200 rounded-lg p-6">
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
                        onClick={() => handleDeletePayment(method.id, method.name)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Currency:</span> {method.currency}</p>
                    <p><span className="font-medium">Address:</span> {method.address}</p>
                    {method.trustWalletLink && (
                      <p><span className="font-medium">Trust Wallet:</span> <a href={method.trustWalletLink} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Link</a></p>
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
              <h3 className="text-lg font-semibold text-gray-900">All Transactions</h3>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Transaction Management</h4>
              <p className="text-gray-600">View and manage all user transactions, deposits, withdrawals, and transfers.</p>
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
                    placeholder="e.g., Ethereum, Bitcoin, Trust Wallet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <input
                    type="text"
                    value={newPayment.currency || ''}
                    onChange={(e) => setNewPayment({ ...newPayment, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., ETH, BTC, USD"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Address</label>
                  <textarea
                    value={newPayment.address || ''}
                    onChange={(e) => setNewPayment({ ...newPayment, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={3}
                    placeholder="0xd624DB06741B512059b6a8Cd0bbc3800A9Ecf083"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">QR Code URL (Optional)</label>
                  <input
                    type="url"
                    value={newPayment.qrCode || ''}
                    onChange={(e) => setNewPayment({ ...newPayment, qrCode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="https://example.com/qr-code.png"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trust Wallet Link (Optional)</label>
                  <input
                    type="url"
                    value={newPayment.trustWalletLink || ''}
                    onChange={(e) => setNewPayment({ ...newPayment, trustWalletLink: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="https://link.trustwallet.com/send?address=..."
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
                <span className="font-semibold text-gray-900">"{confirmAction.name}"</span>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {confirmAction.type === 'deletePlan' && 'This will permanently remove the investment plan.'}
                {confirmAction.type === 'deleteUser' && 'This will permanently remove the user account.'}
                {confirmAction.type === 'deletePayment' && 'This will permanently remove the payment method.'}
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
    </div>
  );
};

export default AdminSection;
