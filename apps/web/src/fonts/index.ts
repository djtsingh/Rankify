// Font loader for local fonts using next/font/local
import localFont from 'next/font/local';

export const clashGrotesk = localFont({
  src: [
    {
      path: './ClashGrotesk_Complete/Fonts/WEB/fonts/ClashGrotesk-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './ClashGrotesk_Complete/Fonts/WEB/fonts/ClashGrotesk-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './ClashGrotesk_Complete/Fonts/WEB/fonts/ClashGrotesk-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './ClashGrotesk_Complete/Fonts/WEB/fonts/ClashGrotesk-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-clash',
  display: 'swap',
  preload: true,
});

// Satoshi font placeholder (add files to src/fonts/Satoshi/ and update here)
export const satoshi = localFont({
  src: [
    { path: './Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Regular.woff2', weight: '400', style: 'normal' },
    { path: './Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Medium.woff2', weight: '500', style: 'normal' },
    { path: './Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Bold.woff2', weight: '700', style: 'normal' },
    { path: './Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Black.woff2', weight: '900', style: 'normal' },
    { path: './Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Light.woff2', weight: '300', style: 'normal' },
    { path: './Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Italic.woff2', weight: '400', style: 'italic' },
    { path: './Satoshi_Complete/Fonts/WEB/fonts/Satoshi-BoldItalic.woff2', weight: '700', style: 'italic' },
    { path: './Satoshi_Complete/Fonts/WEB/fonts/Satoshi-BlackItalic.woff2', weight: '900', style: 'italic' },
    { path: './Satoshi_Complete/Fonts/WEB/fonts/Satoshi-LightItalic.woff2', weight: '300', style: 'italic' },
    { path: './Satoshi_Complete/Fonts/WEB/fonts/Satoshi-MediumItalic.woff2', weight: '500', style: 'italic' },
  ],
  variable: '--font-satoshi',
  display: 'swap',
  preload: true,
});
