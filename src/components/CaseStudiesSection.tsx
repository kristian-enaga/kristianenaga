"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle, BarChart2, TrendingUp, Clock, Zap, Database, Users, DollarSign, ExternalLink } from "lucide-react";

interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  outcome: string;
  metric: string;
  metricValue: string;
  description: string;
  technologies: string[];
  systemId: string; // Links to ProjectSection system
  icon: React.ReactNode;
  color: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: "case-1",
    title: "Lead Sanitization & Scoring",
    industry: "RevOps / SaaS",
    outcome: "Reduced manual data cleanup from 2 hours to 5 minutes per lead",
    metric: "96% time reduction",
    metricValue: "2h → 5min",
    description: "Built an end-to-end inbound lead pipeline that captures every submission, normalizes phone numbers to E.164, filters bots with behavioral analysis, scores lead quality with AI, and pushes only clean, qualified records into HubSpot automatically with idempotency keys.",
    technologies: ["n8n", "Supabase", "Gemini", "HubSpot", "Zod"],
    systemId: "01",
    icon: <Zap className="w-5 h-5" aria-hidden="true" />,
    color: "#dc2626",
  },
  {
    id: "case-2",
    title: "E-Commerce Revenue Recovery",
    industry: "E-Commerce / DTC",
    outcome: "Recovered $50K+ ARR from abandoned carts in first quarter",
    metric: "23% recovery rate",
    metricValue: "$50K ARR",
    description: "Implemented a Make-based automation with stateful delay gates that tracks cart abandonment, applies smart delays, verifies purchase status before each follow-up, generates AI-written recovery emails, and sends via Gmail only when the customer hasn't purchased. Zero duplicate nudges to converted customers.",
    technologies: ["Make", "Supabase", "Gemini", "Gmail", "Stateful Delays"],
    systemId: "09",
    icon: <DollarSign className="w-5 h-5" aria-hidden="true" />,
    color: "#f59e0b",
  },
  {
    id: "case-3",
    title: "B2B Outbound at Scale",
    industry: "B2B Sales / Agency",
    outcome: "3x qualified pipeline increase with 40% less rep research time",
    metric: "3x pipeline growth",
    metricValue: "15min → 30sec",
    description: "Deployed an autonomous outbound system that discovers target companies via Apify, scrapes intelligence, writes hyper-personalized outreach emails with AI, routes for human approval via Slack, and dispatches with rate limiting. Research time dropped from 15 minutes to under 30 seconds per prospect. Full compliance logging included.",
    technologies: ["Apify", "Gemini", "Gmail", "Slack", "n8n"],
    systemId: "05",
    icon: <TrendingUp className="w-5 h-5" aria-hidden="true" />,
    color: "#8b5cf6",
  },
];

export default function CaseStudiesSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("case-studies");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="case-studies"
      className="relative py-16 px-6 lg:px-12"
      aria-labelledby="case-studies-title"
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`text-center mb-12 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-amber/20 text-sm font-medium text-amber-400 mb-6">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" aria-hidden="true" />
            CASE STUDIES
          </span>
          <h2 id="case-studies-title" className="text-3xl lg:text-4xl font-bold tracking-tight leading-[1.1] text-white mb-4">
            Measurable
            <br />
            <span className="text-gradient-cyan">Business Impact</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Real outcomes from production automations. Each case study links to the full system breakdown in the Working Systems section.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {caseStudies.map((study, index) => {
            const staggerDelay = index * 0.08;
            return (
              <article
                key={study.id}
                role="listitem"
                className={`relative rounded-2xl p-5 lg:p-6 overflow-hidden transition-all duration-500 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                }`}
                style={{
                  transitionDelay: `${index * 80}ms`,
                  transitionDuration: '500ms',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  border: `1px solid ${study.color}30`,
                  background: `linear-gradient(145deg, ${study.color}15, ${study.color}08, ${study.color}05)`,
                  boxShadow: `0 0 20px ${study.color}10, inset 0 1px 0 rgba(255,255,255,0.06)`,
                }}
              >
                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: `linear-gradient(90deg, ${study.color}40, ${study.color}10)` }}
                  aria-hidden="true"
                />

                <div className="relative z-10">
                  {/* Header with industry & icon */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${study.color}20, ${study.color}10)`, border: `1px solid ${study.color}30` }}>
                        {study.icon}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-white/40 tracking-wider uppercase">{study.industry}</span>
                        <h3 className="text-lg font-bold text-white leading-tight mt-0.5">{study.title}</h3>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded text-[10px] font-medium text-white/90 backdrop-blur-sm" style={{ background: `linear-gradient(135deg, ${study.color}30, ${study.color}15)`, border: `1px solid ${study.color}40` }}>
                      System {study.systemId}
                    </span>
                  </div>

                  {/* Primary Metric - Prominent */}
                  <div className="mb-4 p-4 rounded-xl" style={{ background: `linear-gradient(135deg, ${study.color}18, ${study.color}08)`, border: `1px solid ${study.color}30` }}>
                    <div className="flex items-baseline justify-between gap-4">
                      <div>
                        <div className="text-xs font-medium text-white/60 uppercase tracking-wider mb-1">Key Metric</div>
                        <div className="text-2xl lg:text-3xl font-bold text-white" style={{ color: study.color }}>
                          {study.metricValue}
                        </div>
                        <div className="text-xs text-white/70 mt-0.5">{study.metric}</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 text-white/80 text-sm">
                          <BarChart2 className="w-4 h-4" style={{ color: study.color }} aria-hidden="true" />
                          <span>Verified Outcome</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Outcome Statement */}
                  <p className="text-white/95 leading-relaxed text-base mb-4" style={{ fontWeight: 500 }}>
                    {study.outcome}
                  </p>

                  {/* Description */}
                  <p className="text-muted/80 leading-relaxed text-sm mb-5 line-clamp-3">
                    {study.description}
                  </p>

                  {/* Technologies */}
                  <div className="mb-5 flex flex-wrap gap-1.5" role="list" aria-label="Technologies">
                    {study.technologies.slice(0, 5).map((t, i) => (
                      <span key={i} className="px-2 py-1 rounded text-[10px] font-medium text-white/85 backdrop-blur-sm transition-all duration-300 hover:scale-105" style={{ background: `linear-gradient(135deg, ${study.color}20, ${study.color}10)`, border: `1px solid ${study.color}30` }}>
                        {t}
                      </span>
                    ))}
                    {study.technologies.length > 5 && (
                      <span className="px-2 py-1 rounded text-[10px] font-medium text-white/60 backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        +{study.technologies.length - 5} more
                      </span>
                    )}
                  </div>

                  {/* CTA - Links to system details */}
                  <div className="pt-4 border-t border-white/8">
                    <a
                      href={`#projects`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white glass backdrop-blur-sm transition-all duration-300 ease-out group hover:scale-[1.02]"
                      style={{ background: `linear-gradient(135deg, ${study.color}15, ${study.color}08)`, border: `1px solid ${study.color}25` }}
                      onClick={(e) => {
                        e.preventDefault();
                        // Scroll to projects and trigger system card
                        const target = document.getElementById('projects');
                        if (target) {
                          target.scrollIntoView({ behavior: 'smooth' });
                          // Could dispatch custom event to open specific system
                          setTimeout(() => {
                            const systemCard = document.querySelector(`[data-card-index="${parseInt(study.systemId) - 1}"]`);
                            if (systemCard) {
                              (systemCard as HTMLElement).click();
                            }
                          }, 500);
                        }
                      }}
                    >
                      <span>View System Details</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA to all systems */}
        <div
          className={`mt-12 text-center transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
          style={{ transitionDelay: `${caseStudies.length * 100}ms` }}
        >
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass border-mint/30 bg-mint/10 text-mint font-semibold text-base hover:bg-mint/20 transition-all duration-300 focus-ring"
            onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }); }}
          >
            Explore All 10+ Production Systems
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}