import React, { useEffect, useRef, useState } from 'react';
import { CardAspect, CompatibilityResult, ThemePreset } from '../types';
import {
  downloadCardImage,
  getCardBlob,
  renderCardToCanvas,
} from '../utils/canvasCardRenderer';
import {
  X,
  Download,
  Share2,
  Check,
  Copy,
  Smartphone,
  Sparkles,
  MessageCircle,
} from 'lucide-react';

interface ShareCardModalProps {
  result: CompatibilityResult;
  isOpen: boolean;
  onClose: () => void;
}

const THEME_OPTIONS: { id: ThemePreset; name: string; color: string }[] = [
  { id: 'midnight', name: 'Vibrant Magenta', color: '#FF3B77' },
  { id: 'cyber', name: 'Cyber Neon', color: '#c084fc' },
  { id: 'luxury', name: 'Luxury Gold', color: '#FFD166' },
  { id: 'sunset', name: 'Sunset Warmth', color: '#FF80AC' },
];

export const ShareCardModal: React.FC<ShareCardModalProps> = ({ result, isOpen, onClose }) => {
  const [aspect, setAspect] = useState<CardAspect>('story');
  const [theme, setTheme] = useState<ThemePreset>('midnight');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Redraw canvas whenever modal opens, aspect or theme changes
  useEffect(() => {
    if (!isOpen || !result) return;

    let isMounted = true;

    const render = () => {
      try {
        const rendered = renderCardToCanvas(result, aspect, theme);
        if (!isMounted) return;
        canvasRef.current = rendered;
        const dataUrl = rendered.toDataURL('image/png');
        setPreviewDataUrl(dataUrl);
      } catch (err) {
        console.error('Error rendering card canvas:', err);
      }
    };

    render();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (isMounted) render();
      });
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, result, aspect, theme]);

  if (!isOpen) return null;

  const handleDownload = () => {
    let canvas = canvasRef.current;
    if (!canvas && result) {
      canvas = renderCardToCanvas(result, aspect, theme);
      canvasRef.current = canvas;
    }
    if (!canvas) return;
    const filename = `flame-${(result.name1 || 'partner1').toLowerCase()}-${(result.name2 || 'partner2').toLowerCase()}-${aspect}.png`;
    downloadCardImage(canvas, filename);
    setStatusNotice('generic_downloaded');
  };

  const handleCopyLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('n1', result.name1);
    url.searchParams.set('n2', result.name2);
    url.searchParams.set('st', result.relationshipStatus);

    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  // Shares the actual generated image file so WhatsApp/Instagram opens with the image attached
  const handleShareImage = async (forWhatsApp: boolean = false) => {
    let canvas = canvasRef.current;
    if (!canvas && result) {
      canvas = renderCardToCanvas(result, aspect, theme);
      canvasRef.current = canvas;
    }
    if (!canvas) return;
    setIsGenerating(true);
    setStatusNotice(null);

    try {
      const blob = await getCardBlob(canvas);
      const filename = `flame-${(result.name1 || 'partner1').toLowerCase()}-${(result.name2 || 'partner2').toLowerCase()}-score.png`;

      // If browser supports sharing image files (Android Chrome, iOS Safari, etc.)
      if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], filename, { type: 'image/png' })] })) {
        const file = new File([blob], filename, { type: 'image/png' });
        await navigator.share({
          title: `${result.name1} & ${result.name2} Compatibility Score`,
          text: `🔥 ${result.name1} & ${result.name2} scored ${result.score}% on Flame! Test your partner: ${window.location.href}`,
          files: [file],
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3500);
      } else {
        // Fallback for desktop / browsers that do not support navigator.share with files:
        // 1. Download the high-res PNG image directly
        downloadCardImage(canvas, filename);

        // 2. Try copying image blob to clipboard
        if (blob && navigator.clipboard && window.ClipboardItem) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
          } catch {
            // ignore clipboard errors
          }
        }

        // 3. Show friendly instruction banner
        setStatusNotice(forWhatsApp ? 'whatsapp_downloaded' : 'generic_downloaded');
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.log('Share canceled or error:', err);
        handleDownload();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-[#E7E2D9] rounded-2xl p-6 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>Story & WhatsApp Export</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-editorial">
            Shareable Result Card
          </h3>
          <p className="text-xs text-stone-500">
            Formatted to look elegant on Instagram Stories, Snapchat, and WhatsApp Status.
          </p>
        </div>

        {/* Controls: Aspect & Theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {/* Aspect Ratio */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
              Card Dimensions
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setAspect('story')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                  aspect === 'story'
                    ? 'bg-rose-50 border-rose-500 text-rose-800 ring-1 ring-rose-400'
                    : 'bg-[#FAF8F5] border-[#E7E2D9] text-stone-600 hover:text-stone-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Story (9:16)</span>
              </button>
              <button
                onClick={() => setAspect('square')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                  aspect === 'square'
                    ? 'bg-rose-50 border-rose-500 text-rose-800 ring-1 ring-rose-400'
                    : 'bg-[#FAF8F5] border-[#E7E2D9] text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>Square (1:1)</span>
              </button>
            </div>
          </div>

          {/* Theme Palette */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
              Card Style Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {THEME_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 cursor-pointer ${
                    theme === t.id
                      ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-xs ring-1 ring-rose-300'
                      : 'bg-[#FAF8F5] border-[#E7E2D9] text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="truncate">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Canvas Preview Container */}
        <div className="p-3 rounded-xl bg-stone-100 border border-[#E7E2D9] flex items-center justify-center mb-5 min-h-[300px]">
          {previewDataUrl ? (
            <img
              src={previewDataUrl}
              alt={`${result.name1} & ${result.name2} Compatibility Card`}
              className="w-auto max-w-full h-auto max-h-[52vh] rounded-xl shadow-md border border-[#E7E2D9] object-contain mx-auto transition-all"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-stone-500 gap-2">
              <Sparkles className="w-6 h-6 animate-spin text-rose-500" />
              <span className="text-xs font-medium">Generating high-resolution card...</span>
            </div>
          )}
        </div>

        {/* Guidance Notice if Device Doesn't Support Direct File Tray */}
        {statusNotice === 'whatsapp_downloaded' && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5 animate-fadeIn mb-4">
            <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-left">
              <p className="font-bold">Card image saved to your device gallery / downloads!</p>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                To post as your Status: Open WhatsApp → go to <strong>Status / Updates</strong> → tap the <strong>Camera</strong> icon to pick your card photo!
              </p>
            </div>
          </div>
        )}

        {statusNotice === 'generic_downloaded' && (
          <div className="p-3.5 rounded-xl bg-stone-100 border border-[#E7E2D9] text-stone-800 text-xs flex items-start gap-2.5 animate-fadeIn mb-4">
            <Download className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-left">
              <p className="font-bold">Card PNG downloaded to your device!</p>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                You can now upload it directly as an Instagram Story, WhatsApp Status, or send it in private chat.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            id="whatsapp-share-btn"
            onClick={() => handleShareImage(true)}
            disabled={isGenerating}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <MessageCircle className="w-4 h-4 text-emerald-200" />
            <span>{isGenerating ? 'Preparing Image...' : shareSuccess ? 'Card Sent!' : 'Share Image to WhatsApp'}</span>
          </button>

          <button
            id="native-share-btn"
            onClick={() => handleShareImage(false)}
            disabled={isGenerating}
            className="w-full py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <Share2 className="w-4 h-4 text-rose-300" />
            <span>Share Image to Story / Apps</span>
          </button>

          <button
            id="download-story-card-btn"
            onClick={handleDownload}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs flex items-center justify-center gap-2 border border-[#E7E2D9] active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-stone-600" />
            <span>Save Image (.PNG) to Gallery</span>
          </button>

          <button
            id="copy-match-link-btn"
            onClick={handleCopyLink}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center justify-center gap-2 border border-[#E7E2D9] transition-all cursor-pointer"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-500" />}
            <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy Shareable Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
