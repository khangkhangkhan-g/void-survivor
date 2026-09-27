(function(){
'use strict';
const TAG='[VSX ENCOUNTER HUD V3]';
let rail=null,eventProxy=null,bossProxy=null,miniProxy=null,raf=0,lastTop=-1,lastWidth=-1;
function ensureRail(){
  const hud=document.getElementById('hud');if(!hud)return null;
  rail=document.getElementById('vsxEncounterRail');
  if(!rail){
    rail=document.createElement('div');rail.id='vsxEncounterRail';rail.setAttribute('aria-label','Encounter status');
    eventProxy=document.createElement('div');eventProxy.id='vsxEncounterEventProxy';eventProxy.className='hudBox vsxEncounterProxy vsxEventProxy';
    bossProxy=document.createElement('div');bossProxy.id='vsxEncounterBossProxy';bossProxy.className='vsxEncounterProxy vsxBossProxy';
    miniProxy=document.createElement('div');miniProxy.id='vsxEncounterMiniProxy';miniProxy.className='vsxEncounterProxy vsxMiniProxy';
    rail.append(eventProxy,bossProxy,miniProxy);hud.appendChild(rail);
  }else{
    eventProxy=document.getElementById('vsxEncounterEventProxy');bossProxy=document.getElementById('vsxEncounterBossProxy');miniProxy=document.getElementById('vsxEncounterMiniProxy');
  }
  return rail;
}
function miniOwnsScreen(){
  const s=game?.state;
  return s==='MINIGAME'||s==='VSX_MINIGAME'||s==='EVENT_MINIGAME'||s==='EVENT_BRIEFING'||!!document.getElementById('vsxTrialScreen')?.classList.contains('active')||!!document.getElementById('vsxEventMinigame')?.classList.contains('active');
}
function srcDisplayWantsOn(el){return !!el&&el.style.display!=='none'&&!!String(el.innerHTML||'').trim()}
function safePct(v){v=Number(v);return Number.isFinite(v)?Math.max(0,Math.min(100,v)):0}
function syncContent(){
  ensureRail();if(!rail)return false;
  const eventSrc=document.getElementById('vsxEventHud'),bossSrc=document.getElementById('bossWrap'),miniSrc=document.getElementById('vsxMiniBossHud');
  const suppressed=miniOwnsScreen()||!document.getElementById('hud')?.classList.contains('active');
  document.body.classList.toggle('vsxEncounterRailSuppressed',suppressed);
  if(suppressed){rail.classList.remove('active');return false}
  const showEvent=!!(game?.worldEvent||game?.vsxEventReady||srcDisplayWantsOn(eventSrc));
  const showBoss=!!(game?.boss&&!game.boss.dead);
  const showMini=!!(game?.miniBoss&&!game.miniBoss.dead);
  if(eventProxy){eventProxy.style.display=showEvent?'block':'none';if(showEvent&&eventSrc){eventProxy.innerHTML=eventSrc.innerHTML;const bc=eventSrc.style.borderColor;if(bc)eventProxy.style.setProperty('border-color',bc,'important');const bs=eventSrc.style.boxShadow;if(bs)eventProxy.style.setProperty('box-shadow',bs,'important')}}
  if(bossProxy){
    bossProxy.style.display=showBoss?'block':'none';
    if(showBoss){const b=game.boss,name=document.getElementById('bossName')?.textContent||b.name||'BOSS',pct=safePct(100*(b.hp||0)/Math.max(1,b.maxHp||1));bossProxy.innerHTML=`<div class="vsxProxyTitle"><span>${typeof VSX!=='undefined'&&VSX.esc?VSX.esc(name):name}</span><small>${Math.ceil(Math.max(0,b.hp||0))}/${Math.ceil(Math.max(1,b.maxHp||1))}</small></div><div class="vsxProxyBar"><i style="width:${pct}%"></i></div>`}
  }
  if(miniProxy){
    miniProxy.style.display=showMini?'block':'none';
    if(showMini){const m=game.miniBoss,d=(typeof MINIBOSS_DEFINITIONS!=='undefined'&&MINIBOSS_DEFINITIONS[m.kind])||{},name=d.name?.[VSX?.lang]||d.name?.en||m.name||'MINIBOSS',pct=safePct(100*(m.hp||0)/Math.max(1,m.maxHp||1));miniProxy.innerHTML=`<div class="vsxProxyTitle"><span>${typeof VSX!=='undefined'&&VSX.esc?VSX.esc(name):name}</span><small>${Math.ceil(Math.max(0,m.hp||0))}/${Math.ceil(Math.max(1,m.maxHp||1))}</small></div><div class="vsxProxyBar"><i style="width:${pct}%"></i></div>`}
  }
  const any=showEvent||showBoss||showMini;rail.classList.toggle('active',any);return any;
}
function layoutRail(){
  if(!syncContent()||!rail)return;
  const timer=document.getElementById('timerHud');if(!timer)return;
  const tr=timer.getBoundingClientRect();let top=Math.ceil(tr.bottom+8);
  const vw=innerWidth,mobile=vw<=720;
  let left=mobile?8:14,right=vw-(mobile?8:14);
  if(!mobile){
    const stats=document.getElementById('statsHud'),inv=document.getElementById('inventoryHud');
    const sr=stats&&getComputedStyle(stats).display!=='none'?stats.getBoundingClientRect():null;
    const ir=inv&&getComputedStyle(inv).display!=='none'?inv.getBoundingClientRect():null;
    if(sr&&sr.bottom>top)left=Math.max(left,Math.ceil(sr.right+10));
    if(ir&&ir.bottom>top)right=Math.min(right,Math.floor(ir.left-10));
  }
  if(right-left<280){left=mobile?8:14;right=vw-(mobile?8:14)}
  const avail=Math.max(260,right-left),w=Math.min(620,avail),cx=(left+right)/2;
  if(top!==lastTop){rail.style.setProperty('--vsx-encounter-top',top+'px');lastTop=top}
  if(w!==lastWidth){rail.style.width=Math.round(w)+'px';lastWidth=w}
  rail.style.left=Math.round(cx)+'px';
}
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;try{layoutRail()}catch(err){console.warn(TAG,err)}})}
if(typeof Game!=='undefined'&&Game.prototype){const BASE=Game.prototype.updateHUD;Game.prototype.updateHUD=function(){const r=BASE.apply(this,arguments);layoutRail();return r}}
window.addEventListener('resize',schedule,{passive:true});window.addEventListener('orientationchange',schedule,{passive:true});
if(window.ResizeObserver){const ro=new ResizeObserver(schedule);['timerHud','statsHud','inventoryHud','vsxCurrencyHud'].map(id=>document.getElementById(id)).filter(Boolean).forEach(el=>ro.observe(el));window.VSX_ENCOUNTER_RAIL_RO=ro}
const sourceObserver=new MutationObserver(schedule);queueMicrotask(()=>{['vsxEventHud','bossWrap','vsxMiniBossHud','timerHud'].map(id=>document.getElementById(id)).filter(Boolean).forEach(el=>sourceObserver.observe(el,{attributes:true,childList:true,subtree:true,characterData:true}));['vsxTrialScreen','vsxEventMinigame','vsxEventBriefing'].map(id=>document.getElementById(id)).filter(Boolean).forEach(el=>sourceObserver.observe(el,{attributes:true,attributeFilter:['class']}));schedule()});
window.VSX_ENCOUNTER_HUD_V3={layout:layoutRail,schedule,inspect(){const r=ensureRail();const timer=document.getElementById('timerHud')?.getBoundingClientRect();const rr=r?.getBoundingClientRect();return{state:game?.state,timerBottom:timer?Math.round(timer.bottom):null,railTop:rr?Math.round(rr.top):null,gap:timer&&rr?Math.round(rr.top-timer.bottom):null,event:eventProxy?.style.display,boss:bossProxy?.style.display,mini:miniProxy?.style.display,oldStackHidden:getComputedStyle(document.getElementById('vsxEncounterStack')||document.body).display==='none'}}};
})();
