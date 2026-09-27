(function(){
'use strict';
const TAG='[VSX GAMEPLAY CLARITY]';
const L=(en,vi)=>(typeof VSX!=='undefined'&&VSX.lang==='vi')?vi:en;

/* ---------- ALLY HUD: structural top-3 ceiling; Settings authority applies final 2/3/auto-1 policy ---------- */
const ALLY_HUD_BASE=renderStoryAllyHud;
function cardHpRatio(card){const bar=card?.querySelector?.('.vsxAllyBar i');if(!bar)return 0;const n=parseFloat(bar.style.width||'0');return Number.isFinite(n)?n:0}
renderStoryAllyHud=function(g){
  const r=ALLY_HUD_BASE(g),el=document.getElementById('vsxAllyHud');if(!el)return r;
  const oldMore=[...el.querySelectorAll('.vsxAllyCollapsed')];oldMore.forEach(x=>x.remove());
  const cards=[...el.querySelectorAll('.vsxAllyCard')];
  cards.forEach((c,i)=>{c.style.display='';c.dataset.vsxHudOrder=String(i)});
  cards.sort((a,b)=>{
    const dh=cardHpRatio(b)-cardHpRatio(a);if(Math.abs(dh)>.001)return dh;
    return Number(b.dataset.vsxHudOrder||0)-Number(a.dataset.vsxHudOrder||0); // newest first when equally healthy
  });
  const head=el.querySelector('.vsxAllyHead'),objective=el.querySelector('.vsxRecruitObjective');
  /* HUD order authority: header -> recruitment notice -> up to 3 healthiest allies -> +N. */
  let cursor=head;
  if(objective){objective.classList.toggle('vsxNovelObjective',!!window.VSX_NOVEL_ALLIES?.state?.().active);if(cursor){cursor.after(objective);cursor=objective}else{el.prepend(objective);cursor=objective}}
  const shown=3; // structural ceiling; final Settings HUD policy may show 2 or auto-compact to 1
  for(let i=0;i<cards.length;i++){
    const c=cards[i];c.style.display=i<shown?'':'none';
    if(cursor){cursor.after(c);cursor=c}else{el.appendChild(c);cursor=c}
  }
  if(cards.length>shown){
    const more=document.createElement('div');more.className='vsxAllyCollapsed';more.textContent=`+${cards.length-shown} ${L('MORE ALLIES','ĐỒNG MINH KHÁC')}`;
    /* Place collapsed count after the last visible card, before hidden DOM cards. */
    const lastVisible=cards[Math.min(shown,cards.length)-1];if(lastVisible)lastVisible.after(more);else if(cursor)cursor.after(more);else el.appendChild(more);
  }
  el.style.setProperty('overflow','hidden','important');
  queueMicrotask(()=>{try{if(innerWidth<=930||getComputedStyle(el).display==='none')return;const stats=document.getElementById('statsHud'),act=document.getElementById('vsxActionHud');if(!stats||!act)return;const sr=stats.getBoundingClientRect(),ar=act.getBoundingClientRect(),er=el.getBoundingClientRect();const gap=7,minTop=sr.bottom+gap,maxTop=ar.top-er.height-gap;const top=Math.max(minTop,Math.min(264,maxTop));el.style.setProperty('top',Math.round(top)+'px','important')}catch{}});
  const ns=window.VSX_NOVEL_ALLIES?.state?.();
  if(ns?.active==='mobius'&&ns.data){const pct=Math.min(100,Math.round(Math.abs(ns.data.turn||0)/(Math.PI*2)*100)),m=document.getElementById('vsxNovelRecruitMobile');if(m)m.textContent=`${L('RUN AROUND BLUE ANCHOR','CHẠY QUANH NEO XANH')} • ${L('STAY BETWEEN RINGS','GIỮ GIỮA 2 VÒNG')} • ${pct}%`}
  return r;
};

/* ---------- LASER CORRIDOR: segmented moving gaps + faster lasers ---------- */
const LASER_INIT_BASE=initTrial, LASER_UPDATE_BASE=updateTrial, LASER_RENDER_BASE=renderTrial;
function laserLinePos(d,l){return l.axis===0?((d.time*l.speed*170+l.phase*100)%900-20):((d.time*l.speed*125+l.phase*80)%520-18)}
function laserGapPos(d,l){
  const wave=Math.sin(d.time*(l.gapSpeed||.75)+(l.gapPhase||0));
  return l.axis===0?242+wave*155:430+wave*285;
}
function inLaserGap(d,l){const gp=laserGapPos(d,l),half=l.gapHalf||58;return l.axis===0?Math.abs(d.p.y-gp)<=half:Math.abs(d.p.x-gp)<=half}
initTrial=function(id){
  const d=LASER_INIT_BASE(id);if(id!=='laser')return d;
  d.limit=16.5;d.speed=295;d.p={x:430,y:242};d.shield=3;d.hits=0;d.hitCd=0;d.grace=1.15;d.perfect=true;
  d.lasers=[
    {axis:0,phase:0,speed:.43,gapPhase:.25,gapSpeed:.82,gapHalf:58},
    {axis:1,phase:1.35,speed:.40,gapPhase:2.10,gapSpeed:.72,gapHalf:60},
    {axis:0,phase:2.70,speed:.49,gapPhase:4.15,gapSpeed:.90,gapHalf:56}
  ];
  return d;
};
updateTrial=function(dt){
  const d=VSX_TRIAL?.data;if(!d||d.id!=='laser')return LASER_UPDATE_BASE(dt);
  dt=Math.min(.05,Math.max(0,dt||0));d.time+=dt;
  if(d.time>=d.limit){finishTrial(true,(d.hits||0)===0);return}
  trialMove(dt,d);d.hitCd=Math.max(0,(d.hitCd||0)-dt);d.grace=Math.max(0,(d.grace||0)-dt);
  if(d.grace>0)return;
  for(const l of d.lasers){
    const pos=laserLinePos(d,l),lineHit=l.axis===0?Math.abs(d.p.x-pos)<10:Math.abs(d.p.y-pos)<10;
    if(lineHit&&!inLaserGap(d,l)&&d.hitCd<=0){d.hitCd=1.05;d.hits=(d.hits||0)+1;d.shield=Math.max(0,3-d.hits);d.perfect=false;if(d.hits>3){finishTrial(false,false);return}break}
  }
};
function drawSegmentedLaser(g,d,l,w,h){
  const pos=laserLinePos(d,l),gap=laserGapPos(d,l),half=l.gapHalf||58;
  g.save();g.strokeStyle='#ff496d';g.lineWidth=7;g.shadowBlur=12;g.shadowColor='rgba(255,73,109,.72)';g.beginPath();
  if(l.axis===0){g.moveTo(pos,0);g.lineTo(pos,Math.max(0,gap-half));g.moveTo(pos,Math.min(h,gap+half));g.lineTo(pos,h)}
  else{g.moveTo(0,pos);g.lineTo(Math.max(0,gap-half),pos);g.moveTo(Math.min(w,gap+half),pos);g.lineTo(w,pos)}
  g.stroke();g.shadowBlur=0;g.strokeStyle='rgba(116,234,255,.85)';g.lineWidth=2;g.beginPath();
  if(l.axis===0){g.moveTo(pos-9,gap-half);g.lineTo(pos+9,gap-half);g.moveTo(pos-9,gap+half);g.lineTo(pos+9,gap+half)}
  else{g.moveTo(gap-half,pos-9);g.lineTo(gap-half,pos+9);g.moveTo(gap+half,pos-9);g.lineTo(gap+half,pos+9)}
  g.stroke();g.restore();
}
renderTrial=function(){
  const d=VSX_TRIAL?.data;if(!d||d.id!=='laser')return LASER_RENDER_BASE();
  const c=VSX_TRIAL.canvas,g=VSX_TRIAL.ctx;if(!g)return;const w=c.width,h=c.height;
  g.clearRect(0,0,w,h);g.fillStyle='#050d18';g.fillRect(0,0,w,h);g.strokeStyle='rgba(78,186,245,.08)';g.lineWidth=1;
  for(let x=0;x<w;x+=43){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke()}for(let y=0;y<h;y+=43){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke()}
  for(const l of d.lasers)drawSegmentedLaser(g,d,l,w,h);
  g.fillStyle='#66d8ff';g.shadowBlur=12;g.shadowColor='#66d8ff';g.beginPath();g.arc(d.p.x,d.p.y,12,0,Math.PI*2);g.fill();g.shadowBlur=0;
  g.fillStyle='#d9f8ff';g.font='bold 16px Arial';g.textAlign='left';g.fillText(`${L('SHIELD','KHIÊN')}: ${d.shield}/3`,48,32);
  const rem=Math.max(0,d.limit-d.time),hud=document.getElementById('vsxTrialHud');if(hud)hud.innerHTML=`<span class="vsxTrialChip">${L('TIME','THỜI GIAN')} ${rem.toFixed(1)}s</span><span class="vsxTrialChip">${t('relicShard')} ${game.relicShards||0}/3</span><span class="vsxTrialChip">${d.grace>0?L('GRACE','CHUẨN BỊ')+' '+d.grace.toFixed(1)+'s':L('MOVING GAPS','KHE DI ĐỘNG')}</span><span class="vsxTrialChip">${L('HITS','ĐÃ TRÚNG')} ${d.hits||0}/3</span>`;
};

/* Collection text follows actual Laser Corridor mechanic. */
if(typeof VOID_TRIAL_DEFINITIONS!=='undefined'&&VOID_TRIAL_DEFINITIONS.laser){
  VOID_TRIAL_DEFINITIONS.laser.desc={
    en:'Cross the moving gaps in the sweeping lasers. Lasers move faster now, but every beam has a visible safe opening. The Trial Shield absorbs three hits; the fourth fails the trial.',
    vi:'Luồn qua các khe an toàn đang di chuyển trên tia quét. Laser nhanh hơn nhưng mỗi tia luôn có một khoảng hở nhìn thấy rõ. Khiên Thử Thách chịu được 3 lần trúng; lần thứ 4 sẽ thất bại.'
  };
}

/* ---------- Archer/bow projectile visual authority ---------- */
const VSX_TRUE_ARROW_WEAPONS=new Set(['trick_arrow_quiver','c10_tracker_bow']);
const VSX_ARROW_SEMANTIC_RE=/\b(?:arrow|arrows|bow|bows|longbow|crossbow|quiver|archer)\b|cung\s*(?:thủ|tên)\b/i;
function arrowProjectile(q){
  if(!q||q.owner==='enemy')return false;
  const w=q.weapon,id=String(w?.id||''),def=w?.def||WEAPON_DEFINITIONS?.[id]||{};
  /* Explicit known bow/quiver weapons always use the arrow silhouette. */
  if(VSX_TRUE_ARROW_WEAPONS.has(id))return true;
  /* Future-proof semantic detection: only whole bow/arrow words in weapon metadata.
     This deliberately does NOT inspect behavior/id substrings, so RAINBOW / NARROW
     can never be mistaken for ARROW again. */
  const weaponMeta=`${def.name||''} ${def.desc||''} ${(def.tags||[]).join(' ')}`;
  if(VSX_ARROW_SEMANTIC_RE.test(weaponMeta))return true;
  /* A survivor explicitly titled/described as an archer may opt its own signature
     projectile into arrow visuals even if the weapon name is generic. */
  const cid=game?.characterId,cd=cid&&CHARACTER_DEFINITIONS?.[cid],cw=String(cd?.weapon||'');
  if(cw&&id===cw){
    const charMeta=`${cd?.name?.en||''} ${cd?.name?.vi||''} ${cd?.desc?.en||''} ${cd?.desc?.vi||''}`;
    if(VSX_ARROW_SEMANTIC_RE.test(charMeta))return true;
  }
  return false;
}
function drawArrowProjectile(g,q){
  const a=Math.atan2(q.vy,q.vx),len=Math.max(20,(q.radius||5)*4.8),col=q.color||'#d8f6df';
  g.save();g.translate(q.x,q.y);g.rotate(a);g.shadowBlur=10;g.shadowColor=col;g.strokeStyle=col;g.fillStyle=col;g.lineCap='round';
  g.lineWidth=Math.max(2,(q.radius||5)*.42);g.beginPath();g.moveTo(-len*.62,0);g.lineTo(len*.38,0);g.stroke();
  g.beginPath();g.moveTo(len*.56,0);g.lineTo(len*.27,-Math.max(4,(q.radius||5)*.85));g.lineTo(len*.31,0);g.lineTo(len*.27,Math.max(4,(q.radius||5)*.85));g.closePath();g.fill();
  g.lineWidth=1.5;g.beginPath();g.moveTo(-len*.55,0);g.lineTo(-len*.72,-5);g.moveTo(-len*.55,0);g.lineTo(-len*.72,5);g.stroke();
  g.restore();
}
const ARROW_RENDER_BASE=Projectile.prototype.render;
Projectile.prototype.render=function(g){if(arrowProjectile(this)){drawArrowProjectile(g,this);return}return ARROW_RENDER_BASE.apply(this,arguments)};
if(WEAPON_DEFINITIONS?.trick_arrow_quiver)WEAPON_DEFINITIONS.trick_arrow_quiver.desc='Cycles Piercing, Explosive, Glue, Shock and Grapple arrows so each automatic shot contributes a different utility profile. Bow/quiver shots use true arrow visuals.';

/* ---------- QA + Admin diagnostics ---------- */
function selfTest(){
  const ld=initTrial('laser'),mob=ALLY_DEFINITIONS?.mobius,arrowDef=WEAPON_DEFINITIONS?.trick_arrow_quiver;
  const hud=document.getElementById('vsxAllyHud'),cards=hud?[...hud.querySelectorAll('.vsxAllyCard')]:[];
  return{
    allyHud:{visible:cards.filter(c=>getComputedStyle(c).display!=='none').length,total:cards.length,scrollbar:getComputedStyle(hud||document.body).overflowY,policy:'top3 hp% desc; newest tie-break'},
    laser:{limit:ld.limit,playerSpeed:ld.speed,laserSpeeds:ld.lasers?.map(x=>x.speed),gaps:ld.lasers?.map(x=>x.gapHalf*2),hasGap:ld.lasers?.every(x=>Number.isFinite(x.gapHalf)&&x.gapHalf>0)},
    mobius:{acquire:mob?.acquire?.en,role:mob?.role?.en,combatThreshold:'300px path / 58px close / 18 samples'},
    arrows:{allowed:['trick_arrow_quiver','c10_tracker_bow'],restored:['wizard_elastico','samba_streetball','x16_rapier_beam'],greenArrowWeapon:arrowDef?.name,greenArrowDetected:arrowProjectile({owner:'player',weapon:{id:'trick_arrow_quiver',def:WEAPON_DEFINITIONS.trick_arrow_quiver}}),trackerBowDetected:arrowProjectile({owner:'player',weapon:{id:'c10_tracker_bow',def:WEAPON_DEFINITIONS.c10_tracker_bow}}),falsePositivesRestored:['wizard_elastico','samba_streetball','x16_rapier_beam'].every(id=>!arrowProjectile({owner:'player',weapon:{id,def:WEAPON_DEFINITIONS[id]}}))},
    runtimeSafety:window.VSX_RUNTIME_SAFETY?{update:VSX_RUNTIME_SAFETY.state.updateErrors,render:VSX_RUNTIME_SAFETY.state.renderErrors,hud:VSX_RUNTIME_SAFETY.state.hudErrors}:null
  };
}
window.VSX_GAMEPLAY_CLARITY_QA={version:'1.1.0',selfTest,arrowProjectile,laserGapPos,trueArrowWeapons:[...VSX_TRUE_ARROW_WEAPONS]};
if(window.VSX_TARGETED_STABILITY_QA)window.VSX_TARGETED_STABILITY_QA.laser=function(){const d=initTrial('laser');return{limit:d.limit,shieldHitsAllowed:3,failOnHit:4,grace:d.grace,playerSpeed:d.speed,lasers:d.lasers.length,movingGaps:d.lasers.map(x=>x.gapHalf*2),laserSpeeds:d.lasers.map(x=>x.speed)}};
function adminCard(){
  if(!window.VSX_ADMIN?.open||!['run','allies'].includes(VSX_ADMIN.tab))return;const grid=document.querySelector('#vsxAdminContent .vsxAdminGrid');if(!grid||document.getElementById('vsxGameplayClarityAdmin'))return;
  const c=document.createElement('div');c.id='vsxGameplayClarityAdmin';c.className='vsxAdminCard';const q=selfTest();
  c.innerHTML=`<h3>${L('GAMEPLAY CLARITY · QA','ĐỘ RÕ GAMEPLAY · QA')}</h3><p>${L('Final authority checks for compact Ally HUD, Laser Corridor gaps, Möbius onboarding and archer projectile shapes.','Kiểm tra authority cuối cho Ally HUD gọn, khe Laser Corridor, hướng dẫn Möbius và hình dạng đạn cung tên.')}</p><div class="vsxPatchBadges"><span>ALLY HUD · TOP 3</span><span>LASER · MOVING GAP</span><span>MÖBIUS · 1 LAP</span><span>ARCHER · SCOPED ARROWS</span></div><pre>${VSX.esc(JSON.stringify(q,null,2))}</pre>`;grid.appendChild(c)
}
window.VSX_ARCH?.register('admin.refresh','gameplay.clarity',adminCard,{priority:40});
queueMicrotask(()=>{try{if(game?.player)renderStoryAllyHud(game);console.info(TAG,'active',selfTest())}catch(err){console.error(TAG,err)}});
})();
