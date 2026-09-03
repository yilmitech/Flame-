export type TestType = 'flame' | 'fortune' | 'circle';

export type BirthMonth =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

export interface ChemistryMetrics {

  emotional: number;
  intellectual: number;
  physical: number;
  conflictResolution: number;
  longTermVision: number;
}

export interface AttachmentPair {
  p1Style: string;
  p2Style: string;
  dynamicName: string;
  dynamicDescription: string;
}

export interface LoveLanguageMatch {
  p1Language: string;
  p2Language: string;
  verdict: string;
  explanation: string;
}

export interface LongevityForecast {
  score: number;
  threeMonth: string;
  oneYear: string;
  fiveYear: string;
}

export interface CompatibilityResult {
  testType?: 'flame';
  id: string;
  name1: string;
  name2: string;
  relationshipStatus: string;
  score: number;
  tierTitle: string;
  tagline: string;
  freeTeaser: string;
  anxietyHook: string;
  archetype: {
    title: string;
    p1Role: string;
    p2Role: string;
    description: string;
  };
  metrics: ChemistryMetrics;
  attachment: AttachmentPair;
  loveLanguages: LoveLanguageMatch;
  redFlags: string[];
  greenFlags: string[];
  longevity: LongevityForecast;
  fatalFlaw: {
    title: string;
    trigger: string;
    breakdown: string;
  };
  uncomfortableTruth: string;
  goldenRule: string;
  cosmicElement: {
    element1: string;
    element2: string;
    synergy: string;
  };
  disclaimer?: string;
  createdAt: number;
}

// 1. Fortune Teller Result Types
export interface FortuneTellerResult {
  testType: 'fortune';
  id: string;
  fullName: string;
  age: number;
  birthMonth: string;
  zodiacElement: string;
  archetype: {
    title: string;
    essence: string;
    description: string;
  };
  freeTeaser: string;
  anxietyHook: string;
  // Paid ₦500 tier
  whatTomorrowHolds: string;
  coreStrength: {
    title: string;
    inDepth: string;
    manifestation: string;
    whenItShines: string;
  };
  nextThreeMonths: {
    phase: string;
    timelineFocus: string;
    keyOpportunities: string[];
    actionableGuidance: string;
  };
  holdingYouBack: {
    habitTrap: string;
    howItSabotages: string;
    mentalReframe: string;
  };
  hiddenAdvantage: {
    superpower: string;
    howToLeverage: string;
    competitiveEdge: string;
  };
  // Paid ₦1,000 tier (VIP)
  vipInsights: {
    oneYearOutlook: {
      milestone: string;
      forecast: string;
      strategicWarning: string;
    };
    fiveYearLegacy: {
      archetypeEvolution: string;
      legacyFocus: string;
      pinnacleAchievement: string;
    };
    goldenRule: {
      axiom: string;
      dailyPractice: string;
      closingAffirmation: string;
    };
  };
  disclaimer: string;
  createdAt: number;
  refreshIteration?: number;
}

// 2. Circle Check Result Types
export type CircleRelationshipType = 'Friend' | 'Sibling' | 'Parent' | 'Cousin' | 'Colleague' | 'Other';

export interface CircleCheckResult {
  testType: 'circle';
  id: string;
  yourName: string;
  theirName: string;
  relationshipType: CircleRelationshipType;
  score: number;
  tierTitle: string;
  tagline: string;
  freeTeaser: string;
  anxietyHook: string;
  platonicArchetype: {
    title: string;
    description: string;
    p1Vibe: string;
    p2Vibe: string;
  };
  // Paid ₦500 tier
  communicationStyle: {
    styleTitle: string;
    dynamicAnalysis: string;
    unspokenRule: string;
    blindSpot: string;
  };
  frictionPoint: {
    trigger: string;
    rootCause: string;
    howToResolve: string;
  };
  survivalForecast: {
    verdict: string;
    probability: number;
    analysis: string;
    bondSuperpower: string;
  };
  // Paid ₦1,000 tier (VIP)
  vipInsights: {
    oneYearTrajectory: {
      milestone: string;
      forecast: string;
      keyWarning: string;
    };
    fiveYearTrajectory: {
      bondEvolution: string;
      longTermForecast: string;
      legacyPillar: string;
    };
    kinshipGoldenRule: {
      rule: string;
      dailyCommitment: string;
      closingWisdom: string;
    };
  };
  disclaimer: string;
  createdAt: number;
}

export type AnyReadingResult = CompatibilityResult | FortuneTellerResult | CircleCheckResult;

export type ThemePreset =
  | 'midnight'
  | 'cyber'
  | 'luxury'
  | 'sunset'
  | 'emerald'
  | 'ocean'
  | 'crimson'
  | 'obsidian';
export type CardAspect = 'story' | 'square';

export interface PaystackConfig {
  publicKey: string;
  isSimulated: boolean;
}

