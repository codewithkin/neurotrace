# NeuroTrace — localized Google Play store listings

Default (en-US) listing lives in Google Play Console. These files hold the
translations for the "Select a language to edit" flow. Each file has three
fields, ready to paste:

| Field | Limit |
|---|---|
| App name | 30 |
| Short description | 80 |
| Full description | 4000 |

## Locale codes on Google Play

| File | Play language(s) to add |
|---|---|
| `es.md` | es-ES **and** es-419 (paste twice) |
| `de.md` | de-DE |
| `fr.md` | fr-FR (+ fr-CA if offered) |
| `pt-BR.md` | pt-BR |
| `ja.md` | ja-JP |
| `it.md` | it-IT |
| `nl.md` | nl-NL (+ nl-BE) |
| `pl.md` | pl-PL |
| `ar.md` | ar (or ar-* variants offered) |

## ⚠️ Default listing cleanup

The current en-US **Full description** accidentally includes a paragraph
beginning "Notes on the other fields in your console:" — that was internal
advice, not store copy. Remove it before publishing; every translation here
is based on the version **without** it.

## Compliance

All copies follow the project rule (systems/09-decisions.md /
progress/01-project.md): screener/self-report framing only; "diagnosis"
appears exclusively inside explicit negations and the disclaimer block,
matching Google Play Health Apps policy and Apple 1.4.1 style guidance.
