(function(){
"use strict";

const GP_PACKAGE_ID="goat_rivals_cr7_m10";
const GP_IDS=["cr7_goat","m10_goat"];
const GP_CONTENT={
  cr7_goat:{cost:18000,weapon:"cr7_siu_striker",skin:"cr7_portugal_7",number:"7",color:"#d23346",jersey1:"#b51f31",jersey2:"#d9b24c",ultimate:"siuuuuuuu",ultimateName:{en:"SIUUUUUUU!!",vi:"SIUUUUUUU!!"},subtitle:{en:"POWER FINISHER",vi:"CỖ MÁY DỨT ĐIỂM"}},
  m10_goat:{cost:18000,weapon:"m10_enkara_touch",skin:"m10_argentina_10",number:"10",color:"#76cfff",jersey1:"#eef9ff",jersey2:"#65c9ff",ultimate:"enkara_messi",ultimateName:{en:"ENKARA ENKARA ENKARA MESSI!!",vi:"ENKARA ENKARA ENKARA MESSI!!"},subtitle:{en:"DRIBBLE GENIUS",vi:"THIÊN TÀI RÊ BÓNG"}}
};
const GP_BUNDLE_BASE_COST=32000;
const GP_ULT={
  siuuuuuuu:{name:{en:"SIUUUUUUU!!",vi:"SIUUUUUUU!!"},how:{en:"For 9s, CR7 cycles three signature finishes — burst run, header impact and knuckleball strike — while every sequence prioritizes the most dangerous cluster or boss.",vi:"Trong 9 giây, CR7 liên tục tung ba pha kết thúc đặc trưng: bứt tốc xâm nhập, bật cao đánh đầu và knuckleball sấm sét. Mỗi pha đều ưu tiên cụm địch hoặc boss nguy hiểm nhất rồi khép lại bằng cú SIUUUU đầy uy lực."}},
  enkara_messi:{name:{en:"ENKARA ENKARA ENKARA MESSI!!",vi:"ENKARA ENKARA ENKARA MESSI!!"},how:{en:"For 10s, Messi dribbles through danger. Enemies passed at close range are counted as beaten men, then the total is converted into one final left-foot curler.",vi:"Trong 10 giây, Messi rê bóng xuyên biển địch. Mỗi mục tiêu lướt sát được tính là một pha qua người; hết thời gian, tổng số pha qua người được đổi thành một cú cứa lòng chân trái kết màn."}}
};

const L=(en,vi)=>VSX.lang==="vi"?vi:en;
const clamp01=v=>Math.max(0,Math.min(1,v));
const gpBezier=(p0,p1,p2,p3,t)=>{const q=1-t;return{x:q*q*q*p0.x+3*q*q*t*p1.x+3*q*t*t*p2.x+t*t*t*p3.x,y:q*q*q*p0.y+3*q*q*t*p1.y+3*q*t*t*p2.y+t*t*t*p3.y}};
const angDiff=(a,b)=>{let d=a-b;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;return Math.abs(d)};

Object.assign(I18N.en,{goatRivals:"GOAT RIVALS",goatRivalsSub:"CR7 × M10"});
Object.assign(I18N.vi,{goatRivals:"GOAT RIVALS",goatRivalsSub:"CR7 × M10"});

Object.assign(CHARACTER_DEFINITIONS,{
  cr7_goat:{name:{en:"Cristiano Ronaldo — CR7",vi:"Cristiano Ronaldo — CR7"},desc:{en:"LEGENDARY — A ruthless finisher who is rewarded for off-ball runs, timed service and explosive final touches.",vi:"LEGENDARY — Sát thủ vòng cấm sống nhờ chạy chỗ, chọn nhịp nhận bóng và tung ra những cú kết thúc bùng nổ."},weapon:"cr7_siu_striker",mods:{move:1.52,damage:1.06,crit:.05,knockback:1.08},ultimate:"siuuuuuuu",rarity:"legendary",shopOnly:true,packageId:GP_PACKAGE_ID},
  m10_goat:{name:{en:"Lionel Messi — M10",vi:"Lionel Messi — M10"},desc:{en:"LEGENDARY — Keeps the ball glued to his feet, bends defenders out of shape and turns close control into devastating finesse.",vi:"LEGENDARY — Giữ bóng như dính vào chân, xé đội hình bằng rê dắt lắt léo rồi kết liễu bằng kỹ thuật cứa lòng quá gắt."},weapon:"m10_enkara_touch",mods:{move:1.48,dodge:.05,crit:.06,attackSpeed:1.05},ultimate:"enkara_messi",rarity:"legendary",shopOnly:true,packageId:GP_PACKAGE_ID}
});
Object.assign(WEAPON_DEFINITIONS,{
  cr7_siu_striker:{name:"SIUU Striker",desc:"Alternates service, elevation and power finishing. Strong off-ball movement charges a deadlier final contact.",rarity:"epic",shopLocked:true,tags:["football","physical","burst"],behavior:"goatCR7Combo",damage:34,cooldown:1.28,range:690,size:11,knockback:70,maxLevel:5,levels:lv({}, {damageMul:1.18},{cooldownMul:.88},{rangeMul:1.14},{special:"perfectRun"})},
  m10_enkara_touch:{name:"Enkara Touch",desc:"Close-control football that thrives on direction changes. Weaving through danger stores flair and releases curving finishers.",rarity:"epic",shopLocked:true,tags:["football","control","arcane"],behavior:"goatM10Control",damage:29,cooldown:.92,range:700,size:9,knockback:34,maxLevel:5,levels:lv({}, {damageMul:1.18},{cooldownMul:.88},{rangeMul:1.12},{special:"slalomBurst"})}
});
if(typeof VI_WEAPON!=="undefined")Object.assign(VI_WEAPON,{
  cr7_siu_striker:["SIUU Striker","Tạt vào, băng cắt, bật nhảy và dứt điểm. Những pha chạy chỗ đẹp sẽ cường hóa cú chạm bóng tiếp theo."],
  m10_enkara_touch:["Enkara Touch","Giữ bóng sát chân, lách qua khe hẹp và bẻ cong quỹ đạo dứt điểm. Đổi hướng mượt sẽ tích nhịp bùng nổ."]
});
Object.assign(SKIN_DEFINITIONS,{
  cr7_portugal_7:{name:{en:"CR7 — Portugal No. 7",vi:"CR7 — Bồ Đào Nha Số 7"},currency:"score",cost:0,color:"#bb2033",secondary:"#d9b24c",effect:"goatPortugal",tier:"legendary",packageExclusive:true,packageId:GP_PACKAGE_ID,characterOnly:"cr7_goat"},
  m10_argentina_10:{name:{en:"M10 — Argentina No. 10",vi:"M10 — Argentina Số 10"},currency:"score",cost:0,color:"#f4fbff",secondary:"#43c479",effect:"goatArgentina",tier:"legendary",packageExclusive:true,packageId:GP_PACKAGE_ID,characterOnly:"m10_goat"}
});
if(typeof VSX_SKIN_EFFECT_NAMES!=="undefined")Object.assign(VSX_SKIN_EFFECT_NAMES,{
  goatPortugal:{en:"Portugal legend aura",vi:"Hào quang huyền thoại Bồ Đào Nha"},
  goatArgentina:{en:"Argentina maestro aura",vi:"Hào quang thiên tài Argentina"}
});
if(typeof ULT_INFO!=="undefined")Object.assign(ULT_INFO,{
  siuuuuuuu:{name:GP_ULT.siuuuuuuu.name,how:GP_ULT.siuuuuuuu.how,duration:9},
  enkara_messi:{name:GP_ULT.enkara_messi.name,how:GP_ULT.enkara_messi.how,duration:10}
});
window.VSX_ULT_DURATION_API?.register?.("siuuuuuuu",{seconds:9});
window.VSX_ULT_DURATION_API?.register?.("enkara_messi",{seconds:10});

const gpSave=()=>{if(typeof vsxSave==="function")vsxSave()};
const gpDiscover=(cat,id)=>{if(typeof vsxDiscover==="function")vsxDiscover(cat,id)};
const gpRenderArmory=()=>{if(typeof renderArmory==="function")renderArmory()};
function gpEnsureSave(){
  if(typeof ensureArmorySave==="function")ensureArmorySave();
  VSX.save.meta ||= {};
  VSX.save.meta.unlockedCharacters ||= {};
  VSX.save.meta.unlockedWeapons ||= {};
  VSX.save.meta.skins ||= {};
  VSX.save.meta.packages ||= {};
  VSX.save.meta.packageEffects ||= {};
  VSX.save.meta.adminOwnedWeapons ||= {};
  VSX.save.loadout ||= {skin:"default"};
}
function gpOwned(id){return !!VSX.save.meta.unlockedCharacters?.[id]}
function gpPackageOwned(){return GP_IDS.every(gpOwned)}
function gpBundlePrice(){const missing=GP_IDS.filter(id=>!gpOwned(id));if(!missing.length)return 0;if(missing.length===2)return GP_BUNDLE_BASE_COST;return Math.ceil(missing.reduce((s,id)=>s+GP_CONTENT[id].cost,0)*.92/250)*250}
function gpGrantOne(id,announce=false){gpEnsureSave();const o=GP_CONTENT[id],d=CHARACTER_DEFINITIONS[id];if(!o||!d)return false;VSX.save.meta.unlockedCharacters[id]=true;VSX.save.meta.unlockedWeapons[o.weapon]=true;VSX.save.meta.skins[o.skin]=true;VSX.save.meta.adminOwnedWeapons[o.weapon]=true;gpDiscover("characters",id);gpDiscover("weapons",o.weapon);if(announce)VSX.announce(L("GOAT UNLOCKED","ĐÃ MỞ KHÓA GOAT"),d.name[VSX.lang],o.color);return true}
function gpGrantBundle(announce=true){GP_IDS.forEach(id=>gpGrantOne(id,false));VSX.save.meta.packages[GP_PACKAGE_ID]=true;VSX.save.meta.packageEffects[GP_PACKAGE_ID]=false;gpSave();if(announce)VSX.announce(L("GOAT RIVALS COMPLETE","ĐÃ HOÀN TẤT GOAT RIVALS"),L("CR7 · M10 · skins · signature weapons","CR7 · M10 · skin độc quyền · vũ khí đặc trưng"),"#e0b64b");return true}
function gpBuyOne(id){if(gpOwned(id))return true;const o=GP_CONTENT[id];if(!walletSpend("score",o.cost))return false;gpGrantOne(id,true);if(gpPackageOwned()){VSX.save.meta.packages[GP_PACKAGE_ID]=true;VSX.save.meta.packageEffects[GP_PACKAGE_ID]=false}gpSave();return true}
function gpBuyBundle(){const price=gpBundlePrice();if(price&&!walletSpend("score",price))return false;return gpGrantBundle(true)}
function gpLegendContent(id){return GP_CONTENT[id]||null}
function gpLegendSkinOwned(id){const o=gpLegendContent(id);return !!(o&&VSX.save?.meta?.skins?.[o.skin])}
function gpEquipSkin(id,save=true){
  if(!VSX.save?.loadout)return false;
  const o=gpLegendContent(id);
  const cur=SKIN_DEFINITIONS[VSX.save.loadout.skin||"default"];
  if(o&&gpLegendSkinOwned(id)){
    if(VSX.save.loadout.skin!==o.skin){VSX.save.loadout.skin=o.skin;if(save)gpSave()}
    return true;
  }
  if(cur?.characterOnly&&cur.characterOnly!==id){VSX.save.loadout.skin="default";if(save)gpSave()}
  return false;
}

function gpStrongest(g,range=900){return g.grid.queryCircle(g.player.x,g.player.y,range).filter(e=>!e.dead&&!e.isCaptive).sort((a,b)=>(Number(b.isBoss)-Number(a.isBoss))||(Number(b.elite)-Number(a.elite))||b.maxHp-a.maxHp)[0]||null}
function gpCluster(g,range){return g.findCluster?.(g.player.x,g.player.y,range)||g.findNearest?.(g.player.x,g.player.y,range)||gpStrongest(g,range)}
function gpDamageRadius(g,x,y,r,damage,source,color="#fff",knockback=60,cap=999){
  let hits=0;
  for(const e of g.grid.queryCircle(x,y,r)){
    if(e.dead||e.isCaptive)continue;
    g.damageEnemy(e,damage,{source,canCrit:true,knockback,fromX:x,fromY:y});
    hits++;
    if(hits>=cap)break;
  }
  g.effects.push(new WaveEffect(x,y,r,.35,0,0,source,color));
}

function gpDrawFootball(g,x,y,r,kind='m10',spin=0){
  const m10=kind==='m10';
  const c1=m10?'#ffffff':'#ffd75a',c2=m10?'#70d7ff':'#d62d45',glow=m10?'rgba(105,216,255,.36)':'rgba(255,205,75,.32)';
  g.save();g.translate(x,y);g.rotate(spin);g.shadowBlur=20;g.shadowColor=c2;
  const h=g.createRadialGradient(0,0,r*.25,0,0,r*2.15);h.addColorStop(0,'rgba(255,255,255,0)');h.addColorStop(.48,glow);h.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=h;g.beginPath();g.arc(0,0,r*2.15,0,Math.PI*2);g.fill();
  g.lineWidth=Math.max(2.8,r*.30);g.strokeStyle=c1;g.beginPath();g.arc(0,0,r*1.42,0,Math.PI*2);g.stroke();
  g.lineWidth=Math.max(2.4,r*.25);g.strokeStyle=c2;g.beginPath();g.arc(0,0,r*1.18,0,Math.PI*2);g.stroke();
  const b=g.createRadialGradient(-r*.32,-r*.45,1,0,0,r);b.addColorStop(0,'#fff');b.addColorStop(.72,'#f4f7fa');b.addColorStop(1,'#d7dde4');g.fillStyle=b;g.beginPath();g.arc(0,0,r,0,Math.PI*2);g.fill();
  g.strokeStyle='#252b31';g.lineWidth=Math.max(1.1,r*.12);g.beginPath();g.arc(0,0,r*.35,0,Math.PI*2);g.stroke();for(let i=0;i<5;i++){const a=i*Math.PI*2/5-Math.PI/2;g.beginPath();g.moveTo(Math.cos(a)*r*.35,Math.sin(a)*r*.35);g.lineTo(Math.cos(a)*r*.84,Math.sin(a)*r*.84);g.stroke()}
  g.restore();
}

class GP_CrossHeaderEffect{
  constructor(w,s,target,power=1){
    this.weapon=w;this.s=s;this.life=this.max=.58;this.dead=false;this.hit=false;this.power=power;
    const p=game.player;const dir=Math.random()<.5?-1:1;const dist=Math.min(s.range||650,Math.hypot((target?.x||p.x)-p.x,(target?.y||p.y)-p.y)+120);
    this.p0={x:p.x+dir*(165+Math.random()*65),y:p.y-(90+Math.random()*45)};
    this.p3=target?{x:target.x,y:target.y}:{x:p.x+dir*dist*.7,y:p.y-10};
    this.p1={x:(this.p0.x+p.x)*.5,y:this.p0.y-60};
    this.p2={x:(p.x+this.p3.x)*.5,y:Math.min(p.y,this.p3.y)-80};
    this.pos={...this.p0};
  }
  update(dt){
    this.life-=dt;const t=clamp(1-this.life/this.max,0,1);this.pos=gpBezier(this.p0,this.p1,this.p2,this.p3,t);
    if(!this.hit&&t>=.96){
      this.hit=true;
      const dmg=this.s.damage*(1.05+.28*this.power);
      gpDamageRadius(game,this.p3.x,this.p3.y,72+18*this.power,dmg,this.weapon,"#f6e27d",85,10);
      game.texts.push(new FloatingText(this.p3.x,this.p3.y-26,L("HEADER!","ĐÁNH ĐẦU!"),"#f7d76a",14));
    }
    if(this.life<=0)this.dead=true;
  }
  render(g){
    g.save();g.globalAlpha=.34;g.strokeStyle="#fff3c5";g.lineWidth=2.2;g.beginPath();g.moveTo(this.p0.x,this.p0.y);for(let i=1;i<=18;i++){const t=i/18,q=gpBezier(this.p0,this.p1,this.p2,this.p3,t);g.lineTo(q.x,q.y)}g.stroke();g.restore();
    gpDrawFootball(g,this.pos.x,this.pos.y,8.5,'cr7',game.time*10.5);
  }
}
class GP_KnuckleShotEffect{
  constructor(w,s,target,power=1){
    this.weapon=w;this.s=s;this.life=this.max=.72;this.dead=false;this.power=power;this.hit=new Set();
    const p=game.player;this.p0={x:p.x,y:p.y};const a=target?Math.atan2(target.y-p.y,target.x-p.x):Math.atan2(game.lastMoveDir?.y||0,game.lastMoveDir?.x||1),r=s.range||700;
    this.p3=target?{x:target.x,y:target.y}:{x:p.x+Math.cos(a)*r,y:p.y+Math.sin(a)*r};
    const per={x:-Math.sin(a),y:Math.cos(a)};
    this.p1={x:p.x+Math.cos(a)*r*.36+per.x*(130+25*power),y:p.y+Math.sin(a)*r*.36+per.y*(130+25*power)};
    this.p2={x:p.x+Math.cos(a)*r*.68-per.x*(95+20*power),y:p.y+Math.sin(a)*r*.68-per.y*(95+20*power)};
    this.pos={...this.p0};
  }
  update(dt){
    this.life-=dt;const t=clamp(1-this.life/this.max,0,1);this.pos=gpBezier(this.p0,this.p1,this.p2,this.p3,t);
    for(const e of game.grid.queryCircle(this.pos.x,this.pos.y,(this.s.size||10)+8*this.power)){
      if(e.dead||e.isCaptive||this.hit.has(e.id))continue;this.hit.add(e.id);
      game.damageEnemy(e,this.s.damage*(1+.1*this.power),{source:this.weapon,canCrit:true,knockback:(this.s.knockback||55)+15,fromX:this.p0.x,fromY:this.p0.y});
    }
    if(this.life<=0){game.effects.push(new WaveEffect(this.p3.x,this.p3.y,85+15*this.power,.42,this.s.damage*.42,50,this.weapon,"#f6e27d"));game.texts.push(new FloatingText(this.p3.x,this.p3.y-24,"KNUCKLEBALL","#fff0a3",13));this.dead=true}
  }
  render(g){
    const drawCurve=(p1,p2,color,alpha,w)=>{g.strokeStyle=color;g.globalAlpha=alpha;g.lineWidth=w;g.beginPath();g.moveTo(this.p0.x,this.p0.y);for(let i=1;i<=22;i++){const t=i/22,q=gpBezier(this.p0,p1,p2,this.p3,t);g.lineTo(q.x,q.y)}g.stroke()};
    g.save();drawCurve(this.p1,this.p2,"#f5d86c",.84,4.2);drawCurve(this.p1,this.p2,"#ffffff",.32,1.6);g.restore();gpDrawFootball(g,this.pos.x,this.pos.y,9.5,'cr7',game.time*11.5);
  }
}
class GP_M10CurveEffect{
  constructor(w,s,target,power=1,ultimate=false){
    this.weapon=w;this.s=s;this.life=this.max=ultimate?1.02:.82;this.dead=false;this.hit=new Set();this.power=power;this.ultimate=ultimate;
    const p=game.player;this.p0={x:p.x,y:p.y};const a=target?Math.atan2(target.y-p.y,target.x-p.x):Math.atan2(game.lastMoveDir?.y||0,game.lastMoveDir?.x||1),r=s.range||680,per={x:-Math.sin(a),y:Math.cos(a)};
    this.p3=target?{x:target.x,y:target.y}:{x:p.x+Math.cos(a)*r,y:p.y+Math.sin(a)*r};
    const bend=(ultimate?185:135)*(Math.random()<.5?-1:1);
    this.p1={x:p.x+Math.cos(a)*r*.28+per.x*bend,y:p.y+Math.sin(a)*r*.28+per.y*bend};
    this.p2={x:p.x+Math.cos(a)*r*.74-per.x*(bend*.65),y:p.y+Math.sin(a)*r*.74-per.y*(bend*.65)};
    this.pos={...this.p0};
  }
  update(dt){
    this.life-=dt;const t=clamp(1-this.life/this.max,0,1);this.pos=gpBezier(this.p0,this.p1,this.p2,this.p3,t);
    for(const e of game.grid.queryCircle(this.pos.x,this.pos.y,(this.s.size||9)+(this.ultimate?14:8))){
      if(e.dead||e.isCaptive||this.hit.has(e.id))continue;this.hit.add(e.id);
      game.damageEnemy(e,this.s.damage*(1+.22*this.power),{source:this.weapon,canCrit:true,knockback:(this.s.knockback||32)+10,fromX:this.p0.x,fromY:this.p0.y});
      if(!this.ultimate)e.applyStatus?.("slow",.5,.12,this.weapon);
    }
    if(this.life<=0){if(this.power>=2||this.ultimate)game.effects.push(new WaveEffect(this.p3.x,this.p3.y,this.ultimate?145:95,.46,this.s.damage*.55,46,this.weapon,"#8fe3ff"));if(!this.ultimate&&this.power>=2)game.texts.push(new FloatingText(this.p3.x,this.p3.y-24,L("SLALOM!","SLALOM!"),"#7dd3fc",13));this.dead=true}
  }
  render(g){
    const drawCurve=(p1,p2,color,alpha,w)=>{g.strokeStyle=color;g.globalAlpha=alpha;g.lineWidth=w;g.beginPath();g.moveTo(this.p0.x,this.p0.y);for(let i=1;i<=24;i++){const t=i/24,q=gpBezier(this.p0,p1,p2,this.p3,t);g.lineTo(q.x,q.y)}g.stroke()};
    g.save();drawCurve(this.p1,this.p2,this.ultimate?"#8cf3c5":"#6fd8ff",.92,this.ultimate?5.1:4.1);drawCurve(this.p1,this.p2,"#ffffff",.55,1.9);g.restore();gpDrawFootball(g,this.pos.x,this.pos.y,this.ultimate?12:9.5,'m10',game.time*(this.ultimate?7.2:8.8));
  }
}

ATTACK_BEHAVIORS.goatCR7Combo=function(w,s){
  const g=game,target=gpCluster(g,s.range); if(!target)return;
  const st=g.vsxGoatState?.cr7||{}; const power=st.perfectRun?2:st.offBallCharge>.72?1:0;
  w._gpCycle=((w._gpCycle||0)+1)%3;
  if(w._gpCycle===2)g.effects.push(new GP_KnuckleShotEffect(w,s,target,power));
  else g.effects.push(new GP_CrossHeaderEffect(w,s,target,power));
  if(st.perfectRun){st.perfectRun=false;st.offBallCharge=.2;g.texts.push(new FloatingText(g.player.x,g.player.y-34,L("Perfect Run","Chạy chỗ hoàn hảo"),"#f6df82",12))}
  g.audio?.beep?.(300,.05,"triangle",.012);
};
ATTACK_BEHAVIORS.goatM10Control=function(w,s){
  const g=game,target=gpCluster(g,s.range); if(!target)return;
  const st=g.vsxGoatState?.m10||{}; const power=st.slalomReady?2:st.controlCharge>=2?1:0;
  g.effects.push(new GP_M10CurveEffect(w,s,target,power,false));
  if(st.slalomReady){st.slalomReady=false;st.controlCharge=0}
  else if(st.controlCharge>=2)st.controlCharge=Math.max(0,st.controlCharge-2);
  g.audio?.beep?.(690,.045,"sine",.01);
};

const GP_PERSIST_BASE=WeaponInstance.prototype.renderPersistent;
WeaponInstance.prototype.renderPersistent=function(g){
  GP_PERSIST_BASE.call(this,g);
  if(this.def.behavior!=="goatM10Control")return;
  const p=game.player; if(!p)return; const dir=(game.lastMoveDir&&((game.lastMoveDir.x||0)!==0||(game.lastMoveDir.y||0)!==0))?game.lastMoveDir:{x:1,y:0};
  const len=Math.hypot(dir.x||0,dir.y||0)||1; const ox=(dir.x/len)*(p.radius+3), oy=(dir.y/len)*(p.radius+3);
  gpDrawFootball(g,p.x+ox,p.y+oy,5.6,'m10',game.time*7.5);
};

function goatStartUlt(g,id,time,data={}){
  g.ultimateCharge=0; g._ultReadyAnnounced=false; g.ultimateActive=true; g.stats&&(g.stats.ultimates++);
  g.vsxGoatUlt={id,time,max:time,tick:0,phase:0,sub:0,beaten:new Set(),count:0,...data};
  g.vsxUltDurationTimer={id,mode:"timed",total:time,remaining:time,bound:null,synthetic:true};
  VSX.announce(t("ultimate"),GP_ULT[id]?.name?.[VSX.lang]||id,id==="siuuuuuuu"?"#d9b24c":"#76cfff");
  g.player?.recalc?.(); g.updateHUD?.(true);
}
function goatFinishUlt(g){
  const u=g.vsxGoatUlt; if(!u)return;
  if(u.id==="siuuuuuuu"){
    gpDamageRadius(g,g.player.x,g.player.y,150,18*g.player.damageMultiplier,{id:"gp_siu_pulse",def:{tags:["ultimate","football"]}},"#e9c45d",110,18);
    g.texts.push(new FloatingText(g.player.x,g.player.y-44,"SIUUUU!","#f9dc73",18));
  }else if(u.id==="enkara_messi"){
    const t=gpStrongest(g,980); if(t){const bonus=Math.min(16,u.count||0); g.effects.push(new GP_M10CurveEffect({id:"gp_enkara_finish",def:{tags:["ultimate","football"]}},{damage:38*g.player.damageMultiplier,size:12,range:900,knockback:95},t,1+bonus*.18,true)); g.texts.push(new FloatingText(t.x,t.y-t.size-18,L("Final Curler","Cứa lòng kết liễu"),"#8fe3ff",16))}
  }
  g.vsxGoatUlt=null; g.ultimateActive=false; g.vsxUltDurationTimer=null; g.player?.recalc?.(); g.updateHUD?.(true);
}
function goatCR7UltimateBurst(g,phase){
  const t=gpStrongest(g,1000)||gpCluster(g,800); if(!t)return;
  const src={id:"gp_cr7_ult_"+phase,def:{tags:["ultimate","football"]}};
  if(phase===1){g.effects.push(new GP_KnuckleShotEffect(src,{damage:34*g.player.damageMultiplier,range:760,size:12,knockback:85},t,2));g.texts.push(new FloatingText(t.x,t.y-t.size-18,L("Burst Run Finish","Bứt tốc kết thúc"),"#f7dd82",14));}
  else if(phase===2){g.effects.push(new GP_CrossHeaderEffect(src,{damage:40*g.player.damageMultiplier,range:720,size:12,knockback:100},t,2));g.texts.push(new FloatingText(t.x,t.y-t.size-18,L("Towering Header","Đánh đầu dũng mãnh"),"#f7dd82",14));}
  else {g.effects.push(new GP_KnuckleShotEffect(src,{damage:46*g.player.damageMultiplier,range:820,size:13,knockback:105},t,3));g.texts.push(new FloatingText(t.x,t.y-t.size-18,"KNUCKLEBALL","#f7dd82",14));}
}

const GOAT_ULT_BASE=Game.prototype.useUltimate;
Game.prototype.useUltimate=function(){
  const id=CHARACTER_DEFINITIONS[this.characterId]?.ultimate;
  if(id==="siuuuuuuu"){
    if(this.state!=="PLAYING"||this.vsxGoatUlt||this.ultimateActive||this.ultimateCharge<100)return false;
    goatStartUlt(this,id,9); return true;
  }
  if(id==="enkara_messi"){
    if(this.state!=="PLAYING"||this.vsxGoatUlt||this.ultimateActive||this.ultimateCharge<100)return false;
    goatStartUlt(this,id,10); return true;
  }
  return GOAT_ULT_BASE.apply(this,arguments);
};

const GP_INIT_BASE=Game.prototype.vsxInitRun;
Game.prototype.vsxInitRun=function(){
  const r=GP_INIT_BASE.apply(this,arguments);
  this.vsxGoatState={cr7:{lastX:this.player?.x||0,lastY:this.player?.y||0,lastA:null,offBallCharge:0,perfectRun:false},m10:{lastX:this.player?.x||0,lastY:this.player?.y||0,lastA:null,controlCharge:0,slalomReady:false}};
  this.vsxGoatUlt=null; return r;
};
const GP_UPDATE_BASE=Game.prototype.update;
Game.prototype.update=function(dt){
  const r=GP_UPDATE_BASE.apply(this,arguments);
  const g=this,p=g.player; if(!p||g.state!=="PLAYING")return r;
  if(g.vsxGoatUlt)g.ultimateActive=true;
  g.vsxGoatState ||= {cr7:{lastX:p.x,lastY:p.y,lastA:null,offBallCharge:0,perfectRun:false},m10:{lastX:p.x,lastY:p.y,lastA:null,controlCharge:0,slalomReady:false}};
  const speedMul=(typeof VSX_ADMIN!=="undefined"?(VSX_ADMIN.speed||1):1),scaled=dt*speedMul;
  const dx=p.x-(g._gpLastX??p.x), dy=p.y-(g._gpLastY??p.y), dist=Math.hypot(dx,dy), ang=dist>.001?Math.atan2(dy,dx):null;
  g._gpLastX=p.x; g._gpLastY=p.y;
  // CR7 passive
  const s1=g.vsxGoatState.cr7;
  if(g.characterId==="cr7_goat"){
    if(dist>1.5&&ang!=null){
      if(s1.lastA!=null && angDiff(ang,s1.lastA)<.40)s1.offBallCharge=Math.min(1,s1.offBallCharge+scaled/2.1); else s1.offBallCharge=Math.max(0,s1.offBallCharge-scaled*.35);
      s1.lastA=ang;
      if(s1.offBallCharge>=.98)s1.perfectRun=true;
    }else s1.offBallCharge=Math.max(0,s1.offBallCharge-scaled*.65);
  }else {s1.offBallCharge=Math.max(0,s1.offBallCharge-scaled*.25); if(s1.offBallCharge<.15)s1.perfectRun=false;}
  // Messi passive
  const s2=g.vsxGoatState.m10;
  if(g.characterId==="m10_goat"){
    if(dist>1.2&&ang!=null){
      if(s2.lastA!=null&&angDiff(ang,s2.lastA)>.58){s2.controlCharge=Math.min(3,s2.controlCharge+1); if(s2.controlCharge>=3)s2.slalomReady=true;}
      s2.lastA=ang;
    }
  }
  // Ult updates
  const u=g.vsxGoatUlt;
  if(u){
    u.time=Math.max(0,u.time-scaled); u.tick+=scaled;
    if(u.id==="siuuuuuuu"){
      const thresholds=[.25,3.1,6.2];
      while(u.phase<thresholds.length&&u.tick>=thresholds[u.phase]){u.phase++; goatCR7UltimateBurst(g,u.phase)}
      if(u.tick>=u.sub+.78){u.sub=u.tick; const t=gpCluster(g,720); if(t)g.effects.push(new GP_KnuckleShotEffect({id:"gp_cr7_ult_tick",def:{tags:["ultimate","football"]}},{damage:16*g.player.damageMultiplier,range:620,size:10,knockback:50},t,0));}
    }else if(u.id==="enkara_messi"){
      for(const e of g.grid.queryCircle(p.x,p.y,56)){
        if(e.dead||e.isCaptive||u.beaten.has(e.id))continue;
        u.beaten.add(e.id); u.count++; e.applyStatus?.("slow",.45,.18,{id:"gp_m10_ult"});
      }
      if(u.tick>=u.sub+.52){u.sub=u.tick; const t=gpCluster(g,700); if(t)g.effects.push(new GP_M10CurveEffect({id:"gp_m10_ult_tick",def:{tags:["ultimate","football"]}},{damage:14*g.player.damageMultiplier,range:640,size:9,knockback:28},t,1,false));}
    }
    if(u.time<=0)goatFinishUlt(g);
  }
  return r;
};

function ensureGoatHud(){
  const ability=document.getElementById("vsxUltLabel")?.closest(".vsxAbility"); if(!ability)return null;
  let el=document.getElementById("vsxGoatUltMeta");
  if(!el){el=document.createElement("div");el.id="vsxGoatUltMeta";el.innerHTML='<span id="vsxGoatUltMetaLabel"></span><b id="vsxGoatUltMetaValue"></b>';ability.appendChild(el)}
  return el;
}
function renderGoatHud(g=game){
  const box=ensureGoatHud(); if(!box)return; const lab=box.querySelector('#vsxGoatUltMetaLabel'), val=box.querySelector('#vsxGoatUltMetaValue'); const u=g?.vsxGoatUlt; if(!u){box.style.display='none';return} box.style.display='flex';
  if(u.id==="siuuuuuuu"){lab.textContent=L("FINISH","Pha kết thúc"); val.textContent=`${Math.min(3,u.phase)}/3`}
  else {lab.textContent=L("PLAYERS BEATEN","Qua người"); val.textContent=String(u.count||0).padStart(2,'0')}
}
const GP_HUD_BASE=Game.prototype.updateHUD;
Game.prototype.updateHUD=function(){const r=GP_HUD_BASE.apply(this,arguments);renderGoatHud(this);return r};

/* Shop / customization integration */
function goatPackageMarkup(){
  gpEnsureSave();
  const owned=GP_IDS.filter(gpOwned).length, price=gpBundlePrice(), pack=gpPackageOwned();
  return `<section id="vsxGoatPackage" class="vsxGoatPackage">
    <div class="vsxGoatHero">
      <div class="vsxGoatHeroHead">
        <div>
          <div class="vsxGoatKicker">${L("GOAT RIVALS · TWO ICONS, TWO STYLES","GOAT RIVALS · HAI BIỂU TƯỢNG, HAI TRƯỜNG PHÁI")}</div>
          <h3>CR7 · M10</h3>
          <p>${L("Two football icons with signature weapons, exclusive national-kit skins and Ultimate presentations built to feel different the moment the run begins.","Hai biểu tượng sân cỏ với vũ khí đặc trưng, skin áo đấu độc quyền và Tuyệt Kỹ có cách thể hiện khác biệt ngay từ những giây đầu vào trận.")}</p>
        </div>
        <div class="vsxGoatBundlePrice"><small>${pack?L("STATUS","TRẠNG THÁI"):L("CURRENT BUNDLE PRICE","GIÁ GÓI HIỆN TẠI")}</small><b>${pack?L("OWNED","ĐÃ SỞ HỮU"):price.toLocaleString("en-US")+" SCORE"}</b><span>${owned}/2 ${L("SURVIVORS","NHÂN VẬT")}</span></div>
      </div>
      <div class="vsxGoatDuel">
        ${GP_IDS.map(id=>{const o=GP_CONTENT[id],d=CHARACTER_DEFINITIONS[id],own=gpOwned(id);return `<article class="vsxGoatFighter ${own?'owned':''}" style="--j1:${o.jersey1};--j2:${o.jersey2};--accent:${o.color}"><div class="vsxGoatNumber">${o.number}</div><h4>${VSX.esc(d.name[VSX.lang])}</h4><small>${VSX.esc(o.subtitle[VSX.lang])}</small><p>${VSX.esc(d.desc[VSX.lang])}</p><div class="vsxGoatTags"><span>LEGENDARY</span><span>${VSX.esc(weaponName(o.weapon))}</span><span>${VSX.esc(o.ultimateName[VSX.lang])}</span></div></article>`}).join('')}
      </div>
      <div class="vsxGoatActions"><button id="vsxBuyGoatBundle" ${pack||!walletCan('score',price)?'disabled':''}>${pack?L("PACKAGE OWNED","ĐÃ SỞ HỮU TRỌN GÓI"):L("BUY BUNDLE","MUA TRỌN GÓI")+` · ${price.toLocaleString('en-US')}`}</button></div>
      <div class="vsxGoatBonus"><b>${L("Bundle cosmetics","Mỹ thuật trọn gói")}</b> · ${L("Portugal No.7 aura · Argentina No.10 aura · subtle GOAT rivalry halo for both skins when the full bundle is complete.","Hào quang Bồ Đào Nha số 7 · hào quang Argentina số 10 · quầng đối địch GOAT nhẹ nhàng cho cả hai skin khi hoàn tất trọn gói.")}</div>
    </div>
    <div class="vsxGoatIndividualGrid">${GP_IDS.map(id=>{const o=GP_CONTENT[id],d=CHARACTER_DEFINITIONS[id],own=gpOwned(id),skin=SKIN_DEFINITIONS[o.skin],u=GP_ULT[o.ultimate];return `<div class="vsxGoatBuyCard ${own?'owned':''}"><div class="vsxGoatBuyHead"><b>${VSX.esc(d.name[VSX.lang])}</b><span>${VSX.esc(o.subtitle[VSX.lang])}</span></div><p>${VSX.esc(d.desc[VSX.lang])}</p><div class="vsxGoatMiniMeta"><span><b>${L("Weapon","Vũ khí")}:</b> ${VSX.esc(weaponName(o.weapon))}</span><span><b>${L("Ultimate","Tuyệt Kỹ")}:</b> ${VSX.esc(u.name[VSX.lang])}</span><span><b>${L("Skin","Skin")}:</b> ${VSX.esc(skin.name[VSX.lang])}</span></div><button class="vsxGoatBuyOne" data-goat-buy="${id}" ${own||!walletCan('score',o.cost)?'disabled':''}>${own?L('OWNED','ĐÃ SỞ HỮU'):L('BUY','MUA')+` · ${o.cost.toLocaleString('en-US')}`}</button></div>`}).join('')}</div>
  </section>`;
}
function bindGoatShop(){
  document.getElementById('vsxBuyGoatBundle')?.addEventListener('click',()=>{if(gpBuyBundle())gpRenderArmory()});
  document.querySelectorAll('[data-goat-buy]').forEach(btn=>btn.addEventListener('click',()=>{if(gpBuyOne(btn.dataset.goatBuy))gpRenderArmory()}));
}
const GP_ARMORY_BASE=renderArmory;
renderArmory=function(){
  const r=GP_ARMORY_BASE.apply(this,arguments);
  if(typeof ARMORY_TAB!=="undefined"&&ARMORY_TAB==="packages"){
    const c=document.getElementById("vsxArmoryContent");
    if(c&&!c.querySelector("#vsxGoatPackage")){
      const host=document.createElement("div");host.innerHTML=goatPackageMarkup();c.prepend(host.firstElementChild);bindGoatShop();
    }
  }
  return r;
};

const GP_CUST_BASE=renderCustomization;
renderCustomization=function(c){GP_CUST_BASE.apply(this,arguments);const grid=document.getElementById('vsxSkinGrid');if(!grid)return;const ids=Object.keys(SKIN_DEFINITIONS);[...grid.children].forEach((card,i)=>{const sid=ids[i],sd=SKIN_DEFINITIONS[sid];if(!sd?.packageExclusive)return;const own=!!VSX.save.meta.skins?.[sid],btn=card.querySelector('button'),price=card.querySelector('.vsxPrice');if(!own&&btn){btn.disabled=true;btn.textContent=L('UNLOCK VIA SURVIVOR/BUNDLE','MỞ QUA NHÂN VẬT/GÓI')}if(!own&&price)price.textContent=L('Unlocked with its matching survivor or bundle.','Mở khi sở hữu nhân vật hoặc gói tương ứng.');})};

/* Setup / Collection decoration */
function decorateGoatSetup(){
  for(const card of document.querySelectorAll('#vsxCharacterGrid .vsxPick')){
    const id=card.dataset.characterId;if(!GP_CONTENT[id]||card.querySelector('.vsxGoatSetupBadge'))continue;const o=GP_CONTENT[id];
    const row=document.createElement('div');row.className='vsxGoatSetupBadge';row.innerHTML=`<span class="shirt" style="--j1:${o.jersey1};--j2:${o.jersey2};--accent:${o.color}"><b>${o.number}</b></span><span><small>${L('SIGNATURE SKIN','SKIN ĐẶC TRƯNG')}</small><br>${VSX.esc(SKIN_DEFINITIONS[o.skin].name[VSX.lang])}</span>`;card.appendChild(row);
  }
}
function decorateGoatCollection(){
  for(const card of document.querySelectorAll('#vsxCodexList .vsxCharacterCodexCard')){
    const id=card.dataset.codexId;if(!GP_CONTENT[id])continue;const detail=card.querySelector('.vsxCharacterCodexDetail');if(!detail)continue;const d=CHARACTER_DEFINITIONS[id],u=GP_ULT[d.ultimate];
    let how=detail.querySelector('.vsxUltHow');
    if(!how){how=document.createElement('div');how.className='vsxUltHow';detail.appendChild(how)}
    how.innerHTML=`<b>${L('How the Ultimate plays','Trải nghiệm Tuyệt Kỹ')}:</b> ${VSX.esc(u.how[VSX.lang])}`;
    if(!card.querySelector('.vsxGoatCollectionBadge')){const badge=document.createElement('div');badge.className='vsxGoatCollectionBadge';badge.textContent='GOAT RIVALS';card.querySelector('.vsxCharacterCodexHead, b')?.after?.(badge)}
  }
}
const GP_SETUP_BASE=VSX.renderSetup;
VSX.renderSetup=function(){gpEquipSkin(VSX.selectedCharacter,false);const r=GP_SETUP_BASE.apply(this,arguments);decorateGoatSetup();return r};
const GP_CODEX_BASE=VSX.renderCodex;
VSX.renderCodex=function(cat){
  const r=GP_CODEX_BASE.call(this,cat);
  if(cat==='characters')decorateGoatCollection();
  if(cat==='packages'){
    const list=document.getElementById('vsxCodexList');
    if(list&&!list.querySelector('[data-goat-package-codex]')){
      const e=document.createElement('div');e.className='vsxCodexItem';e.dataset.goatPackageCodex='1';
      e.innerHTML=`<div><b>GOAT RIVALS — CR7 × M10</b><span class="vsxGoatCollectionBadge">${gpPackageOwned()?L('OWNED','ĐÃ SỞ HỮU'):L('INCOMPLETE','CHƯA HOÀN TẤT')}</span></div><div style="margin-top:7px">Cristiano Ronaldo — CR7 · Lionel Messi — M10</div><div class="vsxPkgCollection">${GP_IDS.map(id=>{const o=GP_CONTENT[id];return `<div><small>${VSX.esc(CHARACTER_DEFINITIONS[id].name[VSX.lang])}</small><b>${VSX.esc(weaponName(o.weapon))}</b><small>${VSX.esc(SKIN_DEFINITIONS[o.skin].name[VSX.lang])}</small></div>`}).join('')}</div>`;
      list.appendChild(e);
    }
  }
  return r;
};
const GP_CODEX_ENTRIES_BASE=VSX.codexEntries;
VSX.codexEntries=function(cat){const rows=GP_CODEX_ENTRIES_BASE.call(VSX,cat);if(cat==='packages')return [...rows,[GP_PACKAGE_ID,'GOAT RIVALS — CR7 × M10',L('Cristiano Ronaldo and Lionel Messi with signature weapons, national-kit skins and unique football Ultimates.','Cristiano Ronaldo và Lionel Messi với vũ khí đặc trưng, skin đội tuyển và Tuyệt Kỹ bóng đá độc nhất.')]];return rows};
const GP_SHOW_COLLECTION_BASE=VSX.showCollection;
VSX.showCollection=function(){const r=GP_SHOW_COLLECTION_BASE.apply(this,arguments);const b=document.getElementById('vsxPackageCodexTab');if(b){const owned=[window.VSX_FOOTBALL_PACKAGE?.owned?.(),window.VSX_DC_PACKAGE?.owned?.(),gpPackageOwned()].filter(Boolean).length;b.textContent=`${L('PACKAGES','GÓI NHÂN VẬT')} ${owned}/3`}return r};
const GP_BEGIN_BASE=VSX.beginRun;
VSX.beginRun=function(){gpEquipSkin(VSX.selectedCharacter,true);const r=GP_BEGIN_BASE.apply(this,arguments);return r};

/* Admin panel */
function injectGoatAdmin(){
  const grid=document.querySelector('#vsxAdminContent .vsxAdminGrid');
  if(!grid||!VSX_ADMIN?.open||!['meta','loadout','player','collection'].includes(VSX_ADMIN.tab)||document.getElementById('vsxAdminGoatCard'))return;
  const c=document.createElement('div'); c.id='vsxAdminGoatCard'; c.className='vsxAdminCard vsxGold';
  c.innerHTML=`<h3>${L('GOAT RIVALS · QA','GOAT RIVALS · QA')}</h3><p>${L('Unlock CR7/M10, apply skins, grant signature weapons and live-test the custom Ultimate HUD flows.','Mở khóa CR7/M10, áp skin, cấp vũ khí đặc trưng và test nhanh flow HUD Tuyệt Kỹ riêng.')}</p><select id="admGoatSelect">${GP_IDS.map(id=>`<option value="${id}">${VSX.esc(CHARACTER_DEFINITIONS[id].name[VSX.lang])} · ${VSX.esc(weaponName(GP_CONTENT[id].weapon))}</option>`).join('')}</select><div class="row"><button id="admGoatUnlock">${L('UNLOCK SELECTED','MỞ KHÓA ĐÃ CHỌN')}</button><button id="admGoatNext">${L('SET NEXT RUN','CHỌN TRẬN SAU')}</button><button id="admGoatUlt">${L('LIVE TEST ULT','TEST ULT NGAY')}</button></div><div class="row"><button id="admGoatBundle">${L('UNLOCK FULL BUNDLE','MỞ KHÓA TRỌN GÓI')}</button><button id="admGoatWeapon">${L('ADD SIGNATURE WEAPON','THÊM VŨ KHÍ ĐẶC TRƯNG')}</button></div>`;
  grid.appendChild(c);
  const sel=c.querySelector('#admGoatSelect');
  c.querySelector('#admGoatUnlock').onclick=()=>{gpGrantOne(sel.value,true);gpEquipSkin(sel.value,true);gpSave()};
  c.querySelector('#admGoatNext').onclick=()=>{gpGrantOne(sel.value,false);VSX.selectedCharacter=sel.value;gpEquipSkin(sel.value,true);gpSave();VSX.announce('ADMIN',CHARACTER_DEFINITIONS[sel.value].name[VSX.lang],GP_CONTENT[sel.value].color)};
  c.querySelector('#admGoatBundle').onclick=()=>gpGrantBundle(true);
  c.querySelector('#admGoatWeapon').onclick=()=>{if(!game.player)return VSX.announce('ADMIN',L('START A RUN FIRST','HÃY VÀO TRẬN TRƯỚC'),'#ff9b71');const id=sel.value,w=GP_CONTENT[id].weapon;gpGrantOne(id,false);if(!game.player.weapons.some(x=>x.id===w)){if(game.player.weapons.length>=game.player.weaponSlots)game.player.weapons.shift();game.player.addWeapon(w)}game.updateHUD?.(true)};
  c.querySelector('#admGoatUlt').onclick=()=>{if(!game.player)return VSX.announce('ADMIN',L('START A RUN FIRST','HÃY VÀO TRẬN TRƯỚC'),'#ff9b71');const id=sel.value,w=GP_CONTENT[id].weapon;gpGrantOne(id,false);gpEquipSkin(id,true);game.characterId=id;VSX.selectedCharacter=id;if(!game.player.weapons.some(x=>x.id===w)){if(game.player.weapons.length>=game.player.weaponSlots)game.player.weapons.shift();game.player.addWeapon(w)}if(game.vsxGoatUlt)goatFinishUlt(game);game.ultimateActive=false;game.ultimateCharge=100;game.useUltimate();game.updateHUD?.(true)};
}
if(window.VSX_ADMIN){const op=VSX_ADMIN.openPanel;if(typeof op==='function')VSX_ADMIN.openPanel=function(){const r=op.apply(this,arguments);queueMicrotask(injectGoatAdmin);return r};const content=document.getElementById('vsxAdminContent');if(content)new MutationObserver(()=>{if(VSX_ADMIN?.open)queueMicrotask(injectGoatAdmin)}).observe(content,{childList:true,subtree:false})}

/* Runtime skin art */
const GP_SKIN_UPDATE_BASE=Player.prototype.update;
Player.prototype.update=function(dt){
  const r=GP_SKIN_UPDATE_BASE.apply(this,arguments);
  this.vsxGoatTrail ||= [];
  const skin=SKIN_DEFINITIONS[VSX.save?.loadout?.skin||'default'];
  const isGoat=skin&&(skin.effect==='goatPortugal'||skin.effect==='goatArgentina');
  if(!isGoat){if(this.vsxGoatTrail.length)this.vsxGoatTrail.length=0;return r}
  const lx=this._gpTrailX??this.x, ly=this._gpTrailY??this.y; const d=Math.hypot(this.x-lx,this.y-ly);
  if(d>4){this.vsxGoatTrail.push({x:lx,y:ly,life:.30,max:.30,size:this.radius*.86}); if(this.vsxGoatTrail.length>12)this.vsxGoatTrail.shift();}
  this._gpTrailX=this.x; this._gpTrailY=this.y;
  for(const t of this.vsxGoatTrail)t.life-=dt;
  this.vsxGoatTrail=this.vsxGoatTrail.filter(t=>t.life>0);
  return r;
};
function drawGoatKit(g,player,skinId){
  const r=player.radius+1; g.save(); g.translate(player.x,player.y);
  // trail
  if(player.vsxGoatTrail?.length){for(const t of player.vsxGoatTrail){g.globalAlpha=Math.max(0,t.life/t.max*.28);g.fillStyle=skinId==='cr7_portugal_7'?'#c0283c':'#8fdcff';g.beginPath();g.arc(t.x-player.x,t.y-player.y,t.size,0,Math.PI*2);g.fill();}}
  g.globalAlpha=1;
  // outer aura
  g.shadowBlur=16; g.shadowColor=skinId==='cr7_portugal_7'?'#d9b24c':'#75dcff'; g.strokeStyle=skinId==='cr7_portugal_7'?'rgba(217,178,76,.82)':'rgba(117,220,255,.82)'; g.lineWidth=3; g.beginPath(); g.arc(0,0,r+8,0,Math.PI*2); g.stroke();
  if(gpPackageOwned()){g.lineWidth=1.2;g.strokeStyle=skinId==='cr7_portugal_7'?'rgba(255,255,255,.35)':'rgba(67,196,121,.38)';g.beginPath();g.arc(0,0,r+13+Math.sin((game.time||0)*2)*1.8,0,Math.PI*2);g.stroke()}
  // kit orb
  g.beginPath(); g.arc(0,0,r*.98,0,Math.PI*2); g.clip();
  if(skinId==='cr7_portugal_7'){
    const gr=g.createLinearGradient(-r,-r,r,r); gr.addColorStop(0,'#d33448'); gr.addColorStop(.72,'#8f1526'); gr.addColorStop(1,'#5f0d19'); g.fillStyle=gr; g.fillRect(-r,-r,r*2,r*2); g.fillStyle='#d9b24c'; g.fillRect(-r,r*.46,r*2,r*.42); g.globalAlpha=.15; g.fillStyle='#fff'; g.beginPath(); g.arc(-r*.34,-r*.42,r*.72,0,Math.PI*2); g.fill(); g.globalAlpha=1; g.fillStyle='#f6e27d'; g.font=`900 ${Math.max(10,r*.88)}px Arial`; g.textAlign='center'; g.textBaseline='middle'; g.fillText('7',0,1);
  }else{
    g.fillStyle='#f6fbff'; g.fillRect(-r,-r,r*2,r*2); for(let i=-1;i<=1;i++){g.fillStyle=i===0?'#ffffff':'#6ecdf6'; g.fillRect(-r,-r*.95 + (i+1)*(r*2/3),r*2,r*2/6)} g.globalAlpha=.18; g.fillStyle='#89d8ff'; g.beginPath(); g.arc(-r*.3,-r*.44,r*.7,0,Math.PI*2); g.fill(); g.globalAlpha=1; g.fillStyle='#33b765'; g.font=`900 ${Math.max(10,r*.82)}px Arial`; g.textAlign='center'; g.textBaseline='middle'; g.fillText('10',0,1);
  }
  g.restore();
}
const GP_SKIN_RENDER_BASE=Player.prototype.render;
Player.prototype.render=function(g){GP_SKIN_RENDER_BASE.call(this,g);const skinId=VSX.save?.loadout?.skin; if(skinId!=='cr7_portugal_7'&&skinId!=='m10_argentina_10')return; drawGoatKit(g,this,skinId)};

// initial self-heal + startup hooks
(function(){gpEnsureSave(); if(gpPackageOwned()){VSX.save.meta.packages[GP_PACKAGE_ID]=true;VSX.save.meta.packageEffects[GP_PACKAGE_ID]=false;} for(const [id,o] of Object.entries(GP_CONTENT)){ if(VSX.save.meta.unlockedCharacters?.[id]){VSX.save.meta.unlockedWeapons[o.weapon]=true;VSX.save.meta.skins[o.skin]=true} } gpSave();})();
queueMicrotask(()=>{if(typeof ARMORY_TAB!=='undefined'&&ARMORY_TAB==='survivors')gpRenderArmory(); decorateGoatSetup(); renderGoatHud(game)});
window.VSX_GOAT_RIVALS={id:GP_PACKAGE_ID,ids:[...GP_IDS],content:GP_CONTENT,buyOne:gpBuyOne,buyBundle:gpBuyBundle,grantOne:gpGrantOne,grantBundle:gpGrantBundle,owned:gpPackageOwned};
})();
