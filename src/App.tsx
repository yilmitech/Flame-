import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { InputHero } from './components/InputHero';
import { FreeResultView } from './components/FreeResultView';
import { PaidFullReportView } from './components/PaidFullReportView';
import { ShareCardModal } from './components/ShareCardModal';
import { RecentCouplesTicker } from './components/RecentCouplesTicker';
import { CompatibilityResult, PaystackConfig } from './types';
import { generateCompatibility } from './utils/compatibilityEngine';

const STORAGE_KEY_UNLOCKED = 'flame_unlocked_readings';
const STORAGE_KEY_PAYSTACK = 'flame_paystack_config';

export default function App() {
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockedTier, setUnlockedTier] = useState<'standard' | 'vip'>('standard');
  const [paymentRef, setPaymentRef] = useState<string>('');
  
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [paystackConfig] = useState<PaystackConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PAYSTACK);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      publicKey: 'pk_test_flame_demo_micro_key',
      isSimulated: true, // Default to instant simulation mode so previewers can test unlock seamlessly
    };
  });

  // Check URL parameters on mount (?n1=...&n2=...&st=...)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const n1 = params.get('n1');
      const n2 = params.get('n2');
      const st = params.get('st') || 'Dating';

      if (n1 && n2) {
        const c1 = n1.trim().replace(/^@/, '').toLowerCase();
        const c2 = n2.trim().replace(/^@/, '').toLowerCase();
        if (c1 && c2 && c1 !== c2) {
          handleAnalyze(n1, n2, st, false);
        }
      }
    } catch (e) {
      console.error('URL parse error:', e);
    }
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#be123c', '#f43f5e', '#1c1917', '#e7e2d9', '#f59e0b'],
      });
    } catch {
      // Ignore if canvas-confetti fails in iframe
    }
  };

  const handleAnalyze = (name1: string, name2: string, status: string, withDelay = true) => {
    const clean1 = name1.trim().replace(/^@/, '').toLowerCase();
    const clean2 = name2.trim().replace(/^@/, '').toLowerCase();

    // Prevent identical names from revealing compatibility or teaser
    if (!clean1 || !clean2 || clean1 === clean2) {
      return;
    }

    if (withDelay) {
      setIsLoading(true);
      setTimeout(() => {
        const computed = generateCompatibility(name1, name2, status);
        setResult(computed);
        setIsLoading(false);

        // Check if previously unlocked
        try {
          const unlockedMap = JSON.parse(localStorage.getItem(STORAGE_KEY_UNLOCKED) || '{}');
          if (unlockedMap[computed.id]) {
            setIsUnlocked(true);
            setUnlockedTier(unlockedMap[computed.id].tier || 'standard');
            setPaymentRef(unlockedMap[computed.id].ref || 'FLAME_SAVED_RECEIPT');
          } else {
            setIsUnlocked(false);
          }
        } catch {
          setIsUnlocked(false);
        }

        triggerConfetti();
      }, 1200);
    } else {
      const computed = generateCompatibility(name1, name2, status);
      setResult(computed);
      setIsUnlocked(false);
    }
  };

  const handleUnlockSuccess = (ref: string, tier: 'standard' | 'vip') => {
    if (!result) return;
    setIsUnlocked(true);
    setUnlockedTier(tier);
    setPaymentRef(ref);

    // Save to localStorage
    try {
      const unlockedMap = JSON.parse(localStorage.getItem(STORAGE_KEY_UNLOCKED) || '{}');
      unlockedMap[result.id] = { tier, ref, date: Date.now() };
      localStorage.setItem(STORAGE_KEY_UNLOCKED, JSON.stringify(unlockedMap));
    } catch (e) {
      console.error('Failed to save unlock state:', e);
    }

    triggerConfetti();
  };

  const handleReset = () => {
    setResult(null);
    setIsUnlocked(false);
    // Clear URL params without full page reload
    const url = new URL(window.location.href);
    url.search = '';
    window.history.pushState({}, '', url.toString());
  };

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased bg-[#FAF8F5] text-stone-900 selection:bg-rose-500 selection:text-white">
      {/* Top Navigation */}
      <Header
        onReset={handleReset}
        hasActiveResult={result !== null}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-start">
        {!result && (
          <InputHero
            onAnalyze={(n1, n2, st) => handleAnalyze(n1, n2, st, true)}
            isLoading={isLoading}
          />
        )}

        {result && !isUnlocked && (
          <FreeResultView
            result={result}
            onUnlockSuccess={handleUnlockSuccess}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            onReset={handleReset}
            paystackConfig={paystackConfig}
          />
        )}

        {result && isUnlocked && (
          <PaidFullReportView
            result={result}
            paymentRef={paymentRef}
            tier={unlockedTier}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Social Proof Live Ticker */}
      <RecentCouplesTicker />

      {/* Share Card Modal */}
      {result && (
        <ShareCardModal
          result={result}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
}
