import React, { useState } from 'react';
import { Sparkles, Heart, ArrowRight, Flame, ShieldAlert, Users, Compass, UserCheck } from 'lucide-react';
import { TestType, BirthMonth, CircleRelationshipType } from '../types';

interface InputHeroProps {
  activeTab: TestType;
  onTabChange: (tab: TestType) => void;
  onAnalyzeFlame: (name1: string, name2: string, status: string) => void;
  onAnalyzeFortune: (fullName: string, age: number, birthMonth: BirthMonth) => void;
  onAnalyzeCircle: (yourName: string, theirName: string, rel: CircleRelationshipType) => void;
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

const BIRTH_MONTHS: BirthMonth[] = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CIRCLE_RELATIONSHIPS: CircleRelationshipType[] = [
  'Friend', 'Sibling', 'Parent', 'Cousin', 'Colleague', 'Other'
];

export const InputHero: React.FC<InputHeroProps> = ({
  activeTab,
  onTabChange,
  onAnalyzeFlame,
  onAnalyzeFortune,
  onAnalyzeCircle,
  isLoading,
}) => {
  // FLAME state
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [status, setStatus] = useState(RELATIONSHIP_STATUSES[0]);

  // Fortune state
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number | ''>(24);
  const [birthMonth, setBirthMonth] = useState<BirthMonth>('October');

  // Circle state
  const [circleYourName, setCircleYourName] = useState('');
  const [circleTheirName, setCircleTheirName] = useState('');
  const [circleRelationship, setCircleRelationship] = useState<CircleRelationshipType>('Friend');

  const [error, setError] = useState<string | null>(null);

  const handleFlameSubmit = (e: React.FormEvent) => {
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
    onAnalyzeFlame(name1.trim(), name2.trim(), status);
  };

  const handleFortuneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = fullName.trim().replace(/^@/, '');
    if (!cleanName) {
      setError('Please enter your full name');
      return;
    }
    const numAge = Number(age);
    if (!numAge || numAge < 12 || numAge > 110) {
      setError('Please enter a realistic age between 12 and 110');
      return;
    }
    setError(null);
    onAnalyzeFortune(cleanName, numAge, birthMonth);
  };

  const handleCircleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean1 = circleYourName.trim().replace(/^@/, '');
    const clean2 = circleTheirName.trim().replace(/^@/, '');

    if (!clean1) {
      setError('Please enter your name');
      return;
    }
    if (!clean2) {
      setError("Please enter the other person's name");
      return;
    }
    if (clean1.toLowerCase() === clean2.toLowerCase()) {
      setError('Two exact same names cannot be analyzed. Please enter two different names to check your bond and reveal the free teaser.');
      return;
    }
    setError(null);
    onAnalyzeCircle(clean1, clean2, circleRelationship);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6 sm:py-10 px-4">
      {/* Test Type Switcher Tabs */}
      <div className="flex items-center justify-center mb-6">
        <div className="inline-flex p-1.5 rounded-2xl bg-[#EDE8E0] border border-[#E7E2D9] gap-1 shadow-inner max-w-full overflow-x-auto">
          <button
            id="tab-flame-romance"
            type="button"
            onClick={() => {
              setError(null);
              onTabChange('flame');
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'flame'
                ? 'bg-white text-rose-600 shadow-xs ring-1 ring-rose-200'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
            }`}
          >
            <Flame className="w-4 h-4 text-rose-600" />
            <span>FLAME Romance</span>
          </button>

          <button
            id="tab-fortune-teller"
            type="button"
            onClick={() => {
              setError(null);
              onTabChange('fortune');
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'fortune'
                ? 'bg-white text-rose-600 shadow-xs ring-1 ring-rose-200'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
            }`}
          >
            <span className="relative flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-rose-600 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600" />
              </span>
            </span>
            <span>Fortune Teller</span>
          </button>

          <button
            id="tab-circle-check"
            type="button"
            onClick={() => {
              setError(null);
              onTabChange('circle');
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'circle'
                ? 'bg-white text-rose-600 shadow-xs ring-1 ring-rose-200'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
            }`}
          >
            <Users className="w-4 h-4 text-rose-600" />
            <span>Circle Check</span>
          </button>
        </div>
      </div>

      {/* Main Hook Header based on Active Tab */}
      <div className="text-center space-y-3 mb-6 sm:mb-8">
        {activeTab === 'flame' && (
          <>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.1rem] font-medium tracking-tight font-editorial text-stone-900 leading-[1.18]">
              Find out why you two click{' '}
              <span className="italic font-normal text-rose-600">
                (and what could ruin it)
              </span>
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Enter two names or Instagram handles. Get an instant free compatibility reading, 
              a sharp psychological teaser, and generate a viral story card.
            </p>
          </>
        )}

        {activeTab === 'fortune' && (
          <>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.1rem] font-medium tracking-tight font-editorial text-stone-900 leading-[1.18]">
              Your personal forensic foresight{' '}
              <span className="italic font-normal text-rose-600">
                (warm, sharp & uplifting)
              </span>
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Enter your name, age, and birth month. Reveal your core archetype, near-future 3-month forecast, 
              hidden advantages, and an encouraging self-esteem boost.
            </p>
          </>
        )}

        {activeTab === 'circle' && (
          <>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.1rem] font-medium tracking-tight font-editorial text-stone-900 leading-[1.18]">
              Check your bond with anyone{' '}
              <span className="italic font-normal text-rose-600">
                (friends, family & colleagues)
              </span>
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              The same forensic psychology engine, calibrated for platonic and family connections. 
              Discover your bond archetype, communication friction points, and survival forecast.
            </p>
          </>
        )}
      </div>

      {/* Main Input Form Card */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E2D9] shadow-sm backdrop-blur-xl">
        <div className="absolute -top-3 right-6 px-3.5 py-1 rounded-full bg-rose-600 text-[11px] font-bold text-white shadow-xs">
          100% Free Instant Teaser
        </div>

        {/* TAB 1: FLAME ROMANCE FORM */}
        {activeTab === 'flame' && (
          <form onSubmit={handleFlameSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">
                  Your Name or IG
                </label>
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

              <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-[#E7E2D9] items-center justify-center text-rose-500 shadow-xs">
                <Heart className="w-4 h-4 fill-current opacity-80" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">
                  Partner or Crush
                </label>
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

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

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
        )}

        {/* TAB 2: FORTUNE TELLER FORM */}
        {activeTab === 'fortune' && (
          <form onSubmit={handleFortuneSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">
                Your Full Name
              </label>
              <input
                id="fortune-fullname-input"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. Maya Chen or David Adeleke"
                maxLength={45}
                disabled={isLoading}
                className="w-full px-4 py-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 font-medium transition-all text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">
                  Your Age
                </label>
                <input
                  id="fortune-age-input"
                  type="number"
                  min={12}
                  max={110}
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value === '' ? '' : parseInt(e.target.value, 10));
                    if (error) setError(null);
                  }}
                  placeholder="24"
                  disabled={isLoading}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 font-medium transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">
                  Birth Month
                </label>
                <select
                  id="fortune-birthmonth-select"
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(e.target.value as BirthMonth)}
                  disabled={isLoading}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 font-medium transition-all text-sm cursor-pointer"
                >
                  {BIRTH_MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <button
              id="calculate-fortune-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 shadow-md shadow-rose-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-base disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 animate-spin text-amber-200" />
                  <span>Casting Foresight & Character Matrices...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Reveal Personal Fortune & Free Teaser</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 3: CIRCLE CHECK FORM */}
        {activeTab === 'circle' && (
          <form onSubmit={handleCircleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">
                  Your Name
                </label>
                <input
                  id="circle-yourname-input"
                  type="text"
                  value={circleYourName}
                  onChange={(e) => {
                    setCircleYourName(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Your Name..."
                  maxLength={35}
                  disabled={isLoading}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 font-medium transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">
                  Their Name
                </label>
                <input
                  id="circle-theirname-input"
                  type="text"
                  value={circleTheirName}
                  onChange={(e) => {
                    setCircleTheirName(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Their Name..."
                  maxLength={35}
                  disabled={isLoading}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 font-medium transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700 block">
                Relationship Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CIRCLE_RELATIONSHIPS.map((rel) => (
                  <button
                    key={rel}
                    type="button"
                    onClick={() => setCircleRelationship(rel)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-center border cursor-pointer ${
                      circleRelationship === rel
                        ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-xs'
                        : 'bg-[#FAF8F5] border-[#E7E2D9] text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    {rel}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <button
              id="calculate-circle-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 shadow-md shadow-rose-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-base disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-2.5">
                  <Users className="w-5 h-5 animate-pulse text-amber-200" />
                  <span>Auditing Kinship Dynamics & Loyalty...</span>
                </div>
              ) : (
                <>
                  <Users className="w-5 h-5" />
                  <span>Audit Bond & Reveal Free Teaser</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
