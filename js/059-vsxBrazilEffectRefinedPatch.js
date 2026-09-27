(function(){
"use strict";
const ProjectileCtor=typeof Projectile!=='undefined'?Projectile:window.Projectile;
const GameCtor=typeof Game!=='undefined'?Game:window.Game;
const PlayerCtor=typeof Player!=='undefined'?Player:window.Player;
const hasFootballFx=()=>{
  try{
    if(typeof fbEffectOn==='function') return !!fbEffectOn();
    return !!window.VSX_FOOTBALL_PACKAGE?.effectOn?.();
  }catch(_){ return false; }
};
function withFootballFxSuppressed(fn){
  const pkg=window.VSX_FOOTBALL_PACKAGE;
  const restore=[];
  try{
    if(typeof fbEffectOn==='function'){ const orig=fbEffectOn; fbEffectOn=()=>false; restore.push(()=>{ fbEffectOn=orig; }); }
  }catch(_){ }
  try{
    if(pkg&&typeof pkg.effectOn==='function'){ const orig=pkg.effectOn.bind(pkg); pkg.effectOn=()=>false; restore.push(()=>{ pkg.effectOn=orig; }); }
  }catch(_){ }
  try{ return fn(); }
  finally{ while(restore.length){ try{ restore.pop()(); }catch(_){ } } }
}
function lang(en,vi){ return window.VSX?.lang==='vi'?vi:en; }
function updateFootballFxButtonState(){
  const btn=document.getElementById('vsxFootballFxToggle');
  if(btn) btn.dataset.off = hasFootballFx() ? '0' : '1';
}
function updateN10FxButtonState(){
  const btn=document.getElementById('vsxN10ToggleFx');
  if(btn && typeof n10EffectOn==='function') btn.dataset.off = n10EffectOn() ? '0' : '1';
}
function repaintBrazilBundleCopy(){
  const bonus=document.querySelector('.vsxBrazilFlagBundle .vsxPackageBonus');
  if(bonus){
    bonus.innerHTML=`<b>${lang('FULL SET COSMETIC','THƯỞNG TRỌN BỘ')}</b> · ${lang("BRAZIL'S PRIDE",'NIỀM TỰ HÀO BRAZIL')} — ${lang('When enabled, the bundle only adds a sprite aura ring: R9/Pelé gold-green, Ronaldinho red-blue. Flag, stadium and bundle trail effects are removed.','Khi bật, gói chỉ thêm vòng aura quanh sprite: R9/Pelé vàng-xanh lá, Ronaldinho đỏ-xanh dương. Toàn bộ hiệu ứng cờ, sân vận động và trail gói đều bị loại bỏ.')}`;
  }
  updateFootballFxButtonState();
  updateN10FxButtonState();
}
queueMicrotask(repaintBrazilBundleCopy);
setTimeout(repaintBrazilBundleCopy,60);

if(window.VSX_FOOTBALL_PACKAGE?.renderShop){
  const prev=window.VSX_FOOTBALL_PACKAGE.renderShop.bind(window.VSX_FOOTBALL_PACKAGE);
  window.VSX_FOOTBALL_PACKAGE.renderShop=function(container){
    const r=prev(container);
    repaintBrazilBundleCopy();
    return r;
  };
}

if(typeof n10SetEffect==='function'){
  const prev=n10SetEffect;
  n10SetEffect=function(v){ prev(v); queueMicrotask(updateN10FxButtonState); };
}
if(window.VSX_LAST_SAMBA?.grant){ queueMicrotask(updateN10FxButtonState); }

if(ProjectileCtor?.prototype?.render){
  const prevProjectileRender=ProjectileCtor.prototype.render;
  ProjectileCtor.prototype.render=function(g){
    const active=hasFootballFx() && this.owner!=='enemy' && ['football','goldenBall'].includes(this.projectileStyle);
    if(active){
      withFootballFxSuppressed(()=>prevProjectileRender.call(this,g));
      const r=this.radius||6, t=(window.game?.time||0)*2.2;
      g.save();
      g.translate(this.x,this.y);
      g.globalCompositeOperation='screen';
      const halo=g.createRadialGradient(0,0,r*0.2,0,0,r*2.1);
      halo.addColorStop(0,'rgba(255,255,255,0.0)');
      halo.addColorStop(0.36,'rgba(250,204,21,0.16)');
      halo.addColorStop(0.7,'rgba(37,99,235,0.12)');
      halo.addColorStop(1,'rgba(34,197,94,0)');
      g.fillStyle=halo;
      g.beginPath(); g.arc(0,0,r*2.1,0,Math.PI*2); g.fill();
      g.strokeStyle='rgba(255,255,255,.78)';
      g.lineWidth=Math.max(1,r*.12);
      g.beginPath(); g.arc(0,0,r*1.24,-1.0,0.36); g.stroke();
      for(let i=0;i<3;i++){
        const a=t+i*(Math.PI*2/3), rr=r*1.36;
        g.fillStyle=i===0?'rgba(22,163,74,.72)':i===1?'rgba(250,204,21,.85)':'rgba(96,165,250,.78)';
        g.beginPath(); g.arc(Math.cos(a)*rr,Math.sin(a)*rr,Math.max(.9,r*.12),0,Math.PI*2); g.fill();
      }
      g.restore();
      return;
    }
    return prevProjectileRender.call(this,g);
  };
}

if(GameCtor?.prototype?.render){
  const prevGameRender=GameCtor.prototype.render;
  GameCtor.prototype.render=function(){
    const active=hasFootballFx();
    let result;
    if(active) result = withFootballFxSuppressed(()=>prevGameRender.call(this));
    else result = prevGameRender.call(this);
    if(!active || !this.player || this.state==='TITLE') return result;
    const draw=(typeof ctx!=='undefined'?ctx:window.ctx); if(!draw) return result;
    const p=this.player, pulse=(Math.sin((this.time||0)*1.45)+1)*0.5;
    draw.save();
    draw.translate(-this.camera.x,-this.camera.y);
    draw.translate(p.x,p.y);
    draw.globalCompositeOperation='screen';
    draw.globalAlpha=0.05 + pulse*0.015;
    draw.fillStyle='#facc15';
    draw.rotate(Math.PI/4);
    draw.beginPath(); draw.moveTo(0,-66); draw.lineTo(110,0); draw.lineTo(0,66); draw.lineTo(-110,0); draw.closePath(); draw.fill();
    draw.rotate(-Math.PI/4);
    draw.globalAlpha=0.065 + pulse*0.02;
    const globe=draw.createRadialGradient(0,0,18,0,0,54);
    globe.addColorStop(0,'rgba(59,130,246,.14)');
    globe.addColorStop(0.7,'rgba(37,99,235,.07)');
    globe.addColorStop(1,'rgba(37,99,235,0)');
    draw.fillStyle=globe;
    draw.beginPath(); draw.arc(0,0,54,0,Math.PI*2); draw.fill();
    draw.globalAlpha=0.16;
    draw.strokeStyle='rgba(255,255,255,.52)';
    draw.lineWidth=2.1;
    draw.beginPath(); draw.arc(0,3,56,-2.55,-0.28); draw.stroke();
    draw.restore();
    return result;
  };
}

if(PlayerCtor?.prototype?.render && typeof n10EffectOn==='function'){
  const prevPlayerRender=PlayerCtor.prototype.render;
  PlayerCtor.prototype.render=function(g){
    return prevPlayerRender.call(this,g);
  };
  document.addEventListener('click',e=>{
    const btn=e.target.closest?.('#vsxN10ToggleFx,#vsxFootballFxToggle');
    if(btn) setTimeout(()=>{ updateFootballFxButtonState(); updateN10FxButtonState(); repaintBrazilBundleCopy(); },0);
  });
}
})();
