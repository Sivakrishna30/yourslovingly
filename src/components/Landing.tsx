import { motion } from 'motion/react';
import { 
  LogIn, 
  Plus, 
  MapPin, 
  FileDown, 
  IndianRupee, 
  ChevronDown,
  Music,
  ArrowRight,
  Sparkles,
  Layers,
  BarChart3,
  Mail,
  CreditCard,
  FileText,
  Check,
  Clock,
  Eye
} from 'lucide-react';
import type { User as FirebaseUser } from 'firebase/auth';
import { useState } from 'react';
import { creationCategories } from '../lib/constants';
import type { CreationCategory, DesignStyle } from '../types';
import koreanHeartLogo from '../assets/images/korean_heart_golden_logo_1786820911376.jpg';
import { SamplesShowcase, type SampleInvite } from './SamplesShowcase';

interface NavbarProps {
  user: FirebaseUser | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onLogoClick: () => void;
  onNavigateToPricing?: () => void;
}

export function Navbar({ user, onSignIn, onSignOut, onLogoClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button 
          onClick={onLogoClick}
          className="flex items-center gap-2.5 group text-left"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-rose-200 shadow-md shadow-rose-200/50 group-hover:scale-105 transition-transform bg-white flex items-center justify-center p-0.5">
            <img 
              src={koreanHeartLogo} 
              alt="Yours Lovingly Korean Finger Heart Logo" 
              className="w-full h-full object-cover rounded-lg" 
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight flex items-center gap-1.5">
            Yours Lovingly
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-stone-600">
          <a href="#samples" className="hover:text-primary transition-colors">Samples</a>
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-secondary transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-secondary transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-sm text-stone-600 hidden sm:inline font-medium max-w-[160px] truncate">{user.displayName || user.email}</span>
              <button 
                onClick={onSignOut}
                className="text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-primary hover:border-red-200 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={onSignIn}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-stone-900 text-white rounded-full text-xs sm:text-sm font-medium hover:bg-primary transition-all shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${mobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 py-4 space-y-3 shadow-lg">
          <a 
            href="#features" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-stone-700 hover:text-red-600"
          >
            Features
          </a>
          <a 
            href="#how-it-works" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-stone-700 hover:text-teal-700"
          >
            How It Works
          </a>
          <a 
            href="#pricing" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-stone-700 hover:text-red-600"
          >
            Pricing
          </a>
          <a 
            href="#faq" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-stone-700 hover:text-teal-700"
          >
            FAQ
          </a>
        </div>
      )}
    </nav>
  );
}

export function Hero({ 
  onStart,
  onStartWithCategory
 }: { 
  onStart: () => void;
  onStartWithCategory?: (cat: CreationCategory, style?: DesignStyle) => void;
  onNavigateToPricing?: () => void;
}) {
  const getCategoryIcon = (id: CreationCategory) => {
    switch (id) {
      case 'invite':
        return <Mail className="w-5 h-5 text-primary" />;
      case 'business-card':
        return <CreditCard className="w-5 h-5 text-secondary" />;
      case 'flyer':
        return <FileText className="w-5 h-5 text-accent" />;
      case 'portfolio':
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      default:
        return <Layers className="w-5 h-5 text-stone-700" />;
    }
  };

  return (
    <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-brand-orange/5 via-stone-50/60 to-white">
      {/* 30% Visible Background Logo Layer for Hero Panel */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 overflow-hidden">
        <img 
          src={koreanHeartLogo} 
          alt="" 
          className="w-[380px] sm:w-[520px] md:w-[680px] lg:w-[800px] max-w-none opacity-30 mix-blend-multiply select-none object-contain filter drop-shadow-xl"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-brand-red/10 via-brand-teal/5 to-transparent -z-10 blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 mb-4 sm:mb-6 leading-tight">
              Create Beautiful Digital Invites, Business Cards and <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-brand-orange to-brand-teal">Pamphlets.</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-stone-600 mb-8 sm:mb-10 leading-relaxed max-w-2xl">
              Design interactive digital micro-sites with location, music, photos, and UPI gifts. Track visitor activity, receive reports in WhatsApp, and download print-ready PDFs.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
              <button 
                onClick={onStart}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-base sm:text-lg shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Start Creating Free
              </button>
              <a 
                href="#samples"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('samples')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-stone-700 border border-stone-200 rounded-xl font-bold text-base sm:text-lg hover:bg-stone-50 hover:text-primary hover:border-rose-200 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-primary" />
                View Samples
              </a>
              <a 
                href="#pricing"
                className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 bg-stone-100 text-stone-700 border border-stone-200/80 rounded-xl font-semibold text-sm sm:text-base hover:bg-stone-200 hover:text-stone-900 transition-all text-center flex items-center justify-center gap-1.5"
              >
                Pricing
                <ArrowRight className="w-4 h-4 text-stone-500" />
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative w-full"
          >
            <div className="bg-stone-50/70 p-4 sm:p-6 rounded-3xl border border-stone-200/90 shadow-xl shadow-stone-200/50 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-white shadow-xs">
                    <Layers className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-stone-900 text-sm sm:text-base">Select Page Type</h3>
                    <p className="text-[11px] text-stone-500">Pick a category to begin crafting your page</p>
                  </div>
                </div>
              </div>

              {/* Square Panels Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                {creationCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => onStartWithCategory ? onStartWithCategory(cat.id) : onStart()}
                    className="p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200 hover:border-secondary hover:shadow-md transition-all text-left group flex flex-col justify-between min-h-[130px] sm:min-h-[148px]"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-stone-100/90 border border-stone-200/70 flex items-center justify-center group-hover:scale-105 group-hover:bg-brand-teal/5 transition-all">
                          {getCategoryIcon(cat.id)}
                        </div>
                        <span className="text-[10px] font-bold text-secondary bg-brand-teal/5 border border-brand-teal/10 px-2 py-0.5 rounded-md group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all flex items-center gap-1">
                          Create <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                      <h4 className="font-bold text-stone-900 text-xs sm:text-sm group-hover:text-secondary transition-colors leading-tight">
                        {cat.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-stone-500 line-clamp-2 mt-1.5 sm:mt-2 leading-relaxed">
                      {cat.subtitle}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description, accentColor = 'red' }: { icon: React.ReactNode, title: string, description: string, accentColor?: 'red' | 'teal' | 'orange' }) {
  const iconBgClass = 
    accentColor === 'teal' ? 'bg-brand-teal/5 text-secondary border-brand-teal/10' :
    accentColor === 'orange' ? 'bg-brand-orange/5 text-accent border-brand-orange/10' :
    'bg-brand-red/5 text-primary border-brand-red/10';

  const hoverBorder = 
    accentColor === 'teal' ? 'hover:border-brand-teal/40' :
    accentColor === 'orange' ? 'hover:border-brand-orange/40' :
    'hover:border-brand-red/40';

  return (
    <div className={`p-8 bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-xl ${hoverBorder} transition-all`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-xs border ${iconBgClass}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-stone-900 mb-3">{title}</h3>
      <p className="text-stone-600 leading-relaxed text-sm">{description}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-stone-200/80 py-6 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group"
      >
        <span className="text-lg font-bold text-stone-800 group-hover:text-primary transition-colors">{question}</span>
        <ChevronDown className={`w-5 h-5 text-stone-400 transition-transform ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </button>
      {isOpen && (
        <div className="mt-4 text-stone-600 leading-relaxed text-sm">
          {answer}
        </div>
      )}
    </div>
  );
}

export function Landing({ 
  onStart, 
  onStartWithCategory,
  onSelectSample,
  onNavigateToPricing,
  user, 
  onSignIn, 
  onSignOut 
}: { 
  onStart: () => void;
  onStartWithCategory?: (cat: CreationCategory, style?: DesignStyle) => void;
  onSelectSample?: (sample: SampleInvite) => void;
  onNavigateToPricing?: () => void;
  user: FirebaseUser | null;
  onSignIn: () => void;
  onSignOut: () => void;
}) {
  return (
    <div className="min-h-screen bg-white text-stone-900 relative">
      {/* Fixed Non-Scrollable Background Logo in Center of Landing Page (30% Opacity) */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 w-[300px] sm:w-[480px] md:w-[600px] lg:w-[720px] aspect-square flex items-center justify-center opacity-30 mix-blend-multiply select-none">
        <img 
          src={koreanHeartLogo} 
          alt="" 
          className="w-full h-full object-contain filter drop-shadow-xl" 
          referrerPolicy="no-referrer"
        />
      </div>

      <Navbar 
        user={user} 
        onSignIn={onSignIn} 
        onSignOut={onSignOut} 
        onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
        onNavigateToPricing={onNavigateToPricing}
      />

      <Hero 
        onStart={onStart} 
        onStartWithCategory={onStartWithCategory} 
        onNavigateToPricing={onNavigateToPricing}
      />

      {/* Live Samples Showcase Section */}
      <SamplesShowcase 
        onSelectSample={(sample) => {
          if (onSelectSample) {
            onSelectSample(sample);
          } else {
            onStart();
          }
        }} 
      />

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-stone-50/60 border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900">Why Choose Yours Lovingly?</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 w-full max-w-6xl">
            <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm flex">
              <FeatureCard 
                icon={<MapPin />}
                title="Get Directions on One Click"
                description="Guests and customers open navigation in Google Maps instantly."
                accentColor="red"
              />
            </div>
            <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm flex">
              <FeatureCard 
                icon={<BarChart3 />}
                title="Page Insights and WhatsApp Reports"
                description="Track live page opens, guest headcounts, direct inquiries, and get reports in WhatsApp."
                accentColor="teal"
              />
            </div>
            <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm flex">
              <FeatureCard 
                icon={<FileDown />}
                title="Export as PDF to Print Anything"
                description="Download print ready PDFs and high quality cards for invitations, business cards, flyers, and pamphlets."
                accentColor="orange"
              />
            </div>
            <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm flex">
              <FeatureCard 
                icon={<IndianRupee />}
                title="Digital Gifts via UPI"
                description="Receive direct gifts and payments with integrated GPay and PhonePe UPI links."
                accentColor="red"
              />
            </div>
            <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm flex">
              <FeatureCard 
                icon={<Music />}
                title="Spotify Music and Playlists"
                description="Embed your favorite Spotify track or celebration playlist directly on your page."
                accentColor="teal"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-stone-900 text-white overflow-hidden border-t border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-800 text-stone-300 text-xs font-bold uppercase tracking-wider mb-4 border border-stone-700">
              Simple Workflow
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-4 sm:mb-6">Create in 3 Simple Steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            <div className="absolute top-1/4 left-0 w-full h-px bg-stone-800 hidden md:block -z-10" />
            {[
              { step: "01", title: "Select Category", desc: "Choose a Digital Invite, Business Card, Flyer, or Portfolio." },
              { step: "02", title: "Customize Details", desc: "Add your event title, date, venue location, music, and photos." },
              { step: "03", title: "Publish and Export", desc: "Share your live link, track page insights, or export as PDF to print physical copies." }
            ].map((s, i) => (
              <div key={i} className="text-center bg-stone-800/40 md:bg-transparent p-6 md:p-0 rounded-2xl border border-stone-800 md:border-none">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-brand-red via-brand-orange to-brand-teal rounded-full flex items-center justify-center text-xl sm:text-2xl font-serif font-bold mx-auto mb-6 sm:mb-8 shadow-xl text-white">
                  {s.step}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{s.title}</h3>
                <p className="text-stone-400 leading-relaxed text-xs sm:text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comprehensive Plans Section */}
      <section id="pricing" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-50/90 via-white to-brand-orange/5 border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-red/5 text-primary border border-brand-red/10 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Pay-As-You-Need Transactional Pricing
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">
              Start Free. Scale with Basic Pages, Premium Upgrades, or Lifetime Hosting.
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-stone-600 leading-relaxed">
              Every published page begins with 15 days of live hosting. No monthly recurring fees. Upgrade to Premium for Google Maps, RSVP, UPI QR, and a 100% Watermark-Free experience.
            </p>
          </div>

          {/* Main Pricing Cards */}
          <div className="flex flex-wrap justify-center gap-6 items-stretch max-w-5xl mx-auto w-full">
            {/* 1. Free Basic Page */}
            <div className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] max-w-sm relative rounded-3xl p-6 flex flex-col justify-between transition-all bg-white border border-stone-200 shadow-sm hover:shadow-xl">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border bg-stone-100 text-stone-700 border-stone-200">
                    100% Free
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900">Free Basic Page</h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed min-h-[32px]">
                  1st basic page free to create and publish.
                </p>
                <div className="my-4 pb-4 border-b border-stone-100 flex items-baseline gap-1.5">
                  <span className="text-3xl font-serif font-bold text-stone-900">₹0</span>
                  <span className="text-xs text-stone-500 font-medium">1st page free</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {[
                    '1 Basic Page (15 Days hosting)',
                    'Spotify Music Player (1 track)',
                    'Photo Gallery (Up to 10 photos)',
                    'Venue Text & Event Details',
                    'Optional Password Protection',
                    'Print-Ready PDF Export',
                    'Includes Page Watermark'
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-stone-600 leading-relaxed">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={onStart}
                className="w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white shadow-sm cursor-pointer"
              >
                <span>Start Free Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2. Basic Page */}
            <div className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] max-w-sm relative rounded-3xl p-6 flex flex-col justify-between transition-all bg-white border border-stone-200 shadow-sm hover:shadow-xl">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border bg-brand-orange/5 text-accent border-brand-orange/10">
                    Basic Single
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900">Basic Page</h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed min-h-[32px]">
                  Publish additional basic pages with essential features.
                </p>
                <div className="my-4 pb-4 border-b border-stone-100 flex items-baseline gap-1.5">
                  <span className="text-3xl font-serif font-bold text-stone-900">₹49</span>
                  <span className="text-xs text-stone-500 font-medium">per published page</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {[
                    '1 Basic Page (15 Days hosting)',
                    'Spotify Music Player (1 track)',
                    'Photo Gallery (Up to 10 photos)',
                    'Venue Text & Event Details',
                    'Optional Password Protection',
                    'Print-Ready PDF Export',
                    'Includes Page Watermark'
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-stone-600 leading-relaxed">
                      <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={onStart}
                className="w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 bg-accent hover:bg-accent/90 text-white shadow-sm cursor-pointer"
              >
                <span>Get Basic Page ₹49</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3. Premium Page */}
            <div className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] max-w-sm relative rounded-3xl p-6 flex flex-col justify-between transition-all bg-white border-2 border-primary shadow-xl ring-4 ring-primary/10">
              <div className="absolute -top-3.5 right-4 px-2.5 py-0.5 bg-gradient-to-r from-brand-red to-brand-orange text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-xs">
                Most Popular
              </div>
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border bg-brand-red/5 text-primary border-brand-red/10">
                    Full Pro Features
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900">Premium Page</h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed min-h-[32px]">
                  All Pro interactive features & Watermark-Free.
                </p>
                <div className="my-4 pb-4 border-b border-stone-100 flex items-baseline gap-1.5">
                  <span className="text-3xl font-serif font-bold text-primary">₹99</span>
                  <span className="text-xs text-stone-500 font-medium">per published page</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {[
                    '1 Premium Page (15 Days hosting)',
                    'Watermark-Free Experience',
                    'Google Maps & Location QR Code',
                    'Interactive RSVP & Headcount',
                    'UPI Gift QR Scanner (Direct)',
                    'Page Insights & WhatsApp Reports',
                    'Spotify Music & 10-Photo Gallery'
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-stone-800 leading-relaxed font-semibold">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={onStart}
                className="w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 bg-gradient-to-r from-brand-red to-brand-orange hover:from-primary/90 hover:to-accent/90 text-white shadow-md shadow-brand-red/20 cursor-pointer"
              >
                <span>Get Premium ₹99</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Hosting Extensions & Upgrades Panel */}
          <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl max-w-5xl mx-auto space-y-6 flex flex-col items-center">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800 text-amber-300 text-xs font-bold uppercase tracking-wider border border-stone-700">
                <Clock className="w-3.5 h-3.5" />
                Hosting Extensions & Page Upgrades
              </div>
              <h3 className="text-xl sm:text-3xl font-serif font-bold">
                Extend Validity or Upgrade Any Page Anytime
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                If your initial 15-day hosting duration expires, extend validity for that specific page or unlock permanent lifetime hosting directly from your dashboard.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 w-full">
              <div className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-0.75rem)] max-w-xs bg-stone-800/80 border border-stone-700/80 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Basic Extension
                    </span>
                    <span className="text-lg font-bold text-white">₹14</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1">+30 Days Basic Hosting</h4>
                  <p className="text-[11px] text-stone-300 leading-relaxed">
                    Adds 30 extra days of live hosting to an active or expired Basic page.
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-0.75rem)] max-w-xs bg-stone-800/80 border border-stone-700/80 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/30">
                      Premium Extension
                    </span>
                    <span className="text-lg font-bold text-red-300">₹99</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1">+30 Days Premium Hosting</h4>
                  <p className="text-[11px] text-stone-300 leading-relaxed">
                    Adds 30 extra days of live hosting with all Pro features & Insights.
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-0.75rem)] max-w-xs bg-stone-800/80 border border-stone-700/80 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Page Upgrade
                    </span>
                    <span className="text-lg font-bold text-emerald-300">₹49</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1">Basic → Premium Upgrade</h4>
                  <p className="text-[11px] text-stone-300 leading-relaxed">
                    Upgrade an existing published Basic page to Premium with no watermark.
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-0.75rem)] max-w-xs bg-stone-800/80 border border-stone-700/80 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      Lifetime Single
                    </span>
                    <span className="text-lg font-bold text-teal-300">₹999</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1">Permanent Lifetime Hosting</h4>
                  <p className="text-[11px] text-stone-300 leading-relaxed">
                    Unlocks permanent lifetime hosting for this page alone. Never expires.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-8 sm:mb-12 text-center text-stone-900">Frequently Asked Questions</h2>
          <div className="divide-y divide-stone-200/80 border-t border-stone-200/80">
            <FAQItem 
              question="What is included in the Free Basic Page?"
              answer="Your first site is 100% free with 15 days of live hosting and includes a platform watermark. Free features include Spotify music player (1 track), photo gallery (up to 10 photos), venue information & details, full typography/colors customization, password protection, and print-ready PDF export."
            />
            <FAQItem 
              question="What is the difference between Basic (₹49) and Premium (₹99) pages?"
              answer="A Basic Page (₹49 for 15 days) includes essential features (Spotify, 10-image gallery, venue text, PDF export) with a platform watermark. A Premium Page (₹99 for 15 days) unlocks a completely Watermark-Free experience, Interactive Google Maps & Directions, auto-generated Location QR Code, Interactive RSVP & attendance tracking, UPI Gift Scanner / QR (direct to your UPI), and Page Insights & WhatsApp Reports."
            />
            <FAQItem 
              question="How do hosting extensions and Lifetime Hosting work?"
              answer="Every newly published page starts with 15 days of hosting. You can extend hosting anytime from your dashboard for ₹14 (+30 days for Basic) or ₹99 (+30 days for Premium). You can also unlock permanent Lifetime Hosting for ₹999 so your page never expires."
            />
            <FAQItem 
              question="Can I upgrade an existing Basic page to Premium?"
              answer="Yes! An existing published Basic page can be converted to Premium anytime by paying a ₹49 upgrade fee. You do not need to buy a whole new page, preserving your original page URL and details while removing the watermark and activating all Pro features."
            />
            <FAQItem 
              question="Can I edit details after publishing?"
              answer="Yes! Text corrections, time updates, and typo fixes on published invites are 100% free and update in real-time. Significant structure changes or converting to a new design can be done effortlessly using 'Copy to New'."
            />
            <FAQItem 
              question="What happens if a page expires or is deleted?"
              answer="When hosting expires, your original URL remains reserved and visitors see a clean 'Page Expired' screen. Extending hosting immediately restores public access. Deleted pages enter a 30-day recovery window before permanent removal."
            />
            <FAQItem 
              question="Can I print my business cards, flyers, and pamphlets?"
              answer="Yes. Eligible published pages can be downloaded as print-ready PDFs and high-resolution images for single-page designs or full-document PDFs for multi-page designs."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-red via-brand-orange to-brand-teal text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold">Ready to create your digital page?</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-white text-stone-900 hover:text-primary rounded-2xl font-bold text-lg sm:text-xl shadow-2xl hover:bg-stone-50 hover:-translate-y-1 transition-all"
            >
              Create Your Site Now
            </button>
            <a 
              href="#pricing"
              className="w-full sm:col-span-1 px-6 sm:px-8 py-4 sm:py-5 bg-stone-900/40 hover:bg-stone-900/60 border border-white/30 text-white rounded-2xl font-bold text-base sm:text-lg transition-all text-center"
            >
              View Plans and Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
            <div className="col-span-1 sm:col-span-2">
              <div className="flex items-center gap-2.5 text-2xl font-serif font-bold text-stone-900 mb-4 sm:mb-6">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-rose-200 shadow-xs bg-white flex items-center justify-center p-0.5">
                  <img 
                    src={koreanHeartLogo} 
                    alt="Yours Lovingly Korean Finger Heart Logo" 
                    className="w-full h-full object-cover rounded-lg" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                Yours Lovingly
              </div>
              <p className="text-stone-500 max-w-sm leading-relaxed text-xs sm:text-sm">
                Design interactive digital invites, smart business cards, event flyers, and portfolios with Google Maps directions, real-time page insights, and print-ready PDF exports.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 sm:mb-6 text-stone-900 uppercase tracking-widest text-xs">Platform</h4>
              <ul className="space-y-3 text-xs sm:text-sm text-stone-500">
                <li><a href="#features" className="hover:text-teal-700 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-teal-700 transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-teal-700 transition-colors">Pricing</a></li>
                <li><a href="#faq" className="hover:text-teal-700 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 sm:mb-6 text-stone-900 uppercase tracking-widest text-xs">Support</h4>
              <ul className="space-y-3 text-xs sm:text-sm text-stone-500">
                <li><a href="#" className="hover:text-red-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-red-600 transition-colors">Privacy Policy</a></li>
                <li><a href="mailto:support@yourslovingly.co.in" className="hover:text-red-600 transition-colors">Support Email</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-stone-100 text-center text-xs sm:text-sm text-stone-400">
            © 2026 Yours Lovingly (yourslovingly.co.in). All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

