'use client';

/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useHifz } from '@/context/HifzContext';
import { toBanglaNumber } from '@/data/surahs';
import { CheckCircle } from 'lucide-react';
import BrandName from '@/components/BrandName';

export default function Navbar() {
  const pathname = usePathname();
  const { totalMemorizedCount } = useHifz();

  const navLinks = [
    { href: '/', label: 'হোম' },
    { href: '/setup', label: 'প্রোফাইল' },
    { href: '/surahs', label: 'সূরা সমূহ' },
    { href: '/result', label: 'ফলাফল' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#04120e]/95 backdrop-blur-lg border-b border-emerald-900/40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 space-y-2 sm:space-y-0">
        
        {/* Top Bar: Brand Logo & Name (Left), Progress Badge (Right) */}
        <div className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group select-none">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-amber-500/40 shadow-lg shadow-emerald-950/60 group-hover:scale-105 group-hover:border-amber-400 transition-all bg-[#04120e] flex-shrink-0">
              <img
                src="/logo.png"
                alt="হিফজতি লোগো"
                className="w-full h-full object-cover"
                suppressHydrationWarning
              />
            </div>
            <div translate="no" className="notranslate" suppressHydrationWarning>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <BrandName className="text-lg sm:text-xl font-bold text-emerald-100 tracking-tight" />
                <span translate="no" className="notranslate font-arabic text-xs text-amber-400/90 font-medium">حِفْظَتِي</span>
              </div>
              <p className="text-[10px] text-emerald-400/80 -mt-1 hidden sm:block" suppressHydrationWarning>
                আমার কুরআন হিফজের পথচলা
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links & Counter */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    pathname === link.href
                      ? 'bg-emerald-800/60 text-amber-300 border border-amber-500/30 shadow-sm'
                      : 'text-emerald-300/80 hover:text-emerald-100 hover:bg-emerald-950/60'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Quick Counter Badge */}
            <Link
              href="/result"
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-900/80 to-emerald-950/90 hover:from-emerald-800 hover:to-emerald-900 border border-amber-500/40 px-3.5 py-1.5 rounded-full transition-all shadow-md group"
            >
              <CheckCircle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs sm:text-sm font-bold text-emerald-100">
                {toBanglaNumber(totalMemorizedCount)} / {toBanglaNumber(114)}
              </span>
            </Link>
          </div>

          {/* Quick Counter Badge (Mobile Top Right) */}
          <div className="flex md:hidden items-center">
            <Link
              href="/result"
              className="flex items-center gap-1.5 bg-emerald-950/90 border border-amber-500/40 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-100 shadow-sm hover:border-amber-400 transition-all"
            >
              <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>{toBanglaNumber(totalMemorizedCount)} / {toBanglaNumber(114)}</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Pill Bar (Unseen Bangladesh style) - NO Dropdown */}
        <div className="md:hidden bg-emerald-950/80 border border-emerald-800/50 rounded-2xl p-1 flex items-center justify-between gap-1 shadow-inner">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex-1 text-center py-2 px-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-800 to-teal-800 text-amber-300 border border-amber-500/40 shadow-md scale-[1.02]'
                    : 'text-emerald-300/80 hover:text-emerald-100 hover:bg-emerald-900/40'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

      </div>
    </header>
  );
}
