const PARTY_ABBR = { Democratic: "D", Republican: "R", Libertarian: "L" };
const FEATURED_IDS = ["in-05","in-01","in-sos"];

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[c]));
}
function partyClass(party) { return party === "Democratic" ? "d" : party === "Republican" ? "r" : ""; }
function stateName(race) { return race.state || (/Indiana/i.test(race.office || "") || /^in-/.test(race.id || "") ? "Indiana" : "Other"); }
function allIssueTags(data) {
  const tags = new Set();
  for (const race of data.races || []) for (const c of race.candidates || [])
    for (const item of c.record || []) for (const t of item.issueTags || []) tags.add(t);
  return [...tags].sort();
}
function countRecords(data) {
  return (data.races || []).reduce((n, race) => n + (race.candidates || []).reduce((m,c)=>m+(c.record||[]).length,0),0);
}
function partyTag(c) {
  const party=escapeHTML(c.party||"");
  return `<span class="party-tag ${partyClass(c.party)}" title="${party}">${escapeHTML(PARTY_ABBR[c.party]||c.party||"?")}</span>`;
}
function matchupHTML(race) {
  return (race.candidates || []).map(c=>`${escapeHTML(c.name)}${partyTag(c)}`).join(" vs. ");
}
function renderIndex(data) {
  const list=document.getElementById("raceList");
  const issueBar=document.getElementById("issueFilter");
  const stateBar=document.getElementById("stateFilter");
  const featured=document.getElementById("featuredRaces");
  document.getElementById("raceCount").textContent=String((data.races||[]).length);
  document.getElementById("recordCount").textContent=String(countRecords(data));
  let activeTag=null, activeState=null;

  const featuredRaces=FEATURED_IDS.map(id=>(data.races||[]).find(r=>r.id===id)).filter(Boolean);
  featured.innerHTML=featuredRaces.map(r=>`
    <a class="featured-card" href="race.html?race=${encodeURIComponent(r.id)}">
      <div>
        <div class="kicker">${escapeHTML(stateName(r))} · ${escapeHTML(r.category||"Race")}</div>
        <h3>${escapeHTML(r.office)}</h3>
        <div class="matchup">${matchupHTML(r)}</div>
      </div>
      <div class="go">Open record <span>→</span></div>
    </a>`).join("");

  function matches(r) {
    const stateOk=!activeState || stateName(r)===activeState;
    const issueOk=!activeTag || (r.candidates||[]).some(c=>(c.record||[]).some(item=>(item.issueTags||[]).includes(activeTag)));
    return stateOk && issueOk;
  }
  function raceCardHTML(race) {
    return `<a class="race-card" href="race.html?race=${encodeURIComponent(race.id)}">
      <div><div class="office">${escapeHTML(stateName(race))} · ${escapeHTML(race.office)}</div>
      <div class="matchup">${matchupHTML(race)}</div>
      ${race.note?`<div class="race-note">${escapeHTML(race.note)}</div>`:""}</div>
      <div class="arrow" aria-hidden="true">→</div></a>`;
  }
  function draw() {
    const visible=(data.races||[]).filter(matches);
    const categories=[...new Set(visible.map(r=>r.category||"Other"))];
    list.innerHTML="";
    for(const category of categories){
      const inCategory=visible.filter(r=>(r.category||"Other")===category);
      const section=document.createElement("section");
      section.innerHTML=`<h2>${escapeHTML(category)}</h2>`+inCategory.map(raceCardHTML).join("");
      list.appendChild(section);
    }
    if(!visible.length) list.innerHTML='<p class="race-note">No records match those filters yet.</p>';
  }
  function addChip(bar,label,value,type){
    const chip=document.createElement("button"); chip.className="chip"+(value===null?" active":""); chip.textContent=label;
    chip.onclick=()=>{
      if(type==="state") activeState=value; else activeTag=value;
      [...bar.children].forEach(c=>c.classList.remove("active")); chip.classList.add("active"); draw();
    };
    bar.appendChild(chip);
  }
  const states=[...new Set((data.races||[]).map(stateName))].sort();
  addChip(stateBar,"All states",null,"state"); states.forEach(s=>addChip(stateBar,s,s,"state"));
  addChip(issueBar,"All issues",null,"issue"); allIssueTags(data).forEach(t=>addChip(issueBar,t,t,"issue"));
  draw();
}
function renderRace(data,raceId){
  const race=(data.races||[]).find(r=>r.id===raceId), header=document.getElementById("raceHeader"), candidatesEl=document.getElementById("candidates");
  if(!race){header.innerHTML="<h1>Race not found</h1>";candidatesEl.innerHTML='<p class="race-note">Return to the race list and choose another record.</p>';return;}
  document.title=`${race.office} — THE RECORD // 2026`;
  header.innerHTML=`<div class="eyebrow split"><span>${escapeHTML(stateName(race))} · ${escapeHTML(race.category||"Race")}</span></div><h1>${escapeHTML(race.office)}</h1>${race.note?`<p class="tagline">${escapeHTML(race.note)}</p>`:""}`;
  candidatesEl.innerHTML="";
  for(const c of race.candidates||[]){
    const card=document.createElement("article"); card.className="candidate-card";
    const records=(c.record||[]).map(item=>`<div class="record-item">
      <div class="tags">${(item.issueTags||[]).map(t=>`<span class="tag">${escapeHTML(t)}</span>`).join("")}</div>
      <div class="fact">${escapeHTML(item.fact)}</div>
      <a class="source" href="${escapeHTML(item.source)}" target="_blank" rel="noopener noreferrer">Open source ↗${item.asOf?` · ${escapeHTML(item.asOf)}`:""}</a>
    </div>`).join("");
    card.innerHTML=`<h2>${escapeHTML(c.name)}${partyTag(c)}</h2>
      <div class="primary-result">${escapeHTML(c.primaryResult||"")}${c.incumbent?" · Incumbent":""}</div>
      ${records||""}${c.recordStatus?`<div class="record-status">${escapeHTML(c.recordStatus)}</div>`:""}`;
    candidatesEl.appendChild(card);
  }
}
fetch("data/races.json").then(r=>{if(!r.ok) throw new Error("Could not load race data");return r.json();}).then(data=>{
  if(document.getElementById("raceList")) renderIndex(data);
  else if(document.getElementById("candidates")) renderRace(data,new URLSearchParams(location.search).get("race"));
}).catch(err=>{const target=document.getElementById("raceList")||document.getElementById("candidates");if(target) target.innerHTML=`<p class="race-note">${escapeHTML(err.message)}</p>`;});