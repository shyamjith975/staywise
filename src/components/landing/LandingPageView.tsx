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
    <div className="min-h-screen bg-[#F7F8F6] text-[#263238] selection:bg-[#163B36] selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* ---------------------------------------------------- */}
      {/* 1. TOP RESPONSIVE HEADER BAR                         */}
      {/* ---------------------------------------------------- */}
      <header className="w-full px-4 sm:px-8 lg:px-12 py-3 sm:py-3.5 flex items-center justify-between border-b border-[#D2DDD7] bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-xs">
        {/* Left: Geometric Emblem + Brand Name */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <a 
            href="#overview" 
            onClick={(e) => handleNavClick(e, '#overview')}
            className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer"
          >
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-[#163B36] text-[#C69A55] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-150 shrink-0 font-black">
              <span className="text-sm font-black">✦</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-black text-sm sm:text-base tracking-tight text-[#263238] leading-none">
                STAYWISE
              </span>
              <span className="text-[9px] text-[#666666] font-bold tracking-wider uppercase mt-0.5 hidden xs:inline">
                Property Platform
              </span>
            </div>
          </a>
        </div>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-[#666666]">
          <a 
            href="#overview" 
            onClick={(e) => handleNavClick(e, '#overview')}
            className="hover:text-[#263238] transition-colors duration-100 cursor-pointer"
          >
            Home
          </a>
          <a 
            href="#pain-points" 
            onClick={(e) => handleNavClick(e, '#pain-points')}
            className="hover:text-[#263238] transition-colors duration-100 cursor-pointer"
          >
            Common Problems
          </a>
          <a 
            href="#interactive-building" 
            onClick={(e) => handleNavClick(e, '#interactive-building')}
            className="hover:text-[#263238] transition-colors duration-100 flex items-center gap-1 font-bold text-[#263238] cursor-pointer"
          >
            <span>Property Types</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#163B36] animate-pulse" />
          </a>
          <a 
            href="#everything-inside" 
            onClick={(e) => handleNavClick(e, '#everything-inside')}
            className="hover:text-[#263238] transition-colors duration-100 cursor-pointer"
          >
            Features
          </a>
          <a 
            href="#how-it-works" 
            onClick={(e) => handleNavClick(e, '#how-it-works')}
            className="hover:text-[#263238] transition-colors duration-100 cursor-pointer"
          >
            How It Works
          </a>
          <a 
            href="#pricing" 
            onClick={(e) => handleNavClick(e, '#pricing')}
            className="hover:text-[#263238] transition-colors duration-100 cursor-pointer"
          >
            Pricing
          </a>
          <a 
            href="#faq" 
            onClick={(e) => handleNavClick(e, '#faq')}
            className="hover:text-[#263238] transition-colors duration-100 cursor-pointer"
          >
            FAQ
          </a>
          <a 
            href="#resources" 
            onClick={(e) => handleNavClick(e, '#resources')}
            className="hover:text-[#263238] transition-colors duration-100 cursor-pointer"
          >
            Resources
          </a>
        </nav>

        {/* Right Actions: Outlined Sign in + CTA + Hamburger Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/login"
            onClick={handleSignInClick}
            className="px-3.5 sm:px-4 py-1.5 rounded-full border border-[#D2DDD7] text-[11px] sm:text-xs font-bold text-[#263238] hover:bg-[#E8F0EC] transition-all duration-150 shadow-2xs cursor-pointer inline-flex items-center justify-center gap-1.5 group shrink-0"
          >
            <span>Sign in</span>
            <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150 text-[#263238]" />
          </a>

          <button
            onClick={() => handleOpenTrial('growth_pro')}
            className="hidden sm:inline-flex px-4 py-1.5 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-black shadow-xs transition duration-150 cursor-pointer border border-[#263238]/20"
          >
            Get Started →
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-1.5 rounded-xl text-[#263238] hover:bg-[#E8F0EC] transition-colors cursor-pointer"
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
        <div className="lg:hidden fixed top-[53px] sm:top-[57px] left-0 right-0 bg-white/98 backdrop-blur-lg border-b border-[#E0E0E0] shadow-xl z-40 px-5 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-2.5 text-xs font-semibold text-[#333333]">
            <a 
              href="#overview" 
              onClick={(e) => {
                handleNavClick(e, '#overview');
                setIsMobileMenuOpen(false);
              }}
              className="py-1 hover:text-[#263238] transition-colors"
            >
              Home
            </a>
            <a 
              href="#pain-points" 
              onClick={(e) => {
                handleNavClick(e, '#pain-points');
                setIsMobileMenuOpen(false);
              }}
              className="py-1 hover:text-[#263238] transition-colors"
            >
              Common Problems
            </a>
            <a 
              href="#interactive-building" 
              onClick={(e) => {
                handleNavClick(e, '#interactive-building');
                setIsMobileMenuOpen(false);
              }}
              className="py-1 flex items-center justify-between text-[#263238] font-bold"
            >
              <span>Property Types</span>
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            </a>
            <a 
              href="#everything-inside" 
              onClick={(e) => {
                handleNavClick(e, '#everything-inside');
                setIsMobileMenuOpen(false);
              }}
              className="py-1 hover:text-[#263238] transition-colors"
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => {
                handleNavClick(e, '#how-it-works');
                setIsMobileMenuOpen(false);
              }}
              className="py-1 hover:text-[#263238] transition-colors"
            >
              How It Works
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => {
                handleNavClick(e, '#pricing');
                setIsMobileMenuOpen(false);
              }}
              className="py-1 hover:text-[#263238] transition-colors"
            >
              Pricing
            </a>
            <a 
              href="#faq" 
              onClick={(e) => {
                handleNavClick(e, '#faq');
                setIsMobileMenuOpen(false);
              }}
              className="py-1 hover:text-[#263238] transition-colors"
            >
              FAQ
            </a>
            <a 
              href="#resources" 
              onClick={(e) => {
                handleNavClick(e, '#resources');
                setIsMobileMenuOpen(false);
              }}
              className="py-1 hover:text-[#263238] transition-colors"
            >
              Resources &amp; Cities
            </a>
          </nav>

          <div className="pt-2 border-t border-[#E0E0E0]">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleOpenTrial('growth_pro');
              }}
              className="w-full py-2.5 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white font-bold text-xs shadow-md transition text-center cursor-pointer"
            >
              Get Started (7-Day Free Trial)
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
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/60 to-[#f5f5f5] pointer-events-none" />

        {/* Floating Pill Announcement */}
        <div className="relative z-10 mb-4 sm:mb-6 animate-in fade-in slide-in-from-top-3 duration-500 w-full flex justify-center px-2">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/95 border border-[#D2DDD7] text-[#263238] text-[10px] sm:text-xs font-bold shadow-xs hover:bg-white transition-colors max-w-full text-center">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse shrink-0" />
            <span>Staywise • Your Property. Your Control. One Platform.</span>
          </div>
        </div>

        {/* Distinctive Editorial Serif Headline */}
        <div ref={heroContentRef} className="relative z-10 max-w-4xl mx-auto space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-600 will-change-transform transform-gpu px-2 sm:px-0">
          <h1 className="font-editorial text-3xl xs:text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#263238] leading-[1.15]">
            All Your Properties. <br className="hidden sm:inline" />
            One Simple Place to Manage Them.
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-base lg:text-lg text-[#404040] max-w-2xl mx-auto leading-relaxed font-normal px-1 sm:px-0">
            Staywise helps you keep track of your properties, tenants, rent, maintenance, expenses, and important documents—all from one platform. Whether you manage one rental home or a large property portfolio, Staywise helps you stay organized and in control.
          </p>

          {/* Dual Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleOpenTrial('growth_pro')}
              className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#163B36] hover:bg-[#0F2925] text-white font-bold text-xs sm:text-base shadow-lg shadow-[#163B36]/30 transition-all duration-150 transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <span>Get Started (7-Day Free Trial)</span>
              <span className="text-base sm:text-lg group-hover:translate-x-1.5 transition-transform duration-150">→</span>
            </button>

            <a
              href="#everything-inside"
              onClick={(e) => handleNavClick(e, '#everything-inside')}
              className="w-full sm:w-auto px-6 py-3.5 sm:py-4 rounded-full bg-white/95 border border-[#D2DDD7] text-[#263238] font-bold text-xs sm:text-sm hover:bg-[#E8F0EC] transition-colors shadow-xs cursor-pointer"
            >
              Explore Features
            </a>
          </div>

          {/* 7-Day Free Trial & Autopay Guarantee */}
          <div className="pt-1 text-[11px] sm:text-xs font-semibold text-[#263238] flex items-center justify-center gap-2 flex-wrap px-2">
            <span className="flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-emerald-700" />
              <span>₹0 charged today</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-emerald-700" />
              <span>Cancel anytime before 7 days</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-emerald-700" />
              <span>Friendly WhatsApp rent reminders</span>
            </span>
          </div>
        </div>

        {/* Bottom Trust Rail: Property Types & Banking */}
        <div className="relative z-10 mt-auto pt-10 sm:pt-16 lg:pt-20 pb-6 sm:pb-8 w-full max-w-4xl mx-auto space-y-3 px-2 sm:px-0">
          <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#666666]">
            Built for Property Owners Across India
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-4 sm:gap-8 lg:gap-10 text-xs sm:text-sm font-black text-[#404040]/85 tracking-tight">
            <span className="flex items-center justify-center gap-1.5">
              <Home className="h-4 w-4 text-[#163B36]" />
              <span>Residential Homes</span>
            </span>
            <span className="flex items-center justify-center gap-1.5">
              <Users className="h-4 w-4 text-emerald-700" />
              <span>PG &amp; Hostels</span>
            </span>
            <span className="flex items-center justify-center gap-1.5">
              <Building className="h-4 w-4 text-amber-700" />
              <span>Commercial &amp; Retail</span>
            </span>
            <span className="flex items-center justify-center gap-1.5">
              <Building2 className="h-4 w-4 text-indigo-700" />
              <span>Apartment Buildings</span>
            </span>
            <span className="flex items-center justify-center gap-1.5">
              <Landmark className="h-4 w-4 text-[#C69A55]" />
              <span>Villas &amp; Estates</span>
            </span>
          </div>
        </div>

        {/* Smooth Dissolve Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f5f5f5] to-transparent pointer-events-none" />
      </section>

      {/* ---------------------------------------------------- */}
      {/* 3. IN ONE LINE: THE CORE DEFINITION                   */}
      {/* ---------------------------------------------------- */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-12 bg-white border-y border-[#E0E0E0]">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0EC] border border-[#D2DDD7] text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#163B36]">
            <span>WHAT IS STAYWISE</span>
            <span className="text-[#263238]">• IN SIMPLE WORDS</span>
          </div>

          <h2 className="font-editorial text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#263238] leading-snug">
            Manage all your properties, tenants, and rent from one easy place.
          </h2>

          <p className="text-xs sm:text-base text-[#666666] max-w-2xl mx-auto leading-relaxed">
            Staywise helps you collect rent on time via WhatsApp, track occupied and vacant rooms or flats in real time, manage maintenance requests, split power bills without disputes, and keep digital tenant records safe.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 max-w-2xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-[#f5f5f5] border border-[#D2DDD7] flex items-center gap-3">
              <Clock className="h-5 w-5 text-[#163B36] shrink-0" />
              <div>
                <div className="font-bold text-xs text-[#263238]">Ready in 15 Minutes</div>
                <div className="text-[10px] text-[#666666]">No technical skills needed</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#f5f5f5] border border-[#D2DDD7] flex items-center gap-3">
              <Bot className="h-5 w-5 text-emerald-700 shrink-0" />
              <div>
                <div className="font-bold text-xs text-[#263238]">Automated WhatsApp</div>
                <div className="text-[10px] text-[#666666]">Polite reminders &amp; receipts</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#f5f5f5] border border-[#D2DDD7] flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[#C69A55] shrink-0" />
              <div>
                <div className="font-bold text-xs text-[#263238]">7-Day Free Trial</div>
                <div className="text-[10px] text-[#666666]">₹0 due today • Cancel anytime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 4. WHERE OWNERS LOSE TIME (COMMON OWNER CHALLENGES)   */}
      {/* ---------------------------------------------------- */}
      <section 
        id="pain-points" 
        ref={painSectionRef}
        className="py-14 sm:py-20 px-4 sm:px-6 lg:px-12 bg-[#f5f5f5] space-y-10 overflow-hidden"
      >
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto space-y-2.5 px-2 sm:px-0">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#163B36]">
              Everyday Landlord Problems
            </span>
            <h2 className="font-editorial text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#263238]">
              The 5 Common Headaches That Drain Your Time
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] max-w-xl mx-auto leading-relaxed">
              Managing properties with chat messages, paper diaries, and spreadsheets leads to missed rent, lost inquiries, and unnecessary stress.
            </p>
          </div>
        </ScrollReveal>

        {/* Staggered Parallax Pain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto items-stretch">
          
          {/* PAIN 1: The Rent Chase */}
          <div 
            ref={painCard1Ref}
            className="p-6 rounded-3xl bg-white border border-[#D2DDD7] shadow-xs hover:shadow-md transition-shadow duration-150 flex flex-col justify-between space-y-4 will-change-transform transform-gpu"
          >
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <Receipt className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">
                Problem #1 • Following Up for Rent
              </span>
              <h3 className="font-editorial text-lg font-bold text-[#263238]">
                &ldquo;When will you transfer the rent?&rdquo;
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                The 1st of the month arrives. You send messages, make phone calls, and wait. Tenants make promises, and you spend days following up with multiple people across different properties.
              </p>
            </div>

            <div className="pt-3 border-t border-[#E0E0E0] text-xs text-[#263238]">
              <span className="font-bold text-emerald-800">Staywise Benefit: </span>
              <span>Friendly, automated WhatsApp reminders before and on the due date with instant UPI links. Most tenants pay on time with zero awkward calls.</span>
            </div>
          </div>

          {/* PAIN 2: The Lost Portal Leads */}
          <div 
            ref={painCard2Ref}
            className="p-6 rounded-3xl bg-white border border-[#D2DDD7] shadow-xs hover:shadow-md transition-shadow duration-150 flex flex-col justify-between space-y-4 will-change-transform transform-gpu"
          >
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Phone className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
                Problem #2 • Missing Inquiries
              </span>
              <h3 className="font-editorial text-lg font-bold text-[#263238]">
                Missed calls and lost prospective tenants
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                An interested tenant calls while you are busy or driving. By the time you call them back, they have already booked another room or apartment down the street.
              </p>
            </div>

            <div className="pt-3 border-t border-[#E0E0E0] text-xs text-[#263238]">
              <span className="font-bold text-emerald-800">Staywise Benefit: </span>
              <span>Keep all tenant inquiries in one place, share property details immediately, and schedule property visits with clear confirmations.</span>
            </div>
          </div>

          {/* PAIN 3: Vacancy Guessing & Caretaker Disconnect */}
          <div 
            ref={painCard3Ref}
            className="p-6 rounded-3xl bg-white border border-[#D2DDD7] shadow-xs hover:shadow-md transition-shadow duration-150 flex flex-col justify-between space-y-4 will-change-transform transform-gpu"
          >
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <Home className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-800">
                Problem #3 • Vacancy Guesswork
              </span>
              <h3 className="font-editorial text-lg font-bold text-[#263238]">
                &ldquo;Is that room or flat currently empty?&rdquo;
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                When someone asks for a room or flat, you have to check old notebooks or call your caretaker to confirm if a bed or apartment is available, leading to lost bookings.
              </p>
            </div>

            <div className="pt-3 border-t border-[#E0E0E0] text-xs text-[#263238]">
              <span className="font-bold text-emerald-800">Staywise Benefit: </span>
              <span>A clear visual view on your phone showing exactly which room, bed, flat, or shop is occupied, vacant, or coming up for lease renewal.</span>
            </div>
          </div>

        </div>

        {/* 2 Additional Pain Points: Electricity & Disputed Deposits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-6xl mx-auto">
          {/* PAIN 4: Electricity Bill Splitting */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#D2DDD7] shadow-xs flex flex-col sm:flex-row items-start gap-4">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold shrink-0">
              <Zap className="h-5 w-5" />
            </div>
            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] font-black uppercase text-indigo-700">
                Problem #4 • Power Bill Disputes
              </span>
              <h4 className="font-bold text-sm text-[#263238]">
                Tenants arguing over electricity meter readings
              </h4>
              <p className="text-[#666666] leading-relaxed">
                Splitting an electricity bill between tenants often triggers arguments about who used the AC more or how fixed tariff charges were divided.
              </p>
              <div className="text-[#263238] pt-1">
                <b>Staywise Benefit: </b>Take a photo of your electricity bill. Staywise divides the units and charges fairly, sharing an itemized split directly with each tenant.
              </div>
            </div>
          </div>

          {/* PAIN 5: MoveFlow Deposits & Paper KYC */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#D2DDD7] shadow-xs flex flex-col sm:flex-row items-start gap-4">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
              <Scale className="h-5 w-5" />
            </div>
            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] font-black uppercase text-emerald-800">
                Problem #5 • Deposit Arguments
              </span>
              <h4 className="font-bold text-sm text-[#263238]">
                Tenant moves out and disputes damage deductions
              </h4>
              <p className="text-[#666666] leading-relaxed">
                When a tenant leaves, disagreements arise over damaged tiles or paint because neither party has clear photos or records of the room condition at move-in.
              </p>
              <div className="text-[#263238] pt-1">
                <b>Staywise Benefit: </b>Take move-in condition photos and keep a signed digital checklist so checkout and deposit refunds are clear, fair, and documented.
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
        className="relative w-full py-12 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-[#f5f5f5] to-white overflow-hidden"
      >
        <div className="w-full max-w-7xl mx-auto space-y-8 sm:space-y-12">
          
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-2.5 px-2 sm:px-0">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-[#E8F0EC] text-[#163B36] text-[10px] sm:text-xs font-black tracking-wider uppercase shadow-xs">
                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Designed for Real-World Properties</span>
              </div>
              <h2 className="font-editorial text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#263238]">
                Manage Real Properties with Complete Simplicity
              </h2>
              <p className="text-xs sm:text-sm text-[#666666] max-w-xl mx-auto leading-relaxed">
                Whether you own a single rental apartment, a 50-bed PG hostel, a commercial retail shop, or an estate—Staywise keeps everything organized and in your control.
              </p>
            </div>
          </ScrollReveal>

          {/* Symmetrical Parallax Grid: Left Cards + Center Parallax Building + Right Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center pt-2">
            
            {/* Center Column: The Parallax Architectural Residence Building */}
            <div className="lg:col-span-6 relative flex items-center justify-center py-2 sm:py-4 order-1 lg:order-2">
              <div 
                ref={buildingParallaxRef} 
                className="w-full relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[#D2DDD7] will-change-transform transform-gpu"
              >
                <img
                  src="/images/parallax-building-light.jpg"
                  alt="Staywise Managed Property"
                  className="w-full h-auto object-cover transform hover:scale-[1.01] transition-transform duration-300"
                />

                {/* Live Telemetry Floating Pill on Building */}
                <div 
                  ref={buildingBadgeRef}
                  className="absolute top-3 sm:top-5 left-3 sm:left-5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/95 border border-[#D2DDD7] text-[10px] sm:text-xs font-bold text-[#263238] shadow-md flex items-center gap-1.5 sm:gap-2 will-change-transform transform-gpu max-w-[85%] truncate"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="truncate">Sai Krishna Residences • All Units &amp; Rooms Tracked</span>
                </div>

                {/* Floating Scan Marker */}
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-5 px-2.5 sm:px-3.5 py-1 rounded-full bg-[#163B36]/90 text-white text-[10px] sm:text-[11px] font-semibold flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="h-3 w-3 text-[#C69A55] shrink-0" />
                  <span>Verified Condition Record</span>
                </div>
              </div>
            </div>

            {/* Left Symmetrical Column */}
            <div ref={leftCardsParallaxRef} className="lg:col-span-3 space-y-4 sm:space-y-5 order-2 lg:order-1 will-change-transform transform-gpu">
              {/* CARD 1: Automated Rent Collection */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D2DDD7] shadow-sm hover:shadow-md transition-shadow duration-200 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                    <Zap className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#263238]">Automatic Rent Collection</h4>
                    <span className="text-[10px] text-emerald-700 font-extrabold">Instant UPI &amp; Bank Transfer</span>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-[#666666] leading-relaxed">
                  Tenants receive polite WhatsApp reminders with quick UPI payment links. Money settles straight into your bank account.
                </p>
              </div>

              {/* CARD 2: Electricity Bill Splitting */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D2DDD7] shadow-sm hover:shadow-md transition-shadow duration-200 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shrink-0">
                    <FileText className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#263238]">Electricity Bill Splitting</h4>
                    <span className="text-[10px] text-amber-700 font-extrabold">Fair Sub-Meter Division</span>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-[#666666] leading-relaxed">
                  Take a photo of your electricity bill to calculate slab tariffs and split power costs between rooms without arguments.
                </p>
              </div>
            </div>

            {/* Right Symmetrical Column */}
            <div ref={rightCardsParallaxRef} className="lg:col-span-3 space-y-4 sm:space-y-5 order-3 lg:order-3 will-change-transform transform-gpu">
              {/* CARD 3: Move-In & Move-Out Checklists */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D2DDD7] shadow-sm hover:shadow-md transition-shadow duration-200 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold shrink-0">
                    <ShieldCheck className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#263238]">Move-In &amp; Move-Out Checklists</h4>
                    <span className="text-[10px] text-teal-700 font-extrabold">Dispute-Free Deposits</span>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-[#666666] leading-relaxed">
                  Take photos of fixtures and appliances when tenants move in so security deposit refunds are always fair and documented.
                </p>
              </div>

              {/* CARD 4: Clear Income & Expense Records */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D2DDD7] shadow-sm hover:shadow-md transition-shadow duration-200 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold shrink-0">
                    <Landmark className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#263238]">Income &amp; Expense Records</h4>
                    <span className="text-[10px] text-indigo-700 font-extrabold">Clear Financial Tracking</span>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-[#666666] leading-relaxed">
                  Keep track of rent collected, maintenance expenses, and utility payments. Export clean summaries whenever needed.
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
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#163B36]">
              Everything Inside Staywise
            </span>
            <h2 className="font-editorial text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#263238]">
              Everything You Need in One Simple Place
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] max-w-xl mx-auto leading-relaxed">
              Manage rent collection, tenant records, maintenance, power bills, and vacancies without jumping between multiple apps and spreadsheets.
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Feature Tabs */}
        <ScrollReveal delay={40}>
          <div className="flex items-center justify-center w-full px-1">
            <div className="p-1 rounded-2xl sm:rounded-full bg-[#E8F0EC] border border-[#D2DDD7] flex flex-wrap sm:flex-nowrap gap-1 max-w-full overflow-x-auto justify-center">
              <button
                type="button"
                onClick={() => setActiveTab('RENT')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-100 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'RENT'
                    ? 'bg-[#163B36] text-white shadow-xs'
                    : 'text-[#666666] hover:text-[#263238]'
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
                    ? 'bg-[#163B36] text-white shadow-xs'
                    : 'text-[#666666] hover:text-[#263238]'
                }`}
              >
                <Home className="h-3.5 w-3.5" />
                <span>Rooms &amp; Flats</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('WHATSAPP')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-100 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'WHATSAPP'
                    ? 'bg-[#163B36] text-white shadow-xs'
                    : 'text-[#666666] hover:text-[#263238]'
                }`}
              >
                <Bot className="h-3.5 w-3.5" />
                <span>WhatsApp Reminders</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('OCR')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-100 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'OCR'
                    ? 'bg-[#163B36] text-white shadow-xs'
                    : 'text-[#666666] hover:text-[#263238]'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Electricity Bills</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('CRM')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-100 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'CRM'
                    ? 'bg-[#163B36] text-white shadow-xs'
                    : 'text-[#666666] hover:text-[#263238]'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                <span>Tenant Inquiries</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('MOVEFLOW')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-100 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'MOVEFLOW'
                    ? 'bg-[#163B36] text-white shadow-xs'
                    : 'text-[#666666] hover:text-[#263238]'
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Lease &amp; Verification</span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Live Interactive Simulator Canvas */}
        <ScrollReveal delay={70}>
          <div 
            ref={dashboardCardRef}
            className="max-w-5xl mx-auto rounded-3xl bg-[#f5f5f5] border border-[#D2DDD7] p-5 sm:p-8 shadow-xs will-change-transform transform-gpu"
          >
            {activeTab === 'RENT' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-[#163B36] bg-[#E8F0EC] px-3 py-1 rounded-full">
                    Rent Collection on Autopilot
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#263238]">
                    Collect rent on time without the awkward phone calls.
                  </h3>
                  <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                    Say goodbye to manual follow-ups and hunting through bank statements. Staywise automatically sends friendly WhatsApp reminders to your tenants before and on the due date. Tenants pay easily via UPI or card, and receipts are generated instantly.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#163B36]" />
                      <span><b>Friendly WhatsApp Reminders:</b> Sent 3 days before due date, on the due date, and if delayed.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#163B36]" />
                      <span><b>Direct Bank Settlement:</b> Rent money transfers straight to your bank account.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#163B36]" />
                      <span><b>Instant Digital Receipts:</b> Shared automatically on WhatsApp as soon as payment is confirmed.</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => handleOpenTrial('starter')}
                      className="px-6 py-2.5 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white font-bold text-xs transition duration-150 cursor-pointer"
                    >
                      Start Free Trial →
                    </button>
                  </div>
                </div>

                {/* Interactive Simulated UI */}
                <div className="p-5 rounded-2xl bg-white border border-[#D2DDD7] shadow-sm space-y-3.5 text-xs font-mono">
                  <div className="flex justify-between items-center pb-2 border-b border-[#E0E0E0]">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-bold text-[#263238]">Monthly Rent Collection</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">98% Collected</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-[#f5f5f5] border border-[#D2DDD7] flex justify-between items-center">
                      <div>
                        <div className="font-bold text-[#263238]">Priya Sharma (Flat 204)</div>
                        <div className="text-[10px] text-[#666666]">Monthly Rent · ₹14,500</div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Paid via UPI</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#f5f5f5] border border-[#D2DDD7] flex justify-between items-center">
                      <div>
                        <div className="font-bold text-[#263238]">Arjun Mehta (Bed 102-B)</div>
                        <div className="text-[10px] text-[#666666]">WhatsApp Reminder Sent · ₹8,500</div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Reminder Sent</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#f5f5f5] border border-[#D2DDD7] flex justify-between items-center">
                      <div>
                        <div className="font-bold text-[#263238]">Karan Singh (Unit 301)</div>
                        <div className="text-[10px] text-[#666666]">Commercial Rent · ₹25,000</div>
                      </div>
                      <span className="text-[10px] font-bold text-[#163B36] bg-[#E8F0EC] px-2 py-0.5 rounded-full">Scheduled Autopay</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'BEDS' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-[#163B36] bg-[#E8F0EC] px-3 py-1 rounded-full">
                    Room &amp; Unit Tracking
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#263238]">
                    Know what is occupied and what is empty at a glance.
                  </h3>
                  <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                    Whether you operate a PG hostel with sharing beds, independent rental apartments, or commercial shops, view your entire property layout on your phone. See which rooms are occupied, which are vacant, and whose lease is ending soon.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#163B36]" />
                      <span><b>Complete Unit Tracking:</b> Track single rooms, shared PG beds, flats, or commercial shops.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#163B36]" />
                      <span><b>Advance Vacancy Alerts:</b> Get notified before leases end so you can arrange new tenants quickly.</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => handleOpenTrial('growth_pro')}
                      className="px-6 py-2.5 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white font-bold text-xs transition duration-150 cursor-pointer"
                    >
                      Start Free Trial →
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#D2DDD7] shadow-sm space-y-3.5 text-xs font-mono">
                  <div className="flex justify-between items-center pb-2 border-b border-[#E0E0E0]">
                    <span className="font-bold text-[#263238]">Floor 1 &amp; 2 Occupancy Status</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">94% Occupied</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {[
                      { bed: "Flat 101", status: "Occupied", bg: "bg-emerald-100 text-emerald-800" },
                      { bed: "Flat 102", status: "Occupied", bg: "bg-emerald-100 text-emerald-800" },
                      { bed: "Room 201", status: "Vacant", bg: "bg-rose-100 text-rose-800" },
                      { bed: "Room 202", status: "Notice", bg: "bg-amber-100 text-amber-800" },
                      { bed: "Unit 301", status: "Occupied", bg: "bg-emerald-100 text-emerald-800" },
                      { bed: "Unit 302", status: "Occupied", bg: "bg-emerald-100 text-emerald-800" },
                      { bed: "Shop 1", status: "Occupied", bg: "bg-emerald-100 text-emerald-800" },
                      { bed: "Shop 2", status: "Occupied", bg: "bg-emerald-100 text-emerald-800" },
                    ].map((b, i) => (
                      <div key={i} className={`p-2 rounded-xl text-center border border-[#D2DDD7] ${b.bg}`}>
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
                  <span className="text-[10px] font-black uppercase text-[#163B36] bg-[#E8F0EC] px-3 py-1 rounded-full">
                    WhatsApp Updates &amp; Assistant
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#263238]">
                    Run routine property tasks directly through WhatsApp.
                  </h3>
                  <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                    Stay connected with your tenants and properties without sitting in front of a computer. Check rent collected today, send a quick reminder, or answer a tenant question in seconds.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#163B36]" />
                      <span><b>Instant Status Checks:</b> Check total monthly collection, pending dues, or tenant phone numbers.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#163B36]" />
                      <span><b>Polite Reminder Nudges:</b> Send UPI payment links to unpaid tenants with one tap.</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => handleOpenTrial('growth_pro')}
                      className="px-6 py-2.5 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white font-bold text-xs transition duration-150 cursor-pointer"
                    >
                      Try on WhatsApp →
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#f5f5f5] border border-[#D2DDD7] shadow-sm space-y-3 text-xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#D2DDD7]">
                    <Bot className="h-4 w-4 text-[#163B36]" />
                    <span className="font-bold text-[#263238]">Staywise WhatsApp Assistant</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-2xl rounded-tr-none bg-white text-[#263238] max-w-[85%] ml-auto shadow-xs">
                      What is today's rent collection? Are there any pending dues?
                    </div>
                    <div className="p-2.5 rounded-2xl rounded-tl-none bg-[#E8F0EC] text-[#263238] max-w-[85%] shadow-xs">
                      <b>Good evening!</b><br />
                      • Collected this month: ₹1,42,000 (8 tenants)<br />
                      • Pending: ₹16,000 (2 tenants)<br />
                      Would you like to send a gentle WhatsApp reminder link to them now?
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'OCR' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-[#163B36] bg-[#E8F0EC] px-3 py-1 rounded-full">
                    Electricity &amp; Utility Splitting
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#263238]">
                    Split electricity bills fairly with zero arguments.
                  </h3>
                  <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                    Take a photo of your electricity bill. Staywise reads the amount and units, calculates slab rates, and divides common area power and sub-meter consumption fairly between rooms and tenants.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#163B36]" />
                      <span><b>Accurate Tariff Calculations:</b> Handles fixed charges and tiered rate slabs automatically.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#163B36]" />
                      <span><b>Transparent Itemized Amounts:</b> Added clearly to the tenant's monthly rent invoice.</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => handleOpenTrial('growth_pro')}
                      className="px-6 py-2.5 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white font-bold text-xs transition duration-150 cursor-pointer"
                    >
                      Start Free Trial →
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#D2DDD7] shadow-sm space-y-3 text-xs font-mono">
                  <div className="flex justify-between items-center pb-2 border-b border-[#E0E0E0]">
                    <span className="font-bold text-[#263238]">Monthly Electricity Bill Split</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">Calculated</span>
                  </div>
                  <div className="space-y-1.5 text-[#666666]">
                    <div className="flex justify-between">
                      <span>Total Electricity Bill:</span>
                      <span className="font-bold text-[#263238]">₹8,450 (1,120 units)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Common Area Share (4 units):</span>
                      <span className="font-bold text-[#263238]">₹420 / flat</span>
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
                  <span className="text-[10px] font-black uppercase text-[#163B36] bg-[#E8F0EC] px-3 py-1 rounded-full">
                    Tenant Inquiries &amp; Visits
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#263238]">
                    Never lose track of interested prospective tenants.
                  </h3>
                  <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                    Keep tenant inquiries from property portals or walk-ins in one organized list. Send property details, photos, and rent terms immediately, and schedule property visits without confusion.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#163B36]" />
                      <span><b>Centralized Inquiries:</b> All prospect names, phone numbers, and preferred move-in dates in one place.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#163B36]" />
                      <span><b>Scheduled Property Visits:</b> Share location directions and visit times with automatic reminders.</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => handleOpenTrial('growth_pro')}
                      className="px-6 py-2.5 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white font-bold text-xs transition duration-150 cursor-pointer"
                    >
                      Start Free Trial →
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#D2DDD7] shadow-sm space-y-3 text-xs font-mono">
                  <div className="flex justify-between items-center pb-2 border-b border-[#E0E0E0]">
                    <span className="font-bold text-[#263238]">Tenant Inquiries Pipeline</span>
                    <span className="text-[10px] font-bold text-[#163B36] bg-[#E8F0EC] px-2 py-0.5 rounded">Active Inquiries</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 rounded-xl bg-[#f5f5f5] border border-[#D2DDD7] flex justify-between items-center">
                      <div>
                        <div className="font-bold text-[#263238]">Rahul Verma</div>
                        <div className="text-[10px] text-[#666666]">Interested in 2-Sharing Room • Move-in Oct 10</div>
                      </div>
                      <span className="text-[10px] font-bold text-[#163B36] bg-[#E8F0EC] px-2 py-0.5 rounded">Visit Scheduled</span>
                    </div>

                    <div className="p-2 rounded-xl bg-[#f5f5f5] border border-[#D2DDD7] flex justify-between items-center">
                      <div>
                        <div className="font-bold text-[#263238]">Anjali Iyer</div>
                        <div className="text-[10px] text-[#666666]">1 BHK Independent Apartment</div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Details Sent</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'MOVEFLOW' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-[#163B36] bg-[#E8F0EC] px-3 py-1 rounded-full">
                    Digital Leases &amp; Move-In Records
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#263238]">
                    Verify tenant identity and sign agreements without paperwork.
                  </h3>
                  <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                    Verify tenant Aadhaar and PAN details online in minutes, prepare legally valid rental agreements, and keep move-in condition photos so security deposit returns are always fair and documented.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#163B36]" />
                      <span><b>Fast Online Verification:</b> Keep your property secure with verified tenant identity records.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#163B36]" />
                      <span><b>Condition Photo Checklist:</b> Timestamped photos of the room protect both owner and tenant deposits.</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => handleOpenTrial('growth_pro')}
                      className="px-6 py-2.5 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white font-bold text-xs transition duration-150 cursor-pointer"
                    >
                      Start Free Trial →
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#D2DDD7] shadow-sm space-y-3 text-xs font-mono">
                  <div className="flex justify-between items-center pb-2 border-b border-[#E0E0E0]">
                    <span className="font-bold text-[#263238]">Tenant Onboarding Records</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">Verified</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#f5f5f5] border border-[#D2DDD7]">
                      <span>Aadhaar Identity Verification</span>
                      <span className="text-[10px] font-bold text-emerald-700">Verified ✓</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#f5f5f5] border border-[#D2DDD7]">
                      <span>Digital Rental Agreement</span>
                      <span className="text-[10px] font-bold text-emerald-700">Signed ✓</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#f5f5f5] border border-[#D2DDD7]">
                      <span>Move-In Condition Photos</span>
                      <span className="text-[10px] font-bold text-emerald-700">Saved with Photos ✓</span>
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
        className="py-14 sm:py-20 px-4 sm:px-6 lg:px-12 bg-[#f5f5f5] border-y border-[#E0E0E0] space-y-10 overflow-hidden"
      >
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto space-y-2 px-2 sm:px-0">
            <span className="text-[10px] sm:text-xs font-black uppercase text-[#163B36]">
              Simple 3-Step Setup
            </span>
            <h2 className="font-editorial text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#263238]">
              Get Started in 15 Minutes
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] max-w-xl mx-auto leading-relaxed">
              No complex setup, software installations, or long training sessions required.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {/* STEP 1 */}
          <div className="p-6 rounded-3xl bg-white border border-[#D2DDD7] space-y-4 shadow-xs">
            <div className="h-10 w-10 rounded-2xl bg-[#E8F0EC] text-[#163B36] flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-bold text-base text-[#263238]">Create your account in 2 minutes</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Sign up with your mobile number and name. Choose your property category—residential flat, PG hostel, or commercial space.
            </p>
          </div>

          {/* STEP 2 */}
          <div className="p-6 rounded-3xl bg-white border border-[#D2DDD7] space-y-4 shadow-xs">
            <div className="h-10 w-10 rounded-2xl bg-[#E8F0EC] text-[#163B36] flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-bold text-base text-[#263238]">Add properties and tenants</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Enter your property name, room or flat numbers, and monthly rent amount. Add your current tenants with their phone numbers.
            </p>
          </div>

          {/* STEP 3 */}
          <div className="p-6 rounded-3xl bg-white border border-[#D2DDD7] space-y-4 shadow-xs">
            <div className="h-10 w-10 rounded-2xl bg-[#E8F0EC] text-[#163B36] flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-bold text-base text-[#263238]">Stay organized and in control</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Staywise handles friendly rent reminders, receipts, power bill splits, and repair requests smoothly every month.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 8. PRACTICAL USE CASES FOR PROPERTY OWNERS           */}
      {/* ---------------------------------------------------- */}
      <section 
        id="about" 
        ref={statsSectionRef} 
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12 bg-white space-y-8 sm:space-y-10 overflow-hidden"
      >
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto space-y-2 px-2 sm:px-0">
            <span className="text-[10px] sm:text-xs font-black uppercase text-[#163B36]">
              Real-World Management
            </span>
            <h2 className="font-editorial text-2xl xs:text-3xl sm:text-4xl font-semibold text-[#263238]">
              Designed for How You Actually Work
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] max-w-xl mx-auto leading-relaxed">
              Whether you manage a single rental flat, an entire PG building, or commercial office suites, Staywise adapts to your exact setup.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={50}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 max-w-5xl mx-auto text-center items-center">
            <div 
              ref={statsBox1Ref} 
              className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#f5f5f5] border border-[#D2DDD7] space-y-0.5 sm:space-y-1 will-change-transform transform-gpu shadow-xs"
            >
              <div className="font-editorial text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#263238]">All Types</div>
              <div className="text-[10px] sm:text-xs text-[#666666] font-semibold mt-1">PGs, Flats, &amp; Commercial</div>
            </div>

            <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#f5f5f5] border border-[#D2DDD7] space-y-0.5 sm:space-y-1 shadow-xs">
              <div className="font-editorial text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#263238]">Zero Delays</div>
              <div className="text-[10px] sm:text-xs text-[#666666] font-semibold mt-1">Direct WhatsApp Rent Reminders</div>
            </div>

            <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#f5f5f5] border border-[#D2DDD7] space-y-0.5 sm:space-y-1 shadow-xs">
              <div className="font-editorial text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold text-emerald-700">Fair Split</div>
              <div className="text-[10px] sm:text-xs text-[#666666] font-semibold mt-1">Accurate Power Sub-Meters</div>
            </div>

            <div 
              ref={statsBox4Ref} 
              className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#f5f5f5] border border-[#D2DDD7] space-y-0.5 sm:space-y-1 will-change-transform transform-gpu shadow-xs"
            >
              <div className="font-editorial text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#163B36]">Paperless</div>
              <div className="text-[10px] sm:text-xs text-[#666666] font-semibold mt-1">Digital Receipts &amp; Leases</div>
            </div>
          </div>
        </ScrollReveal>

        {/* Practical owner workflows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto pt-4">
          <div className="p-6 rounded-2xl bg-[#f5f5f5] border border-[#D2DDD7] space-y-3 shadow-xs">
            <span className="text-[10px] font-black uppercase text-[#163B36] bg-[#E8F0EC] px-2.5 py-0.5 rounded-full">
              PG &amp; Co-Living
            </span>
            <h3 className="font-bold text-base text-[#263238]">Bed-by-Bed Management</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Track room sharing, bed occupancy, and monthly food &amp; mess plans. Calculate electricity sub-meters per room to avoid arguments.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#f5f5f5] border border-[#D2DDD7] space-y-3 shadow-xs">
            <span className="text-[10px] font-black uppercase text-[#163B36] bg-[#E8F0EC] px-2.5 py-0.5 rounded-full">
              Flats &amp; Homes
            </span>
            <h3 className="font-bold text-base text-[#263238]">Peace of Mind for Landlords</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Send rent reminders on WhatsApp, collect payments via UPI, verify tenant identity documents, and record move-in photos for deposit protection.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#f5f5f5] border border-[#D2DDD7] space-y-3 shadow-xs">
            <span className="text-[10px] font-black uppercase text-[#163B36] bg-[#E8F0EC] px-2.5 py-0.5 rounded-full">
              Commercial &amp; Portfolios
            </span>
            <h3 className="font-bold text-base text-[#263238]">Clear Business Control</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Track multi-unit commercial leases, GST billing, maintenance fees, and delegate caretaker tasks while keeping complete financial control.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 9. TRANSPARENT PRICING & 7-DAY FREE TRIAL            */}
      {/* ---------------------------------------------------- */}
      <section 
        id="pricing" 
        ref={pricingSectionRef} 
        className="py-10 sm:py-16 lg:py-20 px-3 xs:px-4 sm:px-6 lg:px-12 bg-[#f5f5f5] border-t border-[#E0E0E0] space-y-6 sm:space-y-10 overflow-hidden"
      >
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3 px-2 sm:px-0">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 rounded-full bg-[#E8F0EC] text-[#263238] text-[10px] sm:text-xs font-bold">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-700" />
              <span>7-Day Risk-Free Trial On Every Plan</span>
            </div>

            <h2 className="font-editorial text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#263238] tracking-tight">
              Simple, Honest Pricing. Try Free for 7 Days.
            </h2>

            <p className="text-xs sm:text-sm text-[#666666] max-w-xl mx-auto leading-relaxed px-1">
              Choose the plan that fits the number of properties you manage. Enjoy full access for 7 days free with ₹0 due today. Cancel anytime before day 7 with one click.
            </p>

            {/* Monthly / Annual Toggle - Fully Responsive */}
            <div className="pt-2 flex items-center justify-center w-full px-1">
              <div className="inline-flex items-center p-1 rounded-full bg-white border border-[#D2DDD7] shadow-xs max-w-full">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-2.5 xs:px-3.5 sm:px-4.5 py-1.5 rounded-full text-[10px] xs:text-[11px] sm:text-xs font-bold transition-all duration-100 cursor-pointer whitespace-nowrap ${
                    billingCycle === 'monthly'
                      ? 'bg-[#263238] text-white shadow-xs'
                      : 'text-[#666666] hover:text-[#263238]'
                  }`}
                >
                  <span>Monthly Plan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  className={`px-2.5 xs:px-3.5 sm:px-4.5 py-1.5 rounded-full text-[10px] xs:text-[11px] sm:text-xs font-bold transition-all duration-100 flex items-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap ${
                    billingCycle === 'annual'
                      ? 'bg-[#263238] text-white shadow-xs'
                      : 'text-[#666666] hover:text-[#263238]'
                  }`}
                >
                  <span>Annual Plan</span>
                  <span className="text-[8px] xs:text-[9px] sm:text-[10px] px-1 xs:px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold whitespace-nowrap">
                    Save 17%
                  </span>
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Responsive Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
          
          {/* TIER 1: STARTER */}
          <ScrollReveal delay={40} className="flex w-full">
            <div className="w-full rounded-2xl sm:rounded-3xl bg-white border border-[#D2DDD7] p-4.5 xs:p-5 sm:p-7 flex flex-col justify-between space-y-4 sm:space-y-5 shadow-xs hover:shadow-md transition-shadow duration-150">
              <div className="space-y-3.5 sm:space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#E8F0EC] text-[#666666]">
                    1 Property
                  </span>
                  <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#263238] mt-2">Starter (1 Property)</h3>
                  <p className="text-xs text-[#666666] mt-0.5 leading-relaxed">
                    Ideal for single-flat landlords and independent rental houses.
                  </p>
                </div>

                <div className="pt-2 pb-3.5 sm:pb-4 border-b border-[#E0E0E0]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#263238] tracking-tight">
                      ₹{billingCycle === 'annual' ? (599).toLocaleString('en-IN') : (59).toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#666666]">/{billingCycle === 'annual' ? 'year' : 'month'}</span>
                  </div>
                  <div className="text-[11px] text-[#666666] mt-0.5">
                    {billingCycle === 'annual' ? '₹599/year (Equivalent to ~₹50/month)' : '₹59 billed monthly'}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#666666]">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#263238] shrink-0" />
                    <span><b>1 Property (PG, Flat, House, or Commercial)</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#263238] shrink-0" />
                    <span>Automatic invoices &amp; PDF receipts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#263238] shrink-0" />
                    <span>WhatsApp payment reminders to tenants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#263238] shrink-0" />
                    <span>Direct UPI QR code rent collection</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenTrial('starter')}
                  className="w-full py-2.5 sm:py-3 rounded-full bg-[#E8F0EC] hover:bg-[#263238] hover:text-white text-[#263238] font-bold text-xs transition-colors duration-150 cursor-pointer shadow-xs"
                >
                  Start 7-Day Free Trial
                </button>
                <div className="text-center text-[10px] text-[#666666] leading-tight">
                  ₹0 due today • Cancel before 7 days with 1 click
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* TIER 2: GROWTH PRO (MOST POPULAR) */}
          <ScrollReveal delay={80} className="flex w-full md:col-span-2 lg:col-span-1">
            <div 
              ref={pricingFeaturedCardRef}
              className="w-full rounded-2xl sm:rounded-3xl bg-white border-2 border-[#163B36] p-4.5 xs:p-5 sm:p-7 flex flex-col justify-between space-y-4 sm:space-y-5 shadow-lg relative mt-3 sm:mt-0 transform lg:-translate-y-2 will-change-transform transform-gpu"
            >
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-[#163B36] text-white text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-xs whitespace-nowrap">
                Most Popular
              </span>

              <div className="space-y-3.5 sm:space-y-4 pt-1">
                <div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#E8F0EC] text-[#263238]">
                    Up to 10 Properties
                  </span>
                  <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#263238] mt-2">Growth Pro (10 Properties)</h3>
                  <p className="text-xs text-[#666666] mt-0.5 leading-relaxed">
                    Ideal for PG operators and owners managing multiple rental units.
                  </p>
                </div>

                <div className="pt-2 pb-3.5 sm:pb-4 border-b border-[#E0E0E0]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-[#263238] tracking-tight">
                      ₹{billingCycle === 'annual' ? (1499).toLocaleString('en-IN') : (149).toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#666666]">/{billingCycle === 'annual' ? 'year' : 'month'}</span>
                  </div>
                  <div className="text-[11px] text-[#263238] font-semibold mt-0.5">
                    {billingCycle === 'annual' ? '₹1,499/year (Equivalent to ~₹125/month)' : '₹149 billed monthly'}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#263238]">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#163B36] shrink-0" />
                    <span><b>Up to 10 Properties &amp; PG Co-Living Buildings</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#163B36] shrink-0" />
                    <span><b>Sub-meter electricity bill splitting</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#163B36] shrink-0" />
                    <span><b>Move-in photo checklists to protect security deposits</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#163B36] shrink-0" />
                    <span><b>Income &amp; expense records with monthly summaries</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#163B36] shrink-0" />
                    <span><b>See how much empty space costs you &amp; spot missed income</b></span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenTrial('growth_pro')}
                  className="w-full py-2.5 sm:py-3.5 rounded-full bg-[#163B36] hover:bg-[#0F2925] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#163B36]/20 transition duration-150 cursor-pointer"
                >
                  Start 7-Day Free Trial (₹0 Today)
                </button>
                <div className="text-center text-[10px] text-[#263238] font-semibold leading-tight">
                  ₹0 due today • Cancel before 7 days in 1 click
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* TIER 3: ENTERPRISE */}
          <ScrollReveal delay={110} className="flex w-full md:col-span-2 lg:col-span-1">
            <div className="w-full rounded-2xl sm:rounded-3xl bg-white border border-[#D2DDD7] p-4.5 xs:p-5 sm:p-7 flex flex-col justify-between space-y-4 sm:space-y-5 shadow-xs hover:shadow-md transition-shadow duration-150">
              <div className="space-y-3.5 sm:space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#E8F0EC] text-[#666666]">
                    Unlimited Properties
                  </span>
                  <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#263238] mt-2">Enterprise (Unlimited Properties)</h3>
                  <p className="text-xs text-[#666666] mt-0.5 leading-relaxed">
                    For owners managing large portfolios, commercial complexes, and multiple buildings.
                  </p>
                </div>

                <div className="pt-2 pb-3.5 sm:pb-4 border-b border-[#E0E0E0]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#263238] tracking-tight">
                      ₹{billingCycle === 'annual' ? (2999).toLocaleString('en-IN') : (299).toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#666666]">/{billingCycle === 'annual' ? 'year' : 'month'}</span>
                  </div>
                  <div className="text-[11px] text-[#666666] mt-0.5">
                    {billingCycle === 'annual' ? '₹2,999/year (Equivalent to ~₹250/month)' : '₹299 billed monthly'}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#666666]">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#263238] shrink-0" />
                    <span><b>Unlimited properties, buildings &amp; portfolios</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#263238] shrink-0" />
                    <span>Give managers access while you stay in control</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#263238] shrink-0" />
                    <span>Commercial maintenance (CAM) &amp; GST invoices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#263238] shrink-0" />
                    <span>Direct bank settlements &amp; priority phone support</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenTrial('enterprise')}
                  className="w-full py-2.5 sm:py-3 rounded-full bg-[#E8F0EC] hover:bg-[#263238] hover:text-white text-[#263238] font-bold text-xs transition-colors duration-150 cursor-pointer shadow-xs"
                >
                  Start 7-Day Free Trial
                </button>
                <div className="text-center text-[10px] text-[#666666] leading-tight">
                  ₹0 due today • Cancel before 7 days with 1 click
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>

        {/* Trial Guarantee Callout - Responsive */}
        <ScrollReveal delay={70}>
          <div 
            ref={pricingGuaranteeRef}
            className="max-w-4xl mx-auto p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#E8F0EC] border border-[#D2DDD7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 will-change-transform transform-gpu shadow-xs"
          >
            <div className="flex items-start sm:items-center gap-3 sm:gap-3.5">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#263238] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
                <ShieldCheck className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </div>
              <div className="text-[11px] sm:text-xs text-[#263238] leading-relaxed">
                <span className="font-extrabold">How does the 7-day free trial work? </span>
                <span className="text-[#333333]">
                  ₹0.00 is charged today. You can test all features on your own properties for 7 full days. If Staywise makes your work easier, your plan activates after day 7. You can cancel anytime from Settings with 1 click to pay nothing.
                </span>
              </div>
            </div>

            <button
              onClick={() => handleOpenTrial('growth_pro')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#263238] hover:bg-[#1f1f1f] text-white font-bold text-xs shrink-0 transition-colors shadow-xs cursor-pointer text-center"
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
            <span className="text-[10px] sm:text-xs font-black uppercase text-[#263238]">
              Questions &amp; Answers
            </span>
            <h2 className="font-editorial text-2xl xs:text-3xl sm:text-4xl font-semibold text-[#263238]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#666666]">
              Clear answers to common questions from landlords and property owners.
            </p>
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
                a: "No, you will not be charged today. You get full access to all features for 7 days with ₹0 due today. If you choose to keep your subscription, your plan activates after day 7. You can cancel anytime before day 7 in 1 click to pay nothing."
              },
              {
                q: "How does rent collection on WhatsApp work?",
                a: "Staywise sends friendly WhatsApp reminders to your tenants with their bill amount and a direct UPI payment QR code. Tenants can pay using Google Pay, PhonePe, or Paytm. Once paid, the payment is marked automatically and a digital receipt is issued."
              },
              {
                q: "What types of properties can I manage with Staywise?",
                a: "You can manage PG and hostel accommodations (including bed-by-bed occupancy and meal subscriptions), residential flats and independent houses, commercial shops and office suites, and multi-unit buildings."
              },
              {
                q: "How does electricity bill splitting work?",
                a: "Simply enter your total power bill and room sub-meter readings. Staywise calculates each room or tenant's exact share based on their usage, preventing confusion and arguments over shared power bills."
              },
              {
                q: "How do tenant identity verification and rental agreements work?",
                a: "You can securely verify tenant Aadhaar details online, prepare digital rental agreements for signing, and save move-in room condition photos to keep security deposits fair and documented."
              },
              {
                q: "Can I give my property manager or caretaker access?",
                a: "Yes. You can give caretakers or managers their own login with specific permissions to record rent payments or manage maintenance, while you maintain full control over your finances."
              }
            ].map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-xl sm:rounded-2xl bg-[#f5f5f5] border border-[#D2DDD7] overflow-hidden transition-colors duration-100"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-3.5 sm:p-5 text-left flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-[#263238] hover:text-[#263238] transition-colors cursor-pointer"
                  >
                    <span className="leading-snug">{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-[#666666] shrink-0 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-3.5 sm:px-5 pb-3.5 sm:pb-4 pt-1 text-[11px] sm:text-xs text-[#666666] leading-relaxed border-t border-[#E0E0E0]">
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
      {/* 11. PROPERTY RESOURCES DIRECTORY (BY CITY & GUIDES)  */}
      {/* ---------------------------------------------------- */}
      <section 
        id="resources"
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-12 bg-[#f5f5f5] border-t border-[#E0E0E0] space-y-8 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] sm:text-xs font-black uppercase text-[#263238]">
              Staywise Resources
            </span>
            <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#263238]">
              Property Management Guides &amp; Resources
            </h3>
            <p className="text-xs text-[#666666]">
              Helpful resources and operational guides for landlords, PG operators, and property owners across India.
            </p>
          </div>

          <div className="rounded-2xl border border-[#D2DDD7] bg-white divide-y divide-[#E0E0E0] overflow-hidden text-xs">
            {/* By City */}
            <div className="p-5 sm:p-6 space-y-3">
              <h4 className="font-bold text-sm text-[#263238]">Operations by City</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[#666666]">
                <span className="hover:text-[#263238] transition-colors cursor-pointer">Bangalore Property Management</span>
                <span className="hover:text-[#263238] transition-colors cursor-pointer">Hyderabad PG Operations</span>
                <span className="hover:text-[#263238] transition-colors cursor-pointer">Delhi NCR Hostel Software</span>
                <span className="hover:text-[#263238] transition-colors cursor-pointer">Pune Rental Management</span>
                <span className="hover:text-[#263238] transition-colors cursor-pointer">Chennai Co-Living Systems</span>
                <span className="hover:text-[#263238] transition-colors cursor-pointer">Gurgaon Apartment Rentals</span>
                <span className="hover:text-[#263238] transition-colors cursor-pointer">Noida Commercial Flats</span>
                <span className="hover:text-[#263238] transition-colors cursor-pointer">Mumbai Rental Management</span>
              </div>
            </div>

            {/* Practical Upgrades */}
            <div className="p-5 sm:p-6 space-y-3">
              <h4 className="font-bold text-sm text-[#263238]">Helpful Landlord Guides</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[#666666]">
                <span className="hover:text-[#263238] transition-colors cursor-pointer">Replacing Paper Registers</span>
                <span className="hover:text-[#263238] transition-colors cursor-pointer">Automating WhatsApp Rent Reminders</span>
                <span className="hover:text-[#263238] transition-colors cursor-pointer">Managing PG Room &amp; Bed Sharing</span>
                <span className="hover:text-[#263238] transition-colors cursor-pointer">Fair Electricity Sub-Meter Splitting</span>
                <span className="hover:text-[#263238] transition-colors cursor-pointer">Tenant Identity Verification Online</span>
                <span className="hover:text-[#263238] transition-colors cursor-pointer">Protecting Security Deposits with Photos</span>
                <span className="hover:text-[#263238] transition-colors cursor-pointer">Tracking Rental Income &amp; Expenses</span>
                <span className="hover:text-[#263238] transition-colors cursor-pointer">Commercial Common Area Maintenance (CAM)</span>
              </div>
            </div>

            {/* Connected Services */}
            <div className="p-5 sm:p-6 space-y-3">
              <h4 className="font-bold text-sm text-[#263238]">Connected Services &amp; Tools</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[#666666]">
                <span className="hover:text-[#263238] transition-colors cursor-pointer">WhatsApp Payment Reminders</span>
                <span className="hover:text-[#263238] transition-colors cursor-pointer">Instant UPI QR Code Collection</span>
                <span className="hover:text-[#263238] transition-colors cursor-pointer">Automated PDF Rent Receipts</span>
                <span className="hover:text-[#263238] transition-colors cursor-pointer">Aadhaar Online KYC Verification</span>
                <span className="hover:text-[#263238] transition-colors cursor-pointer">Digital Rental Agreement Records</span>
                <span className="hover:text-[#263238] transition-colors cursor-pointer">Move-In Condition Photo Checklist</span>
                <span className="hover:text-[#263238] transition-colors cursor-pointer">Caretaker &amp; Manager Delegated Access</span>
                <span className="hover:text-[#263238] transition-colors cursor-pointer">Electricity Sub-Meter Calculator</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 12. CLEAN MINIMALIST FOOTER                          */}
      {/* ---------------------------------------------------- */}
      <footer className="bg-[#263238] text-white/80 py-10 sm:py-12 px-4 sm:px-6 lg:px-12 text-xs relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white text-[#263238] flex items-center justify-center font-bold text-xs shrink-0">
                SW
              </div>
              <span className="font-extrabold text-white text-sm tracking-tight">STAYWISE</span>
            </div>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="text-[10px] sm:text-[11px] text-white/60">Your Property. Your Control. One Platform.</span>
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
              Common Problems
            </a>
            <a 
              href="#interactive-building" 
              onClick={(e) => handleNavClick(e, '#interactive-building')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Property Types
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
              href="#faq" 
              onClick={(e) => handleNavClick(e, '#faq')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              FAQ
            </a>
            <a 
              href="/login" 
              onClick={handleSignInClick}
              className="hover:text-white transition-colors flex items-center gap-1 text-emerald-300 font-semibold cursor-pointer"
            >
              <span>Sign In</span>
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
