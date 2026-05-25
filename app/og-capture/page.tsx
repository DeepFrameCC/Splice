export default function OGCapturePage() {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0E0E22 0%, #0A0A1C 60%, #1901AD 100%)",
        fontFamily: "sans-serif",
        position: "relative",
        margin: "0 auto",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 6, background: "#F36B1F" }} />
      <div style={{ fontSize: 96, fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", textTransform: "uppercase" as const }}>SPLICE</div>
      <div style={{ fontSize: 28, color: "rgba(255,255,255,0.7)", marginTop: 12, letterSpacing: "0.05em" }}>Production audiovisuelle</div>
      <div style={{ fontSize: 20, color: "#F36B1F", marginTop: 16, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>Orléans · Tours</div>
    </div>
  );
}
