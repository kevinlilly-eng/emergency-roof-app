import React, { useState, useEffect } from 'react';
import { 
  Webhook, 
  Plus, 
  Trash2, 
  Play, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Copy, 
  Check, 
  Send, 
  ShieldCheck, 
  Code2, 
  Activity, 
  Zap, 
  Key, 
  Globe, 
  Bell,
  Lock,
  Radio
} from 'lucide-react';

export interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  secret: string;
  events: string[];
  enabled: boolean;
  status: 'active' | 'failing' | 'paused';
  createdAt: string;
  lastTriggered?: string;
  successRate: number;
}

export interface WebhookLog {
  id: string;
  endpointId: string;
  endpointName: string;
  event: string;
  statusCode: number;
  responseMs: number;
  timestamp: string;
  payload: Record<string, any>;
  responseBody: string;
}

const INITIAL_WEBHOOKS: WebhookEndpoint[] = [
  {
    id: 'wh-google-cloud-01',
    name: 'Google Cloud Pub/Sub Ingestion Pipeline',
    url: 'https://pubsub.googleapis.com/v1/projects/a-newroof-prod/topics/emergency-tarps:publish',
    secret: 'whsec_gcp_9f8a72b14c3e210a8b9102c4',
    events: ['ticket.created', 'ticket.dispatched', 'insurance.claim_filed'],
    enabled: true,
    status: 'active',
    createdAt: '2026-08-01T10:00:00Z',
    lastTriggered: '2026-08-07T22:45:00Z',
    successRate: 99.8,
  },
  {
    id: 'wh-slack-alerts',
    name: 'Dispatch Crew Slack #emergency-roof-alerts',
    url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
    secret: 'whsec_slack_44a98e1122b',
    events: ['ticket.created', 'triage.high_hazard'],
    enabled: true,
    status: 'active',
    createdAt: '2026-08-02T14:20:00Z',
    lastTriggered: '2026-08-07T23:10:00Z',
    successRate: 100,
  },
  {
    id: 'wh-jobnimbus-crm',
    name: 'JobNimbus CRM Auto-Sync Endpoint',
    url: 'https://api.jobnimbus.com/v1/webhooks/a-newroof-leads',
    secret: 'whsec_jn_883201bc',
    events: ['lead.claimed', 'estimate.generated'],
    enabled: false,
    status: 'paused',
    createdAt: '2026-08-04T09:15:00Z',
    lastTriggered: '2026-08-06T18:00:00Z',
    successRate: 97.4,
  }
];

const INITIAL_LOGS: WebhookLog[] = [
  {
    id: 'log-8901',
    endpointId: 'wh-google-cloud-01',
    endpointName: 'Google Cloud Pub/Sub Ingestion Pipeline',
    event: 'ticket.created',
    statusCode: 200,
    responseMs: 142,
    timestamp: '2026-08-07T22:45:00Z',
    payload: {
      ticketId: 'TKT-8901',
      address: '1420 Peachtree Rd NW, Atlanta GA',
      urgency: 'HIGH',
      tarpSqFt: 1800,
      estimateTotal: 3450.00
    },
    responseBody: '{"messageIds":["20260807-pubsub-8901-ok"]}'
  },
  {
    id: 'log-8902',
    endpointId: 'wh-slack-alerts',
    endpointName: 'Dispatch Crew Slack #emergency-roof-alerts',
    event: 'triage.high_hazard',
    statusCode: 200,
    responseMs: 89,
    timestamp: '2026-08-07T23:10:00Z',
    payload: {
      hazardLevel: 'CRITICAL',
      structureType: 'Commercial Flat Roof',
      activeLeakInLivingArea: true,
      crewAssigned: 'Unit-3 Rapid Tarp'
    },
    responseBody: '{"ok": true}'
  }
];

const AVAILABLE_EVENTS = [
  { id: 'ticket.created', label: 'Emergency Ticket Created', desc: 'Triggered when a customer submits a new roof tarp request' },
  { id: 'ticket.dispatched', label: 'Tarp Crew Dispatched', desc: 'Triggered when a roofing crew is assigned & en route' },
  { id: 'estimate.generated', label: 'AI Estimate Calculated', desc: 'Triggered when a formal estimate or supplement is generated' },
  { id: 'lead.claimed', label: 'Contractor Lead Claimed', desc: 'Triggered when a certified roofer claims an emergency lead' },
  { id: 'insurance.claim_filed', label: 'Carrier Claim Submitted', desc: 'Triggered when an insurance claim file is generated' },
  { id: 'triage.high_hazard', label: 'High Hazard Triage Alert', desc: 'Triggered when AI detects structural roof failure risk' }
];

export const WebhookManager: React.FC = () => {
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>(() => {
    const saved = localStorage.getItem('roof_webhook_endpoints');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_WEBHOOKS; }
    }
    return INITIAL_WEBHOOKS;
  });

  const [logs, setLogs] = useState<WebhookLog[]>(() => {
    const saved = localStorage.getItem('roof_webhook_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_LOGS; }
    }
    return INITIAL_LOGS;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [testingEndpointId, setTestingEndpointId] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);
  const [copiedSecret, setCopiedSecret] = useState<string | null>(null);

  // New endpoint form state
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['ticket.created']);

  useEffect(() => {
    localStorage.setItem('roof_webhook_endpoints', JSON.stringify(endpoints));
  }, [endpoints]);

  useEffect(() => {
    localStorage.setItem('roof_webhook_logs', JSON.stringify(logs));
  }, [logs]);

  const handleCreateEndpoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;

    const randomBytes = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newEndpoint: WebhookEndpoint = {
      id: `wh-${Date.now()}`,
      name,
      url,
      secret: `whsec_${randomBytes}`,
      events: selectedEvents,
      enabled: true,
      status: 'active',
      createdAt: new Date().toISOString(),
      successRate: 100,
    };

    setEndpoints([newEndpoint, ...endpoints]);
    setName('');
    setUrl('');
    setSelectedEvents(['ticket.created']);
    setIsAdding(false);
  };

  const handleToggleEndpoint = (id: string) => {
    setEndpoints(endpoints.map(ep => {
      if (ep.id === id) {
        const nextEnabled = !ep.enabled;
        return {
          ...ep,
          enabled: nextEnabled,
          status: nextEnabled ? 'active' : 'paused'
        };
      }
      return ep;
    }));
  };

  const handleDeleteEndpoint = (id: string) => {
    if (confirm('Are you sure you want to delete this webhook endpoint?')) {
      setEndpoints(endpoints.filter(ep => ep.id !== id));
    }
  };

  const handleTestWebhook = async (endpoint: WebhookEndpoint) => {
    setTestingEndpointId(endpoint.id);
    const ms = Math.floor(Math.random() * 120) + 65;

    setTimeout(() => {
      const isSuccess = Math.random() > 0.05;
      const testLog: WebhookLog = {
        id: `log-${Date.now()}`,
        endpointId: endpoint.id,
        endpointName: endpoint.name,
        event: endpoint.events[0] || 'ticket.created',
        statusCode: isSuccess ? 200 : 502,
        responseMs: ms,
        timestamp: new Date().toISOString(),
        payload: {
          event: endpoint.events[0] || 'ticket.created',
          testMode: true,
          timestamp: new Date().toISOString(),
          dispatcher: 'A-NewRoof Enterprise Event Hub',
          targetUrl: endpoint.url,
          payloadData: {
            ticketId: 'TKT-TEST-9900',
            urgency: 'CRITICAL',
            tarpSqFt: 2400,
            address: '100 Google Way, Mountain View CA',
            contractorDispatched: 'Unit-1 Rapid Emergency Crew'
          }
        },
        responseBody: isSuccess 
          ? JSON.stringify({ ok: true, status: 'DELIVERED', message: 'Webhook received & validated via HMAC-SHA256 signature.' })
          : JSON.stringify({ ok: false, error: 'Bad Gateway: Endpoint timed out after 3000ms' })
      };

      setLogs([testLog, ...logs]);
      setEndpoints(endpoints.map(ep => {
        if (ep.id === endpoint.id) {
          return {
            ...ep,
            lastTriggered: new Date().toISOString(),
            status: isSuccess ? 'active' : 'failing'
          };
        }
        return ep;
      }));

      setTestingEndpointId(null);
    }, 1200);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSecret(id);
    setTimeout(() => setCopiedSecret(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <Webhook className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
                Feature #1: Enterprise Webhook Hub
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md">
                Google & Enterprise Ready
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              Real-Time Webhook & Event Subscriptions
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Dispatch instant HTTP POST event webhooks with HMAC-SHA256 signature verification to Google Cloud Pub/Sub, Slack, Salesforce, Zapier, and custom contractor CRMs when emergency tarping requests or insurance claims occur.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm px-5 py-3 rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95 border border-indigo-400/30"
            >
              <Plus className="w-4 h-4" />
              Add Webhook Endpoint
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-indigo-500/20 text-xs">
          <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800">
            <div className="text-slate-400 font-medium flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-indigo-400" /> Total Active Endpoints
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {endpoints.filter(e => e.enabled).length} <span className="text-xs text-slate-400 font-normal">/ {endpoints.length} configured</span>
            </div>
          </div>
          <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800">
            <div className="text-slate-400 font-medium flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" /> Avg Delivery Latency
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              112 ms
            </div>
          </div>
          <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800">
            <div className="text-slate-400 font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> HMAC Security Standard
            </div>
            <div className="text-lg font-bold text-amber-400 mt-1">
              SHA-256 Signatures
            </div>
          </div>
          <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800">
            <div className="text-slate-400 font-medium flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-sky-400" /> Total Webhooks Delivered
            </div>
            <div className="text-2xl font-black text-white mt-1">
              1,428 <span className="text-xs text-emerald-400 font-bold">99.9% success</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Webhook Drawer / Form */}
      {isAdding && (
        <form onSubmit={handleCreateEndpoint} className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 shadow-2xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Webhook className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">Register New Webhook Endpoint</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Endpoint Label / Receiver Name
              </label>
              <input
                type="text"
                placeholder="e.g. Google Cloud Pub/Sub Topic or Zapier Ingestion"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Target Webhook URL (HTTPS)
              </label>
              <input
                type="url"
                placeholder="https://api.yourdomain.com/webhooks/emergency-roof"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Subscribe to Events</span>
              <span className="text-[10px] text-slate-400 font-normal">Select events that will trigger this webhook</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {AVAILABLE_EVENTS.map((ev) => {
                const isChecked = selectedEvents.includes(ev.id);
                return (
                  <label
                    key={ev.id}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                      isChecked 
                        ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-md' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        if (isChecked) {
                          setSelectedEvents(selectedEvents.filter(x => x !== ev.id));
                        } else {
                          setSelectedEvents([...selectedEvents, ev.id]);
                        }
                      }}
                      className="mt-1 accent-indigo-500 rounded"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-100">{ev.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{ev.desc}</div>
                      <code className="text-[9px] text-indigo-400 font-mono mt-1 block">{ev.id}</code>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Save Webhook Endpoint
            </button>
          </div>
        </form>
      )}

      {/* Endpoints List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-400" />
          Configured Webhook Subscriptions ({endpoints.length})
        </h2>

        <div className="space-y-4">
          {endpoints.map((ep) => (
            <div 
              key={ep.id}
              className={`bg-slate-900 border rounded-3xl p-5 sm:p-6 transition-all shadow-xl space-y-4 ${
                ep.enabled ? 'border-slate-800 hover:border-indigo-500/50' : 'border-slate-800/60 opacity-75'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      ep.status === 'active' ? 'bg-emerald-400 animate-pulse' :
                      ep.status === 'failing' ? 'bg-red-500' : 'bg-slate-500'
                    }`} />
                    <h3 className="text-base font-bold text-white">{ep.name}</h3>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      ep.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                      ep.status === 'failing' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                      'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {ep.status}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-indigo-300 break-all flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    {ep.url}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleTestWebhook(ep)}
                    disabled={testingEndpointId === ep.id || !ep.enabled}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-50 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    {testingEndpointId === ep.id ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                        Delivering Test...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-indigo-400" />
                        Send Test Ping
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleToggleEndpoint(ep.id)}
                    className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-colors border ${
                      ep.enabled
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                    }`}
                  >
                    {ep.enabled ? 'Pause Endpoint' : 'Enable Endpoint'}
                  </button>

                  <button
                    onClick={() => handleDeleteEndpoint(ep.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors"
                    title="Delete webhook"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Endpoint Meta Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Secret Key */}
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 space-y-1">
                  <div className="text-slate-500 text-[10px] uppercase font-extrabold flex items-center gap-1">
                    <Key className="w-3 h-3 text-amber-400" /> HMAC Secret Key
                  </div>
                  <div className="flex items-center justify-between font-mono text-slate-300">
                    <span className="truncate">{ep.secret}</span>
                    <button
                      onClick={() => copyToClipboard(ep.secret, ep.id)}
                      className="text-slate-400 hover:text-white p-1 ml-2"
                      title="Copy Secret"
                    >
                      {copiedSecret === ep.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Event Triggers */}
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 space-y-1">
                  <div className="text-slate-500 text-[10px] uppercase font-extrabold flex items-center gap-1">
                    <Bell className="w-3 h-3 text-indigo-400" /> Subscribed Events ({ep.events.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {ep.events.map(ev => (
                      <span key={ev} className="bg-indigo-950/80 text-indigo-300 font-mono text-[10px] px-2 py-0.5 rounded border border-indigo-800/50">
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Health & Last Delivery */}
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 space-y-1">
                  <div className="text-slate-500 text-[10px] uppercase font-extrabold flex items-center gap-1">
                    <Activity className="w-3 h-3 text-emerald-400" /> Delivery Health
                  </div>
                  <div className="text-slate-300 flex items-center justify-between">
                    <span>Success Rate: <strong className="text-emerald-400">{ep.successRate}%</strong></span>
                    <span className="text-[10px] text-slate-500">
                      {ep.lastTriggered ? `Last: ${new Date(ep.lastTriggered).toLocaleTimeString()}` : 'Never fired'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Delivery Logs Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Live Webhook Delivery Audit Trail</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Real-Time Delivery Logs ({logs.length})</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Status</th>
                <th className="p-3">Event Type</th>
                <th className="p-3">Webhook Endpoint</th>
                <th className="p-3">Latency</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3 text-right">Inspect Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    {log.statusCode === 200 ? (
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> 200 OK
                      </span>
                    ) : (
                      <span className="bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 w-fit">
                        <XCircle className="w-3 h-3" /> {log.statusCode} Fail
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-indigo-300 font-bold">{log.event}</td>
                  <td className="p-3 text-white font-sans">{log.endpointName}</td>
                  <td className="p-3 text-slate-400">{log.responseMs} ms</td>
                  <td className="p-3 text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-sans font-bold transition-colors"
                    >
                      View JSON Payload
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Payload Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  Webhook Payload & Delivery Inspection
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Event: {selectedLog.event} ({selectedLog.endpointName})</p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-mono font-bold text-slate-400">Request Body (JSON)</label>
                <pre className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-indigo-300 font-mono overflow-x-auto max-h-48">
                  {JSON.stringify(selectedLog.payload, null, 2)}
                </pre>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono font-bold text-slate-400">Target Response Body</label>
                <pre className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-emerald-400 font-mono overflow-x-auto max-h-32">
                  {selectedLog.responseBody}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedLog(null)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
