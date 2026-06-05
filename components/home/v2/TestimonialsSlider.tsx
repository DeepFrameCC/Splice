"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials, Testimonial } from "@/lib/home/testimonials";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * TestimonialsSlider — Premium interactive review slider.
 * Fully compliant with the Splice Studio Cinéma Studio DA.
 * Combines huge bold display font, orange lowercase italic emphasis,
 * and a tactile glassmorphic container with custom navigation arrows.
 */
export default function TestimonialsSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const activeTestimonial = (testimonials[activeIndex] || testimonials[0]) as Testimonial;

  const handleNext = () => {
    setDirection("next");
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection("prev");
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // GSAP transition animation on index change
  useGSAP(
    () => {
      if (reduced) return;

      const tl = gsap.timeline();
      const xOffset = direction === "next" ? 40 : -40;

      // Animate slide contents out, then in
      tl.fromTo(
        ".df-testimonial-animate",
        { opacity: 1, x: 0 },
        {
          opacity: 0,
          x: -xOffset,
          duration: 0.25,
          ease: "power2.inOut",
          stagger: 0.05,
          onComplete: () => {
            // GSAP completes animation, React state is rendered. Let's make sure it transitions back in!
            gsap.fromTo(
              ".df-testimonial-animate",
              { opacity: 0, x: xOffset },
              {
                opacity: 1,
                x: 0,
                duration: 0.45,
                ease: "expo.out",
                stagger: 0.08,
              }
            );
          },
        }
      );
    },
    { dependencies: [activeIndex], scope: containerRef }
  );

  // Split quote text for highlight emphasis
  const quoteText = activeTestimonial.quote;
  const highlightText = activeTestimonial.highlight;
  const parts = quoteText.split(highlightText);

  return (
    <section className="df-testimonials-section" aria-label="Témoignages clients">
      <div className="df-testimonials-container" ref={containerRef}>
        
        {/* Section Title */}
        <div className="df-testimonials-head">
          <span className="df-testimonials-eyebrow">Avis clients</span>
          <h2 className="df-testimonials-h2">
            Ils nous font <em>confiance</em><span className="text-[#F36B1F]">.</span>
          </h2>
        </div>

        {/* Tactile review slide card */}
        <div className="df-testimonials-card">
          <Quote className="df-testimonial-quote-icon" />

          <div className="df-testimonial-content">
            <blockquote className="df-testimonial-quote-text df-testimonial-animate">
              {parts[0]}
              <em>{highlightText}</em>
              {parts[1]}
            </blockquote>

            <div className="df-testimonial-meta df-testimonial-animate">
              <div className="df-testimonial-info">
                <span className="df-testimonial-author">
                  {activeTestimonial.author}
                </span>
                <span className="df-testimonial-org">
                  {activeTestimonial.location}
                </span>
              </div>
              <div className="df-testimonial-service-tag">
                {activeTestimonial.service}
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="df-slider-arrow df-slider-arrow-left"
            aria-label="Témoignage précédent"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={handleNext}
            className="df-slider-arrow df-slider-arrow-right"
            aria-label="Témoignage suivant"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dot Indicators */}
          <div className="df-slider-dots">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > activeIndex ? "next" : "prev");
                  setActiveIndex(idx);
                }}
                className={`df-slider-dot ${idx === activeIndex ? "is-active" : ""}`}
                aria-label={`Aller au témoignage ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
