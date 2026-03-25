import { ImageResponse } from "next/og";

export const alt = "Tundua - Study Abroad Application Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          position: "relative",
        }}
      >
        {/* Gradient orbs */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "100%",
            background: "radial-gradient(circle, rgba(37,99,235,0.3) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: "100%",
            background: "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)",
          }}
        />

        {/* Logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 48, fontWeight: 800, color: "white" }}>T</span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "white",
            margin: 0,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          Tundua
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 24,
            color: "#94a3b8",
            margin: "16px 0 0 0",
            textAlign: "center",
            maxWidth: 600,
          }}
        >
          Study Abroad Application Platform
        </p>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 32,
            padding: "12px 24px",
            borderRadius: 100,
            border: "1px solid rgba(148,163,184,0.2)",
          }}
        >
          <span style={{ fontSize: 18, color: "#60a5fa" }}>
            Apply to top universities with expert guidance
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
