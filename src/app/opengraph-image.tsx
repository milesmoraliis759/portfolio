import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Harsh Mishra — Pharmaceutical Sciences and Learning Journal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "76px", position: "relative", overflow: "hidden", background: "#080808", color: "#eae7e7", fontFamily: "Georgia, serif" }}>
      <div style={{ position: "absolute", width: 480, height: 480, borderRadius: "50%", right: 30, top: -80, background: "radial-gradient(circle at 35% 30%, #c83a4c 0%, #8a1020 48%, #3d0810 75%)", opacity: 0.48, display: "flex" }} />
      <div style={{ position: "absolute", right: 90, top: 230, width: 300, height: 180, borderRadius: "50%", background: "rgba(45,30,33,.7)", filter: "blur(34px)", display: "flex" }} />
      <div style={{ display: "flex", alignItems: "center", gap: "14px", color: "#d45a68", fontSize: 22, letterSpacing: "3px", position: "relative" }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#b51224" }} />
        PHARMACEUTICAL SCIENCES
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative" }}>
        <div style={{ fontSize: 84, lineHeight: 1.02, letterSpacing: "-4px" }}>Harsh Mishra</div>
        <div style={{ fontSize: 38, lineHeight: 1.2, color: "#c64a5a", fontStyle: "italic" }}>A pharmaceutical sciences &amp; learning journal.</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", color: "#929292", fontSize: 20, letterSpacing: "2px", position: "relative" }}>
        <span>B.PHARM · INDIA</span><span>HARSHMISHRA759.VERCEL.APP</span>
      </div>
    </div>,
    size
  );
}
