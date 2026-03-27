/**
 * Создаёт иконку приложения без названия: обрезает верхнюю часть (символ),
 * перекрашивает логотип в чёрный на navy-фоне, сохраняет квадрат для окна в «О приложении».
 * Запуск: node scripts/create-logo-icon.mjs
 */
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NAVY = { r: 0x2A, g: 0x34, b: 0x41 };
const BLACK = { r: 0, g: 0, b: 0 };
const BG_THRESHOLD = 80;   // ниже = считаем фоном (navy/dark)
const FG_THRESHOLD = 90;   // выше = считаем передним планом (логотип) → в чёрный

async function createLogoIcon(inputPath, outputPath) {
  const img = sharp(inputPath);
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Берём только верхнюю половину (обычно там символ, без текста)
  const cropHeight = Math.floor(height * 0.5);
  const cropped = sharp(data, { raw: { width, height: cropHeight, channels } })
    .extract({ left: 0, top: 0, width, height: cropHeight });

  const { data: cropData, info: cropInfo } = await cropped.raw().toBuffer({ resolveWithObject: true });
  const w = cropInfo.width;
  const h = cropInfo.height;

  for (let i = 0; i < cropData.length; i += channels) {
    const r = cropData[i];
    const g = cropData[i + 1];
    const b = cropData[i + 2];
    const a = channels === 4 ? cropData[i + 3] : 255;
    const isBg = r <= BG_THRESHOLD && g <= BG_THRESHOLD && b <= BG_THRESHOLD;
    const isFg = (r >= FG_THRESHOLD || g >= FG_THRESHOLD || b >= FG_THRESHOLD) && a > 20;
    if (isBg) {
      cropData[i] = NAVY.r;
      cropData[i + 1] = NAVY.g;
      cropData[i + 2] = NAVY.b;
      if (channels === 4) cropData[i + 3] = 255;
    } else if (isFg) {
      cropData[i] = BLACK.r;
      cropData[i + 1] = BLACK.g;
      cropData[i + 2] = BLACK.b;
      if (channels === 4) cropData[i + 3] = 255;
    }
    // остальное (полутона) — тоже в чёрный для чёткого силуэта
    else if (a > 20) {
      cropData[i] = BLACK.r;
      cropData[i + 1] = BLACK.g;
      cropData[i + 2] = BLACK.b;
      if (channels === 4) cropData[i + 3] = 255;
    }
  }

  const side = Math.max(w, h);
  const extended = await sharp(cropData, { raw: { width: w, height: h, channels } })
    .extend({
      top: Math.floor((side - h) / 2),
      bottom: Math.ceil((side - h) / 2),
      left: Math.floor((side - w) / 2),
      right: Math.ceil((side - w) / 2),
      background: { r: NAVY.r, g: NAVY.g, b: NAVY.b, alpha: 1 },
    })
    .png()
    .toBuffer();

  await sharp(extended).resize(512, 512).png().toFile(outputPath);
  console.log('Written:', outputPath);
}

const root = path.join(__dirname, '..');
const assets = path.join(root, 'assets', 'images');
const input = path.join(assets, 'logo-about.png');
const output = path.join(assets, 'logo-icon.png');

try {
  await createLogoIcon(input, output);
} catch (e) {
  console.warn('Fallback to source:', e.message);
  await createLogoIcon(path.join(assets, 'logo-about-source.png'), output);
}
console.log('Done.');
