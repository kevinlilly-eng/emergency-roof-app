import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  AlertTriangle, 
  Camera, 
  Upload, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  Navigation, 
  Zap,
  Sparkles,
  Phone,
  FileText,
  User,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DispatchTicket, EmergencySeverity, RoofMaterial, RoofPitch, DamagePhoto } from '../types';
import { MOCK_CREW_UNITS, SAMPLE_DAMAGE_PHOTOS } from '../data/mockData';
import { calculateRoofEstimate } from '../utils/calculator';

interface EmergencyFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated: (ticket: DispatchTicket) => void;
}

export const EmergencyFlowModal: React.FC<EmergencyFlowModalProps> = ({
  isOpen,
  onClose,
  onTicketCreated,
}) => {
  const [step, setStep] = useState<number>(1);
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);

  // Form State
  const [address, setAddress] = useState('1428 Elmwood Ridge Dr');
  const [city, setCity] = useState('Oakridge');
  const [state, setState] = useState('TX');
  const [zip, setZip] = useState('75001');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 32.7767, lng: -96.797 });

  const [severity, setSeverity] = useState<EmergencySeverity>('CRITICAL');
  const [hasActiveWaterLeak, setHasActiveWaterLeak] = useState(true);
  const [hasCeilingSag, setHasCeilingSag] = useState(true);
  const [hasTreeDamage, setHasTreeDamage] = useState(false);
  
  const [roofMaterial, setRoofMaterial] = useState<RoofMaterial>('ASPHALT_SHINGLE');
  const [roofPitch, setRoofPitch] = useState<RoofPitch>('STEEP_PITCH');
  const [stories, setStories] = useState<number>(2);
  const [estimatedSqFt, setEstimatedSqFt] = useState<number>(400);

  const [photos, setPhotos] = useState<DamagePhoto[]>([
    SAMPLE_DAMAGE_PHOTOS[0],
    SAMPLE_DAMAGE_PHOTOS[2],
  ]);

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('State Farm');
  const [policyNumber, setPolicyNumber] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  // Handle GPS Auto Locate
  const handleDetectGPS = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          setLocationSuccess(true);
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setAddress(`${position.coords.latitude.toFixed(4)}° N, ${position.coords.longitude.toFixed(4)}° W (GPS Verified Location)`);
        },
        () => {
          setIsLocating(false);
          setLocationSuccess(true);
          setAddress('GPS Locked: 32.7767° N, -96.7970° W (Oakridge Area)');
        },
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
      setLocationSuccess(true);
    }
  };

  // Add custom photo or upload sample
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      const newPhoto: DamagePhoto = {
        id: `photo-${Date.now()}`,
        url: imageUrl,
        timestamp: 'Just now',
        caption: file.name || 'User Uploaded Damage Inspection Photo',
        aiNotes: 'User uploaded photo. Analyzing moisture boundary and structural pitch...',
      };
      setPhotos((prev) => [...prev, newPhoto]);
    }
  };

  const handleAddSamplePhoto = (sample: typeof SAMPLE_DAMAGE_PHOTOS[0]) => {
    if (!photos.some((p) => p.id === sample.id)) {
      setPhotos((prev) => [...prev, sample]);
    }
  };

  // Submit Emergency Ticket
  const handleSubmitTicket = () => {
    // Calculate cost estimate
    const calc = calculateRoofEstimate({
      sqFt: estimatedSqFt,
      material: roofMaterial,
      pitch: roofPitch,
      stories,
      isEmergency: true,
      hasActiveLeak: hasActiveWaterLeak,
    });

    const assignedCrew = MOCK_CREW_UNITS[0];

    const newTicket: DispatchTicket = {
      id: `TICKET-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      severity,
      status: 'DISPATCHED',
      customerName: customerName || 'Valued Property Owner',
      phone: phone || '(555) 019-2831',
      email: email || 'homeowner@example.com',
      address: `${address}, ${city}, ${state} ${zip}`,
      coordinates: coords,
      roofMaterial,
      roofPitch,
      stories,
      estimatedDamageAreaSqFt: estimatedSqFt,
      hasActiveWaterLeak,
      hasCeilingSag,
      hasTreeDamage,
      photos,
      notes: notes || 'Emergency dispatch created from Roof Response Hub online portal.',
      insuranceProvider,
      policyNumber,
      assignedCrewUnit: {
        id: assignedCrew.id,
        name: assignedCrew.name,
        etaMinutes: assignedCrew.etaMinutes,
        leadTechnician: assignedCrew.leadTechnician,
        vehiclePhone: assignedCrew.vehiclePhone,
      },
      estimatedCost: {
        tarpingLabor: Math.round(calc.baseLabor),
        materials: Math.round(calc.materialCost),
        emergencyCalloutFee: calc.emergencyFee,
        total: Math.round(calc.grandTotal),
      },
    };

    // Trigger haptic vibration simulation if supported
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // fallback
    }

    onTicketCreated(newTicket);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative my-auto flex flex-col max-h-[90vh]">
        
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950/20 flex items-center justify-center text-slate-950">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider opacity-80">
                24/7 Rapid Response Flow
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                Emergency Roof Tarping & Dispatch
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-950/20 hover:bg-slate-950/40 text-slate-950 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Progress Steps Indicator */}
        <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 flex items-center justify-between text-xs font-bold shrink-0">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-amber-400' : 'text-slate-600'}`}>
            <span className="w-5 h-5 rounded-full bg-slate-800 border border-current flex items-center justify-center text-[10px]">1</span>
            <span>Location</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-800" />
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-amber-400' : 'text-slate-600'}`}>
            <span className="w-5 h-5 rounded-full bg-slate-800 border border-current flex items-center justify-center text-[10px]">2</span>
            <span>Damage</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-800" />
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-amber-400' : 'text-slate-600'}`}>
            <span className="w-5 h-5 rounded-full bg-slate-800 border border-current flex items-center justify-center text-[10px]">3</span>
            <span>Photos</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-800" />
          <div className={`flex items-center gap-1.5 ${step >= 4 ? 'text-amber-400' : 'text-slate-600'}`}>
            <span className="w-5 h-5 rounded-full bg-slate-800 border border-current flex items-center justify-center text-[10px]">4</span>
            <span>Dispatch</span>
          </div>
        </div>

        {/* Step Content Scroll Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* STEP 1: GPS Location & Property Address */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 text-amber-200 text-xs">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-400 text-sm">Where is the damaged roof located?</div>
                  Our dispatch algorithm matches your location with the nearest crew vehicle carrying heavy 800-sq-ft vinyl tarps and safety harnesses.
                </div>
              </div>

              {/* GPS Auto Detect Button */}
              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={isLocating}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold p-3.5 rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Navigation className={`w-4 h-4 text-amber-400 ${isLocating ? 'animate-spin' : ''}`} />
                {isLocating ? 'Detecting Satellite GPS Coordinates...' : locationSuccess ? '✓ GPS Coordinates Confirmed' : 'Detect My Exact GPS Location'}
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-4 text-slate-500 text-xs font-mono">OR ENTER MANUAL ADDRESS</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              {/* Address Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Street Address *</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 1428 Elmwood Ridge Dr"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Emergency Severity & Leak Checklist */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Emergency Severity Level
              </div>

              {/* Severity Selector */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSeverity('CRITICAL')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    severity === 'CRITICAL'
                      ? 'bg-red-500/20 border-red-500 text-red-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-extrabold text-sm text-red-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    CRITICAL
                  </div>
                  <div className="text-[10px] mt-1 opacity-80">Active water dripping / Tree impact</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSeverity('URGENT')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    severity === 'URGENT'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-extrabold text-sm text-amber-400">URGENT</div>
                  <div className="text-[10px] mt-1 opacity-80">Exposed deck / Missing shingles</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSeverity('STANDARD')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    severity === 'STANDARD'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-extrabold text-sm text-blue-400">STANDARD</div>
                  <div className="text-[10px] mt-1 opacity-80">Pre-storm prep / Preventive tarp</div>
                </button>
              </div>

              {/* Hazard Checkbox Checklist */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300">Specific Active Hazards (Select all that apply)</div>

                <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                  <span className="text-xs font-medium text-slate-200">Active Water Dripping into Living Space</span>
                  <input
                    type="checkbox"
                    checked={hasActiveWaterLeak}
                    onChange={(e) => setHasActiveWaterLeak(e.target.checked)}
                    className="w-4 h-4 accent-amber-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                  <span className="text-xs font-medium text-slate-200">Drywall Staining or Ceiling Sag Danger</span>
                  <input
                    type="checkbox"
                    checked={hasCeilingSag}
                    onChange={(e) => setHasCeilingSag(e.target.checked)}
                    className="w-4 h-4 accent-amber-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                  <span className="text-xs font-medium text-slate-200">Tree Limb or Debris Struck Roof</span>
                  <input
                    type="checkbox"
                    checked={hasTreeDamage}
                    onChange={(e) => setHasTreeDamage(e.target.checked)}
                    className="w-4 h-4 accent-amber-500"
                  />
                </label>
              </div>

              {/* Roof Specs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Roof Material</label>
                  <select
                    value={roofMaterial}
                    onChange={(e) => setRoofMaterial(e.target.value as RoofMaterial)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="ASPHALT_SHINGLE">Asphalt Architectural Shingle</option>
                    <option value="METAL_STANDING_SEAM">Standing Seam Metal</option>
                    <option value="CLAY_TILE">Spanish Clay / Tile</option>
                    <option value="FLAT_TPO">Flat Commercial TPO / Membrane</option>
                    <option value="SLATE">Natural Slate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Approx. Damaged Area (sq ft)</label>
                  <input
                    type="number"
                    value={estimatedSqFt}
                    onChange={(e) => setEstimatedSqFt(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Damage Photos & AI Assessment */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex items-start gap-3 text-amber-200 text-xs">
                <Camera className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-400">Capture Damage Photos</div>
                  Photos are attached directly to your dispatcher work order and submitted to insurance adjusters for instant loss claim filing.
                </div>
              </div>

              {/* Upload input */}
              <div className="flex gap-3">
                <label className="flex-1 bg-slate-950 border-2 border-dashed border-slate-700 hover:border-amber-500 p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
                  <Upload className="w-6 h-6 text-amber-400 mb-1" />
                  <span className="text-xs font-bold text-white">Upload Roof or Ceiling Photo</span>
                  <span className="text-[10px] text-slate-400">Supports JPG, PNG, HEIC from phone camera</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Sample Quick Pick Photo Attachments */}
              <div>
                <div className="text-[11px] font-bold text-slate-400 mb-2">Or Attach Common Inspection Pre-sets:</div>
                <div className="grid grid-cols-3 gap-2">
                  {SAMPLE_DAMAGE_PHOTOS.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleAddSamplePhoto(sample)}
                      className="group relative rounded-xl overflow-hidden border border-slate-800 hover:border-amber-500 aspect-video bg-slate-950 text-left"
                    >
                      <img src={sample.url} alt={sample.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-slate-950/60 p-1.5 flex flex-col justify-end">
                        <span className="text-[9px] font-bold text-white line-clamp-1">{sample.caption}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Attached Photos List */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300">Attached Photos ({photos.length})</div>
                {photos.map((p) => (
                  <div key={p.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                    <img src={p.url} alt={p.caption} className="w-14 h-14 object-cover rounded-lg shrink-0 border border-slate-800" />
                    <div className="flex-1 text-xs space-y-1">
                      <div className="font-bold text-white">{p.caption}</div>
                      {p.aiNotes && (
                        <div className="text-[10px] text-amber-300/90 bg-amber-500/10 p-1.5 rounded border border-amber-500/20">
                          <strong>AI Assessment:</strong> {p.aiNotes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Contact & Insurance Policy Information */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  Property Owner Contact
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Sarah Miller"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Cell Phone (For Crew SMS ETA) *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 019-2831"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="homeowner@example.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Insurance Info */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  Insurance Claim Mitigation (Optional)
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Insurance Provider</label>
                    <select
                      value={insuranceProvider}
                      onChange={(e) => setInsuranceProvider(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="State Farm">State Farm</option>
                      <option value="Allstate">Allstate</option>
                      <option value="USAA">USAA</option>
                      <option value="Farmers Insurance">Farmers Insurance</option>
                      <option value="Liberty Mutual">Liberty Mutual</option>
                      <option value="Travelers">Travelers</option>
                      <option value="Other / Self Pay">Other Insurance / Self Pay</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Policy / Claim # (If available)</label>
                    <input
                      type="text"
                      value={policyNumber}
                      onChange={(e) => setPolicyNumber(e.target.value)}
                      placeholder="e.g. SF-992104"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Special Entry / Access Notes</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Gate code #1234. Guard dog in back yard, access roof via driveway."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Action Controls */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold px-6 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitTicket}
              className="bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold px-6 py-3 rounded-xl flex items-center gap-2 shadow-xl shadow-red-600/30 transition-all active:scale-95 animate-bounce"
            >
              <Zap className="w-4 h-4 fill-white" />
              DISPATCH CREW NOW
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
