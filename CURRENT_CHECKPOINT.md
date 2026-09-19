# CURRENT CHECKPOINT

**Project:** Indiana // 2026
**Date:** 2026-09-19
**Canonical repository:** `Aphexflip/indiana-2026-voter-guide`

## Current state

v0.1 scaffold committed. Static, zero-build site in `public/`, data-driven from `public/data/races.json`. No backend, no deploy yet.

### Built

- `README.md`, `AGENTS.md`, `COMPLIANCE.md` — mission, non-negotiable rules, and Indiana election-law notes.
- `public/index.html` — landing page, key dates, issue-tag filter, race list rendered from data.
- `public/race.html` + `app.js` — per-race page showing candidates side by side with sourced record items.
- `public/data/races.json` — seeded with two real races:
  - **IN-01**: Frank Mrvan (D, incumbent) vs. Barb Regnitz (R) — primary results sourced; no individual voting-record items yet (deliberately left as `recordStatus` placeholders rather than fabricated).
  - **IN-05**: Victoria Spartz (R, incumbent) vs. J.D. Ford (D) — Spartz has two sourced record items (attendance rate via GovTrack, Heritage Action scorecard); Ford has one (State Senate tenure).
- `merch/README.md` — stub only, deliberately not built yet, documents the separation from the facts brand and the disclaimer requirement.

### Verified facts and their sources

- Indiana 2026 general election: **November 3, 2026**. Registration deadline **October 5, 2026**. Early voting starts **October 6, 2026**. (Ballotpedia, BallotReady)
- No Indiana Senate or Governor race in 2026 (both mid-term this cycle).
- IN-01: Mrvan won Dem primary 80.2%; Regnitz won GOP primary 45.8% (Ballotpedia).
- IN-05: Spartz missed 158/2,898 votes (5.5%) vs. 2.1% median (GovTrack, as of Sept 2026); Heritage Action lifetime score 92% (their scorecard, not ours); Ford has represented State Senate District 29 since 2018 (Indiana Capital Chronicle).
- Indiana disclaimer law: IC 3-9-3-2.5, requires "paid for by" on most printed political material, ≥7pt type, narrow small-item exemption that shirts/signs likely don't qualify for.

## Not yet done

1. The other 7 Indiana U.S. House districts (2, 3, 4, 6, 7, 8, 9).
2. Three statewide row offices: Secretary of State, Auditor, Treasurer.
3. State legislature races (all 100 State House seats, half the State Senate).
4. Real voting-record items for Mrvan, Regnitz, and Ford (currently placeholders — do not fill these in without citations, see AGENTS.md).
5. Hosting/deploy decision — no Cloudflare project created yet for this repo.
6. Merch brand name, storefront platform choice, and actual disclaimer copy for products.
7. Attorney review before any merch goes on sale (see COMPLIANCE.md checklist).

## Exact next human action

Pick one to prioritize next:

- **More races**: tell me which district(s) or which statewide office to research and add next.
- **Deploy**: create a Cloudflare Pages project pointed at this repo (same pattern as `america-explained`) so this is reachable at a real URL before early voting starts Oct 6.
- **Merch**: pick a brand name and a fulfillment platform (Printful/Printify + Shopify is the default recommendation) so design work can start.

## Do not casually reverse

- Do not add "vote for X" language to `public/`.
- Do not fill in record items without a source URL.
- Do not let the merch brand share a name/logo with the facts site.
- Do not skip the "paid for by" disclaimer on any printed item.
