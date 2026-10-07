# CURRENT CHECKPOINT

## 2026-10-06 Texas polling gap resolved

- User noticed that James Talarico was leading Ken Paxton in Texas polls while our map did not show polling figures. Root cause: the atlas only contained **office coverage and third-party forecasts**, not polling averages.
- Sourced RealClearPolling Texas 2026 Senate average: **Talarico (D) 48.4%**, **Paxton (R) 45.3%**, **Talarico +3.1 percentage points**. Poll window September 12–October 5, 2026; verified October 6, 2026. RCP race rating **Toss Up**. Verified independent corroboration from FiftyPlusOne: Talarico 48.6%, Paxton 45.4% on October 6.
- Added static `public/data/senate-polling-snapshots-2026.json` with source URL, retrieval date, names, window, numbers, and rating. It is a manually verified **snapshot**, not a live API or automatically refreshing feed.
- Added prominent Texas polling card, a distinct **Polling leaders** map tab, Texas polling figures inside the state detail panel, and a dated homepage link to the breakdown. **States without curated polling stay gray**, indicating unindexed data rather than tied races or Republican/Democratic leads.
- Keep poll averages, forecasts, and actual election returns clearly separated. Do not claim winner probabilities or automatic polling refresh. Next incremental improvement: curated national battleground polling coverage with source/date QA and automated expiry warnings before election night.


## 2026-10-06 multi-map atlas expansion

- Upgraded `public/senate-map.html` into a responsive 2026 **election map explorer** with four clickable state layers: combined office coverage, Senate contest states, governor contest states, and U.S. House seat-count choropleth.
- Coverage data: `public/data/election-coverage-2026.json` — 50 states, 35 Senate elections (including FL and OH specials), 36 governor elections, **435** apportioned voting House seats. Checked against The Green Papers, Stateside Associates, and the U.S. Census Bureau. The map data is a dated snapshot, not a real-time vote feed.
- Geometry: `public/assets/blank-usa-map.svg`, credited to Theshibboleth (CC BY-SA 3.0) via the original SVG Map Maker project. Page includes the attribution and license.
- Implementation: `public/election-maps.js` and `public/election-maps.css`, all served as static assets; state shape hit-testing, clickable and keyboard-selectable details, responsive legends, a fallback state list, and a clearly labeled no-results-yet state.
- Added an attributed independent **governor forecast** next to the existing independent **Senate forecast**, both from PoliAgg's officially documented embeddable widgets.
- Updated the homepage to link to the full election atlas.
- Validate runtime on the published Pages URL and custom hostname. There is **no verified automatic election-night returns ingestion**; do not label a state "voted", "called", or "won" without separate verified published results.


## 2026-10-06 Senate map update

- Added `public/senate-map.html` with a live, third-party 2026 U.S. Senate forecast map using PoliAgg's explicitly permitted and attributed iframe embed. Its publication and changes are controlled by PoliAgg, not by this site. This avoids reproducing proprietary Cook ratings or licensing a map dataset.
- Added `public/data/senate-candidates-2026.json`: a dated index of selected major U.S. Senate candidates across **all 50 states**, including **35 Senate election states** and **15 states without a Senate race**. Independent challengers surfaced where salient. Names sourced from 270toWin's candidate index, checked October 6.
- Added homepage navigation and a prominent link to the map, keeping factual records and third-party predictions explicitly separate.
- The guide data does **not** claim automatic updates; the external embedded map provider says its forecast updates regularly. Recheck the candidates list before any subsequent publication refresh.
- Hosting reality: this repository's current workflow is **GitHub Pages** (`.github/workflows/pages.yml`). A production custom-domain attachment to `vote.rsymo.com` has not been verified in this pass; confirm the GitHub Pages build and domain separately.


**Project:** Indiana // 2026  
**Date:** 2026-09-29  
**Canonical repository:** `Aphexflip/indiana-2026-voter-guide`

## 2026-09-29 execution update

- Rebuilt the public static UI into a more polished source-first MVP with a dedicated methodology page, issue filtering, record counts, source-forward race cards, responsive design, and a clearly separated shop link.
- Removed election-procedure date cards from the homepage; this project is focused on candidate records and source inspection.
- Verified the previously unresolved IN-07 Republican nominee as **Patrick McAuley** using recent WFYI coverage and his FEC candidate record; updated `public/data/races.json`.
- Replaced the broken Cloudflare deploy path. The previous workflow forced Wrangler 3, which did not understand the static-assets configuration. The new workflow installs the repository's Wrangler 4 dependency and runs `npx wrangler deploy`.
- Shopify storefront exists separately and Printify is installed. Shopify smart collections already exist for **Tees**, **Hoodies**, and **Stickers**. Product publishing still needs to originate inside Printify so fulfillment linkage is preserved.
- Store and record site remain separate properties. The facts site links to `shop.rsymo.com`; products can later link back to relevant records where appropriate.

## Current launch blockers

1. **Cloudflare:** deploy workflow needs valid `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets. After the merged commit triggers CI, verify whether those secrets are already present from the workflow result.
2. **Shopify:** connected store is still on a trial plan; selling requires activation of a paid plan.
3. **Printify:** publish the first POD products from Printify itself so orders retain automatic print/fulfillment routing. Do not create duplicate live Shopify-only products first.
4. **Merch content:** keep the first test to a very small catalog and original artwork. Product economics and physical samples should be validated before paid promotion.
5. **Candidate data:** keep refreshing candidate rosters and record items from current sources; uncertain items should remain labeled rather than guessed.

## Product rule

The site is not an endorsement engine. Candidate record claims need source links, third-party ratings stay attributed, and the same sourcing/tone standard applies across candidates.

