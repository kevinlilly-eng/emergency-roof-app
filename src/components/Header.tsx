import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, 
  PhoneCall, 
  AlertTriangle, 
  Calculator, 
  Truck, 
  CloudLightning, 
  Home, 
  Briefcase, 
  Share2, 
  FileText, 
  Siren, 
  Sparkles, 
  ChevronDown 
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'home' | 'insurance' | 'emergency' | 'estimate' | 'tracker' | 'radar' | 'contractor' | 'aiReportWriter' | 'aiTriage';
  setActiveTab: (tab: 'home' | 'insurance' | 'emergency' | 'estimate' | 'tracker' | 'radar' | 'contractor' | 'aiReportWriter' | 'aiTriage') => void;
  activeTicketCount: number;
  unclaimedLeadCount?: number;
  onEmergencyPress: () => void;
  onSharePress: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeTicketCount,
  unclaimedLeadCount = 0,
  onEmergencyPress,
  onSharePress,
}) => {
  const [isAiDropdownOpen, setIsAiDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAiDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAiTabActive = activeTab === 'aiReportWriter' || activeTab === 'aiTriage';

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
            href="tel:7067400529"
            className="bg-slate-950 text-amber-400 px-2.5 py-0.5 rounded font-bold hover:bg-slate-900 transition-colors"
          >
            (706) 740-0529
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
              <div className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                A-NewRoof Response Hub
                <span className="bg-amber-500 text-slate-950 text-[10px] uppercase tracking-wider font-black px-1.5 py-0.5 rounded shadow-sm">
                  PRO
                </span>
              </div>
              <div className="text-xs font-black text-amber-400 tracking-wide uppercase flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Emergency Tarping & Leak Patching
              </div>
            </div>
          </button>

          {/* Cleaned Desktop Tabs Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
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
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'estimate'
                  ? 'bg-slate-800 text-amber-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Calculator className="w-4 h-4" />
              Estimate
            </button>

            <button
              onClick={() => setActiveTab('radar')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'radar'
                  ? 'bg-slate-800 text-amber-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <CloudLightning className="w-4 h-4 text-amber-400" />
              Storm Radar
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all relative ${
                activeTab === 'tracker'
                  ? 'bg-slate-800 text-amber-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Truck className="w-4 h-4" />
              Fleet & Tickets
              {activeTicketCount > 0 && (
                <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
                  {activeTicketCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('insurance')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'insurance'
                  ? 'bg-blue-600 text-white border border-blue-400 shadow-md'
                  : 'text-blue-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Shield className="w-4 h-4 text-blue-400" />
              Insurers
            </button>

            {/* AI Suite Consolidated Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsAiDropdownOpen(!isAiDropdownOpen)}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all border ${
                  isAiTabActive
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-800 text-amber-300 border-amber-500/30 hover:bg-slate-700'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>AI Suite</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAiDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isAiDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl p-2 z-50 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-800">
                    Gemini AI Powered Tools
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('aiReportWriter');
                      setIsAiDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
                      activeTab === 'aiReportWriter'
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div>AI Supplement Writer</div>
                      <div className="text-[10px] font-normal text-slate-400">Carrier reports with IRC code citations</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('aiTriage');
                      setIsAiDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
                      activeTab === 'aiTriage'
                        ? 'bg-red-600 text-white'
                        : 'text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Siren className="w-4 h-4 text-red-400 shrink-0" />
                    <div>
                      <div>24/7 Smart Emergency Triage</div>
                      <div className="text-[10px] font-normal text-slate-400">Hazard scoring & crew dispatch</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Contractor Portal */}
            <button
              onClick={() => setActiveTab('contractor')}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all border ${
                activeTab === 'contractor'
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-800/80 text-amber-400 border-amber-500/30 hover:bg-slate-800'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Portal
              {unclaimedLeadCount > 0 && (
                <span className="bg-red-600 text-white font-black text-[10px] px-1.5 py-0.2 rounded-full animate-pulse">
                  {unclaimedLeadCount} LEADS
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onSharePress}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
              title="Share App via Text / SMS"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Text App</span>
              <span className="sm:hidden">Share</span>
            </button>

            <button
              onClick={onEmergencyPress}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all active:scale-95 border border-amber-300/40"
            >
              <AlertTriangle className="w-4 h-4 fill-slate-950 text-amber-500" />
              <span className="hidden sm:inline">24/7 EMERGENCY DISPATCH</span>
              <span className="sm:hidden">DISPATCH</span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Sub-Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2.5 gap-2 border-t border-slate-800/80 scrollbar-none text-xs font-bold">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'home' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Home className="w-3.5 h-3.5" /> Overview
          </button>
          <button
            onClick={() => setActiveTab('estimate')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'estimate' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" /> Estimate
          </button>
          <button
            onClick={() => setActiveTab('aiReportWriter')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'aiReportWriter' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-300 border border-amber-500/30'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> AI Writer
          </button>
          <button
            onClick={() => setActiveTab('aiTriage')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'aiTriage' ? 'bg-red-600 text-white' : 'bg-red-950/40 text-red-300 border border-red-500/30'
            }`}
          >
            <Siren className="w-3.5 h-3.5" /> Smart Triage
          </button>
          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'tracker' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Truck className="w-3.5 h-3.5" /> Fleet ({activeTicketCount})
          </button>
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'radar' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <CloudLightning className="w-3.5 h-3.5" /> Radar
          </button>
          <button
            onClick={() => setActiveTab('contractor')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'contractor' ? 'bg-amber-500 text-slate-950' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" /> Portal
          </button>
        </div>
      </div>
    </header>
  );
};
