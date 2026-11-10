"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";

export default function QuoteBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById("quote-banner");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="quote-banner"
      className="relative py-20 sm:py-28 lg:py-36 px-6 sm:px-8 lg:px-12"
      aria-labelledby="quote-title"
    >
      <div className="max-w-5xl mx-auto">
        <div
          className={`relative glass rounded-3xl p-12 sm:p-16 lg:p-24 text-center overflow-hidden transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
          style={{ background: "linear-gradient(135deg, rgba(0, 255, 135, 0.03), rgba(6, 182, 212, 0.03))", border: "1px solid rgba(0, 255, 135, 0.1)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-mint/5 via-transparent to-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" aria-hidden="true" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-8" style={{ background: "linear-gradient(135deg, rgba(0, 255, 135, 0.15), rgba(6, 182, 212, 0.15))", border: "1px solid rgba(0, 255, 135, 0.2)" }}>
              <Quote className="w-8 h-8" style={{ color: "#00ff87" }} aria-hidden="true" />
            </div>

            <blockquote className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.15] tracking-tight text-white max-w-4xl mx-auto">
              An automation workflow should be designed for
              <br />
              <span className="text-gradient-mint">the conditions in which it can fail</span>
              <br />
              not only the conditions in which it succeeds.
            </blockquote>

            <div className="mt-10 flex items-center justify-center gap-4">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-mint to-transparent" aria-hidden="true" />
              <span className="text-sm text-muted uppercase tracking-widest font-medium">— Core Engineering Principle</span>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-mint to-transparent" aria-hidden="true" />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-mint to-transparent" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}