import React, { useEffect, useState } from 'react';
import { X, Download, Share, PlusSquare } from 'lucide-react';

// TypeScript doesn't know about this event by default
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'flame_install_prompt_dismissed';
const DISMISS_DAYS = 7; // don't re-show for this many days after dismissal

function isIOS() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isInStandaloneMode() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

function wasRecentlyDismissed() {
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const dismissedAt = Number(raw);
  const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
  return daysSince < DISMISS_DAYS;
}

export const InstallPromptModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Never show if already installed / running standalone, or dismissed recently
    if (isInStandaloneMode() || wasRecentlyDismissed()) return;

    if (isIOS()) {
      // iOS has no beforeinstallprompt API — show instructions after a short delay
      const timer = setTimeout(() => {
        setShowIOSInstructions(true);
        setIsOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }

    // Android / desktop Chrome: capture the real install event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsOpen(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleClose = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setIsOpen(false);
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted' || outcome === 'dismissed') {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    }
    setDeferredPrompt(null);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-sm bg-white border border-[#E7E2D9] rounded-2xl p-6 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 flex items-center justify-center shadow-md shadow-rose-600/20">
            <span className="text-2xl">🔥</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-stone-900 font-editorial">
              Add FLAME to your home screen
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Get faster access and a full-screen experience, no browser tabs, no typing the address every time.
            </p>
          </div>

          {showIOSInstructions ? (
            <div className="w-full space-y-2.5 pt-1">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] text-left">
                <Share className="w-5 h-5 text-rose-600 shrink-0" />
                <span className="text-xs text-stone-700">
                  Tap the <strong>Share</strong> icon in Safari's toolbar
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] text-left">
                <PlusSquare className="w-5 h-5 text-rose-600 shrink-0" />
                <span className="text-xs text-stone-700">
                  Scroll down and tap <strong>Add to Home Screen</strong>
                </span>
              </div>
              <button
                onClick={handleClose}
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 shadow-md shadow-rose-600/20 active:scale-[0.99] transition-all text-sm cursor-pointer mt-1"
              >
                Got it
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-2.5 pt-1">
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 shadow-md shadow-rose-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Install App</span>
              </button>
              <button
                onClick={handleClose}
                className="w-full py-2.5 text-stone-500 hover:text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                Maybe later
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
