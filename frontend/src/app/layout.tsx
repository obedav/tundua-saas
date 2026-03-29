
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { PostHogProvider } from "@/providers/PostHogProvider";
import { Toaster } from "sonner";
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
  description: "Start your study abroad journey for FREE. Apply to top universities with expert guidance. Professional counseling, document review, and application management from $9.99.",
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
    description: "Start your study abroad journey for FREE. Apply to top universities with expert guidance from $9.99.",
    siteName: "Tundua",
    // OG image auto-generated from src/app/opengraph-image.tsx
  },
  twitter: {
    card: 'summary_large_image',
    title: "Tundua - Study Abroad Application Platform",
    description: "Start your study abroad journey for FREE. Apply to top universities with expert guidance from $9.99.",
    // Twitter image auto-generated from src/app/twitter-image.tsx
    creator: '@tundua',
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
  // Icons auto-generated from src/app/icon.tsx and src/app/apple-icon.tsx
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-15M99B1B4W"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-15M99B1B4W');
          `}
        </Script>
        <SkipLinks />
        <GlobalStructuredData />
        <WebVitalsReporter />
        <PostHogProvider>
          <Providers>
            {children}
            <Toaster position="top-right" richColors />
          </Providers>
        </PostHogProvider>
      </body>
    </html>
  );
}
