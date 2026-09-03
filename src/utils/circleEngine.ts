import { CircleCheckResult, CircleRelationshipType } from '../types';

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

const PLATONIC_ARCHETYPES = [
  {
    title: 'Built to Last',
    description:
      'The friendship that survives geographical distance, months of silence, and major life pivots without missing a single beat. When you reunite, it feels like zero seconds passed.',
    p1Vibe: 'The Unshakable Foundation',
    p2Vibe: 'The Loyal Mirror',
  },
  {
    title: 'Growth Partners',
    description:
      'You push each other out of complacency. Neither of you tolerates excuses, and your conversations immediately skip superficial small talk into goals, philosophies, and constructive critique.',
    p1Vibe: 'The High-Performance Catalyst',
    p2Vibe: 'The Strategic Sounding Board',
  },
  {
    title: 'Loyal but Loud',
    description:
      'You argue like siblings in private, roast each other with zero filters, but the moment an outsider attacks either of you, you form an impenetrable fortress together.',
    p1Vibe: 'The Passionate Protector',
    p2Vibe: 'The Unfiltered Defender',
  },
  {
    title: 'The Steady One & The Storm',
    description:
      'One brings grounded, calm perspective when life feels overwhelming; the other brings infectious spontaneity, ambition, and excitement. A beautifully balanced yin and yang.',
    p1Vibe: 'The Calming Anchor',
    p2Vibe: 'The Adventurous Catalyst',
  },
  {
    title: 'The Rivalry & Kinship',
    description:
      'You genuinely want each other to succeed, but there is an unspoken competitive undercurrent that drives both of you to level up your work, aesthetics, and milestones.',
    p1Vibe: 'The Quiet Benchmark',
    p2Vibe: 'The Tenacious Challenger',
  },
  {
    title: 'Slow Fade Hazard',
    description:
      'The bond is rich in nostalgic history, but your current life paces and priorities are beginning to diverge. Unless someone intentionally bridges the gap, daily momentum threatens to dilute the connection.',
    p1Vibe: 'The Memory Keeper',
    p2Vibe: 'The Rapid Evolver',
  },
];

const PLATONIC_TEASERS = [
  '⚡ Unspoken Dynamic: One of you handles distress by sending 14 rapid messages, while the other puts their phone on "Do Not Disturb" for 18 hours.',
  '🛡️ Hidden Superpower: You can communicate an entire paragraph of critique across a crowded room with just a single eyebrow raise.',
  '👀 Circle Observation: Both of you privately assume the other is busier and happier than they actually are, delaying casual catch-ups.',
  '🤝 Bond Reality: You don’t need constant proximity, but when real crisis strikes, this is the first number either of you dials.',
  '⚖️ Delicate Tension: One of you secretly feels they initiate 70% of the check-ins, while the other shows love through acts of service instead of texting.',
  '🔥 Iron Law: As long as you never compete over the same spotlight or resources, this alliance is practically unbreakable.',
];

const COMMUNICATION_STYLES = [
  {
    title: 'Asynchronous Iron Clad',
    dynamic: 'High-Trust Asymmetry',
    unspokenRule: 'No guilt trips for replying 3 days later. When the response arrives, it is a 2-page voice note filled with genuine substance.',
    blindSpot: 'Assuming emotional closeness is permanent without maintaining regular micro-check-ins during stressful seasons.',
  },
  {
    title: 'Direct & Unfiltered Transparency',
    dynamic: 'Immediate Verbal Decompression',
    unspokenRule: 'Speak the annoyance before it turns into passive aggression. If something feels off, address it immediately over food or phone.',
    blindSpot: 'Accidentally using blunt sarcasm when the other is already running on low emotional battery.',
  },
  {
    title: 'Supportive Harmony & Gentle Tact',
    dynamic: 'Protective Diplomacy',
    unspokenRule: 'Prioritize preserving each other’s peace of mind above being technically "right" in casual disagreements.',
    blindSpot: 'Swallowing minor grievances until a trivial scheduling misunderstanding causes an unexpected outburst.',
  },
];

const FRICTION_POINTS = [
  {
    title: 'Unexpressed Expectations & The Initiation Asymmetry',
    trigger: 'One person waiting for the other to reach out first as a subconscious test of priority.',
    breakdown: 'When one partner feels like the sole driver of meetups or calls, resentment quietly archives in the background.',
    howToResolve: 'Normalize effortless "thinking of you" pings with zero pressure to immediately schedule a 2-hour call.',
  },
  {
    title: 'Life Phase Speed Mismatches',
    trigger: 'One hitting major career or romantic milestones while the other is navigating transition.',
    breakdown: 'Unconscious defensiveness or fear of being left behind can disguise itself as critical feedback or withdrawal.',
    howToResolve: 'Explicitly celebrate each other’s wins without treating someone’s milestone as a commentary on your own timeline.',
  },
  {
    title: 'Conflicting Boundaries Around Energy',
    trigger: 'One needing solitary downtime while the other wants immediate social venting.',
    breakdown: 'Misinterpreting healthy self-care as personal rejection or emotional cooling.',
    howToResolve: 'Establish safe shorthand phrases: "I love you, I am on 5% battery, let’s unpack this on Thursday."',
  },
];

const SURVIVAL_FORECASTS = [
  {
    verdict: 'Lifelong Pillars' as const,
    probability: 94,
    forecastText:
      'You are genetically or emotionally hardwired to outlast temporal trends. Even if careers, geography, or family duties create physical distance, your foundational trust makes this bond a permanent fixture in both your biographies.',
  },
  {
    verdict: 'Built Together' as const,
    probability: 88,
    forecastText:
      'High collaboration potential. You do your best work and have your sharpest insights when bouncing ideas off one another. Joint ventures, family initiatives, and mutual projects will deepen rather than strain your affinity.',
  },
  {
    verdict: 'Periodic Orbit' as const,
    probability: 76,
    forecastText:
      'A seasonal sanctuary connection. You are not meant to speak every single day, but during life transitions you serve as an invaluable objective compass for one another. Quality far outweighs frequency here.',
  },
  {
    verdict: 'Drift Apart Risk' as const,
    probability: 63,
    forecastText:
      'Vulnerable to silent drift. If your interactions remain tethered only to past memories without creating shared current rituals, this bond risks turning into polite social media likes over the next 24 months.',
  },
];

const ONE_YEAR_TRAJECTORIES = [
  'Over the next 12 months, a shared external challenge (family negotiation, career relocation, or mutual project) will force you into closer tactical coordination, permanently elevating your level of respect for each other’s competence.',
  'Within 1 year, you will prune secondary superficial acquaintances and realize that this connection is one of the top 3 people who genuinely understand your baseline values without needing context.',
  'The coming year requires one intentional honest conversation regarding boundaries or shared plans. Once cleared, the air will be significantly lighter, solidifying an effortless rhythm.',
];

const FIVE_YEAR_TRAJECTORIES = [
  'In 5 years, you will celebrate a major life milestone together (a wedding, major venture, or home) looking back with gratitude that you navigated the earlier rocky seasons without burning bridges.',
  'Your 5-year outlook positions you as co-anchors of your wider social or family circle. Younger peers and relatives will look to your camaraderie as the standard for mutual loyalty.',
  'Looking ahead half a decade, this connection will have evolved into an unquestioned sanctuary: someone who knows your history, pardons your quirks, and gives you raw, honest counsel without an agenda.',
];

const BOND_SUPERPOWERS = [
  'Uncompromising Psychological Safety: You can voice your most irrational fears without fear of judgment.',
  'High-Velocity Humor: Shared comedic vocabulary that can defuse immense tension in under 30 seconds.',
  'Unspoken Operational Support: Showing up with practical solutions when life breaks down rather than hollow platitudes.',
  'Zero-Pretense Authenticity: The rare ability to sit in comfortable silence together without feeling awkward.',
];

const PLATONIC_GOLDEN_RULES = [
  'Never let third parties interpret each other’s words for you. Direct communication is your only currency.',
  'Praise each other loudly in public; correct each other gently in absolute private.',
  'Do not keep score of who called whom last. Generosity without bookkeeping preserves genuine kinship.',
  'Allow each other the grace to change your minds and grow without accusing the other of becoming different.',
];

export function generateCircleCheck(
  yourNameRaw: string,
  theirNameRaw: string,
  relationshipType: CircleRelationshipType = 'Friend'
): CircleCheckResult {
  const clean1 = yourNameRaw.trim().replace(/^@/, '');
  const clean2 = theirNameRaw.trim().replace(/^@/, '');

  const norm1 = clean1.toLowerCase();
  const norm2 = clean2.toLowerCase();

  // Canonical key to ensure same results regardless of who typed their name first
  const pairKey = [norm1, norm2].sort().join('___') + '___circle___' + relationshipType.toLowerCase();
  const seed = hashString(pairKey);
  const prng = createPRNG(seed);

  // Calibration: 64% - 98%
  const scoreBase = 64 + Math.floor(prng() * 34);
  const score = Math.min(99, Math.max(62, scoreBase));

  const archIndex = Math.floor(prng() * PLATONIC_ARCHETYPES.length);
  const platonicArchetype = PLATONIC_ARCHETYPES[archIndex];

  const teaserIndex = Math.floor(prng() * PLATONIC_TEASERS.length);
  const freeTeaser = PLATONIC_TEASERS[teaserIndex];

  const commIndex = Math.floor(prng() * COMMUNICATION_STYLES.length);
  const communicationStyle = COMMUNICATION_STYLES[commIndex];

  const frictionIndex = Math.floor(prng() * FRICTION_POINTS.length);
  const frictionPoint = FRICTION_POINTS[frictionIndex];

  const survIndex = Math.floor(prng() * SURVIVAL_FORECASTS.length);
  const survivalForecast = SURVIVAL_FORECASTS[survIndex];

  const oneYearIndex = Math.floor(prng() * ONE_YEAR_TRAJECTORIES.length);
  const oneYearTrajectory = ONE_YEAR_TRAJECTORIES[oneYearIndex];

  const fiveYearIndex = Math.floor(prng() * FIVE_YEAR_TRAJECTORIES.length);
  const fiveYearTrajectory = FIVE_YEAR_TRAJECTORIES[fiveYearIndex];

  const superIndex = Math.floor(prng() * BOND_SUPERPOWERS.length);
  const bondSuperpower = BOND_SUPERPOWERS[superIndex];

  const ruleIndex = Math.floor(prng() * PLATONIC_GOLDEN_RULES.length);
  const goldenRule = PLATONIC_GOLDEN_RULES[ruleIndex];

  const tierTitles: Record<CircleRelationshipType, string> = {
    Friend: 'Unshakable Alliance Dynamic',
    Sibling: 'Bloodline Resonance & Genetic Mirror',
    Parent: 'Intergenerational Anchor & Bridge',
    Cousin: 'Kinship Chemistry & Shared Roots',
    Colleague: 'Strategic Synergist & Force Multiplier',
    Other: 'Soul Tribe Resonance',
  };

  const anxietyHooks = [
    `The #1 unspoken friction point between you and ${clean2}`,
    `Will your bond stay close or drift into annual catch-ups?`,
    `The communication blind spot one of you is privately ignoring`,
    `Discover the true survival trajectory of this ${relationshipType.toLowerCase()} bond`,
  ];
  const anxietyHook = anxietyHooks[Math.floor(prng() * anxietyHooks.length)];

  return {
    testType: 'circle',
    id: `circle_${seed.toString(36)}`,
    yourName: clean1,
    theirName: clean2,
    relationshipType,
    score,
    tierTitle: tierTitles[relationshipType] || 'Unshakable Kinship Resonance',
    tagline: `Platonic & Family Forensic Analysis for ${clean1} and ${clean2}`,
    freeTeaser,
    anxietyHook,
    platonicArchetype,
    communicationStyle: {
      styleTitle: communicationStyle.title,
      dynamicAnalysis: communicationStyle.dynamic,
      unspokenRule: communicationStyle.unspokenRule,
      blindSpot: communicationStyle.blindSpot,
    },
    frictionPoint: {
      trigger: frictionPoint.trigger,
      rootCause: frictionPoint.breakdown,
      howToResolve: frictionPoint.howToResolve,
    },
    survivalForecast: {
      verdict: survivalForecast.verdict,
      probability: survivalForecast.probability,
      analysis: survivalForecast.forecastText,
      bondSuperpower,
    },
    vipInsights: {
      oneYearTrajectory: {
        milestone: 'Deepened Mutual Grounding',
        forecast: oneYearTrajectory,
        keyWarning: 'Watch out for assuming the other person knows how much you care without saying it explicitly.',
      },
      fiveYearTrajectory: {
        bondEvolution: 'Lifelong Anchor Alliance',
        longTermForecast: fiveYearTrajectory,
        legacyPillar: 'A shared history that becomes a source of wisdom and safety for decades.',
      },
      kinshipGoldenRule: {
        rule: goldenRule,
        dailyCommitment: 'Give grace for busy seasons, but never let silence turn into indifference.',
        closingWisdom: 'Real connections do not demand daily presence; they demand unconditional loyalty when it matters.',
      },
    },
    disclaimer: 'A fun reflection on your bond — not a real prediction about your relationship.',
    createdAt: Date.now(),
  };
}

export const generateCircleCheckReading = generateCircleCheck;



