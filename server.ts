import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to initialize Gemini SDK safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiKeySet: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Endpoint 1: Gemini Contractor Estimate & AI Thoughts Generator
app.post('/api/gemini/estimate', async (req, res) => {
  try {
    const ai = getGeminiClient();
    const { rooferRates, projectDetails, customNotes } = req.body;

    const systemInstruction = `You are an elite master roofing contractor, senior insurance estimator, and building code expert.
Your goal is to generate an itemized roofing contractor estimate using the contractor's exact custom unit rates.
Calculate quantities, material waste factor, total line items, code compliance upgrades (IRC R905), and provide strategic contractor suggestions and thoughts.`;

    const prompt = `Analyze this roofing project and calculate an estimate using the roofer's exact rates:

CONTRACTOR CUSTOM RATES:
${JSON.stringify(rooferRates, null, 2)}

PROJECT SPECIFICATIONS:
${JSON.stringify(projectDetails, null, 2)}

CONTRACTOR NOTES:
${customNotes || 'Standard replacement/repair estimate'}

Return ONLY a JSON object matching this schema:
{
  "summary": "Clear summary of the project scope and roof characteristics",
  "wasteFactorPercentage": 15,
  "lineItems": [
    {
      "category": "Tarping | Tear-off | Shingles | Underlayment | Flashings | Ridge/Hip | Labor | Debris | Code Upgrades",
      "item": "Detailed item description",
      "quantity": 25,
      "unit": "sq | sq ft | lf | hrs | ea | roll",
      "unitRate": 120.00,
      "totalPrice": 3000.00,
      "codeRef": "e.g. IRC R905.1.2 or Manufacturer Spec"
    }
  ],
  "subtotal": 0,
  "overheadAndProfitRate": 20,
  "overheadAndProfitAmount": 0,
  "estimatedTax": 0,
  "grandTotal": 0,
  "geminiSuggestionsAndThoughts": [
    "Strategic insight 1 regarding roof scope, hidden damage, or material pricing",
    "Building code compliance mandate or supplement recommendation",
    "Adjuster negotiation or installation efficiency tip"
  ],
  "carrierDefenseNotes": "Key points for presenting this estimate to insurance adjusters"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error generating Gemini estimate:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate estimate' });
  }
});

// Endpoint 2: Gemini AI Insurance Claim & Supplement Report Writer
app.post('/api/gemini/insurance-report', async (req, res) => {
  try {
    const ai = getGeminiClient();
    const { claimInfo, missedItems, adjusterGap, lossDetails } = req.body;

    const systemInstruction = `You are a certified senior public adjuster and expert roofing supplement report writer.
You draft formal, carrier-ready Insurance Claim & Supplement Defense Reports with strict building code citations (IRC, IBC), Xactimate code cross-references, and undeniable loss mitigation justifications.`;

    const prompt = `Draft a formal carrier-ready Insurance Claim Supplement Report with the following input:

CLAIM DETAILS:
${JSON.stringify(claimInfo, null, 2)}

LOSS & DAMAGE DETAILS:
${JSON.stringify(lossDetails, null, 2)}

MISSED ITEMS & SCOPE DISCREPANCIES:
${JSON.stringify(missedItems, null, 2)}

ADJUSTER GAP AMOUNT: $${adjusterGap || 0}

Return ONLY a JSON object with this schema:
{
  "reportTitle": "FORMAL INSURANCE CLAIM SUPPLEMENT & CODE COMPLIANCE REPORT",
  "policyholder": "Policyholder Name",
  "claimNumber": "Claim Number",
  "carrier": "Insurance Carrier",
  "lossDate": "Loss Date",
  "executiveSummary": "Formal 2-3 paragraph statement addressed to the insurance claims adjuster establishing loss causation and coverage necessity under policy guidelines.",
  "supplementLineItems": [
    {
      "xactimateCode": "e.g. RFG 220, RFG ARLI, etc.",
      "description": "Full item description",
      "quantity": "25 SQ or 150 LF",
      "unitPrice": 145.00,
      "supplementTotal": 3625.00,
      "codeJustification": "Official justification referencing building code, manufacturer instructions, or OSHA safety mandate."
    }
  ],
  "totalSupplementAmount": 0,
  "buildingCodeCitations": [
    {
      "codeRef": "IRC R905.1.2 / R905.2.8.5",
      "title": "Ice & Water Shield / Drip Edge Requirement",
      "requirementText": "Quote of the code requirement and why it is mandatory for this loss."
    }
  ],
  "adjusterRebuttalPoints": [
    "Rebuttal argument 1 for common carrier pushbacks (e.g. waste factor denial)",
    "Rebuttal argument 2 for 10/10 O&P justification"
  ],
  "formalConclusion": "Closing sign-off demanding supplement review and payment authorization within statutory deadline."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error generating insurance supplement report:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate report' });
  }
});

// Endpoint 3: 24/7 Smart Emergency Triage Assistant & Contractor Prioritization
app.post('/api/gemini/triage', async (req, res) => {
  try {
    const ai = getGeminiClient();
    const { emergencyData, availableContractors } = req.body;

    const systemInstruction = `You are a 24/7 Emergency Loss Triage Dispatcher AI specializing in catastrophic storm, wind, and hail roof damage mitigation.
Evaluate emergency intake data, determine severity score, hazard assessment, recommended emergency equipment, homeowner interim safety advice, and prioritize available roofer crews.`;

    const prompt = `Perform emergency triage and contractor prioritization for:

EMERGENCY INTAKE:
${JSON.stringify(emergencyData, null, 2)}

AVAILABLE CONTRACTOR CREWS:
${JSON.stringify(availableContractors || [], null, 2)}

Return ONLY a JSON object:
{
  "severityScore": 92,
  "urgencyCategory": "CRITICAL" | "URGENT" | "STANDARD",
  "hazardAssessment": "Detailed analysis of structural, electrical, water intrusion, or mold collapse risks",
  "recommendedEquipment": [
    "30x50 Heavy-Duty Poly Tarp",
    "2-Story Safety Harness & Roof Anchors",
    "50ft Extension Ladder",
    "Sandbags & Furring Strips"
  ],
  "homeownerInterimAdvice": [
    "Place buckets under active interior ceiling drips",
    "Avoid standing directly under sagging drywall ceilings",
    "Turn off electricity to wet rooms if safe to access main breaker"
  ],
  "contractorPrioritization": [
    {
      "contractorId": "id",
      "companyName": "Company Name",
      "suitabilityScore": 98,
      "matchingReason": "Why this crew is top pick based on proximity, 24/7 status, and equipment"
    }
  ],
  "dispatchRecommendationNotes": "Tactical advice for the dispatch team"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error in emergency triage:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed triage analysis' });
  }
});

// Endpoint 4: Interactive Gemini AI Roofing & Claims Chat Assistant
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const ai = getGeminiClient();
    const { messages, context } = req.body;

    const chat = ai.chats.create({
      model: 'gemini-3.6-flash',
      config: {
        systemInstruction: `You are A-NewRoof's 24/7 AI Master Roofer & Claims Advisor.
Help roofers, contractors, policyholders, and adjusters with building code lookups (IRC/IBC), Xactimate codes, supplement advice, tarping techniques, roof square math, and contractor pricing strategies.
Keep answers clear, concise, professional, and well-structured with markdown bullets. Context: ${JSON.stringify(context || {})}`,
      },
    });

    const lastMessage = messages?.[messages.length - 1]?.text || 'Hello';
    const response = await chat.sendMessage({ message: lastMessage });

    res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error('Error in Gemini chat:', error);
    res.status(500).json({ success: false, error: error.message || 'Chat request failed' });
  }
});

// Start server with Vite middleware in development or static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
