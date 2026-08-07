import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Sparkles, 
  ShieldAlert, 
  Siren, 
  Clock, 
  Truck, 
  CheckCircle2, 
  Zap, 
  Bot, 
  PhoneCall, 
  HardHat, 
  Flame,
  Umbrella
} from 'lucide-react';
import { runEmergencyTriage } from '../lib/gemini';
import { GeminiTriageResponse, ContractorProfile, DispatchTicket } from '../types';

interface AIEmergencyTriageAssistantProps {
  availableContractors?: ContractorProfile[];
  onDispatchCreated?: (ticket: Partial<DispatchTicket>) => void;
}

export const AIEmergencyTriageAssistant: React.FC<AIEmergencyTriageAssistantProps> = ({
  availableContractors = [],
  onDispatchCreated,
}) => {
  // Input fields
  const [customerName, setCustomerName] = useState('Marcus Vance');
  const [phone, setPhone] = useState('(214) 555-0192');
  const [address, setAddress] = useState('1204 Pine Valley Rd, Fort Worth, TX');
  const [leakSeverity, setLeakSeverity] = useState('Water Streaming Through Living Room Light Fixtures');
  const [treeImpact, setTreeImpact] = useState(true);
  const [weatherForecast, setWeatherForecast] = useState('Heavy Rain & 60mph Wind Gusts Next 12 Hours');
  const [notes, setNotes] = useState('Oak tree branch punctured roof deck during storm. Active leak directly above electrical box.');

  // AI State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [triageResult, setTriageResult] = useState<GeminiTriageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dispatched, setDispatched] = useState(false);

  // Default contractors if none provided
  const mockContractors = availableContractors.length > 0 ? availableContractors : [
    {
      id: 'CREW-804',
      companyName: 'Apex Storm Response & Rapid Tarping',
      contactName: 'David Sterling',
      phone: '(706) 740-0529',
      email: 'apex@roofresponse.com',
      licenseNumber: 'TX-ROOF-99412',
      rating: 4.9,
      completedJobsCount: 142,
      isAvailable247: true,
      walletBalance: 450,
    },
    {
      id: 'CREW-201',
      companyName: 'Lone Star Emergency Roofing Crew',
      contactName: 'Maria Rodriguez',
      phone: '(214) 888-2041',
      email: 'maria@lonestarroof.com',
      licenseNumber: 'TX-ROOF-11048',
      rating: 4.8,
      completedJobsCount: 98,
      isAvailable247: true,
      walletBalance: 320,
    },
    {
      id: 'CREW-105',
      companyName: 'ProShield Rapid Tarp Specialists',
      contactName: 'James Carter',
      phone: '(817) 400-3321',
      email: 'jcarter@proshield.com',
      licenseNumber: 'TX-ROOF-77201',
      rating: 4.7,
      completedJobsCount: 65,
      isAvailable247: false,
      walletBalance: 180,
    },
  ];

  const handleRunTriage = async () => {
    setIsAnalyzing(true);
    setError(null);

    const emergencyData = {
      customerName,
      phone,
      address,
      leakSeverity,
      treeImpact,
      weatherForecast,
      notes,
    };

    try {
      const result = await runEmergencyTriage(emergencyData, mockContractors);
      setTriageResult(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Emergency triage calculation failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDispatchTopCrew = (contractorName: string) => {
    if (onDispatchCreated && triageResult) {
      onDispatchCreated({
        customerName,
        phone,
        address,
        serviceType: 'EMERGENCY_TARPING',
        roofMaterial: 'ASPHALT_SHINGLE',
        roofPitch: 'STEEP_PITCH',
        estimatedDamageAreaSqFt: 450,
        status: 'DISPATCHED',
        notes: `[24/7 AI Smart Triage - Severity ${triageResult.severityScore}/100]: ${triageResult.hazardAssessment}`,
      });
    }
    setDispatched(true);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
            <Siren className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            24/7 AI Emergency Loss Triage & Smart Dispatch
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Smart Triage & Contractor Prioritization Engine
          </h2>
          <p className="text-sm text-slate-300 max-w-xl">
            Instantly analyzes structural roof leaks, tree strikes, and weather threats using Gemini AI. Ranks available 24/7 emergency crews by gear fit and proximity.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center shrink-0 w-full md:w-auto">
          <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">AI Severity Index</div>
          <div className="text-3xl font-black text-red-400 font-mono">
            {triageResult ? `${triageResult.severityScore}/100` : 'CALCULATING'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {triageResult ? triageResult.urgencyCategory : 'Awaiting Triage Input'}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Triage Intake Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 card-shadow space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-red-600" />
            24/7 Emergency Loss Caller Intake
          </h3>

          <div className="space-y-3 text-xs font-semibold">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1">Homeowner / Caller Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Direct Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Loss Property Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Active Water Intrusion & Leak Rate</label>
              <select
                value={leakSeverity}
                onChange={(e) => setLeakSeverity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-red-500"
              >
                <option value="Water Streaming Through Living Room Light Fixtures">🚨 Rapid Streaming Through Ceiling / Light Fixtures</option>
                <option value="Active Dripping in Multiple Rooms">💧 Active Dripping in Multiple Rooms</option>
                <option value="Drywall Ceiling Sagging / Bulging">⚠️ Drywall Ceiling Bulging / Heavy Water Weight</option>
                <option value="Minor Slow Drip Near Attic Access">🟡 Slow Attic Drip</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Incoming Storm / Weather Threat</label>
              <input
                type="text"
                value={weatherForecast}
                onChange={(e) => setWeatherForecast(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-red-500"
              />
            </div>

            <label className="flex items-center gap-2.5 p-3 bg-red-50 rounded-xl border border-red-200 cursor-pointer">
              <input
                type="checkbox"
                checked={treeImpact}
                onChange={(e) => setTreeImpact(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 h-4 w-4"
              />
              <span className="text-red-950 font-bold">Fallen Tree / Heavy Structural Impact on Roof Deck</span>
            </label>

            <div>
              <label className="block text-slate-700 mb-1">Caller Observations & Damage Notes</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleRunTriage}
            disabled={isAnalyzing}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-black text-xs py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 border border-red-700 active:scale-98 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            {isAnalyzing ? 'Gemini AI Analyzing Emergency Hazards...' : 'Run 24/7 Gemini Smart Triage'}
          </button>
        </div>

        {/* Right Output Dashboard */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-red-900">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Triage Analysis Error
              </div>
              <p>{error}</p>
            </div>
          )}

          {triageResult ? (
            <div className="space-y-6">
              
              {/* Urgency & Severity Card */}
              <div className={`p-6 rounded-3xl border shadow-xl text-white space-y-4 ${
                triageResult.urgencyCategory === 'CRITICAL'
                  ? 'bg-gradient-to-br from-red-950 via-slate-900 to-slate-950 border-red-500/50'
                  : 'bg-slate-900 border-amber-500/40'
              }`}>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6 text-red-400" />
                    <div>
                      <div className="text-xs font-bold text-red-400 uppercase tracking-widest">
                        EMERGENCY URGENCY CATEGORY
                      </div>
                      <h3 className="text-xl font-black text-white">{triageResult.urgencyCategory} (Severity Score: {triageResult.severityScore}/100)</h3>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-red-500/20 text-red-300 font-mono text-xs font-bold rounded-full border border-red-500/40 animate-pulse">
                    IMMEDIATE DISPATCH
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-400" />
                    Hazard & Structural Threat Assessment:
                  </div>
                  <p className="text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    {triageResult.hazardAssessment}
                  </p>
                </div>

                {/* Recommended Equipment */}
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-slate-300 flex items-center gap-1.5">
                    <HardHat className="w-4 h-4 text-amber-400" />
                    Required Emergency Rigging & Equipment:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {triageResult.recommendedEquipment.map((eq, idx) => (
                      <span key={idx} className="bg-slate-800 text-amber-300 px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-slate-700">
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Homeowner Advice */}
                <div className="space-y-2 text-xs bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Umbrella className="w-4 h-4 text-amber-400" />
                    Homeowner Interim Safety Guidance (Relay to Caller):
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-200 text-[11px]">
                    {triageResult.homeownerInterimAdvice.map((adv, idx) => (
                      <li key={idx}>{adv}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Contractor Crew Prioritization */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 card-shadow space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-slate-900" />
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Smart Contractor Crew Prioritization Ranking
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">Ranked by Gemini AI</span>
                </div>

                <div className="space-y-3">
                  {triageResult.contractorPrioritization.map((cp, rank) => (
                    <div
                      key={cp.contractorId}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        rank === 0
                          ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/30'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                            rank === 0 ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-700'
                          }`}>
                            #{rank + 1}
                          </span>
                          <span className="font-bold text-slate-900 text-xs">{cp.companyName}</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            {cp.suitabilityScore}% Match
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 pl-8">{cp.matchingReason}</p>
                      </div>

                      <button
                        onClick={() => handleDispatchTopCrew(cp.companyName)}
                        disabled={dispatched}
                        className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                          dispatched
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-900 hover:bg-slate-800 text-amber-400'
                        }`}
                      >
                        {dispatched ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-white" />
                            Crew Dispatched!
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 text-amber-400" />
                            Dispatch Crew
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <Bot className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-700 text-sm">24/7 Smart Emergency Triage Ready</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Fill in emergency caller details on the left and click <strong>"Run 24/7 Gemini Smart Triage"</strong> to calculate severity score and prioritize contractor dispatch.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
