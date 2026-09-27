(function(){
"use strict";
const esc=(v)=>(typeof VSX!=='undefined'&&VSX?.esc)?VSX.esc(String(v??"")):String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
function shortName(name){const s=String(name||"").trim();if(s.length<=11)return s;const words=s.split(/\s+/);if(words.length>1)return words.map(x=>x[0]).join("").slice(0,7).toUpperCase();return s.slice(0,9)+"…"}
function renderModernHud(g){
  const p=g?.player;if(!p)return;
  const hp=Math.max(0,Math.ceil(p.hp||0)),maxHp=Math.max(1,Math.ceil(p.maxHp||1)),hpPct=Math.max(0,Math.min(100,100*hp/maxHp));
  const barrier=Math.max(0,Math.ceil((p.barrierHp||0)+(p.overhealShield||0))),barrierMax=Math.max(1,Math.ceil(Math.max(p.barrierMax||0,barrier))),shieldPct=barrier?Math.max(2,Math.min(100,100*barrier/barrierMax)):0;
  const lang=(typeof VSX!=='undefined'&&VSX?.lang)||"en";
  const labels=lang==="vi"?{core:"LÕI SINH TỒN",level:"CẤP",kills:"HẠ GỤC",score:"ĐIỂM",slots:"Ô TRANG BỊ",shield:"KHIÊN",wave:"ĐỢT",boss:"BOSS ĐANG GIAO CHIẾN",runScore:"ĐIỂM RUN",runKills:"HẠ GỤC"}:{core:"SURVIVOR CORE",level:"LEVEL",kills:"KILLS",score:"SCORE",slots:"LOADOUT",shield:"SHIELD",wave:"WAVE",boss:"BOSS ENGAGED",runScore:"RUN SCORE",runKills:"KILLS"};
  const stats=document.getElementById('statsHud');
  if(stats){
    const chips=[];
    if((p.damageReduction||0)>0)chips.push(`DR ${Math.round(p.damageReduction*100)}%`);
    if(p.clones?.length)chips.push(`${lang==='vi'?'BẢN SAO':'CLONES'} ${p.clones.length}/3`);
    if(p.guardianShield||p.networkShieldTimer>0)chips.push(lang==='vi'?'KHIÊN SẴN SÀNG':'SHIELD READY');
    stats.innerHTML=`<div class="vsxHudTitle">${labels.core}</div><div class="vsxHpRow"><span>HP</span><strong>${hp}<small style="font-size:9px;color:#6f879e"> / ${maxHp}</small></strong></div><div class="miniBar"><div class="miniFill" style="width:${hpPct}%"></div></div><div class="vsxHpRow" style="margin-top:8px"><span>${labels.shield}</span><strong>${barrier}<small style="font-size:9px;color:#6f879e"> / ${barrierMax}</small></strong></div><div class="miniBar"><div class="miniFill vsxUiShieldFill" style="width:${shieldPct}%"></div></div><div class="vsxCoreGrid" style="margin-top:9px"><div class="vsxCoreCell"><small>${labels.level}</small><b>${p.level}</b></div><div class="vsxCoreCell"><small>${labels.kills}</small><b>${g.kills||0}</b></div><div class="vsxCoreCell"><small>${labels.score}</small><b>${Math.floor(g.score||0)}</b></div><div class="vsxCoreCell"><small>${labels.slots}</small><b>${p.weapons?.length||0}/${p.weaponSlots||10} · ${p.passives?.size||0}/${p.passiveSlots||10}</b></div></div>${chips.length?`<div class="vsxStatusLine">${chips.map(x=>`<span class="vsxStatusChip">${esc(x)}</span>`).join('')}</div>`:''}`;
  }
  const timer=document.getElementById('timerHud');
  if(timer){
    const boss=!!(g.boss&&!g.boss.dead);const evt=!!g.worldEvent;
    timer.innerHTML=`<div class="vsxTimerTime">${typeof fmtTime==='function'?fmtTime(g.time||0):'00:00'}</div><div class="vsxTimerMeta"><span class="vsxTimerChip">${labels.wave} ${String(g.wave||1).padStart(2,'0')}</span>${boss?`<span class="vsxTimerChip danger">${labels.boss}</span>`:''}${evt?`<span class="vsxTimerChip">ANOMALY</span>`:''}</div>`;
  }
  const cur=document.getElementById('vsxCurrencyHud');
  if(cur)cur.innerHTML=`<div class="vsxCurrencyGrid"><div class="vsxCurrencyCell"><small>${labels.runScore}</small><span class="vsxCurrencyValue">${Math.floor(g.score||0).toLocaleString('en-US')}</span></div><div class="vsxCurrencyCell"><small>${labels.runKills}</small><span class="vsxCurrencyValue">${Math.floor(g.kills||0).toLocaleString('en-US')}</span></div></div>`;
  const dock=document.getElementById('vsxWeaponDock');
  if(dock){
    const slots=Math.max(10,p.weaponSlots||10),weapons=p.weapons||[];let html='';
    for(let i=0;i<slots;i++){
      const w=weapons[i];if(!w){html+=`<div class="vsxWeaponSlot empty"><div class="vsxSlotName">EMPTY</div><div class="vsxSlotLv">${i+1}</div></div>`;continue}
      const d=(typeof WEAPON_DEFINITIONS!=='undefined'?WEAPON_DEFINITIONS[w.id]:null)||w.def||{},rar=(d.rarity||'common').toLowerCase();
      html+=`<div class="vsxWeaponSlot ${esc(rar)}"><div class="vsxSlotName" title="${esc(w.name||w.id)}">${esc(shortName(w.name||w.id))}</div><div class="vsxSlotLv">LV ${w.level||1}${w.mutationId?' · M':''}</div></div>`;
    }
    dock.innerHTML=html;
  }
  // Override the legacy inline !important layout with the new zero-collision geometry.
  const imp=(el,k,v)=>{if(el)el.style.setProperty(k,v,'important')};
  const vw=innerWidth,vh=innerHeight,mobile=vw<=720,mid=vw<=930;
  const statsEl=document.getElementById('statsHud'),curEl=document.getElementById('vsxCurrencyHud'),invEl=document.getElementById('inventoryHud'),timerEl=document.getElementById('timerHud');
  const actEl=document.getElementById('vsxActionHud'),allyEl=document.getElementById('vsxAllyHud'),mapEl=document.getElementById('vsxMinimapWrap'),dockEl=document.getElementById('vsxWeaponDock'),xpEl=document.getElementById('xpWrap');
  if(mobile){
    imp(statsEl,'left','8px');imp(statsEl,'top','8px');imp(statsEl,'width','174px');imp(statsEl,'min-width','174px');
    imp(curEl,'right','8px');imp(curEl,'top','8px');imp(curEl,'width','174px');
    imp(timerEl,'left','50%');imp(timerEl,'right','auto');imp(timerEl,'top','96px');imp(timerEl,'width','220px');imp(timerEl,'min-width','0');imp(timerEl,'transform','translateX(-50%)');
    imp(invEl,'display','none');imp(allyEl,'display','none');
    imp(actEl,'left','8px');imp(actEl,'bottom','42px');imp(actEl,'width','168px');
    imp(mapEl,'right','8px');imp(mapEl,'bottom','42px');imp(mapEl,'width','150px');
    imp(dockEl,'left','12px');imp(dockEl,'right','12px');imp(dockEl,'bottom','222px');imp(dockEl,'width','auto');imp(dockEl,'transform','none');
    imp(xpEl,'left','8px');imp(xpEl,'right','8px');imp(xpEl,'bottom','12px');imp(xpEl,'width','auto');imp(xpEl,'transform','none');
  }else if(mid){
    imp(statsEl,'left','14px');imp(statsEl,'top','14px');imp(statsEl,'width','220px');imp(statsEl,'min-width','220px');
    imp(curEl,'right','14px');imp(curEl,'top','14px');imp(curEl,'width','220px');
    imp(invEl,'display','none');imp(allyEl,'display','none');
    imp(timerEl,'left','50%');imp(timerEl,'top','14px');imp(timerEl,'width','300px');imp(timerEl,'min-width','0');imp(timerEl,'transform','translateX(-50%)');
    imp(actEl,'left','14px');imp(actEl,'bottom','44px');imp(actEl,'width','220px');
    imp(mapEl,'right','14px');imp(mapEl,'bottom','44px');imp(mapEl,'width','180px');
    imp(dockEl,'left','50%');imp(dockEl,'right','auto');imp(dockEl,'bottom','44px');imp(dockEl,'width','min(520px,52vw)');imp(dockEl,'transform','translateX(-50%)');
    imp(xpEl,'left','50%');imp(xpEl,'right','auto');imp(xpEl,'bottom','14px');imp(xpEl,'width','min(520px,52vw)');imp(xpEl,'transform','translateX(-50%)');
  }else{
    const leftW=vw<1180?236:278,rightW=vw<1180?236:288;
    imp(statsEl,'left','16px');imp(statsEl,'top','16px');imp(statsEl,'width',leftW+'px');imp(statsEl,'min-width',leftW+'px');
    imp(curEl,'right','16px');imp(curEl,'top','16px');imp(curEl,'width',rightW+'px');
    imp(invEl,'display','block');imp(invEl,'right','16px');imp(invEl,'top','99px');imp(invEl,'width',rightW+'px');imp(invEl,'max-height','35vh');
    imp(timerEl,'left','50%');imp(timerEl,'top','16px');imp(timerEl,'width',vw<1180?'360px':'510px');imp(timerEl,'min-width','0');imp(timerEl,'transform','translateX(-50%)');
    imp(allyEl,'display','block');imp(allyEl,'left','16px');imp(allyEl,'top','264px');imp(allyEl,'width',leftW+'px');
    imp(actEl,'left','16px');imp(actEl,'bottom','48px');imp(actEl,'width',leftW+'px');
    imp(mapEl,'right','16px');imp(mapEl,'bottom','50px');imp(mapEl,'width',vw<1180?'205px':'230px');
    imp(dockEl,'left','50%');imp(dockEl,'right','auto');imp(dockEl,'bottom','42px');imp(dockEl,'width',vw<1180?'min(600px,48vw)':'min(760px,54vw)');imp(dockEl,'transform','translateX(-50%)');
    imp(xpEl,'left','50%');imp(xpEl,'right','auto');imp(xpEl,'bottom','14px');imp(xpEl,'width',vw<1180?'min(600px,48vw)':'min(760px,54vw)');imp(xpEl,'transform','translateX(-50%)');
  }

  // Collision-safe center stack: Big Boss and World Event are allowed together after minute 5.
  const boss=document.getElementById('bossWrap'),evt=document.getElementById('vsxEventHud'),mini=document.getElementById('vsxMiniBossHud');
  const bossVisible=boss&&getComputedStyle(boss).display!=='none';
  if(evt){const y=bossVisible?132:84;evt.style.setProperty('top',y+'px','important')}
  if(mini){const evtVisible=evt&&getComputedStyle(evt).display!=='none';const y=bossVisible?(evtVisible?205:132):(evtVisible?157:84);mini.style.setProperty('top',y+'px','important')}
}

if(typeof Game!=='undefined'&&Game.prototype){
  const base=Game.prototype.updateHUD;
  Game.prototype.updateHUD=function(force=false){const r=base.call(this,force);try{renderModernHud(this)}catch(err){console.warn('[UI]',err)}return r};
}

function decorateDynamicScreens(){
  document.querySelectorAll('.panel').forEach(x=>x.classList.add('vsxModernPanel'));
  const admin=document.getElementById('vsxAdminScreen');if(admin)admin.classList.add('vsxCyberScreen');
  const collection=document.getElementById('vsxCollectionScreen');if(collection)collection.classList.add('vsxCyberScreen');
  const settings=document.getElementById('vsxSettingsScreen');if(settings)settings.classList.add('vsxCyberScreen');
}
decorateDynamicScreens();
new MutationObserver(decorateDynamicScreens).observe(document.body,{childList:true,subtree:false});

// Existing buttons keep their original listeners because IDs/elements were preserved.
// This only gives mouse users a reliable visual focus state.
document.addEventListener('keydown',e=>{if(e.key==='Tab')document.body.classList.add('vsxKeyboardNav')},{once:true});

window.VSX_RENDER_MODERN_HUD=renderModernHud;
})();
