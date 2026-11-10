"use client";

import { useEffect, useState } from "react";
import { Mail, Linkedin, Github, MessageSquare, MapPin, Clock, Send, ArrowUpRight, CheckCircle, Play } from "lucide-react";

export default function Contact() {
  const [isVisible, setIsVisible] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("contact");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('success');
    setTimeout(() => setFormStatus('idle'), 3000);
  };

  return (
    <section
      id="contact"
      className="relative py-24 px-6 lg:px-12"
      aria-labelledby="contact-title"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-mint/20 text-sm font-medium text-mint mb-6">
            <span className="w-2 h-2 bg-mint rounded-full animate-pulse" aria-hidden="true" />
            GET IN TOUCH
          </span>
          <h2 id="contact-title" className="text-3xl lg:text-4xl font-bold tracking-tight leading-[1.1] text-white mb-6">
            Let's Fix Your
            <br />
            <span className="text-gradient-mint">Revenue Operations</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Interested in improving lead operations, connecting business applications, or reducing repetitive manual processes? I'd be glad to discuss the operational problem and explore whether automation is the right solution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s' }}>
          <div>
            <h3 className="text-2xl font-bold text-white mb-8">Direct Contact Endpoints</h3>
            
            <div className="space-y-4 mb-10" role="list">
              {[
                { icon: MessageSquare, label: "WhatsApp", value: "+63 951 083 3623", href: "https://wa.me/639510833623", color: "#25D366", desc: "Fastest response — usually within hours" },
                { icon: Mail, label: "Email", value: "kchanchan2357@gmail.com", href: "mailto:kchanchan2357@gmail.com", color: "#D14836", desc: "Detailed project inquiries welcome" },
                { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/kristian-jay-eñaga", href: "https://www.linkedin.com/in/kristian-jay-e%C3%B1aga-85345741a/", color: "#0A66C2", desc: "Professional network & messaging" },
                { icon: Github, label: "GitHub", value: "github.com/kristian-enaga", href: "https://github.com/kristian-enaga", color: "#FFFFFF", desc: "All 10 project repositories" },
              ].map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <a
                    key={index}
                    href={contact.href}
                    target={contact.href.startsWith("http") ? "_blank" : undefined}
                    rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-4 p-5 rounded-xl glass border-white/5 hover:border-white/10 hover:bg-white/5 transition-all duration-500 ease-out focus-ring"
                    role="listitem"
                    aria-label={`${contact.label}: ${contact.value}`}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110" style={{ background: `linear-gradient(135deg, ${contact.color}20, ${contact.color}10)`, border: `1px solid ${contact.color}30` }}>
                      <Icon className="w-5 h-5" style={{ color: contact.color }} aria-hidden="true" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-xs text-subtle uppercase tracking-wider font-medium">{contact.label}</div>
                      <div className="text-white font-medium group-hover:text-mint transition-colors">{contact.value}</div>
                      <div className="text-xs text-muted mt-0.5">{contact.desc}</div>
                    </div>
                    {contact.href.startsWith("http") && (
                      <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-mint transition-colors" aria-hidden="true" />
                    )}
                  </a>
                );
              })}
            </div>

            <div className="pt-8 border-t border-white/5">
              <h4 className="font-semibold text-white mb-4">Availability & Logistics</h4>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full text-xs font-medium text-white/70 glass border-white/10" style={{ background: "rgba(0, 255, 135, 0.1)" }}>
                  <MapPin className="w-3 h-3 mr-1.5 inline" aria-hidden="true" />
                  Zamboanga Sibugay, Philippines
                </span>
                <span className="px-4 py-2 rounded-full text-xs font-medium text-white/70 glass border-white/10" style={{ background: "rgba(6, 182, 212, 0.1)" }}>
                  <Clock className="w-3 h-3 mr-1.5 inline" aria-hidden="true" />
                  UTC+8 (PHT)
                </span>
                <span className="px-4 py-2 rounded-full text-xs font-medium text-white/70 glass border-white/10" style={{ background: "rgba(139, 92, 246, 0.1)" }}>
                  <CheckCircle className="w-3 h-3 mr-1.5 inline" aria-hidden="true" />
                  Immediate Availability
                </span>
                <span className="px-4 py-2 rounded-full text-xs font-medium text-white/70 glass border-white/10" style={{ background: "rgba(245, 158, 11, 0.1)" }}>
                  <ArrowUpRight className="w-3 h-3 mr-1.5 inline" aria-hidden="true" />
                  Wise / Payoneer / Deel Ready
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="glass rounded-2xl p-8 lg:p-10 border-mint/20 h-full">
              <h3 className="text-2xl font-bold text-white mb-6">Start a Conversation</h3>
              
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 rounded-xl glass border-white/10 focus:border-mint/50 focus:ring-2 focus:ring-mint/50 focus:outline-none text-white placeholder:text-muted/50 transition-all duration-300"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-white mb-2">Company</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="w-full px-4 py-3 rounded-xl glass border-white/10 focus:border-mint/50 focus:ring-2 focus:ring-mint/50 focus:outline-none text-white placeholder:text-muted/50 transition-all duration-300"
                      placeholder="Company name (optional)"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-xl glass border-white/10 focus:border-mint/50 focus:ring-2 focus:ring-mint/50 focus:outline-none text-white placeholder:text-muted/50 transition-all duration-300"
                    placeholder="you@company.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white mb-2">What's the operational problem?</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 rounded-xl glass border-white/10 focus:border-mint/50 focus:ring-2 focus:ring-mint/50 focus:outline-none text-white placeholder:text-muted/50 transition-all duration-300 resize-none"
                    placeholder="Describe the bottleneck, manual process, or integration gap you're facing..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'success'}
                  className={`w-full btn-primary focus-ring ${formStatus === 'success' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {formStatus === 'success' ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" aria-hidden="true" />
                      Message Sent — I'll Respond Within 24 Hours
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5 ml-2" aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>

              {formStatus === 'success' && (
                <div className="mt-6 p-4 rounded-xl glass border-mint/30 bg-mint/10" role="alert">
                  <div className="flex items-center gap-3 text-mint">
                    <CheckCircle className="w-5 h-5" aria-hidden="true" />
                    <span className="font-medium">Thanks! I'll review your message and respond within 24 hours.</span>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <a
                  href="https://www.loom.com/share/94749ae3e10d473d85bc6d022a45ef80"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border-white/10 hover:border-mint/30 hover:bg-white/5 transition-all duration-300 text-sm font-medium focus-ring"
                >
                  <Play className="w-5 h-5" aria-hidden="true" />
                  Watch 3-min Self-Intro Walkthrough
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}