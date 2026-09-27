// One-off generator for tasteful dark-luxury SVG placeholder media.
// Run with: node scripts/generate-placeholders.mjs
// These are temporary stand-ins for real gemstone photography — replace the
// files under /public/assets/stones/<slug>/ directly; filenames are
// referenced from /src/data/stones.ts and /src/data/content.ts.

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public", "assets", "stones");

const GOLD = "#c5a059";
const INK = "#08080a";

const palettes = {
  turquoise: { a: "#1c3b3d", b: "#0c1e20", accent: "#5fa8a0" },
  agate: { a: "#3a2c22", b: "#191310", accent: "#a97c4f" },
  garnet: { a: "#3a1216", b: "#170708", accent: "#8f2430" },
  meteorite: { a: "#26282c", b: "#0d0e10", accent: "#8a8f99" },
  hero: { a: "#241c14", b: "#08080a", accent: GOLD },
};

/** Deterministic pseudo-random from a seed string, so repeats are stable. */
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(h, 31) + str.charCodeAt(i)) | 0;
  return h;
}

function facetPolygon(rand, cx, cy, r, sides) {
  const pts = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 + rand() * 0.4;
    const radius = r * (0.55 + rand() * 0.45);
    pts.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius * 1.15]);
  }
  return pts.map((p) => p.map((n) => n.toFixed(1)).join(",")).join(" ");
}

function buildSvg({ key, width, height, label, seed }) {
  const palette = palettes[key] ?? palettes.hero;
  const rand = mulberry32(seedFromString(seed));
  const cx = width / 2;
  const cy = height / 2;

  const facets = [];
  const facetCount = 6 + Math.floor(rand() * 3);
  for (let i = 0; i < facetCount; i++) {
    const r = Math.min(width, height) * (0.18 + rand() * 0.16);
    const ox = cx + (rand() - 0.5) * width * 0.35;
    const oy = cy + (rand() - 0.5) * height * 0.3;
    const opacity = (0.06 + rand() * 0.1).toFixed(2);
    const stroke = rand() > 0.5 ? palette.accent : GOLD;
    facets.push(
      `<polygon points="${facetPolygon(rand, ox, oy, r, 5 + Math.floor(rand() * 3))}" fill="${stroke}" fill-opacity="${opacity}" stroke="${stroke}" stroke-opacity="0.18" stroke-width="1" />`
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">
  <defs>
    <radialGradient id="bg-${seed}" cx="50%" cy="38%" r="75%">
      <stop offset="0%" stop-color="${palette.a}" />
      <stop offset="55%" stop-color="${palette.b}" />
      <stop offset="100%" stop-color="${INK}" />
    </radialGradient>
    <linearGradient id="sheen-${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${GOLD}" stop-opacity="0.16" />
      <stop offset="45%" stop-color="${GOLD}" stop-opacity="0" />
      <stop offset="100%" stop-color="${GOLD}" stop-opacity="0" />
    </linearGradient>
    <filter id="grain-${seed}">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="noise" />
      <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg-${seed})" />
  ${facets.join("\n  ")}
  <rect width="${width}" height="${height}" fill="url(#sheen-${seed})" />
  <rect width="${width}" height="${height}" filter="url(#grain-${seed})" opacity="0.6" />
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" fill="none" stroke="${GOLD}" stroke-opacity="0.14" stroke-width="1" />
  <text x="${width / 2}" y="${height - 36}" text-anchor="middle" font-family="Georgia, serif" font-size="${Math.max(14, width * 0.016)}" fill="${GOLD}" fill-opacity="0.55" letter-spacing="2">${label.toUpperCase()}</text>
  <text x="${width / 2}" y="${height - 14}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="${Math.max(10, width * 0.01)}" fill="#f2ede4" fill-opacity="0.32" letter-spacing="3">PLACEHOLDER — REPLACE WITH PHOTOGRAPHY</text>
</svg>`;
}

const jobs = [
  // Turquoise
  { key: "turquoise", dir: "turquoise", file: "turquoise-hero-placeholder.svg", w: 1600, h: 2000, label: "Persian Turquoise" },
  { key: "turquoise", dir: "turquoise", file: "turquoise-specimen-01-main-placeholder.svg", w: 1200, h: 1200, label: "Turquoise · Lot 01" },
  { key: "turquoise", dir: "turquoise", file: "turquoise-specimen-01-detail-a-placeholder.svg", w: 1200, h: 1200, label: "Turquoise · Lot 01 · A" },
  { key: "turquoise", dir: "turquoise", file: "turquoise-specimen-01-detail-b-placeholder.svg", w: 1200, h: 1200, label: "Turquoise · Lot 01 · B" },
  { key: "turquoise", dir: "turquoise", file: "turquoise-specimen-02-main-placeholder.svg", w: 1200, h: 1200, label: "Turquoise · Lot 02" },
  { key: "turquoise", dir: "turquoise", file: "turquoise-specimen-02-detail-a-placeholder.svg", w: 1200, h: 1200, label: "Turquoise · Lot 02 · A" },

  // Agate
  { key: "agate", dir: "agate", file: "agate-hero-placeholder.svg", w: 1600, h: 2000, label: "Iranian Agate" },
  { key: "agate", dir: "agate", file: "agate-specimen-01-main-placeholder.svg", w: 1200, h: 1200, label: "Agate · Lot 01" },
  { key: "agate", dir: "agate", file: "agate-specimen-01-detail-a-placeholder.svg", w: 1200, h: 1200, label: "Agate · Lot 01 · A" },

  // Garnet
  { key: "garnet", dir: "garnet", file: "garnet-hero-placeholder.svg", w: 1600, h: 2000, label: "Iranian Garnet" },
  { key: "garnet", dir: "garnet", file: "garnet-specimen-01-main-placeholder.svg", w: 1200, h: 1200, label: "Garnet · Lot 01" },
  { key: "garnet", dir: "garnet", file: "garnet-specimen-01-detail-a-placeholder.svg", w: 1200, h: 1200, label: "Garnet · Lot 01 · A" },

  // Meteorite
  { key: "meteorite", dir: "meteorite", file: "meteorite-hero-placeholder.svg", w: 1600, h: 2000, label: "Meteorite" },
  { key: "meteorite", dir: "meteorite", file: "meteorite-specimen-01-main-placeholder.svg", w: 1200, h: 1200, label: "Meteorite · Lot 01" },
  { key: "meteorite", dir: "meteorite", file: "meteorite-specimen-01-detail-a-placeholder.svg", w: 1200, h: 1200, label: "Meteorite · Lot 01 · A" },

  // Hero (site-wide)
  { key: "hero", dir: "hero", file: "hero-gemstone-placeholder.svg", w: 1920, h: 2400, label: "Milan Gems" },
];

for (const job of jobs) {
  const outDir = join(publicDir, job.dir);
  mkdirSync(outDir, { recursive: true });
  const svg = buildSvg({ key: job.key, width: job.w, height: job.h, label: job.label, seed: job.file });
  writeFileSync(join(outDir, job.file), svg, "utf8");
  console.log("wrote", join(outDir, job.file));
}
