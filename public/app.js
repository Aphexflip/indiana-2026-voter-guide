const PARTY_ABBR = { Democratic: "D", Republican: "R" };

function partyClass(party) {
  if (party === "Democratic") return "d";
  if (party === "Republican") return "r";
  return "";
}

function allIssueTags(data) {
  const tags = new Set();
  for (const race of data.races) {
    for (const c of race.candidates) {
      for (const item of c.record || []) {
        for (const t of item.issueTags || []) tags.add(t);
      }
    }
  }
  return [...tags].sort();
}

function raceMatchesTag(race, tag) {
  if (!tag) return true;
  return race.candidates.some((c) =>
    (c.record || []).some((item) => (item.issueTags || []).includes(tag))
  );
}

function renderIndex(data) {
  const list = document.getElementById("raceList");
  const filterBar = document.getElementById("issueFilter");
  let activeTag = null;

  function raceCardHTML(race) {
    const matchup = race.candidates
      .map(
        (c) =>
          `${c.name}<span class="party-tag ${partyClass(c.party)}">${
            PARTY_ABBR[c.party] || c.party
          }</span>`
      )
      .join(" vs. ");
    return `
      <a class="race-card" href="race.html?race=${encodeURIComponent(race.id)}">
        <div class="office">${race.office}</div>
        <div class="matchup">${matchup}</div>
        ${race.note ? `<div class="race-note">${race.note}</div>` : ""}
      </a>`;
  }

  function draw() {
    const visible = data.races.filter((r) => raceMatchesTag(r, activeTag));
    const categories = [...new Set(data.races.map((r) => r.category || "Other"))];

    list.innerHTML = "";
    for (const category of categories) {
      const inCategory = visible.filter((r) => (r.category || "Other") === category);
      if (!inCategory.length) continue;
      const section = document.createElement("section");
      section.innerHTML = `<h2>${category}</h2>` + inCategory.map(raceCardHTML).join("");
      list.appendChild(section);
    }
    if (!visible.length) {
      list.innerHTML = `<p class="race-note">No races tagged "${activeTag}" yet.</p>`;
    }
  }

  const tags = allIssueTags(data);
  const allChip = document.createElement("button");
  allChip.className = "chip active";
  allChip.textContent = "All issues";
  allChip.onclick = () => {
    activeTag = null;
    [...filterBar.children].forEach((c) => c.classList.remove("active"));
    allChip.classList.add("active");
    draw();
  };
  filterBar.appendChild(allChip);

  for (const tag of tags) {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.textContent = tag;
    chip.onclick = () => {
      activeTag = tag;
      [...filterBar.children].forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      draw();
    };
    filterBar.appendChild(chip);
  }

  draw();
}

function renderRace(data, raceId) {
  const race = data.races.find((r) => r.id === raceId);
  const header = document.getElementById("raceHeader");
  const candidatesEl = document.getElementById("candidates");

  if (!race) {
    header.innerHTML = `<h1>Race not found</h1>`;
    return;
  }

  header.innerHTML = `
    <h1>${race.office}</h1>
    ${race.note ? `<p class="tagline">${race.note}</p>` : ""}
  `;

  candidatesEl.innerHTML = "";
  for (const c of race.candidates) {
    const card = document.createElement("div");
    card.className = "candidate-card";
    const records = (c.record || [])
      .map(
        (item) => `
        <div class="record-item">
          <div class="tags">${(item.issueTags || [])
            .map((t) => `<span class="tag">${t}</span>`)
            .join("")}</div>
          <div class="fact">${item.fact}</div>
          <a class="source" href="${item.source}" target="_blank" rel="noopener">Source${
          item.asOf ? ` &middot; as of ${item.asOf}` : ""
        }</a>
        </div>`
      )
      .join("");

    card.innerHTML = `
      <h2>${c.name}<span class="party-tag ${partyClass(c.party)}">${
      PARTY_ABBR[c.party] || c.party
    }</span></h2>
      <div class="primary-result">${c.primaryResult || ""}${
      c.incumbent ? " &middot; Incumbent" : ""
    }</div>
      ${records || ""}
      ${
        c.recordStatus
          ? `<div class="record-status">${c.recordStatus}</div>`
          : ""
      }
    `;
    candidatesEl.appendChild(card);
  }
}

fetch("data/races.json")
  .then((r) => r.json())
  .then((data) => {
    if (document.getElementById("raceList")) {
      renderIndex(data);
    } else if (document.getElementById("candidates")) {
      const params = new URLSearchParams(location.search);
      renderRace(data, params.get("race"));
    }
  });
