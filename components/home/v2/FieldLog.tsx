"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  fieldLogEntries,
  fieldLogQuote,
  fieldLogStats,
} from "@/lib/home/field-log";

gsap.registerPlugin(ScrollTrigger);

/**
 * FieldLog — dramatised social proof panel.
 * Production log (left) + pivot quote (right) + stats footer.
 * Replaces Testimonials + GalleryTeaser from V1.
 */
export default function FieldLog() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const ctx = gsap.context(() => {
        if (reduced) {
          gsap.set(".df-fl-anim", { opacity: 1 });
          return;
        }

        gsap.fromTo(
          ".df-fl-anim",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "expo.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 78%",
              toggleActions: "play none none none",
            },
          }
        );
      }, sectionRef);

      return () => ctx.revert();
    },
    { dependencies: [reduced], scope: sectionRef }
  );

  // Build the quote with the highlight phrase wrapped in <em>
  const quoteText = fieldLogQuote.excerpt;
  const highlightText = fieldLogQuote.highlight;
  const parts = quoteText.split(highlightText);

  return (
    <section
      ref={sectionRef}
      className="df-fl"
      aria-label="Journal de production et témoignage client"
    >
      <div className="df-fl-panel df-fl-anim">
        <div className="df-fl-grid">
          {/* Left column: production log */}
          <div className="df-fl-log">
            <span className="df-fl-eyebrow">Field Log</span>
            <ul className="df-fl-entries">
              {fieldLogEntries.map((entry) => (
                <li key={entry.date + entry.client} className="df-fl-entry df-fl-anim">
                  <span className="df-fl-date">[{entry.date}]</span>
                  <span className="df-fl-client">{entry.client}</span>
                  <span className="df-fl-type">
                    {entry.type} · {entry.location}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column: pivot quote */}
          <div className="df-fl-quote df-fl-anim">
            <blockquote className="df-fl-quote-text">
              {parts[0]}
              <em>{highlightText}</em>
              {parts[1]}
            </blockquote>
            <div className="df-fl-quote-sig">
              <span className="df-fl-quote-author">
                {fieldLogQuote.author}
              </span>
              <span className="df-fl-quote-org">
                {fieldLogQuote.org} · {fieldLogQuote.location}
              </span>
            </div>
          </div>
        </div>

        {/* Stats footer */}
        <div className="df-fl-stats df-fl-anim">
          {fieldLogStats.map((stat) => (
            <span key={stat.label} className="df-fl-stat">
              <em>{stat.value}</em> {stat.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
