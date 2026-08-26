# Agent Workflow — a portable operating system for design-led monorepos

This is the operating manual for how work is done in this repository. The
condensed day-to-day rules live in `progress/AGENT-PROCESS.md`; this file is
the full reference.

---

## For the agent reading this in a fresh chat

If `progress/00-START-HERE.md` exists, **read that next** — it is the entry
point and is rewritten every session. This file explains *how* work is done;
START-HERE says *what* to build next.

## Part 0 — What this is

A way of building a project across many separate agent chats, where each chat
has a finite context window, starts with no memory of the previous one, and
forgets everything when it closes. One idea makes that survivable:

> **The repository is the memory. Writing to it is part of the work, not the
> wrap-up.**

Preconditions here: a machine-readable design source (`designs/*.dc.html`),
a pnpm + Turborepo monorepo (`apps/native`, `apps/web`, `packages/*`), and
work that decomposes into small orderable units.

## Part 1 — The pillars

### Pillar 1. The design files outrank the prose

```
designs/
  *.dc.html      # raw exports (tracked). Never edited by hand.
  extracted/     # one readable file per screen per theme (GITIGNORED)
  README.txt     # palette + icon notes from the designer
```

The design HTML is the source of truth for **appearance**: layout, colour,
size, spacing, weight, shadows.

Precedence ladder, highest first:

| Rank | Source | Authority |
|---|---|---|
| 1 | `designs/*.dc.html` (+ `extracted/`) | What a screen looks like |
| 2 | `systems/*` | Why, and rules that span screens |
| 3 | Token layer (`global.css`, `lib/theme.ts`) | Convenience for shared values |
| 4 | Anything else | Nothing |

Where 1 and 2 disagree about an **appearance**, 1 wins. Where they disagree
about a **behaviour** no single screen can express, 2 wins.

Rules:
- **Open the design file for the screen you are building. Every time.** Each
  screen has `data-screen-label="Light NN Name"` / `"Dark NN Name"` /
  `"Web N Name"` anchors — search for them.
- **Designer captions matter.** They carry intent the markup can't.
- **Register exceptions, never assume them.** Conflicts get recorded in
  `systems/09-decisions.md` (D-XXX) and cited in code comments.
- A value census (`CENSUS.md`) is dangerous as a substitute for looking.

### Pillar 2. The plan file is the unit of work

Each plan file in `plans/` is a numbered list of todos. **One todo, one
commit.** The checkbox carries the resulting short SHA, or a `pending-TXX`
placeholder until the commit lands:

```markdown
## T04 — Title in the imperative
- [ ] `pending-T04`
- **Commit:** `feat(scope): imperative message`
- **Depends on:** `02-native-onboarding` T01
- **Touches:** `apps/native/app/...`
- **Done when:** <testable condition>
```

- "Done when" is a contract; leave it unticked rather than lie.
- If the plan is wrong, change the plan first in its own `docs(plan):`
  commit with a `**Note (session N):**` block. Never diverge silently.
- Shared commits are allowed when honest — say so in the message.

### Pillar 3. `systems/` holds the why and the rules

Numbered decision log in `systems/09-decisions.md` (D-001, D-002…), cited by
number in code comments. Immutable once written; superseded, never edited.

### Pillar 4. `progress/` is the memory

- `00-START-HERE.md` — rewritten every session, self-contained, honest.
- `01-project.md` — what NeuroTrace is; rarely changes.
- `04-changelog.md` — newest first; holds reasoning, divergences, doubts.
- `AGENT-PROCESS.md` — condensed per-session loop.

### Pillar 5. Know your execution limits

Establish by trying, not assuming: git works; deletions work; `pnpm run
check-types --filter native` runs (tsc); **no local Android SDK** so gradle
cannot run locally; EAS builds run remotely and their logs are
**brotli-compressed** (decode with node `zlib.brotliDecompressSync`);
PowerShell 5.1 mangles non-ASCII in both directions (see traps).

### Pillar 6. Every value in two places gets a test that spans the gap

A token defined in CSS and consumed via class names needs a check. Make every
new check fail once deliberately before trusting it.

## Part 2 — Per-session loop

1. Orient: read START-HERE → named plan → systems refs → `git log --oneline -20` → try the toolchain.
2. Budget out loud; order by "most valuable if I stop here"; reserve the last fifth for the handoff.
3. Build one todo at a time against its design file and "Done when".
4. Verify (typecheck at minimum).
5. Audit built screens against designs, both themes, deliberately.
6. Record divergences as `Note (session N)` in the plan file.
7. Changelog entry, then rewrite START-HERE.
8. Commit one todo at a time.

## Part 3 — Session definition of done

- [ ] Screens compared to design files, both themes
- [ ] Divergences noted in plan files
- [ ] New tokens present on both sides of any gap, checks made to fail once
- [ ] New user-facing strings in `lib/i18n/locales/*.json` (all 10 locales)
- [ ] Typecheck clean or errors named in changelog
- [ ] Checkboxes carry SHAs or placeholders; unverifiable todos left unticked
- [ ] Changelog + START-HERE rewritten
- [ ] Judgement calls collected into one visible list

## Part 4 — Anti-patterns (all have shipped somewhere)

Config written for the wrong major version; building from tokens instead of
designs; assuming similar-looking things are the same thing; simplifying a
fill; intersecting props onto a library's; assuming the platform synthesises
something; trusting a filename over the file; self-contradicting specs;
silently-failing formats (duplicate JSON keys keep the last silently);
a test that cannot fail.

## Part 5 — The overriding test

Written with the owner; beats every other consideration:

> **Does what you just built help a distracted, overwhelmed adult get from
> cold open to a doctor-ready PDF in under four minutes — without ever
> feeling judged, and without their data ever leaving the device?**
