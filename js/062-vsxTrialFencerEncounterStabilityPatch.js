(function(){
'use strict';
const QA_TAG='[VSX STABILITY]';

/* ---------- Void Trials: deterministic fairness + anti-penalty spam ---------- */
if(typeof initTrial==='function'&&typeof updateTrial==='function'&&typeof renderTrial==='function'){
  const TRIAL_INIT_BASE=initTrial,TRIAL_UPDATE_BASE=updateTrial,TRIAL_RENDER_BASE=renderTrial;
  function relayPattern(){
    const flip=Math.random()<.5?-1:1,j=()=>Math.round((Math.random()-.5)*18);
    const pts=[
      {x:270+j(),y:145+j()},{x:470+j(),y:118+j()},{x:655+j(),y:190+j()},
      {x:680+j(),y:350+j()},{x:465+j(),y:375+j()},{x:245+j(),y:315+j()}
    ];
    if(flip<0)for(const p of pts)p.x=860-p.x;
    return pts.map((p,i)=>({x:clamp(p.x,70,790),y:clamp(p.y,70,414),done:false,order:i,wrongCd:0}));
  }
  initTrial=function(id){
    const d=TRIAL_INIT_BASE(id);
    if(id==='relay'){
      d.limit=30;d.speed=270;d.p={x:430,y:242};d.nodes=relayPattern();d.index=0;d.wrongCd=0;d.lastTouch=-1;d.perfect=true;
    }else if(id==='laser'){
      d.limit=16.5;d.speed=275;d.p={x:430,y:242};d.shield=3;d.hits=0;d.hitCd=0;d.grace=1.4;d.perfect=true;
      d.lasers=[{axis:0,phase:0,speed:.30},{axis:1,phase:1.35,speed:.28},{axis:0,phase:2.7,speed:.36}];
    }
    return d;
  };
  function laserPos(d,l){return l.axis===0?((d.time*l.speed*170+l.phase*100)%900-20):((d.time*l.speed*125+l.phase*80)%520-18)}
  updateTrial=function(dt){
    const d=VSX_TRIAL?.data,id=d?.id;
    if(!d||!['relay','laser'].includes(id))return TRIAL_UPDATE_BASE(dt);
    dt=Math.min(.05,Math.max(0,dt||0));d.time+=dt;
    if(d.time>=d.limit){if(id==='laser')finishTrial(true,d.hits===0);else finishTrial(false,false);return}
    trialMove(dt,d);
    if(id==='relay'){
      d.wrongCd=Math.max(0,(d.wrongCd||0)-dt);
      const expected=d.nodes[d.index];
      if(expected&&Math.hypot(d.p.x-expected.x,d.p.y-expected.y)<31){
        expected.done=true;d.lastTouch=d.index;d.index++;
        if(d.index>=d.nodes.length){finishTrial(true,d.perfect&&d.time<18);return}
      }else if(d.wrongCd<=0){
        for(let i=0;i<d.nodes.length;i++){
          const q=d.nodes[i];if(q.done||i===d.index)continue;
          if(Math.hypot(d.p.x-q.x,d.p.y-q.y)<24){d.wrongCd=.9;d.time=Math.min(d.limit-.15,d.time+.60);d.perfect=false;d.lastTouch=i;break}
        }
      }
      return;
    }
    d.hitCd=Math.max(0,(d.hitCd||0)-dt);d.grace=Math.max(0,(d.grace||0)-dt);
    if(d.grace<=0){
      for(const l of d.lasers){
        const pos=laserPos(d,l),hit=l.axis===0?Math.abs(d.p.x-pos)<10:Math.abs(d.p.y-pos)<10;
        if(hit&&d.hitCd<=0){
          d.hitCd=1.15;d.hits=(d.hits||0)+1;d.shield=Math.max(0,3-d.hits);d.perfect=false;
          if(d.hits>3){finishTrial(false,false);return}
          break;
        }
      }
    }
  };
  renderTrial=function(){
    TRIAL_RENDER_BASE();const d=VSX_TRIAL?.data;if(!d||!VSX_TRIAL?.active)return;
    const hud=document.getElementById('vsxTrialHud');if(!hud)return;
    if(d.id==='relay'){
      hud.insertAdjacentHTML('beforeend',`<span class="vsxTrialChip">${VSX.lang==='vi'?'MỐC KẾ':'NEXT'} ${Math.min(6,(d.index||0)+1)}/6</span>`);
      const q=d.nodes?.[d.index],g=VSX_TRIAL.ctx;if(q&&g){g.save();g.globalAlpha=.32;g.strokeStyle='#ffd85e';g.lineWidth=2;g.setLineDash([7,7]);g.beginPath();g.moveTo(d.p.x,d.p.y);g.lineTo(q.x,q.y);g.stroke();g.setLineDash([]);g.globalAlpha=.65;g.strokeStyle='#fff0a6';g.lineWidth=2;g.beginPath();g.arc(q.x,q.y,25+Math.sin(d.time*5)*2,0,Math.PI*2);g.stroke();g.restore()}
    }
    if(d.id==='laser')hud.insertAdjacentHTML('beforeend',`<span class="vsxTrialChip">${d.grace>0?(VSX.lang==='vi'?'CHUẨN BỊ':'GRACE')+' '+d.grace.toFixed(1)+'s':(VSX.lang==='vi'?'ĐÃ TRÚNG':'HITS')+' '+(d.hits||0)+'/3'}</span>`);
  };
}

/* ---------- Street Fencer: parry is a near-miss reward, never hard immunity ---------- */
try{
  if(CHARACTER_DEFINITIONS?.x16_street_fencer?.mods)CHARACTER_DEFINITIONS.x16_street_fencer.mods.dodge=Math.min(.02,CHARACTER_DEFINITIONS.x16_street_fencer.mods.dodge||0);
}catch(_){ }
const FENCER_RECALC_BASE=Player.prototype.recalc;
Player.prototype.recalc=function(){
  const r=FENCER_RECALC_BASE.apply(this,arguments);
  if(game?.characterId==='x16_street_fencer'&&!DEBUG_CONFIG.invincible){this.dodge=Math.min(this.dodge,.22);this.hitIFrame=Math.min(this.hitIFrame,.82)}
  return r;
};
const FENCER_DAMAGE_BASE=Player.prototype.takeDamage;
Player.prototype.takeDamage=function(amount,src={}){
  if(game?.characterId!=='x16_street_fencer'||DEBUG_CONFIG.invincible||window.VSX_ADMIN?.invincible)return FENCER_DAMAGE_BASE.apply(this,arguments);
  const st=game?.vsxExpansion16;
  if(st?.parryUntil>(game.time||0))st.parryUntil=0; // real impact cancels the near-miss parry window
  if(this.invuln>1.2){console.warn(QA_TAG,'Street Fencer stale invulnerability clamped',this.invuln);this.invuln=.82}
  const preInv=this.invuln||0,preHp=this.hp,preGuard=!!this.guardianShield,prePickup=this.pickupShield||0,preNet=this.networkShieldTimer||0,preOver=this.overhealShield||0,preBarrier=this.barrierHp||0;
  let restoreDodge=null;
  if((this.vsxFencerNoDamageStreak||0)>=5&&preInv<=0){restoreDodge=this.dodge;this.dodge=0}
  const out=FENCER_DAMAGE_BASE.apply(this,arguments);
  if(restoreDodge!=null)this.dodge=Math.min(restoreDodge,.22);
  const defenseChanged=preGuard!==!!this.guardianShield||prePickup!==(this.pickupShield||0)||preNet!==(this.networkShieldTimer||0)||preOver!==(this.overhealShield||0)||preBarrier!==(this.barrierHp||0);
  if(this.hp>=preHp-.001&&!defenseChanged&&preInv<=0){this.vsxFencerNoDamageStreak=(this.vsxFencerNoDamageStreak||0)+1;if(this.vsxFencerNoDamageStreak===5)console.warn(QA_TAG,'Street Fencer five consecutive unabsorbed no-damage hits; next hit disables dodge for audit safety')}else this.vsxFencerNoDamageStreak=0;
  return out;
};
const FENCER_UPDATE_BASE=Game.prototype.update;
Game.prototype.update=function(dt){
  const r=FENCER_UPDATE_BASE.apply(this,arguments);
  if(this.characterId==='x16_street_fencer'&&this.player&&!DEBUG_CONFIG.invincible&&!window.VSX_ADMIN?.invincible&&this.player.invuln>1.2){console.warn(QA_TAG,'Street Fencer runtime invuln watchdog',this.player.invuln);this.player.invuln=.82}
  return r;
};

/* ---------- Admin test safety: BOSS TEST must not leave hidden invincibility enabled ---------- */
if(typeof adminAction==='function'&&window.VSX_ADMIN){
  const VSX_STABILITY_ADMIN_ACTION_BASE=adminAction;
  adminAction=function(action){
    if(action==='bossTest'){
      const prev={invincible:!!VSX_ADMIN.invincible,noCooldown:!!VSX_ADMIN.noCooldown};
      const out=VSX_STABILITY_ADMIN_ACTION_BASE.apply(this,arguments);
      game.vsxBossTestAutoCheat={prev,boss:game.boss||null,started:game.time||0};
      return out;
    }
    return VSX_STABILITY_ADMIN_ACTION_BASE.apply(this,arguments);
  };
  window.adminAction=adminAction;
  const VSX_BOSS_TEST_UPDATE_BASE=Game.prototype.update;
  Game.prototype.update=function(dt){
    const r=VSX_BOSS_TEST_UPDATE_BASE.apply(this,arguments),q=this.vsxBossTestAutoCheat;
    if(q){
      const testBoss=q.boss;
      const ended=!testBoss||testBoss.dead||this.state==='TITLE'||this.state==='GAME_OVER'||((this.time||0)-q.started>120);
      if(ended){
        // Restore the user's previous cheat state instead of leaving BOSS TEST's automatic flags behind.
        VSX_ADMIN.invincible=q.prev.invincible;VSX_ADMIN.noCooldown=q.prev.noCooldown;this.vsxBossTestAutoCheat=null;
      }
    }
    return r;
  };
}

/* ---------- Encounter HUD: stable flex stack; no measurement-feedback flicker ---------- */
function stableEncounterStack(){
  const hud=document.getElementById('hud');if(!hud)return;
  let stack=document.getElementById('vsxEncounterStack');if(!stack){stack=document.createElement('div');stack.id='vsxEncounterStack';hud.appendChild(stack)}
  const eventHud=document.getElementById('vsxEventHud'),boss=document.getElementById('bossWrap'),mini=document.getElementById('vsxMiniBossHud');
  for(const el of [eventHud,boss,mini]){
    if(!el)continue;if(el.parentNode!==stack)stack.appendChild(el);
    for(const [k,v] of [['position','relative'],['left','auto'],['right','auto'],['top','auto'],['bottom','auto'],['transform','none'],['min-width','0'],['width','100%'],['max-width','100%'],['margin','0']])el.style.setProperty(k,v,'important');
  }
  const visible=[eventHud,boss,mini].some(el=>el&&getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden');stack.style.display=visible?'flex':'none';
}
const ENCOUNTER_HUD_BASE=Game.prototype.updateHUD;
Game.prototype.updateHUD=function(){const r=ENCOUNTER_HUD_BASE.apply(this,arguments);stableEncounterStack();return r};
window.addEventListener('resize',()=>requestAnimationFrame(stableEncounterStack),{passive:true});
queueMicrotask(stableEncounterStack);

window.VSX_TARGETED_STABILITY_QA={
  version:'2026-09-17',
  relay(){const d=initTrial('relay');let dist=0,prev=d.p;for(const q of d.nodes){dist+=Math.hypot(q.x-prev.x,q.y-prev.y);prev=q}return{limit:d.limit,speed:d.speed,pathDistance:Math.round(dist),minimumTravelSeconds:+(dist/d.speed).toFixed(2),marginSeconds:+(d.limit-dist/d.speed).toFixed(2)}} ,
  laser(){const d=initTrial('laser');return{limit:d.limit,shieldHitsAllowed:3,failOnHit:4,grace:d.grace,lasers:d.lasers.length}},
  fencer(){return{dodge:CHARACTER_DEFINITIONS?.x16_street_fencer?.mods?.dodge,maxEffectiveDodge:.22,maxIFrame:.82}},
  hud(){return{stack:!!document.getElementById('vsxEncounterStack'),children:[...document.querySelectorAll('#vsxEncounterStack>#vsxEventHud,#vsxEncounterStack>#bossWrap,#vsxEncounterStack>#vsxMiniBossHud')].map(x=>x.id)}}
};
})();

// Legacy Void Trial render guard: the trial has its own canvas RAF, so avoid redrawing the arena behind it.
const VSX_LEGACY_TRIAL_RENDER_BASE=Game.prototype.render;
Game.prototype.render=function(){
  if(this.state==="MINIGAME" && typeof VSX_TRIAL!=="undefined" && VSX_TRIAL.active)return;
  return VSX_LEGACY_TRIAL_RENDER_BASE.apply(this,arguments);
};
