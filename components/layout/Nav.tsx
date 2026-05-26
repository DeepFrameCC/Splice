"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import UserDropdown from "./UserDropdown";

const NAV_LINKS = [
  { href: "/#about",    label: "À propos" },
  { href: "/services", label: "Services" },
  { href: "/galerie",   label: "Galerie" },
  { href: "/equipe",    label: "Équipe" },
  { href: "/tarifs",    label: "Tarifs" },
  { href: "/blog",      label: "Blog" },
  { href: "/faq",       label: "FAQ" },
  { href: "/contact",   label: "Contact" },
];

interface NavProps {
  user?: { name: string; role: string } | null;
}

export default function Nav({ user }: NavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="df-nav w-full !flex !flex-row !flex-nowrap !items-center !justify-between">
        <Link href="/" className="df-logo-mark flex items-center shrink-0" aria-label="Splice">
          <span className="font-display text-lg font-bold tracking-wide text-white">SPL<span className="text-[#F36B1F]">ICE</span></span>
        </Link>

        <nav className="df-nav-links" aria-label="Navigation principale">
          {NAV_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
        </nav>

        <div className="df-nav-cta">
          {user ? (
            <>
              <Link href="/devis" className="df-btn df-btn-primary df-btn-sm">Demander un devis</Link>
              <UserDropdown name={user.name} role={user.role} />
            </>
          ) : (
            <>
              <Link href="/login" className="df-nav-staff">Connexion</Link>
              <Link href="/devis" className="df-btn df-btn-primary df-btn-sm">Demander un devis</Link>
            </>
          )}
        </div>

        <button
          className="df-burger"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={open ? "df-burger-open" : ""} />
        </button>
      </header>

      {open && (
        <div
          className="df-drawer-overlay"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      <nav
        className={"df-drawer" + (open ? " df-drawer-open" : "")}
        aria-label="Menu mobile"
      >
        <div className="df-drawer-inner">
          <div className="df-drawer-links">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
          </div>
          <div className="df-drawer-bottom">
            <Link
              href="/devis"
              className="df-btn df-btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => setOpen(false)}
            >
              Demander un devis →
            </Link>
            {user ? (
              <>
                <Link
                  href="/profil"
                  className="df-nav-staff"
                  style={{ textAlign: "center", display: "block", marginTop: 14 }}
                  onClick={() => setOpen(false)}
                >
                  Mon profil →
                </Link>
                {(user.role === "ADMIN" || user.role === "TEAM") && (
                  <Link
                    href="/admin"
                    className="df-nav-staff"
                    style={{ textAlign: "center", display: "block", marginTop: 8 }}
                    onClick={() => setOpen(false)}
                  >
                    Administration →
                  </Link>
                )}
              </>
            ) : (
              <Link
                href="/login"
                className="df-nav-staff"
                style={{ textAlign: "center", display: "block", marginTop: 14 }}
                onClick={() => setOpen(false)}
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
