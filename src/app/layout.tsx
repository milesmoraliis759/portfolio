import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://harshmishra759.vercel.app";
const themeScript = `(() => { try { const saved = localStorage.getItem("harsh-theme"); const theme = saved === "light" || saved === "dark" ? saved : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); document.documentElement.dataset.theme = theme; } catch (_) { document.documentElement.dataset.theme = "light"; } })();`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Harsh Mishra — Pharmaceutical Sciences", template: "%s · Harsh Mishra" },
  description: "Pharmaceutical sciences, explained one mechanism at a time. Notes, reflections and practical learning by Harsh Mishra, a B.Pharm student.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Harsh Mishra — Pharmaceutical Sciences",
    description: "A pharmacy student's notebook of medicines, mechanisms and practical learning.",
    siteName: "Harsh Mishra",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Harsh Mishra — Pharmaceutical Sciences" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Harsh Mishra — Pharmaceutical Sciences",
    description: "A pharmacy student's notebook of medicines, mechanisms and practical learning.",
  },
  icons: { icon: "/favicon.svg", apple: "/apple-touch-icon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body className={`${newsreader.variable} ${inter.variable} ${mono.variable}`}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
