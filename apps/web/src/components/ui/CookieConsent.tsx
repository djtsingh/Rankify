"use client";

import { useState, useEffect } from "react";
import { X, Cookie, Shield, BarChart3, Settings } from "lucide-react";
import Link from "next/link";

type ConsentState = "pending" | "accepted" | "declined" | "custom";

interface ConsentPreferences {
  essential: boolean; // Always true, cannot be disabled
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
}

const CONSENT_KEY = "rankify_cookie_consent";
const PREFERENCES_KEY = "rankify_cookie_preferences";

export default function CookieConsent() {
  const [consentState, setConsentState] = useState<ConsentState>("pending");
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    essential: true,
    analytics: true,
    functional: true,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already given consent
    const storedConsent = localStorage.getItem(CONSENT_KEY);
    const storedPreferences = localStorage.getItem(PREFERENCES_KEY);

    if (storedConsent) {
      setConsentState(storedConsent as ConsentState);
      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences));
      }
      // Initialize analytics if accepted
      if (storedConsent === "accepted" || storedConsent === "custom") {
        const prefs = storedPreferences ? JSON.parse(storedPreferences) : preferences;
        initializeTracking(prefs);
      }
    } else {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const initializeTracking = (prefs: ConsentPreferences) => {
    // Google Analytics
    if (prefs.analytics && typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }


    // Microsoft Clarity is loaded unconditionally as it's essential for UX insights
    // But you could conditionally load it here if needed
  };

  const handleAcceptAll = () => {
    const fullConsent: ConsentPreferences = {
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
    };
    setPreferences(fullConsent);
    setConsentState("accepted");
    localStorage.setItem(CONSENT_KEY, "accepted");
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(fullConsent));
    initializeTracking(fullConsent);
    setShowBanner(false);
  };

  const handleDeclineNonEssential = () => {
    const minimalConsent: ConsentPreferences = {
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
    };
    setPreferences(minimalConsent);
    setConsentState("declined");
    localStorage.setItem(CONSENT_KEY, "declined");
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(minimalConsent));
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    setConsentState("custom");
    localStorage.setItem(CONSENT_KEY, "custom");
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    initializeTracking(preferences);
    setShowBanner(false);
    setShowPreferences(false);
  };

  if (!showBanner && consentState !== "pending") return null;
  if (!showBanner) return null;

  return (
    <>
      {/* Backdrop for preferences modal */}
      {showPreferences && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998]"
          onClick={() => setShowPreferences(false)}
        />
      )}

      {/* Main Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[999] p-4 md:p-6 animate-slide-up">
        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
            {!showPreferences ? (
              /* Simple Banner View */
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Cookie className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      We value your privacy
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      We use cookies to enhance your experience, analyze site traffic, and for marketing purposes. 
                      You can choose to accept all cookies or customize your preferences.{" "}
                      <Link href="/cookies" className="text-indigo-400 hover:underline">
                        Learn more
                      </Link>
                    </p>
                  </div>
                  <button
                    onClick={() => setShowBanner(false)}
                    className="p-2 text-zinc-500 hover:text-white transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6">
                  <button
                    onClick={handleAcceptAll}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleDeclineNonEssential}
                    className="px-6 py-2.5 bg-zinc-800 text-zinc-300 font-medium rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    Essential Only
                  </button>
                  <button
                    onClick={() => setShowPreferences(true)}
                    className="px-6 py-2.5 text-zinc-400 font-medium hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Customize
                  </button>
                </div>
              </div>
            ) : (
              /* Preferences View */
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Cookie Preferences</h3>
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="p-2 text-zinc-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Essential - Always On */}
                  <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Essential</h4>
                        <p className="text-xs text-zinc-500">Required for the site to function</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                      Always On
                    </div>
                  </div>

                  {/* Analytics */}
                  <label className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl cursor-pointer hover:bg-zinc-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Analytics</h4>
                        <p className="text-xs text-zinc-500">Help us improve with usage data</p>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) =>
                          setPreferences({ ...preferences, analytics: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-700 rounded-full peer-checked:bg-indigo-500 transition-colors"></div>
                      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </div>
                  </label>

                  {/* Functional */}
                  <label className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl cursor-pointer hover:bg-zinc-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <Settings className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Functional</h4>
                        <p className="text-xs text-zinc-500">Remember your preferences</p>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={(e) =>
                          setPreferences({ ...preferences, functional: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-700 rounded-full peer-checked:bg-indigo-500 transition-colors"></div>
                      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </div>
                  </label>

                  {/* Marketing */}
                  <label className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl cursor-pointer hover:bg-zinc-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                        <Cookie className="w-5 h-5 text-pink-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Marketing</h4>
                        <p className="text-xs text-zinc-500">Personalized ads & content</p>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) =>
                          setPreferences({ ...preferences, marketing: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-700 rounded-full peer-checked:bg-indigo-500 transition-colors"></div>
                      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </div>
                  </label>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSavePreferences}
                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all"
                  >
                    Save Preferences
                  </button>
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="px-6 py-2.5 bg-zinc-800 text-zinc-300 font-medium rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </>
  );
}
