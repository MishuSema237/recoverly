'use client';

import { ShieldCheck, Smartphone, Key } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const TwoFactorSection = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const handleEnable2FA = () => {
    // Generate QR code and backup codes
    setQrCode('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    setBackupCodes(['12345678', '87654321', '11223344', '44332211', '55667788']);
    setIs2FAEnabled(true);
  };

  const handleDisable2FA = () => {
    setIs2FAEnabled(false);
    setQrCode('');
    setBackupCodes([]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-600 mb-6">
          Enhance your account security with two-factor authentication for additional protection.
        </p>
        
        {!is2FAEnabled ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Secure Your Account</h4>
              <p className="text-gray-600 mb-6">
                Add an extra layer of security to your account with two-factor authentication.
              </p>
              <button
                onClick={handleEnable2FA}
                className="bg-[#c9933a] hover:bg-[#b08132] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Enable 2FA
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">2FA Enabled</h4>
              <p className="text-gray-600 mb-6">
                Your account is now protected with two-factor authentication.
              </p>
            </div>

            {/* QR Code */}
            <div className="text-center">
              <h5 className="font-semibold text-gray-900 mb-4">Scan QR Code</h5>
              <div className="inline-block p-4 bg-white border border-gray-200 rounded-lg">
                <Image src={qrCode} alt="QR Code" width={192} height={192} className="w-48 h-48" />
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Use your authenticator app to scan this QR code
              </p>
            </div>

            {/* Backup Codes */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Backup Codes</h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-4">
                  Save these backup codes in a safe place. You can use them to access your account if you lose your device.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="bg-white p-2 rounded border text-center font-mono text-sm">
                      {code}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleDisable2FA}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Disable 2FA
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactorSection;
