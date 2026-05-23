"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * FrameRoomStatement — manifeste section.
 * Full viewport, single declaration, stats integrated into the text flow.
 * Replaces About + Marquee from V1.
 */
export default function FrameRoomStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const ctx = gsap.context(() => {
        if (reduced) {
          gsap.set(".df-frs-anim", { opacity: 1 });
          return;
        }

        gsap.fromTo(
          ".df-frs-anim",
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }, sectionRef);

      return () => ctx.revert();
    },
    { dependencies: [reduced], scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="df-frs"
      aria-label="Manifeste Splice"
    >
      <div className="df-frs-inner">
        <span className="df-frs-eyebrow df-frs-anim">
          Manifeste · Splice
        </span>

        <h2 className="df-frs-headline df-frs-anim">
          On compose des images
          <br />
          qui font travailler
          <br />
          <em>les marques.</em>
        </h2>

        <p className="df-frs-stats df-frs-anim">
          <em>30+</em> projets · <em>4K</em> rendu · <em>48h</em> express
        </p>

        <span className="df-frs-sig df-frs-anim">
          Orléans · Tours
        </span>
      </div>
    </section>
  );
}
