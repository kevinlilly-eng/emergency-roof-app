import React, { useRef, useState } from 'react';
import { X, Printer, ShieldCheck, FileText, Download, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';
import { DispatchTicket } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface InsuranceReportModalProps {
  ticket: DispatchTicket | null;
  onClose: () => void;
}

export const InsuranceReportModal: React.FC<InsuranceReportModalProps> = ({ ticket, onClose }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  if (!ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!reportRef.current || isGeneratingPdf) return;

    try {
      setIsGeneratingPdf(true);
      setPdfSuccess(false);

      const reportElement = reportRef.current;
      
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();

      let heightLeft = pdfHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      // Additional pages if needed
      while (heightLeft > 5) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Roof-Emergency-Loss-Report-${ticket.id}.pdf`);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4000);
    } catch (err) {
      console.error('Error generating PDF report:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative my-auto border border-slate-200">
        
        {/* Top Control Bar (Non-Printable) */}
        <div className="bg-slate-900 text-white p-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <FileText className="w-4 h-4" />
            Official Insurance Loss Mitigation Packet
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  Generating PDF...
                </>
              ) : pdfSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                  Downloaded!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Formatted PDF
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" /> Print
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Canvas */}
        <div ref={reportRef} className="p-8 sm:p-12 space-y-8 bg-white print:p-0">
          
          {/* Document Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6">
            <div>
              <div className="flex items-center gap-2 text-amber-600 font-extrabold text-lg">
                <ShieldCheck className="w-6 h-6" />
                Roof Response Hub
              </div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                Certified Emergency Loss Mitigation Division
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                24/7 Rapid Tarping & Water Intrusion Prevention
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-mono font-bold text-slate-400">INCIDENT DOSSIER</div>
              <div className="text-xl font-black text-slate-900">{ticket.id}</div>
              <div className="text-xs text-slate-500">{new Date(ticket.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          {/* Policy & Property Grid */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <div className="font-extrabold text-slate-900 uppercase tracking-wider text-[10px] text-slate-500 mb-1">
                Insured Property Owner
              </div>
              <div className="font-bold text-slate-900 text-sm">{ticket.customerName}</div>
              <div className="text-slate-600">{ticket.address}</div>
              <div className="text-slate-600">Tel: {ticket.phone}</div>
            </div>

            <div>
              <div className="font-extrabold text-slate-900 uppercase tracking-wider text-[10px] text-slate-500 mb-1">
                Claim & Policy Information
              </div>
              <div className="font-bold text-slate-900 text-sm">{ticket.insuranceProvider || 'Self-Filed Loss'}</div>
              <div className="text-slate-600 font-mono">Policy #: {ticket.policyNumber || 'N/A'}</div>
              <div className="text-slate-600 font-semibold text-emerald-700">Status: {ticket.status.replace('_', ' ')}</div>
            </div>
          </div>

          {/* Loss Description & Roof Specs */}
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">
              Initial Damage & Loss Assessment
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-100 p-2.5 rounded-lg">
                <div className="text-[10px] text-slate-500">Roof Material</div>
                <div className="font-bold text-slate-900">{ticket.roofMaterial.replace('_', ' ')}</div>
              </div>

              <div className="bg-slate-100 p-2.5 rounded-lg">
                <div className="text-[10px] text-slate-500">Roof Pitch</div>
                <div className="font-bold text-slate-900">{ticket.roofPitch.replace('_', ' ')}</div>
              </div>

              <div className="bg-slate-100 p-2.5 rounded-lg">
                <div className="text-[10px] text-slate-500">Damaged Area</div>
                <div className="font-bold text-slate-900">~{ticket.estimatedDamageAreaSqFt} Sq Ft</div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-slate-800 space-y-1">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                Crew Dispatch Notes & Observations
              </div>
              <p className="text-xs leading-relaxed">{ticket.notes}</p>
            </div>
          </div>

          {/* Attached Inspection Photos */}
          {ticket.photos.length > 0 && (
            <div className="space-y-2 text-xs">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">
                Time-Stamped Photo Evidence ({ticket.photos.length})
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {ticket.photos.map((p) => (
                  <div key={p.id} className="border border-slate-200 p-2 rounded-lg space-y-1">
                    <img src={p.url} alt={p.caption} className="w-full h-28 object-cover rounded" crossOrigin="anonymous" />
                    <div className="font-bold text-slate-900 text-[11px]">{p.caption}</div>
                    {p.aiNotes && <div className="text-[9px] text-slate-500">{p.aiNotes}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Itemized Loss Mitigation Invoice */}
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">
              Emergency Loss Mitigation Itemized Statement
            </h3>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-[10px] uppercase text-slate-500">
                  <th className="py-2">Description</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2">Emergency High-Structure Tarping Labor & Anchor Sealing</td>
                  <td className="py-2 text-right font-mono">${ticket.estimatedCost.tarpingLabor}</td>
                </tr>
                <tr>
                  <td className="py-2">Heavy UV-Resistant Vinyl Tarp Materials & Furring Strips</td>
                  <td className="py-2 text-right font-mono">${ticket.estimatedCost.materials}</td>
                </tr>
                <tr>
                  <td className="py-2">24/7 Rapid Dispatch & Safety Harness Rigging Callout</td>
                  <td className="py-2 text-right font-mono">${ticket.estimatedCost.emergencyCalloutFee}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-900 font-extrabold text-sm">
                  <td className="py-2">Total Pre-Approved Claim Mitigation</td>
                  <td className="py-2 text-right font-mono text-amber-600">${ticket.estimatedCost.total}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer Signature Block */}
          <div className="border-t border-slate-200 pt-6 flex justify-between items-end text-[10px] text-slate-500">
            <div>
              <div>Certified Technician: {ticket.assignedCrewUnit?.leadTechnician || 'Master Roofer #804'}</div>
              <div>Dispatch Center: 1-800-ROOF-SOS</div>
            </div>

            <div className="text-right font-mono">
              DOCUMENT HASH: {Math.random().toString(36).substring(2, 10).toUpperCase()}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

