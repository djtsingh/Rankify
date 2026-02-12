'use client';

import Script from 'next/script';
import { GA4_MEASUREMENT_ID, analytics } from './index';

/**
 * Google Analytics 4 Script Component
 * Loads the gtag.js script and initializes analytics
 */
export function GoogleAnalyticsScript() {
  // Don't render if no measurement ID
  if (!GA4_MEASUREMENT_ID || GA4_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    return null;
  }

  return (
    <>
      {/* Load gtag.js */}
      <Script
        id="gtag-js"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => {
          // Initialize analytics after script loads
          analytics.init();
        }}
      />
      
      {/* Inline gtag initialization - ensures dataLayer exists immediately */}
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA4_MEASUREMENT_ID}', {
              send_page_view: false
            });
          `,
        }}
      />
    </>
  );
}
