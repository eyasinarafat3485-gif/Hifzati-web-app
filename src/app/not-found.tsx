'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, BookOpen, ArrowLeft, Sparkles, Compass } from 'lucide-react';
import BrandName from '@/components/BrandName';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] py-8 sm:py-16 text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-xl glass-card bg-emerald-950/60 border border-emerald-700/40 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-emerald-950/80 relative overflow-hidden backdrop-blur-xl"
      >
        {/* Background Subtle Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Bismillah / Top Islamic Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-950/90 via-emerald-900/80 to-emerald-950/90 border border-amber-500/30 px-4 py-1.5 rounded-full mb-6 shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-arabic text-amber-400 font-bold text-xs sm:text-sm">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</span>
        </motion.div>

        {/* 404 Large Display Emblem */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative inline-block mb-4"
        >
          <div className="text-7xl sm:text-9xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-300 bg-clip-text text-transparent select-none drop-shadow-lg">
            404
          </div>
          <div className="font-arabic text-xl sm:text-2xl text-emerald-400/60 font-bold -mt-2">
            ٤٠٤
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xl sm:text-3xl font-extrabold text-emerald-50 mb-3"
        >
          পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-sm sm:text-base text-emerald-200/80 mb-8 max-w-md mx-auto leading-relaxed"
        >
          দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন তা <BrandName /> ওয়েবসাইটে পাওয়া যায়নি। হয়তো পৃষ্ঠাটি সরানো হয়েছে অথবা লিংকটি ভুল ছিল।
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full"
        >
          <Link
            href="/"
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm sm:text-base px-5 py-3.5 rounded-xl shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span>হোমপেজে ফিরে যান</span>
          </Link>

          <Link
            href="/surahs"
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-emerald-950/90 hover:bg-emerald-900/80 text-emerald-200 font-semibold text-sm sm:text-base px-5 py-3.5 rounded-xl border border-emerald-700/60 hover:border-emerald-500 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
            <span>সূরা তালিকা দেখুন</span>
          </Link>
        </motion.div>

        {/* Decorative Divider */}
        <div className="mt-8 pt-6 border-t border-emerald-800/40 flex items-center justify-center gap-2 text-xs text-emerald-400/60">
          <Compass className="w-4 h-4 text-amber-400/70" />
          <span>আপনার কুরআন হিফজের পবিত্র পথচলা অব্যাহত রাখুন</span>
        </div>
      </motion.div>
    </div>
  );
}
