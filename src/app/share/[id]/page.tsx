'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { SURAHS_DATA, toBanglaNumber } from '@/data/surahs';
import ShareCard from '@/components/ShareCard';
import { Sparkles, ArrowLeft, BookOpen } from 'lucide-react';

function ShareContent() {
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [shareData, setShareData] = useState<{
    userName: string;
    userAvatar: string;
    selectedSurahIds: number[];
    percentageCompleted: number;
    createdAt?: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchShareData() {
      if (!id) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/progress?id=${id}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && isMounted) {
            setShareData({
              userName: json.data.userName,
              userAvatar: json.data.userAvatar,
              selectedSurahIds: json.data.selectedSurahIds || [],
              percentageCompleted: json.data.percentageCompleted || 0,
              createdAt: json.data.createdAt,
            });
          }
        }
      } catch (e) {
        console.error('Error loading share data', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchShareData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-emerald-200 text-sm">অগ্রগতি কার্ড লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!shareData) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center glass-card rounded-3xl border border-emerald-800/40 my-10">
        <BookOpen className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-emerald-100 mb-2">শেয়ারকৃত কার্ডটি পাওয়া যায়নি</h2>
        <p className="text-xs text-emerald-300/70 mb-6">
          দুঃখিত, এই লিংকটির মেয়াদ শেষ হয়ে থাকতে পারে অথবা আইডি সঠিক নয়।
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>নিজে একটি অ্যাকাউন্ট বা কার্ড তৈরি করুন</span>
        </Link>
      </div>
    );
  }

  const selectedSurahs = SURAHS_DATA.filter((s) =>
    shareData.selectedSurahIds.includes(s.number)
  ).sort((a, b) => a.number - b.number);

  return (
    <div className="py-8 sm:py-12 max-w-4xl mx-auto px-4">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-200 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>হিসেব শুরু করতে হোমে যান</span>
        </Link>

        <span className="text-xs text-amber-400 font-semibold bg-amber-950/80 border border-amber-800/50 px-3 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          পাবলিক শেয়ার ভিউ
        </span>
      </div>

      {/* Public View Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-800/40 mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 p-1 shadow-lg shrink-0">
          {shareData.userAvatar ? (
            <img
              src={shareData.userAvatar}
              alt={shareData.userName}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-emerald-950 flex items-center justify-center text-amber-300 font-bold text-2xl font-arabic">
              {shareData.userName.charAt(0)}
            </div>
          )}
        </div>

        <div>
          <span className="text-xs text-amber-400 font-medium bg-amber-950/60 px-2.5 py-0.5 rounded-full">
            কুরআন শিক্ষার্থীর অগ্রগতি
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-50 mt-1">
            {shareData.userName}
          </h1>
          <p className="text-xs text-emerald-300/70 mt-1">
            আলহামদুলিল্লাহ! ১১৪টি সূরার মধ্যে {toBanglaNumber(shareData.selectedSurahIds.length)} টি সূরা ({toBanglaNumber(shareData.percentageCompleted)}%) মুখস্থ করেছেন।
          </p>
        </div>
      </div>

      {/* Share Card Display */}
      <div className="my-8 flex justify-center">
        <ShareCard />
      </div>

      {/* Surahs List */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-800/40">
        <h3 className="text-lg font-bold text-emerald-100 mb-4">
          মুখস্থকৃত সূরাসমূহ ({toBanglaNumber(selectedSurahs.length)})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {selectedSurahs.map((surah) => (
            <div
              key={surah.number}
              className="bg-emerald-950/80 border border-emerald-800/50 rounded-xl p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-900 text-amber-400 flex items-center justify-center font-bold text-xs">
                  {toBanglaNumber(surah.number)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-100">{surah.banglaName}</h4>
                  <p className="text-[10px] text-emerald-400/70">{toBanglaNumber(surah.ayahCount)} আয়াত</p>
                </div>
              </div>
              <span className="font-arabic text-lg text-amber-400 font-bold">{surah.arabicName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PublicSharePage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-emerald-200 text-sm">অগ্রগতি কার্ড লোড হচ্ছে...</p>
        </div>
      }
    >
      <ShareContent />
    </Suspense>
  );
}
