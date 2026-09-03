import { FortuneTellerResult } from '../types';

function hashString(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

function createPRNG(seed: number) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 1. STABLE TRAITS POOL (Consistent for same Name + Age + Month)
const FORTUNE_ARCHETYPES = [
  {
    title: 'The Silent Catalyst',
    essence: 'Quiet Strategic Magnetism',
    description:
      'You possess an unusual ability to anchor a room without raising your voice. People subconsciously bring their true intentions to you because your presence makes performative behavior feel unnecessary.',
  },
  {
    title: 'The Resilient Sovereign',
    essence: 'Self-Forged Authority & Dignity',
    description:
      'You were tested early and learned to build your own emotional sovereignty. You do not panic under pressure because you have already survived storms that would have dismantled softer foundations.',
  },
  {
    title: 'The Visionary Anchor',
    essence: 'Grounded Long-Term Foresight',
    description:
      'While others react to current noise, you instinctively plan 18 months ahead. Your intuition is not random guesswork; it is high-speed pattern recognition wrapped in patient self-trust.',
  },
  {
    title: 'The Alchemical Empath',
    essence: 'Emotional Intelligence with Teeth',
    description:
      'You read rooms in milliseconds, detecting micro-shifts in tone before words are spoken. Your superpower is warmth backed by ironclad boundaries when someone attempts to take advantage.',
  },
  {
    title: 'The Unflinching Innovator',
    essence: 'Relentless High-Velocity Execution',
    description:
      'You despise stagnation and artificial bureaucracy. When you commit your mind to an idea, your follow-through leaves spectators wondering where you found the quiet momentum.',
  },
  {
    title: 'The Harmonic Strategist',
    essence: 'Tactical Grace & Unshakable Poise',
    description:
      'You know how to win battles without creating unnecessary enemies. You negotiate with diplomacy, but you never confuse kindness with yielding on your non-negotiables.',
  },
];

const FREE_TEASERS = [
  '✨ Personal Spark: People remember the specific way you made them feel seen years after a 5-minute conversation with you.',
  '✨ Instinctive Shield: You have a radar for concealed motives that has silently saved you from at least three catastrophic traps.',
  '✨ Rare Magnetism: The dreams you keep quietest are the exact ones that will redefine your next life milestone.',
  '✨ Latent Velocity: You are standing in the final incubation phase of an ambition that others doubted you could pull off.',
  '✨ Quiet Distinction: Your biggest competitive advantage has always been your composure when everyone else is reacting impulsively.',
  '✨ Soul Integrity: You refuse to pretend to like things or people to fit in — and that quiet refusal is why high-value peers respect you.',
];

const CORE_STRENGTHS = [
  {
    title: 'Adaptive Composure Under Fire',
    explanation:
      'When chaos erupts, your nervous system does not crash; it narrows its focus onto the single highest-leverage solution. Where others exhaust energy complaining, you quietly rearrange reality.',
    manifestation: 'You become clearest when the stakes are highest.',
  },
  {
    title: 'Radical Discernment of Character',
    explanation:
      'You catch inconsistencies between people’s words and theirmicro-expressions instantly. You give grace easily, but you store behavioral receipts with photographic memory.',
    manifestation: 'You are almost impossible to manipulate twice.',
  },
  {
    title: 'Compound Willpower & Self-Sovereignty',
    explanation:
      'You do not rely on transient hype or external cheerleaders. Once you decide something belongs in your future, you execute behind closed doors until the outcome speaks for itself.',
    manifestation: 'Your quiet discipline consistently outperforms noisy talent.',
  },
  {
    title: 'Uncommon Emotional Generosity with Boundaries',
    explanation:
      'You give your energy deeply to those in your inner ring without sacrificing your own self-respect. You have mastered the rare art of saying no without guilt or explanation.',
    manifestation: 'Your loyalty is priceless because it cannot be bought or faked.',
  },
];

const THINGS_HOLDING_YOU_BACK = [
  {
    title: 'The "Must Do It All Alone" Reflex',
    subconsciousLoop:
      'Because you were let down in the past when relying on others, you default to bearing the entire weight solo. You mistake accepting help for forfeiting autonomy.',
    prescription:
      'Delegate the operational burdens so your mind can stay in high-leverage creative strategy. You do not need to suffer to prove your strength.',
  },
  {
    title: 'Hyper-Vigilance Disguised as Preparedness',
    subconsciousLoop:
      'You mentally rehearse worst-case scenarios to stay invincible. While this protects you, it also delays celebration and keeps your body in subtle emergency mode.',
    prescription:
      'Give yourself permission to exhale when a victory lands. Success is not a trap designed to test you; it is the compound interest of your labor.',
  },
  {
    title: 'Holding Grudges Against Your Past Self',
    subconsciousLoop:
      'You privately hold past naive decisions against yourself, demanding a level of wisdom back then that you only possess today because you survived it.',
    prescription:
      'Close the audit on your former self. You did not have today’s map when navigating yesterday’s fog.',
  },
];

const HIDDEN_ADVANTAGES = [
  {
    title: 'The Underestimation Dividend',
    superpower:
      'People routinely misjudge your depth because you do not broadcast your moves prematurely. By the time they realize your game, you have already secured the board.',
    howToLeverage: 'Let people keep talking. Continue executing in silence until the results are irreversible.',
  },
  {
    title: 'High-Fidelity Emotional Intuition',
    superpower:
      'Your gut instinct operates like a forensic sensor. Whenever you ignore your stomach feeling for logic, you pay for it; whenever you trust it, you are vindicated.',
    howToLeverage: 'Never explain away an intuitive red flag with intellectual excuses.',
  },
  {
    title: 'The Ability to Reset Overnight',
    superpower:
      'While others require months to grieve an ended chapter or failed project, you can internalize the lesson, dust off your knees, and pivot with pristine focus.',
    howToLeverage: 'Do not hesitate to cut losses on dead weight; your recovery speed is peerless.',
  },
];

// 2. DYNAMIC / FORWARD-LOOKING POOLS (Shift on refresh or time to feel alive like an active oracle)
const THREE_MONTH_PHASES = [
  {
    phase: 'The Uncluttering & Elevation Window',
    forecast:
      'Over the next 90 days, you will feel an irresistible urge to clear dead weight: stagnant conversations, unfinished projects, and people who only reach out when they need your energy. A financial or career clarity moment arrives between week 6 and 8.',
    unexpectedOpportunity: 'An unexpected connection from your past reaches out with a proposal that is far more lucrative than it looks on the surface.',
    shiftsLabel: 'Current Transit: Clarity & Reclaiming Boundaries',
  },
  {
    phase: 'The High-Leverage Visibility Surge',
    forecast:
      'Your quiet efforts from the last 6 months are about to step into public recognition. You will be invited into a room or conversation you thought was still a year away. Prepare your pitch and maintain high standards.',
    unexpectedOpportunity: 'A sudden opening created by someone else stepping down puts you in position to assume natural leadership.',
    shiftsLabel: 'Current Transit: Breakthrough & Recognition Wave',
  },
  {
    phase: 'The Deep Realignment & Financial Pivot',
    forecast:
      'The next 12 weeks bring an overdue breakthrough in how you generate and safeguard your resources. An old fear regarding stability dissolves as you implement a smarter system.',
    unexpectedOpportunity: 'A side conversation over coffee or message evolves into a viable income or collaboration channel.',
    shiftsLabel: 'Current Transit: Strategic Abundance & Resource Consolidation',
  },
  {
    phase: 'The Courageous Chapter Transition',
    forecast:
      'A situation that you have tolerated out of comfort will finally reach its expiration date. Letting it go will not leave a void — it will instantly open a corridor for the genuine partner or project you deserve.',
    unexpectedOpportunity: 'A sudden travel or relocation spark that reorganizes your outlook on what you want from the next 5 years.',
    shiftsLabel: 'Current Transit: Sovereign Transformation & Momentum',
  },
];

const ONE_YEAR_OUTLOOKS = [
  'Within 12 months, your day-to-day lifestyle will look markedly different. You will have transitioned away from reactive firefighting into high-autonomy decision making. You will be surrounded by a smaller, significantly more loyal circle that matches your integrity.',
  'Your 1-year trajectory indicates a major structural upgrade: either a career pivot that doubles your leverage or a personal creative milestone you have nurtured in secret. You will look back at this exact month as the turning point when you stopped apologizing for your ambitions.',
  'By this time next year, a chronic emotional or financial anxiety that has haunted the last two years will be completely neutralized. You will have built proof of your self-efficacy that nobody can talk you out of.',
];

const FIVE_YEAR_LEGACIES = [
  'Your 5-year arc is defined by sovereignty. You are not building for temporary validation; you are constructing generational stability and intellectual freedom. People will look to you as the anchor who changed the trajectory of your lineage.',
  'In five years, you will be operating in your zone of genius with zero tolerance for busywork. You will mentor others through the exact labyrinths that once felt impassable to you.',
  'Your long-term footprint is one of quiet impact and undeniable reputation. You will own your time, command respect across your domain, and inhabit a home environment filled with peace, beauty, and emotional security.',
];

const GOLDEN_RULES = [
  'Never shrink yourself in rooms where your light makes insecure people squint. Find bigger rooms.',
  'Protect your morning peace as fiercely as you protect your bank account. How you treat your first hour dictates how the world treats your day.',
  'Do not trade long-term respect for short-term peace. Speak the boundary early while it is small.',
  'Your value is not measured by how much exhaustion you can endure. Rest is a strategic weapon.',
];

const ZODIAC_ELEMENTS: Record<string, string> = {
  january: 'Earth & Obsidian Flame (Pragmatic Mastery)',
  february: 'Air & Electric Sapphire (Visionary Detachment)',
  march: 'Water & Mystic Pearl (Deep Empathic Intuition)',
  april: 'Fire & Radiant Gold (Unstoppable Pioneering)',
  may: 'Earth & Emerald Grove (Steadfast Abundance)',
  june: 'Air & Quickening Mercury (Quick-Silver Intellect)',
  july: 'Water & Silver Tide (Protective Emotional Core)',
  august: 'Fire & Solar Amber (Regal Creative Magnetism)',
  september: 'Earth & Polished Quartz (Analytical Purity)',
  october: 'Air & Rose Tourmaline (Harmonic Diplomacy)',
  november: 'Water & Deep Onyx (Transformative Depth)',
  december: 'Fire & Indigo Flare (Expansive Horizon Chaser)',
};

const WHAT_TOMORROW_HOLDS_POOL = [
  'A small win finds you before the day is done, arriving without any fanfare.',
  "Someone's words land differently than you expect today, softening an old assumption.",
  'A quiet sense of clarity will settle over something that felt scattered recently.',
  'Your patience will carry more weight than any quick reaction could today.',
  'A brief moment of stillness in the afternoon will restore more energy than you realize.',
  'You will notice a subtle shift in someone’s respect toward your quiet consistency.',
  'An unspoken worry from earlier this week begins to lose its grip as the day unfolds.',
  'A task you were dreading reveals itself to be far lighter once your hands touch it.',
  'Your instinct to pause before answering or committing will prove completely right.',
  'An unexpected flash of quiet gratitude will warm up an otherwise routine stretch of hours.',
  'You will feel an appetite for simplification—letting go of one small obligation makes room for peace.',
  'A gentle coincidence reminds you that you are much further along than you give yourself credit for.',
  'Your energy will be quietly magnetic today; people will look to your calm for reassurance.',
  'A subtle boundary you set effortlessly protects your evening peace and restores your focus.',
  'Something you planted weeks ago in quiet discipline will offer an encouraging nod.',
  'You will find yourself smiling at how little a past annoyance bothers you today.',
  'The right pace will feel unhurried; resisting the urge to rush protects your best thinking.',
  'A brief conversation leaves you feeling unexpectedly understood and lighter.',
  'A feeling of grounded confidence replaces the urge to over-explain yourself.',
  'You will see an everyday situation with fresh eyes, finding ease where there used to be friction.',
  'Your natural warmth disarms someone who entered the room guarded.',
  'A wave of quiet resolve will settle in, making your next step obvious and clean.',
  'A small moment of creative flow will remind you what you genuinely enjoy about your craft.',
  'You will find immense relief in letting today be enough, resting with an easy conscience.',
  'A pleasant rhythm takes over by midday, making ordinary tasks feel strangely satisfying.',
  'Someone nearby will draw strength from your composure without ever saying it aloud.',
];

export function generateFortuneTellerReading(
  fullNameRaw: string,
  ageRaw: number | string,
  birthMonthRaw: string,
  refreshIteration = 0
): FortuneTellerResult {
  const cleanName = fullNameRaw.trim().replace(/^@/, '');
  const age = Math.max(12, Math.min(110, Number(ageRaw) || 25));
  const cleanMonth = (birthMonthRaw || 'January').trim();
  const monthKey = cleanMonth.toLowerCase();

  // STABLE SEED: tied exclusively to Identity (Name + Age + Month)
  const stableKey = `${cleanName.toLowerCase()}___${age}___${monthKey}`;
  const stableSeed = hashString(stableKey);
  const stablePrng = createPRNG(stableSeed);

  // Pick stable traits
  const archIndex = Math.floor(stablePrng() * FORTUNE_ARCHETYPES.length);
  const archetype = FORTUNE_ARCHETYPES[archIndex];

  const teaserIndex = Math.floor(stablePrng() * FREE_TEASERS.length);
  const freeTeaser = FREE_TEASERS[teaserIndex];

  const strengthIndex = Math.floor(stablePrng() * CORE_STRENGTHS.length);
  const coreStrength = CORE_STRENGTHS[strengthIndex];

  const blockIndex = Math.floor(stablePrng() * THINGS_HOLDING_YOU_BACK.length);
  const thingHoldingYouBack = THINGS_HOLDING_YOU_BACK[blockIndex];

  const advIndex = Math.floor(stablePrng() * HIDDEN_ADVANTAGES.length);
  const hiddenAdvantage = HIDDEN_ADVANTAGES[advIndex];

  const zodiacElement = ZODIAC_ELEMENTS[monthKey] || 'Solar Quartz & Astral Current';

  // 1. "WHAT TOMORROW HOLDS FOR YOU" DAILY SEED:
  // Seeded strictly by name + age + birth month + today's date so it refreshes each day even with same inputs
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const tomorrowKey = `${cleanName.toLowerCase()}___${age}___${monthKey}___${dateStr}`;
  const tomorrowSeed = hashString(tomorrowKey);
  const tomorrowPrng = createPRNG(tomorrowSeed);
  const tomorrowIndex = Math.floor(tomorrowPrng() * WHAT_TOMORROW_HOLDS_POOL.length);
  const whatTomorrowHolds = WHAT_TOMORROW_HOLDS_POOL[tomorrowIndex];

  // 2. FORWARD-LOOKING MONTHLY SEED:
  // Stays stable across reruns within the same calendar month
  const monthTransitKey = `${stableKey}___m_${now.getFullYear()}_${now.getMonth() + 1}`;
  const monthTransitSeed = hashString(monthTransitKey);
  const monthTransitPrng = createPRNG(monthTransitSeed);

  const phaseIndex = Math.floor(monthTransitPrng() * THREE_MONTH_PHASES.length);
  const whatsComingNext3Months = THREE_MONTH_PHASES[phaseIndex];

  const oneYearIndex = Math.floor(monthTransitPrng() * ONE_YEAR_OUTLOOKS.length);
  const oneYearOutlook = ONE_YEAR_OUTLOOKS[oneYearIndex];

  const fiveYearIndex = Math.floor(monthTransitPrng() * FIVE_YEAR_LEGACIES.length);
  const fiveYearLegacy = FIVE_YEAR_LEGACIES[fiveYearIndex];

  const ruleIndex = Math.floor(monthTransitPrng() * GOLDEN_RULES.length);
  const goldenRule = GOLDEN_RULES[ruleIndex];

  const anxietyHooks = [
    `The #1 blind spot quietly draining your energy at age ${age}`,
    `Unlock the unexpected breakthrough lining up in your next 90 days`,
    `The hidden personality trait that makes high-value peers gravitate to you`,
    `See your 1-year and 5-year trajectory before making your next big move`,
  ];
  const anxietyHook = anxietyHooks[Math.floor(stablePrng() * anxietyHooks.length)];

  return {
    testType: 'fortune',
    id: `fortune_${stableSeed.toString(36)}_${refreshIteration}`,
    fullName: cleanName,
    age,
    birthMonth: cleanMonth,
    zodiacElement,
    archetype,
    freeTeaser,
    anxietyHook,
    whatTomorrowHolds,
    coreStrength: {
      title: coreStrength.title,
      inDepth: coreStrength.explanation,
      manifestation: coreStrength.manifestation,
      whenItShines: 'During high-stakes moments when others freeze or second-guess themselves.',
    },
    nextThreeMonths: {
      phase: whatsComingNext3Months.phase,
      timelineFocus: whatsComingNext3Months.forecast,
      keyOpportunities: [
        whatsComingNext3Months.unexpectedOpportunity,
        'A key boundary shift that preserves your creative focus and daily peace.',
        'A strategic alliance offering high-trust support without transactional friction.',
      ],
      actionableGuidance: whatsComingNext3Months.shiftsLabel,
    },
    holdingYouBack: {
      habitTrap: thingHoldingYouBack.title,
      howItSabotages: thingHoldingYouBack.subconsciousLoop,
      mentalReframe: thingHoldingYouBack.prescription,
    },
    hiddenAdvantage: {
      superpower: hiddenAdvantage.superpower,
      howToLeverage: hiddenAdvantage.howToLeverage,
      competitiveEdge: `${hiddenAdvantage.title} — Natural poise that cannot be bought or faked.`,
    },
    vipInsights: {
      oneYearOutlook: {
        milestone: 'Strategic Sovereignty & Elevation',
        forecast: oneYearOutlook,
        strategicWarning: 'Do not dilute your new standards for people who only appreciated you when you were convenient.',
      },
      fiveYearLegacy: {
        archetypeEvolution: 'Pillar of Undeniable Authority',
        legacyFocus: fiveYearLegacy,
        pinnacleAchievement: 'Generational stability and high-autonomy creative mastery.',
      },
      goldenRule: {
        axiom: goldenRule,
        dailyPractice: 'Evaluate decisions by what they will cost your future self, not just what they satisfy today.',
        closingAffirmation: 'Your quiet trajectory is valid. Walk steadily; the compounding returns have already started.',
      },
    },
    disclaimer: 'For reflection and encouragement — not a literal prediction.',
    createdAt: Date.now(),
    refreshIteration,
  };
}

export const generateFortuneTeller = generateFortuneTellerReading;


