/**
 * Убирает белый фон с логотипа: заменяет белые и светло-бежевые пиксели на navy #2A3441.
 * Запуск: node scripts/remove-white-from-logo.mjs
 */
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NAVY = { r: 0x2A, g: 0x34, b: 0x41 };
const WHITE_THRESHOLD = 240;   // RGB всё выше = считаем белым
const LIGHT_THRESHOLD = 230;   // светло-бежевый фон

async function processImage(inputPath, outputPath) {
  const img = sharp(inputPath);
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = channels === 4 ? data[i + 3] : 255;
    const isWhite = r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD;
    const isLightBg = r >= LIGHT_THRESHOLD && g >= LIGHT_THRESHOLD && b >= LIGHT_THRESHOLD;
    if (isWhite || isLightBg) {
      data[i] = NAVY.r;
      data[i + 1] = NAVY.g;
      data[i + 2] = NAVY.b;
      if (channels === 4) data[i + 3] = 255;
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(outputPath);
  console.log('Written:', outputPath);
}

const root = path.join(__dirname, '..');
const assets = path.join(root, 'assets', 'images');
const files = [['logo-about-source.png', 'logo-about.png']];

for (const [inputName, outputName] of files) {
  const input = path.join(assets, inputName);
  const output = path.join(assets, outputName);
  try {
    await processImage(input, output);
  } catch (e) {
    console.warn('Skip', inputName, e.message);
  }
}
console.log('Done.');
