'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Sparkles, Music, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

export default function BackgroundAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const playerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // YouTube Video ID: https://www.youtube.com/embed/jyvxnLmGG6U
  const youtubeVideoId = 'jyvxnLmGG6U';

  useEffect(() => {
    setIsMounted(true);
    let active = true;

    // Always show modal on page load / reload
    setShowModal(true);

    // Load YouTube IFrame API script dynamically
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (!active || playerRef.current) return;
      try {
        playerRef.current = new window.YT.Player('youtube-bg-player', {
          height: '1',
          width: '1',
          videoId: youtubeVideoId,
          playerVars: {
            autoplay: 1,
            loop: 1,
            playlist: youtubeVideoId,
            controls: 0,
            showinfo: 0,
            autohide: 1,
            modestbranding: 1,
            mute: 0,
            playsinline: 1,
            enablejsapi: 1,
          },
          events: {
            onReady: (event: any) => {
              try {
                // Ready for user modal button trigger
              } catch (e) {
                console.log('YouTube autoplay on ready:', e);
              }
            },
            onStateChange: (event: any) => {
              if (event.data === 1) {
                setIsPlaying(true);
              }
              if (event.data === 0) {
                event.target.playVideo();
              }
            },
          },
        });
      } catch (err) {
        console.error('YouTube Player Init Error:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    // SCROLL & TOUCH AUTO-DISMISS & PLAY ENGINE
    const handleFirstGesture = () => {
      // If modal is visible, user scroll/gesture auto activates audio and closes modal
      playAudioNow();
      setShowModal(false);
    };

    // Auto pause background audio when Surah recitation audio plays
    const handlePauseBgAudio = () => {
      if (playerRef.current) {
        try {
          if (playerRef.current.pauseVideo) playerRef.current.pauseVideo();
          if (playerRef.current.mute) playerRef.current.mute();
        } catch (e) {}
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.muted = true;
      }
      setIsPlaying(false);
      setIsMuted(true);
    };

    window.addEventListener('pause-bg-audio', handlePauseBgAudio);

    const events = ['scroll', 'wheel', 'touchmove'];

    events.forEach((evt) => {
      window.addEventListener(evt, handleFirstGesture, { passive: true, once: true });
    });

    return () => {
      active = false;
      window.removeEventListener('pause-bg-audio', handlePauseBgAudio);
      events.forEach((evt) => {
        window.removeEventListener(evt, handleFirstGesture);
      });
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.log(e);
        }
      }
    };
  }, []);

  const playAudioNow = () => {
    // First pause any Surah audio that might be playing
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pause-surah-audio'));
    }

    if (playerRef.current) {
      try {
        if (playerRef.current.unMute) playerRef.current.unMute();
        if (playerRef.current.playVideo) playerRef.current.playVideo();
        setIsPlaying(true);
        setIsMuted(false);
      } catch (err) {
        console.log('YouTube play error:', err);
      }
    }

    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
        })
        .catch((e) => console.log('HTML5 play error:', e));
    }
  };

  const handleEnableAudio = () => {
    playAudioNow();
    setShowModal(false);
  };

  const toggleSound = () => {
    if (isMuted || !isPlaying) {
      playAudioNow();
    } else {
      if (playerRef.current) {
        try {
          if (playerRef.current.pauseVideo) playerRef.current.pauseVideo();
          if (playerRef.current.mute) playerRef.current.mute();
        } catch (e) {}
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.muted = true;
      }
      setIsPlaying(false);
      setIsMuted(true);
    }
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Invisible YouTube IFrame Background Container */}
      <div className="fixed top-0 left-0 w-px h-px pointer-events-none overflow-hidden -z-50" suppressHydrationWarning>
        <div id="youtube-bg-player" suppressHydrationWarning />
        <audio ref={audioRef} src="/audio.mp3" loop preload="auto" />
      </div>

      {/* Auto-Play Glassmorphism Welcome Audio Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-gradient-to-b from-emerald-950/95 via-slate-900/95 to-slate-950/95 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl text-center relative overflow-hidden backdrop-blur-xl"
            >
              {/* Background Glow Overlay */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Icon / Badge Header */}
              <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-500 p-0.5 shadow-lg shadow-emerald-900/40 mb-4 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Volume2 className="w-8 h-8 text-amber-400 animate-pulse" />
                </div>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight flex items-center justify-center gap-2">
                <span>স্বাগতম — হিফজতি</span>
                <Sparkles className="w-5 h-5 text-amber-400" />
              </h3>
              <p className="text-sm text-emerald-100/80 mb-6 leading-relaxed">
                পবিত্র কুরআন তিলাওয়াতের শান্তিময় আবহে আপনার হিফজের যাত্রা শুরু করতে নিচের বাটনে প্রেস করুন।
              </p>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  onClick={handleEnableAudio}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
                >
                  <Volume2 className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
                  <span>🔊 বিসমিল্লাহ — অডিও চালু করুন</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Sound Toggle Button */}
      <button
        onClick={toggleSound}
        title={isMuted ? 'সাউন্ড চালু করুন' : 'সাউন্ড বন্ধ করুন'}
        className="fixed bottom-24 right-4 z-50 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-amber-400 flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer backdrop-blur-md select-none"
      >
        {isMuted || !isPlaying ? (
          <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400/60" />
        ) : (
          <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-pulse" />
        )}
      </button>
    </>
  );
}

