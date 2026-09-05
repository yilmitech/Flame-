import { CompatibilityResult } from '../types';

// Deterministic 32-bit FNV-1a Hash
function hashString(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

// Seeded PRNG (Mulberry32)
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

export async function generateCompatibility(
  name1Raw: string,
  name2Raw: string,
  relationshipStatus: string = 'Dating'
): Promise<CompatibilityResult> {
  // Lazy-loaded so contentBank.ts (and its full text pool) only downloads
  // when someone actually generates a result, not on initial app load.
  const {
    ANXIETY_HOOKS,
    ARCHETYPES,
    ATTACHMENT_STYLES,
    COSMIC_ELEMENTS,
    FATAL_FLAWS,
    GOLDEN_RULES,
    GREEN_FLAGS_POOL,
    LOVE_LANGUAGES,
    RED_FLAGS_POOL,
    TEASERS,
    UNCOMFORTABLE_TRUTHS,
  } = await import('./contentBank');

  const clean1 = name1Raw.trim().replace(/^@/, '');
  const clean2 = name2Raw.trim().replace(/^@/, '');

  const norm1 = clean1.toLowerCase();
  const norm2 = clean2.toLowerCase();

  // Canonical key for pair consistency regardless of order
  const pairKey = [norm1, norm2].sort().join('___') + '___' + relationshipStatus.toLowerCase();
  const baseSeed = hashString(pairKey);
  const prng = createPRNG(baseSeed);

  // Score calibration: 58% - 97% for sweet spot viral tension
  const scoreBase = 58 + Math.floor(prng() * 40);
  const score = Math.min(98, Math.max(52, scoreBase));

  let tierTitle = "Soul Resonance Match";
  let tagline = "High emotional velocity with addictive magnetism";

  if (score >= 90) {
    tierTitle = "🔥 Cosmic Twin-Flame Alignment";
    tagline = "Extremely rare psychological and chemistry synchronicity";
  } else if (score >= 80) {
    tierTitle = "⚡ High Electric Magnetism";
    tagline = "Powerful attraction with explosive growth potential";
  } else if (score >= 70) {
    tierTitle = "🌊 Deep Slow-Burn Connection";
    tagline = "Built on mutual safety, subtle banter, and unspoken trust";
  } else if (score >= 60) {
    tierTitle = "🌪️ High Turbulence & Addictive Spark";
    tagline = "Addictive push-pull loop requiring active ego management";
  } else {
    tierTitle = "⚠️ Volatile Karmic Catalyst";
    tagline = "Intense lesson connection that challenges personal boundaries";
  }

  // Metrics (each slightly perturbed from base score)
  const emotional = Math.min(99, Math.max(45, Math.floor(score + (prng() * 16 - 8))));
  const intellectual = Math.min(99, Math.max(48, Math.floor(score + (prng() * 20 - 10))));
  const physical = Math.min(99, Math.max(55, Math.floor(score + (prng() * 18 - 6))));
  const conflictResolution = Math.min(95, Math.max(38, Math.floor(score - 10 + (prng() * 20 - 10))));
  const longTermVision = Math.min(98, Math.max(42, Math.floor(score + (prng() * 14 - 7))));

  // Pick deterministic items
  const teaserIdx = Math.floor(prng() * TEASERS.length);
  const anxietyIdx = Math.floor(prng() * ANXIETY_HOOKS.length);
  const archetypeRaw = ARCHETYPES[Math.floor(prng() * ARCHETYPES.length)];
  const attachmentRaw = ATTACHMENT_STYLES[Math.floor(prng() * ATTACHMENT_STYLES.length)];
  const loveLangRaw = LOVE_LANGUAGES[Math.floor(prng() * LOVE_LANGUAGES.length)];
  const fatalFlawRaw = FATAL_FLAWS[Math.floor(prng() * FATAL_FLAWS.length)];
  const truthRaw = UNCOMFORTABLE_TRUTHS[Math.floor(prng() * UNCOMFORTABLE_TRUTHS.length)];
  const ruleRaw = GOLDEN_RULES[Math.floor(prng() * GOLDEN_RULES.length)];
  const cosmicRaw = COSMIC_ELEMENTS[Math.floor(prng() * COSMIC_ELEMENTS.length)];

  // Shuffle & pick 3 red flags & 3 green flags
  const redFlagsShuffled = [...RED_FLAGS_POOL].sort(() => prng() - 0.5).slice(0, 3);
  const greenFlagsShuffled = [...GREEN_FLAGS_POOL].sort(() => prng() - 0.5).slice(0, 3);

  // Longevity forecasts
  const longevityScore = Math.min(97, Math.max(48, Math.floor((emotional + longTermVision + conflictResolution) / 3)));

  let threeMonth = "Intense honeymoon continuation with the first major boundary test emerging around week 8.";
  let oneYear = "High stability if communication during silent episodes is unlocked; 78% probability of deep co-habitation or public commitment.";
  let fiveYear = "Exceptional legacy potential. You either become an unstoppable power couple or a core formative life story.";

  if (longevityScore < 65) {
    threeMonth = "Vulnerable to sudden miscommunication or impulsive withdrawal unless pride is surrendered.";
    oneYear = "Requires intentional intervention on conflict styles to avoid transitioning into a repeating situationship cycle.";
    fiveYear = "Likely a transformative chapter that teaches both of you what you truly need in a lifelong partner.";
  }

  return {
    id: `flame_${baseSeed}`,
    name1: clean1,
    name2: clean2,
    relationshipStatus,
    score,
    tierTitle,
    tagline,
    freeTeaser: TEASERS[teaserIdx],
    anxietyHook: ANXIETY_HOOKS[anxietyIdx],
    archetype: {
      title: archetypeRaw.title,
      p1Role: `${clean1}: ${archetypeRaw.p1Role}`,
      p2Role: `${clean2}: ${archetypeRaw.p2Role}`,
      description: archetypeRaw.description,
    },
    metrics: {
      emotional,
      intellectual,
      physical,
      conflictResolution,
      longTermVision,
    },
    attachment: {
      p1Style: attachmentRaw.p1,
      p2Style: attachmentRaw.p2,
      dynamicName: attachmentRaw.name,
      dynamicDescription: attachmentRaw.desc,
    },
    loveLanguages: {
      p1Language: loveLangRaw.p1,
      p2Language: loveLangRaw.p2,
      verdict: loveLangRaw.verdict,
      explanation: loveLangRaw.explanation,
    },
    redFlags: redFlagsShuffled,
    greenFlags: greenFlagsShuffled,
    longevity: {
      score: longevityScore,
      threeMonth,
      oneYear,
      fiveYear,
    },
    fatalFlaw: fatalFlawRaw,
    uncomfortableTruth: truthRaw,
    goldenRule: ruleRaw,
    cosmicElement: cosmicRaw,
    createdAt: Date.now(),
  };
}

export function generateCompatibility(
  name1Raw: string,
  name2Raw: string,
  relationshipStatus: string = 'Dating'
): CompatibilityResult {
  const clean1 = name1Raw.trim().replace(/^@/, '');
  const clean2 = name2Raw.trim().replace(/^@/, '');

  const norm1 = clean1.toLowerCase();
  const norm2 = clean2.toLowerCase();

  // Canonical key for pair consistency regardless of order
  const pairKey = [norm1, norm2].sort().join('___') + '___' + relationshipStatus.toLowerCase();
  const baseSeed = hashString(pairKey);
  const prng = createPRNG(baseSeed);

  // Score calibration: 58% - 97% for sweet spot viral tension
  const scoreBase = 58 + Math.floor(prng() * 40);
  const score = Math.min(98, Math.max(52, scoreBase));

  let tierTitle = "Soul Resonance Match";
  let tagline = "High emotional velocity with addictive magnetism";

  if (score >= 90) {
    tierTitle = "🔥 Cosmic Twin-Flame Alignment";
    tagline = "Extremely rare psychological and chemistry synchronicity";
  } else if (score >= 80) {
    tierTitle = "⚡ High Electric Magnetism";
    tagline = "Powerful attraction with explosive growth potential";
  } else if (score >= 70) {
    tierTitle = "🌊 Deep Slow-Burn Connection";
    tagline = "Built on mutual safety, subtle banter, and unspoken trust";
  } else if (score >= 60) {
    tierTitle = "🌪️ High Turbulence & Addictive Spark";
    tagline = "Addictive push-pull loop requiring active ego management";
  } else {
    tierTitle = "⚠️ Volatile Karmic Catalyst";
    tagline = "Intense lesson connection that challenges personal boundaries";
  }

  // Metrics (each slightly perturbed from base score)
  const emotional = Math.min(99, Math.max(45, Math.floor(score + (prng() * 16 - 8))));
  const intellectual = Math.min(99, Math.max(48, Math.floor(score + (prng() * 20 - 10))));
  const physical = Math.min(99, Math.max(55, Math.floor(score + (prng() * 18 - 6))));
  const conflictResolution = Math.min(95, Math.max(38, Math.floor(score - 10 + (prng() * 20 - 10))));
  const longTermVision = Math.min(98, Math.max(42, Math.floor(score + (prng() * 14 - 7))));

  // Pick deterministic items
  const teaserIdx = Math.floor(prng() * TEASERS.length);
  const anxietyIdx = Math.floor(prng() * ANXIETY_HOOKS.length);
  const archetypeRaw = ARCHETYPES[Math.floor(prng() * ARCHETYPES.length)];
  const attachmentRaw = ATTACHMENT_STYLES[Math.floor(prng() * ATTACHMENT_STYLES.length)];
  const loveLangRaw = LOVE_LANGUAGES[Math.floor(prng() * LOVE_LANGUAGES.length)];
  const fatalFlawRaw = FATAL_FLAWS[Math.floor(prng() * FATAL_FLAWS.length)];
  const truthRaw = UNCOMFORTABLE_TRUTHS[Math.floor(prng() * UNCOMFORTABLE_TRUTHS.length)];
  const ruleRaw = GOLDEN_RULES[Math.floor(prng() * GOLDEN_RULES.length)];
  const cosmicRaw = COSMIC_ELEMENTS[Math.floor(prng() * COSMIC_ELEMENTS.length)];

  // Shuffle & pick 3 red flags & 3 green flags
  const redFlagsShuffled = [...RED_FLAGS_POOL].sort(() => prng() - 0.5).slice(0, 3);
  const greenFlagsShuffled = [...GREEN_FLAGS_POOL].sort(() => prng() - 0.5).slice(0, 3);

  // Longevity forecasts
  const longevityScore = Math.min(97, Math.max(48, Math.floor((emotional + longTermVision + conflictResolution) / 3)));
  
  let threeMonth = "Intense honeymoon continuation with the first major boundary test emerging around week 8.";
  let oneYear = "High stability if communication during silent episodes is unlocked; 78% probability of deep co-habitation or public commitment.";
  let fiveYear = "Exceptional legacy potential. You either become an unstoppable power couple or a core formative life story.";

  if (longevityScore < 65) {
    threeMonth = "Vulnerable to sudden miscommunication or impulsive withdrawal unless pride is surrendered.";
    oneYear = "Requires intentional intervention on conflict styles to avoid transitioning into a repeating situationship cycle.";
    fiveYear = "Likely a transformative chapter that teaches both of you what you truly need in a lifelong partner.";
  }

  return {
    id: `flame_${baseSeed}`,
    name1: clean1,
    name2: clean2,
    relationshipStatus,
    score,
    tierTitle,
    tagline,
    freeTeaser: TEASERS[teaserIdx],
    anxietyHook: ANXIETY_HOOKS[anxietyIdx],
    archetype: {
      title: archetypeRaw.title,
      p1Role: `${clean1}: ${archetypeRaw.p1Role}`,
      p2Role: `${clean2}: ${archetypeRaw.p2Role}`,
      description: archetypeRaw.description,
    },
    metrics: {
      emotional,
      intellectual,
      physical,
      conflictResolution,
      longTermVision,
    },
    attachment: {
      p1Style: attachmentRaw.p1,
      p2Style: attachmentRaw.p2,
      dynamicName: attachmentRaw.name,
      dynamicDescription: attachmentRaw.desc,
    },
    loveLanguages: {
      p1Language: loveLangRaw.p1,
      p2Language: loveLangRaw.p2,
      verdict: loveLangRaw.verdict,
      explanation: loveLangRaw.explanation,
    },
    redFlags: redFlagsShuffled,
    greenFlags: greenFlagsShuffled,
    longevity: {
      score: longevityScore,
      threeMonth,
      oneYear,
      fiveYear,
    },
    fatalFlaw: fatalFlawRaw,
    uncomfortableTruth: truthRaw,
    goldenRule: ruleRaw,
    cosmicElement: cosmicRaw,
    createdAt: Date.now(),
  };
}
