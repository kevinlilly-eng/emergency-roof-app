import React, { useState } from 'react';
import { 
  Calculator, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  DollarSign, 
  Home, 
  AlertCircle,
  FileCheck,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RoofMaterial, RoofPitch, EstimateRequest } from '../types';
import { calculateRoofEstimate, MATERIAL_MULTIPLIERS, PITCH_MULTIPLIERS } from '../utils/calculator';

interface EstimateCalculatorProps {
  onEstimateSubmitted?: (request: EstimateRequest) => void;
}

export const EstimateCalculator: React.FC<EstimateCalculatorProps> = ({ onEstimateSubmitted }) => {
  const [sqFt, setSqFt] = useState<number>(1800);
  const [material, setMaterial] = useState<RoofMaterial>('ASPHALT_SHINGLE');
  const [pitch, setPitch] = useState<RoofPitch>('MEDIUM_PITCH');
  const [stories, setStories] = useState<number>(1);
  const [serviceType, setServiceType] = useState<EstimateRequest['serviceType']>('LEAK_REPAIR');
  const [isEmergency, setIsEmergency] = useState<boolean>(false);

  // Form Booking State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [timeline, setTimeline] = useState<EstimateRequest['targetTimeline']>('ASAP');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const calc = calculateRoofEstimate({
    sqFt,
    material,
    pitch,
    stories,
    isEmergency,
  });

  const handleSubmitEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const request: EstimateRequest = {
      id: `EST-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      name,
      phone,
      email,
      address: address || 'Local Residential Property',
      serviceType,
      roofMaterial: material,
      roofPitch: pitch,
      stories,
      roofSquareFootage: sqFt,
      targetTimeline: timeline,
      notes,
    };

    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    } catch (e) {
      // fallback
    }

    if (onEstimateSubmitted) {
      onEstimateSubmitted(request);
    }
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Top Banner Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <Calculator className="w-3.5 h-3.5" />
            Transparent Cost Estimator Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Roof Repair & Estimate Calculator
          </h2>
          <p className="text-sm text-slate-300 max-w-xl">
            Calculate instant estimates based on current local contractor pricing, material costs, pitch difficulty, and safety staging.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center shrink-0 w-full md:w-auto">
          <div className="text-xs text-slate-400 font-semibold">Estimated Total</div>
          <div className="text-3xl sm:text-4xl font-black text-amber-400">
            ${calc.grandTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            ~${calc.pricePerSqFt.toFixed(2)} / sq ft
          </div>
        </div>
      </div>

      {/* Main Grid: Controls Left vs Itemized Summary Right */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Sliders & Controls */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 card-shadow space-y-6">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Home className="w-5 h-5 text-amber-600" />
            Property & Roof Specifications
          </h3>

          {/* Roof Service Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Service Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setServiceType('LEAK_REPAIR')}
                className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                  serviceType === 'LEAK_REPAIR'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                💧 Minor Leak & Patch Repair
              </button>
              <button
                type="button"
                onClick={() => setServiceType('FULL_REPLACEMENT')}
                className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                  serviceType === 'FULL_REPLACEMENT'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🏠 Full Roof Replacement
              </button>
              <button
                type="button"
                onClick={() => setServiceType('INSPECTION')}
                className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                  serviceType === 'INSPECTION'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                📋 Routine Roof Audit
              </button>
              <button
                type="button"
                onClick={() => setServiceType('MAINTENANCE')}
                className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                  serviceType === 'MAINTENANCE'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🔧 Preventative Flashing Seal
              </button>
            </div>
          </div>

          {/* Roof Square Footage Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Estimated Roof Area (Sq Ft)</span>
              <span className="text-amber-600 font-extrabold text-sm">{sqFt.toLocaleString()} sq ft</span>
            </div>
            <input
              type="range"
              min="200"
              max="6000"
              step="50"
              value={sqFt}
              onChange={(e) => setSqFt(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-200 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>200 sq ft (Small Garage)</span>
              <span>2,000 sq ft (Avg Home)</span>
              <span>6,000 sq ft (Large Estate)</span>
            </div>
          </div>

          {/* Roof Material Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Roofing Material
            </label>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value as RoofMaterial)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
            >
              {Object.entries(MATERIAL_MULTIPLIERS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.name} (~${value.basePerSqFt.toFixed(2)}/sq ft base)
                </option>
              ))}
            </select>
          </div>

          {/* Roof Pitch Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Roof Pitch Steepness & Safety Grade
            </label>
            <select
              value={pitch}
              onChange={(e) => setPitch(e.target.value as RoofPitch)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
            >
              {Object.entries(PITCH_MULTIPLIERS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.name} ({value.multiplier > 1 ? `+${Math.round((value.multiplier - 1) * 100)}% labor pitch surcharge` : 'Standard'})
                </option>
              ))}
            </select>
          </div>

          {/* Stories & Height */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Property Height (Stories)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStories(s)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      stories === s
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s} {s === 1 ? 'Story' : 'Stories'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Urgency Level
              </label>
              <button
                type="button"
                onClick={() => setIsEmergency(!isEmergency)}
                className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isEmergency
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                {isEmergency ? '24/7 Emergency Tarping (+Fee)' : 'Standard Booking Schedule'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Itemized Cost Breakdown & Schedule Form */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Breakdown Card */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-extrabold text-amber-400 border-b border-slate-800 pb-3 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-400" />
              Itemized Estimate Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Base Craftsmanship Labor</span>
                <span className="font-mono font-bold">${Math.round(calc.baseLabor).toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Materials & Waterproof Membrane</span>
                <span className="font-mono font-bold">${Math.round(calc.materialCost).toLocaleString()}</span>
              </div>

              {calc.pitchSurcharge > 0 && (
                <div className="flex justify-between text-amber-300">
                  <span>Pitch Steepness Safety Adjustment</span>
                  <span className="font-mono font-bold">+${Math.round(calc.pitchSurcharge).toLocaleString()}</span>
                </div>
              )}

              {calc.heightSurcharge > 0 && (
                <div className="flex justify-between text-amber-300">
                  <span>Multi-Story Harness & Staging</span>
                  <span className="font-mono font-bold">+${Math.round(calc.heightSurcharge).toLocaleString()}</span>
                </div>
              )}

              {calc.emergencyFee > 0 && (
                <div className="flex justify-between text-red-400 font-bold">
                  <span>24/7 Rapid Emergency Callout Fee</span>
                  <span className="font-mono">+${calc.emergencyFee.toLocaleString()}</span>
                </div>
              )}

              <div className="border-t border-slate-800 pt-2 flex justify-between text-slate-400">
                <span>Estimated Sales Tax (8.25%)</span>
                <span className="font-mono">${Math.round(calc.estimatedTax).toLocaleString()}</span>
              </div>

              <div className="border-t-2 border-amber-500/40 pt-3 flex justify-between items-center text-sm font-extrabold text-white">
                <span className="text-amber-400">Grand Estimated Total</span>
                <span className="text-xl font-black text-amber-400 font-mono">
                  ${Math.round(calc.grandTotal).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="font-bold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Coverage & Guarantee Note
              </div>
              <p>
                Includes all disposal, clean-up, magnetic nail sweep, and 10-Year Leak-Free Craftsmanship Warranty on full repairs.
              </p>
            </div>
          </div>

          {/* Free Inspection Booking Form */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 card-shadow space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              Lock In Free Inspection & Quote
            </h4>

            {isSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold text-sm">Estimate Request Submitted!</div>
                <p className="text-xs text-emerald-800">
                  Our senior estimator will contact you within 2 hours to confirm your property address and schedule the inspection.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitEstimate} className="space-y-3">
                <div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Full Name *"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number *"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Property Address (e.g. 1428 Elmwood Ridge Dr)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value as EstimateRequest['targetTimeline'])}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="ASAP">Target Timeline: ASAP (1-2 Days)</option>
                    <option value="WITHIN_2_WEEKS">Target Timeline: Within 2 Weeks</option>
                    <option value="THIS_MONTH">Target Timeline: Later This Month</option>
                    <option value="JUST_PLANNING">Just Budgeting / Planning</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  Lock In Estimate & Schedule Inspection
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
