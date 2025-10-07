'use client';

import { useState } from 'react';
import { 
  History, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  ArrowLeftRight, 
  TrendingUp,
  Eye,
  Calendar,
  DollarSign,
  User,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface LogEntry {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'investment' | 'earning';
  date: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  details: string;
  method?: string;
  sender?: string;
  receiver?: string;
  plan?: string;
  fee?: number;
}

const UnifiedLogsSection = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'deposits' | 'withdrawals' | 'transfers' | 'investments'>('all');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  // Mock data - in real app, this would come from Firestore
  const mockLogs: LogEntry[] = [
    {
      id: 'DEP001',
      type: 'deposit',
      date: '2024-01-15T10:30:00Z',
      amount: 5000,
      currency: 'USD',
      status: 'completed',
      details: 'Initial deposit via Bitcoin',
      method: 'Bitcoin'
    },
    {
      id: 'INV001',
      type: 'investment',
      date: '2024-01-16T14:20:00Z',
      amount: 2000,
      currency: 'USD',
      status: 'completed',
      details: 'Investment in Silver plan',
      plan: 'Silver'
    },
    {
      id: 'TRF001',
      type: 'transfer',
      date: '2024-01-17T09:15:00Z',
      amount: 500,
      currency: 'USD',
      status: 'completed',
      details: 'Transfer to user ABC12345',
      sender: 'You',
      receiver: 'ABC12345',
      fee: 5
    },
    {
      id: 'WTH001',
      type: 'withdrawal',
      date: '2024-01-18T16:45:00Z',
      amount: 1000,
      currency: 'USD',
      status: 'pending',
      details: 'Withdrawal to Bank Account',
      method: 'Bank Transfer'
    },
    {
      id: 'ERN001',
      type: 'earning',
      date: '2024-01-19T12:00:00Z',
      amount: 50,
      currency: 'USD',
      status: 'completed',
      details: 'Daily earnings from Silver plan',
      plan: 'Silver'
    }
  ];

  const filteredLogs = mockLogs.filter(log => {
    if (activeTab === 'all') return true;
    if (activeTab === 'deposits') return log.type === 'deposit';
    if (activeTab === 'withdrawals') return log.type === 'withdrawal';
    if (activeTab === 'transfers') return log.type === 'transfer';
    if (activeTab === 'investments') return log.type === 'investment' || log.type === 'earning';
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownCircle className="w-5 h-5 text-green-600" />;
      case 'withdrawal': return <ArrowUpCircle className="w-5 h-5 text-red-600" />;
      case 'transfer': return <ArrowLeftRight className="w-5 h-5 text-blue-600" />;
      case 'investment': return <TrendingUp className="w-5 h-5 text-purple-600" />;
      case 'earning': return <DollarSign className="w-5 h-5 text-yellow-600" />;
      default: return <History className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number, type: string) => {
    const prefix = type === 'deposit' || type === 'earning' ? '+' : '-';
    return `${prefix}$${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'all', label: 'All Transactions', icon: <History className="w-4 h-4" /> },
            { id: 'deposits', label: 'Deposits', icon: <ArrowDownCircle className="w-4 h-4" /> },
            { id: 'withdrawals', label: 'Withdrawals', icon: <ArrowUpCircle className="w-4 h-4" /> },
            { id: 'transfers', label: 'Transfers', icon: <ArrowLeftRight className="w-4 h-4" /> },
            { id: 'investments', label: 'Investments', icon: <TrendingUp className="w-4 h-4" /> }
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

        {/* Mobile Tile Layout */}
        <div className="block md:hidden space-y-3">
          {filteredLogs.length > 0 ? (
            filteredLogs.map(log => (
              <div key={log.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(log.type)}
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{log.type}</p>
                      <p className="text-sm text-gray-500">{formatDate(log.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      log.type === 'deposit' || log.type === 'earning' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {formatAmount(log.amount, log.type)}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      {getStatusIcon(log.status)}
                      <span className="text-xs capitalize text-gray-600">{log.status}</span>
                    </div>
                  </div>
                </div>
                {log.details && (
                  <p className="text-sm text-gray-600 truncate">{log.details}</p>
                )}
                <button
                  onClick={() => setSelectedLog(log)}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Details →
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No transactions found</p>
              <p className="text-sm">Your transaction history will appear here</p>
            </div>
          )}
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Details</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(log.type)}
                        <span className="capitalize text-sm font-medium">{log.type}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDate(log.date)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${
                        log.type === 'deposit' || log.type === 'earning' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {formatAmount(log.amount, log.type)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(log.status)}
                        <span className="text-sm capitalize">{log.status}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {log.details}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed View Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Transaction Details</h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                    <p className="text-sm text-gray-900 font-mono">{selectedLog.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(selectedLog.type)}
                      <span className="text-sm capitalize">{selectedLog.type}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedLog.date)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedLog.status)}
                      <span className="text-sm capitalize">{selectedLog.status}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <p className={`text-lg font-semibold ${
                      selectedLog.type === 'deposit' || selectedLog.type === 'earning' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {formatAmount(selectedLog.amount, selectedLog.type)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Currency</label>
                    <p className="text-sm text-gray-900">{selectedLog.currency}</p>
                  </div>
                </div>

                {selectedLog.method && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                    <p className="text-sm text-gray-900">{selectedLog.method}</p>
                  </div>
                )}

                {selectedLog.plan && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Investment Plan</label>
                    <p className="text-sm text-gray-900">{selectedLog.plan}</p>
                  </div>
                )}

                {selectedLog.sender && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sender</label>
                    <p className="text-sm text-gray-900">{selectedLog.sender}</p>
                  </div>
                )}

                {selectedLog.receiver && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Receiver</label>
                    <p className="text-sm text-gray-900">{selectedLog.receiver}</p>
                  </div>
                )}

                {selectedLog.fee && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Transaction Fee</label>
                    <p className="text-sm text-gray-900">${selectedLog.fee}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-900">{selectedLog.details}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedLogsSection;

