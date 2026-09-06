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

// FIX: ZODIAC_ELEMENTS was referenced in generateFortuneTellerReading() but never
// defined or imported anywhere in this file, so every reading either threw a
// ReferenceError or (if wrapped in a try/catch upstream) silently fell back to
// the same 'Solar Quartz & Astral Current' string for every single user.
// If you already have a real zodiac/element mapping elsewhere in the codebase,
// delete this block and import it instead — this is a placeholder so the
// feature actually varies by birth month in the meantime.
const ZODIAC_ELEMENTS: Record<string, string> = {
  january: 'Earth Current & Garnet Resolve',
  february: 'Air Current & Amethyst Vision',
  march: 'Water Current & Aquamarine Flow',
  april: 'Fire Current & Diamond Drive',
  may: 'Earth Current & Emerald Steadiness',
  june: 'Air Current & Pearl Duality',
  july: 'Water Current & Ruby Depth',
  august: 'Fire Current & Peridot Radiance',
  september: 'Earth Current & Sapphire Precision',
  october: 'Air Current & Opal Balance',
  november: 'Water Current & Topaz Intensity',
  december: 'Fire Current & Turquoise Expansion',
};

// 1. STABLE TRAITS POOL (Consistent for same Name + Age + Month)
// NOTE: every pool below previously had its first several entries pasted a
// second time later in the array. That gave those entries roughly 2x the
// selection probability of everything else, which is why the same handful
// of archetypes/teasers/strengths kept showing up. All duplicate blocks have
// been removed so every entry in every pool has equal odds.
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
  { title: "The Patient Cartographer", essence: "Methodical Mapping of Opportunity", description: "You chart unfamiliar territory slowly and thoroughly rather than rushing blind. Others get lost chasing shortcuts while you quietly hold the only accurate map." },
  { title: "The Ember Keeper", essence: "Sustained Passion Without Burnout", description: "You have learned to tend your ambition like a fire that must last years, not minutes. Where others flare and fade, your steady heat outlasts every sprinter." },
  { title: "The Threshold Guardian", essence: "Discernment at the Point of Entry", description: "You decide who and what gets access to your time long before it becomes a problem. This early filtering saves you from most of the chaos others accept by default." },
  { title: "The Quiet Cartel", essence: "Understated Collective Influence", description: "You build informal networks of trust that operate without titles or announcements. Your influence moves through relationships, not hierarchies." },
  { title: "The Reluctant Prophet", essence: "Uncomfortable Accuracy of Foresight", description: "You often see outcomes coming before anyone wants to hear it. You have learned to speak the truth anyway, even when it costs you short-term comfort." },
  { title: "The Velvet Enforcer", essence: "Gentle Delivery, Immovable Standards", description: "Your tone stays soft even when your boundary is absolute. People underestimate your firmness because you never have to raise your voice to enforce it." },
  { title: "The Salvage Expert", essence: "Extraction of Value from Wreckage", description: "You have a rare gift for finding what's worth saving in situations everyone else has written off. Your resourcefulness turns discarded opportunities into assets." },
  { title: "The Silent Ledger", essence: "Exact Internal Accounting of Trust", description: "You keep precise, unspoken track of who has earned your confidence and who hasn't. This internal record protects you from repeating costly misjudgments." },
  { title: "The Undeterred Cultivator", essence: "Long-Season Patience with Growth", description: "You plant things — ideas, relationships, skills — that take years to bear fruit, and you tend them without needing an audience to witness the process." },
  { title: "The Calibrated Risk-Taker", essence: "Bold Moves Backed by Quiet Preparation", description: "What looks like fearless spontaneity to others is actually the result of preparation nobody saw. You leap only after quietly building the net." },
  { title: 'The Unseen Architect', essence: 'Structural Genius & Quiet Systemic Impact', description: 'You design systems, boundaries, and habits that endure long after initial enthusiasm fades. Your legacy is built on quiet foundations that withstand volatile conditions.' },
  { title: 'The Obsidian Sentinel', essence: 'Uncompromising Loyalty & Shielded Power', description: 'You protect your inner circle with formidable fierceness. You hold a calm, formidable center that deters disingenuous actors before they can take root.' },
  { title: 'The Quantum Pragmatist', essence: 'Rooted Idealism & Operational Precision', description: 'You bridge high-minded visions with practical execution. You do not waste time on idealism without blueprints; you make abstract dreams tangibly real.' },
  { title: 'The Luminous Renegade', essence: 'Quiet Non-Conformity & Authentic Pathfinding', description: 'You refuse to follow inherited scripts simply because they are familiar. You blaze distinct trails with steady dignity rather than performative rebellion.' },
  { title: 'The Sovereign Mediator', essence: 'Equanimous Judgment & Deep Perspective', description: 'You bring clarity to complex conflicts by seeing past emotional distortion. People rely on your objective judgment when narrative noise overwhelms logic.' },
  { title: 'The Temporal Strategist', essence: 'Mastery of Timing & Intentional Delay', description: 'You understand that timing is power. You know precisely when to strike, when to wait, and when letting an opponent overextend is the ultimate victory.' },
  { title: 'The Deep Water Navigator', essence: 'Unfathomable Emotional Resilience', description: 'You traverse deep emotional terrain without drowning. You transform grief, disappointment, and quiet setbacks into profound wisdom and renewed purpose.' },
  { title: 'The High-Frequency Vanguard', essence: 'Incisive Focus & Trend Perception', description: 'You sense cultural, economic, and social shifts before they manifest in headlines. Your agility allows you to position yourself ahead of the curve.' },
  { title: 'The Citadel Mindset', essence: 'Self-Sustaining Inner Sanctuary', description: 'Your internal peace does not depend on external validation. You carry your fortress within you, remaining calm through external noise.' },
  { title: 'The Iron Diplomat', essence: 'Velvet Softness over Steel conviction', description: 'Your manners are impeccable, but your standards are uncompromising. You command respect through quiet politeness combined with firm boundaries.' },
  { title: 'The Perpetual Alchemist', essence: 'Transmutation of Scarcity into Abundance', description: 'You excel at taking limited resources and compounding them into significant assets. You see opportunity where others see structural deficits.' },
  { title: 'The Stoic Beacon', essence: 'Unshakeable Stability in Volatile Environments', description: 'When market or situational turbulence shakes those around you, your composure becomes the reference point others rely on to recalibrate.' },
  { title: 'The Silent Originator', essence: 'Generative Creativity Without Ego', description: 'You care more about the impact of your work than who gets immediate praise. This lack of ego allows you to create work of lasting significance.' },
  { title: 'The Horizon Voyager', essence: 'Relentless Quest for Personal Sovereignty', description: 'You are fundamentally motivated by freedom. Every strategic decision you make is designed to expand your personal agency and self-determination.' }
];

const FREE_TEASERS = [
  '✨ Personal Spark: People remember the specific way you made them feel seen years after a 5-minute conversation with you.',
  '✨ Instinctive Shield: You have a radar for concealed motives that has silently saved you from at least three catastrophic traps.',
  '✨ Rare Magnetism: The dreams you keep quietest are the exact ones that will redefine your next life milestone.',
  '✨ Latent Velocity: You are standing in the final incubation phase of an ambition that others doubted you could pull off.',
  '✨ Quiet Distinction: Your biggest competitive advantage has always been your composure when everyone else is reacting impulsively.',
  '✨ Soul Integrity: You refuse to pretend to like things or people to fit in — and that quiet refusal is why high-value peers respect you.',
  "✨ Silent Ledger: You remember exactly who showed up for you and who didn't, even if you've never once brought it up.",
  "✨ Patient Root: A skill you've been quietly building for over a year is about to become visibly undeniable to others.",
  "✨ Calibrated Instinct: The hesitation you felt about a recent decision was your intuition doing its job, not weakness.",
  "✨ Threshold Discipline: The boundary you set without explanation months ago is the exact reason your peace has held steady since.",
  "✨ Undersold Talent: You are better at something than you currently give yourself credit for, and it's about to be tested publicly.",
  "✨ Quiet Cartography: You already know the way forward on something you've been pretending to be uncertain about.",
  "✨ Ember Discipline: The thing you almost gave up on last year is closer to paying off than you currently believe.",
  "✨ Reluctant Clarity: You saw a pattern in someone's behavior early and were right to trust that read.",
  "✨ Velvet Boundary: Your calm way of saying no has quietly earned you more respect than any argument could have.",
  '✨ Perceptive Depth: You often grasp the real dynamic in a room before anyone else finishes their opening sentence.',
  '✨ Strategic restraint: Your decision to remain silent in a past negotiation gave you leverage you still benefit from today.',
  '✨ Unspoken Gravity: People instinctively look to your face for reactions during moments of sudden uncertainty.',
  '✨ Unseen Alignment: An idea you abandoned months ago is about to intersect with a new opportunity in a lucrative way.',
  '✨ Precise Compass: Your gut instinct regarding a specific individual was proven entirely correct, validating your intuition.',
  '✨ Quiet Dominance: You do not need to win arguments when your steady results consistently settle the debate.',
  '✨ Subtle Radiance: Your true strength shows in how quickly you reset after unexpected setbacks.',
  '✨ Protected Peace: Your recent decision to tighten your inner circle has instantly elevated your mental clarity.',
  '✨ Sovereign Orbit: You attract higher-caliber opportunities simply by refusing to chase low-value validation.',
  '✨ Calibrated Focus: A major distraction that slowed you down last year no longer has any pull over your mind.',
  '✨ Unmatched Discipline: The quiet routines you maintain behind closed doors are preparing you for a swift public ascent.',
  '✨ Deep Authenticity: People trust your endorsement because they know you never lend your name to something insincere.',
  '✨ Incisive Wisdom: You have learned to distinguish between temporary discomfort and true misalignment.',
  '✨ Enduring Presence: Long after a project ends, partners remember your calm reliability over louder contributors.'
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
      'You catch inconsistencies between people’s words and their micro-expressions instantly. You give grace easily, but you store behavioral receipts with photographic memory.',
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
  {
    title: "Calibrated Risk Tolerance",
    explanation: "You distinguish clearly between reckless gambles and calculated leaps. This clarity lets you move boldly where others freeze, without ever betting more than you can actually absorb losing.",
    manifestation: "You take the risks others are too cautious for, and skip the ones they foolishly take."
  },
  {
    title: "Patient Skill Compounding",
    explanation: "You treat mastery as a long game, adding small deliberate improvements consistently rather than chasing dramatic overnight leaps.",
    manifestation: "Your skill level quietly surpasses louder, faster-moving peers over time."
  },
  {
    title: "Diplomatic Bluntness",
    explanation: "You deliver hard truths without cruelty, choosing precise honest language over either flattery or harshness.",
    manifestation: "People trust your feedback because it is both kind and completely reliable."
  },
  {
    title: "Structural Foresight",
    explanation: "You build with the next five years in mind, not just the current quarter, avoiding the short-term traps others fall into.",
    manifestation: "Your foundations rarely need to be rebuilt from scratch."
  },
  {
    title: "Selective Transparency",
    explanation: "You share exactly enough to build trust without exposing your full strategy, protecting your leverage while still appearing open.",
    manifestation: "People feel informed by you without ever seeing your whole hand."
  },
  {
    title: "Low-Reactivity Under Provocation",
    explanation: "Attempts to bait you into impulsive reactions rarely land, because your responses come from calculation rather than adrenaline.",
    manifestation: "You are exceptionally difficult to manipulate through emotional pressure."
  },
  {
    title: "Cross-Domain Pattern Transfer",
    explanation: "You apply lessons learned in one area of life directly to unrelated problems, accelerating your learning curve everywhere at once.",
    manifestation: "You solve new problems faster because you've quietly solved their shape before."
  },
  {
    title: "Deliberate Energy Budgeting",
    explanation: "You treat your attention and energy like a finite currency, refusing to overspend it on situations that don't return proportional value.",
    manifestation: "You rarely experience the burnout that consumes less selective people."
  },
  {
    title: "Grounded Confidence Without Bravado",
    explanation: "Your self-assurance doesn't need an audience to validate it, so you never feel compelled to perform certainty you don't feel.",
    manifestation: "People sense your competence without needing you to announce it."
  },
  {
    title: "Recovery-Oriented Problem Solving",
    explanation: "When plans fail, you move immediately to salvage and adaptation instead of dwelling on the failure itself.",
    manifestation: "You lose far less time to setbacks than most people around you."
  },
  {
    title: 'Surgical Focus in High-Noise Environments',
    explanation: 'You can tune out widespread panic, surface noise, and irrelevant commentary to isolate core leverage points. Your mind filters out trivia automatically.',
    manifestation: 'You execute with clarity while others are distracted.'
  },
  {
    title: 'Rapid Systemic Synthesis',
    explanation: 'You absorb complex, disorganized information and synthesize it into executable strategies faster than most can analyze the problem.',
    manifestation: 'You turn chaos into order effortlessly.'
  },
  {
    title: 'Unshakable Personal Accountability',
    explanation: 'You take total responsibility for your environment and outcomes. You refuse victim narratives, which gives you complete agency over your direction.',
    manifestation: 'You possess complete personal agency.'
  },
  {
    title: 'High-Fidelity Emotional Recalibration',
    explanation: 'When hit with unexpected disappointment, you process the emotion swiftly, learn the structural lesson, and return to effective action without lingering resentment.',
    manifestation: 'Your downtime after setbacks is exceptionally brief.'
  },
  {
    title: 'Quiet Strategic Patience',
    explanation: 'You understand the compound growth of silent effort. You are content to work without recognition today because you know the structural result will be undeniable tomorrow.',
    manifestation: 'You play long-term games while others chase short-term applause.'
  },
  {
    title: 'Intuitive Negotiation & Alignment',
    explanation: 'You locate shared incentives instantly. You secure outcomes where all parties feel respected while firmly securing your strategic objectives.',
    manifestation: 'You achieve win-win outcomes without compromising your standards.'
  },
  {
    title: 'Uncompromised Aesthetic & Quality Standards',
    explanation: 'You possess an internal bar for quality that you refuse to lower, regardless of deadlines or external pressure. Excellence is a personal habit.',
    manifestatingsignificance.' },
  { title: 'The Horizon Voyager', essence: 'Relentless Quest for Personal Sovereignty', description: 'You are fundamentally motivated by freedom. Every strategic decision you make is designed to expand your personal agency and self-determination.' }

];

const FREE_TEASERS = [
  '✨ Personal Spark: People remember the specific way you made them feel seen years after a 5-minute conversation with you.',
  '✨ Instinctive Shield: You have a radar for concealed motives that has silently saved you from at least three catastrophic traps.',
  '✨ Rare Magnetism: The dreams you keep quietest are the exact ones that will redefine your next life milestone.',
  '✨ Latent Velocity: You are standing in the final incubation phase of an ambition that others doubted you could pull off.',
  '✨ Quiet Distinction: Your biggest competitive advantage has always been your composure when everyone else is reacting impulsively.',
  '✨ Soul Integrity: You refuse to pretend to like things or people to fit in — and that quiet refusal is why high-value peers respect you.',
  "✨ Silent Ledger: You remember exactly who showed up for you and who didn't, even if you've never once brought it up.",
  "✨ Patient Root: A skill you've been quietly building for over a year is about to become visibly undeniable to others.",
  "✨ Calibrated Instinct: The hesitation you felt about a recent decision was your intuition doing its job, not weakness.",
  "✨ Threshold Discipline: The boundary you set without explanation months ago is the exact reason your peace has held steady since.",
  "✨ Undersold Talent: You are better at something than you currently give yourself credit for, and it's about to be tested publicly.",
  "✨ Quiet Cartography: You already know the way forward on something you've been pretending to be uncertain about.",
  "✨ Ember Discipline: The thing you almost gave up on last year is closer to paying off than you currently believe.",
  "✨ Reluctant Clarity: You saw a pattern in someone's behavior early and were right to trust that read.",
  "✨ Velvet Boundary: Your calm way of saying no has quietly earned you more respect than any argument could have.",
  '✨ Personal Spark: People remember the specific way you made them feel seen years after a 5-minute conversation with you.',
  '✨ Instinctive Shield: You have a radar for concealed motives that has silently saved you from at least three catastrophic traps.',
  '✨ Rare Magnetism: The dreams you keep quietest are the exact ones that will redefine your next life milestone.',
  '✨ Latent Velocity: You are standing in the final incubation phase of an ambition that others doubted you could pull off.',
  '✨ Quiet Distinction: Your biggest competitive advantage has always been your composure when everyone else is reacting impulsively.',
  '✨ Soul Integrity: You refuse to pretend to like things or people to fit in — and that quiet refusal is why high-value peers respect you.',
  '✨ Perceptive Depth: You often grasp the real dynamic in a room before anyone else finishes their opening sentence.',
  '✨ Strategic restraint: Your decision to remain silent in a past negotiation gave you leverage you still benefit from today.',
  '✨ Unspoken Gravity: People instinctively look to your face for reactions during moments of sudden uncertainty.',
  '✨ Unseen Alignment: An idea you abandoned months ago is about to intersect with a new opportunity in a lucrative way.',
  '✨ Precise Compass: Your gut instinct regarding a specific individual was proven entirely correct, validating your intuition.',
  '✨ Quiet Dominance: You do not need to win arguments when your steady results consistently settle the debate.',
  '✨ Subtle Radiance: Your true strength shows in how quickly you reset after unexpected setbacks.',
  '✨ Protected Peace: Your recent decision to tighten your inner circle has instantly elevated your mental clarity.',
  '✨ Sovereign Orbit: You attract higher-caliber opportunities simply by refusing to chase low-value validation.',
  '✨ Calibrated Focus: A major distraction that slowed you down last year no longer has any pull over your mind.',
  '✨ Unmatched Discipline: The quiet routines you maintain behind closed doors are preparing you for a swift public ascent.',
  '✨ Deep Authenticity: People trust your endorsement because they know you never lend your name to something insincere.',
  '✨ Incisive Wisdom: You have learned to distinguish between temporary discomfort and true misalignment.',
  '✨ Enduring Presence: Long after a project ends, partners remember your calm reliability over louder contributors.'
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
  {
    title: "Calibrated Risk Tolerance",
    explanation: "You distinguish clearly between reckless gambles and calculated leaps. This clarity lets you move boldly where others freeze, without ever betting more than you can actually absorb losing.",
    manifestation: "You take the risks others are too cautious for, and skip the ones they foolishly take."
  },
  {
    title: "Patient Skill Compounding",
    explanation: "You treat mastery as a long game, adding small deliberate improvements consistently rather than chasing dramatic overnight leaps.",
    manifestation: "Your skill level quietly surpasses louder, faster-moving peers over time."
  },
  {
    title: "Diplomatic Bluntness",
    explanation: "You deliver hard truths without cruelty, choosing precise honest language over either flattery or harshness.",
    manifestation: "People trust your feedback because it is both kind and completely reliable."
  },
  {
    title: "Structural Foresight",
    explanation: "You build with the next five years in mind, not just the current quarter, avoiding the short-term traps others fall into.",
    manifestation: "Your foundations rarely need to be rebuilt from scratch."
  },
  {
    title: "Selective Transparency",
    explanation: "You share exactly enough to build trust without exposing your full strategy, protecting your leverage while still appearing open.",
    manifestation: "People feel informed by you without ever seeing your whole hand."
  },
  {
    title: "Low-Reactivity Under Provocation",
    explanation: "Attempts to bait you into impulsive reactions rarely land, because your responses come from calculation rather than adrenaline.",
    manifestation: "You are exceptionally difficult to manipulate through emotional pressure."
  },
  {
    title: "Cross-Domain Pattern Transfer",
    explanation: "You apply lessons learned in one area of life directly to unrelated problems, accelerating your learning curve everywhere at once.",
    manifestation: "You solve new problems faster because you've quietly solved their shape before."
  },
  {
    title: "Deliberate Energy Budgeting",
    explanation: "You treat your attention and energy like a finite currency, refusing to overspend it on situations that don't return proportional value.",
    manifestation: "You rarely experience the burnout that consumes less selective people."
  },
  {
    title: "Grounded Confidence Without Bravado",
    explanation: "Your self-assurance doesn't need an audience to validate it, so you never feel compelled to perform certainty you don't feel.",
    manifestation: "People sense your competence without needing you to announce it."
  },
  {
    title: "Recovery-Oriented Problem Solving",
    explanation: "When plans fail, you move immediately to salvage and adaptation instead of dwelling on the failure itself.",
    manifestation: "You lose far less time to setbacks than most people around you."
  },
  {
    title: 'Adaptive Composure Under Fire',
    explanation: 'When chaos erupts, your nervous system does not crash; it narrows its focus onto the single highest-leverage solution. Where others exhaust energy complaining, you quietly rearrange reality.',
    manifestation: 'You become clearest when the stakes are highest.'
  },
  {
    title: 'Radical Discernment of Character',
    explanation: 'You catch inconsistencies between people’s words and their micro-expressions instantly. You give grace easily, but you store behavioral receipts with photographic memory.',
    manifestation: 'You are almost impossible to manipulate twice.'
  },
  {
    title: 'Compound Willpower & Self-Sovereignty',
    explanation: 'You do not rely on transient hype or external cheerleaders. Once you decide something belongs in your future, you execute behind closed doors until the outcome speaks for itself.',
    manifestation: 'Your quiet discipline consistently outperforms noisy talent.'
  },
  {
    title: 'Uncommon Emotional Generosity with Boundaries',
    explanation: 'You give your energy deeply to those in your inner ring without sacrificing your own self-respect. You have mastered the rare art of saying no without guilt or explanation.',
    manifestation: 'Your loyalty is priceless because it cannot be bought or faked.'
  },
  {
    title: 'Surgical Focus in High-Noise Environments',
    explanation: 'You can tune out widespread panic, surface noise, and irrelevant commentary to isolate core leverage points. Your mind filters out trivia automatically.',
    manifestation: 'You execute with clarity while others are distracted.'
  },
  {
    title: 'Rapid Systemic Synthesis',
    explanation: 'You absorb complex, disorganized information and synthesize it into executable strategies faster than most can analyze the problem.',
    manifestation: 'You turn chaos into order effortlessly.'
  },
  {
    title: 'Unshakable Personal Accountability',
    explanation: 'You take total responsibility for your environment and outcomes. You refuse victim narratives, which gives you complete agency over your direction.',
    manifestation: 'You possess complete personal agency.'
  },
  {
    title: 'High-Fidelity Emotional Recalibration',
    explanation: 'When hit with unexpected disappointment, you process the emotion swiftly, learn the structural lesson, and return to effective action without lingering resentment.',
    manifestation: 'Your downtime after setbacks is exceptionally brief.'
  },
  {
    title: 'Quiet Strategic Patience',
    explanation: 'You understand the compound growth of silent effort. You are content to work without recognition today because you know the structural result will be undeniable tomorrow.',
    manifestation: 'You play long-term games while others chase short-term applause.'
  },
  {
    title: 'Intuitive Negotiation & Alignment',
    explanation: 'You locate shared incentives instantly. You secure outcomes where all parties feel respected while firmly securing your strategic objectives.',
    manifestation: 'You achieve win-win outcomes without compromising your standards.'
  },
  {
    title: 'Uncompromised Aesthetic & Quality Standards',
    explanation: 'You possess an internal bar for quality that you refuse to lower, regardless of deadlines or external pressure. Excellence is a personal habit.',
    manifestation: 'Your work carries a distinct signature of craftsmanship.'
  },
  {
    title: 'Egoless Tactical Adaptability',
    explanation: 'You are not attached to being right; you are attached to what works. You abandon outdated strategies instantly when superior evidence emerges.',
    manifestation: 'You pivot faster than ego-driven competitors.'
  },
  {
    title: 'Perceptive Environmental Reading',
    explanation: 'You assess cultural norms, power dynamics, and unwritten rules in new environments with remarkable swiftness and precision.',
    manifestation: 'You navigate complex social hierarchies with ease.'
  },
  {
    title: 'Self-Generating Energy & Focus',
    explanation: 'Your motivation comes from internal standards rather than external incentives. You generate energy through purpose rather than external stimulation.',
    manifestation: 'You remain productive during quiet, solitary periods.'
  },
  {
    title: 'Protective Presence for Vulnerable Allies',
    explanation: 'You naturally extend your authority and stability to cushion those who are overwhelmed or exploited by institutional friction.',
    manifestation: 'You build deep, lasting loyalty among your allies.'
  },
  {
    title: 'Impenetrable Discretion',
    explanation: 'Confidences trusted to you are completely safe. You do not leverage gossip or private details for temporary social capital.',
    manifestation: 'You become a trusted vault for high-value individuals.'
  },
  {
    title: 'Clarifying Verbal Precision',
    explanation: 'You communicate complex concepts using clear, grounded language that eliminates ambiguity and align team efforts instantly.',
    manifestation: 'Your words cut through confusion efficiently.'
  },
  {
    title: 'Unsentimental Asset Allocation',
    explanation: 'You evaluate time, money, and focus with rigorous clarity. You cut underperforming commitments without emotional attachment.',
    manifestation: 'Your time yield is exceptionally efficient.'
  },
  {
    title: 'Deep Intrinsic Courage',
    explanation: 'You step into necessary conflict or uncharted territories alone if conviction demands it, regardless of consensus.',
    manifestation: 'You act decisively despite uncertainty.'
  },
  {
    title: 'Regenerative Solitude Practice',
    explanation: 'You use quiet, unstructured time to process experience, sharpen focus, and reset your baseline energy effectively.',
    manifestation: 'Your solo time fuels your public performance.'
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
  {
    title: "The Approval Audit Loop",
    subconsciousLoop: "You unconsciously scan rooms for signs of disapproval before committing to a decision, even ones that don't require anyone else's input.",
    prescription: "Practice making one small decision daily without seeking outside confirmation first."
  },
  {
    title: "Preemptive Self-Sabotage",
    subconsciousLoop: "You quietly lower your own expectations before a big opportunity, so a potential failure will hurt less.",
    prescription: "Commit fully to outcomes before they happen; protect ambition instead of protecting against disappointment."
  },
  {
    title: "The Comparison Treadmill",
    subconsciousLoop: "You measure your progress against curated highlight reels of others instead of your own baseline from a year ago.",
    prescription: "Track only your own trajectory; comparison to strangers' edited timelines distorts your real progress."
  },
  {
    title: "Chronic Availability Guilt",
    subconsciousLoop: "You feel obligated to respond instantly to every request, treating any delay as a personal failing.",
    prescription: "Build in response-time buffers deliberately; availability is not the same as value."
  },
  {
    title: "The Certainty Requirement",
    subconsciousLoop: "You wait for 100% confidence before acting, when most valuable moves only ever come with 70% clarity.",
    prescription: "Set a lower confidence threshold for action; adjust the plan as new information arrives instead of waiting for certainty."
  },
  {
    title: "Silent Over-Accommodation",
    subconsciousLoop: "You default to accommodating others' preferences even in situations where your own preference genuinely matters more.",
    prescription: "State your preference plainly at least once before automatically deferring."
  },
  {
    title: "The Productivity Identity Trap",
    subconsciousLoop: "You quietly tie your self-worth to how much you accomplished today, making rest feel like a threat to your value.",
    prescription: "Separate your identity from your output; rest is maintenance, not a moral failing."
  },
  {
    title: "Avoidance Disguised as Patience",
    subconsciousLoop: "You tell yourself you're waiting for the right moment, when really you're avoiding a conversation or decision that feels uncomfortable.",
    prescription: "Name the actual discomfort driving the delay, then address it directly instead of relabeling it as patience."
  },
  {
    title: "The Invisible Labor Habit",
    subconsciousLoop: "You take on unseen, uncredited work because pointing it out feels like bragging or causing conflict.",
    prescription: "Document your contributions plainly; visibility of effort is not the same as arrogance."
  },
  {
    title: "Residual Threat Scanning",
    subconsciousLoop: "Even in safe, stable situations, part of you stays alert for danger because of how things used to be.",
    prescription: "Practice consciously naming when a situation is actually safe, retraining your nervous system's baseline."
  },
   {
    title: 'The "Must Do It All Alone" Reflex',
    subconsciousLoop: 'Because you were let down in the past when relying on others, you default to bearing the entire weight solo. You mistake accepting help for forfeiting autonomy.',
    prescription: 'Delegate operational burdens so your mind can stay in high-leverage creative strategy. You do not need to suffer to prove your strength.'
  },
  {
    title: 'Hyper-Vigilance Disguised as Preparedness',
    subconsciousLoop: 'You mentally rehearse worst-case scenarios to stay invincible. While this protects you, it also delays celebration and keeps your body in subtle emergency mode.',
    prescription: 'Give yourself permission to exhale when a victory lands. Success is not a trap designed to test you; it is the compound interest of your labor.'
  },
  {
    title: 'Holding Grudges Against Your Past Self',
    subconsciousLoop: 'You privately hold past naive decisions against yourself, demanding a level of wisdom back then that you only possess today because you survived it.',
    prescription: 'Close the audit on your former self. You did not have today’s map when navigating yesterday’s fog.'
  },
  {
    title: 'The Perfectionist Delay Mechanism',
    subconsciousLoop: 'You keep refining projects behind closed doors out of concern that public exposure will reveal minor flaws only you can see.',
    prescription: 'Release work at 85% perfection. Real-world feedback compounds faster than hidden polishing.'
  },
  {
    title: 'Over-indexing on Risk Mitigation',
    subconsciousLoop: 'You analyze potential downsides so thoroughly that high-upside opportunities expire before you feel completely safe to commit.',
    prescription: 'Treat minor uncertainty as the price of asymmetric growth rather than a warning sign.'
  },
  {
    title: 'Reluctance to Broadcast Wins',
    subconsciousLoop: 'You assume high-quality work should speak entirely for itself, leading you to hide achievements while noisier peers capture recognition.',
    prescription: 'Clear documentation of your value is not vanity; it is essential career infrastructure.'
  },
  {
    title: 'Chaperoning Other People’s Growth',
    subconsciousLoop: 'You spend strategic energy trying to pull sluggish or reluctant allies up to your level of ambition, delaying your own trajectory.',
    prescription: 'Lead by rapid personal advancement rather than constant emotional management.'
  },
  {
    title: 'Conflating Rest with Idleness',
    subconsciousLoop: 'You feel a subtle underlying guilt when sitting still without a production metric, treating rest as time wasted.',
    prescription: 'Reframe rest as mandatory maintenance for your primary asset: your focus.'
  },
  {
    title: 'The "Just One More Credential" Trap',
    subconsciousLoop: 'You believe you need another certification, degree, or sign-off before asserting your authority in competitive spaces.',
    prescription: 'Claim space based on your demonstrated results rather than external permission.'
  },
  {
    title: 'Guarding Energy via Preemptive Withdrawal',
    subconsciousLoop: 'At the first sign of friction in relationships or projects, you pull back entirely to protect yourself rather than addressing the dynamic directly.',
    prescription: 'Engage in direct, calm boundary conversations before pulling back completely.'
  },
  {
    title: 'Sunk Cost Loyalty',
    subconsciousLoop: 'You maintain underperforming endeavors or connections far past their expiration date simply because of the energy you invested early on.',
    prescription: 'Base current resource allocation on future trajectory rather than past investment.'
  },
  {
    title: 'Micro-managing System Inputs',
    subconsciousLoop: 'You struggle to delegate because you suspect others will execute at 80% of your quality standard, keeping your schedule overloaded.',
    prescription: 'Accept an 80% match in execution from others to gain 100% leverage on your time.'
  },
  {
    title: 'Subconscious Upper-Limit Anxiety',
    subconsciousLoop: 'When life is going smoothly, you look for hidden problems, expecting sudden disruptions to balance out positive momentum.',
    prescription: 'Expand your capacity to enjoy peaceful success without expecting sudden fallout.'
  },
  {
    title: 'Over-intellectualizing Direct Intuition',
    subconsciousLoop: 'You override clear initial instincts with endless pros-and-cons lists until your intuition gets drowned out by logic.',
    prescription: 'Give your visceral first instincts equal weight alongside analytical data.'
  },
  {
    title: 'Hesitation to Price at True Value',
    subconsciousLoop: 'You charge or accept compensation based on time spent rather than the massive, compounded value you generate.',
    prescription: 'Align your fees with value delivered rather than hours logged.'
  },
  {
    title: 'The Silent Resentment Accumulator',
    subconsciousLoop: 'You absorb small breaches of boundaries without speaking up, until sudden frustration erupts over a minor issue.',
    prescription: 'Address small boundary violations in real time while emotional friction is minimal.'
  },
  {
    title: 'Over-polishing Internal Strategies',
    subconsciousLoop: 'You spend weeks perfecting structural plans on paper while delaying real-world exposure.',
    prescription: 'Test hypotheses quickly in the field rather than optimizing theoretical frameworks.'
  },
  {
    title: 'Dismissing Genuine Praise',
    subconsciousLoop: 'You wave off legitimate praise as standard performance, depriving your subconscious of positive reinforcement.',
    prescription: 'Receive compliments with a simple, grounded "Thank you," letting the recognition land.'
  },
  {
    title: 'Fixating on System Friction',
    subconsciousLoop: 'You waste energy getting frustrated by slow institutional processes instead of finding simple workarounds.',
    prescription: 'Accept friction as a default landscape condition and build lightweight routes around it.'
  },
  {
    title: 'Protecting Options at the Cost of Commitment',
    subconsciousLoop: 'You keep several pathways open to avoid closing doors, preventing full commitment to a single high-leverage initiative.',
    prescription: 'Narrow your targets decisively to concentrate your focus.'
  }
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
  {
    title: "The Compound Patience Edge",
    superpower: "You outlast competitors not through raw talent but through sheer willingness to keep showing up long after others quit.",
    howToLeverage: "Choose long-horizon goals where persistence alone eliminates most of your competition."
  },
  {
    title: "Contextual Code-Switching",
    superpower: "You naturally adjust your tone and approach across different social and professional settings without losing your core identity.",
    howToLeverage: "Use this fluency to build bridges between groups that normally don't communicate well with each other."
  },
  {
    title: "The Delayed Gratification Reservoir",
    superpower: "You can forgo immediate comfort for a larger future payoff more consistently than most people around you.",
    howToLeverage: "Direct this discipline toward compounding assets — skills, savings, relationships — that reward patience specifically."
  },
  {
    title: "Threat Downgrade Instinct",
    superpower: "You quickly distinguish between genuine emergencies and manufactured urgency, refusing to be rushed by artificial pressure.",
    howToLeverage: "Use your calm pacing to negotiate better terms whenever someone tries to force a rushed decision."
  },
  {
    title: "The Quiet Credibility Bank",
    superpower: "You've built a reputation for reliability so consistent that people vouch for you without needing to be asked.",
    howToLeverage: "Leverage this trust to open doors that usually require years of direct relationship-building."
  },
  {
    title: "Emotional Weather Reading",
    superpower: "You sense shifts in group mood before they're spoken aloud, giving you a head start on navigating group dynamics.",
    howToLeverage: "Use early awareness to address tension privately before it escalates publicly."
  },
  {
    title: "The Minimalist Focus Advantage",
    superpower: "You accomplish more with fewer resources because you've eliminated the noise most people never bother clearing.",
    howToLeverage: "Resist the urge to add complexity; your edge often comes from what you deliberately leave out."
  },
  {
    title: "Reputation Compounding",
    superpower: "Small consistent acts of integrity have quietly built a reputation that now works in your favor without any effort on your part.",
    howToLeverage: "Keep protecting this asset; a strong reputation opens doors money alone cannot buy."
  },
  {
    title: "The Graceful Exit Skill",
    superpower: "You know how to leave situations, relationships, or deals without burning bridges, preserving future options others torch.",
    howToLeverage: "Use this skill deliberately when stepping away from anything that's run its course."
  },
  {
    title: "Instinctive Resource Stacking",
    superpower: "You naturally combine underused resources — time, connections, skills — into new value nobody else noticed was possible.",
    howToLeverage: "Actively audit your existing resources before seeking new ones; the combination is often already available to you."
  },
  {
    title: 'The Underestimation Dividend',
    superpower: 'People routinely misjudge your depth because you do not broadcast your moves prematurely. By the time they realize your game, you have already secured the board.',
    howToLeverage: 'Let people keep talking. Continue executing in silence until the results are irreversible.'
  },
  {
    title: 'High-Fidelity Emotional Intuition',
    superpower: 'Your gut instinct operates like a forensic sensor. Whenever you ignore your stomach feeling for logic, you pay for it; whenever you trust it, you are vindicated.',
    howToLeverage: 'Never explain away an intuitive red flag with intellectual excuses.'
  },
  {
    title: 'The Ability to Reset Overnight',
    superpower: 'While others require months to grieve an ended chapter or failed project, you can internalize the lesson, dust off your knees, and pivot with pristine focus.',
    howToLeverage: 'Do not hesitate to cut losses on dead weight; your recovery speed is peerless.'
  },
  {
    title: 'Asymmetric Information Processing',
    superpower: 'You notice minor details, omitted facts, and shifts in body language that others miss entirely during routine meetings.',
    howToLeverage: 'Use these underlying signals to guide strategy before official announcements are made.'
  },
  {
    title: 'Frictionless Solitary Productivity',
    superpower: 'You generate intense, focused work output in isolation without requiring external accountability or team hype.',
    howToLeverage: 'Block uninterrupted deep-work windows where you build high-value assets solo.'
  },
  {
    title: 'Selective Amnesia for Petty Grievances',
    superpower: 'You do not waste mental space holding onto petty slights, keeping your cognitive bandwidth clear for high-value pursuits.',
    howToLeverage: 'Redirect liberated mental energy directly into long-term wealth and health goals.'
  },
  {
    title: 'Rapid De-escalation Mastery',
    superpower: 'Your calm tone and non-reactive presence can lower the emotional intensity of volatile situations almost instantly.',
    howToLeverage: 'Position yourself as the steady mediator in high-stakes negotiations.'
  },
  {
    title: 'Intuitive Structural Optimization',
    superpower: 'You naturally see redundant steps, inefficiencies, and waste in any operational flow within minutes of observation.',
    howToLeverage: 'Package your process fixes as scalable systems or strategic consulting insights.'
  },
  {
    title: 'Unshakable Anchor Demeanor',
    superpower: 'The higher the stress in an organization, the calmer and more deliberate your internal system becomes.',
    howToLeverage: 'Step up during crises to secure long-term trust and leadership positions.'
  },
  {
    title: 'Authentic Connection Resonance',
    superpower: 'You build deep trust in short encounters by skipping superficial chatter and speaking directly to genuine concerns.',
    howToLeverage: 'Skip small talk in high-value networking to quickly identify true allies.'
  },
  {
    title: 'Low Cultural Susceptibility',
    superpower: 'You are immune to social hype, passing trends, and peer pressure, keeping your capital and focus secure.',
    howToLeverage: 'Invest resources counter-cyclically while mainstream focus is distracted.'
  },
  {
    title: 'Post-Crisis Regeneration Velocity',
    superpower: 'Surviving major challenges transforms directly into sharp clarity and heightened drive rather than persistent anxiety.',
    howToLeverage: 'Use post-challenge momentum to launch ambitious initiatives immediately.'
  },
  {
    title: 'Precision Narrative Synthesis',
    superpower: 'You can extract core truths from conflicting reports and summarize complex situations into clear, actionable bullet points.',
    howToLeverage: 'Provide concise summaries to key decision-makers who lack time to parse details.'
  },
  {
    title: 'Discerning Boundary Enforcement',
    superpower: 'You say "no" with a warm smile and zero defensive explanation, stopping boundary pushes firmly without escalating conflict.',
    howToLeverage: 'Protect high-value priorities without generating lingering personal tension.'
  },
  {
    title: 'Long-Arc Pattern Recognition',
    superpower: 'You instinctively track patterns across years rather than days, predicting industry cycles before they fully land.',
    howToLeverage: 'Position your assets far ahead of market shifts.'
  },
  {
    title: 'Intentional Silence Command',
    superpower: 'You use silence comfortably in conversations, prompting counter-parties to reveal their true positions.',
    howToLeverage: 'Pause intentionally after key statements to let the other party fill the quiet.'
  },
  {
    title: 'Clear Emotional Detachment',
    superpower: 'You separate personal identity from project performance, allowing you to iterate or drop failing ideas without emotional drag.',
    howToLeverage: 'Kill non-performing initiatives early and reallocate resources into active opportunities.'
  },
  {
    title: 'Self-Sustaining Inner Validation',
    superpower: 'You do not require external praise to keep working, allowing you to pursue long-term goals without needing constant validation.',
    howToLeverage: 'Build stealth projects until they are mature enough to command market attention.'
  },
  {
    title: 'Incisive Questioning Capability',
    superpower: 'You ask targeted, fundamental questions that immediately expose weak logic or underlying systemic issues.',
    howToLeverage: 'Use clear, probing questions during discovery phases to identify true vulnerabilities.'
  },
  {
    title: 'Quiet Loyalty Magnetism',
    superpower: 'Your steady integrity draws exceptionally loyal collaborators who protect your interest when you are out of the room.',
    howToLeverage: 'Invest deeply in trusted core allies who expand your reach.'
  }
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
  {
    phase: "The Quiet Confidence Rebuild",
    forecast: "Over the next 90 days, a specific area of self-doubt will steadily dissolve as small proof points accumulate. By week 10, you will notice you've stopped needing to convince yourself.",
    unexpectedOpportunity: "A minor success you almost dismissed becomes the reference point that shifts your entire outlook.",
    shiftsLabel: "Current Transit: Internal Proof & Quiet Self-Trust"
  },
  {
    phase: "The Strategic Pruning Season",
    forecast: "The next quarter calls for cutting away obligations that no longer serve your direction. What feels like loss in week 3 will feel like relief by week 9.",
    unexpectedOpportunity: "Removing one commitment frees up bandwidth for an opportunity you hadn't even noticed was waiting.",
    shiftsLabel: "Current Transit: Deliberate Subtraction & Focus Recovery"
  },
  {
    phase: "The Trust Rebuilding Arc",
    forecast: "A relationship or partnership strained by past friction begins to stabilize over these 90 days, provided both sides show consistent small follow-through.",
    unexpectedOpportunity: "A small act of good faith from the other side arrives sooner than you expected.",
    shiftsLabel: "Current Transit: Repair & Renewed Reliability"
  },
  {
    phase: "The Visibility Discomfort Window",
    forecast: "You'll be pushed slightly further into the spotlight than feels comfortable over the next quarter. The discomfort fades faster than anticipated once you're actually in it.",
    unexpectedOpportunity: "Someone influential notices your work specifically because you stopped hiding it.",
    shiftsLabel: "Current Transit: Exposure & Earned Recognition"
  },
  {
    phase: "The Financial Discipline Sprint",
    forecast: "The next 12 weeks reward tightened spending and clearer tracking with a noticeably stronger position by the end of the window.",
    unexpectedOpportunity: "A small, overlooked expense you finally address frees up more room than expected.",
    shiftsLabel: "Current Transit: Precision Budgeting & Quiet Accumulation"
  },
  {
    phase: "The Skill Stress-Test Period",
    forecast: "A skill you've been developing quietly gets tested in a real, visible situation during this window, and it holds up better than you feared.",
    unexpectedOpportunity: "The test itself becomes proof you can point to the next time doubt creeps in.",
    shiftsLabel: "Current Transit: Applied Competence & Proven Readiness"
  },
  {
    phase: "The Boundary Reinforcement Quarter",
    forecast: "A boundary you set previously gets tested again over these 90 days. Holding firm this time settles the matter permanently.",
    unexpectedOpportunity: "The person testing the boundary ultimately respects you more for holding it.",
    shiftsLabel: "Current Transit: Boundary Consolidation & Respect Earned"
  },
  {
    phase: "The Quiet Recovery Window",
    forecast: "After a demanding stretch, this quarter is built for genuine rest and recalibration rather than new pursuits.",
    unexpectedOpportunity: "Slowing down reveals a solution to a problem you'd been forcing without success.",
    shiftsLabel: "Current Transit: Restoration & Involuntary Clarity"
  },
  {
    phase: "The Alliance Formation Phase",
    forecast: "New, genuinely aligned collaborators enter your circle over these 12 weeks, offsetting a period of relative isolation.",
    unexpectedOpportunity: "A group you weren't actively seeking out invites you in based on reputation alone.",
    shiftsLabel: "Current Transit: New Alliances & Expanded Support"
  },
  {
    phase: "The Decisive Cut Corridor",
    forecast: "A decision you've delayed for months finally gets made in this window, and the relief of finality outweighs any lingering uncertainty.",
    unexpectedOpportunity: "Making the decision opens a second opportunity that was blocked by the indecision itself.",
    shiftsLabel: "Current Transit: Resolution & Forward Motion"
  },
  {
    phase: 'The Uncluttering & Elevation Window',
    forecast: 'Over the next 90 days, you will feel an irresistible urge to clear dead weight: stagnant conversations, unfinished projects, and people who only reach out when they need your energy. A financial or career clarity moment arrives between week 6 and 8.',
    unexpectedOpportunity: 'An unexpected connection from your past reaches out with a proposal that is far more lucrative than it looks on the surface.',
    shiftsLabel: 'Current Transit: Clarity & Reclaiming Boundaries'
  },
  {
    phase: 'The High-Leverage Visibility Surge',
    forecast: 'Your quiet efforts from the last 6 months are about to step into public recognition. You will be invited into a room or conversation you thought was still a year away. Prepare your pitch and maintain high standards.',
    unexpectedOpportunity: 'A sudden opening created by someone else stepping down puts you in position to assume natural leadership.',
    shiftsLabel: 'Current Transit: Breakthrough & Recognition Wave'
  },
  {
    phase: 'The Deep Realignment & Financial Pivot',
    forecast: 'The next 12 weeks bring an overdue breakthrough in how you generate and safeguard your resources. An old fear regarding stability dissolves as you implement a smarter system.',
    unexpectedOpportunity: 'A side conversation over coffee or message evolves into a viable income or collaboration channel.',
    shiftsLabel: 'Current Transit: Strategic Abundance & Resource Consolidation'
  },
  {
    phase: 'The Courageous Chapter Transition',
    forecast: 'A situation that you have tolerated out of comfort will finally reach its expiration date. Letting it go will not leave a void — it will instantly open a corridor for the genuine partner or project you deserve.',
    unexpectedOpportunity: 'A sudden travel or relocation spark that reorganizes your outlook on what you want from the next 5 years.',
    shiftsLabel: 'Current Transit: Sovereign Transformation & Momentum'
  },
  {
    phase: 'The Operational Optimization Window',
    forecast: 'The next 90 days are about sharpening your routines, automated workflows, and personal health. Systemic friction that slowed you down in previous quarters will be systematically removed.',
    unexpectedOpportunity: 'An introduction to an expert or tool that cuts your weekly workload by 30% almost immediately.',
    shiftsLabel: 'Current Transit: Precision Restructuring & Energy Preservation'
  },
  {
    phase: 'The Silent Accumulation Corridor',
    forecast: 'A focused, quiet 12-week stretch where public display takes a back seat to raw skill accumulation and background building. What you construct in silence now becomes your flagship asset soon.',
    unexpectedOpportunity: 'Under-the-radar access to specialized knowledge or resources before they become widely known.',
    shiftsLabel: 'Current Transit: Deep Foundation Work & Asset Creation'
  },
  {
    phase: 'The Network Recalibration Phase',
    forecast: 'Your social circle undergoes a healthy, natural update over the next quarter. Older, low-energy connections fade away without conflict, making space for high-value peers.',
    unexpectedOpportunity: 'An unexpected invitation to an exclusive circle or advisory role that elevates your professional positioning.',
    shiftsLabel: 'Current Transit: Relational Elevation & Inner Circle Refinement'
  },
  {
    phase: 'The Authority Alignment Phase',
    forecast: 'You stop asking for permission and start claiming your position. Over the next 90 days, your communication becomes more direct, yielding immediate upgrades in professional negotiations.',
    unexpectedOpportunity: 'A key player steps back, leaving an authority gap that you naturally fill.',
    shiftsLabel: 'Current Transit: Sovereignty Claim & Boundary Fortification'
  },
  {
    phase: 'The Creative Surge & Intellectual Breakthrough',
    forecast: 'Inspiration meets discipline over the next quarter. Ideas that were vague fragments crystalize into coherent, high-leverage plans with real monetization potential.',
    unexpectedOpportunity: 'An old notebook or abandoned project draft contains the exact framework needed for a current breakthrough.',
    shiftsLabel: 'Current Transit: Strategic Creativity & Intellectual Monetization'
  },
  {
    phase: 'The Emotional Sanctuary Restoration',
    forecast: 'The upcoming quarter focuses on inner restoration and setting clear boundaries around your time. Internal stress eases as you align daily routines with personal values.',
    unexpectedOpportunity: 'A real estate, home workspace, or physical environment upgrade that substantially raises your daily peace.',
    shiftsLabel: 'Current Transit: Internal Stabilization & Grounded Balance'
  },
  {
    phase: 'The Strategic Liquidity Shift',
    forecast: 'Focus shifts squarely toward optimizing cash flow, reducing drag, and setting up reliable financial structures over the next 12 weeks.',
    unexpectedOpportunity: 'An overlooked asset or forgotten investment offers unexpected yield or leverage.',
    shiftsLabel: 'Current Transit: Capital Optimization & Financial Clarity'
  },
  {
    phase: 'The Mastermind Synergy Phase',
    forecast: 'Collaborations take center stage over the next 90 days. You will find partners whose strengths directly complement your gaps, multiplying your output with less friction.',
    unexpectedOpportunity: 'A casual peer interaction rapidly turns into a high-value strategic alliance.',
    shiftsLabel: 'Current Transit: Collaborative Leverage & Shared Momentum'
  },
  {
    phase: 'The Intuitive Direction Breakthrough',
    forecast: 'Uncertainty around a key career choice resolves between week 4 and week 7. You gain strong internal clarity on which path offers long-term growth versus short-term hype.',
    unexpectedOpportunity: 'A chance conversation provides the missing piece of information needed to solve a key dilemma.',
    shiftsLabel: 'Current Transit: Visionary Alignment & Trajectory Clarity'
  },
  {
    phase: 'The Public Portfolio Debut',
    forecast: 'A period of quiet development concludes, moving into external execution. The next 90 days favor launching, publishing, and presenting your work directly to decision-makers.',
    unexpectedOpportunity: 'Inquiries arrive from unexpected sources who noticed your recent quiet results.',
    shiftsLabel: 'Current Transit: External Realization & Market Validation'
  },
  {
    phase: 'The Digital Detox & Strategic Isolation',
    forecast: 'You will cut out superficial noise to focus deeply on your core priorities over the next quarter. Distractions fall away, leading to marked increases in output quality.',
    unexpectedOpportunity: 'Solitary deep focus uncovers a key strategic solution that busier teams missed entirely.',
    shiftsLabel: 'Current Transit: Focus Shielding & High-Yield Deep Work'
  },
  {
    phase: 'The System Automation Window',
    forecast: 'You eliminate repetitive task friction by putting strong systems and processes in place over the coming 12 weeks.',
    unexpectedOpportunity: 'Automating a daily routine frees up substantial time for high-value personal development.',
    shiftsLabel: 'Current Transit: Operational Efficiency & Time Reclamation'
  },
  {
    phase: 'The High-Stakes Negotiation Arc',
    forecast: 'Contractual, financial, or relational terms will be re-negotiated during this window. Your quiet poise ensures you secure favorable, sustainable terms.',
    unexpectedOpportunity: 'A counterparty yields on a key requirement after you hold a firm, calm stance.',
    shiftsLabel: 'Current Transit: Value Reclamation & Contractual Precision'
  },
  {
    phase: 'The Wellness Infrastructure Reset',
    forecast: 'Physical health, sleep quality, and daily energy management become top priorities over the next 90 days, creating a stronger foundation for upcoming projects.',
    unexpectedOpportunity: 'A simple adjustment in daily habits produces a major increase in daily stamina and cognitive performance.',
    shiftsLabel: 'Current Transit: Vitality Fortification & Physical Calibration'
  },
  {
    phase: 'The Shadow Work & Healing Corridor',
    forecast: 'Old behavioral loops and past lingering resentments fade as you process and release historical baggage over the next 12 weeks.',
    unexpectedOpportunity: 'Resolving a lingering past conflict unblocks creative momentum across all areas.',
    shiftsLabel: 'Current Transit: Psychological Release & Unbound Momentum'
  },
  {
    phase: 'The Global Horizon Expansion',
    forecast: 'Your perspective expands beyond local constraints. The next quarter presents opportunities involving cross-border connections, new markets, or distant travel.',
    unexpectedOpportunity: 'An international or out-of-region inquiry opens up a promising expansion channel.',
    shiftsLabel: 'Current Transit: Horizon Expansion & Broadened Perspective'
  }
];

const ONE_YEAR_OUTLOOKS = [
  'Within 12 months, your day-to-day lifestyle will look markedly different. You will have transitioned away from reactive firefighting into high-autonomy decision making. You will be surrounded by a smaller, significantly more loyal circle that matches your integrity.',
  'Your 1-year trajectory indicates a major structural upgrade: either a career pivot that doubles your leverage or a personal creative milestone you have nurtured in secret. You will look back at this exact month as the turning point when you stopped apologizing for your ambitions.',
  'By this time next year, a chronic emotional or financial anxiety that has haunted the last two years will be completely neutralized. You will have built proof of your self-efficacy that nobody can talk you out of.',
  "A year from now, a decision you're currently agonizing over will look obvious in hindsight, and you'll wonder why it took so long to make.",
  "Within 12 months, you will have quietly replaced at least one major source of stress with a system that runs without your constant attention.",
  "Your one-year outlook includes a relationship, professional or personal, that shifts from tentative to genuinely dependable.",
  "By this time next year, a version of confidence you're currently faking will have become authentic, earned through repeated proof.",
  "Twelve months ahead, a financial habit you build in the coming weeks will have compounded into a noticeably different baseline.",
  "Within a year, you will have stopped explaining a decision to people who were never going to understand it anyway.",
  "Your 12-month arc includes a moment where you recognize your own growth only because someone else points it out first.",
  "A year from now, an environment that currently drains you will either be transformed or fully behind you.",
  "By next year, a fear you're currently managing quietly will have shrunk enough that it no longer shapes your daily decisions.",
  "Within 12 months, you will look back and realize this exact period was the quiet turning point, even though it didn't feel dramatic at the time.",
   'Within 12 months, your day-to-day lifestyle will look markedly different. You will have transitioned away from reactive firefighting into high-autonomy decision making. You will be surrounded by a smaller, significantly more loyal circle that matches your integrity.',
  'Your 1-year trajectory indicates a major structural upgrade: either a career pivot that doubles your leverage or a personal creative milestone you have nurtured in secret. You will look back at this exact month as the turning point when you stopped apologizing for your ambitions.',
  'By this time next year, a chronic emotional or financial anxiety that has haunted the last two years will be completely neutralized. You will have built proof of your self-efficacy that nobody can talk you out of.',
  'Twelve months from today, you will operate from a position of authentic leverage. Your time will be spent on chosen priorities, supported by clear boundaries that keep low-value demands off your schedule.',
  'Over the next year, your primary focus shifts from striving for external validation to institutionalizing your own independence. You will establish systems that generate steady value with lower direct labor.',
  'In 365 days, your close circle will reflect your true caliber. You will have built trusting relationships with high-integrity peers who match your drive and offer reliable mutual support.',
  'Your one-year arc shows a clear consolidation of personal power. You will drop unrewarding projects, focus your energy on core strengths, and enjoy calm, steady progress.',
  'By next year, your workspace and personal environment will reflect your inner order. You will enjoy a clear, calm space designed for deep focus and personal peace.',
  'Within a year, an ambitious project that currently feels uncertain will be fully operational, generating steady, measurable progress.',
  'Twelve months ahead, you will handle high-stress situations with ease. Challenges that used to drain your energy will be resolved quickly using simple, proven habits.',
  'Your trajectory over the next 12 months features significant financial simplification. You will eliminate hidden leaks, build reserves, and invest with long-term clarity.',
  'In one year, your public reputation will align with your actual abilities. You will be recognized for your quiet consistency rather than superficial self-promotion.',
  'By this time next year, your relationships will be marked by absolute honesty. Boundary conversations will be handled smoothly, creating clear mutual respect with those around you.',
  'Your 12-month outlook brings a major reduction in daily background stress. You will move at a steady, deliberate pace that yields superior long-term results.',
  'Within one year, you will master the art of deliberate rest. You will take guilt-free downtime, knowing your core systems run reliably in the background.',
  'A year from now, an old self-limiting belief will be completely replaced by real-world wins, giving you clear confidence in your execution.',
  'In 12 months, your income channels will be more diversified, reducing reliance on any single entity and providing strong personal sovereignty.',
  'By next year, you will possess a clear personal knowledge library and process framework, allowing you to produce high-quality work in half the time.',
  'Your one-year arc secures a lasting upgrade in health and vitality. Energy crashes will be replaced by reliable daily stamina.',
  'Twelve months from now, you will look back on today’s concerns with calm satisfaction, seeing clearly how every piece fit into your long-term growth.'
  
];

const FIVE_YEAR_LEGACIES = [
  'Your 5-year arc is defined by sovereignty. You are not building for temporary validation; you are constructing generational stability and intellectual freedom. People will look to you as the anchor who changed the trajectory of your lineage.',
  'In five years, you will be operating in your zone of genius with zero tolerance for busywork. You will mentor others through the exact labyrinths that once felt impassable to you.',
  'Your long-term footprint is one of quiet impact and undeniable reputation. You will own your time, command respect across your domain, and inhabit a home environment filled with peace, beauty, and emotional security.',
  "In five years, you will have built a life that requires far less recovery time than the one you're currently living.",
  "Your 5-year arc includes becoming the person others in your circle quietly model their own decisions after.",
  "Five years out, a skill you're building today almost invisibly will have become one of the primary ways people recognize your value.",
  "Your long-term trajectory shows a home, physical or emotional, that finally matches the peace you've been working toward.",
  "In five years, the version of you reading this today will feel like an earlier chapter, not a stranger.",
  "Your 5-year legacy includes having said no to enough wrong opportunities that the right ones had room to arrive.",
  "Five years from now, you will have mentored or supported someone through the exact struggle you once faced alone.",
  "Your long-term footprint includes a body of work or relationships built slowly enough that none of it needs to be undone later.",
  "In five years, the discipline you're building now will feel less like effort and simply like who you are.",
  "Your 5-year arc shows a clear, hard-won distinction between the things worth your energy and the things that only used to seem that way.",
  'Your 5-year arc is defined by sovereignty. You are not building for temporary validation; you are constructing generational stability and intellectual freedom. People will look to you as the anchor who changed the trajectory of your lineage.',
  'In five years, you will be operating in your zone of genius with zero tolerance for busywork. You will mentor others through the exact labyrinths that once felt impassable to you.',
  'Your long-term footprint is one of quiet impact and undeniable reputation. You will own your time, command respect across your domain, and inhabit a home environment filled with peace, beauty, and emotional security.',
  'Five years out, you will have built an independent infrastructure that funds your life without requiring your constant presence. Your creative and financial freedom will be secured.',
  'Your half-decade trajectory establishes a lasting sanctuary. You will own a calm, beautifully curated environment that shields your peace and hosts meaningful gatherings for your inner circle.',
  'In five years, you will be recognized as an expert voice in your field, sought out for strategic clarity rather than operational labor.',
  'Your 5-year legacy is a model of balanced living. You will demonstrate that significant career success and deep internal peace can coexist cleanly without burn-out.',
  'Over the next five years, you will build a protective shield around your family and community, providing strategic guidance and safety across generations.',
  'Five years from today, your choices will be driven purely by genuine interest rather than financial pressure. You will pursue work solely because it sparks your curiosity.',
  'Your long-term arc shows a complete evolution from surviving under pressure to shaping your domain. You will design the rules of the spaces you choose to inhabit.',
  'In five years, you will hold an enviable portfolio of physical and intellectual assets, built quietly through steady, compounding execution.',
  'Your 5-year footprint features a clear body of work—a published asset, established venture, or lasting institution—that continues to help others independently.',
  'Five years forward, you will move through the world with calm self-assurance. Having mastered your domain, you no longer need to prove your worth to anyone.',
  'Your long-term future features exceptional health, sharp cognitive focus, and physical strength, built on years of steady, intentional self-care.',
  'In five years, you will lead a trusted network of high-caliber peers who pool resources, connections, and insights to build enduring value together.',
  'Your 5-year legacy is defined by personal freedom. You will have full control over your schedule, location, and key pursuits.',
  'Five years out, you will have turned your past challenges into a practical, step-by-step framework that guides others through their own hurdles.',
  'Your half-decade outlook features absolute alignment between your daily activities and core values. Internal friction will be fully resolved.',
  'In five years, your primary life stress will be choosing which high-value opportunity to pursue next among many good options.',
  'Your 5-year arc sets a clear standard for those who follow you, proving that true power lies in calm composure, integrity, and quiet focus.',

];

const GOLDEN_RULES = [
  'Never shrink yourself in rooms where your light makes insecure people squint. Find bigger rooms.',
  'Protect your morning peace as fiercely as you protect your bank account. How you treat your first hour dictates how the world treats your day.',
  'Do not trade long-term respect for short-term peace. Speak the boundary early while it is small.',
  'Your value is not measured by how much exhaustion you can endure. Rest is a strategic weapon.',
  "Do not confuse urgency from others with actual importance to you. Check the source before you check the clock.",
  "Say the uncomfortable thing early, while it's still small. Delay only makes the eventual conversation heavier.",
  "Guard your first hour and your last hour of the day; how you open and close it shapes everything between.",
  "Trust actions repeated over time far more than promises made once under pressure.",
  "Let silence do some of your negotiating. Not every gap needs to be filled by you.",
  "Choose depth with fewer people over performance for a wider audience.",
  "Release the need to be understood by everyone; being understood by the right few is enough.",
  "Treat every boundary you set as a data point others will use to calibrate how to treat you going forward.",
  "Spend your best energy on your hardest, most important task first, not your easiest one.",
  "When someone shows you who they are under pressure, believe that version over the polished one.",
  'Do not trade long-term respect for short-term peace. Speak the boundary early while it is small.',
  'Your value is not measured by how much exhaustion you can endure. Rest is a strategic weapon.',
  'Never explain yourself to people who are committed to misunderstanding you. Save your breath for building.',
  'When in doubt, slow down your physical responses. Speed in emotional moments gives away your power.',
  'Do not build your life on the opinions of people you would never go to for advice.',
  'If a commitment costs you your peace of mind, it is too expensive. Walk away quietly.',
  'Make decisions based on where you want to be in five years, not where your emotions are stuck right now.',
  'Never let your desire for community force you into lowering your standards for companionship.',
  'The most effective counter to disrespect is unshakeable self-respect and immediate distance.',
  'Measure your success by the daily peace of your mind and the quality of your sleep, not just external milestones.',
  'Treat your attention as your most valuable financial currency. Do not spend it on low-value outrage.',
  'Always keep a private reserve of energy, capital, and planning. Never reveal 100% of your strategy.',
  'Speak with clarity, act with speed, and leave no room for ongoing debate regarding your core boundaries.',
  'Forgive past mistakes quickly, but adjust your structural boundaries permanently based on real behavior.',
  'The goal is not to be liked by everyone; the goal is to be respected by those who matter and feared by those who exploit.',
  'Never allow urgent minor tasks from others to push your important long-term goals off the schedule.',
  'Build your self-worth on your daily discipline rather than transient external praise.',
  'When you feel the urge to over-explain, cut your response by half and stop speaking.'
];

export const WHAT_TOMORROW_HOLDS_POOL = [
  'A small win finds you before the day is done, arriving without any fanfare.',
  'Someone\'s words land differently than you expect today, softening an old assumption.',
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
  'An unexpected message will validate a decision you made in private weeks ago.',
  'You will catch yourself handling a tricky situation far more smoothly than you would have last year.',
  'A simple physical adjustment—a walk, stretching, or deep breath—will instantly clear mental fatigue.',
  'An insight will strike you during an ordinary task, clarifying a complex plan.',
  'You will effortlessly pass on a low-value distraction without a second thought.',
  'A quiet evening moment brings a sense of deep satisfaction with your current direction.',
  'Someone will express genuine gratitude for a small piece of advice you offered long ago.',
  'You will spot an efficient shortcut in a routine process, saving useful time going forward.',
  'A sense of steady control replaces any lingering morning hesitation by early afternoon.',
  'You will realize that a situation you once found intimidating has become second nature.',
  'A brief interaction with a stranger leaves you with a warm, grounded energy.',
  'Your focus will lock in effortlessly today, allowing you to complete meaningful deep work.',
  'A boundary you hold firmly today will earn you lasting respect from key peers.',
  'You will enjoy a peaceful night of deep rest, knowing you managed your day with balance.',
  "A conversation you've been avoiding will feel far easier once you actually start it.",
  "Something you organized quietly last week will make today noticeably smoother.",
  "You will feel less need to justify a choice that others questioned earlier.",
  "A small act of kindness you extend today will be remembered longer than you expect.",
  "Your patience with a slow process will be rewarded sooner than the timeline suggested.",
  "An old tension will lose its charge the moment you stop feeding it attention.",
  "You will find unexpected ease in a task that felt heavier yesterday.",
  "A brief pause before responding today will prevent a misunderstanding before it starts.",
  "Someone will notice effort you thought had gone completely unseen.",
  "You will end the day with a quiet sense that you handled it well, even the messy parts.",
  
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


