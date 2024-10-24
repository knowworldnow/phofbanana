import type { Metadata } from "next";
import { Suspense, lazy } from 'react';
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import Script from 'next/script';
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import "../styles/wordpress-styles.css";

const Header = lazy(() => import("../components/Header"));
const Footer = lazy(() => import("../components/Footer"));

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: 'swap',
  preload: true,
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "pH of Banana",
    template: "%s | pH of Banana",
  },
  description: "Learn about the pH of bananas and their acidity levels",
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'pH of Banana',
    images: [
      {
        url: 'https://phofbanana.com/default-og-image.webp',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@phofbanana',
  },
  verification: {
    google: "c-dvHrELIe8dzXS1ZqfZc1lEgpBbfZZ0BdKyclij2SQ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir={process.env.NEXT_PUBLIC_SITE_DIRECTION || 'ltr'} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="preconnect"
          href="https://pagead2.googlesyndication.com"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen no-vertical-space`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Suspense fallback={<div>Loading header...</div>}>
            <Header />
          </Suspense>
          <main className="flex-grow">{children}</main>
          <Suspense fallback={<div>Loading footer...</div>}>
            <Footer />
          </Suspense>
        </ThemeProvider>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9144697979680971"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        <SpeedInsights />
      </body>
    </html>
  );
}
