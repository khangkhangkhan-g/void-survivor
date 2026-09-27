(function(){
"use strict";

function fbLegendContent(id){return window.VSX_FOOTBALL_PACKAGE?.content?.[id]||((typeof FB_CONTENT!=="undefined")?FB_CONTENT[id]:null)}
function fbLegendSkinOwned(id){const o=fbLegendContent(id);return !!(o&&VSX.save?.meta?.skins?.[o.skin])}
function fbEquipLegendSkin(id,save=true){
  if(!VSX.save?.loadout)return false;
  const o=fbLegendContent(id);
  const cur=SKIN_DEFINITIONS[VSX.save.loadout.skin||"default"];
  if(o&&fbLegendSkinOwned(id)){
    if(VSX.save.loadout.skin!==o.skin){VSX.save.loadout.skin=o.skin;if(save)vsxSave()}
    return true;
  }
  if(cur?.characterOnly&&cur.characterOnly!==id){VSX.save.loadout.skin="default";if(save)vsxSave()}
  return false;
}
window.vsxEquipFootballLegendSkin=fbEquipLegendSkin;

/* Save migration / self-heal: older package builds could own the legend or
   full bundle without persisting the matching skin flag. Repair that state. */
(function fbRepairFootballPackageSave(){
  const pkg=window.VSX_FOOTBALL_PACKAGE;
  if(!pkg?.content||!VSX.save?.meta)return;
  VSX.save.meta.skins||={};
  VSX.save.meta.unlockedCharacters||={};
  VSX.save.meta.unlockedWeapons||={};
  const full=!!VSX.save.meta.packages?.[pkg.id];
  for(const [id,o] of Object.entries(pkg.content)){
    if(full||VSX.save.meta.unlockedCharacters[id]){
      if(full)VSX.save.meta.unlockedCharacters[id]=true;
      if(o.weapon)VSX.save.meta.unlockedWeapons[o.weapon]=true;
      if(o.skin)VSX.save.meta.skins[o.skin]=true;
    }
  }
})();

/* Buying/unlocking the package immediately equips the matching jersey when relevant. */
if(typeof fbGrantOne==="function"){
  const base=fbGrantOne;
  fbGrantOne=function(id,announce=false){const r=base(id,announce);if(r&&(VSX.selectedCharacter===id||game?.characterId===id))fbEquipLegendSkin(id,true);return r};
}
if(typeof fbGrantBundle==="function"){
  const base=fbGrantBundle;
  fbGrantBundle=function(announce=true){const r=base(announce);if(r)fbEquipLegendSkin(game?.characterId||VSX.selectedCharacter,true);return r};
}
if(typeof fbBuyOne==="function"){
  const base=fbBuyOne;
  fbBuyOne=function(id){const r=base(id);if(r&&(VSX.selectedCharacter===id||game?.characterId===id))fbEquipLegendSkin(id,true);return r};
}
if(typeof fbBuyBundle==="function"){
  const base=fbBuyBundle;
  fbBuyBundle=function(){const r=base();if(r)fbEquipLegendSkin(game?.characterId||VSX.selectedCharacter,true);return r};
}
if(window.VSX_FOOTBALL_PACKAGE){
  /* Do not reference package-IIFE private symbols here. The old patch did so
     and threw a ReferenceError, aborting the rest of the runtime skin setup. */
  window.VSX_FOOTBALL_PACKAGE.equipSkin=fbEquipLegendSkin;
}

/* Selecting a Football Legend always puts on that legend's owned package jersey. */
const FB_SKIN_SETUP_BASE=VSX.renderSetup;
VSX.renderSetup=function(){
  fbEquipLegendSkin(VSX.selectedCharacter,false);
  const r=FB_SKIN_SETUP_BASE.apply(this,arguments);
  const grid=document.getElementById("vsxCharacterGrid");
  if(grid){
    const ids=Object.keys(CHARACTER_DEFINITIONS).filter(id=>isCharacterUnlocked(id));
    [...grid.children].forEach((card,i)=>{
      const id=ids[i],o=fbLegendContent(id);
      if(!o||card.querySelector(".vsxFbSetupSkin"))return;
      const d=SKIN_DEFINITIONS[o.skin],isBarca=id==="ronaldinho_r10";
      const tag=document.createElement("div");
      tag.className="vsxFbSetupSkin";
      tag.innerHTML=`<span class="vsxFbSetupJersey ${isBarca?"barca":"brazil"}"><b>${VSX.esc(String(o.number))}</b></span><span><small>${VSX.lang==="vi"?"SKIN GÓI ĐÃ ÁP DỤNG":"PACKAGE SKIN APPLIED"}</small><br>${VSX.esc(d?.name?.[VSX.lang]||o.skin)}</span>`;
      card.appendChild(tag);
    });
  }
  vsxSave();
  return r;
};

/* Last guard before starting a run, including starts initiated through Admin. */
const FB_SKIN_BEGIN_BASE=VSX.beginRun;
VSX.beginRun=function(){
  fbEquipLegendSkin(VSX.selectedCharacter,true);
  const r=FB_SKIN_BEGIN_BASE.apply(this,arguments);
  const o=fbLegendContent(game?.characterId);
  if(game?.player&&o&&VSX.save?.meta?.skins?.[o.skin])game.player.vsxFootballSkinId=o.skin;
  return r;
};

/* Admin live-switch helpers must also switch the jersey, not only the character id. */
const FB_SKIN_ADMIN_OBSERVER=new MutationObserver(()=>{
  const card=document.getElementById("vsxAdminFootballCard");
  if(!card||card.dataset.skinBound)return;
  card.dataset.skinBound="1";
  const sel=card.querySelector("#admFootballLegend");
  const next=card.querySelector("#admFootballNext"),ult=card.querySelector("#admFootballUlt");
  if(next){const old=next.onclick;next.onclick=(e)=>{const r=old?.call(next,e);fbEquipLegendSkin(sel?.value||VSX.selectedCharacter,true);return r}}
  if(ult){const old=ult.onclick;ult.onclick=(e)=>{const id=sel?.value;fbEquipLegendSkin(id,true);const r=old?.call(ult,e);fbEquipLegendSkin(id,true);return r}}
});
const adminContent=document.getElementById("vsxAdminContent");if(adminContent)FB_SKIN_ADMIN_OBSERVER.observe(adminContent,{childList:true,subtree:true});

function drawBrazilJersey(g,r,number,classic=false){
  g.save();
  g.beginPath();g.arc(0,0,r*.96,0,Math.PI*2);g.clip();
  const gr=g.createLinearGradient(-r,-r,r,r);gr.addColorStop(0,"#fff07b");gr.addColorStop(.56,classic?"#f1d236":"#f4d72c");gr.addColorStop(1,"#d6b000");g.fillStyle=gr;g.fillRect(-r,-r,r*2,r*2);
  g.fillStyle=classic?"#1c8447":"#18874a";
  g.beginPath();g.moveTo(-r,-r*.70);g.lineTo(-r*.45,-r*.38);g.lineTo(-r*.58,r*.32);g.lineTo(-r,r*.52);g.closePath();g.fill();
  g.beginPath();g.moveTo(r,-r*.70);g.lineTo(r*.45,-r*.38);g.lineTo(r*.58,r*.32);g.lineTo(r,r*.52);g.closePath();g.fill();
  g.fillStyle="#2468a8";g.fillRect(-r,r*.48,r*2,r*.55);
  g.globalAlpha=.18;g.fillStyle="#ffffff";g.beginPath();g.arc(-r*.34,-r*.42,r*.70,0,Math.PI*2);g.fill();g.globalAlpha=1;
  g.restore();
  g.fillStyle="#0c6539";g.font=`900 ${Math.max(10,r*.82)}px Arial`;g.textAlign="center";g.textBaseline="middle";g.fillText(String(number),0,1);
}
function drawBarcaJersey(g,r,number){
  g.save();g.beginPath();g.arc(0,0,r*.96,0,Math.PI*2);g.clip();
  g.fillStyle="#172f66";g.fillRect(-r,-r,r*2,r*2);
  const w=Math.max(4,r*.42);for(let x=-r*1.1,i=0;x<r*1.2;x+=w,i++){g.fillStyle=i%2?"#9d173c":"#174a9c";g.fillRect(x,-r,w,r*2)}
  g.fillStyle="#101f49";g.fillRect(-r,r*.55,r*2,r*.5);
  g.globalAlpha=.16;g.fillStyle="#ffffff";g.beginPath();g.arc(-r*.32,-r*.40,r*.68,0,Math.PI*2);g.fill();g.globalAlpha=1;
  g.restore();
  g.fillStyle="#f2cf28";g.font=`900 ${Math.max(10,r*.78)}px Arial`;g.textAlign="center";g.textBaseline="middle";g.fillText(String(number),0,1);
}

/* Final canvas pass: preserve the circular player silhouette. Skins only
   recolor/fill the orb, add jersey numbers, gradients and lightweight FX. */
const FB_RUNTIME_JERSEY_BASE=Player.prototype.render;
const FB_RUNTIME_SKIN_UPDATE_BASE=Player.prototype.update;

function fbSkinTrailPalette(skinId,d,characterId){
  if(characterId==="ronaldo_r9"&&skinId==="r9_brazil_2002")return ["#f4d72c","#208b4c","#4ca7ff"];
  if(characterId==="pele_p10"&&skinId==="pele_brazil_1970")return ["#facc15","#18874a","#fff0a8"];
  if(characterId==="ronaldinho_r10"&&skinId==="r10_barcelona_10")return ["#174a9c","#9d173c","#f2cf28","#60a5fa"];
  return [d?.color||"#42a5ff",d?.secondary||"#9bd8ff","#ffffff"];
}
function fbPushSkinTrail(p,x,y,dirX,dirY,sprintFactor=1){
  p.vsxSkinTrail ||= [];
  const life=.26+.22*Math.min(1.25,sprintFactor);
  p.vsxSkinTrail.push({
    x,y,life,maxLife:life,
    size:p.radius*(.64+.22*Math.min(1.15,sprintFactor)),
    dirX,dirY,
    spin:Math.random()*Math.PI*2,
    drift:(Math.random()-.5)*5,
    phase:Math.random()*Math.PI*2,
    sprint:sprintFactor
  });
  if(p.vsxSkinTrail.length>26)p.vsxSkinTrail.splice(0,p.vsxSkinTrail.length-26);
}
Player.prototype.update=function(dt){
  this.vsxSkinTrail ||= [];
  for(const q of this.vsxSkinTrail)q.life-=dt;
  this.vsxSkinTrail=this.vsxSkinTrail.filter(q=>q.life>0);
  const px=this.x,py=this.y;
  FB_RUNTIME_SKIN_UPDATE_BASE.call(this,dt);
  const dx=this.x-px,dy=this.y-py,dist=Math.hypot(dx,dy);
  if(dist>.45){
    const inv=1/Math.max(dist,.0001),dirX=dx*inv,dirY=dy*inv;
    if(game)game.lastMoveDir={x:dirX,y:dirY};
    const baseStep=Math.max(.001,(this.moveSpeed||GAME_CONFIG.playerSpeed||260)*Math.max(dt,.001));
    const sprintFactor=clamp(dist/baseStep,.45,1.25);
    const count=sprintFactor>.9?2:1;
    for(let i=0;i<count;i++){
      const t=(i+1)/(count+1);
      const back=6+i*8+sprintFactor*8;
      fbPushSkinTrail(this,this.x-dx*t-dirX*back,this.y-dy*t-dirY*back,dirX,dirY,sprintFactor);
    }
  }
};

function fbDrawTrailStamp(g,node,cols){
  const life=node.life/Math.max(.001,node.maxLife),s=node.size*(.55+.45*life);
  g.save();
  g.translate(node.x,node.y);
  g.globalAlpha=.12+.22*life;
  const grad=g.createRadialGradient(0,0,0,0,0,s*1.25);
  grad.addColorStop(0,cols[0]);
  grad.addColorStop(.55,cols[1]||cols[0]);
  grad.addColorStop(1,"rgba(255,255,255,0)");
  g.fillStyle=grad;g.beginPath();g.arc(0,0,s,0,Math.PI*2);g.fill();

  g.globalAlpha=.20+.28*life;
  g.strokeStyle=cols[1]||cols[0];g.lineWidth=1.2;
  g.beginPath();g.arc(0,0,s*.88,0,Math.PI*2);g.stroke();

  for(let i=0;i<3;i++){
    const a=node.spin+i*(Math.PI*2/3)+node.phase*(1-life);
    const rr=s+4+i*2+life*4;
    g.globalAlpha=.18+.20*life;
    g.fillStyle=cols[(i+1)%cols.length]||cols[0];
    g.beginPath();g.arc(Math.cos(a)*rr-node.dirX*life*10,Math.sin(a)*rr-node.dirY*life*10,1.5+(i===0?1:0)*life,0,Math.PI*2);g.fill();
  }
  g.restore();
}
function fbDrawMinimalOrbSkin(g,p,skinId,d,characterId){
  if(!d||skinId==="default")return;
  const r=p.radius,t=game.time||0,c=d.color||"#42a5ff",c2=d.secondary||c;
  const isR9=characterId==="ronaldo_r9"&&skinId==="r9_brazil_2002",isPele=characterId==="pele_p10"&&skinId==="pele_brazil_1970",isR10=characterId==="ronaldinho_r10"&&skinId==="r10_barcelona_10";
  const cols=fbSkinTrailPalette(skinId,d,characterId);

  if(p.vsxSkinTrail?.length){
    for(const node of p.vsxSkinTrail)fbDrawTrailStamp(g,node,cols);
  }

  g.save();g.translate(p.x,p.y);

  g.shadowBlur=14;g.shadowColor=c;
  if(isR9||isPele){
    drawBrazilJersey(g,r,isR9?9:10,isPele);
  }else if(isR10){
    drawBarcaJersey(g,r,10);
  }else{
    g.save();g.beginPath();g.arc(0,0,r,0,Math.PI*2);g.clip();
    const gr=g.createLinearGradient(-r,-r,r,r);gr.addColorStop(0,c);gr.addColorStop(.62,c2);gr.addColorStop(1,c);
    g.fillStyle=gr;g.fillRect(-r,-r,r*2,r*2);
    g.globalAlpha=.16;g.fillStyle="#fff";g.beginPath();g.arc(-r*.35,-r*.42,r*.72,0,Math.PI*2);g.fill();g.restore();
  }

  const movePulse=Math.min(1,(p.movingTime||0)/.5);
  g.shadowBlur=10+movePulse*8;g.shadowColor=c;g.strokeStyle=c2;g.globalAlpha=.84;g.lineWidth=2;g.beginPath();g.arc(0,0,r+1,0,Math.PI*2);g.stroke();
  g.globalAlpha=.12+.18*movePulse;g.strokeStyle=cols[0];g.lineWidth=3;g.beginPath();g.arc(0,0,r+5+Math.sin(t*7)*.6,0,Math.PI*2);g.stroke();g.globalAlpha=1;

  if(p.flash>0){g.globalAlpha=.30;g.fillStyle="#fff";g.beginPath();g.arc(0,0,r,0,Math.PI*2);g.fill();g.globalAlpha=1}
  g.restore();
}
Player.prototype.render=function(g){
  FB_RUNTIME_JERSEY_BASE.call(this,g);
  const characterId=game?.characterId||VSX.selectedCharacter;
  const o=fbLegendContent(characterId);
  if(o&&VSX.save?.meta?.unlockedCharacters?.[characterId]&&!VSX.save.meta.skins?.[o.skin])VSX.save.meta.skins[o.skin]=true;
  if(o&&VSX.save?.meta?.skins?.[o.skin]&&VSX.save.loadout.skin!==o.skin)fbEquipLegendSkin(characterId,false);
  let skinId=VSX.save?.loadout?.skin||"default",d=SKIN_DEFINITIONS[skinId]||SKIN_DEFINITIONS.default;
  if(d?.characterOnly&&d.characterOnly!==characterId){skinId="default";d=SKIN_DEFINITIONS.default}
  this.vsxFootballSkinId=o?.skin===skinId?skinId:null;
  this.vsxSkinId=skinId;
  fbDrawMinimalOrbSkin(g,this,skinId,d,characterId);
};

/* Apply immediately on load for an already-owned legend save. */
fbEquipLegendSkin(VSX.selectedCharacter,false);
})();
