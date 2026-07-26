import React from 'react';
import { 
  CloudLightning, 
  Wind, 
  Droplets, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  ExternalLink,
  MapPin
} from 'lucide-react';
import { MOCK_STORM_ALERTS } from '../data/mockData';

interface StormAlertCenterProps {
  onEmergencyPress: () => void;
}

export const StormAlertCenter: React.FC<StormAlertCenterProps> = ({ onEmergencyPress }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <CloudLightning className="w-3.5 h-3.5 text-amber-400" />
            Live Severe Weather Telemetry
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Storm Alert Radar & Safety Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Real-time Doppler radar tracking wind gusts, hail strikes, and high water-risk roof cells across regional dispatch zones.
          </p>
        </div>

        <button
          onClick={onEmergencyPress}
          className="w-full md:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap"
        >
          <Zap className="w-4 h-4 fill-slate-950" />
          Request Priority Emergency Tarp
        </button>
      </div>

      {/* Active Advisories Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          Active Regional Storm Warnings
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {MOCK_STORM_ALERTS.map((alert) => (
            <div
              key={alert.id}
              className="bg-white p-6 rounded-3xl border-2 border-amber-500/40 card-shadow space-y-4 relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="bg-amber-500/10 text-amber-700 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded border border-amber-500/20">
                    {alert.severity}
                  </span>
                  <h4 className="text-lg font-extrabold text-slate-900 mt-1">{alert.title}</h4>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {alert.region} ({alert.issuedAt})
                  </div>
                </div>

                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <CloudLightning className="w-6 h-6" />
                </div>
              </div>

              {/* Storm Stats */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium">Peak Wind Gusts</div>
                    <div className="font-extrabold text-slate-900">{alert.windSpeedMph} MPH</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium">Max Hail Size</div>
                    <div className="font-extrabold text-slate-900">{alert.hailSizeInches}" Diameter</div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{alert.description}</p>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-950 font-medium space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  Recommended Action
                </div>
                <div>{alert.recommendedAction}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety & Emergency Prep Guide */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
        <div>
          <h3 className="text-lg font-extrabold text-amber-400">Homeowner Storm Emergency Protocol</h3>
          <p className="text-xs text-slate-400">Critical safety guidelines if your roof develops an active leak during high winds</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-amber-400 font-bold flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              1. Clear Interior Furniture
            </div>
            <p className="text-slate-300">
              Move electronics, rugs, and valuables away from the drip area. Lay heavy plastic or trash bags over non-movable items.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-amber-400 font-bold flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              2. Relieve Ceiling Water Pressure
            </div>
            <p className="text-slate-300">
              If drywall is bulging with pooled water, place a deep bucket beneath and poke a tiny hole with a nail to prevent a sudden room ceiling collapse.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-red-400 font-bold flex items-center gap-1.5 text-sm">
              <AlertTriangle className="w-4 h-4" />
              3. DO NOT Climb Wet Roofs
            </div>
            <p className="text-slate-300">
              Wet shingles and steep pitches are extremely slippery. Leave roof climbing to certified safety harnesses and professional crews.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
