import React from 'react';
import { AnyReadingResult } from '../types';
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
  Users,
  Compass,
  Info,
  Check,
  AlertTriangle,
  Target,
  Sun
} from 'lucide-react';

interface PaidFullReportViewProps {
  result: AnyReadingResult;
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
      {/* ========================================================================= */}
      {/* 1. TOP UNLOCKED HEADER BANNER */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E2D9] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl bg-emerald-50 text-emerald-800 border-b border-l border-emerald-200 text-[11px] font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Paystack Verified: {paymentRef.slice(0, 14)}...</span>
        </div>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
            {result.testType === 'fortune' ? (
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            ) : result.testType === 'circle' ? (
              <Users className="w-3.5 h-3.5 text-rose-600" />
            ) : (
              <Flame className="w-3.5 h-3.5 text-rose-600" />
            )}
            <span>
              {result.testType === 'fortune'
                ? tier === 'vip'
                  ? 'VIP Lifetime Destiny Dossier'
                  : 'Forensic Character & Foresight Reading'
                : result.testType === 'circle'
                ? tier === 'vip'
                  ? 'VIP Kinship Forensic Dossier'
                  : 'Circle Check Bond Audit'
                : tier === 'vip'
                ? 'VIP Forensic Dossier'
                : 'Full Deep Reading'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {result.testType === 'fortune' ? (
                <>
                  <h1 className="text-2xl sm:text-4xl font-bold text-stone-900 font-editorial">
                    {result.fullName}
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Age: <span className="text-stone-800 font-medium">{result.age}</span> • Month:{' '}
                    <span className="text-stone-800 font-medium">{result.birthMonth}</span> • Zodiac:{' '}
                    <span className="text-rose-700 font-medium">{result.zodiacElement}</span>
                  </p>
                </>
              ) : result.testType === 'circle' ? (
                <>
                  <h1 className="text-2xl sm:text-4xl font-bold text-stone-900 font-editorial">
                    {result.yourName} & {result.theirName}
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Bond: <span className="text-stone-800 font-medium">{result.relationshipType}</span> • Archetype:{' '}
                    <span className="text-rose-700 font-medium">{result.platonicArchetype.title}</span>
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-4xl font-bold text-stone-900 font-editorial">
                    {result.name1} & {result.name2}
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Status: <span className="text-stone-800 font-medium">{result.relationshipStatus}</span> • Cosmic Synergy:{' '}
                    <span className="text-amber-700 font-medium">{result.cosmicElement.synergy}</span>
                  </p>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              {result.testType === 'fortune' ? (
                <div className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 text-white text-center shadow-sm">
                  <div className="text-2xl sm:text-3xl font-bold font-editorial">🔮</div>
                  <div className="text-[10px] uppercase font-bold tracking-wider opacity-90">Destiny Active</div>
                </div>
              ) : (
                <div className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 text-white text-center shadow-sm">
                  <div className="text-2xl sm:text-3xl font-bold font-editorial">{result.score}%</div>
                  <div className="text-[10px] uppercase font-bold tracking-wider opacity-90">
                    {result.testType === 'circle' ? 'Bond Match' : 'Overall Match'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
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

      {/* ========================================================================= */}
      {/* 2. SPECIFIC REPORT BODY BASED ON TEST TYPE */}
      {/* ========================================================================= */}

      {/* -------------------- FORTUNE TELLER REPORT -------------------- */}
      {result.testType === 'fortune' && (
        <>
          {/* SECTION 1: CORE STRENGTH */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E2D9] space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-editorial">Your Core Strength</h3>
                <p className="text-xs text-stone-500">Your inherent psychological engine and natural anchor</p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-3">
              <h4 className="text-base font-bold text-stone-900 font-editorial text-rose-800">
                {result.coreStrength.title}
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {result.coreStrength.inDepth}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-white border border-[#E7E2D9] space-y-1">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">
                    How it manifests in your life:
                  </span>
                  <p className="text-xs text-stone-700 leading-normal">
                    {result.coreStrength.manifestation}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-white border border-[#E7E2D9] space-y-1">
                  <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wide">
                    When it shines brightest:
                  </span>
                  <p className="text-xs text-stone-700 leading-normal">
                    {result.coreStrength.whenItShines}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: WHAT TOMORROW HOLDS FOR YOU */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E2D9] space-y-4 shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-editorial">What Tomorrow Holds For You</h3>
                  <p className="text-xs text-stone-500">Your day ahead energy & mood forecast</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                Daily Atmosphere
              </span>
            </div>

            <div className="p-5 sm:p-6 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-3">
              <p className="text-base sm:text-lg text-stone-900 font-editorial font-medium leading-relaxed italic text-amber-950">
                "{result.whatTomorrowHolds}"
              </p>
              <div className="flex items-center gap-2 pt-1 text-xs text-stone-500 font-medium">
                <span>An atmospheric reflection for your day ahead</span>
                <span>•</span>
                <span>Changes every 24 hours while your core traits stay anchored</span>
              </div>
            </div>
          </div>

          {/* SECTION 3: WHAT'S COMING NEXT 3 MONTHS */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E2D9] space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-editorial">What's Coming Next 3 Months</h3>
                  <p className="text-xs text-stone-500">Upcoming transit dynamics and opportunities</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                {result.nextThreeMonths.phase}
              </span>
            </div>

            <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-4">
              <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                {result.nextThreeMonths.timelineFocus}
              </p>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  Key Opportunities Approaching:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {result.nextThreeMonths.keyOpportunities.map((opp, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-white border border-[#E7E2D9] flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-stone-700 font-medium">{opp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-rose-50/70 border border-rose-200">
                <span className="text-xs font-bold text-rose-900 block mb-1">
                  Actionable Strategic Guidance:
                </span>
                <p className="text-xs text-rose-800 leading-relaxed">
                  {result.nextThreeMonths.actionableGuidance}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 3: THE THING HOLDING YOU BACK */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E2D9] space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-editorial">The Thing Holding You Back</h3>
                <p className="text-xs text-stone-500">Your subconscious friction point and how to dismantle it</p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-rose-50/40 border border-rose-200 space-y-3">
              <h4 className="text-base font-bold text-rose-900 font-editorial">
                {result.holdingYouBack.habitTrap}
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {result.holdingYouBack.howItSabotages}
              </p>

              <div className="p-3.5 rounded-lg bg-white border border-rose-200">
                <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wide block mb-1">
                  The Liberating Reframe:
                </span>
                <p className="text-xs text-stone-800 font-medium leading-relaxed italic">
                  "{result.holdingYouBack.mentalReframe}"
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 4: YOUR HIDDEN ADVANTAGE */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E2D9] space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-editorial">Your Hidden Advantage</h3>
                <p className="text-xs text-stone-500">The unfair edge others constantly observe in you</p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-3">
              <h4 className="text-base font-bold text-stone-900 font-editorial text-emerald-900">
                {result.hiddenAdvantage.superpower}
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {result.hiddenAdvantage.howToLeverage}
              </p>
              <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 font-medium">
                <span className="font-bold">Competitive Edge:</span> {result.hiddenAdvantage.competitiveEdge}
              </div>
            </div>
          </div>

          {/* VIP SECTIONS (Only if tier === 'vip') */}
          {tier === 'vip' ? (
            <>
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 space-y-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                      ★
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-stone-900 font-editorial">
                        VIP Exclusive: 1-Year & 5-Year Destiny Outlook
                      </h3>
                      <p className="text-xs text-stone-500">High-dimensional trajectory analysis for {result.fullName}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold">
                    ₦1,000 Tier Unlocked
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 1 Year */}
                  <div className="p-5 rounded-xl bg-white border border-amber-200 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
                        1-Year Trajectory
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {result.vipInsights.oneYearOutlook.milestone}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      {result.vipInsights.oneYearOutlook.forecast}
                    </p>
                    <div className="p-2.5 rounded bg-amber-50 text-[11px] text-amber-900 font-medium">
                      ⚠️ <span className="font-bold">Watch out for:</span> {result.vipInsights.oneYearOutlook.strategicWarning}
                    </div>
                  </div>

                  {/* 5 Year */}
                  <div className="p-5 rounded-xl bg-white border border-amber-200 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
                        5-Year Legacy Potential
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {result.vipInsights.fiveYearLegacy.archetypeEvolution}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      {result.vipInsights.fiveYearLegacy.legacyFocus}
                    </p>
                    <div className="p-2.5 rounded bg-emerald-50 text-[11px] text-emerald-900 font-medium">
                      🏆 <span className="font-bold">Pinnacle:</span> {result.vipInsights.fiveYearLegacy.pinnacleAchievement}
                    </div>
                  </div>
                </div>

                {/* The Golden Rule */}
                <div className="p-5 rounded-xl bg-stone-900 text-white space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <h4 className="text-sm font-bold font-editorial text-amber-300 uppercase tracking-wider">
                      The Golden Rule (Your Non-Negotiable Compass)
                    </h4>
                  </div>
                  <p className="text-base sm:text-lg font-bold font-editorial text-amber-100 italic">
                    "{result.vipInsights.goldenRule.axiom}"
                  </p>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    <span className="text-white font-semibold">Daily Practice:</span>{' '}
                    {result.vipInsights.goldenRule.dailyPractice}
                  </p>
                  <div className="pt-2 border-t border-stone-800 text-xs text-amber-200 font-medium">
                    ✨ {result.vipInsights.goldenRule.closingAffirmation}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Unlock 1-Year Outlook & 5-Year Legacy Potential
                </span>
                <p className="text-xs text-stone-600">
                  Upgrade to the VIP Dossier (₦1,000) to reveal your long-term roadmap and closing Golden Rule.
                </p>
              </div>
              <button
                onClick={onReset}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
              >
                Upgrade to VIP
              </button>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-[11px] text-stone-500 italic text-center py-2 flex items-center justify-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            <span>{result.disclaimer}</span>
          </p>
        </>
      )}

      {/* -------------------- CIRCLE CHECK REPORT -------------------- */}
      {result.testType === 'circle' && (
        <>
          {/* SECTION 1: COMMUNICATION STYLE */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E2D9] space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-editorial">Your Bond's Communication Style</h3>
                <p className="text-xs text-stone-500">How energy, trust, and validation flow between you two</p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-3">
              <h4 className="text-base font-bold text-stone-900 font-editorial text-rose-800">
                {result.communicationStyle.styleTitle}
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {result.communicationStyle.dynamicAnalysis}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-white border border-[#E7E2D9] space-y-1">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">
                    The Unspoken Rule:
                  </span>
                  <p className="text-xs text-stone-700 leading-normal">
                    {result.communicationStyle.unspokenRule}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-white border border-[#E7E2D9] space-y-1">
                  <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wide">
                    Blind Spot to Watch:
                  </span>
                  <p className="text-xs text-stone-700 leading-normal">
                    {result.communicationStyle.blindSpot}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: THE #1 FRICTION POINT */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E2D9] space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-editorial">The #1 Friction Point</h3>
                <p className="text-xs text-stone-500">The exact trigger that creates unspoken distance</p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-rose-50/40 border border-rose-200 space-y-3">
              <h4 className="text-base font-bold text-rose-900 font-editorial">
                Trigger: {result.frictionPoint.trigger}
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {result.frictionPoint.rootCause}
              </p>

              <div className="p-3.5 rounded-lg bg-white border border-rose-200">
                <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wide block mb-1">
                  How to Resolve with Dignity:
                </span>
                <p className="text-xs text-stone-800 font-medium leading-relaxed">
                  {result.frictionPoint.howToResolve}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 3: SURVIVAL FORECAST (BUILD TOGETHER OR DRIFT APART) */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E2D9] space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-editorial">Will You Build Together or Drift Apart?</h3>
                  <p className="text-xs text-stone-500">Longevity prediction and mutual trajectory</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
                {result.survivalForecast.verdict}
              </span>
            </div>

            <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700">Longevity & Synergy Index</span>
                <span className="text-emerald-700 font-bold text-sm">{result.survivalForecast.probability}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-stone-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-600"
                  style={{ width: `${result.survivalForecast.probability}%` }}
                />
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed pt-1">
                {result.survivalForecast.analysis}
              </p>

              <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 font-medium">
                <span className="font-bold">Bond Superpower:</span> {result.survivalForecast.bondSuperpower}
              </div>
            </div>
          </div>

          {/* VIP SECTIONS FOR CIRCLE CHECK */}
          {tier === 'vip' ? (
            <>
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 space-y-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                      ★
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-stone-900 font-editorial">
                        VIP Exclusive: 1-Year & 5-Year Trajectory
                      </h3>
                      <p className="text-xs text-stone-500">
                        Long-term forecast for {result.yourName} & {result.theirName}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold">
                    ₦1,000 Tier Unlocked
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 1 Year */}
                  <div className="p-5 rounded-xl bg-white border border-amber-200 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
                        1-Year Trajectory
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {result.vipInsights.oneYearTrajectory.milestone}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      {result.vipInsights.oneYearTrajectory.forecast}
                    </p>
                    <div className="p-2.5 rounded bg-amber-50 text-[11px] text-amber-900 font-medium">
                      ⚠️ <span className="font-bold">Watch:</span> {result.vipInsights.oneYearTrajectory.keyWarning}
                    </div>
                  </div>

                  {/* 5 Year */}
                  <div className="p-5 rounded-xl bg-white border border-amber-200 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
                        5-Year Long-Term Outlook
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {result.vipInsights.fiveYearTrajectory.bondEvolution}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      {result.vipInsights.fiveYearTrajectory.longTermForecast}
                    </p>
                    <div className="p-2.5 rounded bg-emerald-50 text-[11px] text-emerald-900 font-medium">
                      🏆 <span className="font-bold">Anchor:</span> {result.vipInsights.fiveYearTrajectory.legacyPillar}
                    </div>
                  </div>
                </div>

                {/* Kinship Golden Rule */}
                <div className="p-5 rounded-xl bg-stone-900 text-white space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <h4 className="text-sm font-bold font-editorial text-amber-300 uppercase tracking-wider">
                      The Kinship Golden Rule
                    </h4>
                  </div>
                  <p className="text-base sm:text-lg font-bold font-editorial text-amber-100 italic">
                    "{result.vipInsights.kinshipGoldenRule.rule}"
                  </p>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    <span className="text-white font-semibold">Daily Commitment:</span>{' '}
                    {result.vipInsights.kinshipGoldenRule.dailyCommitment}
                  </p>
                  <div className="pt-2 border-t border-stone-800 text-xs text-amber-200 font-medium">
                    ✨ {result.vipInsights.kinshipGoldenRule.closingWisdom}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Unlock 1-Year & 5-Year Trajectory + Kinship Golden Rule
                </span>
                <p className="text-xs text-stone-600">
                  Upgrade to the VIP Dossier (₦1,000) for complete multi-year forecasts and the lifelong kinship compass.
                </p>
              </div>
              <button
                onClick={onReset}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
              >
                Upgrade to VIP
              </button>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-[11px] text-stone-500 italic text-center py-2 flex items-center justify-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            <span>{result.disclaimer}</span>
          </p>
        </>
      )}

      {/* -------------------- FLAME ROMANCE REPORT (Default) -------------------- */}
      {(!result.testType || result.testType === 'flame') && (
        <>
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

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-stone-700">Physical & Magnetism Spark</span>
                  <span className="text-rose-600 font-bold">{result.metrics.physical}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                  <div className="h-full rounded-full bg-rose-600" style={{ width: `${result.metrics.physical}%` }} />
                </div>
                <p className="text-[11px] text-stone-500">
                  Chemical attraction and baseline physical pull across casual and intimate settings.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-stone-700">Communication Transparency</span>
                  <span className="text-rose-600 font-bold">{result.metrics.communication}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                  <div className="h-full rounded-full bg-stone-800" style={{ width: `${result.metrics.communication}%` }} />
                </div>
                <p className="text-[11px] text-stone-500">
                  Ability to voice uncomfortable truths without triggering defensiveness or silent retreats.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: 3 BRUTAL RED FLAGS */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E2D9] space-y-5 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-editorial">3 Uncomfortable Red Flags to Monitor</h3>
                <p className="text-xs text-stone-500">Specific behavioral flashpoints detected in your synergy profile</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
              {result.redFlags.map((flag, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-rose-50/40 border border-rose-200 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </div>
                  <h4 className="text-xs font-bold text-rose-950 font-editorial">{flag.title}</h4>
                  <p className="text-[11px] text-stone-600 leading-relaxed">{flag.description}</p>
                  <div className="pt-2 border-t border-rose-100 text-[10px] text-rose-800 font-semibold">
                    Trigger: <span className="font-normal text-stone-600">{flag.trigger}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: LOVE LANGUAGE MATCH & CLASH */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E2D9] space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-editorial">Love Language Match & Clash</h3>
                <p className="text-xs text-stone-500">
                  {result.name1}: <span className="font-semibold text-rose-700">{result.loveLanguages.person1}</span> vs.{' '}
                  {result.name2}: <span className="font-semibold text-rose-700">{result.loveLanguages.person2}</span>
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-2">
              <span className="text-xs font-bold text-stone-800 block">The Unspoken Conflict Loop:</span>
              <p className="text-xs text-stone-600 leading-relaxed">{result.loveLanguages.clashPoint}</p>
              <div className="mt-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>The Bridge:</strong> {result.loveLanguages.bridge}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 4: LONGEVITY & TRAJECTORY */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E2D9] space-y-5 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-editorial">Longevity & Trajectory Forecast</h3>
                <p className="text-xs text-stone-500">Survival odds across key milestones</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-1.5">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">3-Month Outlook</span>
                <div className="text-sm font-bold text-stone-900 font-editorial">{result.longevityForecast.threeMonth}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-1.5">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">1-Year Survival</span>
                <div className="text-sm font-bold text-stone-900 font-editorial">{result.longevityForecast.oneYear}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-1.5">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">5-Year Endgame</span>
                <div className="text-sm font-bold text-stone-900 font-editorial">{result.longevityForecast.fiveYear}</div>
              </div>
            </div>
          </div>

          {/* SECTION 5: VIP DOSSIER INSIGHTS */}
          {tier === 'vip' ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                    ★
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-stone-900 font-editorial">
                      VIP Forensic Dossier Exclusives
                    </h3>
                    <p className="text-xs text-stone-500">Unfiltered forensic breakdown for high-stakes clarity</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold">
                  VIP Unlocked
                </span>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-white border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    <span>The Unspoken Truth About You Two</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                    {result.vipDossier.unspokenTruth}
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-stone-900 text-white space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>The Golden Rule to Never Break Up</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-amber-100 font-editorial leading-snug">
                    "{result.vipDossier.goldenRule}"
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Unlock VIP Attachment Style Loop & The Golden Rule
                </span>
                <p className="text-xs text-stone-600">
                  Upgrade to the VIP Dossier (₦1,000) for the attachment trigger cycle and unspoken truths.
                </p>
              </div>
              <button
                onClick={onReset}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
              >
                Upgrade to VIP
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
