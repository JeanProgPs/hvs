/**
 * optimize_images.js
 *
 * Converte imagens em `assets/` para WebP (e opcionalmente AVIF) usando sharp.
 * Uso:
 *   1. Instalar dependência: `npm install sharp`
 *   2. Executar: `node scripts/optimize_images.js` (ou `node scripts/optimize_images.js --avif`)
 *
 * Observação: o script gera arquivos com a mesma base e extensão `.webp` (ou `.avif`).
 */

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const QUALITY = 80; // ajuste conforme necessário
const args = process.argv.slice(2);
const makeAvif = args.includes('--avif');

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const res = path.resolve(dir, e.name);
    if (e.isDirectory()) files.push(...await walk(res));
    else files.push(res);
  }
  return files;
}

async function optimize() {
  if (!await exists(ASSETS_DIR)) {
    console.error('Assets directory not found:', ASSETS_DIR);
    process.exit(1);
  }

  const files = await walk(ASSETS_DIR);
  for (const f of files) {
    const ext = path.extname(f).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) continue;

    const base = f.slice(0, -ext.length);
    const webpPath = base + '.webp';
    try {
      // Skip if webp already exists and is newer
      const srcStat = await fs.stat(f);
      let need = true;
      try {
        const dstStat = await fs.stat(webpPath);
        if (dstStat.mtime >= srcStat.mtime) need = false;
      } catch (e) { /* not exists */ }

      if (need) {
        await sharp(f).webp({ quality: QUALITY }).toFile(webpPath);
        console.log('Created:', path.relative(process.cwd(), webpPath));
      }

      if (makeAvif) {
        const avifPath = base + '.avif';
        let needAvif = true;
        try {
          const dstStat = await fs.stat(avifPath);
          if (dstStat.mtime >= srcStat.mtime) needAvif = false;
        } catch (e) { }
        if (needAvif) {
          await sharp(f).avif({ quality: QUALITY }).toFile(avifPath);
          console.log('Created:', path.relative(process.cwd(), avifPath));
        }
      }
    } catch (err) {
      console.error('Error processing', f, err.message);
    }
  }
}

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

optimize().then(() => console.log('Optimização concluída.')).catch(err => { console.error(err); process.exit(1); });
