(function(){
'use strict';
const TAG='[VSX ENCOUNTER DIRECTOR]';
const HOLD=1000000;
const CATEGORY_IDS=['world','mini','ally'];
const LEGACY_ALLY_MIN={astra:75,chrono:110,kage:145,nyx:180,aurelion:135,seraph:180,echo:210,rook:245,umbra:220};
const NOVEL_RULES={
 lumen3:{min:75,fallback:190},
 meridian:{min:120,fallback:260,soft:g=>!!(g.vsxChallengeStats?.worldSet?.has?.('rift_network')||VSX.save?.codex?.world_events?.rift_network)},
 coda:{min:120,fallback:250},
 mimic_moth:{min:120,fallback:280,soft:g=>(g.enemyProjectiles||[]).filter(q=>!q.dead).length>=12},
 jinx404:{min:150,fallback:320,soft:g=>(VSX.save?.meta?.eventStats?.minigamesCompleted||0)+(VSX.save?.meta?.eventStats?.worldEventsCompleted||0)>0},
 knell:{min:175,fallback:350,soft:g=>(g.enemies||[]).some(e=>!e.dead&&(e.elite||e.isMiniBoss))},
 prism8:{min:150,fallback:290},
 halcyon:{min:105,fallback:390,soft:g=>g.player&&g.player.hp/g.player.maxHp<.40},
 mobius:{min:210,fallback:390},
 pilgrim0:{min:300,fallback:520}
};
const LEGACY_ALLY_IDS=Object.keys(LEGACY_ALLY_MIN);
const custom={world:new Map(),mini:new Map(),ally:new Map()};
function rnd(a,b){return b+Math.random()*(a-b)}
function l(en,vi){return (typeof VSX!=='undefined'&&VSX.lang==='vi')?vi:en}
const INITIAL_GAP=[22,30];
const POST_GAP={world:[6,6],mini:[6,6],ally:[6,6]};
const RETRY_GAP=[6,10];
const ACTIVATION_GRACE=2.5;
const COMPLETION_DEBOUNCE=1.20;
const FAILED_FEATURE_BLOCK=45;
function gap(range){return rnd(range[1],range[0])}
function makeState(g){return{version:'2.6.0',enabled:true,nextIn:gap(INITIAL_GAP),phase:'cooldown',phaseSince:g?.time||0,phaseReason:'initial',epoch:0,starting:false,active:null,lastCompleted:null,served:{world:0,mini:0,ally:0},featureServed:{world:{},mini:{},ally:{}},lastCategory:null,lastFeature:{world:null,mini:null,ally:null},history:[],blocked:[],featureBlockUntil:{},starts:0,failStarts:0,oldSchedulersSuppressed:true,startedAt:g?.time||0}}
function S(g=game){return g.vsxEncounterDirector||(g.vsxEncounterDirector=makeState(g))}
function phase(st,g,next,reason=''){if(st.phase!==next||st.phaseReason!==reason){st.phase=next;st.phaseReason=reason;st.phaseSince=g?.time||0}}
function busyReason(g=game){if(!g?.player)return'no-player';if(g.state!=='PLAYING')return'state:'+g.state;if(g.worldEvent)return'world-event';if(g.vsxPendingEventBriefing||g.state==='EVENT_BRIEFING')return'briefing';if(g.boss||g.miniBoss)return'boss';if(g.metaBusy)return'meta';if(modalBusy())return'modal';if(miniActive())return'minigame';if(g.activeRecruitChallenge||novelActive())return'ally';return null}
function novelActive(){try{return !!window.VSX_NOVEL_ALLIES?.state?.().active}catch{return false}}
function miniActive(){return !!(window.VSX_MINIGAME_SYSTEM?.state?.().active||window.VSX_VOID_RELAY_SERIES?.active||window.VSX_TRIAL?.active||document.getElementById('vsxEventMinigame')?.classList.contains('active')||document.getElementById('vsxTrialScreen')?.classList.contains('active'))}
function modalBusy(){return !!document.querySelector('.modal.active,#vsxAdminScreen.active,#vsxCollectionScreen.active,#vsxSetupScreen.active,#vsxArmoryScreen.active')}
function busy(g=game){return !!busyReason(g)}
function worldCandidates(g){
 const ids=Object.entries(WORLD_EVENT_DEFINITIONS||{}).filter(([,d])=>d&&d.type!=='minigame').map(([id])=>id);
 for(const [id,o] of custom.world)if(!ids.includes(id)&&(!o.eligible||o.eligible(g)))ids.push(id);
 return ids
}
function trialIds(){try{return Object.keys(VOID_TRIAL_DEFINITIONS||{})}catch{return[]}}
function miniCandidates(g){
 const out=[];
 for(const id of (window.VSX_MINIGAME_SYSTEM?.ids||[]))if(id)out.push({key:'mini:'+id,id,kind:'mini'});
 for(const id of trialIds())out.push({key:'trial:'+id,id,kind:'trial'});
 for(const [id,o] of custom.mini)if(!out.some(x=>x.key==='custom:'+id)&&(!o.eligible||o.eligible(g)))out.push({key:'custom:'+id,id,kind:'custom',opt:o});
 return out
}
function legacyAllyEligible(g,id){return !!g.player&&!g.storyAllyMap?.has(id)&&!g.allySpawned?.[id]&&g.time>=(LEGACY_ALLY_MIN[id]||120)&&g.time>=(g.allyNextTry?.[id]||0)}
function novelAllyEligible(g,id){
 if(g.storyAllyMap?.has(id))return false;
 const rule=NOVEL_RULES[id]||{min:120,fallback:300};if(g.time<rule.min)return false;
 const ns=g.vsxNovelAllies;if(ns?.spawned?.[id]||g.time<(ns?.next?.[id]||0))return false;
 return !rule.soft||rule.soft(g)||g.time>=rule.fallback
}
function allyCandidates(g){
 const out=[];
 for(const id of LEGACY_ALLY_IDS)if(legacyAllyEligible(g,id))out.push({key:'legacy:'+id,id,kind:'legacy'});
 for(const id of (window.VSX_NOVEL_ALLIES?.ids||[]))if(novelAllyEligible(g,id))out.push({key:'novel:'+id,id,kind:'novel'});
 for(const [id,o] of custom.ally)if((!o.eligible||o.eligible(g))&&!g.storyAllyMap?.has(id))out.push({key:'custom:'+id,id,kind:'custom',opt:o});
 return out
}
function candidates(cat,g){if(cat==='world')return worldCandidates(g).map(id=>({key:id,id,kind:'world'}));if(cat==='mini')return miniCandidates(g);return allyCandidates(g)}
function weightedPick(items,weightFn){let total=0;const rows=[];for(const x of items){const w=Math.max(.01,Number(weightFn(x))||.01);total+=w;rows.push([x,w])}let r=Math.random()*total;for(const [x,w] of rows){r-=w;if(r<=0)return x}return rows[rows.length-1]?.[0]||null}
function chooseLeast(counts,items,lastKey=null){
 if(!items.length)return null;let pool=items;const anti=VSX.save?.settings?.repeatProtection!==false;if(anti&&lastKey&&pool.length>1){const p=pool.filter(x=>x.key!==lastKey);if(p.length)pool=p}const min=Math.min(...pool.map(x=>Number(counts[x.key]||0)));return weightedPick(pool,x=>1/(1+2.4*Math.max(0,(counts[x.key]||0)-min)))
}
function chooseCategory(st,g){
 let pool=CATEGORY_IDS.filter(c=>candidates(c,g).length);if(!pool.length)return null;
 const anti=VSX.save?.settings?.repeatProtection!==false;if(anti&&st.lastCategory&&pool.length>1){const p=pool.filter(c=>c!==st.lastCategory);if(p.length)pool=p}
 const min=Math.min(...pool.map(c=>Number(st.served[c]||0)));return weightedPick(pool,c=>1/(1+2.8*Math.max(0,(st.served[c]||0)-min)))
}
function startFeature(cat,item,g){
 if(!item)return false;
 try{
  if(cat==='world'){
   const o=custom.world.get(item.id);if(o?.start)return o.start(g,item.id)!==false;
   return VSX.startWorldEventId?.(item.id,false)!==false
  }
  if(cat==='mini'){
   if(item.kind==='trial')return typeof startTrial==='function'&&startTrial(item.id)!==false;
   if(item.kind==='custom')return item.opt?.start?.(g,item.id)!==false;
   return window.VSX_MINIGAME_SYSTEM?.start?.(item.id,false)!==false
  }
  if(item.kind==='novel')return window.VSX_NOVEL_ALLIES?.startChallenge?.(item.id,false)!==false;
  if(item.kind==='custom')return item.opt?.start?.(g,item.id)!==false;
  return g.spawnRecruitChallenge?.(item.id)!==false
 }catch(err){console.error(TAG,'start failure',cat,item,err);return false}
}
function record(st,cat,item,g){
 st.served[cat]=(st.served[cat]||0)+1;st.featureServed[cat][item.key]=(st.featureServed[cat][item.key]||0)+1;st.lastCategory=cat;st.lastFeature[cat]=item.key;st.starts++;
 st.history.push({t:Number((g.time||0).toFixed(1)),category:cat,id:item.id,kind:item.kind||cat});if(st.history.length>40)st.history.splice(0,st.history.length-40)
}
function featureRunning(a,g){
 if(!a)return false;
 if(a.category==='world')return !!(g.worldEvent||g.vsxPendingEventBriefing||g.state==='EVENT_BRIEFING');
 if(a.category==='mini')return miniActive();
 if(a.category==='ally')return !!(g.activeRecruitChallenge||novelActive());
 return false
}
function blockFeature(st,item,g,reason,seconds=FAILED_FEATURE_BLOCK){if(!item)return;const key=item.key||`${item.category||'unknown'}:${item.id||'unknown'}`;st.featureBlockUntil[key]=(g.time||0)+seconds;st.blocked.push({t:g.time||0,category:item.category||null,id:item.id||null,key,reason});if(st.blocked.length>30)st.blocked.shift()}
function attempt(g){
 const st=S(g);if(st.starting||st.active)return false;const cat=chooseCategory(st,g);if(!cat){phase(st,g,'waiting','no-candidate-category');st.nextIn=Math.max(3,Number(st.nextIn)||3);return false}const now=g.time||0,raw=candidates(cat,g),list=raw.filter(x=>(st.featureBlockUntil?.[x.key]||0)<=now),pool=list.length?list:raw;const item=chooseLeast(st.featureServed[cat],pool,st.lastFeature[cat]);if(!item){phase(st,g,'waiting','no-feature');st.nextIn=Math.max(3,Number(st.nextIn)||3);return false}
 st.starting=true;let ok=false;try{ok=startFeature(cat,item,g)}finally{st.starting=false}if(ok){record(st,cat,item,g);const token=++st.epoch;st.active={token,category:cat,id:item.id,key:item.key,kind:item.kind||cat,startedAt:g.time||0,confirmed:false,clearFor:0,confirmUntil:(g.time||0)+ACTIVATION_GRACE};phase(st,g,'arming','start-confirmation');st.nextIn=0;return true}
 st.failStarts++;blockFeature(st,{...item,category:cat},g,'start_failed',30);phase(st,g,'retry','start-failed');st.nextIn=gap(RETRY_GAP);return false
}
function finishActive(st,g){if(!st.active)return;const a=st.active;st.lastCompleted={...a,endedAt:g.time||0,duration:Math.max(0,(g.time||0)-(a.startedAt||0))};st.active=null;phase(st,g,'cooldown','confirmed-completion');st.nextIn=6}
function tick(g,dt){
 const st=S(g);if(!st.enabled)return;
 if(st.active){
  const running=featureRunning(st.active,g);
  if(running){st.active.confirmed=true;st.active.clearFor=0;phase(st,g,'active','feature-running');return}
  if(!st.active.confirmed){
   if((g.time||0)<(st.active.confirmUntil||0)){phase(st,g,'arming','awaiting-activation');return}
   const failed={...st.active};st.failStarts++;blockFeature(st,failed,g,'activation_not_confirmed');st.active=null;phase(st,g,'retry','activation-not-confirmed');st.nextIn=gap(RETRY_GAP);return
  }
  st.active.clearFor=(st.active.clearFor||0)+Math.max(0,dt||0);phase(st,g,'finishing','cleanup-debounce');
  if(st.active.clearFor<COMPLETION_DEBOUNCE)return;
  finishActive(st,g);return
 }
 const reason=busyReason(g);if(reason){phase(st,g,'blocked',reason);return}else if(st.phase==='blocked'){phase(st,g,'cooldown','block-cleared')}
 if(!Number.isFinite(st.nextIn)||st.nextIn<0)st.nextIn=gap(INITIAL_GAP);st.nextIn=Math.max(0,st.nextIn-dt);if(st.nextIn<=0)attempt(g)
}
function holdLegacy(g){
 if(!g?.player)return;g.vsxWorldCooldown=Math.max(Number(g.vsxWorldCooldown)||0,HOLD);g.vsxMiniCooldown=Math.max(Number(g.vsxMiniCooldown)||0,HOLD);g.vsxRelayCooldown=Math.max(Number(g.vsxRelayCooldown)||0,HOLD);
 if(!g.activeTrialPortal)g.trialPortalCooldown=Math.max(Number(g.trialPortalCooldown)||0,HOLD)
}
/* Natural scheduler suppression: the old systems still exist for Admin/direct calls, but cannot independently roll natural encounters. */
const UPDATE_BASE=Game.prototype.update;
Game.prototype.update=function(dt){const st=S(this);if(st.enabled)holdLegacy(this);const r=UPDATE_BASE.apply(this,arguments);if(st.enabled)tick(this,dt);return r};
const RECRUIT_BASE=Game.prototype.updateRecruitDirector;
Game.prototype.updateRecruitDirector=function(dt){const st=S(this),novel=novelActive(),real=this.activeRecruitChallenge;const suppress=st.enabled&&!real&&!novel;if(suppress)this.activeRecruitChallenge='__encounter_director_hold__';try{return RECRUIT_BASE.apply(this,arguments)}finally{if(suppress&&this.activeRecruitChallenge==='__encounter_director_hold__')this.activeRecruitChallenge=null}};
const INIT_BASE=Game.prototype.vsxInitRun;
Game.prototype.vsxInitRun=function(){const r=INIT_BASE.apply(this,arguments);this.vsxEncounterDirector=makeState(this);holdLegacy(this);return r};
const START_BASE=Game.prototype.start;
Game.prototype.start=function(){const r=START_BASE.apply(this,arguments);this.vsxEncounterDirector=makeState(this);holdLegacy(this);return r};
/* Simulation uses the exact least-served policy without touching gameplay. */
function simulate(n=600){
 const cats={world:0,mini:0,ally:0},feat={world:{},mini:{},ally:{}},last={world:null,mini:null,ally:null};let lastCat=null;
 const wp=worldCandidates(game).map(id=>({key:id,id})),mp=miniCandidates(game),ap=[...LEGACY_ALLY_IDS.map(id=>({key:'legacy:'+id,id})),...(window.VSX_NOVEL_ALLIES?.ids||[]).map(id=>({key:'novel:'+id,id}))];const pools={world:wp,mini:mp,ally:ap};
 for(let i=0;i<n;i++){let cp=[...CATEGORY_IDS];const anti=VSX.save?.settings?.repeatProtection!==false;if(anti&&lastCat&&cp.length>1)cp=cp.filter(c=>c!==lastCat);const low=Math.min(...cp.map(c=>cats[c]));const cat=weightedPick(cp,c=>1/(1+2.8*Math.max(0,cats[c]-low))),item=chooseLeast(feat[cat],pools[cat],last[cat]);cats[cat]++;feat[cat][item.key]=(feat[cat][item.key]||0)+1;last[cat]=item.key;lastCat=cat}
 const spread=o=>{const v=Object.values(o);return v.length?Math.max(...v)-Math.min(...v):0};return{iterations:n,categories:cats,categorySpread:Math.max(...Object.values(cats))-Math.min(...Object.values(cats)),featureSpread:{world:spread(feat.world),mini:spread(feat.mini),ally:spread(feat.ally)},poolSizes:{world:wp.length,mini:mp.length,ally:ap.length}}
}
function selfTest(){const st=S(game),pools={world:worldCandidates(game).length,mini:miniCandidates(game).length,ally:allyCandidates(game).length},sim=simulate(600);return{version:st.version,enabled:st.enabled,busy:busy(game),phase:st.phase,phaseReason:st.phaseReason,phaseAge:Math.max(0,(game.time||0)-(st.phaseSince||0)),active:st.active?{...st.active}:null,featureRunning:st.active?featureRunning(st.active,game):false,nextIn:Number((st.nextIn||0).toFixed(2)),lastCompleted:st.lastCompleted?{...st.lastCompleted}:null,served:{...st.served},pools,simulation:sim,legacyHeld:{world:(game.vsxWorldCooldown||0)>10000,mini:(game.vsxMiniCooldown||0)>10000,relay:(game.vsxRelayCooldown||0)>10000,trial:!!game.activeTrialPortal||(game.trialPortalCooldown||0)>10000},overlap:!!(game.worldEvent&&miniActive()),history:st.history.slice(-12),runtimeSafety:window.VSX_RUNTIME_SAFETY?{update:VSX_RUNTIME_SAFETY.state.updateErrors,render:VSX_RUNTIME_SAFETY.state.renderErrors,hud:VSX_RUNTIME_SAFETY.state.hudErrors}:null}}
function register(category,id,opt={}){if(!custom[category]||!id)return false;custom[category].set(id,opt);return true}
function registerAlly(id,opt={}){return register('ally',id,opt)}
function reset(){game.vsxEncounterDirector=makeState(game);holdLegacy(game);return S(game)}
window.VSX_ENCOUNTER_DIRECTOR={version:'2.6.0',state:()=>S(game),busy:()=>busy(game),pools:()=>({world:worldCandidates(game),mini:miniCandidates(game),ally:allyCandidates(game)}),register,registerAlly,attempt:()=>!busy(game)&&attempt(game),reset,simulate,selfTest,policy:{categories:'weighted least-served random with hard anti-repeat',features:'weighted least-served random with hard anti-repeat per feature',initialGapSeconds:INITIAL_GAP,postEncounterGapSeconds:POST_GAP,failedStartRetrySeconds:RETRY_GAP,activationGraceSeconds:ACTIVATION_GRACE,completionDebounceSeconds:COMPLETION_DEBOUNCE,countdown:'exactly 6s after a confirmed encounter ends; never counts during briefing/active encounter; pauses behind unrelated blocking states',legacySchedulers:'suppressed for natural starts; Admin/direct APIs retained'}};
/* Admin diagnostics; no new persistent HUD chip. */
function adminCard(){if(!window.VSX_ADMIN?.open||VSX_ADMIN.tab!=='run')return;const grid=document.querySelector('#vsxAdminContent .vsxAdminGrid');if(!grid||document.getElementById('vsxEncounterDirectorAdmin'))return;const st=S(game),sim=simulate(300),c=document.createElement('div');c.id='vsxEncounterDirectorAdmin';c.className='vsxAdminCard';c.innerHTML=`<h3>${l('ENCOUNTER DIRECTOR V2.6 · EXACT 6S','ENCOUNTER DIRECTOR V2.6 · ĐÚNG 6 GIÂY')}</h3><p>${l('One scheduler owns natural World Events, Minigames and Ally challenges. Least-served random prevents old systems from starving newer content.','Một scheduler duy nhất quản lý World Event, Minigame và challenge Đồng Minh. Random ưu tiên feature ít xuất hiện ngăn hệ cũ lấn át nội dung mới.')}</p><div class="vsxDirectorStats"><span>WORLD ${st.served.world}</span><span>MINI ${st.served.mini}</span><span>ALLY ${st.served.ally}</span><span>${st.active?(l('ACTIVE','ĐANG CHẠY')+' · '+String(st.active.category).toUpperCase()):(l('NEXT','TIẾP')+' '+Math.ceil(st.nextIn||0)+'s')}</span><span>${l('SIM SPREAD','ĐỘ LỆCH SIM')} ${sim.categorySpread}</span><span>${l('OLD SCHEDULERS HELD','SCHEDULER CŨ ĐÃ KHÓA')}</span></div><div class="row"><button id="admDirectorReset">${l('RESET FAIRNESS','RESET CÂN BẰNG')}</button><button id="admDirectorSim">SIMULATE 300</button></div><pre id="admDirectorOut">${VSX.esc(JSON.stringify(selfTest(),null,2))}</pre>`;grid.appendChild(c);c.querySelector('#admDirectorReset').onclick=()=>{reset();c.querySelector('#admDirectorOut').textContent=JSON.stringify(selfTest(),null,2)};c.querySelector('#admDirectorSim').onclick=()=>{c.querySelector('#admDirectorOut').textContent=JSON.stringify(simulate(300),null,2)}}
window.VSX_ARCH?.register('admin.refresh','encounter.director',adminCard,{priority:70});
queueMicrotask(()=>{try{S(game);holdLegacy(game);console.info(TAG,'v2.6 exact-6s active',selfTest())}catch(err){console.error(TAG,'boot',err)}});
})();
