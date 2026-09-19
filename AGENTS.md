# Continuity rules

Read this before adding or editing any content. These rules exist because the whole product's value collapses if the facts site becomes an advocacy site — and because Indiana election law treats those two things very differently.

## Non-negotiable

1. **Never write "vote for X" or "don't vote for X" anywhere in `public/`.** Frame everything as "X did Y — here's the source." Let the reader connect it to their own priorities.
2. **Treat every candidate in a race identically.** Same number of record items where possible, same tone, same level of scrutiny. If you can't find sourced material on one candidate, say so explicitly ("no verified record items yet for X") rather than leaving them thin while their opponent looks bad by comparison.
3. **No claim without a citation.** A URL to a primary source (roll call vote, bill text, official transcript, campaign's own site for a direct quote) or a well-established secondary source (Ballotpedia, GovTrack, a named news outlet). If you can't source it, don't publish it.
4. **Third-party scorecards are quoted, not adopted.** "Heritage Action rates their votes 92% aligned with [Heritage Action's] positions" — not "this candidate is 92% conservative."
5. **No editorializing in `public/`.** No adjectives implying good/bad ("failed to," "finally," "extreme"). State what happened; tag it by issue; move on.
6. **Update `CURRENT_CHECKPOINT.md`** whenever you add a race, add record items, or change the data schema, so the next session (human or AI) doesn't have to re-derive state.
7. **Merch (`merch/`) is allowed to be opinionated** — that's a separate, explicitly-labeled brand — but never claim the merch brand is neutral, and never skip the disclaimer requirements in `COMPLIANCE.md`.
8. **No coordination with any candidate or campaign.** This keeps the project in "independent" territory rather than in-kind contribution territory. If a campaign reaches out, that's a decision for the human running this project, not something to just say yes to.

## Data schema

`public/data/races.json` — one object per race:

```json
{
  "id": "in-05",
  "office": "U.S. House, Indiana District 5",
  "candidates": [
    {
      "name": "...",
      "party": "Republican | Democratic | ...",
      "incumbent": true,
      "primaryResult": "...",
      "record": [
        { "issueTags": ["..."], "fact": "...", "source": "https://...", "asOf": "2026-09" }
      ],
      "sources": ["https://..."]
    }
  ]
}
```

Adding a race: add one object to the `races` array in `races.json`. No code changes needed — `app.js` renders from data.
