'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useHifz } from '@/context/HifzContext';
import { SURAHS_DATA, toBanglaNumber } from '@/data/surahs';
import SurahCard from '@/components/SurahCard';
import { Search, Sparkles, BookOpen, ArrowRight, CheckCheck, Trash2 } from 'lucide-react';

type FilterType = 'all' | 'memorized' | 'remaining' | 'makkah' | 'madinah';

export default function SurahsPage() {
  const {
    selectedSurahIds,
    toggleSurah,
    selectAll,
    deselectAll,
    totalMemorizedCount,
    percentageCompleted,
    totalAyahsMemorized,
  } = useHifz();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Search & Filter & Sort by Quran Order (number 1 to 114)
  const filteredSurahs = useMemo(() => {
    // Ensure Quran Order (surah 1 to 114)
    const sorted = [...SURAHS_DATA].sort((a, b) => a.number - b.number);

    return sorted.filter((surah) => {
      const q = searchQuery.trim().toLowerCase();
      
      // Search by Bangla name, Arabic name, transliteration, or number
      const matchesSearch =
        q === '' ||
        surah.number.toString().includes(q) ||
        toBanglaNumber(surah.number).includes(q) ||
        surah.banglaName.toLowerCase().includes(q) ||
        surah.arabicName.includes(q) ||
        surah.transliteration.toLowerCase().includes(q) ||
        (surah.meaningBangla && surah.meaningBangla.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // Filters: সব সূরা, মুখস্থ করেছি, এখনও বাকি, মাক্কী, মাদানী
      const isSelected = selectedSurahIds.includes(surah.number);
      if (activeFilter === 'memorized' && !isSelected) return false;
      if (activeFilter === 'remaining' && isSelected) return false;
      if (activeFilter === 'makkah' && surah.revelationType !== 'মাক্কী') return false;
      if (activeFilter === 'madinah' && surah.revelationType !== 'মাদানী') return false;

      return true;
    });
  }, [searchQuery, activeFilter, selectedSurahIds]);

  return (
    <div className="pb-28 pt-4">
      
      {/* Header Title Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-950/80 border border-amber-800/50 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            সূরা হিফজ ট্র্যাকার
          </span>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-emerald-50 tracking-tight whitespace-nowrap">
            আমি যেসব সূরা মুখস্থ করেছি
          </h1>
          <p className="text-xs sm:text-sm text-emerald-300/70 mt-1">
            নিচের ১১৪টি সূরার মধ্যে আপনার মুখস্থ করা সূরাগুলো সিলেক্ট করুন।
          </p>
        </div>

        {/* Dynamic Counter & Progress Bar */}
        <div className="glass-card rounded-2xl p-4 border border-emerald-800/40 flex items-center gap-4 min-w-[280px]">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white font-bold text-xl shadow-lg border border-emerald-400/30">
            <span>{toBanglaNumber(totalMemorizedCount)}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-200 mb-1">
              <span>
                {totalMemorizedCount} / 114 ({toBanglaNumber(totalMemorizedCount)} / {toBanglaNumber(114)})
              </span>
              <span className="text-amber-400 font-bold">{toBanglaNumber(percentageCompleted)}%</span>
            </div>
            <div className="w-full bg-emerald-950 rounded-full h-2.5 overflow-hidden border border-emerald-800/40">
              <div
                className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(percentageCompleted, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-emerald-400/70 mt-1">
              মোট আয়াত: {toBanglaNumber(totalAyahsMemorized)}
            </p>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search Box, Filter Buttons, Selection Actions */}
      <div className="space-y-3 mb-6">
        
        {/* Search Input Box */}
        <div className="relative">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="সূরা বাংলা, আরবি বা ইংরেজি নাম লিখে খুঁজুন..."
            className="w-full bg-emerald-950/80 border border-emerald-700/60 rounded-xl sm:rounded-2xl pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3.5 text-emerald-100 placeholder-emerald-600/60 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-medium text-xs sm:text-base"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-emerald-400 hover:text-emerald-200"
            >
              মুছে ফেলুন
            </button>
          )}
        </div>

        {/* Filters and Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Filters Horizontal Scrollable Pill Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none flex-nowrap shrink-0 w-full sm:w-auto -mx-1 px-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-900/60'
              }`}
            >
              সব সূরা ({toBanglaNumber(114)})
            </button>

            <button
              onClick={() => setActiveFilter('memorized')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeFilter === 'memorized'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-900/60'
              }`}
            >
              মুখস্থ ({toBanglaNumber(totalMemorizedCount)})
            </button>

            <button
              onClick={() => setActiveFilter('remaining')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeFilter === 'remaining'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-900/60'
              }`}
            >
              বাকি ({toBanglaNumber(114 - totalMemorizedCount)})
            </button>

            <button
              onClick={() => setActiveFilter('makkah')}
              className={`px-3 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeFilter === 'makkah'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-900/60'
              }`}
            >
              মাক্কী
            </button>

            <button
              onClick={() => setActiveFilter('madinah')}
              className={`px-3 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeFilter === 'madinah'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-900/60'
              }`}
            >
              মাদানী
            </button>
          </div>

          {/* "সব নির্বাচন করুন" & "সব মুছে ফেলুন" Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-emerald-900/40">
            <button
              onClick={selectAll}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-200 bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-600/50 px-3 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <CheckCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>সব নির্বাচন</span>
            </button>

            <button
              onClick={deselectAll}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs font-bold text-rose-300 bg-rose-950/60 hover:bg-rose-900/70 border border-rose-800/50 px-3 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>সব মুছুন</span>
            </button>
          </div>

        </div>

      </div>

      {/* Grid of 114 Surah Cards Sorted in Quranic Order */}
      {filteredSurahs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSurahs.map((surah) => (
            <SurahCard
              key={surah.number}
              surah={surah}
              isSelected={selectedSurahIds.includes(surah.number)}
              onToggle={toggleSurah}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 glass-card rounded-3xl border border-emerald-800/40">
          <BookOpen className="w-12 h-12 text-emerald-500/50 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-emerald-200">কোন সূরা খুঁজে পাওয়া যায়নি</h3>
          <p className="text-xs text-emerald-400/60 mt-1">
            অনুগ্রহ করে আপনার ফিল্টার বা অনুসন্ধানের শব্দ পরিবর্তন করে চেষ্টা করুন।
          </p>
        </div>
      )}

      {/* Sticky Bottom Floating Action Bar */}
      <div className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto z-40">
        <div className="bg-[#041a14]/95 backdrop-blur-xl border-2 border-emerald-500/40 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-900/80 text-amber-400 flex items-center justify-center font-bold text-sm border border-emerald-600/40">
              {selectedSurahIds.length}
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-100">
                {selectedSurahIds.length} / 114 ({toBanglaNumber(selectedSurahIds.length)} / {toBanglaNumber(114)}) সূরা নির্বাচিত
              </p>
              <p className="text-[10px] text-amber-400 font-bold">
                অগ্রগতি: {percentageCompleted}% ({toBanglaNumber(percentageCompleted)}%) সম্পন্ন
              </p>
            </div>
          </div>

          <Link
            href="/result"
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer text-sm sm:text-base"
          >
            <span>ফলাফল দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

        </div>
      </div>

    </div>
  );
}
