import React, { useState } from 'react';
import {
  Briefcase,
  DollarSign,
  Wallet,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  AlertTriangle,
  Plus,
  CreditCard,
  Building2,
  Star,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  TrendingUp,
  ChevronRight,
  Loader2,
  X,
  FileCheck,
  Lock,
  Layers,
  Filter
} from 'lucide-react';
import { LeadItem, ContractorProfile, PaymentTransaction, DispatchTicket } from '../types';

interface ContractorDashboardProps {
  leads: LeadItem[];
  contractor: ContractorProfile;
  onClaimLead: (leadId: string, leadFee: number) => boolean;
  onAddWalletFunds: (amount: number, description: string) => void;
  onCollectCustomerPayment: (leadId: string, amount: number, paymentMethod: 'CREDIT_CARD' | 'INSURANCE_CLAIM' | 'FINANCING') => void;
  onUpdateLeadStatus: (leadId: string, status: LeadItem['status']) => void;
  dispatchTickets?: DispatchTicket[];
}

export const ContractorDashboard: React.FC<ContractorDashboardProps> = ({
  leads,
  contractor,
  onClaimLead,
  onAddWalletFunds,
  onCollectCustomerPayment,
  onUpdateLeadStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'my_jobs' | 'wallet'>('marketplace');
  const [leadFilter, setLeadFilter] = useState<'ALL' | 'EMERGENCY' | 'ESTIMATE'>('ALL');
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [selectedLeadForPayment, setSelectedLeadForPayment] = useState<LeadItem | null>(null);

  // Add funds form state
  const [selectedPackAmount, setSelectedPackAmount] = useState<number>(250);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('882');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');

  // Collect customer payment modal state
  const [collectAmount, setCollectAmount] = useState<number>(850);
  const [collectMethod, setCollectMethod] = useState<'CREDIT_CARD' | 'INSURANCE_CLAIM' | 'FINANCING'>('CREDIT_CARD');
  const [isCollecting, setIsCollecting] = useState(false);

  // Filtered leads
  const availableLeads = leads.filter((l) => !l.isClaimed && (
    leadFilter === 'ALL' ||
    (leadFilter === 'EMERGENCY' && l.type === 'EMERGENCY_TARP') ||
    (leadFilter === 'ESTIMATE' && l.type === 'STANDARD_ESTIMATE')
  ));

  const myClaimedLeads = leads.filter((l) => l.isClaimed);

  // Claim lead handler
  const handleClaim = (lead: LeadItem) => {
    if (contractor.walletBalance < lead.leadFee) {
      setIsAddFundsOpen(true);
      return;
    }
    const success = onClaimLead(lead.id, lead.leadFee);
    if (success) {
      setActiveTab('my_jobs');
    }
  };

  // Submit Add Funds
  const handleProcessAddFunds = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    setTimeout(() => {
      let bonus = 0;
      if (selectedPackAmount === 250) bonus = 25;
      if (selectedPackAmount === 500) bonus = 75;
      const totalCredits = selectedPackAmount + bonus;

      onAddWalletFunds(totalCredits, `Purchased $${selectedPackAmount} Lead Credits (+ $${bonus} Bonus)`);
      setIsProcessingPayment(false);
      setPaymentSuccessMsg(`Successfully added $${totalCredits} lead credits to your wallet!`);
      setTimeout(() => {
        setPaymentSuccessMsg('');
        setIsAddFundsOpen(false);
      }, 2000);
    }, 1200);
  };

  // Submit Collect Customer Payment
  const handleProcessCollectPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadForPayment) return;
    setIsCollecting(true);
    setTimeout(() => {
      onCollectCustomerPayment(selectedLeadForPayment.id, collectAmount, collectMethod);
      setIsCollecting(false);
      setSelectedLeadForPayment(null);
    }, 1000);
  };

  // Stats calculation
  const totalClaimedValue = myClaimedLeads.reduce((sum, l) => sum + l.jobEstimateValue, 0);
  const totalCollectedRevenue = myClaimedLeads.reduce(
    (sum, l) => sum + (l.paymentDetails?.collectedAmount || 0),
    0
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          {/* Company Info */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED CONTRACTOR
              </span>
              <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-slate-700">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {contractor.rating} Rating ({contractor.completedJobsCount} Jobs)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Building2 className="w-7 h-7 text-amber-400" />
              {contractor.companyName}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 font-medium flex items-center gap-2">
              <span>Lic #: {contractor.licenseNumber}</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                24/7 Dispatch Online
              </span>
            </p>
          </div>

          {/* Wallet Balance Widget */}
          <div className="bg-slate-800/80 border border-slate-700/80 p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-6 shadow-inner">
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-amber-400" />
                Lead Wallet Balance
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight mt-0.5">
                ${contractor.walletBalance.toFixed(2)}
              </div>
            </div>

            <button
              onClick={() => setIsAddFundsOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Add Credits
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] font-semibold text-slate-400">Available Marketplace Leads</div>
            <div className="text-xl font-bold text-white mt-1">{availableLeads.length} Leads</div>
          </div>
          <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] font-semibold text-slate-400">My Claimed Jobs</div>
            <div className="text-xl font-bold text-amber-400 mt-1">{myClaimedLeads.length} Active</div>
          </div>
          <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] font-semibold text-slate-400">Claimed Pipeline Value</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">${totalClaimedValue.toLocaleString()}</div>
          </div>
          <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] font-semibold text-slate-400">Direct Customer Payments</div>
            <div className="text-xl font-bold text-blue-400 mt-1">${totalCollectedRevenue.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'marketplace'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4 text-amber-600" />
            Lead Marketplace ({availableLeads.length})
          </button>

          <button
            onClick={() => setActiveTab('my_jobs')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'my_jobs'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            My Claimed Jobs & Invoicing ({myClaimedLeads.length})
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'wallet'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4 text-blue-600" />
            Wallet & Payments
          </button>
        </div>

        {/* Lead Filter controls when in marketplace */}
        {activeTab === 'marketplace' && (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter:</span>
            <button
              onClick={() => setLeadFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg ${
                leadFilter === 'ALL' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-200 text-slate-700'
              }`}
            >
              All Leads
            </button>
            <button
              onClick={() => setLeadFilter('EMERGENCY')}
              className={`px-2.5 py-1 rounded-lg ${
                leadFilter === 'EMERGENCY' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-200 text-slate-700'
              }`}
            >
              Emergency Tarping
            </button>
            <button
              onClick={() => setLeadFilter('ESTIMATE')}
              className={`px-2.5 py-1 rounded-lg ${
                leadFilter === 'ESTIMATE' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-200 text-slate-700'
              }`}
            >
              Quotes
            </button>
          </div>
        )}
      </div>

      {/* Tab Content 1: Marketplace */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          {availableLeads.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 card-shadow space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center text-2xl">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-slate-900">No Unclaimed Leads in Marketplace</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                You have claimed all active emergency tarping and quote leads in your service radius! New storm alerts will automatically push live leads here.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white rounded-3xl border-2 border-slate-200 card-shadow hover:border-amber-500 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-6 space-y-4">
                    {/* Top Row: Type & Severity */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                          lead.type === 'EMERGENCY_TARP'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {lead.type === 'EMERGENCY_TARP' ? '⚡ 24/7 EMERGENCY TARP' : '📋 FREE INSPECTION QUOTE'}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just Now'}
                      </span>
                    </div>

                    {/* Neighborhood & Job Value */}
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        {lead.neighborhood} ({lead.zipCode})
                      </div>
                      <div className="text-lg font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors">
                        Estimated Job: ${lead.jobEstimateValue.toLocaleString()}
                      </div>
                    </div>

                    {/* Roof Spec Grid */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold block text-[10px]">ROOF TYPE</span>
                        <span className="font-bold text-slate-800">{lead.roofMaterial.replace('_', ' ')}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block text-[10px]">PITCH / STORIES</span>
                        <span className="font-bold text-slate-800">
                          {lead.stories} Story • {lead.roofPitch.replace('_', ' ')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block text-[10px]">DAMAGE SQ FT</span>
                        <span className="font-bold text-slate-800">{lead.sqFt} Sq Ft</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block text-[10px]">WATER LEAK</span>
                        <span className={`font-bold ${lead.hasActiveLeak ? 'text-red-600' : 'text-slate-700'}`}>
                          {lead.hasActiveLeak ? '⚠️ ACTIVE LEAK' : 'No Leak Reported'}
                        </span>
                      </div>
                    </div>

                    {/* Notes */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed italic bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                      "{lead.notes}"
                    </p>

                    {/* Blurred Address Privacy Lock */}
                    <div className="bg-slate-100 border border-slate-200 p-2.5 rounded-xl flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        Address & Phone Locked
                      </span>
                      <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-bold text-slate-700">
                        Reveals Upon Claiming
                      </span>
                    </div>
                  </div>

                  {/* Claim Button Footer */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lead Claim Fee</div>
                      <div className="text-base font-black text-slate-900">${lead.leadFee}.00</div>
                    </div>

                    <button
                      onClick={() => handleClaim(lead)}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all active:scale-95"
                    >
                      <span>Accept & Claim Lead</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: My Claimed Jobs & Invoicing */}
      {activeTab === 'my_jobs' && (
        <div className="space-y-6">
          {myClaimedLeads.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 card-shadow space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 mx-auto flex items-center justify-center text-2xl">
                📂
              </div>
              <h3 className="text-xl font-bold text-slate-900">No Claimed Jobs Yet</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Visit the Lead Marketplace tab to claim emergency tarping and repair leads. Once claimed, customer contacts and invoice controls will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {myClaimedLeads.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-3xl border-2 border-slate-200 card-shadow p-6 sm:p-8 space-y-6 relative overflow-hidden"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-200">
                          CLAIMED LEAD • {job.id}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          Claimed {job.claimedAt ? new Date(job.claimedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                        </span>
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 mt-1">{job.customerName}</h3>
                    </div>

                    {/* Status Badge & Status Selector */}
                    <div className="flex items-center gap-3">
                      <select
                        value={job.status}
                        onChange={(e) => onUpdateLeadStatus(job.id, e.target.value as LeadItem['status'])}
                        className="bg-slate-100 border border-slate-300 font-bold text-xs text-slate-800 rounded-xl px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      >
                        <option value="CLAIMED">Status: Claimed</option>
                        <option value="EN_ROUTE">Status: En Route to Property</option>
                        <option value="WORK_IN_PROGRESS">Status: Tarp / Work in Progress</option>
                        <option value="PAID_AND_COMPLETED">Status: Completed & Paid</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer Contact & Address Info Unlocked */}
                  <div className="grid md:grid-cols-3 gap-4 bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 text-xs">
                    <div className="space-y-1">
                      <div className="font-bold text-amber-900 uppercase tracking-wider text-[10px] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-700" /> Property Address
                      </div>
                      <div className="font-bold text-slate-900 text-sm">{job.address}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="font-bold text-amber-900 uppercase tracking-wider text-[10px] flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-amber-700" /> Phone Contact
                      </div>
                      <a
                        href={`tel:${job.phone}`}
                        className="font-extrabold text-amber-700 text-sm hover:underline flex items-center gap-1"
                      >
                        {job.phone}
                      </a>
                    </div>

                    <div className="space-y-1">
                      <div className="font-bold text-amber-900 uppercase tracking-wider text-[10px] flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-amber-700" /> Email
                      </div>
                      <div className="font-bold text-slate-900 text-sm truncate">{job.email}</div>
                    </div>
                  </div>

                  {/* Job Specs & Notes */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-slate-400 font-bold block text-[10px]">ESTIMATED JOB VALUE</span>
                      <span className="text-base font-extrabold text-slate-900">${job.jobEstimateValue.toLocaleString()}</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-slate-400 font-bold block text-[10px]">LEAD CLAIM FEE</span>
                      <span className="text-base font-bold text-slate-700">${job.leadFee}.00 Paid</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-slate-400 font-bold block text-[10px]">ROOF SPEC</span>
                      <span className="font-bold text-slate-800">
                        {job.stories} Story • {job.roofMaterial.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-slate-400 font-bold block text-[10px]">PAYMENT STATUS</span>
                      <span className="font-extrabold text-emerald-600">
                        {job.paymentDetails
                          ? `$${job.paymentDetails.collectedAmount.toLocaleString()} Collected`
                          : 'Pending Customer Payment'}
                      </span>
                    </div>
                  </div>

                  {/* Action Bar: Collect Payment / Invoice */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-xs text-slate-500 font-medium italic">
                      "{job.notes}"
                    </div>

                    <div className="flex items-center gap-3">
                      <a
                        href={`tel:${job.phone}`}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-amber-400" /> Call Customer
                      </a>

                      <button
                        onClick={() => {
                          setSelectedLeadForPayment(job);
                          setCollectAmount(job.jobEstimateValue || 850);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all active:scale-95"
                      >
                        <DollarSign className="w-4 h-4" /> Collect Payment / Invoice
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: Wallet & Billing History */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Credit Card / Balance summary card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-700 card-shadow space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" /> Contractor Wallet
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  ACTIVE
                </span>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
                  ${contractor.walletBalance.toFixed(2)}
                </div>
                <div className="text-xs text-slate-400 mt-1">Lead Credits Available</div>
              </div>

              <button
                onClick={() => setIsAddFundsOpen(true)}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Add Lead Credits Now
              </button>
            </div>

            {/* Credit Package Options Preview */}
            <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 card-shadow space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-600" />
                Lead Credit Packages & Instant Recharge
              </h3>
              <p className="text-xs text-slate-500">
                Lead credits are automatically deducted when you claim emergency tarping and quote leads in your territory.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                <div
                  onClick={() => {
                    setSelectedPackAmount(100);
                    setIsAddFundsOpen(true);
                  }}
                  className="bg-slate-50 hover:bg-amber-50/50 p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-500 cursor-pointer transition-all space-y-2 text-center"
                >
                  <div className="text-xs font-bold text-slate-500">STARTER PACK</div>
                  <div className="text-2xl font-black text-slate-900">$100</div>
                  <div className="text-[11px] font-bold text-slate-600">$100 Lead Credits</div>
                </div>

                <div
                  onClick={() => {
                    setSelectedPackAmount(250);
                    setIsAddFundsOpen(true);
                  }}
                  className="bg-amber-50/80 p-4 rounded-2xl border-2 border-amber-500 cursor-pointer transition-all space-y-2 text-center relative shadow-sm"
                >
                  <span className="absolute -top-2.5 right-3 bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    BEST VALUE
                  </span>
                  <div className="text-xs font-bold text-amber-800">PRO DISPATCH PACK</div>
                  <div className="text-2xl font-black text-amber-950">$250</div>
                  <div className="text-[11px] font-extrabold text-amber-700">+$25 BONUS ($275 Credits)</div>
                </div>

                <div
                  onClick={() => {
                    setSelectedPackAmount(500);
                    setIsAddFundsOpen(true);
                  }}
                  className="bg-slate-50 hover:bg-amber-50/50 p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-500 cursor-pointer transition-all space-y-2 text-center"
                >
                  <div className="text-xs font-bold text-slate-500">FLEET MASTER</div>
                  <div className="text-2xl font-black text-slate-900">$500</div>
                  <div className="text-[11px] font-extrabold text-emerald-600">+$75 BONUS ($575 Credits)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 1: Add Lead Credits / Top Up Wallet */}
      {isAddFundsOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setIsAddFundsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="text-xs font-extrabold text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
                <Wallet className="w-4 h-4" /> Secure Lead Wallet Deposit
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Purchase Lead Credit Pack</h3>
            </div>

            {paymentSuccessMsg ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-6 rounded-2xl text-center space-y-2 animate-fadeIn">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <div className="font-extrabold text-base">{paymentSuccessMsg}</div>
              </div>
            ) : (
              <form onSubmit={handleProcessAddFunds} className="space-y-4">
                {/* Pack Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Select Credit Package</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPackAmount(100)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        selectedPackAmount === 100
                          ? 'border-amber-500 bg-amber-50 text-amber-950 font-black'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      $100
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPackAmount(250)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        selectedPackAmount === 250
                          ? 'border-amber-500 bg-amber-50 text-amber-950 font-black'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      $250 (+$25 Free)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPackAmount(500)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        selectedPackAmount === 500
                          ? 'border-amber-500 bg-amber-50 text-amber-950 font-black'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      $500 (+$75 Free)
                    </button>
                  </div>
                </div>

                {/* Simulated Payment Card Info */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Payment Method</span>
                    <span className="text-[10px] text-slate-400 font-normal">256-Bit SSL Encrypted</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        required
                      />
                      <CreditCard className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">Expires</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">CVC / CVV</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 mt-4"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      Processing Charge...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Pay ${selectedPackAmount}.00 & Deposit Credits
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal 2: Collect Customer Payment / Invoicing */}
      {selectedLeadForPayment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setSelectedLeadForPayment(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" /> Customer Direct Invoicing
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Collect Payment for {selectedLeadForPayment.customerName}
              </h3>
              <p className="text-xs text-slate-500">{selectedLeadForPayment.address}</p>
            </div>

            <form onSubmit={handleProcessCollectPayment} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Payment / Deposit Amount ($)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    value={collectAmount}
                    onChange={(e) => setCollectAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3.5 py-2.5 text-sm font-extrabold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Payment Method</label>
                <select
                  value={collectMethod}
                  onChange={(e) =>
                    setCollectMethod(e.target.value as 'CREDIT_CARD' | 'INSURANCE_CLAIM' | 'FINANCING')
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="CREDIT_CARD">Customer Credit / Debit Card Terminal</option>
                  <option value="INSURANCE_CLAIM">Direct Insurance Claim Draft Check</option>
                  <option value="FINANCING">Roofing Emergency Financing</option>
                </select>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">Instant Digital Receipt</div>
                <p>
                  Upon clicking process, an official receipt will be generated and logged to your contractor account history and emailed to {selectedLeadForPayment.email}.
                </p>
              </div>

              <button
                type="submit"
                disabled={isCollecting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 mt-4"
              >
                {isCollecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Recording Payment...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Process & Record ${collectAmount.toLocaleString()} Payment
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
