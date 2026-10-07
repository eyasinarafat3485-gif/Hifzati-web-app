import type { Metadata } from 'next';
import './globals.css';
import { HifzProvider } from '@/context/HifzContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'হিফজতি — আমার কুরআন হিফজের পথচলা',
  description: 'সহজে এবং সুন্দরভাবে আপনার কুরআন মুখস্থ করার অগ্রগতি ট্র্যাক, শেয়ার ও সংরক্ষণ করুন।',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'হিফজতি',
  },
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#04120e',
};

import SmoothScroll from '@/components/SmoothScroll';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="dark h-full notranslate" translate="no" suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body
        className="min-h-screen flex flex-col bg-[#04120e] text-emerald-100 islamic-bg-pattern antialiased notranslate"
        translate="no"
        suppressHydrationWarning
      >
        <SmoothScroll>
          <HifzProvider>
            <Suspense fallback={<div className="h-16 w-full bg-[#04120e]" />}>
              <Navbar />
            </Suspense>
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </main>
            <Footer />
          </HifzProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
