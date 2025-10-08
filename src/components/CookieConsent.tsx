'use client';

import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem('tesla-capital-cookie-consent');
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('tesla-capital-cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem('tesla-capital-cookie-consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Cookie className="w-6 h-6 text-red-600 mt-1" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Cookie Consent
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              We may use cookies or any other tracking technologies when you visit our website, 
              including any other media form, mobile website, or mobile application related or 
              connected to help customize the Site and improve your experience. These cookies 
              help us provide personalized investment recommendations, secure your account, 
              and enhance our platform's functionality.{' '}
              <a 
                href="/privacy-policy" 
                className="text-red-600 hover:text-red-700 underline font-medium"
              >
                Learn more
              </a>
            </p>
          </div>

          <div className="flex-shrink-0 flex space-x-3">
            <button
              onClick={declineCookies}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              Decline
            </button>
            <button
              onClick={acceptCookies}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
            >
              Accept All
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
