'use client';

import { useEffect } from 'react';
import { analytics } from '../../lib/analytics';

export function UserBehaviorTracker() {
  useEffect(() => {
    // Track clicks on important elements
    const trackClicks = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      // Get element info
      const tagName = target.tagName.toLowerCase();
      const className = target.className || '';
      const id = target.id || '';
      const text = target.textContent?.trim().substring(0, 50) || '';
      const href = target.getAttribute('href') || '';

      // Track button clicks
      if (tagName === 'button' || className.includes('btn') || className.includes('button')) {
        analytics.trackEvent('button_click', {
          category: 'interaction',
          label: text || className || id || 'button',
          custom_parameters: {
            element_type: 'button',
            element_text: text,
            element_class: className,
            element_id: id,
            page_path: window.location.pathname,
          },
        });
      }

      // Track link clicks
      if (tagName === 'a' && href) {
        analytics.trackEvent('link_click', {
          category: 'interaction',
          label: href,
          custom_parameters: {
            element_type: 'link',
            href: href,
            element_text: text,
            page_path: window.location.pathname,
          },
        });
      }

      // Track form submissions
      if (tagName === 'form' || (tagName === 'button' && target.getAttribute('type') === 'submit')) {
        const form = tagName === 'form' ? target : target.closest('form');
        if (form) {
          const formId = form.id || '';
          const formClass = form.className || '';
          analytics.trackEvent('form_interaction', {
            category: 'interaction',
            label: formId || formClass || 'form',
            custom_parameters: {
              element_type: 'form',
              form_id: formId,
              form_class: formClass,
              page_path: window.location.pathname,
            },
          });
        }
      }
    };

    // Track page visibility changes (user switching tabs)
    const trackVisibilityChange = () => {
      if (document.hidden) {
        analytics.trackEvent('page_hidden', {
          category: 'engagement',
          label: 'tab_switch',
          custom_parameters: {
            page_path: window.location.pathname,
          },
        });
      } else {
        analytics.trackEvent('page_visible', {
          category: 'engagement',
          label: 'tab_return',
          custom_parameters: {
            page_path: window.location.pathname,
          },
        });
      }
    };

    // Add event listeners
    window.addEventListener('click', trackClicks, { passive: true });
    document.addEventListener('visibilitychange', trackVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener('click', trackClicks);
      document.removeEventListener('visibilitychange', trackVisibilityChange);
    };
  }, []);

  return null; // This component doesn't render anything
}