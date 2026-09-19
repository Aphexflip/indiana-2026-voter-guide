# CURRENT CHECKPOINT

**Project:** Indiana // 2026
**Date:** 2026-09-19
**Canonical repository:** `Aphexflip/indiana-2026-voter-guide`

## Current state

Full first-pass data coverage for the 2026 Indiana general election ballot, plus deploy scaffolding and merch groundwork. Still nothing is live at a public URL — that step needs your Cloudflare account.

### Built this session

- **All 9 U.S. House races and all 3 statewide row offices** in `public/data/races.json`, each with sourced nominees and, for every incumbent, a comparable attendance record (GovTrack or VoteSee) and Heritage Action's scorecard (quoted as their rating, not adopted as this site's view).
- **`in-07` (Carson's seat) has an explicitly unconfirmed Republican nominee** — research found two primary candidates (Patrick McAuley, Felipe Rios) but no confirmed winner. Left as a flagged placeholder rather than a guess. **This is the single highest-value fact to verify next** — check the Indiana Election Division or a dated post-May-5 news report.
- `public/index.html` / `app.js` now group races by category (U.S. House / Statewide) with the issue-tag filter working across all 12 races.
- **Deploy scaffolding**: `wrangler.jsonc`, `package.json`, `.github/workflows/deploy.yml` — deploys to Cloudflare via the Wrangler CLI in GitHub Actions on every push to `main`, which avoids the git-clone failure `america-explained` hit when connecting Cloudflare's own git integration directly. Inactive until Cloudflare secrets are added (see "Exact next human action" below).
- **Merch groundwork**: `merch/README.md` proposes a working brand name ("Hoosier Receipts") and `merch/slogans-draft.md` has 7 first-pass slogan concepts, each traced to a specific cited fact already in `races.json`, deliberately spread across both parties. None reviewed, none approved for print.

### Verified facts and sources (superset of prior checkpoint)

Indiana 2026 general election: November 3, 2026. Register by October 5, 2026. Early voting starts October 6, 2026. No IN Senate or Governor race this cycle.

All 12 races and their sourced nominees are in `public/data/races.json` — each candidate object carries its own `sources` array. Notable ones:
- IN-01: Mrvan (D, inc.) vs. Regnitz (R). IN-05: Spartz (R, inc.) vs. Ford (D).
- IN-07: Carson (D, inc.) vs. **unconfirmed R nominee**.
- Secretary of State: incumbent Diego Morales (R) lost his own party's convention to Max Engling; Engling faces Beau Bayh (D, son of Evan Bayh) in November.
- Treasurer: Daniel Elliott (R, inc.) vs. Coumba Kebe (D). Comptroller: Elise Nieshalla (R, inc.) vs. Jessica Bailey (D).

## Not yet done

1. **Confirm IN-07's Republican nominee.**
2. State legislature races (100 State House seats, half the State Senate) — not started at all.
3. Deeper voting-record items beyond the attendance/scorecard baseline — most candidates have 0-2 record items; the product gets more valuable with more specific, issue-tagged bill/vote items.
4. Cloudflare deploy — needs your account (API token + account ID as GitHub secrets).
5. Merch: needs a Printful/Printify + storefront account (your business/payout details), a legal review pass, and a finalized "Paid for by" disclaimer line.

## Exact next human action

Pick what to unblock first — none of these need me, they need you:

- **Deploy**: create a Cloudflare API token ("Edit Cloudflare Workers" template) and find your Account ID, then add both as `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` secrets at `github.com/Aphexflip/indiana-2026-voter-guide/settings/secrets/actions`. Next push to `main` deploys automatically. (See README "Deploy" section for exact steps.)
- **Merch**: create a Printful (or Printify) account and decide Shopify vs. their built-in storefront, so I can wire up real products from the `slogans-draft.md` concepts. Also: what name/entity goes on the required "Paid for by" disclaimer line?
- **IN-07**: if you happen to know or can quickly check who won that Republican primary, that closes the one open data gap in the House races.

I'll keep working anything that doesn't require your accounts or decisions — more record items, state legislature races, more slogan concepts — without waiting on this list.

## Do not casually reverse

- Do not add "vote for X" language to `public/`.
- Do not fill in record items without a source URL.
- Do not let the merch brand share a name/logo with the facts site.
- Do not skip the "paid for by" disclaimer on any printed item.
- Do not publish a confirmed name for IN-07's Republican nominee without independent verification.
