(function(){
'use strict';
const TAG='[VSX HUD V4]';
let bossStack=null,bossCard=null,miniCard=null,eventSide=null,raf=0;
function esc(v){return typeof VSX!=='undefined'&&VSX.esc?VSX.esc(String(v??'')):String(v??'')}
function pct(v){v=Number(v);return Number.isFinite(v)?Math.max(0,Math.min(100,v)):0}
function miniOwns(){const s=game?.state;return s==='MINIGAME'||s==='VSX_MINIGAME'||s==='EVENT_MINIGAME'||s==='EVENT_BRIEFING'||!!document.getElementById('vsxTrialScreen')?.classList.contains('active')||!!document.getElementById('vsxEventMinigame')?.classList.contains('active')}
function ensure(){
  const hud=document.getElementById('hud');if(!hud)return false;
  bossStack=document.getElementById('vsxBossSoloStack');
  if(!bossStack){
    bossStack=document.createElement('div');bossStack.id='vsxBossSoloStack';
    bossCard=document.createElement('div');bossCard.id='vsxBossSoloHud';bossCard.className='vsxBossSoloCard';
    miniCard=document.createElement('div');miniCard.id='vsxMiniSoloHud';miniCard.className='vsxBossSoloCard vsxBossSoloMini';
    bossStack.append(bossCard,miniCard);hud.appendChild(bossStack);
  }else{bossCard=document.getElementById('vsxBossSoloHud');miniCard=document.getElementById('vsxMiniSoloHud')}
  eventSide=document.getElementById('vsxWorldEventSideHud');
  if(!eventSide){eventSide=document.createElement('div');eventSide.id='vsxWorldEventSideHud';eventSide.setAttribute('aria-label','World event status');hud.appendChild(eventSide)}
  return true;
}
function fallbackEventHtml(ev){
  const d=(typeof WORLD_EVENT_DEFINITIONS!=='undefined'&&WORLD_EVENT_DEFINITIONS[ev?.id])||{};
  const lang=typeof VSX!=='undefined'?VSX.lang:'en';
  const name=d.name?.[lang]||d.name?.en||ev?.id||'WORLD EVENT';
  const desc=d.desc?.[lang]||d.desc?.en||'';
  const max=Number(ev?.max)||Number(d.duration)||Math.max(1,Number(ev?.time)||1),p=pct(100*(Number(ev?.time)||0)/max),color=d.color||'#67e8f9';
  return `<div class="vsxWorldEventHudHead"><div class="vsxWorldEventHudTag">WORLD EVENT</div><span class="vsxWorldEventHudTime">${Math.max(0,Number(ev?.time)||0).toFixed(1)}s</span></div><div class="vsxEvtName">${esc(name)}</div><div class="vsxEvtStatus"><b>${lang==='vi'?'MỤC TIÊU':'OBJECTIVE'}</b> ${esc(desc)}</div><div class="vsxEvtProgress"><i style="width:${p}%;background:${color};color:${color}"></i></div>`;
}
function syncBoss(){
  if(!ensure())return;
  const b=game?.boss,showB=!!(b&&!b.dead),m=game?.miniBoss,showM=!!(m&&!m.dead);
  bossCard.style.display=showB?'block':'none';miniCard.style.display=showM?'block':'none';bossStack.classList.toggle('active',showB||showM);
  if(showB){
    const sourceName=document.getElementById('bossName')?.textContent?.trim();const name=sourceName||b.name||'BOSS',hp=Math.max(0,Number(b.hp)||0),max=Math.max(1,Number(b.maxHp)||1);
    bossCard.innerHTML=`<div class="vsxBossSoloTitle"><span>${esc(name)}</span><small>${Math.ceil(hp)}/${Math.ceil(max)}</small></div><div class="vsxBossSoloBar"><i style="width:${pct(100*hp/max)}%"></i></div>`;
  }
  if(showM){
    const d=(typeof MINIBOSS_DEFINITIONS!=='undefined'&&MINIBOSS_DEFINITIONS[m.kind])||{},lang=typeof VSX!=='undefined'?VSX.lang:'en',name=d.name?.[lang]||d.name?.en||m.name||'MINIBOSS',hp=Math.max(0,Number(m.hp)||0),max=Math.max(1,Number(m.maxHp)||1);
    miniCard.innerHTML=`<div class="vsxBossSoloTitle"><span>${lang==='vi'?'MINI BOSS':'MINIBOSS'} · ${esc(name)}</span><small>${Math.ceil(hp)}/${Math.ceil(max)}</small></div><div class="vsxBossSoloBar"><i style="width:${pct(100*hp/max)}%"></i></div>`;
  }
}
function syncEvent(){
  if(!ensure())return;
  const src=document.getElementById('vsxEventHud'),ev=game?.worldEvent,ready=!!game?.vsxEventReady;
  const show=!!(ev||ready)&&!miniOwns()&&document.getElementById('hud')?.classList.contains('active');
  eventSide.classList.toggle('active',show);
  if(!show)return;
  let html=String(src?.innerHTML||'').trim();if(!html&&ev)html=fallbackEventHtml(ev);
  eventSide.innerHTML=html;
  if(ev){
    const d=(typeof WORLD_EVENT_DEFINITIONS!=='undefined'&&WORLD_EVENT_DEFINITIONS[ev.id])||{},max=Number(ev.max)||Number(d.duration)||0,remain=Math.max(0,Number(ev.time)||0);
    const hasFoot=!!eventSide.querySelector('.vsxWorldEventHudFoot,.vsxSideEventFoot');
    if(!hasFoot){
      const foot=document.createElement('div');foot.className='vsxSideEventFoot';foot.innerHTML=`<span>${(typeof VSX!=='undefined'&&VSX.lang==='vi')?'CÒN LẠI':'REMAIN'} <b>${remain.toFixed(1)}s</b></span>${max?`<span>${(typeof VSX!=='undefined'&&VSX.lang==='vi')?'THỜI LƯỢNG':'DURATION'} <b>${Math.round(max)}s</b></span>`:''}`;eventSide.appendChild(foot);
    }
    if(d.color)eventSide.style.borderColor=d.color+'55';
  }
}
function position(){
  if(!ensure())return;
  const hudActive=document.getElementById('hud')?.classList.contains('active'),suppressed=!hudActive||miniOwns();document.body.classList.toggle('vsxSideEncounterSuppressed',suppressed);if(suppressed)return;
  const timer=document.getElementById('timerHud');const tr=timer?.getBoundingClientRect();const bossTop=Math.max(86,Math.ceil((tr?.bottom||78)+8));bossStack.style.setProperty('--vsx-boss-solo-top',bossTop+'px');
  const map=document.getElementById('vsxMinimapWrap');if(!eventSide.classList.contains('active'))return;
  if(map&&getComputedStyle(map).display!=='none'&&map.getClientRects().length){
    const mr=map.getBoundingClientRect(),gap=9,right=Math.max(8,Math.round(innerWidth-mr.right)),above=Math.round(innerHeight-mr.top+gap);
    /* Desktop: keep the event card literally beside the minimap. This avoids the
       top-right Inventory column even when HOW/LIVE copy makes the card taller. */
    const probe=eventSide.getBoundingClientRect();
    if(innerWidth>720&&mr.left-probe.width-gap>=8){
      eventSide.style.left=Math.round(mr.left-probe.width-gap)+'px';eventSide.style.right='auto';eventSide.style.top=Math.round(mr.top)+'px';eventSide.style.bottom='auto';
    }else{
      /* Mobile/narrow: stack directly above the minimap; the map already lives low
         enough to leave the compact top HUD clear. */
      eventSide.style.right=right+'px';eventSide.style.left='auto';eventSide.style.bottom=above+'px';eventSide.style.top='auto';
      requestAnimationFrame(()=>{
        if(!eventSide?.classList.contains('active'))return;const er=eventSide.getBoundingClientRect();
        if(er.top<8){
          const topHud=['statsHud','timerHud','inventoryHud'].map(id=>document.getElementById(id)).filter(Boolean).map(el=>el.getBoundingClientRect()).filter(r=>r.width&&r.height);
          const y=Math.max(8,...topHud.map(r=>r.bottom+gap));eventSide.style.top=Math.round(y)+'px';eventSide.style.bottom='auto';
        }
      });
    }
  }else{eventSide.style.right='14px';eventSide.style.bottom='58px';eventSide.style.left='auto';eventSide.style.top='auto'}
}
function refresh(){try{syncBoss();syncEvent();position()}catch(e){console.warn(TAG,e)}}
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;refresh()})}
if(typeof Game!=='undefined'&&Game.prototype){const BASE=Game.prototype.updateHUD;Game.prototype.updateHUD=function(){const r=BASE.apply(this,arguments);refresh();return r}}
window.addEventListener('resize',schedule,{passive:true});window.addEventListener('orientationchange',schedule,{passive:true});
if(window.ResizeObserver){const ro=new ResizeObserver(schedule);['timerHud','vsxMinimapWrap','inventoryHud','statsHud'].map(id=>document.getElementById(id)).filter(Boolean).forEach(el=>ro.observe(el));window.VSX_SIDE_ENCOUNTER_RO=ro}
queueMicrotask(()=>{const mo=new MutationObserver(schedule);['vsxEventHud','bossWrap','vsxMiniBossHud','vsxMinimapWrap'].map(id=>document.getElementById(id)).filter(Boolean).forEach(el=>mo.observe(el,{attributes:true,childList:true,subtree:true,characterData:true}));window.VSX_SIDE_ENCOUNTER_MO=mo;schedule()});
window.VSX_ENCOUNTER_HUD_V4={refresh,schedule,inspect(){const map=document.getElementById('vsxMinimapWrap')?.getBoundingClientRect(),ev=eventSide?.getBoundingClientRect(),boss=bossStack?.getBoundingClientRect();return{state:game?.state,worldEvent:game?.worldEvent?.id||null,boss:!!(game?.boss&&!game.boss.dead),miniBoss:!!(game?.miniBoss&&!game.miniBoss.dead),eventVisible:eventSide?.classList.contains('active')||false,eventRect:ev?{x:Math.round(ev.x),y:Math.round(ev.y),w:Math.round(ev.width),h:Math.round(ev.height)}:null,minimapRect:map?{x:Math.round(map.x),y:Math.round(map.y),w:Math.round(map.width),h:Math.round(map.height)}:null,bossRect:boss?{x:Math.round(boss.x),y:Math.round(boss.y),w:Math.round(boss.width),h:Math.round(boss.height)}:null}}};

/* Lightweight enemy HP bars: viewport-culled, no text, no allocation-heavy gradients. */
if(typeof Enemy!=='undefined'&&Enemy.prototype&&typeof Enemy.prototype.render==='function'){
  const ENEMY_RENDER_BASE=Enemy.prototype.render;
  Enemy.prototype.render=function(g){
    const r=ENEMY_RENDER_BASE.apply(this,arguments);
    try{
      if(this.dead||this.isBoss||this.isMiniBoss||this.isCaptive)return r;
      const hp=Number(this.hp),max=Number(this.maxHp);if(!Number.isFinite(hp)||!Number.isFinite(max)||max<=0)return r;
      const cam=game?.camera||{x:0,y:0},sx=this.x-cam.x,sy=this.y-cam.y;if(sx<-60||sy<-60||sx>innerWidth+60||sy>innerHeight+60)return r;
      const sz=Number(this.size)||10,p=Math.max(0,Math.min(1,hp/max)),w=Math.max(16,Math.min(36,sz*1.7)),h=this.elite?4:3,y=this.y-sz-(this.elite?20:16);
      g.save();g.globalAlpha=this.elite?.95:.82;g.fillStyle='rgba(4,10,18,.82)';g.fillRect(this.x-w/2-1,y-1,w+2,h+2);
      g.fillStyle=p>.58?'#65e0b2':p>.26?'#ffd166':'#ff6179';g.fillRect(this.x-w/2,y,w*p,h);
      if(this.elite){g.strokeStyle='rgba(202,114,255,.65)';g.lineWidth=1;g.strokeRect(this.x-w/2-.5,y-.5,w+1,h+1)}g.restore();
    }catch(e){console.warn(TAG,'enemy hp bar',e)}
    return r;
  };
}
})();
