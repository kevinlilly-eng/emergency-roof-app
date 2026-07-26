import React from 'react';
import { Shield, PhoneCall, AlertTriangle, Calculator, Truck, CloudLightning, Home, Briefcase, Download } from 'lucide-react';

interface HeaderProps {
  activeTab: 'home' | 'emergency' | 'estimate' | 'tracker' | 'radar' | 'contractor';
  setActiveTab: (tab: 'home' | 'emergency' | 'estimate' | 'tracker' | 'radar' | 'contractor') => void;
  activeTicketCount: number;
  unclaimedLeadCount?: number;
  onEmergencyPress: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeTicketCount,
  unclaimedLeadCount = 0,
  onEmergencyPress,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-xl">
      {/* Top Urgent Announcement Bar */}
      <div className="bg-amber-600 text-slate-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="flex h-2 w-2 rounded-full bg-red-950 animate-ping" />
          <AlertTriangle className="w-4 h-4 text-slate-950 shrink-0" />
          <span className="truncate">
            <strong>24/7 STORM DISPATCH ACTIVE:</strong> Rapid-response tarp crews on standby in Metro & Surrounding Counties. Avg arrival: 24 mins.
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 shrink-0 font-mono">
          <span>DISPATCH HOTLINE:</span>
          <a
            href="tel:18007663767"
            className="bg-slate-950 text-amber-400 px-2.5 py-0.5 rounded font-bold hover:bg-slate-900 transition-colors"
          >
            1-800-ROOF-SOS (766-3767)
          </a>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Roof Response Hub
                <span className="bg-amber-500/10 text-amber-400 text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded border border-amber-500/20">
                  PRO
                </span>
              </div>
              <div className="text-xs text-slate-400 font-medium hidden sm:block">
                Emergency Tarping & Patching
              </div>
            </div>
          </button>

          {/* Center Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'home'
                  ? 'bg-slate-800 text-amber-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Home className="w-4 h-4" />
              Overview
            </button>

            <button
              onClick={() => setActiveTab('estimate')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'estimate'
                  ? 'bg-slate-800 text-amber-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Calculator className="w-4 h-4" />
              Free Estimate
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all relative ${
                activeTab === 'tracker'
                  ? 'bg-slate-800 text-amber-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Truck className="w-4 h-4" />
              Live Fleet & Tickets
              {activeTicketCount > 0 && (
                <span className="bg-amber-500 text-slate-950 font-black text-xs px-1.5 py-0.2 rounded-full">
                  {activeTicketCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('radar')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'radar'
                  ? 'bg-slate-800 text-amber-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <CloudLightning className="w-4 h-4 text-amber-400" />
              Storm Radar
            </button>

            <button
              onClick={() => setActiveTab('contractor')}
              className={`px-3 py-2 rounded-lg text-sm font-extrabold flex items-center gap-2 transition-all border ${
                activeTab === 'contractor'
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-800/80 text-amber-400 border-amber-500/30 hover:bg-slate-800'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Contractor Portal
              {unclaimedLeadCount > 0 && (
                <span className="bg-red-600 text-white font-black text-[10px] px-1.5 py-0.2 rounded-full animate-pulse">
                  {unclaimedLeadCount} LEADS
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/emergency-tarp-roof-app.zip"
              download="emergency-tarp-roof-app.zip"
              onClick={async (e) => {
                e.preventDefault();
                try {
                  const res = await fetch('/emergency-tarp-roof-app.zip');
                  const arrayBuffer = await res.arrayBuffer();
                  const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
                  const blobUrl = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = blobUrl;
                  link.download = 'emergency-tarp-roof-app.zip';
                  document.body.appendChild(link);
                  link.click();
                  setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(blobUrl);
                  }, 100);
                } catch {
                  window.open('/emergency-tarp-roof-app.zip', '_blank');
                }
              }}
              title="Download full project source code as ZIP archive"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-3 py-2 rounded-xl border border-emerald-400/50 flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Download ZIP (All Code)</span>
            </a>

            <button
              onClick={onEmergencyPress}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all active:scale-95 border border-amber-300/40"
            >
              <AlertTriangle className="w-4 h-4 fill-slate-950 text-amber-500" />
              <span>24/7 EMERGENCY DISPATCH</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-2 border-t border-slate-800/80 scrollbar-none">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'home' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Home className="w-3.5 h-3.5" /> Overview
          </button>
          <button
            onClick={onEmergencyPress}
            className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1.5 animate-pulse"
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Emergency Tarp
          </button>
          <button
            onClick={() => setActiveTab('estimate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'estimate' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" /> Estimate
          </button>
          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'tracker' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Truck className="w-3.5 h-3.5" /> Fleet & Tickets ({activeTicketCount})
          </button>
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'radar' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <CloudLightning className="w-3.5 h-3.5" /> Radar
          </button>
          <button
            onClick={() => setActiveTab('contractor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'contractor' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" /> Contractor Portal
          </button>
        </div>
      </div>
    </header>
  );
};
