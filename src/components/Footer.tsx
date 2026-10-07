'use client';

/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Sparkles } from 'lucide-react';
import BrandName from '@/components/BrandName';

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#020b08] border-t border-emerald-900/30 text-emerald-300/70 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand details */}
        <div className="text-center md:text-left flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-500/40 shadow-md flex-shrink-0 bg-[#04120e]">
            <img
              src="/logo.png"
              alt="হিফজতি লোগো"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-0.5">
              <BrandName className="text-lg font-bold text-emerald-100" />
              <span translate="no" className="notranslate font-arabic text-sm text-amber-400">حِفْظَتِي</span>
            </div>
            <p className="text-xs text-emerald-400/80">
              &ldquo;আমার কুরআন হিফজের পথচলা&rdquo; — একটি আধুনিক ও সহজ কুরআন হিফজ ট্র্যাকিং প্ল্যাটফর্ম।
            </p>
          </div>
        </div>

        {/* Hadith / Quote */}
        <div className="max-w-md text-center text-xs text-emerald-300/80 bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/20 italic">
          &ldquo;তোমাদের মধ্যে সর্বোত্তম সেই ব্যক্তি, যে নিজে কুরআন শেখে এবং অন্যকে শিক্ষা দেয়।&rdquo; 
          <span className="block not-italic text-[10px] text-amber-400/90 mt-1 font-semibold">— সহীহ বুখারী: ৫০২৭</span>
        </div>

        {/* Copyright */}
        <div className="text-center md:text-right text-xs text-emerald-500/70">
          <p>© ২০২৬ <BrandName /> — সর্বস্বত্ব সংরক্ষিত</p>
          <p className="text-[11px] text-emerald-600 mt-1 flex items-center justify-center md:justify-end gap-1">
            আল্লাহ রাব্বুল আলামীন আমাদের এই প্রচেষ্টাকে কবুল করুন <Sparkles className="w-3 h-3 text-amber-400 inline" />
          </p>
        </div>

      </div>
    </footer>
  );
}
