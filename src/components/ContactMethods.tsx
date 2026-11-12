"use client";

import { useState } from "react";
import { MessageSquare, Mail, Linkedin, Github, Calendar, Download, ExternalLink } from "lucide-react";

interface ContactMethod {
  id: string;
  label: string;
  value: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  analyticsEvent: string;
  external?: boolean;
}

const contactMethods: ContactMethod[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    value: "+63 951 083 3623",
    href: "https://wa.me/639510833623",
    icon: <MessageSquare className="w-5 h-5" aria-hidden="true" />,
    color: "#25D366",
    description: "Fastest response — usually within hours",
    analyticsEvent: "contact_whatsapp_click",
    external: true,
  },
  {
    id: "email",
    label: "Email",
    value: "kchanchan2357@gmail.com",
    href: "mailto:kchanchan2357@gmail.com",
    icon: <Mail className="w-5 h-5" aria-hidden="true" />,
    color: "#D14836",
    description: "Detailed project inquiries welcome",
    analyticsEvent: "contact_email_click",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/kristian-jay-eñaga",
    href: "https://www.linkedin.com/in/kristian-jay-e%C3%B1aga-85345741a/",
    icon: <Linkedin className="w-5 h-5" aria-hidden="true" />,
    color: "#0A66C2",
    description: "Professional network & messaging",
    analyticsEvent: "contact_linkedin_click",
    external: true,
  },
  {
    id: "github",
    label: "GitHub",
    value: "github.com/kristian-enaga",
    href: "https://github.com/kristian-enaga",
    icon: <Github className="w-5 h-5" aria-hidden="true" />,
    color: "#FFFFFF",
    description: "All 10+ project repositories",
    analyticsEvent: "contact_github_click",
    external: true,
  },
  {
    id: "calendly",
    label: "Book a Call",
    value: "30-min Free Audit",
    href: "#",
    icon: <Calendar className="w-5 h-5" aria-hidden="true" />,
    color: "#00ff87",
    description: "Schedule a free 30-min automation audit",
    analyticsEvent: "contact_calendly_click",
  },
  {
    id: "resume",
    label: "Download CV",
    value: "PDF Resume",
    href: "/resume.pdf",
    icon: <Download className="w-5 h-5" aria-hidden="true" />,
    color: "#f59e0b",
    description: "Download PDF resume",
    analyticsEvent: "contact_resume_download",
  },
];

export default function ContactMethods() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const trackEvent = (eventName: string, methodId: string) => {
    // Vercel Analytics event tracking
    if (typeof window !== "undefined" && (window as any).va) {
      (window as any).va("track", eventName, {
        method: methodId,
        timestamp: new Date().toISOString(),
        path: window.location.pathname,
      });
    }
    
    // Fallback to console for debugging
    if (process.env.NODE_ENV === "development") {
      console.log(`[Analytics] ${eventName}`, { method: methodId });
    }
  };

  const handleClick = (method: ContactMethod, e: React.MouseEvent<HTMLAnchorElement>) => {
    trackEvent(method.analyticsEvent, method.id);
    
    // For Calendly, prevent default and show modal/alert
    if (method.id === "calendly") {
      e.preventDefault();
      alert("Calendly integration coming soon! For now, please use WhatsApp or Email to schedule a free audit.");
    }
    
    // Don't prevent default for actual links
  };

  return (
    <section className="py-16 px-6 lg:px-12" aria-labelledby="contact-methods-title">
      <div className="max-w-7xl mx-auto">
        <h2 id="contact-methods-title" className="sr-only">Contact Methods</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            const isHovered = hoveredId === method.id;
            
            return (
              <a
                key={method.id}
                href={method.href}
                target={method.external ? "_blank" : undefined}
                rel={method.external ? "noopener noreferrer" : undefined}
                onClick={(e) => handleClick(method, e)}
                onMouseEnter={() => setHoveredId(method.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative flex items-start gap-4 p-5 rounded-2xl glass border-white/5 transition-all duration-300 hover:border-white/10 hover:bg-white/5 focus-ring"
                aria-label={`${method.label}: ${method.value}`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${method.color}20, ${method.color}10)`,
                    border: `1px solid ${method.color}30`,
                  }}
                >
                  <span style={{ color: method.color }}>{Icon}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-subtle uppercase tracking-wider font-medium">{method.label}</span>
                    {method.id === "calendly" && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium text-white/90 bg-mint/20 text-mint border border-mint/30">
                        FREE
                      </span>
                    )}
                    {method.id === "resume" && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium text-white/90 bg-amber/20 text-amber-400 border border-amber/30">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="text-white font-medium group-hover:text-mint transition-colors truncate">{method.value}</div>
                  <div className="text-xs text-muted/70 mt-0.5 truncate">{method.description}</div>
                </div>
                
                {method.external && (
                  <ExternalLink className="w-5 h-5 text-muted group-hover:text-mint transition-colors flex-shrink-0 mt-1" aria-hidden="true" />
                )}
                
                {/* Hover tooltip */}
                {isHovered && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-background/95 backdrop-blur-sm border border-white/10 whitespace-nowrap opacity-100 transition-opacity duration-200 z-10">
                    Click to {method.id === "calendly" ? "schedule" : method.id === "resume" ? "download" : "open"} {method.label}
                  </div>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}