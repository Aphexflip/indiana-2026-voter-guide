const PARTY_ABBR = { Democratic: "D", Republican: "R", Libertarian: "L" };

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[c]));
}
function partyClass(party) {
  if (party === "Democratic") return "d";
  if (party === "Republican") return "r";
  return "";
}
function allIssueTags(data) {
  const tags = new Set();
  for (const race of data.races || []) for (const c of race.candidates || [])
    for (const item of c.record || []) for (const t of item.issueTags || []) tags.add(t);
  return [...tags].sort();
}
function raceMatchesTag(race, tag) {
  if (!tag) return true;
  return (race.candidates || []).some((c) =>
    (c.record || []).some((item) => (item.issueTags || []).includes(tag))
  );
}
function countRecords(data) {
  return (data.races || []).reduce((n, race) =>
    n + (race.candidates || []).reduce((m, c) => m + (c.record || []).length, 0), 0);
}
function partyTag(c) {
  const party = escapeHTML(c.party || "");
  const abbr = escapeHTML(PARTY_ABBR[c.party] || c.party || "?");
  return `<span class="party-tag ${partyClass(c.party)}" title="${party}">${abbr}</span>`;
}
function renderIndex(data) {
  const list = document.getElementById("raceList");
  const filterBar = document.getElementById("issueFilter");
  const raceCount = document.getElementById("raceCount");
  const recordCount = document.getElementById("recordCount");
  if (raceCount) raceCount.textContent = String((data.races || []).length);
  if (recordCount) recordCount.textContent = String(countRecords(data));
  let activeTag = null;

  function raceCardHTML(race) {
    const matchup = (race.candidates || []).map((c) =>
      `${escapeHTML(c.name)}${partyTag(c)}`
    ).join(" vs. ");
    return `
      <a class="race-card" href="race.html?race=${encodeURIComponent(race.id)}">
        <div>
          <div class="office">${escapeHTML(race.office)}</div>
          <div class="matchup">${matchup}</div>
          ${race.note ? `<div class="race-note">${escapeHTML(race.note)}</div>` : ""}
        </div>
        <div class="arrow" aria-hidden="true">→</div>
      </a>`;
  }
  function draw() {
    const visible = (data.races || []).filter((r) => raceMatchesTag(r, activeTag));
    const categories = [...new Set((data.races || []).map((r) => r.category || "Other"))];
    list.innerHTML = "";
    for (const category of categories) {
      const inCategory = visible.filter((r) => (r.category || "Other") === category);
      if (!inCategory.length) continue;
      const section = document.createElement("section");
      section.innerHTML = `<h2>${escapeHTML(category)}</h2>` + inCategory.map(raceCardHTML).join("");
      list.appendChild(section);
    }
    if (!visible.length) list.innerHTML = `<p class="race-note">No current records tagged "${escapeHTML(activeTag)}".</p>`;
  }

  const tags = allIssueTags(data);
  const makeChip = (label, tag) => {
    const chip = document.createElement("button");
    chip.className = "chip" + (tag === null ? " active" : "");
    chip.textContent = label;
    chip.onclick = () => {
      activeTag = tag;
      [...filterBar.children].forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      draw();
    };
    filterBar.appendChild(chip);
  };
  makeChip("All issues", null);
  tags.forEach((tag) => makeChip(tag, tag));
  draw();
}
function renderRace(data, raceId) {
  const race = (data.races || []).find((r) => r.id === raceId);
  const header = document.getElementById("raceHeader");
  const candidatesEl = document.getElementById("candidates");
  if (!race) {
    header.innerHTML = "<h1>Race not found</h1>";
    candidatesEl.innerHTML = '<p class="race-note">Return to the race list and choose another record.</p>';
    return;
  }
  document.title = `${race.office} — Indiana // 2026`;
  header.innerHTML = `<div class="eyebrow">${escapeHTML(race.category || "Race")}</div><h1>${escapeHTML(race.office)}</h1>${race.note ? `<p class="tagline">${escapeHTML(race.note)}</p>` : ""}`;
  candidatesEl.innerHTML = "";
  for (const c of race.candidates || []) {
    const card = document.createElement("article");
    card.className = "candidate-card";
    const records = (c.record || []).map((item) => `
      <div class="record-item">
        <div class="tags">${(item.issueTags || []).map((t) => `<span class="tag">${escapeHTML(t)}</span>`).join("")}</div>
        <div class="fact">${escapeHTML(item.fact)}</div>
        <a class="source" href="${escapeHTML(item.source)}" target="_blank" rel="noopener noreferrer">Open source ↗${item.asOf ? ` · ${escapeHTML(item.asOf)}` : ""}</a>
      </div>`).join("");
    card.innerHTML = `
      <h2>${escapeHTML(c.name)}${partyTag(c)}</h2>
      <div class="primary-result">${escapeHTML(c.primaryResult || "")}${c.incumbent ? " · Incumbent" : ""}</div>
      ${records || ""}
      ${c.recordStatus ? `<div class="record-status">${escapeHTML(c.recordStatus)}</div>` : ""}
    `;
    candidatesEl.appendChild(card);
  }
}
fetch("data/races.json")
  .then((r) => { if (!r.ok) throw new Error("Could not load race data"); return r.json(); })
  .then((data) => {
    if (document.getElementById("raceList")) renderIndex(data);
    else if (document.getElementById("candidates")) renderRace(data, new URLSearchParams(location.search).get("race"));
  })
  .catch((err) => {
    const target = document.getElementById("raceList") || document.getElementById("candidates");
    if (target) target.innerHTML = `<p class="race-note">${escapeHTML(err.message)}</p>`;
  });