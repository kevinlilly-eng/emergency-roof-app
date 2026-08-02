import React from 'react';
import { 
  Home, 
  Zap, 
  Flame, 
  Sun, 
  Grid, 
  ShieldCheck, 
  Crown, 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall, 
  Calculator,
  Wrench,
  Award
} from 'lucide-react';

interface ServicesShowcaseProps {
  onSelectService: (serviceKey: string) => void;
  onCallHotline: () => void;
}

export interface RoofingServiceItem {
  id: string;
  title: string;
  categoryTag: string;
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
  description: string;
  keyFeatures: string[];
  warrantyText: string;
}

export const SERVICES_LIST: RoofingServiceItem[] = [
  {
    id: 'new-roofs',
    title: 'New Roofs & Complete Installation',
    categoryTag: 'Residential & Commercial',
    icon: <Home className="w-6 h-6 text-blue-600" />,
    badge: 'Popular Choice',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Complete tear-off and precision installation of brand-new roof systems using premium underlayment, ridge ventilation, and ice/water shields.',
    keyFeatures: [
      'Architectural 30-Yr & 50-Yr Shingles',
      'Synthetic Tear-Resistant Underlayment',
      'Complete Ridge & Soffit Ventilation Audit'
    ],
    warrantyText: 'Includes 10-Year Workmanship Warranty & Manufacturer Warranty'
  },
  {
    id: 'metal-roofs',
    title: 'Metal Roofs & Standing Seam',
    categoryTag: 'High-Durability Systems',
    icon: <Zap className="w-6 h-6 text-amber-600" />,
    badge: 'Storm & Wind Rated',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    description: 'Ultra-durable concealed fastener standing seam and ribbed metal roofing engineered to withstand 140+ mph hurricane winds, hail, and extreme heat.',
    keyFeatures: [
      'Concealed Fastener Standing Seam Panels',
      'Class 4 Hail Resistance & Energy Star Rated',
      '50+ Year Expected Service Lifespan'
    ],
    warrantyText: 'Lifetime Panel & Non-Fading Kynar 500 Paint Finish Warranty'
  },
  {
    id: 'chimney-flashing',
    title: 'Chimney Flashing Repair & Installation',
    categoryTag: 'Waterproof Seal',
    icon: <Flame className="w-6 h-6 text-red-600" />,
    badge: 'Leak Prevention',
    badgeColor: 'bg-red-100 text-red-800 border-red-200',
    description: 'Custom-bent copper, lead, or galvanized chimney counter-flashing, step flashing, and cricket diverters to eliminate chronic water leaks around masonry chimneys.',
    keyFeatures: [
      'Custom Step & Counter-Flashing Fabrication',
      'High-Grade Polyurethane Mortar Sealant',
      'Water-Diverting Rear Cricket Installation'
    ],
    warrantyText: 'Guaranteed Waterproof Chimney Seal Warranty'
  },
  {
    id: 'skylight-repair',
    title: 'Skylight Repair & Installation',
    categoryTag: 'Daylighting & Ventilation',
    icon: <Sun className="w-6 h-6 text-amber-500" />,
    badge: 'Energy Efficient',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    description: 'Fix leaking skylight gaskets, replace clouded glass domes, or install energy-efficient VELUX double-pane venting skylights with custom flashing kits.',
    keyFeatures: [
      'No-Leak Flashing & Perimeter Seal Kits',
      'Impact-Resistant Low-E Laminated Glass',
      'Solar-Powered Electric Venting Options'
    ],
    warrantyText: '10-Year No-Leak Skylight Installation Guarantee'
  },
  {
    id: 'tile-roofs',
    title: 'Tile Roofs (Clay, Concrete & Barrel)',
    categoryTag: 'Architectural Luxury',
    icon: <Grid className="w-6 h-6 text-orange-600" />,
    badge: 'Luxury Architectural',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
    description: 'Expert repair, re-sealing, broken tile replacement, and underlayment (lift & relay) for Spanish clay tiles, concrete barrel tiles, and slate roofs.',
    keyFeatures: [
      'Underlayment Felt & Polymer Membrane Lift-and-Relay',
      'Color-Matched Clay & Concrete Tile Replacement',
      'Wind-Lock Fastening & Mortar Cap Sealing'
    ],
    warrantyText: 'Master Certified Tile Craftsmen Guarantee'
  },
  {
    id: 'rubber-roofs',
    title: 'Rubber Roofs (EPDM Membrane)',
    categoryTag: 'Flat & Low-Slope Roofs',
    icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
    badge: '100% Waterproof',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'Seamless rubber EPDM and single-ply TPO waterproof membranes specifically designed for flat roofs, residential additions, garages, and commercial decks.',
    keyFeatures: [
      'Seamless Single-Ply EPDM Membrane Application',
      'Heat-Welded Seams & Perimeter Edge Termination',
      'UV & Puncture-Resistant Elastomeric Sealer'
    ],
    warrantyText: '20-Year Watertight Commercial & Flat Roof Warranty'
  },
  {
    id: 'lifetime-roofs',
    title: 'Lifetime Roof Systems (GAF / CertainTeed)',
    categoryTag: 'Premium Ultimate Protection',
    icon: <Crown className="w-6 h-6 text-purple-600" />,
    badge: '50-Year Warranty',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    description: 'Top-tier total protection roofing systems featuring heavy HD architectural shingles, starter strips, ridge cap shingles, and lifetime non-prorated material protection.',
    keyFeatures: [
      'GAF Timberline HDZ / CertainTeed Landmark Systems',
      'System-Matched Leak Barriers & Starter Strips',
      'Transferable 50-Year Non-Prorated Coverage'
    ],
    warrantyText: 'Master Elite Certified Contractor Lifetime Warranty'
  }
];

export const ServicesShowcase: React.FC<ServicesShowcaseProps> = ({
  onSelectService,
  onCallHotline
}) => {
  return (
    <section id="services-showcase" className="max-w-7xl mx-auto space-y-8 py-8 px-4">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-amber-400 border border-slate-800 text-xs font-bold uppercase tracking-wider">
          <Wrench className="w-3.5 h-3.5 text-amber-400" />
          Full-Service Licensed Roofing Contractors
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Contractor Services Performed
        </h2>

        <p className="text-sm sm:text-base text-slate-600 font-medium">
          From full new roof replacements and standing seam metal systems to chimney flashing and leak repairs, our certified crews deliver master craftsman quality for every property.
        </p>
      </div>

      {/* Grid of 7 Services */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES_LIST.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl border border-slate-200 card-shadow p-6 flex flex-col justify-between hover:border-amber-500 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="space-y-4">
              {/* Top Row: Icon & Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {service.icon}
                </div>
                <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${service.badgeColor}`}>
                  {service.badge}
                </span>
              </div>

              {/* Title & Category */}
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {service.categoryTag}
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  {service.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {service.description}
              </p>

              {/* Bullet Features */}
              <ul className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-700 font-medium">
                {service.keyFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Actions & Warranty */}
            <div className="pt-5 mt-4 border-t border-slate-100 space-y-3">
              <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{service.warrantyText}</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onSelectService(service.id)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Get Free Estimate</span>
                </button>

                <a
                  href="tel:7067400529"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center shrink-0"
                  title="Call Hotline (706) 740-0529"
                >
                  <PhoneCall className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* 8th CTA Card: Live Dispatch or Custom Service Request */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-2xl p-6 flex flex-col justify-between border border-slate-800 shadow-xl space-y-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
              <PhoneCall className="w-3 h-3" />
              24/7 Licensed Contractor Dispatch
            </div>
            <h3 className="text-xl font-black text-white">
              Need Custom Roofing or Emergency Service?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Have questions about insurance claims, chimney repairs, skylight leaks, or custom copper work? Speak directly to an active dispatch officer.
            </p>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
              <div className="text-amber-400 font-bold">Direct Hotline: (706) 740-0529</div>
              <div className="text-slate-400 text-[11px]">Rapid dispatch average arrival: 24 minutes</div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <a
              href="tel:7067400529"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg text-center"
            >
              <PhoneCall className="w-4 h-4 animate-pulse" />
              <span>Call (706) 740-0529 Now</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
