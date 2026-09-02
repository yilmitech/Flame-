import React from 'react';
import { CompatibilityResult } from '../types';
import {
  Flame,
  Share2,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  Heart,
  ShieldCheck,
  Zap,
  TrendingUp,
  Brain,
  MessageCircle,
  HelpCircle,
  Award,
  Download
} from 'lucide-react';

interface PaidFullReportViewProps {
  result: CompatibilityResult;
  paymentRef: string;
  tier: 'standard' | 'vip';
  onOpenShareModal: () => void;
  onReset: () => void;
}

export const PaidFullReportView: React.FC<PaidFullReportViewProps> = ({
  result,
  paymentRef,
  tier,
  onOpenShareModal,
  onReset,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 space-y-8 animate-fadeIn">
      {/* Unlocked Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E2D9] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl bg-emerald-50 text-emerald-800 border-b border-l border-emerald-200 text-[11px] font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Paystack Verified: {paymentRef.slice(0, 14)}...</span>
        </div>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            <span>Unlocked {tier === 'vip' ? 'VIP Forensic Dossier' : 'Full Deep Reading'}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-stone-900 font-editorial">
                {result.name1} & {result.name2}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Status: <span className="text-stone-800 font-medium">{result.relationshipStatus}</span> • Cosmic Synergy:{' '}
                <span className="text-amber-700 font-medium">{result.cosmicElement.synergy}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 text-white text-center shadow-sm">
                <div className="text-2xl sm:text-3xl font-bold font-editorial">{result.score}%</div>
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-90">Overall Match</div>
              </div>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            <button
              onClick={onOpenShareModal}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs active:scale-95 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Generate Shareable Story Card</span>
            </button>
            <button
              onClick={onOpenShareModal}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Share Image Card to WhatsApp</span>
            </button>
            <button
              onClick={onReset}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors ml-auto cursor-pointer"
            >
              Test Another
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: DETAILED CHEMISTRY METRICS */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E2D9] space-y-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 font-editorial">Psychological & Chemistry Dimensions</h3>
              <p className="text-xs text-stone-500">Comprehensive breakdown across 5 vital relational pillars</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Metric 1 */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-stone-700">Emotional Resonance</span>
              <span className="text-rose-600 font-bold">{result.metrics.emotional}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
              <div className="h-full rounded-full bg-rose-600" style={{ width: `${result.metrics.emotional}%` }} />
            </div>
            <p className="text-[11px] text-stone-500">
              Depth of unspoken empathy and psychological safety when one of you is distressed.
            </p>
          </div>

          {/* Metric 2 */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-stone-700">Intellectual & Banter Match</span>
              <span className="text-rose-600 font-bold">{result.metrics.intellectual}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
              <div className="h-full rounded-full bg-rose-700" style={{ width: `${result.metrics.intellectual}%` }} />
            </div>
            <p className="text-[11px] text-stone-500">
              Humor speed, conversational stamina, and ability to challenge each other's ideas.
            </p>
          </div>

          {/* Metric 3 */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-stone-700">Physical & Passion Magnetism</span>
              <span className="text-amber-700 font-bold">{result.metrics.physical}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${result.metrics.physical}%` }} />
            </div>
            <p className="text-[11px] text-stone-500">
              Raw sexual attraction, physical touch synchronization, and sensual chemistry.
            </p>
          </div>

          {/* Metric 4 */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-stone-700">Conflict De-escalation</span>
              <span className="text-rose-600 font-bold">{result.metrics.conflictResolution}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
              <div className="h-full rounded-full bg-rose-500" style={{ width: `${result.metrics.conflictResolution}%` }} />
            </div>
            <p className="text-[11px] text-stone-500">
              Ability to apologize and regulate tempers without weaponizing silence or sarcasm.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: ARCHETYPE & ROLES */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E2D9] space-y-5 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900 font-editorial">Couple Archetype & Role Dynamic</h3>
            <p className="text-xs text-stone-500">How your natural personalities interact daily</p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E7E2D9] pb-3">
            <h4 className="text-base font-bold text-rose-700 font-editorial">{result.archetype.title}</h4>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
              Dominant Archetype
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-white border border-[#E7E2D9]">
              <span className="text-stone-500 block font-semibold mb-1">Role 1:</span>
              <span className="text-stone-900 font-bold text-sm">{result.archetype.p1Role}</span>
            </div>
            <div className="p-3 rounded-lg bg-white border border-[#E7E2D9]">
              <span className="text-stone-500 block font-semibold mb-1">Role 2:</span>
              <span className="text-stone-900 font-bold text-sm">{result.archetype.p2Role}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            {result.archetype.description}
          </p>
        </div>
      </div>

      {/* SECTION 3: ATTACHMENT STYLES & CONFLICT LOOP */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E2D9] space-y-5 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900 font-editorial">Attachment Styles & The Stress Trigger</h3>
            <p className="text-xs text-stone-500">The subconscious defense mechanisms when anxiety hits</p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
              {result.attachment.dynamicName}
            </span>
            <div className="flex gap-2 text-[11px] font-semibold text-stone-500">
              <span className="px-2 py-0.5 rounded bg-white border border-[#E7E2D9] text-stone-800">{result.name1}: {result.attachment.p1Style}</span>
              <span className="px-2 py-0.5 rounded bg-white border border-[#E7E2D9] text-stone-800">{result.name2}: {result.attachment.p2Style}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            {result.attachment.dynamicDescription}
          </p>
        </div>
      </div>

      {/* SECTION 4: LOVE LANGUAGES MATCH & HOW TO TRANSLATE */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E2D9] space-y-5 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900 font-editorial">Love Languages Translation Guide</h3>
            <p className="text-xs text-stone-500">How to make your partner feel adored in their own dialect</p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-bold text-stone-900">
              {result.name1} ({result.loveLanguages.p1Language}) + {result.name2} ({result.loveLanguages.p2Language})
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
              {result.loveLanguages.verdict}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            {result.loveLanguages.explanation}
          </p>
        </div>
      </div>

      {/* SECTION 5: 3 RED FLAGS & 3 GREEN FLAGS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Red Flags */}
        <div className="p-6 rounded-2xl bg-white border border-rose-200 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertOctagon className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold text-stone-900 font-editorial">3 Brutal Red Flags to Watch</h3>
          </div>
          <div className="space-y-2.5">
            {result.redFlags.map((flag, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-900 leading-snug">
                <span className="font-bold text-rose-700 mr-1.5">0{idx + 1}.</span>
                {flag}
              </div>
            ))}
          </div>
        </div>

        {/* Green Flags */}
        <div className="p-6 rounded-2xl bg-white border border-emerald-200 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-700">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-base font-bold text-stone-900 font-editorial">3 Secret Superpowers (Green Flags)</h3>
          </div>
          <div className="space-y-2.5">
            {result.greenFlags.map((flag, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 leading-snug">
                <span className="font-bold text-emerald-700 mr-1.5">0{idx + 1}.</span>
                {flag}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 6: THE #1 FATAL FLAW & UNCOMFORTABLE TRUTH */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-rose-200 space-y-5 shadow-xs">
        <div className="flex items-center gap-2 text-rose-700">
          <AlertOctagon className="w-5 h-5 text-rose-600" />
          <h3 className="text-lg font-bold text-stone-900 font-editorial">The #1 Reason This Could Fail</h3>
        </div>

        <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-3">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-bold text-rose-700">{result.fatalFlaw.title}</h4>
            <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
              High Sensitivity
            </span>
          </div>
          <p className="text-xs text-rose-800 font-medium">
            Trigger: {result.fatalFlaw.trigger}
          </p>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            {result.fatalFlaw.breakdown}
          </p>
        </div>

        {/* The Uncomfortable Truth */}
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            The Uncomfortable Truth Neither Will Say Out Loud
          </span>
          <p className="text-xs sm:text-sm text-stone-800 font-medium italic">
            "{result.uncomfortableTruth}"
          </p>
        </div>

        {/* The Golden Rule */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            The Golden Rule to Make This Last Forever
          </span>
          <p className="text-xs sm:text-sm text-stone-900 font-semibold">
            {result.goldenRule}
          </p>
        </div>
      </div>

      {/* SECTION 7: LONGEVITY TIMELINE FORECAST */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E2D9] space-y-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 font-editorial">Longevity & Timeline Forecast</h3>
              <p className="text-xs text-stone-500">Long-term survival probability: {result.longevity.score}%</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="px-3 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold w-fit">
              3 Months
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {result.longevity.threeMonth}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="px-3 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold w-fit">
              1 Year
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {result.longevity.oneYear}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="px-3 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold w-fit">
              5 Years
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {result.longevity.fiveYear}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="p-6 rounded-2xl bg-white border border-[#E7E2D9] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-stone-900 font-editorial">Share this reading to your story</h4>
          <p className="text-xs text-stone-500">Export high-resolution visual cards formatted for Instagram and WhatsApp.</p>
        </div>
        <button
          onClick={onOpenShareModal}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Story Card (.PNG)</span>
        </button>
      </div>
    </div>
  );
};
