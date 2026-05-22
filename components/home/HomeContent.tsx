"use client";

import Nav from "@/components/layout/Nav";
import ClientShell from "@/components/home/ClientShell";
import FrameRoomEntry from "@/components/home/v2/FrameRoomEntry";
import SceneSelector from "@/components/home/v2/SceneSelector";
import CrewStack from "@/components/home/v2/CrewStack";
import FrameRoomStatement from "@/components/home/v2/FrameRoomStatement";
import FieldLog from "@/components/home/v2/FieldLog";
import DirectorsCutRibbon from "@/components/home/v2/DirectorsCutRibbon";
import LastFrame from "@/components/home/v2/LastFrame";
import Link from "next/link";

interface HomeContentProps {
  user?: { name: string; role: string } | null;
}

export default function HomeContent({ user }: HomeContentProps) {
  return (
    <>
      <ClientShell />
      <div className="df-site">
        <div className="df-root">
          <Nav user={user} />

          {/* ── V2 Frame Room — 7 sections ──────────────────────── */}
          <FrameRoomEntry />
          <SceneSelector />
          <CrewStack />
          <FrameRoomStatement />
          <FieldLog />
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
            <span className="font-display text-lg font-bold tracking-wide text-white">DEEP<span className="text-[#F36B1F]">FRAME</span></span>
          </div>
          <p>Boîte de production audiovisuelle.<br />Orléans · Tours · partout en région.</p>
        </div>
        <div>
          <h3>Navigation</h3>
          <ul>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/galerie">Galerie</Link></li>
            <li><Link href="/equipe">Équipe</Link></li>
            <li><Link href="/tarifs">Tarifs</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h3>Contact</h3>
          <ul>
            <li><a href="mailto:contact@deepframe.cc">contact@deepframe.cc</a></li>
            <li><a href="tel:+33651109202">06 51 10 92 02</a></li>
            <li>Orléans, 45000</li>
          </ul>
        </div>
        <div>
          <h3>Suivre</h3>
          <ul>
            <li><a href="https://www.instagram.com/deepframe.cc/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://www.facebook.com/profile.php?id=61589292522120" target="_blank" rel="noopener noreferrer">Facebook</a></li>
          </ul>
        </div>
      </div>
      <div className="df-footer-bot">
        <span>© 2026 DeepFrame · Tous droits réservés</span>
        <span><Link href="/mentions-legales">Mentions légales</Link> · <Link href="/confidentialite">Confidentialité</Link> · <Link href="/cookies">Cookies</Link></span>
      </div>
    </footer>
  );
}
