import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  description: "Unslop your GTM implementation. Build fail-safe automations that maximize revenue operations. Enterprise n8n workflows, multi-provider data waterfalls, and zero-silent-failure architectures.",
  keywords: ["GTM Automation", "n8n", "Revenue Operations", "HubSpot", "CRM Integration", "Data Engineering", "Workflow Automation", "AI Enrichment"],
  authors: [{ name: "Kristian Jay Eñaga" }],
  creator: "Kristian Jay Eñaga",
  publisher: "Kristian Jay Eñaga",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kristianjayenaga.dev",
    title: "Kristian Jay Eñaga | GTM Automation Engineer",
    description: "Unslop your GTM implementation. Build fail-safe automations that maximize revenue operations.",
    siteName: "Kristian Jay Eñaga",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kristian Jay Eñaga | GTM Automation Engineer",
    description: "Unslop your GTM implementation. Build fail-safe automations that maximize revenue operations.",
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
        {children}
      </body>
    </html>
  );
}