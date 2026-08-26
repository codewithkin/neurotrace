const fs = require("fs");
const t = fs.readFileSync("progress/release-notes.md", "utf8");
const sections = t.split(/^## /m).slice(1);
let bad = 0;
for (const s of sections) {
  const locale = s.split("\n")[0].trim();
  const m = s.match(/```\n([\s\S]*?)```/);
  if (!m) {
    console.log(locale + ": NO BLOCK");
    bad++;
    continue;
  }
  const len = m[1].trim().length;
  const ok = len <= 500;
  if (!ok) bad++;
  console.log(locale + ": " + len + " chars " + (ok ? "OK" : "OVER LIMIT"));
}
process.exit(bad ? 1 : 0);
