'use client';

/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toBanglaNumber } from '@/data/surahs';
import { useHifz } from '@/context/HifzContext';
import { ArrowRight, BookOpen, Sparkles, Layers, UserCheck, Share2 } from 'lucide-react';

export default function LandingPage() {
  const { totalMemorizedCount, userName } = useHifz();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-8 sm:py-12">
      
      {/* Hero Logo Emblem */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="relative w-24 h-24 sm:w-32 sm:h-32 mb-6 rounded-3xl p-1 bg-gradient-to-br from-amber-400 via-emerald-600 to-teal-900 shadow-2xl shadow-emerald-950/90 border border-amber-400/50 flex items-center justify-center group"
      >
        <div className="w-full h-full rounded-[22px] overflow-hidden bg-[#04120e]">
          <img
            src="/logo.png"
            alt="হিফজতি লোগো"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </motion.div>

      {/* Top Islamic Geometric Decorative Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-emerald-950/80 border border-amber-500/40 px-4 py-2 rounded-full mb-8 shadow-xl"
      >
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span className="font-arabic text-amber-400 font-bold text-sm">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</span>
        <span className="text-xs text-emerald-300 font-medium">| বিসমিল্লাহির রহমানির রহিম</span>
      </motion.div>

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-emerald-50 leading-snug mb-3"
        >
          আমার কুরআন হিফজের <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-300 bg-clip-text text-transparent">পথচলা</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-xl text-emerald-200/80 mb-8 leading-relaxed max-w-2xl mx-auto font-normal"
        >
          পবিত্র কুরআনের ১১৪টি সূরা মুখস্থ করার পবিত্র যাত্রা সহজেই ট্র্যাক করুন, আপনার অগ্রগতি পর্যবেক্ষণ করুন এবং সুন্দর মেমরি কার্ডের মাধ্যমে অন্যদের সাথে শেয়ার করুন।
        </motion.p>

        {/* CTA Buttons - 1 line on mobile devices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-row items-center justify-center gap-2 sm:gap-4 mb-12 w-full max-w-lg mx-auto"
        >
          <Link
            href={userName ? "/surahs" : "/setup"}
            className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-base px-3 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl shadow-amber-900/40 transition-all hover:scale-105 active:scale-95 group cursor-pointer whitespace-nowrap"
          >
            <span>{totalMemorizedCount > 0 ? "ট্র্যাকিং চালিয়ে যান" : "শুরু করুন"}</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform shrink-0" />
          </Link>

          <Link
            href="/surahs"
            className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-emerald-950/80 hover:bg-emerald-900/60 text-emerald-200 font-semibold text-xs sm:text-base px-3 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-emerald-700/50 transition-all hover:border-emerald-500 cursor-pointer whitespace-nowrap"
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
            <span>সূরা তালিকা ({toBanglaNumber(114)})</span>
          </Link>
        </motion.div>
      </div>

      {/* Quick Stats Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
        {[
          {
            icon: <BookOpen className="w-6 h-6" />,
            count: toBanglaNumber(114),
            label: "পবিত্র কুরআনের মোট সূরা",
            iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
            titleColor: "text-amber-400",
          },
          {
            icon: <Layers className="w-6 h-6" />,
            count: toBanglaNumber(30),
            label: "প্যারা / জুয ট্র্যাকিং",
            iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
            titleColor: "text-emerald-300",
          },
          {
            icon: <Sparkles className="w-6 h-6" />,
            count: toBanglaNumber(6236),
            label: "মোট আয়াত সমাহার",
            iconBg: "bg-teal-500/10 text-teal-400 border-teal-500/20",
            titleColor: "text-teal-300",
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: idx * 0.12 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass-card rounded-2xl p-6 text-center border border-emerald-800/40 transition-all duration-300 shadow-lg hover:border-emerald-500/50"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 border ${stat.iconBg}`}>
              {stat.icon}
            </div>
            <h3 className={`text-3xl font-extrabold font-bangla mb-1 ${stat.titleColor}`}>
              {stat.count}
            </h3>
            <p className="text-sm text-emerald-300/80">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Connected Vertical Timeline Stepper (Bengali IT Reference Style) */}
      <div className="w-full max-w-4xl my-8 px-2">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-lg sm:text-2xl font-bold text-center text-emerald-100 mb-10"
        >
          সহজ ৪টি ধাপে আপনার হিফজ ট্র্যাকিং
        </motion.h2>

        <div className="relative max-w-3xl mx-auto pl-2 sm:pl-4">
          {/* Vertical Connected Gradient Line */}
          <div className="absolute left-6 sm:left-9 top-8 bottom-8 w-1 bg-gradient-to-b from-amber-400 via-emerald-500 to-teal-400 opacity-70 z-0 rounded-full" />

          <div className="space-y-6 sm:space-y-8 relative z-10">
            {[
              {
                step: "ধাপ ০১",
                title: "প্রোফাইল সেটআপ",
                desc: "আপনার নাম ও ছবি যুক্ত করুন। পরবর্তীতে এটি আপনার কার্ডে সুন্দরভাবে সাজানো থাকবে।",
                icon: <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />,
                iconBg: "bg-amber-950/90 border-amber-500/50 text-amber-300 shadow-amber-950/80",
                badgeStyle: "bg-amber-950/60 text-amber-300 border-amber-700/50",
                borderColor: "border-emerald-800/40 hover:border-amber-500/50",
              },
              {
                step: "ধাপ ০২",
                title: "সূরা নির্বাচন",
                desc: "১১৪টি সূরার মধ্যে আপনার মুখস্থ করা সূরাগুলোতে ক্লিক করে নির্বাচন করুন।",
                icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />,
                iconBg: "bg-emerald-950/90 border-emerald-500/50 text-emerald-300 shadow-emerald-950/80",
                badgeStyle: "bg-emerald-950/60 text-emerald-300 border-emerald-700/50",
                borderColor: "border-emerald-800/40 hover:border-emerald-500/50",
              },
              {
                step: "ধাপ ০৩",
                title: "লাইভ কাউন্ট ও স্ট্যাটস",
                desc: "আপনার শতক বা শতাংশ এবং মোট আয়াতের সংখ্যা কত তা সাথে সাথে দেখুন।",
                icon: <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300" />,
                iconBg: "bg-teal-950/90 border-teal-500/50 text-teal-300 shadow-teal-950/80",
                badgeStyle: "bg-teal-950/60 text-teal-300 border-teal-700/50",
                borderColor: "border-emerald-800/40 hover:border-teal-500/50",
              },
              {
                step: "ধাপ ০৪",
                title: "ডাউনলোড ও শেয়ার",
                desc: "আপনার হিফজ কার্ডটি এক ক্লিকে ডাউনলোড করুন এবং বন্ধুদের সাথে শেয়ার করুন।",
                icon: <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />,
                iconBg: "bg-amber-950/90 border-amber-400/50 text-amber-400 shadow-amber-950/80",
                badgeStyle: "bg-amber-950/60 text-amber-400 border-amber-700/50",
                borderColor: "border-emerald-800/40 hover:border-amber-400/50",
              },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="flex items-center gap-3 sm:gap-6 group"
              >
                {/* Left Timeline Node Badge */}
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center border shadow-xl transition-transform duration-300 group-hover:scale-110 ${card.iconBg}`}>
                    {card.icon}
                  </div>
                </div>

                {/* Right Step Content Card */}
                <div className={`flex-1 glass-card rounded-2xl p-4 sm:p-5 border transition-all duration-300 shadow-xl ${card.borderColor} group-hover:translate-x-1`}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`text-[10px] sm:text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${card.badgeStyle}`}>
                      {card.step}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-lg font-extrabold text-emerald-100 mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-300/80 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
