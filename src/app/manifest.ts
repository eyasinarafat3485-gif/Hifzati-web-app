import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'হিফজতি — আমার কুরআন হিফজের পথচলা',
    short_name: 'হিফজতি',
    description: 'সহজে এবং সুন্দরভাবে আপনার কুরআন মুখস্থ করার অগ্রগতি ট্র্যাক, শেয়ার ও সংরক্ষণ করুন।',
    start_url: '/',
    display: 'standalone',
    background_color: '#04120e',
    theme_color: '#04120e',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
