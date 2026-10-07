'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Surah, toBanglaNumber } from '@/data/surahs';
import { Check } from 'lucide-react';

interface SurahCardProps {
  surah: Surah;
  isSelected: boolean;
  onToggle: (number: number) => void;
}

export default function SurahCard({ surah, isSelected, onToggle }: SurahCardProps) {
  const surahNum = surah.number || surah.id;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onToggle(surahNum)}
      className={`relative cursor-pointer rounded-2xl p-4 transition-all duration-300 select-none overflow-hidden ${
        isSelected
          ? 'glass-card-active text-emerald-50'
          : 'glass-card hover:border-emerald-500/40 text-emerald-100/90'
      }`}
    >
      {/* Background active glow effect */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-amber-500/10 pointer-events-none" />
      )}

      <div className="flex items-center justify-between gap-3 relative z-10">
        
        {/* Left Side: Number Badge & Bangla Name */}
        <div className="flex items-center gap-3">
          
          {/* Ornate Octagon / Star Badge */}
          <div
            className={`w-11 h-11 flex items-center justify-center shrink-0 rounded-xl transition-all duration-300 ${
              isSelected
                ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-bold shadow-lg shadow-emerald-900/50 border border-emerald-300/40'
                : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
            }`}
          >
            <span className="text-sm font-bold">
              {toBanglaNumber(surahNum)}
            </span>
          </div>

          {/* Surah Bangla Title & Details */}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base sm:text-lg text-emerald-100 leading-snug">
                {surah.banglaName}
              </h3>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  surah.revelationType === 'মাক্কী' || surah.type === 'makkah'
                    ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                    : 'bg-teal-950/60 text-teal-300 border border-teal-800/40'
                }`}
              >
                {surah.revelationType || (surah.type === 'makkah' ? 'মাক্কী' : 'মাদানী')}
              </span>
            </div>

            <p className="text-xs text-emerald-300/70 mt-0.5">
              {surah.transliteration} {surah.meaningBangla ? `• ${surah.meaningBangla}` : ''} • {toBanglaNumber(surah.ayahCount || surah.totalAyahs)} আয়াত
            </p>
          </div>
        </div>

        {/* Right Side: Arabic Calligraphy Name & Checkbox Icon */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="font-arabic text-xl sm:text-2xl text-amber-400 font-bold tracking-wide block leading-tight">
              {surah.arabicName}
            </span>
            {surah.juz && (
              <span className="text-[10px] text-emerald-400/60 block">
                পারা {toBanglaNumber(surah.juz)}
              </span>
            )}
          </div>

          {/* Selection indicator checkmark */}
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
              isSelected
                ? 'bg-emerald-500 text-slate-950 shadow-md scale-110'
                : 'border border-emerald-700/60 bg-emerald-950/30 text-transparent'
            }`}
          >
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
        </div>

      </div>
    </motion.div>
  );
}
