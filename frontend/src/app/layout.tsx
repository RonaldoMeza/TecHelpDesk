import type { Metadata } from "next";
import type { Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/Navbar";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TecHelpDesk | Mesa de Ayuda",
    template: "%s | TecHelpDesk",
  },
  description: "Sistema web Help Desk para registrar, gestionar y dar seguimiento a tickets e incidencias.",
  keywords: [
    "help desk",
    "mesa de ayuda",
    "tickets",
    "soporte técnico",
    "incidencias",
    "TecHelpDesk",
  ],
  authors: [{ name: "Diego Meza" }],
  creator: "Diego Meza",
  publisher: "TecHelpDesk",
  applicationName: "TecHelpDesk",
  category: "technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "TecHelpDesk | Mesa de Ayuda",
    description: "Sistema web Help Desk para registrar, gestionar y dar seguimiento a tickets e incidencias.",
    type: "website",
    locale: "es_PE",
    siteName: "TecHelpDesk",
    url: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1d4ed8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#f6f8ff] text-slate-950">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-blue-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Saltar al contenido principal
        </a>
        <Navbar />
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
