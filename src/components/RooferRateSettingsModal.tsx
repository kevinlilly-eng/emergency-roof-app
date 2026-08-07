import React, { useState } from 'react';
import { Settings, Save, RotateCcw, DollarSign, Percent, ShieldCheck, X } from 'lucide-react';
import { RooferCustomRates } from '../types';
import { DEFAULT_ROOFER_RATES } from '../data/defaultRates';

interface RooferRateSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customRates: RooferCustomRates;
  onSaveRates: (newRates: RooferCustomRates) => void;
}

export const RooferRateSettingsModal: React.FC<RooferRateSettingsModalProps> = ({
  isOpen,
  onClose,
  customRates,
  onSaveRates,
}) => {
  const [rates, setRates] = useState<RooferCustomRates>(customRates);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof RooferCustomRates, value: number) => {
    setRates((prev) => ({
      ...prev,
      [field]: isNaN(value) ? 0 : value,
    }));
  };

  const handleSave = () => {
    onSaveRates(rates);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    setRates(DEFAULT_ROOFER_RATES);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Roofer Custom Rate Manager</h3>
              <p className="text-xs text-slate-400">Configure your exact unit rates, surcharge multipliers, and profit margins.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Material Unit Rates per Square (100 Sq Ft) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-3 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" /> Material & Installation Rates (Per Square = 100 sq ft)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">Architectural Shingle ($/sq)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                  <input
                    type="number"
                    value={rates.asphaltShinglePerSq}
                    onChange={(e) => handleChange('asphaltShinglePerSq', parseFloat(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Metal Standing Seam ($/sq)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                  <input
                    type="number"
                    value={rates.metalStandingSeamPerSq}
                    onChange={(e) => handleChange('metalStandingSeamPerSq', parseFloat(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Clay / Concrete Tile ($/sq)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                  <input
                    type="number"
                    value={rates.clayTilePerSq}
                    onChange={(e) => handleChange('clayTilePerSq', parseFloat(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Flat TPO / EPDM Membrane ($/sq)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                  <input
                    type="number"
                    value={rates.flatTpoPerSq}
                    onChange={(e) => handleChange('flatTpoPerSq', parseFloat(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Underlayment, Tarping & Accessories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Emergency Tarping, Flashings & Code Upgrades
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">Emergency Tarping ($/sq ft)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                  <input
                    type="number"
                    step="0.05"
                    value={rates.emergencyTarpPerSqFt}
                    onChange={(e) => handleChange('emergencyTarpPerSqFt', parseFloat(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Ice & Water Shield ($/sq ft)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                  <input
                    type="number"
                    step="0.05"
                    value={rates.iceAndWaterShieldPerSqFt}
                    onChange={(e) => handleChange('iceAndWaterShieldPerSqFt', parseFloat(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Synthetic Underlayment ($/sq ft)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                  <input
                    type="number"
                    step="0.05"
                    value={rates.underlaymentPerSqFt}
                    onChange={(e) => handleChange('underlaymentPerSqFt', parseFloat(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Drip Edge Metal Flashing ($/linear ft)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                  <input
                    type="number"
                    step="0.10"
                    value={rates.dripEdgePerLf}
                    onChange={(e) => handleChange('dripEdgePerLf', parseFloat(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Ridge Cap & Venting ($/linear ft)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                  <input
                    type="number"
                    step="0.50"
                    value={rates.ridgeCapPerLf}
                    onChange={(e) => handleChange('ridgeCapPerLf', parseFloat(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Neoprene Pipe Boots ($/each)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                  <input
                    type="number"
                    value={rates.pipeBootPerEa}
                    onChange={(e) => handleChange('pipeBootPerEa', parseFloat(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Surcharges, Labor & Overhead/Profit */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-3 flex items-center gap-1.5">
              <Percent className="w-4 h-4" /> Labor Rates, Pitch Surcharges & O&P Margins
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">Steep Pitch Surcharge (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={rates.steepPitchSurchargePercent}
                    onChange={(e) => handleChange('steepPitchSurchargePercent', parseFloat(e.target.value))}
                    className="w-full pr-7 pl-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400">%</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">2-Story Height Surcharge (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={rates.twoStorySurchargePercent}
                    onChange={(e) => handleChange('twoStorySurchargePercent', parseFloat(e.target.value))}
                    className="w-full pr-7 pl-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400">%</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Overhead & Profit (10/10 O&P %)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={rates.overheadAndProfitPercent}
                    onChange={(e) => handleChange('overheadAndProfitPercent', parseFloat(e.target.value))}
                    className="w-full pr-7 pl-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400">%</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Debris Dumpster & Haul-Off ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                  <input
                    type="number"
                    value={rates.debrisRemovalFee}
                    onChange={(e) => handleChange('debrisRemovalFee', parseFloat(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-50 p-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Regional Default Benchmark Rates
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaved ? 'Rates Saved Successfully!' : 'Save Custom Rates'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
