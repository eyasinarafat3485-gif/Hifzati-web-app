'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title = 'ডাটা রিসেট নিশ্চিতকরণ',
  message = 'আপনি কি নিশ্চিত যে আপনার সমস্ত হিফজ অগ্রগতি ও সেভ করা ডাটা রিসেট করতে চান? এই প্রক্রিয়াটি আর ফিরিয়ে আনা যাবে না।',
  confirmText = 'হ্যাঁ, রিসেট করুন',
  cancelText = 'বাতিল করুন',
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          {/* Backdrop Click */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md bg-[#041a14]/95 border border-rose-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-rose-950/40 z-10 overflow-hidden"
          >
            {/* Top Close Icon Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-emerald-400/60 hover:text-emerald-100 p-1 rounded-full hover:bg-emerald-900/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Warning Icon Emblem */}
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-4 shadow-inner">
              <AlertTriangle className="w-7 h-7" />
            </div>

            {/* Title & Message */}
            <div className="text-center mb-6">
              <h3 className="text-lg sm:text-xl font-extrabold text-emerald-50 mb-2">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
                {message}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-emerald-950/80 hover:bg-emerald-900/70 border border-emerald-700/50 text-emerald-200 font-bold text-xs sm:text-sm py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap active:scale-95"
              >
                {cancelText}
              </button>

              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-xs sm:text-sm py-3 rounded-xl shadow-lg shadow-rose-950/60 border border-rose-400/30 transition-all cursor-pointer whitespace-nowrap active:scale-95"
              >
                {confirmText}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
