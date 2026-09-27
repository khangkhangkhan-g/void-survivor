(()=>{
"use strict";
const ID="n10_neymar", SKIN="n10_brazil_10", ULT="the_last_samba", WEAPON="samba_streetball";
const L=(en,vi)=>VSX.lang==="vi"?vi:en;
const isN10=g=>g?.characterId===ID;
const st=g=>g?.vsxN10||null;

/* Sync the standard registries so Collection / Starting Pick / Ultimate Duration all read the same source. */
if(typeof ULT_INFO!=="undefined")ULT_INFO[ULT]={
  name:{en:"THE LAST SAMBA",vi:"THE LAST SAMBA · VŨ ĐIỆU SAMBA CUỐI CÙNG"},
  how:{
    en:"For 11s Samba Flow is locked at 100 and tricks cost no Flow. Enemies beaten by different tricks become DANCED nodes. At the finale the ball chains through those nodes before a Trivela Finish; trick diversity upgrades the finish.",
    vi:"Trong 11 giây, Nhịp Samba khóa ở 100 và mọi trick đều miễn phí. Kẻ địch bị Neymar vượt qua bằng các trick khác nhau sẽ trở thành node DANCED. Khi hết thời gian, bóng chuyền xuyên chuỗi node rồi kết bằng Trivela Finish; càng đa dạng trick, pha kết thúc càng đẹp và mạnh hơn."
  },duration:11
};
window.VSX_ULT_DURATION_API?.register?.(ULT,{seconds:11});
if(typeof VSX_SKIN_EFFECT_NAMES!=="undefined")VSX_SKIN_EFFECT_NAMES.n10Samba={en:"Brazil No.10 samba aura",vi:"Hào quang Samba Brazil Số 10"};

function skinOwned(){return !!VSX.save?.meta?.skins?.[SKIN]}
function equipSkinFor(id,save=true){
  if(!VSX.save?.loadout)return false;
  const current=SKIN_DEFINITIONS[VSX.save.loadout.skin||"default"];
  if(id===ID&&skinOwned()){
    if(VSX.save.loadout.skin!==SKIN){VSX.save.loadout.skin=SKIN;if(save)vsxSave?.()}
    return true;
  }
  if(current?.characterOnly===ID&&id!==ID){VSX.save.loadout.skin="default";if(save)vsxSave?.()}
  return false;
}

/* Match GOAT behavior: selecting/starting N10 automatically applies his owned signature skin. */
const SETUP_BASE=VSX.renderSetup;
VSX.renderSetup=function(){equipSkinFor(VSX.selectedCharacter,false);const r=SETUP_BASE.apply(this,arguments);return r};
const BEGIN_BASE=VSX.beginRun;
VSX.beginRun=function(){equipSkinFor(VSX.selectedCharacter,true);const r=BEGIN_BASE.apply(this,arguments);if(isN10(game))equipSkinFor(ID,true);return r};

/* The old N10 useUltimate wrapper sits after the duration system, so manually reconnect the cast to that system. */
const MARVEL_PROJECTILE_RENDER_BASE=Projectile.prototype.render;
Projectile.prototype.render=function(g){if(this.vsxMjolnir){g.save();g.translate(this.x,this.y);g.rotate(Math.atan2(this.vy||0,this.vx||1)+(this.vsxMjolnirSpin||0)+game.time*12);const s=(this.radius||8)/8;g.fillStyle='#c8e9ff';g.strokeStyle='#6fbdf5';g.lineWidth=2;g.fillRect(-2*s,-9*s,4*s,13*s);g.fillRect(-8*s,-11*s,16*s,5*s);g.strokeRect(-2*s,-9*s,4*s,13*s);g.strokeRect(-8*s,-11*s,16*s,5*s);g.restore();return}if(this.vsxCapShield){g.save();g.translate(this.x,this.y);g.rotate(game.time*8);const r=Math.max(7,this.radius||7);g.lineWidth=2.2;g.strokeStyle='#eef7ff';for(const mult of [1,.7,.42]){g.beginPath();g.arc(0,0,r*mult,0,Math.PI*2);g.stroke()}g.fillStyle='#4f81d9';g.beginPath();g.arc(0,0,r*.28,0,Math.PI*2);g.fill();g.restore();return}return MARVEL_PROJECTILE_RENDER_BASE.call(this,g)};

const ULT_BASE=Game.prototype.useUltimate;
Game.prototype.useUltimate=function(){
  const before=this.stats?.ultimates||0, id=CHARACTER_DEFINITIONS[this.characterId]?.ultimate;
  const r=ULT_BASE.apply(this,arguments), after=this.stats?.ultimates||0;
  if(id===ULT&&after>before&&st(this)?.ult){
    this.vsxUltDurationTimer={id:ULT,mode:"timed",total:11,remaining:11,bound:null,synthetic:true};
    this.vsxN10Ult=st(this).ult;
    this.updateHUD?.(true);
  }
  return r;
};

function ensureGoatSkillHud(){
  const root=document.getElementById("vsxActionHud");if(!root)return null;
  let el=document.getElementById("vsxGoatSkillHud");
  if(!el){el=document.createElement("div");el.id="vsxGoatSkillHud";el.innerHTML='<div class="head"><span id="vsxGoatSkillTitle"></span><b id="vsxGoatSkillValue"></b></div><div class="meta" id="vsxGoatSkillMeta"></div><div class="bar"><i id="vsxGoatSkillFill"></i></div>';root.appendChild(el)}
  return el;
}
function ensureGoatUltMeta(){
  const ability=document.getElementById("vsxUltLabel")?.closest(".vsxAbility");if(!ability)return null;
  let el=document.getElementById("vsxGoatUltMeta");
  if(!el){el=document.createElement("div");el.id="vsxGoatUltMeta";el.innerHTML='<span id="vsxGoatUltMetaLabel"></span><b id="vsxGoatUltMetaValue"></b>';ability.appendChild(el)}
  return el;
}
function comboName(c){return c>=7?"BONITO":c>=5?"JOGA":c>=3?"SAMBA":"—"}
function renderHud(g){
  const skill=ensureGoatSkillHud(), old=document.getElementById("vsxN10Hud");if(old)old.style.display="none";
  if(!skill)return;
  if(!isN10(g)){
    skill.classList.remove("n10");
    const um=document.getElementById("vsxGoatUltMeta");um?.classList.remove("n10");
    return;
  }
  const s=st(g);if(!s)return;
  skill.classList.add("active","n10");skill.classList.remove("messi");
  skill.querySelector("#vsxGoatSkillTitle").textContent="SAMBA FLOW";
  skill.querySelector("#vsxGoatSkillValue").textContent=`${Math.round(s.flow||0)}%`;
  const status=s.freeKick?L("FREE KICK READY","ĐÁ PHẠT SẴN SÀNG"):s.showboat?L("SHOWBOAT LIVE","SHOWBOAT SÁNG ĐÈN"):L("BAIT · TRICK · ESCAPE","NHỬ · TRICK · THOÁT");
  skill.querySelector("#vsxGoatSkillMeta").innerHTML=`<span>COMBO ×${s.combo||0} · ${comboName(s.combo||0)}</span><span>${status}</span>`;
  skill.querySelector("#vsxGoatSkillFill").style.width=`${Math.max(0,Math.min(100,s.flow||0))}%`;
  const charges=Math.max(0,s.dashCharges??2),max=s.dashMax||2,dtxt=document.getElementById("vsxDashText"),dfill=document.getElementById("vsxDashFill");
  if(dtxt){const clean=(dtxt.textContent||"").replace(/\s*•\s*\d+\/\d+$/,'');dtxt.textContent=`${clean} • ${charges}/${max}`}
  if(dfill){const pct=charges>=max?100:charges>0?55:Math.max(0,100*(1-(s.dashRecharge||0)/4.5));dfill.style.width=`${pct}%`}
  const meta=ensureGoatUltMeta();if(meta){meta.classList.add("n10");const u=s.ult;if(u){meta.style.display="flex";meta.querySelector("#vsxGoatUltMetaLabel").textContent="THE LAST SAMBA";meta.querySelector("#vsxGoatUltMetaValue").textContent=`DANCED ${String(u.dancedCount||0).padStart(2,"0")} · STYLE ×${u.types?.size||0}`}else meta.style.display="none"}
}
const HUD_BASE=Game.prototype.updateHUD;
Game.prototype.updateHUD=function(){const r=HUD_BASE.apply(this,arguments);renderHud(this);return r};

/* Active-Ult visual feedback: no free damage, just a readable game-native samba pulse so the cast never feels dead. */
const UPDATE_BASE=Game.prototype.update;
Game.prototype.update=function(dt){
  const r=UPDATE_BASE.apply(this,arguments);if(!isN10(this))return r;
  const s=st(this);if(!s)return r;
  if(typeof VSX_ADMIN!=="undefined"&&VSX_ADMIN?.noCooldown){
    s.dashMax=2;s.dashCharges=2;s.dashRecharge=0;this.dashCooldown=0;
    if(!s.ult)this.ultimateCharge=100;
  }
  if(s.ult){
    s._repairPulse=(s._repairPulse||0)-dt;
    if(s._repairPulse<=0){s._repairPulse=.72;this.effects?.push?.(new WaveEffect(this.player.x,this.player.y,78,.34,0,0,{id:"n10_samba_pulse",def:{tags:["ultimate","football"]}},"#f4d94b"));this.spark?.(this.player.x,this.player.y,"#72d8ff",3)}
    if((s.ult.types?.size||0)>=4&&!s.ult._completeShown){s.ult._completeShown=true;this.texts?.push?.(new FloatingText(this.player.x,this.player.y-58,"SAMBA COMPLETE","#8fe4ff",15))}
  }
  return r;
};

/* Stronger run-state repair: if the bundle skin is owned, the current run cannot silently fall back to default. */
const INIT_BASE=Game.prototype.vsxInitRun;
Game.prototype.vsxInitRun=function(){const r=INIT_BASE.apply(this,arguments);if(this.characterId===ID&&skinOwned()){VSX.save.loadout.skin=SKIN;vsxSave?.()}return r};

/* Admin: add the same kind of character-specific QA controls used by GOAT Skillset V2. */
function augmentAdmin(){
  const card=document.getElementById("vsxAdminN10Card");if(!card||document.getElementById("vsxAdminN10SkillTools"))return;
  const box=document.createElement("div");box.id="vsxAdminN10SkillTools";box.className="row";box.innerHTML=`<button id="admN10Flow">${L("MAX SAMBA FLOW","MAX NHỊP SAMBA")}</button><button id="admN10Showboat">${L("SPAWN SHOWBOAT","TẠO SHOWBOAT")}</button><button id="admN10FreeKick">${L("SPAWN FREE KICK","TẠO ĐIỂM ĐÁ PHẠT")}</button><button id="admN10Reset">${L("RESET N10 STATE","RESET N10")}</button>`;card.appendChild(box);
  box.querySelector("#admN10Flow").onclick=()=>{if(!game.player)return;game.characterId=ID;const s=game.vsxN10||(game.vsxN10={});s.flow=100;s.combo=Math.max(s.combo||0,3);game.updateHUD?.(true)};
  box.querySelector("#admN10Showboat").onclick=()=>{if(!game.player)return;game.characterId=ID;const s=game.vsxN10||(game.vsxN10={});s.showboat={x:game.player.x+70,y:game.player.y,r:58,life:4,claimed:false};game.updateHUD?.(true)};
  box.querySelector("#admN10FreeKick").onclick=()=>{if(!game.player)return;game.characterId=ID;const s=game.vsxN10||(game.vsxN10={});s.freeKick={x:game.player.x+34,y:game.player.y,life:4,max:4};game.updateHUD?.(true)};
  box.querySelector("#admN10Reset").onclick=()=>{if(!game.player)return;game.vsxN10=null;game.vsxN10Ult=null;game.ultimateActive=false;game.ultimateBuff=null;game.ultimateBuffTimer=0;game.vsxUltDurationTimer=null;game.updateHUD?.(true)};
}
const adminRoot=document.getElementById("vsxAdminContent");if(adminRoot)new MutationObserver(()=>queueMicrotask(augmentAdmin)).observe(adminRoot,{childList:true,subtree:true});
queueMicrotask(()=>{equipSkinFor(VSX.selectedCharacter,false);renderHud(game);augmentAdmin()});

window.VSX_N10_REPAIR={version:"2.1",selfTest(){const s=st(game);return{registered:window.VSX_ULT_DURATION_API?.get?.(ULT)?.seconds===11,skinOwned:skinOwned(),skinEquipped:VSX.save?.loadout?.skin===SKIN,hudShared:!!document.getElementById("vsxGoatSkillHud"),oldHudHidden:getComputedStyle(document.getElementById("vsxN10Hud")||document.body).display==="none",ultActive:!!s?.ult,durationTimer:game?.vsxUltDurationTimer?.id===ULT,dash:s?`${s.dashCharges??0}/${s.dashMax??2}`:null}}};
})();
