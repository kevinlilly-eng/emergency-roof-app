import React, { useState } from 'react';
import { 
  Truck, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Phone, 
  ShieldCheck, 
  User, 
  Navigation,
  Download,
  ExternalLink,
  ChevronRight,
  Camera
} from 'lucide-react';
import { DispatchTicket, TicketStatus } from '../types';

interface DispatchTrackerProps {
  tickets: DispatchTicket[];
  onUpdateTicketStatus: (ticketId: string, newStatus: TicketStatus) => void;
  onOpenInsuranceReport: (ticket: DispatchTicket) => void;
}

const STATUS_STEPS: { status: TicketStatus; label: string; desc: string }[] = [
  { status: 'DISPATCHED', label: 'Ticket Dispatched', desc: 'Nearest crew unit assigned & rolling out' },
  { status: 'EN_ROUTE', label: 'Crew En Route', desc: 'Navigating to site via emergency GPS route' },
  { status: 'ON_SITE', label: 'On Site / Safety Setup', desc: 'Roof climb inspection & harness rigging' },
  { status: 'TARP_INSTALLED', label: 'Heavy Tarp Secured', desc: 'UV tarp anchored & nail-sealed over leak' },
  { status: 'COMPLETED', label: 'Loss Mitigation Complete', desc: 'Photos taken & insurance claim packet ready' },
];

export const DispatchTracker: React.FC<DispatchTrackerProps> = ({
  tickets,
  onUpdateTicketStatus,
  onOpenInsuranceReport,
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');

  const activeTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  if (!activeTicket) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <Truck className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">No Active Dispatch Tickets Found</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Submit an Emergency Roof Tarping request to track live crew ETAs, unit locations, and loss mitigation claim summaries.
        </p>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.status === activeTicket.status);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Bar */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <Truck className="w-3.5 h-3.5" />
            Live Crew Fleet Dispatch Console
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Emergency Dispatch & Crew Tracker
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time status monitor for active roof tarping and emergency leak mitigation units.
          </p>
        </div>

        {/* Ticket Selector Dropdown */}
        {tickets.length > 1 && (
          <div className="w-full md:w-auto">
            <label className="block text-xs font-semibold text-slate-400 mb-1">Select Active Ticket</label>
            <select
              value={selectedTicketId}
              onChange={(e) => setSelectedTicketId(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-white font-bold text-xs rounded-xl px-4 py-2.5 w-full focus:outline-none focus:border-amber-500"
            >
              {tickets.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id} - {t.customerName} ({t.status.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Grid: Live Status Left vs Details Right */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Progress Tracker & Map Simulator */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 card-shadow space-y-6">
          
          {/* Ticket Header & Status Badge */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-mono font-bold text-amber-600">{activeTicket.id}</div>
              <h3 className="text-xl font-extrabold text-slate-900">{activeTicket.customerName}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {activeTicket.address}
              </p>
            </div>

            <div className="text-right">
              <span className="bg-red-500/10 text-red-600 border border-red-500/20 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                {activeTicket.severity} SEVERITY
              </span>
              <div className="text-[11px] text-slate-400 font-mono mt-1">
                Dispatched {new Date(activeTicket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {/* Assigned Crew Box */}
          {activeTicket.assignedCrewUnit && (
            <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                    {activeTicket.assignedCrewUnit.name}
                  </div>
                  <div className="text-sm font-extrabold text-white">
                    Lead: {activeTicket.assignedCrewUnit.leadTechnician}
                  </div>
                  <div className="text-xs text-slate-400">
                    Direct Rig Cell: {activeTicket.assignedCrewUnit.vehiclePhone}
                  </div>
                </div>
              </div>

              <div className="text-right bg-slate-950 p-2.5 rounded-lg border border-slate-800 shrink-0">
                <div className="text-[10px] text-slate-400 font-semibold">ESTIMATED ETA</div>
                <div className="text-lg font-black text-amber-400">
                  {activeTicket.assignedCrewUnit.etaMinutes} Mins
                </div>
              </div>
            </div>
          )}

          {/* Vertical Stepper Timeline */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Live Crew Progress Stepper
            </h4>

            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
              {STATUS_STEPS.map((step, idx) => {
                const isDone = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.status} className="relative flex items-start gap-4 z-10">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 transition-colors ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20'
                          : 'bg-slate-100 text-slate-400 border border-slate-300'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className={`text-xs font-bold ${isCurrent ? 'text-amber-700' : isDone ? 'text-slate-900' : 'text-slate-500'}`}>
                          {step.label}
                        </div>
                        <div className="text-[11px] text-slate-500">{step.desc}</div>
                      </div>

                      {isCurrent && (
                        <span className="text-[10px] font-extrabold text-amber-600 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                          In Progress
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Simulation Actions for Dispatch Officer / Demo */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-700">Simulate Dispatcher Crew Update</div>
            <div className="flex flex-wrap gap-2">
              {STATUS_STEPS.map((step) => (
                <button
                  key={step.status}
                  onClick={() => onUpdateTicketStatus(activeTicket.id, step.status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTicket.status === step.status
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Set: {step.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Damage Photos & Claim Documentation */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Claim Summary Card */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-amber-400 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                Insurance Claim Loss Packet
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                PRE-FORMATTED
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="text-slate-400">Insurance Provider</div>
                <div className="font-bold text-white">{activeTicket.insuranceProvider || 'Not Specified'}</div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Policy #: {activeTicket.policyNumber || 'Pending Adjuster Assignment'}
                </div>
              </div>

              <div className="space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span>Emergency Tarping Labor</span>
                  <span className="font-mono font-bold">${activeTicket.estimatedCost.tarpingLabor}</span>
                </div>
                <div className="flex justify-between">
                  <span>Heavy Vinyl Materials</span>
                  <span className="font-mono font-bold">${activeTicket.estimatedCost.materials}</span>
                </div>
                <div className="flex justify-between text-amber-300">
                  <span>24/7 Rapid Callout</span>
                  <span className="font-mono font-bold">${activeTicket.estimatedCost.emergencyCalloutFee}</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between font-extrabold text-sm text-white">
                  <span>Total Loss Mitigation</span>
                  <span className="font-mono text-amber-400">${activeTicket.estimatedCost.total}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenInsuranceReport(activeTicket)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              Generate & Print Insurance Incident Report
            </button>
          </div>

          {/* Attached Photos Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 card-shadow space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-600" />
              Damage Photos & AI Logs ({activeTicket.photos.length})
            </h4>

            <div className="space-y-3">
              {activeTicket.photos.map((photo) => (
                <div key={photo.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-start gap-3">
                    <img src={photo.url} alt={photo.caption} className="w-16 h-16 object-cover rounded-lg shrink-0 border border-slate-300" />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">{photo.caption}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{photo.timestamp}</div>
                    </div>
                  </div>
                  {photo.aiNotes && (
                    <div className="text-[10px] text-slate-700 bg-amber-50 p-2 rounded border border-amber-200/80">
                      <strong>AI Log:</strong> {photo.aiNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
