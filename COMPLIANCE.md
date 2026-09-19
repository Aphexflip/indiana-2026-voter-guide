# Compliance notes — read before publishing or selling anything

This is a working summary for planning purposes, not legal advice. Get an actual Indiana election-law attorney to review before any merch ships or any real money is spent — the cost of that review is small next to the cost of a campaign-finance violation or a defamation claim with a named candidate as plaintiff.

## 1. The facts site (`public/`) — express advocacy line

Indiana and federal campaign finance law both turn on whether a communication is "express advocacy" (tells people to vote for/against a clearly identified candidate) versus voter education/issue information. Express advocacy triggers disclaimer and, above spending thresholds, registration/reporting obligations.

**Why this project is designed to stay on the education side of that line:**
- Content states what a candidate did, with a source. It does not tell the reader what to do about it.
- Every candidate in a race gets equivalent treatment.
- No "vote for," "vote against," "support," or "reject" language anywhere in `public/`.

If this ever changes — if the site starts ranking candidates, scoring them "recommended," or saying who to vote for — it has become express advocacy and needs disclaimers on every page, and possibly PAC registration depending on spend. Don't let that drift happen silently; if you want to make that call, make it deliberately and get it reviewed.

## 2. Printed merch (shirts, yard signs) — disclaimer requirement

Indiana Code 3-9-3-2.5 requires most printed political communications that support or oppose a candidate, party, or public question to carry a clear "paid for by [person/committee]" disclaimer:

- At least 7-point type, with contrast sufficient to actually be readable.
- Placed so it's not easily overlooked — not buried in fine print nobody will find.
- There's a narrow exemption for genuinely tiny items (bumper stickers, pins, buttons, pens). **T-shirts and yard signs are very unlikely to qualify for that exemption** — plan for every shirt and sign to carry a disclaimer line.

Reference: [Indiana Code 3-9-3-2.5](https://law.justia.com/codes/indiana/title-3/article-9/chapter-3/section-3-9-3-2-5/), [Secretary of State disclaimer brochure](https://www.in.gov/sos/elections/files/2022-Disclaimer-Brochure.pdf), [2026 Campaign Finance Manual](https://www.in.gov/sos/elections/files/2026-Campaign-Finance-Manual.FINAL.11-12-25.pdf).

## 3. Spending thresholds / registration

If merch sales function as an "independent expenditure" advocating for or against a clearly identified candidate, Indiana (and federal law, for the U.S. House races) may require registration and periodic reporting once spending crosses a threshold. Check the current threshold in the official Campaign Finance Manual (linked above) before committing real ad spend or production budget — don't rely on this document for the number, it can change year to year.

## 4. Defamation / accuracy risk

Any specific factual claim about a candidate ("voted against X," "sponsored Y") needs to be independently verifiable and actually true — a wrong claim about a real, identifiable person is a real legal exposure for whoever published it, not just an "oops, corrected." This is the practical reason `AGENTS.md` rule 3 ("no claim without a citation") is non-negotiable, not a style preference.

## 5. Trademark / name-and-likeness on merch

Using a candidate's name or likeness on satirical/commentary merch generally has First Amendment protection, but "generally" isn't "always" — avoid anything that could be read as a false statement of fact about the person (as opposed to obvious opinion/satire), and avoid implying the candidate or their campaign endorsed or is selling the merch.

## Bottom line before launch

- [ ] Facts site reviewed for advocacy language (should be none)
- [ ] Every merch item has a compliant disclaimer
- [ ] Current spending/reporting thresholds checked against this cycle's official manual
- [ ] No coordination with any campaign
- [ ] An actual attorney has looked at this before real money moves
