import React, { useState } from 'react';
import { Sparkles, Heart, ArrowRight, Flame, ShieldAlert } from 'lucide-react';

interface InputHeroProps {
  onAnalyze: (name1: string, name2: string, status: string) => void;
  isLoading: boolean;
}

const RELATIONSHIP_STATUSES = [
  'Dating / In Love',
  'Crush / Talking Stage',
  'Situationship',
  'Married',
  "It's Complicated",
  'Ex / Closure',
];

export const InputHero: React.FC<InputHeroProps> = ({ onAnalyze, isLoading }) => {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [status, setStatus] = useState(RELATIONSHIP_STATUSES[0]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean1 = name1.trim().replace(/^@/, '');
    const clean2 = name2.trim().replace(/^@/, '');

    if (!clean1) {
      setError('Please enter your name or handle');
      return;
    }
    if (!clean2) {
      setError("Please enter your partner's name or handle");
      return;
    }
    if (clean1.toLowerCase() === clean2.toLowerCase()) {
      setError('Two exact same names cannot be analyzed. Please enter two different names or handles to reveal compatibility and the free teaser.');
      return;
    }
    setError(null);
    onAnalyze(name1.trim(), name2.trim(), status);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8 sm:py-12 px-4">
      {/* Main Hook with Editorial Serif Font */}
      <div className="text-center space-y-3.5 mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-medium tracking-tight font-editorial text-stone-900 leading-[1.18]">
          Find out why you two click{' '}
          <span className="italic font-normal text-rose-600">
            (and what could ruin it)
          </span>
        </h1>

        <p className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Enter two names or Instagram handles. Get an instant free compatibility reading, 
          a sharp psychological teaser, and generate a viral story card.
        </p>
      </div>

      {/* Main Input Form Card */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E2D9] shadow-sm backdrop-blur-xl">
        <div className="absolute -top-3 right-6 px-3.5 py-1 rounded-full bg-rose-600 text-[11px] font-bold text-white shadow-xs">
          100% Free Instant Teaser
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Dual Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
            {/* Person 1 */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">
                <span>Your Name or IG</span>
              </label>
              <div className="relative">
                <input
                  id="person1-name-input"
                  type="text"
                  value={name1}
                  onChange={(e) => {
                    setName1(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Your Name..."
                  maxLength={35}
                  disabled={isLoading}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 font-medium transition-all text-sm"
                />
              </div>
            </div>

            {/* Heart Divider Node */}
            <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-[#E7E2D9] items-center justify-center text-rose-500 shadow-xs">
              <Heart className="w-4 h-4 fill-current opacity-80" />
            </div>

            {/* Person 2 */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">
                <span>Partner or Crush</span>
              </label>
              <div className="relative">
                <input
                  id="person2-name-input"
                  type="text"
                  value={name2}
                  onChange={(e) => {
                    setName2(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Partner's Name..."
                  maxLength={35}
                  disabled={isLoading}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 font-medium transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Relationship Stage Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-700 block">
              Relationship Context
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {RELATIONSHIP_STATUSES.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-center border cursor-pointer ${
                    status === st
                      ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-xs'
                      : 'bg-[#FAF8F5] border-[#E7E2D9] text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            id="calculate-compatibility-btn"
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 shadow-md shadow-rose-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-base disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center gap-2.5">
                <Flame className="w-5 h-5 animate-bounce text-amber-200" />
                <span>Reading Energy & Forensic Chemistry...</span>
              </div>
            ) : (
              <>
                <Flame className="w-5 h-5" />
                <span>Reveal Compatibility & Free Teaser</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

