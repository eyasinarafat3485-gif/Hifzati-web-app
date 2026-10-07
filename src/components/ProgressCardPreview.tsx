'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState } from 'react';
import { useHifz } from '@/context/HifzContext';
import { SURAHS_DATA, toBanglaNumber } from '@/data/surahs';
import { toPng } from 'html-to-image';
import { Download, Share2, Sparkles, Award, Calendar } from 'lucide-react';

export default function ProgressCardPreview() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const { name, image, userName, userAvatar, totalMemorizedCount, totalAyahsMemorized, percentageCompleted, memorizedSurahs, selectedSurahIds } = useHifz();

  const currentDate = '৭ অক্টোবর, ২০২৬';
  const displayName = (name || userName || '').trim() || 'মোঃ আইয়াসিন আরাফাত';
  const displayImage = image || userAvatar;
  const activeSurahNumbers = memorizedSurahs || selectedSurahIds || [];

  // Get first 6 selected surahs for highlight
  const highlightedSurahs = SURAHS_DATA.filter((s) =>
    activeSurahNumbers.includes(s.number || s.id)
  ).slice(0, 6);

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        quality: 0.95,
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = `hifzati-progress-${displayName.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image download', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'হিফজতি — আমার কুরআন হিফজের পথচলা',
      text: `আলহামদুলিল্লাহ! আমি হিফজতি অ্যাপে কুরআনুল কারীমের ${toBanglaNumber(totalMemorizedCount)} টি সূরা (${toBanglaNumber(percentageCompleted)}%) মুখস্থ সম্পন্ন করেছি!`,
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Downloadable / Shareable Card Container */}
      <div
        ref={cardRef}
        className="w-full max-w-md bg-gradient-to-br from-[#06241c] via-[#041a14] to-[#010e0b] rounded-3xl p-6 sm:p-8 border-2 border-amber-500/40 shadow-2xl relative overflow-hidden text-emerald-100 select-none"
      >
        {/* Subtle Decorative Islamic Geometry Rings */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full border-4 border-amber-500/10 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full border-4 border-emerald-500/10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-amber-950/20 pointer-events-none" />

        {/* Card Header: Brand Logo & Title */}
        <div className="flex items-center justify-between pb-5 border-b border-emerald-800/40 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <span className="font-arabic text-lg font-extrabold">ح</span>
            </div>
            <div>
              <h2 className="font-bold text-lg text-emerald-50 leading-tight">হিফজতি — Hifzati</h2>
              <p className="text-[11px] text-amber-400 font-medium">আমার কুরআন হিফজের পথচলা</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-emerald-400/80 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-700/40 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-400" />
              {currentDate}
            </span>
          </div>
        </div>

        {/* User Info & Uploaded Profile Picture */}
        <div className="my-6 flex items-center gap-4 relative z-10">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 p-1 shadow-lg shadow-emerald-900/60">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={displayName}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-emerald-900 flex items-center justify-center text-amber-300 font-bold text-2xl font-arabic">
                  {displayName.charAt(0)}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow-md">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-amber-300 leading-tight">{displayName}</h3>
            <p className="text-xs text-emerald-300/80 mt-0.5">
              কুরআনুল কারীম মুখস্থকারী শিক্ষার্থী
            </p>
          </div>
        </div>

        {/* Big Progress Counter Metrics Box */}
        <div className="bg-gradient-to-r from-emerald-950/90 to-teal-950/80 rounded-2xl p-4 border border-emerald-500/30 relative z-10 shadow-inner">
          <div className="grid grid-cols-3 gap-2 text-center">
            
            <div className="p-2 border-r border-emerald-800/40">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 block leading-tight">
                {toBanglaNumber(totalMemorizedCount)}
              </span>
              <span className="text-[11px] text-emerald-300/80 font-medium">সূরা মুখস্থ</span>
            </div>

            <div className="p-2 border-r border-emerald-800/40">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300 block leading-tight">
                {toBanglaNumber(percentageCompleted)}%
              </span>
              <span className="text-[11px] text-emerald-300/80 font-medium">সম্পন্ন</span>
            </div>

            <div className="p-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-teal-300 block leading-tight">
                {toBanglaNumber(totalAyahsMemorized)}
              </span>
              <span className="text-[11px] text-emerald-300/80 font-medium">মোট আয়াত</span>
            </div>

          </div>

          {/* Progress Bar inside Card */}
          <div className="mt-3">
            <div className="w-full bg-emerald-950/80 rounded-full h-2.5 overflow-hidden border border-emerald-800/50">
              <div
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(percentageCompleted, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Selected Surahs Highlight Chips */}
        {highlightedSurahs.length > 0 && (
          <div className="mt-5 relative z-10">
            <p className="text-[11px] text-emerald-400/80 mb-2 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              মুখস্থকৃত সূরাসেলো (আংশিক):
            </p>
            <div className="flex flex-wrap gap-1.5">
              {highlightedSurahs.map((surah) => (
                <span
                  key={surah.number || surah.id}
                  className="text-xs bg-emerald-900/60 border border-emerald-700/40 px-2.5 py-1 rounded-lg text-emerald-200 flex items-center gap-1"
                >
                  <span className="font-arabic text-amber-400 font-bold">{surah.arabicName}</span>
                  <span>({surah.banglaName})</span>
                </span>
              ))}
              {activeSurahNumbers.length > 6 && (
                <span className="text-xs bg-amber-950/60 border border-amber-800/40 px-2 py-1 rounded-lg text-amber-300 font-medium">
                  + আরও {toBanglaNumber(activeSurahNumbers.length - 6)} টি
                </span>
              )}
            </div>
          </div>
        )}

        {/* Card Footer Watermark */}
        <div className="mt-6 pt-3 border-t border-emerald-800/30 flex items-center justify-between text-[11px] text-emerald-400/70 relative z-10">
          <span className="font-arabic text-amber-400 font-bold">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</span>
          <span className="font-semibold text-emerald-300">hifzati.app</span>
        </div>

      </div>

      {/* Action Buttons: Download Card & Share */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={handleDownloadImage}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg shadow-amber-900/40 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Download className="w-5 h-5" />
          {isDownloading ? 'কার্ড তৈরি হচ্ছে...' : 'কার্ড ডাউনলোড করুন'}
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-emerald-100 font-bold px-6 py-3 rounded-xl border border-emerald-500/40 shadow-lg shadow-emerald-950/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Share2 className="w-5 h-5 text-amber-400" />
          {copiedLink ? 'লিংক কপি হয়েছে!' : 'শেয়ার করুন'}
        </button>
      </div>

    </div>
  );
}
