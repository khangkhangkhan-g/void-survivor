(function(){
"use strict";
const AUTO_KEY='vsxAutoUnlockAll';
const WEAPS=typeof WEAPON_DEFINITIONS!=='undefined'?WEAPON_DEFINITIONS:(window.WEAPON_DEFINITIONS||{});
const PASSIVES=typeof PASSIVE_DEFINITIONS!=='undefined'?PASSIVE_DEFINITIONS:(window.PASSIVE_DEFINITIONS||{});
const CHARS=typeof CHARACTER_DEFINITIONS!=='undefined'?CHARACTER_DEFINITIONS:(window.CHARACTER_DEFINITIONS||{});
const CONTRACTS=typeof CONTRACT_DEFINITIONS!=='undefined'?CONTRACT_DEFINITIONS:(window.CONTRACT_DEFINITIONS||{});
const SKINS=typeof SKIN_DEFINITIONS!=='undefined'?SKIN_DEFINITIONS:(window.SKIN_DEFINITIONS||{});
const ProjectileCtor=typeof Projectile!=='undefined'?Projectile:window.Projectile;
const GameCtor=typeof Game!=='undefined'?Game:window.Game;
function unlockAllContent(silent=true){
  if(!window.VSX||!window.VSX.save) return false;
  try{ if(typeof ensureAdminCollectionSave==='function') ensureAdminCollectionSave(); }catch(_){ }
  VSX.save.meta ||= {};
  const meta=VSX.save.meta;
  meta.unlockedWeapons ||= {};
  meta.adminOwnedWeapons ||= {};
  meta.unlockedPassives ||= {};
  meta.unlockedCharacters ||= {};
  meta.contractLicenses ||= {};
  meta.skins ||= {};
  meta.packages ||= {};
  meta.packageEffects ||= {};
  for(const id of Object.keys(WEAPS)){ meta.unlockedWeapons[id]=true; meta.adminOwnedWeapons[id]=true; try{ vsxDiscover?.('weapons',id); }catch(_){ } }
  for(const id of Object.keys(PASSIVES)) meta.unlockedPassives[id]=true;
  for(const id of Object.keys(CHARS)){ meta.unlockedCharacters[id]=true; try{ vsxDiscover?.('characters',id); }catch(_){ } }
  for(const id of Object.keys(CONTRACTS)) meta.contractLicenses[id]=true;
  for(const id of Object.keys(SKINS)) meta.skins[id]=true;
  const pkgIds=new Set();
  for(const def of Object.values(CHARS)) if(def?.packageId) pkgIds.add(def.packageId);
  for(const def of Object.values(SKINS)) if(def?.packageId) pkgIds.add(def.packageId);
  for(const id of pkgIds){ meta.packages[id]=true; meta.packageEffects[id]=false; try{ vsxDiscover?.('packages',id); }catch(_){ } }
  try{ if(typeof adminRevealFullCollection==='function') adminRevealFullCollection(); }catch(_){ }
  try{ vsxSave?.(); }catch(_){ }
  if(!silent&&window.VSX?.announce) VSX.announce('ADMIN',VSX.lang==='vi'?'ĐÃ MỞ KHÓA TOÀN BỘ + TỰ ĐỘNG':'FULL AUTO UNLOCK ENABLED','#ffd86a');
  return true;
}
function applyPersistentUnlock(){
  const shouldAuto=!!(window.VSX?.save?.meta?.[AUTO_KEY]||localStorage.getItem(AUTO_KEY)==='1');
  if(!shouldAuto) return;
  VSX.save.meta ||= {};
  VSX.save.meta[AUTO_KEY]=true;
  unlockAllContent(true);
}
if(typeof adminUnlockFull==='function'){
  const baseUnlock=adminUnlockFull;
  adminUnlockFull=function(){
    const ok=unlockAllContent(true);
    try{ VSX.save.meta[AUTO_KEY]=true; localStorage.setItem(AUTO_KEY,'1'); vsxSave?.(); }catch(_){ }
    if(!ok&&typeof baseUnlock==='function') baseUnlock();
    if(window.VSX?.announce) VSX.announce('ADMIN',VSX.lang==='vi'?'MỞ KHÓA TOÀN BỘ + TỰ BẬT AUTO UNLOCK':'UNLOCK FULL + AUTO UNLOCK ON','#ffd86a');
    try{ if(document.getElementById('vsxArmoryScreen')?.classList.contains('active')) renderArmory?.(); }catch(_){ }
    try{ if(window.VSX_ADMIN?.open) renderAdmin?.(); }catch(_){ }
  };
  if(window.VSX_ADMIN) VSX_ADMIN.unlockFull=adminUnlockFull;
}
window.VSX_AUTO_UNLOCK_ALL={enable(){VSX.save.meta[AUTO_KEY]=true;localStorage.setItem(AUTO_KEY,'1');unlockAllContent(true);vsxSave?.();},disable(){if(VSX.save?.meta)VSX.save.meta[AUTO_KEY]=false;localStorage.removeItem(AUTO_KEY);vsxSave?.();},apply:applyPersistentUnlock,unlockNow:unlockAllContent};
applyPersistentUnlock();

function t(en,vi){ return (window.VSX?.lang==='vi')?vi:en; }
function decorateBrazilBundle(container){
  const hero=container?.querySelector?.('.vsxPackageHero');
  if(!hero) return;
  hero.classList.add('vsxBrazilFlagBundle');
  if(!hero.querySelector('.vsxBrazilBundleMotto')){
    const m=document.createElement('div');
    m.className='vsxBrazilBundleMotto';
    m.textContent='ORDEM • PROGRESSO • JOGA BONITO';
    hero.insertBefore(m,hero.firstChild);
  }
  const bonus=hero.querySelector('.vsxPackageBonus');
  if(bonus){
    bonus.innerHTML=`<b>${t('FULL SET BONUS','THƯỞNG TRỌN BỘ')}</b> · ${t('BRAZIL\'S PRIDE','NIỀM TỰ HÀO BRAZIL')} — ${t('green-gold-blue stadium aura with a yellow diamond field glow, blue globe halo and white progress-band streaks for football projectiles.','hào quang sân cỏ xanh-vàng-xanh dương, nền ánh kim cương vàng, quầng cầu xanh và dải trắng “Ordem e Progresso” chạy theo các đạn bóng.')}`;
  }
}
if(window.VSX_FOOTBALL_PACKAGE?.renderShop){
  const baseRenderShop=window.VSX_FOOTBALL_PACKAGE.renderShop.bind(window.VSX_FOOTBALL_PACKAGE);
  window.VSX_FOOTBALL_PACKAGE.renderShop=function(container){
    const r=baseRenderShop(container);
    decorateBrazilBundle(container);
    return r;
  };
  queueMicrotask(()=>{
    const arm=document.getElementById('vsxArmoryScreen');
    if(arm?.classList.contains('active')){
      try{ renderArmory?.(); }catch(_){ }
    }
  });
}

if(ProjectileCtor?.prototype?.render){
  const baseProjectileRender=ProjectileCtor.prototype.render;
  ProjectileCtor.prototype.render=function(g){
    baseProjectileRender.call(this,g);
    if(!window.VSX_FOOTBALL_PACKAGE?.effectOn?.()||this.owner==='enemy'||!['football','goldenBall'].includes(this.projectileStyle)) return;
    const r=this.radius||6;
    const time=(window.game?.time||0)*2.8;
    g.save();
    g.translate(this.x,this.y);
    const aura=g.createRadialGradient(0,0,r*.35,0,0,r*2.75);
    aura.addColorStop(0,'rgba(255,255,255,0)');
    aura.addColorStop(.42,'rgba(56,189,248,.28)');
    aura.addColorStop(.72,'rgba(250,204,21,.24)');
    aura.addColorStop(1,'rgba(34,197,94,0)');
    g.globalAlpha=.95;
    g.fillStyle=aura;
    g.beginPath(); g.arc(0,0,r*2.75,0,Math.PI*2); g.fill();
    g.rotate(time*.18);
    g.strokeStyle='rgba(255,255,255,.96)';
    g.lineWidth=Math.max(1.35,r*.28);
    g.beginPath(); g.arc(0,0,r*1.48,-1.08,0.62); g.stroke();
    g.globalAlpha=.8;
    for(let i=0;i<3;i++){
      const ang=time+i*(Math.PI*2/3), rr=r*1.85;
      g.fillStyle=i===0?'#16a34a':i===1?'#facc15':'#3b82f6';
      g.beginPath(); g.arc(Math.cos(ang)*rr,Math.sin(ang)*rr,Math.max(1.3,r*.18),0,Math.PI*2); g.fill();
    }
    g.restore();
  };
}

if(GameCtor?.prototype?.render){
  const baseGameRender=GameCtor.prototype.render;
  GameCtor.prototype.render=function(){
    const r=baseGameRender.call(this);
    if(!this.player||this.state==='TITLE'||!window.VSX_FOOTBALL_PACKAGE?.effectOn?.()) return r;
    const p=this.player, now=this.time||0, pulse=(Math.sin(now*1.35)+1)*.5;
    const draw=(typeof ctx!=='undefined'?ctx:window.ctx); if(!draw) return r;
    draw.save();
    draw.translate(-this.camera.x,-this.camera.y);
    draw.translate(p.x,p.y);
    draw.globalAlpha=.075+.035*pulse;
    draw.fillStyle='#facc15';
    draw.rotate(Math.PI/4);
    draw.beginPath(); draw.moveTo(0,-118); draw.lineTo(198,0); draw.lineTo(0,118); draw.lineTo(-198,0); draw.closePath(); draw.fill();
    draw.rotate(-Math.PI/4);
    draw.globalAlpha=.11;
    draw.fillStyle='rgba(37,99,235,.68)';
    draw.beginPath(); draw.arc(0,0,88+10*pulse,0,Math.PI*2); draw.fill();
    draw.globalAlpha=.34;
    draw.strokeStyle='rgba(255,255,255,.78)';
    draw.lineWidth=3;
    draw.beginPath(); draw.arc(0,6,92,-2.2,-.28); draw.stroke();
    draw.restore();
    return r;
  };
}
})();
