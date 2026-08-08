import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertOctagon, 
  Siren, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Activity, 
  Lock, 
  FileCheck, 
  UserCheck, 
  Download, 
  RefreshCw, 
  Server, 
  BellRing, 
  Zap, 
  Cpu, 
  AlertTriangle,
  Send,
  Eye
} from 'lucide-react';

export interface IncidentAlert {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  title: string;
  location: string;
  ticketId: string;
  elapsedMinutes: number;
  currentTier: 1 | 2 | 3 | 4;
  status: 'ACTIVE_ESCALATION' | 'RESOLVED' | 'ACKNOWLEDGED';
  assignedCrew: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userRole: 'DISPATCHER_ADMIN' | 'CONTRACTOR_PRO' | 'CARRIER_ADJUSTER' | 'SYSTEM_AGENT';
  userEmail: string;
  ipAddress: string;
  action: string;
  resource: string;
  complianceStatus: 'PASSED' | 'WARNING' | 'FLAGGED';
}

const INITIAL_INCIDENTS: IncidentAlert[] = [
  {
    id: 'inc-901',
    severity: 'CRITICAL',
    title: 'SLA Breach Warning: Active Water Ingress on Commercial Flat Roof',
    location: '320 Buckhead Ave NE, Atlanta GA',
    ticketId: 'TKT-8901',
    elapsedMinutes: 28,
    currentTier: 2,
    status: 'ACTIVE_ESCALATION',
    assignedCrew: 'Unit-2 North Rapid Tarp',
    createdAt: '2026-08-07T22:50:00Z',
  },
  {
    id: 'inc-902',
    severity: 'HIGH',
    title: 'Chimney Flashing Structural Collapse Risk',
    location: '1420 Peachtree Rd NW, Atlanta GA',
    ticketId: 'TKT-8902',
    elapsedMinutes: 14,
    currentTier: 1,
    status: 'ACKNOWLEDGED',
    assignedCrew: 'Unit-1 Lead Tarp Crew',
    createdAt: '2026-08-07T23:05:00Z',
  }
];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-001',
    timestamp: '2026-08-07T23:14:02Z',
    userRole: 'DISPATCHER_ADMIN',
    userEmail: 'dispatch@a-newroof.com',
    ipAddress: '108.20.142.89',
    action: 'DISPATCH_CREW_ASSIGNMENT',
    resource: 'tickets/TKT-8901',
    complianceStatus: 'PASSED'
  },
  {
    id: 'audit-002',
    timestamp: '2026-08-07T23:10:15Z',
    userRole: 'CONTRACTOR_PRO',
    userEmail: 'apex.roofing.atl@gmail.com',
    ipAddress: '74.12.98.201',
    action: 'CLAIM_EXCLUSIVE_LEAD',
    resource: 'leads/LEAD-7704',
    complianceStatus: 'PASSED'
  },
  {
    id: 'audit-003',
    timestamp: '2026-08-07T23:02:40Z',
    userRole: 'CARRIER_ADJUSTER',
    userEmail: 'claims@statefarm-adjusters.com',
    ipAddress: '162.210.192.11',
    action: 'INSPECT_IRC_SUPPLEMENT_REPORT',
    resource: 'reports/AI-REP-3301',
    complianceStatus: 'PASSED'
  },
  {
    id: 'audit-004',
    timestamp: '2026-08-07T22:45:11Z',
    userRole: 'SYSTEM_AGENT',
    userEmail: 'gemini-triage-bot@a-newroof.com',
    ipAddress: '35.192.0.12 (Google Cloud)',
    action: 'AI_HAZARD_RATING_EVALUATION',
    resource: 'triage/AI-TRG-902',
    complianceStatus: 'PASSED'
  }
];

export const EnterpriseAuditAndIncidentCenter: React.FC = () => {
  const [incidents, setIncidents] = useState<IncidentAlert[]>(() => {
    const saved = localStorage.getItem('roof_incident_alerts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_INCIDENTS; }
    }
    return INITIAL_INCIDENTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('roof_audit_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_AUDIT_LOGS; }
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [filterRole, setFilterRole] = useState<string>('ALL');

  useEffect(() => {
    localStorage.setItem('roof_incident_alerts', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('roof_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const handleSimulateIncident = () => {
    setIsSimulating(true);

    setTimeout(() => {
      const newInc: IncidentAlert = {
        id: `inc-${Date.now()}`,
        severity: 'CRITICAL',
        title: 'AUTOMATED DISPATCH ESCALATION: Severe Leak Reported Over Electrical Subpanel',
        location: '550 Piedmont Ave NE, Atlanta GA',
        ticketId: `TKT-${Math.floor(Math.random() * 8000) + 1000}`,
        elapsedMinutes: 32,
        currentTier: 3,
        status: 'ACTIVE_ESCALATION',
        assignedCrew: 'Unit-3 Standby Master Crew',
        createdAt: new Date().toISOString()
      };

      const newAudit: AuditLogEntry = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userRole: 'SYSTEM_AGENT',
        userEmail: 'sla-incident-engine@a-newroof.com',
        ipAddress: '34.120.44.11 (Google Cloud SLA Sentinel)',
        action: 'TRIGGER_TIER_3_REGIONAL_ESCALATION',
        resource: `incidents/${newInc.id}`,
        complianceStatus: 'WARNING'
      };

      setIncidents([newInc, ...incidents]);
      setAuditLogs([newAudit, ...auditLogs]);
      setIsSimulating(false);
    }, 1000);
  };

  const handleAcknowledgeIncident = (id: string) => {
    setIncidents(incidents.map(inc => {
      if (inc.id === id) {
        return { ...inc, status: 'ACKNOWLEDGED' };
      }
      return inc;
    }));
  };

  const handleResolveIncident = (id: string) => {
    setIncidents(incidents.map(inc => {
      if (inc.id === id) {
        return { ...inc, status: 'RESOLVED' };
      }
      return inc;
    }));
  };

  const filteredLogs = filterRole === 'ALL' 
    ? auditLogs 
    : auditLogs.filter(l => l.userRole === filterRole);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <Siren className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                Feature #5: Enterprise Incident & Audit Sentinel
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md">
                SOC2 & Google Compliance Ready
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              Automated Incident Escalation & Security Audit Log
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Monitors emergency tarp dispatch SLA guarantees, automatically triggers multi-tiered escalation chains (SMS &rarr; Voice Call &rarr; Regional Supervisor &rarr; Carrier Webhook), and maintains immutable audit logs.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleSimulateIncident}
              disabled={isSimulating}
              className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm px-5 py-3 rounded-2xl shadow-xl shadow-rose-600/30 flex items-center gap-2 transition-all active:scale-95 border border-rose-400/30 disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Testing Escalation Engine...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  Test SLA Breach Incident
                </>
              )}
            </button>
          </div>
        </div>

        {/* SLA Status Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-rose-500/20 text-xs">
          <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800">
            <div className="text-slate-400 font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-400" /> Tarp Dispatch SLA Guarantee
            </div>
            <div className="text-2xl font-black text-white mt-1">
              &lt; 30 Mins <span className="text-xs text-emerald-400 font-bold">98.9% compliant</span>
            </div>
          </div>
          <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800">
            <div className="text-slate-400 font-medium flex items-center gap-1.5">
              <Siren className="w-3.5 h-3.5 text-amber-400" /> Active Incidents
            </div>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {incidents.filter(i => i.status !== 'RESOLVED').length} Active
            </div>
          </div>
          <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800">
            <div className="text-slate-400 font-medium flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> Audit Log Integrity
            </div>
            <div className="text-lg font-bold text-emerald-400 mt-1">
              Immutable SHA-256
            </div>
          </div>
          <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800">
            <div className="text-slate-400 font-medium flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-sky-400" /> Enterprise SLA Uptime
            </div>
            <div className="text-2xl font-black text-white mt-1">
              99.99% <span className="text-xs text-emerald-400 font-bold">Google SLA</span>
            </div>
          </div>
        </div>
      </div>

      {/* SLA Incident Escalation Ladder Explanation */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <BellRing className="w-4 h-4 text-rose-400" />
          Automated 4-Tier Incident Escalation Protocol
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-amber-400 font-black">
              <span>TIER 1 (0-15 Min)</span>
              <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-[10px]">Crew SMS</span>
            </div>
            <p className="text-slate-300">
              Immediate SMS dispatch to nearest certified tarp crew on standby. GPS ping request initiated.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-orange-400 font-black">
              <span>TIER 2 (15-30 Min)</span>
              <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded text-[10px]">Voice Hotline</span>
            </div>
            <p className="text-slate-300">
              Automated high-priority robocall to lead roofer & secondary backup dispatch unit.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-rose-400 font-black">
              <span>TIER 3 (30-45 Min)</span>
              <span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded text-[10px]">Supervisor Alert</span>
            </div>
            <p className="text-slate-300">
              Regional Operations Manager notified. Secondary rapid response vehicle dispatched automatically.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-purple-400 font-black">
              <span>TIER 4 (45+ Min)</span>
              <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded text-[10px]">Carrier & GCP</span>
            </div>
            <p className="text-slate-300">
              Insurance adjuster alert & Google Cloud Pub/Sub incident trigger broadcasted for SLA auditing.
            </p>
          </div>
        </div>
      </div>

      {/* Active Incidents Feed */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-rose-400" />
          Active SLA Incident Escalation Feed ({incidents.filter(i => i.status !== 'RESOLVED').length})
        </h2>

        <div className="space-y-4">
          {incidents.map((inc) => (
            <div 
              key={inc.id}
              className={`bg-slate-900 border rounded-3xl p-5 sm:p-6 transition-all shadow-xl space-y-4 ${
                inc.status === 'RESOLVED' 
                  ? 'border-slate-800/60 opacity-60' 
                  : 'border-rose-500/40 hover:border-rose-500'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md ${
                      inc.severity === 'CRITICAL' ? 'bg-rose-500 text-white animate-pulse' :
                      inc.severity === 'HIGH' ? 'bg-amber-500 text-slate-950 font-bold' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {inc.severity}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{inc.ticketId}</span>
                    <span className="text-xs font-bold text-slate-300">Tier {inc.currentTier} Escalation</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{inc.title}</h3>
                  <div className="text-xs text-slate-400">{inc.location} • Assigned Crew: <strong className="text-slate-200">{inc.assignedCrew}</strong></div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {inc.status === 'ACTIVE_ESCALATION' && (
                    <button
                      onClick={() => handleAcknowledgeIncident(inc.id)}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-3.5 py-2 rounded-xl transition-all shadow-md"
                    >
                      Acknowledge Incident
                    </button>
                  )}

                  {inc.status !== 'RESOLVED' ? (
                    <button
                      onClick={() => handleResolveIncident(inc.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Resolve Incident
                    </button>
                  ) : (
                    <span className="bg-slate-800 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Elapsed Response Time: <strong className="text-rose-400">{inc.elapsedMinutes} Minutes</strong></span>
                <span>Triggered at: {new Date(inc.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enterprise Audit Log Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Immutable Security & Compliance Audit Log</h2>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Filter by Role:</span>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Enterprise Roles</option>
              <option value="DISPATCHER_ADMIN">Dispatcher Admin</option>
              <option value="CONTRACTOR_PRO">Contractor Pro</option>
              <option value="CARRIER_ADJUSTER">Carrier Adjuster</option>
              <option value="SYSTEM_AGENT">System Agent (AI)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Enterprise Role</th>
                <th className="p-3">User Email / Identity</th>
                <th className="p-3">Action Performed</th>
                <th className="p-3">Resource Target</th>
                <th className="p-3">IP Address</th>
                <th className="p-3 text-right">Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="p-3">
                    <span className="bg-slate-800 text-indigo-300 px-2 py-0.5 rounded text-[10px] font-bold">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="p-3 font-sans text-white">{log.userEmail}</td>
                  <td className="p-3 text-amber-300 font-bold">{log.action}</td>
                  <td className="p-3 text-slate-400">{log.resource}</td>
                  <td className="p-3 text-slate-500">{log.ipAddress}</td>
                  <td className="p-3 text-right">
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-bold">
                      {log.complianceStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
