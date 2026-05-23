"use client";

export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-cookie-banner"))}
      className="hover:text-df-gold transition-colors"
    >
      Gérer les cookies
    </button>
  );
}
