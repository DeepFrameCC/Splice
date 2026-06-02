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
      aria-label="Note d'intention Splice"
    >
      <div className="df-frs-grid">
        {/* Rail latéral — repère type clap de cinéma */}
        <div className="df-frs-rail df-frs-anim" aria-hidden="true">
          <span className="df-frs-rail-num">N°01</span>
          <span className="df-frs-rail-line" />
          <span className="df-frs-rail-label">Note d&apos;intention</span>
        </div>

        <div className="df-frs-main">
          <span className="df-frs-eyebrow df-frs-anim">
            Studio audiovisuel · Orléans + Tours
          </span>

          <h2 className="df-frs-headline df-frs-anim">
            Derrière chaque image,
            <br />
            une intention.
            <br />
            <em>La vôtre.</em>
          </h2>

          <p className="df-frs-credo df-frs-anim">
            On part de votre histoire, on la cadre plan par plan,
            jusqu&apos;à ce qu&apos;elle sonne juste.
          </p>

          <div className="df-frs-slate df-frs-anim">
            <span><em>30+</em> projets livrés</span>
            <span><em>2</em> retours inclus</span>
            <span>Sans engagement</span>
          </div>
        </div>
      </div>
    </section>
  );
}
