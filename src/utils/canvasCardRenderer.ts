import { AnyReadingResult, CardAspect, ThemePreset } from '../types';

interface ThemeColors {
  bgGradient: string[];
  cardBg: string;
  cardBorder: string;
  accent: string;
  accentLight: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  scoreGlow: string;
  badgeBg: string;
  badgeText: string;
}

const THEMES: Record<ThemePreset, ThemeColors> = {
  midnight: {
    bgGradient: ['#0d060f', '#1c0d18', '#070208'],
    cardBg: 'rgba(30, 13, 25, 0.85)',
    cardBorder: 'rgba(255, 59, 119, 0.4)',
    accent: '#FF3B77',
    accentLight: '#FF80AC',
    textPrimary: '#ffffff',
    textSecondary: '#FFA3C4',
    textMuted: '#FF1F60',
    scoreGlow: 'rgba(255, 59, 119, 0.55)',
    badgeBg: 'rgba(255, 59, 119, 0.2)',
    badgeText: '#FF80AC',
  },
  cyber: {
    bgGradient: ['#090514', '#130c2e', '#030208'],
    cardBg: 'rgba(23, 14, 48, 0.8)',
    cardBorder: 'rgba(168, 85, 247, 0.3)',
    accent: '#c084fc',
    accentLight: '#e9d5ff',
    textPrimary: '#ffffff',
    textSecondary: '#d8b4fe',
    textMuted: '#7e22ce',
    scoreGlow: 'rgba(192, 132, 252, 0.5)',
    badgeBg: 'rgba(168, 85, 247, 0.2)',
    badgeText: '#e9d5ff',
  },
  luxury: {
    bgGradient: ['#12100e', '#231d17', '#080706'],
    cardBg: 'rgba(38, 32, 25, 0.8)',
    cardBorder: 'rgba(234, 179, 8, 0.3)',
    accent: '#eab308',
    accentLight: '#fef08a',
    textPrimary: '#ffffff',
    textSecondary: '#fef3c7',
    textMuted: '#854d0e',
    scoreGlow: 'rgba(234, 179, 8, 0.45)',
    badgeBg: 'rgba(234, 179, 8, 0.15)',
    badgeText: '#fde047',
  },
  sunset: {
    bgGradient: ['#18080c', '#2c0e14', '#0d0406'],
    cardBg: 'rgba(48, 16, 23, 0.8)',
    cardBorder: 'rgba(255, 59, 119, 0.35)',
    accent: '#FF3B77',
    accentLight: '#fed7aa',
    textPrimary: '#ffffff',
    textSecondary: '#ffedd5',
    textMuted: '#FF1F60',
    scoreGlow: 'rgba(255, 59, 119, 0.5)',
    badgeBg: 'rgba(255, 59, 119, 0.2)',
    badgeText: '#FF80AC',
  },
  emerald: {
    bgGradient: ['#03140d', '#08261a', '#020a06'],
    cardBg: 'rgba(9, 36, 25, 0.85)',
    cardBorder: 'rgba(16, 185, 129, 0.38)',
    accent: '#10b981',
    accentLight: '#6ee7b7',
    textPrimary: '#ffffff',
    textSecondary: '#a7f3d0',
    textMuted: '#059669',
    scoreGlow: 'rgba(16, 185, 129, 0.55)',
    badgeBg: 'rgba(16, 185, 129, 0.2)',
    badgeText: '#6ee7b7',
  },
  ocean: {
    bgGradient: ['#03101c', '#082138', '#02080f'],
    cardBg: 'rgba(8, 33, 56, 0.85)',
    cardBorder: 'rgba(56, 189, 248, 0.38)',
    accent: '#38bdf8',
    accentLight: '#bae6fd',
    textPrimary: '#ffffff',
    textSecondary: '#7dd3fc',
    textMuted: '#0284c7',
    scoreGlow: 'rgba(56, 189, 248, 0.55)',
    badgeBg: 'rgba(56, 189, 248, 0.2)',
    badgeText: '#bae6fd',
  },
  crimson: {
    bgGradient: ['#190408', '#2e0711', '#0d0205'],
    cardBg: 'rgba(46, 8, 18, 0.85)',
    cardBorder: 'rgba(244, 63, 94, 0.38)',
    accent: '#f43f5e',
    accentLight: '#fecdd3',
    textPrimary: '#ffffff',
    textSecondary: '#fda4af',
    textMuted: '#be123c',
    scoreGlow: 'rgba(244, 63, 94, 0.55)',
    badgeBg: 'rgba(244, 63, 94, 0.2)',
    badgeText: '#fecdd3',
  },
  obsidian: {
    bgGradient: ['#0c0c0d', '#18181b', '#060607'],
    cardBg: 'rgba(28, 28, 32, 0.88)',
    cardBorder: 'rgba(255, 255, 255, 0.28)',
    accent: '#f4f4f5',
    accentLight: '#ffffff',
    textPrimary: '#ffffff',
    textSecondary: '#e4e4e7',
    textMuted: '#71717a',
    scoreGlow: 'rgba(255, 255, 255, 0.4)',
    badgeBg: 'rgba(255, 255, 255, 0.15)',
    badgeText: '#f4f4f5',
  },
};

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  if (!text) return y;
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
  return currentY + lineHeight;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export function renderCardToCanvas(
  result: AnyReadingResult,
  aspect: CardAspect = 'story',
  themePreset: ThemePreset = 'midnight'
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const width = 1080;
  const height = aspect === 'story' ? 1920 : 1080;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const theme = THEMES[themePreset] || THEMES.midnight;

  // 1. Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, theme.bgGradient[0]);
  bgGrad.addColorStop(0.5, theme.bgGradient[1]);
  bgGrad.addColorStop(1, theme.bgGradient[2]);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Decorative Ambient Radial Glows
  const glow1 = ctx.createRadialGradient(width * 0.5, height * 0.28, 40, width * 0.5, height * 0.28, 420);
  glow1.addColorStop(0, theme.scoreGlow);
  glow1.addColorStop(1, 'transparent');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, width, height);

  const glow2 = ctx.createRadialGradient(width * 0.2, height * 0.8, 20, width * 0.2, height * 0.8, 350);
  glow2.addColorStop(0, theme.scoreGlow);
  glow2.addColorStop(1, 'transparent');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, width, height);

  // 3. Subtle background stars / particles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  const particleSeeds = [
    [120, 240, 3], [890, 320, 2], [940, 1100, 3], [140, 1400, 2],
    [320, 800, 2], [760, 780, 3], [840, 1600, 2], [220, 1750, 3]
  ];
  particleSeeds.forEach(([px, py, pr]) => {
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  });

  const padX = 80;
  let cursorY = aspect === 'story' ? 140 : 80;

  // Header Title & Tagline
  ctx.textAlign = 'center';
  ctx.font = '700 32px "Syne", sans-serif';
  ctx.fillStyle = theme.accentLight;

  if (result.testType === 'fortune') {
    ctx.fillText('🔮 FORTUNE TELLER READING', width / 2, cursorY);
  } else if (result.testType === 'circle') {
    ctx.fillText('👥 CIRCLE CHECK • PLATONIC & KINSHIP', width / 2, cursorY);
    cursorY += 36;
    ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = theme.textSecondary;
    ctx.fillText(`${result.relationshipType.toUpperCase()} BOND FORENSIC AUDIT`, width / 2, cursorY);
  } else {
    ctx.fillText('🔥 FLAME COMPATIBILITY READING', width / 2, cursorY);
    cursorY += 36;
    ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = theme.textSecondary;
    ctx.fillText('CONFIDENTIAL PSYCHOLOGICAL MATCH REPORT', width / 2, cursorY);
  }

  cursorY += aspect === 'story' ? 70 : 45;

  // Names / Subject Box
  const namesBoxWidth = width - padX * 2;
  const namesBoxHeight = aspect === 'story' ? 146 : 120;
  
  ctx.fillStyle = theme.cardBg;
  drawRoundedRect(ctx, padX, cursorY, namesBoxWidth, namesBoxHeight, 28);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = theme.cardBorder;
  ctx.stroke();

  const namesCenterY = cursorY + namesBoxHeight / 2;
  const maxAllowedWidth = namesBoxWidth - 60;

  ctx.fillStyle = theme.textPrimary;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (result.testType === 'fortune') {
    // Fortune teller: Full Name + Subtitle with adaptive font sizing
    let nameFontSize = aspect === 'story' ? 38 : 32;
    ctx.font = `800 ${nameFontSize}px "Syne", "Outfit", sans-serif`;
    while (ctx.measureText(result.fullName).width > maxAllowedWidth && nameFontSize > 16) {
      nameFontSize -= 1;
      ctx.font = `800 ${nameFontSize}px "Syne", "Outfit", sans-serif`;
    }
    ctx.fillText(result.fullName, width / 2, namesCenterY);
  } else {
    const p1 = result.testType === 'circle' ? result.yourName : result.name1;
    const p2 = result.testType === 'circle' ? result.theirName : result.name2;
    const icon = result.testType === 'circle' ? '🤝' : '❤️';
    const displayNames = `${p1}  ${icon}  ${p2}`;

    // Test single line first with progressive font reduction
    let singleLineFontSize = aspect === 'story' ? 36 : 30;
    ctx.font = `800 ${singleLineFontSize}px "Syne", "Outfit", sans-serif`;
    while (ctx.measureText(displayNames).width > maxAllowedWidth && singleLineFontSize > 20) {
      singleLineFontSize -= 1;
      ctx.font = `800 ${singleLineFontSize}px "Syne", "Outfit", sans-serif`;
    }

    if (ctx.measureText(displayNames).width <= maxAllowedWidth && singleLineFontSize >= 20) {
      // Fits on one line cleanly
      ctx.fillText(displayNames, width / 2, namesCenterY);
    } else {
      // Split into two balanced lines with adaptive font sizing so neither line overflows or clips
      let twoLineSize = aspect === 'story' ? 28 : 22;
      ctx.font = `800 ${twoLineSize}px "Syne", "Outfit", sans-serif`;
      const line2Text = `${icon}  ${p2}`;
      while (
        (ctx.measureText(p1).width > maxAllowedWidth || ctx.measureText(line2Text).width > maxAllowedWidth) &&
        twoLineSize > 14
      ) {
        twoLineSize -= 1;
        ctx.font = `800 ${twoLineSize}px "Syne", "Outfit", sans-serif`;
      }
      const lineSpacing = Math.round(twoLineSize * 1.35);
      ctx.fillText(p1, width / 2, namesCenterY - Math.round(lineSpacing * 0.44));
      ctx.fillText(line2Text, width / 2, namesCenterY + Math.round(lineSpacing * 0.56));
    }
  }

  ctx.textBaseline = 'alphabetic';
  cursorY += namesBoxHeight + (aspect === 'story' ? 65 : 35);


  // Big Score Circle / Center Emblem
  const circleRadius = aspect === 'story' ? 140 : 105;
  const centerX = width / 2;
  const centerY = cursorY + circleRadius;

  // Background Ring
  ctx.beginPath();
  ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
  ctx.lineWidth = 14;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.stroke();

  if (result.testType === 'fortune') {
    // Emblem for fortune teller
    ctx.beginPath();
    ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
    ctx.lineWidth = 8;
    ctx.strokeStyle = theme.cardBorder;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = `${aspect === 'story' ? 68 : 52}px "Outfit", sans-serif`;
    ctx.fillText('🔮', centerX, centerY - 8);

    ctx.font = '800 22px "Syne", sans-serif';
    ctx.fillStyle = theme.accentLight;
    ctx.fillText('SOVEREIGN ESSENCE', centerX, centerY + 42);
  } else {
    // Active Score Ring for Flame & Circle
    const scoreVal = result.score;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (Math.PI * 2 * (scoreVal / 100));
    ctx.beginPath();
    ctx.arc(centerX, centerY, circleRadius, startAngle, endAngle);
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.strokeStyle = theme.accent;
    ctx.stroke();

    ctx.font = '900 82px "Syne", "Outfit", sans-serif';
    ctx.fillStyle = theme.textPrimary;
    ctx.fillText(`${scoreVal}%`, centerX, centerY + 24);
  }

  cursorY = centerY + circleRadius + (aspect === 'story' ? 50 : 35);

  // Tier Title Badge
  let tierText = '';
  let archText = '';

  if (result.testType === 'fortune') {
    tierText = `Archetype: ${result.archetype.title}`;
    archText = result.archetype.essence;
  } else if (result.testType === 'circle') {
    tierText = result.tierTitle || 'Kinship Resonance Match';
    archText = `Bond Archetype: ${result.platonicArchetype.title}`;
  } else {
    tierText = result.tierTitle || 'Soul Resonance Match';
    archText = result.archetype?.title || 'Psychological Dynamic';
  }

  let tierFontSize = aspect === 'story' ? 32 : 26;
  ctx.font = `700 ${tierFontSize}px "Plus Jakarta Sans", sans-serif`;
  const tierW = ctx.measureText(tierText).width;
  if (tierW > width - 160) {
    tierFontSize = Math.floor(tierFontSize * ((width - 160) / tierW));
    ctx.font = `700 ${tierFontSize}px "Plus Jakarta Sans", sans-serif`;
  }
  ctx.fillStyle = theme.accentLight;
  ctx.fillText(tierText, width / 2, cursorY);

  cursorY += aspect === 'story' ? 45 : 25;

  // The Viral Quote / Teaser Card
  const quoteBoxWidth = width - padX * 2;
  const quoteBoxHeight = aspect === 'story' ? 310 : 210;

  ctx.fillStyle = theme.cardBg;
  drawRoundedRect(ctx, padX, cursorY, quoteBoxWidth, quoteBoxHeight, 28);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = theme.cardBorder;
  ctx.stroke();

  // Quote badge header
  const quoteBadgeY = cursorY + 44;
  ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = theme.badgeText;
  const badgeTitle = result.testType === 'fortune' ? 'PERSONAL INSIGHT TEASER' : result.testType === 'circle' ? 'BOND DYNAMIC TEASER' : 'SHARP TRUTH TEASER';
  ctx.fillText(badgeTitle, width / 2, quoteBadgeY);

  // Quote body text
  ctx.textAlign = 'center';
  ctx.font = aspect === 'story' ? '600 26px "Plus Jakarta Sans", sans-serif' : '600 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = theme.textSecondary;

  const quoteStartY = quoteBadgeY + 45;
  wrapText(ctx, `"${result.freeTeaser || 'Unspoken truth waiting to be uncovered.'}"`, width / 2, quoteStartY, quoteBoxWidth - 60, aspect === 'story' ? 40 : 34);

  cursorY += quoteBoxHeight + (aspect === 'story' ? 50 : 30);

  // Story Mode: Add Metric Bars or Key Foresight Highlights
  if (aspect === 'story') {
    const barBoxWidth = width - padX * 2;

    if (result.testType === 'fortune') {
      const highlights = [
        { label: 'Core Strength', val: result.coreStrength.title },
        { label: 'Next 3-Month Phase', val: result.nextThreeMonths.phase },
        { label: 'Hidden Advantage', val: result.hiddenAdvantage.superpower },
      ];
      highlights.forEach((h, idx) => {
        const my = cursorY + idx * 64;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        drawRoundedRect(ctx, padX, my, barBoxWidth, 54, 16);
        ctx.fill();

        ctx.textAlign = 'left';
        ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = theme.textSecondary;
        ctx.fillText(h.label, padX + 24, my + 34);

        ctx.textAlign = 'right';
        ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = theme.textPrimary;
        ctx.fillText(h.val, padX + barBoxWidth - 24, my + 34);
      });
      cursorY += 64 * 3;
    } else {
      const metrics = result.testType === 'circle'
        ? [
            { label: 'Mutual Trust & Loyalty', val: Math.min(99, result.score + 2) },
            { label: 'Communication Ease', val: Math.min(99, result.score - 4) },
            { label: 'Shared Values & Chemistry', val: Math.min(99, result.score + 1) },
            { label: 'Survival Forecast', val: result.survivalForecast.probability },
          ]
        : [
            { label: 'Chemistry & Passion', val: result.metrics?.physical ?? 85 },
            { label: 'Emotional Resonance', val: result.metrics?.emotional ?? 80 },
            { label: 'Communication Balance', val: result.metrics?.conflictResolution ?? 72 },
            { label: 'Longevity Forecast', val: result.longevity?.score ?? 78 },
          ];

      metrics.forEach((m, idx) => {
        const my = cursorY + idx * 56;
        ctx.textAlign = 'left';
        ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fillText(m.label, padX + 10, my);

        ctx.textAlign = 'right';
        ctx.fillStyle = theme.accentLight;
        ctx.fillText(`${m.val}%`, width - padX - 10, my);

        // Track
        const trackY = my + 12;
        const trackW = barBoxWidth - 20;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        drawRoundedRect(ctx, padX + 10, trackY, trackW, 8, 4);
        ctx.fill();

        // Fill
        const fillW = Math.max(12, (trackW * m.val) / 100);
        ctx.fillStyle = theme.accent;
        drawRoundedRect(ctx, padX + 10, trackY, fillW, 8, 4);
        ctx.fill();
      });
      cursorY += 56 * 4;
    }
  }

  // Footer Watermark & Call to Action
  const footerY = height - (aspect === 'story' ? 55 : 24);
  ctx.textAlign = 'center';
  ctx.font = '700 22px "Syne", sans-serif';
  ctx.fillStyle = theme.textPrimary;
  const siteUrl = result.testType === 'fortune' ? 'flame-love.app/fortune' : result.testType === 'circle' ? 'flame-love.app/circle' : 'flame-love.app';
  ctx.fillText(`Find your reading at  ${siteUrl}`, width / 2, footerY);

  return canvas;
}

export function downloadCardImage(canvas: HTMLCanvasElement, filename: string = 'flame-love-reading.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export async function getCardBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png');
  });
}
