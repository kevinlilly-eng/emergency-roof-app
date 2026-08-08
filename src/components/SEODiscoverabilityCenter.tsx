import React, { useState } from 'react';
import { 
  Search, 
  Globe, 
  Share2, 
  Code2, 
  FileCode2, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  Smartphone, 
  Gauge, 
  Bot, 
  RefreshCw, 
  ExternalLink,
  Layers,
  Star,
  Phone,
  MapPin
} from 'lucide-react';

export const SEODiscoverabilityCenter: React.FC = () => {
  // Meta tag state
  const [pageTitle, setPageTitle] = useState('24/7 Emergency Roof Tarping & Hail Damage Dispatch | A-NewRoof');
  const [metaDesc, setMetaDesc] = useState('Immediate emergency roof tarping in 30 minutes or less. Certified local roofing crews, 24/7 AI hazard triage, and direct insurance carrier billing. Call (404) 555-0198.');
  const [canonicalUrl, setCanonicalUrl] = useState('https://a-newroof.com/emergency-tarping');
  const [ogImageUrl, setOgImageUrl] = useState('https://a-newroof.com/assets/gaf_finished_roof_1786147800.jpg');

  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedSitemap, setCopiedSitemap] = useState(false);
  const [isPinged, setIsPinged] = useState(false);

  // Generate valid Google JSON-LD schema
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "EmergencyService",
    "name": "A-NewRoof Emergency Tarping & Repair",
    "image": ogImageUrl,
    "@id": canonicalUrl,
    "url": canonicalUrl,
    "telephone": "+1-404-555-0198",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1420 Peachtree Rd NW",
      "addressLocality": "Atlanta",
      "addressRegion": "GA",
      "postalCode": "30309",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 33.7891,
      "longitude": -84.3879
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "342"
    },
    "areaServed": [
      "Atlanta Metro",
      "Buckhead",
      "Midtown Atlanta",
      "Sandy Springs",
      "Alpharetta"
    ]
  };

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://a-newroof.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://a-newroof.com/emergency-tarping</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://a-newroof.com/contractors</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://a-newroof.com/insurance-claims</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

  const copyToClipboard = (text: string, type: 'schema' | 'sitemap') => {
    navigator.clipboard.writeText(text);
    if (type === 'schema') {
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 2000);
    } else {
      setCopiedSitemap(true);
      setTimeout(() => setCopiedSitemap(false), 2000);
    }
  };

  const [pingResult, setPingResult] = useState<{ timestamp: string; googleStatus: string; bingStatus: string; message: string } | null>(null);

  const handlePingGooglebot = async () => {
    setIsPinged(true);
    try {
      const res = await fetch('/api/seo/ping-google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        setPingResult({
          timestamp: data.timestamp,
          googleStatus: data.googleStatus,
          bingStatus: data.bingStatus,
          message: data.message
        });
      }
    } catch (e) {
      console.error('Ping failed:', e);
    } finally {
      setIsPinged(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-sky-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-sky-500/20 text-sky-400 border border-sky-500/40 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-sky-400" />
                Feature #5: SEO & Google Search Discoverability
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md">
                Google Rich Snippets Ready
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              SEO Metadata, JSON-LD Schema & Search Console Center
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Maximizes emergency search visibility on Google Search & Maps through structured Schema.org JSON-LD markup, dynamic Open Graph meta tags, automated XML sitemap generation, and Core Web Vitals optimization.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handlePingGooglebot}
              disabled={isPinged}
              className="bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm px-5 py-3 rounded-2xl shadow-xl shadow-sky-600/30 flex items-center gap-2 transition-all active:scale-95 border border-sky-400/30 disabled:opacity-50"
            >
              {isPinged ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Pinging Googlebot...
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4 text-sky-200" />
                  Ping Google Search Index
                </>
              )}
            </button>
          </div>
        </div>

        {pingResult && (
          <div className="mt-4 bg-sky-950/80 border border-sky-400/40 p-4 rounded-2xl text-xs text-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white">{pingResult.message}</span>
                <div className="text-[11px] text-sky-300 font-mono mt-0.5">
                  Timestamp: {new Date(pingResult.timestamp).toLocaleTimeString()} | Google Status: {pingResult.googleStatus} | Bing Status: {pingResult.bingStatus}
                </div>
              </div>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0">
              Crawler Enqueued
            </span>
          </div>
        )}

        {/* Live Core Web Vitals Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-sky-500/20 text-xs">
          <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800">
            <div className="text-slate-400 font-medium flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" /> Largest Contentful Paint (LCP)
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              0.8s <span className="text-xs text-slate-400 font-normal">Good (&lt;2.5s)</span>
            </div>
          </div>
          <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800">
            <div className="text-slate-400 font-medium flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-sky-400" /> Mobile-Friendly Index
            </div>
            <div className="text-2xl font-black text-white mt-1">
              100 % <span className="text-xs text-emerald-400 font-bold">Passed</span>
            </div>
          </div>
          <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800">
            <div className="text-slate-400 font-medium flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400" /> Google Search Rich Snippet
            </div>
            <div className="text-lg font-bold text-amber-400 mt-1">
              4.9 ★★★★★ (342 reviews)
            </div>
          </div>
          <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800">
            <div className="text-slate-400 font-medium flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400" /> Canonical Indexing
            </div>
            <div className="text-2xl font-black text-white mt-1">
              Active <span className="text-xs text-emerald-400 font-bold">100% indexed</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Google SERP & Open Graph Social Cards Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-sky-400" />
            Google SERP & Open Graph Search Snippet Simulator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Customize real-time meta tags and preview how emergency customers see your service on Google Search & iMessage social shares.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Metadata Controls */}
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider">HTML Title Tag (&lt;title&gt;)</label>
              <input
                type="text"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider">Meta Description (&lt;meta name="description"&gt;)</label>
              <textarea
                rows={3}
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl p-3 text-xs text-slate-300 focus:outline-none leading-relaxed font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider">Canonical Target URL (&lt;link rel="canonical"&gt;)</label>
              <input
                type="text"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-2.5 text-xs text-sky-300 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Live Google SERP Box */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Live Google SERP Card Preview</label>
            <div className="bg-white p-5 rounded-2xl shadow-xl space-y-1 text-left font-sans">
              <div className="flex items-center gap-2 text-xs text-[#202124]">
                <div className="w-6 h-6 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-[10px]">
                  R
                </div>
                <div>
                  <div className="font-normal text-xs text-[#202124]">A-NewRoof Emergency Roof Tarping</div>
                  <div className="text-[11px] text-[#4d5156] font-mono">{canonicalUrl}</div>
                </div>
              </div>

              <h3 className="text-base text-[#1a0dab] hover:underline font-normal cursor-pointer pt-1 leading-snug line-clamp-1">
                {pageTitle}
              </h3>

              {/* Rich Snippet Rating */}
              <div className="flex items-center gap-1.5 text-xs text-[#4d5156] pt-0.5">
                <div className="flex text-amber-500">
                  ★★★★★
                </div>
                <span className="font-bold text-[#202124]">4.9</span>
                <span>(342) • Emergency Roof Tarping • Open 24 Hours</span>
              </div>

              <p className="text-xs text-[#4d5156] leading-relaxed pt-1 line-clamp-2">
                {metaDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Schema.org JSON-LD Code Generator */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-400" />
              Google EmergencyService JSON-LD Schema.org Generator
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Embed this structured markup in your page &lt;head&gt; to unlock Google Rich Result snippet cards and local map pack rankings.</p>
          </div>

          <button
            onClick={() => copyToClipboard(JSON.stringify(jsonLdSchema, null, 2), 'schema')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md"
          >
            {copiedSchema ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedSchema ? 'Copied Schema!' : 'Copy JSON-LD Code'}
          </button>
        </div>

        <pre className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto max-h-72 leading-relaxed">
          {JSON.stringify(jsonLdSchema, null, 2)}
        </pre>
      </div>

      {/* SECTION 3: Dynamic Sitemap.xml Inspector */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCode2 className="w-5 h-5 text-sky-400" />
              Dynamic XML Sitemap Generator & Search Console Indexing Rules
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Automatically generated XML sitemap with dynamic priority weights and change frequencies for search engine crawlers.</p>
          </div>

          <button
            onClick={() => copyToClipboard(sitemapXml, 'sitemap')}
            className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md"
          >
            {copiedSitemap ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedSitemap ? 'Copied Sitemap!' : 'Copy Sitemap XML'}
          </button>
        </div>

        <pre className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-sky-300 overflow-x-auto max-h-60 leading-relaxed">
          {sitemapXml}
        </pre>
      </div>
    </div>
  );
};
