import React from 'react';
import { Flame } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  hasActiveResult: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  hasActiveResult,
}) => {
  return (
    <header className="w-full border-b border-[#E7E2D9] bg-[#FAF8F5]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="brand-home-btn"
          onClick={onReset}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-95 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-rose-600 text-white shadow-sm">
            <Flame className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-lg text-stone-900 font-editorial">FLAME</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium hidden sm:block">
              Psychological Compatibility & Relationship Forensic Reader
            </p>
          </div>
        </button>

        {/* Live Social Proof Badge & Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E7E2D9] text-xs text-stone-600 shadow-xs">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600" />
            </span>
            <span className="font-medium text-stone-800">54,192</span> matches analyzed today
          </div>

          {hasActiveResult && (
            <button
              id="new-test-header-btn"
              onClick={onReset}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 text-stone-700 border border-[#E7E2D9] transition-colors cursor-pointer shadow-xs"
            >
              + New Test
            </button>
          )}
        </div>
      </div>
    </header>
  );
};


