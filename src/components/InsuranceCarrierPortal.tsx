import React, { useState } from 'react';
import tarpImg from '../assets/images/emergency_roof_tarp_1786018839293.jpg';
import damageImg from '../assets/images/roof_damage_inspection_1786018855423.jpg';
import waterDamageImg from '../assets/images/water_damage_ceiling_1786018870888.jpg';
import { 
  ShieldCheck, 
  TrendingDown, 
  FileText, 
  Smartphone, 
  Users, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  DollarSign, 
  Copy, 
  Check, 
  Send, 
  Sparkles, 
  Download, 
  Zap, 
  Camera, 
  BarChart3, 
  ShieldAlert, 
  Award,
  QrCode,
  Share2
} from 'lucide-react';

export const InsuranceCarrierPortal: React.FC = () => {
  // Calculator state for Insurance Executive Savings Model
  const [policyholderCount, setPolicyholderCount] = useState<number>(10000);
  const [stormEventRate, setStormEventRate] = useState<number>(5); // 5% of homes experience severe weather/year
  const [avgUnmitigatedClaim, setAvgUnmitigatedClaim] = useState<number>(18500); // $18,500 avg claim with water intrusion/mold
  const [avgTarpedClaim, setAvgTarpedClaim] = useState<number>(2400); // $2,400 avg claim when tarped within 1 hour

  // Co-Branded Link Generator state
  const [selectedCarrier, setSelectedCarrier] = useState<string>('State Farm Insurance');
  const [agencyName, setAgencyName] = useState<string>('Heritage Mutual Agency');
  const [agentId, setAgentId] = useState<string>('AG-9042');
  const [testPhone, setTestPhone] = useState<string>('(555) 234-5678');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSmsSent, setIsSmsSent] = useState<boolean>(false);

  // Math calculation
  const impactedHomes = Math.round(policyholderCount * (stormEventRate / 100));
  const totalCostWithoutApp = impactedHomes * avgUnmitigatedClaim;
  const totalCostWithApp = impactedHomes * avgTarpedClaim;
  const netAnnualSavings = totalCostWithoutApp - totalCostWithApp;

  const sampleInviteLink = `https://a-newroof.com/insured?carrier=${encodeURIComponent(selectedCarrier)}&agent=${agentId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sampleInviteLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSendTestSms = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSmsSent(true);
    setTimeout(() => setIsSmsSent(false), 4000);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white rounded-3xl p-6 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Background Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            Homeowners Insurance Carrier B2B Platform
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Protect Policyholders. Stop Water Loss Claims. Provide a Free 24/7 Emergency App.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
            We provide Homeowners Insurance Companies with a turnkey, co-branded mobile app for policyholders. When storms hit, insureds tap one button to dispatch immediate heavy-duty tarping crews, preventing $15,000+ interior water damage claims while giving adjusters instant First Notice of Loss (FNOL) photo reports.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 pt-4 text-left">
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-2xl font-black text-emerald-400">$16,100</div>
              <div className="text-xs font-bold text-slate-300">Avg Water Claim Saved / Event</div>
              <div className="text-[11px] text-slate-400">By stopping active rain leaks under 1 hour</div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-2xl font-black text-blue-400">100% Free</div>
              <div className="text-xs font-bold text-slate-300">To Policyholders & Insurers</div>
              <div className="text-[11px] text-slate-400">Funded via verified contractor marketplace</div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-2xl font-black text-amber-400">Instant FNOL</div>
              <div className="text-xs font-bold text-slate-300">Adjuster Photo & GPS Audit</div>
              <div className="text-[11px] text-slate-400">Timestamped proof of initial loss severity</div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Photography & Partner Ecosystem Showcase */}
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
            <TrendingDown className="w-3.5 h-3.5" />
            Catastrophic Loss Prevention Engine
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            How The 3-Way Ecosystem Works
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            Instead of operating as a traditional single roofing company, A-NewRoof connects <strong>Insured Homeowners</strong>, <strong>Insurance Carriers</strong>, and <strong>Licensed Roofing Contractors</strong> into a unified emergency loss mitigation exchange.
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0 text-sm">
                1
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">Insured Policyholders Download for Free</div>
                <p className="text-xs text-slate-500">
                  Carrier emails or texts policyholders a complimentary emergency perk link during policy sign-up or renewal.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0 text-sm">
                2
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">1-Tap Emergency Dispatch & Photo Intake</div>
                <p className="text-xs text-slate-500">
                  During hail/wind storms, the policyholder opens the app, uploads roof photos, and dispatches nearest rapid-tarp unit in ~24 mins.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0 text-sm">
                3
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">Roofing Contractor Network Pays Lead Fee</div>
                <p className="text-xs text-slate-500">
                  Pre-vetted local roofing companies buy/claim emergency tarp jobs and full roof restoration leads from the contractor portal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Real Visual Photo Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 group">
              <img 
                src={tarpImg} 
                alt="Emergency Tarping in Progress" 
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-3 flex flex-col justify-end text-white">
                <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded uppercase w-max mb-1">
                  Immediate Loss Mitigation
                </span>
                <span className="text-xs font-bold">Heavy-Duty Tarp Installation</span>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 group">
              <img 
                src={damageImg} 
                alt="Storm Roof Damage Photo Audit" 
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-3 flex flex-col justify-end text-white">
                <span className="text-[10px] bg-blue-500 text-white font-bold px-2 py-0.5 rounded uppercase w-max mb-1">
                  Adjuster Photo Audit
                </span>
                <span className="text-xs font-bold">FNOL Geotagged Proof</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 group">
              <img 
                src={waterDamageImg} 
                alt="Prevent Ceiling Mold & Water Damage" 
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-3 flex flex-col justify-end text-white">
                <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded uppercase w-max mb-1">
                  Prevented $25,000 Mold
                </span>
                <span className="text-xs font-bold">Water Leak Stopped Early</span>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                Carrier Loyalty Perk
              </div>
              <div className="text-sm font-black text-white">98.4% Policy Renewal Rate</div>
              <p className="text-[11px] text-slate-300">
                Insurers offering our free emergency app report 24% higher policyholder retention after major hail/wind weather events.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Insurance Loss Mitigation Savings Calculator */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-10 card-shadow space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4" />
              Insurance Executive ROI Model
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Loss Mitigation Savings Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Estimate annual claim payout savings for your covered policyholder book of business.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl shrink-0 text-center md:text-right">
            <div className="text-xs font-extrabold uppercase text-emerald-700">Estimated Annual Carrier Savings</div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">
              ${netAnnualSavings.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Slider 1: Policyholder Count */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>Covered Policyholders</span>
              <span className="text-blue-600 font-black">{policyholderCount.toLocaleString()} homes</span>
            </div>
            <input 
              type="range" 
              min="1000" 
              max="100000" 
              step="1000"
              value={policyholderCount} 
              onChange={(e) => setPolicyholderCount(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Total active homeowner policies in book.</p>
          </div>

          {/* Slider 2: Annual Severe Weather Rate */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>Annual Storm Damage Rate</span>
              <span className="text-amber-600 font-black">{stormEventRate}% of homes</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="20" 
              step="1"
              value={stormEventRate} 
              onChange={(e) => setStormEventRate(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Hail, wind, or tree storm incidents per year.</p>
          </div>

          {/* Slider 3: Unmitigated Claim Cost */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>Avg Un-tarped Claim Cost</span>
              <span className="text-red-600 font-black">${avgUnmitigatedClaim.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="10000" 
              max="40000" 
              step="1000"
              value={avgUnmitigatedClaim} 
              onChange={(e) => setAvgUnmitigatedClaim(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Includes ceiling collapse, drywall, and mold.</p>
          </div>

          {/* Slider 4: Mitigated Tarped Claim Cost */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>Avg Tarp-Protected Claim</span>
              <span className="text-emerald-600 font-black">${avgTarpedClaim.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="1000" 
              max="5000" 
              step="200"
              value={avgTarpedClaim} 
              onChange={(e) => setAvgTarpedClaim(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Damage limited strictly to exterior roof area.</p>
          </div>
        </div>

        {/* Impact Summary Bar */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 grid sm:grid-cols-3 gap-4 text-center">
          <div className="border-r border-slate-800 last:border-0 pr-2">
            <div className="text-xs text-slate-400">Estimated Storm Impacted Homes</div>
            <div className="text-2xl font-black text-amber-400">{impactedHomes.toLocaleString()} Properties</div>
          </div>

          <div className="border-r border-slate-800 last:border-0 pr-2">
            <div className="text-xs text-slate-400">Claims Payout Without Tarp App</div>
            <div className="text-2xl font-black text-red-400">${totalCostWithoutApp.toLocaleString()}</div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Claims Payout With A-NewRoof App</div>
            <div className="text-2xl font-black text-emerald-400">${totalCostWithApp.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Co-Branded Policyholder Invite Link & SMS Generator for Agents */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider mb-2">
              <Share2 className="w-3.5 h-3.5" />
              Insurance Agent & Adjuster Utility
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Generate Co-Branded Policyholder Download Links
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Send your insured policyholders a customized link or SMS to download the free emergency tarp app.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 text-xs font-mono text-amber-400 shrink-0">
            <QrCode className="w-4 h-4" />
            <span>Co-Branding Active</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Insurance Carrier</label>
            <select
              value={selectedCarrier}
              onChange={(e) => setSelectedCarrier(e.target.value)}
              className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-400"
            >
              <option value="State Farm Insurance">State Farm Insurance</option>
              <option value="Allstate Protection">Allstate Protection</option>
              <option value="Farmers Insurance Group">Farmers Insurance Group</option>
              <option value="Liberty Mutual">Liberty Mutual</option>
              <option value="USAA Insurance">USAA Insurance</option>
              <option value="Nationwide Mutual">Nationwide Mutual</option>
              <option value="Travelers Insurance">Travelers Insurance</option>
              <option value="Progressive Home">Progressive Home</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Insurance Agency Name</label>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-400"
              placeholder="Agency Name"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Agent / Producer ID</label>
            <input
              type="text"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-400"
              placeholder="Agent ID"
            />
          </div>
        </div>

        {/* Generated Link Display & Copy */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300">Generated Co-Branded Invite Link</label>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              readOnly
              value={sampleInviteLink}
              className="w-full bg-slate-950 text-amber-400 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono select-all focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Copied Link!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Send Test SMS Form */}
        <form onSubmit={handleSendTestSms} className="pt-4 border-t border-slate-800 space-y-3">
          <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-blue-400" />
            Send Direct Policyholder Invite SMS
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="tel"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              placeholder="Policyholder Phone Number"
              className="w-full sm:max-w-xs bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-400"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Invite SMS Now</span>
            </button>
          </div>

          {isSmsSent && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2 font-medium animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Policyholder SMS Sent to {testPhone}! Free download link delivered with {selectedCarrier} co-branding.</span>
            </div>
          )}
        </form>
      </div>

      {/* Compatible Carrier Partners Badge Wall */}
      <div className="bg-slate-100 rounded-3xl p-6 text-center space-y-4 border border-slate-200">
        <div className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
          Compatible With Major Homeowners Insurance Carriers
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-extrabold text-slate-700">
          {[
            'State Farm',
            'Allstate',
            'Farmers Insurance',
            'Liberty Mutual',
            'USAA',
            'Nationwide',
            'Travelers',
            'Progressive Home',
            'Auto-Owners',
            'Chubb',
            'Erie Insurance'
          ].map((carrier, i) => (
            <span 
              key={i} 
              className="bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-sm text-slate-800 hover:border-amber-500 transition-colors"
            >
              🛡️ {carrier}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
