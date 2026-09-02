import React, { useState } from 'react';
import { CompatibilityResult, PaystackConfig } from '../types';
import {
  Flame,
  Lock,
  Sparkles,
  Share2,
  AlertTriangle,
  Heart,
  CheckCircle,
  Zap,
  ArrowRight,
  ShieldCheck,
  Eye,
  MessageCircle
} from 'lucide-react';
import { initiatePaystackPayment } from '../utils/paystack';

interface FreeResultViewProps {
  result: CompatibilityResult;
  onUnlockSuccess: (reference: string, tier: 'standard' | 'vip') => void;
  onOpenShareModal: () => void;
  onReset: () => void;
  paystackConfig: PaystackConfig;
}

export const FreeResultView: React.FC<FreeResultViewProps> = ({
  result,
  onUnlockSuccess,
  onOpenShareModal,
  onReset,
  paystackConfig,
}) => {
  const [selectedTier, setSelectedTier] = useState<'standard' | 'vip'>('standard');
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handlePaystackCheckout = (tier: 'standard' | 'vip') => {
    setIsProcessing(true);
    setPaymentError(null);

    const amountKobo = tier === 'standard' ? 50000 : 100000;
    const planName = tier === 'standard' ? 'Standard Deep Reading (₦500)' : 'VIP Forensic Dossier (₦1,000)';

    initiatePaystackPayment({
      email: email.trim() || 'reader@flame-love.app',
      amountKobo,
      planName,
      partnerNames: `${result.name1} & ${result.name2}`,
      publicKey: paystackConfig.publicKey,
      isSimulated: paystackConfig.isSimulated,
      onSuccess: (ref) => {
        setIsProcessing(false);
        onUnlockSuccess(ref, tier);
      },
      onCancel: () => {
        setIsProcessing(false);
      },
      onError: (msg) => {
        setIsProcessing(false);
        setPaymentError(msg);
      },
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 space-y-8 animate-fadeIn">
      {/* Top Match Result Banner */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E2D9] shadow-sm text-center overflow-hidden">
        {/* Subtle Warm Rose Glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-15 bg-rose-500"
        />

        <div className="relative z-10 space-y-5">
          {/* Couple Header */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-50 border border-[#E7E2D9] text-xs font-semibold text-stone-700 max-w-full flex-wrap justify-center text-center">
            <span className="truncate max-w-[140px] sm:max-w-[200px]">{result.name1}</span>
            <Heart className="w-3.5 h-3.5 text-rose-600 fill-current shrink-0" />
            <span className="truncate max-w-[140px] sm:max-w-[200px]">{result.name2}</span>
            <span className="text-stone-400 shrink-0">• {result.relationshipStatus}</span>
          </div>

          {/* Big Score Ring */}
          <div className="flex flex-col items-center justify-center my-2">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
              {/* Outer SVG Ring */}
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-stone-200"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  style={{ stroke: '#e11d48' }}
                  className="transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - result.score / 100)}`}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl sm:text-5xl font-bold font-editorial text-stone-900 tracking-tight">
                  {result.score}%
                </span>
                <span className="text-[11px] uppercase tracking-wider font-bold text-rose-600">
                  Match Score
                </span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-editorial text-stone-900 mt-3">
              {result.tierTitle}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mt-1">
              Archetype: <span className="text-rose-700 font-semibold">{result.archetype.title}</span>
            </p>
          </div>

          {/* The Viral Free Teaser Card */}
          <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] text-left space-y-2 relative shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                Free Psychological Insight
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-medium">
                Uncanny Truth
              </span>
            </div>
            <p className="text-sm sm:text-base font-medium text-stone-800 leading-snug">
              {result.freeTeaser}
            </p>
          </div>

          {/* Quick Buttons: Share Card & Retest */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="open-share-card-btn"
              onClick={onOpenShareModal}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-rose-400" />
              <span>Generate Free Story Card (IG/WhatsApp)</span>
            </button>

            <button
              onClick={onReset}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-stone-600 hover:text-stone-900 text-xs font-semibold transition-colors cursor-pointer"
            >
              Test Another Couple
            </button>
          </div>
        </div>
      </div>

      {/* THE HIGH-CONVERTING PAYWALL CARD */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E2D9] shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl bg-rose-600 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-xs">
          ⚡ 1-Tap Paystack Instant Unlock
        </div>

        <div className="space-y-6">
          {/* Anxiety-Driven Headline */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Full Relationship Forensic Report</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 font-editorial leading-tight">
              {result.anxietyHook}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Don't guess what your partner is thinking during silent moments. Unlock their attachment triggers,
              hidden love language clash, and the exact golden rule to protect this connection.
            </p>
          </div>

          {/* Pricing Tier Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Standard Tier */}
            <button
              type="button"
              onClick={() => setSelectedTier('standard')}
              className={`p-4 rounded-xl border text-left transition-all relative cursor-pointer ${
                selectedTier === 'standard'
                  ? 'bg-rose-50/70 border-rose-400 ring-1 ring-rose-300'
                  : 'bg-[#FAF8F5] border-[#E7E2D9] hover:border-stone-400'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-stone-800">Standard Deep Reading</span>
                  <div className="text-xl font-bold font-editorial text-stone-900 mt-1">₦500</div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selectedTier === 'standard' ? 'bg-rose-600 border-rose-600' : 'border-stone-300 bg-white'
                  }`}
                >
                  {selectedTier === 'standard' && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>
              <ul className="mt-3 space-y-1.5 text-[11px] text-stone-600">
                <li className="flex items-center gap-1.5">✓ Love Language Match & Clash</li>
                <li className="flex items-center gap-1.5">✓ 3 Brutal Red Flags Revealed</li>
                <li className="flex items-center gap-1.5">✓ Longevity & Survival Score</li>
                <li className="flex items-center gap-1.5">✓ The #1 Fatal Flaw Trigger</li>
              </ul>
            </button>

            {/* VIP Tier */}
            <button
              type="button"
              onClick={() => setSelectedTier('vip')}
              className={`p-4 rounded-xl border text-left transition-all relative cursor-pointer ${
                selectedTier === 'vip'
                  ? 'bg-amber-50/80 border-amber-500 ring-1 ring-amber-400'
                  : 'bg-[#FAF8F5] border-[#E7E2D9] hover:border-stone-400'
              }`}
            >
              <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded bg-amber-500 text-[10px] font-extrabold text-white uppercase">
                Most Comprehensive
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-amber-900">VIP Forensic Dossier</span>
                  <div className="text-xl font-bold font-editorial text-stone-900 mt-1">₦1,000</div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selectedTier === 'vip' ? 'border-amber-500 bg-amber-500' : 'border-stone-300 bg-white'
                  }`}
                >
                  {selectedTier === 'vip' && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>
              <ul className="mt-3 space-y-1.5 text-[11px] text-stone-700">
                <li className="flex items-center gap-1.5">✓ Everything in Standard Reading</li>
                <li className="flex items-center gap-1.5">✓ Attachment Style Loop (Anxious/Avoidant)</li>
                <li className="flex items-center gap-1.5">✓ 3-Month, 1-Year & 5-Year Trajectory</li>
                <li className="flex items-center gap-1.5">✓ The Unspoken Truth + Golden Survival Rule</li>
                <li className="flex items-center gap-1.5">✓ Premium High-Res Story Card Styles</li>
              </ul>
            </button>
          </div>

          {/* Email input for Paystack receipt */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
              <span>Email for Paystack receipt & reading copy (optional)</span>
              <span className="text-[10px] text-stone-400">No account required</span>
            </label>
            <input
              id="paystack-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@example.com"
              className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 text-xs font-medium"
            />
          </div>

          {/* Error notice if any */}
          {paymentError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {paymentError}
            </div>
          )}

          {/* Paystack Checkout Button */}
          <button
            id="paystack-checkout-trigger-btn"
            onClick={() => handlePaystackCheckout(selectedTier)}
            disabled={isProcessing}
            className="w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 shadow-md shadow-rose-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 text-base sm:text-lg cursor-pointer disabled:opacity-75"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 animate-spin text-white" />
                <span>Connecting to Paystack...</span>
              </div>
            ) : (
              <>
                <Lock className="w-5 h-5 text-amber-200" />
                <span>
                  Unlock Full Report for {selectedTier === 'standard' ? '₦500' : '₦1,000'}
                </span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-stone-500 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Secured by Paystack Inline
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-amber-500" />
              Instant 1-Tap Unlock
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-rose-500" />
              Zero Sign-Up Friction
            </span>
          </div>
        </div>
      </div>

      {/* BLURRED / LOCKED TEASER SECTIONS (Creates massive curiosity) */}
      <div className="space-y-4 pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 text-center">
          What is waiting in your full report:
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Locked Item 1: Love Languages */}
          <div className="relative p-5 rounded-xl bg-white border border-[#E7E2D9] shadow-xs overflow-hidden">
            <div className="filter blur-[5px] select-none pointer-events-none opacity-40 space-y-2">
              <div className="h-4 w-32 bg-stone-300 rounded" />
              <p className="text-xs text-stone-600">
                Person 1 gives love via verbal compliments and constant validation, while Person 2 prioritizes physical proximity and problem solving...
              </p>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/60 p-4 text-center backdrop-blur-xs">
              <Lock className="w-5 h-5 text-rose-300 mb-1" />
              <span className="text-xs font-bold text-white">Love Language Clash & Bridge</span>
              <span className="text-[10px] text-stone-200">Locked • Unlocks with ₦500 report</span>
            </div>
          </div>

          {/* Locked Item 2: Red Flags */}
          <div className="relative p-5 rounded-xl bg-white border border-[#E7E2D9] shadow-xs overflow-hidden">
            <div className="filter blur-[5px] select-none pointer-events-none opacity-40 space-y-2">
              <div className="h-4 w-36 bg-rose-200 rounded" />
              <p className="text-xs text-stone-600">
                1. Grudge Archiving during minor arguments... 2. Silent retreat when overwhelmed...
              </p>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/60 p-4 text-center backdrop-blur-xs">
              <Lock className="w-5 h-5 text-rose-300 mb-1" />
              <span className="text-xs font-bold text-white">3 Uncomfortable Red Flags</span>
              <span className="text-[10px] text-stone-200">Locked • Unlocks with ₦500 report</span>
            </div>
          </div>

          {/* Locked Item 3: Attachment Traps */}
          <div className="relative p-5 rounded-xl bg-white border border-[#E7E2D9] shadow-xs overflow-hidden">
            <div className="filter blur-[5px] select-none pointer-events-none opacity-40 space-y-2">
              <div className="h-4 w-40 bg-stone-300 rounded" />
              <p className="text-xs text-stone-600">
                Anxious-Avoidant trigger loop: When stressed, Person 1 demands immediate closeness while Person 2 withdraws...
              </p>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/60 p-4 text-center backdrop-blur-xs">
              <Lock className="w-5 h-5 text-rose-300 mb-1" />
              <span className="text-xs font-bold text-white">Attachment Styles Conflict Cycle</span>
              <span className="text-[10px] text-stone-200">Locked • Unlocks with report</span>
            </div>
          </div>

          {/* Locked Item 4: Longevity Forecast */}
          <div className="relative p-5 rounded-xl bg-white border border-[#E7E2D9] shadow-xs overflow-hidden">
            <div className="filter blur-[5px] select-none pointer-events-none opacity-40 space-y-2">
              <div className="h-4 w-32 bg-stone-300 rounded" />
              <p className="text-xs text-stone-600">
                3-Month milestone: First boundary test... 1-Year survival odds: 84%...
              </p>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/60 p-4 text-center backdrop-blur-xs">
              <Lock className="w-5 h-5 text-rose-300 mb-1" />
              <span className="text-xs font-bold text-white">3-Month & 1-Year Longevity Forecast</span>
              <span className="text-[10px] text-stone-200">Locked • Unlocks with report</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
