import React, { useState } from 'react';
import { Share2, MessageSquare, Send, Copy, Check, QrCode, Smartphone, X, Globe, Facebook, Twitter, Linkedin, Mail, ExternalLink, Sparkles } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'social'>('social');
  const [copied, setCopied] = useState(false);
  const [copiedPost, setCopiedPost] = useState(false);
  const [recipientPhone, setRecipientPhone] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [postTemplate, setPostTemplate] = useState<'emergency' | 'referral' | 'contractor'>('emergency');

  if (!isOpen) return null;

  const currentUrl = window.location.href;

  const postCaptions = {
    emergency: `🚨 STORM DAMAGE & ROOF LEAK EMERGENCY HOTLINE 🚨\nIf your home or business roof has storm damage, fallen tree limbs, or leaks, call the 24/7 Emergency Dispatch Center at (706) 740-0529 or request instant crew tarping dispatch online:`,
    referral: `Need reliable 24/7 emergency roof tarping and rapid leak repair? Check out the Emergency Roof Tarping Response Hub! Instant contractor dispatch, transparent cost estimator, and storm alert tracker. Hotline: (706) 740-0529`,
    contractor: `Calling all roofing contractors & storm repair specialists! Access real-time emergency tarping leads and contractor dispatch requests in your area. Hotline: (706) 740-0529`
  };

  const hashtags = ` #EmergencyRoofing #RoofTarping #RoofRepair #StormDamage #7067400529 #RoofingContractor`;

  const fullSocialText = `${postCaptions[postTemplate]}\n${hashtags}`;
  const shareMessage = `Need emergency roof tarping or storm leak repair? Emergency Roof Tarping & Repair Dispatch Hotline: (706) 740-0529. Request instant crew dispatch or instant estimate here: ${currentUrl}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Emergency Roof Tarping & Leak Repair Hotline (706) 740-0529',
          text: fullSocialText,
          url: currentUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyPost = () => {
    navigator.clipboard.writeText(`${fullSocialText}\n\n${currentUrl}`);
    setCopiedPost(true);
    setTimeout(() => setCopiedPost(false), 2500);
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
      // Fallback: Open directly in a new tab if iframe download is blocked
      window.open('/og-image.jpg', '_blank');
    }
  };

  const getSmsUrl = () => {
    const encodedBody = encodeURIComponent(shareMessage);
    const cleanPhone = recipientPhone.replace(/[^0-9+]/g, '');
    if (cleanPhone) {
      return `sms:${cleanPhone}?body=${encodedBody}`;
    }
    return `sms:?body=${encodedBody}`;
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
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('social')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'social'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Generate Social Media Post</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'text'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Text / SMS Message</span>
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
          ) : (
            <div className="space-y-5">
              
              {/* Native Mobile Share Button */}
              {'share' in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
                >
                  <Smartphone className="w-5 h-5" />
                  <span>Share via Phone Messages App (SMS / iMessage)</span>
                </button>
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
                  <a
                    href={getSmsUrl()}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-1.5 text-sm transition-all shadow-md shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>Text SMS</span>
                  </a>
                </div>
                <p className="text-[11px] text-slate-400">
                  Clicking "Text SMS" opens your phone or computer's default Messaging app with the pre-written dispatch message ready to send.
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
              <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-slate-400">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>SMS Preview Message:</span>
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

