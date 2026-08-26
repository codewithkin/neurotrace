// Store-listing validator: run with `node store-listings/verify.cjs`
// ASCII-only source on purpose (D-010). Exits 1 on any failure.
const fs = require("fs");
const path = require("path");

const LIMITS = { name: 30, short: 80, full: 4000 };

// Negated-diagnosis phrasing that must appear AFTER the disclaimer heading.
const NEGATED =
  /(not a medical diagnostic test|not a diagnosis|no es un diagnóstico|keine Diagnose|n'est pas un diagnostic|não é um diagnóstico|診断ではありません|non è una diagnosi|geen diagnose|to nie diagnoza|ليست تشخيصًا)/i;

// Disclaimer section headings per locale.
const HEADINGS =
  /DISCLAIMER|AVISO LEGAL|HAFTUNGSHINWEIS|AVERTISSEMENT|免責事項|CLAUSOLA DI ESCLUSIONE|VRYWARING|ZASTRZEŻENIE|إخلاء مسؤولية/;

// Words that must never appear as claims before the disclaimer.
const BANNED_BEFORE = [/diagnos/i, /detector/i];

const dir = __dirname;
let failures = 0;

for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".md") && x !== "README.md")) {
  const text = fs.readFileSync(path.join(dir, f), "utf8");
  const blocks = [...text.matchAll(/```\n([\s\S]*?)```/g)].map((m) => m[1].trim());
  if (blocks.length !== 3) {
    console.log(`${f}: ERROR expected 3 fields, found ${blocks.length}`);
    failures++;
    continue;
  }
  const [name, short, full] = blocks;
  const problems = [];

  if (name.length > LIMITS.name) problems.push(`name ${name.length}>${LIMITS.name}`);
  if (short.length > LIMITS.short) problems.push(`short ${short.length}>${LIMITS.short}`);
  if (full.length > LIMITS.full) problems.push(`full ${full.length}>${LIMITS.full}`);
  if (!/ASRS v1\.1/.test(full)) problems.push("missing ASRS v1.1 mention");

  const flat = full.replace(/\n/g, " ");
  const headingMatch = flat.match(HEADINGS);
  if (!headingMatch) {
    problems.push("no disclaimer heading found");
  } else {
    const afterDisclaimer = flat.slice(headingMatch.index);
    if (!NEGATED.test(afterDisclaimer)) problems.push("disclaimer lacks negated-diagnosis line");
    const beforeDisclaimer = flat.slice(0, headingMatch.index);
    for (const w of BANNED_BEFORE) {
      if (w.test(beforeDisclaimer)) problems.push(`banned claim "${w}" before disclaimer`);
    }
  }

  if (problems.length) {
    console.log(`${f}: FAIL -> ${problems.join("; ")}`);
    failures++;
  } else {
    console.log(`${f}: OK (name ${name.length}, short ${short.length}, full ${full.length})`);
  }
}

process.exit(failures ? 1 : 0);
