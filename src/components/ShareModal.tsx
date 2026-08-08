import React, { useState } from 'react';
import { Share2, MessageSquare, Send, Copy, Check, QrCode, Smartphone, X, Globe, Facebook, Twitter, Linkedin, Mail, ExternalLink, Sparkles, Megaphone, Users, Download, Building, Briefcase, ShieldAlert, Home, FileText, ChevronRight } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'social' | 'campaign'>('social');
  const [copied, setCopied] = useState(false);
  const [copiedPost, setCopiedPost] = useState(false);
  const [recipientPhone, setRecipientPhone] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [postTemplate, setPostTemplate] = useState<'emergency' | 'referral' | 'contractor'>('emergency');

  // Campaign Generator State
  const [campaignAudience, setCampaignAudience] = useState<'contractors' | 'property_managers' | 'insurance' | 'homeowners'>('contractors');
  const [campaignChannel, setCampaignChannel] = useState<'email' | 'sms' | 'both'>('both');
  const [campaignRegion, setCampaignRegion] = useState('Metro Atlanta & Statewide GA');
  const [campaignIncentive, setCampaignIncentive] = useState('24/7 Priority Emergency Tarping Dispatch & Carrier Claim Assistance');
  const [campaignRecipients, setCampaignRecipients] = useState('');
  const [copiedCampaignSubject, setCopiedCampaignSubject] = useState(false);
  const [copiedCampaignBody, setCopiedCampaignBody] = useState(false);
  const [copiedCampaignSms, setCopiedCampaignSms] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://a-newroof.com/';

  const postCaptions = {
    emergency: `🚨 STORM DAMAGE & ROOF LEAK EMERGENCY HOTLINE 🚨\nIf your home or business roof has storm damage, fallen tree limbs, or leaks, call the 24/7 Emergency Dispatch Center at (706) 740-0529 or request instant crew tarping dispatch online:`,
    referral: `Need reliable 24/7 emergency roof tarping and rapid leak repair? Check out the Emergency Roof Tarping Response Hub! Instant contractor dispatch, transparent cost estimator, and storm alert tracker. Hotline: (706) 740-0529`,
    contractor: `Calling all roofing contractors & storm repair specialists! Access real-time emergency tarping leads and contractor dispatch requests in your area. Hotline: (706) 740-0529`
  };

  const hashtags = ` #EmergencyRoofing #RoofTarping #RoofRepair #StormDamage #7067400529 #RoofingContractor`;

  const fullSocialText = `${postCaptions[postTemplate] || postCaptions.emergency}\n${hashtags}`;
  const shareMessage = `Need emergency roof tarping or storm leak repair? Emergency Roof Tarping & Repair Dispatch Hotline: (706) 740-0529. Request instant crew dispatch or instant estimate here: ${currentUrl}`;

  const [smsCopied, setSmsCopied] = useState(false);
  const [smsStatusMessage, setSmsStatusMessage] = useState<string | null>(null);

  const getSmsUrl = () => {
    const encodedBody = encodeURIComponent(shareMessage);
    const cleanPhone = recipientPhone.replace(/[^0-9+]/g, '');
    
    // Detect iOS / iPadOS / macOS
    const isIOS = typeof navigator !== 'undefined' && (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );

    const delimiter = isIOS ? '&' : '?';

    if (cleanPhone) {
      return `sms:${cleanPhone}${delimiter}body=${encodedBody}`;
    }
    return `sms:${delimiter}body=${encodedBody}`;
  };

  const handleCopyLink = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(currentUrl);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Clipboard write error:', e);
    }
  };

  const handleCopyPost = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(`${fullSocialText}\n\n${currentUrl}`);
      }
      setCopiedPost(true);
      setTimeout(() => setCopiedPost(false), 2500);
    } catch (e) {
      console.warn('Clipboard write error:', e);
    }
  };

  const handleDownloadFlyer = async () => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = '/og-image.jpg';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = (e) => reject(e);
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 1200;
      canvas.height = img.naturalHeight || 630;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'Emergency-Roof-Tarping-Hotline-706-740-0529.jpg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      } else {
        window.open('/og-image.jpg', '_blank');
      }
    } catch (err) {
      window.open('/og-image.jpg', '_blank');
    }
  };

  const handleSendSms = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    const smsUrl = getSmsUrl();
    
    // 1. Copy message text to clipboard as primary guarantee
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareMessage);
      }
      setSmsCopied(true);
      setTimeout(() => setSmsCopied(false), 3000);
    } catch (err) {
      // ignore
    }

    // 2. Set user status message
    setSmsStatusMessage('Text copied to clipboard! Opening SMS messaging app...');
    setTimeout(() => setSmsStatusMessage(null), 4000);

    // 3. Open SMS via temporary anchor element to prevent window.location.href iframe unloads
    try {
      const link = document.createElement('a');
      link.href = smsUrl;
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.warn('SMS link click prevented by environment:', err);
    }
  };

  const handleNativeShare = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    // 1. Copy text to clipboard as guaranteed backup first
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareMessage);
        setSmsCopied(true);
        setTimeout(() => setSmsCopied(false), 3000);
      }
    } catch (err) {
      // ignore
    }

    // 2. Attempt Web Share API if supported and allowed
    if (typeof navigator !== 'undefined' && 'share' in navigator && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: 'Emergency Roof Tarping & Leak Repair Hotline (706) 740-0529',
          text: shareMessage,
          url: currentUrl,
        });
        setSmsStatusMessage('Shared successfully!');
        setTimeout(() => setSmsStatusMessage(null), 4000);
        return;
      } catch (err: any) {
        // User cancelled or share permission blocked in iframe
        if (err && err.name === 'AbortError') {
          return;
        }
      }
    }

    // 3. Fallback to SMS trigger
    handleSendSms();
  };

  // Campaign Generator Templates & Dynamic Constructor
  const getCampaignData = () => {
    const trackedLink = `${currentUrl.split('?')[0]}?utm_source=campaign&utm_medium=${campaignChannel}&utm_campaign=${campaignAudience}_invite`;
    
    if (campaignAudience === 'contractors') {
      return {
        title: 'Roofing Contractors & Subcontractor Network Invitation',
        subject: `[Partner Invitation] Claim 24/7 Emergency Tarping & Repair Jobs in ${campaignRegion}`,
        emailBody: `Hello Roofing Specialist,

We are actively expanding our 24/7 Emergency Tarping & Storm Response Network in ${campaignRegion}.

When severe weather hits, property owners need certified emergency tarping and temporary leak containment immediately. We dispatch vetted local crews with guaranteed rate cards and instant job alerts.

Key Network Partner Benefits:
• Instant SMS Job Alerts for High-Urgency Tarping & Leak Patching
• Standardized Line-Item Rate Cards ($650 – $1,850+ per Tarp Job)
• Direct Carrier Supplement & Report Writer for Fast Claim Payouts
• 24/7 Live Emergency Hotline Support: (706) 740-0529

Special Partner Offer: ${campaignIncentive}

Claim your contractor profile & join the dispatch network today:
${trackedLink}

Best regards,
Emergency Tarping Dispatch Center
Direct Hotline: (706) 740-0529`,
        sms: `🚨 ROOFERS: Claim 24/7 Emergency Tarping & Repair Jobs in ${campaignRegion}! Standardized rates + instant dispatch alerts. Hotline: (706) 740-0529. Join here: ${trackedLink}`
      };
    }

    if (campaignAudience === 'property_managers') {
      return {
        title: 'Property Managers & HOA Community Leaders Invitation',
        subject: `[24/7 Emergency Hotline] Fast Roof Tarping & Storm Protection for Properties in ${campaignRegion}`,
        emailBody: `Dear Property Manager / Board Member,

Unexpected roof leaks, storm damage, or fallen tree limbs can paralyze your property and cause tens of thousands in interior water damage.

The Emergency Roof Response Hub provides 24/7 rapid-dispatch tarping and leak containment for multi-family, commercial, and HOA communities across ${campaignRegion}.

Why Keep Us on Speed Dial:
• 60-Minute Rapid Tarping Dispatch Line: (706) 740-0529
• Detailed Photo Audit & Damage Documentation for Insurance Adjusters
• Heavy-Duty Fire-Retardant Tarping & Shrink Wrap Protection
• Special Partner Perk: ${campaignIncentive}

Bookmark our dispatch portal or request an instant emergency crew:
${trackedLink}

Emergency Dispatch Hotline: (706) 740-0529
Save this email for storm emergencies!`,
        sms: `🚨 PROPERTY MANAGERS: 24/7 Rapid Roof Tarping & Leak Repair Dispatch in ${campaignRegion}. Save hotline: (706) 740-0529. Request emergency crew: ${trackedLink}`
      };
    }

    if (campaignAudience === 'insurance') {
      return {
        title: 'Insurance Adjusters & Claims Agents Invitation',
        subject: `[Carrier Tool] Accelerated Emergency Mitigation & Carrier-Ready Tarping Reports for ${campaignRegion}`,
        emailBody: `Dear Claims Specialist / Adjuster,

Minimizing secondary water loss is critical for storm claims in ${campaignRegion}. Our 24/7 Emergency Tarping Dispatch Center provides instant emergency mitigation with carrier-compliant photo reports and Xactimate line-item cost estimates.

What Our Platform Provides Adjusters & Carriers:
• Automated AI Insurance Report Writer with IRC Code Citations
• Moisture & Damage Photo Logs with Timestamp & GPS Verification
• Rapid On-Demand Emergency Tarping Crew Dispatch
• Current Carrier Advantage: ${campaignIncentive}

Access the Insurance Carrier Portal & Report Generator:
${trackedLink}

24/7 Dispatch Hotline: (706) 740-0529`,
        sms: `📋 ADJUSTERS: Fast carrier-ready tarping reports & 24/7 emergency mitigation dispatch in ${campaignRegion}. Hotline: (706) 740-0529. Access portal: ${trackedLink}`
      };
    }

    // Homeowners
    return {
      title: 'Homeowners & Neighborhood Storm Preparedness Invitation',
      subject: `🚨 24/7 Emergency Roof Tarping & Storm Leak Repair Hotline for ${campaignRegion}`,
      emailBody: `Dear Neighbor,

When a severe storm damages your roof or a tree limb creates a leak, waiting days for a contractor leads to severe interior water damage.

Our 24/7 Emergency Tarping Hotline brings certified local crews to your doorstep fast to seal leaks, install heavy-duty tarps, and protect your home.

What We Offer:
• 24/7 Live Emergency Phone Dispatch: (706) 740-0529
• Instant Online Cost & Tarp Size Estimator
• Direct Insurance Claim Assistance & Zero Out-of-Pocket Guidance
• Resident Offer: ${campaignIncentive}

Keep your home protected. Save our dispatch hotline and portal now:
${trackedLink}

Emergency Dispatch Hotline: (706) 740-0529`,
      sms: `🏠 STORM ALERT: Need emergency roof tarping or leak repair in ${campaignRegion}? 24/7 Dispatch Hotline: (706) 740-0529. Request instant crew: ${trackedLink}`
    };
  };

  const handleDownloadCampaignCsv = () => {
    const data = getCampaignData();
    const recipientList = campaignRecipients
      .split(/[\n,;]+/)
      .map(r => r.trim())
      .filter(Boolean);

    const rows = recipientList.length > 0 ? recipientList : ['sample_recipient@example.com'];
    
    let csvContent = 'Recipient,Audience,Channel,Region,Subject,SMS_Text,Tracked_URL\n';
    rows.forEach(r => {
      const escapedSubject = `"${data.subject.replace(/"/g, '""')}"`;
      const escapedSms = `"${data.sms.replace(/"/g, '""')}"`;
      csvContent += `"${r}","${campaignAudience}","${campaignChannel}","${campaignRegion}",${escapedSubject},${escapedSms},"${currentUrl}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Campaign-Invitation-${campaignAudience}-${campaignRegion.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const handleLaunchEmailClient = () => {
    const data = getCampaignData();
    const recipientList = campaignRecipients
      .split(/[\n,;]+/)
      .map(r => r.trim())
      .filter(r => r.includes('@'))
      .join(',');

    const mailtoUrl = `mailto:${recipientList}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.emailBody)}`;
    
    try {
      const link = document.createElement('a');
      link.href = mailtoUrl;
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.warn('Mailto open error:', err);
    }
  };

  // Social sharing direct URLs
  const socialShareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullSocialText)}&url=${encodeURIComponent(currentUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(fullSocialText + '\n\n' + currentUrl)}`,
    nextdoor: `https://nextdoor.com/share/?body=${encodeURIComponent(fullSocialText + '\n' + currentUrl)}`,
    email: `mailto:?subject=${encodeURIComponent("24/7 Emergency Roof Tarping & Repair Hotline: (706) 740-0529")}&body=${encodeURIComponent(fullSocialText + '\n\n' + currentUrl)}`
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-850 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Generate Social Media Post & Share</h3>
              <p className="text-xs text-slate-400">Post to Facebook, X, LinkedIn, Nextdoor or Text directly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1 shrink-0 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('social')}
            className={`flex-1 min-w-[120px] py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'social'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Social Post</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 min-w-[120px] py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'text'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Text / SMS</span>
          </button>

          <button
            onClick={() => setActiveTab('campaign')}
            className={`flex-1 min-w-[150px] py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'campaign'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800/60'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Email/SMS Campaign</span>
          </button>
        </div>

        {/* Modal Body Scrollable */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 scrollbar-thin">

          {activeTab === 'social' ? (
            <div className="space-y-5">
              
              {/* 1-Click Social Media Platforms */}
              <div>
                <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2.5">
                  1-Click Share to Social Networks
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  
                  {/* Facebook */}
                  <a
                    href={socialShareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/40 text-[#1877F2] p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Facebook className="w-4 h-4 fill-current" />
                    <span>Facebook</span>
                    <ExternalLink className="w-3 h-3 opacity-60 ml-auto" />
                  </a>

                  {/* X / Twitter */}
                  <a
                    href={socialShareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Twitter className="w-4 h-4 text-sky-400 fill-current" />
                    <span>X (Twitter)</span>
                    <ExternalLink className="w-3 h-3 opacity-60 ml-auto" />
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={socialShareLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/40 text-[#0A66C2] p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Linkedin className="w-4 h-4 fill-current" />
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3 opacity-60 ml-auto" />
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={socialShareLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                    <ExternalLink className="w-3 h-3 opacity-60 ml-auto" />
                  </a>

                  {/* Nextdoor */}
                  <a
                    href={socialShareLinks.nextdoor}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Nextdoor</span>
                    <ExternalLink className="w-3 h-3 opacity-60 ml-auto" />
                  </a>

                  {/* Email */}
                  <a
                    href={socialShareLinks.email}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>Email Share</span>
                    <ExternalLink className="w-3 h-3 opacity-60 ml-auto" />
                  </a>

                </div>
              </div>

              {/* Caption Template Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Select Post Preset Caption
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPostTemplate('emergency')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                      postTemplate === 'emergency'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    🚨 Storm Alert
                  </button>
                  <button
                    onClick={() => setPostTemplate('referral')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                      postTemplate === 'referral'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    🏠 Neighbor Share
                  </button>
                  <button
                    onClick={() => setPostTemplate('contractor')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                      postTemplate === 'contractor'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    🛠️ Contractor Network
                  </button>
                </div>

                <div className="relative mt-2">
                  <textarea
                    readOnly
                    rows={4}
                    value={`${fullSocialText}\n\n${currentUrl}`}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none resize-none"
                  />
                  <button
                    onClick={handleCopyPost}
                    className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                      copiedPost
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700'
                    }`}
                  >
                    {copiedPost ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Post Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Post Text</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Social Media Preview Card Mockup & Photo Download */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Instant Social Graphic & Photo Post (5x More Impressions)
                  </label>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                    Recommended for Nextdoor & Facebook
                  </span>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 group">
                    <img
                      src="/og-image.jpg"
                      alt="Social Preview Banner"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 bg-slate-950/90 backdrop-blur-md text-amber-400 text-[11px] font-mono px-2.5 py-1 rounded-lg border border-amber-500/40 font-black shadow-lg">
                      HOTLINE: (706) 740-0529
                    </div>
                  </div>
                  
                  <div className="p-3.5 bg-slate-900 border-t border-slate-800 space-y-2.5">
                    <p className="text-xs text-slate-300">
                      <strong>💡 Pro Tip:</strong> Social media algorithms (Facebook, Instagram, Nextdoor) prioritize direct photo uploads over web links. Download this image flyer to attach directly to your social post so neighbors see <strong>(706) 740-0529</strong> instantly!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <button
                        onClick={handleDownloadFlyer}
                        className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>Download High-Res Graphic Flyer</span>
                      </button>

                      <a
                        href="/og-image.jpg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Photo in New Tab</span>
                      </a>

                      <button
                        onClick={handleCopyPost}
                        className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                          copiedPost
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700'
                        }`}
                      >
                        {copiedPost ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-300" />
                            <span>Caption Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy Caption Text</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 italic text-center pt-1">
                      📱 On Mobile: You can also tap & hold the flyer photo above to save directly to your phone's Camera Roll / Photos.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          ) : activeTab === 'text' ? (
            <div className="space-y-5">
              
              {/* Universal SMS / Mobile Share Button */}
              <button
                onClick={handleNativeShare}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
              >
                <Smartphone className="w-5 h-5 text-slate-950" />
                <span>Share via Messages App (SMS / iMessage)</span>
              </button>

              {/* Toast Feedback Banner */}
              {smsStatusMessage && (
                <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{smsStatusMessage}</span>
                </div>
              )}

              {/* Direct SMS Input Form */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Send Text Message Directly
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="Enter Recipient Phone # (Optional)"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={handleSendSms}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-1.5 text-sm transition-all shadow-md shrink-0 active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>{smsCopied ? 'Text Copied!' : 'Text SMS'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Clicking "Text SMS" formats the message for iOS iMessage / Android Messages, copies text to clipboard as backup, and opens your messaging app.
                </p>
              </div>

              {/* Copy Link Section */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  App Web Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 font-mono select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Pre-formatted Message Preview */}
              <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    <span>SMS Message Text Preview:</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareMessage);
                      setSmsCopied(true);
                      setTimeout(() => setSmsCopied(false), 2500);
                    }}
                    className="text-[11px] bg-slate-800 hover:bg-slate-700 text-amber-400 px-2.5 py-1 rounded-lg border border-slate-700 font-bold flex items-center gap-1 transition-colors"
                  >
                    {smsCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{smsCopied ? 'Text Copied!' : 'Copy SMS Text'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300 italic bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  "{shareMessage}"
                </p>
              </div>

              {/* QR Code toggle */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5"
                >
                  <QrCode className="w-4 h-4" />
                  <span>{showQR ? 'Hide QR Code' : 'Show Phone Scan QR Code'}</span>
                </button>
                <div className="text-[11px] text-slate-500 font-mono">
                  Hotline: (706) 740-0529
                </div>
              </div>

              {showQR && (
                <div className="flex flex-col items-center justify-center p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 animate-fadeIn">
                  <div className="p-3 bg-white rounded-xl shadow-lg">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(currentUrl)}`}
                      alt="App QR Code"
                      className="w-36 h-36"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 text-center">
                    Scan with any phone camera to instantly load the Emergency Roof Tarping app.
                  </p>
                </div>
              )}

            </div>
          ) : (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Campaign Header Banner */}
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 p-4 rounded-2xl flex items-start gap-3">
                <div className="p-2.5 bg-amber-500 text-slate-950 font-black rounded-xl shrink-0 mt-0.5">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-sm text-amber-400 uppercase tracking-wider">
                      Email & SMS Outreach Campaign Generator
                    </h4>
                    <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                      Member Acquisition
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Generate high-converting email invitations & SMS blasts to acquire contractors, property managers, adjusters, or local residents.
                  </p>
                </div>
              </div>

              {/* 1. Target Audience Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
                  <span>1. Select Target Audience</span>
                  <span className="text-[10px] text-slate-400 font-normal">Customizes copy & offer tone</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCampaignAudience('contractors')}
                    className={`p-3 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
                      campaignAudience === 'contractors'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">Roofing Contractors</div>
                      <div className="text-[10px] text-slate-400 font-normal">Subcontractors & Crews</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setCampaignAudience('property_managers')}
                    className={`p-3 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
                      campaignAudience === 'property_managers'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <Building className="w-4 h-4 text-sky-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">Property Managers</div>
                      <div className="text-[10px] text-slate-400 font-normal">HOA Boards & Commercial</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setCampaignAudience('insurance')}
                    className={`p-3 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
                      campaignAudience === 'insurance'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">Insurance Adjusters</div>
                      <div className="text-[10px] text-slate-400 font-normal">Claims & Carrier Agents</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setCampaignAudience('homeowners')}
                    className={`p-3 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
                      campaignAudience === 'homeowners'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <Home className="w-4 h-4 text-rose-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">Homeowners</div>
                      <div className="text-[10px] text-slate-400 font-normal">Storm Victims & Locals</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 2. Channel & Customization Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase">Target Region / City</label>
                  <input
                    type="text"
                    value={campaignRegion}
                    onChange={(e) => setCampaignRegion(e.target.value)}
                    placeholder="e.g. Metro Atlanta & North Georgia"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase">Special Incentive / Perk</label>
                  <input
                    type="text"
                    value={campaignIncentive}
                    onChange={(e) => setCampaignIncentive(e.target.value)}
                    placeholder="e.g. Priority Dispatch & Zero Out-of-Pocket"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Batch Recipient List Input (Optional) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Batch Recipient List (Optional)</span>
                  <span className="text-[10px] text-slate-500 font-normal">Enter emails or phone numbers</span>
                </label>
                <textarea
                  rows={2}
                  value={campaignRecipients}
                  onChange={(e) => setCampaignRecipients(e.target.value)}
                  placeholder="Paste email addresses or phone numbers separated by newlines or commas..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono resize-none"
                />
              </div>

              {/* Generated Campaign Content & 1-Click Launch Actions */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                
                {/* Header Actions Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <h5 className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{getCampaignData().title}</span>
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Ready to dispatch via Email, Mailchimp CSV, or SMS</p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={handleLaunchEmailClient}
                      className="bg-sky-600 hover:bg-sky-500 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Launch Email App</span>
                    </button>

                    <button
                      onClick={handleDownloadCampaignCsv}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* Email Subject Line */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>Email Subject Line:</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(getCampaignData().subject);
                        setCopiedCampaignSubject(true);
                        setTimeout(() => setCopiedCampaignSubject(false), 2500);
                      }}
                      className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      {copiedCampaignSubject ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCampaignSubject ? 'Subject Copied!' : 'Copy Subject'}</span>
                    </button>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-amber-200 font-semibold">
                    {getCampaignData().subject}
                  </div>
                </div>

                {/* Email Body Text */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>Email Body Content:</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(getCampaignData().emailBody);
                        setCopiedCampaignBody(true);
                        setTimeout(() => setCopiedCampaignBody(false), 2500);
                      }}
                      className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      {copiedCampaignBody ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCampaignBody ? 'Email Body Copied!' : 'Copy Email Body'}</span>
                    </button>
                  </div>
                  <pre className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto scrollbar-thin">
                    {getCampaignData().emailBody}
                  </pre>
                </div>

                {/* SMS Text Blast Message */}
                <div className="space-y-1 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                      <span>SMS / Text Blast Message:</span>
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(getCampaignData().sms);
                        setCopiedCampaignSms(true);
                        setTimeout(() => setCopiedCampaignSms(false), 2500);
                      }}
                      className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      {copiedCampaignSms ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCampaignSms ? 'SMS Copied!' : 'Copy SMS'}</span>
                    </button>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-emerald-300 font-mono">
                    "{getCampaignData().sms}"
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-500 shrink-0">
          Instant 24/7 Social & Text Share • Hotline: (706) 740-0529
        </div>

      </div>
    </div>
  );
};

