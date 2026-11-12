"use client";

import { useState, useEffect } from "react";
import { X, Mail, CheckCircle, Loader2, ArrowRight } from "lucide-react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/your-form-id";

export default function EmailCaptureModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', interest: '' });

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-email-capture', handleOpen);
    return () => window.removeEventListener('open-email-capture', handleOpen);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');

    const data = { ...formData, _subject: 'New Automation Insights Subscriber' };

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
        setFormData({ name: '', email: '', interest: '' });
        setTimeout(() => {
          setFormStatus('idle');
          setIsOpen(false);
        }, 3000);
      } else {
        throw new Error('Formspree submission failed');
      }
    } catch {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 3000);
    }
  };

  const handleClose = () => {
    if (formStatus === 'idle') setIsOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) handleClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md transform transition-all duration-300 animate-slide-up glass-strong rounded-2xl border-white/10 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 hover:border-mint/30 transition-all duration-300 text-white/60 hover:text-white focus-ring"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-mint/30 bg-mint/10 text-mint text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-mint rounded-full animate-pulse" aria-hidden="true" />
              Monthly Automation Insights
            </div>
            <h2 id="modal-title" className="text-2xl lg:text-3xl font-bold tracking-tight text-white mb-3">
              Get Battle-Tested Automation Patterns
            </h2>
            <p className="text-muted leading-relaxed">
              No fluff. Just production-grade workflows, failure patterns, and architectural decisions from 10+ live systems.
            </p>
          </div>

          {/* Form or Success State */}
          {formStatus === 'success' ? (
            <div className="text-center py-4" role="alert">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg, rgba(0, 255, 135, 0.2), rgba(6, 182, 212, 0.2))", border: "1px solid rgba(0, 255, 135, 0.3)" }}>
                <CheckCircle className="w-8 h-8" style={{ color: "#00ff87" }} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">You're In!</h3>
              <p className="text-muted">Check your inbox for the first issue. No spam, ever.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="modal-name" className="block text-sm font-medium text-white mb-2">Name</label>
                <input
                  type="text"
                  id="modal-name"
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
                <label htmlFor="modal-email" className="block text-sm font-medium text-white mb-2">Email</label>
                <input
                  type="email"
                  id="modal-email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl glass border-white/10 focus:border-mint/50 focus:ring-2 focus:ring-mint/50 focus:outline-none text-white placeholder:text-muted/50 transition-all duration-300"
                  placeholder="you@company.com"
                  disabled={formStatus === 'submitting'}
                />
              </div>

              <div>
                <label htmlFor="modal-interest" className="block text-sm font-medium text-white mb-2">What interests you most?</label>
                <select
                  id="modal-interest"
                  name="interest"
                  value={formData.interest}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl glass border-white/10 focus:border-mint/50 focus:ring-2 focus:ring-mint/50 focus:outline-none text-white appearance-none bg-transparent transition-all duration-300"
                  disabled={formStatus === 'submitting'}
                >
                  <option value="" disabled>Select a topic</option>
                  <option value="lead-automation">Lead Automation & RevOps</option>
                  <option value="outbound-prospecting">Outbound Prospecting at Scale</option>
                  <option value="process-automation">Process Automation (AP, E-commerce, etc.)</option>
                  <option value="error-handling">Error Handling & Observability</option>
                  <option value="ai-enrichment">AI Data Enrichment & Scoring</option>
                  <option value="all">All of the above</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={formStatus === 'submitting'}
                className={`w-full btn-primary focus-ring ${formStatus === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {formStatus === 'submitting' ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe Free
                    <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                  </>
                )}
              </button>

              <p className="text-xs text-center text-subtle">
                Unsubscribe anytime. Your data stays private. <a href="#" className="text-mint hover:underline">Privacy Policy</a>
              </p>
            </form>
          )}

          {/* Error State */}
          {formStatus === 'error' && (
            <div className="mt-4 p-4 rounded-xl glass border-red-500/30 bg-red-500/10" role="alert">
              <div className="flex items-center gap-3 text-red-400">
                <span className="w-5 h-5" aria-hidden="true">⚠</span>
                <span className="font-medium text-sm">Something went wrong. Please try again or email directly.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}