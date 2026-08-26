#!/usr/bin/env node
/*
 * Palette parity check (plan 05 T02, Pillar 6).
 *
 * The design's hexes live in three places that cannot see each other:
 *   - apps/native/global.css        CSS custom properties for the classes
 *   - apps/native/lib/theme.ts      raw values for SVG fills and icon props
 *   - apps/web/src/index.css        the web token overrides
 *
 * Any one of them can drift silently. This asserts all three against the
 * single list below, which is the design file's own token block.
 *
 * Run: node scripts/check-design-tokens.cjs
 * ASCII output only - PowerShell 5.1 mangles anything else (D-010).
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

// name -> [light, dark]. Dark is null where the token is theme-independent.
const TOKENS = {
  background: ["#ffffff", "#0b0a0f"],
  foreground: ["#15121d", "#f4f2fa"],
  muted: ["#6d6981", "#9a95ac"],
  border: ["#eae7f2", "#282534"],
  surface: ["#f8f7fc", "#17151f"],
  "nt-tint": ["#f2ecfe", "#1d1730"],
  "nt-pri-border": ["#c8b4fa", "#7c4df0"],
  "nt-track": ["#ecebf3", "#252231"],
  "nt-ring": ["#15121d", "#ffffff"],
  accent: ["#6d42e8", "#8b5cf6"],
  "nt-amber-bg": ["#fef3c7", "#3a2c0a"],
  "nt-amber-fg": ["#92500e", "#fbbf24"],
  "nt-green-bg": ["#dcfce7", "#0e2a18"],
  "nt-green-fg": ["#15803d", "#4ade80"],
  "nt-danger-bg": ["#fef2f2", "#2a1214"],
  "nt-danger-fg": ["#b91c1c", "#f87171"],
};

// theme.ts key -> token name above
const THEME_TS_KEYS = {
  bg: "background",
  fg: "foreground",
  muted: "muted",
  border: "border",
  card: "surface",
  tint: "nt-tint",
  pri: "accent",
  priBorder: "nt-pri-border",
  track: "nt-track",
  ring: "nt-ring",
  amberBg: "nt-amber-bg",
  amberFg: "nt-amber-fg",
  greenBg: "nt-green-bg",
  greenFg: "nt-green-fg",
  dangerBg: "nt-danger-bg",
  dangerFg: "nt-danger-fg",
};

const FREQ_RAMP = ["#2563eb", "#0ea5e9", "#4f46e5", "#7c3aed", "#9333ea"];
const WEB_TOKENS = {
  background: "#ffffff",
  foreground: "#15121d",
  border: "#eae7f2",
  primary: "#6d42e8",
  "muted-foreground": "#6d6981",
  card: "#f8f7fc",
  "nt-tint": "#f2ecfe",
  "nt-hero-sub": "#5f5b70",
  "nt-trust": "#8a8698",
  "nt-chrome": "#dcd9e2",
};

const failures = [];
function check(where, name, expected, actual) {
  if (actual !== expected) {
    failures.push(
      where + ": " + name + " is " + (actual || "missing") + ", expected " + expected,
    );
  }
}

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

// --- apps/native/global.css: two @variant blocks, light then dark ---
const globalCss = read("apps/native/global.css");
const lightBlock = globalCss.slice(
  globalCss.indexOf("@variant light"),
  globalCss.indexOf("@variant dark"),
);
const darkBlock = globalCss.slice(globalCss.indexOf("@variant dark"));

function cssVar(block, name) {
  const m = block.match(new RegExp("--" + name + ":\\s*([^;]+);"));
  return m ? m[1].trim() : null;
}

Object.keys(TOKENS).forEach(function (name) {
  check("global.css light", name, TOKENS[name][0], cssVar(lightBlock, name));
  check("global.css dark", name, TOKENS[name][1], cssVar(darkBlock, name));
});

// --- apps/native/lib/theme.ts ---
const themeTs = read("apps/native/lib/theme.ts");
const lightObj = themeTs.slice(themeTs.indexOf("light: {"), themeTs.indexOf("dark: {"));
const darkObj = themeTs.slice(themeTs.indexOf("dark: {"));

function tsValue(block, key) {
  const m = block.match(new RegExp("\\b" + key + ':\\s*"([^"]+)"'));
  return m ? m[1] : null;
}

Object.keys(THEME_TS_KEYS).forEach(function (key) {
  const token = THEME_TS_KEYS[key];
  check("theme.ts light", key, TOKENS[token][0], tsValue(lightObj, key));
  check("theme.ts dark", key, TOKENS[token][1], tsValue(darkObj, key));
});

FREQ_RAMP.forEach(function (hex, i) {
  if (!themeTs.includes(hex)) {
    failures.push("theme.ts: FREQ_RAMP[" + i + "] " + hex + " missing");
  }
});

// --- apps/web/src/index.css ---
const webCss = read("apps/web/src/index.css");
Object.keys(WEB_TOKENS).forEach(function (name) {
  check("web index.css", name, WEB_TOKENS[name], cssVar(webCss, name));
});
FREQ_RAMP.forEach(function (hex, i) {
  if (!webCss.includes(hex)) {
    failures.push("web index.css: ramp colour " + hex + " (nt-ramp-" + (i + 1) + ") missing");
  }
});

if (failures.length) {
  console.error("Design token check FAILED (" + failures.length + "):");
  failures.forEach(function (f) {
    console.error("  - " + f);
  });
  process.exit(1);
}

const count =
  Object.keys(TOKENS).length * 4 + Object.keys(WEB_TOKENS).length + FREQ_RAMP.length * 2;
console.log("Design token check passed (" + count + " assertions).");
