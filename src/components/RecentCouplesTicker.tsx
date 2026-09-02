import React, { useEffect, useState } from 'react';
import { Flame, CheckCircle, Sparkles, Heart } from 'lucide-react';

const RECENT_TESTS = [
  { p1: 'Chinedu', p2: 'Blessing', score: 92, city: 'Lagos', status: 'Unlocked ₦1,000 VIP' },
  { p1: 'Zainab', p2: 'Farouk', score: 86, city: 'Abuja', status: 'Shared Story Card' },
  { p1: 'Tolu', p2: 'Simi', score: 94, city: 'London', status: 'Twin Flame Match' },
  { p1: 'Emeka', p2: 'Amaka', score: 79, city: 'Port Harcourt', status: 'Unlocked ₦500 Report' },
  { p1: 'Kemi', p2: 'Femi', score: 88, city: 'Ibadan', status: 'Shared on WhatsApp' },
  { p1: 'Ngozi', p2: 'David', score: 91, city: 'Enugu', status: 'Unlocked ₦500 Report' },
];

export const RecentCouplesTicker: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % RECENT_TESTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = RECENT_TESTS[index];

  return (
    <div className="w-full border-t border-[#E7E2D9] bg-white/95 backdrop-blur-sm py-2.5 px-4 shadow-xs">
      <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-stone-500">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span className="font-semibold text-stone-800 flex-shrink-0">Live Activity:</span>
          <div className="truncate flex items-center gap-1.5 text-stone-700 animate-fadeIn" key={index}>
            <span className="font-bold text-stone-950">{current.p1} & {current.p2}</span>
            <span className="text-stone-500">in {current.city}</span>
            <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold border border-rose-200 text-[10px]">
              {current.score}%
            </span>
            <span className="text-stone-400 hidden sm:inline">• {current.status}</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-[11px] text-stone-500 flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Over 120,000 matches generated</span>
        </div>
      </div>
    </div>
  );
};
