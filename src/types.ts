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
  createdAt: number;
}

export type ThemePreset = 'midnight' | 'cyber' | 'luxury' | 'sunset';
export type CardAspect = 'story' | 'square';

export interface PaystackConfig {
  publicKey: string;
  isSimulated: boolean;
}
