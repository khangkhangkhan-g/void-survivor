(function(){
"use strict";

const VVD_REVIVE_SECONDS = 60;
const VVD_SLIDE_SPEED = 880;
const VVD_SLIDE_DURATION = 0.52;
const VVD_SLIDE_BASE_COOLDOWN = 3.9;

Object.assign(I18N.en,{
  vvdDown:"VVD4 DOWN",
  vvdReviving:"REVIVE",
  vvdBack:"VVD4 BACK ON THE PITCH",
  vvdSlide:"SLIDE TACKLE"
});
Object.assign(I18N.vi,{
  vvdDown:"VVD4 GỤC",
  vvdReviving:"HỒI SINH",
  vvdBack:"VVD4 TRỞ LẠI SÂN",
  vvdSlide:"XOẠC BÓNG"
});

function vvdFmtRevive(sec){
  sec=Math.max(0,Math.ceil(sec||0));
  return `00:${String(sec).padStart(2,"0")}`;
}
function vvdWeapon(){
  return game?.player?.weapons?.find?.(w=>w.id==="virgil_vandijk")||null;
}
function vvdAlly(){
  return vvdWeapon()?.vvdAlly||null;
}

VanDijkAlly.prototype._ensureCombatState=function(){
  if(!this._vvdCombatReady){
    this._vvdCombatReady=true;
    this.maxHp=Math.max(1,game.player?.maxHp||100);
    this.hp=this.maxHp;
    this.dead=false;
    this.reviveTimer=0;
    this.invuln=0;
    this.lastDamageAt=game.time||0;
    this.slideCd=1.25;
    this.slideTime=0;
    this.slideDir={x:1,y:0};
    this.slideHits=new Set();
    this.contactTimes=new Map();
    this.slideTrail=[];
  }
  const desired=Math.max(1,game.player?.maxHp||this.maxHp||100);
  if(!this.dead && Math.abs(desired-this.maxHp)>.001){
    const ratio=this.maxHp>0?clamp(this.hp/this.maxHp,0,1):1;
    this.maxHp=desired;
    this.hp=clamp(desired*ratio,1,desired);
  }else if(this.dead){
    this.maxHp=desired;
  }
};

VanDijkAlly.prototype.takeDamage=function(amount,info={}){
  this._ensureCombatState();
  if(this.dead||this.invuln>0||!Number.isFinite(amount)||amount<=0)return false;
  amount=Math.max(1,amount);
  this.hp-=amount;
  this.invuln=.42;
  this.lastDamageAt=game.time||0;
  game.texts.push(new FloatingText(this.x,this.y-30,`-${Math.round(amount)}`,"#ff9a9f",12));
  game.spark(this.x,this.y,"#ff7b76",5);
  if(this.hp<=0){
    this.hp=0;
    this.dead=true;
    this.reviveTimer=VVD_REVIVE_SECONDS;
    this.slideTime=0;
    this.slideHits.clear();
    game.texts.push(new FloatingText(this.x,this.y-46,t("vvdDown"),"#ff7078",18));
    VSX.announce(t("vvdDown"),VSX.lang==="vi"?"HỒI SINH SAU 60 GIÂY":"REVIVES IN 60 SECONDS","#ff6870");
    game.audio.beep(92,.22,"sawtooth",.035);
    return true;
  }
  return false;
};

VanDijkAlly.prototype._reviveVvd=function(){
  this.dead=false;
  this.reviveTimer=0;
  this.maxHp=Math.max(1,game.player?.maxHp||this.maxHp||100);
  this.hp=this.maxHp;
  this.invuln=1.5;
  this.x=game.player.x-62;
  this.y=game.player.y+46;
  this.slideCd=1.0;
  this.slideTime=0;
  this.slideHits.clear();
  game.spark(this.x,this.y,"#ffd84d",22);
  game.texts.push(new FloatingText(this.x,this.y-48,t("vvdBack"),"#ffd84d",17));
  VSX.announce("VVD4",VSX.lang==="vi"?"TRỞ LẠI SÂN":"BACK ON THE PITCH","#ffd84d");
  game.audio.beep(420,.12,"square",.025);
};

VanDijkAlly.prototype._startSlide=function(target,stats){
  if(!target||target.dead)return;
  const n=normalize(target.x-this.x,target.y-this.y);
  this.slideDir=n;
  this.slideTime=VVD_SLIDE_DURATION;
  this.slideHits.clear();
  this.slideCd=Math.max(2.25,VVD_SLIDE_BASE_COOLDOWN/Math.max(.55,game.allyAttackSpeedMultiplier()));
  this.attackCool=Math.max(this.attackCool,.45);
  game.texts.push(new FloatingText(this.x,this.y-36,t("vvdSlide"),"#ffd84d",12));
  game.audio.beep(190,.055,"square",.014);
};

VanDijkAlly.prototype._updateSlide=function(dt,stats){
  const prevX=this.x,prevY=this.y;
  const step=VVD_SLIDE_SPEED*dt;
  this.x+=this.slideDir.x*step;
  this.y+=this.slideDir.y*step;
  this.slideTime-=dt;
  this.slideTrail.push({x:prevX,y:prevY,life:.20});
  if(this.slideTrail.length>12)this.slideTrail.shift();
  const nearby=game.grid.queryCircle(this.x,this.y,this.radius+48);
  for(const e of nearby){
    if(!e||e.dead||e.isCaptive||this.slideHits.has(e.id))continue;
    const d=pointSegDist(e.x,e.y,prevX,prevY,this.x,this.y);
    if(d>e.size+this.radius+8)continue;
    this.slideHits.add(e.id);
    const level=this.weapon?.level||1;
    const dmg=stats.damage*(1.75+.16*level)*game.allyDamageMultiplier();
    game.damageEnemy(e,dmg,{
      source:this.weapon,
      canCrit:true,
      knockback:stats.knockback*.72,
      fromX:prevX,fromY:prevY,
      damageType:"physical"
    });
    game.spark(e.x,e.y,"#ffd84d",8);
  }
};

const VVD_UPDATE_BASE = VanDijkAlly.prototype.update;
VanDijkAlly.prototype.update=function(dt,stats){
  this._ensureCombatState();
  this.invuln=Math.max(0,this.invuln-dt);
  for(const q of this.slideTrail)q.life-=dt;
  this.slideTrail=this.slideTrail.filter(q=>q.life>0);

  if(this.dead){
    this.reviveTimer=Math.max(0,this.reviveTimer-dt);
    if(this.reviveTimer<=0)this._reviveVvd();
    return;
  }

  this.slideCd-=dt;
  this.attackCool-=dt;

  // VVD is a real ally: hostile bullets can hit him and are consumed on impact.
  for(const p of game.enemyProjectiles||[]){
    if(!p||p.dead)continue;
    if(Math.hypot(p.x-this.x,p.y-this.y)<=p.radius+this.radius){
      p.dead=true;
      this.takeDamage(Math.max(1,(p.damage||8)*.72),{projectile:true,boss:!!game.boss});
      game.spark(this.x,this.y,"#ffb26d",4);
      if(this.dead)return;
    }
  }

  // Contact damage from normal enemies, elites, mini-bosses and big bosses.
  const touching=game.grid.queryCircle(this.x,this.y,this.radius+58);
  for(const e of touching){
    if(!e||e.dead||e.isCaptive)continue;
    if(Math.hypot(e.x-this.x,e.y-this.y)>this.radius+e.size+2)continue;
    const ready=this.contactTimes.get(e.id)||0;
    if(ready>(game.time||0))continue;
    this.contactTimes.set(e.id,(game.time||0)+.72);
    const bossLike=!!(e.isBoss||e.isMiniBoss||e.bigBoss);
    this.takeDamage(Math.max(1,(e.damage||8)*(bossLike ? .38 : .30)),{enemy:e,boss:bossLike});
    if(this.dead)return;
  }

  if(this.slideTime>0){
    this._updateSlide(dt,stats);
    return;
  }

  const target=game.findNearest(this.x,this.y,720);
  if(target&&this.slideCd<=0&&Math.hypot(target.x-this.x,target.y-this.y)>=95){
    this._startSlide(target,stats);
    this._updateSlide(dt,stats);
    return;
  }

  // Preserve original escort/melee behaviour between slide tackles.
  const p=game.player;
  let tx=p.x-70,ty=p.y+55;
  if(target){
    const dx=target.x-this.x,dy=target.y-this.y,d=Math.hypot(dx,dy)||1;
    if(d<360){tx=target.x-dx/d*70;ty=target.y-dy/d*70}
    if(d<target.size+this.radius+18&&this.attackCool<=0){
      this.attackCool=.55/game.allyAttackSpeedMultiplier();
      game.damageEnemy(target,stats.damage*game.allyDamageMultiplier(),{
        source:this.weapon,canCrit:true,knockback:stats.knockback,
        fromX:this.x,fromY:this.y
      });
      game.spark(target.x,target.y,"#ffd84d",4);
    }
  }
  const dx=tx-this.x,dy=ty-this.y,d=Math.hypot(dx,dy)||1,sp=d>160?310:220;
  this.x+=dx/d*Math.min(sp*dt,d);
  this.y+=dy/d*Math.min(sp*dt,d);
};

const VVD_RENDER_BASE = VanDijkAlly.prototype.render;
VanDijkAlly.prototype.render=function(g){
  this._ensureCombatState();
  if(this.dead){
    // Downed marker stays subtle on battlefield while the HUD owns the countdown.
    g.save();
    g.translate(this.x,this.y);
    g.globalAlpha=.28;
    g.fillStyle="#5d3a40";
    g.beginPath();g.arc(0,0,this.radius,0,Math.PI*2);g.fill();
    g.fillStyle="#ff9098";
    g.font="900 12px Arial";
    g.textAlign="center";g.textBaseline="middle";
    g.fillText("4",0,1);
    g.restore();
    return;
  }
  for(const q of this.slideTrail){
    g.save();
    g.globalAlpha=clamp(q.life/.20,0,1)*.30;
    g.fillStyle="#ffd84d";
    g.beginPath();g.arc(q.x,q.y,this.radius*.72,0,Math.PI*2);g.fill();
    g.restore();
  }
  VVD_RENDER_BASE.call(this,g);
  // Compact in-world HP bar.
  const w=34,h=4,x=this.x-w/2,y=this.y-this.radius-11;
  g.save();
  g.fillStyle="rgba(32,12,17,.8)";g.fillRect(x,y,w,h);
  g.fillStyle="#ff6f72";g.fillRect(x,y,w*clamp(this.hp/Math.max(1,this.maxHp),0,1),h);
  g.restore();
};

// Weapon + ally coupling: when VVD is down, his weapon is down too.
// Existing walls remain until their normal expiry, but no new wall is created.
WeaponInstance.prototype.updateVanDijk=function(dt){
  const s=this.getStats();
  this.vvdAlly ||= new VanDijkAlly(this);
  this.vvdAlly.update(dt,s);
  if(this.vvdAlly.dead)return;
  if(this.cool<=0){
    const active=game.defensiveWalls.filter(w=>w.weapon===this&&!w.dead).length;
    if(active<s.maxActive+(this.special==="fortress"?1:0)){
      const target=game.findNearest(game.player.x,game.player.y,720),
            dir=target?Math.atan2(target.y-game.player.y,target.x-game.player.x):Math.random()*Math.PI*2,
            dist=95,
            x=game.player.x+Math.cos(dir)*dist,
            y=game.player.y+Math.sin(dir)*dist;
      game.defensiveWalls.push(new BrickWall(x,y,dir+Math.PI/2,this,s));
      game.texts.push(new FloatingText(x,y-28,"BRICK WALL","#ffbc78",12));
      game.audio.beep(150,.055,"square",.015);
    }
    this.cool=Math.max(.8,s.cooldown);
  }
};

// Keep ally counters and ally-dependent passives honest while VVD is down.
const VVD_COUNT_ACTIVE_BASE=Game.prototype.countActiveAllies;
Game.prototype.countActiveAllies=function(){
  let n=VVD_COUNT_ACTIVE_BASE.call(this);
  for(const w of this.player?.weapons||[]){
    if(w.id==="virgil_vandijk"&&w.vvdAlly?.dead)n--;
  }
  return Math.max(0,n);
};
const VVD_COUNT_NEAR_BASE=Game.prototype.countNearbyAllies;
Game.prototype.countNearbyAllies=function(range=220){
  let n=VVD_COUNT_NEAR_BASE.call(this,range);
  for(const w of this.player?.weapons||[]){
    const a=w.id==="virgil_vandijk"?w.vvdAlly:null;
    if(a?.dead&&Math.hypot(a.x-this.player.x,a.y-this.player.y)<=range)n--;
  }
  return Math.max(0,n);
};
const VVD_HEAL_ALLIES_BASE=Game.prototype.healAllies;
Game.prototype.healAllies=function(v){
  VVD_HEAL_ALLIES_BASE.call(this,v);
  const a=vvdAlly();
  if(a&&!a.dead&&v>0)a.hp=Math.min(a.maxHp,a.hp+v);
};

// Big-boss radial attacks can hit VVD as a true ally.
if(typeof bbAreaDamage==="function"){
  const VVD_BB_AREA_BASE=bbAreaDamage;
  bbAreaDamage=function(x,y,r,damage,color="#ff5c75"){
    const out=VVD_BB_AREA_BASE(x,y,r,damage,color);
    const a=vvdAlly();
    if(a&&!a.dead&&Math.hypot(a.x-x,a.y-y)<=r+a.radius){
      a.takeDamage(Math.max(1,damage*.42),{boss:true,area:true});
    }
    return out;
  };
}

// Any helper that asks for living combat allies must exclude a downed VVD.
if(typeof vsxLivingCombatAllies==="function"){
  const VVD_LIVING_BASE=vsxLivingCombatAllies;
  vsxLivingCombatAllies=function(){
    return VVD_LIVING_BASE().filter(a=>a&&!a.dead);
  };
}

// Final Ally Network renderer: real VVD HP while alive; no HP bar while down; revive countdown.
renderStoryAllyHud=function(g){
  const el=document.getElementById("vsxAllyHud");if(!el||!g.player)return;
  const roster=[];
  if(g.mbappeAlly)roster.push({id:"mb9",name:"MB9",hp:g.mbappeAlly.hp,max:g.mbappeAlly.maxHp,dead:g.mbappeAlly.dead,color:"#ffd84d",glyph:"9",role:null,state:null});
  for(const w of g.player.weapons||[]){
    if(w.id!=="virgil_vandijk"||!w.vvdAlly)continue;
    const a=w.vvdAlly;a._ensureCombatState?.();
    roster.push({
      id:"vvd4",name:"VVD4",hp:a.hp,max:a.maxHp,dead:a.dead,color:"#ff6868",glyph:"4",
      role:VSX.lang==="vi"?"Hậu vệ / Vũ khí":"Defender / Weapon",
      state:a.dead?`${t("vvdReviving")} ${vvdFmtRevive(a.reviveTimer)}`:(a.slideTime>0?t("vvdSlide"):t("active"))
    });
  }
  for(const a of g.storyAllies||[])roster.push({id:a.id,name:allyShort(a.id),hp:a.hp,max:a.maxHp,dead:a.dead,color:a.def.color,glyph:a.def.glyph,role:a.def.role?.[VSX.lang]||null,state:null});
  if(g.contractAlly&&!g.contractAlly.leave){
    const a=g.contractAlly;
    roster.push({id:"contract_"+a.id,name:a.def.name[VSX.lang],hp:a.hp,max:a.maxHp,dead:a.dead,color:a.def.color,glyph:(a.id||"A").slice(0,2).toUpperCase(),role:VSX.lang==="vi"?"Hợp Đồng":"Contract",state:a.dead?null:(VSX.lang==="vi"?`ĐẾN ĐỢT ${CONTRACT_LAST_WAVE}`:`UNTIL W${CONTRACT_LAST_WAVE}`)});
  }
  const living=roster.filter(a=>!a.dead),down=roster.filter(a=>a.dead),ordered=living.concat(down);
  const cards=ordered.map(a=>{
    const role=a.role?`<small class="vsxAllyRole">${VSX.esc(a.role)}</small>`:"";
    if(a.dead){
      return `<div class="vsxAllyCard vsxDown"><span class="vsxAllyIcon" style="background:${a.color};color:#07111d">${VSX.esc(a.glyph)}</span><div><div class="vsxAllyName">${VSX.esc(a.name)}${role}</div></div><span class="vsxAllyState">${VSX.esc(a.state||t("down"))}</span></div>`;
    }
    return `<div class="vsxAllyCard"><span class="vsxAllyIcon" style="background:${a.color};color:#07111d">${VSX.esc(a.glyph)}</span><div><div class="vsxAllyName">${VSX.esc(a.name)}${role}</div><div class="vsxAllyBar"><i style="width:${100*clamp(a.hp/Math.max(1,a.max),0,1)}%"></i></div></div><span class="vsxAllyState">${VSX.esc(a.state||t("active"))}</span></div>`;
  }).join("");
  const obj=currentRecruitObjective(g);
  el.innerHTML=`<div class="vsxAllyHead"><b>${t("allyNetwork")}</b><span>${t("squadCount")} ${g.countActiveAllies()}</span></div>${cards||`<div class="vsxAllyState">${VSX.lang==="vi"?"Chưa có tín hiệu đồng minh":"No allied signals yet"}</div>`}${obj?`<div class="vsxRecruitObjective"><b>${t("recruitment")}</b><br>${VSX.esc(obj)}</div>`:""}`;
};

// Keep weapon text refreshed after language changes.
const VVD_LANG_BASE=vsxApplyLanguage;
vsxApplyLanguage=function(){
  const r=VVD_LANG_BASE();
  if(game?.player)renderStoryAllyHud(game);
  return r;
};

})();
