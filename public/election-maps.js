/* Election atlas: factual contest coverage, not votes cast, winners, or forecasting. */
(function () {
  "use strict";
  const modes = {
    overview: {title:"Where the 2026 races are", description:"Each state is grouped by which major offices have contests. Every state elects U.S. House representatives; Senate and governor races vary by state."},
    senate: {title:"2026 Senate races", description:"Blue states have a U.S. Senate election in 2026, including special elections in Florida and Ohio. Dark states have no Senate contest this cycle."},
    governor: {title:"2026 governor races", description:"Orange states have a governor election in 2026. Dark states do not have a governor election this year."},
    house: {title:"U.S. House seats by state", description:"Every state has a U.S. House election in 2026. The shading shows how many voting House seats each state has, not which party is ahead."},
    polling: {title:"Verified Senate polling leads", description:"Blue = Democratic polling lead, red = Republican polling lead, gray = no source-verified polling average loaded. Currently Texas is indexed. This is not a national forecast or election result."}
  };
  const colors = {both:"#8b65ec", senate:"#2e83de", governor:"#ef9752", houseOnly:"#586b83", inactive:"#34445c",
    h1:"#426a9a", h2:"#4387b1", h3:"#4cafbf", h4:"#85dadd", demLead:"#2976d1", repLead:"#dd5860", tied:"#9f8c66"};
  const legend = {
    overview:[["#8b65ec","Senate + governor"],["#2e83de","Senate only"],["#ef9752","Governor only"],["#586b83","House only"]],
    senate:[["#2e83de","Senate election (35 states)"],["#34445c","No Senate race (15 states)"]],
    governor:[["#ef9752","Governor election (36 states)"],["#34445c","No governor race (14 states)"]],
    house:[["#426a9a","1 House seat"],["#4387b1","2–4 seats"],["#4cafbf","5–9 seats"],["#85dadd","10+ seats"]],
    polling:[["#2976d1","Democrat leads in indexed polls"],["#dd5860","Republican leads in indexed polls"],["#9f8c66","Polling average tied"],["#34445c","Polling average not indexed"]]
  };
  const ns="http://www.w3.org/2000/svg";
  const $=(id)=>document.getElementById(id);
  const tabs=[...document.querySelectorAll("[data-map-mode]")];
  const mapRegion=$("usElectionMap"), details=$("mapStateDetails"), key=$("mapLegend");
  const mapTitle=$("mapModeTitle"), mapDescription=$("mapModeDescription"), hover=$("mapHover");
  const summary=$("mapStats");
  let states=[], indexed={}, roster={}, polls={}, currentMode="overview", selected="TX", outlines=[];
  const clean=(v)=>String(v==null?"":v).replace(/[&<>"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));

  function fillFor(state,mode) {
    if (!state) return colors.inactive;
    if (mode==="polling"){const p=polls[state.abbr];return p?(p.leadPoints<0.5?colors.tied:p.leaderParty==="Democratic"?colors.demLead:colors.repLead):colors.inactive;}
    if (mode==="senate") return state.senate?colors.senate:colors.inactive;
    if (mode==="governor") return state.governor?colors.governor:colors.inactive;
    if (mode==="house") return state.houseSeats===1?colors.h1:state.houseSeats<=4?colors.h2:state.houseSeats<=9?colors.h3:colors.h4;
    return state.senate&&state.governor?colors.both:state.senate?colors.senate:state.governor?colors.governor:colors.houseOnly;
  }
  function category(state) {
    if(state.senate&&state.governor)return "Senate + governor + House";
    if(state.senate)return "Senate + House";
    if(state.governor)return "Governor + House";
    return "House only";
  }
  function labelFor(state,mode) {
    if (!state) return "District of Columbia (not a state)";
    if (mode==="polling"){const p=polls[state.abbr];return p?(p.leaderParty==="Democratic"?p.democrat:p.republican)+" +"+p.leadPoints.toFixed(1)+" percentage points (poll average; "+p.checked+")":state.senate?"Polling average not curated here":"No Senate election in 2026";}
    if (mode==="senate") return state.senate?(state.senateSpecial?"Special U.S. Senate election":"U.S. Senate election"):"No Senate contest in 2026";
    if (mode==="governor") return state.governor?"Governor election":"No governor election in 2026";
    if (mode==="house") return state.houseSeats+" voting House "+(state.houseSeats===1?"seat":"seats");
    return category(state);
  }
  function detailsHTML(code) {
    const s=indexed[code];
    if (!s) return '<small>MAP DETAIL</small><h3>Washington, D.C.</h3><div class="map-detail-value">District of Columbia is not included in the 50-state House, Senate, or governor totals shown here.</div><p class="map-detail-roster">D.C. has separate local elections and a nonvoting U.S. House delegate.</p>';
    const r=roster[code]||{};
    const yn=(v)=>v?"On the ballot":"Not on the ballot";
    let html='<small>2026 STATE ELECTIONS · '+clean(s.abbr)+'</small><h3>'+clean(s.name)+'</h3>'+
      '<div class="map-detail-line"><span>U.S. Senate</span><strong>'+clean(yn(s.senate))+(s.senateSpecial?' (special)':'')+'</strong></div>'+
      '<div class="map-detail-line"><span>Governor</span><strong>'+clean(yn(s.governor))+'</strong></div>'+
      '<div class="map-detail-line"><span>U.S. House</span><strong>'+s.houseSeats+' voting '+(s.houseSeats===1?'seat':'seats')+'</strong></div>'+
      '<div class="map-detail-value">'+clean(labelFor(s,currentMode))+'</div>';
    if (s.senate && (r.democratic||r.republican||r.other)) {
      html+='<div class="map-detail-roster"><strong>Selected Senate candidates</strong>';
      if(r.democratic)html+='<div>D · '+clean(r.democratic)+'</div>';
      if(r.republican)html+='<div>R · '+clean(r.republican)+'</div>';
      if(r.other)html+='<div>Other · '+clean(r.other)+'</div>';
      html+='</div>';
    }
    const p=polls[s.abbr];
    if(p){
      html+='<div class="map-detail-roster"><strong>Sourced Senate polling average · '+clean(p.checked)+'</strong>'+
        '<div>D · '+clean(p.democrat)+' <strong>'+p.demPct.toFixed(1)+'%</strong></div>'+
        '<div>R · '+clean(p.republican)+' <strong>'+p.repPct.toFixed(1)+'%</strong></div>'+
        '<div><strong>'+clean(p.leaderParty==="Democratic"?p.democrat:p.republican)+' +'+p.leadPoints.toFixed(1)+' points</strong> · '+clean(p.raceRating)+'</div>'+
        '<a class="map-detail-more" href="'+clean(p.sourceUrl)+'" target="_blank" rel="noopener noreferrer">Source: '+clean(p.sourceName)+' ↗</a>'+
        '<div class="state-sub">Polling window '+clean(p.pollPeriod)+'. This is not a projected winner.</div></div>';
    } else if(currentMode==="polling"&&s.senate){
      html+='<div class="map-detail-roster">No source-verified polling average has been added to this site for '+clean(s.name)+'. This does not imply polls do not exist.</div>';
    }
    html+='<a class="map-detail-more" href="https://www.stateside.com/election/2026-gubernatorial-races" target="_blank" rel="noopener noreferrer">2026 governor reference ↗</a>';
    return html;
  }
  function updateDetails() {
    details.innerHTML=detailsHTML(selected);
    outlines.forEach(p=>p.classList.toggle("state-selected",p.id===selected));
  }
  function updateMode(next) {
    if(!modes[next])return;
    currentMode=next;
    mapTitle.textContent=modes[next].title;
    mapDescription.textContent=modes[next].description;
    tabs.forEach(b=>{
      const active=b.dataset.mapMode===next;
      b.classList.toggle("active",active);
      b.setAttribute("aria-selected",String(active));
      b.tabIndex=active?0:-1;
    });
    key.innerHTML=legend[next].map(([color,label])=>'<span class="map-key"><span class="map-swatch" style="background:'+color+'"></span>'+clean(label)+'</span>').join("");
    const senateN=states.filter(s=>s.senate).length, govN=states.filter(s=>s.governor).length, bothN=states.filter(s=>s.senate&&s.governor).length;
    const stats=next==="overview"?[[bothN,"both statewide offices"],[senateN-bothN,"Senate only"],[govN-bothN,"governor only"],[50-senateN-govN+bothN,"House only"]]:
      next==="senate"?[[senateN,"Senate contests"],[50-senateN,"no Senate contest"]]:
      next==="governor"?[[govN,"governor contests"],[50-govN,"no governor contest"]]:
      next==="polling"?[[Object.keys(polls).length,"indexed polling averages"],[senateN-Object.keys(polls).length,"Senate races not yet indexed"]]:[[435,"House seats"],[50,"states"]];
    summary.innerHTML=stats.map(([value,label])=>'<span><b>'+value+'</b> '+clean(label)+'</span>').join("");
    outlines.forEach(p=>{
      const state=indexed[p.id], fill=fillFor(state,currentMode);
      p.setAttribute("fill",fill);
      const title=p.querySelector("title");
      if(title) title.textContent=(state?state.name:"District of Columbia")+" — "+labelFor(state,currentMode);
    });
    const labels=mapRegion.querySelectorAll(".map-overlay-label");
    labels.forEach(t=>{
      const s=indexed[t.dataset.state];
      t.classList.toggle("on-light",Boolean(s&&currentMode==="house"&&s.houseSeats>=10));
    });
    updateDetails();
  }
  function selectState(code) {
    selected=code;
    updateDetails();
  }
  function wireSVG(svg) {
    const newSVG=document.importNode(svg,true);
    newSVG.removeAttribute("width");newSVG.removeAttribute("height");
    newSVG.setAttribute("viewBox","0 0 959 593");
    newSVG.setAttribute("class","interactive-states-svg");
    newSVG.setAttribute("role","group");
    newSVG.setAttribute("aria-label","Interactive map of 50 U.S. states and Washington, D.C.");
    newSVG.setAttribute("preserveAspectRatio","xMidYMid meet");
    mapRegion.replaceChildren(newSVG);
    outlines=[...newSVG.querySelectorAll("#outlines path[id], #outlines circle[id]")].filter(p=>/^[A-Z]{2}$/.test(p.id));
    if(outlines.length!==51)throw Error("State geometry incomplete");
    for(const p of outlines){
      const s=indexed[p.id];
      const title=p.querySelector("title")||document.createElementNS(ns,"title");
      if(!title.parentNode)p.appendChild(title);
      p.setAttribute("tabindex","0");p.setAttribute("role","button");
      p.setAttribute("aria-label",s?s.name:"District of Columbia");
      p.addEventListener("click",()=>selectState(p.id));
      p.addEventListener("keydown",(e)=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();selectState(p.id)}});
      p.addEventListener("mouseenter",()=>{hover.textContent=(s?s.name:"Washington, D.C.")+" · "+labelFor(s,currentMode)});
      p.addEventListener("mouseleave",()=>{hover.textContent="Select any state to inspect its races"});
      if(s){
        try{
          const box=p.getBBox();
          if(box.width>=42&&box.height>=30&&p.id!=="MI"&&p.id!=="VA"&&p.id!=="FL"){
            const text=document.createElementNS(ns,"text");
            text.setAttribute("x",String(box.x+box.width/2));
            text.setAttribute("y",String(box.y+box.height/2+4));
            text.setAttribute("class","map-overlay-label");
            text.dataset.state=p.id;
            text.textContent=p.id;
            newSVG.appendChild(text);
          }
        }catch(_e){/* Shapes remain interactive if bounding boxes are unavailable. */}
      }
    }
    updateMode(currentMode);
  }
  function fallback(error) {
    mapRegion.innerHTML='<div style="padding:20px;color:#d5e4f9">Map artwork unavailable. Choose a state using the list below.</div>'+
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(74px,1fr));gap:5px;padding:10px">'+
      states.map(s=>'<button type="button" data-state="'+clean(s.abbr)+'" style="background:#1e3550;border:1px solid #455b7c;color:white;padding:12px 5px;border-radius:8px;cursor:pointer">'+clean(s.abbr)+'</button>').join("")+'</div>';
    mapRegion.querySelectorAll("[data-state]").forEach(b=>b.addEventListener("click",()=>selectState(b.dataset.state)));
    updateMode(currentMode);
    console.warn("Map graphic unavailable; state list remains functional",error);
  }
  tabs.forEach(b=>b.addEventListener("click",()=>updateMode(b.dataset.mapMode)));
  const statePromise=fetch("data/election-coverage-2026.json").then(r=>{if(!r.ok)throw Error("Cannot retrieve coverage");return r.json()});
  const svgPromise=fetch("assets/blank-usa-map.svg").then(r=>{if(!r.ok)throw Error("Cannot retrieve map");return r.text()});
  const rosterPromise=fetch("data/senate-candidates-2026.json").then(r=>r.ok?r.json():{states:[]}).catch(()=>({states:[]}));
  const pollPromise=fetch("data/senate-polling-snapshots-2026.json").then(r=>r.ok?r.json():{polls:[]}).catch(()=>({polls:[]}));
  Promise.all([statePromise,svgPromise.catch(e=>null),rosterPromise,pollPromise]).then(([data,svgText,rosters,pollData])=>{
    if(!data||!Array.isArray(data.states)||data.states.length!==50)throw Error("2026 coverage data incomplete");
    states=data.states;indexed=Object.fromEntries(states.map(s=>[s.abbr,s]));
    roster=Object.fromEntries((rosters.states||[]).map(s=>[s.abbr,s]));
    polls=Object.fromEntries((pollData.polls||[]).filter(p=>p.state&&p.sourceUrl&&Number.isFinite(p.demPct)&&Number.isFinite(p.repPct)&&Number.isFinite(p.leadPoints)).map(p=>[p.state,p]));
    const spotlight=$("pollSpotlightData");
    if(spotlight){
      const tx=polls.TX;
      if(tx){
        const winner=tx.leaderParty==="Democratic"?tx.democrat:tx.republican;
        spotlight.innerHTML='<div class="poll-headline"><span>'+clean(tx.democrat)+' <b>'+tx.demPct.toFixed(1)+'%</b></span><span>vs</span><span>'+clean(tx.republican)+' <b>'+tx.repPct.toFixed(1)+'%</b></span></div>'+
          '<div class="poll-range"><div style="flex:'+tx.demPct+';background:#2477d4"></div><div style="flex:'+tx.repPct+';background:#cb3a52"></div></div>'+
          '<div class="poll-lead">'+clean(winner)+' leads by <strong>'+tx.leadPoints.toFixed(1)+' points</strong> in '+clean(tx.sourceName)+' polling average. <strong>'+clean(tx.raceRating)+'</strong> rating.</div>'+
          '<div class="poll-sources">Polling window '+clean(tx.pollPeriod)+' · checked '+clean(tx.checked)+' · <a href="'+clean(tx.sourceUrl)+'" target="_blank" rel="noopener noreferrer">See current polls ↗</a></div>';
      } else {
        spotlight.innerHTML='<p>Polling snapshot unavailable. <a href="https://www.realclearpolling.com/elections/senate/2026/texas" target="_blank" rel="noopener noreferrer">Check current Texas polling directly ↗</a></p>';
      }
    }
    if(!svgText) {fallback("SVG file could not load");return;}
    const parsed=new DOMParser().parseFromString(svgText,"image/svg+xml");
    if(parsed.querySelector("parsererror")) {fallback("SVG parse failed");return;}
    try{wireSVG(parsed.documentElement)}catch(e){fallback(e.message)}
  }).catch(err=>{
    mapRegion.textContent="Election map coverage temporarily unavailable.";
    details.textContent="Please try again later.";
    console.error(err);
  });
})();
