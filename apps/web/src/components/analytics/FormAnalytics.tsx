'use client';

import React, { useEffect, useRef } from 'react';
import { analytics } from '../../lib/analytics';

interface FormAnalyticsProps {
  formId?: string;
  formName?: string;
  children: React.ReactNode;
}

export function FormAnalytics({ formId, formName, children }: FormAnalyticsProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const startTimeRef = useRef<number>(Date.now());
  const interactionsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    // Track form view
    analytics.trackEvent('form_view', {
      category: 'interaction',
      label: formName || formId || 'form',
      custom_parameters: {
        form_id: formId,
        form_name: formName,
        page_path: window.location.pathname,
      },
    });

    // Track field interactions
    const handleFieldInteraction = (event: Event) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      if (!target || !target.name) return;

      const fieldName = target.name;
      if (interactionsRef.current.has(fieldName)) return;

      interactionsRef.current.add(fieldName);

      analytics.trackEvent('form_field_interaction', {
        category: 'interaction',
        label: fieldName,
        custom_parameters: {
          form_id: formId,
          form_name: formName,
          field_name: fieldName,
          field_type: target.type || target.tagName.toLowerCase(),
          page_path: window.location.pathname,
        },
      });
    };

    // Track form submission
    const handleSubmit = (event: Event) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const fieldsInteracted = interactionsRef.current.size;

      analytics.trackEvent('form_submit', {
        category: 'conversion',
        label: formName || formId || 'form',
        custom_parameters: {
          form_id: formId,
          form_name: formName,
          time_spent_seconds: timeSpent,
          fields_interacted: fieldsInteracted,
          completion_rate: fieldsInteracted > 0 ? Math.round((fieldsInteracted / form.elements.length) * 100) : 0,
          page_path: window.location.pathname,
        },
      });
    };

    // Track form abandonment (when user leaves without submitting)
    const handleFormAbandonment = () => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const fieldsInteracted = interactionsRef.current.size;

      // Only track if user spent time on the form and interacted with fields
      if (timeSpent > 10 && fieldsInteracted > 0) {
        analytics.trackEvent('form_abandon', {
          category: 'interaction',
          label: formName || formId || 'form',
          custom_parameters: {
            form_id: formId,
            form_name: formName,
            time_spent_seconds: timeSpent,
            fields_interacted: fieldsInteracted,
            completion_rate: Math.round((fieldsInteracted / form.elements.length) * 100),
            page_path: window.location.pathname,
          },
        });
      }
    };

    // Add event listeners
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('focus', handleFieldInteraction);
      input.addEventListener('input', handleFieldInteraction);
      input.addEventListener('change', handleFieldInteraction);
    });

    form.addEventListener('submit', handleSubmit);

    // Track abandonment when page unloads or visibility changes
    const handleBeforeUnload = () => handleFormAbandonment();
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleFormAbandonment();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      inputs.forEach(input => {
        input.removeEventListener('focus', handleFieldInteraction);
        input.removeEventListener('input', handleFieldInteraction);
        input.removeEventListener('change', handleFieldInteraction);
      });
      form.removeEventListener('submit', handleSubmit);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [formId, formName]);

  // Clone children and add ref to form
  return (
    <>
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === 'form') {
          return React.cloneElement(child as React.ReactElement<any>, { ref: formRef });
        }
        return child;
      })}
    </>
  );
}