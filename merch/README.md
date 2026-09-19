# Merch — HOOSIER RECEIPTS (working name, not final)

This is intentionally a different brand from the facts site. The facts site's whole value is "we don't take a side" — this can absolutely take a side, be funny, be sharp, but it has to live somewhere that doesn't undercut the facts site's credibility.

**Working name: "Hoosier Receipts."** Rationale: "receipts" as in proof/evidence ties directly to the facts site's whole model (every slogan traces to a sourced record item), it's Indiana-flavored, and it reads as opinionated/satirical on its face so nobody mistakes it for the neutral brand. Easy to change — nothing else depends on this name yet.

## Before designing anything

Read `../COMPLIANCE.md`. In short:

- Every shirt and yard sign needs a "Paid for by [you/your org]" disclaimer in readable type — shirts/signs don't qualify for the small-item exemption.
- Check current independent-expenditure reporting thresholds in Indiana's official Campaign Finance Manual before committing real production spend.
- Don't coordinate with any campaign.
- Every slogan traces back to a specific, sourced record item in `../public/data/races.json` — see `slogans-draft.md` for first-pass concepts, all pulled from data already in that file.

## Suggested approach (not yet built)

- **Fulfillment:** print-on-demand (Printful or Printify) behind a simple storefront (Shopify, or Printful's own built-in storefront) — no inventory risk, and you can react fast as races tighten. **This needs your accounts** — a business/creator account, a connected bank account or payout method, and (for Shopify) a subscription. Not something that can be scaffolded without you.
- **Content pipeline:** every slogan should trace back to a specific, sourced record item in `../public/data/races.json` — reuse that data instead of inventing new unsourced claims.

## Status

- [x] Brand name proposed (provisional)
- [x] First-pass slogan concepts drafted, sourced (`slogans-draft.md`) — **not reviewed, not final, not approved for print**
- [ ] Storefront platform account created (needs you)
- [ ] Disclaimer imprint finalized with actual "paid for by" line (needs you to decide what entity/name goes on it)
- [ ] Attorney review (see `../COMPLIANCE.md` checklist)
- [ ] First products live
