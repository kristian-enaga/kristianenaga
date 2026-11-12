"use client";

import { useState } from "react";

interface Skill {
  name: string;
  category: "Automation" | "Frontend" | "AI/ML" | "Database" | "DevOps";
  level: "expert" | "advanced" | "intermediate";
  years: number;
  description: string;
  relatedTools?: string[];
}

const skills: Skill[] = [
  // Automation
  {
    name: "n8n",
    category: "Automation",
    level: "expert",
    years: 3,
    description: "Enterprise workflow automation with custom nodes, error handling, and MCP integration",
    relatedTools: ["Custom Nodes", "MCP", "Webhooks"],
  },
  {
    name: "Make (Integromat)",
    category: "Automation",
    level: "advanced",
    years: 2,
    description: "Complex scenario architecture with routers, iterators, and data stores",
    relatedTools: ["Data Stores", "Webhooks", "API"],
  },
  {
    name: "Clay",
    category: "Automation",
    level: "advanced",
    years: 1,
    description: "Native multi-provider waterfall enrichment with AI ICP modeling",
    relatedTools: ["Waterfall", "AI Enrichment", "ICP"],
  },

  // Frontend
  {
    name: "TypeScript",
    category: "Frontend",
    level: "expert",
    years: 5,
    description: "Strict typing, generics, and advanced type patterns for maintainable code",
    relatedTools: ["React", "Next.js", "Zod"],
  },
  {
    name: "React",
    category: "Frontend",
    level: "expert",
    years: 5,
    description: "Hooks, context, suspense, and server components for modern UIs",
    relatedTools: ["Next.js", "Tailwind", "Framer Motion"],
  },
  {
    name: "Next.js",
    category: "Frontend",
    level: "expert",
    years: 4,
    description: "App Router, Server Components, and static generation for performance",
    relatedTools: ["React", "Vercel", "Turbopack"],
  },
  {
    name: "Tailwind CSS",
    category: "Frontend",
    level: "expert",
    years: 4,
    description: "Utility-first styling with dark mode, animations, and responsive design",
    relatedTools: ["CSS Variables", "JIT", "Plugins"],
  },
  {
    name: "Framer Motion",
    category: "Frontend",
    level: "advanced",
    years: 2,
    description: "Production animations with layout, gestures, and scroll triggers",
    relatedTools: ["Spring", "Drag", "Scroll"],
  },

  // AI/ML
  {
    name: "Gemini",
    category: "AI/ML",
    level: "advanced",
    years: 1,
    description: "Multimodal AI for lead scoring, content generation, and data extraction",
    relatedTools: ["Vertex AI", "Function Calling", "Grounding"],
  },
  {
    name: "OpenAI (GPT-4)",
    category: "AI/ML",
    level: "advanced",
    years: 2,
    description: "LLM integration for email drafting, analysis, and decision making",
    relatedTools: ["Assistants", "Function Calling", "Embeddings"],
  },
  {
    name: "Groq",
    category: "AI/ML",
    level: "intermediate",
    years: 1,
    description: "Ultra-fast inference for real-time AI scoring fallbacks",
    relatedTools: ["Llama", "Mixtral", "Speed"],
  },
  {
    name: "OpenRouter",
    category: "AI/ML",
    level: "advanced",
    years: 1,
    description: "Multi-model routing with automatic fallback and cost optimization",
    relatedTools: ["Model Routing", "Fallback", "Cost Control"],
  },

  // Database
  {
    name: "Supabase (PostgreSQL)",
    category: "Database",
    level: "expert",
    years: 3,
    description: "PostgreSQL with realtime, auth, edge functions, and row-level security",
    relatedTools: ["Realtime", "Edge Functions", "RLS"],
  },
  {
    name: "PostgreSQL",
    category: "Database",
    level: "advanced",
    years: 4,
    description: "Advanced queries, indexing, partitioning, and performance tuning",
    relatedTools: ["CTEs", "Window Functions", "JSONB"],
  },
  {
    name: "Google Sheets",
    category: "Database",
    level: "advanced",
    years: 3,
    description: "Sheets as lightweight CRM with Apps Script automation",
    relatedTools: ["Apps Script", "API", "Pivot Tables"],
  },

  // DevOps
  {
    name: "Vercel",
    category: "DevOps",
    level: "expert",
    years: 3,
    description: "Edge deployment, analytics, preview deployments, and cron jobs",
    relatedTools: ["Edge", "Analytics", "Cron"],
  },
  {
    name: "GitHub Actions",
    category: "DevOps",
    level: "advanced",
    years: 3,
    description: "CI/CD pipelines with matrix builds, caching, and deployment gates",
    relatedTools: ["Workflows", "Secrets", "Environments"],
  },
  {
    name: "Docker",
    category: "DevOps",
    level: "intermediate",
    years: 2,
    description: "Containerization for consistent dev/prod environments",
    relatedTools: ["Compose", "Multi-stage", "BuildKit"],
  },
];

const categoryColors = {
  Automation: { bg: "#F46800", text: "#fff" },
  Frontend: { bg: "#06b6d4", text: "#fff" },
  "AI/ML": { bg: "#8b5cf6", text: "#fff" },
  Database: { bg: "#22c55e", text: "#fff" },
  DevOps: { bg: "#f59e0b", text: "#fff" },
};

const levelStyles = {
  expert: { label: "Expert", color: "#00ff87", bg: "rgba(0, 255, 135, 0.15)" },
  advanced: { label: "Advanced", color: "#06b6d4", bg: "rgba(6, 182, 212, 0.15)" },
  intermediate: { label: "Intermediate", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)" },
};

export default function SkillsTagCloud() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Automation", "Frontend", "AI/ML", "Database", "DevOps"];

  const filteredSkills = skills.filter((skill) => {
    const matchesCategory = selectedCategory === "All" || skill.category === selectedCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section className="py-16 px-6 lg:px-12" aria-labelledby="skills-title">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h2 id="skills-title" className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-4">
            Technical
            <br />
            <span className="text-gradient-mint">Skill Stack</span>
          </h2>
          <p className="text-muted max-w-2xl">
            20+ production-grade skills across 5 categories. Hover any skill for details, filter by category, or search.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search skills... (e.g. n8n, TypeScript, AI)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 pl-12 rounded-xl glass border-white/10 focus:border-mint/50 focus:ring-2 focus:ring-mint/50 focus:outline-none text-white placeholder:text-muted/50 transition-all duration-300"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === cat
                    ? "text-background bg-mint shadow-[0_0_20px_rgba(0,255,135,0.4)]"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="space-y-10">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => {
            const color = categoryColors[category as keyof typeof categoryColors] || categoryColors.Automation;
            return (
              <div key={category} className="animate-fade-in">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color.bg}20`, border: `1px solid ${color.bg}40` }}>
                    <span className="text-[14px] font-bold" style={{ color: color.bg }}>{category.slice(0, 3).toUpperCase()}</span>
                  </span>
                  <span>{category}</span>
                  <span className="text-xs font-medium text-white/40 uppercase tracking-wider ml-2 px-2 py-0.5 rounded" style={{ background: `${color.bg}20`, border: `1px solid ${color.bg}40` }}>
                    {categorySkills.length} skills
                  </span>
                </h3>

                <div className="flex flex-wrap gap-3">
                  {categorySkills.map((skill) => {
                    const level = levelStyles[skill.level];
                    const isHovered = hoveredSkill === skill.name;
                    
                    return (
                      <div
                        key={skill.name}
                        className="group relative flex-shrink-0"
                        onMouseEnter={() => setHoveredSkill(skill.name)}
                        onMouseLeave={() => setHoveredSkill(null)}
                      >
                        <button
                          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                            isHovered
                              ? "ring-2 shadow-xl z-10"
                              : "hover:ring-1"
                          }`}
                          style={{
                            background: isHovered ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                            borderColor: isHovered ? color.bg : "rgba(255,255,255,0.05)",
                            borderWidth: "1px",
                            borderStyle: "solid",
                          }}
                          onMouseEnter={() => setHoveredSkill(skill.name)}
                          onMouseLeave={() => setHoveredSkill(null)}
                          onFocus={() => setHoveredSkill(skill.name)}
                          onBlur={() => setHoveredSkill(null)}
                        >
                          <span className="font-semibold text-white" style={{ color: isHovered ? color.bg : "inherit" }}>
                            {skill.name}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${isHovered ? "opacity-100" : "opacity-70"}`} style={{ background: level.bg, color: level.color, border: `1px solid ${level.color}40` }}>
                            {level.label}
                          </span>
                        </button>

                        {/* Hover Tooltip */}
                        {isHovered && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 px-4 py-3 rounded-xl glass-strong border-white/10 text-left z-50 animate-fade-in">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <div className="font-bold text-white text-sm">{skill.name}</div>
                                <div className="text-xs text-muted">Yrs Experience: {skill.years}+</div>
                              </div>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider" style={{ background: `${color.bg}20`, color: color.bg, border: `1px solid ${color.bg}40` }}>
                                {skill.category}
                              </span>
                            </div>
                            <p className="text-sm text-white/90 leading-relaxed mb-3">{skill.description}</p>
                            {skill.relatedTools && skill.relatedTools.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                <span className="text-xs text-muted">Related:</span>
                                {skill.relatedTools.map((tool, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded text-[10px] font-medium text-white/70" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                    {tool}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-6 border-transparent border-t-white/10" aria-hidden="true" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Total Skills", value: skills.length },
              { label: "Expert Level", value: skills.filter(s => s.level === "expert").length },
              { label: "Categories", value: 5 },
              { label: "Years Exp (Avg)", value: Math.round(skills.reduce((a, b) => a + b.years, 0) / skills.length) },
              { label: "Automation Focus", value: skills.filter(s => s.category === "Automation").length },
            ].map((stat, i) => (
              <div key={stat.label} className="text-center p-4 rounded-xl glass border-white/5 hover:border-mint/20 transition-all duration-500">
                <div className="text-3xl font-bold text-white mb-1" style={{ background: "linear-gradient(135deg, #00ff87, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}