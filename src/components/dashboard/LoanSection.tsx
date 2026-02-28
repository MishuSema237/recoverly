'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

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
import { showSuccess, showError } from '@/utils/toast';

interface LoanType {
  id: string;
  name: string;
  icon: React.ReactNode;
  desc: string;
}

const loanTypes: LoanType[] = [
  { id: 'personal', name: 'Personal Home Loans', icon: <Home className="w-6 h-6" />, desc: 'Finance your dream home with competitive rates' },
  { id: 'auto', name: 'Automobile Loans', icon: <Car className="w-6 h-6" />, desc: 'Get on the road with flexible auto financing' },
  { id: 'business', name: 'Business Loans', icon: <Briefcase className="w-6 h-6" />, desc: 'Grow your business with tailored financing solutions' },
  { id: 'joint', name: 'Joint Mortgage', icon: <Users className="w-6 h-6" />, desc: 'Share responsibility with a co-borrower' },
  { id: 'overdraft', name: 'Secured Overdraft', icon: <Layers className="w-6 h-6" />, desc: 'Access funds when needed with asset backing' },
  { id: 'health', name: 'Health Finance', icon: <Activity className="w-6 h-6" />, desc: 'Cover medical expenses with flexible payment options' },
];

interface InfoViewProps {
  onApply: () => void;
  openFaq: number | null;
  setOpenFaq: (idx: number | null) => void;
}

const InfoView = ({ onApply, openFaq, setOpenFaq }: InfoViewProps) => (
  <div className="space-y-12">
    {/* Hero Header */}
    <div className="bg-[#0b1626] rounded-3xl p-6 mobile:p-12 text-white relative overflow-hidden border border-gold-500/20">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
      <div className="relative z-10 text-center lg:text-left">
        <h2 className="text-3xl mobile:text-5xl font-black mb-6 tracking-tight">Loan Services</h2>
        <p className="text-gray-400 text-lg mobile:text-xl max-w-2xl leading-relaxed mb-8">
          Financial solutions to help you achieve your goals. High-speed approvals with competitive rates tailored for you.
        </p>
        <button 
          onClick={onApply}
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
              onClick={onApply}
              className="text-navy-900 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:text-gold-600"
            >
              Learn More <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>

    {/* How it works */}
    <div className="bg-white rounded-[2.5rem] p-6 mobile:p-12 border border-gray-100 shadow-sm">
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
        onClick={onApply}
        className="px-10 py-4 bg-navy-900 text-gold-500 rounded-2xl font-black uppercase tracking-widest hover:bg-navy-800 transition-all shadow-xl active:scale-95"
      >
        Apply for a Loan
      </button>
    </div>
  </div>
);

interface ApplyViewProps {
  onBack: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  amount: string;
  setAmount: (val: string) => void;
  duration: string;
  setDuration: (val: string) => void;
  facility: string;
  setFacility: (val: string) => void;
  purpose: string;
  setPurpose: (val: string) => void;
  income: string;
  setIncome: (val: string) => void;
  agreeTerms: boolean;
  setAgreeTerms: (val: boolean) => void;
}

const ApplyView = ({
  onBack,
  handleSubmit,
  isSubmitting,
  amount,
  setAmount,
  duration,
  setDuration,
  facility,
  setFacility,
  purpose,
  setPurpose,
  income,
  setIncome,
  agreeTerms,
  setAgreeTerms
}: ApplyViewProps) => (
  <div className="max-w-3xl mx-auto">
    <button 
      onClick={onBack}
      className="flex items-center space-x-2 text-gray-500 hover:text-navy-900 transition-colors mb-8 group"
    >
      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      <span className="font-bold uppercase tracking-widest text-xs">Back to Information</span>
    </button>

    <div className="bg-white rounded-[2.5rem] p-6 mobile:p-12 border border-gray-100 shadow-sm relative overflow-hidden">
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
              <label className="text-[10px] font-black text-navy-900 uppercase tracking-widest ml-1">Loan Category *</label>
              <select
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all font-bold text-navy-900 appearance-none cursor-pointer"
                required
              >
                <option value="">Select Loan Category</option>
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
              onClick={onBack}
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

const TrackingView = ({ onBack }: { onBack: () => void }) => {
  const [loans, setLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await fetch('/api/loans');
        const result = await response.json();
        if (result.success) {
          setLoans(result.data);
        }
      } catch (error) {
        console.error('Error fetching loans:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLoans();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-50 text-green-500 border-green-100';
      case 'rejected': return 'bg-red-50 text-red-500 border-red-100';
      case 'processing': return 'bg-blue-50 text-blue-500 border-blue-100';
      default: return 'bg-gold-50 text-gold-500 border-gold-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 mobile:space-y-8">
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-500 hover:text-navy-900 transition-colors mb-2 mobile:mb-4 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold uppercase tracking-widest text-[10px] mobile:text-xs">Back to Services</span>
      </button>

      <div className="bg-white rounded-3xl mobile:rounded-[2.5rem] p-6 mobile:p-12 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mobile:mb-12">
          <div>
            <h3 className="text-2xl mobile:text-3xl font-black text-navy-900 uppercase tracking-tight mb-2">Application Tracking</h3>
            <p className="text-gray-500 text-xs mobile:text-sm">Monitor the real-time status of your financial requests</p>
          </div>
          <div className="flex items-center self-start md:self-auto gap-3 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
            <Activity className="w-4 h-4 text-gold-500" />
            <span className="text-[10px] font-black text-navy-900 uppercase tracking-widest">{loans.length} Active Protocols</span>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Synchronizing ledger...</p>
          </div>
        ) : loans.length > 0 ? (
          <div className="space-y-6">
            {loans.map((loan) => (
              <div key={loan._id} className="group bg-gray-50 rounded-3xl p-6 mobile:p-8 border border-gray-100 hover:border-gold-500/30 transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start gap-4 mobile:gap-6">
                    <div className="w-12 h-12 mobile:w-14 mobile:h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all shrink-0">
                      <Briefcase className="w-5 h-5 mobile:w-6 mobile:h-6 text-navy-900" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mobile:gap-3 mb-1">
                        <h4 className="font-black text-navy-900 uppercase tracking-tight truncate max-w-[150px] mobile:max-w-none">{loan.facility}</h4>
                        <span className={`px-2.5 py-1 rounded-full text-[8px] mobile:text-[9px] font-black uppercase tracking-widest border whitespace-nowrap ${getStatusColor(loan.status)}`}>
                          {loan.status}
                        </span>
                      </div>
                      <p className="text-[10px] mobile:text-[11px] font-bold text-gray-400 uppercase tracking-widest">Ref: {loan._id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 mobile:grid-cols-3 gap-4 mobile:gap-8 lg:gap-12 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-200/50 lg:border-none">
                    <div>
                      <p className="text-[8px] mobile:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Principle Sum</p>
                      <p className="text-base mobile:text-lg font-black text-navy-900 tracking-tight">${loan.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[8px] mobile:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Duration</p>
                      <p className="text-base mobile:text-lg font-black text-navy-900 tracking-tight uppercase">{loan.duration} <span className="text-[10px]">Months</span></p>
                    </div>
                    <div className="col-span-2 mobile:col-span-1">
                      <p className="text-[8px] mobile:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Submission Date</p>
                      <p className="text-sm mobile:text-lg font-black text-navy-900 tracking-tight uppercase">{new Date(loan.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Timeline - Responsive */}
                <div className="mt-8 pt-6 mobile:mt-10 mobile:pt-8 border-t border-gray-200/50">
                  {/* Desktop Horizontal Timeline */}
                  <div className="hidden mobile:block relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2"></div>
                    <div className="relative flex justify-between items-center px-4">
                      {[
                        { label: 'Submitted', active: true, done: true },
                        { label: 'Review', active: loan.status !== 'pending', done: loan.status !== 'pending' && loan.status !== 'processing' },
                        { label: 'Finalization', active: loan.status === 'approved' || loan.status === 'rejected', done: loan.status === 'approved' || loan.status === 'rejected' }
                      ].map((step, i) => (
                        <div key={i} className="flex flex-col items-center gap-3 relative z-10">
                          <div className={`w-4 h-4 rounded-full border-2 border-white transition-all ${
                            step.done ? 'bg-green-500 scale-125 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 
                            step.active ? 'bg-gold-500 scale-110 animate-pulse shadow-[0_0_10px_rgba(201,147,58,0.3)]' : 
                            'bg-gray-300'
                          }`}></div>
                          <span className={`text-[9px] font-black uppercase tracking-widest ${
                            step.active ? 'text-navy-900' : 'text-gray-400'
                          }`}>{step.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Vertical Timeline */}
                  <div className="mobile:hidden space-y-4">
                    {[
                      { label: 'Payload Submitted', active: true, done: true, desc: 'Application data encrypted and sent to ledger.' },
                      { label: 'Intelligence Review', active: loan.status !== 'pending', done: loan.status !== 'pending' && loan.status !== 'processing', desc: 'Authorized audit of credentials and sum.' },
                      { label: 'Protocol Finalization', active: loan.status === 'approved' || loan.status === 'rejected', done: loan.status === 'approved' || loan.status === 'rejected', desc: 'Authorized release or rejection entry.' }
                    ].map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center shrink-0">
                          <div className={`w-3 h-3 rounded-full border-2 border-white transition-all ${
                            step.done ? 'bg-green-500 scale-125' : 
                            step.active ? 'bg-gold-500 scale-110 animate-pulse' : 
                            'bg-gray-300'
                          }`}></div>
                          {i < 2 && <div className={`w-0.5 h-full min-h-[20px] bg-gray-200 mt-1`}></div>}
                        </div>
                        <div className="pb-4">
                          <span className={`text-[10px] font-black uppercase tracking-widest block mb-0.5 ${
                            step.active ? 'text-navy-900' : 'text-gray-400'
                          }`}>{step.label}</span>
                          <p className="text-[9px] font-medium text-gray-400 lowercase">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="w-16 h-16 mobile:w-20 mobile:h-20 bg-gray-50 rounded-[1.5rem] mobile:rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <Layers className="w-8 h-8 mobile:w-10 mobile:h-10 text-gray-200" />
            </div>
            <h4 className="text-base mobile:text-lg font-black text-navy-900 uppercase tracking-tight mb-2">No Active Protocols</h4>
            <p className="text-gray-400 text-xs mobile:text-sm max-w-[240px] mobile:max-w-xs mx-auto mb-8">You haven't submitted any loan applications to the ledger yet.</p>
            <button 
              onClick={onBack}
              className="px-8 py-3 bg-navy-900 text-gold-500 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-navy-900/10 active:scale-95 transition-all"
            >
              Initiate Application
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const LoanSection = () => {
  const { userProfile } = useAuth();
  const [view, setView] = useState<'info' | 'apply' | 'track'>('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Form State
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('12');
  const [facility, setFacility] = useState('');
  const [purpose, setPurpose] = useState('');
  const [income, setIncome] = useState('$2,000 - $5,000');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !facility || !purpose || !agreeTerms) {
      showError('Please fill in all required fields and agree to the terms.');
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
        showSuccess('Loan application submitted successfully! Our team will review it and notify you via email.');
        // Reset form
        setAmount('');
        setPurpose('');
        setFacility('');
        setAgreeTerms(false);
        setView('track'); // Redirect to tracking
      } else {
        showError(result.error || 'Failed to submit application');
      }
    } catch (error) {
      showError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          {view === 'info' ? (
            <div className="space-y-6">
              <div className="flex justify-end mb-4">
                <button 
                  onClick={() => setView('track')}
                  className="px-6 py-2.5 bg-white border border-gray-100 text-navy-900 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-sm hover:border-gold-500/30 transition-all flex items-center gap-2"
                >
                  <Activity className="w-4 h-4 text-gold-500" />
                  Track Applications
                </button>
              </div>
              <InfoView 
                onApply={() => setView('apply')} 
                openFaq={openFaq} 
                setOpenFaq={setOpenFaq} 
              />
            </div>
          ) : view === 'apply' ? (
            <ApplyView 
              onBack={() => setView('info')}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              amount={amount}
              setAmount={setAmount}
              duration={duration}
              setDuration={setDuration}
              facility={facility}
              setFacility={setFacility}
              purpose={purpose}
              setPurpose={setPurpose}
              income={income}
              setIncome={setIncome}
              agreeTerms={agreeTerms}
              setAgreeTerms={setAgreeTerms}
            />
          ) : (
            <TrackingView onBack={() => setView('info')} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LoanSection;
