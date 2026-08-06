import React from 'react';
import { 
  AlertTriangle, 
  ClipboardCheck, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Camera, 
  PhoneCall, 
  CheckCircle2, 
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';

interface WelcomeHeroProps {
  onSelectStandardEstimate: () => void;
  onSelectEmergencyDispatch: () => void;
  activeTicketCount: number;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  onSelectStandardEstimate,
  onSelectEmergencyDispatch,
  activeTicketCount,
}) => {
  return (
    <div className="space-y-8 pb-12">
      {/* Brand Hero Header */}
      <div className="text-center space-y-4 pt-4 sm:pt-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-700 border border-blue-500/20 text-xs font-extrabold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Insurance Loss Mitigation & Rapid Response Platform
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          A-NewRoof Emergency Response Platform
        </h1>
        
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
          The free emergency tarping & damage reporting app that Homeowners Insurance Companies provide to insured policyholders to stop costly water damage, paired with a paid dispatch marketplace for licensed roofing contractors.
        </p>

        {/* 3 Ecosystem Users Callout Cards */}
        <div className="grid sm:grid-cols-3 gap-3 pt-3 text-left">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 card-shadow flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-base font-bold">
              🏡
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">For Insured Homeowners</div>
              <p className="text-[11px] text-slate-500 leading-snug">100% Free emergency tarp app provided via home insurance.</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 card-shadow flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-base font-bold">
              🛡️
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">For Insurance Carriers</div>
              <p className="text-[11px] text-slate-500 leading-snug">Stops $15,000+ water/mold claims with instant FNOL photo audit.</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 card-shadow flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 text-base font-bold">
              🔨
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">For Roofing Companies</div>
              <p className="text-[11px] text-slate-500 leading-snug">Marketplace to buy/claim high-intent tarping & replacement leads.</p>
            </div>
          </div>
        </div>

        {/* Live Status Pill Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-600 pt-1">
          <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Under 1 Hour Tarp Crew Arrival
          </span>
          <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Zero Friction Policyholder App
          </span>
          <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            GPS Geotagged Adjuster Audit
          </span>
        </div>
      </div>

      {/* Primary Dashboard Choices (Standard Estimate vs 24/7 Emergency Dispatch) */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4">
        
        {/* Choice A: Standard Maintenance / Estimate */}
        <div 
          onClick={onSelectStandardEstimate}
          className="group relative bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 card-shadow transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              📋
            </div>
            
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                Standard Care & Maintenance
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Schedule a Free Estimate
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Routine roof inspections, preventative flashing maintenance, minor leak repairs, or full asphalt/metal roof replacements. Request a detailed digital itemized quote.
            </p>

            <ul className="space-y-2 pt-2 text-xs font-medium text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Free 21-Point Roof Safety & Attic Moisture Audit
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Instant Material & Labor Cost Breakdown
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                No-Obligation Flexible Scheduling
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between font-bold text-slate-900 text-sm group-hover:text-blue-600">
            <span>Calculate Instant Estimate</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Choice B: Urgent Emergency Service */}
        <div 
          onClick={onSelectEmergencyDispatch}
          className="group relative bg-white p-6 sm:p-8 rounded-3xl border-2 border-amber-500 emergency-glow hover:bg-amber-50/40 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          {/* Active Dispatch Badge */}
          <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 px-3.5 py-1 text-[10px] font-black tracking-widest uppercase rounded-bl-xl shadow-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            24/7 ACTIVE DISPATCH
          </div>

          <div className="space-y-4 pt-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              ⚠️
            </div>

            <div>
              <div className="text-xs font-black text-amber-600 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                Immediate Action Required
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-amber-600 transition-colors flex items-center gap-2">
                Emergency Tarping & Leak Patching
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Active storm damage, tree impact, or sudden severe ceiling leak? Press here to capture photo evidence and dispatch our nearest rapid-tarp unit right now.
            </p>

            <div className="bg-amber-50 border border-amber-200/80 p-3 rounded-xl space-y-1.5 text-xs text-amber-950">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <Camera className="w-3.5 h-3.5 text-amber-700" />
                Damage Capture & Insurance Lock
              </div>
              <p className="text-[11px] text-amber-800">
                We generate direct loss mitigation paperwork formatted specifically for your insurance adjuster claims.
              </p>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between font-extrabold text-amber-700 text-sm group-hover:text-amber-800">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 fill-amber-500" />
              Dispatch Emergency Crew Now
            </span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* Hotline Direct Call Banner */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                Prefer to Speak with a Dispatch Officer?
              </div>
              <div className="text-lg font-extrabold text-white">
                Emergency Hotline: (706) 740-0529
              </div>
              <div className="text-xs text-slate-400">
                Live dispatchers standing by 24 hours a day, 365 days a year.
              </div>
            </div>
          </div>

          <a
            href="tel:7067400529"
            className="w-full md:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3 rounded-xl text-center shadow-lg transition-all active:scale-95 whitespace-nowrap"
          >
            CALL (706) 740-0529
          </a>
        </div>
      </div>

      {/* 4 Step Process Guarantee */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">How Emergency Roof Tarping Works</h3>
          <p className="text-xs text-slate-500">From storm distress to fully sealed protection in 4 simple steps</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-extrabold mx-auto flex items-center justify-center text-xs">
              1
            </div>
            <div className="text-xs font-bold text-slate-900">GPS & Photo Intake</div>
            <p className="text-[11px] text-slate-500">Confirm address & upload roof damage photos.</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-extrabold mx-auto flex items-center justify-center text-xs">
              2
            </div>
            <div className="text-xs font-bold text-slate-900">Crew Unit Dispatched</div>
            <p className="text-[11px] text-slate-500">Nearest heavy tarp unit en route within mins.</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-extrabold mx-auto flex items-center justify-center text-xs">
              3
            </div>
            <div className="text-xs font-bold text-slate-900">Heavy Tarp Secured</div>
            <p className="text-[11px] text-slate-500">Heavy-duty UV tarp anchored & nail-sealed.</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-extrabold mx-auto flex items-center justify-center text-xs">
              4
            </div>
            <div className="text-xs font-bold text-slate-900">Insurance Claim Doc</div>
            <p className="text-[11px] text-slate-500">Download formatted loss mitigation summary.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
