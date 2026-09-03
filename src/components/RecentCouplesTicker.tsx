import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface LiveActivityItem {
  p1: string;
  p2: string;
  score: number;
  location: string;
  status: string;
}

const RECENT_TESTS: LiveActivityItem[] = [
  { p1: 'Mateo', p2: 'Sofia', score: 94, location: 'Madrid, Spain', status: 'Unlocked VIP Dossier' },
  { p1: 'Haruto', p2: 'Yui', score: 91, location: 'Tokyo, Japan', status: 'Twin Flame Match' },
  { p1: 'Liam', p2: 'Emma', score: 88, location: 'Toronto, Canada', status: 'Shared Story Card' },
  { p1: 'Chinedu', p2: 'Blessing', score: 93, location: 'Lagos, Nigeria', status: 'Unlocked ₦1,000 VIP' },
  { p1: 'Lucas', p2: 'Isabella', score: 89, location: 'São Paulo, Brazil', status: 'Unlocked Full Report' },
  { p1: 'Aarav', p2: 'Ananya', score: 96, location: 'Mumbai, India', status: 'Twin Flame Match' },
  { p1: 'Noah', p2: 'Chloe', score: 87, location: 'Sydney, Australia', status: 'Shared on Instagram' },
  { p1: 'Arthur', p2: 'Camille', score: 92, location: 'Paris, France', status: 'Unlocked VIP Dossier' },
  { p1: 'Min-ho', p2: 'Ji-eun', score: 95, location: 'Seoul, South Korea', status: 'Twin Flame Match' },
  { p1: 'Ethan', p2: 'Olivia', score: 90, location: 'New York, USA', status: 'Shared Story Card' },
  { p1: 'Alexander', p2: 'Elena', score: 86, location: 'Berlin, Germany', status: 'Unlocked Full Report' },
  { p1: 'Wanjiku', p2: 'Brian', score: 94, location: 'Nairobi, Kenya', status: 'Unlocked ₦1,000 VIP' },
  { p1: 'Fatima', p2: 'Tariq', score: 93, location: 'Dubai, UAE', status: 'Twin Flame Match' },
  { p1: 'Oliver', p2: 'Charlotte', score: 89, location: 'London, UK', status: 'Unlocked Full Report' },
  { p1: 'Santiago', p2: 'Valentina', score: 91, location: 'Buenos Aires, Argentina', status: 'Shared on WhatsApp' },
  { p1: 'Kofi', p2: 'Akua', score: 95, location: 'Accra, Ghana', status: 'Twin Flame Match' },
  { p1: 'Kenji', p2: 'Mei', score: 92, location: 'Singapore', status: 'Unlocked VIP Dossier' },
  { p1: 'Thabo', p2: 'Zola', score: 88, location: 'Johannesburg, South Africa', status: 'Unlocked Full Report' },
  { p1: 'Magnus', p2: 'Freja', score: 87, location: 'Stockholm, Sweden', status: 'Shared Story Card' },
  { p1: 'Diego', p2: 'Ximena', score: 93, location: 'Mexico City, Mexico', status: 'Unlocked VIP Dossier' },
  { p1: 'Leonardo', p2: 'Chiara', score: 94, location: 'Milan, Italy', status: 'Unlocked Full Report' },
  { p1: 'Caelan', p2: 'Aoife', score: 89, location: 'Dublin, Ireland', status: 'Shared Story Card' },
  { p1: 'Budi', p2: 'Siti', score: 91, location: 'Jakarta, Indonesia', status: 'Unlocked ₦1,000 VIP' },
  { p1: 'Daan', p2: 'Sanne', score: 90, location: 'Amsterdam, Netherlands', status: 'Twin Flame Match' },
];

export const RecentCouplesTicker: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % RECENT_TESTS.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const current = RECENT_TESTS[index];

  return (
    <div className="w-full border-t border-[#E7E2D9] bg-white/95 backdrop-blur-sm py-2.5 px-4 shadow-xs">
      <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-stone-500">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600" />
          </span>
          <span className="font-semibold text-stone-800 flex-shrink-0">Live Activity:</span>
          <div className="truncate flex items-center gap-1.5 text-stone-700 animate-fadeIn" key={index}>
            <span className="font-bold text-stone-950">{current.p1} & {current.p2}</span>
            <span className="text-stone-500 font-medium">in {current.location}</span>
            <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold border border-rose-200 text-[10px]">
              {current.score}%
            </span>
            <span className="text-stone-400 hidden sm:inline">• {current.status}</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-[11px] text-stone-500 flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Over 120,000 matches generated worldwide</span>
        </div>
      </div>
    </div>
  );
};
