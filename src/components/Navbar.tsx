'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useHifz } from '@/context/HifzContext';
import { toBanglaNumber } from '@/data/surahs';
import { CheckCircle, Menu, X, Home, User, BookOpen, Award } from 'lucide-react';
import BrandName from '@/components/BrandName';

export default function Navbar() {
  const pathname = usePathname();
  const { totalMemorizedCount } = useHifz();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'হোম', icon: Home },
    { href: '/setup', label: 'প্রোফাইল', icon: User },
    { href: '/surahs', label: 'সূরা সমূহ', icon: BookOpen },
    { href: '/result', label: 'ফলাফল', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#04120e]/90 backdrop-blur-lg border-b border-emerald-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-amber-500/40 shadow-lg shadow-emerald-950/60 group-hover:scale-105 group-hover:border-amber-400 transition-all bg-[#04120e] flex-shrink-0">
            <img
              src="/logo.png"
              alt="হিফজতি লোগো"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <BrandName className="text-lg sm:text-xl font-bold text-emerald-100 tracking-tight" />
              <span translate="no" className="notranslate font-arabic text-xs text-amber-400/90 font-medium">حِفْظَتِي</span>
            </div>
            <p className="text-[10px] text-emerald-400/80 -mt-1 hidden sm:block">আমার কুরআন হিফজের পথচলা</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
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

        {/* Mobile Header Right Actions */}
        <div className="flex md:hidden items-center gap-2">
          {/* Quick Counter Badge (Mobile) */}
          <Link
            href="/result"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-1.5 bg-emerald-950/90 border border-amber-500/40 px-2.5 py-1.5 rounded-full text-xs font-bold text-emerald-100 shadow-sm"
          >
            <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>{toBanglaNumber(totalMemorizedCount)} / {toBanglaNumber(114)}</span>
          </Link>

          {/* Hamburger Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2 rounded-xl bg-emerald-950 border border-emerald-800/60 text-emerald-200 hover:text-white focus:outline-none transition-all active:scale-95 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5 text-emerald-200" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#04120e]/95 border-b border-emerald-900/60 px-4 pt-3 pb-5 space-y-2 shadow-2xl backdrop-blur-xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-base font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-900/90 to-teal-900/90 text-amber-300 border border-amber-500/40 shadow-lg'
                    : 'text-emerald-200/80 hover:text-white hover:bg-emerald-950/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-emerald-400/70'}`} />
                  <span>{link.label}</span>
                </div>
                {isActive && <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm" />}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
