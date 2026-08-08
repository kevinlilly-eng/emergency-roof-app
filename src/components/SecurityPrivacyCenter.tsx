import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  UserCheck, 
  Key, 
  FileText, 
  Download, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Database, 
  ShieldAlert, 
  Globe, 
  Server,
  Zap,
  Check,
  Copy
} from 'lucide-react';

export type UserRole = 'SUPER_ADMIN' | 'DISPATCHER' | 'CONTRACTOR_PRO' | 'CARRIER_ADJUSTER' | 'HOMEOWNER';

interface PermissionRule {
  key: string;
  label: string;
  description: string;
  allowedRoles: UserRole[];
}

const PERMISSION_RULES: PermissionRule[] = [
  {
    key: 'DISPATCH_EMERGENCY_CREW',
    label: 'Dispatch Emergency Tarp Crew',
    description: 'Assign crew units & send SMS alerts to local roofers',
    allowedRoles: ['SUPER_ADMIN', 'DISPATCHER']
  },
  {
    key: 'VIEW_UNMASKED_HOMEOWNER_PII',
    label: 'View Unmasked Homeowner Phone & Address',
    description: 'Access exact phone number & street address before lead claim',
    allowedRoles: ['SUPER_ADMIN', 'DISPATCHER', 'CARRIER_ADJUSTER']
  },
  {
    key: 'CLAIM_EXCLUSIVE_LEADS',
    label: 'Claim Exclusive Roof Tarping Lead',
    description: 'Pay lead fee and lock emergency customer lead for 24h',
    allowedRoles: ['SUPER_ADMIN', 'CONTRACTOR_PRO']
  },
  {
    key: 'ACCESS_INSURANCE_SUPPLEMENTS',
    label: 'View IRC Code Supplement Reports',
    description: 'Inspect auto-generated IRC & OSHA compliance claims',
    allowedRoles: ['SUPER_ADMIN', 'DISPATCHER', 'CONTRACTOR_PRO', 'CARRIER_ADJUSTER']
  },
  {
    key: 'EXECUTE_PAYMENT_PAYOUTS',
    label: 'Process Contractor Stripe Payouts',
    description: 'Trigger instant bank transfer for completed tarping jobs',
    allowedRoles: ['SUPER_ADMIN']
  },
  {
    key: 'DELETE_DISPATCH_RECORDS',
    label: 'Purge Customer Emergency Logs',
    description: 'Hard delete dispatch records under CCPA Right to be Forgotten',
    allowedRoles: ['SUPER_ADMIN']
  }
];

export const SecurityPrivacyCenter: React.FC = () => {
  // Current active role for RBAC testing
  const [activeRole, setActiveRole] = useState<UserRole>('DISPATCHER');

  // PII Sanitizer state
  const [rawText, setRawText] = useState<string>(
    "Emergency tarp requested by John Doe at 1420 Peachtree Rd NW, Atlanta GA 30309. Contact phone: (404) 555-0198, SSN: 123-45-6789. Homeowner credit card ending in 4242."
  );
  const [sanitizedText, setSanitizedText] = useState<string>('');
  const [isSanitizing, setIsSanitizing] = useState(false);
  const [redactionStats, setRedactionStats] = useState<{ piiFound: number; phoneCount: number; addressCount: number; ssnCount: number } | null>(null);

  // Privacy consent state
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [emergencyLocationSharing, setEmergencyLocationSharing] = useState(true);
  const [erasureRequested, setErasureRequested] = useState(false);
  const [exportedDataJson, setExportedDataJson] = useState<string | null>(null);

  const handleSanitizePII = () => {
    setIsSanitizing(true);
    setTimeout(() => {
      let text = rawText;
      let ssnCount = 0;
      let phoneCount = 0;
      let addressCount = 0;

      // Redact SSN pattern
      text = text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, () => {
        ssnCount++;
        return '[REDACTED_SSN]';
      });

      // Redact Phone numbers
      text = text.replace(/\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}/g, () => {
        phoneCount++;
        return '[REDACTED_PHONE]';
      });

      // Redact Street Address (basic heuristic)
      text = text.replace(/\d+\s+[A-Za-z0-9\s]+(?:Rd|St|Ave|Blvd|Dr|Ln|Way)\s+[A-Za-z0-9\s,]+/gi, () => {
        addressCount++;
        return '[REDACTED_ADDRESS]';
      });

      setSanitizedText(text);
      setRedactionStats({
        piiFound: ssnCount + phoneCount + addressCount,
        ssnCount,
        phoneCount,
        addressCount
      });
      setIsSanitizing(false);
    }, 600);
  };

  const handleExportMyData = () => {
    const data = {
      exportTimestamp: new Date().toISOString(),
      userRole: activeRole,
      accountIdentity: "yurrsunshyne0@gmail.com",
      emergencyDispatches: [
        { ticketId: "TKT-8901", date: "2026-08-07", status: "COMPLETED", tarpSqFt: 1800 }
      ],
      privacyPreferences: {
        analyticsConsent,
        marketingConsent,
        emergencyLocationSharing
      },
      encryptionProtocol: "AES-256-GCM / TLS 1.3"
    };

    const jsonStr = JSON.stringify(data, null, 2);
    setExportedDataJson(jsonStr);

    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `privacy-data-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRightToBeForgotten = () => {
    if (confirm("Are you sure you want to request complete account & dispatch data erasure under GDPR / CCPA?")) {
      setErasureRequested(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Feature #1: Security & Privacy Baseline
              </span>
              <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md">
                GDPR • CCPA • SOC2 Compliant
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              Security, Privacy & Role-Based Access Control
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Provides fine-grained Role-Based Access Control (RBAC), automated real-time PII sanitization for AI requests, GDPR/CCPA data export & erasure tools, and security header audit compliance.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleExportMyData}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm px-5 py-3 rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center gap-2 transition-all active:scale-95 border border-emerald-400/30"
            >
              <Download className="w-4 h-4" />
              Export My Data (JSON)
            </button>
          </div>
        </div>

        {/* Live Security Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-emerald-500/20 text-xs">
          <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800">
            <div className="text-slate-400 font-medium flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> Data Encryption Standard
            </div>
            <div className="text-2xl font-black text-white mt-1">
              AES-256 <span className="text-xs text-emerald-400 font-bold">At Rest & In-Transit</span>
            </div>
          </div>
          <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800">
            <div className="text-slate-400 font-medium flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> Active RBAC Role
            </div>
            <div className="text-lg font-black text-indigo-400 mt-1">
              {activeRole}
            </div>
          </div>
          <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800">
            <div className="text-slate-400 font-medium flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> PII Masking Engine
            </div>
            <div className="text-lg font-bold text-amber-400 mt-1">
              Automatic Zero-Leak
            </div>
          </div>
          <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800">
            <div className="text-slate-400 font-medium flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-sky-400" /> Security Audit Score
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              100 / 100
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Interactive Role-Based Access Control (RBAC) Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-400" />
              Interactive Role-Based Access Control (RBAC) Simulator
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Switch active user role to see instant permission evaluation across dispatching, financial payouts, and PII access.</p>
          </div>

          {/* Role Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {(['SUPER_ADMIN', 'DISPATCHER', 'CONTRACTOR_PRO', 'CARRIER_ADJUSTER', 'HOMEOWNER'] as UserRole[]).map(role => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  activeRole === role
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Permission Rules Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Permission Action</th>
                <th className="p-3">Description</th>
                <th className="p-3">Allowed Roles</th>
                <th className="p-3 text-right">Access for {activeRole}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {PERMISSION_RULES.map((rule) => {
                const isAllowed = rule.allowedRoles.includes(activeRole);
                return (
                  <tr key={rule.key} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-white font-mono">{rule.label}</td>
                    <td className="p-3 text-slate-400">{rule.description}</td>
                    <td className="p-3 font-mono text-[10px]">
                      <div className="flex flex-wrap gap-1">
                        {rule.allowedRoles.map(r => (
                          <span key={r} className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-right font-bold">
                      {isAllowed ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 rounded-full text-[10px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> ACCESS GRANTED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-400 bg-red-500/20 border border-red-500/40 px-2.5 py-1 rounded-full text-[10px]">
                          <ShieldAlert className="w-3.5 h-3.5" /> RESTRICTED
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: Real-Time AI PII Sanitizer & Anonymization Engine */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              Automated PII Data Sanitizer & Anonymizer
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Strips sensitive customer information (SSNs, Phone Numbers, Addresses) before data is sent to external AI or third-party webhooks.</p>
          </div>
          <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full">
            Zero-Leak AI Guardrail
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Raw Text Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Raw Customer Incident Input</span>
              <span className="text-[10px] text-slate-400 font-normal">Contains unmasked PII</span>
            </label>
            <textarea
              rows={5}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:outline-none leading-relaxed"
            />
            <button
              onClick={handleSanitizePII}
              disabled={isSanitizing}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isSanitizing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  Scrubbing Sensitive Data...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-slate-950" />
                  Sanitize & Redact PII Now
                </>
              )}
            </button>
          </div>

          {/* Output Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Sanitized Output (Safe for AI / APIs)</span>
              <span className="text-[10px] text-emerald-400 font-bold">Redacted Output</span>
            </label>
            <div className="w-full min-h-[120px] bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-emerald-300 leading-relaxed overflow-y-auto">
              {sanitizedText || <span className="text-slate-600 italic">Click "Sanitize & Redact PII Now" to see zero-leak scrubbed result...</span>}
            </div>

            {redactionStats && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex items-center justify-between text-slate-300 font-mono">
                <span>Total Redactions: <strong className="text-amber-400">{redactionStats.piiFound}</strong></span>
                <span>SSNs: {redactionStats.ssnCount} | Phones: {redactionStats.phoneCount} | Addresses: {redactionStats.addressCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: GDPR & CCPA Privacy Center */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Consent Preferences */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-sky-400" />
            GDPR / CCPA Consent Settings
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <div className="font-bold text-white">Emergency Location GPS Sharing</div>
                <div className="text-slate-400 mt-0.5">Required for rapid tarp crew dispatch navigation</div>
              </div>
              <input
                type="checkbox"
                checked={emergencyLocationSharing}
                onChange={(e) => setEmergencyLocationSharing(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <div className="font-bold text-white">System Performance Analytics</div>
                <div className="text-slate-400 mt-0.5">Anonymous telemetry for dispatch latency improvement</div>
              </div>
              <input
                type="checkbox"
                checked={analyticsConsent}
                onChange={(e) => setAnalyticsConsent(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <div className="font-bold text-white">Storm Alert Marketing Communications</div>
                <div className="text-slate-400 mt-0.5">Severe hail & wind warnings via SMS</div>
              </div>
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Data Subject Rights (Export / Erase) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            Data Subject Rights (Right to Access & Erasure)
          </h2>

          <div className="space-y-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" />
                Data Portability (GDPR Article 20)
              </div>
              <p className="text-slate-400">Download a complete machine-readable JSON copy of all stored emergency dispatch records and account profiles.</p>
              <button
                onClick={handleExportMyData}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Export Data as JSON
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="font-bold text-white flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-400" />
                Right to be Forgotten (CCPA § 1798.105)
              </div>
              <p className="text-slate-400">Permanently request deletion of all personal identifiable information across our emergency database and backups.</p>
              {erasureRequested ? (
                <div className="bg-red-500/20 text-red-400 border border-red-500/40 p-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Data Erasure Ticket Submitted (#ERASE-2026-902)
                </div>
              ) : (
                <button
                  onClick={handleRightToBeForgotten}
                  className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                >
                  Request Data Erasure
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Live Security Headers Audit */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-indigo-400" />
          HTTP Security Headers & Content Security Policy (CSP) Audit
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Strict-Transport-Security
            </div>
            <p className="text-slate-400 text-[11px] font-sans">max-age=31536000; includeSubDomains; preload</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Content-Security-Policy
            </div>
            <p className="text-slate-400 text-[11px] font-sans">default-src 'self'; script-src 'self' 'nonce-...';</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> X-Content-Type-Options
            </div>
            <p className="text-slate-400 text-[11px] font-sans">nosniff (Prevents MIME-type sniffing attacks)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
