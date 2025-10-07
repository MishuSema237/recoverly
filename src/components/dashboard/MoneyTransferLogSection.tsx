'use client';

import { History } from 'lucide-react';

const MoneyTransferLogSection = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <p className="text-gray-600 mb-6">
        View your money transfer history and track all transfers between users.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Transaction ID</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Sender</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Receiver</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Currency</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Charge</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Details</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Payment Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={9} className="text-center py-8 text-gray-500">
                No transaction found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MoneyTransferLogSection;

