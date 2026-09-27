(()=>{
'use strict';
const IDS=['rm_mbappe_k10','rm_vini_v7','rm_jude_j5'];
const RM={
  rm_mbappe_k10:{short:'K10',nameEN:'MBAPPÉ',nameVI:'MBAPPÉ',num:'10',skin:'rm_mbappe_france_10',ink:'#161616',accent:'#c9bdff',dash:3},
  rm_vini_v7:{short:'V7',nameEN:'VINI JR.',nameVI:'VINI JR.',num:'7',skin:'rm_vini_brazil_7',ink:'#111111',accent:'#e9cc78',dash:3},
  rm_jude_j5:{short:'J5',nameEN:'BELLINGHAM',nameVI:'BELLINGHAM',num:'5',skin:'rm_jude_england_5',ink:'#1a245a',accent:'#d8d6ff',dash:2}
};
const L=(en,vi)=>(typeof VSX!=='undefined'&&VSX.lang==='vi')?vi:en;
const esc=v=>(window.VSX?.esc?VSX.esc(v):String(v??''));
const isRealId=id=>IDS.includes(id);
const isRealGame=(g=window.game)=>isRealId(g?.characterId);
const skinId=id=>RM[id]?.skin;
const dashRule=id=>RM[id]?.dash||2;
const stateKey=id=>id==='rm_mbappe_k10'?'mbappe':id==='rm_vini_v7'?'vini':'jude';
function ensureState(g=window.game){
  if(!g) return null;
  g.vsxRoyalThree ||= {};
  const key=stateKey(g.characterId||'rm_mbappe_k10');
  g.vsxRoyalThree[key] ||= {};
  return g.vsxRoyalThree[key];
}
function syncDashState(g=window.game){
  if(!g || !isRealGame(g)) return null;
  const s=ensureState(g);
  const max=dashRule(g.characterId);
  s.dashMax=max;
  if(s.dashCharges==null || !Number.isFinite(s.dashCharges)) s.dashCharges=max;
  s.dashCharges=Math.max(0,Math.min(max,s.dashCharges));
  if(!Number.isFinite(s.dashRecharge)) s.dashRecharge=0;
  return s;
}
function dashVisualFill(s){
  const max=Math.max(1,s?.dashMax||1);
  const charges=Math.max(0,s?.dashCharges||0);
  const progress=charges<max?Math.max(0,Math.min(1,1-((s?.dashRecharge||0)/4.5))):0;
  return Math.max(0,Math.min(100,100*((charges+progress)/max)));
}
function skinDisplayName(id){
  if(id==='rm_mbappe_k10') return {en:'K10 · MBAPPÉ 10 · Royal Match Shirt',vi:'K10 · MBAPPÉ 10 · Áo Đấu Hoàng Gia'};
  if(id==='rm_vini_v7') return {en:'V7 · VINI JR. 7 · Royal Match Shirt',vi:'V7 · VINI JR. 7 · Áo Đấu Hoàng Gia'};
  return {en:'J5 · BELLINGHAM 5 · Royal Match Shirt',vi:'J5 · BELLINGHAM 5 · Áo Đấu Hoàng Gia'};
}
function patchSkinNames(){
  for(const id of IDS){
    const sid=skinId(id), def=window.SKIN_DEFINITIONS?.[sid];
    if(def) def.name=skinDisplayName(id);
  }
}
function jerseyMarkup(id,mini=false){
  const c=RM[id];
  if(!c) return '';
  const label=window.VSX?.lang==='vi'?c.nameVI:c.nameEN;
  const cls=id==='rm_vini_v7'?'v7':id==='rm_jude_j5'?'j5':'k10';
  return `<div class="rmJerseyCard ${cls} ${mini?'mini':''}" style="--ink:${c.ink};--accent:${c.accent}" data-rm-jersey="${id}">
    <div class="rmJerseyName">${esc(label)}</div>
    <div class="rmJerseyNo">${esc(c.num)}</div>
    <div class="rmJerseyMeta"><span>${esc(c.short)}</span><b>RM</b></div>
  </div>`;
}
function dashCopy(id){
  return id==='rm_jude_j5'
    ? L('2 chained dashes before full refill.','2 lần lướt liên tiếp trước khi hồi đầy.')
    : L('3 chained dashes before full refill.','3 lần lướt liên tiếp trước khi hồi đầy.');
}
function dashMetaCopy(id){
  return id==='rm_jude_j5'
    ? L('Stores 2 dashes, shared cadence with CR7/M10.','Tích trữ 2 lần lướt, cùng kiểu nhịp với CR7/M10.')
    : L('Stores 3 dashes for aggressive chaining.','Tích trữ 3 lần lướt để chain áp lực liên tục.');
}
function setupSkillCopy(id){
  return id==='rm_jude_j5'
    ? L('Box-to-box scaling · 2 stored dashes','Tăng tiến box-to-box · Tích trữ 2 lần lướt')
    : L('Wave growth pace · 3 stored dashes','Tăng tốc theo wave · Tích trữ 3 lần lướt');
}
function collectionCopy(id){
  return id==='rm_jude_j5'
    ? L('J5 stores 2 dashes. K10 and V7 store 3 dashes each for higher pressure spacing and faster chaining.','J5 tích trữ 2 lần lướt. K10 và V7 tích trữ 3 lần lướt để dồn nhịp mạnh hơn và nối pha mượt hơn.')
    : L('K10/V7/J5 now carry jersey-backed cosmetic presentation across Shop, Survivor Pick and Collection.','K10/V7/J5 nay có hiển thị mỹ thuật đồng bộ kiểu lưng áo xuyên suốt Shop, Chọn Nhân Vật và Bộ Sưu Tập.');
}
function decoratePackage(){
  const root=document.getElementById('vsxRoyalThreePackage');
  if(!root) return;
  root.classList.add('rmJerseyPatched');
  root.querySelectorAll('.rmRoster .rmFighter').forEach((card,idx)=>{
    const id=IDS[idx];
    if(!id) return;
    const top=card.querySelector('.rmFighterTop');
    const old=top?.querySelector('.rmOrb,.rmJerseyCard');
    if(top && (!top.querySelector('.rmJerseyCard'))){
      if(old) old.remove();
      top.insertAdjacentHTML('afterbegin', jerseyMarkup(id,false));
    }
    const growth=card.querySelector('.rmGrowth');
    if(growth && !growth.querySelector('.rmDashLine')){
      growth.insertAdjacentHTML('beforeend', `<div class="rmDashLine"><b>${L('Stored Dash','Lướt tích trữ')}</b> · ${dashCopy(id)}</div>`);
    }
  });
  root.querySelectorAll('.rmIndividualGrid .rmBuyCard').forEach((card,idx)=>{
    const id=IDS[idx];
    if(!id) return;
    if(!card.querySelector('.rmJerseyHead')){
      const head=card.querySelector('.rmBuyHead');
      if(head){
        const wrap=document.createElement('div');
        wrap.className='rmJerseyHead';
        head.parentNode.insertBefore(wrap,head);
        wrap.insertAdjacentHTML('beforeend', jerseyMarkup(id,true));
        wrap.appendChild(head);
      }
    }
    const meta=card.querySelector('.rmBuyMeta');
    if(meta && !meta.querySelector('[data-rm-dash]')){
      meta.insertAdjacentHTML('beforeend', `<span data-rm-dash><b>${L('Dash','Lướt')}:</b> ${dashMetaCopy(id)}</span>`);
    }
  });
}
function decorateSurvivorShop(){
  document.querySelectorAll('#vsxUnifiedSurvivorShop [data-rm-card]').forEach(card=>{
    const id=card.dataset.rmCard;
    if(!RM[id]) return;
    if(!card.querySelector('.rmSurvJerseyRow')){
      const desc=card.querySelector('.vsxUnifiedSurvivorDesc');
      if(desc){
        desc.insertAdjacentHTML('beforebegin', `<div class="rmSurvJerseyRow">${jerseyMarkup(id,true)}<div class="rmJerseyText"><b>${esc(window.CHARACTER_DEFINITIONS?.[id]?.name?.[window.VSX?.lang||'en']||id)}</b><span>${L('Royal back-print presentation · match-shirt inspired cosmetic','Hiển thị lưng áo phong cách áo đấu · mỹ thuật lấy cảm hứng từ match-shirt')}</span></div></div>`);
      }
    }
    const skill=card.querySelector('.vsxGoatPickSkillset.real');
    if(skill && !skill.dataset.rmPatched){
      skill.classList.add('rmDashSkill');
      skill.innerHTML=`<b>${L('SPECIAL','ĐẶC TRƯNG')}</b> ${setupSkillCopy(id)}`;
      skill.dataset.rmPatched='1';
    }
    const meta=card.querySelector('.vsxSurvivorMeta');
    if(meta && !meta.querySelector('[data-rm-dash]')){
      meta.insertAdjacentHTML('beforeend', `<span data-rm-dash><b>${L('Dash','Lướt')}:</b> ${dashMetaCopy(id)}</span>`);
    }
  });
}
function decorateSetup(){
  document.querySelectorAll('#vsxCharacterGrid .vsxPick').forEach(card=>{
    const id=card.dataset.characterId;
    if(!RM[id]) return;
    const badge=card.querySelector(':scope > .vsxGoatSetupBadge.real');
    if(badge){
      badge.classList.add('rmJerseyBadge');
      badge.innerHTML=`${jerseyMarkup(id,true)}<span><small>${L('SIGNATURE SKIN','SKIN ĐẶC TRƯNG')}</small>${esc(window.SKIN_DEFINITIONS?.[skinId(id)]?.name?.[window.VSX?.lang||'en']||'')}<br><span style="color:#afbfd0;font-size:8px">${L('Match-shirt back print, polished for shop / pick / codex surfaces.','Lưng áo match-shirt, tinh chỉnh cho shop / chọn nhân vật / bộ sưu tập.')}</span></span>`;
    }
    const sk=card.querySelector(':scope > .vsxGoatPickSkillset.real');
    if(sk){
      sk.classList.add('rmDashSkill');
      sk.innerHTML=`<b>${L('SPECIAL','ĐẶC TRƯNG')}</b> ${setupSkillCopy(id)}`;
    }
  });
}
function decorateCollection(){
  document.querySelectorAll('#vsxCodexList .vsxCharacterCodexCard').forEach(card=>{
    const id=card.dataset.codexId;
    if(!RM[id]) return;
    const detail=card.querySelector('.vsxCharacterCodexDetail');
    if(detail && !detail.querySelector('.rmCollectionPanel')){
      detail.insertAdjacentHTML('afterbegin', `<div class="rmCollectionPanel">${jerseyMarkup(id,true)}<div class="copy"><b>${L('Match-shirt presentation updated','Đã cập nhật hiển thị theo áo đấu')}</b><span>${collectionCopy(id)}</span></div></div>`);
    }
  });
}
const ARMORY_BASE=window.renderArmory;
if(typeof ARMORY_BASE==='function'){
  window.renderArmory=function(){
    const r=ARMORY_BASE.apply(this,arguments);
    queueMicrotask(()=>{patchSkinNames();decoratePackage();decorateSurvivorShop();decorateCollection();});
    return r;
  };
}
const SETUP_BASE=window.VSX?.renderSetup;
if(typeof SETUP_BASE==='function'){
  window.VSX.renderSetup=function(){
    const r=SETUP_BASE.apply(this,arguments);
    queueMicrotask(()=>{patchSkinNames();decorateSetup();});
    return r;
  };
}
const CODEX_BASE=window.VSX?.renderCodex;
if(typeof CODEX_BASE==='function'){
  window.VSX.renderCodex=function(cat){
    const r=CODEX_BASE.apply(this,arguments);
    if(cat==='characters'||cat==='packages') queueMicrotask(()=>{patchSkinNames();decorateCollection();});
    return r;
  };
}
const SHOW_BASE=window.VSX?.showCollection;
if(typeof SHOW_BASE==='function'){
  window.VSX.showCollection=function(){
    const r=SHOW_BASE.apply(this,arguments);
    queueMicrotask(()=>{patchSkinNames();decorateCollection();});
    return r;
  };
}
const UPDATE_BASE=Game.prototype.update;
Game.prototype.update=function(dt){
  const r=UPDATE_BASE.apply(this,arguments);
  if(!isRealGame(this)) return r;
  const s=syncDashState(this);
  if(!s) return r;
  if(typeof window.VSX_ADMIN!=='undefined' && VSX_ADMIN?.noCooldown){
    s.dashCharges=s.dashMax;
    s.dashRecharge=0;
    this.dashCooldown=0;
    return r;
  }
  if(this.state==='PLAYING'){
    if(s.dashCharges<s.dashMax){
      if(!(s.dashRecharge>0)) s.dashRecharge=4.5;
      s.dashRecharge=Math.max(0,s.dashRecharge-dt);
      if(s.dashRecharge<=0){
        s.dashCharges=Math.min(s.dashMax,s.dashCharges+1);
        s.dashRecharge=s.dashCharges<s.dashMax?4.5:0;
      }
    }else s.dashRecharge=0;
    this.dashCooldown=s.dashCharges>0?0:(s.dashRecharge||4.5);
  }else if(['MENU','SETUP','PAUSED','GAME_OVER'].includes(this.state)){
    s.dashCharges=s.dashMax;
    s.dashRecharge=0;
    this.dashCooldown=0;
  }
  return r;
};
const TRY_DASH_BASE=Game.prototype.tryDash;
Game.prototype.tryDash=function(){
  if(!isRealGame(this)) return TRY_DASH_BASE.apply(this,arguments);
  const s=syncDashState(this);
  if(this.state!=='PLAYING' || this.dashTimer>0) return;
  if((s?.dashCharges||0)<=0) return;
  const prevDashCount=this.stats?.dashes||0;
  const prevCd=this.dashCooldown;
  this.dashCooldown=0;
  const r=TRY_DASH_BASE.apply(this,arguments);
  if((this.stats?.dashes||0)>prevDashCount){
    s.dashCharges=Math.max(0,(s.dashCharges||s.dashMax)-1);
    if(s.dashCharges<s.dashMax && !(s.dashRecharge>0)) s.dashRecharge=4.5;
    this.dashCooldown=s.dashCharges>0?0:(s.dashRecharge||4.5);
    this.updateHUD?.(true);
  }else{
    this.dashCooldown=prevCd;
  }
  return r;
};
const HUD_BASE=Game.prototype.updateHUD;
Game.prototype.updateHUD=function(){
  const r=HUD_BASE.apply(this,arguments);
  if(!isRealGame(this)) return r;
  const s=syncDashState(this);
  const txt=document.getElementById('vsxDashText');
  const fill=document.getElementById('vsxDashFill');
  if(txt){
    const clean=(txt.textContent||'').replace(/\s*•\s*\d+\/\d+$/,'');
    txt.textContent=`${clean} • ${Math.max(0,s.dashCharges||0)}/${s.dashMax||1}`;
  }
  if(fill) fill.style.width=`${dashVisualFill(s)}%`;
  return r;
};
const PLAYER_RENDER_BASE=Player.prototype.render;
Player.prototype.render=function(g){
  PLAYER_RENDER_BASE.apply(this,arguments);
  if(!isRealGame(window.game)) return;
  const id=window.game.characterId;
  if(window.VSX?.save?.loadout?.skin!==skinId(id)) return;
  const c=RM[id];
  if(!c) return;
  const r=this.radius+1;
  g.save();
  g.translate(this.x,this.y);
  g.strokeStyle='rgba(255,255,255,.36)';
  g.lineWidth=1.1;
  g.beginPath();
  g.moveTo(-r*.82,-r*.68);
  g.lineTo(r*.82,-r*.68);
  g.stroke();
  g.fillStyle=c.ink;
  g.font=`900 ${Math.max(5,r*.34)}px Arial`;
  g.textAlign='center';
  g.textBaseline='top';
  g.fillText(c.nameEN.replace(' JR.','').slice(0,id==='rm_jude_j5'?10:7),0,-r*.64);
  g.globalAlpha=.94;
  g.font=`900 ${Math.max(10,r*.84)}px Arial`;
  g.textBaseline='middle';
  g.fillText(c.num,0,1);
  g.restore();
};
queueMicrotask(()=>{patchSkinNames();decoratePackage();decorateSurvivorShop();decorateSetup();decorateCollection();});
window.VSX_ROYAL_THREE_JERSEY_DASH_FIX={
  version:'1.0',
  selfTest(){
    const errors=[];
    for(const id of IDS){
      const c=RM[id];
      if(typeof SKIN_DEFINITIONS==='undefined'||!SKIN_DEFINITIONS[c.skin]) errors.push('missing skin '+c.skin);
      if(window.game?.characterId===id){
        const st=syncDashState(window.game);
        if(st && st.dashMax!==c.dash) errors.push(id+' dash max mismatch');
      }
    }
    return {
      ok:!errors.length,
      errors,
      packagePatched:!!document.getElementById('vsxRoyalThreePackage')?.classList.contains('rmJerseyPatched'),
      setupPatched:document.querySelectorAll('#vsxCharacterGrid .rmJerseyBadge').length,
      collectionPatched:document.querySelectorAll('#vsxCodexList .rmCollectionPanel').length
    };
  }
};
})();
