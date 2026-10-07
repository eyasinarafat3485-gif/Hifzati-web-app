'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SURAHS_DATA } from '@/data/surahs';

export interface UserData {
  name: string;
  image: string;
  memorizedSurahs: number[];
  theme: string;
}

interface HifzContextType {
  name: string;
  image: string;
  memorizedSurahs: number[];
  theme: string;
  isLoaded: boolean;
  toastMessage: string | null;
  // Aliases for compatibility
  userName: string;
  userAvatar: string;
  selectedSurahIds: number[];
  // Actions
  setName: (name: string) => void;
  setImage: (image: string) => void;
  setTheme: (theme: string) => void;
  setUserName: (name: string) => void;
  setUserAvatar: (avatar: string) => void;
  toggleSurah: (surahNumber: number) => void;
  selectSurahs: (numbers: number[]) => void;
  deselectSurahs: (numbers: number[]) => void;
  selectAll: () => void;
  deselectAll: () => void;
  selectAmmaPara: () => void;
  selectLastTen: () => void;
  isSurahSelected: (surahNumber: number) => boolean;
  saveProgress: () => void;
  totalMemorizedCount: number;
  totalAyahsMemorized: number;
  percentageCompleted: number;
  remainingCount: number;
  resetAll: () => void;
  hideToast: () => void;
}

const HifzContext = createContext<HifzContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'hifzati_user_data_v2';

export function HifzProvider({ children }: { children: React.ReactNode }) {
  const [name, setNameState] = useState<string>('');
  const [image, setImageState] = useState<string>('');
  const [memorizedSurahs, setMemorizedSurahs] = useState<number[]>([]);
  const [theme, setThemeState] = useState<string>('emerald');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Read localStorage after hydration on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed: UserData = JSON.parse(saved);
        if (parsed.name) setNameState(parsed.name);
        if (parsed.image) setImageState(parsed.image);
        if (Array.isArray(parsed.memorizedSurahs)) setMemorizedSurahs(parsed.memorizedSurahs);
        if (parsed.theme) setThemeState(parsed.theme);
      }
    } catch (e) {
      console.error('Failed to parse localStorage data', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Helper to persist current data
  const persistData = (
    newName = name,
    newImage = image,
    newMemorized = memorizedSurahs,
    newTheme = theme
  ) => {
    try {
      const payload: UserData = {
        name: newName,
        image: newImage,
        memorizedSurahs: newMemorized,
        theme: newTheme,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Error saving data to localStorage', e);
    }
  };

  const setName = (newName: string) => {
    setNameState(newName);
    persistData(newName, image, memorizedSurahs, theme);
  };

  const setImage = (newImage: string) => {
    setImageState(newImage);
    persistData(name, newImage, memorizedSurahs, theme);
  };

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    persistData(name, image, memorizedSurahs, newTheme);
  };

  const toggleSurah = (surahNumber: number) => {
    let nextSurahs: number[];
    if (memorizedSurahs.includes(surahNumber)) {
      nextSurahs = memorizedSurahs.filter((num) => num !== surahNumber);
    } else {
      nextSurahs = [...memorizedSurahs, surahNumber];
    }
    setMemorizedSurahs(nextSurahs);
    persistData(name, image, nextSurahs, theme);
  };

  const selectSurahs = (numbers: number[]) => {
    const nextSet = new Set([...memorizedSurahs, ...numbers]);
    const nextSurahs = Array.from(nextSet);
    setMemorizedSurahs(nextSurahs);
    persistData(name, image, nextSurahs, theme);
  };

  const deselectSurahs = (numbers: number[]) => {
    const nextSurahs = memorizedSurahs.filter((num) => !numbers.includes(num));
    setMemorizedSurahs(nextSurahs);
    persistData(name, image, nextSurahs, theme);
  };

  const selectAll = () => {
    const allNumbers = SURAHS_DATA.map((s) => s.number);
    setMemorizedSurahs(allNumbers);
    persistData(name, image, allNumbers, theme);
  };

  const deselectAll = () => {
    setMemorizedSurahs([]);
    persistData(name, image, [], theme);
  };

  const selectAmmaPara = () => {
    const ammaNumbers = SURAHS_DATA.filter((s) => s.juz === 30).map((s) => s.number);
    selectSurahs(ammaNumbers);
  };

  const selectLastTen = () => {
    const lastTenNumbers = SURAHS_DATA.filter((s) => s.number >= 105 && s.number <= 114).map(
      (s) => s.number
    );
    selectSurahs(lastTenNumbers);
  };

  const isSurahSelected = (surahNumber: number) => memorizedSurahs.includes(surahNumber);

  // Explicit Save Progress Button action with Bangla Toast notification
  const saveProgress = () => {
    persistData(name, image, memorizedSurahs, theme);
    setToastMessage('আপনার অগ্রগতি সফলভাবে সংরক্ষিত হয়েছে!');
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const hideToast = () => setToastMessage(null);

  const totalMemorizedCount = memorizedSurahs.length;
  const remainingCount = 114 - totalMemorizedCount;

  const totalAyahsMemorized = SURAHS_DATA.filter((s) =>
    memorizedSurahs.includes(s.number)
  ).reduce((acc, s) => acc + (s.ayahCount || s.totalAyahs), 0);

  const percentageCompleted = Number(
    ((totalMemorizedCount / 114) * 100).toFixed(1)
  );

  const resetAll = () => {
    setNameState('');
    setImageState('');
    setMemorizedSurahs([]);
    setThemeState('emerald');
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <HifzContext.Provider
      value={{
        name,
        image,
        memorizedSurahs,
        theme,
        isLoaded,
        toastMessage,
        // Aliases
        userName: name,
        userAvatar: image,
        selectedSurahIds: memorizedSurahs,
        // Methods
        setName,
        setImage,
        setTheme,
        setUserName: setName,
        setUserAvatar: setImage,
        toggleSurah,
        selectSurahs,
        deselectSurahs,
        selectAll,
        deselectAll,
        selectAmmaPara,
        selectLastTen,
        isSurahSelected,
        saveProgress,
        totalMemorizedCount,
        totalAyahsMemorized,
        percentageCompleted,
        remainingCount,
        resetAll,
        hideToast,
      }}
    >
      {children}

      {/* Bangla Success Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-300/40 flex items-center gap-3 animate-bounce">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-emerald-200">
            ✓
          </div>
          <span className="font-semibold text-sm">{toastMessage}</span>
          <button
            onClick={hideToast}
            className="ml-2 text-xs text-emerald-200/80 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </HifzContext.Provider>
  );
}

export function useHifz() {
  const context = useContext(HifzContext);
  if (!context) {
    throw new Error('useHifz must be used within a HifzProvider');
  }
  return context;
}
