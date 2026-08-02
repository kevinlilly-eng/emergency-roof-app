import { RoofMaterial, RoofPitch } from '../types';

export interface CalculationInput {
  sqFt: number;
  material: RoofMaterial;
  pitch: RoofPitch;
  stories: number;
  isEmergency: boolean;
  hasActiveLeak?: boolean;
}

export interface CalculationResult {
  baseLabor: number;
  materialCost: number;
  pitchSurcharge: number;
  heightSurcharge: number;
  emergencyFee: number;
  subtotal: number;
  estimatedTax: number;
  grandTotal: number;
  pricePerSqFt: number;
  recommendedTarpRolls: number;
  estimatedCrewTimeHours: number;
}

const MATERIAL_MULTIPLIERS: Record<RoofMaterial, { name: string; basePerSqFt: number }> = {
  ASPHALT_SHINGLE: { name: 'Architectural Asphalt Shingle', basePerSqFt: 4.5 },
  LIFETIME_SYSTEM: { name: 'Lifetime Warranty Roof System (GAF / CertainTeed)', basePerSqFt: 6.25 },
  METAL_STANDING_SEAM: { name: 'Standing Seam / Structural Metal', basePerSqFt: 9.0 },
  CLAY_TILE: { name: 'Spanish Clay / Concrete Tile', basePerSqFt: 11.5 },
  SLATE: { name: 'Natural Slate / Composite', basePerSqFt: 14.0 },
  FLAT_TPO: { name: 'Flat Commercial TPO / Single-Ply', basePerSqFt: 5.5 },
  RUBBER_EPDM: { name: 'Rubber Roofs (EPDM Waterproof Membrane)', basePerSqFt: 6.8 },
};

const PITCH_MULTIPLIERS: Record<RoofPitch, { name: string; multiplier: number }> = {
  FLAT: { name: 'Flat (0/12 - 2/12)', multiplier: 1.0 },
  LOW_SLOPE: { name: 'Low Slope (3/12 - 5/12)', multiplier: 1.1 },
  MEDIUM_PITCH: { name: 'Medium Walkable (6/12 - 8/12)', multiplier: 1.25 },
  STEEP_PITCH: { name: 'Steep Non-Walkable (9/12 - 11/12)', multiplier: 1.45 },
  HAZARDOUS_STEEP: { name: 'Hazardous Extreme (12/12+)', multiplier: 1.7 },
};

export function calculateRoofEstimate(input: CalculationInput): CalculationResult {
  const sqFt = Math.max(100, input.sqFt);
  const materialData = MATERIAL_MULTIPLIERS[input.material] || MATERIAL_MULTIPLIERS.ASPHALT_SHINGLE;
  const pitchData = PITCH_MULTIPLIERS[input.pitch] || PITCH_MULTIPLIERS.MEDIUM_PITCH;

  // Base costs
  const rawMaterialCost = sqFt * materialData.basePerSqFt;
  const rawLabor = sqFt * 3.25;

  // Pitch modifier applied to labor
  const pitchSurcharge = rawLabor * (pitchData.multiplier - 1);
  
  // Height modifier (multi-story setup & safety staging)
  const heightMultiplier = input.stories > 1 ? (input.stories - 1) * 0.15 : 0;
  const heightSurcharge = (rawLabor + pitchSurcharge) * heightMultiplier;

  // Emergency Rapid Response Fee
  const emergencyFee = input.isEmergency ? 350 + (input.hasActiveLeak ? 150 : 0) : 0;

  const baseLabor = rawLabor;
  const materialCost = rawMaterialCost;
  const subtotal = baseLabor + materialCost + pitchSurcharge + heightSurcharge + emergencyFee;
  const estimatedTax = subtotal * 0.0825; // standard 8.25% average tax
  const grandTotal = subtotal + estimatedTax;

  const pricePerSqFt = grandTotal / sqFt;
  const recommendedTarpRolls = Math.ceil((sqFt * 1.2) / 800); // 800 sq ft heavy duty tarp cover with overlap
  const estimatedCrewTimeHours = Math.max(2, Math.round((sqFt / 250) * pitchData.multiplier));

  return {
    baseLabor,
    materialCost,
    pitchSurcharge,
    heightSurcharge,
    emergencyFee,
    subtotal,
    estimatedTax,
    grandTotal,
    pricePerSqFt,
    recommendedTarpRolls,
    estimatedCrewTimeHours,
  };
}

export { MATERIAL_MULTIPLIERS, PITCH_MULTIPLIERS };
