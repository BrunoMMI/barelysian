import fs from "node:fs";
import path from "node:path";

const WEIGHTS = [400, 600];
const OUT_DIR = path.join(process.cwd(), "public", "fonts");
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const weight of WEIGHTS) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@${weight}&display=swap`;
  const css = await fetch(cssUrl, { headers: { "User-Agent": USER_AGENT } }).then((r) => r.text());

  const latinBlockMatch = css.match(/\/\* latin \*\/\s*@font-face\s*\{([^}]*)\}/);
  if (!latinBlockMatch) {
    throw new Error(`Could not find a latin @font-face block for weight ${weight}`);
  }
  const fontUrl = latinBlockMatch[1].match(/url\(([^)]+)\)/)?.[1];
  if (!fontUrl) {
    throw new Error(`Could not find a font URL for weight ${weight}`);
  }

  const fontBuffer = Buffer.from(await fetch(fontUrl).then((r) => r.arrayBuffer()));
  const outPath = path.join(OUT_DIR, `cormorant-garamond-${weight}.woff2`);
  fs.writeFileSync(outPath, fontBuffer);
  console.log(`Saved ${outPath} (${fontBuffer.length} bytes)`);
}
