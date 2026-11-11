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
  title: "Kristian Jay Eñaga | GTM Automation Engineer",
  description: "I build automation systems that solve daily business problems — eliminating manual data entry, reducing errors, freeing up staff time, and speeding up repeat operations. Fail-safe n8n workflows, multi-provider data pipelines, and zero silent failures.",
  keywords: ["GTM Automation", "n8n", "Business Process Automation", "HubSpot", "CRM Integration", "Data Engineering", "Workflow Automation", "AI Enrichment"],
  authors: [{ name: "Kristian Jay Eñaga" }],
  creator: "Kristian Jay Eñaga",
  publisher: "Kristian Jay Eñaga",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kristianjayenaga.dev",
    title: "Kristian Jay Eñaga | GTM Automation Engineer",
    description: "I build automation systems that solve daily business problems.",
    siteName: "Kristian Jay Eñaga",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kristian Jay Eñaga | GTM Automation Engineer",
    description: "I build automation systems that solve daily business problems.",
  },
  verification: {
    google: "google-site-verification-code",
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
      </head>
<body className="min-h-full flex flex-col relative z-10">
    <SparkTrail />
    {children}
  </body>
    </html>
  );
}