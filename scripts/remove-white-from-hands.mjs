/**
 * Убирает белый фон с logo-hands-gold.png: белые пиксели становятся прозрачными.
 * Запуск: bun run scripts/remove-white-from-hands.mjs
 * Требует: bun add -d sharp (или npm i -D sharp)
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const inputPath = join(root, 'assets/images/logo-hands-gold.png');
const outputPath = join(root, 'assets/images/logo-hands-gold.png');

async function main() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.error('Установи sharp: bun add -d sharp');
    process.exit(1);
  }
  if (!existsSync(inputPath)) {
    console.error('Не найден файл:', inputPath);
    process.exit(1);
  }
  const buffer = readFileSync(inputPath);
  const image = sharp(buffer);
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const threshold = 250; // пиксели с R,G,B > 250 считаем белыми
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r >= threshold && g >= threshold && b >= threshold) {
      data[i + 3] = 0; // alpha = 0
    }
  }
  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(outputPath);
  console.log('Готово:', outputPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
