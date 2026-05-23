import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Splice — Production audiovisuelle · Orléans & Tours";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #0E0E22 0%, #0A0A1C 60%, #1901AD 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Decorative accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 6,
            background: "#F36B1F",
          }}
        />

        {/* Brand name */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
          }}
        >
          SPLICE
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.7)",
            marginTop: 12,
            letterSpacing: "0.05em",
          }}
        >
          Production audiovisuelle
        </div>

        {/* Location */}
        <div
          style={{
            fontSize: 20,
            color: "#F36B1F",
            marginTop: 16,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Orléans · Tours
        </div>
      </div>
    ),
    { ...size },
  );
}
