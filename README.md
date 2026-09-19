# INDIANA // 2026

> **Here's what they did. You decide what that means for you.**

A sourced record of what Indiana's 2026 midterm candidates have actually done in office (votes, bills, public statements), tagged by issue, so a reader can match their own priorities against the record — without the site telling them who to vote for.

**Election day:** Tuesday, November 3, 2026.
**Voter registration deadline:** Monday, October 5, 2026.
**Early voting begins:** Tuesday, October 6, 2026.

## The model

This is **not** an advocacy site. It does not say "vote for X." It says "X did Y, on this date, here's the source — if you care about Y, that's worth knowing." The reader draws their own conclusion. See `AGENTS.md` for the non-negotiable rules that keep it that way.

This split matters for two reasons: it's what makes the record trustworthy (a source that argues for a side stops being a source), and it keeps this project out of express-advocacy territory under Indiana campaign finance law. See `COMPLIANCE.md` before publishing anything or selling anything.

## Current coverage

Seeded with real, sourced data for the two competitive U.S. House races:

- **IN-01**: Frank Mrvan (D, incumbent) vs. Barb Regnitz (R)
- **IN-05**: Victoria Spartz (R, incumbent) vs. J.D. Ford (D)

Not yet built: the other 7 Indiana U.S. House districts, the three statewide row offices (Secretary of State, Auditor, Treasurer), and state legislature races. See `CURRENT_CHECKPOINT.md` for exact next steps.

## Sourcing rules

- Every factual claim about a candidate needs a citation to a primary or well-established secondary source (official roll call votes, bill text, government sites, Ballotpedia, GovTrack, direct quotes with a link).
- Every candidate in a race gets the same treatment — same depth, same tone, same scrutiny. If you add three record items for one candidate, find three for their opponent too, or don't publish either.
- Third-party scorecards (e.g. Heritage Action, ACLU) can be cited as **their** rating, clearly labeled as such — never restated as this site's own characterization.
- No claim without a source. No source, no claim. If you can't verify it, it doesn't go in.

## Architecture

Zero-build static frontend, same pattern as the sibling `america-explained` project, so it deploys the same known-working way:

```text
public/
  index.html        landing + race list
  race.html         single-race template, reads ?race= from URL
  styles.css
  app.js            renders race data client-side
  data/
    races.json      all race + candidate + record data
```

No backend required for the MVP. A Cloudflare Pages/Workers deploy (matching the RSYMO ecosystem) can be added later if personalization or a submissions pipeline is needed — don't add that complexity before it's earned.

## Local preview

```bash
python3 -m http.server 4173 -d public
```

Then open `http://localhost:4173`.

## Merch

Lives in `merch/` as a **separately branded** effort — see `merch/README.md`. It is not neutral and doesn't pretend to be, but every printed item (shirts, yard signs) needs an Indiana-compliant "Paid for by" disclaimer. Read `COMPLIANCE.md` before designing or selling anything.

## Project files

```text
AGENTS.md                 rules for anyone (human or AI) continuing this project
CURRENT_CHECKPOINT.md     current state + exact next action
COMPLIANCE.md             Indiana election-law notes — read before publishing or selling
README.md                 this file
public/                   the facts site
merch/                    separate opinion/merch brand
```
