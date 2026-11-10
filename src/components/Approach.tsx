"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, CheckCircle, Zap, Shield, Brain, Database, Globe, Terminal, Layers, Cloud, ArrowUpRight, Target, Zap as ZapIcon, Users, Clock, Globe as GlobeIcon } from "lucide-react";

const stages = [
  {
    number: "01",
    title: "Discovery",
    desc: "Understand the existing business process, tools, team structure, and operational bottlenecks through stakeholder interviews and system audits.",
    icon: Target,
    color: "#06b6d4",
  },
  {
    number: "02",
    title: "Process Analysis",
    desc: "Map the current workflow, identify repetitive work, data quality issues, integration gaps, and failure points that impact revenue or efficiency.",
    icon: Brain,
    color: "#00ff87",
  },
  {
    number: "03",
    title: "System Design",
    desc: "Define workflow logic, data requirements, integration architecture, error handling strategy, and human approval gates. Produce technical specification.",
    icon: Layers,
    color: "#8b5cf6",
  },
  {
    number: "04",
    title: "Development",
    desc: "Build end-to-end solution in n8n/Make/Clay with proper validation, normalization, fallback logic, and comprehensive test scenarios.",
    icon: Terminal,
    color: "#f59e0b",
  },
  {
    number: "05",
    title: "Reliability Hardening",
    desc: "Add input validation, exception handling, monitoring, alerting, human approval gates, idempotency keys, and dead-letter queues.",
    icon: Shield,
    color: "#ef4444",
  },
  {
    number: "06",
    title: "Handover & Documentation",
    desc: "Deliver complete workflow documentation, operational runbooks, troubleshooting guides, and knowledge transfer sessions for the team.",
    icon: Globe,
    color: "#06b6d4",
  },
];

const engagement = [
  { icon: GlobeIcon, title: "Remote-First", desc: "Asynchronous communication with scheduled overlap for your timezone" },
  { icon: ZapIcon, title: "Project-Based", desc: "Fixed-scope pilots, contract work, or longer-term collaboration" },
  { icon: Users, title: "International", desc: "Experienced with cross-border teams, Wise/Payoneer/Deel payments" },
  { icon: Clock, title: "UTC+8 (Philippines)", desc: "Overlap with APAC, EMEA, and US West Coast business hours" },
];

const principles = [
  { title: "Process First", desc: "Understand the business bottleneck before choosing a tool. Tool selection follows process analysis." },
  { title: "Data Integrity", desc: "Validate and normalize at the ingestion boundary. Never trust external payloads." },
  { title: "Design for Failure", desc: "External APIs, services, and workflows will fail. Build observability and recovery in from day one." },
  { title: "Human Judgment", desc: "Important decisions (outbound, financial) require approval gates. Automation augments, doesn't replace." },
  { title: "Observable by Default", desc: "Errors are visible, traceable, and actionable. Centralized logging with debug links." },
  { title: "Evidence Over Claims", desc: "Implementation artifacts, test scenarios, and recorded demos matter more than impressive terminology." },
];

export default function Approach() {
  const [visibleStages, setVisibleStages] = useState<Set<number>>(new Set());
  const [visibleEngagement, setVisibleEngagement] = useState<Set<number>>(new Set());
  const [visiblePrinciples, setVisiblePrinciples] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const index = parseInt(target.dataset.index || "0");
            const type = target.dataset.type;
            if (type === "stage") {
              setVisibleStages((prev) => new Set([...prev, index]));
            } else if (type === "engagement") {
              setVisibleEngagement((prev) => new Set([...prev, index]));
            } else if (type === "principle") {
              setVisiblePrinciples((prev) => new Set([...prev, index]));
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll('[data-type="stage"][data-index]').forEach((el) => {
      observerRef.current?.observe(el as HTMLElement);
    });
    document.querySelectorAll('[data-type="engagement"][data-index]').forEach((el) => {
      observerRef.current?.observe(el as HTMLElement);
    });
    document.querySelectorAll('[data-type="principle"][data-index]').forEach((el) => {
      observerRef.current?.observe(el as HTMLElement);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <section
      id="approach"
      className="relative py-24 px-6 lg:px-12"
      aria-labelledby="approach-title"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-amber/20 text-sm font-medium text-amber-400 mb-6">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" aria-hidden="true" />
            HOW I WORK
          </span>
          <h2 id="approach-title" className="text-3xl lg:text-4xl font-bold tracking-tight leading-[1.1] text-white mb-6">
            Process-First
            <br />
            <span className="text-gradient-cyan">Engineering Approach</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            The best automation starts with understanding the business process, not choosing a tool. Six stages from discovery to handover.
          </p>
        </div>

        <div className="space-y-8 mb-20">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isVisible = visibleStages.has(index);
            const isLast = index === stages.length - 1;
            return (
              <article
                key={stage.number}
                data-type="stage"
                data-index={index}
                className={`relative flex gap-6 transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${stage.color}20, ${stage.color}10)`, border: `1px solid ${stage.color}30` }}>
                    <Icon className="w-7 h-7" style={{ color: stage.color }} aria-hidden="true" />
                  </div>
                  {!isLast && (
                    <div className="absolute left-7 top-16 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[${stage.color}]/30 to-transparent" aria-hidden="true" />
                  )}
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-white/10">{stage.number}</span>
                    <h3 className="text-xl font-bold text-white">{stage.title}</h3>
                  </div>
                  <p className="text-muted/80 leading-relaxed ml-10">{stage.desc}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="glass rounded-2xl p-8 lg:p-10 border-mint/20 mb-16">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Engagement Model</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {engagement.map((item, index) => {
              const Icon = item.icon;
              const isVisible = visibleEngagement.has(index);
              return (
                <div
                  key={item.title}
                  data-type="engagement"
                  data-index={index}
                  className={`relative card-hover glass rounded-xl p-6 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: `${index * 60}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `linear-gradient(135deg, rgba(0, 255, 135, 0.15), rgba(6, 182, 212, 0.15))`, border: "1px solid rgba(0, 255, 135, 0.2)" }}>
                    <Icon className="w-6 h-6" style={{ color: "#00ff87" }} aria-hidden="true" />
                  </div>
                  <h4 className="font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-muted/80">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass rounded-2xl p-8 lg:p-10 border-mint/20 mb-16">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Engineering Philosophy</h3>
          <blockquote className="text-xl lg:text-2xl text-white/90 leading-relaxed text-center max-w-3xl mx-auto mb-12">
            "An automation workflow should be designed for the conditions in which it can fail, not only the conditions in which it succeeds."
          </blockquote>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((principle, index) => {
              const isVisible = visiblePrinciples.has(index);
              return (
                <div
                  key={principle.title}
                  data-type="principle"
                  data-index={index}
                  className={`relative card-hover glass rounded-xl p-6 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: `${index * 60}ms` }}
                >
                  <CheckCircle className="w-5 h-5 text-mint mb-3" aria-hidden="true" />
                  <h4 className="font-bold text-white mb-2">{principle.title}</h4>
                  <p className="text-sm text-muted/80">{principle.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass border-mint/30 bg-mint/10 text-mint font-semibold text-base hover:bg-mint/20 transition-all duration-300 focus-ring"
            onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
          >
            Start a Conversation
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}