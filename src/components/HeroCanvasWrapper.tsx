"use client";

import dynamic from "next/dynamic";

const HeroCanvas = dynamic(() => import("@/components/HeroCanvas").then(mod => mod.default), {
  ssr: false,
  loading: () => (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden" aria-labelledby="hero-title">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-background opacity-70" />
        <div className="absolute top-1/5 left-1/10 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/5 right-1/8 w-[450px] h-[450px] bg-amber-600/5 rounded-full blur-[200px]" />
      </div>
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-red-500/20 mb-6">
          <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" aria-hidden="true" />
          <span className="text-sm font-medium text-red-400">Solving daily business operations</span>
        </div>
        
        {/* Available for Work Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium mb-6 animate-fade-in">
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" aria-hidden="true" />
          Available for Contract / Full-time · Remote · APAC/EMEA/US West
        </div>
        
        <h1 id="hero-title" className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.02] text-white mb-6 animate-slide-up">
          I Build Automations That Stop Manual Data Entry,
          <br />
          <span className="text-gradient-mint">Reduce Errors</span>,
          <br />
          And Fill Your Pipeline
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl text-muted max-w-3xl mx-auto mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
          So you can stop busy-work and start selling. 10 production-grade GTM systems. Zero silent failures.
        </p>
        
        {/* Email Capture CTA */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <EmailCaptureTrigger />
        </div>
      </div>
    </section>
  ),
});

// Email Capture Trigger Component
function EmailCaptureTrigger() {
  return (
    <button
      className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border-mint/30 bg-mint/10 text-mint font-semibold text-base hover:bg-mint/20 transition-all duration-300 focus-ring"
      onClick={() => {
        const event = new CustomEvent('open-email-capture');
        window.dispatchEvent(event);
      }}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      Get Automation Insights — Free Monthly Email
    </button>
  );
}

export default function HeroCanvasWrapper() {
  return <HeroCanvas />;
}