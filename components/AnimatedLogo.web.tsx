/**
 * Web-версия AnimatedLogo.
 * Загружает PNG рук, убирает белый фон через Canvas API,
 * затем крутит результат через CSS-анимацию.
 */
import React, { useEffect, useRef } from 'react';

interface AnimatedLogoProps {
  size?: number;
  duration?: number;
  style?: React.CSSProperties;
}

// Inject CSS keyframe once
let _keyframesInjected = false;
function ensureKeyframes() {
  if (_keyframesInjected || typeof document === 'undefined') return;
  _keyframesInjected = true;
  const el = document.createElement('style');
  el.textContent = `
    @keyframes sz-spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(el);
}

export function AnimatedLogo({ size = 120, duration = 9000, style }: AnimatedLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    ensureKeyframes();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new window.Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;

      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        // Убираем пиксели близкие к белому
        if (r > 215 && g > 215 && b > 215) {
          // Плавный переход на краях
          const whiteness = Math.min(r, g, b) / 255;
          d[i + 3] = Math.round((1 - whiteness) * 80);
        }
      }
      ctx.putImageData(imgData, 0, 0);
    };

    // В Expo web webpack отдаёт PNG как URL-строку
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const src = require('@/assets/images/logo-hands-gold-trimmed.png');
    img.src = typeof src === 'string' ? src : (src?.uri ?? src?.default ?? '');
  }, []);

  const handsSize = Math.round(size * 0.78);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.22),
        backgroundColor: '#0F1E38',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: handsSize,
          height: handsSize,
          animation: `sz-spin ${duration}ms linear infinite`,
        }}
      />
    </div>
  );
}
