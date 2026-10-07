'use client';

import React, { useState, useEffect } from 'react';

interface BrandNameProps {
  className?: string;
  fallbackBangla?: string;
  fallbackEnglish?: string;
}

export default function BrandName({
  className = '',
  fallbackBangla = 'হিফজতি',
  fallbackEnglish = 'Hifzati',
}: BrandNameProps) {
  const [isEnglish, setIsEnglish] = useState(false);

  useEffect(() => {
    const checkLanguage = () => {
      if (typeof document !== 'undefined') {
        const html = document.documentElement;
        const en =
          html.lang?.toLowerCase().startsWith('en') ||
          html.classList.contains('translated-ltr') ||
          html.getAttribute('data-translated') === 'true';
        setIsEnglish(en);
      }
    };

    checkLanguage();

    const observer = new MutationObserver(() => {
      checkLanguage();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang', 'class', 'data-translated'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <span translate="no" className={`notranslate ${className}`}>
      {isEnglish ? fallbackEnglish : fallbackBangla}
    </span>
  );
}
