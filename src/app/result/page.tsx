'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useHifz } from '@/context/HifzContext';
import { SURAHS_DATA, toBanglaNumber } from '@/data/surahs';
import ShareCard from '@/components/ShareCard';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Edit3, Sparkles, BookOpen, RotateCcw } from 'lucide-react';
import BrandName from '@/components/BrandName';

export default function ResultPage() {
  const {
    name,
    image,
    memorizedSurahs,
    totalMemorizedCount,
    remainingCount,
    percentageCompleted,
    saveProgress,
    resetAll,
  } = useHifz();

  const displayName = name.trim() || 'মোঃ আইয়াসিন আরাফাত';

  // Trigger celebration confetti on page load if user has memorized at least 1 surah
  useEffect(() => {
    if (totalMemorizedCount > 0) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#064e3b', '#fbbf24'],
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [totalMemorizedCount]);

  // Selected Surahs sorted by Quran order (surah number 1 to 114)
  const selectedSurahsList = SURAHS_DATA.filter((s) =>
    memorizedSurahs.includes(s.number)
  ).sort((a, b) => a.number - b.number);

  return (
    <div className="py-6 sm:py-10 max-w-5xl mx-auto px-4">
      
      {/* Navigation & Header */}
      <div className="flex items-center justify-between gap-2 mb-6">
        <Link
          href="/surahs"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-emerald-400 hover:text-emerald-200 font-medium transition-colors whitespace-nowrap truncate"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="truncate">সূরা নির্বাচন পেজে ফিরে যান</span>
        </Link>

        {/* Save Progress Button Header Action - 1 line on mobile */}
        <button
          onClick={saveProgress}
          className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-[11px] sm:text-sm px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-xl shadow-lg border border-emerald-400/30 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
        >
          <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
          <span className="whitespace-nowrap">অগ্রগতি সংরক্ষণ করুন</span>
        </button>
      </div>

      {/* Main Result Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-3xl p-6 sm:p-10 border border-emerald-800/40 mb-10 shadow-2xl relative overflow-hidden"
      >
        {/* User Info & Title: "আমার কুরআন যাত্রা" */}
        <div className="text-center sm:text-left flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-emerald-800/40">
          
          {/* User Image Display */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 p-1 shadow-xl shadow-emerald-950/80">
              {image ? (
                <img
                  src={image}
                  alt={displayName}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-emerald-950 flex items-center justify-center text-amber-300 font-bold text-3xl font-arabic">
                  {displayName.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* User Name & Header */}
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-950/80 border border-amber-800/50 px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <BrandName fallbackBangla="হিফজতি রিপোর্ট" fallbackEnglish="Hifzati Report" />
            </span>
            <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-emerald-50 leading-tight whitespace-nowrap">
              আমার কুরআন যাত্রা
            </h1>
            <p className="text-lg sm:text-xl font-bold text-amber-300 mt-1">
              {displayName}
            </p>
          </div>

          {/* Edit Surahs CTA */}
          <div>
            <Link
              href="/surahs"
              className="inline-flex items-center gap-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-200 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap"
            >
              <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
              <span>অগ্রগতি পরিবর্তন</span>
            </Link>
          </div>

        </div>

        {/* Statistics Grid */}
        {/* "মোট সূরা: ১১৪", "মুখস্থ: ১২", "বাকি: ১০২", "অগ্রগতি: ১০.৫%" */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
          
          <div className="bg-emerald-950/70 rounded-2xl p-4 border border-emerald-800/40 text-center">
            <span className="text-xs text-emerald-400/80 block font-medium">মোট সূরা</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-100 font-bangla block mt-1">
              ১১৪
            </span>
          </div>

          <div className="bg-emerald-950/70 rounded-2xl p-4 border border-emerald-800/40 text-center">
            <span className="text-xs text-emerald-400/80 block font-medium">মুখস্থ</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-bangla block mt-1">
              {toBanglaNumber(totalMemorizedCount)}
            </span>
          </div>

          <div className="bg-emerald-950/70 rounded-2xl p-4 border border-emerald-800/40 text-center">
            <span className="text-xs text-emerald-400/80 block font-medium">বাকি</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-teal-300 font-bangla block mt-1">
              {toBanglaNumber(remainingCount)}
            </span>
          </div>

          <div className="bg-emerald-950/70 rounded-2xl p-4 border border-emerald-800/40 text-center">
            <span className="text-xs text-emerald-400/80 block font-medium">অগ্রগতি</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-bangla block mt-1">
              {toBanglaNumber(percentageCompleted)}%
            </span>
          </div>

        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-300 mb-2">
            <span>হিফজ সম্পন্নতার হার</span>
            <span className="text-amber-400 font-bold">{toBanglaNumber(percentageCompleted)}%</span>
          </div>
          <div className="w-full bg-emerald-950 rounded-full h-4 overflow-hidden border border-emerald-800/60 p-0.5 shadow-inner">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-full rounded-full transition-all duration-700 shadow-md"
              style={{ width: `${Math.min(percentageCompleted, 100)}%` }}
            />
          </div>
        </div>

        {/* Action Buttons: 1 single row on mobile */}
        <div className="mt-8 pt-6 border-t border-emerald-800/40 flex flex-row items-center justify-between gap-2.5 w-full max-w-md mx-auto">
          <Link
            href="/surahs"
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-200 px-3 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            <span>ফিরে যান</span>
          </Link>

          <button
            onClick={saveProgress}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs sm:text-sm px-3.5 py-2.5 sm:py-3 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>সংরক্ষণ করুন</span>
          </button>
        </div>

      </motion.div>

      {/* Reusable ShareCard Section with 5 Themes & PNG Export */}
      <div className="my-12">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-100">
            সামাজিক শেয়ারিং মেমরি কার্ড
          </h2>
          <p className="text-xs text-emerald-300/70 mt-1">
            থিম পছন্দ করে আপনার হিফজ কার্ডটি উচ্চমানের PNG ইমেজ হিসেবে ডাউনলোড বা শেয়ার করুন।
          </p>
        </div>

        <ShareCard />
      </div>

      {/* Selected Surahs Section: "আমার মুখস্থ করা সূরা" */}
      <div className="mt-8 glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-emerald-800/40">
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-emerald-800/40">
          <h2 className="text-xs sm:text-lg font-bold text-emerald-50 flex items-center gap-1.5 whitespace-nowrap">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
            <span>আমার মুখস্থ করা সূরা ({toBanglaNumber(selectedSurahsList.length)})</span>
          </h2>

          <Link
            href="/surahs"
            className="text-[11px] sm:text-xs font-semibold text-amber-400 hover:underline whitespace-nowrap shrink-0"
          >
            + নির্বাচন করুন
          </Link>
        </div>

        {/* Selected Surahs Grid displaying number, arabicName, banglaName, ayahCount, revelationType */}
        {selectedSurahsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedSurahsList.map((surah) => (
              <div
                key={surah.number}
                className="bg-emerald-950/80 border border-emerald-800/50 rounded-xl sm:rounded-2xl p-3 flex items-center justify-between hover:border-emerald-500/40 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  {/* Surah Number */}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-900 text-amber-400 flex items-center justify-center font-bold text-xs sm:text-sm border border-emerald-700/50 shrink-0">
                    {toBanglaNumber(surah.number)}
                  </div>

                  {/* Bangla Name, Ayah Count & Revelation Type */}
                  <div>
                    <h3 className="font-bold text-xs sm:text-base text-emerald-100">
                      {surah.banglaName}
                    </h3>
                    <p className="text-[11px] text-emerald-300/70 mt-0.5">
                      {toBanglaNumber(surah.ayahCount || surah.totalAyahs)} আয়াত •{' '}
                      <span className="text-amber-400/90 font-medium">
                        {surah.revelationType || (surah.type === 'makkah' ? 'মাক্কী' : 'মাদানী')}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Arabic Name */}
                <span className="font-arabic text-lg sm:text-2xl text-amber-400 font-bold shrink-0">
                  {surah.arabicName}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-emerald-400/70 text-xs sm:text-sm">
            এখনো কোনো সূরা নির্বাচন করা হয়নি।{" "}
            <Link href="/surahs" className="text-amber-400 font-bold underline ml-1">
              সূরা নির্বাচন শুরু করুন
            </Link>
          </div>
        )}
      </div>

      {/* Reset CTA */}
      <div className="mt-10 text-center">
        <button
          onClick={() => {
            if (confirm("আপনি কি সমস্ত ডাটা রিসেট করতে চান?")) {
              resetAll();
            }
          }}
          className="inline-flex items-center gap-2 text-xs text-rose-400/80 hover:text-rose-300 bg-rose-950/30 border border-rose-900/40 px-4 py-2 rounded-xl transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>ডাটা রিসেট করুন</span>
        </button>
      </div>

    </div>
  );
}
