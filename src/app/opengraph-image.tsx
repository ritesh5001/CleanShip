import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = "Cleanship Marine Services — Hold, Tank & Hull Cleaning";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social share card, generated at build time so there is no static asset to
 * keep in sync with the brand. Inline styles only — next/og supports a
 * limited CSS subset and no Tailwind.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #04121f 0%, #0a1e31 55%, #08615d 100%)",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "999px",
              border: "3px solid #4bf3e1",
              display: "flex",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{ color: "#ffffff", fontSize: "34px", fontWeight: 700 }}
            >
              {siteConfig.name}
            </span>
            <span
              style={{
                color: "#4bf3e1",
                fontSize: "15px",
                letterSpacing: "5px",
                textTransform: "uppercase",
              }}
            >
              Marine Services
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              color: "#ffffff",
              fontSize: "68px",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-2px",
            }}
          >
            Hold, Tank &amp; Hull
          </span>
          <span
            style={{
              color: "#4bf3e1",
              fontSize: "68px",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-2px",
            }}
          >
            Cleaning Specialists
          </span>
          <span
            style={{
              color: "#adcfe4",
              fontSize: "26px",
              marginTop: "24px",
              maxWidth: "820px",
            }}
          >
            IMO &amp; port-compliant procedures · Riding crews · Underwater
            services · NDT &amp; repair
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            paddingTop: "28px",
            color: "#79aecf",
            fontSize: "22px",
          }}
        >
          <span>cleanship.co</span>
          <span>{siteConfig.phones[0].number}</span>
        </div>
      </div>
    ),
    size,
  );
}
