import { 
  RooferCustomRates, 
  GeminiEstimateResponse, 
  GeminiSupplementResponse, 
  GeminiTriageResponse,
  GeminiFacebookAdResponse
} from '../types';


export async function generateGeminiEstimate(
  rooferRates: RooferCustomRates,
  projectDetails: Record<string, any>,
  customNotes?: string
): Promise<GeminiEstimateResponse> {
  const res = await fetch('/api/gemini/estimate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rooferRates, projectDetails, customNotes }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to generate Gemini estimate');
  }

  return json.data as GeminiEstimateResponse;
}

export async function generateGeminiSupplementReport(
  claimInfo: Record<string, any>,
  missedItems: any[],
  adjusterGap: number,
  lossDetails: Record<string, any>
): Promise<GeminiSupplementResponse> {
  const res = await fetch('/api/gemini/insurance-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ claimInfo, missedItems, adjusterGap, lossDetails }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to generate insurance supplement report');
  }

  return json.data as GeminiSupplementResponse;
}

export async function runEmergencyTriage(
  emergencyData: Record<string, any>,
  availableContractors: any[]
): Promise<GeminiTriageResponse> {
  const res = await fetch('/api/gemini/triage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emergencyData, availableContractors }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed emergency triage analysis');
  }

  return json.data as GeminiTriageResponse;
}

export async function generateFacebookAdWithAi(
  campaignGoal: string,
  targetRegion: string,
  ctaPhone: string,
  selectedPhoto: string
): Promise<GeminiFacebookAdResponse> {
  const res = await fetch('/api/gemini/facebook-ad', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ campaignGoal, targetRegion, ctaPhone, selectedPhoto }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to generate Facebook Ad with AI');
  }

  return json.data as GeminiFacebookAdResponse;
}

export async function sendGeminiChatMessage(
  messages: { role: string; text: string }[],
  context?: Record<string, any>
): Promise<string> {
  const res = await fetch('/api/gemini/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, context }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Chat response failed');
  }

  return json.text;
}

