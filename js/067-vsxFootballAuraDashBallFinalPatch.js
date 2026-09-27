(function(){
'use strict';
const TAG='[VSX FOOTBALL AURA/DASH PATCH]';
const FB_PACKAGE='football_legends_vol1';
const GOAT_PACKAGE='goat_rivals_cr7_m10';
const N10_PACKAGE='n10_last_samba_bundle';
const RM_PACKAGE='rm_royal_three_bundle';
const DC_PACKAGE='dc_crisis_protocol';
const FB_IDS=new Set(['ronaldo_r9','pele_p10','ronaldinho_r10']);
const RM_IDS=new Set(['rm_mbappe_k10','rm_vini_v7','rm_jude_j5']);
const GOAT_IDS=new Set(['cr7_goat','m10_goat']);
const FOOTBALL_IDS=new Set([...FB_IDS,...RM_IDS,...GOAT_IDS,'n10_neymar']);
const RM_WEAPONS=new Set(['rm_express_finish','rm_touchline_blade','rm_midfield_command']);
const N10_WEAPON='samba_streetball';
let VSX_RING_RENDER_STATE=null;

function fxMap(){VSX.save.meta||={};VSX.save.meta.packageEffects||={};return VSX.save.meta.packageEffects}
function pkgOn(id){return !!VSX.save.meta?.packages?.[id] && fxMap()[id]!==false}
function charPkg(id){if(FB_IDS.has(id))return FB_PACKAGE;if(GOAT_IDS.has(id))return GOAT_PACKAGE;if(RM_IDS.has(id))return RM_PACKAGE;if(id==='n10_neymar')return N10_PACKAGE;const p=CHARACTER_DEFINITIONS?.[id]?.packageId;return p===DC_PACKAGE?DC_PACKAGE:null}
function ringPalette(id){
  if(id==='ronaldinho_r10')return ['#ef3340','#2563eb'];
  if(id==='ronaldo_r9'||id==='pele_p10'||id==='n10_neymar')return ['#facc15','#16a34a'];
  if(RM_IDS.has(id))return ['#ffffff','#e8c96a'];
  if(id==='cr7_goat')return ['#f5d25d','#d4232f'];
  if(id==='m10_goat')return ['#ffffff','#60a5fa'];
  const sid=VSX.save?.loadout?.skin,d=SKIN_DEFINITIONS?.[sid];if(d?.characterOnly===id)return [d.color||'#ffffff',d.secondary||'#7dd3fc'];
  return ['#ffffff','#7dd3fc'];
}
function hexToRgba(hex,alpha){
  if(typeof hex!=='string')return `rgba(255,255,255,${alpha})`;
  let h=hex.replace('#','').trim();
  if(h.length===3)h=h.split('').map(ch=>ch+ch).join('');
  const ok=/^[0-9a-fA-F]{6}$/.test(h); if(!ok)return `rgba(255,255,255,${alpha})`;
  const n=parseInt(h,16),r=(n>>16)&255,g=(n>>8)&255,b=n&255;
  return `rgba(${r},${g},${b},${alpha})`;
}
function suppressPackages(fn, alsoSkinDefault=false){
  const fx=fxMap(), ids=[FB_PACKAGE,GOAT_PACKAGE,N10_PACKAGE,RM_PACKAGE,DC_PACKAGE], old={};
  for(const id of ids){old[id]=fx[id];fx[id]=false}
  const oldSkin=VSX.save?.loadout?.skin;
  const cid=game?.characterId||VSX.selectedCharacter;
  let oldUnlocked,oldSkinOwned,skinId=null;
  if(alsoSkinDefault && VSX.save?.loadout){
    skinId=cid==='ronaldo_r9'?'r9_brazil_2002':cid==='pele_p10'?'pele_brazil_1970':cid==='ronaldinho_r10'?'r10_barcelona_10':null;
    if(skinId){
      VSX.save.meta.unlockedCharacters||={};VSX.save.meta.skins||={};
      oldUnlocked=VSX.save.meta.unlockedCharacters[cid];oldSkinOwned=VSX.save.meta.skins[skinId];
      VSX.save.meta.unlockedCharacters[cid]=false;VSX.save.meta.skins[skinId]=false;
    }
    VSX.save.loadout.skin='default';
  }
  try{return fn()}finally{
    if(alsoSkinDefault&&VSX.save?.loadout)VSX.save.loadout.skin=oldSkin;
    if(skinId){VSX.save.meta.unlockedCharacters[cid]=oldUnlocked;VSX.save.meta.skins[skinId]=oldSkinOwned;}
    for(const id of ids){if(old[id]===undefined)delete fx[id];else fx[id]=old[id]}
  }
}
function drawAuraRing(g,p,id){
  const [a,b]=ringPalette(id),t=game?.time||0,fb=FB_IDS.has(id);
  const base=(p.radius||15),r=base+(fb?12:7),outer=r+(fb?5:3),orbit=r+(fb?9:5);
  g.save();g.translate(p.x,p.y);g.globalCompositeOperation='screen';g.lineCap='round';
  const grad=g.createLinearGradient(-outer,-outer,outer,outer);grad.addColorStop(0,a);grad.addColorStop(.52,b);grad.addColorStop(1,a);
  g.shadowBlur=fb?15:9;g.shadowColor=a;

  /* main ring */
  g.strokeStyle=grad;g.lineWidth=fb?3.4:2.5;g.globalAlpha=fb ? .96 : .88;g.beginPath();g.arc(0,0,r,0,Math.PI*2);g.stroke();

  /* outer support ring for football legends: larger layout like the reference */
  g.globalAlpha=fb ? .58 : .28;g.lineWidth=fb?1.9:1.2;g.beginPath();g.arc(0,0,outer,0,Math.PI*2);g.stroke();

  /* animated segmented arcs */
  g.rotate(t*(fb ? .44 : .32));
  g.globalAlpha=fb ? .72 : .32;g.lineWidth=fb?2.3:1.2;
  g.beginPath();g.arc(0,0,orbit,-1.02,.84);g.stroke();
  g.beginPath();g.arc(0,0,orbit,1.62,3.54);g.stroke();
  if(fb){
    g.globalAlpha=.42;g.lineWidth=1.35;
    g.beginPath();g.arc(0,0,orbit+3,3.95,5.32);g.stroke();
  }

  /* subtle inner glow */
  const halo=g.createRadialGradient(0,0,Math.max(2,base*.72),0,0,outer+6);
  halo.addColorStop(0,'rgba(255,255,255,0)');
  halo.addColorStop(.62,hexToRgba(a,fb ? .10 : .06));
  halo.addColorStop(1,'rgba(255,255,255,0)');
  g.globalAlpha=1;g.fillStyle=halo;g.beginPath();g.arc(0,0,outer+6,0,Math.PI*2);g.fill();
  g.restore();
}
function drawSimpleLegendSkin(g,p,id){
  const r=p.radius||15;g.save();g.translate(p.x,p.y);g.beginPath();g.arc(0,0,r,0,Math.PI*2);g.clip();
  let c1='#f5d92e',c2='#16834e',num='10',ink='#116c42';
  if(id==='ronaldo_r9'){num='9'}
  if(id==='ronaldinho_r10'){c1='#174a9c';c2='#9d173c';ink='#ffffff'}
  const gr=g.createLinearGradient(-r,-r,r,r);gr.addColorStop(0,c1);gr.addColorStop(.64,c1);gr.addColorStop(.65,c2);gr.addColorStop(1,c2);g.fillStyle=gr;g.fillRect(-r,-r,r*2,r*2);
  g.globalAlpha=.13;g.fillStyle='#fff';g.beginPath();g.arc(-r*.35,-r*.43,r*.72,0,Math.PI*2);g.fill();g.globalAlpha=1;
  g.fillStyle=ink;g.textAlign='center';g.textBaseline='middle';g.font=`900 ${Math.max(10,r*.78)}px Arial`;g.fillText(num,0,1);g.restore();
}

/* Render policy: bundle toggle = ring only. Suppress old package field/trail/crown/flag FX. */
const PLAYER_RENDER_BASE=Player.prototype.render;
Player.prototype.render=function(g){
  const id=game?.characterId||VSX.selectedCharacter;
  const oldSkin=VSX.save?.loadout?.skin;
  const fbSkin=FB_IDS.has(id) && ['r9_brazil_2002','pele_brazil_1970','r10_barcelona_10'].includes(oldSkin);
  const pkg=charPkg(id);
  const ringOn=(VSX_RING_RENDER_STATE&&VSX_RING_RENDER_STATE.id===id)
    ? !!VSX_RING_RENDER_STATE.on
    : !!(pkg&&pkgOn(pkg));
  let out;
  try{out=suppressPackages(()=>PLAYER_RENDER_BASE.apply(this,arguments),fbSkin)}catch(err){console.error(TAG,'player render base',err);out=undefined}
  try{
    if(fbSkin)drawSimpleLegendSkin(g,this,id);
    if(ringOn)drawAuraRing(g,this,id);
  }catch(err){console.warn(TAG,'ring render',err)}
  return out;
};

const GAME_RENDER_BASE=Game.prototype.render;
Game.prototype.render=function(){
  const id=this?.characterId||VSX.selectedCharacter;
  const pkg=charPkg(id);
  const ringOn=!!(pkg&&pkgOn(pkg));
  VSX_RING_RENDER_STATE={id,on:ringOn};
  try{return suppressPackages(()=>GAME_RENDER_BASE.apply(this,arguments),false)}catch(err){console.error(TAG,'game render',err);throw err}
  finally{VSX_RING_RENDER_STATE=null}
};

function drawSoccerBall(g,x,y,r,base,panel,accent){
  g.save();g.translate(x,y);g.fillStyle=base;g.shadowBlur=10;g.shadowColor=accent;g.beginPath();g.arc(0,0,r,0,Math.PI*2);g.fill();
  g.strokeStyle='rgba(255,255,255,.44)';g.lineWidth=1;g.beginPath();g.arc(0,0,r-.8,0,Math.PI*2);g.stroke();
  g.fillStyle=panel;g.beginPath();for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*2/5,rr=r*.34,xx=Math.cos(a)*rr,yy=Math.sin(a)*rr;if(i===0)g.moveTo(xx,yy);else g.lineTo(xx,yy)}g.closePath();g.fill();
  g.strokeStyle=panel;g.globalAlpha=.7;g.lineWidth=1;for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*2/5;g.beginPath();g.moveTo(Math.cos(a)*r*.36,Math.sin(a)*r*.36);g.lineTo(Math.cos(a)*r*.82,Math.sin(a)*r*.82);g.stroke()}g.restore();
}
function drawBallAura(g,x,y,r,a,b,alpha=.86){
  g.save();g.translate(x,y);g.globalCompositeOperation='screen';const rr=r+6;const gr=g.createLinearGradient(-rr,-rr,rr,rr);gr.addColorStop(0,a);gr.addColorStop(.55,b);gr.addColorStop(1,a);g.strokeStyle=gr;g.globalAlpha=alpha;g.lineWidth=1.8;g.shadowBlur=10;g.shadowColor=a;g.beginPath();g.arc(0,0,rr,0,Math.PI*2);g.stroke();g.restore();
}
function styleR9Effect(e){if(!e||e.__vsxBallStyled)return;e.__vsxBallStyled=true;e.render=function(g){
  g.save();g.lineCap='round';for(let i=1;i<this.hist.length;i++){g.globalAlpha=i/this.hist.length*.62;g.strokeStyle='#f3c62b';g.lineWidth=3;g.shadowBlur=7;g.shadowColor='#facc15';g.beginPath();g.moveTo(this.hist[i-1].x,this.hist[i-1].y);g.lineTo(this.hist[i].x,this.hist[i].y);g.stroke()}g.restore();
  drawBallAura(g,this.x,this.y,8,'#facc15','#16a34a');drawSoccerBall(g,this.x,this.y,8,'#f5d33b','#b99112','#facc15');
}}
function localBezier(p0,p1,p2,p3,t){const q=1-t;return{x:q*q*q*p0.x+3*q*q*t*p1.x+3*q*t*t*p2.x+t*t*t*p3.x,y:q*q*q*p0.y+3*q*q*t*p1.y+3*q*t*t*p2.y+t*t*t*p3.y}}
function styleR10Effect(e){if(!e||e.__vsxBallStyled)return;e.__vsxBallStyled=true;e.render=function(g){
  const drawCurve=(p1,p2,color,alpha,w)=>{g.strokeStyle=color;g.globalAlpha=alpha;g.lineWidth=w;g.beginPath();let p=this.p0;g.moveTo(p.x,p.y);for(let i=1;i<=22;i++){const tt=i/22,q=localBezier(this.p0,p1,p2,this.p3,tt);g.lineTo(q.x,q.y)}g.stroke()};
  g.save();drawCurve(this.p1,this.p2,'#2563eb',.26,2.4);drawCurve({x:this.p1.x+10,y:this.p1.y-8},{x:this.p2.x-10,y:this.p2.y+8},'#ef3340',.23,1.8);g.restore();
  drawBallAura(g,this.pos.x,this.pos.y,this.ultimate?10:8,'#ef3340','#2563eb');drawSoccerBall(g,this.pos.x,this.pos.y,this.ultimate?10:8,'#f7f6ef','#174a9c','#ef3340');
}}
function styleFootballEffects(){for(const e of game?.effects||[]){const n=e?.constructor?.name;if(n==='FB_R9RouteEffect')styleR9Effect(e);else if(n==='FB_ElasticoEffect')styleR10Effect(e)}}
const UPDATE_FX_BASE=Game.prototype.update;
Game.prototype.update=function(dt){const r=UPDATE_FX_BASE.apply(this,arguments);try{styleFootballEffects()}catch(err){console.warn(TAG,'effect styling',err)}return r};

/* Projectile policy: remove package trails, keep compact ball auras requested. */
function drawN10ProjectileTrail(g,p){
  const sp=Math.hypot(p.vx||0,p.vy||0)||1,nx=(p.vx||1)/sp,ny=(p.vy||0)/sp,r=p.radius||6;
  g.save();
  g.globalCompositeOperation='screen';
  g.lineCap='round';
  const x0=p.x-nx*(r+5),y0=p.y-ny*(r+5),x1=p.x-nx*64,y1=p.y-ny*64;
  const grad=g.createLinearGradient(x1,y1,x0,y0);
  grad.addColorStop(0,'rgba(22,163,74,0)');
  grad.addColorStop(.22,'rgba(22,163,74,.35)');
  grad.addColorStop(.58,'rgba(250,204,21,.48)');
  grad.addColorStop(1,'rgba(250,204,21,.82)');
  g.strokeStyle=grad;g.lineWidth=Math.max(4,r*.95);g.shadowBlur=12;g.shadowColor='#facc15';
  g.beginPath();g.moveTo(x1,y1);g.lineTo(x0,y0);g.stroke();
  g.shadowColor='#16a34a';g.globalAlpha=.72;g.lineWidth=Math.max(2,r*.42);
  g.beginPath();g.moveTo(p.x-nx*56-ny*2,p.y-ny*56+nx*2);g.lineTo(p.x-nx*(r+8)-ny*1,p.y-ny*(r+8)+nx*1);g.stroke();
  for(let i=1;i<=4;i++){
    const d=12+i*10,px=p.x-nx*d,py=p.y-ny*d,rr=Math.max(1.6,r*(.46-.06*i));
    g.globalAlpha=.48-.07*i;g.fillStyle=i%2?'#facc15':'#16a34a';g.beginPath();g.arc(px,py,rr,0,Math.PI*2);g.fill();
  }
  g.restore();
}
const PROJ_RENDER_BASE=Projectile.prototype.render;
Projectile.prototype.render=function(g){
  const wid=this.weapon?.id,r=this.radius||6, suppressOldAura=wid===N10_WEAPON||RM_WEAPONS.has(wid), oldId=this.weapon?.id;
  let out;
  try{
    /* Capture/render N10 trail before weapon-id suppression so the trail survives the final authority wrapper. */
    if(wid===N10_WEAPON&&this.owner!=='enemy'&&this.projectileStyle==='football')drawN10ProjectileTrail(g,this);
    if(suppressOldAura&&this.weapon)this.weapon.id='__vsx_visual_suppressed__';
    out=suppressPackages(()=>PROJ_RENDER_BASE.apply(this,arguments),false);
  }catch(err){console.error(TAG,'projectile base',err);return}
  finally{if(suppressOldAura&&this.weapon)this.weapon.id=oldId}
  if(this.owner==='enemy'||this.projectileStyle!=='football')return out;
  try{
    if(wid===N10_WEAPON){drawBallAura(g,this.x,this.y,r,'#facc15','#16a34a');}
    else if(RM_WEAPONS.has(wid)){drawBallAura(g,this.x,this.y,r,'#ffffff','#e8c96a');}
  }catch(err){console.warn(TAG,'projectile aura',err)}
  return out;
};

/* R9 / Pelé / Ronaldinho: two stored dashes. */
function fbDashState(g){
  g.vsxFBLegendDash||={char:null,max:2,charges:2,recharge:0};const s=g.vsxFBLegendDash;
  if(s.char!==g.characterId){s.char=g.characterId;s.max=2;s.charges=2;s.recharge=0}
  return s;
}
const DASH_UPDATE_BASE=Game.prototype.update;
Game.prototype.update=function(dt){const r=DASH_UPDATE_BASE.apply(this,arguments);if(!FB_IDS.has(this.characterId)||!this.player)return r;const s=fbDashState(this);s.max=2;s.charges=Math.max(0,Math.min(2,s.charges));if(s.charges<2){if(!(s.recharge>0))s.recharge=4.5;s.recharge=Math.max(0,s.recharge-dt);if(s.recharge<=0){s.charges=Math.min(2,s.charges+1);s.recharge=s.charges<2?4.5:0}}else s.recharge=0;this.dashCooldown=s.charges>0?0:(s.recharge||4.5);return r};
function footballDashAuthority({game:g}){
  if(!FB_IDS.has(g.characterId))return null;
  if(g.state!=='PLAYING'||g.dashTimer>0)return{handled:true,value:undefined};const s=fbDashState(g);if(s.charges<=0)return{handled:true,value:undefined};
  let dx=0,dy=0;if(g.input.has('KeyW')||g.input.has('ArrowUp'))dy--;if(g.input.has('KeyS')||g.input.has('ArrowDown'))dy++;if(g.input.has('KeyA')||g.input.has('ArrowLeft'))dx--;if(g.input.has('KeyD')||g.input.has('ArrowRight'))dx++;
  if(dx||dy)g.lastMoveDir=normalize(dx,dy);const c=g.player?.characterMods||CHARACTER_DEFINITIONS[g.characterId]?.mods||{};g.dashDir={...(g.lastMoveDir||{x:1,y:0})};g.dashTimer=.20;g.player.invuln=Math.max(g.player.invuln,.16*(c.dashIFrame||1));g.stats.dashes++;s.charges=Math.max(0,s.charges-1);if(s.charges<2&&!(s.recharge>0))s.recharge=4.5;g.dashCooldown=s.charges>0?0:(s.recharge||4.5);g.audio?.beep?.(530,.05,'sine',.018);return{handled:true,value:undefined}
}
window.VSX_ARCH?.register('dash.before','football.double-dash',footballDashAuthority,{priority:100});
const HUD_BASE=Game.prototype.updateHUD;
Game.prototype.updateHUD=function(force){const r=HUD_BASE.apply(this,arguments);if(FB_IDS.has(this.characterId)){const s=fbDashState(this),txt=document.getElementById('vsxDashText'),fill=document.getElementById('vsxDashFill');if(txt){const clean=(txt.textContent||'').replace(/\s*•\s*\d+\/\d+$/,'');txt.textContent=`${clean} • ${s.charges}/2`}if(fill){const pct=s.charges>=2?100:s.charges>0?50:Math.max(0,100*(1-(s.recharge||0)/4.5));fill.style.width=`${pct}%`}}window.VSX_ARCH?.run('hud.after',{game:this,force,result:r});return r};

function refreshBundleCopy(){
  const on=id=>pkgOn(id)?'ON':'OFF';
  const fb=document.getElementById('vsxFootballFxToggle');if(fb)fb.textContent=`${VSX.lang==='vi'?'VÒNG AURA GÓI':'BUNDLE AURA RING'}: ${on(FB_PACKAGE)}`;
  const fbonus=document.querySelector('.vsxPackageBonus');if(fbonus&&document.getElementById('vsxFootballPackageRoster'))fbonus.innerHTML=`<b>${VSX.lang==='vi'?'THƯỞNG TRỌN BỘ':'FULL SET COSMETIC'}</b> · ${VSX.lang==='vi'?'Bật hiệu ứng chỉ thêm vòng aura quanh sprite: R9/Pelé vàng–xanh lá, Ronaldinho đỏ–xanh dương. Không còn hiệu ứng nền, cờ hay trail gói.':'When enabled, the bundle only adds a sprite aura ring: R9/Pelé gold–green, Ronaldinho red–blue. No stadium, flag or bundle trail effects.'}`;
  const n10=document.getElementById('vsxN10ToggleFx');if(n10)n10.textContent=`${VSX.lang==='vi'?'VÒNG AURA':'AURA RING'}: ${on(N10_PACKAGE)}`;
  const rm=document.getElementById('vsxRoyalFx');if(rm)rm.textContent=`${VSX.lang==='vi'?'VÒNG AURA HOÀNG GIA':'ROYAL AURA RING'}: ${on(RM_PACKAGE)}`;
  const rmbonus=document.querySelector('#vsxRoyalThreePackage .rmBonus');if(rmbonus)rmbonus.innerHTML=`<b>${VSX.lang==='vi'?'MỸ THUẬT TRỌN BỘ':'FULL SET COSMETIC'}</b> · ${VSX.lang==='vi'?'Khi bật chỉ hiện vòng aura trắng–ánh vàng quanh sprite. Không còn sweep sân vận động hay trail riêng.':'When enabled, only a white–gold aura ring appears around the equipped Royal Three sprite. Stadium sweeps and package trails are removed.'}`;
  const dc=document.getElementById('vsxDCEffectToggle');if(dc)dc.textContent=`${VSX.lang==='vi'?'VÒNG AURA GÓI':'BUNDLE AURA RING'}: ${on(DC_PACKAGE)}`;
  const dcbonus=document.querySelector('#vsxDCPackage .vsxDCBonus');if(dcbonus)dcbonus.innerHTML=`<b>${VSX.lang==='vi'?'THƯỞNG TRỌN BỘ':'FULL SET BONUS'}</b> · ${VSX.lang==='vi'?'Hiệu ứng gói giờ chỉ là vòng aura theo màu skin quanh sprite; không còn Watchtower Grid hay Crisis Trail.':'Bundle FX is now only a skin-colored aura ring around the sprite; Watchtower Grid and Crisis Trail are removed.'}`;
}
const ARMORY_FX_BASE=window.renderArmory;
if(typeof ARMORY_FX_BASE==='function')window.renderArmory=function(){const r=ARMORY_FX_BASE.apply(this,arguments);queueMicrotask(refreshBundleCopy);return r};
queueMicrotask(refreshBundleCopy);

window.VSX_FOOTBALL_SIMPLE_FX={
  version:'1.1.1',
  selfTest(){
    const errs=[];
    if(typeof Player.prototype.render!=='function')errs.push('player render missing');
    if(typeof Projectile.prototype.render!=='function')errs.push('projectile render missing');
    if(typeof Game.prototype.tryDash!=='function')errs.push('dash missing');
    for(const id of ['ronaldo_r9','pele_p10','ronaldinho_r10'])if(!CHARACTER_DEFINITIONS[id])errs.push('missing '+id);
    return {ok:!errs.length,errors:errs,dashMax:2,footballLegendsRingOnly:true,n10Aura:true,royalThreeAura:true,ringRenderStateBridge:true,legendRingRadius:'playerRadius+12/+17/+21'};
  }
};
})();
