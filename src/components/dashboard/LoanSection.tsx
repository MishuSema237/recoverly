'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Home, 
  Car, 
  Users, 
  ShieldCheck, 
  Zap, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  ArrowLeft,
  Info,
  DollarSign,
  Calendar,
  Layers,
  Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const LoanSection = () => {
  const { userProfile } = useAuth();
  const [view, setView] = useState<'info' | 'apply'>('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Form State
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('12');
  const [facility, setFacility] = useState('');
  const [purpose, setPurpose] = useState('');
  const [income, setIncome] = useState('$2,000 - $5,000');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const loanTypes = [
    { id: 'personal', name: 'Personal Home Loans', icon: <Home className="w-6 h-6" />, desc: 'Finance your dream home with competitive rates' },
    { id: 'auto', name: 'Automobile Loans', icon: <Car className="w-6 h-6" />, desc: 'Get on the road with flexible auto financing' },
    { id: 'business', name: 'Business Loans', icon: <Briefcase className="w-6 h-6" />, desc: 'Grow your business with tailored financing solutions' },
    { id: 'joint', name: 'Joint Mortgage', icon: <Users className="w-6 h-6" />, desc: 'Share responsibility with a co-borrower' },
    { id: 'overdraft', name: 'Secured Overdraft', icon: <Layers className="w-6 h-6" />, desc: 'Access funds when needed with asset backing' },
    { id: 'health', name: 'Health Finance', icon: <Activity className="w-6 h-6" />, desc: 'Cover medical expenses with flexible payment options' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !facility || !purpose || !agreeTerms) {
      alert('Please fill in all required fields and agree to the terms.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          duration: parseInt(duration),
          facility,
          purpose,
          income,
        })
      });

      const result = await response.json();
      if (result.success) {
        alert('Loan application submitted successfully! Our team will review it and notify you via email.');
        setView('info');
      } else {
        alert(result.error || 'Failed to submit application');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const InfoView = () => (
    <div className="space-y-12">
      {/* Hero Header */}
      <div className="bg-[#0b1626] rounded-3xl p-8 mobile:p-12 text-white relative overflow-hidden border border-gold-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="relative z-10 text-center lg:text-left">
          <h2 className="text-4xl mobile:text-5xl font-black mb-6 tracking-tight">Loan Services</h2>
          <p className="text-gray-400 text-lg mobile:text-xl max-w-2xl leading-relaxed mb-8">
            Financial solutions to help you achieve your goals. High-speed approvals with competitive rates tailored for you.
          </p>
          <button 
            onClick={() => setView('apply')}
            className="px-10 py-4 bg-gold-500 text-navy-900 rounded-2xl font-black uppercase tracking-widest hover:bg-gold-400 transition-all shadow-xl shadow-gold-500/20 active:scale-95"
          >
            Apply for a Loan
          </button>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="space-y-8">
        <h3 className="text-2xl font-black text-navy-900 text-center uppercase tracking-tight">Why Choose Our Loan Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Quick Approval', icon: <Zap className="w-6 h-6 text-gold-500" />, desc: 'Get a decision within hours and funds within days' },
            { title: 'Competitive Rates', icon: <DollarSign className="w-6 h-6 text-gold-500" />, desc: 'Low interest rates tailored to your credit profile' },
            { title: 'Simple Process', icon: <Clock className="w-6 h-6 text-gold-500" />, desc: 'Straightforward application with minimal paperwork' },
            { title: 'Secure & Confidential', icon: <ShieldCheck className="w-6 h-6 text-gold-500" />, desc: 'Your information is protected with bank-level security' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-gold-50 rounded-2xl flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h4 className="font-black text-navy-900 mb-3 uppercase tracking-tight text-sm">{item.title}</h4>
              <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Loan Types */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-navy-900 uppercase tracking-tight">Available Loan Types</h3>
          <button className="text-gold-600 font-black text-xs uppercase tracking-widest hover:text-gold-500 flex items-center gap-2">
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loanTypes.map((loan) => (
            <div key={loan.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:border-gold-500/30 group transition-all cursor-pointer">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-navy-50 text-navy-600 rounded-2xl flex items-center justify-center group-hover:bg-navy-900 group-hover:text-gold-500 transition-colors">
                  {loan.icon}
                </div>
                <h4 className="font-black text-navy-900 uppercase tracking-tight text-sm">{loan.name}</h4>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed mb-6">{loan.desc}</p>
              <button 
                onClick={() => setView('apply')}
                className="text-navy-900 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:text-gold-600"
              >
                Learn More <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white rounded-[2.5rem] p-8 mobile:p-12 border border-gray-100 shadow-sm">
        <h3 className="text-2xl font-black text-navy-900 text-center uppercase tracking-tight mb-12">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-dashed border-t-2 border-dashed border-gray-100"></div>
          {[
            { step: '1', title: 'Apply Online', desc: 'Complete our simple online application form with your details and loan requirements' },
            { step: '2', title: 'Quick Review', desc: 'Our team reviews your application and may contact you for additional information' },
            { step: '3', title: 'Approval & Disbursement', desc: 'Once approved, the loan amount will be transferred to your account' },
          ].map((item, i) => (
            <div key={i} className="text-center relative z-10">
              <div className="w-16 h-16 bg-navy-900 text-gold-500 rounded-3xl flex items-center justify-center text-2xl font-black mx-auto mb-8 shadow-xl shadow-navy-900/10">
                {item.step}
              </div>
              <h4 className="font-black text-navy-900 uppercase tracking-tight mb-4">{item.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-6 max-w-3xl mx-auto">
        <h3 className="text-2xl font-black text-navy-900 text-center uppercase tracking-tight mb-8">Frequently Asked Questions</h3>
        {[
          { q: "What documents do I need to apply?", a: "You'll need identification, proof of income, and address verification. Additional documents may be requested based on loan type." },
          { q: "How long does approval take?", a: "Standard applications are typically processed within 1-3 business days, depending on verification requirements." }
        ].map((faq, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <button 
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <span className="font-bold text-navy-900">{faq.q}</span>
              <ChevronRight className={`w-5 h-5 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
            </button>
            <AnimatePresence>
              {openFaq === i && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        <div className="text-center pt-4">
          <button className="text-gold-600 font-bold text-sm hover:underline">View all FAQs</button>
        </div>
      </div>

      {/* Footer Call to Action */}
      <div className="text-center py-12 px-8 bg-gold-50 rounded-[2.5rem] border border-gold-100">
        <h3 className="text-2xl font-black text-navy-900 mb-4 uppercase tracking-tight">Ready to get started?</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">Apply now and get a decision on your loan application quickly</p>
        <button 
          onClick={() => setView('apply')}
          className="px-10 py-4 bg-navy-900 text-gold-500 rounded-2xl font-black uppercase tracking-widest hover:bg-navy-800 transition-all shadow-xl active:scale-95"
        >
          Apply for a Loan
        </button>
      </div>
    </div>
  );

  const ApplyView = () => (
    <div className="max-w-3xl mx-auto">
      <button 
        onClick={() => setView('info')}
        className="flex items-center space-x-2 text-gray-500 hover:text-navy-900 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold uppercase tracking-widest text-xs">Back to Information</span>
      </button>

      <div className="bg-white rounded-[2.5rem] p-8 mobile:p-12 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-navy-50 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="mb-10">
            <h3 className="text-3xl font-black text-navy-900 uppercase tracking-tight mb-2">Loan Application</h3>
            <p className="text-gray-500 text-sm">Complete the form below to apply for your loan</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Loan Details */}
            <div className="space-y-6">
              <h4 className="flex items-center gap-2 text-xs font-black text-gold-600 uppercase tracking-[0.2em]">
                <Layers className="w-4 h-4" /> Loan Details
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-navy-900 uppercase tracking-widest ml-1">Loan Amount (USD) *</label>
                  <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-gray-400 group-focus-within:text-gold-500">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter loan amount"
                      className="w-full pl-10 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all font-bold text-navy-900 placeholder:text-gray-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-navy-900 uppercase tracking-widest ml-1">Duration (Months) *</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all font-bold text-navy-900 appearance-none cursor-pointer"
                  >
                    {[6, 12, 24, 36, 48, 60].map(m => (
                      <option key={m} value={m}>{m} Months</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-navy-900 uppercase tracking-widest ml-1">Credit Facility *</label>
                <select
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all font-bold text-navy-900 appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select Loan/Credit Facility</option>
                  {loanTypes.map(l => (
                    <option key={l.id} value={l.name}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-navy-900 uppercase tracking-widest ml-1">Purpose of Loan *</label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Please describe the purpose of this loan..."
                  rows={4}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all font-bold text-navy-900 placeholder:text-gray-300 resize-none"
                  required
                ></textarea>
              </div>
            </div>

            {/* Financial Info */}
            <div className="space-y-6">
              <h4 className="flex items-center gap-2 text-xs font-black text-gold-600 uppercase tracking-[0.2em]">
                <DollarSign className="w-4 h-4" /> Financial Information
              </h4>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-navy-900 uppercase tracking-widest ml-1">Monthly Net Income *</label>
                <select
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all font-bold text-navy-900 appearance-none cursor-pointer"
                  required
                >
                  <option value="$0 - $1,000">$0 - $1,000</option>
                  <option value="$1,000 - $2,000">$1,000 - $2,000</option>
                  <option value="$2,000 - $5,000">$2,000 - $5,000</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                  <option value="$10,000+">$10,000+</option>
                </select>
              </div>
            </div>

            {/* Agreement */}
            <div className="space-y-4 pt-4">
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded-lg border-gray-300 text-gold-500 focus:ring-gold-500 transition-all cursor-pointer"
                />
                <span className="text-sm text-gray-500 leading-relaxed group-hover:text-navy-900 transition-colors">
                  I agree to the terms and conditions. By submitting this application, I confirm that all information provided is accurate and complete. I authorize Providential Trust Finance to verify my information and credit history.
                </span>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-10 py-5 bg-navy-900 text-gold-500 rounded-2xl font-black uppercase tracking-widest hover:bg-navy-800 transition-all shadow-xl shadow-navy-900/10 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : 'Submit Loan Application'}
              </button>
              <button
                type="button"
                onClick={() => setView('info')}
                className="px-10 py-5 bg-gray-50 text-gray-500 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {view === 'info' ? <InfoView /> : <ApplyView />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LoanSection;
