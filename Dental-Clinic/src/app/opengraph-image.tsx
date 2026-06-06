import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";
export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0F2B3D 0%, #1A4A5C 50%, #0F2B3D 100%)",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              background: "#C9A24D",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
            }}
          >
            ✦
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 36, fontWeight: 600 }}>Harborline</span>
            <span style={{ fontSize: 24, color: "#D4B56A" }}>Dental Studio</span>
          </div>
        </div>
        <p style={{ fontSize: 52, fontWeight: 500, lineHeight: 1.15, maxWidth: 900 }}>
          Look forward to your next dental visit
        </p>
        <p style={{ fontSize: 26, color: "rgba(255,255,255,0.8)", marginTop: 24, maxWidth: 800 }}>
          Premium cosmetic & restorative dentistry in San Francisco
        </p>
        <p style={{ fontSize: 22, color: "#C9A24D", marginTop: 48 }}>
          ★ {siteConfig.googleRating} · {siteConfig.reviewCount}+ reviews
        </p>
      </div>
    ),
    { ...size }
  );
}
