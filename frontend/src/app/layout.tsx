import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "sonner";
import { GoogleAnalytics } from '@next/third-parties/google';
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import { GlobalStructuredData } from "@/components/StructuredData";
import { WebVitalsReporter } from "@/components/WebVitalsReporter";
import { SkipLinks } from "@/components/accessibility/SkipLink";
import "@/lib/env"; // Import to validate env vars on app startup

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap', // Ensures text is visible during font load (critical for performance)
  preload: true, // Preload the font for faster loading
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000'),
  title: {
    default: "Tundua - Study Abroad Application Platform",
    template: "%s | Tundua" // Page titles will be "Page Name | Tundua"
  },
  description: "Complete study abroad application support from $299. Apply to top universities with expert guidance. Professional counseling, document review, and application management.",
  keywords: [
    "study abroad",
    "university applications",
    "international education",
    "student visa",
    "application support",
    "university counseling",
    "study overseas",
    "international students"
  ],
  authors: [{ name: "Tundua" }],
  creator: "Tundua",
  publisher: "Tundua",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env['NEXT_PUBLIC_APP_URL'],
    title: "Tundua - Study Abroad Application Platform",
    description: "Complete study abroad application support from $299. Apply to top universities with expert guidance.",
    siteName: "Tundua",
    images: [
      {
        url: '/og-image.png', // TODO: Create this image (1200x630px)
        width: 1200,
        height: 630,
        alt: 'Tundua Study Abroad Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Tundua - Study Abroad Application Platform",
    description: "Complete study abroad application support from $299. Apply to top universities with expert guidance.",
    images: ['/twitter-image.png'], // TODO: Create this image (1200x600px)
    creator: '@tundua', // TODO: Replace with your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <SkipLinks />
        <GlobalStructuredData />
        <WebVitalsReporter />
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
        {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
      </body>
    </html>
  );
}
