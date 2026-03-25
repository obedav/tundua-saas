import { ImageResponse } from "next/og";

export const alt = "Tundua - Study Abroad Application Platform";
export const size = { width: 1200, height: 600 };
export const contentType = "image/png";

export default function TwitterImage() {
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
            width: 72,
            height: 72,
            borderRadius: 18,
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 44, fontWeight: 800, color: "white" }}>T</span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: "white",
            margin: 0,
            textAlign: "center",
          }}
        >
          Tundua
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 22,
            color: "#94a3b8",
            margin: "12px 0 0 0",
            textAlign: "center",
          }}
        >
          Apply to top universities with expert guidance
        </p>
      </div>
    ),
    { ...size }
  );
}
