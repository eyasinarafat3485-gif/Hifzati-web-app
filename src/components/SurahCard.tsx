'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Surah, toBanglaNumber } from '@/data/surahs';
import { Check, BookOpen } from 'lucide-react';

interface SurahCardProps {
  surah: Surah;
  isSelected: boolean;
  onToggle: (number: number) => void;
}

export default function SurahCard({ surah, isSelected, onToggle }: SurahCardProps) {
  const router = useRouter();
  const surahNum = surah.number || surah.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onToggle(surahNum)}
      className={`relative cursor-pointer rounded-2xl p-3 sm:p-3.5 transition-all duration-300 select-none overflow-hidden ${
        isSelected
          ? 'glass-card-active text-emerald-50'
          : 'glass-card hover:border-emerald-500/40 text-emerald-100/90'
      }`}
    >
      {/* Background active glow effect */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-amber-500/10 pointer-events-none" />
      )}

      <div className="flex items-center justify-between gap-3 sm:gap-4 relative z-10">
        
        {/* Left Section: Number Badge + Surah Bangla Name & Subtitle */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
          {/* Number Badge */}
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 rounded-xl transition-all duration-300 ${
              isSelected
                ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-bold shadow-md shadow-emerald-900/50 border border-emerald-300/40'
                : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
            }`}
          >
            <span className="text-xs sm:text-sm font-bold">
              {toBanglaNumber(surahNum)}
            </span>
          </div>

          {/* Surah Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="font-bold text-xs sm:text-base text-emerald-100 leading-snug truncate">
                {surah.banglaName}
              </h3>
              <span
                className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full font-semibold shrink-0 ${
                  surah.revelationType === 'মাক্কী' || surah.type === 'makkah'
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-800/50'
                    : 'bg-teal-950/80 text-teal-300 border border-teal-800/50'
                }`}
              >
                {surah.revelationType || (surah.type === 'makkah' ? 'মাক্কী' : 'মাদানী')}
              </span>
            </div>

            <p className="text-[10px] sm:text-xs text-emerald-300/70 mt-0.5 truncate leading-tight">
              {surah.transliteration} {surah.meaningBangla ? `• ${surah.meaningBangla}` : ''} • {toBanglaNumber(surah.ayahCount || surah.totalAyahs)} আয়াত
            </p>
          </div>
        </div>

        {/* Right Section Column: Arabic Name (Top) & Action Buttons (Bottom) */}
        <div className="flex flex-col items-end justify-center gap-1 sm:gap-1.5 shrink-0">
          
          {/* Arabic Calligraphy Name */}
          <span className="font-arabic text-base sm:text-xl text-amber-400 font-bold tracking-wide leading-none text-right">
            {surah.arabicName}
          </span>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Read Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/surahs/${surahNum}`);
              }}
              className="flex items-center gap-1 bg-emerald-950/90 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-emerald-700/70 hover:border-amber-400 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
              title="সূরা পড়ুন ও বাংলা অনুবাদ দেখুন"
            >
              <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
              <span>পড়ুন</span>
            </button>

            {/* Checkbox indicator */}
            <div
              className={`w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 shadow-md scale-105'
                  : 'border border-emerald-700/60 bg-emerald-950/30 text-transparent'
              }`}
            >
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
