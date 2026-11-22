import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Harsh Mishra — Pharmaceutical Sciences";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "76px", background: "#0e1210", color: "#e8ece9", fontFamily: "Georgia, serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", color: "#4fd1b5", fontSize: 22, letterSpacing: "3px" }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#4fd1b5" }} />
        PHARMACEUTICAL SCIENCES
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ fontSize: 84, lineHeight: 1.02, letterSpacing: "-4px" }}>Harsh Mishra</div>
        <div style={{ fontSize: 38, lineHeight: 1.2, color: "#4fd1b5", fontStyle: "italic" }}>A pharmacy student&apos;s learning notebook.</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", color: "#9aa69f", fontSize: 20, letterSpacing: "2px" }}>
        <span>B.PHARM · INDIA</span><span>HARSHMISHRA759.VERCEL.APP</span>
      </div>
    </div>,
    size
  );
}
