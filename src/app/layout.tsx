import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AkatsukiAtmosphere } from "@/components/akatsuki-atmosphere";
import "./globals.css";

const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://harshmishra759.vercel.app";
const themeScript = `(() => { try { const saved = localStorage.getItem("harsh-theme"); document.documentElement.dataset.theme = saved === "light" ? "light" : "dark"; } catch (_) { document.documentElement.dataset.theme = "dark"; } })();`

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Harsh Mishra — Pharmaceutical Sciences", template: "%s · Harsh Mishra" },
  description: "Pharmaceutical sciences, explained one mechanism at a time. Notes, reflections and practical learning by Harsh Mishra, a B.Pharm student.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: siteUrl, title: "Harsh Mishra — Pharmaceutical Sciences", description: "A pharmacy student's notebook of medicines, mechanisms and practical learning.", siteName: "Harsh Mishra", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Harsh Mishra — Pharmaceutical Sciences" }] },
  twitter: { card: "summary_large_image", title: "Harsh Mishra — Pharmaceutical Sciences", description: "A pharmacy student's notebook of medicines, mechanisms and practical learning." },
  icons: { icon: "/favicon.svg" },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body className={`${newsreader.variable} ${inter.variable} ${mono.variable}`}>
        <AkatsukiAtmosphere />
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
