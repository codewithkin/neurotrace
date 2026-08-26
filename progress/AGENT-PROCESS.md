# Per-session loop (condensed)

Full manual: `/AGENT-WORKFLOW.md`.

1. Read `progress/00-START-HERE.md`, then the plan file it names.
2. `git log --oneline -20` + `git status` — know what's uncommitted.
3. Open the design HTML anchor for the screen before writing a line.
4. One todo = one commit. Tick the checkbox with the SHA.
5. New user-facing strings → all 10 files in
   `apps/native/lib/i18n/locales/`. Write them with
   `[System.IO.File]::WriteAllText(path, json,
   (New-Object System.Text.Encoding.UTF8Encoding($false)))` — never
   `Out-File ascii`. Verify non-ASCII with a regex byte read afterwards.
6. Typecheck: `pnpm run check-types --filter native` (or `--filter web`).
7. Note divergences in the plan file as `**Note (session N):**`.
8. Finish with changelog entry + rewritten START-HERE.

## Known traps

- **Edit tool vs non-ASCII:** literal ←/emoji in files break oldString
  matching. Re-read the file, or rewrite whole blocks with Write.
- **PowerShell console lies:** it renders UTF-8 as ??? in output. Verify
  content by regex on bytes, not by eyeballing the console.
- **heroui-native brand color is accent**, not primary; alias exists in
  global.css (`--color-primary`). Unknown tailwind classes fail silently.
- **EAS logs are brotli**: decode via node
  `zlib.brotliDecompressSync(buffer)`.
- **eas.json has requireCommit:true** — commit before building; versionCode
  auto-increments on submit.
- **No local Android SDK** — can't run gradle; validate config with
  `pnpm run prebuild -- --clean --platform android` and expo-doctor.
