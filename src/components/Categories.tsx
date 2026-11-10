"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, CheckCircle, Zap, Shield, Brain, Database, Globe, Terminal, Layers, Cloud, ArrowUpRight, Play, Github, ExternalLink } from "lucide-react";

const categories = [
  {
    id: "revenue",
    label: "Revenue Operations & CRM Automation",
    description: "Improve lead capture, data quality, qualification, routing, and sales follow-up operations.",
    color: "#ef4444",
    bgGradient: "from-red/10 to-red/5",
    borderColor: "border-red/20",
    icon: Zap,
    projects: [
      { number: "01", title: "Inbound Lead Sanitizer & Outreach Engine", repo: "https://github.com/kristian-enaga/Inbound-Lead-Sanitizer-Engine", demo: "https://www.loom.com/share/c38d37d65eed44129a712e530a8e2446" },
      { number: "02", title: "Fault-Tolerant Lead Triage Pipeline", repo: "https://github.com/kristian-enaga/fault-tolerant-lead-triage-pipeline", demo: "https://www.loom.com/share/5d9a49197b574216894cc00822f0069f" },
      { number: "03", title: "AI Lead Scoring & Priority Router", repo: "https://github.com/kristian-enaga/AI-Lead-Scoring-Router", demo: "https://www.loom.com/share/38164c8a840f4076b3ac0ec62a26e3ce" },
      { number: "04", title: "Speed-to-Lead Ingestion Engine", repo: "https://github.com/kristian-enaga/Speed-to-lead-ingestion-engine", demo: "https://www.loom.com/share/707c78cf35df44a4adf3ee1a04d75b57" },
    ],
  },
  {
    id: "gtm",
    label: "GTM Intelligence & Prospecting",
    description: "Automate company research, prospect enrichment, opportunity discovery, and outbound preparation.",
    color: "#06b6d4",
    bgGradient: "from-cyan/10 to-cyan/5",
    borderColor: "border-cyan/20",
    icon: Globe,
    projects: [
      { number: "05", title: "B2B Outbound Prospecting Engine", repo: "https://github.com/kristian-enaga/Automated-B2B-Outbound-System", demo: "https://www.loom.com/share/5d3416feda7148bbbd60704ab9b5976e" },
      { number: "06", title: "Market Intelligence & B2B Lead Waterfall", repo: "https://github.com/kristian-enaga/autonomous-market-intelligence-engine", demo: "https://www.loom.com/share/7792580657284a58a7e1dabf99365087" },
      { number: "07", title: "Native Clay Multi-Provider Lead Waterfall", repo: "https://github.com/kristian-enaga/native-clay-multi-year-waterfall-engine/blob/main/README.md", demo: "https://www.loom.com/share/149144121b134f38b4d0752c959ef02" },
    ],
  },
  {
    id: "process",
    label: "Business Process Automation & Reliability",
    description: "Reduce repetitive finance and e-commerce operations while improving workflow visibility and exception handling.",
    color: "#f59e0b",
    bgGradient: "from-amber/10 to-amber/5",
    borderColor: "border-amber/20",
    icon: Terminal,
    projects: [
      { number: "08", title: "AP Invoice Reconciliation & Exception Protection", repo: "https://github.com/kristian-enaga/enterprise-ap-invoice-reconciliation-engine", demo: "https://www.loom.com/share/595e7e48d6ab4a1f89263d23496f9d67" },
      { number: "09", title: "E-Commerce Revenue Recovery Engine", repo: "https://github.com/kristian-enaga/autonomous-revenue-recovery-engine", demo: "https://www.loom.com/share/311bfc94eee1429080f6fe5ed3cf62c0" },
      { number: "10", title: "Centralized n8n Error Handler", repo: "https://github.com/kristian-enaga/n8n-Centralized-Error-Handler", demo: "https://www.loom.com/share/ea1602f3bd8a4086983c96590e49136f" },
    ],
  },
];

export default function Categories() {
  const [visibleCategories, setVisibleCategories] = useState<Set<number>>(new Set());
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const index = parseInt(target.dataset.index || "0");
            setVisibleCategories((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll('[data-cat-index]').forEach((el) => {
      observerRef.current?.observe(el as HTMLElement);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <section
      id="categories"
      className="relative py-24 sm:py-32 lg:py-40 px-6 lg:px-12"
      aria-labelledby="categories-title"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-cyan/20 text-sm font-medium text-cyan mb-6">
            <span className="w-2 h-2 bg-cyan rounded-full animate-pulse" aria-hidden="true" />
            BUSINESS CATEGORIES
          </span>
          <h2 id="categories-title" className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white mb-6">
            Organized by
            <br />
            <span className="text-gradient-cyan">Business Impact</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Three categories addressing distinct operational problems. Each project includes full source code, architecture diagrams, and a Loom walkthrough.
          </p>
        </div>

        <div className="space-y-8">
          {categories.map((category, catIndex) => {
            const Icon = category.icon;
            const isVisible = visibleCategories.has(catIndex);
            const isExpanded = expandedCategory === category.id;
            return (
              <article
                key={category.id}
                data-cat-index={catIndex}
                className={`relative card-hover glass rounded-2xl overflow-hidden transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                } ${category.borderColor}`}
                style={{ 
                  transitionDelay: `${catIndex * 100}ms`,
                  background: `linear-gradient(135deg, ${category.bgGradient})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[${category.color}]/5 to-transparent" aria-hidden="true" />
                
                <div className="relative z-10 p-8 lg:p-10">
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${category.color}20, ${category.color}10)`, border: `1px solid ${category.color}30` }}>
                        <Icon className="w-8 h-8" style={{ color: category.color }} aria-hidden="true" />
                      </div>
                      <div>
                        <span className="text-xs font-medium uppercase tracking-wider text-muted mb-1 block">Category</span>
                        <h3 className="text-2xl lg:text-3xl font-bold text-white">{category.label}</h3>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg glass border-white/10 hover:border-mint/30 hover:bg-white/5 transition-all duration-300 text-sm font-medium focus-ring"
                      aria-expanded={isExpanded}
                      aria-controls={`category-${category.id}-projects`}
                    >
                      {isExpanded ? "Show Less" : "Explore Projects"}
                      <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} aria-hidden="true" />
                    </button>
                  </div>

                  <p className="text-muted/80 leading-relaxed mb-8 max-w-3xl">{category.description}</p>

                  <div
                    id={`category-${category.id}-projects`}
                    className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-500 ease-out ${
                      isExpanded ? "opacity-100 max-h-[2000px]" : "opacity-0 max-h-0 overflow-hidden"
                    }`}
                    role="list"
                  >
                    {category.projects.map((project, pIndex) => (
                      <article
                        key={project.number}
                        className="relative card-hover glass rounded-xl p-5 transition-all duration-300 border-white/5 hover:border-mint/20"
                        role="listitem"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <span className="text-lg font-bold text-white/10">SYSTEM {project.number}</span>
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, ${category.color}20, ${category.color}10)`, border: `1px solid ${category.color}30` }}>
                            <Zap className="w-4 h-4" style={{ color: category.color }} aria-hidden="true" />
                          </div>
                        </div>
                        <h4 className="font-semibold text-white mb-3 leading-tight">{project.title}</h4>
                        <div className="flex items-center gap-3">
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/70 glass border-white/10 hover:border-mint/30 hover:bg-white/5 transition-all duration-300"
                          >
                            <Play className="w-3.5 h-3.5" aria-hidden="true" />
                            Demo
                          </a>
                          <a
                            href={project.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/70 glass border-white/10 hover:border-mint/30 hover:bg-white/5 transition-all duration-300"
                          >
                            <Github className="w-3.5 h-3.5" aria-hidden="true" />
                            Code
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>

                  {isExpanded && (
                    <div className="mt-8 pt-8 border-t border-white/5">
                      <h5 className="font-semibold text-white mb-4">Key Capabilities Demonstrated</h5>
                      <div className="flex flex-wrap gap-3">
                        {category.projects.flatMap(p => [
                          "AI-Assisted Processing",
                          "Exception Handling",
                          "Human-in-the-Loop",
                          "CRM Integration",
                          "Multi-Model Fallback",
                          "Audit Trails",
                        ]).slice(0, 6).map((cap, i) => (
                          <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium text-white/70 glass border-white/10" style={{ background: `linear-gradient(135deg, ${category.color}15, ${category.color}05)` }}>
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}