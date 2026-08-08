import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  MessageSquare, 
  Send, 
  Copy, 
  Check, 
  QrCode, 
  Smartphone, 
  X, 
  Globe, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Sparkles, 
  Megaphone, 
  Users, 
  Download, 
  Building, 
  Briefcase, 
  ShieldAlert, 
  Home, 
  FileText, 
  Image as ImageIcon,
  DollarSign,
  Target,
  Zap,
  Info,
  Loader2
} from 'lucide-react';
import { generateFacebookAdWithAi } from '../lib/gemini';
import { GeminiFacebookAdResponse } from '../types';

import emergencyTarpImg from '../assets/images/emergency_roof_tarp_1786018839293.jpg';
import crewImg from '../assets/images/roofing_crew_work_site_1786147652073.jpg';
import stormDamageImg from '../assets/images/roof_damage_inspection_1786018855423.jpg';
import gafFinishedImg from '../assets/images/gaf_finished_roof_1786147800_1786147849445.jpg';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'social' | 'facebookAd' | 'text' | 'campaign'>('facebookAd');
  const [copied, setCopied] = useState(false);
  const [copiedPost, setCopiedPost] = useState(false);
  const [recipientPhone, setRecipientPhone] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [postTemplate, setPostTemplate] = useState<'emergency' | 'referral' | 'contractor'>('emergency');

  // Interactive Photo Selection for Social & Ads
  const [selectedImageKey, setSelectedImageKey] = useState<'tarp' | 'crew' | 'damage' | 'gaf'>('tarp');

  // Facebook Ad Generator State
  const [adGoal, setAdGoal] = useState('24/7 Emergency Tarping & Rapid Roof Leak Repair');
  const [adRegion, setAdRegion] = useState('Metro Atlanta & Statewide GA');
  const [adPhone, setAdPhone] = useState('(706) 740-0529');
  const [isGeneratingAd, setIsGeneratingAd] = useState(false);
  const [generatedAd, setGeneratedAd] = useState<GeminiFacebookAdResponse | null>(null);
  const [copiedAdText, setCopiedAdText] = useState(false);
  const [copiedAdHeadline, setCopiedAdHeadline] = useState(false);
  const [aiErrorNotice, setAiErrorNotice] = useState<string | null>(null);

  // Campaign Generator State
  const [campaignAudience, setCampaignAudience] = useState<'contractors' | 'property_managers' | 'insurance' | 'homeowners'>('contractors');
  const [campaignChannel, setCampaignChannel] = useState<'email' | 'sms' | 'both'>('both');
  const [campaignRegion, setCampaignRegion] = useState('Metro Atlanta & Statewide GA');
  const [campaignIncentive, setCampaignIncentive] = useState('24/7 Priority Emergency Tarping Dispatch & Carrier Claim Assistance');
  const [campaignRecipients, setCampaignRecipients] = useState('');
  const [copiedCampaignSubject, setCopiedCampaignSubject] = useState(false);
  const [copiedCampaignBody, setCopiedCampaignBody] = useState(false);
  const [copiedCampaignSms, setCopiedCampaignSms] = useState(false);
  const [smsCopied, setSmsCopied] = useState(false);
  const [smsStatusMessage, setSmsStatusMessage] = useState<string | null>(null);

  // Photo Catalog Definition
  const photoMap = {
    tarp: {
      id: 'tarp',
      title: 'Emergency Heavy Tarping',
      src: emergencyTarpImg,
      badge: '🚨 High Urgency',
      alt: '24/7 Heavy Duty Storm Roof Tarping Crew'
    },
    crew: {
      id: 'crew',
      title: 'Active Roofing Crew',
      src: crewImg,
      badge: '🛠️ Subcontractor Crew',
      alt: 'Licensed Roofing Crew Tear Off & Repair Work'
    },
    damage: {
      id: 'damage',
      title: 'Storm Leak Audit',
      src: stormDamageImg,
      badge: '📋 Insurance Loss',
      alt: 'Storm Damage Inspection & Loss Assessment'
    },
    gaf: {
      id: 'gaf',
      title: 'Finished GAF System',
      src: gafFinishedImg,
      badge: '⭐ Completed Quality',
      alt: 'Completed GAF Lifetime Shingle Roof System'
    }
  };

  const currentPhoto = photoMap[selectedImageKey];

  // Custom Domain State
  const getInitialShareUrl = () => {
    if (typeof window !== 'undefined') {
      const href = window.location.href;
      if (!href.includes('run.app') && !href.includes('localhost') && !href.includes('127.0.0.1')) {
        return href;
      }
    }
    return 'https://a-newroof.com/';
  };

  const [shareUrl, setShareUrl] = useState<string>(getInitialShareUrl);

  // Generate initial Facebook Ad when modal opens or component mounts
  useEffect(() => {
    if (isOpen && !generatedAd) {
      handleGenerateAd();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentUrl = shareUrl;

  const handleGenerateAd = async () => {
    setIsGeneratingAd(true);
    setAiErrorNotice(null);
    try {
      const res = await generateFacebookAdWithAi(
        adGoal,
        adRegion,
        adPhone,
        currentPhoto.title
      );
      setGeneratedAd(res);
    } catch (err: any) {
      console.warn('Facebook ad generation warning:', err);
      setAiErrorNotice('Notice: Gemini AI rate limit exceeded or connection busy. Switched to high-converting pre-tested ad campaign template below!');
      // Fallback template
      setGeneratedAd({
        primaryText: `🚨 STORM DAMAGE & ROOF LEAK EMERGENCY? 🚨\n\nWhen severe weather punctures your roof, seconds count! Protect your property from thousands in interior water damage with our 24/7 Emergency Tarping & Rapid Leak Containment Unit.\n\n✅ 60-Minute Rapid Crew Dispatch Across ${adRegion}\n✅ Heavy-Duty UV Poly Tarps & Nail-Sealed Perimeter Anchors\n✅ Direct Carrier Claim Supplement & Insurance Photo Audit\n✅ Free 21-Point Roof Safety & Attic Moisture Audit\n\nDon't let rain ruin your ceiling! Call our 24/7 Dispatch Hotline at ${adPhone} or request instant crew dispatch online:`,
        headline: `🚨 Roof Leak or Storm Damage? Emergency Tarping Dispatched 24/7!`,
        linkDescription: `Call ${adPhone} or request emergency tarping online. 100% Carrier Claim Formatted.`,
        callToActionBtn: `Call Now`,
        targetAudience: {
          locations: `${adRegion} (25-mile radius around active storm zones)`,
          ageGender: `Homeowners & Property Managers, Ages 28–65+`,
          interests: ['Roofing', 'Home Improvement', 'Storm Preparedness', 'Property Management', 'Insurance Claims'],
          behaviors: 'Homeowners, Commercial Property Directors'
        },
        recommendedBudget: '$20.00 – $45.00 / day during storm alerts',
        proMarketingTip: `Attach the real jobsite photo selected below directly to your Facebook Ad post to achieve 3x higher click-through rates!`
      });
    } finally {
      setIsGeneratingAd(false);
    }
  };

  const postCaptions = {
    emergency: `🚨 STORM DAMAGE & ROOF LEAK EMERGENCY HOTLINE 🚨\nIf your home or business roof has storm damage, fallen tree limbs, or leaks, call the 24/7 Emergency Dispatch Center at (706) 740-0529 or request instant crew tarping dispatch online:`,
    referral: `Need reliable 24/7 emergency roof tarping and rapid leak repair? Check out the Emergency Roof Tarping Response Hub! Instant contractor dispatch, transparent cost estimator, and storm alert tracker. Hotline: (706) 740-0529`,
    contractor: `Calling all roofing contractors & storm repair specialists! Access real-time emergency tarping leads and contractor dispatch requests in your area. Hotline: (706) 740-0529`
  };

  const hashtags = ` #EmergencyRoofing #RoofTarping #RoofRepair #StormDamage #7067400529 #RoofingContractor`;

  const fullSocialText = `${postCaptions[postTemplate] || postCaptions.emergency}\n${hashtags}`;
  const shareMessage = `Need emergency roof tarping or storm leak repair? Emergency Roof Tarping & Repair Dispatch Hotline: (706) 740-0529. Request instant crew dispatch or instant estimate here: ${currentUrl}`;

  const getSmsUrl = () => {
    const encodedBody = encodeURIComponent(shareMessage);
    const cleanPhone = recipientPhone.replace(/[^0-9+]/g, '');
    const isIOS = typeof navigator !== 'undefined' && (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );
    const delimiter = isIOS ? '&' : '?';
    return cleanPhone ? `sms:${cleanPhone}${delimiter}body=${encodedBody}` : `sms:${delimiter}body=${encodedBody}`;
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

  const handleDownloadImage = async () => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = currentPhoto.src;
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
        
        // Add watermark overlay
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(20, 20, 480, 60);
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText(`24/7 HOTLINE: ${adPhone}`, 40, 60);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `Ad-Creative-${selectedImageKey}-Hotline-706-740-0529.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      } else {
        window.open(currentPhoto.src, '_blank');
      }
    } catch (err) {
      window.open(currentPhoto.src, '_blank');
    }
  };

  const handleSendSms = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const smsUrl = getSmsUrl();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareMessage);
      }
      setSmsCopied(true);
      setTimeout(() => setSmsCopied(false), 3000);
    } catch (err) {}

    setSmsStatusMessage('Text copied to clipboard! Opening SMS messaging app...');
    setTimeout(() => setSmsStatusMessage(null), 4000);

    try {
      const link = document.createElement('a');
      link.href = smsUrl;
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {}
  };

  const handleNativeShare = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareMessage);
        setSmsCopied(true);
        setTimeout(() => setSmsCopied(false), 3000);
      }
    } catch (err) {}

    if (typeof navigator !== 'undefined' && 'share' in navigator && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: 'Emergency Roof Tarping & Repair Hotline (706) 740-0529',
          text: shareMessage,
          url: currentUrl,
        });
        setSmsStatusMessage('Shared successfully!');
        setTimeout(() => setSmsStatusMessage(null), 4000);
        return;
      } catch (err: any) {
        if (err && err.name === 'AbortError') return;
      }
    }
    handleSendSms();
  };

  // Campaign Generator Data Builder
  const getCampaignData = () => {
    const trackedLink = `${currentUrl.split('?')[0]}?utm_source=campaign&utm_medium=${campaignChannel}&utm_campaign=${campaignAudience}_invite`;
    
    if (campaignAudience === 'contractors') {
      return {
        title: 'Roofing Contractors & Subcontractor Network Invitation',
        subject: `[Partner Invitation] Claim 24/7 Emergency Tarping & Repair Jobs in ${campaignRegion}`,
        emailBody: `Hello Roofing Specialist,\n\nWe are actively expanding our 24/7 Emergency Tarping & Storm Response Network in ${campaignRegion}.\n\nWhen severe weather hits, property owners need certified emergency tarping and temporary leak containment immediately. We dispatch vetted local crews with guaranteed rate cards and instant job alerts.\n\nKey Network Partner Benefits:\n• Instant SMS Job Alerts for High-Urgency Tarping & Leak Patching\n• Standardized Line-Item Rate Cards ($650 – $1,850+ per Tarp Job)\n• Direct Carrier Supplement & Report Writer for Fast Claim Payouts\n• 24/7 Live Emergency Hotline Support: (706) 740-0529\n\nSpecial Partner Offer: ${campaignIncentive}\n\nClaim your contractor profile & join the dispatch network today:\n${trackedLink}\n\nBest regards,\nEmergency Tarping Dispatch Center\nDirect Hotline: (706) 740-0529`,
        sms: `🚨 ROOFERS: Claim 24/7 Emergency Tarping & Repair Jobs in ${campaignRegion}! Standardized rates + instant dispatch alerts. Hotline: (706) 740-0529. Join here: ${trackedLink}`
      };
    }

    if (campaignAudience === 'property_managers') {
      return {
        title: 'Property Managers & HOA Community Leaders Invitation',
        subject: `[24/7 Emergency Hotline] Fast Roof Tarping & Storm Protection for Properties in ${campaignRegion}`,
        emailBody: `Dear Property Manager / Board Member,\n\nUnexpected roof leaks, storm damage, or fallen tree limbs can paralyze your property and cause tens of thousands in interior water damage.\n\nThe Emergency Roof Response Hub provides 24/7 rapid-dispatch tarping and leak containment for multi-family, commercial, and HOA communities across ${campaignRegion}.\n\nWhy Keep Us on Speed Dial:\n• 60-Minute Rapid Tarping Dispatch Line: (706) 740-0529\n• Detailed Photo Audit & Damage Documentation for Insurance Adjusters\n• Heavy-Duty Fire-Retardant Tarping & Shrink Wrap Protection\n• Special Partner Perk: ${campaignIncentive}\n\nBookmark our dispatch portal or request an instant emergency crew:\n${trackedLink}\n\nEmergency Dispatch Hotline: (706) 740-0529\nSave this email for storm emergencies!`,
        sms: `🚨 PROPERTY MANAGERS: 24/7 Rapid Roof Tarping & Leak Repair Dispatch in ${campaignRegion}. Save hotline: (706) 740-0529. Request emergency crew: ${trackedLink}`
      };
    }

    if (campaignAudience === 'insurance') {
      return {
        title: 'Insurance Adjusters & Claims Agents Invitation',
        subject: `[Carrier Tool] Accelerated Emergency Mitigation & Carrier-Ready Tarping Reports for ${campaignRegion}`,
        emailBody: `Dear Claims Specialist / Adjuster,\n\nMinimizing secondary water loss is critical for storm claims in ${campaignRegion}. Our 24/7 Emergency Tarping Dispatch Center provides instant emergency mitigation with carrier-compliant photo reports and Xactimate line-item cost estimates.\n\nWhat Our Platform Provides Adjusters & Carriers:\n• Automated AI Insurance Report Writer with IRC Code Citations\n• Moisture & Damage Photo Logs with Timestamp & GPS Verification\n• Rapid On-Demand Emergency Tarping Crew Dispatch\n• Current Carrier Advantage: ${campaignIncentive}\n\nAccess the Insurance Carrier Portal & Report Generator:\n${trackedLink}\n\n24/7 Dispatch Hotline: (706) 740-0529`,
        sms: `📋 ADJUSTERS: Fast carrier-ready tarping reports & 24/7 emergency mitigation dispatch in ${campaignRegion}. Hotline: (706) 740-0529. Access portal: ${trackedLink}`
      };
    }

    return {
      title: 'Homeowners & Neighborhood Storm Preparedness Invitation',
      subject: `🚨 24/7 Emergency Roof Tarping & Storm Leak Repair Hotline for ${campaignRegion}`,
      emailBody: `Dear Neighbor,\n\nWhen a severe storm damages your roof or a tree limb creates a leak, waiting days for a contractor leads to severe interior water damage.\n\nOur 24/7 Emergency Tarping Hotline brings certified local crews to your doorstep fast to seal leaks, install heavy-duty tarps, and protect your home.\n\nWhat We Offer:\n• 24/7 Live Emergency Phone Dispatch: (706) 740-0529\n• Instant Online Cost & Tarp Size Estimator\n• Direct Insurance Claim Assistance & Zero Out-of-Pocket Guidance\n• Resident Offer: ${campaignIncentive}\n\nKeep your home protected. Save our dispatch hotline and portal now:\n${trackedLink}\n\nEmergency Dispatch Hotline: (706) 740-0529`,
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
    } catch (err) {}
  };

  const socialShareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullSocialText)}&url=${encodeURIComponent(currentUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(fullSocialText + '\n\n' + currentUrl)}`,
    nextdoor: `https://nextdoor.com/share/?body=${encodeURIComponent(fullSocialText + '\n' + currentUrl)}`,
    email: `mailto:?subject=${encodeURIComponent("24/7 Emergency Roof Tarping & Repair Hotline: (706) 740-0529")}&body=${encodeURIComponent(fullSocialText + '\n\n' + currentUrl)}`
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/30">
              <Sparkles className="w-5 h-5 animate-pulse text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">Facebook Ads & AI Social Studio</h3>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-amber-400/30">
                  Gemini 3.6
                </span>
              </div>
              <p className="text-xs text-slate-400">Instantly generate high-converting Facebook Ads, photo creatives & campaigns</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/80 p-2 gap-1.5 shrink-0 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('facebookAd')}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              activeTab === 'facebookAd'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Facebook className="w-4 h-4 fill-current text-blue-400" />
            <span>Facebook Ad Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              activeTab === 'social'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Globe className="w-4 h-4 text-amber-400" />
            <span>Organic Social Post</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              activeTab === 'text'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Text / SMS</span>
          </button>

          <button
            onClick={() => setActiveTab('campaign')}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              activeTab === 'campaign'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Megaphone className="w-4 h-4 text-sky-400" />
            <span>Email/SMS Campaign</span>
          </button>
        </div>

        {/* Shared Target URL Bar */}
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] shrink-0">
          <div className="flex items-center gap-2 overflow-hidden w-full sm:w-auto">
            <span className="text-slate-400 font-bold shrink-0">Ad Landing Page URL:</span>
            <input
              type="text"
              value={shareUrl}
              onChange={(e) => setShareUrl(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-md px-2 py-0.5 text-amber-300 font-mono text-[11px] w-full sm:w-80 focus:outline-none focus:border-amber-400 truncate"
              title="Destination URL embedded in Facebook Ads"
            />
          </div>
          <span className="hidden sm:inline-flex bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0">
            ✓ Public Web Domain
          </span>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">

          {/* TAB 1: FACEBOOK ADS & AI STUDIO */}
          {activeTab === 'facebookAd' ? (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Campaign Inputs Panel */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>AI Facebook Ad Generator Controls</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono">
                    Model: Gemini 3.6 Flash
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase">Ad Campaign Goal</label>
                    <input
                      type="text"
                      value={adGoal}
                      onChange={(e) => setAdGoal(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase">Target Metro / Location</label>
                    <input
                      type="text"
                      value={adRegion}
                      onChange={(e) => setAdRegion(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Select Jobsite Photo Creative */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase flex items-center justify-between">
                    <span>Select Ad Jobsite Photo Creative (Shown in Preview)</span>
                    <span className="text-amber-400 font-normal text-[10px]">4 High-Res Real Jobsite Photos</span>
                  </label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(Object.keys(photoMap) as Array<keyof typeof photoMap>).map((key) => {
                      const item = photoMap[key];
                      const isSelected = selectedImageKey === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSelectedImageKey(key)}
                          className={`group relative rounded-xl overflow-hidden border-2 text-left transition-all ${
                            isSelected
                              ? 'border-amber-400 ring-2 ring-amber-400/30 scale-[1.02]'
                              : 'border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-700'
                          }`}
                        >
                          <div className="aspect-[16/10] w-full overflow-hidden bg-slate-950">
                            <img
                              src={item.src}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <div className="p-1.5 bg-slate-900 border-t border-slate-800">
                            <div className="text-[10px] font-black truncate text-white">{item.title}</div>
                            <div className="text-[9px] text-amber-400 font-semibold">{item.badge}</div>
                          </div>
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full shadow">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    onClick={handleGenerateAd}
                    disabled={isGeneratingAd}
                    className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isGeneratingAd ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Generating Facebook Ad with Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-slate-950" />
                        <span>✨ Regenerate Facebook Ad with Gemini AI</span>
                      </>
                    )}
                  </button>

                  <a
                    href="https://adsmanager.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shrink-0"
                  >
                    <Facebook className="w-4 h-4 fill-current" />
                    <span>Open Facebook Ads Manager</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-1" />
                  </a>
                </div>
              </div>

              {/* Notice if Rate Limit Occurred */}
              {aiErrorNotice && (
                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-3 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
                  <Info className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{aiErrorNotice}</span>
                </div>
              )}

              {/* LIVE FACEBOOK AD MOCKUP CARD WITH IMAGE PREVIEW */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Facebook className="w-4 h-4 text-blue-400" />
                    <span>Live Generated Facebook Ad Preview (Includes Selected Photo)</span>
                  </label>
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 font-extrabold px-2 py-0.5 rounded border border-blue-500/30">
                    Meta Ad Creative Format
                  </span>
                </div>

                {generatedAd ? (
                  <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
                    
                    {/* Facebook Page Header */}
                    <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm border-2 border-amber-400">
                          NR
                        </div>
                        <div>
                          <div className="font-extrabold text-xs text-white flex items-center gap-1.5">
                            <span>A-NewRoof Emergency Tarping & Repair Response</span>
                            <span className="text-blue-400">✓</span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                            <span>Sponsored</span>
                            <span>•</span>
                            <Globe className="w-3 h-3 text-slate-500" />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${generatedAd.primaryText}\n\nHEADLINE: ${generatedAd.headline}\nLINK: ${currentUrl}\nCALL CTA: ${adPhone}`);
                          setCopiedAdText(true);
                          setTimeout(() => setCopiedAdText(false), 2500);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          copiedAdText
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700'
                        }`}
                      >
                        {copiedAdText ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Full Ad Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Ad Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Primary Text */}
                    <div className="p-4 bg-slate-950 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans border-b border-slate-900">
                      {generatedAd.primaryText}
                    </div>

                    {/* Ad Creative Image Display */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 group">
                      <img
                        src={currentPhoto.src}
                        alt={currentPhoto.alt}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* On-Image Phone Badge */}
                      <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md text-amber-400 text-xs font-mono font-black px-3 py-1.5 rounded-xl border border-amber-500/50 shadow-xl flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                        <span>HOTLINE: {adPhone}</span>
                      </div>

                      <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-700">
                        {currentPhoto.title}
                      </div>
                    </div>

                    {/* Newsfeed Link Bar & Call-To-Action Button */}
                    <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          A-NEWROOF.COM / EMERGENCY-DISPATCH
                        </div>
                        <h5 className="font-extrabold text-sm text-white group-hover:text-blue-400 transition-colors">
                          {generatedAd.headline}
                        </h5>
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {generatedAd.linkDescription}
                        </p>
                      </div>

                      <a
                        href="tel:7067400529"
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs text-center shrink-0 shadow-lg transition-all active:scale-95 whitespace-nowrap"
                      >
                        {generatedAd.callToActionBtn || 'Call Now (706) 740-0529'}
                      </a>
                    </div>

                    {/* Download & Launch Actions */}
                    <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-wrap gap-2 items-center justify-between">
                      <button
                        onClick={handleDownloadImage}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2 px-3.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Ad Creative Graphic Image</span>
                      </button>

                      <div className="flex gap-2">
                        <a
                          href={socialShareLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#1877F2]/20 hover:bg-[#1877F2]/30 text-[#1877F2] border border-[#1877F2]/40 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all"
                        >
                          <Facebook className="w-3.5 h-3.5 fill-current" />
                          <span>Share to Facebook Page</span>
                        </a>

                        <a
                          href="https://adsmanager.facebook.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                          <span>Launch Meta Ads Manager</span>
                        </a>
                      </div>
                    </div>

                  </div>
                ) : null}
              </div>

              {/* Target Audience Parameters & Daily Budget Strategy */}
              {generatedAd?.targetAudience && (
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span>Recommended Facebook Audience Targeting & Daily Budget</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="font-bold text-slate-400 uppercase text-[10px]">Locations & Radius</div>
                      <div className="text-slate-200 font-semibold">{generatedAd.targetAudience.locations}</div>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="font-bold text-slate-400 uppercase text-[10px]">Demographics</div>
                      <div className="text-slate-200 font-semibold">{generatedAd.targetAudience.ageGender}</div>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="font-bold text-slate-400 uppercase text-[10px]">Interests & Behaviors</div>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {generatedAd.targetAudience.interests.map((interest, i) => (
                          <span key={i} className="bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded-full font-medium">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="font-bold text-slate-400 uppercase text-[10px]">Recommended Daily Budget</div>
                      <div className="text-amber-400 font-black text-sm flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-amber-400" />
                        <span>{generatedAd.recommendedBudget}</span>
                      </div>
                    </div>
                  </div>

                  {generatedAd.proMarketingTip && (
                    <div className="bg-blue-500/10 border border-blue-500/30 text-blue-300 p-3 rounded-xl text-xs leading-relaxed">
                      <strong>💡 Meta Pro Tip:</strong> {generatedAd.proMarketingTip}
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : activeTab === 'social' ? (
            /* TAB 2: ORGANIC SOCIAL MEDIA POST */
            <div className="space-y-6 animate-fadeIn">
              
              {/* 1-Click Social Media Platforms */}
              <div>
                <label className="block text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-2.5">
                  1-Click Share to Social Networks
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
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
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Select Preset Post Caption</span>
                </label>

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

              {/* Photo Selector & Social Card Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    Select Jobsite Photo Graphic (Visible in Social Feed)
                  </label>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                    Boosts Impressions 5x
                  </span>
                </div>

                {/* Photo Selector Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(Object.keys(photoMap) as Array<keyof typeof photoMap>).map((key) => {
                    const item = photoMap[key];
                    const isSelected = selectedImageKey === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedImageKey(key)}
                        className={`group relative rounded-xl overflow-hidden border-2 text-left transition-all ${
                          isSelected
                            ? 'border-amber-400 ring-2 ring-amber-400/30 scale-[1.02]'
                            : 'border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-700'
                        }`}
                      >
                        <div className="aspect-[16/10] w-full overflow-hidden bg-slate-950">
                          <img
                            src={item.src}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="p-1 bg-slate-900 border-t border-slate-800 text-center">
                          <div className="text-[10px] font-bold text-white truncate">{item.title}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Social Card Preview with Image */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 group">
                    <img
                      src={currentPhoto.src}
                      alt={currentPhoto.alt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 bg-slate-950/90 backdrop-blur-md text-amber-400 text-[11px] font-mono px-2.5 py-1 rounded-lg border border-amber-500/40 font-black shadow-lg">
                      HOTLINE: (706) 740-0529
                    </div>
                  </div>
                  
                  <div className="p-3.5 bg-slate-900 border-t border-slate-800 space-y-2.5">
                    <p className="text-xs text-slate-300">
                      <strong>💡 Pro Tip:</strong> Social media algorithms prioritize direct photo uploads over plain links. Download this image flyer to attach directly to your social post so neighbors see <strong>(706) 740-0529</strong> instantly!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <button
                        onClick={handleDownloadImage}
                        className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>Download High-Res Graphic Flyer</span>
                      </button>

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
                  </div>
                </div>

              </div>

            </div>
          ) : activeTab === 'text' ? (
            /* TAB 3: TEXT / SMS */
            <div className="space-y-5 animate-fadeIn">
              <button
                onClick={handleNativeShare}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
              >
                <Smartphone className="w-5 h-5 text-slate-950" />
                <span>Share via Messages App (SMS / iMessage)</span>
              </button>

              {smsStatusMessage && (
                <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{smsStatusMessage}</span>
                </div>
              )}

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">
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

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
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

              <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
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

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5"
                >
                  <QrCode className="w-4 h-4" />
                  <span>{showQR ? 'Hide QR Code' : 'Show Phone Scan QR Code'}</span>
                </button>
                <div className="text-[11px] text-slate-500 font-mono font-bold">
                  Hotline: (706) 740-0529
                </div>
              </div>

              {showQR && (
                <div className="flex flex-col items-center justify-center p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 animate-fadeIn">
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
            /* TAB 4: EMAIL/SMS CAMPAIGN GENERATOR */
            <div className="space-y-5 animate-fadeIn">
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
                      Outreach Suite
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Generate high-converting email invitations & SMS blasts to acquire contractors, property managers, adjusters, or local residents.
                  </p>
                </div>
              </div>

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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase">Target Region / City</label>
                  <input
                    type="text"
                    value={campaignRegion}
                    onChange={(e) => setCampaignRegion(e.target.value)}
                    placeholder="e.g. Metro Atlanta & North Georgia"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase">Special Incentive / Perk</label>
                  <input
                    type="text"
                    value={campaignIncentive}
                    onChange={(e) => setCampaignIncentive(e.target.value)}
                    placeholder="e.g. Priority Dispatch & Zero Out-of-Pocket"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <h5 className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{getCampaignData().title}</span>
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Ready to dispatch via Email or SMS</p>
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
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-500 shrink-0 font-medium flex items-center justify-between">
          <span>AI Powered Facebook Ad & Marketing Studio</span>
          <span className="font-mono text-amber-400 font-bold">Hotline: (706) 740-0529</span>
        </div>

      </div>
    </div>
  );
};
