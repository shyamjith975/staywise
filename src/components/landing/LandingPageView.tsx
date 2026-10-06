'use client';

import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
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
  ArrowUpRight,
  Menu,
  X,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  Calendar,
  ChevronRight,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Activity,
  Bot,
  UserCheck,
  FileCheck2,
  Receipt,
  Scale,
  Headphones
} from 'lucide-react';

interface LandingPageViewProps {
  onNavigateToLogin?: () => void;
}

/**
 * Instantaneous zero-overhead component wrapper
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
  // Mobile Navigation Drawer
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Pricing toggle: monthly vs annual
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  // 7-Day Trial Modal State
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [selectedPlanForTrial, setSelectedPlanForTrial] = useState<SubscriptionTierId>('growth_pro');

  // Interactive Live Dashboard Showcase Tabs
  const [activeTab, setActiveTab] = useState<'RENT' | 'BEDS' | 'WHATSAPP' | 'OCR' | 'CRM' | 'MOVEFLOW'>('RENT');

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // -------------------------------------------------------------------------
  // CONTINUOUS FULL-PAGE SMOOTH SCROLL & PARALLAX ENGINE (LENIS)
  // - Synchronized Lenis scroll loop across mobile, tablet, and desktop
  // - Architecture building displacement (+/-110px travel + optical scale)
  // - Multi-layer parallax depth on pain points, dashboard, features & stats
  // -------------------------------------------------------------------------
  const lenisRef = useRef<Lenis | null>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const painSectionRef = useRef<HTMLDivElement>(null);
  const painCard1Ref = useRef<HTMLDivElement>(null);
  const painCard2Ref = useRef<HTMLDivElement>(null);
  const painCard3Ref = useRef<HTMLDivElement>(null);
  const architectureSectionRef = useRef<HTMLDivElement>(null);
  const buildingParallaxRef = useRef<HTMLDivElement>(null);
  const buildingBadgeRef = useRef<HTMLDivElement>(null);
  const leftCardsParallaxRef = useRef<HTMLDivElement>(null);
  const rightCardsParallaxRef = useRef<HTMLDivElement>(null);
  const dashboardSectionRef = useRef<HTMLDivElement>(null);
  const dashboardCardRef = useRef<HTMLDivElement>(null);
  const servicesSectionRef = useRef<HTMLDivElement>(null);
  const servicesCol1Ref = useRef<HTMLDivElement>(null);
  const servicesCol3Ref = useRef<HTMLDivElement>(null);
  const statsSectionRef = useRef<HTMLDivElement>(null);
  const statsBox1Ref = useRef<HTMLDivElement>(null);
  const statsBox4Ref = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const pricingSectionRef = useRef<HTMLDivElement>(null);
  const pricingFeaturedCardRef = useRef<HTMLDivElement>(null);
  const pricingGuaranteeRef = useRef<HTMLDivElement>(null);
  const faqSectionRef = useRef<HTMLDivElement>(null);
  const faqContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const lenis = new Lenis({
      duration: isMobile ? 0.75 : 0.95,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.15,
      touchMultiplier: 1.25,
      autoRaf: false,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const onScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const windowH = window.innerHeight;

      // 1. Hero Parallax
      if (heroBgRef.current) {
        heroBgRef.current.style.transform = `translate3d(0, ${(scrollY * 0.22).toFixed(1)}px, 0)`;
      }
      if (heroContentRef.current) {
        heroContentRef.current.style.transform = `translate3d(0, ${(scrollY * 0.08).toFixed(1)}px, 0)`;
      }

      // 2. Where Owners Lose Time (Pain Points) Parallax
      if (painSectionRef.current) {
        const rect = painSectionRef.current.getBoundingClientRect();
        if (rect.bottom > -100 && rect.top < windowH + 100) {
          const relY = windowH * 0.5 - (rect.top + rect.height * 0.5);
          if (painCard1Ref.current) {
            painCard1Ref.current.style.transform = `translate3d(0, ${(relY * -0.05).toFixed(1)}px, 0)`;
          }
          if (painCard2Ref.current) {
            painCard2Ref.current.style.transform = `translate3d(0, ${(relY * 0.04).toFixed(1)}px, 0)`;
          }
          if (painCard3Ref.current) {
            painCard3Ref.current.style.transform = `translate3d(0, ${(relY * -0.06).toFixed(1)}px, 0)`;
          }
        }
      }

      // 3. Flagship Architectural Parallax Showcase
      if (architectureSectionRef.current) {
        const rect = architectureSectionRef.current.getBoundingClientRect();
        if (rect.bottom > -200 && rect.top < windowH + 200) {
          const sectionCenter = rect.top + rect.height * 0.5;
          const viewportCenter = windowH * 0.5;
          const relY = viewportCenter - sectionCenter;

          const buildingY = Math.max(-110, Math.min(110, relY * -0.18));
          const proximity = Math.max(0, 1 - Math.abs(relY) / (windowH * 0.85));
          const buildingScale = 0.95 + proximity * 0.09;
          const cardsY = Math.max(-70, Math.min(70, relY * 0.11));

          if (buildingParallaxRef.current) {
            buildingParallaxRef.current.style.transform = `translate3d(0, ${buildingY.toFixed(1)}px, 0) scale(${buildingScale.toFixed(3)})`;
          }
          if (buildingBadgeRef.current) {
            buildingBadgeRef.current.style.transform = `translate3d(0, ${(relY * -0.05).toFixed(1)}px, 0)`;
          }
          if (leftCardsParallaxRef.current) {
            leftCardsParallaxRef.current.style.transform = `translate3d(0, ${cardsY.toFixed(1)}px, 0)`;
          }
          if (rightCardsParallaxRef.current) {
            rightCardsParallaxRef.current.style.transform = `translate3d(0, ${(cardsY * 1.15).toFixed(1)}px, 0)`;
          }
        }
      }

      // 4. Everything Inside Dashboard Parallax
      if (dashboardSectionRef.current) {
        const rect = dashboardSectionRef.current.getBoundingClientRect();
        if (rect.bottom > -150 && rect.top < windowH + 150) {
          const relY = windowH * 0.5 - (rect.top + rect.height * 0.5);
          const floatOffset = Math.max(-35, Math.min(35, relY * -0.06));
          if (dashboardCardRef.current) {
            dashboardCardRef.current.style.transform = `translate3d(0, ${floatOffset.toFixed(1)}px, 0)`;
          }
        }
      }

      // 5. Autopilot Services 3-Column Staggered Parallax
      if (servicesSectionRef.current) {
        const rect = servicesSectionRef.current.getBoundingClientRect();
        if (rect.bottom > -150 && rect.top < windowH + 150) {
          const relY = windowH * 0.5 - (rect.top + rect.height * 0.5);
          const colShift = Math.max(-40, Math.min(40, relY * 0.07));
          if (servicesCol1Ref.current) {
            servicesCol1Ref.current.style.transform = `translate3d(0, ${(-colShift).toFixed(1)}px, 0)`;
          }
          if (servicesCol3Ref.current) {
            servicesCol3Ref.current.style.transform = `translate3d(0, ${colShift.toFixed(1)}px, 0)`;
          }
        }
      }

      // 6. Scale Stats & Testimonial Parallax
      if (statsSectionRef.current) {
        const rect = statsSectionRef.current.getBoundingClientRect();
        if (rect.bottom > -100 && rect.top < windowH + 100) {
          const relY = windowH * 0.5 - (rect.top + rect.height * 0.5);
          const boxShift = Math.max(-25, Math.min(25, relY * -0.04));
          if (statsBox1Ref.current) {
            statsBox1Ref.current.style.transform = `translate3d(0, ${boxShift.toFixed(1)}px, 0)`;
          }
          if (statsBox4Ref.current) {
            statsBox4Ref.current.style.transform = `translate3d(0, ${(-boxShift).toFixed(1)}px, 0)`;
          }
          if (testimonialRef.current) {
            testimonialRef.current.style.transform = `translate3d(0, ${(relY * 0.03).toFixed(1)}px, 0)`;
          }
        }
      }

      // 7. Pricing Matrix & Guarantee Box Parallax
      if (pricingSectionRef.current) {
        const rect = pricingSectionRef.current.getBoundingClientRect();
        if (rect.bottom > -100 && rect.top < windowH + 100) {
          const relY = windowH * 0.5 - (rect.top + rect.height * 0.5);
          if (pricingFeaturedCardRef.current) {
            pricingFeaturedCardRef.current.style.transform = `translate3d(0, ${(relY * -0.04).toFixed(1)}px, 0)`;
          }
          if (pricingGuaranteeRef.current) {
            pricingGuaranteeRef.current.style.transform = `translate3d(0, ${(relY * 0.03).toFixed(1)}px, 0)`;
          }
        }
      }

      // 8. FAQ Accordion Parallax
      if (faqSectionRef.current) {
        const rect = faqSectionRef.current.getBoundingClientRect();
        if (rect.bottom > -100 && rect.top < windowH + 100) {
          const relY = windowH * 0.5 - (rect.top + rect.height * 0.5);
          if (faqContainerRef.current) {
            faqContainerRef.current.style.transform = `translate3d(0, ${(relY * -0.03).toFixed(1)}px, 0)`;
          }
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const elem = document.querySelector(targetId);
    if (elem) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(elem as HTMLElement, { offset: -70, duration: 1.1 });
      } else {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOpenTrial = (plan: SubscriptionTierId = 'growth_pro') => {
    setSelectedPlanForTrial(plan);
    setIsTrialModalOpen(true);
  };

  const toggleFaq = (idx: number) => {
    setExpandedFaq(expandedFaq === idx ? null : idx);
  };

  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateToLogin) {
      onNavigateToLogin();
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen bg-[#EBF0E6] text-[#132A13] selection:bg-[#ECF39E] selection:text-[#132A13] font-sans antialiased overflow-x-hidden">
      
      {/* ---------------------------------------------------- */}
      {/* 1. TOP RESPONSIVE HEADER BAR                         */}
      {/* ---------------------------------------------------- */}
      <header className="w-full px-4 sm:px-8 lg:px-12 py-3 sm:py-3.5 flex items-center justify-between border-b border-[#DCE5D3] bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-xs">
        {/* Left: Geometric Emblem + Brand Name */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <a 
            href="#overview" 
            onClick={(e) => handleNavClick(e, '#overview')}
            className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer"
          >
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-[#132A13] text-[#ECF39E] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-150 shrink-0 font-black">
              <span className="text-sm font-black">✦</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-black text-sm sm:text-base tracking-tight text-[#132A13] leading-none">
                STAYWISE
              </span>
              <span className="text-[9px] text-[#657D5C] font-bold tracking-wider uppercase mt-0.5 hidden xs:inline">
                Property OS
              </span>
            </div>
          </a>
        </div>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-[#657D5C]">
          <a 
            href="#overview" 
            onClick={(e) => handleNavClick(e, '#overview')}
            className="hover:text-[#132A13] transition-colors duration-100 cursor-pointer"
          >
            Home
          </a>
          <a 
            href="#pain-points" 
            onClick={(e) => handleNavClick(e, '#pain-points')}
            className="hover:text-[#132A13] transition-colors duration-100 cursor-pointer"
          >
            Where Owners Lose Time
          </a>
          <a 
            href="#interactive-building" 
            onClick={(e) => handleNavClick(e, '#interactive-building')}
            className="hover:text-[#132A13] transition-colors duration-100 flex items-center gap-1 font-bold text-[#31572C] cursor-pointer"
          >
            <span>Architecture</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#31572C] animate-pulse" />
          </a>
          <a 
            href="#everything-inside" 
            onClick={(e) => handleNavClick(e, '#everything-inside')}
            className="hover:text-[#132A13] transition-colors duration-100 cursor-pointer"
          >
            Everything Inside
          </a>
          <a 
            href="#how-it-works" 
            onClick={(e) => handleNavClick(e, '#how-it-works')}
            className="hover:text-[#132A13] transition-colors duration-100 cursor-pointer"
          >
            How it Works
          </a>
          <a 
            href="#pricing" 
            onClick={(e) => handleNavClick(e, '#pricing')}
            className="hover:text-[#132A13] transition-colors duration-100 cursor-pointer"
          >
            Pricing
          </a>
          <a 
            href="#faq" 
            onClick={(e) => handleNavClick(e, '#faq')}
            className="hover:text-[#132A13] transition-colors duration-100 cursor-pointer"
          >
            FAQ
          </a>
          <a 
            href="#resources" 
            onClick={(e) => handleNavClick(e, '#resources')}
            className="hover:text-[#132A13] transition-colors duration-100 cursor-pointer"
          >
            Resources
          </a>
        </nav>

        {/* Right Actions: Outlined Sign in + CTA + Hamburger Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/login"
            onClick={handleSignInClick}
            className="px-3.5 sm:px-4 py-1.5 rounded-full border border-[#DCE5D3] text-[11px] sm:text-xs font-bold text-[#132A13] hover:bg-[#F3F6EE] transition-all duration-150 shadow-2xs cursor-pointer inline-flex items-center justify-center gap-1.5 group shrink-0"
          >
            <span>Sign in</span>
            <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150 text-[#31572C]" />
          </a>

          <button
            onClick={() => handleOpenTrial('growth_pro')}
            className="hidden sm:inline-flex px-4 py-1.5 rounded-full bg-[#132A13] hover:bg-[#31572C] text-[#ECF39E] text-xs font-black shadow-xs transition duration-150 cursor-pointer border border-[#132A13]/20"
          >
            Start Free Trial →
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-1.5 rounded-xl text-[#132A13] hover:bg-[#F3F6EE] transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-[53px] sm:top-[57px] left-0 right-0 bg-white/98 backdrop-blur-lg border-b border-[#eeece5] shadow-xl z-40 px-5 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-2.5 text-xs font-semibold text-[#3b4941]">
            <a 
              href="#overview" 
              onClick={(e) => {
                handleNavClick(e, '#overview');
                setIsMobileMenuOpen(false);
              }}
              className="py-1 hover:text-[#16231c] transition-colors"
            >
              Home
            </a>
            <a 
              href="#pain-points" 
              onClick={(e) => {
                handleNavClick(e, '#pain-points');
                setIsMobileMenuOpen(false);
              }}
              className="py-1 hover:text-[#16231c] transition-colors"
            >
              Where Owners Lose Time
            </a>
            <a 
              href="#interactive-building" 
              onClick={(e) => {
                handleNavClick(e, '#interactive-building');
                setIsMobileMenuOpen(false);
              }}
              className="py-1 flex items-center justify-between text-[#203a2d] font-bold"
            >
              <span>Architecture</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </a>
            <a 
              href="#everything-inside" 
              onClick={(e) => {
                handleNavClick(e, '#everything-inside');
                setIsMobileMenuOpen(false);
              }}
              className="py-1 hover:text-[#16231c] transition-colors"
            >
              Everything Inside
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => {
                handleNavClick(e, '#how-it-works');
                setIsMobileMenuOpen(false);
              }}
              className="py-1 hover:text-[#16231c] transition-colors"
            >
              How it Works
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => {
                handleNavClick(e, '#pricing');
                setIsMobileMenuOpen(false);
              }}
              className="py-1 hover:text-[#16231c] transition-colors"
            >
              Pricing Plans
            </a>
            <a 
              href="#faq" 
              onClick={(e) => {
                handleNavClick(e, '#faq');
                setIsMobileMenuOpen(false);
              }}
              className="py-1 hover:text-[#16231c] transition-colors"
            >
              FAQ
            </a>
            <a 
              href="#resources" 
              onClick={(e) => {
                handleNavClick(e, '#resources');
                setIsMobileMenuOpen(false);
              }}
              className="py-1 hover:text-[#16231c] transition-colors"
            >
              Resources &amp; Cities
            </a>
          </nav>

          <div className="pt-2 border-t border-[#eeece5]">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleOpenTrial('growth_pro');
              }}
              className="w-full py-2.5 rounded-full bg-[#203a2d] hover:bg-[#172b21] text-white font-bold text-xs shadow-md transition text-center cursor-pointer"
            >
              Start 7-Day Free Trial (₹0 Today)
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. HERO SECTION: "Stop chasing rent. Start collecting" */}
      {/* ---------------------------------------------------- */}
      <section 
        id="overview"
        className="relative w-full min-h-[580px] sm:min-h-[660px] lg:min-h-[740px] flex flex-col items-center justify-start pt-8 sm:pt-14 lg:pt-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden"
      >
        {/* Hardware-Accelerated Lightweight Hero Background Image */}
        <div 
          ref={heroBgRef}
          className="absolute inset-x-0 -top-10 -bottom-10 bg-cover bg-center bg-no-repeat pointer-events-none transform-gpu will-change-transform"
          style={{ 
            backgroundImage: `url('/images/hero-luxury-residence-light.jpg')`
          }}
        />

        {/* Crisp static gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/60 to-[#fdfbf7] pointer-events-none" />

        {/* Floating Pill Announcement */}
        <div className="relative z-10 mb-4 sm:mb-6 animate-in fade-in slide-in-from-top-3 duration-500 w-full flex justify-center px-2">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/95 border border-[#c1d3c9] text-[#203a2d] text-[10px] sm:text-xs font-bold shadow-xs hover:bg-white transition-colors max-w-full text-center">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>Staywise Enterprise OS • Multi-Asset Property Intelligence &amp; Rent Automation</span>
          </div>
        </div>

        {/* Distinctive Editorial Serif Headline */}
        <div ref={heroContentRef} className="relative z-10 max-w-4xl mx-auto space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-600 will-change-transform transform-gpu px-2 sm:px-0">
          <h1 className="font-editorial text-3xl xs:text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#16231c] leading-[1.12]">
            Universal Property Operations. <br className="hidden sm:inline" />
            Effortless Yield Intelligence.
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-base lg:text-lg text-[#2f3f35] max-w-2xl mx-auto leading-relaxed font-normal px-1 sm:px-0">
            Staywise is the complete property intelligence &amp; automation system. From PG co-living buildings and residential apartments to warehouses and commercial assets — automate rent reconciliation, sub-meter billing, tenant KYC, and portfolio performance in one unified platform.
          </p>

          {/* Dual Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleOpenTrial('growth_pro')}
              className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#203a2d] hover:bg-[#172b21] text-white font-bold text-xs sm:text-base shadow-lg shadow-[#203a2d]/30 transition-all duration-150 transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <span>Start 7-Day Free Trial (₹0 Today)</span>
              <span className="text-base sm:text-lg group-hover:translate-x-1.5 transition-transform duration-150">→</span>
            </button>

            <a
              href="#how-it-works"
              onClick={(e) => handleNavClick(e, '#how-it-works')}
              className="w-full sm:w-auto px-6 py-3.5 sm:py-4 rounded-full bg-white/95 border border-[#e3e1d8] text-[#16231c] font-bold text-xs sm:text-sm hover:bg-[#f4f3ef] transition-colors shadow-xs cursor-pointer"
            >
              See How It Works (15 Mins)
            </a>
          </div>

          {/* 7-Day Free Trial & Autopay Guarantee */}
          <div className="pt-1 text-[11px] sm:text-xs font-semibold text-[#203a2d] flex items-center justify-center gap-2 flex-wrap px-2">
            <span className="flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-emerald-700" />
              <span>₹0 charged today</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-emerald-700" />
              <span>Cancel before 7 days in 1 click</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-emerald-700" />
              <span>Works directly on WhatsApp</span>
            </span>
          </div>
        </div>

        {/* Bottom Trust Rail: Real Estate & Banking Rails */}
        <div className="relative z-10 mt-auto pt-10 sm:pt-16 lg:pt-20 pb-6 sm:pb-8 w-full max-w-4xl mx-auto space-y-3 px-2 sm:px-0">
          <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#495b50]">
            Integrated with India&apos;s Prime Portals &amp; Banking Rails
          </div>

          <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center justify-center gap-4 sm:gap-8 lg:gap-10 text-xs sm:text-sm font-black text-[#2f3d35]/85 tracking-tight">
            <span className="flex items-center justify-center gap-1">
              <span className="font-serif font-bold text-sm sm:text-base">Axis Escrow</span>
            </span>
            <span className="flex items-center justify-center gap-1">
              <span className="font-sans font-extrabold text-sm sm:text-base text-emerald-800">UPI AutoPay</span>
            </span>
            <span className="flex items-center justify-center gap-1">
              <span className="font-sans font-bold text-sm sm:text-base text-amber-800">99acres</span>
            </span>
            <span className="flex items-center justify-center gap-1">
              <span className="font-mono font-bold text-sm sm:text-base">MagicBricks</span>
            </span>
            <span className="flex items-center justify-center gap-1">
              <span className="font-serif italic font-bold text-sm sm:text-base">NoBroker</span>
            </span>
            <span className="flex items-center justify-center gap-1">
              <span className="font-sans font-black text-sm sm:text-base text-[#203a2d]">BESCOM / KSEB</span>
            </span>
          </div>
        </div>

        {/* Smooth Dissolve Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#fdfbf7] to-transparent pointer-events-none" />
      </section>

      {/* ---------------------------------------------------- */}
      {/* 3. IN ONE LINE: THE CORE DEFINITION                   */}
      {/* ---------------------------------------------------- */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-12 bg-white border-y border-[#eeece5]">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4f3ef] border border-[#e3e1d8] text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#6e7972]">
            <span>What is Staywise</span>
            <span className="text-[#203a2d]">• IN ONE LINE</span>
          </div>

          <h2 className="font-editorial text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#16231c] leading-snug">
            A free property operating system for Paying Guest (PG), hostel, co-living, flat, and villa owners in India.
          </h2>

          <p className="text-xs sm:text-base text-[#6e7972] max-w-2xl mx-auto leading-relaxed">
            It sends <b>automatic rent reminders on WhatsApp</b>, tracks every bed, room, and flat across all your properties, manages leads from <b>99acres, MagicBricks, and NoBroker</b> in one inbox, and handles <b>digital KYC &amp; e-stamped rental agreements</b> — at zero cost to the owner.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 max-w-2xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-[#faf9f6] border border-[#e3e1d8] flex items-center gap-3">
              <Clock className="h-5 w-5 text-[#203a2d] shrink-0" />
              <div>
                <div className="font-bold text-xs text-[#16231c]">Ready in 15 Minutes</div>
                <div className="text-[10px] text-[#6e7972]">Zero complex manuals</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#faf9f6] border border-[#e3e1d8] flex items-center gap-3">
              <Bot className="h-5 w-5 text-emerald-700 shrink-0" />
              <div>
                <div className="font-bold text-xs text-[#16231c]">Works on WhatsApp</div>
                <div className="text-[10px] text-[#6e7972]">English Natural Language AI</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#faf9f6] border border-[#e3e1d8] flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[#203a2d] shrink-0" />
              <div>
                <div className="font-bold text-xs text-[#16231c]">Free 7-Day Autopay Trial</div>
                <div className="text-[10px] text-[#6e7972]">₹0 due today • Cancel anytime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 4. WHERE OWNERS LOSE TIME (THE 5 REAL PAIN POINTS)   */}
      {/* ---------------------------------------------------- */}
      <section 
        id="pain-points" 
        ref={painSectionRef}
        className="py-14 sm:py-20 px-4 sm:px-6 lg:px-12 bg-[#faf9f6] space-y-10 overflow-hidden"
      >
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto space-y-2.5 px-2 sm:px-0">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#F7553D]">
              Where Property Owners Lose Time
            </span>
            <h2 className="font-editorial text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#16231c]">
              The 5 Daily Headaches Draining Your Rental Profits
            </h2>
            <p className="text-xs sm:text-sm text-[#6e7972] max-w-xl mx-auto leading-relaxed">
              Managing properties on WhatsApp groups, spreadsheets, and sticky notes leads to unpaid rents, lost tenant enquiries, and endless disputes.
            </p>
          </div>
        </ScrollReveal>

        {/* Staggered Parallax Pain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto items-stretch">
          
          {/* PAIN 1: The Rent Chase */}
          <div 
            ref={painCard1Ref}
            className="p-6 rounded-3xl bg-white border border-[#e3e1d8] shadow-xs hover:shadow-md transition-shadow duration-150 flex flex-col justify-between space-y-4 will-change-transform transform-gpu"
          >
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <Receipt className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">
                Pain #1 • The Rent Chase
              </span>
              <h3 className="font-editorial text-lg font-bold text-[#16231c]">
                &ldquo;When will the rent be paid?&rdquo;
              </h3>
              <p className="text-xs text-[#6e7972] leading-relaxed">
                Day 1 arrives. You text: <i>&ldquo;Hi sir, kindly pay your rent...&rdquo;</i> They read and ignore. You call. They promise tomorrow. You spend 4 days chasing 20 different tenants across 3 properties.
              </p>
            </div>

            <div className="pt-3 border-t border-[#eeece5] text-xs text-[#203a2d]">
              <span className="font-bold text-emerald-800">Staywise Fix: </span>
              <span>Automated WhatsApp reminders at T-3, Due Date, and T+3 with instant UPI QR links. 99.4% collected on time without one awkward call.</span>
            </div>
          </div>

          {/* PAIN 2: The Lost Portal Leads */}
          <div 
            ref={painCard2Ref}
            className="p-6 rounded-3xl bg-white border border-[#e3e1d8] shadow-xs hover:shadow-md transition-shadow duration-150 flex flex-col justify-between space-y-4 will-change-transform transform-gpu"
          >
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Phone className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
                Pain #2 • The Lost Lead
              </span>
              <h3 className="font-editorial text-lg font-bold text-[#16231c]">
                Missed calls &amp; lost bookings
              </h3>
              <p className="text-xs text-[#6e7972] leading-relaxed">
                A high-budget seeker calls from 99acres while you are driving. You miss it. By the time you call back 2 hours later, they already booked another hostel down the street.
              </p>
            </div>

            <div className="pt-3 border-t border-[#eeece5] text-xs text-[#203a2d]">
              <span className="font-bold text-emerald-800">Staywise Fix: </span>
              <span>Centralized CRM uniting 99acres, MagicBricks &amp; NoBroker with instant AI WhatsApp replies, location pins, and scheduled site visits.</span>
            </div>
          </div>

          {/* PAIN 3: Vacancy Guessing & Caretaker Disconnect */}
          <div 
            ref={painCard3Ref}
            className="p-6 rounded-3xl bg-white border border-[#e3e1d8] shadow-xs hover:shadow-md transition-shadow duration-150 flex flex-col justify-between space-y-4 will-change-transform transform-gpu"
          >
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <Home className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-800">
                Pain #3 • Vacancy Guesswork
              </span>
              <h3 className="font-editorial text-lg font-bold text-[#16231c]">
                &ldquo;Is Room 204 vacant right now?&rdquo;
              </h3>
              <p className="text-xs text-[#6e7972] leading-relaxed">
                A walk-in visits. You call your caretaker to ask if room 204 has a bed. He doesn&apos;t pick up. You guess. You guess wrong and have to refund a deposit.
              </p>
            </div>

            <div className="pt-3 border-t border-[#eeece5] text-xs text-[#203a2d]">
              <span className="font-bold text-emerald-800">Staywise Fix: </span>
              <span>Live visual floor plan on your phone showing exactly which bed is occupied, vacant, or under 30-day notice.</span>
            </div>
          </div>

        </div>

        {/* 2 Additional Pain Points: Electricity & Disputed Deposits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-6xl mx-auto">
          {/* PAIN 4: Electricity Bill Splitting */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#e3e1d8] shadow-xs flex flex-col sm:flex-row items-start gap-4">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold shrink-0">
              <Zap className="h-5 w-5" />
            </div>
            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] font-black uppercase text-indigo-700">
                Pain #4 • Electricity Bill Disputes
              </span>
              <h4 className="font-bold text-sm text-[#16231c]">
                Tenants arguing over meter readings &amp; Excel sheets
              </h4>
              <p className="text-[#6e7972] leading-relaxed">
                Tenants accuse each other of using the AC all night. You pull out a calculator, forget fixed charge slabs, and spend Sunday evening resolving a ₹400 dispute.
              </p>
              <div className="text-[#203a2d] pt-1">
                <b>Staywise Solution: </b>Snap a photo of the Discom bill. The OCR engine reads slab tariffs, divides sub-meter units, and posts itemized bills to tenant WhatsApp accounts.
              </div>
            </div>
          </div>

          {/* PAIN 5: MoveFlow Deposits & Paper KYC */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#e3e1d8] shadow-xs flex flex-col sm:flex-row items-start gap-4">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
              <Scale className="h-5 w-5" />
            </div>
            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] font-black uppercase text-emerald-800">
                Pain #5 • Deposit &amp; Damage Battles
              </span>
              <h4 className="font-bold text-sm text-[#16231c]">
                Tenant leaves damaged walls. You have no move-in proof.
              </h4>
              <p className="text-[#6e7972] leading-relaxed">
                Tenant moves out and demands full security deposit. The bathroom tiles are cracked, but with no move-in checklist, you either absorb the loss or face a bitter argument.
              </p>
              <div className="text-[#203a2d] pt-1">
                <b>Staywise Solution: </b>MoveFlow digital photo inspection with timestamp seals at check-in. Legally compliant e-stamped agreements generated in 5 minutes.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------------------- */}
      {/* 5. SIGNATURE ARCHITECTURE SHOWCASE (CONTINUOUS BUTTER-SMOOTH PARALLAX)             */}
      {/* --------------------------------------------------------------------------------- */}
      <section 
        id="interactive-building"
        ref={architectureSectionRef}
        className="relative w-full py-12 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-[#faf9f5] to-white overflow-hidden"
      >
        <div className="w-full max-w-7xl mx-auto space-y-8 sm:space-y-12">
          
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-2.5 px-2 sm:px-0">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-[#e8eee9] text-[#203a2d] text-[10px] sm:text-xs font-black tracking-wider uppercase shadow-xs">
                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-600 animate-ping" />
                <span>Physical Building Telemetry In Motion</span>
              </div>
              <h2 className="font-editorial text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#16231c]">
                Operate Real-World Real Estate with Software Precision
              </h2>
              <p className="text-xs sm:text-sm text-[#6e7972] max-w-xl mx-auto leading-relaxed">
                As you scroll, experience how Staywise autonomously operates, inspects, and maximizes yields on physical building assets.
              </p>
            </div>
          </ScrollReveal>

          {/* Symmetrical Parallax Grid: Left Cards + Center Parallax Building + Right Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center pt-2">
            
            {/* Center Column: The Parallax Architectural Residence Building (Mobile: Appears First) */}
            <div className="lg:col-span-6 relative flex items-center justify-center py-2 sm:py-4 order-1 lg:order-2">
              <div 
                ref={buildingParallaxRef} 
                className="w-full relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[#e3e1d8] will-change-transform transform-gpu"
              >
                <img
                  src="/images/parallax-building-light.jpg"
                  alt="Staywise Managed Architectural Residence"
                  className="w-full h-auto object-cover transform hover:scale-[1.01] transition-transform duration-300"
                />

                {/* Live Telemetry Floating Pill on Building */}
                <div 
                  ref={buildingBadgeRef}
                  className="absolute top-3 sm:top-5 left-3 sm:left-5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/95 border border-[#e3e1d8] text-[10px] sm:text-xs font-bold text-[#16231c] shadow-md flex items-center gap-1.5 sm:gap-2 will-change-transform transform-gpu max-w-[85%] truncate"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="truncate">Sai Krishna PG • 126 Beds Active • 98.4% Occupied</span>
                </div>

                {/* Floating Scan Marker */}
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-5 px-2.5 sm:px-3.5 py-1 rounded-full bg-[#16231c]/90 text-white text-[10px] sm:text-[11px] font-semibold flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="h-3 w-3 text-amber-400 shrink-0" />
                  <span>MoveFlow AI Sealed</span>
                </div>
              </div>
            </div>

            {/* Left Symmetrical Column (Parallax Flank) */}
            <div ref={leftCardsParallaxRef} className="lg:col-span-3 space-y-4 sm:space-y-5 order-2 lg:order-1 will-change-transform transform-gpu">
              {/* CARD 1: Autonomous RentFlow */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm hover:shadow-md transition-shadow duration-200 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                    <Zap className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#16231c]">Autonomous RentFlow</h4>
                    <span className="text-[10px] text-emerald-700 font-extrabold">99.4% On-Time Rate</span>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-[#6e7972] leading-relaxed">
                  Direct UPI Autopay settlement into Axis Escrow accounts with dynamic WhatsApp reminder nudges.
                </p>
              </div>

              {/* CARD 2: Sub-Meter OCR Engine */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm hover:shadow-md transition-shadow duration-200 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shrink-0">
                    <FileText className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#16231c]">Sub-Meter OCR Engine</h4>
                    <span className="text-[10px] text-amber-700 font-extrabold">Automated BESCOM Split</span>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-[#6e7972] leading-relaxed">
                  Photo bill capture automatically calculates tiered slab tariffs and pro-rata common area utilities.
                </p>
              </div>
            </div>

            {/* Right Symmetrical Column (Parallax Flank) */}
            <div ref={rightCardsParallaxRef} className="lg:col-span-3 space-y-4 sm:space-y-5 order-3 lg:order-3 will-change-transform transform-gpu">
              {/* CARD 3: MoveFlow Inspections */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm hover:shadow-md transition-shadow duration-200 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold shrink-0">
                    <ShieldCheck className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#16231c]">MoveFlow Inspections</h4>
                    <span className="text-[10px] text-teal-700 font-extrabold">Zero Deposit Disputes</span>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-[#6e7972] leading-relaxed">
                  Timestamped digital photo checklists at check-in &amp; check-out that protect owner and tenant deposits.
                </p>
              </div>

              {/* CARD 4: Double-Entry Ledger */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm hover:shadow-md transition-shadow duration-200 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold shrink-0">
                    <Landmark className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#16231c]">Double-Entry Ledger</h4>
                    <span className="text-[10px] text-indigo-700 font-extrabold">Audited GST Invoicing</span>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-[#6e7972] leading-relaxed">
                  Real-time balance sheets, statutory TDS calculations, and 1-click auditor export packages.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 6. EVERYTHING INSIDE (STAYWISE OPERATING SYSTEM GRID) */}
      {/* ---------------------------------------------------- */}
      <section 
        id="everything-inside"
        ref={dashboardSectionRef}
        className="py-14 sm:py-20 px-4 sm:px-6 lg:px-12 bg-white space-y-10 overflow-hidden"
      >
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-2.5 px-2 sm:px-0">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#203a2d]">
              Everything Inside Staywise
            </span>
            <h2 className="font-editorial text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#16231c]">
              One Unified Dashboard. Every Rental Tool You Need.
            </h2>
            <p className="text-xs sm:text-sm text-[#6e7972] max-w-xl mx-auto leading-relaxed">
              No fragmented tools. Staywise natively unifies rent collection, bed-level inventory, WhatsApp AI, leads CRM, and digital agreements.
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Feature Tabs */}
        <ScrollReveal delay={40}>
          <div className="flex items-center justify-center w-full px-1">
            <div className="p-1 rounded-2xl sm:rounded-full bg-[#f4f3ef] border border-[#e3e1d8] flex flex-wrap sm:flex-nowrap gap-1 max-w-full overflow-x-auto justify-center">
              <button
                type="button"
                onClick={() => setActiveTab('RENT')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-100 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'RENT'
                    ? 'bg-[#16231c] text-white shadow-xs'
                    : 'text-[#6e7972] hover:text-[#19251f]'
                }`}
              >
                <Zap className="h-3.5 w-3.5" />
                <span>Rent Collection</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('BEDS')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-100 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'BEDS'
                    ? 'bg-[#16231c] text-white shadow-xs'
                    : 'text-[#6e7972] hover:text-[#19251f]'
                }`}
              >
                <Home className="h-3.5 w-3.5" />
                <span>Bed-Level Inventory</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('WHATSAPP')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-100 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'WHATSAPP'
                    ? 'bg-[#16231c] text-white shadow-xs'
                    : 'text-[#6e7972] hover:text-[#19251f]'
                }`}
              >
                <Bot className="h-3.5 w-3.5" />
                <span>WhatsApp AI</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('OCR')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-100 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'OCR'
                    ? 'bg-[#16231c] text-white shadow-xs'
                    : 'text-[#6e7972] hover:text-[#19251f]'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Electricity OCR</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('CRM')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-100 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'CRM'
                    ? 'bg-[#16231c] text-white shadow-xs'
                    : 'text-[#6e7972] hover:text-[#19251f]'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                <span>Leads CRM</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('MOVEFLOW')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-100 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'MOVEFLOW'
                    ? 'bg-[#16231c] text-white shadow-xs'
                    : 'text-[#6e7972] hover:text-[#19251f]'
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>KYC &amp; Agreements</span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Live Interactive Simulator Canvas */}
        <ScrollReveal delay={70}>
          <div 
            ref={dashboardCardRef}
            className="max-w-5xl mx-auto rounded-3xl bg-[#f8f7f4] border border-[#e3e1d8] p-5 sm:p-8 shadow-xs will-change-transform transform-gpu"
          >
            {activeTab === 'RENT' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-[#203a2d] bg-[#e8eee9] px-3 py-1 rounded-full">
                    Rent Collection on Autopilot
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#16231c]">
                    Auto reminders, UPI links &amp; structured bank payouts.
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6e7972] leading-relaxed">
                    Say goodbye to manual phone calls and tracking bank statements. Staywise automatically sends WhatsApp reminders before and on the due date. Tenants pay in 1 tap via UPI or Card, and your ledger reconciles instantly.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#203a2d]" />
                      <span><b>WhatsApp Auto Nudge:</b> T-3, Due Date, and T+3 with dynamic UPI QR code.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#203a2d]" />
                      <span><b>Axis Escrow Instant Settlement:</b> 100% statutory security with direct bank sweep.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#203a2d]" />
                      <span><b>One-Tap PDF Receipts:</b> Automatically shared with tenants upon successful payment.</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => handleOpenTrial('starter')}
                      className="px-6 py-2.5 rounded-full bg-[#16231c] hover:bg-[#203a2d] text-white font-bold text-xs transition duration-150 cursor-pointer"
                    >
                      Start Free Trial →
                    </button>
                  </div>
                </div>

                {/* Interactive Simulated UI */}
                <div className="p-5 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm space-y-3.5 text-xs font-mono">
                  <div className="flex justify-between items-center pb-2 border-b border-[#eeece5]">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-bold text-[#16231c]">Rent Collection · Day 3 Status</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">99.4% On-Time</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-[#faf9f6] border border-[#e3e1d8] flex justify-between items-center">
                      <div>
                        <div className="font-bold text-[#16231c]">Priya Sharma (Room 204)</div>
                        <div className="text-[10px] text-[#6e7972]">AutoPay Scheduled · ₹14,500</div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Paid via UPI</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#faf9f6] border border-[#e3e1d8] flex justify-between items-center">
                      <div>
                        <div className="font-bold text-[#16231c]">Arjun Mehta (Bed 102-B)</div>
                        <div className="text-[10px] text-[#6e7972]">WhatsApp Reminder Sent · ₹8,500</div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Link Clicked</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#faf9f6] border border-[#e3e1d8] flex justify-between items-center">
                      <div>
                        <div className="font-bold text-[#16231c]">Karan Singh (Room 301)</div>
                        <div className="text-[10px] text-[#6e7972]">Auto AI Call Reminder · ₹12,000</div>
                      </div>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">Promised 5 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'BEDS' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-[#203a2d] bg-[#e8eee9] px-3 py-1 rounded-full">
                    Bed-Level Property &amp; Inventory Management
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#16231c]">
                    Track every bed, room, and flat across all buildings.
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6e7972] leading-relaxed">
                    Granular color-coded visual occupancy. Whether you operate a 120-bed PG in Bangalore or multiple apartment duplexes in Mumbai, see occupied, vacant, reserved, and under-notice beds in real time.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#203a2d]" />
                      <span><b>Bed-Level Allocation:</b> Single, double, and triple sharing bed tracking.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#203a2d]" />
                      <span><b>Notice Period Countdown:</b> Automatic vacancy warning 30 days prior.</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => handleOpenTrial('growth_pro')}
                      className="px-6 py-2.5 rounded-full bg-[#16231c] hover:bg-[#203a2d] text-white font-bold text-xs transition duration-150 cursor-pointer"
                    >
                      Start Free Trial →
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm space-y-3.5 text-xs font-mono">
                  <div className="flex justify-between items-center pb-2 border-b border-[#eeece5]">
                    <span className="font-bold text-[#16231c]">HSR Layout Tech PG (126 Beds)</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">98% Full</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {[
                      { bed: "101-A", status: "Occupied", bg: "bg-emerald-100 text-emerald-800" },
                      { bed: "101-B", status: "Occupied", bg: "bg-emerald-100 text-emerald-800" },
                      { bed: "102-A", status: "Vacant", bg: "bg-rose-100 text-rose-800" },
                      { bed: "102-B", status: "Notice", bg: "bg-amber-100 text-amber-800" },
                      { bed: "201-A", status: "Occupied", bg: "bg-emerald-100 text-emerald-800" },
                      { bed: "201-B", status: "Occupied", bg: "bg-emerald-100 text-emerald-800" },
                      { bed: "202-A", status: "Occupied", bg: "bg-emerald-100 text-emerald-800" },
                      { bed: "202-B", status: "Occupied", bg: "bg-emerald-100 text-emerald-800" },
                    ].map((b, i) => (
                      <div key={i} className={`p-2 rounded-xl text-center border border-[#e3e1d8] ${b.bg}`}>
                        <div className="font-bold text-[11px]">{b.bed}</div>
                        <div className="text-[9px] uppercase font-extrabold">{b.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'WHATSAPP' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-[#203a2d] bg-[#e8eee9] px-3 py-1 rounded-full">
                    WhatsApp AI Concierge
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#16231c]">
                    Run your entire rental business from WhatsApp.
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6e7972] leading-relaxed">
                    No laptop needed. Simply text Staywise AI in English: <i>&ldquo;What is today's total collection?&rdquo;</i> or <i>&ldquo;Send rent reminder to room 102&rdquo;</i>. The AI executes commands instantly.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#203a2d]" />
                      <span><b>Instant Queries:</b> Ask occupancy, pending balance, or tenant phone numbers.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#203a2d]" />
                      <span><b>Smart Nudges:</b> <i>&ldquo;₹16,000 pending from 2 tenants. Want me to nudge them?&rdquo;</i></span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => handleOpenTrial('growth_pro')}
                      className="px-6 py-2.5 rounded-full bg-[#16231c] hover:bg-[#203a2d] text-white font-bold text-xs transition duration-150 cursor-pointer"
                    >
                      Connect WhatsApp AI →
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#eef3ee] border border-[#cbd8ce] shadow-sm space-y-3 text-xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#cbd8ce]">
                    <Bot className="h-4 w-4 text-emerald-800" />
                    <span className="font-bold text-[#16231c]">Staywise WhatsApp Assistant</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-2xl rounded-tr-none bg-white text-[#16231c] max-w-[85%] ml-auto shadow-xs">
                      What is today's rent collection? Are there any pending dues?
                    </div>
                    <div className="p-2.5 rounded-2xl rounded-tl-none bg-[#dcf8c6] text-[#16231c] max-w-[85%] shadow-xs">
                      <b>Good evening Vikram!</b><br />
                      • Collected today: ₹1,42,000 (8 tenants)<br />
                      • Pending: ₹16,000 (2 tenants)<br />
                      Would you like me to send an automated UPI nudge to them now?
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'OCR' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-[#203a2d] bg-[#e8eee9] px-3 py-1 rounded-full">
                    Discom Sub-Meter Electricity OCR
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#16231c]">
                    Upload electricity bill. Auto-split without disputes.
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6e7972] leading-relaxed">
                    Snap a photo of your DISCOM bill (Bescom, KSEB, MSEDCL, TPDDL). The AI extracts fixed charges, slab tariffs, and sub-meter consumption, automatically sharing itemized splits on tenant WhatsApp accounts.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => handleOpenTrial('growth_pro')}
                      className="px-6 py-2.5 rounded-full bg-[#16231c] hover:bg-[#203a2d] text-white font-bold text-xs transition duration-150 cursor-pointer"
                    >
                      Start Free Trial →
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm space-y-3 text-xs font-mono">
                  <div className="flex justify-between items-center pb-2 border-b border-[#eeece5]">
                    <span className="font-bold text-[#16231c]">BESCOM LT-2 Bill OCR</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">OCR Verified</span>
                  </div>
                  <div className="space-y-1.5 text-[#6e7972]">
                    <div className="flex justify-between">
                      <span>Total Discom Bill:</span>
                      <span className="font-bold text-[#16231c]">₹8,450 (1,120 units)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Common Area Split (4 flats):</span>
                      <span className="font-bold text-[#16231c]">₹420 / flat</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Room 102 Sub-Meter (240 units):</span>
                      <span className="font-bold text-emerald-700">₹1,920 Added to Rent</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'CRM' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-[#203a2d] bg-[#e8eee9] px-3 py-1 rounded-full">
                    Omnichannel Leads CRM &amp; Visit Scheduling
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#16231c]">
                    99acres, MagicBricks &amp; NoBroker in one unified inbox.
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6e7972] leading-relaxed">
                    Never lose a lead again. Capture enquiries from every portal, send instant WhatsApp greetings with location pins, and schedule property visits with automatic SMS reminders to prevent no-shows.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => handleOpenTrial('growth_pro')}
                      className="px-6 py-2.5 rounded-full bg-[#16231c] hover:bg-[#203a2d] text-white font-bold text-xs transition duration-150 cursor-pointer"
                    >
                      Start Free Trial →
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm space-y-3 text-xs font-mono">
                  <div className="flex justify-between items-center pb-2 border-b border-[#eeece5]">
                    <span className="font-bold text-[#16231c]">Unified Inquiries Pipeline</span>
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">12 New Today</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 rounded-xl bg-[#faf9f6] border border-[#e3e1d8] flex justify-between items-center">
                      <div>
                        <div className="font-bold text-[#16231c]">Rahul Verma · 99acres</div>
                        <div className="text-[10px] text-[#6e7972]">2-Sharing • Move-in Oct 10</div>
                      </div>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">Visit Scheduled</span>
                    </div>

                    <div className="p-2 rounded-xl bg-[#faf9f6] border border-[#e3e1d8] flex justify-between items-center">
                      <div>
                        <div className="font-bold text-[#16231c]">Anjali Iyer · MagicBricks</div>
                        <div className="text-[10px] text-[#6e7972]">1 BHK Independent flat</div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">WhatsApp Pin Sent</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'MOVEFLOW' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-[#203a2d] bg-[#e8eee9] px-3 py-1 rounded-full">
                    MoveFlow Digital KYC &amp; Agreements
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#16231c]">
                    Real-time Aadhaar KYC, e-stamps &amp; zero dispute deposits.
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6e7972] leading-relaxed">
                    Paperless onboarding in 5 minutes. Verify tenant identity via Aadhaar, generate legally valid e-stamped rental agreements with e-signatures, and seal check-in photo checklists to eliminate deposit fights.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => handleOpenTrial('growth_pro')}
                      className="px-6 py-2.5 rounded-full bg-[#16231c] hover:bg-[#203a2d] text-white font-bold text-xs transition duration-150 cursor-pointer"
                    >
                      Start Free Trial →
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm space-y-3 text-xs font-mono">
                  <div className="flex justify-between items-center pb-2 border-b border-[#eeece5]">
                    <span className="font-bold text-[#16231c]">Tenant Onboarding Vault</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">100% Paperless</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#faf9f6] border border-[#e3e1d8]">
                      <span>Aadhaar Identity Verification</span>
                      <span className="text-[10px] font-bold text-emerald-700">Verified ✓</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#faf9f6] border border-[#e3e1d8]">
                      <span>E-Stamp Agreement (Karnataka)</span>
                      <span className="text-[10px] font-bold text-emerald-700">E-Signed ✓</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#faf9f6] border border-[#e3e1d8]">
                      <span>MoveFlow Photo Checklist (14 photos)</span>
                      <span className="text-[10px] font-bold text-emerald-700">Timestamp Sealed ✓</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 7. HOW IT WORKS: READY IN 15 MINUTES                 */}
      {/* ---------------------------------------------------- */}
      <section 
        id="how-it-works"
        className="py-14 sm:py-20 px-4 sm:px-6 lg:px-12 bg-[#faf9f6] border-y border-[#eeece5] space-y-10 overflow-hidden"
      >
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto space-y-2 px-2 sm:px-0">
            <span className="text-[10px] sm:text-xs font-black uppercase text-[#203a2d]">
              Ready in 15 Minutes
            </span>
            <h2 className="font-editorial text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#16231c]">
              How Staywise Runs Your Property on Autopilot
            </h2>
            <p className="text-xs sm:text-sm text-[#6e7972] max-w-xl mx-auto leading-relaxed">
              No complicated onboarding, hardware installations, or training seminars needed.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {/* STEP 1 */}
          <div className="p-6 rounded-3xl bg-white border border-[#e3e1d8] space-y-4 shadow-xs">
            <div className="h-10 w-10 rounded-2xl bg-[#e8eee9] text-[#203a2d] flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-bold text-base text-[#16231c]">Sign up free in 2 minutes</h3>
            <p className="text-xs text-[#6e7972] leading-relaxed">
              Create your account with your phone number and email. No setup fees, zero hidden contracts, and ₹0 due today.
            </p>
          </div>

          {/* STEP 2 */}
          <div className="p-6 rounded-3xl bg-white border border-[#e3e1d8] space-y-4 shadow-xs">
            <div className="h-10 w-10 rounded-2xl bg-[#e8eee9] text-[#203a2d] flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-bold text-base text-[#16231c]">Add properties &amp; import tenants</h3>
            <p className="text-xs text-[#6e7972] leading-relaxed">
              Configure your buildings, floors, rooms, and beds. Import your existing tenants with 1-click Excel or WhatsApp contact sync.
            </p>
          </div>

          {/* STEP 3 */}
          <div className="p-6 rounded-3xl bg-white border border-[#e3e1d8] space-y-4 shadow-xs">
            <div className="h-10 w-10 rounded-2xl bg-[#e8eee9] text-[#203a2d] flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-bold text-base text-[#16231c]">Run on complete autopilot</h3>
            <p className="text-xs text-[#6e7972] leading-relaxed">
              Rent collection, UPI Autopay, WhatsApp reminders, portal leads, and caretaker tasks automatically flow from Day 1.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 8. SCALE & REAL LANDLORD TESTIMONIALS                */}
      {/* ---------------------------------------------------- */}
      <section 
        id="about" 
        ref={statsSectionRef} 
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12 bg-white space-y-8 sm:space-y-10 overflow-hidden"
      >
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto space-y-2 px-2 sm:px-0">
            <span className="text-[10px] sm:text-xs font-black uppercase text-[#203a2d]">
              Institutional Scale &amp; Reliability
            </span>
            <h2 className="font-editorial text-2xl xs:text-3xl sm:text-4xl font-semibold text-[#16231c]">
              Trusted by 900+ Owners Across India
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={50}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 max-w-5xl mx-auto text-center items-center">
            <div 
              ref={statsBox1Ref} 
              className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#f8f7f4] border border-[#e3e1d8] space-y-0.5 sm:space-y-1 will-change-transform transform-gpu shadow-xs"
            >
              <div className="font-editorial text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#203a2d]">₹142Cr+</div>
              <div className="text-[10px] sm:text-xs text-[#6e7972] font-semibold mt-1">Gross Assets Under Management</div>
            </div>

            <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#f8f7f4] border border-[#e3e1d8] space-y-0.5 sm:space-y-1 shadow-xs">
              <div className="font-editorial text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#16231c]">18,400+</div>
              <div className="text-[10px] sm:text-xs text-[#6e7972] font-semibold mt-1">Managed Units &amp; Beds</div>
            </div>

            <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#f8f7f4] border border-[#e3e1d8] space-y-0.5 sm:space-y-1 shadow-xs">
              <div className="font-editorial text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold text-emerald-700">99.4%</div>
              <div className="text-[10px] sm:text-xs text-[#6e7972] font-semibold mt-1">On-Time Rent Collection</div>
            </div>

            <div 
              ref={statsBox4Ref} 
              className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#f8f7f4] border border-[#e3e1d8] space-y-0.5 sm:space-y-1 will-change-transform transform-gpu shadow-xs"
            >
              <div className="font-editorial text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#16231c]">100%</div>
              <div className="text-[10px] sm:text-xs text-[#6e7972] font-semibold mt-1">Axis Bank Escrow Settled</div>
            </div>
          </div>
        </ScrollReveal>

        {/* Real Indian Landlord Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto pt-4">
          <div className="p-5 rounded-2xl bg-[#faf9f6] border border-[#e3e1d8] space-y-3 shadow-xs">
            <div className="flex text-amber-500 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
              ))}
            </div>
            <p className="text-xs text-[#16231c] italic leading-relaxed">
              &ldquo;Rent reminders are dispatched automatically. I no longer have to make awkward collection calls. A complete game-changer for our 120 beds in Bangalore.&rdquo;
            </p>
            <div className="text-[11px]">
              <div className="font-bold text-[#16231c]">Sai Krishna PG</div>
              <div className="text-[#6e7972]">Bengaluru</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#faf9f6] border border-[#e3e1d8] space-y-3 shadow-xs">
            <div className="flex text-amber-500 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
              ))}
            </div>
            <p className="text-xs text-[#16231c] italic leading-relaxed">
              &ldquo;My caretaker updates everything directly from his mobile phone. I reside in Mumbai while managing properties in Bangalore with complete visibility and peace of mind.&rdquo;
            </p>
            <div className="text-[11px]">
              <div className="font-bold text-[#16231c]">Singhania Asset Holdings</div>
              <div className="text-[#6e7972]">Mumbai / Bangalore</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#faf9f6] border border-[#e3e1d8] space-y-3 shadow-xs">
            <div className="flex text-amber-500 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
              ))}
            </div>
            <p className="text-xs text-[#16231c] italic leading-relaxed">
              &ldquo;Electricity billing disputes are completely eliminated. Staywise reads the sub-meters via OCR and divides utility slabs automatically. Both tenants and management are delighted.&rdquo;
            </p>
            <div className="text-[11px]">
              <div className="font-bold text-[#16231c]">Green View Co-Living</div>
              <div className="text-[#6e7972]">Hyderabad</div>
            </div>
          </div>
        </div>

      </section>

      {/* ---------------------------------------------------- */}
      {/* 9. TRANSPARENT PRICING & 7-DAY FREE TRIAL            */}
      {/* ---------------------------------------------------- */}
      <section 
        id="pricing" 
        ref={pricingSectionRef} 
        className="py-10 sm:py-16 lg:py-20 px-3 xs:px-4 sm:px-6 lg:px-12 bg-[#faf9f6] border-t border-[#eeece5] space-y-6 sm:space-y-10 overflow-hidden"
      >
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3 px-2 sm:px-0">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 rounded-full bg-[#e8eee9] text-[#203a2d] text-[10px] sm:text-xs font-bold">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-700" />
              <span>7-Day Risk-Free Trial On Every Plan</span>
            </div>

            <h2 className="font-editorial text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#16231c] tracking-tight">
              Transparent Plans. ₹0 Due Today.
            </h2>

            <p className="text-xs sm:text-sm text-[#6e7972] max-w-xl mx-auto leading-relaxed px-1">
              Choose your portfolio tier. Enjoy full access for 7 days free. Connect card or bank account for autopay after 7 days, and cancel anytime before day 7 to pay ₹0.
            </p>

            {/* Monthly / Annual Toggle - Fully Responsive */}
            <div className="pt-2 flex items-center justify-center w-full px-1">
              <div className="inline-flex items-center p-1 rounded-full bg-white border border-[#e3e1d8] shadow-xs max-w-full">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-2.5 xs:px-3.5 sm:px-4.5 py-1.5 rounded-full text-[10px] xs:text-[11px] sm:text-xs font-bold transition-all duration-100 cursor-pointer whitespace-nowrap ${
                    billingCycle === 'monthly'
                      ? 'bg-[#16231c] text-white shadow-xs'
                      : 'text-[#6e7972] hover:text-[#19251f]'
                  }`}
                >
                  <span>Monthly <span className="hidden xs:inline">Flexible</span></span>
                </button>

                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  className={`px-2.5 xs:px-3.5 sm:px-4.5 py-1.5 rounded-full text-[10px] xs:text-[11px] sm:text-xs font-bold transition-all duration-100 flex items-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap ${
                    billingCycle === 'annual'
                      ? 'bg-[#16231c] text-white shadow-xs'
                      : 'text-[#6e7972] hover:text-[#19251f]'
                  }`}
                >
                  <span>Annual <span className="hidden sm:inline">Commitment</span></span>
                  <span className="text-[8px] xs:text-[9px] sm:text-[10px] px-1 xs:px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold whitespace-nowrap">
                    Save 17%
                  </span>
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Responsive Pricing Cards Grid: 1 col on mobile, 2 col on tablet (with featured spanning or centered), 3 col on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
          
          {/* TIER 1: STARTER */}
          <ScrollReveal delay={40} className="flex w-full">
            <div className="w-full rounded-2xl sm:rounded-3xl bg-white border border-[#e3e1d8] p-4.5 xs:p-5 sm:p-7 flex flex-col justify-between space-y-4 sm:space-y-5 shadow-xs hover:shadow-md transition-shadow duration-150">
              <div className="space-y-3.5 sm:space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#f4f3ef] text-[#6e7972]">
                    1 Property
                  </span>
                  <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#16231c] mt-2">Starter (1 Property)</h3>
                  <p className="text-xs text-[#6e7972] mt-0.5 leading-relaxed">
                    Ideal for single-building landlords &amp; independent assets.
                  </p>
                </div>

                <div className="pt-2 pb-3.5 sm:pb-4 border-b border-[#eeece5]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#16231c] tracking-tight">
                      ₹{billingCycle === 'annual' ? (599).toLocaleString('en-IN') : (59).toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#6e7972]">/{billingCycle === 'annual' ? 'year' : 'month'}</span>
                  </div>
                  <div className="text-[11px] text-[#6e7972] mt-0.5">
                    {billingCycle === 'annual' ? '₹599/year (Equivalent to ~₹50/month)' : '₹59 billed monthly'}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#4d5a52]">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#203a2d] shrink-0" />
                    <span><b>1 Property (PG, Flat, House, or Commercial)</b></span>
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
                  className="w-full py-2.5 sm:py-3 rounded-full bg-[#f4f3ef] hover:bg-[#16231c] hover:text-white text-[#16231c] font-bold text-xs transition-colors duration-150 cursor-pointer shadow-xs"
                >
                  Start 7-Day Free Trial
                </button>
                <div className="text-center text-[10px] text-[#6e7972] leading-tight">
                  ₹0 due today • Autopay connected • Cancel before 7 days
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* TIER 2: GROWTH PRO (MOST POPULAR) */}
          <ScrollReveal delay={80} className="flex w-full md:col-span-2 lg:col-span-1">
            <div 
              ref={pricingFeaturedCardRef}
              className="w-full rounded-2xl sm:rounded-3xl bg-white border-2 border-[#203a2d] p-4.5 xs:p-5 sm:p-7 flex flex-col justify-between space-y-4 sm:space-y-5 shadow-lg relative mt-3 sm:mt-0 transform lg:-translate-y-2 will-change-transform transform-gpu"
            >
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-[#203a2d] text-white text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-xs whitespace-nowrap">
                Most Popular
              </span>

              <div className="space-y-3.5 sm:space-y-4 pt-1">
                <div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#e8eee9] text-[#203a2d]">
                    10 Properties
                  </span>
                  <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#16231c] mt-2">Growth Pro (10 Properties)</h3>
                  <p className="text-xs text-[#6e7972] mt-0.5 leading-relaxed">
                    Unified multi-asset system with sub-meter OCR &amp; MoveFlow.
                  </p>
                </div>

                <div className="pt-2 pb-3.5 sm:pb-4 border-b border-[#eeece5]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-[#16231c] tracking-tight">
                      ₹{billingCycle === 'annual' ? (1499).toLocaleString('en-IN') : (149).toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#6e7972]">/{billingCycle === 'annual' ? 'year' : 'month'}</span>
                  </div>
                  <div className="text-[11px] text-[#203a2d] font-semibold mt-0.5">
                    {billingCycle === 'annual' ? '₹1,499/year (Equivalent to ~₹125/month)' : '₹149 billed monthly'}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#16231c]">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#203a2d] shrink-0" />
                    <span><b>Up to 10 Properties &amp; PG Co-Living Buildings</b></span>
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
                  className="w-full py-2.5 sm:py-3.5 rounded-full bg-[#203a2d] hover:bg-[#172b21] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#203a2d]/20 transition duration-150 cursor-pointer"
                >
                  Start 7-Day Free Trial (₹0 Today)
                </button>
                <div className="text-center text-[10px] text-[#203a2d] font-semibold leading-tight">
                  Connect Card or Bank Autopay • Cancel before 7 days in 1 click
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* TIER 3: ENTERPRISE */}
          <ScrollReveal delay={110} className="flex w-full md:col-span-2 lg:col-span-1">
            <div className="w-full rounded-2xl sm:rounded-3xl bg-white border border-[#e3e1d8] p-4.5 xs:p-5 sm:p-7 flex flex-col justify-between space-y-4 sm:space-y-5 shadow-xs hover:shadow-md transition-shadow duration-150">
              <div className="space-y-3.5 sm:space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#f4f3ef] text-[#6e7972]">
                    Unlimited Properties
                  </span>
                  <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#16231c] mt-2">Enterprise (Unlimited Properties)</h3>
                  <p className="text-xs text-[#6e7972] mt-0.5 leading-relaxed">
                    For family offices, LLPs &amp; commercial campuses.
                  </p>
                </div>

                <div className="pt-2 pb-3.5 sm:pb-4 border-b border-[#eeece5]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#16231c] tracking-tight">
                      ₹{billingCycle === 'annual' ? (2999).toLocaleString('en-IN') : (299).toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#6e7972]">/{billingCycle === 'annual' ? 'year' : 'month'}</span>
                  </div>
                  <div className="text-[11px] text-[#6e7972] mt-0.5">
                    {billingCycle === 'annual' ? '₹2,999/year (Equivalent to ~₹250/month)' : '₹299 billed monthly'}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#4d5a52]">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#203a2d] shrink-0" />
                    <span><b>Unlimited Properties, Portfolios &amp; LLPs</b></span>
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
                  className="w-full py-2.5 sm:py-3 rounded-full bg-[#f4f3ef] hover:bg-[#16231c] hover:text-white text-[#16231c] font-bold text-xs transition-colors duration-150 cursor-pointer shadow-xs"
                >
                  Start 7-Day Free Trial
                </button>
                <div className="text-center text-[10px] text-[#6e7972] leading-tight">
                  ₹0 due today • Autopay connected • Cancel before 7 days
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>

        {/* Trial Guarantee Callout - Responsive */}
        <ScrollReveal delay={70}>
          <div 
            ref={pricingGuaranteeRef}
            className="max-w-4xl mx-auto p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#e8eee9] border border-[#cbd8ce] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 will-change-transform transform-gpu shadow-xs"
          >
            <div className="flex items-start sm:items-center gap-3 sm:gap-3.5">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#203a2d] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
                <ShieldCheck className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </div>
              <div className="text-[11px] sm:text-xs text-[#203a2d] leading-relaxed">
                <span className="font-extrabold">How does the 7-day trial autopay work? </span>
                <span className="text-[#3b5949]">
                  ₹0.00 is charged today. You connect your card or bank account, but payment is only processed on Day 7 if you keep the plan. Cancel anytime before Day 7 from Settings with 1 click to pay nothing.
                </span>
              </div>
            </div>

            <button
              onClick={() => handleOpenTrial('growth_pro')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#203a2d] hover:bg-[#172b21] text-white font-bold text-xs shrink-0 transition-colors shadow-xs cursor-pointer text-center"
            >
              Start Free Trial →
            </button>
          </div>
        </ScrollReveal>

      </section>

      {/* ---------------------------------------------------- */}
      {/* 10. FREQUENTLY ASKED QUESTIONS (#faq)                */}
      {/* ---------------------------------------------------- */}
      <section 
        id="faq" 
        ref={faqSectionRef}
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-12 bg-white space-y-6 sm:space-y-8 overflow-hidden"
      >
        
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto space-y-2 px-2 sm:px-0">
            <span className="text-[10px] sm:text-xs font-black uppercase text-[#203a2d]">
              Questions &amp; Answers
            </span>
            <h2 className="font-editorial text-2xl xs:text-3xl sm:text-4xl font-semibold text-[#16231c]">
              Frequently Asked Questions
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={70}>
          <div 
            ref={faqContainerRef}
            className="max-w-3xl mx-auto space-y-2.5 sm:space-y-3 will-change-transform transform-gpu"
          >
            {[
              {
                q: "Is Staywise really free to try, and will I be charged today?",
                a: "Absolutely ₹0.00 is charged today. You get full access to all features for 7 days. When you connect your card or bank mandate, payment is only processed on Day 7 if you choose to keep your subscription. You can cancel with 1 click before Day 7 to pay nothing."
              },
              {
                q: "How does automated rent collection on WhatsApp work?",
                a: "Staywise automatically sends polite WhatsApp reminders to tenants at T-3 days, on the Due Date, and T+3 days with a secure dynamic UPI QR code link. When a tenant pays via UPI (Google Pay, PhonePe, Paytm) or card, their payment status updates instantly and the money settles straight into your Axis Bank Escrow account."
              },
              {
                q: "What types of rental properties can I manage with Staywise?",
                a: "Staywise natively supports Paying Guest (PG) accommodations, hostels, co-living campuses, multi-unit residential flats, commercial retail hubs, and luxury hospitality villas. You can track occupancy down to the bed, room, floor, and building level."
              },
              {
                q: "How does the Sub-Meter Electricity OCR splitting work?",
                a: "You simply take a photo or upload a PDF of your DISCOM bill (e.g. BESCOM, KSEB, MSEDCL, TPDDL). The Staywise OCR engine extracts the fixed charges and slab tariffs, divides pro-rata common area electricity, and calculates each room's individual sub-meter bill without tenant arguments."
              },
              {
                q: "How do tenant KYC and digital rental agreements work?",
                a: "Staywise provides 100% paperless onboarding. You can verify Aadhaar identity in real-time, generate state-compliant e-stamped rental agreements with digital e-signatures, and store timestamped MoveFlow photo checklists at move-in."
              },
              {
                q: "Can I manage multiple properties and staff members from different cities?",
                a: "Yes! Staywise is built for multi-property operators. You can assign role-based access to caretakers, property managers, and accountants per building with granular permissions and activity logs, letting you manage properties remotely from your phone."
              }
            ].map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-xl sm:rounded-2xl bg-[#faf9f6] border border-[#e3e1d8] overflow-hidden transition-colors duration-100"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-3.5 sm:p-5 text-left flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-[#16231c] hover:text-[#203a2d] transition-colors cursor-pointer"
                  >
                    <span className="leading-snug">{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-[#6e7972] shrink-0 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-3.5 sm:px-5 pb-3.5 sm:pb-4 pt-1 text-[11px] sm:text-xs text-[#6e7972] leading-relaxed border-t border-[#eeece5]">
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
      {/* 11. PROPERTY RESOURCES DIRECTORY (BY CITY & COMPARE) */}
      {/* ---------------------------------------------------- */}
      <section 
        id="resources"
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-12 bg-[#faf9f6] border-t border-[#eeece5] space-y-8 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] sm:text-xs font-black uppercase text-[#203a2d]">
              Explore Staywise Hub
            </span>
            <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#16231c]">
              Property Management Resources by City &amp; Comparisons
            </h3>
            <p className="text-xs text-[#6e7972]">
              Guides, comparisons, and city pages for PG, hostel, co-living, and rental flat owners across India.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e3e1d8] bg-white divide-y divide-[#eeece5] overflow-hidden text-xs">
            {/* By City */}
            <div className="p-5 sm:p-6 space-y-3">
              <h4 className="font-bold text-sm text-[#16231c]">Operations By City</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[#6e7972]">
                <span className="hover:text-[#203a2d] transition-colors cursor-pointer">Bangalore Property Management</span>
                <span className="hover:text-[#203a2d] transition-colors cursor-pointer">Hyderabad PG Operations</span>
                <span className="hover:text-[#203a2d] transition-colors cursor-pointer">Delhi NCR Hostel Software</span>
                <span className="hover:text-[#203a2d] transition-colors cursor-pointer">Pune Rental Management</span>
                <span className="hover:text-[#203a2d] transition-colors cursor-pointer">Chennai Co-Living Systems</span>
                <span className="hover:text-[#203a2d] transition-colors cursor-pointer">Gurgaon High-Street Flats</span>
                <span className="hover:text-[#203a2d] transition-colors cursor-pointer">Noida Tech Park Rentals</span>
                <span className="hover:text-[#203a2d] transition-colors cursor-pointer">Mumbai Luxury Estates</span>
              </div>
            </div>

            {/* Comparisons & Alternatives */}
            <div className="p-5 sm:p-6 space-y-3">
              <h4 className="font-bold text-sm text-[#16231c]">Comparisons &amp; Modern Upgrades</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[#6e7972]">
                <span className="hover:text-[#203a2d] transition-colors cursor-pointer">Staywise vs Google Sheets</span>
                <span className="hover:text-[#203a2d] transition-colors cursor-pointer">Staywise vs Manual WhatsApp</span>
                <span className="hover:text-[#203a2d] transition-colors cursor-pointer">Staywise vs Pen &amp; Paper</span>
                <span className="hover:text-[#203a2d] transition-colors cursor-pointer">Staywise vs Excel Workbooks</span>
                <span className="hover:text-[#203a2d] transition-colors cursor-pointer">Staywise vs Tally Accounting</span>
                <span className="hover:text-[#203a2d] transition-colors cursor-pointer">Staywise vs Crib / RentOk</span>
                <span className="hover:text-[#203a2d] transition-colors cursor-pointer">Staywise vs Generic CRMs</span>
                <span className="hover:text-[#203a2d] transition-colors cursor-pointer">MoveFlow vs Paper Checklists</span>
              </div>
            </div>

            {/* Core Integrations */}
            <div className="p-5 sm:p-6 space-y-3">
              <h4 className="font-bold text-sm text-[#16231c]">Integrations &amp; Portals</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[#6e7972]">
                <span className="hover:text-[#203a2d] transition-colors cursor-pointer">WhatsApp Business Cloud API</span>
                <span className="hover:text-[#203a2d] transition-colors cursor-pointer">Axis Bank Escrow Settlement</span>
                <span className="hover:text-[#203a2d] transition-colors cursor-pointer">UPI Recurring AutoPay Mandates</span>
                <span className="hover:text-[#203a2d] transition-colors cursor-pointer">RBI e-NACH NetBanking</span>
                <span className="hover:text-[#203a2d] transition-colors cursor-pointer">99acres Leads Sync</span>
                <span className="hover:text-[#203a2d] transition-colors cursor-pointer">MagicBricks Inquiries</span>
                <span className="hover:text-[#203a2d] transition-colors cursor-pointer">NoBroker Direct Leads</span>
                <span className="hover:text-[#203a2d] transition-colors cursor-pointer">Bescom / KSEB Electricity OCR</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 12. CLEAN MINIMALIST FOOTER                          */}
      {/* ---------------------------------------------------- */}
      <footer className="bg-[#16231c] text-white/80 py-10 sm:py-12 px-4 sm:px-6 lg:px-12 text-xs relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white text-[#16231c] flex items-center justify-center font-bold text-xs shrink-0">
                SW
              </div>
              <span className="font-extrabold text-white text-sm tracking-tight">STAYWISE</span>
            </div>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="text-[10px] sm:text-[11px] text-white/60">The Operating System for Rental Businesses in India</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-6 text-[11px] text-white/70">
            <a 
              href="#overview" 
              onClick={(e) => handleNavClick(e, '#overview')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </a>
            <a 
              href="#pain-points" 
              onClick={(e) => handleNavClick(e, '#pain-points')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Where Owners Lose Time
            </a>
            <a 
              href="#interactive-building" 
              onClick={(e) => handleNavClick(e, '#interactive-building')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Architecture
            </a>
            <a 
              href="#everything-inside" 
              onClick={(e) => handleNavClick(e, '#everything-inside')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Features
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => handleNavClick(e, '#pricing')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Pricing
            </a>
            <a 
              href="/login" 
              onClick={handleSignInClick}
              className="hover:text-white transition-colors flex items-center gap-1 text-emerald-300 font-semibold cursor-pointer"
            >
              <span>Member Sign in</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>

          <div className="text-[10px] sm:text-[11px] text-white/50">
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
