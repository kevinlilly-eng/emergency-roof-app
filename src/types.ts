export type EmergencySeverity = 'CRITICAL' | 'URGENT' | 'STANDARD';

export type RoofMaterial = 'ASPHALT_SHINGLE' | 'METAL_STANDING_SEAM' | 'CLAY_TILE' | 'SLATE' | 'FLAT_TPO' | 'RUBBER_EPDM' | 'LIFETIME_SYSTEM';

export type RoofPitch = 'FLAT' | 'LOW_SLOPE' | 'MEDIUM_PITCH' | 'STEEP_PITCH' | 'HAZARDOUS_STEEP';

export type TicketStatus = 'DISPATCHED' | 'EN_ROUTE' | 'ON_SITE' | 'TARP_INSTALLED' | 'COMPLETED';

export interface DamagePhoto {
  id: string;
  url: string;
  timestamp: string;
  caption: string;
  aiNotes?: string;
}

export interface DispatchTicket {
  id: string;
  createdAt: string;
  severity: EmergencySeverity;
  status: TicketStatus;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  roofMaterial: RoofMaterial;
  roofPitch: RoofPitch;
  stories: number;
  estimatedDamageAreaSqFt: number;
  hasActiveWaterLeak: boolean;
  hasCeilingSag: boolean;
  hasTreeDamage: boolean;
  photos: DamagePhoto[];
  notes: string;
  insuranceProvider?: string;
  policyNumber?: string;
  assignedCrewUnit?: {
    id: string;
    name: string;
    etaMinutes: number;
    leadTechnician: string;
    vehiclePhone: string;
  };
  estimatedCost: {
    tarpingLabor: number;
    materials: number;
    emergencyCalloutFee: number;
    total: number;
  };
}

export interface LeadItem {
  id: string;
  type: 'EMERGENCY_TARP' | 'STANDARD_ESTIMATE';
  createdAt: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  zipCode: string;
  neighborhood: string;
  roofMaterial: RoofMaterial;
  roofPitch: RoofPitch;
  stories: number;
  sqFt: number;
  severity: EmergencySeverity;
  jobEstimateValue: number;
  leadFee: number;
  isClaimed: boolean;
  claimedByContractorId?: string;
  claimedAt?: string;
  status: 'UNCLAIMED' | 'CLAIMED' | 'EN_ROUTE' | 'WORK_IN_PROGRESS' | 'PAID_AND_COMPLETED';
  hasActiveLeak?: boolean;
  notes?: string;
  photoUrl?: string;
  paymentDetails?: {
    collectedAmount: number;
    paymentMethod: 'CREDIT_CARD' | 'INSURANCE_CLAIM' | 'FINANCING';
    paidAt: string;
  };
}

export interface ContractorProfile {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  licenseNumber: string;
  rating: number;
  completedJobsCount: number;
  isAvailable247: boolean;
  walletBalance: number;
}

export interface PaymentTransaction {
  id: string;
  date: string;
  type: 'LEAD_FEE' | 'WALLET_RECHARGE' | 'CUSTOMER_PAYMENT_COLLECTED';
  description: string;
  amount: number;
  status: 'COMPLETED' | 'PENDING';
}

export interface EstimateRequest {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  serviceType: 
    | 'INSPECTION' 
    | 'MAINTENANCE' 
    | 'LEAK_REPAIR' 
    | 'FULL_REPLACEMENT' 
    | 'NEW_ROOF' 
    | 'METAL_ROOF' 
    | 'CHIMNEY_FLASHING' 
    | 'SKYLIGHT_REPAIR' 
    | 'TILE_ROOF' 
    | 'RUBBER_EPDM' 
    | 'LIFETIME_ROOF';
  roofMaterial: RoofMaterial;
  roofPitch: RoofPitch;
  stories: number;
  roofSquareFootage: number;
  targetTimeline: 'ASAP' | 'WITHIN_2_WEEKS' | 'THIS_MONTH' | 'JUST_PLANNING';
  notes?: string;
}

export interface StormAlert {
  id: string;
  title: string;
  severity: 'WARNING' | 'WATCH' | 'ADVISORY';
  region: string;
  windSpeedMph: number;
  hailSizeInches: number;
  description: string;
  recommendedAction: string;
  issuedAt: string;
}

export interface RooferCustomRates {
  asphaltShinglePerSq: number;
  metalStandingSeamPerSq: number;
  clayTilePerSq: number;
  flatTpoPerSq: number;
  emergencyTarpPerSqFt: number;
  underlaymentPerSqFt: number;
  iceAndWaterShieldPerSqFt: number;
  dripEdgePerLf: number;
  ridgeCapPerLf: number;
  pipeBootPerEa: number;
  steepPitchSurchargePercent: number;
  twoStorySurchargePercent: number;
  debrisRemovalFee: number;
  laborHourlyRate: number;
  overheadAndProfitPercent: number;
  salesTaxPercent: number;
}

export interface GeminiEstimateLineItem {
  category: string;
  item: string;
  quantity: number;
  unit: string;
  unitRate: number;
  totalPrice: number;
  codeRef?: string;
}

export interface GeminiEstimateResponse {
  summary: string;
  wasteFactorPercentage: number;
  lineItems: GeminiEstimateLineItem[];
  subtotal: number;
  overheadAndProfitRate: number;
  overheadAndProfitAmount: number;
  estimatedTax: number;
  grandTotal: number;
  geminiSuggestionsAndThoughts: string[];
  carrierDefenseNotes: string;
}

export interface GeminiSupplementLineItem {
  xactimateCode: string;
  description: string;
  quantity: string;
  unitPrice: number;
  supplementTotal: number;
  codeJustification: string;
}

export interface GeminiSupplementResponse {
  reportTitle: string;
  policyholder: string;
  claimNumber: string;
  carrier: string;
  lossDate: string;
  executiveSummary: string;
  supplementLineItems: GeminiSupplementLineItem[];
  totalSupplementAmount: number;
  buildingCodeCitations: {
    codeRef: string;
    title: string;
    requirementText: string;
  }[];
  adjusterRebuttalPoints: string[];
  formalConclusion: string;
}

export interface GeminiTriageResponse {
  severityScore: number;
  urgencyCategory: 'CRITICAL' | 'URGENT' | 'STANDARD';
  hazardAssessment: string;
  recommendedEquipment: string[];
  homeownerInterimAdvice: string[];
  contractorPrioritization: {
    contractorId: string;
    companyName: string;
    suitabilityScore: number;
    matchingReason: string;
  }[];
  dispatchRecommendationNotes: string;
}

