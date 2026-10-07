'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHifz } from '@/context/HifzContext';
import { motion } from 'framer-motion';
import { User, Camera, ArrowRight, Sparkles } from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
];

export default function SetupPage() {
  const router = useRouter();
  const { userName, userAvatar, setUserName, setUserAvatar } = useHifz();

  const [nameInput, setNameInput] = useState(userName);
  const [avatarPreview, setAvatarPreview] = useState(userAvatar);
  const [errorMsg, setErrorMsg] = useState('');
  const [placeholderText, setPlaceholderText] = useState('যেমন- মো: ইয়াছিন আরাফাত');

  useEffect(() => {
    const updatePlaceholder = () => {
      if (typeof document !== 'undefined') {
        const html = document.documentElement;
        const isEnglish =
          html.lang?.toLowerCase().startsWith('en') ||
          html.classList.contains('translated-ltr') ||
          html.getAttribute('data-translated') === 'true';

        if (isEnglish) {
          setPlaceholderText('For Example- Md: Eyasin Arafat');
        } else {
          setPlaceholderText('যেমন- মো: ইয়াছিন আরাফাত');
        }
      }
    };

    updatePlaceholder();

    const observer = new MutationObserver(() => {
      updatePlaceholder();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang', 'class', 'data-translated'],
    });

    return () => observer.disconnect();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('ছবি সর্বোচ্চ ৫ মেগাবাইট হতে পারবে');
        return;
      }
      setErrorMsg('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার নামটি লিখুন');
      return;
    }
    setUserName(nameInput.trim());
    if (avatarPreview) {
      setUserAvatar(avatarPreview);
    }
    router.push('/surahs');
  };

  return (
    <div className="max-w-xl mx-auto py-8 sm:py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-3xl p-6 sm:p-10 border border-emerald-800/40 shadow-2xl relative overflow-hidden"
      >
        {/* Subtle Header Badge */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-950/80 border border-amber-800/50 px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            ধাপ ১: প্রোফাইল সেটআপ
          </span>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-emerald-50 mb-2 whitespace-nowrap">
            আপনার পরিচয় যুক্ত করুন
          </h1>
          <p className="text-sm text-emerald-300/70">
            ফলাফল ও মেমরি কার্ড সুন্দরভাবে তৈরি করতে আপনার নাম ও ছবি প্রদান করুন।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Profile Avatar Upload & Preview */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative group cursor-pointer mb-3">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 p-1 shadow-xl shadow-emerald-950/80 flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="প্রোফাইল প্রিভিউ"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-emerald-950/90 flex items-center justify-center text-emerald-400/60">
                    <User className="w-12 h-12" />
                  </div>
                )}
              </div>

              {/* Upload Overlay Button */}
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-amber-500 hover:bg-amber-400 text-slate-950 p-2.5 rounded-full shadow-lg cursor-pointer transition-transform group-hover:scale-110"
              >
                <Camera className="w-4 h-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <p className="text-xs text-emerald-400/80">
              {avatarPreview ? "ছবি নির্বাচন করা হয়েছে" : "প্রোফাইল ছবি অপশনাল (ক্লিক করে আপলোড করুন)"}
            </p>

            {/* Quick Avatar Presets */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[11px] text-emerald-400/60 font-medium">অথবা পছন্দ করুন:</span>
              <div className="flex items-center gap-2">
                {PRESET_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarPreview(url)}
                    className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                      avatarPreview === url
                        ? 'border-amber-400 scale-110 shadow-md'
                        : 'border-emerald-700/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label htmlFor="name-input" className="block text-sm font-semibold text-emerald-200 mb-2">
              আপনার নাম <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <input
                id="name-input"
                type="text"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder={placeholderText}
                className="w-full bg-emerald-950/80 border border-emerald-700/60 rounded-xl px-4 py-3.5 text-emerald-100 placeholder-emerald-600/60 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-medium text-base"
              />
            </div>
            {errorMsg && (
              <p className="text-xs text-rose-400 mt-2 font-medium">{errorMsg}</p>
            )}
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm sm:text-base py-3 sm:py-3.5 rounded-xl shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
          >
            <span>এগিয়ে যান (সূরা নির্বাচন)</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

        </form>
      </motion.div>
    </div>
  );
}
