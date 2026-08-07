import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Printer, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Bot, 
  Copy,
  Scale,
  Building,
  FileCheck
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { generateGeminiSupplementReport } from '../lib/gemini';
import { GeminiSupplementResponse } from '../types';

export const AIInsuranceReportWriter: React.FC = () => {
  // Form State
  const [carrier, setCarrier] = useState('State Farm Insurance');
  const [policyholder, setPolicyholder] = useState('Robert & Sarah Miller');
  const [claimNumber, setClaimNumber] = useState('SF-2026-948102');
  const [lossDate, setLossDate] = useState('2026-07-28');
  const [address, setAddress] = useState('4829 Oak Ridge Blvd, Dallas, TX 75201');
  const [adjusterEstimate, setAdjusterEstimate] = useState<number>(14500);
  const [contractorEstimate, setContractorEstimate] = useState<number>(22800);
  
  // Common missed items toggles
  const [missedDripEdge, setMissedDripEdge] = useState(true);
  const [missedIceWater, setMissedIceWater] = useState(true);
  const [missedStarterShingles, setMissedStarterShingles] = useState(true);
  const [missedWasteFactor, setMissedWasteFactor] = useState(true);
  const [missedOverheadProfit, setMissedOverheadProfit] = useState(true);
  const [missedTarpLabor, setMissedTarpLabor] = useState(false);
  const [customMissedNotes, setCustomMissedNotes] = useState('');

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<GeminiSupplementResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  const gap = Math.max(0, contractorEstimate - adjusterEstimate);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setError(null);

    const missedItemsList = [];
    if (missedDripEdge) missedItemsList.push('Drip Edge Metal Flashing (Mandatory per IRC R905.2.8.5)');
    if (missedIceWater) missedItemsList.push('Ice & Water Shield Self-Adhered Waterproof Membrane in Valleys & Eaves');
    if (missedStarterShingles) missedItemsList.push('Starter Course Shingles around perimeter perimeter sealing');
    if (missedWasteFactor) missedItemsList.push('15% Material Waste Factor for steep hip & valley cutting loss');
    if (missedOverheadProfit) missedItemsList.push('10/10 General Contractor Overhead & Profit (20% O&P)');
    if (missedTarpLabor) missedItemsList.push('Emergency Tarping Loss Mitigation Labor & Anchor Sealing');
    if (customMissedNotes) missedItemsList.push(customMissedNotes);

    try {
      const result = await generateGeminiSupplementReport(
        { carrier, policyholder, claimNumber, lossDate, propertyAddress: address },
        missedItemsList,
        gap,
        {
          adjusterEstimateAmount: adjusterEstimate,
          contractorEstimateAmount: contractorEstimate,
          discrepancyGap: gap,
        }
      );

      setReport(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate Gemini supplement report.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyReport = () => {
    if (!report) return;
    const text = `
${report.reportTitle}
Policyholder: ${report.policyholder}
Carrier: ${report.carrier} | Claim #: ${report.claimNumber} | Loss Date: ${report.lossDate}

EXECUTIVE SUMMARY:
${report.executiveSummary}

SUPPLEMENT LINE ITEMS:
${report.supplementLineItems.map(i => `- [${i.xactimateCode}] ${i.description} | Qty: ${i.quantity} | Total: $${i.supplementTotal}\n  Code Justification: ${i.codeJustification}`).join('\n')}

BUILDING CODE MANDATES:
${report.buildingCodeCitations.map(c => `- ${c.codeRef}: ${c.title}\n  ${c.requirementText}`).join('\n')}

ADJUSTER REBUTTAL ARGUMENTS:
${report.adjusterRebuttalPoints.map(r => `- ${r}`).join('\n')}

CONCLUSION:
${report.formalConclusion}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadPdf = async () => {
    const el = document.getElementById('gemini-supplement-report-doc');
    if (!el || isPdfGenerating) return;

    try {
      setIsPdfGenerating(true);
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Insurance-Supplement-Report-${claimNumber}.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            AI Insurance Claim & Supplement Report Writer
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Carrier-Ready Supplement Defense Generator
          </h2>
          <p className="text-sm text-slate-300 max-w-xl">
            Generates formal, carrier-defensible supplement reports with <strong className="text-amber-400">IRC Building Code quotes</strong>, Xactimate codes, and undeniable loss mitigation justifications to win claim approvals.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center shrink-0 w-full md:w-auto">
          <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Adjuster Discrepancy Gap</div>
          <div className="text-3xl font-black text-amber-400 font-mono">
            ${gap.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Carrier Estimate: ${adjusterEstimate.toLocaleString()} vs Contractor: ${contractorEstimate.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Main Input vs Output Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Form Inputs */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 card-shadow space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-600" />
            Insurance Claim Specifications
          </h3>

          <div className="space-y-3 text-xs font-semibold">
            <div>
              <label className="block text-slate-700 mb-1">Insurance Carrier Name</label>
              <input
                type="text"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="e.g. State Farm, Allstate, USAA, Liberty Mutual"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1">Policyholder Name</label>
                <input
                  type="text"
                  value={policyholder}
                  onChange={(e) => setPolicyholder(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Claim Number</label>
                <input
                  type="text"
                  value={claimNumber}
                  onChange={(e) => setClaimNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1">Carrier Adjuster Estimate ($)</label>
                <input
                  type="number"
                  value={adjusterEstimate}
                  onChange={(e) => setAdjusterEstimate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Contractor Full Scope ($)</label>
                <input
                  type="number"
                  value={contractorEstimate}
                  onChange={(e) => setContractorEstimate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Property Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Missed Items Checkboxes */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-amber-600" />
              Select Carrier Omitted / Disputed Scope Items
            </label>

            <div className="space-y-2 text-xs font-semibold">
              <label className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={missedDripEdge}
                  onChange={(e) => setMissedDripEdge(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500 h-4 w-4"
                />
                <span>Drip Edge Flashing (IRC R905.2.8.5 Building Code)</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={missedIceWater}
                  onChange={(e) => setMissedIceWater(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500 h-4 w-4"
                />
                <span>Ice & Water Shield Self-Adhered Waterproof Membrane</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={missedStarterShingles}
                  onChange={(e) => setMissedStarterShingles(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500 h-4 w-4"
                />
                <span>Starter Strip Shingles at Eaves & Rakes</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={missedWasteFactor}
                  onChange={(e) => setMissedWasteFactor(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500 h-4 w-4"
                />
                <span>15% Complex Roof Cut Waste Factor</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={missedOverheadProfit}
                  onChange={(e) => setMissedOverheadProfit(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500 h-4 w-4"
                />
                <span>10/10 General Contractor Overhead & Profit (O&P)</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={missedTarpLabor}
                  onChange={(e) => setMissedTarpLabor(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500 h-4 w-4"
                />
                <span>Emergency Loss Mitigation Tarping Labor & Rigging</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Additional Disputed Notes</label>
            <textarea
              rows={2}
              value={customMissedNotes}
              onChange={(e) => setCustomMissedNotes(e.target.value)}
              placeholder="e.g. Adjuster refused step flashing replacement at chimney..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="button"
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 border border-amber-600 active:scale-98 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
            {isGenerating ? 'Gemini AI Is Writing Supplement Report...' : 'Generate Carrier Supplement Report'}
          </button>
        </div>

        {/* Right Output Document */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-red-900">
                <AlertCircle className="w-4 h-4 text-red-600" />
                Report Generation Failure
              </div>
              <p>{error}</p>
            </div>
          )}

          {report ? (
            <div className="bg-white rounded-3xl border border-slate-200 card-shadow overflow-hidden space-y-4 p-6 sm:p-8">
              {/* Document Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Gemini AI Carrier-Ready Report Formatted
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyReport}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors border border-slate-300"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? 'Copied to Clipboard!' : 'Copy Text'}
                  </button>

                  <button
                    onClick={handleDownloadPdf}
                    disabled={isPdfGenerating}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    {isPdfGenerating ? 'Exporting PDF...' : 'Download PDF'}
                  </button>
                </div>
              </div>

              {/* Printable / Viewable Report */}
              <div id="gemini-supplement-report-doc" className="p-6 bg-white space-y-6 text-slate-900 text-xs leading-relaxed">
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                  <div>
                    <h1 className="text-base font-black text-slate-900 uppercase tracking-tight">{report.reportTitle}</h1>
                    <p className="text-slate-500 text-[11px]">Official Building Code Compliance & Loss Supplement Defense Dossier</p>
                  </div>
                  <div className="text-right font-mono text-[11px] text-slate-500">
                    <div>CLAIM #: {report.claimNumber}</div>
                    <div>CARRIER: {report.carrier}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <strong className="text-slate-500 uppercase text-[10px] block">Policyholder & Loss Location</strong>
                    <span className="font-bold">{report.policyholder}</span>
                    <p className="text-slate-600">{address}</p>
                  </div>
                  <div>
                    <strong className="text-slate-500 uppercase text-[10px] block">Loss Date & Supplement Discrepancy</strong>
                    <span className="font-bold">Loss Date: {report.lossDate}</span>
                    <p className="text-amber-700 font-bold font-mono">Discrepancy Gap: ${gap.toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-1 mb-2">Executive Summary to Claims Adjuster</h3>
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">{report.executiveSummary}</p>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-1 mb-2">Supplement Line Item Justifications</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-300 text-[10px] uppercase text-slate-500">
                          <th className="py-2">Code / Description</th>
                          <th className="py-2 text-center">Qty</th>
                          <th className="py-2 text-right">Unit Price</th>
                          <th className="py-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {report.supplementLineItems.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-2">
                              <span className="font-bold font-mono text-amber-700">{item.xactimateCode}</span> - {item.description}
                              <p className="text-[10px] text-slate-500">{item.codeJustification}</p>
                            </td>
                            <td className="py-2 text-center font-mono">{item.quantity}</td>
                            <td className="py-2 text-right font-mono">${item.unitPrice}</td>
                            <td className="py-2 text-right font-mono font-bold text-slate-900">${item.supplementTotal}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-1 mb-2">Mandatory Building Code Compliance Citations</h3>
                  <div className="space-y-2">
                    {report.buildingCodeCitations.map((code, idx) => (
                      <div key={idx} className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                        <div className="font-bold text-amber-900 font-mono text-xs">{code.codeRef}: {code.title}</div>
                        <p className="text-slate-700 text-[11px] mt-1">{code.requirementText}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-1 mb-2">Carrier Rebuttal Strategy</h3>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700">
                    {report.adjusterRebuttalPoints.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-1">Conclusion & Statutory Notice</h3>
                  <p className="text-slate-700 italic">{report.formalConclusion}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <FileCheck className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-700 text-sm">No Supplement Report Generated Yet</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Fill in the insurance claim details on the left and click <strong>"Generate Carrier Supplement Report"</strong> to create a carrier-ready report powered by Gemini AI.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
