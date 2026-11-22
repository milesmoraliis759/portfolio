import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://harshmishra759.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Harsh Mishra | Pharmaceutical Sciences",
    template: "%s | Harsh Mishra",
  },
  description:
    "Harsh Mishra — pharmacy student documenting pharmaceutical sciences, academic learning and practical training.",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Harsh Mishra | Pharmaceutical Sciences",
    description:
      "A personal space for pharmaceutical science, academic learning and practical experience.",
    siteName: "Harsh Mishra",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harsh Mishra | Pharmaceutical Sciences",
    description:
      "A personal space for pharmaceutical science, academic learning and practical experience.",
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
