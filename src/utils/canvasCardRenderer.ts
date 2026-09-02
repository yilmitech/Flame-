import { CardAspect, CompatibilityResult, ThemePreset } from '../types';

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
  result: CompatibilityResult,
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

  // Brand Header
  ctx.textAlign = 'center';
  ctx.font = '700 32px "Syne", sans-serif';
  ctx.fillStyle = theme.accentLight;
  ctx.fillText('🔥 FLAME COMPATIBILITY READING', width / 2, cursorY);

  cursorY += 36;
  ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = theme.textSecondary;
  ctx.fillText('CONFIDENTIAL PSYCHOLOGICAL MATCH REPORT', width / 2, cursorY);

  cursorY += aspect === 'story' ? 70 : 45;

  // Names Card
  const namesBoxWidth = width - padX * 2;
  const namesBoxHeight = aspect === 'story' ? 140 : 110;
  
  ctx.fillStyle = theme.cardBg;
  drawRoundedRect(ctx, padX, cursorY, namesBoxWidth, namesBoxHeight, 28);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = theme.cardBorder;
  ctx.stroke();

  // Names Text inside box with dynamic font scaling to ensure names never get cut off
  const namesCenterY = cursorY + namesBoxHeight / 2;
  const displayNames = `${result.name1}  ❤️  ${result.name2}`;
  const maxAllowedWidth = namesBoxWidth - 60; // 860px max width inside the card box

  // Determine starting font size
  const maxFontSize = aspect === 'story' ? 36 : 30;
  let singleLineFontSize = maxFontSize;
  ctx.font = `800 ${singleLineFontSize}px "Syne", "Outfit", sans-serif`;
  let measuredWidth = ctx.measureText(displayNames).width;

  // Scale down dynamically if measured text exceeds available width
  if (measuredWidth > maxAllowedWidth) {
    // 4% extra safety buffer prevents clipping on OS font variations
    singleLineFontSize = Math.floor(maxFontSize * ((maxAllowedWidth * 0.96) / measuredWidth));
  }

  ctx.fillStyle = theme.textPrimary;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // If singleLineFontSize is at least 22px, render on one sleek centered line
  if (singleLineFontSize >= 22) {
    ctx.font = `800 ${singleLineFontSize}px "Syne", "Outfit", sans-serif`;
    ctx.fillText(displayNames, width / 2, namesCenterY);
  } else {
    // If the names are so long that a single line drops below 22px, stack onto two lines cleanly
    let twoLineSize = aspect === 'story' ? 30 : 24;
    ctx.font = `800 ${twoLineSize}px "Syne", "Outfit", sans-serif`;
    const w1 = ctx.measureText(result.name1).width;
    const w2 = ctx.measureText(`❤️  ${result.name2}`).width;
    const maxLineW = Math.max(w1, w2);
    if (maxLineW > maxAllowedWidth) {
      twoLineSize = Math.max(16, Math.floor(twoLineSize * ((maxAllowedWidth * 0.95) / maxLineW)));
    }
    ctx.font = `800 ${twoLineSize}px "Syne", "Outfit", sans-serif`;
    const lineSpacing = Math.round(twoLineSize * 1.35);
    ctx.fillText(result.name1, width / 2, namesCenterY - Math.round(lineSpacing * 0.45));
    ctx.fillText(`❤️  ${result.name2}`, width / 2, namesCenterY + Math.round(lineSpacing * 0.55));
  }

  // Reset baseline for subsequent elements
  ctx.textBaseline = 'alphabetic';

  cursorY += namesBoxHeight + (aspect === 'story' ? 70 : 40);

  // Big Score Circle / Meter
  const circleRadius = aspect === 'story' ? 140 : 105;
  const centerX = width / 2;
  const centerY = cursorY + circleRadius;

  // Background Ring
  ctx.beginPath();
  ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
  ctx.lineWidth = 14;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.stroke();

  // Active Score Ring
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (Math.PI * 2 * (result.score / 100));
  ctx.beginPath();
  ctx.arc(centerX, centerY, circleRadius, startAngle, endAngle);
  ctx.lineWidth = 16;
  ctx.lineCap = 'round';
  ctx.strokeStyle = theme.accent;
  ctx.stroke();

  // Score text inside
  ctx.font = '900 82px "Syne", "Outfit", sans-serif';
  ctx.fillStyle = theme.textPrimary;
  ctx.fillText(`${result.score}%`, centerX, centerY + 24);

  cursorY = centerY + circleRadius + (aspect === 'story' ? 50 : 35);

  // Tier Title Badge
  const tierText = result.tierTitle || 'Soul Resonance Match';
  let tierFontSize = aspect === 'story' ? 32 : 26;
  ctx.font = `700 ${tierFontSize}px "Plus Jakarta Sans", sans-serif`;
  const tierW = ctx.measureText(tierText).width;
  if (tierW > width - 160) {
    tierFontSize = Math.floor(tierFontSize * ((width - 160) / tierW));
    ctx.font = `700 ${tierFontSize}px "Plus Jakarta Sans", sans-serif`;
  }
  ctx.fillStyle = theme.accentLight;
  ctx.fillText(tierText, width / 2, cursorY);

  cursorY += 38;
  const archText = result.archetype?.title || 'Psychological Dynamic';
  let archFontSize = aspect === 'story' ? 24 : 20;
  ctx.font = `500 ${archFontSize}px "Plus Jakarta Sans", sans-serif`;
  const archW = ctx.measureText(archText).width;
  if (archW > width - 160) {
    archFontSize = Math.floor(archFontSize * ((width - 160) / archW));
    ctx.font = `500 ${archFontSize}px "Plus Jakarta Sans", sans-serif`;
  }
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText(archText, width / 2, cursorY);

  cursorY += aspect === 'story' ? 65 : 40;

  // The Viral Quote / Teaser Card
  const quoteBoxWidth = width - padX * 2;
  const quoteBoxHeight = aspect === 'story' ? 330 : 220;

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
  ctx.fillText('SHARP TRUTH TEASER', width / 2, quoteBadgeY);

  // Quote body text
  ctx.textAlign = 'center';
  ctx.font = aspect === 'story' ? '600 26px "Plus Jakarta Sans", sans-serif' : '600 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = theme.textSecondary;

  const quoteStartY = quoteBadgeY + 45;
  wrapText(ctx, `"${result.freeTeaser || 'Unspoken emotional truth between you two.'}"`, width / 2, quoteStartY, quoteBoxWidth - 60, aspect === 'story' ? 40 : 34);

  cursorY += quoteBoxHeight + (aspect === 'story' ? 60 : 35);

  // Story Mode: Add Metric Bars
  if (aspect === 'story') {
    const metricsStartY = cursorY;
    const metrics = [
      { label: 'Chemistry & Passion', val: result.metrics?.physical ?? 85 },
      { label: 'Emotional Resonance', val: result.metrics?.emotional ?? 80 },
      { label: 'Communication Balance', val: result.metrics?.conflictResolution ?? 72 },
      { label: 'Longevity Forecast', val: result.longevity?.score ?? 78 },
    ];

    const barBoxWidth = width - padX * 2;
    metrics.forEach((m, idx) => {
      const my = metricsStartY + idx * 62;
      ctx.textAlign = 'left';
      ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillText(m.label, padX + 10, my);

      ctx.textAlign = 'right';
      ctx.fillStyle = theme.accentLight;
      ctx.fillText(`${m.val}%`, width - padX - 10, my);

      // Track
      const trackY = my + 14;
      const trackW = barBoxWidth - 20;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      drawRoundedRect(ctx, padX + 10, trackY, trackW, 10, 5);
      ctx.fill();

      // Fill
      const fillW = Math.max(12, (trackW * m.val) / 100);
      ctx.fillStyle = theme.accent;
      drawRoundedRect(ctx, padX + 10, trackY, fillW, 10, 5);
      ctx.fill();
    });
  }

  // Footer Watermark & Call to Action
  const footerY = height - (aspect === 'story' ? 100 : 50);
  ctx.textAlign = 'center';
  ctx.font = '700 24px "Syne", sans-serif';
  ctx.fillStyle = theme.textPrimary;
  ctx.fillText('Find your match score at  flame-love.app', width / 2, footerY);

  ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillText('Tag @flame.reading to get featured • Share on WhatsApp & IG Story', width / 2, footerY + 30);

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
