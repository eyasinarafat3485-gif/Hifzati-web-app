'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState } from 'react';
import { useHifz } from '@/context/HifzContext';
import { SURAHS_DATA, toBanglaNumber } from '@/data/surahs';
import { toPng } from 'html-to-image';
import { Download, Share2, Copy, Check, Sparkles, Award } from 'lucide-react';

export type CardThemeId = 'minimal' | 'green' | 'night' | 'islamic' | 'gold';

interface ThemeConfig {
  id: CardThemeId;
  nameBangla: string;
  bgClass: string;
  textPrimary: string;
  textSecondary: string;
  accentColor: string;
  progressBarGradient: string;
  cardBorder: string;
  chipBg: string;
  boxBg: string;
  dotBg: string;
}

export const CARD_THEMES: Record<CardThemeId, ThemeConfig> = {
  minimal: {
    id: 'minimal',
    nameBangla: 'মিনিমাল',
    bgClass: 'bg-slate-50 text-slate-900',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    accentColor: 'text-emerald-700',
    progressBarGradient: 'from-emerald-600 to-teal-600',
    cardBorder: 'border-slate-300',
    chipBg: 'bg-slate-200/80 text-slate-800 border-slate-300',
    boxBg: 'bg-white border-slate-200 text-slate-900 shadow-sm',
    dotBg: 'bg-emerald-600',
  },
  green: {
    id: 'green',
    nameBangla: 'সবুজ',
    bgClass: 'bg-gradient-to-br from-[#042f22] via-[#064e3b] to-[#022c22] text-emerald-50',
    textPrimary: 'text-emerald-50',
    textSecondary: 'text-emerald-300/80',
    accentColor: 'text-amber-400',
    progressBarGradient: 'from-emerald-400 via-teal-300 to-amber-400',
    cardBorder: 'border-emerald-500/40',
    chipBg: 'bg-emerald-900/70 text-emerald-200 border-emerald-700/50',
    boxBg: 'bg-emerald-950/80 border-emerald-700/50 text-emerald-100',
    dotBg: 'bg-amber-400',
  },
  night: {
    id: 'night',
    nameBangla: 'রাত',
    bgClass: 'bg-gradient-to-br from-[#090d16] via-[#0f172a] to-[#020617] text-slate-100',
    textPrimary: 'text-slate-50',
    textSecondary: 'text-slate-400',
    accentColor: 'text-cyan-300',
    progressBarGradient: 'from-cyan-400 via-blue-400 to-indigo-500',
    cardBorder: 'border-indigo-500/40',
    chipBg: 'bg-slate-800/80 text-cyan-200 border-indigo-700/50',
    boxBg: 'bg-slate-900/90 border-indigo-800/50 text-slate-100',
    dotBg: 'bg-cyan-400',
  },
  islamic: {
    id: 'islamic',
    nameBangla: 'ইসলামিক',
    bgClass: 'bg-gradient-to-br from-[#053738] via-[#0b4f51] to-[#032223] text-teal-50',
    textPrimary: 'text-teal-50',
    textSecondary: 'text-teal-200/80',
    accentColor: 'text-amber-300',
    progressBarGradient: 'from-teal-300 via-emerald-300 to-amber-300',
    cardBorder: 'border-teal-400/40',
    chipBg: 'bg-teal-900/70 text-teal-100 border-teal-700/50',
    boxBg: 'bg-teal-950/80 border-teal-700/50 text-teal-100',
    dotBg: 'bg-amber-300',
  },
  gold: {
    id: 'gold',
    nameBangla: 'সোনালি',
    bgClass: 'bg-gradient-to-br from-[#2a1b04] via-[#452a07] to-[#170e02] text-amber-50',
    textPrimary: 'text-amber-50',
    textSecondary: 'text-amber-200/80',
    accentColor: 'text-yellow-300',
    progressBarGradient: 'from-amber-400 via-yellow-300 to-amber-500',
    cardBorder: 'border-amber-500/50',
    chipBg: 'bg-amber-900/70 text-amber-100 border-amber-700/50',
    boxBg: 'bg-amber-950/80 border-amber-700/50 text-amber-100',
    dotBg: 'bg-yellow-300',
  },
};

export default function ShareCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeThemeId, setActiveThemeId] = useState<CardThemeId>('green');
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const {
    name,
    image,
    userName,
    userAvatar,
    totalMemorizedCount,
    percentageCompleted,
    memorizedSurahs,
    selectedSurahIds,
  } = useHifz();

  const currentDate = '৭ অক্টোবর, ২০২৬';
  const displayName = (name || userName || '').trim() || 'মো: ইয়াছিন আরাফাত';
  const displayImage = image || userAvatar;
  const activeSurahNumbers = memorizedSurahs || selectedSurahIds || [];

  const themeConfig = CARD_THEMES[activeThemeId];

  // Selected surahs sorted by Quran order for preview
  const selectedSurahs = SURAHS_DATA.filter((s) =>
    activeSurahNumbers.includes(s.number || s.id)
  ).sort((a, b) => a.number - b.number);

  const highlightedSurahs = selectedSurahs.slice(0, 6);

  // PNG Export Handler (1080 x 1350 resolution export)
  const handleDownloadPNG = async () => {
    if (!cardRef.current) return;
    try {
      setIsDownloading(true);

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        quality: 1.0,
        pixelRatio: 3, // High DPI scaling for 1080x1350 crisp social media export
      });

      const sanitizedName = displayName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || 'user';

      const link = document.createElement('a');
      link.download = `hifzpath-${sanitizedName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate PNG', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Web Share API Handler
  const handleShare = async () => {
    const shareText = `আলহামদুলিল্লাহ! আমি হিফজতি প্ল্যাটফর্মে কুরআনুল কারীমের ${toBanglaNumber(totalMemorizedCount)} টি সূরা (${toBanglaNumber(percentageCompleted)}%) মুখস্থ সম্পন্ন করেছি!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'আমার কুরআন যাত্রা — হিফজতি',
          text: shareText,
          url: window.location.origin,
        });
      } catch (e) {
        console.error('Share error', e);
      }
    } else {
      handleCopyLink();
    }
  };

  // Copy Link Handler
  const handleCopyLink = async () => {
    try {
      const shareText = `আলহামদুলিল্লাহ! আমি হিফজতি প্ল্যাটফর্মে কুরআনুল কারীমের ${toBanglaNumber(totalMemorizedCount)} টি সূরা (${toBanglaNumber(percentageCompleted)}%) মুখস্থ সম্পন্ন করেছি!\n${window.location.origin}`;
      await navigator.clipboard.writeText(shareText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* 5 Theme Selector Pills */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2 bg-emerald-950/80 p-2 rounded-2xl border border-emerald-800/40">
        <span className="text-xs text-emerald-300 font-semibold px-2">থিম বেছে নিন:</span>
        {(Object.keys(CARD_THEMES) as CardThemeId[]).map((themeId) => {
          const t = CARD_THEMES[themeId];
          return (
            <button
              key={themeId}
              onClick={() => setActiveThemeId(themeId)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeThemeId === themeId
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                  : 'bg-emerald-900/40 text-emerald-200 border border-emerald-700/40 hover:bg-emerald-800/60'
              }`}
            >
              {t.nameBangla}
            </button>
          );
        })}
      </div>

      {/* Share Card Container (Captures ONLY this div for 1080x1350 PNG export) */}
      <div
        ref={cardRef}
        className={`w-full max-w-[420px] aspect-[4/5] rounded-3xl p-6 sm:p-8 border-2 ${themeConfig.cardBorder} ${themeConfig.bgClass} shadow-2xl relative overflow-hidden select-none flex flex-col justify-between`}
      >
        {/* Decorative Background Elements */}
        <div className="absolute -top-14 -right-14 w-48 h-48 rounded-full border-4 border-current opacity-10 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full border-4 border-current opacity-10 pointer-events-none" />

        <div>
          {/* Card Top Banner: Title & Date */}
          <div className="flex items-center justify-between pb-4 border-b border-current/20 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-md">
                <span className="font-arabic text-lg font-extrabold">ح</span>
              </div>
              <div>
                <h2 className={`font-extrabold text-base leading-tight ${themeConfig.textPrimary}`}>
                  আমার কুরআন যাত্রা
                </h2>
                <p className={`text-[11px] font-semibold ${themeConfig.accentColor}`}>
                  হিফজতি — HifzPath
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border border-current/30 ${themeConfig.chipBg}`}>
                {currentDate}
              </span>
            </div>
          </div>

          {/* User Profile Info & Image */}
          <div className="my-5 flex items-center gap-4 relative z-10">
            <div className="relative">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-1 shadow-lg">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={displayName}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-amber-300 font-bold text-2xl font-arabic">
                    {displayName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow-md">
                <Award className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <h3 className={`text-xl font-extrabold leading-tight ${themeConfig.textPrimary} ${
                !name.trim() && !userName.trim() ? 'opacity-65 blur-[0.4px] italic' : ''
              }`}>
                {displayName}
              </h3>
              <p className={`text-xs font-medium mt-0.5 ${themeConfig.textSecondary}`}>
                কুরআনুল কারীম মুখস্থকারী শিক্ষার্থী
              </p>
            </div>
          </div>

          {/* Key Statistics Grid */}
          <div className={`rounded-2xl p-4 border ${themeConfig.boxBg} relative z-10 shadow-sm my-4`}>
            <div className="grid grid-cols-3 gap-2 text-center">
              
              <div className="p-1 border-r border-current/20">
                <span className={`text-2xl sm:text-3xl font-extrabold block leading-tight ${themeConfig.accentColor}`}>
                  {toBanglaNumber(totalMemorizedCount)}
                </span>
                <span className={`text-[11px] font-medium ${themeConfig.textSecondary}`}>
                  মুখস্থ সূরা
                </span>
              </div>

              <div className="p-1 border-r border-current/20">
                <span className={`text-2xl sm:text-3xl font-extrabold block leading-tight ${themeConfig.textPrimary}`}>
                  {toBanglaNumber(114)}
                </span>
                <span className={`text-[11px] font-medium ${themeConfig.textSecondary}`}>
                  মোট সূরা
                </span>
              </div>

              <div className="p-1">
                <span className={`text-2xl sm:text-3xl font-extrabold block leading-tight ${themeConfig.accentColor}`}>
                  {toBanglaNumber(percentageCompleted)}%
                </span>
                <span className={`text-[11px] font-medium ${themeConfig.textSecondary}`}>
                  অগ্রগতি
                </span>
              </div>

            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden border border-current/20 p-0.5">
                <div
                  className={`bg-gradient-to-r ${themeConfig.progressBarGradient} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min(percentageCompleted, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Selected Surahs Highlights */}
          {highlightedSurahs.length > 0 && (
            <div className="my-3 relative z-10">
              <p className={`text-[11px] font-semibold mb-1.5 flex items-center gap-1 ${themeConfig.textSecondary}`}>
                <Sparkles className="w-3 h-3 text-amber-400" />
                মুখস্থকৃত সূরাসমূহ:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {highlightedSurahs.map((surah) => (
                  <span
                    key={surah.number || surah.id}
                    className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1 font-medium ${themeConfig.chipBg}`}
                  >
                    <span className="font-arabic font-bold text-amber-400">{surah.arabicName}</span>
                    <span>({surah.banglaName})</span>
                  </span>
                ))}
                {activeSurahNumbers.length > 6 && (
                  <span className={`text-xs px-2 py-1 rounded-lg border font-semibold ${themeConfig.chipBg}`}>
                    + আরও {toBanglaNumber(activeSurahNumbers.length - 6)} টি
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Card Footer: Short Neutral Motivational Line & Branding */}
        <div className="pt-4 border-t border-current/20 relative z-10 flex items-center justify-between">
          <p className={`text-xs font-semibold italic ${themeConfig.textSecondary}`}>
            &ldquo;কুরআনের সাথে পথচলা অব্যাহত থাকুক।&rdquo;
          </p>
          <span className="text-[11px] font-bold text-amber-400">hifzpath.app</span>
        </div>

      </div>

      {/* Action Buttons: 2 Clean Lines Layout for all mobile devices */}
      <div className="mt-6 w-full max-w-[420px] space-y-2">
        {/* Line 1: PNG Download Primary CTA */}
        <button
          onClick={handleDownloadPNG}
          disabled={isDownloading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs sm:text-sm py-2.5 sm:py-3 px-4 rounded-xl shadow-lg shadow-amber-950/40 transition-all active:scale-95 disabled:opacity-50 cursor-pointer whitespace-nowrap"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>{isDownloading ? 'PNG তৈরি হচ্ছে...' : 'PNG ডাউনলোড করুন'}</span>
        </button>

        {/* Line 2: Share & Copy Link Side by Side in 1 row */}
        <div className="flex flex-row items-center gap-2 w-full">
          <button
            onClick={handleShare}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-emerald-100 font-bold text-xs sm:text-sm py-2.5 px-2.5 rounded-xl border border-emerald-500/40 shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>শেয়ার করুন</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 font-semibold text-xs sm:text-sm py-2.5 px-2.5 rounded-xl border border-emerald-700/50 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>লিংক কপি</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
