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
        <h1 id="hero-title" className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.02] text-white mb-6">
          Automation That Fixes
          <br />
          <span className="text-gradient-mint">Daily Operations</span>
          <br />
          At The Source
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl text-muted max-w-3xl mx-auto mb-8 leading-relaxed">
          I build automation systems that eliminate manual data entry, reduce errors, free up staff time, and speed up repeat operations. Four production-grade GTM stages. Zero silent failures.
        </p>
      </div>
    </section>
  ),
});

export default function HeroCanvasWrapper() {
  return <HeroCanvas />;
}