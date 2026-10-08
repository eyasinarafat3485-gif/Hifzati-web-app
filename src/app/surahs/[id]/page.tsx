'use client';

import React, { use, useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { SURAHS_DATA, toBanglaNumber, Surah } from '@/data/surahs';
import { useHifz } from '@/context/HifzContext';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Play,
  Pause,
  Volume2,
  Sparkles,
  RotateCcw,
  Type,
  Eye,
  EyeOff,
  Layers,
} from 'lucide-react';

interface AyahData {
  number: number;
  numberInSurah: number;
  text: string;
  bengaliText?: string;
  audioUrl?: string;
  juz: number;
  page: number;
}

function SurahDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const surahId = Number(resolvedParams?.id);

  const { selectedSurahIds, toggleSurah } = useHifz();

  const [surahMeta, setSurahMeta] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<AyahData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Settings
  const [arabicFontSize, setArabicFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [showBengali, setShowBengali] = useState<boolean>(true);
  
  // Audio state
  const [playingAyahIndex, setPlayingAyahIndex] = useState<number | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState<boolean>(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // Auto pause Surah recitation if background audio is activated
  useEffect(() => {
    const handlePauseSurahAudio = () => {
      if (currentAudio) {
        currentAudio.pause();
      }
      setPlayingAyahIndex(null);
      setIsPlayingAll(false);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('pause-surah-audio', handlePauseSurahAudio);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('pause-surah-audio', handlePauseSurahAudio);
      }
    };
  }, [currentAudio]);

  // Find local surah metadata immediately
  useEffect(() => {
    if (surahId && surahId >= 1 && surahId <= 114) {
      const found = SURAHS_DATA.find((s) => s.number === surahId || s.id === surahId);
      if (found) {
        setSurahMeta(found);
      }
    }
  }, [surahId]);

  // Fetch full Arabic text & Bengali translation from API
  useEffect(() => {
    let isMounted = true;
    if (!surahId || surahId < 1 || surahId > 114) return;

    async function fetchSurahData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch Arabic Uthmani + Bengali Translation + Alafasy Audio
        const res = await fetch(
          `https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,bn.bengali,ar.alafasy`
        );

        if (!res.ok) {
          throw new Error('কুরআনের তথ্য আনতে সমস্যা হয়েছে। দয়া করে ইন্টারনেট কানেকশন চেক করুন।');
        }

        const data = await res.json();
        if (data.code === 200 && Array.isArray(data.data) && data.data.length >= 2) {
          const arEdition = data.data[0];
          const bnEdition = data.data[1];
          const audioEdition = data.data[2];

          const combinedAyahs: AyahData[] = arEdition.ayahs.map((arAyah: any, index: number) => {
            const bnAyah = bnEdition?.ayahs?.[index];
            const audioAyah = audioEdition?.ayahs?.[index];

            // Remove Bismillah prefix from first Ayah if it's Uthmani script and not Surah Fatiha
            let arabicText = arAyah.text;
            if (
              surahId !== 1 &&
              surahId !== 9 &&
              arAyah.numberInSurah === 1 &&
              arabicText.startsWith('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ')
            ) {
              arabicText = arabicText.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim();
            }

            return {
              number: arAyah.number,
              numberInSurah: arAyah.numberInSurah,
              text: arabicText,
              bengaliText: bnAyah?.text || '',
              audioUrl: audioAyah?.audio || `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${arAyah.number}.mp3`,
              juz: arAyah.juz,
              page: arAyah.page,
            };
          });

          if (isMounted) {
            setAyahs(combinedAyahs);
            setLoading(false);
          }
        } else {
          throw new Error('কুরআনের উপাত্ত লোড করা সম্ভব হয়নি।');
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'নেটওয়ার্ক এরর। পুনরায় চেষ্টা করুন।');
          setLoading(false);
        }
      }
    }

    fetchSurahData();

    return () => {
      isMounted = false;
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, [surahId]);

  // Handle single Ayah audio play/pause
  const togglePlayAyah = (index: number, audioUrl?: string) => {
    if (!audioUrl) return;

    // Trigger auto-mute for background audio when Surah audio starts
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pause-bg-audio'));
    }

    if (playingAyahIndex === index && currentAudio) {
      if (currentAudio.paused) {
        currentAudio.play();
      } else {
        currentAudio.pause();
        setPlayingAyahIndex(null);
        setIsPlayingAll(false);
      }
      return;
    }

    if (currentAudio) {
      currentAudio.pause();
    }

    const audio = new Audio(audioUrl);
    setCurrentAudio(audio);
    setPlayingAyahIndex(index);

    audio.play().catch(() => setPlayingAyahIndex(null));

    audio.onended = () => {
      if (isPlayingAll && index + 1 < ayahs.length) {
        togglePlayAyah(index + 1, ayahs[index + 1].audioUrl);
      } else {
        setPlayingAyahIndex(null);
        setIsPlayingAll(false);
      }
    };
  };

  // Play full surah audio
  const togglePlayFullSurah = () => {
    if (isPlayingAll) {
      if (currentAudio) {
        currentAudio.pause();
      }
      setIsPlayingAll(false);
      setPlayingAyahIndex(null);
    } else {
      if (ayahs.length > 0) {
        setIsPlayingAll(true);
        togglePlayAyah(0, ayahs[0].audioUrl);
      }
    }
  };

  const isMemorized = surahMeta ? selectedSurahIds.includes(surahMeta.number) : false;

  // Font size mapping
  const arabicFontClasses = {
    normal: 'text-xl sm:text-2xl lg:text-3xl leading-[2.2]',
    large: 'text-2xl sm:text-3xl lg:text-4xl leading-[2.3]',
    xlarge: 'text-3xl sm:text-4xl lg:text-5xl leading-[2.4]',
  };

  if (!surahId || surahId < 1 || surahId > 114) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-amber-400 mb-4">অবৈধ সূরা আইডি</h2>
        <Link
          href="/surahs"
          className="inline-flex items-center gap-2 bg-emerald-800 text-emerald-100 px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> সূরা তালিকায় ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-36 pt-4 max-w-5xl mx-auto px-2 sm:px-4">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          href="/surahs"
          className="inline-flex items-center gap-2 bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-800/60 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 shrink-0" />
          <span>সূরা তালিকা</span>
        </Link>

        {/* Prev / Next Quick Nav */}
        <div className="flex items-center gap-2">
          {surahId > 1 && (
            <Link
              href={`/surahs/${surahId - 1}`}
              className="p-2 bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/50 rounded-xl transition-all"
              title="পূর্ববর্তী সূরা"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}
          <span className="text-xs text-emerald-400 font-bold px-2">
            {toBanglaNumber(surahId)} / {toBanglaNumber(114)}
          </span>
          {surahId < 114 && (
            <Link
              href={`/surahs/${surahId + 1}`}
              className="p-2 bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/50 rounded-xl transition-all"
              title="পরবর্তী সূরা"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Main Surah Header Banner */}
      {surahMeta && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card bg-emerald-950/70 border border-emerald-700/50 rounded-3xl p-5 sm:p-8 mb-6 shadow-2xl relative overflow-hidden text-center"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Surah Arabic Title Calligraphy */}
          <h1 className="font-arabic text-3xl sm:text-5xl text-amber-400 font-bold mb-2 tracking-wide">
            {surahMeta.arabicName}
          </h1>

          {/* Surah Bangla Name & Transliteration */}
          <h2 className="text-xl sm:text-3xl font-extrabold text-emerald-50 mb-1">
            {surahMeta.banglaName}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-300/80 font-medium mb-4">
            {surahMeta.transliteration} {surahMeta.meaningBangla ? `• ${surahMeta.meaningBangla}` : ''}
          </p>

          {/* Badges Info Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs mb-6">
            <span className="bg-emerald-900/80 text-emerald-200 border border-emerald-700/40 px-3 py-1 rounded-full font-semibold">
              {surahMeta.revelationType}
            </span>
            <span className="bg-emerald-900/80 text-emerald-200 border border-emerald-700/40 px-3 py-1 rounded-full font-semibold">
              {toBanglaNumber(surahMeta.ayahCount || surahMeta.totalAyahs)} আয়াত
            </span>
            {surahMeta.juz && (
              <span className="bg-emerald-900/80 text-emerald-200 border border-emerald-700/40 px-3 py-1 rounded-full font-semibold">
                পারা {toBanglaNumber(surahMeta.juz)}
              </span>
            )}
          </div>

          {/* Control Actions (Play Full Surah & Toggle Memorized Status) */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={togglePlayFullSurah}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-lg active:scale-95 ${
                isPlayingAll
                  ? 'bg-amber-500 text-slate-950 shadow-amber-900/40'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-emerald-950/60'
              }`}
            >
              {isPlayingAll ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>অডিও বন্ধ করুন</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>পূর্ণ সূরা শুনুন</span>
                </>
              )}
            </button>

            <button
              onClick={() => toggleSurah(surahMeta.number)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border transition-all cursor-pointer active:scale-95 ${
                isMemorized
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                  : 'bg-emerald-950/80 text-emerald-200 border border-emerald-700/50 hover:bg-emerald-900/60'
              }`}
            >
              {isMemorized ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>মুখস্থ তালিকা থেকে সরাতে চান?</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>মুখস্থ হয়েছে হিসাবে চিহ্নিত করুন</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Sticky Reader Controls Toolbar */}
      <div className="sticky top-16 z-30 glass-card bg-[#061914]/90 border border-emerald-700/50 rounded-2xl p-3 mb-6 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        {/* Font Size Adjuster */}
        <div className="flex items-center gap-1 bg-emerald-950/80 border border-emerald-800/60 p-1 rounded-xl">
          <span className="text-[11px] text-emerald-400 px-2 font-medium flex items-center gap-1">
            <Type className="w-3.5 h-3.5" /> আরবি ফন্ট:
          </span>
          {(['normal', 'large', 'xlarge'] as const).map((size) => (
            <button
              key={size}
              onClick={() => setArabicFontSize(size)}
              className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                arabicFontSize === size
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-emerald-300 hover:text-emerald-100'
              }`}
            >
              {size === 'normal' ? 'ছোট' : size === 'large' ? 'মাঝারি' : 'বড়'}
            </button>
          ))}
        </div>

        {/* Translation Toggle */}
        <button
          onClick={() => setShowBengali(!showBengali)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            showBengali
              ? 'bg-emerald-900/80 text-emerald-200 border-emerald-700/60'
              : 'bg-emerald-950/60 text-emerald-400/70 border-emerald-900/50'
          }`}
        >
          {showBengali ? <Eye className="w-3.5 h-3.5 text-amber-400" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>বাংলা অনুবাদ {showBengali ? 'প্রদর্শিত' : 'লুকানো'}</span>
        </button>
      </div>

      {/* Bismillah Banner (except Surah At-Tawbah #9) */}
      {surahId !== 9 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center my-6 py-4 px-6 glass-card bg-emerald-950/40 border border-amber-500/20 rounded-2xl"
        >
          <span className="font-arabic text-2xl sm:text-4xl text-amber-400 font-bold block leading-relaxed">
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </span>
          <span className="text-xs text-emerald-300/60 mt-1 block">
            পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে শুরু করছি
          </span>
        </motion.div>
      )}

      {/* Loading State Skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className="glass-card bg-emerald-950/40 border border-emerald-800/30 rounded-2xl p-6 animate-pulse"
            >
              <div className="h-4 bg-emerald-900/50 rounded w-16 mb-4" />
              <div className="h-8 bg-emerald-900/40 rounded w-3/4 ml-auto mb-3" />
              <div className="h-4 bg-emerald-900/30 rounded w-2/3 mt-4" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="glass-card bg-rose-950/40 border border-rose-800/50 rounded-2xl p-8 text-center my-8">
          <p className="text-rose-300 font-medium mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          >
            <RotateCcw className="w-4 h-4" /> পুনরায় চেষ্টা করুন
          </button>
        </div>
      )}

      {/* Ayahs Display List */}
      {!loading && !error && (
        <div className="space-y-4 sm:space-y-6">
          {ayahs.map((ayah, index) => {
            const isPlayingThis = playingAyahIndex === index;

            return (
              <motion.div
                key={ayah.numberInSurah}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
                className={`glass-card rounded-2xl p-4 sm:p-6 transition-all duration-300 border ${
                  isPlayingThis
                    ? 'border-amber-400/80 bg-emerald-950/90 shadow-xl shadow-emerald-950/90 ring-1 ring-amber-400/40'
                    : 'border-emerald-800/40 hover:border-emerald-700/60 bg-emerald-950/50'
                }`}
              >
                {/* Ayah Top Header Toolbar */}
                <div className="flex items-center justify-between gap-2 border-b border-emerald-800/30 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    {/* Ayah Number Ornament Badge */}
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-800 to-teal-950 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs sm:text-sm shadow-md">
                      <span>{toBanglaNumber(ayah.numberInSurah)}</span>
                    </div>

                    <span className="text-[10px] sm:text-xs text-emerald-400/60 font-medium">
                      আয়াত {toBanglaNumber(ayah.numberInSurah)} • পারা {toBanglaNumber(ayah.juz)}
                    </span>
                  </div>

                  {/* Single Ayah Audio Play Button */}
                  <button
                    onClick={() => togglePlayAyah(index, ayah.audioUrl)}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      isPlayingThis
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-emerald-900/60 text-emerald-300 hover:text-amber-400 hover:bg-emerald-800/70 border border-emerald-700/40'
                    }`}
                    title={isPlayingThis ? 'থামান' : 'আয়াত শুনুন'}
                  >
                    {isPlayingThis ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* 100% Authentic Arabic Text */}
                <div className="text-right my-2">
                  <p
                    className={`font-arabic text-emerald-50 font-bold tracking-wide select-text ${
                      arabicFontClasses[arabicFontSize]
                    }`}
                    dir="rtl"
                  >
                    {ayah.text}{' '}
                    <span className="text-amber-400/90 font-arabic font-normal text-lg sm:text-2xl inline-block px-1">
                      ﴿{toBanglaNumber(ayah.numberInSurah)}﴾
                    </span>
                  </p>
                </div>

                {/* 100% Authentic Bengali Translation */}
                {showBengali && ayah.bengaliText && (
                  <div className="mt-4 pt-3 border-t border-emerald-800/30">
                    <p className="text-sm sm:text-base text-emerald-200/90 leading-relaxed font-normal select-text">
                      {ayah.bengaliText}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Bottom Prev / Next Navigation Footer */}
      <div className="flex items-center justify-between gap-4 mt-10 pt-6 border-t border-emerald-800/40">
        {surahId > 1 ? (
          <Link
            href={`/surahs/${surahId - 1}`}
            className="flex items-center gap-2 bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-800/60 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all hover:scale-[1.02]"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>পূর্ববর্তী সূরা</span>
          </Link>
        ) : (
          <div />
        )}

        <Link
          href="/surahs"
          className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
        >
          <BookOpen className="w-4 h-4" />
          <span>সূরা তালিকা</span>
        </Link>

        {surahId < 114 ? (
          <Link
            href={`/surahs/${surahId + 1}`}
            className="flex items-center gap-2 bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-800/60 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all hover:scale-[1.02]"
          >
            <span>পরবর্তী সূরা</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

export default function SurahDetailPage(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="py-16 max-w-4xl mx-auto text-center px-4">
          <div className="glass-card bg-emerald-950/50 border border-emerald-800/40 rounded-3xl p-8 animate-pulse">
            <div className="h-8 bg-emerald-900/60 rounded-xl w-40 mx-auto mb-4" />
            <div className="h-6 bg-emerald-900/40 rounded-lg w-56 mx-auto mb-6" />
            <div className="h-4 bg-emerald-900/30 rounded w-48 mx-auto" />
          </div>
        </div>
      }
    >
      <SurahDetailContent {...props} />
    </Suspense>
  );
}
