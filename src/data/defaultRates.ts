import { RooferCustomRates } from '../types';

export const DEFAULT_ROOFER_RATES: RooferCustomRates = {
  asphaltShinglePerSq: 380, // $380 per square (100 sq ft)
  metalStandingSeamPerSq: 850, // $850 per square
  clayTilePerSq: 1100, // $1,100 per square
  flatTpoPerSq: 520, // $520 per square
  emergencyTarpPerSqFt: 2.25, // $2.25 per sq ft installed
  underlaymentPerSqFt: 0.85, // $0.85 per sq ft
  iceAndWaterShieldPerSqFt: 1.65, // $1.65 per sq ft (Code requirement)
  dripEdgePerLf: 4.50, // $4.50 per linear ft
  ridgeCapPerLf: 12.00, // $12.00 per linear ft
  pipeBootPerEa: 85.00, // $85 per boot
  steepPitchSurchargePercent: 25, // 25% steep pitch surcharge
  twoStorySurchargePercent: 15, // 15% 2-story surcharge
  debrisRemovalFee: 450, // $450 flat dumpster & haul-off
  laborHourlyRate: 75, // $75/hr per technician
  overheadAndProfitPercent: 20, // 10/10 O&P = 20%
  salesTaxPercent: 8.25, // 8.25% tax
};
