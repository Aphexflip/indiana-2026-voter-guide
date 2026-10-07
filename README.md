# INDIANA // 2026

> **Here's what they did. You decide what that means for you.**

A sourced record of what Indiana's 2026 midterm candidates have actually done in office (votes, bills, public statements), tagged by issue, so a reader can match their own priorities against the record — without the site telling them who to vote for.

**Election day:** Tuesday, November 3, 2026.
**Voter registration deadline:** Monday, October 5, 2026.
**Early voting begins:** Tuesday, October 6, 2026.

## The model

This is **not** an advocacy site. It does not say "vote for X." It says "X did Y, on this date, here's the source — if you care about Y, that's worth knowing." The reader draws their own conclusion. See `AGENTS.md` for the non-negotiable rules that keep it that way.

This split matters for two reasons: it's what makes the record trustworthy (a source that argues for a side stops being a source), and it keeps this project out of express-advocacy territory under Indiana campaign finance law. See `COMPLIANCE.md` before publishing anything or selling anything.

## Live 50-state polling, projections, and returns dashboard

`public/election-dashboard.html` has state-by-state election detail for the 2026 Senate (35), governors (36), and U.S. House (435 districts). It offers **polling leaders**, **independent model projections**, and **officially reported returns** as different views. Data is retrieved from Polling Forecast's open, credited CC BY 4.0 API and Open America's partial-coverage public state-returns feed. Poll numbers and projections must always display provider and as-of dates. Election results coverage is partial and Open America **does not call races or certify winners**. Before November 3, no 2026 general-election winner exists. Avoid conflating a poll lead, projected favorite, counted-vote leader or certified winner.

## 2026 election atlas

The site's interactive map explorer is at `public/senate-map.html`, linked from the homepage. It has four state map layers: Senate contests (35 states), governor contests (36), the office-combination overview, and a choropleth of all **435** U.S. House voting seats across 50 states. State clicks show details. Source snapshots, checked October 6, 2026, are in `public/data/election-coverage-2026.json` and `public/data/senate-candidates-2026.json`.

Two separate third-party PoliAgg maps show live **Senate** and **governor** forecasts; those forecasts are not endorsed or authored by this site. The map explorer deliberately displays neither turnout, the number of votes cast, projected winners, nor declared results. An actual election-night results/status feature would require a verified live results feed.

Map geometry is a CC BY-SA 3.0 artwork by Theshibboleth obtained from the MIT-licensed SVG Map Maker project. Original project, artist credit, license, and data sources are linked on the map page.

## 2026 U.S. Senate map

The site includes `public/senate-map.html`: a color-coded third-party forecast (PoliAgg official embed) with a dated index of major candidates in all 50 states. This is an **attributed external forecast**, not an endorsement, site-authored probability model, or a voting recommendation. The embedded map can refresh independently; the local candidate index is dated and must be reviewed before updating.

## Current coverage

All 9 Indiana U.S. House districts and all 3 statewide row offices (Secretary of State, Treasurer, Comptroller/Auditor) are seeded with sourced matchup data — nominees, primary/convention results, and, for incumbents, a comparable attendance record (GovTrack/VoteSee) and Heritage Action's third-party scorecard (quoted, not adopted — see `AGENTS.md`).

One open item: **IN-07's Republican nominee is not yet confirmed** — the data file flags this explicitly rather than guessing between the two primary candidates found in research.

Not yet built: state legislature races (100 State House seats, half the State Senate) and deeper voting-record detail beyond the attendance/scorecard baseline for most candidates. See `CURRENT_CHECKPOINT.md` for exact next steps.

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
  senate-map.html   embedded Senate forecast + 50-state roster
  data/
    races.json      all race + candidate + record data
    senate-candidates-2026.json  dated 50-state Senate candidates
```

No backend required for the MVP. A Cloudflare Pages/Workers deploy (matching the RSYMO ecosystem) can be added later if personalization or a submissions pipeline is needed — don't add that complexity before it's earned.

## Local preview

```bash
python3 -m http.server 4173 -d public
```

Then open `http://localhost:4173`.

## Deploy

`.github/workflows/deploy.yml` deploys to Cloudflare Workers (static assets) automatically on every push to `main`, using the Wrangler CLI in CI rather than Cloudflare's own git integration — this sidesteps the repo-clone failure the `america-explained` project hit when connecting Cloudflare's git-based builds directly.

**To activate it (one-time, needs your Cloudflare account):**

1. Create a Cloudflare API token at [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens) using the "Edit Cloudflare Workers" template.
2. Find your Account ID on the right sidebar of any page in the Cloudflare dashboard.
3. In this repo on GitHub: **Settings → Secrets and variables → Actions**, add:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
4. Push to `main` (or run the workflow manually from the Actions tab). It'll deploy to `indiana-2026-voter-guide.<your-subdomain>.workers.dev`; attach a custom domain afterward in the Cloudflare dashboard if you want one.

Until those two secrets are added, the workflow will run and fail at the deploy step — that failure is expected and informative, not a bug to chase.

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
