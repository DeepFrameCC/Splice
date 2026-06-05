"use client";

import Nav from "@/components/layout/Nav";
import ClientShell from "@/components/home/ClientShell";
import FrameRoomEntry from "@/components/home/v2/FrameRoomEntry";
import SceneSelector from "@/components/home/v2/SceneSelector";
import CrewStack from "@/components/home/v2/CrewStack";
import FrameRoomStatement from "@/components/home/v2/FrameRoomStatement";
import ProcessSection from "@/components/home/v2/ProcessSection";
import TestimonialsSlider from "@/components/home/v2/TestimonialsSlider";
import TrustSection from "@/components/home/v2/TrustSection";
import DirectorsCutRibbon from "@/components/home/v2/DirectorsCutRibbon";
import LastFrame from "@/components/home/v2/LastFrame";
import Link from "next/link";
import { Facebook, Linkedin, Instagram } from "lucide-react";

export default function HomeContent({ mediaCount }: { mediaCount: number }) {
  return (
    <>
      <ClientShell />
      <div className="df-site">
        <div className="df-root">
          <Nav />

          {/* ── V2 Frame Room — 9 sections ──────────────────────── */}
          <FrameRoomEntry />
          <SceneSelector />
          <CrewStack />
          <FrameRoomStatement />
          <ProcessSection />
          <TestimonialsSlider />
          <TrustSection mediaCount={mediaCount} />
          <DirectorsCutRibbon />
          <LastFrame />

          <Footer />
        </div>
      </div>
    </>
  );
}

/* ── Footer (conservé tel quel, pas de refonte en V2) ────────── */
function Footer() {
  return (
    <footer className="df-footer">
      <div className="df-footer-top">
        <div>
          <div className="df-footer-mark">
            <span className="font-display text-lg font-bold tracking-wide text-white">SPL<span className="text-[#F36B1F]">ICE</span> STUDIO</span>
          </div>
          <p>Boîte de production audiovisuelle.<br />Orléans · Tours · partout en région.</p>
        </div>
        <div>
          <h2 className="df-footer-col-title">Navigation</h2>
          <ul className="df-footer-nav-grid">
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/agence-communication-orleans">Agence communication</Link></li>
            <li><Link href="/photographe-evenementiel">Photo événementiel</Link></li>
            <li><Link href="/tarifs">Tarifs</Link></li>
            <li><Link href="/galerie">Galerie</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/equipe">Équipe</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="df-footer-col-title">Contact</h2>
          <ul>
            <li><a href="mailto:contact.splicestudio@gmail.com">contact.splicestudio@gmail.com</a></li>
            <li>Orléans, 45000</li>
          </ul>
        </div>
        <div>
          <h2 className="df-footer-col-title">Suivre</h2>
          <div className="df-footer-socials">
            <a href="https://www.facebook.com/Splicecc/" target="_blank" rel="noopener noreferrer" className="df-social-btn" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="https://www.instagram.com/splice.cc/" target="_blank" rel="noopener noreferrer" className="df-social-btn" aria-label="Instagram">
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>
      <div className="df-footer-bot">
        <span>© 2026 Splice Studio · Tous droits réservés</span>
        <span><Link href="/mentions-legales">Mentions légales</Link> · <Link href="/confidentialite">Confidentialité</Link> · <Link href="/cookies">Cookies</Link></span>
      </div>
    </footer>
  );
}
