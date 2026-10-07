/* Source-separated national election desk. Each metric is labeled with its provider and date.
 * Forecast probabilities are NEVER certified results. State-feed leaders are NEVER winners.
 */
(()=>{"use strict";
 const API="https://www.pollingforecast.com/api/us/";
 const RESULTS="https://openamerica.io/elections/results.json?year=2026&office=";
 const COLORS={D:"#2876d8",R:"#d54f61",I:"#906acb",none:"#36465e",close:"#6f7d92"};
 const el=id=>document.getElementById(id);
 const esc=v=>String(v==null?"":v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const datePretty=v=>{if(!v)return "date unavailable";const x=String(v).slice(0,10);return /^\d{4}-\d{2}-\d{2}$/.test(x)?x:"date unavailable"};
 const validUrl=v=>typeof v==="string"&&/^https:\/\/[^\s"'<>]+$/i.test(v);
 const pct=v=>typeof v==="number"&&Number.isFinite(v)?Math.round(v*100)+"%":"not available";
 const fixed=v=>Number.isFinite(v)?Math.abs(v).toFixed(1):"—";
 let stateRows=[], stateBy={}, forecast={senate:null,governors:null,house:null}, errors={}, results={senate:null,governors:null,house:null}, returnErrors={};
 let texas=null, view="polls", office="senate", selected="TX", mapShapes=[], spinner=true, query="";
 function raceRows(st,of=office){const feed=forecast[of];return feed&&Array.isArray(feed.rows)?feed.rows.filter(r=>r.state===st):[]}
 function hasRace(st,of=office){
   const s=stateBy[st];if(!s)return false;
   if(of==="senate")return !!s.senate;
   if(of==="governors")return !!s.governor;
   return true;
 }
 function partyLetter(v){return v==="D"?"D":v==="R"?"R":v==="I"?"I":null}
 function partyName(v){return v==="D"?"Democratic":v==="R"?"Republican":v==="I"?"Independent":"Unspecified"}
 function left(r){return partyLetter(r.left_party)||"D"}
 function projection(r){
   const win=partyLetter(r.winner);
   if(!win||!Number.isFinite(Number(r.chance_left)))return null;
   const l=left(r), w=win==="R"?"R":l;
   const candidate=w==="R"?r.rep_candidate:r.left_candidate;
   const chance=w==="R"?1-Number(r.chance_left):Number(r.chance_left);
   return {party:w,candidate:candidate||"Unnamed candidate",chance,rating:r.rating||"No rating",margin:Number.isFinite(r.best_bet_margin)?r.best_bet_margin:null};
 }
 function polling(r){
   if(office==="senate"&&r.state==="TX"&&texas&&texas.checked>(forecast.senate?.asOf||"")){
     return {party:texas.leaderParty==="Democratic"?"D":"R",margin:texas.leaderParty==="Democratic"?texas.leadPoints:-texas.leadPoints,source:texas.sourceName,date:texas.checked,polls:null,detail:texas};
   }
   if(!(Number(r.polls_used)>0)||!Number.isFinite(r.poll_average))return null;
   return {party:r.poll_average>=0?left(r):"R",margin:r.poll_average,source:"Polling Forecast (weighted poll average)",date:forecast[office]?.asOf||"",polls:r.polls_used};
 }
 function countedRace(r,of=office){
   const feed=results[of];if(!feed||!feed.races||typeof feed.races!=="object")return null;
   const possible=of==="senate"?(r.special?[r.state+"-special",r.state+"-S",r.state]:[r.state]):
     of==="governors"?[r.state]:[r.key,String(r.key).replace(/-0(\d)$/,"-$1")];
   return possible.map(k=>feed.races[k]).find(Boolean)||null;
 }
 function officiallyCalled(rr){return !!(rr&&rr.called===true&&rr.winner&&Array.isArray(rr.cands)&&rr.cands.some(c=>c.p===rr.winner&&(c.w===true||rr.called===true)))}
 function sourceTime(of=office){return forecast[of]?.asOf||null}
 function lastResultsUpdate(of=office){return results[of]?.as_of||null}
 function getSummary(st,of=office,mode=view){
   if(!hasRace(st,of))return {status:"No "+(of==="senate"?"Senate":of==="governors"?"governor":"House")+" race in 2026",color:COLORS.none,detail:"No contest"};
   const rows=raceRows(st,of);
   if(mode==="results"){
     const f=results[of];
     if(!f)return {status:"Returns feed unavailable",color:COLORS.none,detail:"Official feed not available"};
     const reporting=rows.map(r=>countedRace(r,of)).filter(r=>r&&r.total>0);
     const called=reporting.filter(officiallyCalled);
     if(called.length){
       if(of==="house")return {status:called.length+" called / "+rows.length+" districts",color:COLORS.close,detail:"Verified calls only"};
       const r=called[0];return {status:"Winner reported: "+partyName(r.winner),color:COLORS[r.winner]||COLORS.none,detail:"Race called by feed"};
     }
     if(reporting.length) return {status:of==="house"?reporting.length+" districts counting":"Counting · not called",color:COLORS.close,detail:"Unofficial vote totals, no confirmed winner"};
     return {status:"No confirmed winner yet",color:COLORS.none,detail:"No 2026 returns yet"};
   }
   if(!forecast[of])return {status:errors[of]?"Forecast feed unavailable":"Loading data…",color:COLORS.none,detail:"External source not loaded"};
   if(!rows.length)return {status:"No race record",color:COLORS.none,detail:"Source unavailable for this state"};
   if(mode==="forecast"){
     const valid=rows.map(projection).filter(Boolean);
     if(!valid.length)return {status:"No published projection",color:COLORS.none,detail:"Not enough model data"};
     if(of==="house"){
       const d=valid.filter(x=>x.party==="D").length, r=valid.filter(x=>x.party==="R").length, i=valid.filter(x=>x.party==="I").length;
       const color=d>r?COLORS.D:r>d?COLORS.R:COLORS.close;
       return {status:d+"D · "+r+"R"+(i?" · "+i+"I":""),color,detail:"Projected seats, not results"};
     }
     const p=valid[0];
     return {status:(p.rating.toLowerCase().includes("toss")?"Slight model edge: ":"Model favors: ")+p.candidate,color:COLORS[p.party]||COLORS.none,detail:pct(p.chance)+" win chance · "+p.rating};
   }
   const leads=rows.map(polling).filter(Boolean);
   if(!leads.length)return {status:"No published poll average",color:COLORS.none,detail:"May still have individual polls"};
   if(of==="house"){
     const d=leads.filter(p=>p.party==="D").length,r=leads.filter(p=>p.party==="R").length,i=leads.filter(p=>p.party==="I").length;
     return {status:"Polled districts: "+leads.length+"/"+rows.length,color:d>r?COLORS.D:r>d?COLORS.R:COLORS.close,detail:d+" D leads · "+r+" R leads"+(i?" · "+i+" I leads":"")};
   }
   const p=leads[0];
   return {status:(p.party==="R"?"R":p.party==="I"?"I":"D")+" +"+fixed(p.margin)+" pts",color:COLORS[p.party]||COLORS.none,detail:p.source+" · "+datePretty(p.date)};
 }
 function legend(){
   const items=view==="polls"?[["D","Democratic/independent left-side lead"],["R","Republican poll lead"],["none","No documented polling average"]]:
      view==="forecast"?[["D","Model favors Democrat"],["R","Model favors Republican"],["I","Model favors independent"],["none","No contest or forecast"]]:
      [["D","Source-reported called Democratic winner"],["R","Source-reported called Republican winner"],["close","Votes counting (no winner called)"],["none","Not called or unavailable"]];
   el("deskLegend").innerHTML=items.map(([k,label])=>'<span><i style="background:'+COLORS[k]+'"></i>'+esc(label)+'</span>').join("");
 }
 function sourceNote(){
   const label={senate:"U.S. Senate",governors:"governor",house:"U.S. House"}[office];
   if(view==="results"){
     const r=results[office];
     const fmt=r?"Most recent official-source update: "+(r.as_of?datePretty(r.as_of):"none")+". "+(r.counting?"Reporting has begun.":"No current results reported."):"Official returns feed unavailable or blocked. No winners are inferred.";
     el("deskSource").innerHTML='<b>'+label+' · 2026 results</b> — '+esc(fmt)+' <a href="https://openamerica.io/elections/api/" target="_blank" rel="noopener noreferrer">Official count feed methodology ↗</a>';
     el("deskCallout").innerHTML='<b>Results, not projections.</b> Election day: November 3, 2026. An early vote-count leader is not a certified or called winner. Open America currently covers only 22 states and explicitly does not call races; missing state data is not zero votes.';
   } else {
     const d=forecast[office];
     const text=d?'Source dated '+datePretty(d.asOf)+'. '+d.count+' races loaded.':'Could not load the independent '+label+' dataset. State coverage remains visible.';
     el("deskSource").innerHTML='<b>'+label+' · '+(view==="polls"?"poll averages":"forecast model")+'</b> — '+esc(text)+' <a href="https://www.pollingforecast.com/us/data" target="_blank" rel="noopener noreferrer">Source, methodology and CC BY 4.0 licence ↗</a>';
     el("deskCallout").innerHTML=view==="polls"?'<b>Polling leaders are not winners.</b> These are race-specific weighted polling averages only where the model reports underlying polling. Forecasts may disagree. Texas also displays a separately dated RealClearPolling snapshot. House states summarize district polls, not a single statewide contest.':'<b>Projections are probabilistic estimates.</b> The model considers polls, political history, fundraising and other information. Even a 90% projection can be wrong. No candidate is declared elected from this view.';
   }
 }
 function kpis(){
   const list=stateRows.filter(s=>hasRace(s.abbr)).map(s=>getSummary(s.abbr));
   const coverage=stateRows.filter(s=>hasRace(s.abbr)).length;
   let items=[];
   if(view==="results"){
     let r=results[office], returns=r?Object.values(r.races||{}):[];
     const any=returns.filter(x=>x.total>0);
     const calls=any.filter(officiallyCalled);
     items=[[coverage,"states with contests"],[any.length,"races with votes reported"],[calls.length,"verified winner calls in source"]];
   }else if(view==="forecast"){
     const races=(forecast[office]?.rows||[]), valid=races.map(projection).filter(Boolean);
     const d=valid.filter(p=>p.party==="D").length,r=valid.filter(p=>p.party==="R").length,i=valid.filter(p=>p.party==="I").length;
     items=[[valid.length,"modeled races"],[d,"projected D"],[r,"projected R"],[i,"projected independent"]];
   }else{
     const races=(forecast[office]?.rows||[]), n=races.map(polling).filter(Boolean).length;
     items=[[coverage,"states with contests"],[n,"races with polling averages"],[races.length-n,"races without loaded averages"]];
   }
   el("deskKpis").innerHTML=items.map(([v,name])=>'<span><b>'+v+'</b> '+esc(name)+'</span>').join("");
 }
 function raceHTML(r){
   const p=projection(r), q=polling(r), v=countedRace(r);
   const l=left(r), dname=r.left_candidate||"Candidate not listed", rname=r.rep_candidate||"Candidate not listed";
   const source=forecast[office];
   const link=typeof r.page==="string"&&r.page.startsWith("/us/")?"https://www.pollingforecast.com"+r.page:"https://www.pollingforecast.com/us/data";
   let body="";
   if(view==="polls"){
     body=q?'<div class="desk-metric"><strong>'+esc(partyName(q.party))+' +'+fixed(q.margin)+' points</strong> · '+esc(q.source)+' · '+datePretty(q.date)+(q.polls!==null&&q.polls!==undefined?' · '+q.polls+' polls':'')+'</div>':
       '<div class="desk-metric">No published polling average for this race in the selected source. A model projection may still exist.</div>';
   } else if(view==="forecast"){
     body=p?'<div class="desk-metric"><strong>'+esc(p.candidate)+' ('+esc(p.party)+') modeled edge</strong> · '+pct(p.chance)+' win probability · '+esc(p.rating)+(p.margin!==null?' · estimated '+fixed(p.margin)+'-point margin':'')+' · source as of '+datePretty(source?.asOf)+'</div>':
       '<div class="desk-metric">No published model projection.</div>';
   }else{
     if(v&&v.total>0){
       const names=Array.isArray(v.cands)?v.cands.slice(0,5).map(c=>'<div>'+esc(c.n||"Candidate")+' ('+esc(c.p||"?")+'): '+Number(c.v||0).toLocaleString()+' votes'+(Number.isFinite(c.pct)?' · '+c.pct+'%':'')+'</div>').join(""):"";
       body='<div class="desk-metric '+(officiallyCalled(v)?"live":"")+'"><strong>'+(officiallyCalled(v)?'Declared winner in source: '+esc(partyName(v.winner)):'Votes counting · no confirmed winner')+'</strong> · '+Number(v.total||0).toLocaleString()+' total votes'+(v.pct_in!=null?' · '+v.pct_in+'% precincts':'')+names+'</div>';
     }else{
       body='<div class="desk-metric">No 2026 general-election votes or confirmed winner reported for this race'+(!results[office]?' (feed unavailable)':'')+'.</div>';
     }
   }
   return '<div class="desk-race"><h3>'+esc(r.name||"Election contest")+(r.special?'<em>Special election</em>':'')+'</h3><div class="desk-candidates">'+
     '<div class="desk-candidate"><small>'+esc(partyName(l))+' · '+esc(l)+'</small><b>'+esc(dname)+'</b></div>'+
     '<div class="desk-candidate"><small>Republican · R</small><b>'+esc(rname)+'</b></div></div>'+body+
     '<a href="'+link+'" target="_blank" rel="noopener noreferrer">View full independent race forecast and source details ↗</a></div>';
 }
 function detail(){
   const s=stateBy[selected];if(!s)return;
   const rows=raceRows(selected);
   const summary=getSummary(selected);
   let html='<div class="eyebrow">2026 · '+esc(office.toUpperCase())+' · '+esc(view.toUpperCase())+'</div><h2>'+esc(s.name)+'</h2>'+
     '<p>Coverage checked for '+esc(s.name)+'. '+esc({senate:"35 states have a Senate election",governors:"36 states have a governor election",house:"All 50 states elect House members"}[office])+'.</p>'+
     '<div class="desk-metric" style="border-left:4px solid '+summary.color+'"><strong>'+esc(summary.status)+'</strong><div>'+esc(summary.detail)+'</div></div>';
   if(!hasRace(selected)){
     html+='<p>There is no '+(office==="senate"?"U.S. Senate":office==="governors"?"governor":"House")+' general-election contest here in 2026. Select another office to see races on the ballot.</p>';
   }else if(!forecast[office]){
     html+='<div class="desk-metric error">The independent forecast is not currently available, so candidate-by-candidate data cannot be displayed. <a href="https://www.pollingforecast.com/us/data" target="_blank" rel="noopener noreferrer">Check the source ↗</a>.</div>';
     if(view==="results")html+='<p>The state result feed is '+(results[office]?"available":"unavailable")+'. <a href="https://openamerica.io/elections/api/" target="_blank" rel="noopener noreferrer">Official-count feed ↗</a></p>';
   }else if(!rows.length){html+='<p>No source race data is loaded for this state.</p>';}
   else{
     html+=rows.map(raceHTML).join("");
     if(office==="house")html+='<p style="margin-top:15px">Each House district is a separate race. A state has no single statewide House winner.</p>';
   }
   el("deskDetails").innerHTML=html;
 }
 function listCards(){
   const visible=stateRows.filter(s=>(s.name+" "+s.abbr).toLowerCase().includes(query)).sort((a,b)=>a.name.localeCompare(b.name));
   el("deskCount").textContent=visible.length+" states · "+(view==="polls"?"polling source":view==="forecast"?"forecast source":"reported returns");
   el("deskGridTitle").textContent=view==="results"?"Reported results & winners":view==="forecast"?"Modeled projections by state":"Polling leaders by state";
   el("deskStates").innerHTML=visible.map(s=>{
     const q=getSummary(s.abbr);
     return '<button class="desk-card" data-state="'+esc(s.abbr)+'" type="button" aria-pressed="'+(s.abbr===selected)+'" aria-label="View '+esc(s.name)+' '+esc(q.status)+'">'+
       '<strong><i class="desk-flag" style="background:'+q.color+'"></i>'+esc(s.name)+'</strong>'+
       '<small>'+esc(s.abbr)+' · '+(hasRace(s.abbr)?office==="senate"?"Senate":office==="governors"?"Governor":s.houseSeats+" House districts":"No "+(office==="senate"?"Senate":"governor")+" race")+'</small>'+
       '<div class="desk-card-status">'+esc(q.status)+'</div><small>'+esc(q.detail)+'</small></button>';
   }).join("");
   el("deskStates").querySelectorAll("[data-state]").forEach(b=>b.addEventListener("click",()=>select(b.dataset.state)));
 }
 function colorMap(){
   for(const shape of mapShapes){
     const q=getSummary(shape.id);
     shape.setAttribute("fill",q.color);
     shape.classList.toggle("chosen-state",shape.id===selected);
     const t=shape.querySelector("title");if(t)t.textContent=(stateBy[shape.id]?.name||"D.C.")+" · "+q.status;
   }
 }
 function render(){
   document.querySelectorAll("[data-view]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.view===view)));
   document.querySelectorAll("[data-office]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.office===office)));
   sourceNote();kpis();legend();listCards();detail();colorMap();
 }
 function select(code){
   if(!stateBy[code])return;selected=code;detail();listCards();colorMap();
   const target=el("deskDetails");if(window.matchMedia("(max-width:950px)").matches)target.scrollIntoView({behavior:"smooth",block:"start"});
 }
 function loadMap(svg){
   const doc=new DOMParser().parseFromString(svg,"image/svg+xml");if(doc.querySelector("parsererror"))throw Error("Map XML invalid");
   const root=document.importNode(doc.documentElement,true);root.setAttribute("viewBox","0 0 959 593");root.removeAttribute("width");root.removeAttribute("height");root.setAttribute("role","img");root.setAttribute("aria-label","US states map. Select a state to view polling, forecasts or results.");
   el("deskMap").replaceChildren(root);
   mapShapes=[...root.querySelectorAll("#outlines path[id],#outlines circle[id]")].filter(n=>stateBy[n.id]);
   if(mapShapes.length!==50)throw Error("State geometry incomplete");
   for(const shape of mapShapes){
     let t=shape.querySelector("title");if(!t){t=document.createElementNS("http://www.w3.org/2000/svg","title");shape.appendChild(t)}
     shape.setAttribute("role","button");shape.setAttribute("tabindex","0");shape.setAttribute("aria-label",stateBy[shape.id].name);
     shape.addEventListener("click",()=>select(shape.id));
     shape.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();select(shape.id)}});
   }
   colorMap();
 }
 function resultsPoller(of){
   const offLabel={senate:"Senate",governors:"Governor",house:"House"}[of];
   const url=RESULTS+offLabel;
   fetch(url,{mode:"cors",credentials:"omit",cache:"no-store"}).then(r=>{if(!r.ok)throw Error("Status "+r.status);return r.json()}).then(data=>{
     if(data.year!==2026||String(data.office).toLowerCase()!==offLabel.toLowerCase()||!data.races)throw Error("Unexpected returns payload");
     results[of]=data;delete returnErrors[of];if(office===of&&view==="results")render();
     setTimeout(()=>resultsPoller(of),data.live?60000:data.counting?900000:600000);
   }).catch(e=>{returnErrors[of]=e.message;if(office===of&&view==="results")render();setTimeout(()=>resultsPoller(of),600000)});
 }
 function forecastPoller(of){
   fetch(API+of,{mode:"cors",credentials:"omit",cache:"no-store"}).then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.json()}).then(data=>{
     const expect={senate:35,governors:36,house:435}[of];
     if(!data||!Array.isArray(data.rows)||data.rows.length!==expect||!data.asOf)throw Error("Malformed or incomplete "+of+" forecast ("+(data?.rows?.length||0)+" rows)");
     forecast[of]=data;delete errors[of];if(office===of)render();setTimeout(()=>forecastPoller(of),30*60*1000);
   }).catch(e=>{errors[of]=e.message;if(office===of)render();setTimeout(()=>forecastPoller(of),10*60*1000)});
 }
 document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>{view=b.dataset.view;render()}));
 document.querySelectorAll("[data-office]").forEach(b=>b.addEventListener("click",()=>{office=b.dataset.office;render()}));
 el("deskSearch").addEventListener("input",e=>{query=e.target.value.toLowerCase().trim();listCards()});
 Promise.all([
   fetch("data/election-coverage-2026.json").then(r=>{if(!r.ok)throw Error("Missing local state index");return r.json()}),
   fetch("assets/blank-usa-map.svg").then(r=>{if(!r.ok)throw Error("Missing local map");return r.text()}).catch(()=>null),
   fetch("data/senate-polling-snapshots-2026.json").then(r=>r.ok?r.json():{polls:[]}).catch(()=>({polls:[]}))
 ]).then(([stateData,svg,pollData])=>{
   if(!Array.isArray(stateData.states)||stateData.states.length!==50)throw Error("Invalid 50-state index");
   stateRows=stateData.states;stateBy=Object.fromEntries(stateRows.map(s=>[s.abbr,s]));
   texas=(pollData.polls||[]).find(p=>p.state==="TX"&&p.sourceUrl&&Number.isFinite(p.leadPoints))||null;
   render();
   if(svg){try{loadMap(svg)}catch(e){el("deskMap").innerHTML='<p class="desk-map-loading">Map artwork unavailable; choose a state in the cards below.</p>';console.warn(e)}}
   else el("deskMap").innerHTML='<p class="desk-map-loading">Map artwork unavailable; choose a state in the cards below.</p>';
   for(const of of ["senate","governors","house"]){forecastPoller(of);resultsPoller(of)}
 }).catch(e=>{el("deskSource").textContent="Error loading state index: "+e.message;el("deskMap").innerHTML='<p class="desk-map-loading">Cannot show state map until local coverage loads.</p>';console.error(e)});
})();
