import * as mupdf from "mupdf";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PDF_PATH = path.join(ROOT, "Contenuti", "Logo Elysian.pdf");
const ASSETS_DIR = path.join(ROOT, "src", "assets");
const PUBLIC_DIR = path.join(ROOT, "public");

fs.mkdirSync(ASSETS_DIR, { recursive: true });
fs.mkdirSync(PUBLIC_DIR, { recursive: true });

// 1. Rasterize the vector PDF logo at high resolution (transparent background).
const pdfBuffer = fs.readFileSync(PDF_PATH);
const doc = mupdf.Document.openDocument(pdfBuffer, "application/pdf");
const page = doc.loadPage(0);
const zoom = 4;
const matrix = mupdf.Matrix.scale(zoom, zoom);
const pixmap = page.toPixmap(matrix, mupdf.ColorSpace.DeviceRGB, true);
const masterPngBuffer = pixmap.asPNG();

const masterPath = path.join(ASSETS_DIR, "logo-source.png");
fs.writeFileSync(masterPath, masterPngBuffer);
console.log(`Saved master logo: ${masterPath} (${pixmap.getWidth()}x${pixmap.getHeight()})`);

// 2. Favicon: trimmed, square, transparent.
await sharp(masterPngBuffer)
  .trim()
  .resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(path.join(PUBLIC_DIR, "favicon.png"));

// 3. Apple touch icon: trimmed, square, opaque cream background (iOS ignores transparency).
await sharp(masterPngBuffer)
  .trim()
  .resize(160, 160, { fit: "contain", background: { r: 247, g: 243, b: 234, alpha: 1 } })
  .extend({ top: 10, bottom: 10, left: 10, right: 10, background: { r: 247, g: 243, b: 234 } })
  .flatten({ background: { r: 247, g: 243, b: 234 } })
  .png()
  .toFile(path.join(PUBLIC_DIR, "apple-touch-icon.png"));

// 4. Social-share OG image: logo centered on the site's cream background.
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const logoForOg = await sharp(masterPngBuffer).resize({ height: 480 }).toBuffer();
const logoMeta = await sharp(logoForOg).metadata();

await sharp({
  create: {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    channels: 3,
    background: { r: 247, g: 243, b: 234 },
  },
})
  .composite([
    {
      input: logoForOg,
      left: Math.round((OG_WIDTH - (logoMeta.width ?? 0)) / 2),
      top: Math.round((OG_HEIGHT - (logoMeta.height ?? 0)) / 2),
    },
  ])
  .png()
  .toFile(path.join(PUBLIC_DIR, "og-image.png"));

console.log("Saved favicon.png, apple-touch-icon.png, og-image.png");
