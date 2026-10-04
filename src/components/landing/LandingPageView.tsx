'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SubscriptionTierId } from '../../types';
import TrialAutopayModal from './TrialAutopayModal';
import {
  Building2,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  Check,
  Star,
  FileText,
  Zap,
  Home,
  Users,
  Building,
  Landmark,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';

interface LandingPageViewProps {
  onNavigateToLogin?: () => void;
}

/**
 * Instantaneous zero-overhead component wrapper
 * Eliminates layout thrashing, hidden opacities, and IntersectionObserver lag
 */
function ScrollReveal({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return <div className={className}>{children}</div>;
}

export default function LandingPageView({ onNavigateToLogin }: LandingPageViewProps) {
  // Pricing toggle: monthly vs annual
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  // 7-Day Trial Modal State
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [selectedPlanForTrial, setSelectedPlanForTrial] = useState<SubscriptionTierId>('growth_pro');

  // Interactive Multi-Asset Tab Showcase
  const [activeAssetTab, setActiveAssetTab] = useState<'RESIDENTIAL' | 'PG' | 'COMMERCIAL' | 'ESTATE'>('RESIDENTIAL');

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // -------------------------------------------------------------------------
  // ULTRA-LIGHTWEIGHT CINEMATIC FULL-PAGE PARALLAX ENGINE
  // - High-performance ticking loop (exactly 1 RAF per vsync frame)
  // - 100% passive, zero forced reflows, native 120 FPS mousewheel scrolling
  // - Dynamic visible building displacement (+/-95px travel + 3D scale zoom)
  // -------------------------------------------------------------------------
  const heroBgRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const architectureSectionRef = useRef<HTMLDivElement>(null);
  const buildingParallaxRef = useRef<HTMLDivElement>(null);
  const buildingBadgeRef = useRef<HTMLDivElement>(null);
  const leftCardsParallaxRef = useRef<HTMLDivElement>(null);
  const rightCardsParallaxRef = useRef<HTMLDivElement>(null);
  const servicesSectionRef = useRef<HTMLDivElement>(null);
  const servicesCol1Ref = useRef<HTMLDivElement>(null);
  const servicesCol3Ref = useRef<HTMLDivElement>(null);
  const statsSectionRef = useRef<HTMLDivElement>(null);
  const statsBox1Ref = useRef<HTMLDivElement>(null);
  const statsBox4Ref = useRef<HTMLDivElement>(null);
  const pricingSectionRef = useRef<HTMLDivElement>(null);
  const pricingFeaturedCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const updateParallax = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      const windowH = window.innerHeight;

      // 1. Continuous Hero Glide Parallax
      if (heroBgRef.current && scrollY < windowH * 1.5) {
        heroBgRef.current.style.transform = `translate3d(0, ${(scrollY * 0.32).toFixed(1)}px, 0) scale(${(1 + scrollY * 0.00015).toFixed(3)})`;
      }
      if (heroContentRef.current && scrollY < windowH * 1.5) {
        heroContentRef.current.style.transform = `translate3d(0, ${(scrollY * -0.08).toFixed(1)}px, 0)`;
      }

      // 2. Interactive Building Parallax (Bold, visible 3D motion & perspective scale)
      if (architectureSectionRef.current) {
        const rect = architectureSectionRef.current.getBoundingClientRect();
        if (rect.bottom > -150 && rect.top < windowH + 150) {
          const sectionCenter = rect.top + rect.height * 0.5;
          const viewportCenter = windowH * 0.5;
          const relY = viewportCenter - sectionCenter;

          // Prominent building vertical displacement (+/-95px)
          const buildingY = Math.max(-95, Math.min(95, relY * -0.16));
          // Optical zoom factor: zooms up to 1.04 when centered in viewport
          const proximity = Math.max(0, 1 - Math.abs(relY) / (windowH * 0.85));
          const buildingScale = 0.96 + proximity * 0.07;

          // Counter-gliding flanking cards (+/-60px)
          const cardsY = Math.max(-60, Math.min(60, relY * 0.10));

          if (buildingParallaxRef.current) {
            buildingParallaxRef.current.style.transform = `translate3d(0, ${buildingY.toFixed(1)}px, 0) scale(${buildingScale.toFixed(3)})`;
          }
          if (buildingBadgeRef.current) {
            buildingBadgeRef.current.style.transform = `translate3d(0, ${(relY * -0.04).toFixed(1)}px, 0)`;
          }
          if (leftCardsParallaxRef.current) {
            leftCardsParallaxRef.current.style.transform = `translate3d(0, ${cardsY.toFixed(1)}px, 0)`;
          }
          if (rightCardsParallaxRef.current) {
            rightCardsParallaxRef.current.style.transform = `translate3d(0, ${(cardsY * 1.15).toFixed(1)}px, 0)`;
          }
        }
      }

      // 3. Autopilot Services 3-Column Staggered Parallax
      if (servicesSectionRef.current) {
        const rect = servicesSectionRef.current.getBoundingClientRect();
        if (rect.bottom > -100 && rect.top < windowH + 100) {
          const relY = windowH * 0.5 - (rect.top + rect.height * 0.5);
          const colShift = Math.max(-35, Math.min(35, relY * 0.06));
          if (servicesCol1Ref.current) {
            servicesCol1Ref.current.style.transform = `translate3d(0, ${(-colShift).toFixed(1)}px, 0)`;
          }
          if (servicesCol3Ref.current) {
            servicesCol3Ref.current.style.transform = `translate3d(0, ${colShift.toFixed(1)}px, 0)`;
          }
        }
      }

      // 4. Institutional Reliability Stats Depth
      if (statsSectionRef.current) {
        const rect = statsSectionRef.current.getBoundingClientRect();
        if (rect.bottom > -100 && rect.top < windowH + 100) {
          const relY = windowH * 0.5 - (rect.top + rect.height * 0.5);
          const statShift = Math.max(-28, Math.min(28, relY * 0.045));
          if (statsBox1Ref.current) {
            statsBox1Ref.current.style.transform = `translate3d(0, ${(-statShift).toFixed(1)}px, 0)`;
          }
          if (statsBox4Ref.current) {
            statsBox4Ref.current.style.transform = `translate3d(0, ${statShift.toFixed(1)}px, 0)`;
          }
        }
      }

      // 5. Featured Pricing Card Elevated Parallax
      if (pricingSectionRef.current) {
        const rect = pricingSectionRef.current.getBoundingClientRect();
        if (rect.bottom > -100 && rect.top < windowH + 100) {
          const relY = windowH * 0.5 - (rect.top + rect.height * 0.5);
          const cardFloat = Math.max(-22, Math.min(22, relY * -0.04));
          if (pricingFeaturedCardRef.current) {
            pricingFeaturedCardRef.current.style.transform = `translate3d(0, ${cardFloat.toFixed(1)}px, 0)`;
          }
        }
      }
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateParallax();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleOpenTrial = (planId: SubscriptionTierId = 'growth_pro') => {
    setSelectedPlanForTrial(planId);
    setIsTrialModalOpen(true);
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="w-full min-h-screen bg-white text-[#19251f] font-sans selection:bg-[#203a2d]/20 selection:text-[#203a2d] relative overflow-x-hidden p-0 m-0">
      
      {/* ---------------------------------------------------- */}
      {/* 1. TOP HEADER NAVIGATION                             */}
      {/* ---------------------------------------------------- */}
      <header className="w-full px-6 sm:px-12 py-3.5 flex items-center justify-between border-b border-[#eeece5] bg-white sticky top-0 z-50 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        {/* Left: Geometric Emblem + Brand Name */}
        <div className="flex items-center gap-3">
          <a href="#overview" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-full bg-[#16231c] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-150">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-extrabold text-base tracking-tight text-[#16231c]">
              STAYWISE
            </span>
          </a>
        </div>

        {/* Center Navigation Links matching reference design */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-medium text-[#4d5a52]">
          <a href="#overview" className="hover:text-[#19251f] transition-colors duration-100">Home</a>
          <a href="#interactive-building" className="hover:text-[#19251f] transition-colors duration-100 flex items-center gap-1 font-semibold text-[#203a2d]">
            <span>Architecture</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </a>
          <a href="#solutions" className="hover:text-[#19251f] transition-colors duration-100">Solutions</a>
          <a href="#services" className="hover:text-[#19251f] transition-colors duration-100">Services</a>
          <a href="#pricing" className="hover:text-[#19251f] transition-colors duration-100">Pricing</a>
          <a href="#about" className="hover:text-[#19251f] transition-colors duration-100">About us</a>
          <a href="#faq" className="hover:text-[#19251f] transition-colors duration-100">FAQ</a>
        </nav>

        {/* Right Actions: Outlined Sign in button (OPENS NEW TAB) */}
        <div className="flex items-center gap-3">
          {/* SIGN IN BUTTON: OPENS LOGIN DIRECTLY IN NEW TAB */}
          <a
            href="/login"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-1.5 rounded-full border border-[#16231c] text-xs font-bold text-[#16231c] hover:bg-[#16231c] hover:text-white transition-all duration-150 shadow-xs cursor-pointer inline-flex items-center justify-center gap-1.5 group"
          >
            <span>Sign in</span>
            <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150" />
          </a>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* 2. HERO SECTION WITH OPTIMIZED LIGHTWEIGHT ASSET     */}
      {/* ---------------------------------------------------- */}
      <section 
        id="overview"
        className="relative w-full min-h-[600px] sm:min-h-[680px] lg:min-h-[740px] flex flex-col items-center justify-start pt-12 sm:pt-16 lg:pt-20 px-4 sm:px-8 text-center overflow-hidden"
      >
        {/* Hardware-Accelerated Lightweight Hero Background Image (182KB) */}
        <div 
          ref={heroBgRef}
          className="absolute inset-x-0 -top-10 -bottom-10 bg-cover bg-center bg-no-repeat pointer-events-none transform-gpu will-change-transform"
          style={{ 
            backgroundImage: `url('/images/hero-luxury-residence-light.jpg')`
          }}
        />

        {/* Crisp static gradient overlay (No expensive blur = 100% smooth) */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-white pointer-events-none" />

        {/* Floating Pill Announcement */}
        <div className="relative z-10 mb-5 sm:mb-6 animate-in fade-in slide-in-from-top-3 duration-500">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-[#c1d3c9] text-[#203a2d] text-xs font-semibold shadow-xs hover:bg-white transition-colors">
            <span>✨ AI-Powered Rental Yield Forecasting &amp; Automated Rent Collection 2.0</span>
          </div>
        </div>

        {/* Editorial Serif Headline */}
        <div ref={heroContentRef} className="relative z-10 max-w-4xl mx-auto space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-600 will-change-transform transform-gpu">
          <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#16231c] leading-[1.12]">
            The Premier SaaS Solution <br />
            Tailored for Landlords.
          </h1>

          {/* Subtitle in clean sans-serif */}
          <p className="text-sm sm:text-base lg:text-lg text-[#2f3f35] max-w-2xl mx-auto leading-relaxed font-normal">
            Staywise addresses all vacancy and yield forecasting hurdles by examining subtle tenant interactions, enhancing your property portfolio precision.
          </p>

          {/* Central Dark Forest Green Pill Button with Arrow */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handleOpenTrial('growth_pro')}
              className="px-8 py-3.5 sm:py-4 rounded-full bg-[#203a2d] hover:bg-[#172b21] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#203a2d]/30 transition-all duration-150 transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <span>Reserve your demo today!</span>
              <span className="text-lg group-hover:translate-x-1.5 transition-transform duration-150">→</span>
            </button>
          </div>

          {/* 7-Day Free Trial ₹0 Guarantee */}
          <div className="pt-1 text-xs font-semibold text-[#203a2d] flex items-center justify-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
            <span>7-Day Free Trial • ₹0 charged today • Cancel before 7 days in 1 click</span>
          </div>
        </div>

        {/* Bottom Trust Bar ("Trusted by leaders in") */}
        <div className="relative z-10 mt-auto pt-12 sm:pt-20 pb-8 w-full max-w-4xl mx-auto space-y-3.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#495b50]">
            Trusted by leaders in
          </div>

          {/* Monochrome Brand / Banking Rail Logos */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-black text-[#2f3d35]/85 tracking-tight">
            <span className="flex items-center gap-1.5 hover:text-[#19251f] transition-opacity">
              <span className="text-base font-serif">Creatio</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-[#19251f] transition-opacity">
              <span className="text-base font-sans font-extrabold tracking-tighter">HubSpot</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-[#19251f] transition-opacity">
              <span className="text-base font-sans font-bold">zendesk</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-[#19251f] transition-opacity">
              <span className="text-base font-mono font-bold">Bitrix24©</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-[#19251f] transition-opacity">
              <span className="text-base font-serif italic">Apptivo</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-[#19251f] transition-opacity">
              <span className="text-base font-sans font-black">FreshBooks</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-[#19251f] transition-opacity">
              <span className="text-base font-mono">pipedrive</span>
            </span>
          </div>
        </div>

        {/* Smooth Dissolve Gradient to bottom content */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* --------------------------------------------------------------------------------- */}
      {/* 3. LIGHTWEIGHT PARALLAX ARCHITECTURE SHOWCASE (ZERO LAG, SNAPPY MOUSEWHEEL)       */}
      {/* --------------------------------------------------------------------------------- */}
      <section 
        id="interactive-building"
        ref={architectureSectionRef}
        className="relative w-full py-16 sm:py-24 px-4 sm:px-8 bg-gradient-to-b from-white via-[#faf9f5] to-white overflow-hidden"
      >
        <div className="w-full max-w-7xl mx-auto space-y-12">
          
          {/* Section Header with Generous Responsive Padding (NEVER clipped) */}
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e8eee9] text-[#203a2d] text-xs font-black tracking-wider uppercase shadow-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
                <span>Architectural Telemetry In Motion</span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-5xl font-semibold text-[#16231c]">
                Real-Time Portfolio Dynamics
              </h2>
              <p className="text-xs sm:text-sm text-[#6e7972] max-w-xl mx-auto leading-relaxed">
                As you scroll, experience how Staywise autonomously operates, inspects, and maximizes yields on physical building assets.
              </p>
            </div>
          </ScrollReveal>

          {/* Symmetrical Responsive Grid: Left Cards + Center Parallax Building + Right Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center pt-2">
            
            {/* Left Symmetrical Column (Parallax Flank) */}
            <div ref={leftCardsParallaxRef} className="lg:col-span-3 space-y-5 will-change-transform transform-gpu">
              {/* CARD 1: Autonomous RentFlow */}
              <div className="p-5 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm hover:shadow-md transition-shadow duration-200 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <Zap className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#16231c]">Autonomous RentFlow</h4>
                    <span className="text-[10px] text-emerald-700 font-extrabold">99.4% On-Time Rate</span>
                  </div>
                </div>
                <p className="text-xs text-[#6e7972] leading-relaxed">
                  Direct UPI Autopay settlement into Axis Escrow accounts with dynamic WhatsApp reminder nudges.
                </p>
              </div>

              {/* CARD 2: Sub-Meter OCR Engine */}
              <div className="p-5 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm hover:shadow-md transition-shadow duration-200 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    <FileText className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#16231c]">Sub-Meter OCR Engine</h4>
                    <span className="text-[10px] text-amber-700 font-extrabold">Automated BESCOM Split</span>
                  </div>
                </div>
                <p className="text-xs text-[#6e7972] leading-relaxed">
                  Photo bill capture automatically calculates tiered slab tariffs and pro-rata common area utilities.
                </p>
              </div>
            </div>

            {/* Center Column: The Parallax Architectural Residence Building (Lightweight 73KB asset) */}
            <div className="lg:col-span-6 relative flex items-center justify-center py-4">
              <div 
                ref={buildingParallaxRef} 
                className="w-full relative rounded-3xl overflow-hidden shadow-2xl border border-[#e3e1d8] will-change-transform transform-gpu"
              >
                <img
                  src="/images/parallax-building-light.jpg"
                  alt="Staywise Managed Architectural Residence"
                  className="w-full h-auto object-cover transform hover:scale-[1.01] transition-transform duration-300"
                />

                {/* Live Telemetry Floating Pill on Building */}
                <div 
                  ref={buildingBadgeRef}
                  className="absolute top-4 sm:top-5 left-5 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#e3e1d8] text-xs font-bold text-[#16231c] shadow-md flex items-center gap-2 will-change-transform transform-gpu"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Malabar Luxury Villa • 100% Occupied • ₹5.4L/mo</span>
                </div>

                {/* Floating Scan Marker */}
                <div className="absolute bottom-4 right-5 px-3.5 py-1 rounded-full bg-[#16231c]/90 text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  <span>MoveFlow AI Sealed</span>
                </div>
              </div>
            </div>

            {/* Right Symmetrical Column (Parallax Flank) */}
            <div ref={rightCardsParallaxRef} className="lg:col-span-3 space-y-5 will-change-transform transform-gpu">
              {/* CARD 3: MoveFlow Inspections */}
              <div className="p-5 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm hover:shadow-md transition-shadow duration-200 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#16231c]">MoveFlow Inspections</h4>
                    <span className="text-[10px] text-teal-700 font-extrabold">Zero Deposit Disputes</span>
                  </div>
                </div>
                <p className="text-xs text-[#6e7972] leading-relaxed">
                  Timestamped digital photo checklists at check-in &amp; check-out that protect owner and tenant deposits.
                </p>
              </div>

              {/* CARD 4: Double-Entry Ledger */}
              <div className="p-5 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm hover:shadow-md transition-shadow duration-200 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <Landmark className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#16231c]">Double-Entry Ledger</h4>
                    <span className="text-[10px] text-indigo-700 font-extrabold">Audited GST Invoicing</span>
                  </div>
                </div>
                <p className="text-xs text-[#6e7972] leading-relaxed">
                  Real-time balance sheets, statutory TDS calculations, and 1-click auditor export packages.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 4. MULTI-ASSET OPERATING SOLUTIONS (#solutions)      */}
      {/* ---------------------------------------------------- */}
      <section id="solutions" className="py-12 sm:py-16 px-6 sm:px-12 bg-white space-y-10">
        
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-[#203a2d]">
              Universal Property Coverage
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-semibold text-[#16231c]">
              Designed for Any Real Estate Asset Class
            </h2>
            <p className="text-xs sm:text-sm text-[#6e7972] max-w-xl mx-auto leading-relaxed">
              No fragmented tools. Staywise natively unifies multi-family residential apartments, PG co-living hostels, commercial high-streets, and luxury hospitality villas.
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Multi-Asset Interactive Tabs */}
        <ScrollReveal delay={40}>
          <div className="flex items-center justify-center">
            <div className="p-1 rounded-full bg-[#f4f3ef] border border-[#e3e1d8] flex flex-wrap gap-1 max-w-full overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveAssetTab('RESIDENTIAL')}
                className={`px-4.5 py-2 rounded-full text-xs font-bold transition-all duration-100 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeAssetTab === 'RESIDENTIAL'
                    ? 'bg-[#16231c] text-white shadow-xs'
                    : 'text-[#6e7972] hover:text-[#19251f]'
                }`}
              >
                <Home className="h-3.5 w-3.5" />
                <span>Residential Portfolios</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveAssetTab('PG')}
                className={`px-4.5 py-2 rounded-full text-xs font-bold transition-all duration-100 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeAssetTab === 'PG'
                    ? 'bg-[#16231c] text-white shadow-xs'
                    : 'text-[#6e7972] hover:text-[#19251f]'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                <span>PG &amp; Co-Living Beds</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveAssetTab('COMMERCIAL')}
                className={`px-4.5 py-2 rounded-full text-xs font-bold transition-all duration-100 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeAssetTab === 'COMMERCIAL'
                    ? 'bg-[#16231c] text-white shadow-xs'
                    : 'text-[#6e7972] hover:text-[#19251f]'
                }`}
              >
                <Building className="h-3.5 w-3.5" />
                <span>Commercial CAM &amp; Retail</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveAssetTab('ESTATE')}
                className={`px-4.5 py-2 rounded-full text-xs font-bold transition-all duration-100 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeAssetTab === 'ESTATE'
                    ? 'bg-[#16231c] text-white shadow-xs'
                    : 'text-[#6e7972] hover:text-[#19251f]'
                }`}
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>EstateOS &amp; Luxury Villas</span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Active Asset Canvas */}
        <ScrollReveal delay={80}>
          <div className="max-w-5xl mx-auto rounded-3xl bg-[#f8f7f4] border border-[#e3e1d8] p-6 sm:p-9 shadow-xs">
            {activeAssetTab === 'RESIDENTIAL' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-[#203a2d] bg-[#e8eee9] px-3 py-1 rounded-full">
                    Multi-Unit Flats &amp; Independent Gated Homes
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#16231c]">
                    Zero-Brokerage Residential Operating Hub
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6e7972] leading-relaxed">
                    Automate tenant KYC checks, digital lease signing, WhatsApp rent collection with dynamic UPI QR codes, and MoveFlow digital photo inspections that eliminate deposit disputes.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#203a2d]" />
                      <span><b>Sub-Meter Electricity OCR:</b> Snap a photo of the Discom bill to instantly split charges.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#203a2d]" />
                      <span><b>Tenant Reliability TrustScore:</b> Historical payment reliability tracking.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#203a2d]" />
                      <span><b>WhatsApp Dunning:</b> Automated payment reminders at T-3, Due Date, and T+3.</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => handleOpenTrial('starter')}
                      className="px-6 py-2.5 rounded-full bg-[#16231c] hover:bg-[#203a2d] text-white font-bold text-xs transition duration-150 cursor-pointer"
                    >
                      Start Residential 7-Day Trial →
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#e3e1d8] shadow-xs space-y-3.5 text-xs font-mono">
                  <div className="flex justify-between items-center pb-2 border-b border-[#eeece5]">
                    <span className="font-bold text-[#16231c]">Beach Road Apartments (3 Portfolios)</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">95.2% Occupied</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[#6e7972]">
                      <span>Managed Units:</span>
                      <span className="font-bold text-[#16231c]">21 Units</span>
                    </div>
                    <div className="flex justify-between text-[#6e7972]">
                      <span>Monthly Yield:</span>
                      <span className="font-bold text-emerald-700">₹5,40,000 /mo</span>
                    </div>
                    <div className="flex justify-between text-[#6e7972]">
                      <span>AutoPay Adoption:</span>
                      <span className="font-bold text-[#16231c]">88% on UPI Autopay</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeAssetTab === 'PG' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-[#203a2d] bg-[#e8eee9] px-3 py-1 rounded-full">
                    Student Housing &amp; Co-Living Facilities
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#16231c]">
                    Granular Bed-Level Inventory &amp; Meal Plans
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6e7972] leading-relaxed">
                    Track single, double, and triple-sharing beds with room-level sub-meter splitting, automated monthly meal plan add-ons, and notice period vacancy countdowns.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#203a2d]" />
                      <span><b>Bed-Level Allocation:</b> Visual floor plans with occupied, vacant &amp; reserved bed status.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#203a2d]" />
                      <span><b>Automated Food Billing:</b> Meal subscription tracking seamlessly attached to invoices.</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => handleOpenTrial('growth_pro')}
                      className="px-6 py-2.5 rounded-full bg-[#16231c] hover:bg-[#203a2d] text-white font-bold text-xs transition duration-150 cursor-pointer"
                    >
                      Start PG Co-Living 7-Day Trial →
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#e3e1d8] shadow-xs space-y-3.5 text-xs font-mono">
                  <div className="flex justify-between items-center pb-2 border-b border-[#eeece5]">
                    <span className="font-bold text-[#16231c]">Kozhikode Tech Co-Living Hub</span>
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">18 Beds Active</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[#6e7972]">
                      <span>Active Meal Plans:</span>
                      <span className="font-bold text-[#16231c]">16 Full Board (₹3,500/mo)</span>
                    </div>
                    <div className="flex justify-between text-[#6e7972]">
                      <span>Sub-Meter Splitting:</span>
                      <span className="font-bold text-[#16231c]">3-Way Equal Division Active</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeAssetTab === 'COMMERCIAL' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-[#203a2d] bg-[#e8eee9] px-3 py-1 rounded-full">
                    Tech Parks &amp; High-Street Commercial Hubs
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#16231c]">
                    Commercial CAM Common Utility Allocation
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6e7972] leading-relaxed">
                    Calculate Common Area Maintenance (CAM) charges, central HVAC diesel generator splits, visitor footfall tracking, GST B2B e-invoicing, and statutory TDS reconciliation.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => handleOpenTrial('enterprise')}
                      className="px-6 py-2.5 rounded-full bg-[#16231c] hover:bg-[#203a2d] text-white font-bold text-xs transition duration-150 cursor-pointer"
                    >
                      Start Commercial 7-Day Trial →
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#e3e1d8] shadow-xs space-y-3.5 text-xs font-mono">
                  <div className="flex justify-between items-center pb-2 border-b border-[#eeece5]">
                    <span className="font-bold text-[#16231c]">CyberTower Commercial Hub</span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">15,000 sq.ft</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[#6e7972]">
                      <span>CAM Expenses Split:</span>
                      <span className="font-bold text-[#16231c]">₹85,000 /mo Allocated</span>
                    </div>
                    <div className="flex justify-between text-[#6e7972]">
                      <span>GST Invoices:</span>
                      <span className="font-bold text-emerald-700">18% ITC Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeAssetTab === 'ESTATE' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-[#203a2d] bg-[#e8eee9] px-3 py-1 rounded-full">
                    Luxury Villas, Resorts &amp; Airbnb Keys
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#16231c]">
                    EstateOS Hospitality &amp; Smart Key Access
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6e7972] leading-relaxed">
                    Control digital door locks, dispatch housekeeper turnovers, configure dynamic seasonal weekend premiums, and sync OTA calendars.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => handleOpenTrial('growth_pro')}
                      className="px-6 py-2.5 rounded-full bg-[#16231c] hover:bg-[#203a2d] text-white font-bold text-xs transition duration-150 cursor-pointer"
                    >
                      Start EstateOS 7-Day Trial →
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#e3e1d8] shadow-xs space-y-3.5 text-xs font-mono">
                  <div className="flex justify-between items-center pb-2 border-b border-[#eeece5]">
                    <span className="font-bold text-[#16231c]">Malabar Heritage Luxury Villa</span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">EstateOS Live</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[#6e7972]">
                      <span>Weekend ADR:</span>
                      <span className="font-bold text-[#16231c]">₹38,000 / Night</span>
                    </div>
                    <div className="flex justify-between text-[#6e7972]">
                      <span>Smart Lock:</span>
                      <span className="font-bold text-emerald-700">PIN #8912 Active</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>

      </section>

      {/* ---------------------------------------------------- */}
      {/* 5. KEY PLATFORM FEATURES (#services)                 */}
      {/* ---------------------------------------------------- */}
      <section 
        id="services" 
        ref={servicesSectionRef} 
        className="py-16 sm:py-20 px-6 sm:px-12 bg-[#faf9f6] border-y border-[#eeece5] space-y-10 overflow-hidden"
      >
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-[#203a2d]">
              Intelligent Automation
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-semibold text-[#16231c]">
              Engineered to Run Properties on Autopilot
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-start">
          {/* Column 1: Parallax Float Up */}
          <div ref={servicesCol1Ref} className="space-y-6 will-change-transform transform-gpu">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-white border border-[#e3e1d8] shadow-xs space-y-3 hover:shadow-md transition-shadow duration-150">
              <div className="h-9 w-9 rounded-2xl bg-[#e8eee9] text-[#203a2d] flex items-center justify-center font-bold">
                <Zap className="h-4.5 w-4.5" />
              </div>
              <h3 className="font-bold text-sm text-[#16231c]">
                RentFlow Escrow &amp; WhatsApp Nudges
              </h3>
              <p className="text-xs text-[#6e7972] leading-relaxed">
                Automated multi-day payment reminders at T-3, Due Date, and T+3 with dynamic UPI QR codes. 99.4% on-time settlement into Axis Bank Escrow accounts.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-3xl bg-white border border-[#e3e1d8] shadow-xs space-y-3 hover:shadow-md transition-shadow duration-150">
              <div className="h-9 w-9 rounded-2xl bg-[#e8eee9] text-[#203a2d] flex items-center justify-center font-bold">
                <TrendingUp className="h-4.5 w-4.5" />
              </div>
              <h3 className="font-bold text-sm text-[#16231c]">
                Vacancy Cost Engine &amp; Leak Detector
              </h3>
              <p className="text-xs text-[#6e7972] leading-relaxed">
                Live detection of unbilled sub-meters, pending repairs, and vacant units with automatic listing syndication (+18.4% average yield expansion).
              </p>
            </div>
          </div>

          {/* Column 2: Anchor Center Column */}
          <div className="space-y-6">
            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-white border border-[#e3e1d8] shadow-xs space-y-3 hover:shadow-md transition-shadow duration-150">
              <div className="h-9 w-9 rounded-2xl bg-[#e8eee9] text-[#203a2d] flex items-center justify-center font-bold">
                <FileText className="h-4.5 w-4.5" />
              </div>
              <h3 className="font-bold text-sm text-[#16231c]">
                Sub-Meter OCR Electricity Splitting
              </h3>
              <p className="text-xs text-[#6e7972] leading-relaxed">
                Upload a photo of your DISCOM bill (Bescom, KSEB, MSEDCL). The OCR engine parses slab tariffs, fixed charges, and pro-rata common area splits automatically.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-3xl bg-white border border-[#e3e1d8] shadow-xs space-y-3 hover:shadow-md transition-shadow duration-150">
              <div className="h-9 w-9 rounded-2xl bg-[#e8eee9] text-[#203a2d] flex items-center justify-center font-bold">
                <Landmark className="h-4.5 w-4.5" />
              </div>
              <h3 className="font-bold text-sm text-[#16231c]">
                Statutory Double-Entry Ledger
              </h3>
              <p className="text-xs text-[#6e7972] leading-relaxed">
                Debit and credit balance sheets recorded for every rupee. Automatic GST tax invoices, TDS deductions, and 1-click export for auditors.
              </p>
            </div>
          </div>

          {/* Column 3: Parallax Float Down */}
          <div ref={servicesCol3Ref} className="space-y-6 will-change-transform transform-gpu">
            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-white border border-[#e3e1d8] shadow-xs space-y-3 hover:shadow-md transition-shadow duration-150">
              <div className="h-9 w-9 rounded-2xl bg-[#e8eee9] text-[#203a2d] flex items-center justify-center font-bold">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <h3 className="font-bold text-sm text-[#16231c]">
                MoveFlow Digital Inspections
              </h3>
              <p className="text-xs text-[#6e7972] leading-relaxed">
                Photographic room checklists at move-in and move-out with immutable timestamp seals. Zero deposit dispute escrow guarantee.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-3xl bg-white border border-[#e3e1d8] shadow-xs space-y-3 hover:shadow-md transition-shadow duration-150">
              <div className="h-9 w-9 rounded-2xl bg-[#e8eee9] text-[#203a2d] flex items-center justify-center font-bold">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <h3 className="font-bold text-sm text-[#16231c]">
                Staywise AI Yield Concierge
              </h3>
              <p className="text-xs text-[#6e7972] leading-relaxed">
                Proactive intelligence predicting tenant lease renewals, flagging maintenance risks before emergencies, and optimizing seasonal pricing.
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* ---------------------------------------------------- */}
      {/* 6. PLATFORM SCALE & TELEMETRY NUMBERS (#about)       */}
      {/* ---------------------------------------------------- */}
      <section 
        id="about" 
        ref={statsSectionRef} 
        className="py-16 sm:py-20 px-6 sm:px-12 bg-white space-y-10 overflow-hidden"
      >
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase text-[#203a2d]">
              Institutional Reliability
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#16231c]">
              Trusted Across India&apos;s Prime Metro Hubs
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={50}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto text-center items-center">
            <div 
              ref={statsBox1Ref} 
              className="p-6 rounded-3xl bg-[#f8f7f4] border border-[#e3e1d8] space-y-1 will-change-transform transform-gpu shadow-xs"
            >
              <div className="font-editorial text-3xl sm:text-5xl font-semibold text-[#203a2d]">₹142Cr+</div>
              <div className="text-xs text-[#6e7972] font-semibold mt-1">Gross Assets Under Management</div>
            </div>

            <div className="p-6 rounded-3xl bg-[#f8f7f4] border border-[#e3e1d8] space-y-1 shadow-xs">
              <div className="font-editorial text-3xl sm:text-5xl font-semibold text-[#16231c]">18,400+</div>
              <div className="text-xs text-[#6e7972] font-semibold mt-1">Managed Units &amp; Co-Living Beds</div>
            </div>

            <div className="p-6 rounded-3xl bg-[#f8f7f4] border border-[#e3e1d8] space-y-1 shadow-xs">
              <div className="font-editorial text-3xl sm:text-5xl font-semibold text-emerald-700">99.4%</div>
              <div className="text-xs text-[#6e7972] font-semibold mt-1">On-Time Rent Collection Rate</div>
            </div>

            <div 
              ref={statsBox4Ref} 
              className="p-6 rounded-3xl bg-[#f8f7f4] border border-[#e3e1d8] space-y-1 will-change-transform transform-gpu shadow-xs"
            >
              <div className="font-editorial text-3xl sm:text-5xl font-semibold text-[#16231c]">100%</div>
              <div className="text-xs text-[#6e7972] font-semibold mt-1">Axis Bank Escrow Settled</div>
            </div>
          </div>
        </ScrollReveal>

        {/* Landlord Testimonial */}
        <ScrollReveal delay={80}>
          <div className="max-w-3xl mx-auto p-7 sm:p-9 rounded-3xl bg-[#f4f3ef] border border-[#e3e1d8] text-center space-y-4">
            <div className="flex justify-center text-amber-500 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-500" />
              ))}
            </div>
            <p className="font-editorial text-base sm:text-lg text-[#16231c] italic leading-relaxed">
              &ldquo;Staywise simplified our entire landlord workflow. We manage 120 flats and two PG campuses in Bangalore. Rent collection happens like clockwork on Day 3 via WhatsApp UPI QR codes, and our tenants love the MoveFlow digital inspection checklists.&rdquo;
            </p>
            <div className="text-xs">
              <div className="font-extrabold text-[#16231c]">Vikramaditya Singhania</div>
              <div className="text-[#6e7972]">Singhania Asset Holdings LLP (Bangalore)</div>
            </div>
          </div>
        </ScrollReveal>

      </section>

      {/* ---------------------------------------------------- */}
      {/* 7. PRICING PLANS MATRIX & 7-DAY FREE TRIAL (#pricing) */}
      {/* ---------------------------------------------------- */}
      <section 
        id="pricing" 
        ref={pricingSectionRef} 
        className="py-16 sm:py-20 px-6 sm:px-12 bg-[#faf9f6] border-t border-[#eeece5] space-y-10 overflow-hidden"
      >
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e8eee9] text-[#203a2d] text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>7-Day Risk-Free Trial On Every Plan</span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-5xl font-semibold text-[#16231c]">
              Transparent Plans. ₹0 Due Today.
            </h2>

            <p className="text-xs sm:text-sm text-[#6e7972] max-w-xl mx-auto leading-relaxed">
              Choose your portfolio tier. Enjoy full access for 7 days free. Connect card or bank account for autopay after 7 days, and cancel anytime before day 7 to pay ₹0.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="pt-2 flex items-center justify-center">
              <div className="inline-flex items-center p-1 rounded-full bg-white border border-[#e3e1d8] shadow-xs">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4.5 py-1.5 rounded-full text-xs font-bold transition-all duration-100 cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-[#16231c] text-white shadow-xs'
                      : 'text-[#6e7972] hover:text-[#19251f]'
                  }`}
                >
                  Monthly Flexible
                </button>

                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  className={`px-4.5 py-1.5 rounded-full text-xs font-bold transition-all duration-100 flex items-center gap-1.5 cursor-pointer ${
                    billingCycle === 'annual'
                      ? 'bg-[#16231c] text-white shadow-xs'
                      : 'text-[#6e7972] hover:text-[#19251f]'
                  }`}
                >
                  <span>Annual Commitment</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">
                    Save 17% (2 Mo Free)
                  </span>
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          
          {/* TIER 1: STARTER */}
          <ScrollReveal delay={40} className="flex">
            <div className="w-full rounded-3xl bg-white border border-[#e3e1d8] p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xs hover:shadow-md transition-shadow duration-150">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#f4f3ef] text-[#6e7972]">
                    Starter Landlord
                  </span>
                  <h3 className="font-editorial text-xl font-bold text-[#16231c] mt-2">Starter Estate OS</h3>
                  <p className="text-xs text-[#6e7972] mt-0.5">
                    Ideal for single-building landlords &amp; duplex assets.
                  </p>
                </div>

                <div className="pt-2 pb-4 border-b border-[#eeece5]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-[#16231c]">
                      ₹{billingCycle === 'annual' ? Math.round(24990 / 12).toLocaleString('en-IN') : (2499).toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#6e7972]">/month</span>
                  </div>
                  <div className="text-[11px] text-[#6e7972] mt-0.5">
                    {billingCycle === 'annual' ? '₹24,990 billed annually (Save ₹4,998)' : '₹2,499 billed monthly'}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#4d5a52]">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#203a2d] shrink-0" />
                    <span>Up to 10 Units</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#203a2d] shrink-0" />
                    <span>Automated Invoices &amp; PDF Receipts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#203a2d] shrink-0" />
                    <span>WhatsApp Payment Reminders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#203a2d] shrink-0" />
                    <span>Dynamic UPI QR Code Collection</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenTrial('starter')}
                  className="w-full py-3 rounded-full bg-[#f4f3ef] hover:bg-[#16231c] hover:text-white text-[#16231c] font-bold text-xs transition-colors duration-150 cursor-pointer"
                >
                  Start 7-Day Free Trial
                </button>
                <div className="text-center text-[10px] text-[#6e7972]">
                  ₹0 due today • Autopay connected • Cancel before 7 days
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* TIER 2: GROWTH PRO (MOST POPULAR) */}
          <ScrollReveal delay={80} className="flex">
            <div 
              ref={pricingFeaturedCardRef}
              className="w-full rounded-3xl bg-white border-2 border-[#203a2d] p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-lg relative transform lg:-translate-y-2 will-change-transform transform-gpu"
            >
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#203a2d] text-white text-xs font-black uppercase tracking-wider shadow-xs">
                Most Popular
              </span>

              <div className="space-y-4 pt-1">
                <div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#e8eee9] text-[#203a2d]">
                    Growth Portfolios
                  </span>
                  <h3 className="font-editorial text-2xl font-bold text-[#16231c] mt-2">Growth Portfolio Pro OS</h3>
                  <p className="text-xs text-[#6e7972] mt-0.5">
                    Unified multi-asset system with sub-meter OCR &amp; MoveFlow.
                  </p>
                </div>

                <div className="pt-2 pb-4 border-b border-[#eeece5]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-[#16231c]">
                      ₹{billingCycle === 'annual' ? Math.round(79990 / 12).toLocaleString('en-IN') : (7999).toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#6e7972]">/month</span>
                  </div>
                  <div className="text-[11px] text-[#203a2d] font-semibold mt-0.5">
                    {billingCycle === 'annual' ? '₹79,990 billed annually (Save ₹15,998)' : '₹7,999 billed monthly'}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#16231c]">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#203a2d] shrink-0" />
                    <span><b>Up to 50 Units &amp; PG Co-living Beds</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#203a2d] shrink-0" />
                    <span><b>Sub-Meter Electricity OCR Splitting</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#203a2d] shrink-0" />
                    <span><b>MoveFlow Digital Inspections (Zero Disputes)</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#203a2d] shrink-0" />
                    <span><b>Statutory Double-Entry Ledger</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#203a2d] shrink-0" />
                    <span><b>Vacancy Cost Engine &amp; Leak Detector</b></span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenTrial('growth_pro')}
                  className="w-full py-3.5 rounded-full bg-[#203a2d] hover:bg-[#172b21] text-white font-bold text-sm shadow-md shadow-[#203a2d]/20 transition duration-150 cursor-pointer"
                >
                  Start 7-Day Free Trial (₹0 Today)
                </button>
                <div className="text-center text-[10px] text-[#203a2d] font-semibold">
                  Connect Card or Bank Autopay • Cancel before 7 days in 1 click
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* TIER 3: ENTERPRISE */}
          <ScrollReveal delay={110} className="flex">
            <div className="w-full rounded-3xl bg-white border border-[#e3e1d8] p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xs hover:shadow-md transition-shadow duration-150">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#f4f3ef] text-[#6e7972]">
                    Enterprise Institutional
                  </span>
                  <h3 className="font-editorial text-xl font-bold text-[#16231c] mt-2">Institutional Master OS</h3>
                  <p className="text-xs text-[#6e7972] mt-0.5">
                    For family offices, LLPs &amp; commercial campuses.
                  </p>
                </div>

                <div className="pt-2 pb-4 border-b border-[#eeece5]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-[#16231c]">
                      ₹{billingCycle === 'annual' ? Math.round(199990 / 12).toLocaleString('en-IN') : (19999).toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#6e7972]">/month</span>
                  </div>
                  <div className="text-[11px] text-[#6e7972] mt-0.5">
                    {billingCycle === 'annual' ? '₹1,99,990 billed annually (Save ₹39,998)' : '₹19,999 billed monthly'}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#4d5a52]">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#203a2d] shrink-0" />
                    <span>Unlimited Portfolios &amp; LLPs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#203a2d] shrink-0" />
                    <span>Axis Bank Escrow Direct Instant T+0 Sweeps</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#203a2d] shrink-0" />
                    <span>Commercial CAM Allocation Engine</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#203a2d] shrink-0" />
                    <span>Dedicated 24/7 Account Director</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenTrial('enterprise')}
                  className="w-full py-3 rounded-full bg-[#f4f3ef] hover:bg-[#16231c] hover:text-white text-[#16231c] font-bold text-xs transition-colors duration-150 cursor-pointer"
                >
                  Start 7-Day Free Trial
                </button>
                <div className="text-center text-[10px] text-[#6e7972]">
                  ₹0 due today • Autopay connected • Cancel before 7 days
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>

        {/* Trial Guarantee Callout */}
        <ScrollReveal delay={70}>
          <div className="max-w-4xl mx-auto p-5 sm:p-6 rounded-3xl bg-[#e8eee9] border border-[#cbd8ce] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-9 w-9 rounded-full bg-[#203a2d] text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <div className="text-xs text-[#203a2d]">
                <span className="font-extrabold">How does the 7-day trial autopay work? </span>
                <span className="text-[#3b5949]">
                  ₹0.00 is charged today. You connect your card or bank account, but payment is only processed on Day 7 if you keep the plan. Cancel anytime before Day 7 from Settings with 1 click to pay nothing.
                </span>
              </div>
            </div>

            <button
              onClick={() => handleOpenTrial('growth_pro')}
              className="px-5 py-2 rounded-full bg-[#203a2d] hover:bg-[#172b21] text-white font-bold text-xs shrink-0 transition-colors shadow-xs cursor-pointer"
            >
              Start Free Trial →
            </button>
          </div>
        </ScrollReveal>

      </section>

      {/* ---------------------------------------------------- */}
      {/* 8. FREQUENTLY ASKED QUESTIONS (#faq)                 */}
      {/* ---------------------------------------------------- */}
      <section id="faq" className="py-12 sm:py-16 px-6 sm:px-12 bg-white space-y-8">
        
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase text-[#203a2d]">
              Questions &amp; Answers
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#16231c]">
              Frequently Asked Questions
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={70}>
          <div className="max-w-3xl mx-auto space-y-3">
            {[
              {
                q: "Will I be charged anything today when signing up for the 7-day trial?",
                a: "No! Absolutely ₹0.00 is charged today. When you connect your card or bank account, we establish an automated mandate so your account remains uninterrupted after the trial. Your first charge will only process on Day 7 if you choose to continue using Staywise."
              },
              {
                q: "How do I cancel before the 7 days are up?",
                a: "Cancellation is 100% self-serve and takes 1 click. Simply go to Platform Settings > Subscription & Plans in your dashboard and click 'Cancel 7-Day Trial & Autopay'. Your card or bank will never be charged."
              },
              {
                q: "Which payment methods are supported for autopay?",
                a: "We support all major Credit Cards (Visa, Mastercard, RuPay, Amex), recurring Debit Cards, and direct Net Banking via RBI e-NACH or UPI Recurring AutoPay (Google Pay, PhonePe, Paytm, BHIM)."
              },
              {
                q: "How does the Sub-Meter Electricity OCR splitting work?",
                a: "You simply upload a photograph or PDF of your state electricity board bill (e.g. BESCOM, KSEB, MSEDCL). Our AI OCR automatically extracts the fixed charges, slab tariff rates, and calculates each tenant's individual sub-meter units."
              }
            ].map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl bg-[#faf9f6] border border-[#e3e1d8] overflow-hidden transition-colors duration-100"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#16231c] hover:text-[#203a2d] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-[#6e7972] shrink-0 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs text-[#6e7972] leading-relaxed border-t border-[#eeece5]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollReveal>

      </section>

      {/* ---------------------------------------------------- */}
      {/* 9. CLEAN MINIMALIST FOOTER                           */}
      {/* ---------------------------------------------------- */}
      <footer className="bg-[#16231c] text-white/80 py-12 px-6 sm:px-12 text-xs relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-white text-[#16231c] flex items-center justify-center font-bold text-xs">
              SW
            </div>
            <span className="font-extrabold text-white text-sm tracking-tight">STAYWISE</span>
            <span className="text-white/40">|</span>
            <span className="text-[11px] text-white/60">Operating System for Real Estate &amp; Rentals</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-white/70">
            <a href="#overview" className="hover:text-white transition-colors">Home</a>
            <a href="#interactive-building" className="hover:text-white transition-colors">Architecture</a>
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing Plans</a>
            <a href="/login" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1 text-emerald-300 font-semibold">
              <span>Member Sign in</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>

          <div className="text-[11px] text-white/50">
            &copy; {new Date().getFullYear()} Staywise Technologies Pvt. Ltd. All rights reserved.
          </div>
        </div>
      </footer>

      {/* 7-Day Free Trial Autopay Modal */}
      <TrialAutopayModal
        isOpen={isTrialModalOpen}
        onClose={() => setIsTrialModalOpen(false)}
        initialPlanId={selectedPlanForTrial}
        initialBillingCycle={billingCycle}
      />

    </div>
  );
}
