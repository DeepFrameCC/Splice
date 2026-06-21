"use client";

import { useState } from "react";

export default function ArticleNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <div className="am-news">
      <div className="am-news__eyebrow">L&apos;Écho Créatif</div>
      <h2>Recevez nos guides production, un par mois.</h2>
      <p>Conseils tournage, montage et stratégie sociale. Zéro spam, désabonnement en un clic.</p>

      {status === "success" ? (
        <p style={{ color: "#d8542a", margin: 0 }}>Merci ! Vous êtes inscrit. 🎬</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10 }}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse e-mail"
            className="am-news__input"
          />
          <button type="submit" className="am-news__btn">S&apos;inscrire</button>
        </form>
      )}
    </div>
  );
}
