(()=>{
'use strict';
const N10_ID='n10_neymar';
const N10_WEAPON='samba_streetball';
const N10_ULT='the_last_samba';
const N10_SKIN='n10_brazil_10';
const N10_PACKAGE='n10_last_samba_bundle';
const N10_COLOR='#f4d94b';
const N10_GREEN='#1f8c58';
const N10_BLUE='#72d8ff';
const N10_FULL_BUNDLE_COST=26500;
const N10_SURVIVOR_COST=24000;
const N10_SKIN_UPGRADE_COST=5800;
const vi=()=>window.VSX?.lang==='vi';
const T=(en,viText)=>vi()?viText:en;
const absAngle=(a,b)=>Math.abs(angleDiff(a,b));
function esc(v){return window.VSX?.esc?VSX.esc(v):String(v)}
function n10WeaponName(){return vi()?(window.VI_WEAPON?.[N10_WEAPON]?.[0]||WEAPON_DEFINITIONS[N10_WEAPON].name):WEAPON_DEFINITIONS[N10_WEAPON].name}
function n10UltName(){return vi()?'THE LAST SAMBA · Vũ Điệu Samba Cuối Cùng':'THE LAST SAMBA'}
function n10EnsureSave(){
  if(!window.VSX?.save) return;
  VSX.save.meta ||= {};
  VSX.save.meta.unlockedCharacters ||= {};
  VSX.save.meta.unlockedWeapons ||= {};
  VSX.save.meta.skins ||= {};
  VSX.save.meta.packages ||= {};
  VSX.save.meta.packageEffects ||= {};
  VSX.save.meta.discovered ||= {characters:{},weapons:{},packages:{}};
  VSX.save.loadout ||= {};
}
function n10Owned(){n10EnsureSave();return !!VSX.save?.meta?.unlockedCharacters?.[N10_ID]}
function n10SkinOwned(){n10EnsureSave();return !!VSX.save?.meta?.skins?.[N10_SKIN]}
function n10BundleOwned(){n10EnsureSave();return !!VSX.save?.meta?.packages?.[N10_PACKAGE]}
function n10PackagePrice(){return n10Owned()?N10_SKIN_UPGRADE_COST:N10_FULL_BUNDLE_COST}
function n10Discover(){try{window.vsxDiscover?.('characters',N10_ID);window.vsxDiscover?.('weapons',N10_WEAPON);window.vsxDiscover?.('packages',N10_PACKAGE);}catch(e){}}
function n10Grant(fullBundle=false){
  n10EnsureSave();
  VSX.save.meta.unlockedCharacters[N10_ID]=true;
  VSX.save.meta.unlockedWeapons[N10_WEAPON]=true;
  if(fullBundle){
    VSX.save.meta.skins[N10_SKIN]=true;
    VSX.save.meta.packages[N10_PACKAGE]=true;
    VSX.save.meta.packageEffects[N10_PACKAGE]=false;
  }
  n10Discover();
  window.vsxSave?.();
}
function n10BuySurvivor(){if(n10Owned())return true;if(!window.walletSpend||!walletSpend('score',N10_SURVIVOR_COST))return false;n10Grant(false);window.VSX?.announce?.(T('SURVIVOR UNLOCKED','ĐÃ MỞ KHÓA NHÂN VẬT'),CHARACTER_DEFINITIONS[N10_ID].name[VSX.lang],N10_COLOR);return true}
function n10BuyBundle(){const cost=n10PackagePrice();if(n10BundleOwned())return true;if(!window.walletSpend||!walletSpend('score',cost))return false;n10Grant(true);window.VSX?.announce?.('BUNDLE',T('THE LAST SAMBA bundle unlocked','Đã mở khóa gói THE LAST SAMBA'),N10_COLOR);return true}
function n10EffectOn(){n10EnsureSave();return !!VSX.save?.meta?.packageEffects?.[N10_PACKAGE]}
function n10SetEffect(v){n10EnsureSave();VSX.save.meta.packageEffects[N10_PACKAGE]=!!v;window.vsxSave?.()}

Object.assign(CHARACTER_DEFINITIONS,{
  [N10_ID]:{
    name:{en:'Neymar',vi:'Neymar'},
    desc:{
      en:'LEGENDARY — The last samba dancer. A trick-chaining survivor who baits enemies into overcommitting, then breaks the swarm with flair, feints and escape windows.',
      vi:'LEGENDARY — Vũ công Samba cuối cùng. Một survivor chơi sát đàn quái, cố tình nhử đối thủ lao vào rồi phá đội hình bằng kỹ thuật, mồi nhử và những pha thoát ra đầy ngẫu hứng.'
    },
    weapon:N10_WEAPON,
    mods:{move:1.5,dodge:.04,dashCooldown:1},
    ultimate:N10_ULT,
    rarity:'legendary',
    shopOnly:true,
    packageId:N10_PACKAGE
  }
});
Object.assign(WEAPON_DEFINITIONS,{
  [N10_WEAPON]:{
    name:'Samba Streetball',
    desc:'A reactive street-football weapon. Sharp turns, tight gaps and enemy pressure trigger Elástico, Rainbow Flick, Nutmeg and Sombrero instead of one fixed attack pattern.',
    rarity:'epic',shopLocked:true,
    tags:['projectile','adaptive','football','movement'],
    behavior:'n10SambaStreetball',
    damage:29,cooldown:.98,speed:640,size:6,pierce:1,area:72,range:720,knockback:30,maxLevel:5,
    levels:lv({}, {damageMul:1.16},{cooldownMul:.86},{areaMul:1.18},{special:'sambaMaster'})
  }
});
Object.assign(window.VI_WEAPON||{}, {
  [N10_WEAPON]:['Samba Đường Phố','Bóng luôn bám quanh Neymar. Góc rê, khe hẹp và áp lực từ đối thủ sẽ tự kích hoạt Elástico, Rainbow Flick, Nutmeg hoặc Sombrero thay vì một kiểu bắn cố định.']
});
Object.assign(SKIN_DEFINITIONS,{
  [N10_SKIN]:{
    name:{en:'Neymar Jr. — Brazil No.10 Jersey',vi:'Neymar Jr. — Áo Brazil Số 10'},
    currency:'score',cost:0,color:'#f7d61e',secondary:'#14824d',effect:'n10Samba',tier:'legendary',packageExclusive:true,packageId:N10_PACKAGE,characterOnly:N10_ID
  }
});

function n10UltInfo(){
  return {
    name:{en:'THE LAST SAMBA',vi:'THE LAST SAMBA · Vũ Điệu Samba Cuối Cùng'},
    how:{
      en:'For 11s Samba Flow locks at 100 and tricks cost no Flow. Every enemy danced past by Elástico, Nutmeg, Rainbow Flick, Sombrero or Body Feint is marked. When the timer ends the ball chains through all Danced nodes before a final Trivela Finish hits the highest-priority target. Diversity matters: using more trick types upgrades the finale.',
      vi:'Trong 11 giây, Nhịp Samba khóa ở 100 và mọi trick không tốn Flow. Mỗi kẻ địch bị Neymar lướt qua bằng Elástico, Nutmeg, Rainbow Flick, Sombrero hoặc Body Feint sẽ bị đánh dấu DANCED. Khi hết thời gian, bóng chuyền xuyên toàn bộ các node đó rồi kết bằng cú Trivela Finish vào mục tiêu ưu tiên cao nhất. Dùng càng đa dạng trick, pha kết thúc càng đẹp và mạnh hơn.'
    }
  };
}

function n10Is(g=game){return g?.characterId===N10_ID}
function n10State(g=game){
  if(!g) return null;
  g.vsxN10 ||= {flow:28,combo:0,lastTrick:null,lastPos:{x:g.player?.x||0,y:g.player?.y||0},lastAng:null,recentTurnUntil:0,freeTrickUntil:0,nextEmpowered:0,showboatCd:3.2,showboat:null,freeKick:null,phantom:null,afterimage:null,bodyFeintUntil:0,bodyFeintDir:null,dashCharges:2,dashMax:2,dashRecharge:0,lastDashAt:-99,lastDashDir:{x:1,y:0},ult:null,stats:{tricks:0,styles:0,danced:0},nearMissCd:0,speedBurstUntil:0,foulWindowUntil:0,foulCdUntil:0,lastProjectileNearMissAt:0};
  return g.vsxN10;
}
function n10ResetState(g=game){const s=n10State(g); if(!s)return; Object.assign(s,{flow:28,combo:0,lastTrick:null,recentTurnUntil:0,freeTrickUntil:0,nextEmpowered:0,showboatCd:3.2,showboat:null,freeKick:null,phantom:null,afterimage:null,bodyFeintUntil:0,bodyFeintDir:null,dashCharges:2,dashMax:2,dashRecharge:0,lastDashAt:-99,ult:null,stats:{tricks:0,styles:0,danced:0},nearMissCd:0,speedBurstUntil:0,foulWindowUntil:0,foulCdUntil:0,lastProjectileNearMissAt:0}); if(g.player) s.lastPos={x:g.player.x,y:g.player.y}}
function n10FlowCap(){return 100}
function n10GainFlow(g,amount,label){const s=n10State(g); if(!s)return; if(s.ult){s.flow=100;return;} const prev=s.flow; s.flow=clamp((s.flow||0)+amount,0,n10FlowCap()); if(label && s.flow>prev+1 && g?.texts) g.texts.push(new FloatingText(g.player.x,g.player.y-46,label,'#f5df74',11));}
function n10SpendFlow(g,amount){const s=n10State(g); if(!s)return true; if(s.ult) return true; if((s.flow||0)<amount) return false; s.flow=Math.max(0,s.flow-amount); return true}
function n10ComboTag(combo){if(combo>=7) return T('BONITO','BONITO'); if(combo>=5) return T('JOGA','JOGA'); if(combo>=3) return T('SAMBA','SAMBA'); return '—'}
function n10MarkBeaten(g,enemies,type,opts={}){
  const s=n10State(g); if(!s)return;
  const list=(Array.isArray(enemies)?enemies:[enemies]).filter(Boolean);
  const now=g.time||0;
  for(const e of list){
    if(e.dead) continue;
    e.vsxN10BeatenUntil=now+2.5;
    e.vsxN10BeatenStrength=e.elite?0.55:1;
    e.applyStatus?.('slow',e.isBoss?0.18:0.36,e.elite?0.16:0.24,{id:N10_WEAPON});
    if(!e.isBoss&&Math.random()<0.65) e.applyStatus?.('confuse',e.elite?0.22:0.5,1,{id:N10_WEAPON});
    if(s.ult){
      e.vsxN10DancedUntil=now+Math.max(2,s.ult.time+0.4);
      if(!s.ult.danced.has(e.id)){ s.ult.danced.add(e.id); s.ult.dancedCount=(s.ult.dancedCount||0)+1; }
      s.ult.types.add(type);
    }
  }
  n10AfterTrick(g,type,opts.flowGain||6,list.length);
}
function n10AfterTrick(g,type,flowBonus,hitCount=1){
  const s=n10State(g); if(!s) return;
  s.stats.tricks=(s.stats.tricks||0)+1;
  s.foulWindowUntil=(g.time||0)+.18;
  if(type!==s.lastTrick){ s.combo=Math.min(7,(s.combo||0)+1); s.lastTrick=type; }
  if(s.combo>=3) s.nextEmpowered=Math.max(s.nextEmpowered,1);
  n10GainFlow(g,flowBonus);
  if(s.combo===5){ n10SpawnPhantom(g); }
  if(s.combo===7){ n10TriggerNoLookAssist(g); }
  if(s.showboat && !s.showboat.claimed && Math.hypot(g.player.x-s.showboat.x,g.player.y-s.showboat.y)<=s.showboat.r+10){ s.showboat.claimed=true; s.freeTrickUntil=(g.time||0)+1.1; s.nextEmpowered=Math.max(s.nextEmpowered,1); g.player.invuln=Math.max(g.player.invuln,.24); n10GainFlow(g,12,T('SHOWBOAT!','BIỂU DIỄN!')); g.texts.push(new FloatingText(g.player.x,g.player.y-58,T('SHOWBOAT WINDOW','SÂN KHẤU NGẪU HỨNG'),'#f7e271',15)); const w=g.player.weapons.find(x=>x.id===N10_WEAPON); if(w) w.cool=Math.min(w.cool,.05); }
}
function n10ChooseTarget(g,range=720){return g.findCluster(g.player.x,g.player.y,range)||g.findNearest(g.player.x,g.player.y,range)}
function n10Forward(g){return g.lastMoveDir||n10State(g)?.lastDashDir||{x:1,y:0}}
function n10Nearby(g,r=130){return g.grid.queryCircle(g.player.x,g.player.y,r).filter(e=>!e.dead&&!e.isCaptive)}
function n10PickTrick(g){
  const s=n10State(g), p=g.player, f=n10Forward(g), ang=Math.atan2(f.y,f.x), nearby=n10Nearby(g,135);
  const behind=nearby.find(e=>{const a=Math.atan2(e.y-p.y,e.x-p.x);const d=Math.hypot(e.x-p.x,e.y-p.y);return d<84 && absAngle(a,ang)>2.3});
  if(behind) return {type:'sombrero',target:behind,cost:24};
  const ahead=nearby.find(e=>{const a=Math.atan2(e.y-p.y,e.x-p.x);const d=Math.hypot(e.x-p.x,e.y-p.y);return d<92 && absAngle(a,ang)<.4});
  if(ahead) return {type:'rainbow',target:ahead,cost:22};
  let nutPair=null;
  for(let i=0;i<nearby.length&&!nutPair;i++)for(let j=i+1;j<nearby.length&&!nutPair;j++){
    const a=nearby[i],b=nearby[j],sep=Math.hypot(a.x-b.x,a.y-b.y); if(sep<38||sep>92) continue;
    const cx=(a.x+b.x)/2, cy=(a.y+b.y)/2, ca=Math.atan2(cy-p.y,cx-p.x); if(absAngle(ca,ang)>.72) continue;
    const line=pointSegDist(p.x,p.y,a.x,a.y,b.x,b.y); if(line>52) continue; nutPair={type:'nutmeg',pair:[a,b],target:{x:cx,y:cy},cost:26};
  }
  if(nutPair) return nutPair;
  if((s.recentTurnUntil||0)>(g.time||0) && nearby.length) return {type:'elastico',target:nearby[0],cost:18};
  return null;
}
function n10Damage(g,e,amount,w,opts={}){if(!e||e.dead)return;g.damageEnemy(e,amount,{source:w,canCrit:true,knockback:opts.knockback??28,fromX:opts.fromX??g.player.x,fromY:opts.fromY??g.player.y,damageType:opts.damageType});}
function n10DefaultShot(w,s){
  const g=game,t=n10ChooseTarget(g,s.range); if(!t) return; const p=g.player; const dir=Math.atan2(t.y-p.y,t.x-p.x); const emp=n10State(g).nextEmpowered>0; if(emp) n10State(g).nextEmpowered--; const pr=new Projectile({x:p.x,y:p.y,vx:Math.cos(dir+.68)*s.speed,vy:Math.sin(dir+.68)*s.speed,radius:s.size*(emp?1.22:1),damage:s.damage*(emp?1.28:1),life:1.25,color:'#fffdf0',weapon:w,pierce:s.pierce+(emp?1:0),knockback:s.knockback+(emp?12:0),behavior:'curveBall',curveTarget:t,curveStrength:emp?6.4:5.2,explosionRadius:emp?s.area*.78:0,projectileStyle:'football'}); g.projectiles.push(pr); g.audio?.beep?.(280,.035,'square',.012); if(emp) g.texts.push(new FloatingText(p.x,p.y-40,T('SAMBA TOUCH','NHỊP SAMBA'),'#f5df74',12)); n10GainFlow(g,3); }
function n10TrickText(g,text,color='#f6df79'){g.texts.push(new FloatingText(g.player.x,g.player.y-38,text,color,13))}
function n10Elastico(w,s){
  const g=game,p=g.player,t=n10ChooseTarget(g,440); if(!t){n10DefaultShot(w,s); return;}
  const ang=Math.atan2(t.y-p.y,t.x-p.x); const pr=new Projectile({x:p.x,y:p.y,vx:Math.cos(ang+.92)*s.speed,vy:Math.sin(ang+.92)*s.speed,radius:s.size*1.1,damage:s.damage*1.05,life:1.15,color:'#ffffff',weapon:w,pierce:s.pierce+1,knockback:s.knockback+8,behavior:'curveBall',curveTarget:t,curveStrength:7.4,projectileStyle:'football'}); g.projectiles.push(pr);
  const hit=n10Nearby(g,108); for(const e of hit){e.applyStatus?.('slow',.62,e.elite?.22:.32,w); if(!e.isBoss) e.applyStatus?.('confuse',.55,1,w);} n10MarkBeaten(g,hit,'elastico',{flowGain:7}); n10TrickText(g,'ELÁSTICO'); g.effects.push(new WaveEffect(p.x,p.y,76,.22,0,0,w,'rgba(245,223,121,.28)')); g.audio?.beep?.(620,.04,'triangle',.015);
}
function n10Rainbow(w,s,tr){
  const g=game,p=g.player,t=tr?.target||n10ChooseTarget(g,320); if(!t){n10DefaultShot(w,s); return;}
  const dir=normalize(t.x-p.x,t.y-p.y), land={x:t.x+dir.x*48,y:t.y+dir.y*48};
  g.projectiles.push(new Projectile({x:p.x,y:p.y,vx:dir.x*s.speed*.95,vy:dir.y*s.speed*.95,radius:s.size*1.08,damage:s.damage*.75,life:.55,color:'#fff7d6',weapon:w,pierce:0,projectileStyle:'football'}));
  g.effects.push(new PulseDelayEffect(.34,()=>{g.explosion(land.x,land.y,s.area*.68,s.damage*.92,'#f6df79',30,w,false,true); const hits=g.grid.queryCircle(land.x,land.y,s.area*.72).filter(e=>!e.dead); n10MarkBeaten(g,hits,'rainbow',{flowGain:9});}));
  p.x+=dir.x*24; p.y+=dir.y*24; n10State(g).speedBurstUntil=(g.time||0)+.32; n10TrickText(g,'RAINBOW FLICK'); g.texts.push(new FloatingText(land.x,land.y-20,'RAINBOW DROP','#8ce6ff',11)); g.audio?.beep?.(760,.045,'triangle',.016);
}
function n10Nutmeg(w,s,tr){
  const g=game,p=g.player,pair=tr?.pair||[]; const tx=tr?.target?.x||p.x+n10Forward(g).x*84, ty=tr?.target?.y||p.y+n10Forward(g).y*84; const dir=normalize(tx-p.x,ty-p.y);
  g.projectiles.push(new Projectile({x:p.x,y:p.y,vx:dir.x*s.speed,vy:dir.y*s.speed,radius:s.size*.95,damage:s.damage*.95,life:1,color:'#fffef2',weapon:w,pierce:s.pierce+2,knockback:s.knockback+16,projectileStyle:'football'}));
  const enemies=[]; for(const e of pair){ if(!e) continue; n10Damage(g,e,s.damage*1.08,w,{knockback:40}); if(!e.isBoss) e.applyStatus?.('freeze',.14,1,w); enemies.push(e);} if(!enemies.length){enemies.push(...g.grid.queryCircle(tx,ty,56).filter(e=>!e.dead).slice(0,2));}
  n10MarkBeaten(g,enemies,'nutmeg',{flowGain:14}); n10TrickText(g,'CANETA!'); g.audio?.beep?.(540,.04,'square',.016);
}
function n10Sombrero(w,s,tr){
  const g=game,p=g.player,target=tr?.target||n10ChooseTarget(g,160); const f=n10Forward(g); const a=Math.atan2(-f.y,-f.x);
  g.projectiles.push(new Projectile({x:p.x,y:p.y,vx:Math.cos(a)*s.speed*.78,vy:Math.sin(a)*s.speed*.78,radius:s.size,damage:s.damage*.68,life:.45,color:'#f9f7ee',weapon:w,pierce:1,projectileStyle:'football'}));
  g.effects.push(new PulseDelayEffect(.18,()=>{
    const dir=target?normalize(target.x-p.x,target.y-p.y):f;
    g.projectiles.push(new Projectile({x:p.x-dir.x*22,y:p.y-dir.y*22,vx:dir.x*s.speed*.92,vy:dir.y*s.speed*.92,radius:s.size*1.04,damage:s.damage*.92,life:.8,color:'#ffffff',weapon:w,pierce:s.pierce+1,knockback:s.knockback+12,behavior:'curveBall',curveTarget:target||n10ChooseTarget(g,460),curveStrength:4.8,projectileStyle:'football'}));
  }));
  const hit=g.grid.queryCircle(p.x-f.x*42,p.y-f.y*42,72).filter(e=>!e.dead); for(const e of hit) n10Damage(g,e,s.damage*.78,w,{knockback:26}); n10MarkBeaten(g,hit,'sombrero',{flowGain:8}); n10TrickText(g,'SOMBRERO'); g.audio?.beep?.(490,.04,'triangle',.015);
}
ATTACK_BEHAVIORS[N10_WEAPON==='samba_streetball'?'n10SambaStreetball':N10_WEAPON]=function(w,s){
  const g=game;if(!n10Is(g)){return n10DefaultShot(w,s)}
  const st=n10State(g), trick=n10PickTrick(g);
  if(trick){const free=(st.freeTrickUntil||0)>(g.time||0)||!!st.ult; if(free || n10SpendFlow(g,trick.cost)){ if(trick.type==='elastico') return n10Elastico(w,s,trick); if(trick.type==='rainbow') return n10Rainbow(w,s,trick); if(trick.type==='nutmeg') return n10Nutmeg(w,s,trick); if(trick.type==='sombrero') return n10Sombrero(w,s,trick); }}
  n10DefaultShot(w,s);
};

function n10SpawnShowboat(g){
  const s=n10State(g), p=g.player; if(!p) return; const cluster=g.findCluster(p.x,p.y,260); if(!cluster) return; s.showboat={x:lerp(p.x,cluster.x,.62),y:lerp(p.y,cluster.y,.62),r:58,life:2.3,claimed:false}; g.texts.push(new FloatingText(s.showboat.x,s.showboat.y-42,T('SHOWBOAT','SHOWBOAT'),'#f7e271',14)); }
function n10SpawnPhantom(g){const s=n10State(g),f=n10Forward(g),p=g.player; const side={x:-f.y,y:f.x}; s.phantom={x:p.x+side.x*86+f.x*26,y:p.y+side.y*86+f.y*26,life:1.1,max:1.1}; g.texts.push(new FloatingText(s.phantom.x,s.phantom.y-20,T('JOGA','JOGA'),'#8fe4ff',12));}
function n10TriggerNoLookAssist(g){
  const s=n10State(g),p=g.player,f=n10Forward(g),back={x:-f.x,y:-f.y};
  const side={x:-back.y,y:back.x};
  const relay={x:p.x+back.x*46+side.x*54,y:p.y+back.y*46+side.y*54};
  const target=n10ChooseTarget(g,520);
  if(!target) return;
  g.effects.push(new WaveEffect(relay.x,relay.y,40,.26,0,0,{id:N10_WEAPON},'rgba(114,216,255,.28)'));
  g.projectiles.push(new Projectile({x:p.x,y:p.y,vx:back.x*420,vy:back.y*420,radius:4,damage:12*g.player.damageMultiplier,life:.18,color:'#c7f4ff',weapon:null,pierce:0}));
  g.effects.push(new PulseDelayEffect(.12,()=>{
    const dir=normalize(target.x-relay.x,target.y-relay.y);
    g.projectiles.push(new Projectile({x:relay.x,y:relay.y,vx:dir.x*640,vy:dir.y*640,radius:6,damage:22*g.player.damageMultiplier,life:1,color:'#ffffff',weapon:g.player.weapons.find(w=>w.id===N10_WEAPON)||null,pierce:2,knockback:40,behavior:'curveBall',curveTarget:target,curveStrength:4.4,projectileStyle:'football'}));
    g.explosion(target.x,target.y,54,14*g.player.damageMultiplier,'#8fe4ff',32,null,false,true);
  }));
  g.texts.push(new FloatingText(p.x,p.y-60,'NO-LOOK ASSIST','#8fe4ff',13));
}
function n10TriggerFreeKick(g){ const s=n10State(g),spot=s.freeKick; if(!spot)return; const target=g.boss&&!g.boss.dead?g.boss:(g.findCluster(spot.x,spot.y,720)||g.findNearest(spot.x,spot.y,720)); s.freeKick=null; if(!target) return; const dir=Math.atan2(target.y-spot.y,target.x-spot.x); g.projectiles.push(new Projectile({x:spot.x,y:spot.y,vx:Math.cos(dir+.82)*760,vy:Math.sin(dir+.82)*760,radius:8,damage:38*g.player.damageMultiplier,life:1.3,color:'#fff8d1',weapon:g.player.weapons.find(w=>w.id===N10_WEAPON)||null,pierce:4,knockback:70,behavior:'curveBall',curveTarget:target,curveStrength:8.4,explosionRadius:76,projectileStyle:'football'})); g.texts.push(new FloatingText(spot.x,spot.y-30,T('FREE KICK','ĐÁ PHẠT'),'#f7e271',16)); g.audio?.beep?.(880,.06,'triangle',.02); }
function n10FinishUlt(g){
  const s=n10State(g),u=s.ult; if(!u) return; const danced=g.enemies.filter(e=>!e.dead&&u.danced.has(e.id)).sort((a,b)=>Math.hypot(a.x-g.player.x,a.y-g.player.y)-Math.hypot(b.x-g.player.x,b.y-g.player.y)).slice(0,16);
  let last={x:g.player.x,y:g.player.y}; let totalHits=danced.length; for(const e of danced){g.effects.push(new WaveEffect(e.x,e.y,24,.18,0,0,{id:N10_ULT},'rgba(244,217,75,.24)')); g.explosion(e.x,e.y,34,8*g.player.damageMultiplier,'#f2e46f',26,null,false,true); last={x:e.x,y:e.y};}
  const finalTarget=(g.boss&&!g.boss.dead)?g.boss:(g.miniboss&&!g.miniboss.dead?g.miniboss:(g.enemies.filter(e=>!e.dead).sort((a,b)=>(b.elite?1:0)+(b.maxHp||b.hp)-(a.elite?1:0)-(a.maxHp||a.hp))[0]));
  const style=Math.max(1,u.types.size||1), perfect=totalHits>=12 && style>=4 && u.noHit;
  if(finalTarget){const dir=Math.atan2(finalTarget.y-last.y,finalTarget.x-last.x); g.texts.push(new FloatingText(g.player.x,g.player.y-56,'N10',perfect?'#8fe4ff':'#f6df79',18)); g.effects.push(new PulseDelayEffect(.16,()=>{g.projectiles.push(new Projectile({x:last.x,y:last.y,vx:Math.cos(dir+.95)*840,vy:Math.sin(dir+.95)*840,radius:10,damage:(44+Math.min(48,totalHits*2)+style*8)*g.player.damageMultiplier*(perfect?1.18:1),life:1.25,color:perfect?'#9de8ff':'#fff5c1',weapon:g.player.weapons.find(w=>w.id===N10_WEAPON)||null,pierce:6,knockback:88,behavior:'curveBall',curveTarget:finalTarget,curveStrength:10.2,explosionRadius:perfect?118:92,projectileStyle:'football'})); g.texts.push(new FloatingText(finalTarget.x,finalTarget.y-32,perfect?'THE LAST SAMBA · PERFECT':'TRIVELA FINISH',perfect?'#9de8ff':'#f7e271',18));}));}
  s.ult=null; g.vsxN10Ult=null; g.ultimateActive=false; g.ultimateBuff=null; g.ultimateBuffTimer=0; s.flow=55; g.player.recalc();
}

const N10_INIT_BASE=Game.prototype.vsxInitRun;
Game.prototype.vsxInitRun=function(){ const r=N10_INIT_BASE.apply(this,arguments); n10State(this); n10ResetState(this); return r; };
const N10_RECALC_BASE=Player.prototype.recalc;
Player.prototype.recalc=function(){ const r=N10_RECALC_BASE.apply(this,arguments); if(n10Is(game)){ const s=n10State(game); if((s?.speedBurstUntil||0)>(game.time||0)) this.moveSpeed*=1.18; if((s?.bodyFeintUntil||0)>(game.time||0)) this.dodge=Math.min(.45,this.dodge+.12); } return r; };
const N10_DAMAGE_BASE=Player.prototype.takeDamage;
Player.prototype.takeDamage=function(amount,src={}){
  if(n10Is(game)){
    const s=n10State(game); if(s?.ult) s.ult.noHit=false; if(s) s.combo=0;
    if((game.time||0)<(s?.foulWindowUntil||0) && (game.time||0)>(s?.foulCdUntil||0)){
      s.foulCdUntil=(game.time||0)+6.5;
      s.freeKick={x:this.x,y:this.y,life:1.9,max:1.9};
      if(src.enemy && !src.enemy.isBoss){ const n=normalize(src.enemy.x-this.x,src.enemy.y-this.y); src.enemy.x+=n.x*36; src.enemy.y+=n.y*36; src.enemy.applyStatus?.('freeze',.24,1,{id:N10_WEAPON}); }
      game.texts.push(new FloatingText(this.x,this.y-54,'FOUL!','#f7e271',17));
      this.invuln=Math.max(this.invuln,.16);
      return N10_DAMAGE_BASE.call(this,amount*.38,src);
    }
  }
  return N10_DAMAGE_BASE.call(this,amount,src);
};
const N10_UPDATE_BASE=Game.prototype.update;
Game.prototype.update=function(dt){
  const r=N10_UPDATE_BASE.apply(this,arguments);
  const g=this,p=g.player; if(!p) return r; const s=n10State(g); if(!s) return r;
  if(n10Is(g)){
    // movement analysis
    const dx=p.x-(s.lastPos?.x??p.x),dy=p.y-(s.lastPos?.y??p.y),dist=Math.hypot(dx,dy); const ang=dist>.001?Math.atan2(dy,dx):s.lastAng;
    if(dist>1.2){
      if(s.lastAng!=null && ang!=null && absAngle(ang,s.lastAng)>.92 && n10Nearby(g,110).length){ s.recentTurnUntil=(g.time||0)+.75; n10GainFlow(g,3); }
      s.lastAng=ang; s.lastPos={x:p.x,y:p.y};
    }
    // near-miss flow
    if((s.lastProjectileNearMissAt||0)+.18<(g.time||0)){
      for(const pr of g.enemyProjectiles||[]){ if(pr.dead) continue; const d=Math.hypot(pr.x-p.x,pr.y-p.y); if(d>24&&d<58){ s.lastProjectileNearMissAt=g.time||0; n10GainFlow(g,2); break; }}
    }
    // freedom to play cooldown acceleration
    const crowd=n10Nearby(g,150).length; const accel=crowd>=10?.30:crowd>=6?.20:crowd>=3?.10:0; const ww=p.weapons.find(x=>x.id===N10_WEAPON); if(ww&&ww.cool>0&&accel>0) ww.cool=Math.max(0,ww.cool-dt*accel);
    // showboat window
    s.showboatCd=(s.showboatCd||0)-dt; if(s.showboat){ s.showboat.life-=dt; if(s.showboat.life<=0) s.showboat=null; }
    if(!s.showboat && s.showboatCd<=0 && n10Nearby(g,190).length>=4){ n10SpawnShowboat(g); s.showboatCd=6.8; }
    // free kick spot
    if(s.freeKick){ s.freeKick.life-=dt; if(s.freeKick.life<=0) s.freeKick=null; else if(Math.hypot(p.x-s.freeKick.x,p.y-s.freeKick.y)<=26){ n10TriggerFreeKick(g); }}
    if(s.phantom){ s.phantom.life-=dt; if(s.phantom.life<=0) s.phantom=null; }
    if(s.afterimage){ s.afterimage.life-=dt; if(s.afterimage.life<=0) s.afterimage=null; }
    // body feint enemy bait approximation
    if((s.bodyFeintUntil||0)>(g.time||0) && s.afterimage){ for(const e of g.grid.queryCircle(s.afterimage.x,s.afterimage.y,96)){ if(e.dead) continue; e.applyStatus?.('confuse',.12,1,{id:N10_WEAPON}); } }
    // beaten debuff upkeep
    for(const e of g.enemies||[]){ if(e.dead) continue; if((e.vsxN10BeatenUntil||0)>(g.time||0) && !e.isBoss){ e.x+=Math.sin((g.time+e.id)*3)*dt*8*(e.vsxN10BeatenStrength||1); e.y+=Math.cos((g.time+e.id)*2.7)*dt*8*(e.vsxN10BeatenStrength||1);} }
    // ultimate
    if(s.ult){ s.ult.time=Math.max(0,s.ult.time-dt); s.flow=100; g.ultimateActive=true; g.vsxN10Ult=s.ult; if(s.ult.time<=0) n10FinishUlt(g); }
  } else {
    s.showboat=null; s.freeKick=null; s.phantom=null; s.ult=null;
  }
  // n10 dash recharge even if base update already ran
  if(n10Is(g)){
    s.dashMax=2; if(s.dashCharges==null) s.dashCharges=2;
    if(s.dashCharges<s.dashMax){ if(!(s.dashRecharge>0)) s.dashRecharge=4.5; s.dashRecharge=Math.max(0,s.dashRecharge-dt); if(s.dashRecharge<=0){ s.dashCharges=Math.min(s.dashMax,s.dashCharges+1); s.dashRecharge=s.dashCharges<s.dashMax?4.5:0; }} else s.dashRecharge=0;
    g.dashCooldown=s.dashCharges>0?0:(s.dashRecharge||0);
  }
  return r;
};
const N10_TRYDASH_BASE=Game.prototype.tryDash;
Game.prototype.tryDash=function(){
  if(!n10Is(this)) return N10_TRYDASH_BASE.apply(this,arguments);
  const s=n10State(this); if(this.state!=='PLAYING'||this.dashTimer>0) return; if((s.dashCharges||0)<=0) return;
  let dx=0,dy=0; if(this.input.has('KeyW')||this.input.has('ArrowUp'))dy--; if(this.input.has('KeyS')||this.input.has('ArrowDown'))dy++; if(this.input.has('KeyA')||this.input.has('ArrowLeft'))dx--; if(this.input.has('KeyD')||this.input.has('ArrowRight'))dx++;
  if(dx||dy) this.lastMoveDir=normalize(dx,dy);
  const dir={...(this.lastMoveDir||{x:1,y:0})};
  this.dashDir=dir; this.dashTimer=.20; this.player.invuln=Math.max(this.player.invuln,.17); this.stats.dashes++;
  s.dashCharges=Math.max(0,(s.dashCharges||2)-1); if(s.dashCharges<2 && !(s.dashRecharge>0)) s.dashRecharge=4.5; this.dashCooldown=s.dashCharges>0?0:(s.dashRecharge||4.5);
  const second=(this.time||0)-s.lastDashAt<=.8 && s.afterimage; if(!second){ s.afterimage={x:this.player.x,y:this.player.y,life:.8,max:.8,dir:{...dir},fakeDir:{...dir}}; } else { s.bodyFeintUntil=(this.time||0)+.5; s.afterimage.fakeDir={x:-dir.y,y:dir.x}; s.afterimage.life=.5; s.afterimage.max=.5; n10MarkBeaten(this,n10Nearby(this,96),'bodyfeint',{flowGain:10}); this.texts.push(new FloatingText(this.player.x,this.player.y-46,'BODY FEINT','#8fe4ff',13)); }
  s.lastDashAt=this.time||0; s.lastDashDir=dir;
  this.audio?.beep?.(560,.05,'sine',.018);
};
const N10_ULT_BASE=Game.prototype.useUltimate;
Game.prototype.useUltimate=function(){
  if(CHARACTER_DEFINITIONS[this.characterId]?.ultimate!==N10_ULT) return N10_ULT_BASE.apply(this,arguments);
  if(this.state!=='PLAYING'||this.ultimateCharge<100||this.ultimateActive) return;
  const s=n10State(this); this.ultimateCharge=0; this.ultimateActive=true; this.stats.ultimates=(this.stats.ultimates||0)+1; s.flow=100; s.ult={time:11,max:11,danced:new Set(),types:new Set(),dancedCount:0,noHit:true}; this.vsxN10Ult=s.ult; this.ultimateBuff={id:N10_ULT,time:11}; this.ultimateBuffTimer=11; this.player.recalc(); this.audio?.beep?.(920,.16,'triangle',.03); this.texts.push(new FloatingText(this.player.x,this.player.y-56,'THE LAST SAMBA','#f7e271',21));
};

function ensureN10Hud(){
  const timer=document.getElementById('timerHud'); if(!timer) return null;
  let box=document.getElementById('vsxN10Hud');
  if(!box){ box=document.createElement('div'); box.id='vsxN10Hud'; box.innerHTML=`<div class="n10Head"><b>N10 · THE LAST SAMBA</b><span id="n10HudTier">SAMBA FLOW</span></div><div class="n10FlowLabel"><span>${T('FLOW','NHỊP')}</span><span id="n10FlowValue">0 / 100</span></div><div class="n10FlowBar"><div class="n10FlowFill" id="n10FlowFill"></div></div><div class="n10ComboRow"><span>${T('COMBO','COMBO')}</span><span class="n10ComboPill" id="n10ComboValue">×0</span></div><div class="n10Small"><span class="n10Chip" id="n10ComboTag">—</span><span class="n10Chip" id="n10ShowboatState">SHOWBOAT</span><span class="n10Chip" id="n10FreeKickState">FREE KICK</span></div><div class="n10UltWrap" id="n10UltWrap"><div class="n10UltRow"><span>${T('Ultimate active','Tuyệt Kỹ đang hoạt động')}</span><span id="n10UltTimer">11.0s</span></div><div class="n10UltGrid"><div class="n10UltCell">${T('DANCED','DANCED')}<b id="n10UltDanced">0</b></div><div class="n10UltCell">${T('STYLE','STYLE')}<b id="n10UltStyle">×0</b></div><div class="n10UltCell">${T('TRICKS','TRICKS')}<b id="n10UltTricks">0</b></div></div></div>`; timer.after(box); }
  return box;
}
const N10_HUD_BASE=Game.prototype.updateHUD;
Game.prototype.updateHUD=function(force){ const r=N10_HUD_BASE.apply(this,arguments); const box=ensureN10Hud(); if(!box) return r; const active=n10Is(this)||!!n10State(this)?.ult; box.classList.toggle('show',!!active); if(!active) return r; const s=n10State(this),flow=Math.round(s.flow||0); const tier=flow<25?T('Basic','Cơ bản'):flow<50?T('Trick ready','Mở trick'):flow<75?T('Follow-up online','Có follow-up'):T('SAMBA FEVER','SAMBA FEVER'); box.querySelector('#n10HudTier').textContent=tier; box.querySelector('#n10FlowValue').textContent=`${flow} / 100`; box.querySelector('#n10FlowFill').style.width=`${flow}%`; box.querySelector('#n10ComboValue').textContent=`×${s.combo||0}`; box.querySelector('#n10ComboTag').textContent=n10ComboTag(s.combo||0); box.querySelector('#n10ComboTag').classList.toggle('hot',(s.combo||0)>=3); box.querySelector('#n10ShowboatState').textContent=s.showboat?T('SHOWBOAT LIVE','SHOWBOAT SÁNG ĐÈN'):T('SHOWBOAT RECHARGING','SHOWBOAT ĐANG HỒI'); box.querySelector('#n10FreeKickState').textContent=s.freeKick?T('FREE KICK READY','ĐÁ PHẠT SẴN SÀNG'):T('NO FREE KICK','CHƯA CÓ ĐÁ PHẠT'); box.classList.toggle('ulting',!!s.ult); if(s.ult){ box.querySelector('#n10UltTimer').textContent=`${s.ult.time.toFixed(1)}s`; box.querySelector('#n10UltDanced').textContent=String(s.ult.dancedCount||0); box.querySelector('#n10UltStyle').textContent=`×${s.ult.types.size||0}`; box.querySelector('#n10UltTricks').textContent=String(s.stats.tricks||0);} return r; };

const N10_RENDER_BASE=Game.prototype.render;
Game.prototype.render=function(gfx){ const r=N10_RENDER_BASE.apply(this,arguments); const g=gfx||ctx; const s=n10State(this); if(!s||(!n10Is(this)&&!s.ult&&!s.showboat&&!s.freeKick&&!s.phantom&&!s.afterimage)) return r; if(s.showboat){ g.save(); g.translate(s.showboat.x,s.showboat.y); const pulse=1+Math.sin((this.time||0)*6)*.08; g.strokeStyle='rgba(247,226,113,.9)'; g.lineWidth=2; g.beginPath(); g.arc(0,0,s.showboat.r*pulse,0,Math.PI*2); g.stroke(); g.fillStyle='rgba(247,226,113,.15)'; g.beginPath(); g.arc(0,0,s.showboat.r*.78,0,Math.PI*2); g.fill(); g.fillStyle='#f7e271'; g.font='900 16px Arial'; g.textAlign='center'; g.textBaseline='middle'; g.fillText('★',0,0); g.restore(); }
  if(s.freeKick){ g.save(); g.translate(s.freeKick.x,s.freeKick.y); g.strokeStyle='rgba(114,216,255,.88)'; g.lineWidth=2; g.beginPath(); g.arc(0,0,16+Math.sin((this.time||0)*5)*2,0,Math.PI*2); g.stroke(); g.fillStyle='rgba(114,216,255,.12)'; g.beginPath(); g.arc(0,0,12,0,Math.PI*2); g.fill(); g.restore(); }
  if(s.phantom){ g.save(); g.globalAlpha=Math.max(0,s.phantom.life/s.phantom.max*.55); g.fillStyle='#8fe4ff'; g.beginPath(); g.arc(s.phantom.x,s.phantom.y,12,0,Math.PI*2); g.fill(); g.restore(); }
  if(s.afterimage){ const d=s.afterimage; g.save(); g.globalAlpha=Math.max(0,d.life/d.max*.28); g.fillStyle='rgba(255,217,25,.55)'; g.beginPath(); g.arc(d.x,d.y,game.player.radius+2,0,Math.PI*2); g.fill(); if(s.bodyFeintUntil>(this.time||0)){ const fx=d.x+(d.fakeDir?.x||1)*36, fy=d.y+(d.fakeDir?.y||0)*36; g.globalAlpha=.18; g.fillStyle='rgba(114,216,255,.9)'; g.beginPath(); g.arc(fx,fy,game.player.radius+1,0,Math.PI*2); g.fill(); } g.restore(); }
  for(const e of this.enemies||[]){ if(e.dead) continue; if((e.vsxN10BeatenUntil||0)>(this.time||0)){ g.save(); g.fillStyle='rgba(247,226,113,.95)'; g.font='700 9px Arial'; g.textAlign='center'; g.fillText(T('BEATEN','BỊ QUA NGƯỜI'),e.x,e.y-e.size-14); g.restore(); } if((e.vsxN10DancedUntil||0)>(this.time||0)){ g.save(); g.strokeStyle='rgba(114,216,255,.8)'; g.lineWidth=1.4; g.beginPath(); g.arc(e.x,e.y,e.size+7+Math.sin((this.time+e.id)*5)*1.4,0,Math.PI*2); g.stroke(); g.restore(); } }
  return r; };

const N10_SETUP_BASE=VSX.renderSetup;
VSX.renderSetup=function(){ const r=N10_SETUP_BASE.apply(this,arguments); document.querySelectorAll('#vsxCharacterGrid .vsxPick').forEach(card=>{ const id=card.dataset.characterId; if(id!==N10_ID||card.querySelector('.vsxN10SetupBadge')) return; const row=document.createElement('div'); row.className='vsxN10SetupBadge'; row.innerHTML=`<span class="kit">10</span><span><small>${T('LEGENDARY SIGNATURE','DẤU ẤN LEGENDARY')}</small>${esc(T('Bait · Trick Chain · Escape · Create','Nhử địch · Nối trick · Thoát ra · Tạo cơ hội'))}</span>`; card.appendChild(row); }); return r; };
const N10_BEGIN_BASE=VSX.beginRun;
VSX.beginRun=function(){ if(VSX.selectedCharacter===N10_ID && n10SkinOwned() && !VSX.save.loadout.skin) VSX.save.loadout.skin=N10_SKIN; return N10_BEGIN_BASE.apply(this,arguments); };

const N10_ARMORY_BASE=renderArmory;
renderArmory=function(){ const r=N10_ARMORY_BASE.apply(this,arguments); n10InjectPackage(); n10InjectSurvivorCard(); return r; };
function n10InjectSurvivorCard(){ if(typeof ARMORY_TAB==='undefined'||ARMORY_TAB!=='survivors') return; const root=document.getElementById('vsxUnifiedSurvivorGroups')||document.getElementById('vsxArmoryContent'); if(!root||document.getElementById('vsxN10SurvivorCard')) return; let block=root.querySelector('.vsxRarityBlock.legendary .vsxUnifiedSurvivorGrid'); if(!block){ block=document.createElement('section'); block.className='vsxRarityBlock legendary'; block.innerHTML=`<div class="vsxRarityHeader"><div><span class="vsxRarityBadge legendary">LEGENDARY</span><b>${T('FOOTBALL LEGENDS','HUYỀN THOẠI SÂN CỎ')}</b></div><span>1 ${T('SURVIVOR','NHÂN VẬT')}</span></div><div class="vsxShopGrid vsxUnifiedSurvivorGrid"></div>`; root.appendChild(block); block=block.querySelector('.vsxUnifiedSurvivorGrid'); }
  const d=CHARACTER_DEFINITIONS[N10_ID], owned=n10Owned(), card=document.createElement('article'); card.id='vsxN10SurvivorCard'; card.className=`vsxShopCard vsxSurvivorShopCard vsxUnifiedSurvivorCard legendary ${owned?'owned':''}`; card.style.setProperty('--surv-color',N10_GREEN); card.innerHTML=`<div class="vsxUnifiedSurvivorHead"><span class="vsxRarityBadge legendary">LEGENDARY</span><span class="vsxShopOwnedChip ${owned?'owned':''}">${owned?T('OWNED','SỞ HỮU'):T('LOCKED','CHƯA SỞ HỮU')}</span></div><h3>${esc(d.name[VSX.lang])} · N10</h3><p class="vsxUnifiedSurvivorDesc">${esc(d.desc[VSX.lang])}</p><div class="vsxSurvivorMeta vsxUnifiedSurvivorMeta"><span><b>${T('Weapon','Vũ khí')}:</b> ${esc(n10WeaponName())}</span><span><b>${T('Ultimate','Tuyệt Kỹ')}:</b> ${esc(n10UltInfo().name[VSX.lang])}</span></div><div class="vsxUnifiedSurvivorFooter"><div><p class="vsxPrice">${owned?T('OWNED','ĐÃ SỞ HỮU'):`${N10_SURVIVOR_COST.toLocaleString('en-US')} ${T('SCORE','ĐIỂM')}`}</p><div class="n10SmallNote">${T('Legendary survivor only. Cosmetic skin lives in the bundle below.','Mua nhân vật sẽ mở Neymar và Samba Đường Phố. Trang phục Brazil Số 10 nằm trong gói THE LAST SAMBA bên dưới.')}</div></div><button ${owned||!walletCan('score',N10_SURVIVOR_COST)?'disabled':''}>${owned?T('OWNED','ĐÃ SỞ HỮU'):T('BUY','MUA')}</button></div>`; card.querySelector('button').onclick=()=>{ if(n10BuySurvivor()) renderArmory(); }; block.prepend(card); }
function n10JerseyMarkup(mode='hero'){
  const mini=mode==='mini';
  return `<div class="n10BackCard ${mini?'mini':''}" data-n10-jersey="${mode}"><div class="n10BackName">NEYMAR JR</div><div class="n10BackNo">10</div><div class="n10BackMeta"><span>BRAZIL</span><b>N10</b></div></div>`;
}
function n10PackageMarkup(){
  const owned=n10Owned(), bundle=n10BundleOwned(), price=n10PackagePrice();
  const title=T('THE LAST SAMBA · N10','THE LAST SAMBA · VŨ CÔNG SAMBA CUỐI CÙNG');
  const rosterCount=owned?T('1 / 1 SURVIVOR','1 / 1 NHÂN VẬT'):T('Includes survivor + skin + effect','Gồm Neymar + trang phục + hiệu ứng');
  return `<section id="vsxN10Package"><div class="n10Hero">
    <div class="n10HeroHead"><div>
      <div class="n10Kicker">${T('FOOTBALL LEGENDS · PREMIUM BUNDLE','HUYỀN THOẠI SÂN CỎ · GÓI CAO CẤP')}</div>
      <h3>${title}</h3>
      <p>${T(
        'A premium Samba-line bundle built around Neymar: the Legendary survivor, Samba Streetball, Brazil No.10 cosmetics, dribble-path aura and a complete N10 presentation across Shop, Survivor Pick, Collection and the in-run HUD.',
        'Gói Samba cao cấp dành riêng cho Neymar: mở N10 Legendary, Samba Đường Phố, bộ Brazil Số 10, Hào Quang Đường Rê và toàn bộ giao diện riêng của Neymar từ Cửa Hàng, Chọn Nhân Vật, Bộ Sưu Tập đến HUD trong trận.'
      )}</p>
    </div><div class="n10Price">
      <small>${bundle?T('STATUS','TRẠNG THÁI'):T('CURRENT BUNDLE PRICE','GIÁ GÓI HIỆN TẠI')}</small>
      <b>${bundle?T('OWNED','ĐÃ SỞ HỮU'):`${price.toLocaleString('en-US')} ${T('SCORE','ĐIỂM')}`}</b>
      <span>${rosterCount}</span>
    </div></div>

    <div class="n10BundleVisual">${n10JerseyMarkup('hero')}
      <div class="n10Detail">
        <div class="n10DetailCard"><span>${T('SIGNATURE GAMEPLAY','LỐI CHƠI ĐẶC TRƯNG')}</span><b>${T('TRICK → BAIT → ESCAPE → CREATE','KỸ THUẬT → NHỬ ĐỊCH → THOÁT HIỂM → KIẾN TẠO')}</b><p>${T(
          'Neymar deliberately plays inside danger. He spends Samba Flow on situational tricks, baits the swarm into bad angles, then turns that chaos into an escape route or a new attacking lane.',
          'Neymar chủ động áp sát đàn quái. Cậu tiêu Nhịp Samba để tung kỹ thuật đúng tình huống, dụ đối thủ lao sai hướng rồi biến sự hỗn loạn thành đường thoát hoặc một góc tấn công mới.'
        )}</p></div>
        <div class="n10DetailCard"><span>${T('N10 COSMETIC SET','BỘ MỸ THUẬT N10')}</span><b>${T('Brazil No.10 Signature Look','DẤU ẤN BRAZIL SỐ 10')}</b><p>${T(
          'A clean Brazil No.10 back-print treatment in the same visual language as the Royal Three cards: yellow shirt color, NEYMAR JR in green and a large green 10. No extra shirt frame.',
          'Hiển thị lưng áo Brazil số 10 theo đúng ngôn ngữ card của bộ ba Real: nền áo vàng, tên NEYMAR JR màu xanh lá và số 10 xanh lớn. Không thêm khung hình áo.'
        )}</p></div>
        <div class="n10DetailCard"><span>${T('N10 HUD EXPERIENCE','HUD CHIẾN ĐẤU N10')}</span><b>${T('Samba Flow · Combo · Showboat · Free Kick','Nhịp Samba · Combo · Biểu Diễn · Đá Phạt')}</b><p>${T(
          'The dedicated N10 HUD tracks Flow, combo milestones, Showboat risk windows, Free Kick opportunities and Ultimate style diversity without crowding the existing combat HUD.',
          'HUD riêng của N10 theo dõi Nhịp Samba, các mốc combo, Cửa Sổ Biểu Diễn đầy rủi ro, cơ hội Đá Phạt và độ đa dạng kỹ thuật trong Tuyệt Kỹ mà không làm rối HUD chiến đấu hiện có.'
        )}</p></div>
        <div class="n10DetailCard"><span>${T('EXCLUSIVE SET EFFECT','HIỆU ỨNG ĐỘC QUYỀN')}</span><b>${T('Dribble Path Aura','HÀO QUANG ĐƯỜNG RÊ')}</b><p>${T(
          'A cosmetic-only dribble-path ambience and movement trail. Toggle it below or from the Admin QA panel; it never adds combat stats.',
          'Hiệu ứng thuần mỹ thuật tạo đường rê và vệt chuyển động riêng cho Neymar. Có thể bật/tắt ngay bên dưới hoặc trong bảng kiểm thử Admin; hoàn toàn không cộng chỉ số chiến đấu.'
        )}</p></div>
      </div>
    </div>

    <div class="n10ActionRow">
      <button id="vsxN10BuyBundle" ${bundle||!walletCan('score',price)?'disabled':''}>${bundle?T('PACKAGE OWNED','ĐÃ SỞ HỮU TRỌN GÓI'):T('BUY BUNDLE','MUA TRỌN GÓI')+` · ${price.toLocaleString('en-US')} ${T('SCORE','ĐIỂM')}`}</button>
      <button id="vsxN10ToggleFx" class="secondary" ${!n10SkinOwned()?'disabled':''}>${n10EffectOn()?T('SET EFFECT: ON','HIỆU ỨNG: BẬT'):T('SET EFFECT: OFF','HIỆU ỨNG: TẮT')}</button>
    </div>

    <div class="n10Bonus"><b>${T('PACKAGE HIGHLIGHT','ĐIỂM NỔI BẬT CỦA GÓI')}</b> · ${T(
      'This is more than a skin unlock. The bundle completes the N10 identity across Shop presentation, Survivor Pick, Collection, Admin QA, character cosmetics and the dedicated gameplay HUD.',
      'Đây không chỉ là một gói trang phục. Gói THE LAST SAMBA hoàn thiện toàn bộ bản sắc N10: cách trưng bày trong Cửa Hàng, Chọn Nhân Vật, Bộ Sưu Tập, bảng kiểm thử Admin, mỹ thuật nhân vật và HUD lối chơi riêng.'
    )}</div>

    <div class="n10SingleCard"><div class="n10MiniKit">${n10JerseyMarkup('mini')}</div><div>
      <h4 style="margin:0 0 4px;color:#fff">${esc(CHARACTER_DEFINITIONS[N10_ID].name[VSX.lang])} · N10</h4>
      <p>${T(
        'Legendary Neymar revolves around Samba Flow, Showboat Window, Draw the Foul, Free Kick Spot, non-repeating trick combos and the Body Feint double dash.',
        'Neymar Legendary xoay quanh Nhịp Samba, Cửa Sổ Biểu Diễn, cơ chế Câu Lỗi → Đá Phạt, combo khuyến khích đổi kỹ thuật liên tục và Dash kép Body Feint để đánh lạc hướng đối thủ.'
      )}</p>
      <div class="n10Meta"><span>${esc(n10WeaponName())}</span><span>${esc(n10UltInfo().name[VSX.lang])}</span><span>${esc(SKIN_DEFINITIONS[N10_SKIN].name[VSX.lang])}</span></div>
      <div class="n10SmallNote">${T(
        'Already own Neymar? The package automatically drops to the cosmetic/FX upgrade price.',
        'Đã sở hữu Neymar? Giá gói sẽ tự giảm; bạn chỉ trả phần trang phục và hiệu ứng còn thiếu.'
      )}</div>
    </div><button id="vsxN10BuySurvivor" ${owned||!walletCan('score',N10_SURVIVOR_COST)?'disabled':''}>${owned?T('OWNED','ĐÃ SỞ HỮU'):T('BUY SURVIVOR','MUA NHÂN VẬT')+` · ${N10_SURVIVOR_COST.toLocaleString('en-US')} ${T('SCORE','ĐIỂM')}`}</button></div>
  </div></section>`;
}
function n10InjectPackage(){ if(typeof ARMORY_TAB==='undefined'||ARMORY_TAB!=='packages') return; const c=document.getElementById('vsxArmoryContent'); if(!c) return; const old=document.getElementById('vsxN10Package'); if(old) old.remove(); const host=document.createElement('div'); host.innerHTML=n10PackageMarkup(); c.prepend(host.firstElementChild); document.getElementById('vsxN10BuyBundle')?.addEventListener('click',()=>{ if(n10BuyBundle()) renderArmory();}); document.getElementById('vsxN10BuySurvivor')?.addEventListener('click',()=>{ if(n10BuySurvivor()) renderArmory();}); document.getElementById('vsxN10ToggleFx')?.addEventListener('click',()=>{ n10SetEffect(!n10EffectOn()); renderArmory();}); }

const N10_CUST_BASE=renderCustomization;
renderCustomization=function(c){
  N10_CUST_BASE.apply(this,arguments);
  const grid=document.getElementById('vsxSkinGrid'); if(!grid) return;
  const ids=Object.keys(SKIN_DEFINITIONS);
  [...grid.children].forEach((card,i)=>{
    const sid=ids[i]; if(sid!==N10_SKIN) return;
    const own=n10SkinOwned(), btn=card.querySelector('button'), price=card.querySelector('.vsxPrice');
    card.classList.add('vsxN10SkinCard'); card.dataset.skinId=N10_SKIN;
    const old=card.querySelector('.n10SkinJerseyPreview'); if(old) old.remove();
    const preview=document.createElement('div'); preview.className='n10SkinJerseyPreview'; preview.innerHTML=n10JerseyMarkup('hero');
    card.prepend(preview);
    const desc=card.querySelector('p:not(.vsxPrice)');
    if(desc) desc.textContent=T('Brazil No.10 back print: yellow base, NEYMAR JR in green and a large green 10 — clean and consistent with the other football skins.','Lưng áo Brazil số 10: nền vàng, tên NEYMAR JR màu xanh và số 10 xanh lớn — gọn và đồng bộ với các skin cầu thủ khác.');
    if(btn&&!own){ btn.disabled=true; btn.textContent=T('UNLOCK VIA THE LAST SAMBA','MỞ QUA GÓI THE LAST SAMBA'); }
    if(price&&!own){ price.textContent=T('THE LAST SAMBA exclusive jersey skin.','Skin áo đấu độc quyền của gói THE LAST SAMBA.'); }
  });
};

const N10_CODEX_ENTRIES_BASE=VSX.codexEntries;
VSX.codexEntries=function(cat){ const rows=N10_CODEX_ENTRIES_BASE.call(VSX,cat); if(cat==='packages'){ return [...rows,[N10_PACKAGE,T('THE LAST SAMBA · N10','THE LAST SAMBA · VŨ CÔNG SAMBA CUỐI CÙNG'),T('Neymar bundle with survivor, signature weapon, Brazil No.10 skin and dribble-path aura effect.','Gói Neymar gồm nhân vật N10, vũ khí đặc trưng, trang phục Brazil Số 10 và Hào Quang Đường Rê.')]]; } return rows; };
const N10_CODEX_BASE=VSX.renderCodex;
VSX.renderCodex=function(cat){ const r=N10_CODEX_BASE.call(this,cat); if(cat==='characters'){ document.querySelectorAll('#vsxCodexList .vsxCharacterCodexCard').forEach(card=>{ const id=card.dataset.codexId; if(id!==N10_ID) return; const head=card.querySelector('.vsxCharacterCodexHead'); if(head && !head.querySelector('.vsxN10CollectionBadge')){ const b=document.createElement('span'); b.className='vsxN10CollectionBadge'; b.textContent='THE LAST SAMBA'; head.appendChild(b);} const detail=card.querySelector('.vsxCharacterCodexDetail'); if(detail && !detail.querySelector('.vsxN10Extra')){ const div=document.createElement('div'); div.className='vsxN10Extra'; div.innerHTML=`<div><b>${T('Signature systems','Hệ độc quyền')}:</b> ${esc(T('Samba Flow · Showboat Window · Draw The Foul · Free Kick Spot · Trick Diversity Combo · Body Feint Dash','Nhịp Samba · Showboat Window · Câu Lỗi · Điểm Đá Phạt · Combo đa dạng trick · Dash Body Feint'))}</div><div class="vsxUltHow"><b>${T('How the Ultimate plays','Trải nghiệm Tuyệt Kỹ')}:</b> ${esc(n10UltInfo().how[VSX.lang])}</div>`; detail.appendChild(div);} }); }
  if(cat==='packages'){ const list=document.getElementById('vsxCodexList'); if(list&&!list.querySelector('[data-n10-package]')){ const e=document.createElement('div'); e.className='vsxCodexItem'; e.dataset.n10Package='1'; e.innerHTML=`<div><b>${T('THE LAST SAMBA · N10','THE LAST SAMBA · VŨ CÔNG SAMBA CUỐI CÙNG')}</b><span class="vsxN10CollectionBadge">${n10BundleOwned()?T('OWNED','ĐÃ SỞ HỮU'):T('INCOMPLETE','CHƯA HOÀN TẤT')}</span></div><div style="margin-top:7px">${esc(T('Neymar with signature weapon, Brazil No.10 skin and premium aura presentation.','Neymar cùng Samba Đường Phố, trang phục Brazil Số 10 và bộ hiệu ứng mỹ thuật cao cấp.'))}</div><div class="vsxPkgCollection"><div><small>${esc(CHARACTER_DEFINITIONS[N10_ID].name[VSX.lang])}</small><b>${esc(n10WeaponName())}</b><small>${esc(SKIN_DEFINITIONS[N10_SKIN].name[VSX.lang])}</small></div></div>`; list.appendChild(e); } }
  return r; };
const N10_SHOW_COLLECTION_BASE=VSX.showCollection;
VSX.showCollection=function(){ const r=N10_SHOW_COLLECTION_BASE.apply(this,arguments); const b=document.getElementById('vsxPackageCodexTab'); if(b){ const owned=[window.VSX_FOOTBALL_PACKAGE?.owned?.(),window.VSX_DC_PACKAGE?.owned?.(),window.VSX_GOAT_RIVALS?.owned?.(),n10BundleOwned()].filter(Boolean).length; b.textContent=`${T('PACKAGES','GÓI NHÂN VẬT')} ${owned}/4`; } return r; };

function n10AdminInject(){ const grid=document.querySelector('#vsxAdminContent .vsxAdminGrid'); if(!grid||!window.VSX_ADMIN?.open||!['meta','loadout','player','collection'].includes(VSX_ADMIN.tab)||document.getElementById('vsxAdminN10Card')) return; const c=document.createElement('div'); c.id='vsxAdminN10Card'; c.className='vsxAdminCard'; c.innerHTML=`<h3>THE LAST SAMBA · N10 QA</h3><p>${T('Unlock Neymar, apply the Brazil No.10 bundle, add the signature weapon and live-test the custom HUD, Free Kick flow and Ultimate finale.', 'Mở khóa Neymar, cấp bộ Brazil Số 10, thêm vũ khí đặc trưng và test trực tiếp HUD riêng, flow Đá Phạt cùng màn kết Ultimate.')}</p><div class="row"><button id="admN10Unlock">${T('UNLOCK SURVIVOR','MỞ NHÂN VẬT')}</button><button id="admN10Bundle">${T('UNLOCK FULL BUNDLE','MỞ TRỌN GÓI')}</button><button id="admN10Fx">${n10EffectOn()?T('FX ON','FX BẬT'):T('FX OFF','FX TẮT')}</button></div><div class="row"><button id="admN10Next">${T('SET NEXT RUN','CHỌN TRẬN SAU')}</button><button id="admN10Weapon">${T('ADD WEAPON','THÊM VŨ KHÍ')}</button><button id="admN10Ult">${T('LIVE TEST ULT','TEST ULT NGAY')}</button></div>`; grid.appendChild(c); c.querySelector('#admN10Unlock').onclick=()=>{ n10Grant(false); VSX.announce('ADMIN',T('Neymar unlocked','Đã mở Neymar'),N10_COLOR); }; c.querySelector('#admN10Bundle').onclick=()=>{ n10Grant(true); VSX.save.loadout.skin=N10_SKIN; window.vsxSave?.(); VSX.announce('ADMIN',T('Full N10 bundle unlocked','Đã mở trọn gói N10'),N10_COLOR); }; c.querySelector('#admN10Fx').onclick=()=>{ n10SetEffect(!n10EffectOn()); c.querySelector('#admN10Fx').textContent=n10EffectOn()?T('FX ON','FX BẬT'):T('FX OFF','FX TẮT'); }; c.querySelector('#admN10Next').onclick=()=>{ n10Grant(true); VSX.selectedCharacter=N10_ID; VSX.save.loadout.skin=N10_SKIN; window.vsxSave?.(); VSX.announce('ADMIN',T('Neymar selected for next run','Đã chọn Neymar cho trận sau'),N10_COLOR); }; c.querySelector('#admN10Weapon').onclick=()=>{ if(!game.player)return VSX.announce('ADMIN',T('START A RUN FIRST','HÃY VÀO TRẬN TRƯỚC'),'#ff9b71'); n10Grant(false); if(!game.player.weapons.some(w=>w.id===N10_WEAPON)){ if(game.player.weapons.length>=game.player.weaponSlots) game.player.weapons.shift(); game.player.addWeapon(N10_WEAPON); } game.updateHUD?.(true); }; c.querySelector('#admN10Ult').onclick=()=>{ if(!game.player)return VSX.announce('ADMIN',T('START A RUN FIRST','HÃY VÀO TRẬN TRƯỚC'),'#ff9b71'); n10Grant(true); game.characterId=N10_ID; VSX.selectedCharacter=N10_ID; VSX.save.loadout.skin=N10_SKIN; if(!game.player.weapons.some(w=>w.id===N10_WEAPON)){ if(game.player.weapons.length>=game.player.weaponSlots) game.player.weapons.shift(); game.player.addWeapon(N10_WEAPON);} const s=n10State(game); s.ult=null; game.ultimateActive=false; game.ultimateCharge=100; game.useUltimate(); game.updateHUD?.(true); }; }
if(window.VSX_ADMIN){ const op=VSX_ADMIN.openPanel; if(typeof op==='function') VSX_ADMIN.openPanel=function(){ const r=op.apply(this,arguments); queueMicrotask(n10AdminInject); return r; }; const content=document.getElementById('vsxAdminContent'); if(content) new MutationObserver(()=>{ if(VSX_ADMIN?.open) queueMicrotask(n10AdminInject); }).observe(content,{childList:true,subtree:false}); }

const N10_SKIN_UPDATE_BASE=Player.prototype.update;
Player.prototype.update=function(dt){ const r=N10_SKIN_UPDATE_BASE.apply(this,arguments); const skin=VSX.save?.loadout?.skin; if(skin!==N10_SKIN){ if(this.vsxN10Trail?.length) this.vsxN10Trail.length=0; return r; } this.vsxN10Trail ||= []; const prevX=this._n10PrevX??this.x, prevY=this._n10PrevY??this.y; const d=Math.hypot(this.x-prevX,this.y-prevY); if(d>4){ this.vsxN10Trail.push({x:prevX,y:prevY,life:.38,max:.38,size:this.radius*.84}); if(this.vsxN10Trail.length>14) this.vsxN10Trail.shift(); } this._n10PrevX=this.x; this._n10PrevY=this.y; for(const t of this.vsxN10Trail) t.life-=dt; this.vsxN10Trail=this.vsxN10Trail.filter(t=>t.life>0); return r; };
const N10_SKIN_RENDER_BASE=Player.prototype.render;
function n10DrawBrazilJersey(g,p,s){
  const r=(p.radius||15)+1, t=game.time||0, flow=(s?.flow||0)/100;
  g.save();
  if(p.vsxN10Trail?.length&&n10EffectOn()){
    for(const q of p.vsxN10Trail){
      const a=Math.max(0,q.life/q.max);
      g.globalAlpha=a*.16; g.strokeStyle='rgba(246,218,39,.70)'; g.lineWidth=1.35; g.beginPath(); g.arc(q.x,q.y,q.size*.82,0,Math.PI*2); g.stroke();
      g.globalAlpha=a*.10; g.fillStyle='rgba(17,132,79,.72)'; g.beginPath(); g.arc(q.x,q.y,q.size*.50,0,Math.PI*2); g.fill();
    }
  }
  g.globalAlpha=1;
  g.translate(p.x,p.y);
  // Same compact presentation style as K10/V7/J5: clean colored body + back-print identity.
  g.shadowBlur=8; g.shadowColor='rgba(246,218,39,.24)';
  g.fillStyle='#f6dc27'; g.beginPath(); g.arc(0,0,r*.98,0,Math.PI*2); g.fill();
  g.strokeStyle='#0f7b48'; g.lineWidth=1.8; g.beginPath(); g.arc(0,0,r*.98,0,Math.PI*2); g.stroke();
  g.strokeStyle='rgba(255,255,255,.38)'; g.lineWidth=1.0; g.beginPath(); g.moveTo(-r*.78,-r*.68); g.lineTo(r*.78,-r*.68); g.stroke();
  g.fillStyle='#0b7645'; g.textAlign='center'; g.textBaseline='top';
  g.font=`900 ${Math.max(4.4,r*.27)}px Arial`;
  g.fillText('NEYMAR JR',0,-r*.64);
  g.font=`900 ${Math.max(10.8,r*.86)}px Arial Black,Arial`; g.textBaseline='middle';
  g.fillText('10',0,1);
  if(flow>=.75){g.globalAlpha=.55;g.strokeStyle='rgba(246,218,39,.82)';g.lineWidth=1.2;g.beginPath();g.arc(0,0,r+5+Math.sin(t*4)*.8,0,Math.PI*2);g.stroke();}
  g.restore();
}
Player.prototype.render=function(g){
  N10_SKIN_RENDER_BASE.call(this,g);
  if(VSX.save?.loadout?.skin!==N10_SKIN||(!n10Is(game)&&VSX.selectedCharacter!==N10_ID)) return;
  n10DrawBrazilJersey(g,this,n10State(game)||{});
};

const N10_PROJECTILE_RENDER_BASE=Projectile.prototype.render;
Projectile.prototype.render=function(g){
  N10_PROJECTILE_RENDER_BASE.call(this,g);
  if(this.owner==='enemy'||this.projectileStyle!=='football'||this.weapon?.id!==N10_WEAPON) return;
  const r=(this.radius||6)+5.5, a=(this.age||0)*5.6;
  g.save(); g.translate(this.x,this.y); g.rotate(a);
  const halo=g.createRadialGradient(0,0,r*.22,0,0,r*1.55);
  halo.addColorStop(0,'rgba(255,255,255,0)');
  halo.addColorStop(.48,'rgba(246,218,39,.18)');
  halo.addColorStop(.78,'rgba(17,132,79,.16)');
  halo.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle=halo; g.beginPath(); g.arc(0,0,r*1.45,0,Math.PI*2); g.fill();
  g.shadowBlur=10; g.shadowColor='rgba(246,218,39,.55)';
  g.strokeStyle='rgba(246,218,39,.96)'; g.lineWidth=1.55; g.beginPath(); g.arc(0,0,r,0,Math.PI*1.35); g.stroke();
  g.shadowColor='rgba(17,132,79,.52)';
  g.strokeStyle='rgba(17,132,79,.94)'; g.lineWidth=1.35; g.beginPath(); g.arc(0,0,r*1.18,Math.PI*.72,Math.PI*1.92); g.stroke();
  g.fillStyle='rgba(255,249,195,.95)';
  for(let i=0;i<3;i++){const ang=-a*1.2+i*Math.PI*2/3;g.globalAlpha=.62;g.beginPath();g.arc(Math.cos(ang)*r*1.05,Math.sin(ang)*r*1.05,1.35,0,Math.PI*2);g.fill();}
  g.restore();
};

window.__N10_SELFTEST__=function(){ const errs=[]; if(!CHARACTER_DEFINITIONS[N10_ID]) errs.push('character missing'); if(!WEAPON_DEFINITIONS[N10_WEAPON]) errs.push('weapon missing'); if(CHARACTER_DEFINITIONS[N10_ID]?.ultimate!==N10_ULT) errs.push('ultimate id mismatch'); if(SKIN_DEFINITIONS[N10_SKIN]?.characterOnly!==N10_ID) errs.push('skin mismatch'); if(typeof ATTACK_BEHAVIORS.n10SambaStreetball!=='function') errs.push('attack behavior missing'); if(typeof n10JerseyMarkup!=='function'||!n10JerseyMarkup('hero').includes('n10BackCard')||!n10JerseyMarkup('hero').includes('NEYMAR JR')) errs.push('back-print markup missing'); if(typeof n10DrawBrazilJersey!=='function') errs.push('gameplay back-print renderer missing'); const currentAura=!!(window.VSX_FOOTBALL_SIMPLE_FX?.selfTest?.().n10Aura)|| (!!Projectile.prototype.render&&String(Projectile.prototype.render).includes('N10_WEAPON')); if(!currentAura) errs.push('N10 ball aura authority missing'); return {ok:errs.length===0, errors:errs, skin:SKIN_DEFINITIONS[N10_SKIN]?.name, backPrintMarkup:n10JerseyMarkup('mini').includes('n10BackCard'), spriteRenderer:typeof n10DrawBrazilJersey==='function',ballAura:currentAura,authority:window.VSX_FOOTBALL_SIMPLE_FX?'VSX_FOOTBALL_SIMPLE_FX':'legacy'}; };

queueMicrotask(()=>{ n10EnsureSave(); try{ if(VSX.save?.meta?.unlockedCharacters?.[N10_ID]) VSX.save.meta.unlockedWeapons[N10_WEAPON]=true; window.vsxSave?.(); }catch(e){} if(typeof renderArmory==='function'&&typeof ARMORY_TAB!=='undefined'&&['survivors','packages'].includes(ARMORY_TAB)) renderArmory(); if(typeof VSX?.renderSetup==='function') try{ VSX.renderSetup(); }catch(e){} });
window.VSX_LAST_SAMBA={id:N10_PACKAGE,character:N10_ID,weapon:N10_WEAPON,skin:N10_SKIN,buyBundle:n10BuyBundle,buySurvivor:n10BuySurvivor,grant:n10Grant,owned:n10BundleOwned,selfTest:window.__N10_SELFTEST__};
})();
