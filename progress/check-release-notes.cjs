// Verifies progress/release-notes.md: every <locale> block is present,
// non-empty, and within Play's 500-char release-notes limit.
// ASCII-only source on purpose (D-010). Exits 1 on any failure.
const fs = require("fs");

const EXPECTED = [
  "en-GB", "ar", "de-DE", "es-419", "es-ES", "es-US",
  "fr-CA", "fr-FR", "it-IT", "ja-JP", "nl-NL", "pl-PL", "pt-BR",
];

const text = fs.readFileSync("progress/release-notes.md", "utf8");
let failures = 0;

for (const locale of EXPECTED) {
  const m = text.match(new RegExp(`<${locale}>\\n([\\s\\S]*?)\\n</${locale}>`));
  if (!m) {
    console.log(`${locale}: MISSING BLOCK`);
    failures++;
    continue;
  }
  const body = m[1].trim();
  if (!body) {
    console.log(`${locale}: EMPTY`);
    failures++;
    continue;
  }
  const len = body.length;
  if (len > 500) {
    console.log(`${locale}: ${len} chars OVER LIMIT (>500)`);
    failures++;
  } else {
    console.log(`${locale}: ${len} chars OK`);
  }
}

const found = [...text.matchAll(/<([a-zA-Z-]+)>/g)].map((m) => m[1]);
for (const tag of found) {
  if (!EXPECTED.includes(tag)) {
    console.log(`unexpected locale tag: ${tag}`);
    failures++;
  }
}

process.exit(failures ? 1 : 0);
