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
  Send,
  Settings,
  BrainCircuit,
  Bot,
  Lightbulb,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RoofMaterial, RoofPitch, EstimateRequest, RooferCustomRates, GeminiEstimateResponse } from '../types';
import { DEFAULT_ROOFER_RATES } from '../data/defaultRates';
import { generateGeminiEstimate } from '../lib/gemini';
import { RooferRateSettingsModal } from './RooferRateSettingsModal';
import { MATERIAL_MULTIPLIERS, PITCH_MULTIPLIERS } from '../utils/calculator';

interface EstimateCalculatorProps {
  onEstimateSubmitted?: (request: EstimateRequest) => void;
}

export const EstimateCalculator: React.FC<EstimateCalculatorProps> = ({ onEstimateSubmitted }) => {
  const [sqFt, setSqFt] = useState<number>(1800);
  const [material, setMaterial] = useState<RoofMaterial>('ASPHALT_SHINGLE');
  const [pitch, setPitch] = useState<RoofPitch>('MEDIUM_PITCH');
  const [stories, setStories] = useState<number>(1);
  const [serviceType, setServiceType] = useState<EstimateRequest['serviceType']>('FULL_REPLACEMENT');
  const [isEmergency, setIsEmergency] = useState<boolean>(false);

  // Roofer Rates state
  const [customRates, setCustomRates] = useState<RooferCustomRates>(() => {
    const saved = localStorage.getItem('roof_response_custom_rates');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_ROOFER_RATES;
      }
    }
    return DEFAULT_ROOFER_RATES;
  });

  const [isRateModalOpen, setIsRateModalOpen] = useState(false);

  // Gemini Estimate State
  const [isGeneratingGemini, setIsGeneratingGemini] = useState(false);
  const [geminiResult, setGeminiResult] = useState<GeminiEstimateResponse | null>(null);
  const [geminiError, setGeminiError] = useState<string | null>(null);

  // Form Booking State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [timeline, setTimeline] = useState<EstimateRequest['targetTimeline']>('ASAP');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSaveCustomRates = (newRates: RooferCustomRates) => {
    setCustomRates(newRates);
    localStorage.setItem('roof_response_custom_rates', JSON.stringify(newRates));
  };

  // Calculate offline instant fallback estimate using custom rates
  const roofSquares = Math.ceil(sqFt / 100);
  let baseRatePerSq = customRates.asphaltShinglePerSq;
  if (material === 'METAL_STANDING_SEAM') baseRatePerSq = customRates.metalStandingSeamPerSq;
  if (material === 'CLAY_TILE') baseRatePerSq = customRates.clayTilePerSq;
  if (material === 'FLAT_TPO') baseRatePerSq = customRates.flatTpoPerSq;

  let pitchMult = 1.0;
  if (pitch === 'STEEP_PITCH' || pitch === 'HAZARDOUS_STEEP') {
    pitchMult = 1 + (customRates.steepPitchSurchargePercent / 100);
  }

  let storyMult = 1.0;
  if (stories >= 2) {
    storyMult = 1 + (customRates.twoStorySurchargePercent / 100);
  }

  const baseMaterialAndLabor = roofSquares * baseRatePerSq * pitchMult * storyMult;
  const underlaymentCost = sqFt * customRates.underlaymentPerSqFt;
  const iceWaterShieldCost = sqFt * 0.3 * customRates.iceAndWaterShieldPerSqFt; // approx 30% eaves
  const dripEdgeCost = Math.round(Math.sqrt(sqFt) * 4) * customRates.dripEdgePerLf;
  const ridgeCapCost = Math.round(Math.sqrt(sqFt) * 1.2) * customRates.ridgeCapPerLf;
  const debrisCost = customRates.debrisRemovalFee;
  const emergencyCost = isEmergency ? (sqFt * customRates.emergencyTarpPerSqFt) : 0;

  const rawSubtotal = baseMaterialAndLabor + underlaymentCost + iceWaterShieldCost + dripEdgeCost + ridgeCapCost + debrisCost + emergencyCost;
  const overheadAndProfit = rawSubtotal * (customRates.overheadAndProfitPercent / 100);
  const tax = (rawSubtotal + overheadAndProfit) * (customRates.salesTaxPercent / 100);
  const instantGrandTotal = Math.round(rawSubtotal + overheadAndProfit + tax);

  // Function to call Gemini AI Estimate Generator with Roofer Custom Rates
  const handleGenerateGeminiEstimate = async () => {
    setIsGeneratingGemini(true);
    setGeminiError(null);

    try {
      const projectDetails = {
        roofSquareFootage: sqFt,
        roofSquares,
        roofMaterial: material,
        roofPitch: pitch,
        stories,
        serviceType,
        isEmergencyCallout: isEmergency,
      };

      const result = await generateGeminiEstimate(customRates, projectDetails, notes);
      setGeminiResult(result);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    } catch (err: any) {
      console.error(err);
      setGeminiError(err.message || 'Could not connect to Gemini AI estimate service.');
    } finally {
      setIsGeneratingGemini(false);
    }
  };

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
      notes: `${notes || ''} [Custom Roofer Rate Total: $${geminiResult?.grandTotal || instantGrandTotal}]`,
    };

    if (onEstimateSubmitted) {
      onEstimateSubmitted(request);
    }
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Top Banner Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <BrainCircuit className="w-3.5 h-3.5 text-amber-400" />
            Gemini AI Contractor Estimator & Custom Rate Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Roofer Estimate & Strategic Thought Engine
          </h2>
          <p className="text-sm text-slate-300 max-w-xl">
            Calculates line-item contractor estimates using your <strong className="text-amber-400">exact custom rates</strong>, powered by Gemini AI to uncover hidden scope items, building code upgrades, and carrier negotiation strategies.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col items-center gap-3 shrink-0 w-full md:w-auto">
          <button
            onClick={() => setIsRateModalOpen(true)}
            className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Settings className="w-4 h-4 text-amber-400" />
            Edit Roofer Rates ($)
          </button>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center w-full">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              {geminiResult ? 'Gemini AI Calculated Total' : 'Estimated Total (Your Rates)'}
            </div>
            <div className="text-3xl font-black text-amber-400">
              ${(geminiResult ? geminiResult.grandTotal : instantGrandTotal).toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {roofSquares} Squares @ Custom Rate Setup
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Input Specs vs AI Generator & Summary */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Property Specs & Roofer Inputs */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 card-shadow space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Home className="w-5 h-5 text-amber-600" />
              Roof & Property Specs
            </h3>
            <button
              onClick={() => setIsRateModalOpen(true)}
              className="text-xs text-amber-700 hover:text-amber-900 font-semibold underline flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5" />
              Configure Rates
            </button>
          </div>

          {/* Roof Service Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Specialty Scope
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setServiceType('FULL_REPLACEMENT')}
                className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                  serviceType === 'FULL_REPLACEMENT'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🏠 Complete Replacement
              </button>
              <button
                type="button"
                onClick={() => setServiceType('LEAK_REPAIR')}
                className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                  serviceType === 'LEAK_REPAIR'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                💧 Leak & Patch Repair
              </button>
              <button
                type="button"
                onClick={() => setServiceType('METAL_ROOF')}
                className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                  serviceType === 'METAL_ROOF'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ⚡ Metal Standing Seam
              </button>
              <button
                type="button"
                onClick={() => setServiceType('TILE_ROOF')}
                className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                  serviceType === 'TILE_ROOF'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🏛️ Tile Roof System
              </button>
            </div>
          </div>

          {/* Roof Square Footage Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Roof Area (Sq Ft)</span>
              <span className="text-amber-600 font-extrabold text-sm">{sqFt.toLocaleString()} sq ft ({roofSquares} SQ)</span>
            </div>
            <input
              type="range"
              min="300"
              max="6000"
              step="50"
              value={sqFt}
              onChange={(e) => setSqFt(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-200 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Roof Material Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Roofing Material
            </label>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value as RoofMaterial)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 font-bold focus:outline-none focus:border-amber-500"
            >
              <option value="ASPHALT_SHINGLE">Architectural Shingle (${customRates.asphaltShinglePerSq}/SQ)</option>
              <option value="METAL_STANDING_SEAM">Metal Standing Seam (${customRates.metalStandingSeamPerSq}/SQ)</option>
              <option value="CLAY_TILE">Clay / Concrete Tile (${customRates.clayTilePerSq}/SQ)</option>
              <option value="FLAT_TPO">Flat TPO / EPDM Membrane (${customRates.flatTpoPerSq}/SQ)</option>
            </select>
          </div>

          {/* Roof Pitch Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Roof Pitch & Safety Complexity
            </label>
            <select
              value={pitch}
              onChange={(e) => setPitch(e.target.value as RoofPitch)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 font-bold focus:outline-none focus:border-amber-500"
            >
              <option value="FLAT">Flat / Low Slope (0/12 - 2/12)</option>
              <option value="MEDIUM_PITCH">Medium Pitch (4/12 - 7/12) - Standard</option>
              <option value="STEEP_PITCH">Steep Pitch (8/12 - 11/12) (+{customRates.steepPitchSurchargePercent}% Surcharge)</option>
              <option value="HAZARDOUS_STEEP">Hazardous Steep (12/12+) (+{customRates.steepPitchSurchargePercent}% Surcharge)</option>
            </select>
          </div>

          {/* Stories & Urgency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Height (Stories)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStories(s)}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                      stories === s
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s} {s === 1 ? 'Story' : 'Sty'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Emergency Callout
              </label>
              <button
                type="button"
                onClick={() => setIsEmergency(!isEmergency)}
                className={`w-full py-2 px-2 rounded-xl border text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                  isEmergency
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {isEmergency ? '24/7 Rapid Tarp' : 'Standard'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Custom Notes or Adjuster Discrepancy
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Tree branch pierced master bedroom, insurance adjuster missed drip edge & starter shingles..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Action Button: Generate Gemini Estimate */}
          <button
            type="button"
            onClick={handleGenerateGeminiEstimate}
            disabled={isGeneratingGemini}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 border border-amber-600 active:scale-98 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
            {isGeneratingGemini ? 'Gemini AI Is Calculating Estimate & Thoughts...' : 'Generate Gemini Estimate & AI Thoughts'}
          </button>
        </div>

        {/* Right Column: Estimate Breakdown + Gemini Suggestions & Thoughts */}
        <div className="lg:col-span-7 space-y-6">
          
          {geminiError && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-red-900">
                <AlertCircle className="w-4 h-4 text-red-600" />
                Gemini Connection Error
              </div>
              <p>{geminiError}</p>
              <p className="text-[11px] text-red-600">Showing local estimate calculated directly with your custom rates below.</p>
            </div>
          )}

          {/* Gemini Strategic AI Thoughts & Suggestions Banner */}
          {geminiResult?.geminiSuggestionsAndThoughts && (
            <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 text-slate-100 p-6 rounded-3xl border border-amber-500/30 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider">
                    Gemini AI Suggestions & Contractor Thoughts
                  </h3>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-mono border border-amber-500/30">
                  Master Roofer Insights
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-200">
                {geminiResult.geminiSuggestionsAndThoughts.map((thought, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{thought}</span>
                  </div>
                ))}
              </div>

              {geminiResult.carrierDefenseNotes && (
                <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-xs text-amber-200 mt-2">
                  <strong className="text-amber-400 block mb-1">Carrier Adjuster Presentation Tip:</strong>
                  {geminiResult.carrierDefenseNotes}
                </div>
              )}
            </div>
          )}

          {/* Itemized Estimate Table */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-amber-400 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                Itemized Estimate Breakdown ({geminiResult ? 'Gemini AI Verified' : 'Custom Rates'})
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                O&P: {customRates.overheadAndProfitPercent}%
              </span>
            </div>

            {/* If Gemini Result exists, render line items table */}
            {geminiResult ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-950 rounded-xl text-xs text-slate-300">
                  <strong>Scope Summary:</strong> {geminiResult.summary} (Waste Factor: {geminiResult.wasteFactorPercentage}%)
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                        <th className="py-2 px-1">Item & Code Ref</th>
                        <th className="py-2 px-1 text-center">Qty / Unit</th>
                        <th className="py-2 px-1 text-right">Rate</th>
                        <th className="py-2 px-1 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-200">
                      {geminiResult.lineItems.map((item, index) => (
                        <tr key={index} className="hover:bg-slate-800/40">
                          <td className="py-2 px-1">
                            <div className="font-semibold text-white">{item.item}</div>
                            {item.codeRef && (
                              <span className="text-[10px] font-mono text-amber-400">{item.codeRef}</span>
                            )}
                          </td>
                          <td className="py-2 px-1 text-center font-mono">{item.quantity} {item.unit}</td>
                          <td className="py-2 px-1 text-right font-mono">${item.unitRate?.toFixed(2)}</td>
                          <td className="py-2 px-1 text-right font-mono font-bold text-amber-400">${item.totalPrice?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-slate-800 pt-3 space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Line Items Subtotal</span>
                    <span className="font-mono font-bold">${geminiResult.subtotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-amber-300">
                    <span>Contractor Overhead & Profit ({geminiResult.overheadAndProfitRate || customRates.overheadAndProfitPercent}%)</span>
                    <span className="font-mono font-bold">+${geminiResult.overheadAndProfitAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Sales Tax ({customRates.salesTaxPercent}%)</span>
                    <span className="font-mono">${geminiResult.estimatedTax?.toLocaleString()}</span>
                  </div>
                  <div className="border-t-2 border-amber-500/50 pt-2 flex justify-between items-center text-sm font-black text-amber-400">
                    <span>Grand Estimated Total</span>
                    <span className="text-xl font-mono">${geminiResult.grandTotal?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Offline instant breakdown table */
              <div className="space-y-3">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Shingle / Roofing System ({roofSquares} SQ @ ${baseRatePerSq}/SQ)</span>
                    <span className="font-mono font-bold">${Math.round(baseMaterialAndLabor).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Synthetic Underlayment ({sqFt} sq ft @ ${customRates.underlaymentPerSqFt})</span>
                    <span className="font-mono font-bold">${Math.round(underlaymentCost).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Ice & Water Shield Leak Protection</span>
                    <span className="font-mono font-bold">${Math.round(iceWaterShieldCost).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Drip Edge Metal Flashing & Ridge Caps</span>
                    <span className="font-mono font-bold">${Math.round(dripEdgeCost + ridgeCapCost).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Debris Dumpster & Tear-off Disposal</span>
                    <span className="font-mono font-bold">${customRates.debrisRemovalFee.toLocaleString()}</span>
                  </div>
                  {emergencyCost > 0 && (
                    <div className="flex justify-between text-red-400 font-bold">
                      <span>24/7 Rapid Emergency Callout & Tarping</span>
                      <span className="font-mono">+${Math.round(emergencyCost).toLocaleString()}</span>
                    </div>
                  )}

                  <div className="border-t border-slate-800 pt-2 flex justify-between text-amber-300 font-semibold">
                    <span>Overhead & Profit ({customRates.overheadAndProfitPercent}%)</span>
                    <span className="font-mono">+${Math.round(overheadAndProfit).toLocaleString()}</span>
                  </div>

                  <div className="border-t-2 border-amber-500/40 pt-3 flex justify-between items-center text-sm font-black text-white">
                    <span className="text-amber-400">Grand Estimated Total</span>
                    <span className="text-xl text-amber-400 font-mono">${instantGrandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl text-[11px] text-slate-400 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Click <strong>"Generate Gemini Estimate & AI Thoughts"</strong> above to get a full AI building code analysis and adjuster presentation report!</span>
                </div>
              </div>
            )}
          </div>

          {/* Submit Request / Schedule Inspection Form */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 card-shadow space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              Lock In Free Inspection & Quote Request
            </h4>

            {isSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold text-sm">Estimate Saved & Dispatched!</div>
                <p className="text-xs text-emerald-800">
                  Our senior roofing team has received your estimate specifications and custom rates breakdown.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitEstimate} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name *"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number *"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Property Address"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  Save Estimate & Schedule Inspection
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

      {/* Roofer Custom Rate Settings Modal */}
      <RooferRateSettingsModal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        customRates={customRates}
        onSaveRates={handleSaveCustomRates}
      />
    </div>
  );
};
