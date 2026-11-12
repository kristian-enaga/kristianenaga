import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SparkTrail from "../components/SparkTrail";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kristianjayenaga.dev"),
  title: {
    default: "Kristian Jay Eñaga | GTM Automation Engineer — 10 Production Systems",
    template: "%s | Kristian Jay Eñaga",
  },
  description: "I build automation systems that eliminate manual data entry, reduce errors, and speed up repeat operations. 10 production-grade GTM automations: lead sanitization, outbound prospecting, AP invoice reconciliation, revenue recovery, and centralized error handling. Zero silent failures.",
  keywords: [
    "GTM Automation",
    "n8n",
    "Business Process Automation",
    "HubSpot",
    "CRM Integration",
    "Data Engineering",
    "Workflow Automation",
    "AI Enrichment",
    "Lead Scoring",
    "Outbound Prospecting",
    "Invoice Reconciliation",
    "Revenue Recovery",
    "Error Handling",
    "Supabase",
    "Gemini",
    "Make",
    "Clay",
  ],
  authors: [{ name: "Kristian Jay Eñaga", url: "https://github.com/kristian-enaga" }],
  creator: "Kristian Jay Eñaga",
  publisher: "Kristian Jay Eñaga",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kristianjayenaga.dev",
    siteName: "Kristian Jay Eñaga | GTM Automation Engineer",
    title: "Kristian Jay Eñaga | GTM Automation Engineer — 10 Production Systems",
    description: "I build automation systems that eliminate manual data entry, reduce errors, and speed up repeat operations. 10 production-grade GTM automations with zero silent failures.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kristian Jay Eñaga - GTM Automation Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kristian Jay Eñaga | GTM Automation Engineer",
    description: "10 production GTM automations: lead sanitization, outbound prospecting, AP reconciliation, revenue recovery. Zero silent failures.",
    images: ["/og-image.png"],
    creator: "@kristianenaga",
  },
  verification: {
    google: "google-site-verification-code",
  },
  other: {
    "theme-color": "#020617",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="color-scheme" content="dark light" />
      </head>
      <body className="min-h-full flex flex-col relative z-10">
        <SparkTrail />
        {children}
      </body>
    </html>
  );
}