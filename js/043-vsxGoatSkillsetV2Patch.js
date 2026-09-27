(()=>{
"use strict";
const V2_IDS=new Set(["cr7_goat","m10_goat"]);
const V2_SRC=(id,tags=["football","special"])=>({id,def:{tags}});
const v2L=(en,vi)=>VSX?.lang==="vi"?vi:en;
const v2AngDiff=(a,b)=>{let d=a-b;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;return d};
const v2SegDist=(px,py,ax,ay,bx,by)=>{const vx=bx-ax,vy=by-ay,wx=px-ax,wy=py-ay,den=vx*vx+vy*vy||1,t=Math.max(0,Math.min(1,(wx*vx+wy*vy)/den)),x=ax+vx*t,y=ay+vy*t;return Math.hypot(px-x,py-y)};
const v2Alive=e=>e&&!e.dead&&!e.isCaptive;
function v2State(g){
  if(!g.vsxGoatSkillV2)g.vsxGoatSkillV2={
    cr7:{zone:null,zoneCd:1.4,zoneSeq:0,nextFinish:false,nextKind:null,secondBalls:[],secondCd:1.8,lastDashAt:-99,dashChain:0,explosiveUntil:0,clutch:false,ultZoneHits:0},
    m10:{flow:0,lastX:g.player?.x||0,lastY:g.player?.y||0,lastAng:null,stationary:0,pauseArmed:false,pausePos:null,pauseUntil:0,laPausaUntil:0,nutmegSeen:new Map(),nearMissTick:0,oneTwoCd:3.2,passes:[],visionReady:false,turns:[],ankleCd:new Map(),lastStatus:"FLOW"},
    tick:0
  };
  return g.vsxGoatSkillV2;
}
function v2Target(g,range=850){
  const p=g.player;if(!p)return null;
  const a=g.grid?.queryCircle?.(p.x,p.y,range)||[];
  return a.filter(v2Alive).sort((x,y)=>(Number(y.isBoss)-Number(x.isBoss))||(Number(y.isMiniBoss)-Number(x.isMiniBoss))||(Number(y.elite)-Number(x.elite))||y.maxHp-x.maxHp)[0]||null;
}
function v2LineDamage(g,a,b,width,damage,source,knockback=35,limit=14){
  const mx=(a.x+b.x)/2,my=(a.y+b.y)/2,rr=Math.hypot(b.x-a.x,b.y-a.y)/2+width+40;
  const list=g.grid?.queryCircle?.(mx,my,rr)||g.enemies||[];let n=0;
  for(const e of list){if(!v2Alive(e))continue;if(v2SegDist(e.x,e.y,a.x,a.y,b.x,b.y)>width+(e.size||12))continue;g.damageEnemy(e,damage,{source,canCrit:true,knockback,fromX:a.x,fromY:a.y});if(++n>=limit)break}
  g.beams?.push?.({x1:a.x,y1:a.y,x2:b.x,y2:b.y,life:.22,color:source.id.includes("m10")?"#82dcff":"#f0ce67",width:source.id.includes("vision")?6:4});
  return n;
}
function v2BallShot(g,mul=1,color="#f0ce67"){
  const p=g.player,t=v2Target(g,950);if(!p||!t)return;
  const a=Math.atan2(t.y-p.y,t.x-p.x),src=V2_SRC("cr7_second_ball",["football","projectile","special"]);
  g.projectiles.push(new Projectile({x:p.x,y:p.y,vx:Math.cos(a)*820,vy:Math.sin(a)*820,radius:10,damage:28*p.damageMultiplier*mul,life:1.65,pierce:4,color,knockback:82,explosionRadius:60,weapon:src,projectileStyle:"goldenBall"}));
}
function v2SpawnZone(g,force=false){
  const s=v2State(g).cr7;if(s.zone&&!force)return false;const t=v2Target(g,900);if(!t)return false;
  const p=g.player,seq=s.zoneSeq++%3,kind=["HEADER","BICYCLE","POWER"][seq],baseA=Math.atan2(t.y-p.y,t.x-p.x),off=[-1.0,.95,.15][seq],r=t.isBoss?150:115,a=baseA+off;
  s.zone={x:t.x+Math.cos(a)*r,y:t.y+Math.sin(a)*r,r:35,life:g.vsxGoatUlt?.id==="siuuuuuuu"?2.5:3.3,max:g.vsxGoatUlt?.id==="siuuuuuuu"?2.5:3.3,kind,targetId:t.id};
  return true;
}
function v2ConsumeZone(g){
  const s=v2State(g).cr7,z=s.zone;if(!z)return;
  s.zone=null;s.nextFinish=true;s.nextKind=z.kind;s.zoneCd=g.vsxGoatUlt?.id==="siuuuuuuu"?1.0:(s.clutch?2.2:4.2);
  if((s.explosiveUntil||0)>g.time){s.nextFinish=true;g.texts?.push(new FloatingText(g.player.x,g.player.y-44,v2L("EXPLOSIVE RUN FINISH","DỨT ĐIỂM SAU BỨT TỐC"),"#ffe17e",11))}
  if(g.vsxGoatUlt?.id==="siuuuuuuu"){
    g.vsxGoatUlt.vsxZoneHits=(g.vsxGoatUlt.vsxZoneHits||0)+1;s.ultZoneHits=g.vsxGoatUlt.vsxZoneHits;
  }
  g.texts?.push(new FloatingText(g.player.x,g.player.y-31,z.kind==="BICYCLE"?v2L("BICYCLE WINDOW!","CỬA SỔ NGẢ BÀN ĐÈN!"):z.kind==="HEADER"?v2L("HEADER WINDOW!","ĐIỂM RƠI ĐÁNH ĐẦU!"):v2L("FINISHING LANE!","KHE DỨT ĐIỂM!"),"#f0d36f",11));
}
function v2SpawnSecondBall(g,x,y){
  const s=v2State(g).cr7;if(s.secondBalls.length>=2)return;s.secondBalls.push({x,y,life:2.4,max:2.4,r:13});
}
function v2TriggerLaPausa(g,s){
  const p=g.player,old=s.pausePos||{x:p.x,y:p.y};let affected=0;
  for(const e of g.grid?.queryCircle?.(p.x,p.y,185)||[]){if(!v2Alive(e)||e.isBoss)continue;const dx=old.x-e.x,dy=old.y-e.y,d=Math.hypot(dx,dy)||1;e.x+=dx/d*14;e.y+=dy/d*14;e.applyStatus?.("slow",.48,.14,V2_SRC("m10_la_pausa",["football","control"]));if(++affected>=9)break}
  if(affected){s.flow=Math.min(100,s.flow+13);s.laPausaUntil=g.time+.75;s.lastStatus="LA PAUSA";g.texts?.push(new FloatingText(p.x,p.y-36,"LA PAUSA","#a7e8ff",12))}
}
function v2Nutmeg(g,s,moved){
  if(moved<1.4)return;const p=g.player,near=(g.grid?.queryCircle?.(p.x,p.y,68)||[]).filter(e=>v2Alive(e)&&!e.isBoss&&!e.isMiniBoss);if(near.length<2)return;
  let pair=null,best=0;
  for(let i=0;i<Math.min(near.length,8);i++)for(let j=i+1;j<Math.min(near.length,8);j++){
    const a=Math.atan2(near[i].y-p.y,near[i].x-p.x),b=Math.atan2(near[j].y-p.y,near[j].x-p.x),sep=Math.abs(v2AngDiff(a,b));if(sep>2.25&&sep>best){best=sep;pair=[near[i],near[j]]}
  }
  if(!pair)return;const key=pair.map(e=>e.id).sort().join(":");if((s.nutmegSeen.get(key)||-99)>g.time-1.6)return;s.nutmegSeen.set(key,g.time);
  for(const e of pair)e.applyStatus?.("slow",.34,.18,V2_SRC("m10_nutmeg",["football","control"]));
  s.flow=Math.min(100,s.flow+24);s.lastStatus="NUTMEG ×2";if(g.vsxGoatUlt?.id==="enkara_messi")g.vsxGoatUlt.count=(g.vsxGoatUlt.count||0)+2;
  g.texts?.push(new FloatingText(p.x,p.y-38,"NUTMEG ×2","#84e6ff",13));
}
function v2CheckAnkle(g,s,ang,prevAng){
  if(prevAng==null)return;const d=v2AngDiff(ang,prevAng);if(Math.abs(d)<.62)return;const sign=Math.sign(d);s.turns.push({t:g.time,sign});s.turns=s.turns.filter(q=>g.time-q.t<=1.4).slice(-4);if(s.turns.length<3)return;
  const q=s.turns.slice(-3);if(!(q[0].sign===q[2].sign&&q[0].sign!==q[1].sign))return;
  const p=g.player,target=(g.grid?.queryCircle?.(p.x,p.y,155)||[]).filter(e=>v2Alive(e)&&(e.elite||e.isMiniBoss||e.isBoss)).sort((a,b)=>(Number(b.isBoss)-Number(a.isBoss))||b.maxHp-a.maxHp)[0];if(!target)return;
  if((s.ankleCd.get(target.id)||-99)>g.time-4)return;s.ankleCd.set(target.id,g.time);
  const src=V2_SRC("m10_ankle_breaker",["football","control"]);if(target.isBoss)target.applyStatus?.("vulnerable",.8,.04,src);else target.applyStatus?.("slow",.9,.42,src);
  s.flow=Math.min(100,s.flow+18);s.lastStatus="ANKLE BREAKER";if(g.vsxGoatUlt?.id==="enkara_messi")g.vsxGoatUlt.count=(g.vsxGoatUlt.count||0)+2;
  g.texts?.push(new FloatingText(target.x,target.y-(target.size||12)-15,"ANKLE BREAKER","#91e8ff",12));s.turns.length=0;
}
function v2SpawnPass(g,s,vision=false){
  const p=g.player,t=v2Target(g,860);if(!p||!t)return false;
  const a=Math.atan2(t.y-p.y,t.x-p.x),far=vision?520:330,anchor={x:p.x+Math.cos(a)*far,y:p.y+Math.sin(a)*far};
  s.passes.push({t:0,start:{x:p.x,y:p.y},anchor,phase:0,vision,dead:false});if(s.passes.length>3)s.passes.shift();
  s.oneTwoCd=vision?3.2:5.5;s.lastStatus=vision?"VISION":"ONE-TWO";
  g.texts?.push(new FloatingText(p.x,p.y-38,vision?v2L("VISION THROUGH BALL","VISION — CHỌC KHE"):"ONE-TWO","#8de6ff",11));return true;
}
function v2UpdatePasses(g,s,dt){
  for(const q of s.passes){if(q.dead)continue;q.t+=dt;const src=V2_SRC(q.vision?"m10_vision_pass":"m10_one_two",["football","projectile","special"]),dmg=(q.vision?31:21)*g.player.damageMultiplier;
    if(q.phase===0&&q.t>=.32){q.phase=1;v2LineDamage(g,q.start,q.anchor,q.vision?34:28,dmg,src,q.vision?55:35,q.vision?18:12)}
    if(q.phase===1&&q.t>=.84){q.phase=2;const end={x:g.player.x,y:g.player.y};v2LineDamage(g,q.anchor,end,q.vision?38:30,dmg*(q.vision?1.15:.9),src,q.vision?62:38,q.vision?20:12);q.returnEnd=end}
    if(q.phase===2&&q.t>=1.08)q.dead=true;
  }
  s.passes=s.passes.filter(q=>!q.dead);
}

/* Preserve the existing weapons, only feed the new GOAT-specific skill windows into them. */
const V2_CR7_ATTACK=ATTACK_BEHAVIORS.goatCR7Combo;
ATTACK_BEHAVIORS.goatCR7Combo=function(w,stats){
  const g=game,s=v2State(g).cr7,kind=s.nextKind,boost=s.nextFinish||((s.explosiveUntil||0)>g.time);const target=v2Target(g,850);
  if(boost&&g.vsxGoatState?.cr7){g.vsxGoatState.cr7.perfectRun=true;s.nextFinish=false;s.nextKind=null}
  const r=V2_CR7_ATTACK.apply(this,arguments);
  if(boost&&target&&kind==="BICYCLE"){
    const src=V2_SRC("cr7_bicycle_finish",["football","physical","special"]),a=Math.atan2(target.y-g.player.y,target.x-g.player.x);
    g.projectiles.push(new Projectile({x:g.player.x,y:g.player.y,vx:Math.cos(a)*760,vy:Math.sin(a)*760,radius:12,damage:22*g.player.damageMultiplier,life:1.35,pierce:6,color:"#ffe17a",knockback:95,explosionRadius:72,weapon:src,projectileStyle:"goldenBall"}));
    g.texts?.push(new FloatingText(g.player.x,g.player.y-45,v2L("BICYCLE KICK!","NGẢ BÀN ĐÈN!"),"#ffe17a",12));
  }
  if(target&&s.secondCd<=0&&Math.random()<.58){v2SpawnSecondBall(g,target.x+(Math.random()-.5)*70,target.y+(Math.random()-.5)*70);s.secondCd=2.7}
  return r;
};

const V2_INIT_BASE=Game.prototype.vsxInitRun;
Game.prototype.vsxInitRun=function(){const r=V2_INIT_BASE.apply(this,arguments);this.vsxGoatSkillV2=null;v2State(this);return r};

/* Double-dash becomes part of CR7's Explosive Run. Existing double-dash implementation remains the authority for charges/recharge. */
const V2_DASH_BASE=Game.prototype.tryDash;
Game.prototype.tryDash=function(){
  const before=this.stats?.dashes||0,r=V2_DASH_BASE.apply(this,arguments),after=this.stats?.dashes||0;if(after<=before||this.characterId!=="cr7_goat")return r;
  const s=v2State(this).cr7,now=this.time||0;if(now-s.lastDashAt<=1.2){s.dashChain=Math.min(2,s.dashChain+1)}else s.dashChain=1;s.lastDashAt=now;
  if(s.dashChain>=2){s.explosiveUntil=now+1.8;s.nextFinish=true;s.dashChain=0;this.texts?.push(new FloatingText(this.player.x,this.player.y-42,v2L("EXPLOSIVE RUN","BỨT TỐC XÂM NHẬP"),"#f0d36f",12))}
  return r;
};

const V2_UPDATE_BASE=Game.prototype.update;
Game.prototype.update=function(dt){
  const preState=this.state,freezeGoatDash=V2_IDS.has(this.characterId)&&preState!=="PLAYING",preDashCharges=this.vsxGoatDashCharges,preDashRecharge=this.vsxGoatDashRecharge,preDashCooldown=this.dashCooldown;
  const preUlt=this.vsxGoatUlt,preUltId=preUlt?.id,preZoneHits=preUlt?.vsxZoneHits||0;
  const r=V2_UPDATE_BASE.apply(this,arguments);
  if(freezeGoatDash){this.vsxGoatDashCharges=preDashCharges;this.vsxGoatDashRecharge=preDashRecharge;this.dashCooldown=preDashCooldown;}
  if(preUltId==="siuuuuuuu"&&!this.vsxGoatUlt&&preZoneHits>=3&&this.player){
    this.effects.push(new WaveEffect(this.player.x,this.player.y,220,.62,28*this.player.damageMultiplier,110,V2_SRC("cr7_perfect_hat_trick",["ultimate","football","area"]),"#f0d36f"));
    this.texts?.push(new FloatingText(this.player.x,this.player.y-58,v2L("PERFECT HAT-TRICK","HAT-TRICK HOÀN HẢO"),"#ffe58a",16));
  }
  if(!this.player)return r;const st=v2State(this),p=this.player,scaled=dt*(typeof VSX_ADMIN!=="undefined"?(VSX_ADMIN.speed||1):1);
  if(VSX_ADMIN?.noCooldown&&V2_IDS.has(this.characterId)){this.vsxGoatDashCharges=2;this.vsxGoatDashRecharge=0;this.dashCooldown=0}
  if(this.state!=="PLAYING")return r;
  if(this.characterId==="cr7_goat"){
    const s=st.cr7;s.secondCd=Math.max(0,s.secondCd-scaled);const boss=this.boss&&!this.boss.dead?this.boss:null;s.clutch=!!(boss&&boss.hp/Math.max(1,boss.maxHp)<=.25);
    if(s.clutch&&this.vsxGoatState?.cr7)this.vsxGoatState.cr7.offBallCharge=Math.min(1,(this.vsxGoatState.cr7.offBallCharge||0)+scaled*.15);
    s.zoneCd=Math.max(0,s.zoneCd-scaled);if(s.zone){s.zone.life-=scaled;if(Math.hypot(p.x-s.zone.x,p.y-s.zone.y)<=s.zone.r+p.radius)v2ConsumeZone(this);else if(s.zone.life<=0){s.zone=null;s.zoneCd=s.clutch?1.9:3.8}}
    if(!s.zone&&s.zoneCd<=0)v2SpawnZone(this);
    for(const b of s.secondBalls)b.life-=scaled;
    for(let i=s.secondBalls.length-1;i>=0;i--){const b=s.secondBalls[i];if(Math.hypot(p.x-b.x,p.y-b.y)<=b.r+p.radius){s.secondBalls.splice(i,1);v2BallShot(this,(s.explosiveUntil||0)>this.time?1.35:1,"#ffe17a");this.texts?.push(new FloatingText(p.x,p.y-32,v2L("SECOND BALL!","SÚT BỒI!"),"#ffe17a",11))}else if(b.life<=0)s.secondBalls.splice(i,1)}
    if(this.vsxGoatUlt?.id==="siuuuuuuu"&&s.zoneCd>1.1)s.zoneCd=1.1;
  }else if(this.characterId==="m10_goat"){
    const s=st.m10,dx=p.x-s.lastX,dy=p.y-s.lastY,moved=Math.hypot(dx,dy),ang=moved>.8?Math.atan2(dy,dx):null,near=(this.grid?.queryCircle?.(p.x,p.y,185)||[]).filter(v2Alive),nearPressure=near.length>0;
    s.oneTwoCd=Math.max(0,s.oneTwoCd-scaled);s.nearMissTick-=scaled;
    if(moved<.75){s.stationary+=scaled;const pauseNeed=this.vsxGoatUlt?.id==="enkara_messi"?.24:.35;if(s.stationary>=pauseNeed&&!s.pauseArmed&&nearPressure){s.pauseArmed=true;s.pauseUntil=this.time+1.0;s.pausePos={x:p.x,y:p.y}}}
    else{
      const pauseTurn=this.vsxGoatUlt?.id==="enkara_messi"?.55:.72;if(s.pauseArmed&&this.time<=s.pauseUntil&&ang!=null&&s.lastAng!=null&&Math.abs(v2AngDiff(ang,s.lastAng))>pauseTurn)v2TriggerLaPausa(this,s);
      s.pauseArmed=false;s.stationary=0;
      if(ang!=null&&s.lastAng!=null&&nearPressure){const turn=Math.abs(v2AngDiff(ang,s.lastAng));if(turn>.48)s.flow=Math.min(100,s.flow+Math.min(12,4+turn*4));v2CheckAnkle(this,s,ang,s.lastAng)}
      if(ang!=null)s.lastAng=ang;
    }
    v2Nutmeg(this,s,moved);
    if(s.nearMissTick<=0){s.nearMissTick=.12;let checked=0;for(const q of this.enemyProjectiles||[]){if(q.dead||++checked>180)continue;const d=Math.hypot(q.x-p.x,q.y-p.y);if(d>p.radius+7&&d<58&&(q.vsxM10NearMissAt||-99)<this.time-.7){q.vsxM10NearMissAt=this.time;s.flow=Math.min(100,s.flow+4);s.lastStatus=v2L("NEAR MISS","NÉ SÁT")}}}
    if(this.vsxGoatUlt?.id!=="enkara_messi")s.flow=Math.max(0,s.flow-scaled*(nearPressure?1.2:3.0));
    if(s.flow>=99.5)s.visionReady=true;
    if(s.visionReady&&ang!=null&&s.lastVisionAng!=null&&Math.abs(v2AngDiff(ang,s.lastVisionAng))>1.18){if(v2SpawnPass(this,s,true)){s.visionReady=false;s.flow=35}}
    if(ang!=null)s.lastVisionAng=ang;
    if(s.oneTwoCd<=0&&s.flow>=30&&nearPressure)v2SpawnPass(this,s,false);
    v2UpdatePasses(this,s,scaled);s.lastX=p.x;s.lastY=p.y;
    for(const [k,t] of s.nutmegSeen)if(this.time-t>4)s.nutmegSeen.delete(k);for(const [k,t] of s.ankleCd)if(this.time-t>7)s.ankleCd.delete(k);
  }
  return r;
};

const V2_RENDER_BASE=Game.prototype.render;
Game.prototype.render=function(){const r=V2_RENDER_BASE.apply(this,arguments);if(this.state!=="PLAYING"||!this.player||!V2_IDS.has(this.characterId))return r;const st=v2State(this);ctx.save();ctx.translate(-this.camera.x,-this.camera.y);
  if(this.characterId==="cr7_goat"){
    const s=st.cr7,z=s.zone;if(z){const pulse=.75+.25*Math.sin((this.time||0)*8),c=z.kind==="BICYCLE"?"#f5a45e":z.kind==="HEADER"?"#ffe17a":"#f0c96a";ctx.globalAlpha=.18*pulse;ctx.fillStyle=c;ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,Math.PI*2);ctx.fill();ctx.globalAlpha=.85;ctx.strokeStyle=c;ctx.lineWidth=3;ctx.setLineDash([8,7]);ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=c;ctx.font="900 8px Arial";ctx.textAlign="center";ctx.fillText(z.kind,z.x,z.y-z.r-8)}
    for(const b of s.secondBalls){ctx.globalAlpha=Math.max(.25,b.life/b.max);ctx.fillStyle="#fff7c2";ctx.shadowBlur=12;ctx.shadowColor="#f0c96a";ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle="#d7b34c";ctx.lineWidth=2;ctx.beginPath();ctx.arc(b.x,b.y,b.r+5,0,Math.PI*2);ctx.stroke()}
  }else{
    const s=st.m10;for(const q of s.passes){const tt=q.t<.84?Math.min(1,q.t/.84):Math.min(1,(q.t-.84)/.24),from=q.t<.84?q.start:q.anchor,to=q.t<.84?q.anchor:(q.returnEnd||{x:this.player.x,y:this.player.y}),x=from.x+(to.x-from.x)*tt,y=from.y+(to.y-from.y)*tt;ctx.globalAlpha=.9;ctx.fillStyle=q.vision?"#43c479":"#f8fdff";ctx.shadowBlur=12;ctx.shadowColor="#76d9ff";ctx.beginPath();ctx.arc(x,y,q.vision?7:5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0}
  }
  ctx.restore();return r};

function v2EnsureHud(){const root=document.getElementById("vsxActionHud");if(!root)return null;let el=document.getElementById("vsxGoatSkillHud");if(!el){el=document.createElement("div");el.id="vsxGoatSkillHud";el.innerHTML='<div class="head"><span id="vsxGoatSkillTitle"></span><b id="vsxGoatSkillValue"></b></div><div class="meta" id="vsxGoatSkillMeta"></div><div class="bar"><i id="vsxGoatSkillFill"></i></div>';root.appendChild(el)}return el}
function v2RenderHud(g=game){const el=v2EnsureHud();if(!el)return;if(!g?.player||g.state!=="PLAYING"||!V2_IDS.has(g.characterId)){el.classList.remove("active","messi");return}const st=v2State(g),title=el.querySelector("#vsxGoatSkillTitle"),val=el.querySelector("#vsxGoatSkillValue"),meta=el.querySelector("#vsxGoatSkillMeta"),fill=el.querySelector("#vsxGoatSkillFill");el.classList.add("active");
  if(g.characterId==="cr7_goat"){el.classList.remove("messi");const s=st.cr7,off=Math.round((g.vsxGoatState?.cr7?.offBallCharge||0)*100);title.textContent="FINISHER INSTINCT";val.textContent=`${off}%`;meta.innerHTML=`<span>${s.zone?v2L("FINISH ZONE ACTIVE","ĐIỂM DỨT ĐIỂM"):(s.zoneCd<=0?v2L("ZONE READY","ZONE SẴN SÀNG"):v2L("ZONE","ZONE")+" "+s.zoneCd.toFixed(1)+"s")}</span><span>${(s.explosiveUntil||0)>g.time?v2L("EXPLOSIVE RUN","BỨT TỐC"):(s.clutch?"CLUTCH 90+":v2L("SECOND BALL","SÚT BỒI"))}</span>`;fill.style.width=`${off}%`}
  else{el.classList.add("messi");const s=st.m10;title.textContent="DRIBBLE FLOW";val.textContent=`${Math.round(s.flow)}%`;meta.innerHTML=`<span>${s.visionReady?"VISION READY":s.lastStatus}</span><span>${s.laPausaUntil>g.time?"LA PAUSA":v2L("ONE-TWO","BẬT TƯỜNG")}</span>`;fill.style.width=`${Math.round(s.flow)}%`}
}
const V2_HUD_BASE=Game.prototype.updateHUD;Game.prototype.updateHUD=function(){const r=V2_HUD_BASE.apply(this,arguments);v2RenderHud(this);const u=this.vsxGoatUlt,uv=document.querySelector("#vsxGoatUltMeta #vsxGoatUltMetaValue");if(u&&uv){if(u.id==="siuuuuuuu")uv.textContent=`${Math.min(3,u.phase||0)}/3 · ZONE ${Math.min(3,u.vsxZoneHits||0)}/3`;else if(u.id==="enkara_messi"){const flow=Math.round(v2State(this).m10.flow);uv.textContent=`${String(u.count||0).padStart(2,"0")} · FLOW ${flow>=99?"MAX":flow+"%"}`}}return r};

function v2DecorateSetup(){for(const card of document.querySelectorAll("#vsxCharacterGrid .vsxPick")){const id=card.dataset.characterId;if(!V2_IDS.has(id)||card.querySelector(".vsxGoatPickSkillset"))continue;const d=document.createElement("div");d.className="vsxGoatPickSkillset "+(id==="m10_goat"?"messi":"");d.innerHTML=id==="cr7_goat"?`<b>FINISHER INSTINCT</b> · ${v2L("Finishing Zones · Aerial Dominance · Second Ball · Explosive Run · Clutch 90+","Điểm dứt điểm · Không chiến · Sút bồi · Bứt tốc xâm nhập · Clutch 90+")}`:`<b>DRIBBLE FLOW</b> · ${v2L("La Pausa · Nutmeg Gate · One-Two · Vision · Ankle Breaker","La Pausa · Xâu kim · Bật tường · Vision · Ankle Breaker")}`;card.appendChild(d)}}
function v2DecorateCollection(){for(const card of document.querySelectorAll("#vsxCodexList .vsxCharacterCodexCard")){const id=card.dataset.codexId;if(!V2_IDS.has(id)||card.querySelector(".vsxGoatSkillsetInfo"))continue;const box=document.createElement("div");box.className="vsxGoatSkillsetInfo "+(id==="m10_goat"?"messi":"");box.innerHTML=id==="cr7_goat"?`<b>GOAT SKILLSET · FINISHER INSTINCT</b><br>${v2L("Finishing Zones reward positioning. Double Dash can trigger Explosive Run. Crosses gain Aerial finish windows, missed kills can leave a Second Ball, and Bosses below 25% HP activate Clutch 90+.","Điểm Dứt Điểm thưởng cho chạy chỗ đúng vị trí. Dash kép có thể kích hoạt Bứt Tốc Xâm Nhập. Tạt bóng mở cửa sổ không chiến, pha chưa kết liễu có thể để lại bóng hai và Boss dưới 25% HP kích hoạt Clutch 90+.")}`:`<b>GOAT SKILLSET · DRIBBLE FLOW</b><br>${v2L("Sharp turns, near-misses and Nutmegs build Flow. La Pausa fools nearby pursuers, One-Two creates return-pass angles, full Flow arms Vision, and repeated left-right cuts can trigger Ankle Breaker.","Đổi hướng gắt, né sát và xâu kim sẽ tích Flow. La Pausa đánh lừa kẻ bám đuổi, Bật Tường tạo góc chuyền trả, Flow đầy mở Vision và chuỗi đảo trái-phải có thể kích hoạt Ankle Breaker.")}`;(card.querySelector(".vsxCharacterCodexDetail")||card).appendChild(box)}}
const V2_SETUP_BASE=VSX.renderSetup;VSX.renderSetup=function(){const r=V2_SETUP_BASE.apply(this,arguments);v2DecorateSetup();window.VSX_CHARACTER_PICK_FILTER?.apply?.();return r};
const V2_CODEX_BASE=VSX.renderCodex;VSX.renderCodex=function(cat){const r=V2_CODEX_BASE.call(this,cat);if(cat==="characters")v2DecorateCollection();return r};

function v2AugmentAdmin(){const c=document.getElementById("vsxAdminGoatCard");if(!c||document.getElementById("vsxAdminGoatSkillTools"))return;const tools=document.createElement("div");tools.id="vsxAdminGoatSkillTools";tools.innerHTML=`<button id="admGoatSkillZone">${v2L("SPAWN FINISH ZONE","TẠO ĐIỂM DỨT ĐIỂM")}</button><button id="admGoatSkillFlow">${v2L("MAX M10 FLOW","MAX FLOW M10")}</button><button id="admGoatSkillReset">${v2L("RESET SKILL STATE","RESET SKILLSET")}</button>`;c.appendChild(tools);tools.querySelector("#admGoatSkillZone").onclick=()=>{if(!game.player)return;const sel=c.querySelector("#admGoatSelect")?.value;if(sel!=="cr7_goat")return VSX.announce("ADMIN",v2L("SELECT CR7 FIRST","CHỌN CR7 TRƯỚC"),"#f0c96a");game.characterId="cr7_goat";v2SpawnZone(game,true)};tools.querySelector("#admGoatSkillFlow").onclick=()=>{if(!game.player)return;const sel=c.querySelector("#admGoatSelect")?.value;if(sel!=="m10_goat")return VSX.announce("ADMIN",v2L("SELECT M10 FIRST","CHỌN M10 TRƯỚC"),"#8fe3ff");game.characterId="m10_goat";const s=v2State(game).m10;s.flow=100;s.visionReady=true;game.updateHUD?.(true)};tools.querySelector("#admGoatSkillReset").onclick=()=>{game.vsxGoatSkillV2=null;v2State(game);game.updateHUD?.(true)}}
const v2AdminRoot=document.getElementById("vsxAdminContent");if(v2AdminRoot)new MutationObserver(()=>queueMicrotask(v2AugmentAdmin)).observe(v2AdminRoot,{childList:true,subtree:true});queueMicrotask(()=>{v2EnsureHud();v2DecorateSetup();v2AugmentAdmin()});

/* Richer player-facing descriptions without removing any existing speed/double-dash mechanics. */
if(CHARACTER_DEFINITIONS.cr7_goat)CHARACTER_DEFINITIONS.cr7_goat.desc={en:"LEGENDARY — 1.5× base speed + Double Dash. Finisher Instinct creates scoring lanes, aerial windows, second-ball chances and a Clutch 90+ phase against low-HP bosses.",vi:"LEGENDARY — Tốc độ 1.5× + Dash kép. Finisher Instinct tạo khe dứt điểm, cửa sổ không chiến, cơ hội sút bồi và Clutch 90+ khi Boss còn ít máu."};
if(CHARACTER_DEFINITIONS.m10_goat)CHARACTER_DEFINITIONS.m10_goat.desc={en:"LEGENDARY — 1.5× base speed + Double Dash. Dribble Flow rewards turns, Nutmegs and near-misses with La Pausa, One-Two, Vision and Ankle Breaker playmaking.",vi:"LEGENDARY — Tốc độ 1.5× + Dash kép. Dribble Flow thưởng cho đổi hướng, xâu kim và né sát bằng La Pausa, Bật Tường, Vision và Ankle Breaker."};
window.VSX_GOAT_SKILLSET_V2={version:"2.0",ids:[...V2_IDS],state:()=>game?.vsxGoatSkillV2||null,selfTest(){return{cr7Move:CHARACTER_DEFINITIONS.cr7_goat?.mods?.move,m10Move:CHARACTER_DEFINITIONS.m10_goat?.mods?.move,doubleDash:V2_IDS.has(game?.characterId)?{charges:game.vsxGoatDashCharges,max:game.vsxGoatDashMax}:null,skillHud:!!document.getElementById("vsxGoatSkillHud"),setupInfo:document.querySelectorAll("#vsxCharacterGrid .vsxGoatPickSkillset").length,collectionInfo:document.querySelectorAll("#vsxCodexList .vsxGoatSkillsetInfo").length,ultRegistryMissing:window.VSX_ULT_DURATION_API?.missing?.().filter(x=>["siuuuuuuu","enkara_messi"].includes(x.ultimate)).length||0}}};
})();
