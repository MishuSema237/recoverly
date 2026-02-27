'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  Bitcoin, 
  HeartHandshake, 
  TrendingDown, 
  FileSearch, 
  Scale, 
  Building2, 
  RefreshCw,
  Search,
  ArrowRight,
  AlertCircle,
  Clock,
  CheckCircle2,
  Zap,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

const RecoverySection = () => {
  const searchParams = useSearchParams();
  const urlScamType = searchParams.get('scamType');
  const urlTid = searchParams.get('tid');

  const [activeTab, setActiveTab] = useState<'tracker' | 'form' | 'education'>(
    urlScamType ? 'form' : 'tracker'
  );
  
  const [formData, setFormData] = useState({
    scamType: urlScamType || '',
    amountLost: '',
    dateOfIncident: '',
    platformName: '',
    details: urlTid ? `Transaction ID: ${urlTid}\n` : ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cases, setCases] = useState<any[]>([]);
  const [loadingCases, setLoadingCases] = useState(true);

  const fetchCases = async () => {
    try {
      setLoadingCases(true);
      const res = await fetch('/api/recovery');
      const data = await res.json();
      if (data.success) {
        setCases(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch cases:', err);
    } finally {
      setLoadingCases(false);
    }
  };

  React.useEffect(() => {
    fetchCases();
  }, []);

  const getStatusSteps = (status: string) => {
    const steps = [
      { title: 'Forensic Trace', icon: <FileSearch />, status: 'pending', desc: 'Analyzing blockchain ledgers and international Swift records.' },
      { title: 'Legal Demand', icon: <Scale />, status: 'pending', desc: 'Issuing formal demands to receiving institutions and PSPs.' },
      { title: 'Bank Freeze', icon: <Building2 />, status: 'pending', desc: 'Securing temporary freezing orders on illicit accounts.' },
      { title: 'Fast Cashback', icon: <RefreshCw />, status: 'pending', desc: 'Repatriation of recovered funds to your Safe Vault.' }
    ];

    if (['pending', 'reviewing', 'tracing'].includes(status)) {
      steps[0].status = 'active';
    } else if (['legal'].includes(status)) {
      steps[0].status = 'completed';
      steps[1].status = 'active';
    } else if (['recovered'].includes(status)) {
      steps[0].status = 'completed';
      steps[1].status = 'completed';
      steps[2].status = 'completed';
      steps[3].status = 'active';
    } else if (status === 'closed') {
      steps.forEach(s => s.status = 'completed');
    }

    return steps;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        fetchCases();
        setFormData({
          scamType: '',
          amountLost: '',
          dateOfIncident: '',
          platformName: '',
          details: ''
        });
      }
    } catch (err) {
      console.error('Failed to submit report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  const scamTypes = [
    { id: 'crypto', name: 'Crypto Wealth', icon: <Bitcoin className="text-orange-500" /> },
    { id: 'forex', name: 'Forex/Investment', icon: <TrendingDown className="text-red-500" /> },
    { id: 'romance', name: 'Romance/Social', icon: <HeartHandshake className="text-pink-500" /> },
    { id: 'phishing', name: 'Phishing/Hacks', icon: <Shield className="text-blue-500" /> }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-gold-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] font-black text-gold-600 uppercase tracking-[0.2em]">Forensic Intelligence Division</p>
          </div>
          <h2 className="text-3xl font-black text-navy-900 uppercase tracking-tighter">Asset Recovery Hub</h2>
        </div>
        
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
          {(['tracker', 'form', 'education'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-[10px] mobile:text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab 
                ? 'bg-navy-900 text-gold-500 shadow-md' 
                : 'text-gray-400 hover:text-navy-900'
              }`}
            >
              {tab === 'form' ? 'Rapid Report' : tab}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'tracker' && (
          <motion.div 
            key="tracker"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {loadingCases ? (
              <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200">
                <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Querying forensic ledger...</p>
              </div>
            ) : cases.length > 0 ? (
              <div className="space-y-8">
                {cases.map((recoveryCase) => (
                  <div key={recoveryCase._id} className="space-y-6">
                    {/* Active Status Card */}
                    <div className="bg-[#0b1626] rounded-3xl p-8 text-white relative overflow-hidden border border-gold-500/20">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                      
                      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <Shield className="text-gold-500 w-8 h-8" />
                            <h3 className="text-2xl font-bold uppercase tracking-tighter">Case: #{recoveryCase._id.slice(-6).toUpperCase()}</h3>
                          </div>
                          <p className="text-gray-400 text-sm leading-relaxed mb-8">
                            Status: <span className="text-gold-500 font-black uppercase tracking-widest">{recoveryCase.status}</span>. 
                            {recoveryCase.adminNotes || 'Our task force is currently processing this recovery claim. Systems are optimized for high-speed digital tracing.'}
                          </p>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Loss Targeted</p>
                              <p className="text-xl font-black text-white">${recoveryCase.amountLost?.toLocaleString()}</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Incident Date</p>
                              <p className="text-sm font-black text-gold-500">
                                {new Date(recoveryCase.dateOfIncident).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-gold-500/10 border border-gold-500/20 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <Clock className="text-gold-500 w-5 h-5" />
                              <span className="text-xs font-bold uppercase tracking-widest">Case Chronology</span>
                            </div>
                            <div className="space-y-3">
                              {recoveryCase.updates.slice(-2).map((update: any, i: number) => (
                                <div key={i} className="flex gap-3">
                                  <div className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-1.5 shrink-0" />
                                  <div>
                                    <p className="text-[10px] font-bold text-white uppercase tracking-tight">{update.message}</p>
                                    <p className="text-[8px] text-gray-400 font-black uppercase">{new Date(update.date).toLocaleDateString()}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Steps Visualizer */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {getStatusSteps(recoveryCase.status).map((step, idx) => (
                        <div key={idx} className={`p-6 rounded-2xl border transition-all ${
                          step.status === 'active' 
                          ? 'bg-white border-gold-500 shadow-xl shadow-gold-500/5' 
                          : step.status === 'completed'
                          ? 'bg-green-50 border-green-100'
                          : 'bg-gray-50 border-gray-100 opacity-60'
                        }`}>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                            step.status === 'active' ? 'bg-navy-900 text-gold-500' : 
                            step.status === 'completed' ? 'bg-green-500 text-white' :
                            'bg-gray-200 text-gray-400'
                          }`}>
                            {step.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : step.icon}
                          </div>
                          <h4 className="font-black text-navy-900 text-xs uppercase tracking-tight mb-2">{step.title}</h4>
                          <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                <FileSearch className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-navy-900 uppercase tracking-tighter">No Active Protocols</h3>
                <p className="text-gray-400 max-w-sm mx-auto mt-2 font-medium">You haven't initialized any asset recovery reports yet. Use the 'Rapid Report' tab to begin.</p>
                <button 
                  onClick={() => setActiveTab('form')}
                  className="mt-8 px-8 py-3 bg-navy-900 text-gold-500 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-navy-900/10"
                >
                  Start Forensic Audit
                </button>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'form' && (
          <motion.div 
            key="form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white rounded-[2.5rem] p-8 mobile:p-12 border border-gray-100 shadow-2xl relative overflow-hidden">
              {submitted ? (
                <div className="text-center py-12 animate-in zoom-in-95 duration-500">
                  <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-black text-navy-900 uppercase tracking-tighter mb-4">Briefing Transmitted</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-8 font-medium">
                    Our forensic division has received your intelligence packet. A lead investigator will be assigned to your case shortly.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="px-8 py-3 bg-navy-900 text-gold-500 rounded-xl font-bold uppercase tracking-widest hover:bg-navy-800 transition-all"
                  >
                    Generate New Report
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-14 h-14 bg-navy-900 rounded-2xl flex items-center justify-center">
                      <FileSearch className="text-gold-500 w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-navy-900 uppercase tracking-tighter line-none">Rapid Forensic Report</h3>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Initialize Scam Investigation Protocol</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Classification of Scam</label>
                        <select 
                          required
                          className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all appearance-none"
                          value={formData.scamType}
                          onChange={(e) => setFormData({...formData, scamType: e.target.value})}
                        >
                          <option value="">Select Category</option>
                          {scamTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Value of Loss (USD)</label>
                        <input 
                          required
                          type="number"
                          placeholder="e.g. 5000"
                          className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                          value={formData.amountLost}
                          onChange={(e) => setFormData({...formData, amountLost: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Incident Details & Metadata</label>
                      <textarea 
                        required
                        className="w-full p-6 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all min-h-[150px]"
                        placeholder="Describe the platform, website URLs, and sequence of events..."
                        value={formData.details}
                        onChange={(e) => setFormData({...formData, details: e.target.value})}
                      />
                    </div>

                    <div className="p-6 bg-navy-50 rounded-2xl border border-navy-100 flex items-start gap-4">
                      <Lock className="text-navy-900 w-5 h-5 shrink-0 mt-1" />
                      <p className="text-[10px] text-navy-900/70 font-bold leading-relaxed uppercase tracking-widest">
                        Your submission is encrypted with intelligence-grade protocols. We bypass slow local channels to hit scammers directly at the financial hubs.
                      </p>
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-16 bg-navy-900 text-gold-500 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-navy-900/20 hover:bg-navy-800 transition-all flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Processing Intel...
                        </>
                      ) : (
                        <>
                          Authorize Emergency Trace
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'education' && (
          <motion.div 
            key="education"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {scamTypes.map((scam) => (
              <div key={scam.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:border-gold-500 transition-all group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    {scam.icon}
                  </div>
                  <h4 className="text-xl font-black text-navy-900 uppercase tracking-tight">{scam.name}</h4>
                </div>
                <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6">
                  {scam.id === 'crypto' && 'Tracing stolen BTC and stablecoins through mixers to final off-ramp exchanges.'}
                  {scam.id === 'forex' && 'Targeting Payment Service Providers (PSPs) and banks that facilitated illegal broker trades.'}
                  {scam.id === 'romance' && 'Discrete handling of emotional manipulation cases involving overseas syndicate wire transfers.'}
                  {scam.id === 'phishing' && 'Holding institutions accountable for regulatory and security failures leading to hacks.'}
                </p>
                <div className="flex items-center gap-2 text-gold-600 font-black text-[10px] uppercase tracking-widest">
                  <AlertCircle className="w-4 h-4" />
                  Time Critical Recovery
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function RecoverySectionWrapper() {
  return (
    <React.Suspense fallback={<div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <RecoverySection />
    </React.Suspense>
  );
}
