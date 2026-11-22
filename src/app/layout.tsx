import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";
export const metadata:Metadata={title:{default:"Harsh Mishra | Pharmacy, Research & Learning",template:"%s | Harsh Mishra"},description:"The personal portfolio and learning journal of Harsh Mishra — pharmaceutical sciences, industry experience and structured learning.",metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL??"https://example.com")};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><SiteHeader/><main>{children}</main><SiteFooter/></body></html>}
