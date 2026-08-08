/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { Header, NavTabType } from './components/Header';
import { WelcomeHero } from './components/WelcomeHero';
import { InsuranceCarrierPortal } from './components/InsuranceCarrierPortal';
import { ServicesShowcase } from './components/ServicesShowcase';
import { EmergencyFlowModal } from './components/EmergencyFlowModal';
import { EstimateCalculator } from './components/EstimateCalculator';
import { DispatchTracker } from './components/DispatchTracker';
import { StormAlertCenter } from './components/StormAlertCenter';
import { InsuranceReportModal } from './components/InsuranceReportModal';
import { ContractorDashboard } from './components/ContractorDashboard';
import { ShareModal } from './components/ShareModal';
import { AIInsuranceReportWriter } from './components/AIInsuranceReportWriter';
import { AIEmergencyTriageAssistant } from './components/AIEmergencyTriageAssistant';
import { AIAssistantChatWidget } from './components/AIAssistantChatWidget';
import { WebhookManager } from './components/WebhookManager';
import { EnterpriseAuditAndIncidentCenter } from './components/EnterpriseAuditAndIncidentCenter';
import { SecurityPrivacyCenter } from './components/SecurityPrivacyCenter';
import { SEODiscoverabilityCenter } from './components/SEODiscoverabilityCenter';
import { DispatchTicket, TicketStatus, EstimateRequest, LeadItem, ContractorProfile, PaymentTransaction } from './types';
import { INITIAL_TICKETS, MOCK_INITIAL_LEADS, MOCK_CONTRACTOR_PROFILE } from './data/mockData';

export default function App() {
  // Handle direct sitemap.xml and robots.txt URL access in browser / SPA router
  const currentPath = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';

  if (currentPath === '/sitemap.xml' || currentPath.endsWith('/sitemap.xml')) {
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://a-newroof.com/</loc>
    <lastmod>2026-08-05</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-mono text-sm leading-relaxed select-text">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h1 className="text-lg font-bold text-sky-400">XML Sitemap: https://a-newroof.com/sitemap.xml</h1>
              <p className="text-xs text-slate-400">Official search engine index for Google Search Console, Bing Webmaster, and indexing bots.</p>
            </div>
            <a href="/" className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors">
              Return to App &rarr;
            </a>
          </div>
          <pre className="p-4 bg-slate-900 text-sky-300 rounded-lg border border-slate-800 overflow-x-auto text-xs sm:text-sm font-mono whitespace-pre">
            {sitemapXml}
          </pre>
        </div>
      </div>
    );
  }

  if (currentPath === '/robots.txt' || currentPath.endsWith('/robots.txt')) {
    const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://a-newroof.com/sitemap.xml`;

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-mono text-sm leading-relaxed select-text">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h1 className="text-lg font-bold text-emerald-400">Robots.txt: https://a-newroof.com/robots.txt</h1>
              <p className="text-xs text-slate-400">Search crawler directives for a-newroof.com.</p>
            </div>
            <a href="/" className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors">
              Return to App &rarr;
            </a>
          </div>
          <pre className="p-4 bg-slate-900 text-emerald-300 rounded-lg border border-slate-800 overflow-x-auto text-xs sm:text-sm font-mono whitespace-pre">
            {robotsTxt}
          </pre>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<NavTabType>('home');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedInsuranceTicket, setSelectedInsuranceTicket] = useState<DispatchTicket | null>(null);

  // Tickets state with localStorage and Firestore persistence
  const [tickets, setTickets] = useState<DispatchTicket[]>(() => {
    const saved = localStorage.getItem('roof_response_tickets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_TICKETS;
      }
    }
    return INITIAL_TICKETS;
  });

  // Contractor Leads state with localStorage and Firestore persistence
  const [leads, setLeads] = useState<LeadItem[]>(() => {
    const saved = localStorage.getItem('roof_response_leads');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return MOCK_INITIAL_LEADS;
      }
    }
    return MOCK_INITIAL_LEADS;
  });

  // Contractor Profile state
  const [contractor, setContractor] = useState<ContractorProfile>(() => {
    const saved = localStorage.getItem('roof_response_contractor');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return MOCK_CONTRACTOR_PROFILE;
      }
    }
    return MOCK_CONTRACTOR_PROFILE;
  });

  // Contractor Wallet Payment Transactions log
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('roof_response_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('roof_response_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('roof_response_contractor', JSON.stringify(contractor));
  }, [contractor]);

  // Firestore Real-time Listeners and Database Seeding
  useEffect(() => {
    // 1. Tickets snapshot listener
    const unsubscribeTickets = onSnapshot(
      collection(db, 'tickets'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedTickets: DispatchTicket[] = snapshot.docs.map((d) => d.data() as DispatchTicket);
          setTickets(loadedTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } else {
          // Seed Firestore with initial mock tickets if database is empty
          INITIAL_TICKETS.forEach((t) => {
            setDoc(doc(db, 'tickets', t.id), t).catch((err) =>
              handleFirestoreError(err, OperationType.WRITE, `tickets/${t.id}`)
            );
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'tickets');
      }
    );

    // 2. Leads snapshot listener
    const unsubscribeLeads = onSnapshot(
      collection(db, 'leads'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedLeads: LeadItem[] = snapshot.docs.map((d) => d.data() as LeadItem);
          setLeads(loadedLeads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } else {
          // Seed Firestore with initial mock leads if empty
          MOCK_INITIAL_LEADS.forEach((l) => {
            setDoc(doc(db, 'leads', l.id), l).catch((err) =>
              handleFirestoreError(err, OperationType.WRITE, `leads/${l.id}`)
            );
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'leads');
      }
    );

    // 3. Contractor profile snapshot listener
    const unsubscribeContractor = onSnapshot(
      doc(db, 'contractors', contractor.id),
      (snapshot) => {
        if (snapshot.exists()) {
          setContractor(snapshot.data() as ContractorProfile);
        } else {
          // Seed contractor profile in Firestore
          setDoc(doc(db, 'contractors', contractor.id), contractor).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, `contractors/${contractor.id}`)
          );
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `contractors/${contractor.id}`);
      }
    );

    return () => {
      unsubscribeTickets();
      unsubscribeLeads();
      unsubscribeContractor();
    };
  }, []);

  // Handle new ticket created from Emergency Flow
  const handleTicketCreated = async (newTicket: DispatchTicket) => {
    setTickets((prev) => [newTicket, ...prev]);

    // Save ticket to Firestore
    try {
      await setDoc(doc(db, 'tickets', newTicket.id), newTicket);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `tickets/${newTicket.id}`);
    }

    // Also push as a new live lead for contractors in the marketplace
    const newLead: LeadItem = {
      id: `LEAD-${newTicket.id.replace('TICKET-', '')}`,
      type: 'EMERGENCY_TARP',
      createdAt: newTicket.createdAt,
      customerName: newTicket.customerName,
      phone: newTicket.phone,
      email: newTicket.email,
      address: newTicket.address,
      zipCode: newTicket.address.match(/\b\d{5}\b/)?.[0] || '75001',
      neighborhood: newTicket.address.split(',')[1]?.trim() || 'Metro Area',
      roofMaterial: newTicket.roofMaterial,
      roofPitch: newTicket.roofPitch,
      stories: newTicket.stories,
      sqFt: newTicket.estimatedDamageAreaSqFt || 1200,
      severity: newTicket.severity,
      jobEstimateValue: newTicket.estimatedCost?.total || 1050,
      leadFee: 65,
      isClaimed: false,
      status: 'UNCLAIMED',
      hasActiveLeak: newTicket.hasActiveWaterLeak,
      notes: newTicket.notes,
      photoUrl: newTicket.photos?.[0]?.url || 'https://images.unsplash.com/photo-1628744876497-eb30460be9f6?auto=format&fit=crop&w=800&q=80',
    };

    setLeads((prev) => [newLead, ...prev]);

    try {
      await setDoc(doc(db, 'leads', newLead.id), newLead);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `leads/${newLead.id}`);
    }

    setIsEmergencyModalOpen(false);
    setActiveTab('tracker');
  };

  // Handle Estimate request submission
  const handleEstimateSubmitted = async (req: EstimateRequest) => {
    const newLead: LeadItem = {
      id: `LEAD-EST-${Date.now().toString().slice(-4)}`,
      type: 'STANDARD_ESTIMATE',
      createdAt: new Date().toISOString(),
      customerName: req.name,
      phone: req.phone,
      email: req.email,
      address: req.address,
      zipCode: req.address.match(/\b\d{5}\b/)?.[0] || '75002',
      neighborhood: req.address.split(',')[1]?.trim() || 'Suburban District',
      roofMaterial: req.roofMaterial,
      roofPitch: req.roofPitch,
      stories: req.stories,
      sqFt: req.roofSquareFootage,
      severity: 'STANDARD',
      jobEstimateValue: Math.round(req.roofSquareFootage * 6.5),
      leadFee: 45,
      isClaimed: false,
      status: 'UNCLAIMED',
      hasActiveLeak: false,
      notes: `${req.serviceType.replace('_', ' ')} requested. Timeline: ${req.targetTimeline}. ${req.notes || ''}`,
      photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
    };

    setLeads((prev) => [newLead, ...prev]);

    try {
      await setDoc(doc(db, 'leads', newLead.id), newLead);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `leads/${newLead.id}`);
    }
  };

  // Update ticket status
  const handleUpdateTicketStatus = async (ticketId: string, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );

    try {
      await updateDoc(doc(db, 'tickets', ticketId), { status: newStatus });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `tickets/${ticketId}`);
    }
  };

  // Contractor Handler 1: Claim Lead & Deduct Fee from Wallet
  const handleClaimLead = (leadId: string, leadFee: number): boolean => {
    if (contractor.walletBalance < leadFee) {
      return false;
    }

    const updatedContractor = {
      ...contractor,
      walletBalance: contractor.walletBalance - leadFee,
      completedJobsCount: contractor.completedJobsCount + 1,
    };

    // Deduct lead fee from wallet balance
    setContractor(updatedContractor);

    // Sync updated contractor to Firestore
    setDoc(doc(db, 'contractors', contractor.id), updatedContractor).catch((err) =>
      handleFirestoreError(err, OperationType.WRITE, `contractors/${contractor.id}`)
    );

    const updatedLeadUpdates = {
      isClaimed: true,
      claimedByContractorId: contractor.id,
      claimedAt: new Date().toISOString(),
      status: 'CLAIMED' as const,
    };

    // Mark lead as claimed
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, ...updatedLeadUpdates } : l))
    );

    updateDoc(doc(db, 'leads', leadId), updatedLeadUpdates).catch((err) =>
      handleFirestoreError(err, OperationType.UPDATE, `leads/${leadId}`)
    );

    // Log transaction
    const newTx: PaymentTransaction = {
      id: `TX-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      type: 'LEAD_FEE',
      description: `Claimed Lead ${leadId}`,
      amount: -leadFee,
      status: 'COMPLETED',
    };

    setTransactions((prev) => [newTx, ...prev]);
    return true;
  };

  // Contractor Handler 2: Add Funds / Purchase Credits
  const handleAddWalletFunds = (amount: number, description: string) => {
    const updatedContractor = {
      ...contractor,
      walletBalance: contractor.walletBalance + amount,
    };

    setContractor(updatedContractor);

    setDoc(doc(db, 'contractors', contractor.id), updatedContractor).catch((err) =>
      handleFirestoreError(err, OperationType.WRITE, `contractors/${contractor.id}`)
    );

    const newTx: PaymentTransaction = {
      id: `TX-DEP-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      type: 'WALLET_RECHARGE',
      description,
      amount,
      status: 'COMPLETED',
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  // Contractor Handler 3: Collect Direct Customer Payment / Invoicing
  const handleCollectCustomerPayment = (
    leadId: string,
    amount: number,
    paymentMethod: 'CREDIT_CARD' | 'INSURANCE_CLAIM' | 'FINANCING'
  ) => {
    const paymentUpdates = {
      status: 'PAID_AND_COMPLETED' as const,
      paymentDetails: {
        collectedAmount: amount,
        paymentMethod,
        paidAt: new Date().toISOString(),
      },
    };

    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, ...paymentUpdates } : l))
    );

    updateDoc(doc(db, 'leads', leadId), paymentUpdates).catch((err) =>
      handleFirestoreError(err, OperationType.UPDATE, `leads/${leadId}`)
    );

    const newTx: PaymentTransaction = {
      id: `TX-PAY-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      type: 'CUSTOMER_PAYMENT_COLLECTED',
      description: `Collected customer payment for ${leadId}`,
      amount,
      status: 'COMPLETED',
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  // Contractor Handler 4: Update Claimed Lead Status
  const handleUpdateLeadStatus = (leadId: string, status: LeadItem['status']) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status } : l))
    );

    updateDoc(doc(db, 'leads', leadId), { status }).catch((err) =>
      handleFirestoreError(err, OperationType.UPDATE, `leads/${leadId}`)
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeTicketCount={tickets.filter((t) => t.status !== 'COMPLETED').length}
        unclaimedLeadCount={leads.filter((l) => !l.isClaimed).length}
        onEmergencyPress={() => setIsEmergencyModalOpen(true)}
        onSharePress={() => setIsShareModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'home' && (
          <div className="space-y-12">
            <WelcomeHero
              onSelectStandardEstimate={() => setActiveTab('estimate')}
              onSelectEmergencyDispatch={() => setIsEmergencyModalOpen(true)}
              activeTicketCount={tickets.length}
              onSelectAiTriage={() => setActiveTab('aiTriage')}
              onSelectAiReportWriter={() => setActiveTab('aiReportWriter')}
            />
            <ServicesShowcase
              onSelectService={() => setActiveTab('estimate')}
              onCallHotline={() => { window.location.href = 'tel:7067400529'; }}
            />
          </div>
        )}

        {activeTab === 'insurance' && (
          <InsuranceCarrierPortal />
        )}

        {activeTab === 'estimate' && (
          <EstimateCalculator
            onEstimateSubmitted={handleEstimateSubmitted}
          />
        )}

        {activeTab === 'tracker' && (
          <DispatchTracker
            tickets={tickets}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onOpenInsuranceReport={(ticket) => setSelectedInsuranceTicket(ticket)}
          />
        )}

        {activeTab === 'radar' && (
          <StormAlertCenter
            onEmergencyPress={() => setIsEmergencyModalOpen(true)}
          />
        )}

        {activeTab === 'contractor' && (
          <ContractorDashboard
            leads={leads}
            contractor={contractor}
            onClaimLead={handleClaimLead}
            onAddWalletFunds={handleAddWalletFunds}
            onCollectCustomerPayment={handleCollectCustomerPayment}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            dispatchTickets={tickets}
          />
        )}

        {activeTab === 'aiReportWriter' && (
          <AIInsuranceReportWriter />
        )}

        {activeTab === 'aiTriage' && (
          <AIEmergencyTriageAssistant
            onDispatchCreated={handleTicketCreated}
          />
        )}

        {activeTab === 'securityPrivacy' && (
          <SecurityPrivacyCenter />
        )}

        {activeTab === 'seoDiscoverability' && (
          <SEODiscoverabilityCenter />
        )}

        {activeTab === 'webhooks' && (
          <WebhookManager />
        )}

        {activeTab === 'enterpriseAudit' && (
          <EnterpriseAuditAndIncidentCenter />
        )}
      </main>

      {/* Floating 24/7 Gemini AI Assistant Chat Widget */}
      <AIAssistantChatWidget />

      {/* Modals */}
      <EmergencyFlowModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onTicketCreated={handleTicketCreated}
      />

      <InsuranceReportModal
        ticket={selectedInsuranceTicket}
        onClose={() => setSelectedInsuranceTicket(null)}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <div className="font-bold text-white text-sm">Roof Response Hub - Emergency Tarp & Contractor Dispatch</div>
            <p className="text-slate-500">Licensed & Insured Master Roofing Contractors #CCC-1329014. Available 24/7/365.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 text-slate-400 font-mono">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-colors flex items-center gap-1.5"
            >
              📱 Text App to Someone
            </button>
            <span>24/7 DISPATCH: (706) 740-0529</span>
            <span>•</span>
            <span>AVG ARRIVAL: 24 MINS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

