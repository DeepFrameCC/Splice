// DeepFrame — Site prototype
// Intro: logo qui se dessine puis fade, puis fade in du site.

const { useState, useEffect, useRef, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "introStyle": "draw",
  "accent": "#FFBD59",
  "dark": false,
  "introDuration": 2.8
}/*EDITMODE-END*/;

// Brand
const BRAND = {
  blue: "#1901AD",
  yellow: "#FFBD59",
  white: "#FFFFFF",
  ink: "#0A0A23",
};

// ──────────────────────────────────────────────────────────────────
// Intro overlay — logo apparaît, "se dessine" via mask wipe, puis fade

function Intro({ style, duration, onDone }) {
  const [phase, setPhase] = useState("draw"); // draw → hold → fade → gone

  useEffect(() => {
    const drawMs = duration * 1000 * 0.55;
    const holdMs = duration * 1000 * 0.15;
    const fadeMs = duration * 1000 * 0.30;
    const t1 = setTimeout(() => setPhase("hold"), drawMs);
    const t2 = setTimeout(() => setPhase("fade"), drawMs + holdMs);
    const t3 = setTimeout(() => { setPhase("gone"); onDone && onDone(); }, drawMs + holdMs + fadeMs);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [duration, onDone]);

  if (phase === "gone") return null;

  const drawSec = (duration * 0.55).toFixed(2);
  const fadeSec = (duration * 0.30).toFixed(2);

  // Three intro flavors driven by `style`
  // - "draw": vertical wipe reveal
  // - "zoom": scale + fade
  // - "fadeOnly": cross-fade in/out
  const wrapStyle = {
    position: "fixed",
    inset: 0,
    background: "#FFFFFF",
    zIndex: 9999,
    display: "grid",
    placeItems: "center",
    opacity: phase === "fade" ? 0 : 1,
    transition: `opacity ${fadeSec}s cubic-bezier(.22,.61,.36,1)`,
    pointerEvents: phase === "fade" ? "none" : "auto",
  };

  const logoBox = {
    width: "min(38vw, 360px)",
    aspectRatio: "466 / 627",
    position: "relative",
  };

  // Mask reveal: clipPath gradually opens from top to bottom
  const reveal = phase === "draw" ? "wiping" : "open";

  return (
    <div style={wrapStyle} aria-hidden="true">
      <style>{`
        @keyframes df-wipe {
          0%   { clip-path: inset(0 0 100% 0); }
          100% { clip-path: inset(0 0 0% 0); }
        }
        @keyframes df-zoom {
          0%   { opacity: 0; transform: scale(.86); filter: blur(8px); }
          60%  { opacity: 1; transform: scale(1); filter: blur(0); }
          100% { opacity: 1; transform: scale(1.04); filter: blur(0); }
        }
        @keyframes df-fadein {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes df-shimmer {
          0%   { transform: translateY(-110%); }
          100% { transform: translateY(110%); }
        }
        .df-logo-draw {
          animation: df-wipe ${drawSec}s cubic-bezier(.65,.05,.36,1) forwards;
        }
        .df-logo-zoom {
          animation: df-zoom ${drawSec}s cubic-bezier(.22,.61,.36,1) forwards;
        }
        .df-logo-fade {
          animation: df-fadein ${drawSec}s ease-out forwards;
        }
        .df-shimmer {
          position: absolute; inset: 0;
          background: linear-gradient(180deg,
            transparent 0%,
            rgba(25,1,173,.12) 45%,
            rgba(255,189,89,.35) 50%,
            rgba(25,1,173,.12) 55%,
            transparent 100%);
          mix-blend-mode: multiply;
          animation: df-shimmer ${drawSec}s cubic-bezier(.65,.05,.36,1) forwards;
          pointer-events: none;
        }
      `}</style>

      <div style={logoBox}>
        <img
          src="assets/deepframe-logo.svg"
          alt="DeepFrame"
          className={
            style === "zoom" ? "df-logo-zoom" :
            style === "fadeOnly" ? "df-logo-fade" :
            "df-logo-draw"
          }
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "contain",
          }}
        />
        {style === "draw" && reveal === "wiping" && <div className="df-shimmer" />}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Site

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Once-per-session intro
  const [showIntro, setShowIntro] = useState(() => {
    try { return !sessionStorage.getItem("df_intro_seen"); } catch { return true; }
  });
  const [siteReady, setSiteReady] = useState(!showIntro);
  const [replayKey, setReplayKey] = useState(0);

  const finishIntro = () => {
    try { sessionStorage.setItem("df_intro_seen", "1"); } catch {}
    setShowIntro(false);
    // small delay then fade in site
    setTimeout(() => setSiteReady(true), 50);
  };

  const replay = () => {
    try { sessionStorage.removeItem("df_intro_seen"); } catch {}
    setSiteReady(false);
    setShowIntro(true);
    setReplayKey(k => k + 1);
  };

  // CSS vars driven by tweaks
  const dark = t.dark;
  const cssVars = {
    "--df-blue": BRAND.blue,
    "--df-accent": t.accent,
    "--df-ink": dark ? "#F4F2EC" : BRAND.ink,
    "--df-bg": dark ? "#0A0A23" : BRAND.white,
    "--df-bg-soft": dark ? "#11112E" : "#FAF8F2",
    "--df-bg-card": dark ? "#15153A" : "#FFFFFF",
    "--df-line": dark ? "rgba(255,255,255,.10)" : "rgba(10,10,35,.10)",
    "--df-muted": dark ? "rgba(244,242,236,.62)" : "rgba(10,10,35,.6)",
    "--df-headline": dark ? "#FFFFFF" : BRAND.blue,
  };

  return (
    <div style={cssVars}>
      {showIntro && (
        <Intro
          key={replayKey}
          style={t.introStyle}
          duration={t.introDuration}
          onDone={finishIntro}
        />
      )}

      <div
        className={"df-site" + (siteReady ? " ready" : "")}
        style={{
          opacity: siteReady ? 1 : 0,
          transition: "opacity 1.1s cubic-bezier(.22,.61,.36,1)",
        }}
      >
        <Site />
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Animation d'intro" />
        <TweakRadio
          label="Style"
          value={t.introStyle}
          options={[
            { value: "draw", label: "Dessin" },
            { value: "zoom", label: "Zoom" },
            { value: "fadeOnly", label: "Fade" },
          ]}
          onChange={(v) => setTweak("introStyle", v)}
        />
        <TweakSlider
          label="Durée"
          value={t.introDuration}
          min={1.2} max={5} step={0.1} unit="s"
          onChange={(v) => setTweak("introDuration", v)}
        />
        <TweakButton label="Rejouer l'intro" onClick={replay}>Rejouer</TweakButton>

        <TweakSection label="Palette" />
        <TweakColor
          label="Accent"
          value={t.accent}
          options={["#FFBD59", "#1901AD", "#FF6B35", "#21C497", "#E94560"]}
          onChange={(v) => setTweak("accent", v)}
        />
        <TweakToggle
          label="Mode sombre"
          value={t.dark}
          onChange={(v) => setTweak("dark", v)}
        />
      </TweaksPanel>
    </div>
  );
}

window.App = App;
