"use client";

import { useState, useEffect, useRef } from "react";
import { X, MessageSquare, Mail, Linkedin, Github, ArrowUpRight, Send, Loader2, CheckCircle, ExternalLink, Zap, Shield, Globe } from "lucide-react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/your-form-id";

export default function BottomSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [activeTab, setActiveTab] = useState<'contact' | 'links'>('contact');
  const sheetRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);

  // Listen for trigger events from header, hero, etc.
  useEffect(() => {
    const handleOpen = () => {
      setIsAnimating(true);
      setIsOpen(true);
      // Reset animation state after transition
      setTimeout(() => setIsAnimating(false), 400);
    };
    const handleClose = () => closeSheet();
    
    window.addEventListener('open-bottom-sheet', handleOpen);
    window.addEventListener('close-bottom-sheet', handleClose);
    
    return () => {
      window.removeEventListener('open-bottom-sheet', handleOpen);
      window.removeEventListener('close-bottom-sheet', handleClose);
    };
  }, []);

  // Handle swipe to close on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    currentYRef.current = startYRef.current;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentYRef.current = e.touches[0].clientY;
    const deltaY = currentYRef.current - startYRef.current;
    
    // Only allow dragging down (positive delta)
    if (deltaY > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${deltaY}px)`;
      sheetRef.current.style.transition = 'none';
    }
  };

  const handleTouchEnd = () => {
    const deltaY = currentYRef.current - startYRef.current;
    
    if (sheetRef.current) {
      sheetRef.current.style.transition = 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)';
      
      if (deltaY > 100) {
        // Swipe down far enough to close
        closeSheet();
      } else {
        // Snap back
        sheetRef.current.style.transform = 'translateY(0)';
      }
    }
  };

  const closeSheet = () => {
    if (formStatus !== 'idle') return;
    setIsAnimating(true);
    setIsOpen(false);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');

    const data = { ...formData, _subject: 'Bottom Sheet Contact Form' };

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => {
          setFormStatus('idle');
          closeSheet();
        }, 3000);
      } else {
        throw new Error('Formspree submission failed');
      }
    } catch {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 3000);
    }
  };

  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeSheet();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, formStatus]);

  // Quick links data
  const quickLinks = [
    { icon: MessageSquare, label: "WhatsApp", value: "+63 951 083 3623", href: "https://wa.me/639510833623", color: "#25D366", desc: "Fastest response — usually within hours" },
    { icon: Mail, label: "Email", value: "kchanchan2357@gmail.com", href: "mailto:kchanchan2357@gmail.com", color: "#D14836", desc: "Detailed project inquiries welcome" },
    { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/kristian-jay-eñaga", href: "https://www.linkedin.com/in/kristian-jay-e%C3%B1aga-85345741a/", color: "#0A66C2", desc: "Professional network & messaging" },
    { icon: Github, label: "GitHub", value: "github.com/kristian-enaga", href: "https://github.com/kristian-enaga", color: "#FFFFFF", desc: "All 10 project repositories" },
  ];

  const availabilityTags = [
    { icon: Globe, label: "Remote-First", desc: "Async communication with scheduled overlap" },
    { icon: Zap, label: "Project-Based", desc: "Fixed-scope pilots or longer-term" },
    { icon: Shield, label: "International", desc: "Wise/Payoneer/Deel payments" },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={closeSheet}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-400 ease-out-cubic max-h-[90vh] md:hidden"
        style={{ 
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          willChange: 'transform',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bottom-sheet-title"
      >
        {/* Handle bar */}
        <div className="flex items-center justify-center px-4 py-3 border-b border-white/5">
          <div className="w-10 h-1 rounded-full bg-white/20" aria-hidden="true" />
        </div>

        <div className="flex flex-col max-h-[calc(90vh-60px)] bg-background" style={{ background: "rgba(2, 6, 23, 0.98)", backdropFilter: "blur(20px)" }}>
          {/* Header - Sticky */}
          <div className="flex-shrink-0 p-4 lg:p-6 border-b border-white/10 sticky top-0 bg-background/95 backdrop-blur-xl z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 id="bottom-sheet-title" className="text-xl font-bold text-white">Get In Touch</h2>
                <p className="text-sm text-muted mt-0.5">Choose how you'd like to connect</p>
              </div>
              <button
                onClick={closeSheet}
                className="p-2 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 hover:border-mint/30 transition-all duration-300 text-white/60 hover:text-white focus-ring"
                aria-label="Close bottom sheet"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex-shrink-0 border-b border-white/10">
            <div className="flex px-4" role="tablist">
              <button
                role="tab"
                aria-selected={activeTab === 'contact'}
                aria-controls="contact-panel"
                id="contact-tab"
                onClick={() => setActiveTab('contact')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-300 rounded-t-xl relative ${
                  activeTab === 'contact'
                    ? 'text-white bg-white/5'
                    : 'text-muted/70 hover:text-white/50'
                }`}
              >
                <MessageSquare className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Contact</span>
                {activeTab === 'contact' && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-t-full" style={{ background: "linear-gradient(135deg, #00ff87, #06b6d4)" }} aria-hidden="true" />
                )}
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'links'}
                aria-controls="links-panel"
                id="links-tab"
                onClick={() => setActiveTab('links')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-300 rounded-t-xl relative ${
                  activeTab === 'links'
                    ? 'text-white bg-white/5'
                    : 'text-muted/70 hover:text-white/50'
                }`}
              >
                <Zap className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Quick Links</span>
                {activeTab === 'links' && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-t-full" style={{ background: "linear-gradient(135deg, #00ff87, #06b6d4)" }} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Tab Panels - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 custom-scrollbar">
            {/* Contact Form Tab */}
            <div
              role="tabpanel"
              id="contact-panel"
              aria-labelledby="contact-tab"
              className={activeTab === 'contact' ? 'animate-fade-in' : 'hidden'}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Send a Message</h3>
              
              {formStatus === 'success' ? (
                <div className="text-center py-8" role="alert">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg, rgba(0, 255, 135, 0.2), rgba(6, 182, 212, 0.2))", border: "1px solid rgba(0, 255, 135, 0.3)" }}>
                    <CheckCircle className="w-8 h-8" style={{ color: "#00ff87" }} aria-hidden="true" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Message Sent!</h4>
                  <p className="text-muted text-sm">I'll review and respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="bs-name" className="block text-sm font-medium text-white mb-2">Name</label>
                      <input
                        type="text"
                        id="bs-name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl glass border-white/10 focus:border-mint/50 focus:ring-2 focus:ring-mint/50 focus:outline-none text-white placeholder:text-muted/50 transition-all duration-300"
                        placeholder="Your name"
                        disabled={formStatus === 'submitting'}
                      />
                    </div>
                    <div>
                      <label htmlFor="bs-email" className="block text-sm font-medium text-white mb-2">Email</label>
                      <input
                        type="email"
                        id="bs-email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl glass border-white/10 focus:border-mint/50 focus:ring-2 focus:ring-mint/50 focus:outline-none text-white placeholder:text-muted/50 transition-all duration-300"
                        placeholder="you@company.com"
                        disabled={formStatus === 'submitting'}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="bs-message" className="block text-sm font-medium text-white mb-2">What's the operational problem?</label>
                    <textarea
                      id="bs-message"
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl glass border-white/10 focus:border-mint/50 focus:ring-2 focus:ring-mint/50 focus:outline-none text-white placeholder:text-muted/50 transition-all duration-300 resize-none"
                      placeholder="Describe the bottleneck, manual process, or integration gap..."
                      disabled={formStatus === 'submitting'}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className={`w-full btn-primary focus-ring ${formStatus === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5 ml-2" aria-hidden="true" />
                      </>
                    )}
                  </button>

                  {formStatus === 'error' && (
                    <div className="p-3 rounded-xl glass border-red-500/30 bg-red-500/10 text-center text-red-400 text-sm" role="alert">
                      Submission failed. Please try again or use direct contact links.
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Quick Links Tab */}
            <div
              role="tabpanel"
              id="links-panel"
              aria-labelledby="links-tab"
              className={activeTab === 'links' ? 'animate-fade-in' : 'hidden'}
            >
              {/* Direct Contact */}
              <section>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-mint" aria-hidden="true" />
                  Direct Contact Endpoints
                </h3>
                <div className="space-y-3" role="list">
                  {quickLinks.map((contact, index) => {
                    const Icon = contact.icon;
                    return (
                      <a
                        key={index}
                        href={contact.href}
                        target={contact.href.startsWith("http") ? "_blank" : undefined}
                        rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="group flex items-center gap-3 p-4 rounded-xl glass border-white/5 hover:border-white/10 hover:bg-white/5 transition-all duration-300 focus-ring"
                        role="listitem"
                        aria-label={`${contact.label}: ${contact.value}`}
                        onClick={() => closeSheet()}
                      >
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110" style={{ background: `linear-gradient(135deg, ${contact.color}20, ${contact.color}10)`, border: `1px solid ${contact.color}30` }}>
                          <Icon className="w-5 h-5" style={{ color: contact.color }} aria-hidden="true" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="text-xs text-subtle uppercase tracking-wider font-medium">{contact.label}</div>
                          <div className="text-white font-medium group-hover:text-mint transition-colors truncate">{contact.value}</div>
                          <div className="text-xs text-muted/70 mt-0.5 truncate">{contact.desc}</div>
                        </div>
                        {contact.href.startsWith("http") && (
                          <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-mint transition-colors flex-shrink-0" aria-hidden="true" />
                        )}
                      </a>
                    );
                  })}
                </div>
              </section>

              {/* Availability & Logistics */}
              <section className="pt-4 border-t border-white/5">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-mint" aria-hidden="true" />
                  Availability & Logistics
                </h3>
                <div className="flex flex-wrap gap-3">
                  {availabilityTags.map((tag, index) => {
                    const Icon = tag.icon;
                    return (
                      <div key={index} className="flex items-center gap-2 px-4 py-2.5 rounded-full glass border-white/10 text-xs font-medium text-white/80">
                        <Icon className="w-3.5 h-3.5 text-mint" aria-hidden="true" />
                        <span>{tag.label}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-muted mt-4 text-center">
                  UTC+8 (Philippines) · Overlap with APAC, EMEA, US West Coast
                </p>
              </section>

              {/* CTA */}
              <section className="pt-4 border-t border-white/5">
                <a
                  href="https://www.loom.com/share/94749ae3e10d473d85bc6d022a45ef80"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full glass border-white/10 hover:border-mint/30 hover:bg-white/5 transition-all duration-300 text-sm font-medium focus-ring"
                  onClick={() => closeSheet()}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Watch 3-min Self-Intro Walkthrough
                </a>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}